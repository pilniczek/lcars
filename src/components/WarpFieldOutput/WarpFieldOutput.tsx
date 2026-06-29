import WarpFieldReadout from '../WarpFieldReadout'
import WarpFieldCenterAxis from '../WarpFieldCenterAxis'
import styles from './WarpFieldOutput.module.css'

export default function WarpFieldOutput() {
  return (
    <div className={styles.warpFieldOutputContainer}>
      <WarpFieldReadout className={styles.o1} placement="left" />
      <WarpFieldReadout className={styles.o2} placement="left" />
      <WarpFieldCenterAxis className={styles.c} />
      <WarpFieldReadout className={styles.o3} placement="right" />
      <WarpFieldReadout className={styles.o4} placement="right" />
    </div>
  )
}
