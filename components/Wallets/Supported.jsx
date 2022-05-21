import styles from "../../styles/Wallets.module.scss";
import { useFlow } from "../../context/FlowContext";

function Supported({ imgSrc, wallet, description, color, released }) {
  const { authentication } = useFlow();
  return (
    <div className={styles.supported}>
      <img src={imgSrc} />
      <div className={styles.info}>
        <h3>{wallet}</h3>
        <p>{description}</p>
        {released
          ? <button style={{ backgroundImage: color }} onClick={() => authentication(wallet)}>Connect {wallet}</button>
          : <button style={{ backgroundImage: color, opacity: .3, cursor: 'default' }}>Coming soon...</button>
        }

      </div>
    </div>
  )
}

export default Supported;