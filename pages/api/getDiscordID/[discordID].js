import 'dotenv/config';
var CryptoJS = require("crypto-js");

export default function handler (req, res) {
  const { discordID } = req.query;
  console.log("Hello")
  try {
      let decryptedBytes = CryptoJS.AES.decrypt(decodeURIComponent(discordID), process.env.CRYPTO_KEY);
      var decryptedDiscordID = decryptedBytes.toString(CryptoJS.enc.Utf8);
      res.json({
        discordID: decryptedDiscordID
      })
  } catch(e) {
      res.status(500).json({
          message: 'Cannot decode the discordID. Please try the process again.',
      })
  }
};