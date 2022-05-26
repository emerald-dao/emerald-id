import { useFlow } from "../../context/FlowContext";
import { useTransaction } from "../../context/TransactionContext";
import styles from "../../styles/Create.module.scss";

function Create({ borderColor, buttonColor }) {
  const { createEmeraldID } = useFlow();
  const { transactionInProgress } = useTransaction();

  return (
    <div className={styles.create} style={{ borderColor: borderColor }}>
      <h2>Create your EmeraldID</h2>
      <p>To create your EmeraldID, click the button below.</p>
      {transactionInProgress
        ? <button style={{ backgroundImage: buttonColor, opacity: .3 }}>Creating...</button>
        : <button style={{ backgroundImage: buttonColor }} onClick={createEmeraldID}>Create</button>
      }
    </div>
  )
}

export default Create;