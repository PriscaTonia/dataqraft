"use client"

import { useRef, useState, useTransition } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { History, Search } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ActionBadge, ACTION_META, ENTITY_LABEL, EntityBadge } from "@/components/admin/activity/activity-meta"
import { ActivityDetailDialog } from "@/components/admin/activity/activity-detail-dialog"
import type { ActivityLogRow } from "@/lib/activity-log-data"
import type { ActivityLogFilters } from "@/lib/activity-log-schema"
import { ACTIVITY_ACTIONS, ACTIVITY_ENTITY_TYPES } from "@/collections/ActivityLogs"
import { formatDateTime } from "@/lib/datetime"

const ACTION_OPTIONS = [
  { value: "all", label: "All actions" },
  ...ACTIVITY_ACTIONS.map((a) => ({ value: a, label: ACTION_META[a]?.label ?? a })),
]

const ENTITY_OPTIONS = [
  { value: "all", label: "All entities" },
  ...ACTIVITY_ENTITY_TYPES.map((e) => ({ value: e, label: ENTITY_LABEL[e] ?? e })),
]

export function ActivityLogTable({
  rows,
  total,
  totalPages,
  page,
  filters,
}: {
  rows: ActivityLogRow[]
  total: number
  totalPages: number
  page: number
  filters: ActivityLogFilters
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [searchValue, setSearchValue] = useState(filters.search)
  const [viewing, setViewing] = useState<ActivityLogRow | null>(null)

  const [prevSearch, setPrevSearch] = useState(filters.search)
  if (filters.search !== prevSearch) {
    setPrevSearch(filters.search)
    setSearchValue(filters.search)
  }

  function pushParams(next: Partial<Record<string, string>>) {
    const params = new URLSearchParams(searchParams.toString())
    for (const [key, value] of Object.entries(next)) {
      if (!value || value === "all" || value === "") {
        params.delete(key)
      } else {
        params.set(key, value)
      }
    }
    startTransition(() => router.push(`${pathname}?${params.toString()}`))
  }

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  function handleSearchChange(value: string) {
    setSearchValue(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => pushParams({ search: value, page: "1" }), 350)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-md flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchValue}
            onChange={(event) => handleSearchChange(event.target.value)}
            placeholder="Search by admin, record, or summary..."
            className="h-10 rounded-xl pl-9 text-sm"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={filters.action}
            onValueChange={(value) => value && pushParams({ action: value, page: "1" })}
            items={ACTION_OPTIONS}
          >
            <SelectTrigger className="h-10 w-full text-sm sm:w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ACTION_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.entityType}
            onValueChange={(value) => value && pushParams({ entityType: value, page: "1" })}
            items={ENTITY_OPTIONS}
          >
            <SelectTrigger className="h-10 w-full text-sm sm:w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ENTITY_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className={isPending ? "opacity-60 transition-opacity" : "transition-opacity"}>
        {/* Desktop / tablet: table */}
        <div className="hidden min-h-128 overflow-hidden rounded-2xl border border-border bg-card shadow-sm md:block lg:min-h-160">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40 font-mono text-xs text-muted-foreground uppercase tracking-wider">
                  <th className="px-4 py-3">When</th>
                  <th className="px-4 py-3">Admin</th>
                  <th className="px-4 py-3">Action</th>
                  <th className="px-4 py-3">Summary</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-muted-foreground">
                      <History className="mx-auto mb-2 size-8 text-muted-foreground/40" />
                      <p className="text-sm font-medium">No activity found</p>
                      <p className="mt-1 text-sm">Try adjusting your filters.</p>
                    </td>
                  </tr>
                ) : (
                  rows.map((log) => (
                    <tr
                      key={log.id}
                      onClick={() => setViewing(log)}
                      className="cursor-pointer transition hover:bg-muted/30"
                    >
                      <td className="px-4 py-4 font-mono text-xs text-muted-foreground whitespace-nowrap">
                        {formatDateTime(log.createdAt)}
                      </td>
                      <td className="px-4 py-4">
                        <div className="font-medium text-foreground">{log.actorName}</div>
                        <div className="text-xs text-muted-foreground">{log.actorEmail}</div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <ActionBadge action={log.action} />
                          <EntityBadge entityType={log.entityType} />
                        </div>
                      </td>
                      <td className="max-w-md px-4 py-4 text-foreground">
                        <span className="line-clamp-1">{log.summary}</span>
                        {log.entityLabel ? (
                          <div className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                            {log.entityLabel}
                          </div>
                        ) : null}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile: cards */}
        <div className="space-y-3 md:hidden">
          {rows.length === 0 ? (
            <div className="rounded-2xl border border-border bg-card px-4 py-12 text-center text-muted-foreground">
              <History className="mx-auto mb-2 size-8 text-muted-foreground/40" />
              <p className="text-sm font-medium">No activity found</p>
              <p className="mt-1 text-sm">Try adjusting your filters.</p>
            </div>
          ) : (
            rows.map((log) => (
              <button
                key={log.id}
                type="button"
                onClick={() => setViewing(log)}
                className="block w-full rounded-2xl border border-border bg-card p-4 text-left shadow-sm transition hover:border-signal/30"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-foreground">{log.actorName}</p>
                    <p className="truncate text-xs text-muted-foreground">{log.actorEmail}</p>
                  </div>
                  <span className="shrink-0 font-mono text-[11px] whitespace-nowrap text-muted-foreground">
                    {formatDateTime(log.createdAt)}
                  </span>
                </div>
                <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                  <ActionBadge action={log.action} />
                  <EntityBadge entityType={log.entityType} />
                </div>
                <p className="mt-2.5 line-clamp-1 text-sm text-foreground">{log.summary}</p>
                {log.entityLabel ? (
                  <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                    {log.entityLabel}
                  </p>
                ) : null}
              </button>
            ))
          )}
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          {total} {total === 1 ? "entry" : "entries"}
        </span>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => pushParams({ page: String(page - 1) })}
          >
            Previous
          </Button>
          <span className="font-mono">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => pushParams({ page: String(page + 1) })}
          >
            Next
          </Button>
        </div>
      </div>

      <ActivityDetailDialog log={viewing} onOpenChange={(open) => !open && setViewing(null)} />
    </div>
  )
}
