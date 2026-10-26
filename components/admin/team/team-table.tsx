"use client"

import { useState, useTransition } from "react"
import { MoreHorizontal, User, UserCheck, UserX } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { EditAdminSheet } from "@/components/admin/team/edit-admin-sheet"
import { ResetPasswordSheet } from "@/components/admin/team/reset-password-sheet"
import { DeleteAdminDialog } from "@/components/admin/team/delete-admin-dialog"
import { toggleAdminActiveAction } from "@/lib/admin-actions"
import type { AdminRow } from "@/lib/admin-data"
import type { AdminUser } from "@/lib/admin-auth"

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("")
}

function formatDate(value?: string | null) {
  if (!value) return "—"
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

function AdminActionsMenu({
  admin,
  isSuper,
  isSelf,
  isPending,
  onEdit,
  onReset,
  onToggleActive,
  onDelete,
  triggerClassName,
}: {
  admin: AdminRow
  isSuper: boolean
  isSelf: boolean
  isPending: boolean
  onEdit: (admin: AdminRow) => void
  onReset: (admin: AdminRow) => void
  onToggleActive: (admin: AdminRow) => void
  onDelete: (admin: AdminRow) => void
  triggerClassName?: string
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button variant="ghost" size="icon-sm" className={triggerClassName} />}
      >
        <MoreHorizontal className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onEdit(admin)}>Edit</DropdownMenuItem>
        {!isSelf ? (
          <DropdownMenuItem onClick={() => onReset(admin)}>Reset password</DropdownMenuItem>
        ) : null}
        {!isSuper && !isSelf ? (
          <DropdownMenuItem disabled={isPending} onClick={() => onToggleActive(admin)}>
            {admin.active ? (
              <>
                <UserX className="size-4" />
                Deactivate
              </>
            ) : (
              <>
                <UserCheck className="size-4" />
                Reactivate
              </>
            )}
          </DropdownMenuItem>
        ) : null}
        {!isSuper && !isSelf ? (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={() => onDelete(admin)}>
              Delete
            </DropdownMenuItem>
          </>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function TeamTable({
  currentAdmin,
  admins,
  onAdminsChange,
}: {
  currentAdmin: AdminUser
  admins: AdminRow[]
  onAdminsChange: (admins: AdminRow[]) => void
}) {
  const [editing, setEditing] = useState<AdminRow | null>(null)
  const [resetting, setResetting] = useState<AdminRow | null>(null)
  const [deleting, setDeleting] = useState<AdminRow | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleToggleActive(admin: AdminRow) {
    startTransition(async () => {
      const result = await toggleAdminActiveAction(admin.id, admin.active)
      if ("error" in result) {
        toast.error(result.error)
        return
      }
      onAdminsChange(
        admins.map((a) =>
          a.id === admin.id ? { ...a, active: result.newStatus ?? !a.active } : a
        )
      )
      toast.success(admin.active ? "Administrator deactivated." : "Administrator reactivated.")
    })
  }

  return (
    <>
      {/* Desktop / tablet: table */}
      <div className="hidden min-h-128 overflow-hidden rounded-2xl border border-border bg-card shadow-sm md:block lg:min-h-160">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40 font-mono text-xs text-muted-foreground uppercase tracking-wider">
                <th className="px-4 py-3">Name &amp; Username</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Created</th>
                <th className="px-4 py-3">Last login</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {admins.map((admin) => {
                const isSuper = admin.role === "super-admin"
                const isSelf = String(admin.id) === String(currentAdmin.id)

                return (
                  <tr key={admin.id} className="transition hover:bg-muted/30">
                    <td className="px-4 py-4 font-medium">
                      <div className="flex items-center gap-2.5">
                        <div className="flex size-7 shrink-0 items-center justify-center rounded-full border border-signal/30 bg-signal/10 font-mono text-[11px] text-signal">
                          {initials(admin.name) || <User className="size-3.5" />}
                        </div>
                        <div>
                          <div className="text-foreground">
                            {admin.name}
                            {isSelf ? (
                              <span className="ml-1.5 text-[11px] text-muted-foreground">(you)</span>
                            ) : null}
                          </div>
                          <div className="font-mono text-[11px] text-muted-foreground">
                            @{admin.username}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-muted-foreground">{admin.email}</td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 font-mono text-[11px] uppercase ${
                          isSuper
                            ? "border-amber/40 bg-amber/10 font-semibold text-amber"
                            : "border-signal/40 bg-signal/10 text-signal"
                        }`}
                      >
                        {isSuper ? "Super Admin" : "Admin"}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[11px] ${
                          admin.active
                            ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                            : "border-destructive/40 bg-destructive/10 text-destructive"
                        }`}
                      >
                        <span
                          className={`size-1.5 rounded-full ${
                            admin.active ? "bg-emerald-400" : "bg-destructive"
                          }`}
                        />
                        {admin.active ? "Active" : "Deactivated"}
                      </span>
                    </td>
                    <td className="px-4 py-4 font-mono text-xs text-muted-foreground">
                      {formatDate(admin.createdAt)}
                    </td>
                    <td className="px-4 py-4 font-mono text-xs text-muted-foreground">
                      {formatDate(admin.lastLoginAt)}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <AdminActionsMenu
                        admin={admin}
                        isSuper={isSuper}
                        isSelf={isSelf}
                        isPending={isPending}
                        onEdit={setEditing}
                        onReset={setResetting}
                        onToggleActive={handleToggleActive}
                        onDelete={setDeleting}
                      />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile: cards */}
      <div className="space-y-3 md:hidden">
        {admins.map((admin) => {
          const isSuper = admin.role === "super-admin"
          const isSelf = String(admin.id) === String(currentAdmin.id)

          return (
            <div
              key={admin.id}
              className="rounded-2xl border border-border bg-card p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2.5">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-full border border-signal/30 bg-signal/10 font-mono text-xs text-signal">
                    {initials(admin.name) || <User className="size-4" />}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-medium text-foreground">
                      {admin.name}
                      {isSelf ? (
                        <span className="ml-1.5 text-[11px] text-muted-foreground">(you)</span>
                      ) : null}
                    </p>
                    <p className="truncate font-mono text-[11px] text-muted-foreground">
                      @{admin.username}
                    </p>
                  </div>
                </div>
                <AdminActionsMenu
                  admin={admin}
                  isSuper={isSuper}
                  isSelf={isSelf}
                  isPending={isPending}
                  onEdit={setEditing}
                  onReset={setResetting}
                  onToggleActive={handleToggleActive}
                  onDelete={setDeleting}
                  triggerClassName="-mt-1.5 -mr-1.5 shrink-0"
                />
              </div>

              <p className="mt-3 truncate text-sm text-muted-foreground">{admin.email}</p>

              <div className="mt-3 flex flex-wrap items-center gap-1.5">
                <span
                  className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 font-mono text-[11px] uppercase ${
                    isSuper
                      ? "border-amber/40 bg-amber/10 font-semibold text-amber"
                      : "border-signal/40 bg-signal/10 text-signal"
                  }`}
                >
                  {isSuper ? "Super Admin" : "Admin"}
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[11px] ${
                    admin.active
                      ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                      : "border-destructive/40 bg-destructive/10 text-destructive"
                  }`}
                >
                  <span
                    className={`size-1.5 rounded-full ${
                      admin.active ? "bg-emerald-400" : "bg-destructive"
                    }`}
                  />
                  {admin.active ? "Active" : "Deactivated"}
                </span>
              </div>

              <div className="mt-3 flex items-center justify-between border-t border-border pt-3 font-mono text-[11px] text-muted-foreground">
                <span>Created {formatDate(admin.createdAt)}</span>
                <span>Last login {formatDate(admin.lastLoginAt)}</span>
              </div>
            </div>
          )
        })}
      </div>

      <EditAdminSheet
        admin={editing}
        canAssignSuperAdmin={currentAdmin.role === "super-admin"}
        onOpenChange={(open) => !open && setEditing(null)}
        onUpdated={(updated) => {
          onAdminsChange(admins.map((a) => (a.id === updated.id ? updated : a)))
          setEditing(null)
        }}
      />

      <ResetPasswordSheet admin={resetting} onOpenChange={(open) => !open && setResetting(null)} />

      <DeleteAdminDialog
        admin={deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
        onDeleted={(id) => {
          onAdminsChange(admins.filter((a) => a.id !== id))
          setDeleting(null)
        }}
      />
    </>
  )
}
