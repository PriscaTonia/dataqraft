"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { PanelLeftClose, PanelLeftOpen } from "lucide-react"

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { SidebarNav } from "@/components/admin/shell/sidebar-nav"
import { Topbar } from "@/components/admin/shell/topbar"
import type { AdminUser } from "@/lib/admin-auth"
import { cn } from "@/lib/utils"

const COLLAPSE_KEY = "dql-admin-sidebar-collapsed"

export function AdminShell({
  admin,
  badgeCounts,
  children,
}: {
  admin: AdminUser
  badgeCounts: Partial<Record<"inquiries" | "assignments", number>>
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    queueMicrotask(() => {
      setCollapsed(window.localStorage.getItem(COLLAPSE_KEY) === "true")
      setHydrated(true)
    })
  }, [])

  const [prevPathname, setPrevPathname] = useState(pathname)
  if (pathname !== prevPathname) {
    setPrevPathname(pathname)
    setMobileOpen(false)
  }

  function toggleCollapsed() {
    setCollapsed((prev) => {
      const next = !prev
      window.localStorage.setItem(COLLAPSE_KEY, String(next))
      return next
    })
  }

  return (
    <div className="flex min-h-svh bg-background">
      <aside
        className={cn(
          "sticky top-0 hidden h-svh shrink-0 border-r border-border bg-background transition-[width] duration-200 lg:block",
          hydrated ? (collapsed ? "w-[4.5rem]" : "w-64") : "w-64"
        )}
      >
        <SidebarNav
          admin={admin}
          badgeCounts={badgeCounts}
          collapsed={hydrated && collapsed}
        />
        <Button
          variant="outline"
          size="icon-sm"
          onClick={toggleCollapsed}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="absolute -right-3 top-[5.25rem] rounded-full bg-background shadow-sm"
        >
          {collapsed ? <PanelLeftOpen className="size-3.5" /> : <PanelLeftClose className="size-3.5" />}
        </Button>
      </aside>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-72 bg-background p-0 sm:max-w-72">
          <SheetHeader className="sr-only">
            <SheetTitle>Admin navigation</SheetTitle>
          </SheetHeader>
          <SidebarNav
            admin={admin}
            badgeCounts={badgeCounts}
            onNavigate={() => setMobileOpen(false)}
          />
        </SheetContent>
      </Sheet>

      <div className="flex min-h-svh min-w-0 flex-1 flex-col">
        <Topbar admin={admin} onMenuClick={() => setMobileOpen(true)} />
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  )
}
