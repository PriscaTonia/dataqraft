import type { CollectionConfig } from "payload"

export const Assignments: CollectionConfig = {
  slug: "assignments",
  labels: {
    singular: "Assignment",
    plural: "Assignments",
  },
  admin: {
    useAsTitle: "description",
    defaultColumns: ["description", "category", "status", "priority", "dueDate"],
    group: "Operations",
    description: "Tasks and assignments tracked by the team.",
  },
  access: {
    read: ({ req: { user } }) => Boolean(user && user.active !== false),
    create: ({ req: { user } }) => Boolean(user && user.active !== false),
    update: ({ req: { user } }) => Boolean(user && user.active !== false),
    delete: ({ req: { user } }) => Boolean(user && user.active !== false),
  },
  fields: [
    {
      name: "category",
      type: "relationship",
      relationTo: "assignment-categories",
      required: true,
    },
    {
      name: "description",
      type: "textarea",
      required: true,
    },
    {
      name: "value",
      type: "text",
      label: "Value",
      admin: {
        description: "Monetary value or free text, e.g. $100M or '2 of 5 identified'.",
      },
    },
    {
      name: "entity",
      type: "text",
      label: "Entity / Entities",
    },
    {
      name: "assignedTo",
      type: "text",
      label: "Assigned To",
    },
    {
      name: "contact",
      type: "text",
    },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "not-started",
      options: [
        { label: "Not Started", value: "not-started" },
        { label: "In Progress", value: "in-progress" },
        { label: "In Review", value: "in-review" },
        { label: "Submitted", value: "submitted" },
      ],
    },
    {
      name: "priority",
      type: "select",
      required: true,
      defaultValue: "medium",
      options: [
        { label: "Low", value: "low" },
        { label: "Medium", value: "medium" },
        { label: "High", value: "high" },
      ],
    },
    {
      name: "dueDate",
      type: "date",
      admin: {
        date: { pickerAppearance: "dayAndTime" },
      },
    },
    {
      name: "remark",
      type: "textarea",
    },
  ],
  timestamps: true,
}
