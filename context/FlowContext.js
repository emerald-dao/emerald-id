import { useState, useEffect, createContext } from 'react'
import * as fcl from '@onflow/fcl'
import * as t from '@onflow/types'
import { getScriptByScriptName, getDiscordID, getServerSignature } from '../helpers/serverAuth.js'
import { useContext } from 'react';

export const FlowContext = createContext({});

export const useFlow = () => useContext(FlowContext);

export default function FlowProvider({children}) {
  const [user, setUser] = useState();
  const [id, setID] = useState(1242);
  const [transactionStatus, setTransactionStatus] = useState(-1);
  const [txId, setTxId] = useState("0123abcd");

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
            import EmeraldID from 0xEmeraldID

            pub fun main(user: Address): UInt64? {
              let info = getAccount(user).getCapability(EmeraldID.InfoPublicPath)
                          .borrow<&EmeraldID.Info{EmeraldID.InfoPublic}>()
              return info?.uuid
            }
        `,
        fcl.args([
            fcl.arg(user.addr, t.Address)
        ]),
      ])
      .then(fcl.decode)
    return response
  }

  const checkDiscord = async () => {
    console.log("Hello")
    const response = await fcl.send([
      fcl.script`
          import EmeraldID from 0xEmeraldID

          pub fun main(user: Address): AnyStruct? {
            let info = getAccount(user).getCapability(EmeraldID.InfoPublicPath)
                        .borrow<&EmeraldID.Info{EmeraldID.InfoPublic}>()
                        ?? panic("This user does not have an EmeraldID")
            return info.getField(field: "discord")
          }
      `,
      fcl.args([
          fcl.arg(user.addr, t.Address)
      ]),
    ]).then(fcl.decode)
    console.log({response})
    return response
  }

  const initializeEmeraldID = async () => {
    try {
      const transactionId = await fcl.send([
        fcl.transaction`
        import EmeraldID from 0xEmeraldID

        transaction() {
          prepare(signer: AuthAccount) {
            signer.save(<- EmeraldID.createInfo(), to: EmeraldID.InfoStoragePath)
            signer.link<&EmeraldID.Info{EmeraldID.InfoPublic}>(EmeraldID.InfoPublicPath, target: EmeraldID.InfoStoragePath)
          }
        }
        `,
        fcl.args([]),
        fcl.proposer(fcl.authz),
        fcl.payer(fcl.authz),
        fcl.authorizations([fcl.authz]),
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

  const addDiscordWithMultiPartSign = async () => {
    try {
      const { discordId, admin, msg, keyIds, signatures, height } = await getServerSignature({field: 'discord', user});

      const transactionId = await fcl.send([
        fcl.transaction`
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
        `,
        fcl.args([
            fcl.arg('discord', t.String),
            fcl.arg(discordId, t.String),
            fcl.arg(admin, t.Address),
            fcl.arg(msg, t.String),
            fcl.arg(keyIds, t.Array(t.Int)),
            fcl.arg(signatures, t.Array(t.String)),
            fcl.arg(height, t.UInt64)
        ]),
        fcl.proposer(fcl.authz),
        fcl.payer(fcl.authz),
        fcl.authorizations([fcl.authz]),
        fcl.limit(999)
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
      const scriptName = 'resetEmeraldIDByAccount';
      const { scriptCode = '' } = await getScriptByScriptName(scriptName)
      const serverSigner = serverAuthorization(scriptName, user)

      if (!scriptCode || scriptCode === '') {
        console.log('cannot get auth script code')
        return ''
      }

      const transactionId = await fcl.send([
        fcl.transaction`${scriptCode}`,
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

  useEffect(() => fcl.currentUser.subscribe(setUser), []);

  const value = {
    user,
    txId,
    transactionStatus,
    setUser,
    authentication,
    checkEmeraldID,
    checkDiscord,
    initializeEmeraldID,
    addDiscordWithMultiPartSign,
    resetEmeraldIDWithMultiPartSign
  }

  return <FlowContext.Provider value={value}>{children}</FlowContext.Provider>
}