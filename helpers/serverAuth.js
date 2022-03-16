import * as fcl from '@onflow/fcl'

// sign transaction with verify the cadence code
export const getServerSignature = async (args) => {
  const response = await fetch(
    `http://localhost:3000/api/sign`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(args),
    },
  )

  const result = await response.json()
  console.log({ result })

  return result;
}