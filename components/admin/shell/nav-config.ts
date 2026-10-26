import type { LucideIcon } from "lucide-react"
import { ClipboardList, History, Inbox, LayoutDashboard, Settings, Tags, Users } from "lucide-react"

export type AdminNavItem = {
  href: string
  label: string
  icon: LucideIcon
  superAdminOnly?: boolean
  badgeKey?: "inquiries" | "assignments"
}

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/inquiries", label: "Briefing Inquiries", icon: Inbox, badgeKey: "inquiries" },
  { href: "/admin/assignments", label: "Assignments", icon: ClipboardList, badgeKey: "assignments" },
  { href: "/admin/categories", label: "Categories", icon: Tags },
  { href: "/admin/team", label: "Admin Team", icon: Users, superAdminOnly: true },
  { href: "/admin/activity", label: "Activity Log", icon: History, superAdminOnly: true },
  { href: "/admin/settings", label: "Settings", icon: Settings },
]
