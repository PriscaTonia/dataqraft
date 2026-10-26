import { getPayload, type Where } from "payload"
import config from "@payload-config"

import type { ActivityLogFilters } from "@/lib/activity-log-schema"

export type ActivityLogRow = {
  id: string | number
  actorName: string
  actorEmail: string
  action: string
  entityType: string
  entityId: string | null
  entityLabel: string
  summary: string
  changes: Record<string, { from: unknown; to: unknown }> | null
  createdAt: string
}

const PAGE_SIZE = 20

function toActivityLogRow(doc: Record<string, unknown>): ActivityLogRow {
  return {
    id: doc.id as string | number,
    actorName: (doc.actorName as string) ?? "",
    actorEmail: (doc.actorEmail as string) ?? "",
    action: (doc.action as string) ?? "",
    entityType: (doc.entityType as string) ?? "",
    entityId: (doc.entityId as string | null) ?? null,
    entityLabel: (doc.entityLabel as string) ?? "",
    summary: (doc.summary as string) ?? "",
    changes: (doc.changes as Record<string, { from: unknown; to: unknown }> | null) ?? null,
    createdAt: (doc.createdAt as string) ?? "",
  }
}

export async function getActivityLogsPage(filters: ActivityLogFilters) {
  try {
    const payload = await getPayload({ config })

    const and: Where[] = []
    if (filters.action !== "all") and.push({ action: { equals: filters.action } })
    if (filters.entityType !== "all") and.push({ entityType: { equals: filters.entityType } })
    if (filters.search) {
      and.push({
        or: [
          { actorName: { like: filters.search } },
          { actorEmail: { like: filters.search } },
          { entityLabel: { like: filters.search } },
          { summary: { like: filters.search } },
        ],
      })
    }

    const result = await payload.find({
      collection: "activity-logs",
      where: and.length > 0 ? { and } : {},
      sort: "-createdAt",
      page: filters.page,
      limit: PAGE_SIZE,
      depth: 0,
      overrideAccess: true,
    })

    return {
      rows: result.docs.map(toActivityLogRow),
      total: result.totalDocs,
      totalPages: result.totalPages,
      page: result.page ?? 1,
    }
  } catch (err) {
    console.error("Failed to load activity logs:", err)
    return { rows: [] as ActivityLogRow[], total: 0, totalPages: 1, page: 1 }
  }
}
