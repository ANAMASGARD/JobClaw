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
- Browserbase, Exa, Neo4j free tiers
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

### 02 Neo4j + project shell

- Create **Neo4j Aura** free instance (or local Docker for dev)
- Run `scripts/neo4j-init.cypher` — constraints, indexes
- `lib/neo4j/client.ts` + repository stubs
- `BLOB_READ_WRITE_TOKEN` for Vercel Blob
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
- `usersRepository.upsertFromWeb3Auth` (Neo4j MERGE User)
- Redirect to `/onboarding` (not dashboard yet)
- `middleware.ts` protecting `/dashboard/*`, `/onboarding/*`

### 04b MetaMask upgrade

- `/onboarding/connect-wallet` — wagmi MetaMask + `personal_sign` SIWE
- `POST /api/auth/verify` → link wallet to Web3Auth user
- `usersRepository.linkWallet`

---

## Phase 2 — Onchain Onboarding (Prize-critical)

### 05 Onboarding — resume + preferences

- Resume PDF upload → **Vercel Blob** (URL on `Resume` node)
- Job titles, locations, remote, salary range
- Consent checkbox for autonomous apply
- `jobProfilesRepository` + `resumesRepository` (Neo4j)

### 06 Smart Accounts Kit + ERC-7715 permissions

**Must be visible in demo video.**

- `/onboarding/permissions` page
- `toMetaMaskSmartAccount()` via Smart Accounts Kit
- Request ERC-7715 Advanced Permissions (scoped spend cap, expiry)
- EIP-7702 upgrade via 1Shot Permissionless relayer
- Save `Delegation` + `OnchainLog` nodes in Neo4j
- UI copy explaining trust model clearly

---

## Phase 3 — Agent Pipeline

### 07 OpenClaw client + Venice rank + Agentic RAG

- `lib/openclaw/client.ts` — ensureRunning, rankJobs (passes `userId` for RAG context)
- `lib/rag/queries.ts` + `lib/rag/formatters.ts` — Cypher for each RAG tool
- `app/api/rag/*` — profile, resume, job, match, applications (auth: `RAG_API_SECRET`)
- `jobclaw-openclaw/tools/rag-tools.json` — OpenClaw tool manifest → `JOBCLAW_BASE_URL/api/rag/*`
- `lib/jobs/jobHunt.ts` — async pipeline after API route creates AgentRun
- Store `veniceModel` + `matchReason` on results (match reason cites graph skills)
- Label in UI: "Reasoning: Venice AI via OpenClaw + Neo4j RAG"

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
- `POST /api/jobs/hunt` — x402 gate → create AgentRun → kick `lib/jobs/jobHunt`
- Log to Neo4j `X402Payment` + `OnchainLog` nodes
- Webhook: `app/api/webhooks/1shot/route.ts` for tx status

### 10 Browserbase auto-apply + personalization

- `lib/automation/stagehand-apply.ts` — Venice as Stagehand LLM
- `lib/automation/apply-pipeline.ts` — full flow: extract → personalize → fill
- **LinkedIn, Greenhouse, Lever, direct URLs** — all in scope
- Venice generates **cover letter + tailored resume** before form fill
- Store cover letter, resume PDF, screenshot → **Vercel Blob**; URLs on `Application` node
- Append `LogEntry` nodes on `AgentRun`

### 11 Hunt orchestration

- `lib/jobs/jobHunt.ts` — full pipeline:
  1. Wake OpenClaw
  2. Exa search + LinkedIn search
  3. Venice rank via **agentic RAG** (profile → skills → match per listing; filter score >= 70)
  4. For each match: Brave enrich → personalize → apply (max 3)
- `lib/jobs/analyzeAndApply.ts` — user-pasted URL pipeline
- Live logs via SWR poll on `GET /api/agent-runs/[id]`

---

## Phase 4 — Dashboard (Judge UX)

### 12 Main dashboard

- Stats: applications submitted, avg match, onchain txs, hunts run
- Live log drawer (SWR poll ~2s during active hunt)
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

- Seed 2 completed applications in Neo4j
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

1. Neo4j schema + dashboard shell
2. Web3Auth login + onboarding (resume + preferences)
3. MetaMask connect-wallet + SIWE + permissions page (Smart Accounts Kit)
4. OpenClaw + Venice rank (prove AI path)
5. x402 on hunt route
6. Browserbase single apply + personalization (cover letter + resume)
7. Brave Search + analyze-url pipeline
8. Onchain dashboard + live logs
9. LinkedIn search (if time permits)
10. Pre-seed + demo rehearsal
