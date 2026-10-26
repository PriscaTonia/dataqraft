"use client"

import { useState, useTransition } from "react"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { CATEGORY_COLOR_CLASSES } from "@/components/admin/assignments/assignment-meta"
import { createCategoryAction, updateCategoryAction } from "@/lib/assignments-actions"
import type { CategoryRow } from "@/lib/assignments-data"
import { CATEGORY_COLOR_VALUES } from "@/lib/assignments-schema"
import { cn } from "@/lib/utils"

export function CategoryFormSheet({
  open,
  onOpenChange,
  category,
  onSaved,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  category: CategoryRow | null
  onSaved: () => void
}) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [name, setName] = useState(category?.name ?? "")
  const [description, setDescription] = useState(category?.description ?? "")
  const [color, setColor] = useState(category?.color ?? "signal")

  const [prevKey, setPrevKey] = useState(`${open}-${category?.id ?? "new"}`)
  const key = `${open}-${category?.id ?? "new"}`
  if (key !== prevKey) {
    setPrevKey(key)
    setName(category?.name ?? "")
    setDescription(category?.description ?? "")
    setColor(category?.color ?? "signal")
    setError(null)
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setError(null)

    startTransition(async () => {
      const formData = new FormData()
      formData.set("name", name)
      formData.set("description", description)
      formData.set("color", color)

      const result = category
        ? await (async () => {
            formData.set("id", String(category.id))
            return updateCategoryAction(formData)
          })()
        : await createCategoryAction(formData)

      if ("error" in result) {
        setError(result.error)
        return
      }

      toast.success(category ? "Category updated." : "Category created.")
      onSaved()
      onOpenChange(false)
    })
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full bg-card p-6 sm:max-w-md">
        <SheetHeader className="text-left">
          <SheetTitle className="text-lg font-medium tracking-tight">
            {category ? "Edit category" : "New category"}
          </SheetTitle>
          <SheetDescription className="text-sm">
            Categories group assignments by workstream.
          </SheetDescription>
        </SheetHeader>

        {error ? (
          <div className="mt-4 rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-sm">
          <div className="space-y-1.5">
            <Label htmlFor="category-name">Name</Label>
            <Input
              id="category-name"
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. Transactions with Principal"
              className="h-10 rounded-xl"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="category-description">Description</Label>
            <Textarea
              id="category-description"
              rows={3}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="What kind of work falls under this category?"
              className="text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <Label>Color</Label>
            <div className="flex flex-wrap gap-2">
              {CATEGORY_COLOR_VALUES.map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setColor(value)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 font-mono text-[11px] uppercase transition",
                    CATEGORY_COLOR_CLASSES[value],
                    color === value ? "ring-2 ring-offset-2 ring-offset-card" : "opacity-60"
                  )}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <Button type="submit" disabled={isPending} className="h-10 w-full rounded-xl text-sm">
              {isPending ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Saving...
                </>
              ) : category ? (
                "Save changes"
              ) : (
                "Create category"
              )}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}
