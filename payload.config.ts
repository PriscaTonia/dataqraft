import { vercelPostgresAdapter } from "@payloadcms/db-vercel-postgres"
import { lexicalEditor } from "@payloadcms/richtext-lexical"
import path from "path"
import { buildConfig } from "payload"
import { fileURLToPath } from "url"

import { ActivityLogs } from "./collections/ActivityLogs"
import { Assignments } from "./collections/Assignments"
import { AssignmentCategories } from "./collections/AssignmentCategories"
import { Inquiries } from "./collections/Inquiries"
import { Users } from "./collections/Users"
import { seedSuperAdmin } from "./lib/seed-super-admin"

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: "· Data Qraft",
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  routes: {
    admin: "/payload-admin",
  },
  collections: [Users, Inquiries, AssignmentCategories, Assignments, ActivityLogs],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: vercelPostgresAdapter({
    pool: {
      connectionString: process.env.POSTGRES_URL || process.env.DATABASE_URL || "",
    },
  }),
  async onInit(payload) {
    await seedSuperAdmin(payload)
  },
})
