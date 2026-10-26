import type { CollectionConfig } from "payload"

export const SUPER_ADMIN = "super-admin" as const
export const ADMIN = "admin" as const

export function isSuperAdmin(user: unknown) {
  if (!user || typeof user !== "object") return false
  return (user as { role?: unknown }).role === SUPER_ADMIN
}

export const Users: CollectionConfig = {
  slug: "users",
  labels: {
    singular: "User",
    plural: "Users",
  },
  admin: {
    useAsTitle: "email",
    defaultColumns: [
      "name",
      "username",
      "email",
      "role",
      "active",
      "updatedAt",
    ],
    group: "Administration",
    description: "Admin users who can sign in to the dashboard.",
  },
  auth: {
    // Matches the longest "remember session" cookie duration (lib/admin-actions.ts),
    // so the JWT itself doesn't expire before the cookie does.
    tokenExpiration: 60 * 60 * 24 * 7,
    loginWithUsername: {
      allowEmailLogin: true,
      requireEmail: true,
      requireUsername: true,
    },
  },
  access: {
    admin: ({ req: { user } }) => Boolean(user && user.active !== false),
    read: ({ req: { user } }) => Boolean(user),
    create: ({ req: { user } }) => isSuperAdmin(user),
    update: ({ req: { user } }) => {
      if (!user) return false
      if (isSuperAdmin(user)) return true
      // Regular admins may only update their own profile.
      return { id: { equals: user.id } }
    },
    delete: ({ req: { user } }) => isSuperAdmin(user),
  },
  hooks: {
    beforeValidate: [
      ({ data, operation, originalDoc, req }) => {
        if (!data) return data

        // Logged-in admins can only create regular admins.
        // Seed runs with no req.user and may set super-admin once.
        if (operation === "create") {
          if (req.user || data.role !== SUPER_ADMIN) {
            data.role = ADMIN
          }
        }

        if (operation === "update" && originalDoc) {
          const isSelf = Boolean(
            req.user && String(originalDoc.id) === String(req.user.id)
          )

          // Super admin is locked: role + active + identity.
          if (isSuperAdmin(originalDoc)) {
            data.role = SUPER_ADMIN
            data.active = true
            if (originalDoc.email) data.email = originalDoc.email
            if (originalDoc.username) data.username = originalDoc.username
            return data
          }

          // Nobody can promote anyone to super-admin.
          if (data.role === SUPER_ADMIN) {
            data.role = ADMIN
          }

          // Only super admin may change roles / active on other users.
          if (!isSuperAdmin(req.user)) {
            data.role = originalDoc.role ?? ADMIN
            if ("active" in data) data.active = originalDoc.active
          }

          // No one can deactivate or demote themselves.
          if (isSelf) {
            if ("active" in data && data.active === false) {
              throw new Error("You cannot deactivate your own account.")
            }
            if (data.role && data.role !== originalDoc.role) {
              data.role = originalDoc.role
            }
          }
        }

        return data
      },
    ],
    beforeDelete: [
      async ({ id, req }) => {
        const existing = await req.payload.findByID({
          collection: "users",
          id,
          depth: 0,
          overrideAccess: true,
        })
        if (isSuperAdmin(existing)) {
          throw new Error("The super admin account cannot be deleted.")
        }
        if (req.user && String(existing.id) === String(req.user.id)) {
          throw new Error("You cannot delete your own account.")
        }
      },
    ],
    beforeLogin: [
      ({ user }) => {
        if (user?.active === false) {
          throw new Error(
            "This account has been deactivated. Contact an administrator."
          )
        }
      },
    ],
    afterLogin: [
      async ({ user, req }) => {
        await req.payload.update({
          collection: "users",
          id: user.id,
          data: { lastLoginAt: new Date().toISOString() },
          overrideAccess: true,
        })
      },
    ],
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      admin: {
        description: "Display name shown in the admin panel.",
      },
    },
    {
      name: "role",
      type: "select",
      required: true,
      defaultValue: ADMIN,
      options: [
        { label: "Super Admin", value: SUPER_ADMIN },
        { label: "Admin", value: ADMIN },
      ],
      admin: {
        position: "sidebar",
        description:
          "Only one Super Admin exists (seeded). New users are always Admin.",
        readOnly: true,
      },
    },
    {
      name: "active",
      type: "checkbox",
      defaultValue: true,
      access: {
        update: ({ req: { user }, doc }) =>
          isSuperAdmin(user) && !isSuperAdmin(doc),
      },
      admin: {
        position: "sidebar",
        description: "Turn off to deactivate an admin without deleting them.",
      },
    },
    {
      name: "lastLoginAt",
      type: "date",
      admin: {
        position: "sidebar",
        readOnly: true,
        description: "Set automatically when this admin signs in.",
      },
    },
  ],
}
