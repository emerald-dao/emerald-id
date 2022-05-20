import { useState, useEffect, createContext } from 'react'
import * as fcl from '@onflow/fcl'
import * as t from '@onflow/types'
import { serverAuthorization } from '../helpers/serverAuth.js'
import { useContext } from 'react';
import "../flow/config";
import { useRouter } from 'next/router';
import { useDiscord } from './DiscordContext.js';
import { useTransaction } from './TransactionContext.js';

export const FlowContext = createContext({});

export const useFlow = () => useContext(FlowContext);

export default function FlowProvider({ children }) {
  const { setTxId, setTransactionStatus, initTransactionState, setTransactionInProgress, transactionInProgress } = useTransaction();
  const [user, setUser] = useState({ loggedIn: false }); 
  const [createMessage, setCreateMessage] = useState('');
  const router = useRouter();
  const { discordId } = useDiscord();

  function configureProperDiscovery(wallet) {
    if (wallet === 'Blocto') {
      fcl.config()
        .put("discovery.wallet", process.env.NEXT_PUBLIC_DISCOVERY_WALLET_BLOCTO)
    } else if (wallet === 'Lilico') {
      fcl.config()
        .put("discovery.wallet", process.env.NEXT_PUBLIC_DISCOVERY_WALLET_LILICO)
    }
  }

  const authentication = async (wallet) => {
    configureProperDiscovery(wallet);
    unauthenticate();
    const user = await fcl.authenticate();
    await checkExists(user.addr);
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
  const checkExists = async (address) => {
    console.log("ADDRESS", address);
    console.log('DISCORDID', discordId);
    const existsWithDiscord = await checkBloctoEmeraldIDDiscord(discordId);
    if (existsWithDiscord === address) {
      setCreateMessage('CREATED');
    } else if (existsWithDiscord) {
      // Returns 0x...
      setCreateMessage(existsWithDiscord);
    } else {
      // The Discord does not exist in a mapping.
      const existsWithAccount = await checkBloctoEmeraldIDAccount(address);
      if (existsWithAccount) {
        // Returns DiscordId
        setCreateMessage(existsWithAccount);
      } else {
        setCreateMessage('NONE');
      }
    }
  }

  const unauthenticate = () => {
    fcl.unauthenticate();
  }

  const checkBloctoEmeraldIDAccount = async (address) => {
    try {
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
      return response;
    } catch (e) {
      console.log(e);
    }
  }

  const checkBloctoEmeraldIDDiscord = async (discordId) => {
    try {
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
      ]).then(fcl.decode);
      return response
    } catch (e) {
      console.log(e);
    }
  }

  const createBloctoEmeraldID = async () => {
    configureProperDiscovery('Blocto');
    const message = Buffer.from(`Create my own EmeraldID`).toString('hex');
    const sig = await fcl.currentUser.signUserMessage(message);
    const oauthData = JSON.parse(localStorage.getItem('oauthData'));
    try {
      initTransactionState();
      const scriptName = 'createEmeraldID';
      const serverSigner = serverAuthorization(scriptName, sig, oauthData);

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
          fcl.arg(discordId, t.String)
        ]),
        fcl.proposer(fcl.authz),
        fcl.payer(fcl.authz),
        fcl.authorizations([serverSigner]),
        fcl.limit(100)
      ]).then(fcl.decode);
      setTxId(transactionId);

      fcl.tx(transactionId).subscribe((res) => {
        setTransactionStatus(res.status);
        if (res.status === 4) {
          setTimeout(() => setTransactionInProgress(false), 2000)
        }
      })
      return fcl.tx(transactionId).onceSealed();
    } catch (e) {
      setTimeout(() => setTransactionInProgress(false), 2000)
      console.log(e);
    }
  }

  const resetBloctoEmeraldID = async () => {
    configureProperDiscovery('Blocto');
    const message = Buffer.from(`Reset my EmeraldID`).toString('hex');
    const sig = await fcl.currentUser.signUserMessage(message);
    try {
      initTransactionState();
      const scriptName = `resetEmeraldID`;
      const serverSigner = serverAuthorization(scriptName, sig);

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
      setTxId(transactionId);

      fcl.tx(transactionId).subscribe((res) => {
        setTransactionStatus(res.status);
        if (res.status === 4) {
          setTimeout(() => setTransactionInProgress(false), 2000);
        }
      })
      return fcl.tx(transactionId).onceSealed();
    } catch (e) {
      setTimeout(() => setTransactionInProgress(false), 2000)
      return false;
    }
  }

  useEffect(() => {
    // fcl
    fcl.currentUser.subscribe(setUser);
  }, [])

  // useEffect(() => {
  //   if (user) {
  //     checkExists(user.addr, discordId);
  //   }
  // }, [transactionInProgress])

  useEffect(() => {
    // fcl
    if (user.loggedIn) {
      checkExists(user.addr);
    }
  }, [user, transactionInProgress])

  const value = {
    user,
    createMessage,
    authentication,
    unauthenticate,
    createBloctoEmeraldID,
    resetBloctoEmeraldID
  }

  return <FlowContext.Provider value={value}>{children}</FlowContext.Provider>
}