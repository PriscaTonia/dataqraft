import { redirect } from "next/navigation"

import { PageHeader } from "@/components/admin/shell/page-header"
import { ActivityLogTable } from "@/components/admin/activity/activity-log-table"
import { getAuthenticatedAdmin } from "@/lib/admin-auth"
import { getActivityLogsPage } from "@/lib/activity-log-data"
import { activityLogFiltersSchema } from "@/lib/activity-log-schema"

export const dynamic = "force-dynamic"

export default async function ActivityLogPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const admin = await getAuthenticatedAdmin()
  if (!admin || admin.role !== "super-admin") {
    redirect("/admin")
  }

  const rawParams = await searchParams
  const filters = activityLogFiltersSchema.parse({
    search: rawParams.search,
    action: rawParams.action,
    entityType: rawParams.entityType,
    page: rawParams.page,
  })

  const { rows, total, totalPages, page } = await getActivityLogsPage(filters)

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="Operations"
        title="Activity log"
        description="A record of every sign-in, creation, edit, and deletion made across the admin console."
      />
      <ActivityLogTable rows={rows} total={total} totalPages={totalPages} page={page} filters={filters} />
    </div>
  )
}
