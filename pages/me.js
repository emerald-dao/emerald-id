import styles from '../styles/Me.module.scss'
import { useDiscord } from '../context/DiscordContext';
import Wallets from '../components/MyWallets/Wallets';

function Me(props) {
  const { discordUsername, logout } = useDiscord();

  if (discordUsername) {
    return (
      <div className={styles.me}>
        <button onClick={logout} className={styles.logout}>Logout</button>
        <Wallets />
      </div>
    )
  } else {
    return (
      <div className={styles.me}>
        <h1>Please login at the top.</h1>
      </div>
    )
  }
}

export default Me;
