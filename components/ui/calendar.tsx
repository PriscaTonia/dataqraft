"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const WEEKDAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]
const MONTH_LABEL = { month: "long", year: "numeric" } as const

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

function addMonths(date: Date, amount: number) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1)
}

function buildGrid(month: Date) {
  const first = startOfMonth(month)
  const gridStart = new Date(first)
  gridStart.setDate(first.getDate() - first.getDay())

  const days: Date[] = []
  for (let i = 0; i < 42; i += 1) {
    const day = new Date(gridStart)
    day.setDate(gridStart.getDate() + i)
    days.push(day)
  }
  return days
}

export function Calendar({
  month,
  onMonthChange,
  selected,
  onSelect,
  className,
}: {
  month: Date
  onMonthChange: (month: Date) => void
  selected?: Date | null
  onSelect: (date: Date) => void
  className?: string
}) {
  const today = new Date()
  const days = buildGrid(month)

  return (
    <div className={cn("w-64", className)}>
      <div className="flex items-center justify-between px-1 pb-2">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => onMonthChange(addMonths(month, -1))}
          aria-label="Previous month"
        >
          <ChevronLeft className="size-4" />
        </Button>
        <p className="text-xs font-medium text-foreground">
          {month.toLocaleDateString(undefined, MONTH_LABEL)}
        </p>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => onMonthChange(addMonths(month, 1))}
          aria-label="Next month"
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-0.5">
        {WEEKDAY_LABELS.map((label) => (
          <div
            key={label}
            className="flex h-7 items-center justify-center font-mono text-[10px] text-muted-foreground uppercase"
          >
            {label}
          </div>
        ))}

        {days.map((day) => {
          const inMonth = day.getMonth() === month.getMonth()
          const isSelected = selected ? isSameDay(day, selected) : false
          const isToday = isSameDay(day, today)

          return (
            <button
              key={day.toISOString()}
              type="button"
              onClick={() => onSelect(day)}
              className={cn(
                "flex h-7 items-center justify-center rounded-md text-xs transition outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                !inMonth && "text-muted-foreground/40",
                inMonth && !isSelected && "text-foreground hover:bg-muted",
                isToday && !isSelected && "font-semibold text-signal",
                isSelected && "bg-signal font-medium text-signal-foreground hover:bg-signal/90"
              )}
            >
              {day.getDate()}
            </button>
          )
        })}
      </div>
    </div>
  )
}
