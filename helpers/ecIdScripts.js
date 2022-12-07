const fcl = require("@onflow/fcl");
const t = require("@onflow/types");

const auditedDapperCode = `import EmeraldIdentityDapper from 0x39e42c67cc851cfb

transaction(discordID: String) {
    prepare(admin: AuthAccount, user: AuthAccount) {
        let administrator = admin.borrow<&EmeraldIdentityDapper.Administrator>(from: EmeraldIdentityDapper.AdministratorStoragePath)
                                    ?? panic("Could not borrow the administrator")
        administrator.createEmeraldID(account: user.address, discordID: discordID)
    }

    execute {
        log("Created EmeraldID")
    }
}`

const createEmeraldIDTxCode = "import EmeraldIdentity from 0x39e42c67cc851cfb\n\ntransaction(discordID: String) {\n    prepare(admin: AuthAccount, user: AuthAccount) {\n        let administrator = admin.borrow<&EmeraldIdentity.Administrator>(from: EmeraldIdentity.AdministratorStoragePath)\n                                    ?? panic(\"Could not borrow the administrator\")\n        administrator.createEmeraldID(account: user.address, discordID: discordID)\n    }\n\n    execute {\n        log(\"Created EmeraldID\")\n    }\n}";

const createEmeraldID = (wallet) => {
    if (wallet === 'Dapper') {
        return auditedDapperCode;
    }
    const contractName = wallet === 'Blocto' ? 'EmeraldIdentity' : wallet === 'Lilico' ? 'EmeraldIdentityLilico' : null;
    return createEmeraldIDTxCode.replaceAll("EmeraldIdentity", contractName);
}

const resetEmeraldID = (wallet) => {
    const contractName = wallet === 'Blocto' ? 'EmeraldIdentity' : wallet === 'Lilico' ? 'EmeraldIdentityLilico' : wallet === 'Dapper' ? 'EmeraldIdentityDapper' : null;
    return `import ${contractName} from 0x39e42c67cc851cfb

    // Signed by Administrator
    transaction() {
        prepare(signer: AuthAccount, user: AuthAccount) {
            let administrator = signer.borrow<&${contractName}.Administrator>(from: ${contractName}.AdministratorStoragePath)
                                        ?? panic("Could not borrow the administrator")
            administrator.removeByAccount(account: user.address)
        }

        execute {
            log("Removed EmeraldID")
        }
    }`;
}

const checkEmeraldIDAccount = (wallet) => {
    const contractName = wallet === 'Blocto' ? 'EmeraldIdentity' : wallet === 'Lilico' ? 'EmeraldIdentityLilico' : wallet === 'Dapper' ? 'EmeraldIdentityDapper' : null;
    return `
        import ${contractName} from 0xEmeraldIdentity
        pub fun main(account: Address): String? {    
            return ${contractName}.getDiscordFromAccount(account: account)
        }
    `
}

const checkEmeraldIDDiscord = (wallet) => {
    const contractName = wallet === 'Blocto' ? 'EmeraldIdentity' : wallet === 'Lilico' ? 'EmeraldIdentityLilico' : wallet === 'Dapper' ? 'EmeraldIdentityDapper' : null;
    return `
        import ${contractName} from 0xEmeraldIdentity
        pub fun main(discordID: String): Address? {    
            return ${contractName}.getAccountFromDiscord(discordID: discordID)
        }
    `
}

export const trxScripts = {
    createEmeraldID,
    resetEmeraldID
}

export const scripts = {
    checkEmeraldIDAccount,
    checkEmeraldIDDiscord
}