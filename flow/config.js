import * as fcl from "@onflow/fcl";

fcl.config()
  .put("app.detail.title", "Emerald ID")
  .put("app.detail.icon", "https://i.imgur.com/DJD0298.png")
  .put("accessNode.api", "https://rest-testnet.onflow.org")
  .put("0xEmeraldIdentity", "0x356c7027d3b1f757") // The account address where the smart contract lives
  .put("flow.network", "testnet")
  // "accessNode.api": "http://localhost:8080",
  // "discovery.wallet": "http://localhost:8701/fcl/authn", // dev wallet
  // "discovery.wallet": "https://flow-wallet-testnet.blocto.app/authn", // https://fcl-discovery.onflow.org/testnet/authn",
