import type { Payload } from "payload"

import { SUPER_ADMIN } from "@/collections/Users"

const SUPER_ADMIN_EMAIL = "dqladmin@dql.com"
const SUPER_ADMIN_USERNAME = "dqladmin"
const SUPER_ADMIN_NAME = "DQL Admin"

export async function seedSuperAdmin(payload: Payload) {
  const password =
    process.env.SEED_SUPER_ADMIN_PASSWORD || process.env.PAYLOAD_SUPER_ADMIN_PASSWORD

  if (!password) {
    payload.logger.warn(
      "SEED_SUPER_ADMIN_PASSWORD is not set — skipping super admin seed."
    )
    return
  }

  const existing = await payload.find({
    collection: "users",
    where: {
      or: [
        { email: { equals: SUPER_ADMIN_EMAIL } },
        { username: { equals: SUPER_ADMIN_USERNAME } },
        { role: { equals: SUPER_ADMIN } },
      ],
    },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })

  if (existing.totalDocs > 0) {
    payload.logger.info("Super admin already present — seed skipped.")
    return
  }

  await payload.create({
    collection: "users",
    data: {
      name: SUPER_ADMIN_NAME,
      email: SUPER_ADMIN_EMAIL,
      username: SUPER_ADMIN_USERNAME,
      password,
      role: SUPER_ADMIN,
      active: true,
    },
    overrideAccess: true,
  })

  payload.logger.info(
    `Seeded super admin (${SUPER_ADMIN_USERNAME} / ${SUPER_ADMIN_EMAIL}).`
  )
}
