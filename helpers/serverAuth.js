import * as fcl from '@onflow/fcl'

// sign transaction with verify the cadence code
const signWithVerify = async (args) => {
  const response = await fetch(
    'https://id.ecdao.org/api/sign',
    // `http://localhost:3000/api/sign`,
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

export const getDiscord = async (code) => {
  try {
    const response = await fetch(
      `https://id.ecdao.org/api/getDiscord/${encodeURIComponent(code)}`,
      // `http://localhost:3000/api/getDiscord/${encodeURIComponent(code)}`,
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

export const serverAuthorization = (scriptName, user, oauthData) => {
  return async (account) => {
    const address = '0xfe433270356d985c';
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
          oauthData
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