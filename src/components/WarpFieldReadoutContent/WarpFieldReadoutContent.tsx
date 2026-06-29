import WarpFieldPointer from '../WarpFieldPointer'
import styles from './WarpFieldReadoutContent.module.css'

interface Props {
  placement: 'left' | 'right' | undefined
  className?: string
}

const TICKS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

export default function WarpFieldReadoutContent({ placement, className }: Props) {
  const rootClassName = [className, styles.readoutContainer, placement === 'right' && styles.placeRight]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={rootClassName}>
      <div className={styles.readoutLabels}>
        {TICKS.map((n) => (
          <div className={styles.readoutLabel} key={n}>
            <span>{n * 10}</span>
          </div>
        ))}
      </div>
      <div className={styles.readoutMeter}>
        <div className={styles.ruleA}></div>
        <div className={styles.ruleB}>
          {TICKS.map((n) => (
            <div className={styles.ruleBGap} key={n} />
          ))}
        </div>
        <div className={styles.ruleA}></div>
        <div className={styles.ruleB}>
          {TICKS.map((n) => (
            <div className={styles.ruleBGap} key={n} />
          ))}
        </div>
        <div className={styles.ruleA}></div>
      </div>
      <WarpFieldPointer className={styles.readoutPointers} animate={[40, 80]} timing={[1000, 4000]} />
    </div>
  )
}
