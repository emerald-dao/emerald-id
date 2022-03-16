import EmeraldID from "../EmeraldID.cdc"

transaction() {
  prepare(signer: AuthAccount) {
    signer.save(<- EmeraldID.createInfo(), to: EmeraldID.InfoStoragePath)
    signer.link<&EmeraldID.Info{EmeraldID.InfoPublic}>(EmeraldID.InfoPublicPath, target: EmeraldID.InfoStoragePath)
  }
}