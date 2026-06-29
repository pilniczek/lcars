import { useEffect, useState } from 'react'
import { makeRandomNumber } from '../../utils'
import styles from './StarCoords.module.css'

const UPDATE_INTERVAL = 200

const getRandomNumber = () => makeRandomNumber(6, true)

export default function StarCoords() {
  const [coord1, setCoord1] = useState(getRandomNumber)
  const [coord2, setCoord2] = useState(getRandomNumber)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCoord1(getRandomNumber())
      setCoord2(getRandomNumber())
    }, UPDATE_INTERVAL)

    return () => window.clearInterval(timer)
  }, [])

  return (
    <div className={styles.starCoords}>
      <div>{coord1}</div>
      <div>{coord2}</div>
    </div>
  )
}
