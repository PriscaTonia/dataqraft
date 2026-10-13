import { SectionHeading } from "@/components/shared/section-heading"
import { clients } from "@/lib/content"

function Wordmark({ name }: { name: string }) {
  return (
    <span className="flex h-20 min-w-[11.5rem] items-center justify-center rounded-xl bg-white px-6 text-center shadow-sm ring-1 ring-[#DCE3EE] dark:bg-[#F2F5FA] dark:shadow-none dark:ring-0">
      <span className="font-heading text-sm font-medium tracking-wide text-[#1E3A5F]/65 transition-colors group-hover:text-[#1E3A5F]">
        {name}
      </span>
    </span>
  )
}

export function Clients() {
  const rowA = clients.names.slice(0, 6)
  const rowB = clients.names.slice(6)

  return (
    <section id="clients" className="scroll-mt-24 border-t border-border">
      <div className="mx-auto max-w-6xl px-5 pt-24 pb-12 md:px-8 md:pt-32">
        <SectionHeading index={clients.index} title={clients.title} />
        <ul className="sr-only">
          {clients.names.map((name) => (
            <li key={name}>{name}</li>
          ))}
        </ul>
      </div>

      <div className="marquee-static mx-auto grid max-w-6xl grid-cols-2 gap-3 px-5 pb-24 sm:grid-cols-3 md:hidden md:px-8">
        {clients.names.map((name) => (
          <div key={name} className="group">
            <Wordmark name={name} />
          </div>
        ))}
      </div>

      <div className="marquee-animated hidden space-y-4 pb-24 md:block" aria-hidden>
        <Marquee names={rowA} />
        <Marquee names={rowB} direction="reverse" />
      </div>
    </section>
  )
}

function Marquee({
  names,
  direction = "forward",
}: {
  names: readonly string[]
  direction?: "forward" | "reverse"
}) {
  return (
    <div className="marquee overflow-hidden">
      <div
        className="marquee-track flex w-max"
        data-direction={direction === "reverse" ? "reverse" : undefined}
      >
        {[0, 1].map((copy) => (
          <ul key={copy} className="flex shrink-0 gap-4 pr-4">
            {names.map((name) => (
              <li key={`${copy}-${name}`} className="group">
                <Wordmark name={name} />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  )
}
