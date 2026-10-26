"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AssignmentStatusBadge,
  CategoryBadge,
  PriorityBadge,
} from "@/components/admin/assignments/assignment-meta"
import { formatDateTime } from "@/lib/datetime"
import type { AssignmentRow } from "@/lib/assignments-data"

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="font-mono text-[11px] text-muted-foreground uppercase tracking-wider">
        {label}
      </p>
      <div className="mt-1 text-sm text-foreground">{value || <span className="text-muted-foreground">—</span>}</div>
    </div>
  )
}

export function AssignmentViewDialog({
  assignment,
  onOpenChange,
}: {
  assignment: AssignmentRow | null
  onOpenChange: (open: boolean) => void
}) {
  return (
    <Dialog open={Boolean(assignment)} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        {assignment ? (
          <div className="space-y-6">
            <DialogHeader>
              <span className="font-mono text-[11px] tracking-wider text-signal uppercase">
                Assignment #{assignment.id}
              </span>
              <DialogTitle className="text-lg font-medium tracking-tight">
                {assignment.description}
              </DialogTitle>
              <DialogDescription className="sr-only">
                Full details for this assignment.
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-wrap items-center gap-2">
              <CategoryBadge name={assignment.categoryName} color={assignment.categoryColor} />
              <AssignmentStatusBadge status={assignment.status} />
              <PriorityBadge priority={assignment.priority} />
            </div>

            <div className="grid grid-cols-2 gap-4 rounded-xl border border-border bg-background/50 p-4">
              <Field label="Value" value={assignment.value} />
              <Field label="Entity" value={assignment.entity} />
              <Field label="Assigned To" value={assignment.assignedTo} />
              <Field label="Contact" value={assignment.contact} />
              <Field label="Due Date" value={formatDateTime(assignment.dueDate)} />
              <Field label="Created" value={formatDateTime(assignment.createdAt)} />
            </div>

            <Field
              label="Remark"
              value={
                assignment.remark ? (
                  <p className="leading-relaxed whitespace-pre-wrap">{assignment.remark}</p>
                ) : null
              }
            />
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
