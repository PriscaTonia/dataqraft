import { redirect } from "next/navigation"

import { TeamView } from "@/components/admin/team/team-view"
import { getAuthenticatedAdmin } from "@/lib/admin-auth"
import { getAdminsList } from "@/lib/admin-data"

export const dynamic = "force-dynamic"

export default async function TeamPage() {
  const admin = await getAuthenticatedAdmin()
  if (!admin || admin.role !== "super-admin") {
    redirect("/admin")
  }

  const admins = await getAdminsList()

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <TeamView currentAdmin={admin} initialAdmins={admins} />
    </div>
  )
}
