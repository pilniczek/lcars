import { useEffect, useMemo, useRef } from 'react'
import { startAnimation } from '../../utils'
import InspectBracketTL from '../InspectBracketTL'
import PlanetView from '../PlanetView'
import styles from './InspectBracket.module.css'

interface Props {
  size?: string
}

const SCALE = ['010', '020', '030', '040', '050', '060', '070', '080', '090']

export default function InspectBracket({ size = '100%' }: Props) {
  // Number of 2D planet images available
  const planet = useMemo(() => Math.floor(Math.random() * 7), [])

  const leftMarker = useRef<HTMLDivElement>(null)
  const rightMarker = useRef<HTMLDivElement>(null)

  useEffect(() => {
    startAnimation(leftMarker, 10, 90, 1000, 2000)
    startAnimation(rightMarker, 10, 90, 1000, 2000)
  }, [])

  return (
    <div className={styles.inspectBracketContainer}>
      <div className={styles.inspectBracket}>
        <div className={styles.inspectBracketLeft}>
          <InspectBracketTL width={size} position="topleft" />
          <div className={styles.inspectBracketLeftBar}>
            <div className={styles.iblbA}>
              <div className={styles.iblbA1} style={{ height: '40%', top: '25%' }} />
              <div className={styles.iblbScale}>
                {SCALE.map((n) => (
                  <div key={n}>{n}</div>
                ))}
              </div>
            </div>
            <div className={styles.iblbB}>
              <div className={styles.iblbB1} style={{ height: '45%', top: '10%' }} />
              <div className={styles.iblbMarker} ref={leftMarker} />
            </div>
          </div>
          <InspectBracketTL width={size} position="bottomleft" />
        </div>
        <div className={styles.inspectBracketContent}>
          <PlanetView planet={planet} />
        </div>
        <div className={styles.inspectBracketRight}>
          <InspectBracketTL width={size} position="topright" />
          <div className={styles.inspectBracketRightBar} dir="rtl">
            <div className={styles.iblbA}>
              <div className={styles.iblbA1} style={{ height: '40%', top: '10%' }} />
              <div className={styles.iblbA2} style={{ height: '25%', top: '15%' }} />
              <div className={styles.iblbScale}>
                {SCALE.map((n) => (
                  <div key={n}>{n}</div>
                ))}
              </div>
            </div>
            <div className={styles.iblbB} style={{ height: '62%' }}>
              <div className={styles.iblbB1} style={{ height: '35%', top: '45%' }} />
              <div className={styles.iblbMarker} ref={rightMarker} />
            </div>
          </div>
          <InspectBracketTL width={size} position="bottomright" />
        </div>
      </div>
    </div>
  )
}
