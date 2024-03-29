import Create from "../components/Create/Create";
import Differing from "../components/Create/Differing";
import Owned from "../components/Create/Owned";
import NotLoggedIn from "../components/Create/NotLoggedIn";
import { useDiscord } from "../context/DiscordContext";
import { useFlow } from "../context/FlowContext";
import styles from "../styles/Wallet.module.scss";
import { useEffect } from "react";

function Shadow() {
  const { createMessage, unauthenticate } = useFlow();
  const { discordId } = useDiscord();

  useEffect(() => {
    unauthenticate();
  }, []);

  return (
    <>
      <div className={styles.wallet}>
        <h1><span className="emerald-id-color">EmeraldID</span> <span className="white-color">{'<>'}</span> <span className="shadow-color">Shadow</span></h1>
        <p>Begin verifying all of your Shadow assets.</p>
      </div>
      <div className={styles.section}>
        {!discordId
          ? <NotLoggedIn which={'discord'} />
          : createMessage === 'CREATED'
            ? <Owned />
            : createMessage === 'NONE'
              ? <Create borderColor={'#762fbe'} buttonColor={'linear-gradient(-225deg, #5271C4 0%, #B19FFF 48%, #ECA1FE 100%)'} />
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

export default Shadow;