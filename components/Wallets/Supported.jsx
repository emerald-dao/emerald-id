import styles from "../../styles/Wallets.module.scss";

function Supported({ imgSrc, wallet, description, color }) {
  return (
    <div className={styles.supported}>
      <img src={imgSrc} />
      <div className={styles.info}>
        <h3>{wallet}</h3>
        <p>{description}</p>
        <button style={{backgroundImage: color}}>Connect {wallet}</button>
      </div>
    </div>
  )
}

export default Supported;