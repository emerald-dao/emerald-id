import { trxScripts } from "../../helpers/ecIdScripts.js";
import { decode } from 'rlp';
import 'dotenv/config';

import * as fcl from "@onflow/fcl";
import * as t from "@onflow/types";
import { Signer } from "fcl-kms-authorizer";
import { fromEnv } from "@aws-sdk/credential-providers";

const region = "us-east-1";
const kmsKeyIds = [process.env.KMS_KEY_IDS];

import { SHA3 } from "sha3";

import { ec } from 'elliptic';
var ec_secp256k1 = new ec('secp256k1');

const sign = (message) => {
    const key = ec_secp256k1.keyFromPrivate(Buffer.from(process.env.TESTNET_PRIVATE_KEY, "hex"))
    const sig = key.sign(hash(message)) // hashMsgHex -> hash
    const n = 32
    const r = sig.r.toArrayLike(Buffer, "be", n)
    const s = sig.s.toArrayLike(Buffer, "be", n)
    return Buffer.concat([r, s]).toString("hex")
}

const hash = (message) => {
    const sha = new SHA3(256);
    sha.update(Buffer.from(message, "hex"));
    return sha.digest();
}

const getInfoUUID = async (userAddr) => {
  const response = await fcl.send([
    fcl.script`
    import EmeraldID from 0xEmeraldID

    pub fun main(user: Address): UInt64 {
      let info = getAccount(user).getCapability(EmeraldID.InfoPublicPath)
                  .borrow<&EmeraldID.Info{EmeraldID.InfoPublic}>()
                  ?? panic("This user does not have an EmeraldID")
      return info.uuid
    }
    `,
    fcl.args([
      fcl.arg(userAddr, t.Address)
    ])
  ]).then(fcl.decode);

  console.log({response});
  return response;
}

const getIntentScript = (field, userAddr, value) => {
  return `CHANGE_${userAddr}_${field}_${value}`;
}

const verifyUserDataWithBlocto = async (user) => {
  // Validate the user
  let accountProofObject = user.services.filter((service) => service.type === 'account-proof')[0]
  if (!accountProofObject) {
    return false;
  }

  const AccountProof = accountProofObject.data;
  const Address = AccountProof.address;
  const Timestamp = AccountProof.timestamp;
  const Message = fcl.WalletUtils.encodeMessageForProvableAuthnVerifying(
    Address, // Address of the user authenticating
    Timestamp, // Timestamp associated with the authentication
    'APP-V0.0-user', // Application domain tag
  );
  const isValid = await fcl.verifyUserSignatures(
      Message, 
      AccountProof.signatures
  );
  return isValid;
}

export default async function handler(req, res) {
  const { field, user } = req.body;

  console.log("FIELD: ", field);
  console.log("USER: ", user);

  // validate user data with blocto

  const isValid = await verifyUserDataWithBlocto(user);
  if (!isValid) {
      return res.status(500).json({ mesage: 'User data validate failed' });
  }

  // User is now validated //

  if (field === 'discord') {
    /* Signature Stuff */
    const identifier = await getInfoUUID(user.addr);
    const discordId = "789012";
    const intent = getIntentScript(field, user.addr, discordId);
    const latestBlock = await fcl.latestBlock();
    const prefix = Buffer.from(`${intent}${identifier}`).toString('hex');
    
    const rightPaddedHexBuffer = (value, pad) => {
      return Buffer.from(value.padEnd(pad * 2, 0), 'hex')
    }

    const USER_DOMAIN_TAG = rightPaddedHexBuffer(
      Buffer.from('FLOW-V0.0-user').toString('hex'),
      32
    ).toString('hex');

    const msg = `${prefix}${latestBlock.id}`;

    /* DO KMS LATER
    // Create an instance of the authorizer
    const signer = new Signer(
      // The first argument can be the same as the option for AWS client.
      {
        credentials: fromEnv(), // see. https://github.com/aws/aws-sdk-js-v3/tree/main/packages/credential-providers#fromenv
        region,
      },
      kmsKeyIds
    );

    const keyIndex = 1;

    const sig = signer.sign(msg, keyIndex);
    */
    const sig = sign(USER_DOMAIN_TAG + msg);
    const admin = "0xfe433270356d985c";

    const keyIds = [0];
    const signatures = [sig];

    res.json({ discordId, admin, msg, keyIds, signatures, height: latestBlock.height })
  } else {
    res.status(500).json({ message: 'Script code not supported' })
  }
};