"use client"

import { useState, useTransition } from "react"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { updateAdminUserAction } from "@/lib/admin-actions"
import type { AdminRow } from "@/lib/admin-data"

export function EditAdminSheet({
  admin,
  canAssignSuperAdmin,
  onOpenChange,
  onUpdated,
}: {
  admin: AdminRow | null
  canAssignSuperAdmin: boolean
  onOpenChange: (open: boolean) => void
  onUpdated: (admin: AdminRow) => void
}) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [role, setRole] = useState<"admin" | "super-admin">("admin")

  const [prevAdmin, setPrevAdmin] = useState(admin)
  if (admin !== prevAdmin) {
    setPrevAdmin(admin)
    if (admin) {
      setName(admin.name)
      setEmail(admin.email)
      setRole(admin.role === "super-admin" ? "super-admin" : "admin")
      setError(null)
    }
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!admin) return
    setError(null)

    startTransition(async () => {
      const formData = new FormData()
      formData.set("id", String(admin.id))
      formData.set("name", name)
      formData.set("email", email)
      formData.set("role", role)

      const result = await updateAdminUserAction(formData)
      if ("error" in result) {
        setError(result.error)
        return
      }

      toast.success("Administrator updated.")
      onUpdated({ ...admin, name, email, role })
    })
  }

  const isSuperAdminTarget = admin?.role === "super-admin"

  return (
    <Sheet open={Boolean(admin)} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full bg-card p-6 sm:max-w-md">
        {admin ? (
          <>
            <SheetHeader className="text-left">
              <SheetTitle className="text-lg font-medium tracking-tight">
                Edit administrator
              </SheetTitle>
              <SheetDescription className="text-sm">@{admin.username}</SheetDescription>
            </SheetHeader>

            {error ? (
              <div className="mt-4 rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-sm">
              <div className="space-y-1.5">
                <Label htmlFor="edit-name">Full Name</Label>
                <Input
                  id="edit-name"
                  required
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="h-10 rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="edit-email">Work Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="h-10 rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <Label>Role</Label>
                <Select
                  value={role}
                  onValueChange={(value) => value && setRole(value as "admin" | "super-admin")}
                  disabled={isSuperAdminTarget || !canAssignSuperAdmin}
                  items={[
                    { value: "admin", label: "Admin" },
                    { value: "super-admin", label: "Super Admin" },
                  ]}
                >
                  <SelectTrigger className="h-10 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="super-admin">Super Admin</SelectItem>
                  </SelectContent>
                </Select>
                {isSuperAdminTarget ? (
                  <p className="text-xs text-muted-foreground">
                    The seeded super admin&apos;s role is locked.
                  </p>
                ) : null}
              </div>

              <div className="pt-2">
                <Button type="submit" disabled={isPending} className="h-10 w-full rounded-xl text-sm">
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save changes"
                  )}
                </Button>
              </div>
            </form>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  )
}
