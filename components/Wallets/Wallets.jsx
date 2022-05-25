import styles from "../../styles/Wallets.module.scss";
import Image from "next/image";
import Supported from "./Supported";

function Wallets() {
  return (
    <div className={styles.wallets}>
      <h2>Supported Wallets</h2>
      <div className='line'></div>
      <div className={styles.list}>
        <Supported
          imgSrc={"/img/blocto-logo.jpg"}
          wallet={'Blocto'}
          description={'Unleashing the full potential of blockchain technology has never been easier. Manage your crypto, dApps, and NFT all-in-once through Blocto, the cross-chain crypto wallet.'}
          color={'linear-gradient(135deg,#72e9f3 -20%,#404de6 120%)'}
          released={true}
        />
        <Supported
          imgSrc={"/img/lilico-logo.jpg"}
          wallet={'Lilico'}
          description={'The first wallet extension on Flow.'}
          color={'linear-gradient(-60deg, #ff5858 0%, #f09819 100%)'}
          released={true}
        />
        <Supported
          imgSrc={"/img/dapper-logo.png"}
          wallet={'Dapper'}
          description={'The trusted gateway to your digital world.'}
          color={'linear-gradient(to top, #c471f5 0%, #fa71cd 100%)'}
          released={true}
        />
      </div>
    </div>
  )
}

export default Wallets;