import type { CollectionConfig } from "payload"

import { isSuperAdmin } from "./Users"

export const ACTIVITY_ACTIONS = [
  "login",
  "create",
  "update",
  "delete",
  "deactivate",
  "reactivate",
  "reset-password",
] as const

export const ACTIVITY_ENTITY_TYPES = [
  "session",
  "assignment",
  "category",
  "inquiry",
  "admin",
  "profile",
] as const

export const ActivityLogs: CollectionConfig = {
  slug: "activity-logs",
  labels: {
    singular: "Activity Log",
    plural: "Activity Logs",
  },
  admin: {
    useAsTitle: "summary",
    defaultColumns: ["actorName", "action", "entityType", "summary", "createdAt"],
    group: "Operations",
    description: "Audit trail of admin actions. Written automatically; not editable.",
  },
  access: {
    // Written internally via overrideAccess only.
    create: () => false,
    update: () => false,
    read: ({ req: { user } }) => isSuperAdmin(user),
    delete: ({ req: { user } }) => isSuperAdmin(user),
  },
  fields: [
    {
      name: "actorName",
      type: "text",
      required: true,
    },
    {
      name: "actorEmail",
      type: "text",
      required: true,
    },
    {
      name: "actorId",
      type: "text",
    },
    {
      name: "action",
      type: "select",
      required: true,
      options: ACTIVITY_ACTIONS.map((value) => ({ label: value, value })),
    },
    {
      name: "entityType",
      type: "select",
      required: true,
      options: ACTIVITY_ENTITY_TYPES.map((value) => ({ label: value, value })),
    },
    {
      name: "entityId",
      type: "text",
    },
    {
      name: "entityLabel",
      type: "text",
    },
    {
      name: "summary",
      type: "text",
      required: true,
    },
    {
      name: "changes",
      type: "json",
    },
  ],
  timestamps: true,
}
