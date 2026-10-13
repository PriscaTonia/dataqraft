import { SignalField } from "@/components/sections/signal-field"
import { buttonVariants } from "@/components/ui/button"
import { hero } from "@/lib/content"
import { cn } from "@/lib/utils"

export function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-svh items-end overflow-hidden"
    >
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(180deg,var(--hero-from),var(--background)_74%)]"
      />
      <div aria-hidden className="hero-grid absolute inset-0 opacity-70" />
      <div
        aria-hidden
        className="absolute -top-32 left-1/2 h-[36rem] w-[46rem] -translate-x-1/2 rounded-full bg-signal/10 blur-3xl"
      />
      <SignalField />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 pt-32 pb-20 md:px-8 md:pb-24">
        <p className="font-mono text-[11px] tracking-[0.22em] text-muted-foreground uppercase">
          {hero.eyebrow}
        </p>
        <h1 className="mt-6 max-w-[12ch] text-[clamp(2.7rem,6.4vw,5.35rem)] leading-[0.98] font-medium tracking-tight text-balance">
          {hero.title}
        </h1>
        <p className="mt-6 max-w-[46rem] text-lg leading-relaxed text-muted-foreground md:text-xl">
          {hero.subhead}
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a
            href="#contact"
            className={cn(buttonVariants({ variant: "signal" }), "h-11 px-5")}
          >
            {hero.primaryCta}
          </a>
          <a
            href="#services"
            className={cn(buttonVariants({ variant: "outline" }), "h-11 px-5")}
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
