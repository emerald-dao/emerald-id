import Create from "../components/Create/Create";
import Differing from "../components/Create/Differing";
import Owned from "../components/Create/Owned";
import NotLoggedIn from "../components/Create/NotLoggedIn";
import { useDiscord } from "../context/DiscordContext";
import { useFlow } from "../context/FlowContext";
import styles from "../styles/Wallet.module.scss";

function Dapper() {
  const { createMessage } = useFlow();
  const { discordId } = useDiscord();
  return (
    <>
      <div className={styles.wallet}>
        <h1><span className="emerald-id-color">EmeraldID</span> <span className="white-color">{'<>'}</span> <span className="dapper-color">Dapper</span></h1>
        <p>Begin verifying all of your Dapper assets.</p>
      </div>
      <div className={styles.section}>
      </div>
    </>
  )
}

export default Dapper;