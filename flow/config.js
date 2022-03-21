import { config } from "@onflow/fcl";

config({
  "app.detail.title": "Emerald ID",
  "app.detail.icon": "https://i.imgur.com/DJD0298.png",
  "accessNode.api": process.env.NEXT_PUBLIC_ACCESS_NODE_API_TESTNET,
  "discovery.wallet": process.env.NEXT_PUBLIC_DISCOVERY_WALLET_TESTNET,
  "0xEmeraldIdentity": process.env.NEXT_PUBLIC_CONTRACT, // The account address where the smart contract lives
})