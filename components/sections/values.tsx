"use client"

import {
  ArrowDown,
  Cpu,
  Crosshair,
  Gauge,
  Lock,
  Map,
  type LucideIcon,
} from "lucide-react"

import { Reveal } from "@/components/shared/reveal"
import { SectionHeading } from "@/components/shared/section-heading"
import { values } from "@/lib/content"
import { cn } from "@/lib/utils"

const icons: Record<(typeof values.items)[number]["icon"], LucideIcon> = {
  crosshair: Crosshair,
  map: Map,
  cpu: Cpu,
  lock: Lock,
  gauge: Gauge,
}

const count = values.items.length
/** Station / arc ring */
const RING = 37.5
const ARC_RING = 37.5
const STEP_DEG = 360 / count

type Pt = { x: number; y: number }

function stationAngleDeg(index: number) {
  return -90 + STEP_DEG * index
}

function polar(angleDeg: number, radius = RING): Pt {
  const a = (angleDeg * Math.PI) / 180
  return {
    x: 50 + radius * Math.cos(a),
    y: 50 + radius * Math.sin(a),
  }
}

function stationStyle(index: number) {
  const { x, y } = polar(stationAngleDeg(index))
  return {
    left: `${x}%`,
    top: `${y}%`,
  }
}

// Bounding box of the card in viewBox units (0-100)
const CARD_HW = 11.2
const CARD_HH = 13.0
// Equal clearance on BOTH sides of the arrow from card boundaries
const ARROW_CLEARANCE_DEG = 5.0

function getCardExitAngle(index: number): number {
  const theta = stationAngleDeg(index)
  const center = polar(theta, RING)
  for (let phi = theta; phi <= theta + 72; phi += 0.05) {
    const pt = polar(phi, ARC_RING)
    if (Math.abs(pt.x - center.x) > CARD_HW || Math.abs(pt.y - center.y) > CARD_HH) {
      return phi
    }
  }
  return theta + 16
}

function getCardEnterAngle(index: number): number {
  const theta = stationAngleDeg(index)
  const center = polar(theta, RING)
  for (let phi = theta; phi >= theta - 72; phi -= 0.05) {
    const pt = polar(phi, ARC_RING)
    if (Math.abs(pt.x - center.x) > CARD_HW || Math.abs(pt.y - center.y) > CARD_HH) {
      return phi
    }
  }
  return theta - 16
}

type Connector = {
  startDeg: number
  endDeg: number
  d: string
  tip: Pt
  wings: Pt[]
}

function computeConnectors(): Connector[] {
  return values.items.map((_, index) => {
    const nextIndex = (index + 1) % count
    const exitAngle = getCardExitAngle(index)
    let enterAngle = getCardEnterAngle(nextIndex)
    if (enterAngle < exitAngle) enterAngle += 360

    const startDeg = exitAngle + ARROW_CLEARANCE_DEG
    const endDeg = enterAngle - ARROW_CLEARANCE_DEG

    const start = polar(startDeg, ARC_RING)
    const end = polar(endDeg, ARC_RING)

    const tipRad = (endDeg * Math.PI) / 180
    const tangent = tipRad + Math.PI / 2
    const head = 2.4
    const wing = 1.6
    const bx = end.x - Math.cos(tangent) * head
    const by = end.y - Math.sin(tangent) * head

    return {
      startDeg,
      endDeg,
      d: `M ${start.x.toFixed(2)} ${start.y.toFixed(2)} A ${ARC_RING} ${ARC_RING} 0 0 1 ${end.x.toFixed(2)} ${end.y.toFixed(2)}`,
      tip: end,
      wings: [
        {
          x: bx + Math.cos(tangent + 1.4) * wing,
          y: by + Math.sin(tangent + 1.4) * wing,
        },
        {
          x: bx + Math.cos(tangent - 1.4) * wing,
          y: by + Math.sin(tangent - 1.4) * wing,
        },
      ],
    }
  })
}

const connectors = computeConnectors()

function StationCard({
  item,
  compact = false,
}: {
  item: (typeof values.items)[number]
  compact?: boolean
}) {
  const Icon = icons[item.icon]

  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card/95 text-center shadow-[0_18px_50px_-32px_rgba(14,26,46,0.4)] backdrop-blur-sm transition duration-300 ease-out dark:shadow-none",
        compact
          ? "flex h-[11.25rem] flex-col justify-between px-3.5 pt-3 pb-4 group-hover:scale-[1.05] group-hover:border-signal/45 group-hover:shadow-[0_22px_55px_-28px_rgba(14,26,46,0.55)]"
          : "p-4 text-left sm:text-center"
      )}
    >
      <div>
        <div
          className={cn(
            "flex items-center justify-center rounded-full border border-signal/35 bg-background",
            compact ? "mx-auto size-9" : "size-10 sm:mx-auto"
          )}
        >
          <Icon className="size-3.5 text-signal" aria-hidden />
        </div>
        <p
          className={cn(
            "font-mono tracking-[0.18em] text-muted-foreground",
            compact ? "mt-1.5 text-[10px]" : "mt-3 text-[11px]"
          )}
        >
          {item.number}
        </p>
        <h3
          className={cn(
            "leading-snug font-medium tracking-tight",
            compact ? "mt-1 text-[13px]" : "mt-2 text-base"
          )}
        >
          {item.title}
        </h3>
      </div>
      <p
        className={cn(
          "leading-relaxed text-muted-foreground",
          compact ? "mt-1 text-[10.5px] px-0.5" : "mt-2 text-sm"
        )}
      >
        {item.description}
      </p>
    </div>
  )
}

export function Values() {
  return (
    <section id="values" className="scroll-mt-24 border-t border-border">
      <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24 lg:py-32">
        <Reveal>
          <SectionHeading index={values.index} title={values.title} />
        </Reveal>

        {/* Desktop: operating cycle */}
        <Reveal className="mt-10 hidden lg:block xl:mt-12">
          <div className="relative mx-auto aspect-square w-full max-w-[42rem] overflow-visible xl:max-w-[46rem]">
            {/* Arrows sit behind the cards */}
            <svg
              viewBox="0 0 100 100"
              className="pointer-events-none absolute inset-0 z-0 h-full w-full overflow-visible"
              aria-hidden
            >
              <defs>
                <radialGradient id="values-center-fade" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="var(--signal)" stopOpacity="0.08" />
                  <stop offset="100%" stopColor="var(--signal)" stopOpacity="0" />
                </radialGradient>
              </defs>

              <circle cx="50" cy="50" r="19" fill="url(#values-center-fade)" />
              <circle
                cx="50"
                cy="50"
                r="19"
                className="fill-none stroke-border"
                strokeWidth="0.6"
                strokeDasharray="1.2 2.6"
              />

              {connectors.map(({ d, tip, wings }, index) => (
                <g key={`connector-${index}`}>
                  <path
                    d={d}
                    className="fill-none stroke-signal/70"
                    strokeWidth="0.7"
                    strokeLinecap="round"
                  />
                  <polygon
                    points={`${tip.x.toFixed(2)},${tip.y.toFixed(2)} ${wings[0].x.toFixed(2)},${wings[0].y.toFixed(2)} ${wings[1].x.toFixed(2)},${wings[1].y.toFixed(2)}`}
                    className="fill-signal"
                  />
                </g>
              ))}
            </svg>

            <div className="pointer-events-none absolute top-1/2 left-1/2 z-[1] w-40 -translate-x-1/2 -translate-y-1/2 text-center">
              <p className="font-mono text-[10px] tracking-[0.22em] text-signal uppercase">
                Operating cycle
              </p>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground text-pretty">
                Five disciplines. One continuous way of working.
              </p>
            </div>

            <ol className="absolute inset-0 z-[2]">
              {values.items.map((item, index) => (
                <li
                  key={item.number}
                  className="group absolute z-[2] w-[9.25rem] -translate-x-1/2 -translate-y-1/2 hover:z-20 xl:w-[10rem]"
                  style={stationStyle(index)}
                >
                  <StationCard item={item} compact />
                </li>
              ))}
            </ol>
          </div>
        </Reveal>

        {/* Tablet / phone: vertical cycle */}
        <ol className="relative mt-12 space-y-0 lg:hidden">
          <div
            aria-hidden
            className="absolute top-5 bottom-5 left-5 w-px bg-border"
          />
          {values.items.map((item, index) => {
            const Icon = icons[item.icon]
            const isLast = index === values.items.length - 1
            return (
              <li key={item.number} className="relative pl-14">
                <div className="absolute top-0 left-0 flex size-10 items-center justify-center rounded-full border border-signal/40 bg-background">
                  <Icon className="size-3.5 text-signal" aria-hidden />
                </div>
                <StationCard item={item} />
                {!isLast ? (
                  <div aria-hidden className="my-2 flex text-signal/70">
                    <ArrowDown className="ml-[-2.15rem] size-4" />
                  </div>
                ) : null}
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
