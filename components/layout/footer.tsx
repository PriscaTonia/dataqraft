import { ThemedLogo } from "@/components/layout/themed-logo"
import { Separator } from "@/components/ui/separator"
import { nav, site } from "@/lib/content"

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:px-8 lg:grid-cols-[1.4fr_1fr_1fr]">
        <div className="max-w-sm">
          <ThemedLogo variant="tagline" />
          <p className="mt-5 max-w-[42ch] text-sm leading-relaxed text-muted-foreground">
            A data intelligence, research and advisory firm headquartered in
            Lagos, Nigeria.
          </p>
        </div>

        <nav aria-label="Footer">
          <p className="font-mono text-[11px] tracking-[0.22em] text-muted-foreground uppercase">
            Index
          </p>
          <ul className="mt-4 space-y-2">
            {nav.map((item) => (
              <li key={item.id}>
                <a
                  href={item.href}
                  className="text-sm text-foreground/80 outline-none hover:text-signal focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="font-mono text-[11px] tracking-[0.22em] text-muted-foreground uppercase">
            Lagos, NG
          </p>
          <address className="mt-4 space-y-2 text-sm not-italic text-foreground/80">
            <p>
              {site.addressLines[0]}
              <br />
              {site.addressLines[1]}
            </p>
            <p>
              <a className="hover:text-signal" href={site.phoneHref}>
                {site.phoneDisplay}
              </a>
            </p>
            <p>
              <a className="hover:text-signal" href={`mailto:${site.email}`}>
                {site.email}
              </a>
            </p>
            <p>
              <a
                className="hover:text-signal"
                href={site.url}
                rel="noopener noreferrer"
              >
                {site.displayUrl}
              </a>
            </p>
          </address>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <Separator />
        <div className="flex flex-col gap-3 py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>{site.tagline}</p>
          <p>© 2026 Data Qraft Limited</p>
        </div>
        <p className="pb-8 text-xs tracking-wide text-muted-foreground">
          {site.confidentiality}
        </p>
      </div>
    </footer>
  )
}
