import styles from "../../styles/MyWallets.module.scss";
import { useFlow } from "../../context/FlowContext";
import { useEffect, useState } from "react";
import Link from "next/link";

function Supported({ imgSrc, wallet, color, buttonColor }) {
  const { authentication, checkAnyWallet } = useFlow();
  const [created, setCreated] = useState();

  useEffect(() => {
    checkWallet();
  }, [])

  async function checkWallet() {
    const created = await checkAnyWallet(wallet);
    setCreated(created);
  }

  if (!created) {
    return (
      <div className={styles.supported}>
        <img src={imgSrc} alt="wallet image" />
        <div className={styles.info}>
          <h3 style={{ color: color }}>{wallet}</h3>
          <Link href={`/${wallet.toLowerCase()}`}>
            <a style={{ backgroundImage: buttonColor }}>Create ID</a>
          </Link>
        </div>
      </div>
    )
  } else {
    return (
      <div className={styles.supported}>
        <img src={imgSrc} alt="wallet image" />
        <div className={styles.info}>
          <div className={styles.header}>
            <h3 style={{ color: '#37dabc' }}>{wallet}</h3>
            <img src="/img/checkmark.png" alt="check mark" />
          </div>
          <p>Your ID: {created}</p>
          <Link href={`/${wallet.toLowerCase()}`}>
            <a style={{ background: 'transparent', border: `1px solid #37dabc` }}>Manage</a>
          </Link>
        </div>
      </div>
    )
  }
}

export default Supported;