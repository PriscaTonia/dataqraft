import { SkeletonBlock } from "@/components/admin/shell/skeleton-block"

export default function TeamLoading() {
  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <SkeletonBlock className="h-3 w-28" />
          <SkeletonBlock className="h-8 w-48" />
        </div>
        <SkeletonBlock className="h-9 w-40 rounded-xl" />
      </div>
      <SkeletonBlock className="h-80 rounded-2xl" />
    </div>
  )
}
