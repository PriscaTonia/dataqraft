import { cn } from "@/lib/utils"

const width = 640
const height = 520

function hash(seed: number) {
  const value = Math.sin(seed * 127.1) * 43758.5453
  return value - Math.floor(value)
}

type Point = { x: number; y: number; r: number; alpha: number }

/** Soft atmospheric lattice — light, mostly decoration. */
const gridLines: Array<{ x1: number; y1: number; x2: number; y2: number; o: number }> =
  []
for (let x = 64; x < width - 40; x += 64) {
  const skew = ((x / width) - 0.5) * 28
  gridLines.push({
    x1: x,
    y1: 48,
    x2: x + skew,
    y2: height - 56,
    o: 0.22 + (x / width) * 0.2,
  })
}
for (let y = 72; y < height - 48; y += 60) {
  gridLines.push({
    x1: 56,
    y1: y,
    x2: width - 40,
    y2: y + ((y / height) - 0.5) * 12,
    o: 0.16 + (1 - Math.abs(y / height - 0.5)) * 0.12,
  })
}

/** Sparse star field across the whole plane. */
const stars: Point[] = []
let starSeed = 11
for (let i = 0; i < 56; i += 1) {
  starSeed += 1
  const x = 24 + hash(starSeed) * (width - 48)
  const y = 24 + hash(starSeed + 17) * (height - 48)
  stars.push({
    x,
    y,
    r: 0.55 + hash(starSeed + 5) * 1.05,
    alpha: 0.12 + hash(starSeed + 9) * 0.22,
  })
}

/**
 * Abstract network cloud: denser toward the right-center,
 * thinned at edges so it reads as atmosphere, not geography.
 */
const nodes: Point[] = []
let nodeSeed = 41
const cx = width * 0.68
const cy = height * 0.48
const rx = width * 0.34
const ry = height * 0.38

for (let attempt = 0; attempt < 280; attempt += 1) {
  nodeSeed += 1
  const x = 40 + hash(nodeSeed) * (width - 80)
  const y = 44 + hash(nodeSeed + 21) * (height - 88)
  const dx = (x - cx) / rx
  const dy = (y - cy) / ry
  const radial = Math.hypot(dx, dy)
  // Soft elliptical falloff — no hard silhouette.
  const cloud = Math.max(0, 1 - radial * radial)
  const rightLift = 0.35 + 0.65 * Math.max(0, (x / width - 0.28) / 0.72)
  const chance = cloud * rightLift * 0.85
  if (hash(nodeSeed + 7) > chance) continue

  let tooClose = false
  const minDist = 18 + (1 - cloud) * 16
  for (const existing of nodes) {
    if (Math.hypot(existing.x - x, existing.y - y) < minDist) {
      tooClose = true
      break
    }
  }
  if (tooClose) continue

  nodes.push({
    x,
    y,
    r: 1 + hash(nodeSeed + 13) * (1.2 + cloud),
    alpha: 0.28 + cloud * 0.5,
  })
}

const links: Array<[number, number]> = []
const seen = new Set<string>()
for (let i = 0; i < nodes.length; i += 1) {
  const nearest: Array<{ j: number; d: number }> = []
  for (let j = 0; j < nodes.length; j += 1) {
    if (i === j) continue
    const d = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y)
    if (d > 88) continue
    nearest.push({ j, d })
  }
  nearest.sort((a, b) => a.d - b.d)
  const budget = nodes[i].x > cx ? 3 : 2
  for (const link of nearest.slice(0, budget)) {
    const key = i < link.j ? `${i}-${link.j}` : `${link.j}-${i}`
    if (seen.has(key)) continue
    seen.add(key)
    links.push([i, link.j])
  }
}

const hubs = nodes
  .map((node, index) => ({ ...node, index }))
  .filter((node) => {
    const dx = (node.x - cx) / rx
    const dy = (node.y - cy) / ry
    return Math.hypot(dx, dy) < 0.55 && node.alpha > 0.5
  })
  .sort((a, b) => b.alpha - a.alpha)
  .slice(0, 4)

export function IntelligenceConstellation({
  className,
}: {
  className?: string
}) {
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={cn("hero-constellation overflow-visible", className)}
      fill="none"
      role="img"
      aria-label="Abstract constellation of connected intelligence nodes"
    >
      <defs>
        <radialGradient id="constellation-fade" cx="70%" cy="48%" r="58%">
          <stop offset="0%" stopColor="white" stopOpacity="1" />
          <stop offset="52%" stopColor="white" stopOpacity="0.78" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
        <mask id="constellation-mask">
          <rect width={width} height={height} fill="url(#constellation-fade)" />
        </mask>
      </defs>

      <g mask="url(#constellation-mask)">
        {gridLines.map((line, index) => (
          <line
            key={`g-${index}`}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            className="stroke-border"
            strokeWidth="0.55"
            opacity={line.o}
          />
        ))}

        {stars.map((star, index) => (
          <circle
            key={`s-${index}`}
            cx={star.x}
            cy={star.y}
            r={star.r}
            className="fill-signal"
            opacity={star.alpha}
          />
        ))}

        {links.map(([a, b]) => {
          const strength =
            (nodes[a].alpha + nodes[b].alpha) / 2 *
            (0.55 + (nodes[a].x + nodes[b].x) / (2 * width) * 0.45)
          return (
            <line
              key={`${a}-${b}`}
              x1={nodes[a].x}
              y1={nodes[a].y}
              x2={nodes[b].x}
              y2={nodes[b].y}
              className="stroke-signal"
              strokeWidth="0.7"
              opacity={0.1 + strength * 0.22}
            />
          )
        })}

        {nodes.map((node, index) => (
          <circle
            key={`n-${index}`}
            cx={node.x}
            cy={node.y}
            r={node.r}
            className="fill-signal"
            opacity={node.alpha}
          />
        ))}

        {hubs.map((hub) => (
          <g key={`h-${hub.index}`} className="hero-constellation-hub">
            <circle
              cx={hub.x}
              cy={hub.y}
              r={hub.r + 8}
              className="hero-constellation-ring fill-none stroke-signal/30"
              strokeWidth="0.85"
            />
            <circle
              cx={hub.x}
              cy={hub.y}
              r={hub.r + 1.4}
              className="fill-signal"
              opacity={0.92}
            />
          </g>
        ))}
      </g>
    </svg>
  )
}
