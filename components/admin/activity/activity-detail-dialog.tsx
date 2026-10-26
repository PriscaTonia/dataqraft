"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ActionBadge, EntityBadge } from "@/components/admin/activity/activity-meta"
import { formatDateTime } from "@/lib/datetime"
import type { ActivityLogRow } from "@/lib/activity-log-data"

function formatValue(value: unknown) {
  if (value === null || value === undefined || value === "") return "—"
  return String(value)
}

export function ActivityDetailDialog({
  log,
  onOpenChange,
}: {
  log: ActivityLogRow | null
  onOpenChange: (open: boolean) => void
}) {
  return (
    <Dialog open={Boolean(log)} onOpenChange={onOpenChange}>
      <DialogContent>
        {log ? (
          <div className="space-y-6">
            <DialogHeader>
              <div className="flex flex-wrap items-center gap-2">
                <ActionBadge action={log.action} />
                <EntityBadge entityType={log.entityType} />
              </div>
              <DialogTitle className="text-lg font-medium tracking-tight">
                {log.summary}
              </DialogTitle>
              <DialogDescription>
                {log.actorName} ({log.actorEmail}) · {formatDateTime(log.createdAt)}
              </DialogDescription>
            </DialogHeader>

            {log.entityLabel ? (
              <div className="rounded-xl border border-border bg-background/50 p-3">
                <p className="font-mono text-[11px] text-muted-foreground uppercase tracking-wider">
                  Affected record
                </p>
                <p className="mt-1 text-sm text-foreground">{log.entityLabel}</p>
              </div>
            ) : null}

            {log.changes && Object.keys(log.changes).length > 0 ? (
              <div className="space-y-2">
                <p className="font-mono text-[11px] text-muted-foreground uppercase tracking-wider">
                  Field changes
                </p>
                <div className="overflow-hidden rounded-xl border border-border">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-border bg-muted/40 font-mono text-[11px] text-muted-foreground uppercase">
                        <th className="px-3 py-2">Field</th>
                        <th className="px-3 py-2">Before</th>
                        <th className="px-3 py-2">After</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {Object.entries(log.changes).map(([field, change]) => (
                        <tr key={field}>
                          <td className="px-3 py-2 font-medium text-foreground capitalize">
                            {field}
                          </td>
                          <td className="px-3 py-2 text-muted-foreground">
                            {formatValue(change.from)}
                          </td>
                          <td className="px-3 py-2 text-foreground">{formatValue(change.to)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : null}
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
