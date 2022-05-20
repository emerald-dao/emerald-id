import styles from "../../styles/Works.module.scss";
import Step from "./Step";

function Works() {
  return (
    <div className={styles.works}>
      <h2>How it Works</h2>
      <div className='line'></div>
      <div className={styles.steps}>
        <Step imgSrc={"/img/discord-logo.png"} title={'Login'} description={'Log in to your Discord account.'} />
        <Step imgSrc={"/svg/verify.svg"} title={'Verify'} description={'Verify owernship of a supported wallet.'} />
        <Step imgSrc={"/svg/link.svg"} title={'Link'} description={'Link the verified wallet to your Discord.'} />
      </div>
    </div>
  )
}

export default Works;