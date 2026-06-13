# JobClaw Context — Master Index for AI Agents

> **Start here** after `AGENTS.md`. This folder is the long-term memory for every LLM session on JobClaw.

---

## 30-Second Orientation

| Fact | Value |
|------|-------|
| **Project** | JobClaw — autonomous job-hunting agent |
| **Hackathon** | MetaMask Smart Accounts Kit × 1Shot API × Venice AI Dev Cook Off |
| **Deadline** | June 15, 2026 |
| **This repo** | `jobclaw` — Next.js **website** (Neo4j-backed pages), **Agentic RAG API**, Vercel Blob, Browserbase, x402, auth |
| **Other repo** | `jobclaw-openclaw` — OpenClaw + Venice + **agentic RAG tool loop** (calls jobclaw `/api/rag/*`) |
| **Demo path** | Web3Auth onboard → MetaMask upgrade → ERC-7715 → x402 hunt → Venice + Browserbase apply |
| **Implementation** | Phase 0 not started — only RetroUI theme scaffold exists |

---

## Read Order (Every New Session)

```
1. AGENTS.md                          → operating manual, rules, anti-patterns
2. context/README.md                  → this file — map + glossary + routing
3. context/progress-tracker.md        → what is done vs next (always check first)
4. [task-specific files below]        → only what your task needs
```

**Do not read all 9 files every time.** Use the task router below.

---

## Document Map

| File | Single responsibility | Read when |
|------|----------------------|-----------|
| `AGENTS.md` | How agents must behave — prize tracks, journey, skills, MCP, definition of done | Every session |
| `project-overview.md` | **What** we build — product, pages, user modes, demo script, scope | New to project, UI copy, demo prep |
| `architecture.md` | **How** systems connect — stack, flows, **Neo4j graph model**, env vars | Backend, auth, Neo4j, integrations |
| `code-standards.md` | **How** to write code — TypeScript, Neo4j, API routes, SWR polling | Writing any code |
| `library-docs.md` | **How** to use each third-party library | Before touching Neo4j, Web3Auth, MetaMask, etc. |
| `build-plan.md` | **What order** to build — 5 phases, 18 features | Planning, prioritizing, sprint scope |
| `progress-tracker.md` | **What status** — checkboxes, decisions log, prize checklist | Start/end of every feature |
| `ui-tokens.md` | **Colors/fonts** — CSS variables, Tailwind classes | Any styling |
| `ui-rules.md` | **UI patterns** — RetroUI brutalist rules, layout, components | Building pages/components |
| `ui-registry.md` | **UI inventory** — installed RetroUI components, page build status | Before/after building UI |

---

## Task Router — If You Are Doing X, Read Y

| Task | Read (in order) |
|------|-----------------|
| **Any implementation** | `progress-tracker.md` → `code-standards.md` |
| **Auth / Web3Auth / MetaMask** | `architecture.md` (Auth) → `library-docs.md` (Web3Auth, MetaMask) → skill: `web3auth` |
| **Neo4j / graph / Cypher** | `architecture.md` (Neo4j for Website, Graph Model) → `library-docs.md` (Neo4j) → Context7 |
| **x402 / 1Shot / onchain** | `architecture.md` (Onchain) → `library-docs.md` (x402, 1Shot) |
| **OpenClaw / Venice AI** | `architecture.md` (Agentic RAG, Dual-repo) → `library-docs.md` (OpenClaw, RAG) |
| **Agentic RAG / graph retrieval** | `architecture.md` (Agentic RAG) → `library-docs.md` (RAG API) → implement `lib/rag/` + `/api/rag/*` |
| **Browser automation / apply** | `architecture.md` (Agent Pipeline) → `library-docs.md` (Browserbase, LinkedIn, Brave) → skill: `browser` |
| **New page or component** | `ui-rules.md` → `ui-tokens.md` → `ui-registry.md` → `project-overview.md` (pages) |
| **Deploy to Vercel** | `architecture.md` (Deployment) → skill: `deploy-to-vercel` → MCP: Vercel |
| **Library API unknown** | MCP: **Context7** → `library-docs.md` → installed skill |
| **Complex feature planning** | skill: `.agents/skills/architect` → `build-plan.md` |
| **Demo / hackathon submission** | `project-overview.md` (Demo Script) → `progress-tracker.md` (Prize checklist) |

---

## Glossary (JobClaw Vocabulary)

Use these terms consistently across all docs and code.

| Term | Meaning |
|------|---------|
| **Web3Auth onboarding mode** | User logged in via social (Google/GitHub/email). Can upload resume and set preferences. Cannot hunt/apply/onchain until MetaMask upgrade. |
| **MetaMask autonomous mode** | User linked MetaMask + granted ERC-7715 delegation. Full hunt, apply, x402, onchain features unlocked. **Required for demo video hunt/apply.** |
| **Upgrade path** | Web3Auth user → `/onboarding/connect-wallet` → SIWE → `/onboarding/permissions` → MetaMask autonomous mode |
| **Hunt** | x402-gated batch job discovery (Exa + LinkedIn) + rank + apply (max 3 per run) |
| **Analyze URL** | x402-gated single job from user-pasted official posting URL |
| **Personalize** | Venice generates tailored cover letter + resume variant **before** form submit |
| **Delegation** | ERC-7715 grant stored as Neo4j `Delegation` node |
| **7702 upgrade** | EIP-7702 EOA → smart account via 1Shot relayer |
| **7710 execution** | Delegated transaction execution via 1Shot relayer (x402 payments) |
| **LogEntry** | Append-only log nodes linked to `AgentRun` — primary demo evidence |
| **MATCH_THRESHOLD** | `70` — minimum Venice match score to auto-apply (`lib/utils.ts`) |
| **Thin route** | API route: auth/x402 → create AgentRun in Neo4j → kick `lib/jobs/` |
| **OpenClaw** | Separate repo — Venice reasoning sandbox. Calls jobclaw **Agentic RAG API** (`/api/rag/*`). Never runs Browserbase. |
| **Agentic RAG** | Venice **chooses** which Neo4j graph queries to run (profile, skills, match, history) via RAG tools — not a fixed pipeline |
| **RAG API** | `jobclaw` `/api/rag/*` endpoints — Cypher on Neo4j, auth via `RAG_API_SECRET`, consumed by OpenClaw tools |
| **Stagehand** | Browser automation on Browserbase. Uses Venice as LLM. |

---

## Authority Order (When Sources Conflict)

```
1. User's explicit instruction in current chat
2. AGENTS.md
3. context/README.md (this file)
4. Task-specific context file (architecture, code-standards, etc.)
5. Installed skill (.agents/skills/ or ~/.agents/skills/)
6. Context7 MCP (Neo4j driver, library docs)
7. Vercel MCP (platform/deploy, Blob)
8. node_modules/next/dist/docs/ (Next.js 16)
9. Training data (lowest)
```

---

## Skills & MCP (Summary)

Full inventory: `architecture.md` → **Agent Tooling — Skills & MCP**.

| Type | Required for JobClaw |
|------|---------------------|
| **Repo skills** | `.agents/skills/architect`, `review`, `recover`, `imprint`, `remember` |
| **Global skills** | `~/.agents/skills/web3auth`, `deploy-to-vercel`, `browser`, `systematic-debugging` |
| **Vercel plugin skills** | `~/.claude/plugins/.../vercel/0.42.1/skills/nextjs`, `vercel-functions`, `env-vars` |
| **MCP: Context7** | Neo4j driver, Web3Auth, MetaMask, Stagehand, x402, Venice docs |
| **MCP: Vercel** | Deploy, build logs, Vercel Blob |
| **MCP: Cursor IDE Browser** | Manual demo testing only — **not** production apply |

CLI: `npx vercel` for deploy (not globally on PATH — use npx).

---

## What NOT To Use (Obsolete Stack)

These appeared in old JobPilot/InsForge docs. **Never implement:**

InsForge, **Convex**, Adzuna, PostHog, Clerk, Neon, `@react-pdf/renderer`, OpenAI GPT-4o as primary LLM.

---

## After Every Feature

1. Update `progress-tracker.md` checkboxes
2. Update `ui-registry.md` if UI was added/changed
3. Add decisions to `progress-tracker.md` decisions table if architectural choice was made

---

## File Size Guide (Token Budget)

| Priority | Files | Approx. role |
|----------|-------|--------------|
| Always | `AGENTS.md`, `README.md`, `progress-tracker.md` | Orientation + status |
| Usually | `code-standards.md` + task-specific one | Implementation |
| Deep dive | `architecture.md`, `library-docs.md` | Reference when needed |
| UI only | `ui-tokens.md`, `ui-rules.md`, `ui-registry.md` | UI tasks only |

**Prefer cross-references over duplicating content.** If two files say the same thing, the canonical copy wins per Document Map above.
