import EmeraldIdentityDapper from "../EmeraldIdentityDapper.cdc"

transaction(discordID: String) {

  let Admin: &EmeraldIdentityDapper.Administrator

  prepare(signer: AuthAccount) {
    self.Admin = signer.borrow<&EmeraldIdentityDapper.Administrator>(from: EmeraldIdentityDapper.AdministratorStoragePath)
                  ?? panic("The signer does not have an EmeraldIdentity Administrator.")
  }

  execute {
    self.Admin.removeByDiscord(discordID: discordID)
  }
}