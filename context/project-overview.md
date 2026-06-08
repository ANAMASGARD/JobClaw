# Project Overview

> **Purpose:** Product scope — what JobClaw is, who it is for, pages, user modes, demo script, in/out of scope.  
> **Read when:** Onboarding to the project, writing UI copy, preparing demo, clarifying scope.  
> **Canonical technical detail:** `architecture.md` · **Build order:** `build-plan.md` · **Status:** `progress-tracker.md`

---

**JobClaw** is a decentralized autonomous job-hunting agent built for the **MetaMask Smart Accounts Kit x 1Shot API x Venice AI Dev Cook Off**. The user onboards once, grants scoped wallet permissions via MetaMask Smart Accounts Kit (ERC-7715), and then JobClaw autonomously discovers, evaluates, and applies to jobs on their behalf — with every step visible in a RetroUI dashboard and auditable onchain.

The product pitch:

> Web3Auth onboarding for resume and preferences, then MetaMask Smart Account delegation. JobClaw autonomously discovers jobs (LinkedIn, Exa, user URLs), analyzes postings with Brave Search + Browserbase, personalizes resume and cover letter per job via Venice, applies through Browserbase, pays per action via x402/1Shot, and streams every step to the dashboard.

---

## Hackathon Prize Tracks

| Track | What JobClaw must prove |
|-------|-------------------------|
| **Best Agent** | Autonomous discover → rank → apply with durable Convex logs |
| **Best use of Venice AI** | Venice in main reasoning path via OpenClaw (`venice/kimi-k2-5`) |
| **Best x402 + ERC-7710** | HTTP 402 on hunt/apply; delegated smart account drives payment |
| **Best 1Shot Relayer** | EIP-7702 upgrade + EIP-7710 txs via 1Shot mainnet relayer |
| **Best Venice AI** (secondary) | Only eligible after qualifying a main track above |

**Demo video must always use the MetaMask autonomous path** — Smart Accounts Kit visible in the main flow.

---

## The Problem It Solves

Job hunting is repetitive: searching listings, reading descriptions, tailoring answers, filling forms, tracking applications. JobClaw delegates this to an AI agent the user explicitly authorizes once — with scoped permissions, not full wallet control.

---

## Dual-Repo Architecture

| Repo | Deploy | Owns |
|------|--------|------|
| **`jobclaw`** (this repo) | Vercel Hobby | Next.js UI, auth, Convex, x402, Browserbase, Exa, demo |
| **`jobclaw-openclaw`** | Separate Vercel project via `vclaw create` | OpenClaw sandbox + Venice reasoning only |

Browser automation **never** lives in OpenClaw — hosted OpenClaw does not support arbitrary skills/MCP in sandbox.

---

## Pages

```
/                           → Landing (hero, how it works, sponsor badges)
/login                      → Web3Auth social login (primary entry)
/onboarding                 → Resume upload + job preferences + consent
/onboarding/connect-wallet  → MetaMask connect + SIWE (upgrade)
/onboarding/permissions     → Smart Accounts Kit + ERC-7715 grant
/dashboard                  → Stats, live agent logs, recent applications
/dashboard/hunt             → Hunt, paste job URL, LinkedIn search (x402-gated)
/dashboard/onchain          → Tx hashes, BaseScan links, relay status
/dashboard/applications/[id] → Venice match, personalized docs, screenshot, timeline
```

---

## Navigation

Top navbar. RetroUI brutalist style. Primary items:

```
Dashboard    Hunt    Applications    Onchain    Profile
```

Full-width layout. No sidebar.

---

## User Modes

### Web3Auth onboarding mode (primary entry)

- Google / GitHub / email via Web3Auth
- Resume upload, job preferences, consent checkbox
- Browse Venice-ranked listings; paste job URL for preview
- Banner: "Connect MetaMask to enable autonomous apply and onchain delegation"
- **Does not** unlock x402, auto-apply, or Smart Accounts Kit until MetaMask upgrade

### MetaMask autonomous mode (prize-critical — after upgrade)

1. Complete Web3Auth onboarding (or connect MetaMask directly on `/login`)
2. `/onboarding/connect-wallet` — MetaMask connect + `personal_sign` SIWE
3. `/onboarding/permissions` — Smart Accounts Kit + ERC-7715 Advanced Permissions
4. EIP-7702 smart account upgrade via 1Shot relayer
5. Dashboard unlocks hunt/apply/onchain panels
6. Hunt: Exa + LinkedIn discovery, or paste official job URL
7. Agent: Brave Search → Browserbase analyze → Venice personalize → apply
8. Live logs + tx hashes stream to dashboard via Convex realtime

---

## Core User Flow (Demo Path)

### Homepage

- Hero explaining JobClaw + hackathon sponsors (MetaMask, Venice, 1Shot)
- CTA → `/login`

### Login

- **Continue with Google/GitHub** → Web3Auth → `/onboarding` (resume + preferences)
- **Connect with MetaMask** (optional on login) → SIWE → same onboarding funnel

### Apply from pasted URL

- User pastes official job posting URL on `/dashboard/hunt`
- Brave Search enriches company/role context
- Browserbase opens URL and extracts job requirements
- Venice generates personalized cover letter + resume variant
- Stagehand fills and submits application
- Cover letter, resume, and screenshot saved to application detail

### Onboarding

- Upload resume PDF (Convex file storage)
- Job titles, locations, remote preference, salary range
- Consent: "I authorize JobClaw to submit applications on my behalf"

### Permissions (MetaMask only)

- Explain delegated scope: x402 micropayments, agent apply actions, daily spend cap
- MetaMask Advanced Permissions (ERC-7715) prompt
- 7702 upgrade via 1Shot
- Save delegation + onchain log to Convex

### Hunt

- User clicks **Start Hunt** on `/dashboard/hunt`
- x402: API returns 402 → wallet signs payment → retry with `X-PAYMENT`
- Convex action: wake OpenClaw → Exa + LinkedIn search → Venice rank → personalize → Browserbase apply (max 3)
- Realtime logs append to `agentRuns.logs[]`

### Application detail

- Match score + Venice model id + match reason
- Application screenshot (Convex storage)
- Onchain tx link if x402 payment occurred
- Status: discovered → matched → **personalizing** → applying → submitted → failed

---

## Data Architecture

| Data | Owner | Notes |
|------|-------|-------|
| User profile + resume | Convex `users`, `jobProfiles`, `resumes` | Never modified by agent without user action |
| Job listings | Convex `jobListings` | From Exa, LinkedIn, or user-pasted URL |
| Applications | Convex `applications` | One row per apply attempt |
| Agent runs | Convex `agentRuns` | Append-only logs for demo |
| Onchain events | Convex `onchainLogs` | tx hashes, permission grants, x402 settlements |
| Browser sessions | Convex `browserSessions` | Browserbase session ids |
| x402 payments | Convex `x402Payments` | Payment audit trail |

Reasoning happens in **OpenClaw + Venice** (separate repo). JobClaw stores outputs only.

---

## Features In Scope (Hackathon MVP)

- RetroUI landing + dual-login page
- Web3Auth-first onboarding + MetaMask upgrade path
- Smart Accounts Kit + ERC-7715 permissions onboarding
- Convex schema, queries, mutations, actions, file storage, crons
- x402 middleware on hunt/apply/analyze-url routes
- 1Shot relayer for 7702 upgrade + 7710 execution + webhook status
- OpenClaw client (wake + rank via Venice)
- Exa job discovery + LinkedIn search/apply (Browserbase)
- Brave Search API for user-pasted job URL analysis
- Venice resume + cover letter personalization per job
- Browserbase + Stagehand auto-apply (LinkedIn, Greenhouse, Lever, direct URLs)
- Live agent log drawer on dashboard
- Onchain activity panel with explorer links
- Pre-seed 2 applications for demo backup

---

## Features Out of Scope (Hackathon)

- Company research dossier agent (old JobPilot deep-dive — lightweight Brave context only)
- PostHog analytics
- Adzuna job API
- InsForge / Neon / Clerk
- Email/push notifications
- Mobile app
- Multi-user teams
- Production SaaS billing
- Arbitrary OpenClaw plugin/skill install in sandbox

---

## Target User

A developer or technical job seeker at a hackathon demo who:

- Wants to see autonomous AI + onchain accountability
- Is willing to connect MetaMask and grant scoped permissions once
- Expects visible logs, tx hashes, and application proof

---

## Success Criteria (Hackathon)

- 5-minute demo completes without manual wallet popups after initial permission grant
- Judges see Smart Accounts Kit + ERC-7715 in demo video main flow
- Venice model id visible in match reasoning UI
- At least one x402 payment settles with tx hash on dashboard
- At least one live or pre-seeded application with screenshot
- OpenClaw sandbox pre-warmed before judging
- Convex realtime logs update during hunt

---

## Demo Script (5 minutes)

1. Landing — explain JobClaw in one sentence
2. Login — Web3Auth social → resume + preferences (optional: show low-friction onboard)
3. Connect MetaMask → `personal_sign` → Grant Advanced Permissions (ERC-7715)
4. Dashboard — show pre-seeded apps + onchain log
5. Start Hunt — x402 payment → live log streams (Venice + Browserbase phases visible)
6. Application detail — personalized cover letter + Venice reason + screenshot + tx hash
7. Onchain panel — permission grant + x402 + relayer txs
8. Close — "One signature. Fully autonomous. Fully auditable."
