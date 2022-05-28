import styles from '../styles/Home.module.scss'
import Nav from '../components/Nav/Nav.jsx';
import Wallets from '../components/Wallets/Wallets.jsx';
import Works from '../components/Works/Works.jsx';
import { useEffect } from 'react';
import { useFlow } from '../context/FlowContext';
import Link from 'next/link';

function Home(props) {
  const { unauthenticate } = useFlow();

  useEffect(() => {
    unauthenticate();
  }, []);

  return (
    <div className={styles.app}>
      <main>
        <h1>Emerald <span style={{ color: '#fff' }}>ID</span></h1>
        <p>Link your <span style={{ color: '#5865F2' }}>Discord</span> to all of your <span style={{ color: '#16ff99' }}>Flow</span> wallets so you only ever have to verify your wallet once.</p>
        <div className={styles.margin10}>
          <Link href="/me">
            <a style={{ color: '#37dabc', borderColor: '#37dabc' }}>View my IDs</a>
          </Link>
          <Link href="/me">
            <a style={{ color: '#fff', borderColor: '#fff' }}>Create an ID</a>
          </Link>
        </div>
      </main>
      <Wallets />
      <Works />
    </div>
  )
}

export default Home;
