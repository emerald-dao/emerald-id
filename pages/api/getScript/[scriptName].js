import { trxScripts } from "../../../helpers/ecIdScripts.js";

export default function handler (req, res) {
  // only support the script with server sign and verify with signWithVerify api
  const { scriptName } = req.query;
  const scriptCode = trxScripts[scriptName]();
  if (scriptName && scriptCode) {
      res.json({
          scriptCode,
      });
  } else {
      res.status(500).json({
          message: 'Cannot get script with script name',
      });
  }
};