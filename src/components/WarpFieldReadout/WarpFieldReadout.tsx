import WarpFieldReadoutContent from '../WarpFieldReadoutContent'
import WarpFieldReadoutFrame from '../WarpFieldReadoutFrame'
import styles from './WarpFieldReadout.module.css'

interface Props {
  placement: 'left' | 'right' | undefined
  className?: string
}

export default function WarpFieldReadout({ placement, className }: Props) {
  const isLeft = placement === 'left'

  return (
    <div className={[className, styles.container].filter(Boolean).join(' ')}>
      <div
        className={`${styles.outputBracket} ${isLeft ? styles.bracketTopLeft : styles.bracketTopRight}`}
      />
      <div className={[styles.output, !isLeft && styles.alignRight].filter(Boolean).join(' ')}>
        <WarpFieldReadoutFrame placement={placement} />
        <WarpFieldReadoutContent className={styles.outputReadout} placement={placement} />
      </div>
      <div
        className={`${styles.outputBracket} ${isLeft ? styles.bracketBottomLeft : styles.bracketBottomRight}`}
      />
    </div>
  )
}
