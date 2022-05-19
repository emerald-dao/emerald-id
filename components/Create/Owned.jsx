import styles from "../../styles/Create.module.scss";

function Owned() {
  return (
    <div className={styles.owned}>
      <h2>Congradulations!</h2>
      <p>You have already created your EmeraldID. If you wish to reset, please click the button below.</p>
      <button style={{backgroundColor: '#fd5c63'}}>Reset</button>
    </div>
  )
}

export default Owned;