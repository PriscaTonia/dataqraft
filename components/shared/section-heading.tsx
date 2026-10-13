import { MonoLabel } from "@/components/shared/mono-label"

export function SectionHeading({
  index,
  title,
  description,
}: {
  index: string
  title: string
  description?: string
}) {
  return (
    <div className="max-w-2xl">
      <MonoLabel>{index}</MonoLabel>
      <h2 className="mt-4 text-[clamp(1.875rem,3.4vw,2.875rem)] leading-[1.12] font-medium tracking-tight text-balance">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 max-w-[65ch] text-base leading-relaxed text-muted-foreground">
          {description}
        </p>
      ) : null}
    </div>
  )
}
