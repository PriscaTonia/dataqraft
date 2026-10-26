"use client"

import { useState } from "react"
import { CalendarDays, Clock, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { formatDateTime } from "@/lib/datetime"
import { cn } from "@/lib/utils"

function formatTimeInput(date: Date) {
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`
}

export function DueDatePicker({
  value,
  onChange,
  placeholder = "Pick a due date",
}: {
  /** UTC ISO datetime string, or "" when unset. */
  value: string
  /** Called with a UTC ISO datetime string, or "" when cleared. */
  onChange: (value: string) => void
  placeholder?: string
}) {
  const [open, setOpen] = useState(false)
  const selected = value ? new Date(value) : null

  const [month, setMonth] = useState(() => selected ?? new Date())
  const [time, setTime] = useState(() => (selected ? formatTimeInput(selected) : "09:00"))

  function commit(date: Date, timeValue: string) {
    const [hours, minutes] = timeValue.split(":").map(Number)
    const next = new Date(date)
    next.setHours(hours || 0, minutes || 0, 0, 0)
    onChange(next.toISOString())
  }

  function handleSelectDay(day: Date) {
    setMonth(day)
    commit(day, time)
  }

  function handleTimeChange(nextTime: string) {
    setTime(nextTime)
    if (selected) commit(selected, nextTime)
  }

  function handleClear(event: React.MouseEvent) {
    event.stopPropagation()
    onChange("")
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <button
            type="button"
            className={cn(
              "flex h-10 w-full items-center gap-2 rounded-xl border border-input bg-transparent px-2.5 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
              !value && "text-muted-foreground"
            )}
          />
        }
      >
        <CalendarDays className="size-4 shrink-0 text-muted-foreground" />
        <span className="flex-1 text-left">{value ? formatDateTime(value) : placeholder}</span>
        {value ? (
          <span
            role="button"
            tabIndex={0}
            onClick={handleClear}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") handleClear(event as unknown as React.MouseEvent)
            }}
            aria-label="Clear due date"
            className="rounded-md p-0.5 text-muted-foreground outline-none hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <X className="size-3.5" />
          </span>
        ) : null}
      </PopoverTrigger>
      <PopoverContent align="start">
        <Calendar month={month} onMonthChange={setMonth} selected={selected} onSelect={handleSelectDay} />
        <div className="mt-2 flex items-center gap-2 border-t border-border pt-2.5">
          <Clock className="size-3.5 shrink-0 text-muted-foreground" />
          <input
            type="time"
            value={time}
            onChange={(event) => handleTimeChange(event.target.value)}
            className="h-8 w-full rounded-lg border border-input bg-transparent px-2 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </div>
        <div className="mt-2 flex items-center justify-between gap-2 border-t border-border pt-2.5">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 text-xs"
            onClick={() => {
              const now = new Date()
              setMonth(now)
              setTime(formatTimeInput(now))
              commit(now, formatTimeInput(now))
            }}
          >
            Today
          </Button>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-7 text-xs text-muted-foreground"
              onClick={() => onChange("")}
              disabled={!value}
            >
              Clear
            </Button>
            <Button
              type="button"
              size="sm"
              className="h-7 text-xs"
              onClick={() => setOpen(false)}
            >
              Done
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
