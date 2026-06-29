type Position = 'topleft' | 'topright' | 'bottomleft' | 'bottomright'

interface Props {
  width?: string
  fill?: string
  position?: Position
}

const ROTATIONS: Record<Position, string> = {
  topleft: '',
  topright: 'scaleX(-1)',
  bottomleft: 'scaleY(-1)',
  bottomright: 'rotate(180deg)',
}

export default function InspectBracketTL({
  width = '100%',
  fill = 'black',
  position = 'topleft',
}: Props) {
  const transform = ROTATIONS[position]

  return (
    <svg
      width={width}
      fill={fill}
      style={{
        fillRule: 'evenodd',
        clipRule: 'evenodd',
        strokeLinejoin: 'round',
        strokeMiterlimit: 2,
        ...(transform ? { transform } : {}),
      }}
      viewBox="0 0 64 36"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g transform="matrix(0.445613,0,0,0.445613,-540.632,-560.842)">
        <path d="M1213.23,1334.17L1213.23,1339.37L1285.04,1339.37L1285.04,1326.61C1285.04,1311.5 1300.16,1300.16 1315.28,1300.16L1337.95,1300.16L1337.95,1258.58L1285.04,1258.58C1247.24,1258.58 1213.23,1288.82 1213.23,1334.17Z" />
      </g>
    </svg>
  )
}
