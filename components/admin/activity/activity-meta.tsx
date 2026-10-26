import { cn } from "@/lib/utils"

export const ACTION_META: Record<string, { label: string; badgeClass: string }> = {
  login: { label: "Login", badgeClass: "border-signal/40 bg-signal/10 text-signal" },
  create: { label: "Created", badgeClass: "border-emerald-500/40 bg-emerald-500/10 text-emerald-400" },
  update: { label: "Updated", badgeClass: "border-amber/40 bg-amber/10 text-amber" },
  delete: { label: "Deleted", badgeClass: "border-destructive/40 bg-destructive/10 text-destructive" },
  deactivate: { label: "Deactivated", badgeClass: "border-destructive/40 bg-destructive/10 text-destructive" },
  reactivate: { label: "Reactivated", badgeClass: "border-emerald-500/40 bg-emerald-500/10 text-emerald-400" },
  "reset-password": { label: "Password Reset", badgeClass: "border-amber/40 bg-amber/10 text-amber" },
}

export const ENTITY_LABEL: Record<string, string> = {
  session: "Session",
  assignment: "Assignment",
  category: "Category",
  inquiry: "Inquiry",
  admin: "Admin",
  profile: "Profile",
}

export function ActionBadge({ action, className }: { action: string; className?: string }) {
  const meta = ACTION_META[action] ?? { label: action, badgeClass: "border-border bg-muted/40 text-muted-foreground" }
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-[11px] whitespace-nowrap",
        meta.badgeClass,
        className
      )}
    >
      {meta.label}
    </span>
  )
}

export function EntityBadge({ entityType, className }: { entityType: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-border bg-muted/40 px-2.5 py-0.5 font-mono text-[11px] text-muted-foreground whitespace-nowrap",
        className
      )}
    >
      {ENTITY_LABEL[entityType] ?? entityType}
    </span>
  )
}
