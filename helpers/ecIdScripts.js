const fcl = require("@onflow/fcl");
const t = require("@onflow/types");

const initializeEmeraldIDCode = () => {
    return `
    import EmeraldIdentity from 0xEmeraldIdentity

    // Signed by Administrator
    transaction(account: Address, discordID: String) {
        prepare(admin: AuthAccount) {
            let administrator = admin.borrow<&EmeraldIdentity.Administrator>(from: EmeraldIdentity.AdministratorStoragePath)
                                        ?? panic("Could not borrow the administrator")
            administrator.createEmeraldID(account: account, discordID: discordID)
        }

        execute {
            log("Created EmeraldID")
        }
    }
    `;
}

const resetEmeraldIDByDiscordIDCode = () => {
    return `
        import EmeraldIdentity from 0xEmeraldIdentity

        // Signed by Administrator
        transaction(discordID: String) {
            prepare(signer: AuthAccount) {
                let administrator = signer.borrow<&EmeraldIdentity.Administrator>(from: EmeraldIdentity.AdministratorStoragePath)
                                            ?? panic("Could not borrow the administrator")
                administrator.removeByDiscord(discordID: discordID)
            }

            execute {
                log("Removed EmeraldID")
            }
        }
    `;
}

const resetEmeraldIDByAccountCode = () => {
    return `
        import EmeraldIdentity from 0xEmeraldIdentity

        // Signed by Administrator
        transaction(account: Address) {
            prepare(signer: AuthAccount) {
                let administrator = signer.borrow<&EmeraldIdentity.Administrator>(from: EmeraldIdentity.AdministratorStoragePath)
                                            ?? panic("Could not borrow the administrator")
                administrator.removeByAccount(account: account)
            }

            execute {
                log("Removed EmeraldID")
            }
        }
    `;
}

export const trxScripts = {
    initializeEmeraldID: initializeEmeraldIDCode,
    resetEmeraldIDByDiscordID: resetEmeraldIDByDiscordIDCode,
    resetEmeraldIDByAccount: resetEmeraldIDByAccountCode
}