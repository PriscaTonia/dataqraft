import type { CollectionConfig } from "payload"

import { isSuperAdmin } from "./Users"

export const Inquiries: CollectionConfig = {
  slug: "inquiries",
  labels: {
    singular: "Inquiry",
    plural: "Inquiries",
  },
  admin: {
    useAsTitle: "organization",
    defaultColumns: ["name", "email", "organization", "interest", "status", "createdAt"],
    group: "Operations",
    description: "Briefing requests and inquiries submitted through the website.",
  },
  access: {
    // Anyone on the public web can submit an inquiry via the contact form
    create: () => true,
    // Any logged-in admin user may view inquiries
    read: ({ req: { user } }) => Boolean(user && user.active !== false),
    // Only super admins may triage (status/notes) or delete inquiries
    update: ({ req: { user } }) => isSuperAdmin(user),
    delete: ({ req: { user } }) => isSuperAdmin(user),
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      label: "Full Name",
    },
    {
      name: "email",
      type: "email",
      required: true,
      label: "Work Email",
    },
    {
      name: "organization",
      type: "text",
      required: true,
      label: "Organization / Institution",
    },
    {
      name: "interest",
      type: "select",
      required: true,
      label: "Area of Interest",
      options: [
        { label: "Market & Consumer Insights", value: "market" },
        { label: "Political Intelligence & Statecraft", value: "political" },
        { label: "Digital Sentiment & Brand Tracking", value: "digital" },
        { label: "Other", value: "other" },
      ],
    },
    {
      name: "message",
      type: "textarea",
      required: true,
      label: "Briefing Message",
    },
    {
      name: "status",
      type: "select",
      defaultValue: "new",
      options: [
        { label: "New", value: "new" },
        { label: "In Review", value: "in-review" },
        { label: "Contacted", value: "contacted" },
        { label: "Closed", value: "archived" },
      ],
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "internalNotes",
      type: "textarea",
      label: "Internal Admin Notes",
      admin: {
        position: "sidebar",
      },
    },
  ],
  timestamps: true,
}
