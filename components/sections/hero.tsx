import { IntelligenceMap } from "@/components/sections/intelligence-map"
import { SignalField } from "@/components/sections/signal-field"
import { buttonVariants } from "@/components/ui/button"
import { hero } from "@/lib/content"
import { cn } from "@/lib/utils"

export function Hero() {
  return (
    <section id="top" className="relative min-h-svh overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(180deg,var(--hero-from),var(--background)_74%)]"
      />
      <div aria-hidden className="hero-grid absolute inset-0 opacity-70" />
      <div
        aria-hidden
        className="absolute top-0 right-0 h-[28rem] w-[28rem] rounded-full bg-signal/10 blur-3xl xl:h-[40rem] xl:w-[40rem]"
      />
      <SignalField />
      <div className="relative z-10 mx-auto grid min-h-svh w-full max-w-[90rem] items-center gap-6 px-5 pt-24 pb-16 md:px-8 md:pt-28 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-8 lg:px-10 lg:pt-24">
        <div className="order-2 min-w-0 lg:order-1">
        <p className="max-w-[22rem] font-mono text-[10px] tracking-[0.16em] text-muted-foreground uppercase sm:max-w-none sm:text-[11px] sm:tracking-[0.22em]">
          {hero.eyebrow}
        </p>
        <h1 className="mt-6 max-w-[14ch] text-[clamp(2.35rem,8vw,5.35rem)] leading-[0.98] font-medium tracking-tight text-balance sm:max-w-[12ch] lg:max-w-none lg:text-[clamp(2.3rem,4.5vw,4.5rem)] xl:text-[clamp(2.6rem,4.8vw,5.35rem)]">
          {hero.title}
        </h1>
        <p className="mt-6 max-w-[40rem] text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg md:text-xl">
          {hero.subhead}
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a
            href="#contact"
            className={cn(
              buttonVariants({ variant: "signal" }),
              "h-11 w-full px-5 sm:w-auto"
            )}
          >
            {hero.primaryCta}
          </a>
          <a
            href="#services"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "h-11 w-full px-5 sm:w-auto"
            )}
          >
            {hero.secondaryCta}
          </a>
        </div>
        <ul className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[11px] tracking-[0.22em] text-muted-foreground uppercase">
          {hero.marks.map((mark, index) => (
            <li key={mark} className="flex items-center gap-3">
              {index > 0 ? (
                <span aria-hidden className="size-1 rounded-full bg-signal" />
              ) : null}
              {mark}
            </li>
          ))}
        </ul>
        </div>
        <div className="pointer-events-none order-1 flex justify-center lg:order-2 lg:justify-end">
          <IntelligenceMap className="h-auto w-full max-w-[34rem] overflow-visible lg:max-w-[680px]" />
        </div>
      </div>

      <a
        href="#about"
        className="scroll-cue absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 text-[10px] tracking-[0.22em] text-muted-foreground uppercase md:flex"
      >
        Scroll
        <span className="h-8 w-px bg-border" />
      </a>
    </section>
  )
}
