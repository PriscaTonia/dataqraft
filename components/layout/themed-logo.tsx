import Image from "next/image"

import { cn } from "@/lib/utils"

const compact = {
  navy: { src: "/brand/dql-logo-navy.png", width: 1317, height: 559 },
  white: { src: "/brand/dql-logo-white.png", width: 1308, height: 557 },
} as const

const tagline = {
  navy: { src: "/brand/dql-logo-navy-tagline.png", width: 1317, height: 651 },
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
          src={tagline.navy.src}
          alt="Data Qraft Limited. Research, Data, Intelligence."
          width={tagline.navy.width}
          height={tagline.navy.height}
          className="h-16 w-auto dark:hidden"
        />
        {/*
          The supplied logo PDF has no white tagline export (and every page
          has a solid background). Dark mode uses the transparent white
          wordmark plus the tagline set in type until
          public/brand/dql-logo-white-tagline.svg is added.
        */}
        <span className="hidden flex-col items-start dark:inline-flex">
          <Image
            src={compact.white.src}
            alt="Data Qraft Limited"
            width={compact.white.width}
            height={compact.white.height}
            className="h-9 w-auto"
          />
          <span className="mt-2 font-mono text-[10px] tracking-[0.18em] text-[#8A97AB] uppercase">
            Research | Data | Intelligence
          </span>
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
