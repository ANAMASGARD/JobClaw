import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, CalendarPlus, Menu } from "lucide-react";
import { FigureStrip } from "@/components/landing/FigureStrip";
import { DancingReviews } from "@/components/landing/DancingReviews";

const navItems = [
  { label: "Product", href: "#" },
  { label: "How it works", href: "#agents" },
  { label: "Pricing", href: "#" },
  { label: "Love", href: "#reviews" },
];

const footerColumns = [
  {
    title: "Product",
    links: [
      { label: "How it works", href: "#agents" },
      { label: "Reviews", href: "#reviews" },
      { label: "Pricing", href: "#" },
      { label: "Dashboard", href: "/dashboard" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Contact", href: "#" },
      { label: "Login", href: "/login" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Docs", href: "#" },
      { label: "Blog", href: "#" },
      { label: "On-chain audit", href: "/dashboard/onchain" },
      { label: "Privacy", href: "#" },
    ],
  },
];

const socials = [
  { label: "X / Twitter", href: "#" },
  { label: "GitHub", href: "#" },
  { label: "LinkedIn", href: "#" },
];

export default function JobClaw() {
  return (
    <main className="relative w-full bg-black text-white">
      {/* ── Hero ── */}
      <section className="relative h-dvh w-full overflow-hidden">
        <header className="absolute inset-x-0 top-0 z-20">
          <nav className="flex items-center justify-between px-6 py-6 md:px-12">
            <Link
              href="/"
              className="font-sans text-2xl font-bold tracking-tight text-white"
            >
              JobClaw<sup className="ml-0.5 align-super text-[0.55em]">®</sup>
            </Link>

            <div className="hidden items-center gap-9 text-xs font-medium uppercase tracking-[0.18em] md:flex">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-white/85 transition-colors hover:text-white"
                >
                  {item.label}
                </a>
              ))}
            </div>

            <div className="flex items-center gap-7">
              <Link
                href="/login"
                className="hidden text-xs font-medium uppercase tracking-[0.18em] text-white/85 transition-colors hover:text-white sm:block"
              >
                Get started
              </Link>
              <button
                type="button"
                aria-label="Open menu"
                className="text-white transition-opacity hover:opacity-70"
              >
                <Menu className="h-7 w-7" strokeWidth={1.75} />
              </button>
            </div>
          </nav>
        </header>

        <h1 className="absolute left-6 top-24 z-10 font-sans font-medium leading-[0.88] tracking-[-0.03em] text-white text-6xl sm:top-28 sm:text-7xl md:left-12 md:top-32 md:text-8xl lg:text-9xl xl:text-[11rem]">
          Join the hunt
        </h1>

        <FigureStrip />
      </section>

      {/* ── Agents multiply ── */}
      <section
        id="agents"
        className="relative w-full border-t-2 border-white/10 bg-black"
      >
        <div className="mx-auto max-w-7xl px-6 py-14 md:px-12 md:py-20">
          {/* 1 — Media: the multiplying-agents video, joined flush with the lead agent */}
          <div className="overflow-hidden rounded-[2rem] border-2 border-white shadow-[12px_12px_0_0_var(--primary)]">
            <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr]">
              {/* Left — single multiplying video, filled edge-to-edge */}
              <div className="relative min-h-[300px] bg-black sm:min-h-[380px] lg:min-h-0">
                <video
                  className="absolute inset-0 h-full w-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                  poster="/images/agents-poster.jpg"
                >
                  <source src="/videos/agents.mp4" type="video/mp4" />
                </video>
                <div className="absolute bottom-4 left-4 z-10 inline-flex items-center gap-2 rounded-full border-2 border-black bg-white px-3 py-1.5">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-destructive" />
                  <span className="text-xs font-bold uppercase tracking-wider text-black">
                    Replicating live
                  </span>
                </div>
              </div>

              {/* Right — the lead agent, joined to the video */}
              <div className="relative flex min-h-[340px] items-end justify-center overflow-hidden border-t-2 border-white bg-black lg:min-h-0 lg:border-l-2 lg:border-t-0">
                <div className="pointer-events-none absolute left-1/2 top-[42%] h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.07] blur-3xl" />
                <Image
                  src="/images/bot.avif"
                  alt="JobClaw lead agent — an autonomous robot that applies to jobs on your behalf"
                  width={1812}
                  height={2445}
                  sizes="(max-width: 1024px) 80vw, 32vw"
                  className="relative z-10 max-h-[460px] w-auto object-contain py-6 drop-shadow-2xl"
                />
                <div className="absolute left-5 top-5 z-20 rounded-full border-2 border-black bg-primary px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-primary-foreground">
                  Lead agent
                </div>
              </div>
            </div>
          </div>

          {/* 2 — Reduced neobrutalist text */}
          <div className="mt-10 max-w-3xl md:mt-12">
            <h2 className="font-head text-4xl leading-[1.06] tracking-tight text-white sm:text-5xl md:text-6xl">
              One agent becomes a{" "}
              <span className="inline-block -rotate-1 border-2 border-black bg-primary px-2.5 text-primary-foreground shadow-[5px_5px_0_0_var(--foreground)]">
                workforce
              </span>
              .
            </h2>
            <p className="mt-6 text-base text-white/55 md:text-lg">
              They search, tailor, and apply — on your behalf.
            </p>
          </div>
        </div>
      </section>

      {/* ── Dancing reviews ── */}
      <DancingReviews />

      {/* ── Pull up a chair (CTA) ── */}
      <section className="relative w-full border-t-2 border-white/10 bg-black">
        <div className="mx-auto max-w-7xl px-6 py-14 md:px-12 md:py-20">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-8">
            {/* Copy + CTAs */}
            <div>
              <h2 className="font-head text-5xl leading-[0.92] tracking-tight text-white sm:text-6xl md:text-7xl">
                Pull up
                <br />a chair.
              </h2>
              <p className="mt-6 max-w-md text-base text-white/55 md:text-lg">
                Your agent handles the hunt — you handle the offers.
              </p>

              <div className="mt-9 flex flex-wrap gap-4">
                <Link
                  href="/login"
                  className="group inline-flex items-center gap-3 rounded-full border-2 border-black bg-primary py-2 pl-6 pr-2 text-primary-foreground shadow-[5px_5px_0_0_var(--foreground)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-primary-hover hover:shadow-[2px_2px_0_0_var(--foreground)]"
                >
                  <span className="font-head text-sm uppercase tracking-wide">
                    Start your agent
                  </span>
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-primary">
                    <ArrowUpRight className="h-4 w-4" strokeWidth={2.5} />
                  </span>
                </Link>

                <Link
                  href="#"
                  className="group inline-flex items-center gap-3 rounded-full border-2 border-white bg-transparent py-2 pl-6 pr-2 text-white transition-colors hover:bg-white hover:text-black"
                >
                  <span className="font-head text-sm uppercase tracking-wide">
                    Book a demo
                  </span>
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-black transition-colors group-hover:bg-black group-hover:text-white">
                    <CalendarPlus className="h-4 w-4" strokeWidth={2.5} />
                  </span>
                </Link>
              </div>
            </div>

            {/* Career chair — subtle neobrutalist frame */}
            <div className="relative rotate-1 overflow-hidden rounded-[2rem] border-2 border-white/15 bg-black shadow-[8px_8px_0_0_var(--primary)]">
              <Image
                src="/images/career-chair.avif"
                alt="A robotic arm presenting a chair — pull up a seat while JobClaw works"
                width={2605}
                height={1954}
                sizes="(max-width: 1024px) 92vw, 46vw"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="relative overflow-hidden border-t-2 border-white/10 bg-black">
        <div className="mx-auto max-w-7xl px-6 pt-12 md:px-12 md:pt-14">
          <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
            {/* Brand */}
            <div>
              <Link
                href="/"
                className="flex items-center gap-2.5 font-sans text-2xl font-bold tracking-tight text-white"
              >
                <Image
                  src="/favicon/android-chrome-192x192.png"
                  alt=""
                  width={32}
                  height={32}
                  className="h-8 w-8"
                />
                JobClaw<sup className="ml-0.5 align-super text-[0.5em]">®</sup>
              </Link>
              <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/50">
                Your autonomous job-hunting agent — discover, personalize, and
                apply with on-chain accountability.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    className="inline-flex items-center gap-1.5 rounded-full border-2 border-white/15 px-3 py-1.5 text-xs font-medium text-white/70 transition-colors hover:border-white hover:text-white"
                  >
                    {s.label}
                    <ArrowUpRight className="h-3 w-3" strokeWidth={2.5} />
                  </a>
                ))}
              </div>
            </div>

            {/* Link columns */}
            {footerColumns.map((col) => (
              <div key={col.title}>
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-white/40">
                  {col.title}
                </p>
                <ul className="mt-5 space-y-3">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <a
                        href={l.href}
                        className="text-sm text-white/70 transition-colors hover:text-white"
                      >
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Oversized wordmark */}
          <div
            aria-hidden
            className="pointer-events-none mt-8 -mb-[1.5vw] select-none overflow-hidden"
          >
            <p className="whitespace-nowrap font-head text-[11vw] leading-[0.7] tracking-tighter text-white/[0.04]">
              JOBCLAW
            </p>
          </div>

          {/* Bottom bar */}
          <div className="mt-6 flex flex-col gap-4 border-t border-white/10 py-6 md:flex-row md:items-center md:justify-between">
            <p className="text-xs text-white/40">
              © {new Date().getFullYear()} JobClaw — Built for MetaMask Smart
              Accounts × 1Shot × Venice AI.
            </p>
            <div className="flex gap-6 text-xs text-white/40">
              <a href="#" className="transition-colors hover:text-white">
                Privacy
              </a>
              <a href="#" className="transition-colors hover:text-white">
                Terms
              </a>
              <a href="#" className="transition-colors hover:text-white">
                Status
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
