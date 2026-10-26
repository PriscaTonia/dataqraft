import { PageHeader } from "@/components/admin/shell/page-header"
import { InquiriesTable } from "@/components/admin/inquiries/inquiries-table"
import { getAuthenticatedAdmin } from "@/lib/admin-auth"
import { getInquiriesPage } from "@/lib/admin-data"
import { inquiryFiltersSchema } from "@/lib/admin-schema"

export const dynamic = "force-dynamic"

export default async function InquiriesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const admin = await getAuthenticatedAdmin()
  const rawParams = await searchParams
  const filters = inquiryFiltersSchema.parse({
    search: rawParams.search,
    status: rawParams.status,
    interest: rawParams.interest,
    sort: rawParams.sort,
    page: rawParams.page,
  })

  const { rows, total, totalPages, page } = await getInquiriesPage(filters)

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="Operations"
        title="Briefing inquiries"
        description="Review, triage and respond to briefing requests submitted through the website."
      />
      <InquiriesTable
        rows={rows}
        total={total}
        totalPages={totalPages}
        page={page}
        filters={filters}
        canManage={admin?.role === "super-admin"}
      />
    </div>
  )
}
