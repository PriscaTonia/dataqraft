"use client"

import { useState, useTransition } from "react"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { updateOwnProfileAction } from "@/lib/admin-actions"
import type { AdminUser } from "@/lib/admin-auth"

export function ProfileForm({ admin }: { admin: AdminUser }) {
  const [isPending, startTransition] = useTransition()
  const [name, setName] = useState(admin.name)
  const [email, setEmail] = useState(admin.email)
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setError(null)
    startTransition(async () => {
      const formData = new FormData()
      formData.set("name", name)
      formData.set("email", email)
      const result = await updateOwnProfileAction(formData)
      if ("error" in result) {
        setError(result.error)
        return
      }
      toast.success("Profile updated.")
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error ? (
        <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      ) : null}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="profile-name">Full Name</Label>
          <Input
            id="profile-name"
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="h-10 rounded-xl"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="profile-email">Email</Label>
          <Input
            id="profile-email"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="h-10 rounded-xl"
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label>Username</Label>
        <p className="font-mono text-sm text-muted-foreground">@{admin.username}</p>
      </div>
      <Button type="submit" disabled={isPending} className="h-9 text-sm">
        {isPending ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Saving...
          </>
        ) : (
          "Save profile"
        )}
      </Button>
    </form>
  )
}
