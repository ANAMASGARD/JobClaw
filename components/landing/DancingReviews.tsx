import Image from "next/image";

/**
 * Dancing reviews — pony.studio/reviews-style scatter of looping "dancing"
 * figures on black, with a client testimonial anchored below. Each figure is a
 * tiny autoplay/muted/loop video (downloaded to /public/dancers). Positions and
 * sizes are hand-tuned for an even scatter; a gentle float adds depth. Honors
 * prefers-reduced-motion via the `.dancer-float` rule.
 *
 * NOTE: the dancer clips are placeholder assets borrowed from pony.studio for
 * the prototype — replace with original/licensed footage before launch.
 */

type Dancer = {
  src: number; // /dancers/dancer-{src}.mp4
  left: number; // %
  top: number; // %
  w: number; // px (max width; scales down with viewport)
  dur: number; // float seconds
  delay: number; // float delay seconds
  accent?: boolean;
};

const dancers: Dancer[] = [
  { src: 1, left: 6, top: 34, w: 92, dur: 6.5, delay: 0 },
  { src: 2, left: 16, top: 8, w: 104, dur: 7.5, delay: 0.6 },
  { src: 3, left: 26, top: 50, w: 84, dur: 6.0, delay: 1.2 },
  { src: 4, left: 35, top: 22, w: 96, dur: 8.0, delay: 0.3 },
  { src: 5, left: 47, top: 56, w: 104, dur: 6.8, delay: 0.9, accent: true },
  { src: 6, left: 48, top: 12, w: 88, dur: 7.2, delay: 1.5 },
  { src: 7, left: 60, top: 42, w: 92, dur: 6.3, delay: 0.4 },
  { src: 8, left: 66, top: 64, w: 84, dur: 7.8, delay: 1.1 },
  { src: 9, left: 73, top: 16, w: 108, dur: 6.6, delay: 0.7 },
  { src: 10, left: 85, top: 48, w: 96, dur: 7.0, delay: 1.3 },
  { src: 11, left: 89, top: 24, w: 88, dur: 6.9, delay: 0.2 },
];

export function DancingReviews() {
  return (
    <section
      id="reviews"
      className="relative w-full overflow-hidden border-t-2 border-white/10 bg-black"
    >
      <div className="mx-auto max-w-7xl px-6 pt-12 md:px-12 md:pt-16">
        <span className="text-xs font-medium uppercase tracking-[0.22em] text-white/50">
          Loved by job seekers
        </span>
        <h2 className="mt-3 font-head text-3xl tracking-tight text-white sm:text-4xl">
          Offers worth dancing for.
        </h2>
      </div>

      {/* Scatter of dancing figures */}
      <div className="relative mx-auto mt-4 h-[42vh] min-h-[340px] w-full max-w-[1600px]">
        {dancers.map((d) => (
          <div
            key={d.src}
            className="dancer-float absolute -translate-x-1/2 -translate-y-1/2"
            style={
              {
                left: `${d.left}%`,
                top: `${d.top}%`,
                width: `clamp(46px, ${(d.w / 13).toFixed(2)}vw, ${d.w}px)`,
                "--float-dur": `${d.dur}s`,
                "--float-delay": `${d.delay}s`,
              } as React.CSSProperties
            }
          >
            {d.accent && (
              <div className="pointer-events-none absolute inset-0 -z-10 scale-150 rounded-full bg-primary/20 blur-2xl" />
            )}
            <video
              className="h-auto w-full"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
            >
              <source src={`/dancers/dancer-${d.src}.mp4`} type="video/mp4" />
            </video>
          </div>
        ))}
      </div>

      {/* Testimonial */}
      <div className="mx-auto max-w-7xl px-6 pb-12 md:px-12 md:pb-16">
        <div className="grid gap-8 lg:grid-cols-[260px_1fr] lg:items-start">
          <div className="flex items-center gap-4">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 border-black bg-primary">
              <Image
                src="/images/user-icon.png"
                alt="Maya Chen"
                width={64}
                height={64}
                className="h-full w-full object-cover mix-blend-luminosity"
              />
            </div>
            <div>
              <p className="font-semibold text-white">Maya Chen</p>
              <p className="text-sm text-white/50">
                Software Engineer — hired in 3 weeks
              </p>
            </div>
          </div>

          <blockquote className="font-sans text-2xl leading-snug tracking-tight text-white sm:text-3xl md:text-[2.2rem]">
            &ldquo;JobClaw applied to forty roles while I slept. I woke up to
            three interviews booked — and I could see every application, every
            cover letter it wrote, every transaction on-chain. It just
            works.&rdquo;
          </blockquote>
        </div>
      </div>
    </section>
  );
}
