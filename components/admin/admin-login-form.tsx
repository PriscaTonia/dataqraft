"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Lock, User, ArrowLeft, ArrowRight, Loader2 } from "lucide-react"

import { ThemedLogo } from "@/components/layout/themed-logo"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { loginAdminAction } from "@/lib/admin-actions"

export function AdminLoginForm() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")
  const [remember, setRemember] = useState(true)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!identifier || !password) {
      setError("Please enter your username or email and password.")
      return
    }

    startTransition(async () => {
      const formData = new FormData()
      formData.set("identifier", identifier)
      formData.set("password", password)
      formData.set("remember", remember ? "true" : "false")

      const result = await loginAdminAction(formData)
      if (result?.error) {
        setError(result.error)
      } else {
        router.push("/admin")
        router.refresh()
      }
    })
  }

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden px-4 py-12 sm:px-6">
      {/* Subtle ambient lighting */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[36rem] w-[44rem] -translate-x-1/2 rounded-full bg-signal/10 blur-[130px] dark:bg-signal/8"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 left-1/3 -z-10 h-[30rem] w-[36rem] rounded-full bg-amber/5 blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(14,26,46,0.35),rgba(255,255,255,0))]"
      />

      <div className="w-full max-w-md">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-mono tracking-wider text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" />
            <span>Return to public website</span>
          </Link>
        </div>

        {/* Card */}
        <div className="relative rounded-3xl border border-border/80 bg-card/90 p-7 shadow-[0_24px_60px_-15px_rgba(0,0,0,0.5)] backdrop-blur-xl sm:p-9">
          {/* Logo Header */}
          <div className="text-center">
            <div className="mx-auto flex justify-center">
              <ThemedLogo priority />
            </div>
            <p className="mt-4 font-mono text-[11px] tracking-[0.24em] text-signal uppercase">
              Management & Operations
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div
              role="alert"
              className="mt-6 flex items-start gap-3 rounded-xl border border-destructive/40 bg-destructive/10 p-3.5 text-sm text-destructive animate-in fade-in duration-200"
            >
              <div className="mt-0.5 shrink-0">⚠️</div>
              <p className="leading-snug">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="space-y-1.5">
              <Label
                htmlFor="identifier"
                className="text-sm font-medium text-foreground/90"
              >
                Username or Email
              </Label>
              <div className="relative">
                <User
                  className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden
                />
                <Input
                  id="identifier"
                  type="text"
                  autoComplete="username"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="e.g. dqladmin or user@dataqraft.io"
                  className="h-11 rounded-xl border-border bg-background/60 pl-10 text-sm transition focus-visible:border-signal focus-visible:ring-signal/30"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-foreground/90"
                >
                  Password
                </Label>
              </div>
              <div className="relative">
                <Lock
                  className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden
                />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="h-11 rounded-xl border-border bg-background/60 pl-10 pr-10 text-sm transition focus-visible:border-signal focus-visible:ring-signal/30"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1 text-sm">
              <Checkbox id="remember-session" checked={remember} onCheckedChange={setRemember} />
              <Label
                htmlFor="remember-session"
                className="cursor-pointer text-sm font-normal text-muted-foreground hover:text-foreground"
              >
                Remember session for 7 days
              </Label>
            </div>

            <Button
              type="submit"
              disabled={isPending}
              className="mt-2 h-11 w-full rounded-xl bg-signal font-medium text-slate-950 hover:bg-signal/90 transition shadow-lg shadow-signal/20"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  Enter Dashboard
                  <ArrowRight className="ml-2 size-4" />
                </>
              )}
            </Button>
          </form>
        </div>
      </div>

      <p className="absolute inset-x-0 bottom-6 px-4 text-center text-[11px] leading-relaxed text-muted-foreground">
        Authorized personnel only. Access is monitored and logged in accordance with DQL security
        policy.
      </p>
    </div>
  )
}
