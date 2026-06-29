import styles from './ForwardScanner.module.css'

function Scanner() {
  return (
    <div className={styles.scanner}>
      <div>
        <div className={styles.selectLeft}>
          <div className={styles.selectBracket}></div>
        </div>
        <div className={styles.selectRight}>
          <div className={styles.selectBracket}></div>
        </div>
      </div>
    </div>
  )
}

export default function ForwardScanner() {
  return (
    <div className={styles.scannerContainer}>
      <Scanner />
      <Scanner />
      <Scanner />
    </div>
  )
}
