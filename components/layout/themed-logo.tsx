import Image from "next/image"

import { cn } from "@/lib/utils"
import { site } from "@/lib/content"

const compact = {
  navy: { src: "/brand/dql-logo-navy.png", width: 1317, height: 559 },
  white: { src: "/brand/dql-logo-white.png", width: 1308, height: 557 },
} as const

type ThemedLogoProps = {
  variant?: "compact" | "tagline"
  className?: string
  priority?: boolean
}

export function ThemedLogo({
  variant = "compact",
  className,
  priority = false,
}: ThemedLogoProps) {
  if (variant === "tagline") {
    return (
      <span className={cn("inline-flex flex-col items-start", className)}>
        <Image
          src={compact.navy.src}
          alt="Data Qraft Limited"
          width={compact.navy.width}
          height={compact.navy.height}
          className="h-9 w-auto dark:hidden"
        />
        <Image
          src={compact.white.src}
          alt="Data Qraft Limited"
          width={compact.white.width}
          height={compact.white.height}
          className="hidden h-9 w-auto dark:block"
        />
        <span className="mt-2 font-mono text-[10px] tracking-[0.18em] text-muted-foreground uppercase">
          {site.logoTagline}
        </span>
      </span>
    )
  }

  return (
    <span className={cn("inline-flex items-center", className)}>
      <Image
        src={compact.navy.src}
        alt="Data Qraft Limited"
        width={compact.navy.width}
        height={compact.navy.height}
        priority={priority}
        className="h-7 w-auto sm:h-8 dark:hidden"
      />
      <Image
        src={compact.white.src}
        alt="Data Qraft Limited"
        width={compact.white.width}
        height={compact.white.height}
        priority={priority}
        className="hidden h-7 w-auto sm:h-8 dark:block"
      />
    </span>
  )
}
