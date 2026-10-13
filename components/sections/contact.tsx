import { Globe, Mail, MapPin, Phone } from "lucide-react"

import { ContactForm } from "@/components/sections/contact-form"
import { SectionHeading } from "@/components/shared/section-heading"
import { contact, site } from "@/lib/content"

const details = [
  {
    icon: MapPin,
    label: "Address",
    value: site.address,
  },
  {
    icon: Phone,
    label: "Phone",
    value: site.phoneDisplay,
    href: site.phoneHref,
  },
  {
    icon: Mail,
    label: "Email",
    value: site.email,
    href: `mailto:${site.email}`,
  },
  {
    icon: Globe,
    label: "Web",
    value: site.displayUrl,
    href: site.url,
  },
] as const

export function Contact() {
  return (
    <section id="contact" className="scroll-mt-24 border-t border-border">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-24 md:px-8 md:py-32 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div>
          <SectionHeading
            index={contact.index}
            title={contact.title}
            description={contact.subhead}
          />
          <ul className="mt-10 space-y-5">
            {details.map((detail) => {
              const Icon = detail.icon
              const body = (
                <span className="text-sm leading-relaxed">{detail.value}</span>
              )
              return (
                <li key={detail.label} className="flex gap-3">
                  <Icon className="mt-0.5 size-4 shrink-0 text-signal" aria-hidden />
                  <div>
                    <p className="font-mono text-[10px] tracking-[0.18em] text-muted-foreground uppercase">
                      {detail.label}
                    </p>
                    {"href" in detail ? (
                      <a
                        href={detail.href}
                        className="mt-1 inline-block outline-none hover:text-signal focus-visible:ring-3 focus-visible:ring-ring/50"
                      >
                        {body}
                      </a>
                    ) : (
                      <p className="mt-1">{body}</p>
                    )}
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
        <ContactForm />
      </div>
    </section>
  )
}
