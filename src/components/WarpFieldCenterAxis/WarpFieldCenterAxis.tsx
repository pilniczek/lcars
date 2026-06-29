import WarpFieldPointer from '../WarpFieldPointer'
import styles from './WarpFieldCenterAxis.module.css'

interface Props {
  className?: string
}

export default function WarpFieldCenterAxis({ className }: Props) {
  return (
    <div className={[className, styles.container].filter(Boolean).join(' ')}>
      <div className={`${styles.top} ${styles.flange} ${styles.flangeTop}`} />
      <div className={`${styles.middle} ${styles.columnContainer}`}>
        <div className={styles.column} />
        <WarpFieldPointer className={styles.pointer} animate={[65, 80]} timing={[1000, 3000]} blink />
      </div>
      <div className={`${styles.bottom} ${styles.flange} ${styles.flangeBottom}`} />
    </div>
  )
}
