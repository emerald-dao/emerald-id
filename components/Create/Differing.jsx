import styles from "../../styles/Create.module.scss";
import { useFlow } from "../../context/FlowContext";
import { useTransaction } from "../../context/TransactionContext";

function Differing({ current, differing }) {
  const { resetEmeraldID } = useFlow();
  const { transactionInProgress } = useTransaction();

  if (current === 'discord') {
    return (
      <div className={styles.differing}>
        <h2>Oops!</h2>
        <p>Your Discord account is currently mapped to an account with address {differing}.</p>
        <p>To fix this issue, please reset your EmeraldID from your {differing} account.</p>
      </div>
    )
  } else {
    return (
      <div className={styles.differing}>
        <h2>Oops!</h2>
        <p>Your Blocto account is currently mapped to a different Discord account.</p>
        <p>To fix this issue, please reset your EmeraldID below, and try again after.</p>
        {transactionInProgress
          ? <button style={{ backgroundColor: '#fd5c63', opacity: .3 }}>Resetting...</button>
          : <button style={{ backgroundColor: '#fd5c63' }} onClick={resetEmeraldID}>Reset</button>
        }
      </div>
    )
  }
}

export default Differing;