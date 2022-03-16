

export function Transaction(props) {


  const Approval = () => {
    return (
      <div className="loadingTx">
        <h1>Initializing (~0%)</h1>
      </div>
    )
  }

  const Pending = () => {
    return (
      <div className="loadingTx">
        <h1>Pending (~10%)</h1>
      </div>
    )
  }

  const Finalized = () => {
    return (
      <div className="loadingTx">
        <h1>Executing (~50%)</h1>
      </div>
    )
  }


  const Executed = () => {
    return (
      <div className="loadingTx">
        <h1>Sealing (~90%)</h1>
      </div>
    )
  }

  const Sealed = () => {
    return (
      <div className="loadingTx">
        <h1>Sealed (~100%)</h1>
      </div>
    )
  }

  const Expired = () => {
    return (
      <div className="loadingTx">
        <h1>Expired</h1>
      </div>
    )
  }

  const Error = () => {
    return (
      <div>
        <h1>Error</h1>
      </div>
    )
  }

  let response;

  if (props.transactionStatus < 0) {
    response = <Approval />
  } else if (props.transactionStatus < 2) {
    response = <Pending />
  } else if (props.transactionStatus === 2) {
    response = <Finalized />
  } else if (props.transactionStatus === 3) {
    response = <Executed />
  } else if (props.transactionStatus === 4) {
    response = <Sealed />
  } else if (props.transactionStatus === 5) {
    response = <Expired />
  }

  return (
    <div>
      {response}
      <div className="sublink"><a className="flowscan" href={`https://flowscan.org/transaction/${props.txId}`} target="_blank">Check on Flowscan</a></div>
    </div>
  )
}