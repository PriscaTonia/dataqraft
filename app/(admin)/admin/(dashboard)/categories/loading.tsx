import { SkeletonBlock } from "@/components/admin/shell/skeleton-block"

export default function CategoriesLoading() {
  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <SkeletonBlock className="h-3 w-24" />
          <SkeletonBlock className="h-8 w-56" />
        </div>
        <SkeletonBlock className="h-9 w-36 rounded-xl" />
      </div>
      <SkeletonBlock className="h-64 rounded-2xl" />
    </div>
  )
}
