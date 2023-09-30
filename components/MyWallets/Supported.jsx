import styles from "../../styles/MyWallets.module.scss";
import { useFlow } from "../../context/FlowContext";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useDiscord } from "../../context/DiscordContext";
import { transformWalletNameToUrl } from "../../helpers/utils";

function Supported({ imgSrc, wallet, color, buttonColor }) {
  const { checkAnyWallet } = useFlow();
  const { discordId } = useDiscord();
  const [created, setCreated] = useState();

  useEffect(() => {
    console.log(discordId)
    checkWallet();
  }, [discordId])

  async function checkWallet() {
    const created = await checkAnyWallet(discordId, wallet);
    setCreated(created);
  }

  if (!created) {
    return (
      <div className={styles.supported}>
        <img src={imgSrc} alt="wallet image" />
        <div className={styles.info}>
          <h3 style={{ color: color }}>{wallet}</h3>
          <Link href={`/${transformWalletNameToUrl(wallet)}`}>
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
          <Link href={`/${transformWalletNameToUrl(wallet)}`}>
            <a style={{ background: 'transparent', border: `1px solid #37dabc` }}>Manage</a>
          </Link>
        </div>
      </div>
    )
  }
}

export default Supported;