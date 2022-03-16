const fcl = require("@onflow/fcl");
const t = require("@onflow/types");

const initializeEmeraldIDCode = () => {
    return `
        import EmeraldID from 0xEmeraldID

        transaction() {
            prepare(signer: AuthAccount) {
                signer.save(<- EmeraldID.createInfo(), to: EmeraldID.InfoStoragePath)
                signer.link<&EmeraldID.Info{EmeraldID.InfoPublic}>(EmeraldID.InfoPublicPath, target: EmeraldID.InfoStoragePath)
            }
        }
    `;
}

const changeFieldCode = () => {
    return `
        import EmeraldID from 0xEmeraldID

        transaction(field: String, value: String, acctAddress: Address, message: String, keyIds: [Int], signatures: [String], signatureBlock: UInt64) {

          let Info: &EmeraldID.Info

          prepare(signer: AuthAccount) {
            self.Info = signer.borrow<&EmeraldID.Info>(from: EmeraldID.InfoStoragePath)
                          ?? panic("The signer does not have an EmeraldID.")
          }

          execute {
            self.Info.changeField(
              field: field, 
              value: value, 
              acctAddress: acctAddress, 
              message: message, 
              keyIds: keyIds, 
              signatures: signatures, 
              signatureBlock: signatureBlock
            )
          }
        }
    `
}

const resetEmeraldIDByDiscordIDCode = () => {
    return `
        import EmeraldID from 0xEmeraldID

        // Signed by Administrator
        transaction(discordID: String) {
            prepare(signer: AuthAccount) {
                let administrator = signer.borrow<&EmeraldID.Administrator>(from: EmeraldID.AdministratorStoragePath)
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
        import EmeraldID from 0xEmeraldID

        // Signed by Administrator
        transaction(account: Address) {
            prepare(signer: AuthAccount) {
                let administrator = signer.borrow<&EmeraldID.Administrator>(from: EmeraldID.AdministratorStoragePath)
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
    resetEmeraldIDByAccount: resetEmeraldIDByAccountCode,
    changeField: changeFieldCode
}