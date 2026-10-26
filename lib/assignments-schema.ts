import { z } from "zod"

export const ASSIGNMENT_STATUSES = ["not-started", "in-progress", "in-review", "submitted"] as const
export const ASSIGNMENT_PRIORITIES = ["low", "medium", "high"] as const
export const CATEGORY_COLOR_VALUES = [
  "signal",
  "amber",
  "emerald",
  "rose",
  "violet",
  "slate",
] as const

/**
 * Relationship IDs arrive from <select> elements as strings, but Payload's
 * default Postgres adapter uses numeric (serial) IDs. Coerce numeric-looking
 * strings to numbers so the relationship field validates correctly.
 */
const relationshipIdSchema = z
  .union([z.string(), z.number()])
  .refine((value) => String(value).trim().length > 0, { message: "Select a category." })
  .transform((value) => {
    const str = String(value).trim()
    const num = Number(str)
    return str !== "" && Number.isFinite(num) ? num : str
  })

export const categorySchema = z.object({
  name: z.string().trim().min(1, "Enter a category name.").max(80),
  description: z.string().trim().max(2000).optional().default(""),
  color: z.enum(CATEGORY_COLOR_VALUES).default("signal"),
})

export const updateCategorySchema = categorySchema.extend({
  id: z.union([z.string(), z.number()]),
})

export const assignmentSchema = z.object({
  category: relationshipIdSchema,
  description: z.string().trim().min(1, "Enter a description."),
  value: z.string().trim().max(200).optional().default(""),
  entity: z.string().trim().max(200).optional().default(""),
  assignedTo: z.string().trim().max(120).optional().default(""),
  contact: z.string().trim().max(120).optional().default(""),
  status: z.enum(ASSIGNMENT_STATUSES).default("not-started"),
  priority: z.enum(ASSIGNMENT_PRIORITIES).default("medium"),
  dueDate: z.string().trim().optional().default(""),
  remark: z.string().trim().max(2000).optional().default(""),
})

export const updateAssignmentSchema = assignmentSchema.extend({
  id: z.union([z.string(), z.number()]),
})

export const assignmentFiltersSchema = z.object({
  search: z.string().trim().max(200).optional().default(""),
  status: z.enum([...ASSIGNMENT_STATUSES, "all"]).optional().default("all"),
  priority: z.enum([...ASSIGNMENT_PRIORITIES, "all"]).optional().default("all"),
  category: z.string().optional().default("all"),
  page: z.coerce.number().int().min(1).optional().default(1),
})

export type CategoryInput = z.infer<typeof categorySchema>
export type AssignmentInput = z.infer<typeof assignmentSchema>
export type AssignmentFilters = z.infer<typeof assignmentFiltersSchema>
