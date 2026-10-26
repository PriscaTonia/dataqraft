import { SignalField } from "@/components/sections/signal-field"

/**
 * Persistent, page-wide ambient layer: the faint dot grid + drifting signal
 * nodes from the hero, extended across the whole site. Fixed to the
 * viewport so it's always present regardless of scroll position; sections
 * with their own opaque background simply paint over it.
 */
export function AmbientBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
      <div className="hero-grid absolute inset-0" />
      <SignalField />
    </div>
  )
}
