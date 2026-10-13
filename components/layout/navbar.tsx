"use client"

import { Menu } from "lucide-react"
import { useEffect, useState } from "react"

import { ThemeToggle } from "@/components/layout/theme-toggle"
import { ThemedLogo } from "@/components/layout/themed-logo"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { nav } from "@/lib/content"
import { cn } from "@/lib/utils"

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState<string>("")
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    const sections = nav
      .map((item) => document.getElementById(item.id))
      .filter((section): section is HTMLElement => section !== null)

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible?.target.id) setActive(visible.target.id)
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.2, 0.5, 1] }
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 border-b",
        scrolled
          ? "border-border bg-background/92 backdrop-blur-md"
          : "border-transparent bg-transparent"
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-5 md:px-8">
        <a
          href="#top"
          aria-label="Data Qraft Limited"
          className="shrink-0 rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <ThemedLogo priority />
        </a>

        <nav aria-label="Primary" className="ml-auto hidden items-center gap-6 lg:flex">
          {nav.map((item) => {
            const isActive = active === item.id
            return (
              <a
                key={item.id}
                href={item.href}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "relative py-1 text-sm text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50",
                  isActive && "text-foreground"
                )}
              >
                {item.label}
                <span
                  className={cn(
                    "absolute -bottom-1 left-0 h-px w-full origin-left bg-signal transition-transform duration-300",
                    isActive ? "scale-x-100" : "scale-x-0"
                  )}
                />
              </a>
            )
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <ThemeToggle />
          <a
            href="#contact"
            className={cn(
              buttonVariants({ variant: "signal" }),
              "hidden h-9 px-3.5 sm:inline-flex"
            )}
          >
            Request a briefing
          </a>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              className="lg:hidden"
              render={
                <Button variant="ghost" size="icon" aria-label="Open menu" />
              }
            >
              <Menu />
            </SheetTrigger>
            <SheetContent side="right" className="w-full bg-background sm:max-w-sm">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <nav aria-label="Mobile" className="flex flex-col px-4">
                {nav.map((item) => (
                  <a
                    key={item.id}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="border-b border-border py-3.5 text-base text-foreground outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
              <div className="mt-auto p-4">
                <SheetClose
                  nativeButton={false}
                  render={
                    <a
                      href="#contact"
                      className={cn(
                        buttonVariants({ variant: "signal" }),
                        "h-11 w-full"
                      )}
                    />
                  }
                >
                  Request a briefing
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
