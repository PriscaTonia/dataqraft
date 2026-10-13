import { Reveal } from "@/components/shared/reveal"
import { SectionHeading } from "@/components/shared/section-heading"
import { about } from "@/lib/content"

export function About() {
  return (
    <section id="about" className="scroll-mt-24 border-t border-border">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-16 md:px-8 md:py-24 lg:py-32 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <SectionHeading index={about.index} title={about.title} />
          <p className="mt-6 max-w-[65ch] text-base leading-[1.7] text-foreground/85">
            {about.body}
          </p>
        </Reveal>
        <Reveal delay={0.08}>
          <article className="rounded-2xl border border-border bg-card p-5 shadow-[0_18px_50px_-32px_rgba(14,26,46,0.45)] sm:p-7 md:p-8 dark:shadow-none">
            <h3 className="text-lg font-medium tracking-tight">
              {about.expertiseTitle}
            </h3>
            <p className="mt-4 text-base leading-[1.7] text-muted-foreground">
              {about.expertise}
            </p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {about.capabilities.map((capability) => (
                <li
                  key={capability}
                  className="rounded-lg border border-border bg-secondary px-2.5 py-1 font-mono text-[10px] tracking-[0.16em] text-muted-foreground uppercase"
                >
                  {capability}
                </li>
              ))}
            </ul>
          </article>
        </Reveal>
      </div>
    </section>
  )
}
