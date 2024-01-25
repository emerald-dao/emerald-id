import styles from "../../styles/Wallets.module.scss";
import Image from "next/image";
import Supported from "./Supported";

function Wallets() {
  return (
    <div className={styles.wallets} id="wallets">
      <h2>Supported Wallets</h2>
      <div className='line'></div>
      <div className={styles.list}>
        <Supported
          imgSrc={"/img/blocto-logo.jpg"}
          wallet={'Blocto'}
          description={'Unleashing the full potential of blockchain technology has never been easier. Manage your crypto, dApps, and NFT all-in-once through Blocto, the cross-chain crypto wallet.'}
          color={'blocto-color'}
          released={true}
        />
        <Supported
          imgSrc={"/img/dapper-logo.png"}
          wallet={'Dapper'}
          description={'The trusted gateway to your digital world.'}
          color={'dapper-color'}
          released={true}
        />
        <Supported
          imgSrc={"/img/flow-ref-logo.png"}
          wallet={'Flow Ref'}
          description={'The first wallet extension on Flow.'}
          color={'flow-ref-color'}
          released={true}
        />
        <Supported
          imgSrc={"/img/shadow-logo.jpeg"}
          wallet={'Shadow'}
          description={'Your web3 sidekick.'}
          color={'shadow-color'}
          released={true}
        />
      </div>
    </div>
  )
}

export default Wallets;