"use client"

import { useState, useTransition } from "react"
import { Loader2, Plus } from "lucide-react"
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
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PasswordField } from "@/components/admin/team/password-field"
import { createAdminUserAction } from "@/lib/admin-actions"
import type { AdminRow } from "@/lib/admin-data"

export function AddAdminSheet({
  canAssignSuperAdmin,
  onCreated,
}: {
  canAssignSuperAdmin: boolean
  onCreated: (admin: AdminRow) => void
}) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [name, setName] = useState("")
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<"admin" | "super-admin">("admin")

  function reset() {
    setName("")
    setUsername("")
    setEmail("")
    setPassword("")
    setRole("admin")
    setError(null)
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setError(null)

    startTransition(async () => {
      const formData = new FormData()
      formData.set("name", name)
      formData.set("username", username)
      formData.set("email", email)
      formData.set("password", password)
      formData.set("role", role)

      const result = await createAdminUserAction(formData)
      if ("error" in result) {
        setError(result.error)
        return
      }

      toast.success("Administrator added.")
      onCreated({
        id: `pending-${Date.now()}`,
        name,
        username,
        email,
        role,
        active: true,
        createdAt: new Date().toISOString(),
        lastLoginAt: null,
      })
      reset()
      setOpen(false)
    })
  }

  return (
    <Sheet
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (!next) reset()
      }}
    >
      <SheetTrigger
        render={<Button className="h-9 gap-1.5 text-sm" />}
      >
        <Plus className="size-4" />
        Add Administrator
      </SheetTrigger>
      <SheetContent side="right" className="w-full bg-card p-6 sm:max-w-md">
        <SheetHeader className="text-left">
          <span className="font-mono text-[11px] tracking-wider text-signal uppercase">
            Security protocol
          </span>
          <SheetTitle className="text-lg font-medium tracking-tight">
            Add new administrator
          </SheetTitle>
          <SheetDescription className="text-sm">
            Newly created admins receive access to client briefings and the admin dashboard.
          </SheetDescription>
        </SheetHeader>

        {error ? (
          <div className="mt-4 rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-sm">
          <div className="space-y-1.5">
            <Label htmlFor="add-name">Full Name</Label>
            <Input
              id="add-name"
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. Samuel Adekunle"
              className="h-10 rounded-xl"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="add-username">Username</Label>
            <Input
              id="add-username"
              required
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="e.g. samuel"
              className="h-10 rounded-xl"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="add-email">Work Email</Label>
            <Input
              id="add-email"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="e.g. s.adekunle@dataqraft.io"
              className="h-10 rounded-xl"
            />
          </div>

          <PasswordField
            label="Initial Password"
            name="password"
            value={password}
            onChange={setPassword}
          />

          {canAssignSuperAdmin ? (
            <div className="space-y-1.5">
              <Label>Role</Label>
              <Select
                value={role}
                onValueChange={(value) => value && setRole(value as "admin" | "super-admin")}
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
            </div>
          ) : null}

          <div className="pt-2">
            <Button type="submit" disabled={isPending} className="h-10 w-full rounded-xl text-sm">
              {isPending ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Creating administrator...
                </>
              ) : (
                "Create account"
              )}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}
