"use client"

import { useTransition } from "react"
import { toast } from "sonner"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { deleteAssignmentAction } from "@/lib/assignments-actions"
import type { AssignmentRow } from "@/lib/assignments-data"

export function DeleteAssignmentDialog({
  assignment,
  onOpenChange,
  onDeleted,
}: {
  assignment: AssignmentRow | null
  onOpenChange: (open: boolean) => void
  onDeleted: (id: string | number) => void
}) {
  const [isPending, startTransition] = useTransition()

  function handleDelete() {
    if (!assignment) return
    startTransition(async () => {
      const result = await deleteAssignmentAction(assignment.id)
      if ("error" in result) {
        toast.error(result.error)
        return
      }
      toast.success("Assignment deleted.")
      onDeleted(assignment.id)
    })
  }

  return (
    <AlertDialog open={Boolean(assignment)} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        {assignment ? (
          <>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this assignment?</AlertDialogTitle>
              <AlertDialogDescription>
                This permanently removes &ldquo;{assignment.description.slice(0, 80)}
                {assignment.description.length > 80 ? "…" : ""}&rdquo;. This cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction variant="destructive" disabled={isPending} onClick={handleDelete}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </>
        ) : null}
      </AlertDialogContent>
    </AlertDialog>
  )
}
