# Library Docs

> **Purpose:** Project-specific patterns for each third-party library — not generic tutorials.  
> **Read when:** Before implementing Convex, Web3Auth, MetaMask, 1Shot, x402, OpenClaw, Venice, Exa, Brave, Browserbase, RetroUI.  
> **System design:** `architecture.md` · **Code style:** `code-standards.md`  
> **Live Convex deployment:** Convex MCP (`user-convex`) first — then Context7 for API docs, then this file.

Project-specific usage patterns for JobClaw. **Do not use InsForge, Adzuna, PostHog, or OpenAI-as-primary patterns from old docs.**

Authority order:

```
AGENTS.md → context/README.md → installed skill → Convex MCP (live deployment) → Context7 MCP (API docs) → this file → training data
```

## Quick index

| Section | Library | Skill / MCP |
|---------|---------|-------------|
| [Convex](#convex) | Database, actions, files | **Convex MCP** (`user-convex`), then Context7 |
| [Web3Auth](#web3auth-metaMask-embedded-wallets) | Social onboarding | `~/.agents/skills/web3auth` |
| [MetaMask](#metamask--wagmi--smart-accounts-kit) | SIWE, ERC-7715 | Context7 + MetaMask Kit docs |
| [1Shot](#1shot-permissionless-relayer) | 7702, 7710 relay | 1Shot hackathon docs |
| [x402](#x402) | Payment-gated routes | x402.org, 1shot-x402 |
| [OpenClaw](#openclaw-separate-repo) | Venice reasoning | `vclaw` docs |
| [Venice AI](#venice-ai) | LLM | Venice API |
| [Exa](#exa) | Job discovery | Context7 |
| [Brave Search](#brave-search-api) | URL enrichment | Brave API docs |
| [LinkedIn](#linkedin-browserbase--stagehand) | Board search/apply | skill: `browser` |
| [Browserbase](#browserbase--stagehand) | Form fill, apply | Context7, skill: `browser` |
| [RetroUI](#retroui) | UI components | `ui-tokens.md`, `ui-rules.md` |

---

## Convex

**Check first:** **Convex MCP** (`user-convex`) for live deployment — then Context7 / convex.dev for API patterns

### MCP workflow (installed locally)

Before editing or after implementing Convex code:

1. `status` — get `deploymentSelector` for this repo
2. `tables` — verify schema matches `convex/schema.ts`
3. `functionSpec` — confirm exported queries/mutations/actions and arg shapes
4. `run` — test a handler with sample args
5. `logs` (status: `"failure"`) — debug failed actions

See `architecture.md` → **Convex MCP workflow** for full tool list.

### Setup

```typescript
// app/layout.tsx
import { ConvexProvider, ConvexReactClient } from "convex/react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
```

### Queries (realtime UI)

```typescript
"use client";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

const applications = useQuery(api.applications.listByUser);
const activeRun = useQuery(api.agentRuns.getActive, { userId });
```

### Mutations

```typescript
import { useMutation } from "convex/react";

const upsertProfile = useMutation(api.jobProfiles.upsert);
await upsertProfile({ titles: ["Frontend Engineer"], locations: ["Remote"] });
```

### Actions (external APIs)

Use for OpenClaw, Exa, Browserbase, 1Shot — anything long-running or external:

```typescript
// convex/actions/jobHunt.ts
"use node";

import { action } from "../_generated/server";

export const run = action({
  args: { userId: v.id("users"), maxApplications: v.number() },
  handler: async (ctx, args) => {
    // call lib/openclaw, lib/automation — via fetch or imported helpers
    // append logs via ctx.runMutation
  },
});
```

### File storage

```typescript
const storageId = await ctx.storage.store(blob);
const url = await ctx.storage.getUrl(storageId);
```

**Rules:**
- Never run Browserbase inside a mutation — use actions
- Append to `agentRuns.logs` — do not replace
- Always index by `userId`
- Prefer Convex crons over Vercel cron (Hobby = once/day limit)

---

## Web3Auth (MetaMask Embedded Wallets)

**Check first:** Web3Auth skill + MetaMask Embedded Wallets docs

### Web2 login

```typescript
// lib/web3auth/provider.tsx
import { Web3AuthProvider } from "@web3auth/modal/react";
```

- Dashboard client id: `NEXT_PUBLIC_WEB3AUTH_CLIENT_ID`
- Social logins: Google, GitHub
- On success: verify idToken server-side with `jose`
- Upsert Convex user with `authMethod: "web3auth"`

**Rules:**
- Web3Auth is the **primary onboarding entry** — resume, preferences, consent
- After onboarding, prompt MetaMask connect on `/onboarding/connect-wallet`
- Web3Auth is **not** a substitute for Smart Accounts Kit / ERC-7715
- MetaMask can also be selected directly on `/login` — treat as MetaMask path

---

## MetaMask + wagmi + Smart Accounts Kit

**Check first:** MetaMask Smart Accounts Kit docs, Web3Auth skill for connector patterns

### SIWE login

```typescript
// lib/metamask/siwe.ts
const message = `JobClaw wants you to sign in\nNonce: ${nonce}\nIssued: ${new Date().toISOString()}`;
const signature = await signMessageAsync({ message });
// POST /api/auth/verify with address + signature + message
```

### Smart account + ERC-7715

```typescript
// lib/metamask/smartAccount.ts + permissions.ts
import { toMetaMaskSmartAccount } from "@metamask/smart-accounts-kit";
// Request Advanced Permissions (ERC-7715) during /onboarding/permissions
// Store grant in Convex delegations table
```

**Rules:**
- Demo video must show ERC-7715 prompt clearly
- Separate login (`personal_sign`) from delegation grant
- Never store seed phrases or private keys

---

## 1Shot Permissionless Relayer

**Check first:** 1Shot hackathon docs, gas sponsorship quickstart

### EIP-7702 upgrade

- Upgrade EOA to smart account through 1Shot relayer
- **Mainnet required for 1Shot relayer prize** in final demo video
- Base Sepolia OK for dev

### EIP-7710 execution

- Relay delegated transactions with stablecoin gas (USDC)
- Prefer **webhook** for tx status → `app/api/webhooks/1shot/route.ts`
- Write every tx to `onchainLogs` with explorer URL

**Rules:**
- No signup paymaster infra — use permissionless relayer
- Log relayer responses for judge evidence

---

## x402

**Check first:** [x402.org](https://www.x402.org), [1shot-x402](https://github.com/1Shot-API/1shot-x402)

### Flow

1. Client `POST /api/jobs/hunt` without payment → **402** + payment requirements
2. Client/delegate signs EIP-3009 authorization
3. Retry with `X-PAYMENT` header
4. 1Shot facilitator verifies + settles
5. Route proceeds → Convex action

### Priced actions (hackathon MVP)

| Route | Price |
|-------|-------|
| `POST /api/jobs/hunt` | $0.05 USDC |
| `POST /api/jobs/analyze-url` | $0.05 USDC |
| `POST /api/jobs/apply/[listingId]` | $0.10 USDC |

**Rules:**
- Must pair with ERC-7710 delegated smart account for prize track
- Log every settlement to Convex

---

## OpenClaw (separate repo)

**Check first:** vercel-openclaw docs, Venice OpenClaw provider docs

### Client (jobclaw repo)

```typescript
// lib/openclaw/client.ts
export async function ensureRunning() {
  await fetch(`${OPENCLAW_BASE_URL}/api/status`, {
    method: "POST",
    headers: { Authorization: `Bearer ${OPENCLAW_ADMIN_SECRET}` },
  });
}

export async function rankJobs(resume: string, listings: JobListing[]) {
  await ensureRunning();
  // Gateway chat completions — Venice configured in sandbox
}
```

### Venice in sandbox (jobclaw-openclaw repo)

```bash
openclaw onboard --non-interactive --auth-choice venice-api-key --venice-api-key "$VENICE_API_KEY"
openclaw models set venice/kimi-k2-5
```

- Allowlist `api.venice.ai` in sandbox egress firewall
- Pre-warm before demo

**Rules:**
- Never run Browserbase inside OpenClaw
- Store `veniceModel` on ranked results
- Label Venice in UI for judges

---

## Venice AI

**API:** `https://api.venice.ai/api/v1` (OpenAI-compatible)

### In OpenClaw

Default: `venice/kimi-k2-5` (reasoning)
Fallback: `venice/zai-org-glm-5`

### In Stagehand (jobclaw)

```typescript
model: {
  modelName: "openai/kimi-k2-5",
  apiKey: process.env.VENICE_API_KEY!,
  baseURL: "https://api.venice.ai/api/v1",
}
```

**Rules:**
- Venice must be in **main demo flow** for Venice prize
- Include model id in stored outputs

---

## Exa

**Check first:** exa-js docs, Browserbase exa-browserbase template

```typescript
import Exa from "exa-js";
const exa = new Exa(process.env.EXA_API_KEY);

const results = await exa.search("AI startups hiring frontend engineers careers page", {
  numResults: 10,
  type: "auto",
});
```

**Rules:**
- Use for company + careers page discovery — not Adzuna
- Save raw URLs to `jobListings` with `source: "exa"`
- Combine with LinkedIn Browserbase search for broader discovery

---

## Brave Search API

**Check first:** [Brave Search API docs](https://api.search.brave.com/app/documentation/web-search/get-started)

```typescript
// lib/automation/brave-search.ts
const res = await fetch(
  `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}&count=5`,
  { headers: { "X-Subscription-Token": process.env.BRAVE_SEARCH_API_KEY! } }
);
const data = await res.json();
// data.web.results — title, url, description snippets
```

**When to use:**
- User pastes an official job posting URL → search company name + role for extra context
- Before Venice personalization — enrich match reason and cover letter
- Store summarized context on `jobListings.braveContext`

**Rules:**
- API key: `BRAVE_SEARCH_API_KEY` — server-side only
- Run in Convex actions — never expose key to client
- Combine with Browserbase page extract — Brave gives web context, Browserbase gives page truth

---

## LinkedIn (Browserbase + Stagehand)

**Check first:** Browserbase skill, Stagehand docs

```typescript
// lib/automation/linkedin-search.ts
await stagehand.act({ action: "Search LinkedIn jobs for Frontend Engineer in Remote" });
const listings = await stagehand.extract({ instruction: "Extract job title, company, URL for each result" });
```

**Rules:**
- LinkedIn search and apply is **in scope** (JobPilot-style)
- Run in Convex actions only
- Throttle requests; wrap in try/catch with backoff
- Save listings with `source: "linkedin"`
- Personalize resume + cover letter before apply (see apply pipeline below)

---

## Browserbase + Stagehand

**Check first:** Browserbase skill, Stagehand docs

### Session

```typescript
import Browserbase from "@browserbasehq/sdk";
const bb = new Browserbase({ apiKey: process.env.BROWSERBASE_API_KEY! });
const session = await bb.sessions.create({
  projectId: process.env.BROWSERBASE_PROJECT_ID!,
  timeout: 300,
});
```

### Apply pipeline (all boards)

1. **Discover or receive URL** — Exa, LinkedIn search, or user paste
2. **Brave Search** (if user URL or enrichment needed) — company/role web context
3. **Browserbase extract** — open posting URL, extract requirements and form fields
4. **Venice personalize** — tailored resume variant + cover letter for this job
5. **Stagehand apply** — fill form, upload personalized resume, submit
6. **Store artifacts** — cover letter, resume PDF, screenshot in Convex storage

```typescript
await stagehand.act({ action: "Fill the cover letter field with: " + coverLetter });
await stagehand.act({ action: "Upload the resume PDF" });
```

**Rules:**
- Run in Convex **actions** only
- Always `stagehand.close()` in `finally`
- Max 3 applies per hunt (demo)
- **LinkedIn, Greenhouse, Lever, and direct URLs** are all valid targets
- Always personalize before apply — never submit generic resume
- Wrap every `act()` / `extract()` in try/catch

---

## RetroUI

Components live in `components/retroui/`. Install more via:

```bash
npx shadcn@latest add -y @retroui/button
```

Registry in `components.json`:

```json
"@retroui": "https://retroui.dev/r/{name}.json"
```

**Rules:**
- Use RetroUI for all new hackathon UI
- Theme tokens in `app/globals.css` — yellow primary, black borders, zero radius
- Fonts: Archivo Black (headings), Space Grotesk (body) — see `ui-tokens.md`

---

## Removed Libraries (Do Not Implement)

The following are **obsolete** for JobClaw — do not add patterns from old context:

| Removed | Replaced by |
|---------|-------------|
| InsForge | Convex |
| Adzuna | Exa + LinkedIn (Browserbase) + Brave Search |
| PostHog | Convex logs + onchainLogs (demo evidence) |
| OpenAI GPT-4o (primary) | Venice AI |
| @react-pdf/renderer | Convex file storage (upload resume PDF) |
| InsForge Auth | Web3Auth + MetaMask SIWE |
