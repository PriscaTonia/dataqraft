import type { CollectionConfig } from "payload"

export const CATEGORY_COLORS = [
  { label: "Teal", value: "signal" },
  { label: "Amber", value: "amber" },
  { label: "Emerald", value: "emerald" },
  { label: "Rose", value: "rose" },
  { label: "Violet", value: "violet" },
  { label: "Slate", value: "slate" },
] as const

export const AssignmentCategories: CollectionConfig = {
  slug: "assignment-categories",
  labels: {
    singular: "Assignment Category",
    plural: "Assignment Categories",
  },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "color", "updatedAt"],
    group: "Operations",
    description: "Categories used to group assignments and tasks.",
  },
  access: {
    read: ({ req: { user } }) => Boolean(user && user.active !== false),
    create: ({ req: { user } }) => Boolean(user && user.active !== false),
    update: ({ req: { user } }) => Boolean(user && user.active !== false),
    delete: ({ req: { user } }) => Boolean(user && user.active !== false),
  },
  hooks: {
    beforeDelete: [
      async ({ id, req }) => {
        const inUse = await req.payload.count({
          collection: "assignments",
          where: { category: { equals: id } },
          overrideAccess: true,
        })
        if (inUse.totalDocs > 0) {
          throw new Error(
            `This category is used by ${inUse.totalDocs} assignment${
              inUse.totalDocs === 1 ? "" : "s"
            }. Reassign or delete them first.`
          )
        }
      },
    ],
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      unique: true,
    },
    {
      name: "description",
      type: "textarea",
      admin: {
        description: "Optional context about what this category covers.",
      },
    },
    {
      name: "color",
      type: "select",
      defaultValue: "signal",
      options: CATEGORY_COLORS.map((option) => ({ label: option.label, value: option.value })),
    },
  ],
  timestamps: true,
}
