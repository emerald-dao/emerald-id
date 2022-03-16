import { decrypt } from '../../../helpers/encryption.js';

export default function handler (req, res) {
  const { discordID } = req.query;
  try {
    //   let decryptedDiscordID = decrypt(discordID);
      res.json({
          discordID: discordID // decryptedDiscordID
      })
  } catch(e) {
      res.status(500).json({
          message: 'Cannot decode the discordID. Please try the process again.',
      })
  }
};