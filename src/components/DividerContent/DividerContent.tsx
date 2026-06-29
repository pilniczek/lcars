import styles from './DividerContent.module.css'

export default function DividerContent() {
  return (
    <div className={styles.dividerGrid}>
      <div className={styles.barTop}></div>
      <div className={styles.capTop}></div>
      <div className={styles.barBottom}></div>
      <div className={styles.capBottom}></div>
    </div>
  )
}
