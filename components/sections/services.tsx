import { LineChart, Landmark, Radio, type LucideIcon } from "lucide-react"

import { Reveal } from "@/components/shared/reveal"
import { SectionHeading } from "@/components/shared/section-heading"
import { SpotlightCard } from "@/components/shared/spotlight-card"
import { services } from "@/lib/content"

const icons: Record<(typeof services.items)[number]["icon"], LucideIcon> = {
  chart: LineChart,
  landmark: Landmark,
  radio: Radio,
}

export function Services() {
  return (
    <section id="services" className="scroll-mt-24 border-t border-border">
      <div className="mx-auto max-w-6xl px-5 py-24 md:px-8 md:py-32">
        <Reveal>
          <SectionHeading
            index={services.index}
            title={services.title}
            description={services.description}
          />
        </Reveal>
        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          {services.items.map((item, index) => {
            const Icon = icons[item.icon]
            return (
              <Reveal key={item.id} delay={index * 0.08}>
                <SpotlightCard className="h-full">
                  <article className="flex h-full flex-col p-7">
                    <div className="flex items-center justify-between">
                      <p className="font-mono text-[11px] tracking-[0.22em] text-muted-foreground uppercase">
                        {item.index}
                      </p>
                      <Icon className="size-4 text-signal" aria-hidden />
                    </div>
                    <h3 className="mt-8 text-xl leading-snug font-medium tracking-tight">
                      {item.title}
                    </h3>
                    <p className="mt-4 text-sm leading-[1.7] text-muted-foreground">
                      {item.description}
                    </p>
                    <ul className="mt-6 flex flex-wrap gap-2">
                      {item.tags.map((tag) => (
                        <li
                          key={tag}
                          className="font-mono text-[10px] tracking-[0.16em] text-muted-foreground uppercase"
                        >
                          {tag}
                        </li>
                      ))}
                    </ul>
                    <span
                      aria-hidden
                      className="mt-auto block h-px w-10 bg-signal transition-all duration-500 group-hover:w-full"
                    />
                  </article>
                </SpotlightCard>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
