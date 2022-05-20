import Create from "../components/Create/Create";
import Differing from "../components/Create/Differing";
import Owned from "../components/Create/Owned";
import NotLoggedIn from "../components/Create/NotLoggedIn";
import { useDiscord } from "../context/DiscordContext";
import { useFlow } from "../context/FlowContext";
import styles from "../styles/Wallet.module.scss";

function Wallet() {
  const { createMessage } = useFlow();
  const { discordId } = useDiscord();
  return (
    <>
      <div className={styles.wallet}>
        <h1><span className="emerald-id-color">EmeraldID</span> <span className="white-color">{'<>'}</span> <span className="blocto-color">Blocto</span></h1>
        <p>Begin verifying all of your Blocto assets.</p>
      </div>
      <div className={styles.section}>
        {!discordId
          ? <NotLoggedIn />
          : createMessage === 'CREATED'
            ? <Owned />
            : createMessage === 'NONE'
              ? <Create borderColor={'#365bea'} buttonColor={'linear-gradient(135deg,#72e9f3 -20%,#404de6 120%)'} />
              : createMessage.substring(0, 2) === '0x'
                ? <Differing current={'discord'} differing={createMessage} />
                : createMessage
                  ? <Differing current={'account'} differing={createMessage} />
                  : null
        }
      </div>
    </>
  )
}

export default Wallet;