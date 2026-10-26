"use client"

import { Laptop, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { cn } from "@/lib/utils"

const OPTIONS = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Laptop },
] as const

export function ThemePreference() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="flex flex-wrap gap-2">
      {OPTIONS.map((option) => {
        const Icon = option.icon
        const active = theme === option.value
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => setTheme(option.value)}
            className={cn(
              "flex items-center gap-2 rounded-xl border px-3.5 py-2 text-sm transition",
              active
                ? "border-signal bg-signal/10 text-signal"
                : "border-border text-muted-foreground hover:border-signal/40 hover:text-foreground"
            )}
          >
            <Icon className="size-3.5" />
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
