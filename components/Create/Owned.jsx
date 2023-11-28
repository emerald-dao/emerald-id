import Link from "next/link";
import { useFlow } from "../../context/FlowContext";
import { useTransaction } from "../../context/TransactionContext";
import styles from "../../styles/Create.module.scss";

function Owned() {
  const { resetEmeraldID } = useFlow();
  const { transactionInProgress } = useTransaction();

  return (
    <div className={styles.owned}>
      <h2>Congratulations!</h2>
      <p>You can leave this page now, you have already created your EmeraldID. If you wish to reset, please click the button below.</p>
      {transactionInProgress
        ? <button style={{ backgroundColor: '#fd5c63', opacity: .3 }}>Resetting...</button>
        :
        <div className={styles.ownedButtons}>
          <Link href="/me" legacyBehavior>
            <a style={{ backgroundColor: '#37dabc' }}>View my IDs</a>
          </Link>
          <button style={{ backgroundColor: 'transparent', border: '1px solid #fd5c63', color: '#fd5c63' }} onClick={resetEmeraldID}>Reset</button>
        </div>
      }
    </div>
  )
}

export default Owned;