import { z } from "zod"

export const ADMIN_ROLES = ["admin", "super-admin"] as const
export const INQUIRY_STATUSES = ["new", "in-review", "contacted", "archived"] as const

const password = z
  .string()
  .min(8, "Password must be at least 8 characters.")
  .max(128)

export const createAdminSchema = z.object({
  name: z.string().trim().min(2, "Enter a full name.").max(120),
  username: z
    .string()
    .trim()
    .toLowerCase()
    .min(3, "Username must be at least 3 characters.")
    .max(60)
    .regex(/^[a-z0-9._-]+$/, "Use only letters, numbers, dots, dashes, underscores."),
  email: z.string().trim().toLowerCase().pipe(z.email("Enter a valid email address.")),
  password,
  role: z.enum(ADMIN_ROLES).default("admin"),
})

export const updateAdminSchema = z.object({
  id: z.union([z.string(), z.number()]),
  name: z.string().trim().min(2, "Enter a full name.").max(120),
  email: z.string().trim().toLowerCase().pipe(z.email("Enter a valid email address.")),
  role: z.enum(ADMIN_ROLES),
})

export const resetAdminPasswordSchema = z.object({
  id: z.union([z.string(), z.number()]),
  password,
})

export const updateOwnProfileSchema = z.object({
  name: z.string().trim().min(2, "Enter a full name.").max(120),
  email: z.string().trim().toLowerCase().pipe(z.email("Enter a valid email address.")),
})

export const changeOwnPasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Enter your current password."),
    newPassword: password,
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must be different from the current password.",
    path: ["newPassword"],
  })

export const inquiryStatusSchema = z.object({
  id: z.union([z.string(), z.number()]),
  status: z.enum(INQUIRY_STATUSES),
  internalNotes: z.string().max(4000).optional(),
})

export const inquiryFiltersSchema = z.object({
  search: z.string().trim().max(200).optional().default(""),
  status: z.enum([...INQUIRY_STATUSES, "all"]).optional().default("all"),
  interest: z.string().optional().default("all"),
  sort: z.enum(["asc", "desc"]).optional().default("desc"),
  page: z.coerce.number().int().min(1).optional().default(1),
})

export type CreateAdminInput = z.infer<typeof createAdminSchema>
export type UpdateAdminInput = z.infer<typeof updateAdminSchema>
export type InquiryFilters = z.infer<typeof inquiryFiltersSchema>
