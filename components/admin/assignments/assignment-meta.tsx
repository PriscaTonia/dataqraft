import { formatDateTime } from "@/lib/datetime"
import { cn } from "@/lib/utils"

export const STATUS_META: Record<string, { label: string; badgeClass: string; dotClass: string }> = {
  "not-started": {
    label: "Not Started",
    badgeClass: "border-muted-foreground/30 bg-muted/40 text-muted-foreground",
    dotClass: "bg-muted-foreground",
  },
  "in-progress": {
    label: "In Progress",
    badgeClass: "border-signal/40 bg-signal/10 text-signal",
    dotClass: "bg-signal animate-pulse",
  },
  "in-review": {
    label: "In Review",
    badgeClass: "border-amber/40 bg-amber/10 text-amber",
    dotClass: "bg-amber",
  },
  submitted: {
    label: "Submitted",
    badgeClass: "border-emerald-500/40 bg-emerald-500/10 text-emerald-400",
    dotClass: "bg-emerald-400",
  },
}

export const PRIORITY_META: Record<string, { label: string; badgeClass: string }> = {
  low: { label: "Low", badgeClass: "border-border bg-muted/40 text-muted-foreground" },
  medium: { label: "Medium", badgeClass: "border-amber/40 bg-amber/10 text-amber" },
  high: { label: "High", badgeClass: "border-destructive/40 bg-destructive/10 text-destructive" },
}

export const CATEGORY_COLOR_CLASSES: Record<string, string> = {
  signal: "border-signal/40 bg-signal/10 text-signal",
  amber: "border-amber/40 bg-amber/10 text-amber",
  emerald: "border-emerald-500/40 bg-emerald-500/10 text-emerald-400",
  rose: "border-rose-500/40 bg-rose-500/10 text-rose-400",
  violet: "border-violet-500/40 bg-violet-500/10 text-violet-400",
  slate: "border-muted-foreground/30 bg-muted/40 text-muted-foreground",
}

export function AssignmentStatusBadge({ status, className }: { status: string; className?: string }) {
  const meta = STATUS_META[status] ?? STATUS_META["not-started"]
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

export function PriorityBadge({ priority, className }: { priority: string; className?: string }) {
  const meta = PRIORITY_META[priority] ?? PRIORITY_META.medium
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-[11px] uppercase whitespace-nowrap",
        meta.badgeClass,
        className
      )}
    >
      {meta.label}
    </span>
  )
}

export function CategoryBadge({
  name,
  color,
  className,
}: {
  name: string
  color: string
  className?: string
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-[11px] whitespace-nowrap",
        CATEGORY_COLOR_CLASSES[color] ?? CATEGORY_COLOR_CLASSES.signal,
        className
      )}
    >
      {name || "Uncategorized"}
    </span>
  )
}

export function DueDateCell({ dueDate, submitted }: { dueDate: string | null; submitted?: boolean }) {
  if (!dueDate) {
    return <span className="text-muted-foreground">—</span>
  }

  const due = new Date(dueDate)
  const now = new Date()
  const diffMs = due.getTime() - now.getTime()
  const diffDays = Math.round(diffMs / (24 * 60 * 60 * 1000))
  const overdue = !submitted && diffMs < 0
  const dueSoon = !submitted && diffMs >= 0 && diffDays <= 7

  return (
    <div
      className={cn(
        "font-mono text-xs",
        overdue ? "text-destructive" : dueSoon ? "text-amber" : "text-muted-foreground"
      )}
    >
      {formatDateTime(dueDate)}
      {overdue ? (
        <span className="block text-[11px]">
          Overdue {Math.abs(diffDays) || "<1"}d
        </span>
      ) : dueSoon ? (
        <span className="block text-[11px]">{diffDays <= 0 ? "Due today" : `Due in ${diffDays}d`}</span>
      ) : null}
    </div>
  )
}
