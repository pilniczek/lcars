import { useEffect, useMemo, useRef } from 'react'
import {
  makeRandomNumber,
  pickRandomWithoutReplacement,
  getRandomRange,
  getRandomInt,
  throttle,
} from '../../utils'
import ForwardScanner from '../ForwardScanner'
import InspectBracket from '../InspectBracket'
import StarCoords from '../StarCoords'
import starSystems from './star-systems.json'
import styles from './StarChart.module.css'

const COLLISION_BUFFER = 10

interface Props {
  type: 'nav' | 'planet'
}

interface Metric {
  top: number
  right: number
  bottom: number
  left: number
  collide: boolean
  checked: boolean
}

function drawInterstellarClouds(canvas: HTMLCanvasElement) {
  // Perlin noise implementation and canvas rendering based on
  // https://github.com/josephg/noisejs
  const rect = canvas.getBoundingClientRect()

  canvas.width = rect.width
  canvas.height = rect.height

  const ctx = canvas.getContext('2d')!
  const image = ctx.createImageData(canvas.width, canvas.height)
  const data = image.data

  noise.seed(Math.floor(Math.random() * 65535) + 1)

  for (let x = 0; x < canvas.width; x++) {
    for (let y = 0; y < canvas.height; y++) {
      // controls scale of noise
      // base it on canvas.height so that it still looks right on large screens
      let value = noise.perlin2(x / (canvas.height / 2), y / (canvas.height / 2))
      value *= 256

      const cell = (x + y * canvas.width) * 4
      if (value > 75) {
        data[cell] = 19 // R
        data[cell + 1] = 11 // G
        data[cell + 2] = 129 // B
        data[cell + 3] = 96 // alpha
      } else if (value > 25) {
        data[cell] = 19
        data[cell + 1] = 11
        data[cell + 2] = 129
        data[cell + 3] = 72
      } else if (value > -25) {
        data[cell] = 19
        data[cell + 1] = 11
        data[cell + 2] = 129
        data[cell + 3] = 24
      }
    }
  }

  ctx.putImageData(image, 0, 0)
}

function testCollision(candidate: Metric, check: Metric, buffer = 0) {
  if (
    candidate.top > check.bottom + buffer ||
    candidate.right < check.left - buffer ||
    candidate.bottom < check.top - buffer ||
    candidate.left > check.right + buffer
  ) {
    return false
  }

  return true
}

function checkLabelCollision(labelContainer: HTMLDivElement) {
  const labelEls = labelContainer.querySelectorAll<HTMLElement>(`.${styles.label}`)
  const metrics: Metric[] = []

  // Batch read all dimensions at once
  for (let i = 0; i < labelEls.length; i++) {
    const data = labelEls[i].getBoundingClientRect()
    metrics.push({
      top: data.top,
      right: data.right,
      bottom: data.bottom,
      left: data.left,
      collide: false,
      checked: false,
    })
  }

  // For each label, check collision with all others
  for (let i = 0; i < metrics.length; i++) {
    const label = metrics[i]

    for (let j = 0; j < metrics.length; j++) {
      const toCheck = metrics[j]
      // Don't check self
      if (label === toCheck) continue
      // Don't re-check previously checked items
      if (toCheck.checked === true) continue
      // Don't need to continue checking something that collides
      if (label.collide === true) continue

      // Test for collision and mark it if true
      label.collide = testCollision(label, toCheck, COLLISION_BUFFER)
    }

    // Mark a label as checked so it doesn't need to be rechecked
    label.checked = true
  }

  // Batch hide all collided labels
  for (let i = 0; i < labelEls.length; i++) {
    if (metrics[i].collide === true) {
      labelEls[i].classList.add(styles.collide)
    } else {
      // Remove a previously applied class if element no longer collides
      labelEls[i].classList.remove(styles.collide)
    }
  }
}

export default function StarChart({ type }: Props) {
  const labelsRef = useRef<HTMLDivElement>(null)
  const cloudsRef = useRef<HTMLCanvasElement>(null)

  // Create some values for the render (once per mount)
  const { numbers, backgroundStars, labeledStars } = useMemo(() => {
    const numbers: string[] = []
    for (let i = 0; i < 150; i++) {
      numbers.push(makeRandomNumber(4, true))
    }

    const backgroundStars: { left: number; top: number; size: number }[] = []
    for (let i = 0; i < 100; i++) {
      backgroundStars.push({
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: getRandomInt(1, 10),
      })
    }

    // Copy so we don't deplete the shared imported list across remounts
    const available = [...starSystems]
    const labeledStars: { left: number; top: number; size: number; label: string }[] = []
    const numberStars = getRandomInt(6, 18)
    for (let i = 0; i < numberStars; i++) {
      labeledStars.push({
        left: getRandomRange(2, 80),
        top: getRandomRange(10, 90),
        size: getRandomInt(8, 12),
        label: pickRandomWithoutReplacement(available),
      })
    }

    return { numbers, backgroundStars, labeledStars }
  }, [])

  useEffect(() => {
    if (cloudsRef.current) drawInterstellarClouds(cloudsRef.current)
    if (labelsRef.current) checkLabelCollision(labelsRef.current)

    // Throttle the collision check when the window is resized to
    // limit calculations and layout thrashing
    const throttledCheckLabelCollision = throttle(() => {
      if (labelsRef.current) checkLabelCollision(labelsRef.current)
    }, 20)

    window.addEventListener('resize', throttledCheckLabelCollision)

    return () => {
      window.removeEventListener('resize', throttledCheckLabelCollision)
    }
  }, [])

  return (
    <div
      className={styles.starChart}
      data-observe-resizes
      data-breakpoints='{"SM": 760, "MD": 1200, "LG": 1600, "XL": 1900}'
    >
      <div className={styles.interstellarClouds}>
        <canvas ref={cloudsRef}></canvas>
      </div>
      <div className={styles.starsContainer}>
        {labeledStars.map((item, index) => (
          <div
            key={index}
            className={styles.labeledStarContainer}
            style={{
              left: `calc(${item.left}% - 40px / 2)`,
              top: `calc(${item.top}% - 40px / 2)`,
            }}
          >
            <div
              className={styles.labeledStar}
              style={{ width: item.size + 'px', height: item.size + 'px' }}
            ></div>
          </div>
        ))}
        {backgroundStars.map((item, index) => (
          <div
            key={index}
            className={styles.backgroundStar}
            style={{
              left: `calc(${item.left}% - ${item.size}px / 2)`,
              top: `calc(${item.top}% - ${item.size}px / 2)`,
              width: item.size + 'px',
              height: item.size + 'px',
            }}
          ></div>
        ))}
      </div>
      <div className={styles.gridContainer}>
        {numbers.map((item, index) => (
          <div key={index} className={styles.gridItem}>
            {item}
          </div>
        ))}
      </div>
      <div className={styles.labelContainer} ref={labelsRef}>
        {labeledStars.map((item, index) => (
          <div
            key={index}
            className={`${styles.label} ${styles.starLabel}`}
            style={{
              left: `calc(${item.left}% - 40px / 2)`,
              top: `calc(${item.top}% - 40px / 2)`,
            }}
          >
            <div className={styles.select}>
              <div className={styles.selectLeft}>
                <div className={styles.selectBracket}></div>
              </div>
              <div className={styles.selectRight}>
                <div className={styles.selectBracket}></div>
              </div>
            </div>
            <div className={styles.labelText}>{item.label}</div>
          </div>
        ))}
      </div>
      {type === 'nav' && <ForwardScanner />}
      {type === 'nav' && <StarCoords />}
      {type === 'planet' && <InspectBracket />}
    </div>
  )
}
