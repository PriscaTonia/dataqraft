import { cookies, headers } from "next/headers"
import { getPayload } from "payload"
import config from "@payload-config"

export type AdminUser = {
  id: number | string
  name: string
  email: string
  username: string
  role: "super-admin" | "admin"
  active?: boolean
  createdAt?: string
  updatedAt?: string
  lastLoginAt?: string | null
}

/**
 * Validates the currently authenticated admin user using Payload's token and local API.
 * Reads the HTTP-only `payload-token` cookie.
 */
export async function getAuthenticatedAdmin(): Promise<AdminUser | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("payload-token")?.value
    if (!token) return null

    const payload = await getPayload({ config })
    const reqHeaders = await headers()

    // Pass the cookie header to payload.auth
    const { user } = await payload.auth({
      headers: reqHeaders,
    })

    if (!user || user.collection !== "users") return null
    if (user.active === false) return null

    return {
      id: user.id,
      name: (user.name as string) || (user.email as string),
      email: user.email as string,
      username: (user.username as string) || "",
      role: (user.role as "super-admin" | "admin") || "admin",
      active: user.active !== false,
      createdAt: user.createdAt as string,
      updatedAt: user.updatedAt as string,
      lastLoginAt: (user.lastLoginAt as string | null) ?? null,
    }
  } catch (err) {
    console.error("Error authenticating admin:", err)
    return null
  }
}
