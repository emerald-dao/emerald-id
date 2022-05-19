import styles from "../../styles/Footer.module.scss";
function Logo() {
  return (
    <div className="flex">
      <img id={styles.logo} src="/favicon.ico" alt="emerald academy logo" />
      <span>EmeraldID</span>
    </div>
  )
}

export default Logo;