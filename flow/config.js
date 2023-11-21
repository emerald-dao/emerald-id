import * as fcl from "@onflow/fcl";

fcl.config()
  .put("app.detail.title", "Emerald ID")
  .put("app.detail.icon", "https://i.imgur.com/pJe6bfU.png")
  .put("accessNode.api", process.env.NEXT_PUBLIC_ACCESS_NODE_API)
  .put("0xEmeraldIdentity", process.env.NEXT_PUBLIC_CONTRACT) // The account address where the smart contract lives
  .put("flow.network", process.env.NEXT_PUBLIC_NETWORK)
// "accessNode.api": "http://localhost:8080",
// "discovery.wallet": "http://localhost:8701/fcl/authn", // dev wallet
// "discovery.wallet": "https://flow-wallet-testnet.blocto.app/authn", // https://fcl-discovery.onflow.org/testnet/authn",
