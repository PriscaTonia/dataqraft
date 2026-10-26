"use client"

import { useState, useTransition } from "react"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { PasswordField } from "@/components/admin/team/password-field"
import { changeOwnPasswordAction } from "@/lib/admin-actions"

export function ChangePasswordForm() {
  const [isPending, startTransition] = useTransition()
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setError(null)
    startTransition(async () => {
      const formData = new FormData()
      formData.set("currentPassword", currentPassword)
      formData.set("newPassword", newPassword)
      const result = await changeOwnPasswordAction(formData)
      if ("error" in result) {
        setError(result.error)
        return
      }
      toast.success("Password changed.")
      setCurrentPassword("")
      setNewPassword("")
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error ? (
        <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      ) : null}
      <PasswordField
        label="Current Password"
        name="currentPassword"
        value={currentPassword}
        onChange={setCurrentPassword}
        autoComplete="current-password"
        allowGenerate={false}
      />
      <PasswordField
        label="New Password"
        name="newPassword"
        value={newPassword}
        onChange={setNewPassword}
      />
      <Button type="submit" disabled={isPending} className="h-9 text-sm">
        {isPending ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Updating...
          </>
        ) : (
          "Change password"
        )}
      </Button>
    </form>
  )
}
