import { SkeletonBlock } from "@/components/admin/shell/skeleton-block"

export default function SettingsLoading() {
  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <div className="space-y-2">
        <SkeletonBlock className="h-3 w-20" />
        <SkeletonBlock className="h-8 w-40" />
      </div>
      {Array.from({ length: 3 }).map((_, index) => (
        <SkeletonBlock key={index} className="h-40 rounded-2xl" />
      ))}
    </div>
  )
}
