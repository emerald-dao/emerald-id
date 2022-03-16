import 'dotenv/config';

import * as fcl from "@onflow/fcl";
import * as t from "@onflow/types";
import { Signer } from "fcl-kms-authorizer";
import { fromEnv } from "@aws-sdk/credential-providers";

const region = "us-east-1";
const kmsKeyIds = [process.env.KMS_KEY_IDS];

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

    const msg = "123456" // `${prefix}${latestBlock.id}`;

    // Create an instance of the authorizer
    const signer = new Signer(
      // The first argument can be the same as the option for AWS client.
      {
        credentials: fromEnv(), // see. https://github.com/aws/aws-sdk-js-v3/tree/main/packages/credential-providers#fromenv
        region,
      },
      kmsKeyIds
    );

    const sig = await signer.signUserMessage(msg);

    console.log({sig})
    console.log({msg})
    const admin = "0xfe433270356d985c";

    const keyIds = [1];
    const signatures = [sig];

    res.json({ discordId, admin, msg, keyIds, signatures, height: latestBlock.height })
  } else {
    res.status(500).json({ message: 'Script code not supported' })
  }
};