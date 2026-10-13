const outline: Array<[number, number]> = [
  [13.606, 13.705], [14.064, 13.078], [14.197, 12.384], [14.521, 12.298],
  [14.618, 12.151], [14.56, 11.729], [14.575, 11.533], [14.204, 11.269],
  [13.981, 11.212], [13.7, 10.873], [13.534, 10.606], [13.416, 10.172],
  [13.272, 10.036], [13.2, 9.564], [12.93, 9.427], [12.876, 9.304],
  [12.807, 8.887], [12.732, 8.745], [12.584, 8.623], [12.404, 8.596],
  [12.235, 8.283], [12.156, 7.943], [12.026, 7.728], [12.015, 7.59],
  [11.767, 7.273], [11.86, 7.117], [11.58, 6.889], [11.551, 6.698],
  [11.403, 6.533], [11.238, 6.45], [11.108, 6.459], [11.007, 6.74],
  [10.608, 7.063], [10.557, 7.037], [10.482, 6.891], [10.413, 6.877],
  [10.204, 6.891], [10.143, 6.997], [9.779, 6.761], [9.661, 6.531],
  [9.373, 6.32], [9.059, 6.009], [8.933, 5.782], [8.8, 5.198],
  [8.555, 4.756], [8.516, 4.724], [8.433, 4.747], [8.393, 4.815],
  [8.235, 4.908], [8.329, 4.657], [8.293, 4.558], [7.645, 4.525],
  [7.565, 4.561], [7.529, 4.655], [7.461, 4.556], [7.285, 4.547],
  [7.076, 4.716], [7.166, 4.615], [7.155, 4.514], [7.015, 4.398],
  [6.925, 4.391], [6.867, 4.441], [6.824, 4.644], [6.766, 4.724],
  [6.791, 4.469], [6.86, 4.374], [6.633, 4.341], [6.579, 4.476],
  [6.554, 4.341], [6.262, 4.309], [6.269, 4.433], [6.172, 4.278],
  [5.971, 4.339], [5.589, 4.648], [5.384, 5.129], [5.477, 5.153],
  [5.387, 5.174], [5.366, 5.259], [5.369, 5.337], [5.503, 5.379],
  [5.549, 5.474], [5.387, 5.401], [5.2, 5.533], [5.215, 5.571],
  [5.395, 5.575], [5.456, 5.611], [5.351, 5.624], [5.326, 5.707],
  [5.276, 5.641], [5.171, 5.603], [5.114, 5.641], [5.092, 5.768],
  [4.862, 6.026], [4.43, 6.349], [4.127, 6.412], [3.451, 6.427],
  [3.753, 6.584], [3.717, 6.597], [3.429, 6.525], [3.335, 6.396],
  [2.705, 6.37], [2.774, 6.712], [2.72, 6.981], [2.785, 7.478],
  [2.72, 7.616], [2.687, 7.873], [2.774, 9.049], [3.044, 9.083],
  [3.148, 9.321], [3.137, 9.451], [3.328, 9.667], [3.325, 9.778],
  [3.559, 9.908], [3.602, 10.005], [3.645, 10.16], [3.577, 10.269],
  [3.605, 10.351], [3.681, 10.427], [3.785, 10.436], [3.836, 10.608],
  [3.757, 10.769], [3.717, 11.08], [3.487, 11.396], [3.49, 11.5],
  [3.663, 11.762], [3.613, 11.887], [3.645, 12.529], [3.947, 12.776],
  [4.037, 12.934], [4.149, 13.458], [4.423, 13.647], [4.822, 13.76],
  [5.243, 13.757], [5.492, 13.873], [6.183, 13.663], [6.298, 13.66],
  [6.59, 13.41], [6.806, 13.107], [6.935, 13.009], [7.058, 13.0],
  [7.173, 13.087], [7.357, 13.107], [7.832, 13.34], [8.095, 13.291],
  [8.75, 12.908], [9.2, 12.821], [9.617, 12.811], [9.931, 13.135],
  [10.046, 13.206], [10.474, 13.33], [10.96, 13.371], [11.41, 13.354],
  [11.99, 13.193], [12.12, 13.09], [12.462, 13.094], [12.512, 13.194],
  [12.656, 13.326], [12.872, 13.449], [13.192, 13.573], [13.326, 13.672],
]

const states = [
  { name: "Lagos", lon: 3.4, lat: 6.58, label: [14, 4] as const, anchor: "start" as const },
  { name: "Sokoto", lon: 5.23, lat: 13.05, label: [14, 16] as const, anchor: "start" as const },
  { name: "Rivers", lon: 6.95, lat: 4.9, label: [14, -14] as const, anchor: "start" as const },
  { name: "Enugu", lon: 7.5, lat: 6.45, label: [14, 4] as const, anchor: "start" as const },
  { name: "FCT", lon: 7.49, lat: 9.06, label: [-14, 4] as const, anchor: "end" as const },
  { name: "Kano", lon: 8.52, lat: 12, label: [14, -10] as const, anchor: "start" as const },
  { name: "Borno", lon: 13.1, lat: 11.8, label: [-14, 4] as const, anchor: "end" as const },
]

const routes: Array<[string, string]> = [
  ["Lagos", "FCT"],
  ["Rivers", "FCT"],
  ["Enugu", "FCT"],
  ["FCT", "Kano"],
  ["Sokoto", "Kano"],
  ["Kano", "Borno"],
]

const minLon = 2.55
const maxLon = 14.8
const minLat = 4.1
const maxLat = 14.05
const width = 650
const height = 540
const pad = 32

function project(lon: number, lat: number) {
  const x = pad + ((lon - minLon) / (maxLon - minLon)) * (width - pad * 2)
  const y = pad + (1 - (lat - minLat) / (maxLat - minLat)) * (height - pad * 2)
  return [x, y] as const
}

function unproject(x: number, y: number) {
  const lon = minLon + ((x - pad) / (width - pad * 2)) * (maxLon - minLon)
  const lat = minLat + (1 - (y - pad) / (height - pad * 2)) * (maxLat - minLat)
  return [lon, lat] as const
}

function contains(lon: number, lat: number) {
  let inside = false
  for (let i = 0, j = outline.length - 1; i < outline.length; j = i, i += 1) {
    const [xi, yi] = outline[i]
    const [xj, yj] = outline[j]
    const crosses =
      yi > lat !== yj > lat &&
      lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi
    if (crosses) inside = !inside
  }
  return inside
}

function jitter(seed: number) {
  const value = Math.sin(seed * 127.1) * 43758.5453
  return value - Math.floor(value)
}

const dots: Array<{ x: number; y: number }> = []
let seed = 1
for (let lon = minLon; lon <= maxLon; lon += 0.46) {
  for (let lat = minLat; lat <= maxLat; lat += 0.4) {
    seed += 1
    if (!contains(lon, lat)) continue
    const [x, y] = project(lon, lat)
    const jx = x + (jitter(seed) - 0.5) * 8
    const jy = y + (jitter(seed + 3) - 0.5) * 8
    const [jLon, jLat] = unproject(jx, jy)
    const point = contains(jLon, jLat) ? { x: jx, y: jy } : { x, y }
    dots.push(point)
  }
}

const edges: Array<[number, number]> = []
const seen = new Set<string>()
for (let i = 0; i < dots.length; i += 1) {
  const nearest: Array<{ j: number; d: number }> = []
  for (let j = 0; j < dots.length; j += 1) {
    if (i === j) continue
    const d = Math.hypot(dots[i].x - dots[j].x, dots[i].y - dots[j].y)
    if (d > 38) continue
    nearest.push({ j, d })
  }
  nearest.sort((a, b) => a.d - b.d)
  for (const link of nearest.slice(0, 2)) {
    const key = i < link.j ? `${i}-${link.j}` : `${link.j}-${i}`
    if (seen.has(key)) continue
    seen.add(key)
    edges.push([i, link.j])
  }
}

const silhouette = `${outline
  .map(([lon, lat], index) => {
    const [x, y] = project(lon, lat)
    return `${index === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`
  })
  .join(" ")} Z`

const statePoints = states.map((state) => {
  const [x, y] = project(state.lon, state.lat)
  return { ...state, x, y }
})

const stateByName = Object.fromEntries(statePoints.map((state) => [state.name, state]))

export function IntelligenceMap({ className }: { className?: string }) {
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      fill="none"
      role="group"
      aria-label="A network of nodes across the map of Nigeria"
    >
      <path
        d={silhouette}
        className="fill-signal/8 stroke-signal/70"
        strokeWidth="1.35"
        strokeLinejoin="round"
      />
      {edges.map(([a, b]) => (
        <line
          key={`${a}-${b}`}
          x1={dots[a].x}
          y1={dots[a].y}
          x2={dots[b].x}
          y2={dots[b].y}
          className="stroke-signal/40"
          strokeWidth="0.75"
        />
      ))}
      {routes.map(([from, to]) => {
        const a = stateByName[from]
        const b = stateByName[to]
        return (
          <line
            key={`${from}-${to}`}
            x1={a.x}
            y1={a.y}
            x2={b.x}
            y2={b.y}
            className="hero-route stroke-signal"
            strokeWidth="1.15"
          />
        )
      })}
      {dots.map((dot, index) => (
        <circle
          key={index}
          cx={dot.x}
          cy={dot.y}
          r="1.45"
          className="fill-signal/85"
        />
      ))}
      {statePoints.map((state) => (
        <g key={state.name} className="hero-hub" tabIndex={0} aria-label={state.name}>
          <circle cx={state.x} cy={state.y} r="22" className="fill-transparent" />
          <circle
            cx={state.x}
            cy={state.y}
            r="9"
            className="hero-pulse fill-none stroke-signal"
            strokeWidth="1.2"
          />
          <circle
            cx={state.x}
            cy={state.y}
            r="9"
            className="fill-none stroke-signal/70"
            strokeWidth="1"
          />
          <circle cx={state.x} cy={state.y} r="3" className="fill-signal" />
          <text
            x={state.x + state.label[0]}
            y={state.y + state.label[1]}
            textAnchor={state.anchor}
            className="fill-foreground/80 font-mono text-[11px] tracking-[0.16em] uppercase"
          >
            {state.name}
          </text>
        </g>
      ))}
    </svg>
  )
}
