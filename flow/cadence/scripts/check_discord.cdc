import EmeraldIdentity from "../EmeraldIdentity.cdc"

pub fun main(user: Address): String? {
  return EmeraldIdentity.getDiscordFromAccount(account: user)
}