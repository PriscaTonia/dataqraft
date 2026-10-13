import { visionMission } from "@/lib/content"

export function VisionMission() {
  return (
    <section className="bg-[#05080F] text-[#F2F5FA]">
      <div className="relative mx-auto grid max-w-6xl gap-12 px-5 py-16 md:grid-cols-2 md:gap-x-0 md:gap-y-6 md:px-8 md:py-24 lg:py-32">
        <span
          aria-hidden
          className="absolute top-10 left-1/2 hidden size-1.5 -translate-x-1/2 rounded-full bg-[#C79A5B] md:block"
        />
        <span
          aria-hidden
          className="absolute top-0 bottom-0 left-1/2 hidden w-px bg-white/10 md:block"
        />
        <Quote
          label={visionMission.vision.label}
          quote={visionMission.vision.quote}
          supporting={visionMission.vision.supporting}
          className="md:pr-14"
        />
        <Quote
          label={visionMission.mission.label}
          quote={visionMission.mission.quote}
          supporting={visionMission.mission.supporting}
          className="md:pl-14"
        />
      </div>
    </section>
  )
}

function Quote({
  label,
  quote,
  supporting,
  className,
}: {
  label: string
  quote: string
  supporting: string
  className?: string
}) {
  return (
    <figure
      className={`md:row-span-3 md:grid md:grid-rows-subgrid ${className ?? ""}`}
    >
      <figcaption className="flex items-center gap-2 font-mono text-[11px] tracking-[0.22em] text-[#3FA7A9] uppercase">
        <span aria-hidden className="size-1 rounded-full bg-[#C79A5B] md:hidden" />
        {label}
      </figcaption>
      <blockquote className="mt-6 font-serif text-[clamp(1.55rem,3.2vw,2.6rem)] leading-[1.2] font-medium tracking-tight text-balance italic md:mt-0">
        {quote}
      </blockquote>
      <p className="mt-6 max-w-[42ch] text-sm leading-relaxed text-[#8A97AB] md:mt-0">
        {supporting}
      </p>
    </figure>
  )
}
