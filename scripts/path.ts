// An SVG path's geometry, for the build and the tests: its commands made
// absolute, and the bounds of its ink (the path's own geometry, without
// the stroke), from which the centre of the ink is read. Curves and arcs
// are sampled; a thousandth of a unit is below anything drawn.

export interface Bounds {
  left: number
  right: number
  top: number
  bottom: number
}

const NUM = /-?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?/g
const ARITY: Record<string, number> = {
  M: 2,
  L: 2,
  T: 2,
  H: 1,
  V: 1,
  C: 6,
  S: 4,
  Q: 4,
  A: 7,
  Z: 0,
}

export interface Segment {
  command: string
  /** Absolute parameters, as the command takes them. */
  params: number[]
}

/** The path's segments, every one absolute (relative commands resolved,
 * repeated parameters split into their own segments). */
export function segments(d: string): Segment[] {
  const out: Segment[] = []
  const re = /([MLTHVCSQAZmlthvcsqaz])([^MLTHVCSQAZmlthvcsqaz]*)/g
  let x = 0
  let y = 0
  let startX = 0
  let startY = 0
  let m: RegExpExecArray | null
  while ((m = re.exec(d))) {
    const letter = m[1]
    const upper = letter.toUpperCase()
    const relative = letter !== upper
    const nums = (m[2].match(NUM) ?? []).map(Number)
    const arity = ARITY[upper]
    if (upper === 'Z') {
      out.push({ command: 'Z', params: [] })
      x = startX
      y = startY
      continue
    }
    if (nums.length % arity !== 0)
      throw new Error(
        `path: ${letter} takes ${arity} numbers, got ${nums.length}`,
      )
    for (let i = 0; i < nums.length; i += arity) {
      const p = nums.slice(i, i + arity)
      // The first pair after M's is an implicit L.
      const command = i > 0 && upper === 'M' ? 'L' : upper
      let abs: number[]
      switch (command) {
        case 'H':
          abs = [relative ? x + p[0] : p[0]]
          x = abs[0]
          break
        case 'V':
          abs = [relative ? y + p[0] : p[0]]
          y = abs[0]
          break
        case 'A':
          abs = [
            p[0],
            p[1],
            p[2],
            p[3],
            p[4],
            relative ? x + p[5] : p[5],
            relative ? y + p[6] : p[6],
          ]
          x = abs[5]
          y = abs[6]
          break
        default:
          abs = p.map((v, k) => (relative ? (k % 2 ? y : x) + v : v))
          x = abs[abs.length - 2]
          y = abs[abs.length - 1]
      }
      if (command === 'M') {
        startX = x
        startY = y
      }
      out.push({ command, params: abs })
    }
  }
  return out
}

/** Points along the path, dense enough to bound it. */
export function samplePoints(d: string): [number, number][] {
  const pts: [number, number][] = []
  let x = 0
  let y = 0
  let lastControl: [number, number] | null = null
  const add = (px: number, py: number) => pts.push([px, py])
  for (const { command, params: p } of segments(d)) {
    switch (command) {
      case 'M':
      case 'L':
      case 'T': {
        if (command === 'T') {
          // A quadratic whose control reflects the last one's.
          const c: [number, number] = lastControl
            ? [2 * x - lastControl[0], 2 * y - lastControl[1]]
            : [x, y]
          sampleQuadratic(x, y, c[0], c[1], p[0], p[1], add)
          lastControl = c
        } else {
          add(p[0], p[1])
          lastControl = null
        }
        x = p[0]
        y = p[1]
        break
      }
      case 'H':
        add(p[0], y)
        x = p[0]
        lastControl = null
        break
      case 'V':
        add(x, p[0])
        y = p[0]
        lastControl = null
        break
      case 'C':
        sampleCubic(x, y, p[0], p[1], p[2], p[3], p[4], p[5], add)
        lastControl = [p[2], p[3]]
        x = p[4]
        y = p[5]
        break
      case 'S': {
        const c1: [number, number] = lastControl
          ? [2 * x - lastControl[0], 2 * y - lastControl[1]]
          : [x, y]
        sampleCubic(x, y, c1[0], c1[1], p[0], p[1], p[2], p[3], add)
        lastControl = [p[0], p[1]]
        x = p[2]
        y = p[3]
        break
      }
      case 'Q':
        sampleQuadratic(x, y, p[0], p[1], p[2], p[3], add)
        lastControl = [p[0], p[1]]
        x = p[2]
        y = p[3]
        break
      case 'A':
        sampleArc(x, y, p[0], p[1], p[2], p[3], p[4], p[5], p[6], add)
        lastControl = null
        x = p[5]
        y = p[6]
        break
      case 'Z':
        lastControl = null
        break
    }
  }
  return pts
}

const STEPS = 48

function sampleCubic(
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  x3: number,
  y3: number,
  add: (x: number, y: number) => void,
) {
  for (let i = 1; i <= STEPS; i++) {
    const t = i / STEPS
    const u = 1 - t
    add(
      u ** 3 * x0 + 3 * u * u * t * x1 + 3 * u * t * t * x2 + t ** 3 * x3,
      u ** 3 * y0 + 3 * u * u * t * y1 + 3 * u * t * t * y2 + t ** 3 * y3,
    )
  }
}

function sampleQuadratic(
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  add: (x: number, y: number) => void,
) {
  for (let i = 1; i <= STEPS; i++) {
    const t = i / STEPS
    const u = 1 - t
    add(
      u * u * x0 + 2 * u * t * x1 + t * t * x2,
      u * u * y0 + 2 * u * t * y1 + t * t * y2,
    )
  }
}

/** An elliptical arc, by the SVG spec's centre parameterisation (F.6.5). */
function sampleArc(
  x1: number,
  y1: number,
  rx: number,
  ry: number,
  rotation: number,
  large: number,
  sweep: number,
  x2: number,
  y2: number,
  add: (x: number, y: number) => void,
) {
  if (rx === 0 || ry === 0 || (x1 === x2 && y1 === y2)) {
    add(x2, y2)
    return
  }
  rx = Math.abs(rx)
  ry = Math.abs(ry)
  const phi = (rotation * Math.PI) / 180
  const cos = Math.cos(phi)
  const sin = Math.sin(phi)
  const dx = (x1 - x2) / 2
  const dy = (y1 - y2) / 2
  const x1p = cos * dx + sin * dy
  const y1p = -sin * dx + cos * dy
  // Radii scaled up if too small to reach.
  const lambda = (x1p * x1p) / (rx * rx) + (y1p * y1p) / (ry * ry)
  if (lambda > 1) {
    rx *= Math.sqrt(lambda)
    ry *= Math.sqrt(lambda)
  }
  const sign = large === sweep ? -1 : 1
  const num = rx * rx * ry * ry - rx * rx * y1p * y1p - ry * ry * x1p * x1p
  const den = rx * rx * y1p * y1p + ry * ry * x1p * x1p
  const coef = sign * Math.sqrt(Math.max(0, num / den))
  const cxp = (coef * rx * y1p) / ry
  const cyp = (-coef * ry * x1p) / rx
  const cx = cos * cxp - sin * cyp + (x1 + x2) / 2
  const cy = sin * cxp + cos * cyp + (y1 + y2) / 2
  const angle = (ux: number, uy: number, vx: number, vy: number) => {
    const dot = ux * vx + uy * vy
    const len = Math.hypot(ux, uy) * Math.hypot(vx, vy)
    let a = Math.acos(Math.min(Math.max(dot / len, -1), 1))
    if (ux * vy - uy * vx < 0) a = -a
    return a
  }
  const theta1 = angle(1, 0, (x1p - cxp) / rx, (y1p - cyp) / ry)
  let delta = angle(
    (x1p - cxp) / rx,
    (y1p - cyp) / ry,
    (-x1p - cxp) / rx,
    (-y1p - cyp) / ry,
  )
  if (!sweep && delta > 0) delta -= 2 * Math.PI
  if (sweep && delta < 0) delta += 2 * Math.PI
  for (let i = 1; i <= STEPS; i++) {
    const t = theta1 + (delta * i) / STEPS
    const ex = rx * Math.cos(t)
    const ey = ry * Math.sin(t)
    add(cos * ex - sin * ey + cx, sin * ex + cos * ey + cy)
  }
}

/** The bounds of the path's ink (its geometry; the stroke adds 0.75 round
 * it), to a thousandth. */
export function bounds(d: string): Bounds {
  const pts = samplePoints(d)
  if (!pts.length) throw new Error('path: empty')
  const r = (n: number) => Math.round(n * 1000) / 1000
  return {
    left: r(Math.min(...pts.map((p) => p[0]))),
    right: r(Math.max(...pts.map((p) => p[0]))),
    top: r(Math.min(...pts.map((p) => p[1]))),
    bottom: r(Math.max(...pts.map((p) => p[1]))),
  }
}

/** Where the ink is centred: the middle of its bounds. */
export function inkCentre(b: Bounds): { x: number; y: number } {
  const r = (n: number) => Math.round(n * 1000) / 1000
  return { x: r((b.left + b.right) / 2), y: r((b.top + b.bottom) / 2) }
}
