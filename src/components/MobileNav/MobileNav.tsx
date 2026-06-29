import { useEffect } from 'react'
import type { KeyboardEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { articlesIn, firstOf, pathFor, sectionFromPath } from '../../screens'
import { playClick } from '../../utils/sounds'
import LCARSBar from '../LCARSBar'
import styles from './MobileNav.module.css'

// bgcolor indices cycled across the outer wedges for the multi-colour LCARS
// look. Ordered to alternate warm (a1-a5) and cool (a6-a9) hues so neighbouring
// wedges stay visually distinct rather than clumping similar purples together.
const COLORS = [5, 6, 1, 8, 2, 9, 4, 7, 3]

// Wheel geometry, in the 0-200 SVG viewBox. Three concentric zones mirror the
// sidebar: the outer ring of routes, an inner ring of top-menu actions, and the
// central hub. RIM_R is the framing circle; GAP is the constant gap width.
const CENTER = 100
const RIM_R = 97.5
const OUTER_R2 = 95
const OUTER_R1 = 57
const INNER_R2 = 54
const INNER_R1 = 24.75
const GAP = 3

// Outer frame: circular for three quadrants, then breaking out to a sharp 90°
// corner at the bottom-right (LCARS panel style). Arc runs the long way (270°)
// from the bottom point, clockwise through left/top, to the right point; the
// straight edges then meet at the bottom-right corner.
const RIM_PATH =
  `M ${CENTER} ${CENTER + RIM_R} ` +
  `A ${RIM_R} ${RIM_R} 0 1 1 ${CENTER + RIM_R} ${CENTER} ` +
  `L ${CENTER + RIM_R} ${CENTER + RIM_R} Z`

// Outer wedges are drawn oversized to OUTER_FILL_R and clipped to this shape so
// they fill out to the squared bottom-right corner (mirroring RIM_PATH) instead
// of stopping at the circular arc. CLIP_R sits just inside the rim to keep the
// gold border and the black gaps consistent all around.
const OUTER_FILL_R = 140
const CLIP_R = OUTER_R2
const CLIP_PATH =
  `M ${CENTER} ${CENTER + CLIP_R} ` +
  `A ${CLIP_R} ${CLIP_R} 0 1 1 ${CENTER + CLIP_R} ${CENTER} ` +
  `L ${CENTER + CLIP_R} ${CENTER + CLIP_R} Z`

// Point on a circle of radius r at angleDeg measured clockwise from the top.
function polar(r: number, angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180
  return {
    x: CENTER + r * Math.sin(rad),
    y: CENTER - r * Math.cos(rad),
  }
}

// Angular inset (deg) that pulls a wedge edge in by a fixed perpendicular
// distance GAP/2 from its boundary radius. Larger near the centre, smaller at
// the rim — so both edges run parallel to the boundary and the gap stays a
// constant width instead of fanning out.
function gapInset(radius: number) {
  return (Math.asin(Math.min(1, GAP / 2 / radius)) * 180) / Math.PI
}

// Annular-sector path for a wedge centred at `mid`, spanning ±`half` degrees,
// between radii rInner and rOuter, with constant-width gaps to its neighbours.
function sectorPath(mid: number, half: number, rInner: number, rOuter: number) {
  const outerInset = gapInset(rOuter)
  const innerInset = gapInset(rInner)
  const o1 = polar(rOuter, mid - half + outerInset)
  const o2 = polar(rOuter, mid + half - outerInset)
  const i2 = polar(rInner, mid + half - innerInset)
  const i1 = polar(rInner, mid - half + innerInset)
  const large = 2 * half - 2 * outerInset > 180 ? 1 : 0
  const f = (n: number) => n.toFixed(2)
  return (
    `M ${f(o1.x)} ${f(o1.y)} ` +
    `A ${rOuter} ${rOuter} 0 ${large} 1 ${f(o2.x)} ${f(o2.y)} ` +
    `L ${f(i2.x)} ${f(i2.y)} ` +
    `A ${rInner} ${rInner} 0 ${large} 0 ${f(i1.x)} ${f(i1.y)} Z`
  )
}

// Distance from centre to the clip boundary along a ray at angleDeg: the
// circle radius CLIP_R everywhere except the squared bottom-right quadrant
// (90°-180°), where the ray meets the right or bottom straight edge.
function clipRadiusAt(angleDeg: number) {
  const a = ((angleDeg % 360) + 360) % 360
  if (a > 90 && a < 180) {
    const rad = (a * Math.PI) / 180
    return Math.min(CLIP_R / Math.sin(rad), -CLIP_R / Math.cos(rad))
  }
  return CLIP_R
}

// Area centroid of a wedge spanning [a0, a1] degrees between rInner and a
// (possibly angle-varying) outer radius. Used to centre the label in the
// visible wedge — which matters for the clipped corner wedges, whose mass is
// skewed toward the squared corner.
function wedgeCentroid(a0: number, a1: number, rInner: number, rOuterAt: (a: number) => number) {
  const steps = 24
  const dTheta = (a1 - a0) / steps
  let area = 0
  let cx = 0
  let cy = 0
  for (let s = 0; s < steps; s++) {
    const t = a0 + dTheta * (s + 0.5)
    const rOut = rOuterAt(t)
    const dA = 0.5 * (rOut * rOut - rInner * rInner)
    const rc = ((2 / 3) * (rOut ** 3 - rInner ** 3)) / (rOut ** 2 - rInner ** 2)
    const p = polar(rc, t)
    area += dA
    cx += p.x * dA
    cy += p.y * dA
  }
  return { x: cx / area, y: cy / area }
}

// Greedy word-wrap so multi-word labels fit the wedge across ~2 short lines.
function wrapLabel(label: string) {
  const lines: string[] = []
  let line = ''
  for (const word of label.toUpperCase().split(' ')) {
    const next = line ? `${line} ${word}` : word
    if (next.length > 11 && line) {
      lines.push(line)
      line = word
    } else {
      line = next
    }
  }
  if (line) lines.push(line)
  return lines
}

// Activate an SVG <g> "button" from the keyboard (Enter / Space).
function activateOnKey(event: KeyboardEvent, action: () => void) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    action()
  }
}

interface Props {
  open: boolean
  onClose: () => void
  // Override the outer ring routes (default: the current section's articles).
  // Used by the home page to mirror its call-to-action pills. An `external`
  // entry opens its URL in a new tab instead of routing in-app.
  routes?: { path: string; label: string; external?: boolean }[]
  // Hide the inner ring of section/Initialize shortcuts (default: shown).
  showInnerRing?: boolean
}

interface Wedge {
  key: string
  label: string
  color: string
  mid: number
  half: number
  rInner: number
  rOuter: number
  clipped: boolean
  active: boolean
  activate: () => void
}

// Full-screen navigation menu for the XS layout, where the sidebar and header
// button row are hidden. Opened by the title bar's end-cap (see App / LCARSBar).
// Rendered as an SVG LCARS control wheel that mirrors the sidebar: an outer ring
// of route wedges, an inner ring of top-menu actions, and a central Nav hub.
export default function MobileNav({ open, onClose, routes, showInnerRing = true }: Readonly<Props>) {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  // Close on Escape while the menu is open.
  useEffect(() => {
    if (!open) return
    function onKey(event: globalThis.KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    globalThis.addEventListener('keydown', onKey)
    return () => globalThis.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  function go(path: string, external?: boolean) {
    if (external) {
      playClick()
      globalThis.open(path, '_blank', 'noopener,noreferrer')
    } else if (path !== pathname) {
      playClick()
      navigate(path)
    }
    onClose()
  }

  // Outer ring: one wedge per article in the current section (mirrors the
  // sidebar, which shows only that section's articles). Callers can override
  // this with an explicit route list (e.g. the home page's single entry).
  const section = sectionFromPath(pathname)
  const outerRoutes =
    routes ??
    articlesIn(section).map((article) => ({
      path: pathFor(article),
      label: article.title,
    }))
  const outerSeg = 360 / outerRoutes.length
  // For an explicit route override (the home CTAs) start half a segment back so
  // the wedges are divided by a vertical seam - the first wedge on the left,
  // matching the desktop pill order. The default article ring keeps a wedge
  // centred at the top.
  const startAngle = routes ? -outerSeg / 2 : 0
  const outerWedges: Wedge[] = outerRoutes.map((route, i) => ({
    key: route.path,
    label: route.label,
    color: `var(--lcars-color-a${COLORS[i % COLORS.length]})`,
    mid: i * outerSeg + startAngle,
    half: outerSeg / 2,
    rInner: OUTER_R1,
    rOuter: OUTER_FILL_R,
    clipped: true,
    active: pathname === route.path,
    activate: () => go(route.path, route.external),
  }))

  // Inner ring: the header actions, three quarter-circle (90°) wedges. The
  // bottom-right quadrant (90°-180°) is left empty so the ring is 3/4 and lines
  // up with the outer ring's squared corner. These are navigation shortcuts, not
  // a current location (every route is an article page, and a section button
  // just opens that section's first article), so none are ever marked active.
  const innerItems = showInnerRing
    ? [
        {
          key: 'initialize',
          label: 'Initialize',
          color: 'var(--lcars-color-a6)',
          mid: 315, // top-left
          activate: () => go('/git/initialize'),
        },
        {
          key: 'config',
          label: 'Config',
          color: 'var(--lcars-color-a5)',
          mid: 45, // top-right
          activate: () => go(pathFor(firstOf('config'))),
        },
        {
          key: 'usage',
          label: 'Usage',
          color: 'var(--lcars-color-a9)',
          mid: 225, // bottom-left
          activate: () => go(pathFor(firstOf('usage'))),
        },
      ]
    : []
  const innerWedges: Wedge[] = innerItems.map((item) => ({
    ...item,
    half: 45,
    rInner: INNER_R1,
    rOuter: INNER_R2,
    clipped: false,
    active: false,
  }))

  function renderWedge(w: Wedge) {
    const rOuterAt = w.clipped
      ? (a: number) => Math.min(w.rOuter, clipRadiusAt(a))
      : () => w.rOuter
    // A wide wedge (a half-circle or more, e.g. the home-page CTAs) has its area
    // centroid near the hub, where the label would sit on the empty black centre
    // and get clipped. Place it on the ring band at the wedge's mid angle instead.
    const p =
      w.half >= 90
        ? polar((w.rInner + Math.min(w.rOuter, CLIP_R)) / 2, w.mid)
        : wedgeCentroid(w.mid - w.half, w.mid + w.half, w.rInner, rOuterAt)
    const lines = wrapLabel(w.label)
    return (
      <g
        key={w.key}
        className={`${styles.segment} ${w.active ? styles.active : ''}`}
        role="button"
        tabIndex={0}
        aria-label={w.label}
        aria-current={w.active ? 'page' : undefined}
        onClick={w.activate}
        onKeyDown={(event) => activateOnKey(event, w.activate)}
      >
        <path
          className={styles.segFill}
          d={sectorPath(w.mid, w.half, w.rInner, w.rOuter)}
          style={{ fill: w.active ? 'var(--lcars-background)' : w.color }}
        />
        <text className={styles.labelText} x={p.x} y={p.y} textAnchor="middle">
          {lines.map((line, li) => (
            <tspan key={line} x={p.x} dy={li === 0 ? `${-(lines.length - 1) * 0.55}em` : '1.1em'}>
              {line}
            </tspan>
          ))}
        </text>
      </g>
    )
  }

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-label="Navigation">
      <LCARSBar align="left" colorScheme={3}>
        Navigation
      </LCARSBar>
      <nav className={styles.stage}>
        <svg className={styles.wheel} viewBox="0 0 200 200" role="group" aria-label="Routes">
          <defs>
            <clipPath id="mobilenav-wheel-clip">
              <path d={CLIP_PATH} />
            </clipPath>
          </defs>

          {/* Outer frame — circular, with a sharp bottom-right corner. */}
          <path className={styles.rim} d={RIM_PATH} />

          {/* Outer wedges drawn oversized, clipped to the framed shape so they
              fill out to the sharp bottom-right corner. */}
          <g clipPath="url(#mobilenav-wheel-clip)">{outerWedges.map(renderWedge)}</g>
          {innerWedges.map(renderWedge)}
        </svg>
      </nav>
      <LCARSBar
        align="right"
        colorScheme={3}
        onAction={() => {
          playClick()
          onClose()
        }}
        actionText="Close"
        actionLabel="Close navigation menu"
      />
    </div>
  )
}
