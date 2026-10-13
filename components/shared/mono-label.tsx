import { cn } from "@/lib/utils"

export function MonoLabel({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <p
      className={cn(
        "font-mono text-[11px] tracking-[0.22em] text-muted-foreground uppercase",
        className
      )}
    >
      {children}
    </p>
  )
}
