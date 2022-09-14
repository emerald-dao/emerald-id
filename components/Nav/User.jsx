
import Link from "next/link";
import { useDiscord } from "../../context/DiscordContext";
import styles from "../../styles/Nav.module.scss";

function User() {
  const { discordUsername, logout } = useDiscord();

  if (!discordUsername) {
    return (
      <a className={styles.authentication} href="https://discord.com/api/oauth2/authorize?client_id=955542718124294236&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2F&response_type=code&scope=identify">Log in</a>
    )
  } else {
    return (
      <Link href="/me">
        <a className={`${styles.authentication} ${styles.logout}`}>
          <span>{discordUsername}</span>
        </a>
      </Link>
    )
  }

}

export default User;