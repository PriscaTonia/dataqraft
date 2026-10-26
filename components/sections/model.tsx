import { Heart, Scale, Target, type LucideIcon } from "lucide-react"

import { Reveal } from "@/components/shared/reveal"
import { SectionHeading } from "@/components/shared/section-heading"
import { model } from "@/lib/content"

const icons: Record<(typeof model.pillars)[number]["icon"], LucideIcon> = {
  scale: Scale,
  target: Target,
  heart: Heart,
}

export function Model() {
  return (
    <section id="model" className="scroll-mt-24 border-t border-border">
      <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24 lg:py-32">
        <Reveal>
          <SectionHeading index={model.index} title={model.title} />
        </Reveal>
        <div className="mt-12 grid gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <h3 className="text-xl font-medium tracking-tight">
              {model.revenueTitle}
            </h3>
            <p className="mt-4 max-w-[62ch] text-base leading-[1.7] text-muted-foreground">
              {model.revenue}
            </p>
            <ol className="mt-8 space-y-4">
              {model.revenueItems.map((item, index) => (
                <li key={item} className="flex gap-4 border-t border-border pt-4">
                  <span className="font-mono text-[11px] tracking-[0.18em] text-signal">
                    0{index + 1}
                  </span>
                  <p className="text-sm leading-relaxed">{item}</p>
                </li>
              ))}
            </ol>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="rounded-2xl border border-border bg-secondary/70 p-6 md:p-8">
              <h3 className="text-xl font-medium tracking-tight">
                {model.selectionTitle}
              </h3>
              <p className="mt-4 text-base leading-[1.7] text-muted-foreground">
                {model.selection}
              </p>
              <ol className="mt-8 grid gap-3">
                {model.pillars.map((pillar, index) => {
                  const Icon = icons[pillar.icon]
                  return (
                    <li
                      key={pillar.title}
                      className="flex items-start gap-4 rounded-xl border border-border bg-card px-4 py-4"
                    >
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border">
                        <Icon className="size-4 text-signal" aria-hidden />
                      </span>
                      <div>
                        <p className="font-mono text-[10px] tracking-[0.18em] text-muted-foreground">
                          Pillar 0{index + 1}
                        </p>
                        <p className="mt-1 text-base font-medium tracking-tight">
                          {pillar.title}
                        </p>
                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                          {pillar.description}
                        </p>
                      </div>
                    </li>
                  )
                })}
              </ol>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
