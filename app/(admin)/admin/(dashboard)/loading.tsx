import { SkeletonBlock } from "@/components/admin/shell/skeleton-block"

export default function OverviewLoading() {
  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <div className="space-y-2">
        <SkeletonBlock className="h-3 w-40" />
        <SkeletonBlock className="h-8 w-64" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <SkeletonBlock key={index} className="h-32 rounded-2xl" />
        ))}
      </div>
      <SkeletonBlock className="h-64 rounded-2xl" />
      <SkeletonBlock className="h-64 rounded-2xl" />
    </div>
  )
}
