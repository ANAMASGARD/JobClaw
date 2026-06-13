import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * The herd — a large, seamlessly auto-rotating row of JobClaw figures anchored
 * to the bottom of the hero, modelled on pony.studio. Pure CSS marquee: four
 * identical copies sit in a flex track that translates by exactly half its
 * width, so the loop never visibly resets. Honors prefers-reduced-motion.
 *
 * The source PNG is transparent, so the figures stand directly on the black
 * canvas with no plate.
 */

// Intrinsic size of /images/jobclaw-figures.png
const FIGURE_W = 2510;
const FIGURE_H = 561;

// Four copies → translating the track by -50% advances exactly two copies,
// landing copy #2 where copy #0 was for a gapless loop.
const COPIES = 4;

export function FigureStrip({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-x-0 bottom-0 z-0 overflow-hidden",
        className,
      )}
    >
      <div className="marquee-track">
        {Array.from({ length: COPIES }).map((_, i) => (
          <Image
            key={i}
            src="/images/jobclaw-figures.png"
            alt={i === 0 ? "A row of JobClaw agents" : ""}
            aria-hidden={i === 0 ? undefined : true}
            width={FIGURE_W}
            height={FIGURE_H}
            priority={i === 0}
            draggable={false}
            sizes="200vw"
            className="h-[56vh] w-auto max-w-none select-none sm:h-[62vh] lg:h-[70vh]"
          />
        ))}
      </div>
    </div>
  );
}
