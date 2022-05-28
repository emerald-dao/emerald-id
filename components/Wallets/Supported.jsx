import styles from "../../styles/Wallets.module.scss";

function Supported({ imgSrc, wallet, description, color, released }) {
  if (released) {
    return (
      <div className={styles.supported}>
        <img src={imgSrc} />
        <div className={styles.info}>
          <h3 className={color}>{wallet}</h3>
          <p>{description}</p>
        </div>
      </div>
    )
  } else {
    return (
      <div className={styles.supported} style={{opacity: .3}}>
        <img src={imgSrc} />
        <div className={styles.info}>
          <h3 className={color}>{wallet}</h3>
          <p>{description}</p>
          <p>Coming soon...</p>
        </div>
      </div>
    )
  }
}

export default Supported;