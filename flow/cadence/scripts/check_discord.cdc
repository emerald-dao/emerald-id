import EmeraldID from "../EmeraldID.cdc"

pub fun main(user: Address): AnyStruct? {
  let info = getAccount(user).getCapability(EmeraldID.InfoPublicPath)
              .borrow<&EmeraldID.Info{EmeraldID.InfoPublic}>()
              ?? panic("This user does not have an EmeraldID")
  return info.getField(field: "discord")
}