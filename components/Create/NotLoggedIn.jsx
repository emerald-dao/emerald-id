import styles from "../../styles/Create.module.scss";

function NotLoggedIn() {
  return (
    <div className={styles.differing}>
      <h2>Please log in</h2>
      <p>Log in at the top of this page before messing with your EmeraldID.</p>
    </div>
  )
}

export default NotLoggedIn;