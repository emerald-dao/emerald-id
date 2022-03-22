import 'dotenv/config';
import "../../flow/config.js";

import * as fcl from "@onflow/fcl";
import { decode } from 'rlp';
import { SHA3 } from "sha3";

import { ec } from 'elliptic';
import { trxScripts } from '../../helpers/ecIdScripts';
const sig_algo = new ec('secp256k1');

const sign = (message) => {
  const key = sig_algo.keyFromPrivate(Buffer.from(process.env.MAINNET_PRIVATE_KEY, "hex"))
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
  const { user, signable, scriptName, oauthData } = req.body;

  const scriptCode = trxScripts[scriptName]().replace('0xEmeraldIdentity', '0xfe433270356d985c');

  // validate user data with blocto

  const isValid = await verifyUserDataWithBlocto(user);
  if (!isValid) {
    return res.status(500).json({ mesage: 'User data validate failed' });
  }

  // User is now validated //

  const { message } = signable;
  const decoded = decode(Buffer.from(message.slice(64), 'hex'));
  const cadence = decoded[0][0].toString();
  const userTxArg = JSON.parse(decoded[0][1][0].toString()).value;

  if (scriptCode.replace(/\s/g, "") !== cadence.replace(/\s/g, "")) {
    return res.status(500).json({ message: 'Script code not supported' })
  } else if (user.addr !== userTxArg) {
    return res.status(500).json({ message: 'Incorrect user argument' })
  }

  // If this is initialization, we need to check the discordID passed in.
  if (scriptName === 'initializeEmeraldID') {
    // Gets the discord information based on the code
    const userResult = await fetch('https://discord.com/api/users/@me', {
      headers: {
        authorization: `${oauthData.token_type} ${oauthData.access_token}`,
      },
    });
    const info = await userResult.json();
    const discordIDTxArg = JSON.parse(decoded[0][1][1].toString()).value;
    if (info.id !== discordIDTxArg) {
      return res.status(500).json({ message: 'Incorrect discordID' })
    }
  }

  // when the code match , will sign the transaction
  const signature = sign(message);
  res.json({ signature });
};