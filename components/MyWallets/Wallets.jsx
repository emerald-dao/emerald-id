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
          imgSrc={"/img/flow-ref-logo.png"}
          wallet={'Flow Ref'}
          description={'The First Extension Wallet on Flow.'}
          color={'#28e92a'}
          buttonColor={'linear-gradient(120deg, #d4fc79 0%, #96e6a1 100%)'}
        />
        <Supported
          imgSrc={"/img/shadow-logo.jpeg"}
          wallet={'Shadow'}
          description={'Your web3 sidekick.'}
          color={'#600bff'}
          buttonColor={'linear-gradient(-225deg, #5271C4 0%, #B19FFF 48%, #ECA1FE 100%)'}
        />
      </div>
    </div>
  )
}

export default Wallets;