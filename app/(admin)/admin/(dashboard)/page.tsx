import Link from "next/link"
import { ClipboardList, Inbox, ListChecks, MessageSquare, Users } from "lucide-react"

import { PageHeader } from "@/components/admin/shell/page-header"
import { StatCard } from "@/components/admin/shell/stat-card"
import { StatusBadge, INTEREST_LABELS } from "@/components/admin/inquiries/status-badge"
import {
  CategoryBadge,
  DueDateCell,
  PriorityBadge,
} from "@/components/admin/assignments/assignment-meta"
import { getOverviewStats } from "@/lib/admin-data"
import { getAssignmentInsights } from "@/lib/assignments-data"

export const dynamic = "force-dynamic"

export default async function OverviewPage() {
  const [stats, assignmentInsights] = await Promise.all([
    getOverviewStats(),
    getAssignmentInsights(),
  ])

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="Operational command"
        title="Overview"
        description="Data Qraft Limited executive operations and intelligence inquiries console."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Pending Assignments"
          value={assignmentInsights.pendingCount}
          hint={
            assignmentInsights.pendingCount === 0
              ? "All assignments submitted"
              : "Not yet submitted"
          }
          icon={ClipboardList}
          tone="amber"
        />
        <StatCard
          label="Total Inquiries"
          value={stats.total}
          caption="Briefing requests"
          hint="From the briefing form on the website"
          icon={Inbox}
          tone="signal"
        />
        <StatCard
          label="Admin Officers"
          value={stats.activeAdmins}
          caption={`of ${stats.totalAdmins} total`}
          hint="Active credentialed operators"
          icon={Users}
          tone="neutral"
        />
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h3 className="text-sm font-medium text-foreground">Needs attention</h3>
            <p className="text-sm text-muted-foreground">
              {assignmentInsights.overdueCount} overdue · {assignmentInsights.dueSoonCount} due
              soon · {assignmentInsights.highPriorityCount} high priority
            </p>
          </div>
          <Link
            href="/admin/assignments"
            className="font-mono text-xs text-signal hover:underline"
          >
            View all
          </Link>
        </div>

        {assignmentInsights.items.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
            <ListChecks className="size-8 text-muted-foreground/40" />
            <p className="text-sm font-medium text-foreground">Nothing needs attention</p>
            <p className="max-w-xs text-sm text-muted-foreground">
              No overdue, soon-due, or high priority assignments right now.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {assignmentInsights.items.map((item) => (
              <li
                key={item.id}
                className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <CategoryBadge name={item.categoryName} color={item.categoryColor} />
                  <p className="mt-1.5 truncate text-sm font-medium text-foreground">
                    {item.description}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <PriorityBadge priority={item.priority} />
                  <DueDateCell dueDate={item.dueDate} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h3 className="text-sm font-medium text-foreground">Recent inquiries</h3>
            <p className="text-sm text-muted-foreground">Latest 5 briefing requests</p>
          </div>
          <Link
            href="/admin/inquiries"
            className="font-mono text-xs text-signal hover:underline"
          >
            View all
          </Link>
        </div>

        {stats.recent.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
            <MessageSquare className="size-8 text-muted-foreground/40" />
            <p className="text-sm font-medium text-foreground">No briefing requests yet</p>
            <p className="max-w-xs text-sm text-muted-foreground">
              When prospective clients submit the briefing form on the homepage, they will
              appear here.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {stats.recent.map((item) => (
              <li key={item.id} className="flex items-center justify-between gap-4 px-5 py-4">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{item.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {item.organization} · {INTEREST_LABELS[item.interest] ?? item.interest}
                  </p>
                </div>
                <StatusBadge status={item.status} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
