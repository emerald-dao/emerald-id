import Create from "../components/Create/Create";
import Differing from "../components/Create/Differing";
import Owned from "../components/Create/Owned";
import NotLoggedIn from "../components/Create/NotLoggedIn";
import { useDiscord } from "../context/DiscordContext";
import { useFlow } from "../context/FlowContext";
import styles from "../styles/Wallet.module.scss";

function Lilico() {
  const { createMessage } = useFlow();
  const { discordId } = useDiscord();
  return (
    <>
      <div className={styles.wallet}>
        <h1><span className="emerald-id-color">EmeraldID</span> <span className="white-color">{'<>'}</span> <span className="lilico-color">Lilico</span></h1>
        <p>Begin verifying all of your Lilico assets.</p>
      </div>
      <div className={styles.section}>
        {!discordId
          ? <NotLoggedIn which={'discord'} />
          : createMessage === 'CREATED'
            ? <Owned />
            : createMessage === 'NONE'
              ? <Create borderColor={'#fc814a'} buttonColor={'linear-gradient(-60deg, #ff5858 0%, #f09819 100%)'} />
              : createMessage.substring(0, 2) === '0x'
                ? <Differing current={'discord'} differing={createMessage} />
                : createMessage
                  ? <Differing current={'account'} differing={createMessage} />
                  : <NotLoggedIn which={'account'} />
        }
      </div>
    </>
  )
}

export default Lilico;