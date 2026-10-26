"use client"

import { useTransition } from "react"
import Link from "next/link"
import { LogOut, Settings, ShieldCheck, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { logoutAdminAction } from "@/lib/admin-actions"
import type { AdminUser } from "@/lib/admin-auth"

export function UserMenu({ admin }: { admin: AdminUser }) {
  const [isPending, startTransition] = useTransition()
  const isSuper = admin.role === "super-admin"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            aria-label="Account menu"
            className="rounded-full"
          />
        }
      >
        {isSuper ? <ShieldCheck className="size-4 text-signal" /> : <User className="size-4 text-signal" />}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-48">
        <div className="flex flex-col gap-0.5 px-1.5 py-1.5">
          <span className="text-sm font-medium text-foreground">{admin.name}</span>
          <span className="truncate text-sm text-muted-foreground">{admin.email}</span>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem render={<Link href="/admin/settings" />}>
          <Settings className="size-4" />
          Profile &amp; settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          disabled={isPending}
          onClick={() => startTransition(() => logoutAdminAction())}
        >
          <LogOut className="size-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
