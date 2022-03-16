// Welcome to the EmeraldID contract!
//
// This contract is a service that maps a user's on-chain address
// to their DiscordID. 
//
// A user cannot configure their own EmeraldID. It must be done 
// by someone who has access to the Administrator resource.
//
// A user can only ever have 1 address mapped to 1 DiscordID, and
// 1 DiscordID mapped to 1 address. This means you cannot configure
// multiple addresses to your DiscordID, and you cannot configure
// multiple DiscordIDs to your address. 1-1.
import ZayVerifierV2 from "./ZayVerifierV2.cdc"

pub contract EmeraldID {

    //
    // Paths
    //
    pub let InfoStoragePath: StoragePath
    pub let InfoPublicPath: PublicPath
    pub let AdminStoragePath: StoragePath

    //
    // Events
    //
    pub event EmeraldIDCreated(account: Address, discordID: String)
    pub event EmeraldIDRemoved(account: Address, discordID: String)

    access(contract) var admins: {Address: Bool}

    pub resource interface InfoPublic {
        pub fun getField(field: String): AnyStruct?
        pub fun getFields(): {String: AnyStruct}
    }
    
    // You can never transfer this resource.
    // If you do, it will not work until it is given
    // back to its original owner.
    pub resource Info: InfoPublic {
        access(self) var fields: {String: AnyStruct}
        pub var account: Address?

        pub fun changeField(field: String, value: String, acctAddress: Address, message: String, keyIds: [Int], signatures: [String], signatureBlock: UInt64): UFix64? {
            pre {
                EmeraldID.admins[acctAddress] != nil:
                    "The account who signed the message is not an Admin."
                self.account == nil || (self.account == self.owner!.address):
                    "This EmeraldID was maliciously transferred to someone else. It is invalid."
            }

            // Will set the account information the very first time this function is called.
            // (aka the first time this EmeraldID is used)
            if self.account == nil {
                self.account = self.owner!.address
            } 

            // CHANGE_0x000000000_DISCORD_124255212
            let intent = "CHANGE_"
                        .concat(self.account!.toString())
                        .concat("_")
                        .concat(field)
                        .concat("_")
                        .concat(value)
            let identifier = self.uuid
            if let timestamp = ZayVerifierV2.verifySignature(
                acctAddress: acctAddress, 
                message: message, 
                keyIds: keyIds, 
                signatures: signatures, 
                signatureBlock: signatureBlock,
                intent: intent, 
                identifier: identifier.toString()
            ) {
                log("WE MADE IT")
                self.fields[field] = value
                return timestamp
            }
            panic("There was a problem verifying the signatures.")
        }

        pub fun getField(field: String): AnyStruct? {
            pre {
                self.account != nil: "There is nothing to read."
                self.account == self.owner!.address:
                     "This EmeraldID was maliciously transferred to someone else. It is invalid."
            }
            return self.fields[field]
        }

        pub fun getFields(): {String: AnyStruct} {
            pre {
                self.account != nil: "There is nothing to read."
                self.account == self.owner!.address:
                     "This EmeraldID was maliciously transferred to someone else. It is invalid."
            }
            return self.fields
        }

        init() {
            self.fields = {}
            self.account = nil
        }
    }

    pub fun createInfo(): @Info {
        return <- create Info()
    }

    pub resource Admin {
        pub fun addAdmin(admin: Address) {
            EmeraldID.admins[admin] = true
        }

        pub fun removeAdmin(admin: Address) {
            EmeraldID.admins.remove(key: admin)
        }
    }

    init() {
        self.InfoStoragePath = /storage/EmeraldIDInfo0
        self.InfoPublicPath = /public/EmeraldIDInfo0
        self.AdminStoragePath = /storage/EmeraldIDAdmin0

        self.admins = {self.account.address: true}
        self.account.save(<- create Admin(), to: EmeraldID.AdminStoragePath)
    }
}