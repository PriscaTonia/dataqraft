import { getPayload, type Where } from "payload"
import config from "@payload-config"

import type { AssignmentFilters } from "@/lib/assignments-schema"

export type CategoryRow = {
  id: string | number
  name: string
  description: string
  color: string
  assignmentCount?: number
}

export type AssignmentRow = {
  id: string | number
  categoryId: string | number | null
  categoryName: string
  categoryColor: string
  description: string
  value: string
  entity: string
  assignedTo: string
  contact: string
  status: string
  priority: string
  dueDate: string | null
  remark: string
  createdAt: string
}

const PAGE_SIZE = 10
const DUE_SOON_DAYS = 7

function toCategoryRow(doc: Record<string, unknown>): CategoryRow {
  return {
    id: doc.id as string | number,
    name: (doc.name as string) ?? "",
    description: (doc.description as string) ?? "",
    color: (doc.color as string) ?? "signal",
  }
}

function toAssignmentRow(doc: Record<string, unknown>): AssignmentRow {
  const category = doc.category as Record<string, unknown> | string | number | null

  const isPopulated = category && typeof category === "object"

  return {
    id: doc.id as string | number,
    categoryId: isPopulated ? ((category as Record<string, unknown>).id as string | number) : (category as string | number | null),
    categoryName: isPopulated ? ((category as Record<string, unknown>).name as string) : "",
    categoryColor: isPopulated ? ((category as Record<string, unknown>).color as string) ?? "signal" : "signal",
    description: (doc.description as string) ?? "",
    value: (doc.value as string) ?? "",
    entity: (doc.entity as string) ?? "",
    assignedTo: (doc.assignedTo as string) ?? "",
    contact: (doc.contact as string) ?? "",
    status: (doc.status as string) ?? "not-started",
    priority: (doc.priority as string) ?? "medium",
    dueDate: (doc.dueDate as string | null) ?? null,
    remark: (doc.remark as string) ?? "",
    createdAt: (doc.createdAt as string) ?? "",
  }
}

export async function getCategories(): Promise<CategoryRow[]> {
  try {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: "assignment-categories",
      sort: "name",
      limit: 200,
      depth: 0,
      overrideAccess: true,
    })
    return result.docs.map(toCategoryRow)
  } catch (err) {
    console.error("Failed to load assignment categories:", err)
    return []
  }
}

export async function getCategoriesWithCounts(): Promise<CategoryRow[]> {
  try {
    const payload = await getPayload({ config })
    const [categories, assignments] = await Promise.all([
      payload.find({
        collection: "assignment-categories",
        sort: "name",
        limit: 200,
        depth: 0,
        overrideAccess: true,
      }),
      payload.find({
        collection: "assignments",
        limit: 5000,
        depth: 0,
        overrideAccess: true,
      }),
    ])

    const counts = new Map<string, number>()
    for (const doc of assignments.docs) {
      const catId = String(doc.category)
      counts.set(catId, (counts.get(catId) ?? 0) + 1)
    }

    return categories.docs.map((doc) => ({
      ...toCategoryRow(doc),
      assignmentCount: counts.get(String(doc.id)) ?? 0,
    }))
  } catch (err) {
    console.error("Failed to load assignment categories with counts:", err)
    return []
  }
}

export async function getAssignmentsPage(filters: AssignmentFilters) {
  try {
    const payload = await getPayload({ config })

    const and: Where[] = []
    if (filters.status !== "all") and.push({ status: { equals: filters.status } })
    if (filters.priority !== "all") and.push({ priority: { equals: filters.priority } })
    if (filters.category !== "all") and.push({ category: { equals: filters.category } })
    if (filters.search) {
      and.push({
        or: [
          { description: { like: filters.search } },
          { entity: { like: filters.search } },
          { assignedTo: { like: filters.search } },
          { contact: { like: filters.search } },
        ],
      })
    }

    const result = await payload.find({
      collection: "assignments",
      where: and.length > 0 ? { and } : {},
      sort: "-createdAt",
      page: filters.page,
      limit: PAGE_SIZE,
      depth: 1,
      overrideAccess: true,
    })

    return {
      rows: result.docs.map(toAssignmentRow),
      total: result.totalDocs,
      totalPages: result.totalPages,
      page: result.page ?? 1,
    }
  } catch (err) {
    console.error("Failed to load assignments:", err)
    return { rows: [] as AssignmentRow[], total: 0, totalPages: 1, page: 1 }
  }
}

export async function getAssignmentInsights() {
  try {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: "assignments",
      where: { status: { not_equals: "submitted" } },
      limit: 500,
      depth: 1,
      overrideAccess: true,
    })

    const rows = result.docs.map(toAssignmentRow)
    const nowMs = Date.now()
    const dueSoonCutoffMs = nowMs + DUE_SOON_DAYS * 24 * 60 * 60 * 1000

    const withMeta = rows.map((row) => {
      const due = row.dueDate ? new Date(row.dueDate) : null
      const overdue = due ? due.getTime() < nowMs : false
      const dueSoon = due && !overdue ? due.getTime() <= dueSoonCutoffMs : false
      return { row, due, overdue, dueSoon }
    })

    const overdueCount = withMeta.filter((m) => m.overdue).length
    const dueSoonCount = withMeta.filter((m) => m.dueSoon).length
    const highPriorityCount = rows.filter((r) => r.priority === "high").length

    const flagged = withMeta.filter((m) => m.overdue || m.dueSoon || m.row.priority === "high")

    flagged.sort((a, b) => {
      if (a.overdue !== b.overdue) return a.overdue ? -1 : 1
      if (a.due && b.due) return a.due.getTime() - b.due.getTime()
      if (a.due) return -1
      if (b.due) return 1
      return 0
    })

    return {
      pendingCount: result.totalDocs,
      overdueCount,
      dueSoonCount,
      highPriorityCount,
      items: flagged.slice(0, 6).map((m) => ({
        ...m.row,
        flag: m.overdue ? "overdue" : m.dueSoon ? "due-soon" : "high-priority",
      })),
    }
  } catch (err) {
    console.error("Failed to load assignment insights:", err)
    return { pendingCount: 0, overdueCount: 0, dueSoonCount: 0, highPriorityCount: 0, items: [] }
  }
}
