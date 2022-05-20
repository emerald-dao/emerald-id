import styles from "../../styles/Create.module.scss";
import { useFlow } from "../../context/FlowContext";

function Differing({ current, differing }) {
  const { resetBloctoEmeraldID } = useFlow();

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
        <button style={{backgroundColor: '#fd5c63'}} onClick={resetBloctoEmeraldID}>Reset</button>
      </div>
    )
  }
}

export default Differing;