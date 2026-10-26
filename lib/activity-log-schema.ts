import { z } from "zod"

import { ACTIVITY_ACTIONS, ACTIVITY_ENTITY_TYPES } from "@/collections/ActivityLogs"

export const activityLogFiltersSchema = z.object({
  search: z.string().trim().max(200).optional().default(""),
  action: z.enum([...ACTIVITY_ACTIONS, "all"]).optional().default("all"),
  entityType: z.enum([...ACTIVITY_ENTITY_TYPES, "all"]).optional().default("all"),
  page: z.coerce.number().int().min(1).optional().default(1),
})

export type ActivityLogFilters = z.infer<typeof activityLogFiltersSchema>
