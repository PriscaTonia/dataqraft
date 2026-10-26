import { CategoriesTable } from "@/components/admin/categories/categories-table"
import { getCategoriesWithCounts } from "@/lib/assignments-data"

export const dynamic = "force-dynamic"

export default async function CategoriesPage() {
  const categories = await getCategoriesWithCounts()

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <CategoriesTable initialCategories={categories} />
    </div>
  )
}
