"use client"

import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion"
import { Focus, History, Telescope, type LucideIcon } from "lucide-react"
import { useRef } from "react"

import { SectionHeading } from "@/components/shared/section-heading"
import { method } from "@/lib/content"

const icons: Record<(typeof method.stages)[number]["icon"], LucideIcon> = {
  history: History,
  focus: Focus,
  telescope: Telescope,
}

export function Method() {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 72%", "end 55%"],
  })
  const smooth = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 28,
    mass: 0.35,
  })

  return (
    <section
      id="method"
      ref={ref}
      className="scroll-mt-24 border-t border-border"
    >
      <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24 lg:py-32">
        <SectionHeading
          index={method.index}
          title={method.title}
          description={method.description}
        />

        <div className="relative mt-16 hidden lg:block">
          <div className="absolute top-5 right-[16%] left-[16%] h-px bg-border" />
          <motion.div
            style={{ scaleX: reduce ? 1 : smooth }}
            className="absolute top-5 right-[16%] left-[16%] h-px origin-left bg-signal"
          />
          <ol className="grid grid-cols-3 gap-8">
            {method.stages.map((stage) => (
              <Stage key={stage.id} stage={stage} />
            ))}
          </ol>
        </div>

        <div className="relative mt-12 lg:hidden">
          <div className="absolute top-5 bottom-5 left-5 w-px bg-border" />
          <motion.div
            style={{ scaleY: reduce ? 1 : smooth }}
            className="absolute top-5 bottom-5 left-5 w-px origin-top bg-signal"
          />
          <ol className="space-y-10">
            {method.stages.map((stage) => (
              <Stage key={stage.id} stage={stage} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

function Stage({ stage }: { stage: (typeof method.stages)[number] }) {
  const Icon = icons[stage.icon]
  return (
    <li className="relative pl-14 lg:pl-0">
      <div className="absolute top-0 left-0 flex size-10 items-center justify-center rounded-full border border-border bg-background lg:static lg:mx-auto lg:mb-5">
        <span className="font-mono text-[10px] tracking-[0.16em] text-signal">
          {stage.number}
        </span>
      </div>
      <div className="lg:text-center">
        <Icon className="mb-3 size-4 text-signal lg:mx-auto" aria-hidden />
        <h3 className="text-xl font-medium tracking-tight">{stage.title}</h3>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground lg:mx-auto lg:max-w-[28ch]">
          {stage.description}
        </p>
      </div>
    </li>
  )
}
