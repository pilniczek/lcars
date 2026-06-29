import { useEffect, useRef } from 'react'
import { startAnimation } from '../../utils'
import Pointer from './pointer.svg?react'
import styles from './WarpFieldPointer.module.css'

interface Props {
  animate: [number, number]
  timing: [number, number]
  blink?: boolean
  left?: boolean
  right?: boolean
  className?: string
}

export default function WarpFieldPointer({
  animate,
  timing,
  blink,
  left,
  right,
  className,
}: Props) {
  const pointerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    startAnimation(pointerRef, animate[0], animate[1], timing[0], timing[1])
  }, [])

  const rootClassName = [className, styles.pointerContainer, blink && styles.pointerBlink]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={rootClassName} ref={pointerRef}>
      {left || right ? (
        <>
          {left && (
            <div className={styles.pointerLeft}>
              <Pointer />
            </div>
          )}
          {right && (
            <div className={styles.pointerRight}>
              <Pointer />
            </div>
          )}
        </>
      ) : (
        <>
          <div className={styles.pointerLeft}>
            <Pointer />
          </div>
          <div className={styles.pointerRight}>
            <Pointer />
          </div>
        </>
      )}
    </div>
  )
}
