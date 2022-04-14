import { config } from "@onflow/fcl";

config({
  "app.detail.title": "Emerald ID",
  "app.detail.icon": "https://i.imgur.com/DJD0298.png",
  // "accessNode.api": "http://localhost:8080",
  // "discovery.wallet": "http://localhost:8701/fcl/authn", // dev wallet
  "accessNode.api": "https://mainnet.onflow.org",
  "discovery.wallet": "https://fcl-discovery.onflow.org/authn",
  "0xEmeraldIdentity": "0x39e42c67cc851cfb", // The account address where the smart contract lives
})