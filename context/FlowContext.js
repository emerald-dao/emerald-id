import { useState, useEffect, createContext } from 'react'
import * as fcl from '@onflow/fcl'
import * as t from '@onflow/types'
import { getDiscordID, serverAuthorization } from '../helpers/serverAuth.js'
import { useContext } from 'react';

export const FlowContext = createContext({});

export const useFlow = () => useContext(FlowContext);

export default function FlowProvider({ children }) {
  const [user, setUser] = useState();
  const [transactionStatus, setTransactionStatus] = useState(-1);
  const [txId, setTxId] = useState();

  const authentication = async () => {
    if (user && user.addr) {
      fcl.unauthenticate()
    } else {
      fcl.authenticate()
    }
  }

  const checkEmeraldIDFromAccount = async () => {
    const response = await fcl.send([
      fcl.script`
            import EmeraldIdentity from 0xEmeraldIdentity
            pub fun main(account: Address): String? {    
                return EmeraldIdentity.getDiscordFromAccount(account: account)
            }
        `,
      fcl.args([
        fcl.arg(user.addr, t.Address)
      ]),
    ])
      .then(fcl.decode)
    console.log(response)
    return response
  }

  const checkEmeraldIDFromDiscord = async (discordId) => {
    const response = await fcl.send([
      fcl.script`
            import EmeraldIdentity from 0xEmeraldIdentity
            pub fun main(discordID: String): Address? {    
                return EmeraldIdentity.getAccountFromDiscord(discordID: discordID)
            }
        `,
      fcl.args([
        fcl.arg(discordId, t.String)
      ]),
    ])
      .then(fcl.decode)
    console.log(response)
    return response
  }

  const createEmeraldIDWithMultiPartSign = async (oauthData, discordID) => {
    try {
      const scriptName = 'initializeEmeraldID';
      const serverSigner = serverAuthorization(scriptName, user, oauthData);

      const transactionId = await fcl.send([
        fcl.transaction`
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
        `,
        fcl.args([
          fcl.arg(user.addr, t.Address),
          fcl.arg(discordID, t.String)
        ]),
        fcl.proposer(fcl.authz),
        fcl.payer(fcl.authz),
        fcl.authorizations([serverSigner]),
        fcl.limit(100)
      ]).then(fcl.decode);
      console.log({ transactionId });
      setTxId(transactionId);

      fcl.tx(transactionId).subscribe((res) => { return setTransactionStatus(res.status); })
      return fcl.tx(transactionId).onceSealed();
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  const resetEmeraldIDWithMultiPartSign = async () => {
    try {
      const scriptName = `resetEmeraldIDByAccount`;
      const serverSigner = serverAuthorization(scriptName, user)

      const transactionId = await fcl.send([
        fcl.transaction`
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
        `,
        fcl.args([
          fcl.arg(user.addr, t.Address)
        ]),
        fcl.proposer(fcl.authz),
        fcl.payer(fcl.authz),
        fcl.authorizations([serverSigner]),
        fcl.limit(100)
      ]).then(fcl.decode);
      console.log({ transactionId });
      setTxId(transactionId);

      fcl.tx(transactionId).subscribe((res) => { return setTransactionStatus(res.status); })
      return fcl.tx(transactionId).onceSealed();
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  useEffect(() => {
    // fcl
    fcl.currentUser.subscribe(setUser)
  }, [])

  const value = {
    user,
    txId,
    transactionStatus,
    setUser,
    authentication,
    checkEmeraldIDFromAccount,
    checkEmeraldIDFromDiscord,
    createEmeraldIDWithMultiPartSign,
    resetEmeraldIDWithMultiPartSign
  }

  return <FlowContext.Provider value={value}>{children}</FlowContext.Provider>
}