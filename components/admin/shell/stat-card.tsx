import type { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

export function StatCard({
  label,
  value,
  caption,
  hint,
  icon: Icon,
  tone = "signal",
}: {
  label: string
  value: React.ReactNode
  caption?: string
  hint?: string
  icon: LucideIcon
  tone?: "signal" | "amber" | "neutral" | "success"
}) {
  const toneClass = {
    signal: "border-signal/30 bg-signal/10 text-signal",
    amber: "border-amber/30 bg-amber/10 text-amber",
    neutral: "border-border bg-secondary text-foreground",
    success: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  }[tone]

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:border-signal/30">
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
          {label}
        </span>
        <div className={cn("flex size-8 items-center justify-center rounded-lg border", toneClass)}>
          <Icon className="size-4" />
        </div>
      </div>
      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-3xl font-medium tracking-tight text-foreground">{value}</span>
        {caption ? <span className="font-mono text-[11px] text-signal">{caption}</span> : null}
      </div>
      {hint ? <div className="mt-2 text-xs text-muted-foreground">{hint}</div> : null}
    </div>
  )
}
