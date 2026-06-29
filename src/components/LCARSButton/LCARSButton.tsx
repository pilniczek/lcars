import { useMemo } from 'react'
import type { MouseEvent } from 'react'
import styles from './LCARSButton.module.css'

interface Props {
  label?: string
  color?: number
  square?: boolean
  roundedLeft?: boolean
  roundedRight?: boolean
  active?: boolean
  disabled?: boolean
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void
}

export default function LCARSButton({
  label,
  color,
  square = false,
  roundedLeft = false,
  roundedRight = false,
  active = false,
  disabled = false,
  onClick,
}: Props) {
  // Label comes straight from the prop; color can be passed in or picked once
  const resolvedColor = useMemo(() => color ?? Math.floor(Math.random() * 9) + 1, [color])

  const className = [
    styles.button,
    square && styles.buttonSquare,
    roundedLeft && styles.buttonRoundedLeft,
    roundedRight && styles.buttonRoundedRight,
    active && styles.active,
    `bgcolor-${resolvedColor}`,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button className={className} disabled={disabled} onClick={onClick}>
      {label}
    </button>
  )
}
