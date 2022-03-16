import { useState, useEffect, createContext } from 'react'
import * as fcl from '@onflow/fcl'
import * as t from '@onflow/types'
import { getDiscordID, serverAuthorization } from '../helpers/serverAuth.js'
import { useContext } from 'react';
import { useRouter } from 'next/router'

export const FlowContext = createContext({});

export const useFlow = () => useContext(FlowContext);

export default function FlowProvider({children}) {
  const router = useRouter()
  const { id } = router.query;
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

  const checkEmeraldID = async () => {
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
    return response
  }

  const createEmeraldIDWithMultiPartSign = async () => {
    try {
      const scriptName = 'initializeEmeraldID';
      const { discordID = '' } = await getDiscordID(id);
      const serverSigner = serverAuthorization(scriptName, user)

      if (!discordID || discordID === '') {
        console.log('cannot failed to get discordID')
        return ''
      }

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
        fcl.payer(serverSigner),
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
      const serverSigner = serverAuthorization(scriptName, user)

      const transactionId = await fcl.send([
        fcl.transaction``,
        fcl.args([
            fcl.arg(user.addr, t.Address)
        ]),
        fcl.proposer(fcl.authz),
        fcl.payer(serverSigner),
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
    checkEmeraldID,
    createEmeraldIDWithMultiPartSign,
    resetEmeraldIDWithMultiPartSign
  }

  return <FlowContext.Provider value={value}>{children}</FlowContext.Provider>
}