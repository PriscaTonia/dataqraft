"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { getPayload } from "payload"
import config from "@payload-config"

import { getAuthenticatedAdmin } from "./admin-auth"
import {
  changeOwnPasswordSchema,
  createAdminSchema,
  inquiryStatusSchema,
  resetAdminPasswordSchema,
  updateAdminSchema,
  updateOwnProfileSchema,
} from "./admin-schema"
import { getAllInquiriesForExport } from "./admin-data"
import type { InquiryFilters } from "./admin-schema"
import { diffFields, logActivity } from "./activity-log"

type ActionResult = { success: true } | { error: string }

function errorMessage(err: unknown, fallback: string) {
  if (err instanceof Error) {
    if (err.message.includes("duplicate key") || err.message.toLowerCase().includes("unique")) {
      if (err.message.includes("username")) return "That username is already taken."
      if (err.message.includes("email")) return "That email is already in use."
      return "That value is already in use."
    }
    return err.message
  }
  return fallback
}

export async function loginAdminAction(formData: FormData) {
  const identifier = (formData.get("identifier") as string)?.trim()
  const password = formData.get("password") as string
  const remember = formData.get("remember") === "true" || formData.get("remember") === "on"

  if (!identifier || !password) {
    return { error: "Please enter your username or email and password." }
  }

  try {
    const payload = await getPayload({ config })

    let emailToUse = identifier
    if (!identifier.includes("@")) {
      const found = await payload.find({
        collection: "users",
        where: { username: { equals: identifier } },
        limit: 1,
        depth: 0,
        overrideAccess: true,
      })
      if (found.docs.length > 0) {
        emailToUse = found.docs[0].email
      }
    }

    const result = await payload.login({
      collection: "users",
      data: { email: emailToUse, password },
    })

    if (!result.token || !result.user) {
      return { error: "Invalid credentials. Please verify and try again." }
    }

    if (result.user.active === false) {
      return { error: "This administrative account has been deactivated." }
    }

    const cookieStore = await cookies()
    cookieStore.set("payload-token", result.token, {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: remember ? 60 * 60 * 24 * 7 : 60 * 60 * 8,
    })

    await logActivity({
      actor: { id: result.user.id, name: result.user.name as string, email: result.user.email },
      action: "login",
      entityType: "session",
      summary: "Signed in",
    })

    return { success: true }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Authentication failed."
    return { error: message || "Invalid credentials." }
  }
}

export async function logoutAdminAction() {
  const cookieStore = await cookies()
  cookieStore.delete("payload-token")
  redirect("/admin/login")
}

export async function updateInquiryStatusAction(
  id: string | number,
  status: "new" | "in-review" | "contacted" | "archived",
  internalNotes?: string
): Promise<ActionResult> {
  const admin = await getAuthenticatedAdmin()
  if (!admin) return { error: "Unauthorized." }
  if (admin.role !== "super-admin") {
    return { error: "Only super admins may update inquiries." }
  }

  const parsed = inquiryStatusSchema.safeParse({ id, status, internalNotes })
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." }
  }

  try {
    const payload = await getPayload({ config })
    const before = await payload.findByID({
      collection: "inquiries",
      id: parsed.data.id,
      depth: 0,
      overrideAccess: true,
    })

    const updateData: Record<string, unknown> = { status: parsed.data.status }
    if (typeof parsed.data.internalNotes === "string") {
      updateData.internalNotes = parsed.data.internalNotes
    }

    await payload.update({
      collection: "inquiries",
      id: parsed.data.id,
      data: updateData,
      overrideAccess: true,
    })

    const { changes, summary } = diffFields(
      { status: before.status, internalNotes: before.internalNotes },
      { status: parsed.data.status, internalNotes: updateData.internalNotes ?? before.internalNotes },
      { status: "status", internalNotes: "internal notes" }
    )
    await logActivity({
      actor: admin,
      action: "update",
      entityType: "inquiry",
      entityId: parsed.data.id,
      entityLabel: `${before.name} (${before.organization})`,
      summary,
      changes,
    })

    return { success: true }
  } catch (err) {
    return { error: errorMessage(err, "Failed to update inquiry.") }
  }
}

export async function deleteInquiryAction(id: string | number): Promise<ActionResult> {
  const admin = await getAuthenticatedAdmin()
  if (!admin) return { error: "Unauthorized." }
  if (admin.role !== "super-admin") {
    return { error: "Only super admins may delete inquiries." }
  }

  try {
    const payload = await getPayload({ config })
    const before = await payload.findByID({
      collection: "inquiries",
      id,
      depth: 0,
      overrideAccess: true,
    })
    await payload.delete({ collection: "inquiries", id, overrideAccess: true })

    await logActivity({
      actor: admin,
      action: "delete",
      entityType: "inquiry",
      entityId: id,
      entityLabel: `${before.name} (${before.organization})`,
      summary: "Deleted inquiry",
    })

    return { success: true }
  } catch (err) {
    return { error: errorMessage(err, "Failed to delete inquiry.") }
  }
}

export async function exportInquiriesCsvAction(
  filters: Omit<InquiryFilters, "page">
): Promise<{ error: string } | { success: true; csv: string }> {
  const admin = await getAuthenticatedAdmin()
  if (!admin) return { error: "Unauthorized." }

  const rows = await getAllInquiriesForExport(filters)
  const header = [
    "Name",
    "Email",
    "Organization",
    "Practice Area",
    "Status",
    "Message",
    "Internal Notes",
    "Received",
  ]

  const escape = (value: string) => `"${value.replace(/"/g, '""').replace(/\r?\n/g, " ")}"`

  const csvLines = [
    header.join(","),
    ...rows.map((row) =>
      [
        row.name,
        row.email,
        row.organization,
        row.interest,
        row.status,
        row.message,
        row.internalNotes,
        row.createdAt,
      ]
        .map((value) => escape(String(value ?? "")))
        .join(",")
    ),
  ]

  return { success: true as const, csv: csvLines.join("\n") }
}

export async function createAdminUserAction(formData: FormData): Promise<ActionResult> {
  const currentAdmin = await getAuthenticatedAdmin()
  if (!currentAdmin) return { error: "Unauthorized." }
  if (currentAdmin.role !== "super-admin") {
    return { error: "Only super admins may add administrators." }
  }

  const parsed = createAdminSchema.safeParse({
    name: formData.get("name"),
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role") || "admin",
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." }
  }

  try {
    const payload = await getPayload({ config })
    const created = await payload.create({
      collection: "users",
      data: {
        name: parsed.data.name,
        username: parsed.data.username,
        email: parsed.data.email,
        password: parsed.data.password,
        role: parsed.data.role === "super-admin" ? "super-admin" : "admin",
        active: true,
      },
      overrideAccess: true,
    })

    await logActivity({
      actor: currentAdmin,
      action: "create",
      entityType: "admin",
      entityId: created.id,
      entityLabel: `${parsed.data.name} (@${parsed.data.username})`,
      summary: `Created administrator as ${parsed.data.role}`,
    })

    return { success: true }
  } catch (err: unknown) {
    return { error: errorMessage(err, "Failed to create administrator.") }
  }
}

export async function updateAdminUserAction(formData: FormData): Promise<ActionResult> {
  const currentAdmin = await getAuthenticatedAdmin()
  if (!currentAdmin) return { error: "Unauthorized." }
  if (currentAdmin.role !== "super-admin") {
    return { error: "Only super admins may edit administrators." }
  }

  const parsed = updateAdminSchema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
    email: formData.get("email"),
    role: formData.get("role"),
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." }
  }

  try {
    const payload = await getPayload({ config })
    const before = await payload.findByID({
      collection: "users",
      id: parsed.data.id,
      depth: 0,
      overrideAccess: true,
    })

    await payload.update({
      collection: "users",
      id: parsed.data.id,
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        role: parsed.data.role,
      },
      overrideAccess: true,
    })

    const { changes, summary } = diffFields(
      { name: before.name, email: before.email, role: before.role },
      { name: parsed.data.name, email: parsed.data.email, role: parsed.data.role },
      { name: "name", email: "email", role: "role" }
    )
    await logActivity({
      actor: currentAdmin,
      action: "update",
      entityType: "admin",
      entityId: parsed.data.id,
      entityLabel: `${before.name as string} (@${before.username as string})`,
      summary,
      changes,
    })

    return { success: true }
  } catch (err) {
    return { error: errorMessage(err, "Failed to update administrator.") }
  }
}

export async function resetAdminPasswordAction(formData: FormData): Promise<ActionResult> {
  const currentAdmin = await getAuthenticatedAdmin()
  if (!currentAdmin) return { error: "Unauthorized." }
  if (currentAdmin.role !== "super-admin") {
    return { error: "Only super admins may reset passwords." }
  }

  const parsed = resetAdminPasswordSchema.safeParse({
    id: formData.get("id"),
    password: formData.get("password"),
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." }
  }

  try {
    const payload = await getPayload({ config })
    const target = await payload.findByID({
      collection: "users",
      id: parsed.data.id,
      depth: 0,
      overrideAccess: true,
    })

    await payload.update({
      collection: "users",
      id: parsed.data.id,
      data: { password: parsed.data.password },
      overrideAccess: true,
    })

    await logActivity({
      actor: currentAdmin,
      action: "reset-password",
      entityType: "admin",
      entityId: parsed.data.id,
      entityLabel: `${target.name as string} (@${target.username as string})`,
      summary: "Reset password",
    })

    return { success: true }
  } catch (err) {
    return { error: errorMessage(err, "Failed to reset password.") }
  }
}

export async function toggleAdminActiveAction(
  id: string | number,
  currentActive: boolean
): Promise<ActionResult & { newStatus?: boolean }> {
  const currentAdmin = await getAuthenticatedAdmin()
  if (!currentAdmin) return { error: "Unauthorized." }
  if (currentAdmin.role !== "super-admin") {
    return { error: "Only super admins may activate or deactivate accounts." }
  }
  if (String(currentAdmin.id) === String(id)) {
    return { error: "You cannot deactivate your own account." }
  }

  try {
    const payload = await getPayload({ config })
    const target = await payload.findByID({
      collection: "users",
      id,
      depth: 0,
      overrideAccess: true,
    })

    if (target.role === "super-admin") {
      return { error: "The super admin account cannot be deactivated." }
    }

    await payload.update({
      collection: "users",
      id,
      data: { active: !currentActive },
      overrideAccess: true,
    })

    await logActivity({
      actor: currentAdmin,
      action: currentActive ? "deactivate" : "reactivate",
      entityType: "admin",
      entityId: id,
      entityLabel: `${target.name as string} (@${target.username as string})`,
      summary: currentActive ? "Deactivated account" : "Reactivated account",
    })

    return { success: true, newStatus: !currentActive }
  } catch (err) {
    return { error: errorMessage(err, "Failed to toggle status.") }
  }
}

export async function deleteAdminUserAction(id: string | number): Promise<ActionResult> {
  const currentAdmin = await getAuthenticatedAdmin()
  if (!currentAdmin) return { error: "Unauthorized." }
  if (currentAdmin.role !== "super-admin") {
    return { error: "Only super admins may delete administrators." }
  }
  if (String(currentAdmin.id) === String(id)) {
    return { error: "You cannot delete your own account." }
  }

  try {
    const payload = await getPayload({ config })
    const target = await payload.findByID({
      collection: "users",
      id,
      depth: 0,
      overrideAccess: true,
    })
    await payload.delete({ collection: "users", id, overrideAccess: true })

    await logActivity({
      actor: currentAdmin,
      action: "delete",
      entityType: "admin",
      entityId: id,
      entityLabel: `${target.name as string} (@${target.username as string})`,
      summary: "Deleted administrator",
    })

    return { success: true }
  } catch (err) {
    return { error: errorMessage(err, "Failed to delete administrator.") }
  }
}

export async function updateOwnProfileAction(formData: FormData): Promise<ActionResult> {
  const currentAdmin = await getAuthenticatedAdmin()
  if (!currentAdmin) return { error: "Unauthorized." }

  const parsed = updateOwnProfileSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." }
  }

  try {
    const payload = await getPayload({ config })
    await payload.update({
      collection: "users",
      id: currentAdmin.id,
      data: { name: parsed.data.name, email: parsed.data.email },
      overrideAccess: true,
    })

    const { changes, summary } = diffFields(
      { name: currentAdmin.name, email: currentAdmin.email },
      { name: parsed.data.name, email: parsed.data.email },
      { name: "name", email: "email" }
    )
    await logActivity({
      actor: currentAdmin,
      action: "update",
      entityType: "profile",
      entityId: currentAdmin.id,
      entityLabel: parsed.data.name,
      summary,
      changes,
    })

    return { success: true }
  } catch (err) {
    return { error: errorMessage(err, "Failed to update profile.") }
  }
}

export async function changeOwnPasswordAction(formData: FormData): Promise<ActionResult> {
  const currentAdmin = await getAuthenticatedAdmin()
  if (!currentAdmin) return { error: "Unauthorized." }

  const parsed = changeOwnPasswordSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." }
  }

  try {
    const payload = await getPayload({ config })

    // Verify the current password by attempting a login with it.
    await payload.login({
      collection: "users",
      data: { email: currentAdmin.email, password: parsed.data.currentPassword },
    })

    await payload.update({
      collection: "users",
      id: currentAdmin.id,
      data: { password: parsed.data.newPassword },
      overrideAccess: true,
    })

    await logActivity({
      actor: currentAdmin,
      action: "update",
      entityType: "profile",
      entityId: currentAdmin.id,
      entityLabel: currentAdmin.name,
      summary: "Changed own password",
    })

    return { success: true }
  } catch {
    return { error: "Your current password is incorrect." }
  }
}
