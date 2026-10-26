"use client"

import { useState, useTransition } from "react"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { PasswordField } from "@/components/admin/team/password-field"
import { resetAdminPasswordAction } from "@/lib/admin-actions"
import type { AdminRow } from "@/lib/admin-data"

export function ResetPasswordSheet({
  admin,
  onOpenChange,
}: {
  admin: AdminRow | null
  onOpenChange: (open: boolean) => void
}) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [password, setPassword] = useState("")

  const [prevAdmin, setPrevAdmin] = useState(admin)
  if (admin !== prevAdmin) {
    setPrevAdmin(admin)
    setPassword("")
    setError(null)
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!admin) return
    setError(null)

    startTransition(async () => {
      const formData = new FormData()
      formData.set("id", String(admin.id))
      formData.set("password", password)

      const result = await resetAdminPasswordAction(formData)
      if ("error" in result) {
        setError(result.error)
        return
      }

      toast.success(`Password reset for ${admin.name}.`)
      onOpenChange(false)
    })
  }

  return (
    <Sheet open={Boolean(admin)} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full bg-card p-6 sm:max-w-md">
        {admin ? (
          <>
            <SheetHeader className="text-left">
              <SheetTitle className="text-lg font-medium tracking-tight">
                Reset password
              </SheetTitle>
              <SheetDescription className="text-sm">
                Set a new temporary password for {admin.name} (@{admin.username}). Share it with
                them securely.
              </SheetDescription>
            </SheetHeader>

            {error ? (
              <div className="mt-4 rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-sm">
              <PasswordField
                label="New Password"
                name="password"
                value={password}
                onChange={setPassword}
              />
              <Button type="submit" disabled={isPending} className="h-10 w-full rounded-xl text-sm">
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Resetting...
                  </>
                ) : (
                  "Reset password"
                )}
              </Button>
            </form>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  )
}
