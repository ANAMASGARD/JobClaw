# Code Standards

> **Purpose:** How to write JobClaw code — TypeScript, Next.js 16, Convex, API routes, automation, logging.  
> **Read when:** Every implementation session, before writing or reviewing code.  
> **Schema & flows:** `architecture.md` · **Per-library API:** `library-docs.md` · **Glossary:** `context/README.md`

Implementation rules for JobClaw. Follow in every session without exception.

---

## Engineering Mindset

- **Demo-first** — every feature must be showable to judges
- **Read context files first** — never assume InsForge/JobPilot patterns still apply
- **Web3Auth first, MetaMask second** — onboard users with Web3Auth (social login, resume, preferences); then prompt MetaMask connect + Smart Accounts Kit for hackathon onchain features
- **MetaMask path is prize-critical** — demo video must show MetaMask SDK + Smart Accounts Kit; Web3Auth is the onboarding ramp, not a substitute for delegation
- **LinkedIn + official URLs allowed** — job search via LinkedIn/Exa and apply via Browserbase (JobPilot-style) is in scope
- **Personalize before apply** — Venice tailors resume + cover letter per job before Stagehand fills the form
- **Convex owns state** — thin API routes, fat Convex actions
- **Failures are logged** — append to `agentRuns.logs`, never crash silently

---

## TypeScript

- Strict mode — no `any`; use `unknown` and narrow
- Explicit function parameter and return types
- Use `type` for object shapes; `interface` for extendable component props
- All async functions have error handling

---

## Next.js 16 Conventions

- App Router only
- Server Components by default
- `"use client"` only when needed: hooks, browser APIs, wagmi, Web3Auth, Convex `useQuery`
- Route handlers in `app/api/` — thin wrappers only
- Long-running work in **Convex actions**, not API routes
- Read `node_modules/next/dist/docs/` before implementing Next.js features

---

## File and Folder Naming

- Folders: kebab-case
- Components: PascalCase (`LiveLogDrawer.tsx`)
- Utilities: camelCase (`exa-search.ts`)
- Convex files: camelCase (`jobHunt.ts`)
- API routes: always `route.ts`
- One component per file; named exports only

---

## Component Structure

```typescript
"use client"; // only if needed

import { Button } from "@/components/retroui/Button";

type Props = {
  runId: string;
};

export function LiveLogDrawer({ runId }: Props) {
  // hooks, handlers, return JSX
}
```

- Use **RetroUI** components for new UI (`@/components/retroui/*`)
- No inline styles — Tailwind + CSS variables from `ui-tokens.md`
- No hardcoded hex values

---

## Auth Flow

```
Web3Auth social login → resume + preferences (/onboarding)
     → MetaMask connect + SIWE (/onboarding/connect-wallet)
     → Smart Accounts Kit + ERC-7715 (/onboarding/permissions)
     → full autonomous features
```

- Web3Auth session is valid for onboarding and browsing
- x402 hunt/apply requires linked MetaMask wallet + active delegation
- Never skip MetaMask upgrade in the prize demo after showing Web3Auth onboarding

---

## API Route Handlers

```typescript
// app/api/jobs/hunt/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // verify session
    // check x402 payment header OR return 402
    // schedule Convex action — do not run hunt inline
    return NextResponse.json({ success: true, runId });
  } catch (error) {
    console.error("[jobs/hunt]", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
```

- Every route has try/catch
- Log prefix: `[route/path]`
- Return `{ success: boolean, data?: T, error?: string }`
- Max duration 5 min on Hobby — never run Browserbase in route handler

---

## Convex Patterns

```typescript
// convex/applications.ts
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const listByUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthenticatedUserId(ctx);
    return await ctx.db
      .query("applications")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
  },
});
```

- **Queries** — reads, realtime UI (`useQuery`)
- **Mutations** — writes, user-triggered
- **Actions** — external API calls (OpenClaw, Exa, Browserbase, 1Shot)
- **Crons** — daily status checks (prefer Convex crons over Vercel cron on Hobby)
- Always authenticate and scope to user
- Append agent logs — never overwrite log arrays

---

## Automation Code

```typescript
// lib/automation/apply-pipeline.ts
export async function applyToJob(/* ... */): Promise<ApplyResult> {
  try {
    // 1. Brave Search — company + role context (optional enrichment)
    // 2. Browserbase + Stagehand — open job URL, extract posting
    // 3. Venice via OpenClaw — match score + personalized resume + cover letter
    // 4. Stagehand — fill form with tailored content, upload resume PDF
    return { success: true, screenshotStorageId, coverLetterStorageId };
  } catch (error) {
    return { success: false, error: String(error) };
  } finally {
    await stagehand.close();
  }
}
```

- Every automation function returns `{ success: boolean, error?: string }`
- Always close Browserbase sessions in `finally`
- Venice as LLM for Stagehand and personalization — not OpenAI
- **Brave Search** runs before or alongside Browserbase when analyzing a user-supplied URL
- **LinkedIn, Greenhouse, Lever, and direct company career URLs** are all valid apply targets
- Store personalized resume + cover letter in Convex file storage before form fill
- Never import from `components/` or `app/`

---

## Onchain / x402

- x402 middleware returns proper 402 + `Payment-Required` header
- Never log private keys, session secrets, or full payment headers
- Every settled payment writes to `x402Payments` AND `onchainLogs`
- Prefer 1Shot webhook for tx status over polling

---

## Agent Run Logging

Append structured log entries:

```typescript
{
  timestamp: Date.now(),
  phase: "venice_rank" | "exa_search" | "brave_search" | "url_analyze" | "personalize" | "x402_payment" | "browserbase_apply" | ...,
  message: string,
  level?: "info" | "success" | "warning" | "error",
  txHash?: string,
  veniceModel?: string,
}
```

Judges must understand logs in seconds.

---

## Environment Variables

Never hardcode secrets. Key variables — see `architecture.md` for full list.

| Variable | Context |
|----------|---------|
| `NEXT_PUBLIC_CONVEX_URL` | Client + server |
| `NEXT_PUBLIC_WEB3AUTH_CLIENT_ID` | Web3Auth modal |
| `SESSION_SECRET` | Cookie signing |
| `VENICE_API_KEY` | Stagehand + Venice API |
| `BRAVE_SEARCH_API_KEY` | Job/company context when user pastes a URL |
| `OPENCLAW_BASE_URL` | Agent backend |
| `ONESHOT_API_KEY` | Relayer + x402 |

`NEXT_PUBLIC_` prefix = browser-safe only.

---

## Import Aliases

Always use `@/` — never deep relative imports.

---

## Comments

- Self-explanatory code preferred
- Comments only for non-obvious onchain/delegation logic
- No TODO comments in committed code

---

## Approved Dependencies

Add new packages only with reason. Current/planned:

- `convex` — database + actions
- `@web3auth/modal`, `@web3auth/base` — Web2 login
- `wagmi`, `viem`, `@tanstack/react-query` — MetaMask
- `@metamask/smart-accounts-kit` — ERC-7715 / smart accounts
- `@browserbasehq/stagehand`, `@browserbasehq/sdk` — browser automation (LinkedIn, Greenhouse, direct URLs)
- `exa-js` — job discovery search
- Brave Search API (REST via `fetch`) — enrich user-pasted job URLs with company/role context
- `jose` — JWT verification
- `zod` — validation
- RetroUI components via shadcn registry (`@retroui/*`)

**Do not add:** `@insforge/ssr`, `posthog-js`, `openai` (as primary), `pdf-parse`, `@react-pdf/renderer`, Adzuna client.

---

## Match Threshold

```typescript
// lib/utils.ts
export const MATCH_THRESHOLD = 70;
```

Import everywhere — never hardcode `70`.
