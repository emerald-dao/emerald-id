import CitySvg from "./CitySvg";
import Logo from "./Logo";
import styles from "../../styles/Footer.module.scss";

function Footer() {
  return (
    <footer className={styles.footer}>
      <CitySvg />
      <div>
        <div className={`${styles.container} ${styles.gutterY} medium column`}>
          <div className={`${styles.flexContainer}`}>
            <p>2022. All rights reserved.</p>
            <a href="/">
              <Logo />
            </a>
            <p>
              Created by <a href="https://discord.gg/emeraldcity" target="_blank">Emerald City DAO</a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer;