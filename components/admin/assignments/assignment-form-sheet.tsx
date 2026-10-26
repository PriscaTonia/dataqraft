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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PRIORITY_META, STATUS_META } from "@/components/admin/assignments/assignment-meta"
import { DueDatePicker } from "@/components/admin/assignments/due-date-picker"
import { createAssignmentAction, updateAssignmentAction } from "@/lib/assignments-actions"
import type { AssignmentRow, CategoryRow } from "@/lib/assignments-data"
import {
  ASSIGNMENT_PRIORITIES,
  ASSIGNMENT_STATUSES,
} from "@/lib/assignments-schema"

type FormState = {
  category: string
  description: string
  value: string
  entity: string
  assignedTo: string
  contact: string
  status: string
  priority: string
  dueDate: string
  remark: string
}

const EMPTY_STATE: FormState = {
  category: "",
  description: "",
  value: "",
  entity: "",
  assignedTo: "",
  contact: "",
  status: "not-started",
  priority: "medium",
  dueDate: "",
  remark: "",
}

function toFormState(assignment: AssignmentRow): FormState {
  return {
    category: String(assignment.categoryId ?? ""),
    description: assignment.description,
    value: assignment.value,
    entity: assignment.entity,
    assignedTo: assignment.assignedTo,
    contact: assignment.contact,
    status: assignment.status,
    priority: assignment.priority,
    dueDate: assignment.dueDate ?? "",
    remark: assignment.remark,
  }
}

export function AssignmentFormSheet({
  open,
  onOpenChange,
  categories,
  assignment,
  onSaved,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  categories: CategoryRow[]
  assignment: AssignmentRow | null
  onSaved: () => void
}) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(assignment ? toFormState(assignment) : EMPTY_STATE)

  const [prevKey, setPrevKey] = useState(`${open}-${assignment?.id ?? "new"}`)
  const key = `${open}-${assignment?.id ?? "new"}`
  if (key !== prevKey) {
    setPrevKey(key)
    setForm(assignment ? toFormState(assignment) : EMPTY_STATE)
    setError(null)
  }

  function set<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setError(null)

    startTransition(async () => {
      const formData = new FormData()
      formData.set("category", form.category)
      formData.set("description", form.description)
      formData.set("value", form.value)
      formData.set("entity", form.entity)
      formData.set("assignedTo", form.assignedTo)
      formData.set("contact", form.contact)
      formData.set("status", form.status)
      formData.set("priority", form.priority)
      formData.set("dueDate", form.dueDate)
      formData.set("remark", form.remark)

      const result = assignment
        ? await (async () => {
            formData.set("id", String(assignment.id))
            return updateAssignmentAction(formData)
          })()
        : await createAssignmentAction(formData)

      if ("error" in result) {
        setError(result.error)
        return
      }

      toast.success(assignment ? "Assignment updated." : "Assignment created.")
      onSaved()
      onOpenChange(false)
    })
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full overflow-y-auto bg-card p-6 sm:max-w-lg">
        <SheetHeader className="text-left">
          <span className="font-mono text-[11px] tracking-wider text-signal uppercase">
            {assignment ? `Assignment #${assignment.id}` : "New assignment"}
          </span>
          <SheetTitle className="text-lg font-medium tracking-tight">
            {assignment ? "Edit assignment" : "Create assignment"}
          </SheetTitle>
          <SheetDescription className="text-sm">
            Track a task, its owner, and its progress toward completion.
          </SheetDescription>
        </SheetHeader>

        {error ? (
          <div className="mt-4 rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-sm">
          <div className="space-y-1.5">
            <Label>Category</Label>
            <Select
              value={form.category || null}
              onValueChange={(value) => value && set("category", value)}
              items={categories.map((cat) => ({ value: String(cat.id), label: cat.name }))}
            >
              <SelectTrigger className="h-10 w-full">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={String(cat.id)}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="assignment-description">Description</Label>
            <Textarea
              id="assignment-description"
              required
              rows={3}
              value={form.description}
              onChange={(event) => set("description", event.target.value)}
              placeholder="What needs to happen?"
              className="text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="assignment-value">Value</Label>
              <Input
                id="assignment-value"
                value={form.value}
                onChange={(event) => set("value", event.target.value)}
                placeholder="$100M or free text"
                className="h-10 rounded-xl"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="assignment-entity">Entity</Label>
              <Input
                id="assignment-entity"
                value={form.entity}
                onChange={(event) => set("entity", event.target.value)}
                className="h-10 rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="assignment-assigned-to">Assigned To</Label>
              <Input
                id="assignment-assigned-to"
                value={form.assignedTo}
                onChange={(event) => set("assignedTo", event.target.value)}
                className="h-10 rounded-xl"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="assignment-contact">Contact</Label>
              <Input
                id="assignment-contact"
                value={form.contact}
                onChange={(event) => set("contact", event.target.value)}
                className="h-10 rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select
                value={form.status}
                onValueChange={(value) => value && set("status", value)}
                items={ASSIGNMENT_STATUSES.map((s) => ({ value: s, label: STATUS_META[s].label }))}
              >
                <SelectTrigger className="h-10 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ASSIGNMENT_STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {STATUS_META[s].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Priority</Label>
              <Select
                value={form.priority}
                onValueChange={(value) => value && set("priority", value)}
                items={ASSIGNMENT_PRIORITIES.map((p) => ({ value: p, label: PRIORITY_META[p].label }))}
              >
                <SelectTrigger className="h-10 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ASSIGNMENT_PRIORITIES.map((p) => (
                    <SelectItem key={p} value={p}>
                      {PRIORITY_META[p].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Due Date</Label>
            <DueDatePicker
              key={key}
              value={form.dueDate}
              onChange={(value) => set("dueDate", value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="assignment-remark">Remark</Label>
            <Textarea
              id="assignment-remark"
              rows={3}
              value={form.remark}
              onChange={(event) => set("remark", event.target.value)}
              placeholder="Status notes, blockers, follow-ups..."
              className="text-sm"
            />
          </div>

          <div className="pt-2">
            <Button type="submit" disabled={isPending} className="h-10 w-full rounded-xl text-sm">
              {isPending ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Saving...
                </>
              ) : assignment ? (
                "Save changes"
              ) : (
                "Create assignment"
              )}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}
