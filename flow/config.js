import { config } from "@onflow/fcl";

config({
  "app.detail.title": "Emerald ID",
  "app.detail.icon": "https://i.imgur.com/DJD0298.png",
  // "accessNode.api": "http://localhost:8080",
  // "discovery.wallet": "http://localhost:8701/fcl/authn", // dev wallet
  "accessNode.api": "https://rest-testnet.onflow.org",
  "discovery.wallet": "https://fcl-discovery.onflow.org/testnet/authn",
  "0xEmeraldIdentity": "0x356c7027d3b1f757", // The account address where the smart contract lives
  "flow.network": "testnet"
})