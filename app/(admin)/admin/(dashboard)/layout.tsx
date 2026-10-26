import { redirect } from "next/navigation"

import { AdminShell } from "@/components/admin/shell/admin-shell"
import { getAuthenticatedAdmin } from "@/lib/admin-auth"
import { getPendingInquiriesCount } from "@/lib/admin-data"
import { getAssignmentInsights } from "@/lib/assignments-data"

export const dynamic = "force-dynamic"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const admin = await getAuthenticatedAdmin()
  if (!admin) {
    redirect("/admin/login")
  }

  const [pendingCount, assignmentInsights] = await Promise.all([
    getPendingInquiriesCount(),
    getAssignmentInsights(),
  ])

  const badgeCounts = {
    inquiries: pendingCount,
    assignments: assignmentInsights.overdueCount + assignmentInsights.dueSoonCount,
  }

  return (
    <AdminShell admin={admin} badgeCounts={badgeCounts}>
      {children}
    </AdminShell>
  )
}
