"use client"

import Link from "next/link"
import { ExternalLink, Menu } from "lucide-react"

import { ThemeToggle } from "@/components/layout/theme-toggle"
import { Button } from "@/components/ui/button"
import { UserMenu } from "@/components/admin/shell/user-menu"
import type { AdminUser } from "@/lib/admin-auth"

export function Topbar({
  admin,
  onMenuClick,
}: {
  admin: AdminUser
  onMenuClick: () => void
}) {
  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b border-border bg-background/90 px-4 backdrop-blur-md sm:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        aria-label="Open menu"
        onClick={onMenuClick}
      >
        <Menu className="size-5" />
      </Button>

      <div className="min-w-0">
        <h1 className="truncate text-sm font-medium text-foreground">Welcome, {admin.name}</h1>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm text-muted-foreground transition hover:border-signal/50 hover:text-foreground sm:inline-flex"
        >
          <span>Live Site</span>
          <ExternalLink className="size-3" />
        </Link>

        <ThemeToggle />
        <UserMenu admin={admin} />
      </div>
    </header>
  )
}
