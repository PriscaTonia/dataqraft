import {
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

export function Values() {
  return (
    <section id="values" className="scroll-mt-24 border-t border-border">
      <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24 lg:py-32">
        <Reveal>
          <SectionHeading index={values.index} title={values.title} />
        </Reveal>
        <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {values.items.map((item, index) => {
            const Icon = icons[item.icon]
            const highlighted = "highlight" in item && item.highlight
            return (
              <Reveal
                key={item.number}
                delay={index * 0.06}
                className="h-full lg:col-span-2 lg:nth-4:col-start-2 lg:nth-5:col-start-4"
              >
                <li
                  className={cn(
                    "h-full rounded-2xl border border-border bg-card p-5 shadow-[0_18px_50px_-32px_rgba(14,26,46,0.4)] dark:shadow-none",
                    highlighted && "border-amber/40"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.18em] text-muted-foreground">
                      {highlighted ? (
                        <span aria-hidden className="size-1.5 rounded-full bg-amber" />
                      ) : null}
                      {item.number}
                    </span>
                    <Icon className="size-4 text-signal" aria-hidden />
                  </div>
                  <h3 className="mt-8 text-base leading-snug font-medium tracking-tight">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </li>
              </Reveal>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
