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
import { deleteCategoryAction } from "@/lib/assignments-actions"
import type { CategoryRow } from "@/lib/assignments-data"

export function DeleteCategoryDialog({
  category,
  onOpenChange,
  onDeleted,
}: {
  category: CategoryRow | null
  onOpenChange: (open: boolean) => void
  onDeleted: (id: string | number) => void
}) {
  const [isPending, startTransition] = useTransition()

  function handleDelete() {
    if (!category) return
    startTransition(async () => {
      const result = await deleteCategoryAction(category.id)
      if ("error" in result) {
        toast.error(result.error)
        return
      }
      toast.success("Category deleted.")
      onDeleted(category.id)
    })
  }

  return (
    <AlertDialog open={Boolean(category)} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        {category ? (
          <>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete &ldquo;{category.name}&rdquo;?</AlertDialogTitle>
              <AlertDialogDescription>
                This cannot be undone. Categories in use by existing assignments cannot be
                deleted until those assignments are reassigned or removed.
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
