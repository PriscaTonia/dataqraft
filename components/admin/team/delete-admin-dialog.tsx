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
import { deleteAdminUserAction } from "@/lib/admin-actions"
import type { AdminRow } from "@/lib/admin-data"

export function DeleteAdminDialog({
  admin,
  onOpenChange,
  onDeleted,
}: {
  admin: AdminRow | null
  onOpenChange: (open: boolean) => void
  onDeleted: (id: string | number) => void
}) {
  const [isPending, startTransition] = useTransition()

  function handleDelete() {
    if (!admin) return
    startTransition(async () => {
      const result = await deleteAdminUserAction(admin.id)
      if ("error" in result) {
        toast.error(result.error)
        return
      }
      toast.success("Administrator deleted.")
      onDeleted(admin.id)
    })
  }

  return (
    <AlertDialog open={Boolean(admin)} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        {admin ? (
          <>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete {admin.name}?</AlertDialogTitle>
              <AlertDialogDescription>
                This permanently removes @{admin.username} and revokes their access to the admin
                console. This cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                variant="destructive"
                disabled={isPending}
                onClick={handleDelete}
              >
                Delete administrator
              </AlertDialogAction>
            </AlertDialogFooter>
          </>
        ) : null}
      </AlertDialogContent>
    </AlertDialog>
  )
}
