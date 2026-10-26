"use client"

import { useId, useState } from "react"
import { Eye, EyeOff, Wand2 } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { generateSecurePassword, passwordStrength } from "@/lib/password"
import { cn } from "@/lib/utils"

const STRENGTH_META = {
  weak: { label: "Weak", className: "bg-destructive", width: "33%" },
  fair: { label: "Fair", className: "bg-amber", width: "66%" },
  strong: { label: "Strong", className: "bg-emerald-400", width: "100%" },
} as const

export function PasswordField({
  label,
  name,
  value,
  onChange,
  autoComplete = "new-password",
  placeholder = "Minimum 8 characters",
  allowGenerate = true,
}: {
  label: string
  name: string
  value: string
  onChange: (value: string) => void
  autoComplete?: string
  placeholder?: string
  allowGenerate?: boolean
}) {
  const id = useId()
  const [visible, setVisible] = useState(false)
  const strength = passwordStrength(value)
  const meta = STRENGTH_META[strength]

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <Label htmlFor={id}>{label}</Label>
        {allowGenerate ? (
          <button
            type="button"
            onClick={() => onChange(generateSecurePassword())}
            className="inline-flex items-center gap-1 font-mono text-[11px] text-signal outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <Wand2 className="size-3" />
            Generate secure password
          </button>
        ) : null}
      </div>
      <div className="relative">
        <Input
          id={id}
          name={name}
          type={visible ? "text" : "password"}
          autoComplete={autoComplete}
          required
          minLength={8}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="h-10 rounded-xl pr-10"
        />
        <button
          type="button"
          onClick={() => setVisible((prev) => !prev)}
          aria-label={visible ? "Hide password" : "Show password"}
          className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground outline-none transition hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </div>
      {value ? (
        <div className="flex items-center gap-2">
          <div className="h-1 flex-1 overflow-hidden rounded-full bg-muted">
            <div
              className={cn("h-full rounded-full transition-all", meta.className)}
              style={{ width: meta.width }}
            />
          </div>
          <span className="font-mono text-[11px] text-muted-foreground">{meta.label}</span>
        </div>
      ) : null}
    </div>
  )
}
