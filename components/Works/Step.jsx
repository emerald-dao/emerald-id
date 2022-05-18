import styles from "../../styles/Works.module.scss";
import Image from "next/image";
function Step({ imgSrc, title, description }) {
  return (
    <div className={styles.step}>
      <Image src={imgSrc} width={86} height={86} />
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  )
}

export default Step;