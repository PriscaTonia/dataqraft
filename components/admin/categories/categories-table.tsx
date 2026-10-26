"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { MoreHorizontal, Pencil, Plus, Tags, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { PageHeader } from "@/components/admin/shell/page-header"
import { CategoryBadge } from "@/components/admin/assignments/assignment-meta"
import { CategoryFormSheet } from "@/components/admin/categories/category-form-sheet"
import { DeleteCategoryDialog } from "@/components/admin/categories/delete-category-dialog"
import type { CategoryRow } from "@/lib/assignments-data"

function CategoryActionsMenu({
  category,
  onEdit,
  onDelete,
  triggerClassName,
}: {
  category: CategoryRow
  onEdit: (category: CategoryRow) => void
  onDelete: (category: CategoryRow) => void
  triggerClassName?: string
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            className={triggerClassName}
          />
        }
      >
        <MoreHorizontal className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onEdit(category)}>
          <Pencil className="size-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem variant="destructive" onClick={() => onDelete(category)}>
          <Trash2 className="size-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function CategoriesTable({ initialCategories }: { initialCategories: CategoryRow[] }) {
  const router = useRouter()
  const [categories, setCategories] = useState(initialCategories)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<CategoryRow | null>(null)
  const [deleting, setDeleting] = useState<CategoryRow | null>(null)

  const [prevCategories, setPrevCategories] = useState(initialCategories)
  if (initialCategories !== prevCategories) {
    setPrevCategories(initialCategories)
    setCategories(initialCategories)
  }

  function openCreate() {
    setEditing(null)
    setFormOpen(true)
  }

  function openEdit(category: CategoryRow) {
    setEditing(category)
    setFormOpen(true)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Operations"
        title="Assignment categories"
        description="Organize assignments into workstreams like Transactions, Assignments, or Strategic Projects."
        action={
          <Button onClick={openCreate} className="h-9 gap-1.5 text-sm">
            <Plus className="size-4" />
            New Category
          </Button>
        }
      />

      {/* Desktop / tablet: table */}
      <div className="hidden min-h-96 overflow-hidden rounded-2xl border border-border bg-card shadow-sm md:block lg:min-h-128">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40 font-mono text-xs text-muted-foreground uppercase tracking-wider">
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3">Assignments</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {categories.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-muted-foreground">
                    <Tags className="mx-auto mb-2 size-8 text-muted-foreground/40" />
                    <p className="text-sm font-medium">No categories yet</p>
                    <p className="mt-1 text-sm">Create your first category to start tracking assignments.</p>
                  </td>
                </tr>
              ) : (
                categories.map((category) => (
                  <tr key={category.id} className="transition hover:bg-muted/30">
                    <td className="px-4 py-4">
                      <CategoryBadge name={category.name} color={category.color} />
                    </td>
                    <td className="max-w-sm px-4 py-4 text-muted-foreground">
                      <span className="line-clamp-2">{category.description || "—"}</span>
                    </td>
                    <td className="px-4 py-4 font-mono text-xs text-muted-foreground">
                      {category.assignmentCount ?? 0}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <CategoryActionsMenu
                        category={category}
                        onEdit={openEdit}
                        onDelete={setDeleting}
                        triggerClassName="text-muted-foreground hover:text-foreground"
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile: cards */}
      <div className="space-y-3 md:hidden">
        {categories.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card px-4 py-12 text-center text-muted-foreground">
            <Tags className="mx-auto mb-2 size-8 text-muted-foreground/40" />
            <p className="text-sm font-medium">No categories yet</p>
            <p className="mt-1 text-sm">Create your first category to start tracking assignments.</p>
          </div>
        ) : (
          categories.map((category) => (
            <div key={category.id} className="rounded-2xl border border-border bg-card p-4 shadow-sm">
              <div className="flex items-start justify-between gap-2">
                <CategoryBadge name={category.name} color={category.color} />
                <CategoryActionsMenu
                  category={category}
                  onEdit={openEdit}
                  onDelete={setDeleting}
                  triggerClassName="-mt-1.5 -mr-1.5 shrink-0 text-muted-foreground hover:text-foreground"
                />
              </div>
              {category.description ? (
                <p className="mt-2.5 line-clamp-2 text-sm text-muted-foreground">
                  {category.description}
                </p>
              ) : null}
              <p className="mt-3 border-t border-border pt-3 font-mono text-[11px] text-muted-foreground">
                {category.assignmentCount ?? 0} assignment{category.assignmentCount === 1 ? "" : "s"}
              </p>
            </div>
          ))
        )}
      </div>

      <CategoryFormSheet
        open={formOpen}
        onOpenChange={setFormOpen}
        category={editing}
        onSaved={() => router.refresh()}
      />

      <DeleteCategoryDialog
        category={deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
        onDeleted={(id) => {
          setCategories((prev) => prev.filter((c) => c.id !== id))
          setDeleting(null)
          router.refresh()
        }}
      />
    </div>
  )
}
