import { redirect } from "next/navigation"

import { PageHeader } from "@/components/admin/shell/page-header"
import { ProfileForm } from "@/components/admin/settings/profile-form"
import { ChangePasswordForm } from "@/components/admin/settings/change-password-form"
import { ThemePreference } from "@/components/admin/settings/theme-preference"
import { getAuthenticatedAdmin } from "@/lib/admin-auth"

export const dynamic = "force-dynamic"

export default async function SettingsPage() {
  const admin = await getAuthenticatedAdmin()
  if (!admin) redirect("/admin/login")

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="Account"
        title="Settings"
        description="Manage your profile, password, and interface preferences."
      />

      <section className="rounded-2xl border border-border bg-card p-6">
        <h3 className="text-sm font-medium text-foreground">Profile</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Your name and email, shown across the admin console.
        </p>
        <div className="mt-5">
          <ProfileForm admin={admin} />
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-6">
        <h3 className="text-sm font-medium text-foreground">Password</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Changing your password requires your current password.
        </p>
        <div className="mt-5">
          <ChangePasswordForm />
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-6">
        <h3 className="text-sm font-medium text-foreground">Appearance</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Choose how the admin console looks on this device.
        </p>
        <div className="mt-5">
          <ThemePreference />
        </div>
      </section>
    </div>
  )
}
