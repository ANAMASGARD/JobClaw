# Build Plan

> **Purpose:** Phase order and feature breakdown — 5 phases, 18 features, priority if time-limited.  
> **Read when:** Planning sprints, deciding what to build next, estimating scope.  
> **Current status:** `progress-tracker.md` · **Technical detail:** `architecture.md`

## Core Principle

**Demo-first, prize-track aligned.** Every phase must produce something visible to judges. Web3Auth onboarding first, then MetaMask upgrade for onchain features. Pre-seed demo data before submission.

Read `AGENTS.md` and `context/README.md` before starting any phase.

---

## Phase 0 — Accounts and OpenClaw Backend

### 00 Prerequisites

- Vercel Hobby account
- Venice API key (`vapi_...`)
- 1Shot API account + Base Sepolia USDC
- Browserbase, Exa, Convex free tiers
- Web3Auth dashboard client id
- MetaMask extension for testing

```bash
npx @vercel/vclaw doctor
```

### 01 Deploy jobclaw-openclaw

```bash
npx @vercel/vclaw create \
  --scope YOUR_TEAM \
  --name jobclaw-openclaw \
  --dir ~/dev/jobclaw-openclaw \
  --clone
```

- Configure Venice in sandbox: `openclaw onboard --auth-choice venice-api-key`
- Set model: `openclaw models set venice/kimi-k2-5`
- Allowlist `api.venice.ai` in egress firewall
- Run `vclaw verify`
- Save `OPENCLAW_BASE_URL`, `OPENCLAW_ADMIN_SECRET` for jobclaw env

---

## Phase 1 — Foundation (jobclaw repo)

### 02 Convex + project shell

- `npx convex dev` — init Convex
- Define schema in `convex/schema.ts` (all tables from architecture.md)
- Wire `ConvexProvider` in root layout
- Empty RetroUI dashboard shell with placeholder stats

### 03 RetroUI landing page

- Hero: JobClaw pitch + sponsor badges (MetaMask, Venice, 1Shot)
- How it works: 3 steps (Connect → Delegate → Autonomous apply)
- CTA → `/login`
- Use `components/retroui/` — Button, Card, Text

### 04 Login + Web3Auth onboarding

**UI:**
- Primary: "Continue with Google/GitHub" via Web3Auth
- Secondary: "Connect with MetaMask" (optional direct entry)
- Step indicator: Login → Resume → Connect Wallet → Permissions

**Logic:**
- Web3Auth modal → idToken verify → session cookie
- Convex `users.upsertFromWeb3Auth`
- Redirect to `/onboarding` (not dashboard yet)
- `middleware.ts` protecting `/dashboard/*`, `/onboarding/*`

### 04b MetaMask upgrade

- `/onboarding/connect-wallet` — wagmi MetaMask + `personal_sign` SIWE
- `POST /api/auth/verify` → link wallet to Web3Auth user
- Convex `users.linkWallet`

---

## Phase 2 — Onchain Onboarding (Prize-critical)

### 05 Onboarding — resume + preferences

- Resume PDF upload → Convex file storage
- Job titles, locations, remote, salary range
- Consent checkbox for autonomous apply
- Convex `jobProfiles` + `resumes` mutations

### 06 Smart Accounts Kit + ERC-7715 permissions

**Must be visible in demo video.**

- `/onboarding/permissions` page
- `toMetaMaskSmartAccount()` via Smart Accounts Kit
- Request ERC-7715 Advanced Permissions (scoped spend cap, expiry)
- EIP-7702 upgrade via 1Shot Permissionless relayer
- Save to Convex `delegations` + `onchainLogs`
- UI copy explaining trust model clearly

---

## Phase 3 — Agent Pipeline

### 07 OpenClaw client + Venice rank

- `lib/openclaw/client.ts` — ensureRunning, rankJobs
- Convex action: call OpenClaw with resume + listings prompt
- Store `veniceModel` + `matchReason` on results
- Label in UI: "Reasoning: Venice AI via OpenClaw"

### 08 Exa + LinkedIn job discovery

- `lib/automation/exa-search.ts` — company + careers pages
- `lib/automation/linkedin-search.ts` — LinkedIn job search via Browserbase
- Save to `jobListings` with `source: "exa"` or `"linkedin"`

### 08b Brave Search + URL analyze

- `lib/automation/brave-search.ts` — Brave Web Search API
- `POST /api/jobs/analyze-url` — x402-gated user-pasted job URL
- Flow: Brave context → Browserbase extract → Venice personalize → apply
- Store `braveContext` on listing

### 09 x402 + 1Shot on hunt/apply/analyze routes

- `lib/x402/middleware.ts` — return 402 with payment instructions
- `lib/x402/facilitator.ts` — 1Shot verify + settle
- `POST /api/jobs/hunt` — x402 gate then trigger Convex action
- Log to `x402Payments` + `onchainLogs`
- Webhook: `app/api/webhooks/1shot/route.ts` for tx status

### 10 Browserbase auto-apply + personalization

- `lib/automation/stagehand-apply.ts` — Venice as Stagehand LLM
- `lib/automation/apply-pipeline.ts` — full flow: extract → personalize → fill
- **LinkedIn, Greenhouse, Lever, direct URLs** — all in scope
- Venice generates **cover letter + tailored resume** before form fill
- Store cover letter, resume PDF, screenshot → Convex storage
- Update `applications.status` + `agentRuns.logs`

### 11 Hunt orchestration

- `convex/actions/jobHunt.ts` — full pipeline:
  1. Wake OpenClaw
  2. Exa search + LinkedIn search
  3. Venice rank (filter score >= 70)
  4. For each match: Brave enrich → personalize → x402-gated apply (max 3)
- `convex/actions/analyzeAndApply.ts` — user-pasted URL pipeline
- Realtime logs via `useQuery(api.agentRuns.getActive)`

---

## Phase 4 — Dashboard (Judge UX)

### 12 Main dashboard

- Stats: applications submitted, avg match, onchain txs, hunts run
- Live log drawer (Convex realtime)
- Application table with status badges
- Banner for Web2 users: "Connect MetaMask for autonomous apply"

### 13 Hunt control page

- `/dashboard/hunt` — Start Hunt button
- x402 payment flow UI (402 → sign → retry)
- Progress phases with Loader component

### 14 Onchain panel

- `/dashboard/onchain` — table of tx hashes
- BaseScan links
- Types: permission_grant, x402_payment, relayer_exec

### 15 Application detail

- `/dashboard/applications/[id]`
- Venice match reason + model id
- Screenshot proof
- Status timeline
- Related tx hash if applicable

---

## Phase 5 — Demo Hardening

### 16 Pre-seed + rehearsal

- Seed 2 completed applications in Convex
- Pre-warm OpenClaw sandbox before demo
- Fund demo wallet with Base Sepolia USDC
- Rehearse 5-minute demo script from project-overview.md
- Record submission video on **MetaMask path only**

### 17 Mainnet for 1Shot prize (if targeting relayer track)

- Switch 7702 + 7710 flows to 1Shot **mainnet** relayer for final demo video
- Keep Base Sepolia for dev/testing

---

## Feature Count

| Phase | Features |
|-------|----------|
| Phase 0 — OpenClaw | 2 |
| Phase 1 — Foundation | 4 |
| Phase 2 — Onchain onboarding | 2 |
| Phase 3 — Agent pipeline | 6 |
| Phase 4 — Dashboard | 4 |
| Phase 5 — Demo hardening | 2 |
| **Total** | **20** |

---

## Build Order Priority

If time is limited, build in this order:

1. Convex schema + dashboard shell
2. Web3Auth login + onboarding (resume + preferences)
3. MetaMask connect-wallet + SIWE + permissions page (Smart Accounts Kit)
4. OpenClaw + Venice rank (prove AI path)
5. x402 on hunt route
6. Browserbase single apply + personalization (cover letter + resume)
7. Brave Search + analyze-url pipeline
8. Onchain dashboard + live logs
9. LinkedIn search (if time permits)
10. Pre-seed + demo rehearsal
