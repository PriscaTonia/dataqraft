"use client"

import { useRef, useState, useTransition } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { ClipboardList, Eye, MoreHorizontal, Pencil, Plus, Search, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { PageHeader } from "@/components/admin/shell/page-header"
import {
  AssignmentStatusBadge,
  CategoryBadge,
  DueDateCell,
  PriorityBadge,
  STATUS_META,
  PRIORITY_META,
} from "@/components/admin/assignments/assignment-meta"
import { AssignmentFormSheet } from "@/components/admin/assignments/assignment-form-sheet"
import { AssignmentViewDialog } from "@/components/admin/assignments/assignment-view-dialog"
import { DeleteAssignmentDialog } from "@/components/admin/assignments/delete-assignment-dialog"
import type { AssignmentRow, CategoryRow } from "@/lib/assignments-data"
import type { AssignmentFilters } from "@/lib/assignments-schema"
import { ASSIGNMENT_PRIORITIES, ASSIGNMENT_STATUSES } from "@/lib/assignments-schema"

const STATUS_OPTIONS = [
  { value: "all", label: "All statuses" },
  ...ASSIGNMENT_STATUSES.map((s) => ({ value: s, label: STATUS_META[s].label })),
]

const PRIORITY_OPTIONS = [
  { value: "all", label: "All priorities" },
  ...ASSIGNMENT_PRIORITIES.map((p) => ({ value: p, label: PRIORITY_META[p].label })),
]

export function AssignmentsTable({
  rows,
  total,
  totalPages,
  page,
  filters,
  categories,
}: {
  rows: AssignmentRow[]
  total: number
  totalPages: number
  page: number
  filters: AssignmentFilters
  categories: CategoryRow[]
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [searchValue, setSearchValue] = useState(filters.search)
  const [localRows, setLocalRows] = useState(rows)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<AssignmentRow | null>(null)
  const [viewing, setViewing] = useState<AssignmentRow | null>(null)
  const [deleting, setDeleting] = useState<AssignmentRow | null>(null)

  const [prevRows, setPrevRows] = useState(rows)
  if (rows !== prevRows) {
    setPrevRows(rows)
    setLocalRows(rows)
  }
  const [prevSearch, setPrevSearch] = useState(filters.search)
  if (filters.search !== prevSearch) {
    setPrevSearch(filters.search)
    setSearchValue(filters.search)
  }

  const categoryOptions = [
    { value: "all", label: "All categories" },
    ...categories.map((cat) => ({ value: String(cat.id), label: cat.name })),
  ]

  function pushParams(next: Partial<Record<string, string>>) {
    const params = new URLSearchParams(searchParams.toString())
    for (const [key, value] of Object.entries(next)) {
      if (!value || value === "all" || value === "") {
        params.delete(key)
      } else {
        params.set(key, value)
      }
    }
    startTransition(() => router.push(`${pathname}?${params.toString()}`))
  }

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  function handleSearchChange(value: string) {
    setSearchValue(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => pushParams({ search: value, page: "1" }), 350)
  }

  function openCreate() {
    setEditing(null)
    setFormOpen(true)
  }

  function openEdit(assignment: AssignmentRow) {
    setEditing(assignment)
    setFormOpen(true)
  }

  function handleSaved() {
    router.refresh()
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Operations"
        title="Assignments"
        description="Track tasks, owners, and deadlines across every category of work."
        action={
          <Button onClick={openCreate} className="h-9 gap-1.5 text-sm">
            <Plus className="size-4" />
            New Assignment
          </Button>
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-md flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchValue}
            onChange={(event) => handleSearchChange(event.target.value)}
            placeholder="Search by description, entity, or owner..."
            className="h-10 rounded-xl pl-9 text-sm"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={filters.category}
            onValueChange={(value) => value && pushParams({ category: value, page: "1" })}
            items={categoryOptions}
          >
            <SelectTrigger className="h-10 w-full text-sm sm:w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categoryOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.status}
            onValueChange={(value) => value && pushParams({ status: value, page: "1" })}
            items={STATUS_OPTIONS}
          >
            <SelectTrigger className="h-10 w-full text-sm sm:w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.priority}
            onValueChange={(value) => value && pushParams({ priority: value, page: "1" })}
            items={PRIORITY_OPTIONS}
          >
            <SelectTrigger className="h-10 w-full text-sm sm:w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PRIORITY_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className={isPending ? "opacity-60 transition-opacity" : "transition-opacity"}>
        {/* Desktop / tablet: table */}
        <div className="hidden min-h-128 flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm md:flex lg:min-h-160">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40 font-mono text-xs text-muted-foreground uppercase tracking-wider">
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Description</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Priority</th>
                  <th className="px-4 py-3">Due</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {localRows.length === 0 ? null : (
                  localRows.map((item) => (
                    <tr
                      key={item.id}
                      onClick={() => setViewing(item)}
                      className="cursor-pointer transition hover:bg-muted/30"
                    >
                      <td className="px-4 py-4">
                        <CategoryBadge name={item.categoryName} color={item.categoryColor} />
                      </td>
                      <td className="max-w-md px-4 py-4 font-medium text-foreground">
                        <span className="line-clamp-2">{item.description}</span>
                      </td>
                      <td className="px-4 py-4">
                        <AssignmentStatusBadge status={item.status} />
                      </td>
                      <td className="px-4 py-4">
                        <PriorityBadge priority={item.priority} />
                      </td>
                      <td className="px-4 py-4">
                        <DueDateCell dueDate={item.dueDate} submitted={item.status === "submitted"} />
                      </td>
                      <td className="px-4 py-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            render={
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                onClick={(event) => event.stopPropagation()}
                                className="text-muted-foreground hover:text-foreground"
                              />
                            }
                          >
                            <MoreHorizontal className="size-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={(event) => {
                                event.stopPropagation()
                                setViewing(item)
                              }}
                            >
                              <Eye className="size-4" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(event) => {
                                event.stopPropagation()
                                openEdit(item)
                              }}
                            >
                              <Pencil className="size-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              variant="destructive"
                              onClick={(event) => {
                                event.stopPropagation()
                                setDeleting(item)
                              }}
                            >
                              <Trash2 className="size-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {localRows.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-2 py-16 text-center text-muted-foreground">
              <ClipboardList className="size-8 text-muted-foreground/40" />
              <p className="text-sm font-medium">No assignments found</p>
              <p className="mt-1 text-sm">Try adjusting your filters, or create a new one.</p>
            </div>
          ) : (
            <div className="flex-1" />
          )}
        </div>

        {/* Mobile: cards */}
        <div className="space-y-3 md:hidden">
          {localRows.length === 0 ? (
            <div className="rounded-2xl border border-border bg-card px-4 py-12 text-center text-muted-foreground">
              <ClipboardList className="mx-auto mb-2 size-8 text-muted-foreground/40" />
              <p className="text-sm font-medium">No assignments found</p>
              <p className="mt-1 text-sm">Try adjusting your filters, or create a new one.</p>
            </div>
          ) : (
            localRows.map((item) => (
              <div
                key={item.id}
                role="button"
                tabIndex={0}
                onClick={() => setViewing(item)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault()
                    setViewing(item)
                  }
                }}
                className="cursor-pointer rounded-2xl border border-border bg-card p-4 shadow-sm outline-none transition hover:border-signal/30 focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <div className="flex items-start justify-between gap-2">
                  <CategoryBadge name={item.categoryName} color={item.categoryColor} />
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={(event) => event.stopPropagation()}
                          className="-mt-1.5 -mr-1.5 shrink-0 text-muted-foreground hover:text-foreground"
                        />
                      }
                    >
                      <MoreHorizontal className="size-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={(event) => {
                          event.stopPropagation()
                          setViewing(item)
                        }}
                      >
                        <Eye className="size-4" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(event) => {
                          event.stopPropagation()
                          openEdit(item)
                        }}
                      >
                        <Pencil className="size-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={(event) => {
                          event.stopPropagation()
                          setDeleting(item)
                        }}
                      >
                        <Trash2 className="size-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <p className="mt-2.5 line-clamp-2 text-sm font-medium text-foreground">
                  {item.description}
                </p>
                <div className="mt-3 flex items-center gap-1.5">
                  <AssignmentStatusBadge status={item.status} />
                  <PriorityBadge priority={item.priority} />
                </div>
                <div className="mt-3 border-t border-border pt-3">
                  <DueDateCell dueDate={item.dueDate} submitted={item.status === "submitted"} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          {total} {total === 1 ? "result" : "results"}
        </span>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => pushParams({ page: String(page - 1) })}
          >
            Previous
          </Button>
          <span className="font-mono">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => pushParams({ page: String(page + 1) })}
          >
            Next
          </Button>
        </div>
      </div>

      <AssignmentFormSheet
        open={formOpen}
        onOpenChange={setFormOpen}
        categories={categories}
        assignment={editing}
        onSaved={handleSaved}
      />

      <AssignmentViewDialog assignment={viewing} onOpenChange={(open) => !open && setViewing(null)} />

      <DeleteAssignmentDialog
        assignment={deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
        onDeleted={(id) => {
          setLocalRows((prev) => prev.filter((r) => r.id !== id))
          setDeleting(null)
          router.refresh()
        }}
      />
    </div>
  )
}
