import styles from "../../styles/MyWallets.module.scss";
import Supported from "./Supported";

function Wallets() {
  return (
    <div className={styles.wallets} id="wallets">
      <div className={styles.list}>
        <Supported
          imgSrc={"/img/blocto-logo.jpg"}
          wallet={'Blocto'}
          description={'Unleashing the full potential of blockchain technology has never been easier. Manage your crypto, dApps, and NFT all-in-once through Blocto, the cross-chain crypto wallet.'}
          color={'#365bea'}
          buttonColor={"linear-gradient(135deg,#72e9f3 -20%,#404de6 120%)"}
        />
        <Supported
          imgSrc={"/img/dapper-logo.png"}
          wallet={'Dapper'}
          description={'The trusted gateway to your digital world.'}
          color={'#762fbe'}
          buttonColor={'linear-gradient(to top, #c471f5 0%, #fa71cd 100%)'}
        />
        <Supported
          imgSrc={"/img/lilico-logo.jpg"}
          wallet={'Lilico'}
          description={'The First Extension Wallet on Flow.'}
          color={'#fc814a'}
          buttonColor={'linear-gradient(-60deg, #ff5858 0%, #f09819 100%)'}
        />
      </div>
    </div>
  )
}

export default Wallets;