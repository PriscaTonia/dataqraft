import { getPayload } from "payload"
import config from "@payload-config"

import type { AdminUser } from "@/lib/admin-auth"

export type ActivityAction =
  | "login"
  | "create"
  | "update"
  | "delete"
  | "deactivate"
  | "reactivate"
  | "reset-password"

export type ActivityEntityType = "session" | "assignment" | "category" | "inquiry" | "admin" | "profile"

export type FieldChange = { from: unknown; to: unknown }

/**
 * Writes an audit trail entry. Never throws — a logging failure must not
 * block the action it's describing.
 */
export async function logActivity(params: {
  actor: Pick<AdminUser, "id" | "name" | "email">
  action: ActivityAction
  entityType: ActivityEntityType
  entityId?: string | number
  entityLabel?: string
  summary: string
  changes?: Record<string, FieldChange>
}) {
  try {
    const payload = await getPayload({ config })
    await payload.create({
      collection: "activity-logs",
      data: {
        actorName: params.actor.name,
        actorEmail: params.actor.email,
        actorId: String(params.actor.id),
        action: params.action,
        entityType: params.entityType,
        entityId: params.entityId !== undefined ? String(params.entityId) : undefined,
        entityLabel: params.entityLabel,
        summary: params.summary,
        changes: params.changes,
      },
      overrideAccess: true,
    })
  } catch (err) {
    console.error("Failed to write activity log:", err)
  }
}

/**
 * Diffs a set of "before" values against "after" values, returning only the
 * fields that actually changed — used to build both a changes map and a
 * short human-readable summary for update actions.
 */
export function diffFields<T extends Record<string, unknown>>(
  before: T,
  after: T,
  labels: Partial<Record<keyof T, string>>
): { changes: Record<string, FieldChange>; summary: string } {
  const changes: Record<string, FieldChange> = {}

  for (const key of Object.keys(after) as Array<keyof T>) {
    const from = before[key]
    const to = after[key]
    if (String(from ?? "") !== String(to ?? "")) {
      changes[String(key)] = { from: from ?? null, to: to ?? null }
    }
  }

  const changedLabels = Object.keys(changes).map((key) => labels[key as keyof T] ?? key)
  const summary =
    changedLabels.length > 0 ? `Updated ${changedLabels.join(", ")}` : "No fields changed"

  return { changes, summary }
}
