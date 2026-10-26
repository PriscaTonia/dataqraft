import { cn } from "@/lib/utils"

export const INQUIRY_STATUS_META: Record<
  string,
  { label: string; badgeClass: string; dotClass: string }
> = {
  new: {
    label: "New",
    badgeClass: "border-signal/40 bg-signal/10 text-signal",
    dotClass: "bg-signal animate-pulse",
  },
  "in-review": {
    label: "In Review",
    badgeClass: "border-amber/40 bg-amber/10 text-amber",
    dotClass: "bg-amber",
  },
  contacted: {
    label: "Contacted",
    badgeClass: "border-emerald-500/40 bg-emerald-500/10 text-emerald-400",
    dotClass: "bg-emerald-400",
  },
  archived: {
    label: "Closed",
    badgeClass: "border-muted-foreground/30 bg-muted/40 text-muted-foreground",
    dotClass: "bg-muted-foreground",
  },
}

export const INTEREST_LABELS: Record<string, string> = {
  market: "Market & Consumer Insights",
  political: "Political Intelligence & Statecraft",
  digital: "Digital Sentiment & Brand Tracking",
  other: "General Enquiry",
}

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  const meta = INQUIRY_STATUS_META[status] ?? INQUIRY_STATUS_META.new
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[11px] whitespace-nowrap",
        meta.badgeClass,
        className
      )}
    >
      <span className={cn("size-1.5 rounded-full", meta.dotClass)} />
      {meta.label}
    </span>
  )
}
