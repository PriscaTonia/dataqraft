"use client"

import { useRef } from "react"

import { cn } from "@/lib/utils"

export function SpotlightCard({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  function onMove(event: React.MouseEvent<HTMLDivElement>) {
    const node = ref.current
    if (!node) return
    const rect = node.getBoundingClientRect()
    node.style.setProperty("--spot-x", `${event.clientX - rect.left}px`)
    node.style.setProperty("--spot-y", `${event.clientY - rect.top}px`)
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-[0_18px_50px_-32px_rgba(14,26,46,0.45)] transition duration-300 hover:-translate-y-0.5 hover:border-signal/40 dark:shadow-none",
        className
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(380px circle at var(--spot-x, 50%) var(--spot-y, 0%), color-mix(in oklch, var(--signal) 14%, transparent), transparent 46%)",
        }}
      />
      <div className="relative h-full">{children}</div>
    </div>
  )
}
