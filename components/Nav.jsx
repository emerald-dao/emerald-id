import styles from "../styles/Nav.module.scss";

function Nav() {
  return (
    <nav className={styles.nav}>
      <div className="flex">
        <img src="/img/emerald_logo.png" alt="EmeraldID Logo" />
        <h1>EmeraldID</h1>
      </div>
      <button className={styles.login}>Log in</button>
    </nav>
  )
}

export default Nav;