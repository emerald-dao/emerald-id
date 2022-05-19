import styles from "../../styles/Create.module.scss";

function Create({ borderColor, buttonColor }) {
  return (
    <div className={styles.create} style={{borderColor: borderColor}}>
      <h2>Create your EmeraldID</h2>
      <p>To create your EmeraldID, click the button below.</p>
      <button style={{backgroundImage: buttonColor}}>Create</button>
    </div>
  )
}

export default Create;