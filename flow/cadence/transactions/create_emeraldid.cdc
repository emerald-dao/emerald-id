import EmeraldIdentityLilico from 0x39e42c67cc851cfb

transaction(discordID: String) {
    prepare(admin: AuthAccount, user: AuthAccount) {
        let administrator = admin.borrow<&EmeraldIdentityLilico.Administrator>(from: EmeraldIdentityLilico.AdministratorStoragePath)
                                    ?? panic("Could not borrow the administrator")
        administrator.createEmeraldID(account: user.address, discordID: discordID)
    }

    execute {
        log("Created EmeraldID")
    }
}