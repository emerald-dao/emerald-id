const createEmeraldID = (wallet) => {
  const contractName =
    wallet === "Blocto"
      ? "EmeraldIdentity"
      : wallet === "Flow Ref"
      ? "EmeraldIdentityLilico"
      : wallet === "Dapper"
      ? "EmeraldIdentityDapper"
      : wallet === "Shadow"
      ? "EmeraldIdentityShadow"
      : null;
  return `import ${contractName} from 0x39e42c67cc851cfb

    transaction(discordID: String) {
        prepare(admin: auth(Storage) &Account, user: &Account) {
            let administrator = admin.storage.borrow<&${contractName}.Administrator>(from: ${contractName}.AdministratorStoragePath)
                                        ?? panic("Could not borrow the administrator")
            administrator.createEmeraldID(account: user.address, discordID: discordID)
        }

        execute {
            log("Created EmeraldID")
        }
    }`;
};

const resetEmeraldID = (wallet) => {
  const contractName =
    wallet === "Blocto"
      ? "EmeraldIdentity"
      : wallet === "Flow Ref"
      ? "EmeraldIdentityLilico"
      : wallet === "Dapper"
      ? "EmeraldIdentityDapper"
      : wallet === "Shadow"
      ? "EmeraldIdentityShadow"
      : null;
  return `import ${contractName} from 0x39e42c67cc851cfb

    // Signed by Administrator
    transaction() {
        prepare(signer: auth(Storage) &Account, user: &Account) {
            let administrator = signer.storage.borrow<&${contractName}.Administrator>(from: ${contractName}.AdministratorStoragePath)
                                        ?? panic("Could not borrow the administrator")
            administrator.removeByAccount(account: user.address)
        }

        execute {
            log("Removed EmeraldID")
        }
    }`;
};

const checkEmeraldIDAccount = (wallet) => {
  const contractName =
    wallet === "Blocto"
      ? "EmeraldIdentity"
      : wallet === "Flow Ref"
      ? "EmeraldIdentityLilico"
      : wallet === "Dapper"
      ? "EmeraldIdentityDapper"
      : wallet === "Shadow"
      ? "EmeraldIdentityShadow"
      : null;
  return `
        import ${contractName} from 0xEmeraldIdentity
        access(all) fun main(account: Address): String? {    
            return ${contractName}.getDiscordFromAccount(account: account)
        }
    `;
};

const checkEmeraldIDDiscord = (wallet) => {
  const contractName =
    wallet === "Blocto"
      ? "EmeraldIdentity"
      : wallet === "Flow Ref"
      ? "EmeraldIdentityLilico"
      : wallet === "Dapper"
      ? "EmeraldIdentityDapper"
      : wallet === "Shadow"
      ? "EmeraldIdentityShadow"
      : null;
  return `
        import ${contractName} from 0xEmeraldIdentity
        access(all) fun main(discordID: String): Address? {    
            return ${contractName}.getAccountFromDiscord(discordID: discordID)
        }
    `;
};

export const trxScripts = {
  createEmeraldID,
  resetEmeraldID,
};

export const scripts = {
  checkEmeraldIDAccount,
  checkEmeraldIDDiscord,
};
