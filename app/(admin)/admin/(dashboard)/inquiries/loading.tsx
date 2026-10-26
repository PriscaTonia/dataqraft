import { SkeletonBlock } from "@/components/admin/shell/skeleton-block"

export default function InquiriesLoading() {
  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <div className="space-y-2">
        <SkeletonBlock className="h-3 w-24" />
        <SkeletonBlock className="h-8 w-56" />
      </div>
      <SkeletonBlock className="h-10 w-full max-w-md" />
      <SkeletonBlock className="h-96 rounded-2xl" />
    </div>
  )
}
