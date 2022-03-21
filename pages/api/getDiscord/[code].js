import 'dotenv/config';

export default async function handler(req, res) {
  const { code } = req.query;
  console.log("Hello")
  if (code) {
    try {
      const oauthResult = await fetch('https://discord.com/api/oauth2/token', {
        method: 'POST',
        body: new URLSearchParams({
          client_id: process.env.DISCORD_CLIENT_ID,
          client_secret: process.env.DISCORD_CLIENT_SECRET,
          code,
          grant_type: 'authorization_code',
          redirect_uri: `https://id.ecdao.org/create`,
          scope: 'identify',
        }),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      const oauthData = await oauthResult.json();

      const userResult = await fetch('https://discord.com/api/users/@me', {
        headers: {
          authorization: `${oauthData.token_type} ${oauthData.access_token}`,
        },
      });
      console.log("OAUTHDATA", oauthData);
      let info = await userResult.json();
      res.json({ info, oauthData });
    } catch (error) {
      res.status(500).json({ message: error })
    }
  }
};