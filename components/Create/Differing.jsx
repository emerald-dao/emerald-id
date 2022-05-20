import styles from "../../styles/Create.module.scss";

function Differing({ current, differing }) {
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
        <button style={{backgroundColor: '#fd5c63'}}>Reset</button>
      </div>
    )
  }
}

export default Differing;