# Code Standards

> **Purpose:** How to write JobClaw code — TypeScript, Next.js 16, **Neo4j**, API routes, logging.  
> **Read when:** Every implementation session, before writing or reviewing code.  
> **Graph model:** `architecture.md` · **Per-library API:** `library-docs.md` · **Glossary:** `context/README.md`

Implementation rules for JobClaw. Follow in every session without exception.

---

## Engineering Mindset

- **Demo-first** — every feature must be showable to judges
- **Neo4j is required** — graph database for all state; **never use Convex**
- **Web3Auth first, MetaMask second** — onboard with social login; upgrade for onchain features
- **MetaMask path is prize-critical** — demo must show Smart Accounts Kit
- **LinkedIn + official URLs allowed** — Browserbase apply is in scope
- **Personalize before apply** — Venice tailors resume + cover letter per job
- **Neo4j owns graph state** — powers **every website page** + agent data; Vercel Blob owns files; thin API routes; fat `lib/jobs/`
- **Agentic RAG** — OpenClaw retrieves via `/api/rag/*`; implement queries in `lib/rag/`, never expose driver to OpenClaw
- **Failures are logged** — append `LogEntry` nodes, never crash silently

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
- `"use client"` only when needed: hooks, browser APIs, wagmi, Web3Auth, SWR polling
- Route handlers in `app/api/` — thin wrappers only
- Long-running work in **`lib/jobs/`**, not inline in route handlers
- **Never import `lib/neo4j/` in client components**
- Read `node_modules/next/dist/docs/` before implementing Next.js features

---

## File and Folder Naming

- Folders: kebab-case
- Components: PascalCase (`LiveLogDrawer.tsx`)
- Utilities: camelCase (`exa-search.ts`)
- Neo4j repositories: camelCase (`agentRuns.ts`) in `lib/neo4j/repositories/`
- Job pipelines: camelCase (`jobHunt.ts`) in `lib/jobs/`
- API routes: always `route.ts`
- One component per file; named exports only

---

## Neo4j Patterns

```typescript
// lib/neo4j/repositories/users.ts
import { withSession } from "../client";

export async function upsertFromWeb3Auth(input: Web3AuthUserInput) {
  return withSession(async (session) => {
    await session.run(`
      MERGE (u:User {web3authSub: $web3authSub})
      ON CREATE SET u.id = randomUUID(), u.createdAt = timestamp()
      SET u.email = $email, u.authMethod = 'web3auth', u.onboardingStep = 'resume'
      RETURN u
    `, input);
  });
}
```

- **Repositories** — all Cypher in `lib/neo4j/repositories/`
- **Sessions** — always close via `withSession` helper
- **Scope** — every query starts with `MATCH (u:User {id: $userId})`
- **Logs** — CREATE new `LogEntry` nodes; never UPDATE log arrays
- **IDs** — use `randomUUID()` for node ids

---

## Live UI (SWR polling)

```typescript
"use client";
import useSWR from "swr";

const { data: run } = useSWR(
  runId ? `/api/agent-runs/${runId}` : null,
  fetcher,
  { refreshInterval: runId ? 2000 : 0 }
);
```

- Poll agent runs during active hunts (~2s)
- No Neo4j driver on client — API routes only

---

## API Route Handlers

```typescript
// app/api/jobs/hunt/route.ts
export async function POST(req: NextRequest) {
  try {
    // verify session → get userId
    // check x402 OR return 402
    // CREATE AgentRun in Neo4j
    // void jobHunt({ runId, userId }) — do not await full pipeline
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
- Never run Browserbase inline in route handler

---

## Automation / Jobs

```typescript
// lib/jobs/jobHunt.ts
export async function jobHunt(params: JobHuntParams) {
  try {
    await agentRunsRepo.appendLog(params.runId, { phase: "exa_search", message: "..." });
    // ... pipeline
  } catch (error) {
    await agentRunsRepo.appendLog(params.runId, { phase: "error", level: "error", message: String(error) });
  }
}
```

- Called from API routes asynchronously
- Venice as LLM — not OpenAI
- Store file URLs on Neo4j nodes after Vercel Blob upload

---

## Onchain / x402

- Every settled payment → `X402Payment` + `OnchainLog` nodes in Neo4j
- Prefer 1Shot webhook for tx status

---

## Agent Run Logging

```typescript
{
  timestamp: Date.now(),
  phase: "venice_rank" | "exa_search" | "brave_search" | "personalize" | "x402_payment" | "browserbase_apply" | ...,
  message: string,
  level?: "info" | "success" | "warning" | "error",
  txHash?: string,
  veniceModel?: string,
}
```

Stored as `LogEntry` nodes linked to `AgentRun`.

---

## Environment Variables

| Variable | Context |
|----------|---------|
| `NEO4J_URI` | Aura connection string |
| `NEO4J_USERNAME` | `neo4j` |
| `NEO4J_PASSWORD` | Aura password |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob |
| `NEXT_PUBLIC_WEB3AUTH_CLIENT_ID` | Web3Auth modal |
| `SESSION_SECRET` | Cookie signing |
| `VENICE_API_KEY` | Stagehand + Venice |
| `BRAVE_SEARCH_API_KEY` | URL enrichment |
| `OPENCLAW_BASE_URL` | Agent backend |
| `ONESHOT_API_KEY` | Relayer + x402 |

Full list: `architecture.md`. Never use `NEXT_PUBLIC_CONVEX_URL`.

---

## Approved Dependencies

- `neo4j-driver` — **graph database (required)**
- `@vercel/blob` — file storage
- `swr` — client polling for agent runs
- `@web3auth/modal`, `@web3auth/base` — Web3Auth
- `wagmi`, `viem`, `@tanstack/react-query` — MetaMask
- `@metamask/smart-accounts-kit` — ERC-7715
- `@browserbasehq/stagehand`, `@browserbasehq/sdk` — automation
- `exa-js` — job discovery
- `jose` — JWT verification
- `zod` — validation
- RetroUI via `@retroui/*`

**Do not add:** `convex`, `@insforge/ssr`, `posthog-js`, `openai` (as primary), Adzuna client.

---

## Match Threshold

```typescript
// lib/utils.ts
export const MATCH_THRESHOLD = 70;
```

Import everywhere — never hardcode `70`.
