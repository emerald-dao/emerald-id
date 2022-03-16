export default function handler (req, res) {
  // todo: support multi key and defualt key both
  let keyIndex = 1;
  res.json({
      address: "0xfe433270356d985c",
      keyIndex,
  });
};