import Image from "next/image"

import { SectionHeading } from "@/components/shared/section-heading"
import { clients } from "@/lib/content"
import { cn } from "@/lib/utils"

type ClientLogo = (typeof clients.logos)[number]

function LogoTile({
  logo,
  className,
}: {
  logo: ClientLogo
  className?: string
}) {
  return (
    <span
      className={cn(
        "flex min-h-20 w-full min-w-0 items-center justify-center rounded-xl bg-white px-4 py-4 shadow-sm ring-1 ring-[#DCE3EE] transition-shadow duration-300 group-hover:shadow-md dark:bg-[#F2F5FA] dark:shadow-none dark:ring-0",
        className
      )}
    >
      <Image
        src={logo.src}
        alt={logo.name}
        width={logo.width}
        height={logo.height}
        className="h-10 w-auto max-w-full object-contain"
      />
    </span>
  )
}

export function Clients() {
  const rowA = clients.logos.slice(0, 6)
  const rowB = clients.logos.slice(6)

  return (
    <section id="clients" className="scroll-mt-24 border-t border-border bg-surface-subtle">
      <div className="mx-auto max-w-6xl px-5 pt-16 pb-10 md:px-8 md:pt-24 lg:pt-32">
        <SectionHeading index={clients.index} title={clients.title} />
        <ul className="sr-only">
          {clients.logos.map((logo) => (
            <li key={logo.name}>{logo.name}</li>
          ))}
        </ul>
      </div>

      <div className="marquee-static mx-auto grid max-w-6xl grid-cols-2 gap-3 px-5 pb-16 sm:grid-cols-3 sm:pb-24 md:hidden md:px-8 lg:grid-cols-4">
        {clients.logos.map((logo) => (
          <div key={logo.name} className="group">
            <LogoTile logo={logo} />
          </div>
        ))}
      </div>

      <div className="marquee-animated hidden space-y-4 pb-24 md:block" aria-hidden>
        <Marquee logos={rowA} />
        <Marquee logos={rowB} direction="reverse" />
      </div>
    </section>
  )
}

function Marquee({
  logos,
  direction = "forward",
}: {
  logos: readonly ClientLogo[]
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
            {logos.map((logo) => (
              <li key={`${copy}-${logo.name}`} className="group w-56 shrink-0">
                <LogoTile logo={logo} />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  )
}
