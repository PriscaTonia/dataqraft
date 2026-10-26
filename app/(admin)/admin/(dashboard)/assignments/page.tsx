import { AssignmentsTable } from "@/components/admin/assignments/assignments-table"
import { getAssignmentsPage, getCategories } from "@/lib/assignments-data"
import { assignmentFiltersSchema } from "@/lib/assignments-schema"

export const dynamic = "force-dynamic"

export default async function AssignmentsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const rawParams = await searchParams
  const filters = assignmentFiltersSchema.parse({
    search: rawParams.search,
    status: rawParams.status,
    priority: rawParams.priority,
    category: rawParams.category,
    page: rawParams.page,
  })

  const [{ rows, total, totalPages, page }, categories] = await Promise.all([
    getAssignmentsPage(filters),
    getCategories(),
  ])

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <AssignmentsTable
        rows={rows}
        total={total}
        totalPages={totalPages}
        page={page}
        filters={filters}
        categories={categories}
      />
    </div>
  )
}
