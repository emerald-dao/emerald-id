import { useState, useEffect, createContext } from 'react'
import * as fcl from '@onflow/fcl'
import * as t from '@onflow/types'
import { serverAuthorization } from '../helpers/serverAuth.js'
import { useContext } from 'react';
import "../flow/config";
import { useRouter } from 'next/router';
import { useDiscord } from './DiscordContext.js';
import { useTransaction } from './TransactionContext.js';
import { scripts, trxScripts } from '../helpers/ecIdScripts.js';

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
    } else if (wallet === 'Dapper') {
      fcl.config()
        .put("discovery.wallet", process.env.NEXT_PUBLIC_DISCOVERY_WALLET_DAPPER)
        .put("discovery.wallet.method", "POP/RPC")
    }
  }

  const authentication = async (walletButton) => {
    configureProperDiscovery(walletButton);
    unauthenticate();
    const user = await fcl.authenticate();
    const selectedWallet = setSelectedWallet(user);
    await checkExists(user.addr);
    if (selectedWallet === 'Blocto') {
      await router.push('/blocto');
    } else if (selectedWallet === 'Lilico') {
      await router.push('/lilico');
    } else if (selectedWallet === 'Dapper') {
      await router.push('/dapper');
    } else {
      unauthenticate();
    }
  }

  function setSelectedWallet(user) {
    const authnService = user.services[0].uid;
    if (authnService.includes('blocto')) {
      localStorage.setItem('selectedWallet', 'Blocto');
      return 'Blocto';
    } else if (authnService.includes('lilico')) {
      localStorage.setItem('selectedWallet', 'Lilico');
      return 'Lilico';
    } else if (authnService.includes('dapper')) {
      localStorage.setItem('selectedWallet', 'Dapper');
      return 'Dapper';
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
    const existsWithDiscord = await checkEmeraldIDDiscord(discordId);
    if (existsWithDiscord === address) {
      setCreateMessage('CREATED');
    } else if (existsWithDiscord) {
      // Returns 0x...
      setCreateMessage(existsWithDiscord);
    } else {
      // The Discord does not exist in a mapping.
      const existsWithAccount = await checkEmeraldIDAccount(address);
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

  const checkEmeraldIDAccount = async (address) => {
    const wallet = localStorage.getItem('selectedWallet');
    const script = scripts['checkEmeraldIDAccount'](wallet);
    try {
      const response = await fcl.send([
        fcl.script(script),
        fcl.args([
          fcl.arg(address, t.Address)
        ]),
      ]).then(fcl.decode);
      return response;
    } catch (e) {
      console.log(e);
    }
  }

  const checkEmeraldIDDiscord = async (discordId) => {
    const wallet = localStorage.getItem('selectedWallet');
    const script = scripts['checkEmeraldIDDiscord'](wallet);
    try {
      const response = await fcl.send([
        fcl.script(script),
        fcl.args([
          fcl.arg(discordId, t.String)
        ]),
      ]).then(fcl.decode);
      return response
    } catch (e) {
      console.log(e);
    }
  }

  const createEmeraldID = async () => {
    const wallet = localStorage.getItem('selectedWallet');
    configureProperDiscovery(wallet);
    const oauthData = JSON.parse(localStorage.getItem('oauthData'));
    try {
      initTransactionState();
      const scriptName = 'createEmeraldID';
      const txCode = trxScripts[scriptName](wallet);
      const serverSigner = serverAuthorization(scriptName, wallet, oauthData);

      const transactionId = await fcl.send([
        fcl.transaction(txCode),
        fcl.args([
          fcl.arg(discordId, t.String)
        ]),
        fcl.proposer(fcl.authz),
        fcl.payer(fcl.authz),
        fcl.authorizations([serverSigner, fcl.authz]),
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

  const resetEmeraldID = async () => {
    const wallet = localStorage.getItem('selectedWallet');
    configureProperDiscovery(wallet);
    try {
      initTransactionState();
      const scriptName = `resetEmeraldID`;
      const txCode = trxScripts[scriptName](wallet);
      const serverSigner = serverAuthorization(scriptName, wallet);

      const transactionId = await fcl.send([
        fcl.transaction(txCode),
        fcl.args([]),
        fcl.proposer(fcl.authz),
        fcl.payer(fcl.authz),
        fcl.authorizations([serverSigner, fcl.authz]),
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

    // Makes sure the user can't navigate between pages directly
    // and link their wrong id
    const pathname = router.pathname;
    const currentWallet = pathname === '/blocto' ? 'Blocto' : pathname === '/lilico' ? 'Lilico' : pathname === '/dapper' ? 'Dapper' : null;
    if (currentWallet !== localStorage.getItem('selectedWallet')) {
      unauthenticate();
    }
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
    createEmeraldID,
    resetEmeraldID,
  }

  return <FlowContext.Provider value={value}>{children}</FlowContext.Provider>
}