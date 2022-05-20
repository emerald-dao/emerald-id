import { useFlow } from "../../context/FlowContext";
import { useTransaction } from "../../context/TransactionContext";
import styles from "../../styles/Create.module.scss";

function Owned() {
  const { resetBloctoEmeraldID } = useFlow();
  const { transactionInProgress } = useTransaction();

  return (
    <div className={styles.owned}>
      <h2>Congratulations!</h2>
      <p>You can leave this page now, you have already created your EmeraldID. If you wish to reset, please click the button below.</p>
      {transactionInProgress
        ? <button style={{ backgroundColor: '#fd5c63', opacity: .3 }}>Resetting...</button>
        :
        <button style={{ backgroundColor: '#fd5c63' }} onClick={resetBloctoEmeraldID}>Reset</button>
      }
    </div>
  )
}

export default Owned;