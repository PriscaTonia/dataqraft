"use client"

import { useTransition } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LogOut, Server, ShieldCheck, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ThemedLogo } from "@/components/layout/themed-logo"
import { logoutAdminAction } from "@/lib/admin-actions"
import type { AdminUser } from "@/lib/admin-auth"
import { cn } from "@/lib/utils"
import { ADMIN_NAV_ITEMS } from "@/components/admin/shell/nav-config"

export function SidebarNav({
  admin,
  badgeCounts,
  collapsed = false,
  onNavigate,
}: {
  admin: AdminUser
  badgeCounts: Partial<Record<"inquiries" | "assignments", number>>
  collapsed?: boolean
  onNavigate?: () => void
}) {
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()
  const isSuper = admin.role === "super-admin"

  const items = ADMIN_NAV_ITEMS.filter((item) => !item.superAdminOnly || isSuper)

  return (
    <div className="flex h-full flex-col">
      <div
        className={cn(
          "flex h-16 shrink-0 items-center gap-2 border-b border-border px-4",
          collapsed && "justify-center px-2"
        )}
      >
        <Link href="/admin" className="flex items-center gap-2 overflow-hidden">
          <ThemedLogo variant="compact" className="shrink-0" />
        </Link>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-2.5 py-4">
        {items.map((item) => {
          const isActive =
            item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href)
          const Icon = item.icon
          const count = item.badgeKey ? badgeCounts[item.badgeKey] : undefined
          const badge = count && count > 0 ? count : null

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              title={collapsed ? item.label : undefined}
              className={cn(
                "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition",
                collapsed && "justify-center px-2",
                isActive
                  ? "bg-signal/10 text-signal"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="size-4 shrink-0" aria-hidden />
              {!collapsed ? (
                <>
                  <span className="flex-1 truncate">{item.label}</span>
                  {badge ? (
                    <span className="rounded-full bg-signal/20 px-1.5 py-0.5 font-mono text-[11px] text-signal">
                      {badge}
                    </span>
                  ) : null}
                </>
              ) : badge ? (
                <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-signal" />
              ) : null}
            </Link>
          )
        })}
      </nav>

      <div className={cn("border-t border-border p-3", collapsed && "px-2")}>
        {isSuper ? (
          <Link
            href="/payload-admin"
            target="_blank"
            rel="noopener noreferrer"
            title={collapsed ? "Raw Payload CMS" : undefined}
            className={cn(
              "mb-1 flex items-center gap-2.5 rounded-xl px-2 py-2 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground",
              collapsed && "justify-center"
            )}
          >
            <Server className="size-4 shrink-0 text-signal" />
            {!collapsed ? <span className="flex-1 truncate">Raw Payload CMS</span> : null}
          </Link>
        ) : null}

        <div
          className={cn(
            "flex items-center gap-2.5 rounded-xl px-2 py-2",
            collapsed && "justify-center"
          )}
        >
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full border border-signal/40 bg-signal/10 text-signal">
            {isSuper ? <ShieldCheck className="size-4" /> : <User className="size-4" />}
          </div>
          {!collapsed ? (
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">{admin.name}</p>
              <p className="font-mono text-[11px] text-muted-foreground uppercase">
                {isSuper ? "Super Admin" : "Admin"}
              </p>
            </div>
          ) : null}
        </div>

        <Button
          variant="ghost"
          size={collapsed ? "icon" : "sm"}
          disabled={isPending}
          onClick={() => startTransition(() => logoutAdminAction())}
          title="Sign out"
          className={cn(
            "mt-1 w-full gap-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive",
            !collapsed && "justify-start px-2"
          )}
        >
          <LogOut className="size-4" />
          {!collapsed ? "Sign out" : null}
        </Button>
      </div>
    </div>
  )
}
