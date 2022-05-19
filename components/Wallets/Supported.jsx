import styles from "../../styles/Wallets.module.scss";
import { useFlow } from "../../context/FlowContext";
import { useRouter } from "next/router";

function Supported({ imgSrc, wallet, description, color }) {
  const router = useRouter();
  const { authentication } = useFlow();
  return (
    <div className={styles.supported}>
      <img src={imgSrc} />
      <div className={styles.info}>
        <h3>{wallet}</h3>
        <p>{description}</p>
        <button style={{backgroundImage: color}} onClick={authentication}>Connect {wallet}</button>
      </div>
    </div>
  )
}

export default Supported;