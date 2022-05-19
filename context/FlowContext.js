import { useState, useEffect, createContext } from 'react'
import * as fcl from '@onflow/fcl'
import * as t from '@onflow/types'
import { getDiscordID, serverAuthorization } from '../helpers/serverAuth.js'
import { useContext } from 'react';
import { verifyUserSignatures } from '@onflow/fcl';
import "../flow/config";
import { useRouter } from 'next/router';
import { useDiscord } from './DiscordContext.js';

export const FlowContext = createContext({});

export const useFlow = () => useContext(FlowContext);

export default function FlowProvider({ children }) {
  const [user, setUser] = useState();
  const [transactionStatus, setTransactionStatus] = useState(-1);
  const [txId, setTxId] = useState();
  const [createMessage, setCreateMessage] = useState('');
  const router = useRouter();
  const { discordId } = useDiscord();

  const authentication = async () => {
    unauthenticate();
    const user = await fcl.authenticate();
    const message = await checkExists(user.addr, discordId);
    setCreateMessage(message);
    const authnService = user.services[0].uid;
    if (authnService.includes('blocto')) {
      await router.push('/blocto');
    } else if (authnService.includes('lilico')) {
      await router.push('/lilico');
    } else {
      unauthenticate();
    }
  }

  // 1. Check if it exists with the Discord
  //  a) If it does and matches user address, say good.
  //  b) If it does and doesn't match user address, say go to that account.
  //  c) If it doesn't, go to 2.
  // 2. Check if it exists with user address
  //  a) If it does, say go to that Discord account.
  //  b) If it doesn't say create.
  const checkExists = async (address, discordId) => {
    const existsWithDiscord = await checkBloctoEmeraldIDDiscord(discordId);
    if (existsWithDiscord === address) {
      return 'CREATED';
    } else if (existsWithDiscord) {
      // Returns 0x...
      return existsWithDiscord;
    } else {
      // The Discord does not exist in a mapping.
      const existsWithAccount = await checkBloctoEmeraldIDAccount(address);
      if (existsWithAccount) {
        // Returns DiscordId
        return existsWithAccount;
      } else {
        return 'NONE';
      }
    }
  }

  const unauthenticate = () => {
    fcl.unauthenticate();
  }

  const verify = async () => {
    const thing = Buffer.from('Hello there!').toString('hex')
    console.log(thing)
    const sig = await fcl.currentUser.signUserMessage(thing);
    console.log(sig);
    const isValid = await fcl.AppUtils.verifyUserSignatures(
      thing,
      sig,
      { fclCryptoContract: null }
    );
    console.log(isValid)
  }

  const checkBloctoEmeraldIDAccount = async (address) => {
    const response = await fcl.send([
      fcl.script`
      import EmeraldIdentity from 0xEmeraldIdentity
      pub fun main(account: Address): String? {    
          return EmeraldIdentity.getDiscordFromAccount(account: account)
      }
      `,
      fcl.args([
        fcl.arg(address, t.Address)
      ]),
    ]).then(fcl.decode);
    console.log(response);
    return response;
  }

  const checkBloctoEmeraldIDDiscord = async (discordId) => {
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

  useEffect(() => {
    // fcl
    console.log(user);
  }, [user])

  const value = {
    user,
    txId,
    transactionStatus,
    createMessage,
    setUser,
    authentication,
    unauthenticate,
    createEmeraldIDWithMultiPartSign,
    resetEmeraldIDWithMultiPartSign
  }

  return <FlowContext.Provider value={value}>{children}</FlowContext.Provider>
}