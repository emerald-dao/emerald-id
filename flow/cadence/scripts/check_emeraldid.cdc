import EmeraldID from "../EmeraldID.cdc"

pub fun main(user: Address): UInt64? {
  let info = getAccount(user).getCapability(EmeraldID.InfoPublicPath)
              .borrow<&EmeraldID.Info{EmeraldID.InfoPublic}>()
  return info?.uuid
}