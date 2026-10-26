"use client"

import { useRef, useState, useTransition } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import {
  ArrowDown,
  ArrowUp,
  Download,
  Eye,
  MessageSquare,
  Search,
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { StatusBadge, INTEREST_LABELS } from "@/components/admin/inquiries/status-badge"
import { InquiryDetailSheet } from "@/components/admin/inquiries/inquiry-detail-sheet"
import { exportInquiriesCsvAction } from "@/lib/admin-actions"
import type { InquiryRow } from "@/lib/admin-data"
import type { InquiryFilters } from "@/lib/admin-schema"
import { interestAreas } from "@/lib/content"

const STATUS_OPTIONS = [
  { value: "all", label: "All statuses" },
  { value: "new", label: "New" },
  { value: "in-review", label: "In Review" },
  { value: "contacted", label: "Contacted" },
  { value: "archived", label: "Closed" },
]

const INTEREST_OPTIONS = [
  { value: "all", label: "All practice areas" },
  ...interestAreas.map((area) => ({ value: area.value, label: area.label })),
]

export function InquiriesTable({
  rows,
  total,
  totalPages,
  page,
  filters,
  canManage,
}: {
  rows: InquiryRow[]
  total: number
  totalPages: number
  page: number
  filters: InquiryFilters
  canManage: boolean
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [searchValue, setSearchValue] = useState(filters.search)
  const [localRows, setLocalRows] = useState(rows)
  const [selected, setSelected] = useState<InquiryRow | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Re-sync local copies when the server hands us a new page of results.
  const [prevRows, setPrevRows] = useState(rows)
  if (rows !== prevRows) {
    setPrevRows(rows)
    setLocalRows(rows)
  }
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
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`)
    })
  }

  function handleSearchChange(value: string) {
    setSearchValue(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      pushParams({ search: value, page: "1" })
    }, 350)
  }

  function toggleSort() {
    pushParams({ sort: filters.sort === "asc" ? "desc" : "asc" })
  }

  async function handleExport() {
    const result = await exportInquiriesCsvAction({
      search: filters.search,
      status: filters.status,
      interest: filters.interest,
      sort: filters.sort,
    })
    if ("error" in result) {
      toast.error(result.error)
      return
    }
    const blob = new Blob([result.csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `dql-inquiries-${new Date().toISOString().slice(0, 10)}.csv`
    link.click()
    URL.revokeObjectURL(url)
    toast.success("Export ready.")
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-md flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchValue}
            onChange={(event) => handleSearchChange(event.target.value)}
            placeholder="Search by client, organization, or message..."
            className="h-10 rounded-xl pl-9 text-sm"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={filters.status}
            onValueChange={(value) => value && pushParams({ status: value, page: "1" })}
            items={STATUS_OPTIONS}
          >
            <SelectTrigger className="h-10 w-full text-sm sm:w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.interest}
            onValueChange={(value) => value && pushParams({ interest: value, page: "1" })}
            items={INTEREST_OPTIONS}
          >
            <SelectTrigger className="h-10 w-full text-sm sm:w-52">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {INTEREST_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="outline" size="default" onClick={handleExport} className="h-10 gap-1.5 text-sm">
            <Download className="size-3.5" />
            Export CSV
          </Button>
        </div>
      </div>

      <div className={isPending ? "opacity-60 transition-opacity" : "transition-opacity"}>
        {/* Desktop / tablet: table */}
        <div className="hidden min-h-128 overflow-hidden rounded-2xl border border-border bg-card shadow-sm md:block lg:min-h-160">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40 font-mono text-xs text-muted-foreground uppercase tracking-wider">
                  <th className="px-4 py-3">Client / Organisation</th>
                  <th className="px-4 py-3">Practice Area</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">
                    <button
                      type="button"
                      onClick={toggleSort}
                      className="inline-flex items-center gap-1 outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
                    >
                      Received
                      {filters.sort === "asc" ? (
                        <ArrowUp className="size-3" />
                      ) : (
                        <ArrowDown className="size-3" />
                      )}
                    </button>
                  </th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {localRows.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-muted-foreground">
                      <MessageSquare className="mx-auto mb-2 size-8 text-muted-foreground/40" />
                      <p className="text-sm font-medium">No briefing requests found</p>
                      <p className="mt-1 text-sm">Try adjusting your search or filters.</p>
                    </td>
                  </tr>
                ) : (
                  localRows.map((item) => (
                    <tr
                      key={item.id}
                      onClick={() => setSelected(item)}
                      className="cursor-pointer transition hover:bg-muted/30"
                    >
                      <td className="px-4 py-4 font-medium">
                        <div className="text-foreground">{item.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {item.organization} · {item.email}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="font-mono text-xs text-signal">
                          {INTEREST_LABELS[item.interest] ?? item.interest}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <StatusBadge status={item.status} />
                      </td>
                      <td className="px-4 py-4 font-mono text-xs text-muted-foreground">
                        {item.createdAt
                          ? new Date(item.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          : "Recently"}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={(event) => {
                            event.stopPropagation()
                            setSelected(item)
                          }}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <Eye className="size-3.5" />
                        </Button>
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
          {localRows.length === 0 ? (
            <div className="rounded-2xl border border-border bg-card px-4 py-12 text-center text-muted-foreground">
              <MessageSquare className="mx-auto mb-2 size-8 text-muted-foreground/40" />
              <p className="text-sm font-medium">No briefing requests found</p>
              <p className="mt-1 text-sm">Try adjusting your search or filters.</p>
            </div>
          ) : (
            localRows.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelected(item)}
                className="block w-full rounded-2xl border border-border bg-card p-4 text-left shadow-sm transition hover:border-signal/30"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-foreground">{item.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {item.organization} · {item.email}
                    </p>
                  </div>
                  <StatusBadge status={item.status} className="shrink-0" />
                </div>
                <div className="mt-3 flex items-center justify-between gap-2 text-xs">
                  <span className="truncate font-mono text-signal">
                    {INTEREST_LABELS[item.interest] ?? item.interest}
                  </span>
                  <span className="shrink-0 font-mono text-muted-foreground">
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "Recently"}
                  </span>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          {total} {total === 1 ? "result" : "results"}
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

      <InquiryDetailSheet
        inquiry={selected}
        canManage={canManage}
        onClose={() => setSelected(null)}
        onUpdated={(row) => {
          setLocalRows((prev) => prev.map((r) => (r.id === row.id ? row : r)))
          setSelected(row)
        }}
        onDeleted={(id) => {
          setLocalRows((prev) => prev.filter((r) => r.id !== id))
          setSelected(null)
        }}
      />
    </div>
  )
}
