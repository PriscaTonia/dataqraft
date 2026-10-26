import { getPayload, type Where } from "payload"
import config from "@payload-config"

import type { InquiryFilters } from "@/lib/admin-schema"

export type InquiryRow = {
  id: string | number
  name: string
  email: string
  organization: string
  interest: string
  message: string
  status: string
  internalNotes: string
  createdAt: string
}

export type AdminRow = {
  id: string | number
  name: string
  username: string
  email: string
  role: "super-admin" | "admin" | string
  active: boolean
  createdAt?: string
  lastLoginAt?: string | null
}

const PENDING_STATUSES = ["new", "in-review"] as const
const PAGE_SIZE = 10

function toInquiryRow(doc: Record<string, unknown>): InquiryRow {
  return {
    id: doc.id as string | number,
    name: (doc.name as string) ?? "",
    email: (doc.email as string) ?? "",
    organization: (doc.organization as string) ?? "",
    interest: (doc.interest as string) ?? "other",
    message: (doc.message as string) ?? "",
    status: (doc.status as string) ?? "new",
    internalNotes: (doc.internalNotes as string) ?? "",
    createdAt: (doc.createdAt as string) ?? "",
  }
}

function toAdminRow(doc: Record<string, unknown>): AdminRow {
  return {
    id: doc.id as string | number,
    name: (doc.name as string) ?? "",
    username: (doc.username as string) ?? "",
    email: (doc.email as string) ?? "",
    role: (doc.role as string) ?? "admin",
    active: doc.active !== false,
    createdAt: doc.createdAt as string | undefined,
    lastLoginAt: (doc.lastLoginAt as string | null | undefined) ?? null,
  }
}

export async function getPendingInquiriesCount() {
  try {
    const payload = await getPayload({ config })
    const result = await payload.count({
      collection: "inquiries",
      where: { status: { in: PENDING_STATUSES } },
      overrideAccess: true,
    })
    return result.totalDocs
  } catch (err) {
    console.error("Failed to count pending inquiries:", err)
    return 0
  }
}

export async function getOverviewStats() {
  try {
    const payload = await getPayload({ config })

    const [total, admins, recentDocs] = await Promise.all([
      payload.count({ collection: "inquiries", overrideAccess: true }),
      payload.find({
        collection: "users",
        limit: 200,
        depth: 0,
        overrideAccess: true,
      }),
      payload.find({
        collection: "inquiries",
        sort: "-createdAt",
        limit: 5,
        depth: 0,
        overrideAccess: true,
      }),
    ])

    const adminRows = admins.docs.map(toAdminRow)

    return {
      total: total.totalDocs,
      activeAdmins: adminRows.filter((a) => a.active).length,
      totalAdmins: adminRows.length,
      recent: recentDocs.docs.map(toInquiryRow),
    }
  } catch (err) {
    console.error("Failed to load overview stats:", err)
    return {
      total: 0,
      activeAdmins: 0,
      totalAdmins: 0,
      recent: [] as InquiryRow[],
    }
  }
}

export async function getInquiriesPage(filters: InquiryFilters) {
  try {
    const payload = await getPayload({ config })

    const where: Where = {}
    const and: Where[] = []

    if (filters.status !== "all") {
      and.push({ status: { equals: filters.status } })
    }
    if (filters.interest !== "all") {
      and.push({ interest: { equals: filters.interest } })
    }
    if (filters.search) {
      and.push({
        or: [
          { name: { like: filters.search } },
          { organization: { like: filters.search } },
          { email: { like: filters.search } },
          { message: { like: filters.search } },
        ],
      })
    }
    if (and.length > 0) where.and = and

    const result = await payload.find({
      collection: "inquiries",
      where,
      sort: filters.sort === "asc" ? "createdAt" : "-createdAt",
      page: filters.page,
      limit: PAGE_SIZE,
      depth: 0,
      overrideAccess: true,
    })

    return {
      rows: result.docs.map(toInquiryRow),
      total: result.totalDocs,
      totalPages: result.totalPages,
      page: result.page ?? 1,
    }
  } catch (err) {
    console.error("Failed to load inquiries:", err)
    return { rows: [] as InquiryRow[], total: 0, totalPages: 1, page: 1 }
  }
}

export async function getAllInquiriesForExport(
  filters: Omit<InquiryFilters, "page">
) {
  try {
    const payload = await getPayload({ config })

    const and: Where[] = []
    if (filters.status !== "all") and.push({ status: { equals: filters.status } })
    if (filters.interest !== "all") and.push({ interest: { equals: filters.interest } })
    if (filters.search) {
      and.push({
        or: [
          { name: { like: filters.search } },
          { organization: { like: filters.search } },
          { email: { like: filters.search } },
          { message: { like: filters.search } },
        ],
      })
    }

    const result = await payload.find({
      collection: "inquiries",
      where: and.length > 0 ? { and } : {},
      sort: filters.sort === "asc" ? "createdAt" : "-createdAt",
      limit: 5000,
      depth: 0,
      overrideAccess: true,
    })

    return result.docs.map(toInquiryRow)
  } catch (err) {
    console.error("Failed to export inquiries:", err)
    return [] as InquiryRow[]
  }
}

export async function getAdminsList() {
  try {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: "users",
      sort: "-createdAt",
      limit: 200,
      depth: 0,
      overrideAccess: true,
    })
    return result.docs.map(toAdminRow)
  } catch (err) {
    console.error("Failed to load admin users:", err)
    return [] as AdminRow[]
  }
}
