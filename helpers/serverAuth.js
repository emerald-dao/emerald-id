import * as fcl from '@onflow/fcl'

// sign transaction with verify the cadence code
const signWithVerify = async (args) => {
  const response = await fetch(
    `http://localhost:3000/api/sign`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(args),
    },
  )

  //TODO: add necessary corrections
  const signed = await response.json()
  console.log({ signed })

  return signed
}

export const getDiscordID = async (id) => {
  try {
    const response = await fetch(
      `http://localhost:3000/api/getDiscordID/${id}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      },
    )
    const res = response.json()
    return res
  } catch (error) {
    return ''
  }
}

export const serverAuthorization = (scriptName, user) => {
  return async (account) => {
    const address = '0xf8d6e0586b0a20c7';
    const keyIndex = 0;

    return {
      ...account,
      tempId: `${address}-${keyIndex}`,
      addr: fcl.sansPrefix(address),
      keyId: Number(keyIndex),
      signingFunction: async (signable) => {
        // this signs the message server-side and returns the signature
        const signature = await signWithVerify({
          scriptName,
          signable,
          user,
        })

        return {
          addr: fcl.withPrefix(address),
          keyId: Number(keyIndex),
          signature: signature.signature,
        }
      },
    }
  }
}