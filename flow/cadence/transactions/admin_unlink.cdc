import EmeraldIdentityDapper from "../EmeraldIdentityDapper.cdc"

transaction(discordID: String) {

  let Admin: &EmeraldIdentityDapper.Administrator

  prepare(signer: auth(Storage) &Account) {
    self.Admin = signer.storage.borrow<&EmeraldIdentityDapper.Administrator>(from: EmeraldIdentityDapper.AdministratorStoragePath)
                  ?? panic("The signer does not have an EmeraldIdentity Administrator.")
  }

  execute {
    self.Admin.removeByDiscord(discordID: discordID)
  }
}