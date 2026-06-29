import { useEffect, useRef } from 'react'
import { startAnimation } from '../../utils'
import WarpFieldPointer from '../WarpFieldPointer'
import styles from './WarpFieldReadoutFrame.module.css'

interface Props {
  placement: 'left' | 'right' | undefined
}

export default function WarpFieldReadoutFrame({ placement }: Props) {
  const indicatorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    startAnimation(indicatorRef, 10, 32, 1000, 4000)
  }, [])

  const rootClassName = [styles.outputColumn, placement === 'right' && styles.placeRight]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={rootClassName}>
      <div className={styles.column} />
      <div className={styles.indicator} ref={indicatorRef}>
        <div className={styles.indicatorEnd}></div>
        <div className={styles.indicatorBg}>
          <WarpFieldPointer
            className={styles.indicatorPointer}
            animate={[30, 55]}
            timing={[500, 3000]}
            left={placement !== 'right'}
            right={placement === 'right'}
          />
        </div>
        <div className={styles.indicatorEnd}></div>
      </div>
    </div>
  )
}
