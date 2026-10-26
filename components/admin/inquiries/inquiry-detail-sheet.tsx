"use client"

import { useState, useTransition } from "react"
import { Mail, Trash2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  INQUIRY_STATUS_META,
  INTEREST_LABELS,
  StatusBadge,
} from "@/components/admin/inquiries/status-badge"
import { deleteInquiryAction, updateInquiryStatusAction } from "@/lib/admin-actions"
import type { InquiryRow } from "@/lib/admin-data"
import { cn } from "@/lib/utils"

const STATUSES = ["new", "in-review", "contacted", "archived"] as const

export function InquiryDetailSheet({
  inquiry,
  canManage,
  onClose,
  onUpdated,
  onDeleted,
}: {
  inquiry: InquiryRow | null
  canManage: boolean
  onClose: () => void
  onUpdated: (row: InquiryRow) => void
  onDeleted: (id: string | number) => void
}) {
  const [notes, setNotes] = useState(inquiry?.internalNotes ?? "")
  const [isPending, startTransition] = useTransition()

  const [prevInquiry, setPrevInquiry] = useState(inquiry)
  if (inquiry !== prevInquiry) {
    setPrevInquiry(inquiry)
    setNotes(inquiry?.internalNotes ?? "")
  }

  function handleStatusChange(status: (typeof STATUSES)[number]) {
    if (!inquiry) return
    startTransition(async () => {
      const result = await updateInquiryStatusAction(inquiry.id, status, notes)
      if ("success" in result) {
        onUpdated({ ...inquiry, status, internalNotes: notes })
        toast.success("Status updated.")
      } else {
        toast.error(result.error)
      }
    })
  }

  function handleSaveNotes() {
    if (!inquiry) return
    startTransition(async () => {
      const result = await updateInquiryStatusAction(
        inquiry.id,
        inquiry.status as (typeof STATUSES)[number],
        notes
      )
      if ("success" in result) {
        onUpdated({ ...inquiry, internalNotes: notes })
        toast.success("Internal notes saved.")
      } else {
        toast.error(result.error)
      }
    })
  }

  function handleDelete() {
    if (!inquiry) return
    startTransition(async () => {
      const result = await deleteInquiryAction(inquiry.id)
      if ("success" in result) {
        onDeleted(inquiry.id)
        toast.success("Inquiry deleted.")
      } else {
        toast.error(result.error)
      }
    })
  }

  return (
    <Sheet open={Boolean(inquiry)} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-full overflow-y-auto bg-card p-6 sm:max-w-lg">
        {inquiry ? (
          <div className="space-y-6">
            <SheetHeader className="text-left">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] tracking-wider text-signal uppercase">
                  Briefing Request #{inquiry.id}
                </span>
                {canManage ? (
                  <AlertDialog>
                    <AlertDialogTrigger
                      render={
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="text-destructive hover:bg-destructive/10"
                        />
                      }
                    >
                      <Trash2 className="size-4" />
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete this inquiry?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This permanently removes the briefing request from {inquiry.name}. This
                          cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction variant="destructive" onClick={handleDelete}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                ) : null}
              </div>
              <SheetTitle className="text-xl font-medium tracking-tight">
                {inquiry.name}
              </SheetTitle>
              <SheetDescription className="text-sm">{inquiry.organization}</SheetDescription>
            </SheetHeader>

            <div className="rounded-xl border border-border bg-background/50 p-4 space-y-2">
              <div className="font-mono text-[11px] text-muted-foreground uppercase tracking-wider">
                Engagement status
              </div>
              {canManage ? (
                <div className="flex flex-wrap gap-2">
                  {STATUSES.map((status) => (
                    <button
                      key={status}
                      type="button"
                      disabled={isPending}
                      onClick={() => handleStatusChange(status)}
                      className={cn(
                        "rounded-lg border px-3 py-1.5 font-mono text-sm transition",
                        inquiry.status === status
                          ? "border-signal bg-signal/15 font-medium text-signal"
                          : "border-border bg-background text-muted-foreground hover:border-signal/50"
                      )}
                    >
                      {INQUIRY_STATUS_META[status]?.label ?? status}
                    </button>
                  ))}
                </div>
              ) : (
                <StatusBadge status={inquiry.status} />
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl border border-border bg-background/50 p-3">
                <span className="text-[11px] font-mono text-muted-foreground uppercase">
                  Email
                </span>
                <a
                  href={`mailto:${inquiry.email}`}
                  className="mt-1 flex items-center gap-1 font-medium text-signal hover:underline"
                >
                  <Mail className="size-3 shrink-0" />
                  <span className="truncate">{inquiry.email}</span>
                </a>
              </div>
              <div className="rounded-xl border border-border bg-background/50 p-3">
                <span className="text-[11px] font-mono text-muted-foreground uppercase">
                  Practice area
                </span>
                <p className="mt-1 font-medium text-foreground">
                  {INTEREST_LABELS[inquiry.interest] ?? inquiry.interest}
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-background/50 p-4 space-y-2">
              <span className="text-[11px] font-mono text-muted-foreground uppercase">
                Briefing message
              </span>
              <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground">
                {inquiry.message}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-mono text-[11px] text-muted-foreground uppercase">
                  Internal notes
                </span>
                {canManage ? (
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={isPending}
                    onClick={handleSaveNotes}
                    className="h-7 text-sm"
                  >
                    Save notes
                  </Button>
                ) : null}
              </div>
              {canManage ? (
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  placeholder="Add confidential notes on this engagement, assigned analyst, follow-up timeline..."
                  className="w-full rounded-xl border border-border bg-background p-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus-visible:border-signal focus-visible:ring-3 focus-visible:ring-ring/50"
                />
              ) : (
                <p className="rounded-xl border border-border bg-background p-3 text-sm text-muted-foreground whitespace-pre-wrap">
                  {inquiry.internalNotes || "No internal notes yet."}
                </p>
              )}
            </div>

            <a
              href={`mailto:${inquiry.email}?subject=Data%20Qraft%20Limited%20%E2%80%94%20Strategic%20Briefing%20Follow-up`}
              className="flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-signal font-medium text-sm text-signal-foreground transition hover:bg-signal/90"
            >
              <Mail className="size-4" />
              Reply via email client
            </a>
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  )
}
