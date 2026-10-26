"use server"

import { getPayload } from "payload"
import config from "@payload-config"

import { getAuthenticatedAdmin } from "./admin-auth"
import {
  assignmentSchema,
  categorySchema,
  updateAssignmentSchema,
  updateCategorySchema,
} from "./assignments-schema"
import { diffFields, logActivity } from "./activity-log"

type ActionResult = { success: true } | { error: string }

function errorMessage(err: unknown, fallback: string) {
  if (err instanceof Error) {
    if (err.message.toLowerCase().includes("unique") || err.message.includes("duplicate key")) {
      return "That category name is already in use."
    }
    return err.message
  }
  return fallback
}

export async function createCategoryAction(formData: FormData): Promise<ActionResult> {
  const admin = await getAuthenticatedAdmin()
  if (!admin) return { error: "Unauthorized." }

  const parsed = categorySchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    color: formData.get("color") || "signal",
  })
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." }
  }

  try {
    const payload = await getPayload({ config })
    const created = await payload.create({
      collection: "assignment-categories",
      data: parsed.data,
      overrideAccess: true,
    })

    await logActivity({
      actor: admin,
      action: "create",
      entityType: "category",
      entityId: created.id,
      entityLabel: parsed.data.name,
      summary: "Created category",
    })

    return { success: true }
  } catch (err) {
    return { error: errorMessage(err, "Failed to create category.") }
  }
}

export async function updateCategoryAction(formData: FormData): Promise<ActionResult> {
  const admin = await getAuthenticatedAdmin()
  if (!admin) return { error: "Unauthorized." }

  const parsed = updateCategorySchema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
    description: formData.get("description"),
    color: formData.get("color") || "signal",
  })
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." }
  }

  try {
    const payload = await getPayload({ config })
    const before = await payload.findByID({
      collection: "assignment-categories",
      id: parsed.data.id,
      depth: 0,
      overrideAccess: true,
    })

    await payload.update({
      collection: "assignment-categories",
      id: parsed.data.id,
      data: {
        name: parsed.data.name,
        description: parsed.data.description,
        color: parsed.data.color,
      },
      overrideAccess: true,
    })

    const { changes, summary } = diffFields(
      { name: before.name, description: before.description, color: before.color },
      { name: parsed.data.name, description: parsed.data.description, color: parsed.data.color },
      { name: "name", description: "description", color: "color" }
    )
    await logActivity({
      actor: admin,
      action: "update",
      entityType: "category",
      entityId: parsed.data.id,
      entityLabel: before.name as string,
      summary,
      changes,
    })

    return { success: true }
  } catch (err) {
    return { error: errorMessage(err, "Failed to update category.") }
  }
}

export async function deleteCategoryAction(id: string | number): Promise<ActionResult> {
  const admin = await getAuthenticatedAdmin()
  if (!admin) return { error: "Unauthorized." }

  try {
    const payload = await getPayload({ config })
    const inUse = await payload.count({
      collection: "assignments",
      where: { category: { equals: id } },
      overrideAccess: true,
    })
    if (inUse.totalDocs > 0) {
      return {
        error: `This category is used by ${inUse.totalDocs} assignment${
          inUse.totalDocs === 1 ? "" : "s"
        }. Reassign or delete them first.`,
      }
    }

    const before = await payload.findByID({
      collection: "assignment-categories",
      id,
      depth: 0,
      overrideAccess: true,
    })
    await payload.delete({ collection: "assignment-categories", id, overrideAccess: true })

    await logActivity({
      actor: admin,
      action: "delete",
      entityType: "category",
      entityId: id,
      entityLabel: before.name as string,
      summary: "Deleted category",
    })

    return { success: true }
  } catch (err) {
    return { error: errorMessage(err, "Failed to delete category.") }
  }
}

export async function createAssignmentAction(formData: FormData): Promise<ActionResult> {
  const admin = await getAuthenticatedAdmin()
  if (!admin) return { error: "Unauthorized." }

  const parsed = assignmentSchema.safeParse({
    category: formData.get("category"),
    description: formData.get("description"),
    value: formData.get("value"),
    entity: formData.get("entity"),
    assignedTo: formData.get("assignedTo"),
    contact: formData.get("contact"),
    status: formData.get("status") || "not-started",
    priority: formData.get("priority") || "medium",
    dueDate: formData.get("dueDate"),
    remark: formData.get("remark"),
  })
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." }
  }

  try {
    const payload = await getPayload({ config })
    const created = await payload.create({
      collection: "assignments",
      data: {
        ...parsed.data,
        dueDate: parsed.data.dueDate || null,
      },
      overrideAccess: true,
    })

    await logActivity({
      actor: admin,
      action: "create",
      entityType: "assignment",
      entityId: created.id,
      entityLabel: parsed.data.description,
      summary: "Created assignment",
    })

    return { success: true }
  } catch (err) {
    return { error: errorMessage(err, "Failed to create assignment.") }
  }
}

export async function updateAssignmentAction(formData: FormData): Promise<ActionResult> {
  const admin = await getAuthenticatedAdmin()
  if (!admin) return { error: "Unauthorized." }

  const parsed = updateAssignmentSchema.safeParse({
    id: formData.get("id"),
    category: formData.get("category"),
    description: formData.get("description"),
    value: formData.get("value"),
    entity: formData.get("entity"),
    assignedTo: formData.get("assignedTo"),
    contact: formData.get("contact"),
    status: formData.get("status") || "not-started",
    priority: formData.get("priority") || "medium",
    dueDate: formData.get("dueDate"),
    remark: formData.get("remark"),
  })
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." }
  }

  try {
    const payload = await getPayload({ config })
    const { id, ...data } = parsed.data
    const before = await payload.findByID({
      collection: "assignments",
      id,
      depth: 0,
      overrideAccess: true,
    })

    await payload.update({
      collection: "assignments",
      id,
      data: { ...data, dueDate: data.dueDate || null },
      overrideAccess: true,
    })

    const { changes, summary } = diffFields(
      {
        category: before.category,
        description: before.description,
        value: before.value,
        entity: before.entity,
        assignedTo: before.assignedTo,
        contact: before.contact,
        status: before.status,
        priority: before.priority,
        dueDate: before.dueDate,
        remark: before.remark,
      },
      {
        category: data.category,
        description: data.description,
        value: data.value,
        entity: data.entity,
        assignedTo: data.assignedTo,
        contact: data.contact,
        status: data.status,
        priority: data.priority,
        dueDate: data.dueDate || null,
        remark: data.remark,
      },
      {
        category: "category",
        description: "description",
        value: "value",
        entity: "entity",
        assignedTo: "assigned to",
        contact: "contact",
        status: "status",
        priority: "priority",
        dueDate: "due date",
        remark: "remark",
      }
    )
    await logActivity({
      actor: admin,
      action: "update",
      entityType: "assignment",
      entityId: id,
      entityLabel: before.description as string,
      summary,
      changes,
    })

    return { success: true }
  } catch (err) {
    return { error: errorMessage(err, "Failed to update assignment.") }
  }
}

export async function deleteAssignmentAction(id: string | number): Promise<ActionResult> {
  const admin = await getAuthenticatedAdmin()
  if (!admin) return { error: "Unauthorized." }

  try {
    const payload = await getPayload({ config })
    const before = await payload.findByID({
      collection: "assignments",
      id,
      depth: 0,
      overrideAccess: true,
    })
    await payload.delete({ collection: "assignments", id, overrideAccess: true })

    await logActivity({
      actor: admin,
      action: "delete",
      entityType: "assignment",
      entityId: id,
      entityLabel: before.description as string,
      summary: "Deleted assignment",
    })

    return { success: true }
  } catch (err) {
    return { error: errorMessage(err, "Failed to delete assignment.") }
  }
}
