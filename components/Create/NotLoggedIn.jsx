import { useRouter } from "next/router";
import styles from "../../styles/Create.module.scss";
import { useFlow } from "../../context/FlowContext";

function NotLoggedIn({ which }) {
  const router = useRouter();
  const { authentication } = useFlow();

  if (which === 'discord') {
    return (
      <div className={styles.logged}>
        <h2>Please log in</h2>
        <p>Log in at the top of this page before messing with your EmeraldID.</p>
      </div>
    )
  } else {
    return (
      <div className={styles.logged}>
        <h2>Please log in</h2>
        <button style={{color: 'black', marginTop: '20px'}} onClick={() => authentication(router.pathname === '/blocto' ? 'Blocto' : router.pathname === '/lilico' ? 'Lilico' : null)}>Log in</button>
      </div>
    )
  }
}

export default NotLoggedIn;