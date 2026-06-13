<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# JobClaw Agent Operating Manual

> **Entry point for every AI session.** Pair with `context/README.md` for the full document map, glossary, and task router.

---

## Quick Reference

| | |
|---|---|
| **Product** | Autonomous job agent — discover, personalize, apply with onchain audit trail |
| **Hackathon** | MetaMask Smart Accounts Kit × 1Shot × Venice AI (deadline **June 15, 2026**) |
| **Repos** | `jobclaw` (Neo4j website + RAG API) + `jobclaw-openclaw` (Venice + agentic RAG tools) |
| **Auth flow** | Web3Auth onboard → MetaMask upgrade → ERC-7715 delegation |
| **Demo must show** | Smart Accounts Kit + Venice model id + x402 tx hash + agent logs + apply screenshot |
| **State** | Phase 0 not started — see `context/progress-tracker.md` |
| **Database** | **Neo4j** (required) — powers **entire website** + agent graph + RAG context; Vercel Blob for files — **not Convex** |
| **Match threshold** | `70` in `lib/utils.ts` — never hardcode |
| **Venice default** | `venice/kimi-k2-5` via OpenClaw; fallback `venice/zai-org-glm-5` |

**Before coding:** `context/progress-tracker.md` → task router in `context/README.md` → relevant context file.

---

This file extends the agent workflow with product context, prize-track priorities, architecture boundaries, and implementation habits required to build **JobClaw** correctly.

JobClaw is a decentralized autonomous job-hunting SaaS where a user explicitly onboards once, grants scoped wallet-based permissions, and then an agent continuously searches, evaluates, and applies to jobs on the user's behalf. The user should not be interrupted by repeated wallet popups for normal autonomous behavior. The product must feel like a trustable AI worker with visible onchain accountability, not just a chatbot with a wallet attached.

## What We Are Building

**JobClaw** is a dual-repo agentic application for the MetaMask Smart Accounts Kit x 1Shot API x Venice AI Dev Cook Off, while also being polished enough to submit as a practical AI repository/product in a second hackathon. The system combines:

- **Next.js + RetroUI frontend** for onboarding, resume upload, job preferences, live dashboards, and judge-facing demos.
- **Web3Auth-first onboarding** — social login (Google/GitHub/email) to upload resume and set job preferences, then **upgrade to MetaMask** for hackathon onchain requirements.
- **MetaMask SDK + Smart Accounts Kit** for smart account creation/usage and **Advanced Permissions (ERC-7715)** so the user can delegate limited autonomy to the agent.
- **1Shot Permissionless Relayer** for EIP-7702 upgrade and EIP-7710 transaction execution with stablecoin gas abstraction, which is central to the hackathon's relayer and x402 tracks.
- **x402 payment-gated actions** so certain agent actions are machine-payable and visibly tied to delegated wallet permissions, which is exactly what the x402 + ERC-7710 track is asking for.
- **Neo4j** as the graph database backbone — **powers every website page** plus users, jobs, applications, agent runs, onchain events, and **relationships** (skills, apply history, match paths). OpenClaw retrieves context via **Agentic RAG** (`/api/rag/*`). **Required — do not use Convex.**
- **Vercel Blob** for resume PDFs, cover letters, screenshots (Neo4j stores URLs + metadata only).
- **OpenClaw hosted separately** as the reasoning control plane, using **Venice AI** with **agentic RAG** — Venice autonomously calls jobclaw RAG tools to retrieve user profile, skills, and job context from Neo4j before ranking and personalizing.
- **Browserbase + Stagehand** for real browser execution — LinkedIn job search/apply, Greenhouse/Lever, and direct company career URLs.
- **Brave Search API** for enriching user-pasted official job posting URLs with company and role context before Browserbase analysis.
- **Exa** for broad job discovery and retrieval.
- **Venice personalization** — tailored resume variant + cover letter per job before form submission.

The product pitch is:

> Web3Auth onboarding for resume and preferences, then MetaMask connect + Smart Account delegation. JobClaw runs autonomously: Venice-powered OpenClaw ranks jobs, Brave Search + Browserbase analyze postings, Venice personalizes resume and cover letter per job, x402 pays per action through 1Shot, and every step streams into the RetroUI dashboard with tx hashes and agent logs.

## Prize-Track Product Narrative

Every implementation choice must reinforce the judge story. The demo must visibly prove these four ideas:

1. **Best Agent** — JobClaw autonomously discovers, ranks, and applies to jobs while writing durable Neo4j agent logs and application graph records.
2. **Best Use of Venice AI** — Venice uses **agentic RAG** against Neo4j (skill match, apply history) through OpenClaw; not a side feature.
3. **Best x402 + ERC-7710** — protected hunt/apply endpoints return HTTP 402, and delegated permissions drive the corresponding payment behavior.
4. **Best Use of 1Shot Permissionless Relayer** — 1Shot relays the critical upgrade/execution transactions and webhook-driven status updates should be preferred over polling.

If there is ever a tradeoff between generic product polish and making these four things obvious in the demo, favor the demo clarity.

## Dual-Repo Boundaries

These repo boundaries are fixed unless explicitly changed by the user.

### Repo 1 — `jobclaw`
Owns:
- Next.js app router frontend
- RetroUI components and dashboard UX
- MetaMask/Web3Auth login surfaces (Web3Auth first, MetaMask upgrade second)
- `personal_sign` verification flow
- Smart Accounts Kit onboarding UI
- Neo4j graph schema, Cypher repositories, constraints/indexes (`lib/neo4j/`)
- **Agentic RAG API** (`lib/rag/`, `app/api/rag/*`) — Neo4j retrieval for OpenClaw Venice agent
- Vercel Blob for file artifacts (resume, cover letter, screenshots)
- x402 middleware and 1Shot relayer/facilitator integrations
- Browserbase + Stagehand execution (LinkedIn, Greenhouse, direct URLs)
- Brave Search API for URL-based job analysis
- Exa search
- Demo pages and logs

### Repo 2 — `jobclaw-openclaw`
Owns:
- OpenClaw control plane deployment
- Venice provider configuration + **tool calling** for agentic RAG
- RAG tool manifest (`tools/rag-tools.json`) → jobclaw `/api/rag/*`
- reasoning-only orchestration endpoint(s)
- model selection and agent routing

Do **not** move browser automation into hosted OpenClaw unless the user explicitly changes the architecture. Keep browser execution in `jobclaw`.

## Read Before Anything Else

Read in this exact order before any implementation:

0. **`AGENTS.md`** (this file) — rules, prize tracks, anti-patterns
1. **`context/README.md`** — document map, glossary, task router
2. **`context/progress-tracker.md`** — current status (what is done vs next)
3. **`context/project-overview.md`** — product scope, pages, demo script
4. **`context/architecture.md`** — system design, schema, flows, skills/MCP
5. **`context/code-standards.md`** — if writing code
6. **`context/library-docs.md`** — if touching a third-party library
7. **`context/build-plan.md`** — if planning phase order
8. **UI files** (`ui-tokens`, `ui-rules`, `ui-registry`) — if building UI only

**Use the task router in `context/README.md`** — do not read all files for every task.

Then additionally before touching specific areas:

9. `context/architecture.md` → **Agent Tooling — Skills & MCP**
10. `node_modules/next/dist/docs/` for the exact Next.js 16 feature being edited
11. MetaMask Smart Accounts Kit docs — smart account / delegation
12. Venice OpenClaw provider docs — AI / provider config
13. 1Shot hackathon + relayer docs — x402, 7702, 7710
14. **Neo4j** — Context7 `/neo4j/neo4j-javascript-driver` + `architecture.md` (Graph Model) — before editing `lib/neo4j/`
15. Browserbase / Stagehand docs — automation

## Rules That Never Change

- Never use hardcoded hex values or raw Tailwind color classes.
- Update `context/progress-tracker.md` and `context/ui-registry.md` after every feature.
- Use `context/README.md` glossary terms consistently — do not invent synonyms.
- Before any third-party library, load its installed skill first, then read `context/library-docs.md` for project-specific rules.
- If the same problem persists after one corrective prompt, stop immediately and run `/recover`.
- Never weaken the judge-critical MetaMask flow in favor of convenience auth.
- Never claim Web2 users have autonomous onchain features unless that path is actually implemented and tested.
- Never make Venice optional in the main prize demo flow.
- Never hide transaction hashes, permission grants, or relay status from the dashboard if they are available.

## Available Skills

- `/architect` — before any complex feature. Think before building.
- `/imprint` — after any new UI component. Capture patterns.
- `/review` — before demo or when something feels off.
- `/recover` — when something breaks after one failed correction.
- `/remember save` — when a feature spans multiple sessions.
- `/remember restore` — when returning after a multi-session feature.

## Additional Skills To Use Intentionally

Use these selectively when the task touches them. Full inventory with paths: **`context/architecture.md` → Agent Tooling — Skills & MCP**.

### Repo workflow skills (`.agents/skills/`)

Read the `SKILL.md` before acting: **architect** (plan first), **review** (pre-demo), **recover** (after one failed fix), **imprint** (after new UI), **remember** (multi-session).

### Global skills (`~/.agents/skills/` + `~/.claude/skills/`)

- **deploy-to-vercel** — `vercel deploy`, link project, preview deployments (`npx vercel` CLI)
- **web3auth** — Web3Auth modal, social login, embedded wallets
- **ai-sdk** — Vercel AI SDK if adding AI helpers
- **vercel-react-best-practices** — React/Next performance
- **systematic-debugging** — structured debug when stuck

### Vercel plugin skills (global)

Path: `~/.claude/plugins/cache/claude-plugins-official/vercel/0.42.1/skills/`

Load before editing: **nextjs**, **vercel-functions**, **deployments-cicd**, **env-vars**, **vercel-cli**, **next-cache-components**, **workflow**.

### Required MCP servers

| MCP | Use for |
|-----|---------|
| **Context7** (`user-context7`) | Library API docs — **Neo4j**, Web3Auth, MetaMask Kit, Stagehand, x402, Venice |
| **Vercel** (`plugin-vercel-vercel`) | Deploy, build logs, runtime logs, Vercel Blob |
| **Cursor IDE Browser** | Demo rehearsal / manual UI test only — not production apply |

- **Next.js / Vercel** — local docs in `node_modules/next/dist/docs/` + Vercel plugin `nextjs` skill.
- **MetaMask / Smart Accounts Kit** — ERC-7715, EIP-7702, EIP-7710, signature flows, wallet UX.
- **Neo4j** — graph model in `architecture.md`; Cypher in `lib/neo4j/repositories/`; **never expose driver to client**.
- **Browserbase / Stagehand** — session lifecycle, selectors, replays (see global **browser** skill).

## Product Modes

Treat JobClaw as having two user modes:

### 1. Web3Auth exploration mode (onboarding entry)
Allowed capabilities:
- social login via Web3Auth
- profile creation
- resume upload
- job preferences and consent
- job browsing and Venice-ranked listings
- paste official job posting URL for analysis preview (read-only until MetaMask upgrade)

Not guaranteed unless MetaMask upgrade completed:
- smart account creation
- autonomous apply
- x402 payments
- delegated onchain execution

### 2. MetaMask autonomous mode (prize-critical — after Web3Auth onboarding or direct MetaMask login)
Required capabilities:
- MetaMask connection
- `personal_sign` login verification
- Smart Accounts Kit onboarding
- ERC-7715 permission request/grant
- 7702/7710 relayer-backed execution path
- x402-gated hunt/apply calls
- live logs and tx hashes in dashboard

The **demo video must always use MetaMask autonomous mode** for hunt/apply/onchain — showing Web3Auth onboarding first is fine, but Smart Accounts Kit must be visible in the main prize flow.

## Required User Journey

When implementing user-facing flows, preserve this order unless the user requests a change:

1. Landing page explains JobClaw clearly.
2. Login page: **Web3Auth social login** as primary entry (Google/GitHub/email).
3. Onboarding collects resume and job preferences (Web3Auth session).
4. **Connect MetaMask** page — wallet connect + `personal_sign` SIWE to upgrade account.
5. Permissions page explains exactly what autonomous actions are being delegated.
6. Smart Accounts Kit + ERC-7715 flow is shown clearly.
7. After permissions, the dashboard unlocks hunt/apply/onchain panels.
8. Hunt action triggers x402-protected logic (Exa + LinkedIn discovery, or paste job URL).
9. Agent runs: Brave Search context → Browserbase page analysis → Venice personalization → form fill.
10. Live logs show Venice reasoning, Browserbase progress, and 1Shot/onchain state in real time.

## Core Architecture Principles

### Frontend
- Use Next.js App Router cleanly.
- Separate server and client components correctly.
- Keep API routes thin; long-running hunt/apply runs in `lib/jobs/` (server-only), status polled via Neo4j-backed API.
- Design UI so every prize-critical action is visible and understandable to judges.

### Authentication
- **Web3Auth is the onboarding ramp** — resume, preferences, consent. Not a substitute for Smart Accounts Kit.
- **MetaMask SDK is the hackathon prize layer** — SIWE login, Smart Accounts Kit, ERC-7715, x402.
- Do not conflate Web3Auth login with delegation grant.
- `personal_sign` login is separate from delegation grant.
- Users may also connect MetaMask directly on `/login` and skip Web3Auth.

### Neo4j (graph database — required)

- Neo4j is the **source of truth** for users, jobs, applications, agent runs, onchain logs, and relationships.
- All DB access via `lib/neo4j/` — **server-side only** (API routes, Server Actions, `lib/jobs/`). Never in client components.
- Use Cypher repositories, not raw driver calls scattered in routes.
- Append `LogEntry` nodes to `AgentRun` — never overwrite log history.
- Graph relationships power matching narrative: `(Resume)-[:HAS_SKILL]->(Skill)<-[:REQUIRES]-(JobListing)`.
- Live dashboard: client polls `/api/agent-runs/[id]` (SWR, ~2s) during active hunts — no Convex realtime.

### Files (Vercel Blob)

- Resume PDFs, personalized resumes, cover letters, apply screenshots → **Vercel Blob**.
- Neo4j stores `blobUrl` on nodes — not binary data in the graph.

### OpenClaw + Venice
- OpenClaw is a separate backend reasoning service.
- Venice is the core provider in OpenClaw and should be labeled in UI for visibility.
- Prefer `venice/kimi-k2-5` as default reasoning model, with a documented fallback like `venice/zai-org-glm-5` when needed.
- Always preserve model IDs in stored outputs when possible.

### x402 + 1Shot
- Payment-gated routes should be obvious, deterministic, and easy to demo.
- Prefer a small number of meaningful payable actions rather than many shallow ones.
- Use webhook-driven tx status updates where possible because the 1Shot hackathon guidance explicitly says webhook-based status updates score better.

### Browser automation
- **LinkedIn search and apply is in scope** (JobPilot-style) alongside Greenhouse/Lever and direct URLs.
- When user pastes an official job posting URL: Brave Search → Browserbase extract → Venice personalize → Stagehand fill.
- Always generate and store a **tailored cover letter + resume variant** before submitting the form.
- One reliable apply path beats many flaky ones — prioritize the demo job URLs that work.

## Demo-First Engineering Rules

Whenever prioritizing work, follow this order:

1. Can this be shown clearly in a 5-minute demo?
2. Does this help a required prize-track proof point?
3. Does this reduce failure risk during judging?
4. Does this improve repository quality for the second hackathon?
5. Only then optimize for broader SaaS completeness.

Build features in demo-able slices. Every phase should end in a visible checkpoint, not hidden backend plumbing only.

## Required Dashboard Surfaces

These surfaces matter because they communicate the product story:

- `/` — plain-language explanation of JobClaw and sponsor-aligned flow
- `/login` — Web3Auth primary entry + optional direct MetaMask connect
- `/onboarding` — resume + preferences + consent (Web3Auth session)
- `/onboarding/connect-wallet` — MetaMask upgrade + SIWE
- `/onboarding/permissions` — judge-visible delegation flow
- `/dashboard` — live run logs, application stats, recent matches
- `/dashboard/hunt` — x402-triggered hunt, LinkedIn/Exa discovery, or paste job URL
- `/dashboard/onchain` — tx hashes, statuses, BaseScan links
- `/dashboard/applications/[id]` — Venice reasoning, personalized resume/cover letter, screenshot, status

## Logging Standards

All agentic behavior should be inspectable. Prefer structured events with:
- timestamp
- phase
- short human-readable message
- optional tx hash
- optional browser session id
- optional application id
- optional Venice model id

Logs should be understandable by a judge in seconds.

## Documentation Standards For This Repo

When updating docs, make sure JobClaw is described consistently as:

> A decentralized autonomous job-hunting SaaS where users onboard via Web3Auth, upgrade to MetaMask Smart Accounts Kit for scoped delegation, and then an AI agent continuously searches (LinkedIn, Exa, user URLs), evaluates, personalizes resume/cover letter per job, and applies on their behalf using Venice-powered reasoning, Brave Search + browser automation, and onchain-auditable payment/execution rails.

README and demo docs must always explain:
- how AI is used
- how MetaMask permissions are used
- where 1Shot is used
- where Venice is used
- what Neo4j stores (graph + relationships) and what Vercel Blob stores (files)
- why the dual-repo split exists

## When Writing Code

Before implementing, always ask internally:
- Is this server or client code?
- Is this part of login, delegation, AI reasoning, x402, automation, or observability?
- Which source of truth owns this state?
- Does this need realtime UI?
- Does this need a durable log/event for demo evidence?
- Does the UI copy clearly explain the trust model?

## Anti-Patterns To Avoid

- Treating Web3Auth social login alone as sufficient for hackathon prize criteria (MetaMask Smart Accounts Kit required for demo).
- Skipping the MetaMask upgrade step after Web3Auth onboarding in the prize demo.
- Hiding Smart Accounts Kit integration behind generic auth abstractions.
- Polling blindly when webhook/event-driven state is available.
- Running long automation directly in request/response routes.
- Mixing browser automation ownership into OpenClaw.
- Making the dashboard look like a generic admin panel with no judge-story cues.
- Adding unsupported claims like “fully autonomous for everyone” before embedded-wallet delegation is proven.
- Using **Convex** — replaced by **Neo4j** (required).
- Using outdated Next.js patterns without checking installed docs first.

## Recovery Triggers

Run `/recover` immediately if:
- wallet connection works but signature verification keeps failing after one fix
- smart account / delegation flow breaks after one attempted correction
- x402 flow loops between 402 and retry unexpectedly
- Neo4j Cypher/schema drift causes repeated query mismatches
- Browserbase flow becomes unstable after one selector correction
- OpenClaw/Venice integration fails after one configuration correction

## Definition of Done For Hackathon Features

A feature is only done when all are true:
- Code works in the local/dev environment.
- It supports the JobClaw narrative rather than weakening it.
- UI copy is understandable to a judge.
- Realtime or durable logs exist when relevant.
- `context/progress-tracker.md` and `context/ui-registry.md` are updated.
- The feature is consistent with current Next.js docs and project architecture.

## Final Operating Principle

Build JobClaw like a **trustworthy autonomous worker**:
- explicit user consent
- scoped delegated power
- visible reasoning
- visible transactions
- visible browser execution
- clean rollback/fallback behavior

If a feature makes the system look smarter but less trustworthy, it is the wrong feature.
