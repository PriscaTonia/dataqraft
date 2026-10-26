"use client"

import { useState } from "react"

import { PageHeader } from "@/components/admin/shell/page-header"
import { AddAdminSheet } from "@/components/admin/team/add-admin-sheet"
import { TeamTable } from "@/components/admin/team/team-table"
import type { AdminRow } from "@/lib/admin-data"
import type { AdminUser } from "@/lib/admin-auth"

export function TeamView({
  currentAdmin,
  initialAdmins,
}: {
  currentAdmin: AdminUser
  initialAdmins: AdminRow[]
}) {
  const [admins, setAdmins] = useState(initialAdmins)
  const canAssignSuperAdmin = currentAdmin.role === "super-admin"

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Administration"
        title="Admin team"
        description="Personnel authorized to access strategic intelligence and briefings."
        action={
          <AddAdminSheet
            canAssignSuperAdmin={canAssignSuperAdmin}
            onCreated={(admin) => setAdmins((prev) => [admin, ...prev])}
          />
        }
      />
      <TeamTable currentAdmin={currentAdmin} admins={admins} onAdminsChange={setAdmins} />
    </div>
  )
}
