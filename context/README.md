# JobClaw Context — Master Index for AI Agents

> **Start here** after `AGENTS.md`. This folder is the long-term memory for every LLM session on JobClaw.

---

## 30-Second Orientation

| Fact | Value |
|------|-------|
| **Project** | JobClaw — autonomous job-hunting agent |
| **Hackathon** | MetaMask Smart Accounts Kit × 1Shot API × Venice AI Dev Cook Off |
| **Deadline** | June 15, 2026 |
| **This repo** | `jobclaw` — Next.js UI, Convex, Browserbase, x402, auth |
| **Other repo** | `jobclaw-openclaw` — OpenClaw + Venice reasoning only |
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
| `architecture.md` | **How** systems connect — stack, flows, schema, env vars, skills/MCP inventory | Backend, auth, Convex, integrations |
| `code-standards.md` | **How** to write code — TypeScript, Convex, API routes, logging patterns | Writing any code |
| `library-docs.md` | **How** to use each third-party library in JobClaw | Before touching Convex, Web3Auth, MetaMask, x402, Venice, Browserbase, Exa, Brave |
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
| **Convex / schema / actions** | MCP: **Convex** (`user-convex`) → `architecture.md` → `library-docs.md` → Context7 |
| **x402 / 1Shot / onchain** | `architecture.md` (Onchain) → `library-docs.md` (x402, 1Shot) |
| **OpenClaw / Venice AI** | `architecture.md` (Dual-repo, OpenClaw) → `library-docs.md` (OpenClaw, Venice) |
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
| **Delegation** | ERC-7715 Advanced Permissions grant stored in Convex `delegations` |
| **7702 upgrade** | EIP-7702 EOA → smart account via 1Shot relayer |
| **7710 execution** | Delegated transaction execution via 1Shot relayer (x402 payments) |
| **agentRuns.logs** | Append-only structured log array — primary demo evidence for Best Agent track |
| **MATCH_THRESHOLD** | `70` — minimum Venice match score to auto-apply (`lib/utils.ts`) |
| **Thin route** | Next.js API route that only verifies auth/x402 and schedules Convex action |
| **OpenClaw** | Separate repo — Venice reasoning sandbox. Never runs Browserbase. |
| **Stagehand** | Browser automation library on Browserbase. Uses Venice as LLM. |

---

## Authority Order (When Sources Conflict)

```
1. User's explicit instruction in current chat
2. AGENTS.md
3. context/README.md (this file)
4. Task-specific context file (architecture, code-standards, etc.)
5. Installed skill (.agents/skills/ or ~/.agents/skills/)
6. **Convex MCP** (`user-convex`) — live schema, functions, logs (Convex work only)
7. Context7 MCP (live library docs)
8. Vercel MCP (platform/deploy docs)
9. node_modules/next/dist/docs/ (Next.js 16 — NOT your training data)
10. Training data (lowest — likely outdated for this stack)
```

---

## Skills & MCP (Summary)

Full inventory: `architecture.md` → **Agent Tooling — Skills & MCP**.

| Type | Required for JobClaw |
|------|---------------------|
| **Repo skills** | `.agents/skills/architect`, `review`, `recover`, `imprint`, `remember` |
| **Global skills** | `~/.agents/skills/web3auth`, `deploy-to-vercel`, `browser`, `systematic-debugging` |
| **Vercel plugin skills** | `~/.claude/plugins/.../vercel/0.42.1/skills/nextjs`, `vercel-functions`, `env-vars` |
| **MCP: Convex** | Live schema, function specs, run queries, action logs, env vars |
| **MCP: Context7** | Library API docs (including Convex patterns) |
| **MCP: Vercel** | Deploy, build logs, platform docs |
| **MCP: Cursor IDE Browser** | Manual demo testing only — **not** production apply |

CLI: `npx vercel` for deploy (not globally on PATH — use npx).

---

## What NOT To Use (Obsolete Stack)

These appeared in old JobPilot/InsForge docs. **Never implement:**

InsForge, Adzuna, PostHog, Clerk, Neon, `@react-pdf/renderer`, OpenAI GPT-4o as primary LLM.

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
