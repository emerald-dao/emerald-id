import 'dotenv/config';
import "../../flow/config.js";

import * as fcl from "@onflow/fcl";
import { decode } from 'rlp';
import { SHA3 } from "sha3";

import { ec } from 'elliptic';
import { trxScripts } from '../../helpers/ecIdScripts';
const ec_p256 = new ec('p256');

const sign = (message) => {
  const key = ec_p256.keyFromPrivate(Buffer.from(process.env.TESTNET_PRIVATE_KEY, "hex"))
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

export default async function handler(req, res) {
  const { sig, signable, scriptName, oauthData } = req.body;

  const scriptCode = trxScripts[scriptName]().replace('0xEmeraldIdentity', '0x356c7027d3b1f757');

  const address = sig[0].addr;

  // Verify user signature //
  const signedMessage = scriptName === 'createEmeraldID' 
    ? Buffer.from(`Create my own EmeraldID`).toString('hex')
    : scriptName === 'resetEmeraldID' 
    ? Buffer.from(`Reset my EmeraldID`).toString('hex')
    : null;
  const isValid = await fcl.AppUtils.verifyUserSignatures(
    signedMessage,
    sig,
    { fclCryptoContract: null }
  );
  if (!isValid) {
    return res.status(500).json({ mesage: 'User data validate failed' });
  }

  // User is now validated //
  const { message } = signable;
  const decoded = decode(Buffer.from(message.slice(64), 'hex'));
  const cadence = decoded[0].toString();

  const userTxArg = JSON.parse(decoded[1][0].toString()).value;

  if (scriptCode.replace(/\s/g, "") !== cadence.replace(/\s/g, "")) {
    return res.status(500).json({ message: 'Script code not supported' })
  } else if (address !== userTxArg) {
    return res.status(500).json({ message: 'Incorrect user argument' })
  }

  // If this is initialization, we need to check the discordID passed in.
  if (scriptName === 'createEmeraldID') {
    // Gets the discord information based on the code
    const userResult = await fetch('https://discord.com/api/users/@me', {
      headers: {
        authorization: `${oauthData.token_type} ${oauthData.access_token}`,
      },
    });
    const info = await userResult.json();
    const discordIDTxArg = JSON.parse(decoded[1][1].toString()).value;
    if (info.id !== discordIDTxArg) {
      return res.status(500).json({ message: 'Incorrect discordID' })
    }
  }

  // when the code match , will sign the transaction
  const signature = sign(message);
  res.json({ signature });
};