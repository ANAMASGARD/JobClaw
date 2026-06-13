# Library Docs

> **Purpose:** Project-specific patterns for each third-party library — not generic tutorials.  
> **Read when:** Before implementing **Neo4j**, Web3Auth, MetaMask, 1Shot, x402, OpenClaw, Venice, Exa, Brave, Browserbase, RetroUI.  
> **Graph model:** `architecture.md` → Neo4j Graph Model · **Code style:** `code-standards.md`  
> **Live API docs:** Context7 MCP first, then this file.

**Do not use InsForge, Adzuna, PostHog, OpenAI-as-primary, or Convex patterns.**

Authority order:

```
AGENTS.md → context/README.md → installed skill → Context7 MCP → this file → training data
```

## Quick index

| Section | Library | Skill / MCP |
|---------|---------|-------------|
| [Neo4j](#neo4j) | **Graph database (required)** | Context7 `neo4j-javascript-driver` |
| [Vercel Blob](#vercel-blob) | File storage | Vercel MCP |
| [Web3Auth](#web3auth-metamask-embedded-wallets) | Social onboarding | `~/.agents/skills/web3auth` |
| [MetaMask](#metamask--wagmi--smart-accounts-kit) | SIWE, ERC-7715 | Context7 + MetaMask Kit docs |
| [1Shot](#1shot-permissionless-relayer) | 7702, 7710 relay | 1Shot hackathon docs |
| [x402](#x402) | Payment-gated routes | x402.org, 1shot-x402 |
| [OpenClaw](#openclaw-separate-repo) | Venice reasoning + agentic RAG tools | `vclaw` docs |
| [Agentic RAG](#agentic-rag) | Neo4j retrieval for OpenClaw Venice agent | `architecture.md` |
| [Venice AI](#venice-ai) | LLM | Venice API |
| [Exa](#exa) | Job discovery | Context7 |
| [Brave Search](#brave-search-api) | URL enrichment | Brave API docs |
| [LinkedIn](#linkedin-browserbase--stagehand) | Board search/apply | skill: `browser` |
| [Browserbase](#browserbase--stagehand) | Form fill, apply | Context7, skill: `browser` |
| [RetroUI](#retroui) | UI components | `ui-tokens.md`, `ui-rules.md` |

---

## Neo4j

**Check first:** Context7 — `neo4j-javascript-driver` · Graph model in `architecture.md`

### Driver (server-only)

```typescript
// lib/neo4j/client.ts
import neo4j, { Driver } from "neo4j-driver";

let driver: Driver | null = null;

export function getDriver(): Driver {
  if (!driver) {
    driver = neo4j.driver(
      process.env.NEO4J_URI!,
      neo4j.auth.basic(process.env.NEO4J_USERNAME!, process.env.NEO4J_PASSWORD!)
    );
  }
  return driver;
}

export async function withSession<T>(fn: (session: Session) => Promise<T>): Promise<T> {
  const session = getDriver().session({ database: "neo4j" });
  try {
    return await fn(session);
  } finally {
    await session.close();
  }
}
```

**Never import `lib/neo4j/` in client components.**

### Repository pattern

```typescript
// lib/neo4j/repositories/applications.ts
export async function listByUser(userId: string) {
  return withSession(async (session) => {
    const result = await session.run(`
      MATCH (u:User {id: $userId})-[:APPLIED_TO]->(a:Application)-[:FOR_JOB]->(j:JobListing)
      RETURN a, j ORDER BY a.updatedAt DESC
    `, { userId });
    return result.records.map((r) => ({
      application: r.get("a").properties,
      job: r.get("j").properties,
    }));
  });
}
```

### Append logs (never overwrite)

```typescript
// lib/neo4j/repositories/agentRuns.ts
export async function appendLog(runId: string, entry: LogEntryInput) {
  await withSession(async (session) => {
    await session.run(`
      MATCH (r:AgentRun {id: $runId})
      CREATE (l:LogEntry {
        id: randomUUID(),
        timestamp: $timestamp,
        phase: $phase,
        message: $message,
        level: $level
      })
      CREATE (r)-[:HAS_LOG]->(l)
      SET r.phase = $phase
    `, { runId, ...entry });
  });
}
```

### Init script

Run `scripts/neo4j-init.cypher` on fresh Neo4j Aura instance (constraints + indexes).

**Rules:**
- All Cypher in `lib/neo4j/repositories/` — not scattered in API routes
- Always `MATCH (u:User {id: $userId})` — scope to authenticated user
- Use `MERGE` for idempotent upserts; `CREATE` for append-only logs
- Store JSON blobs (ERC-7715 payload) as strings on nodes
- **Do not use Convex**

---

## Vercel Blob

**Check first:** Vercel docs / `@vercel/blob`

```typescript
// lib/storage/blob.ts
import { put } from "@vercel/blob";

export async function uploadResume(userId: string, file: File) {
  const blob = await put(`resumes/${userId}/resume.pdf`, file, { access: "public" });
  return blob.url; // store on Resume node in Neo4j
}
```

**Rules:**
- Resume PDFs, cover letters, personalized resumes, screenshots → Blob
- Neo4j stores `blobUrl` / `coverLetterUrl` / `screenshotUrl` only
- Env: `BLOB_READ_WRITE_TOKEN`

---

## Web3Auth (MetaMask Embedded Wallets)

**Check first:** Web3Auth skill + MetaMask Embedded Wallets docs

```typescript
// lib/web3auth/provider.tsx
import { Web3AuthProvider } from "@web3auth/modal/react";
```

- Dashboard client id: `NEXT_PUBLIC_WEB3AUTH_CLIENT_ID`
- On success: verify idToken server-side with `jose`
- Upsert Neo4j `User` node with `authMethod: "web3auth"`

**Rules:**
- Web3Auth is the **primary onboarding entry**
- After onboarding, prompt MetaMask on `/onboarding/connect-wallet`
- Not a substitute for Smart Accounts Kit / ERC-7715

---

## MetaMask + wagmi + Smart Accounts Kit

**Check first:** MetaMask Smart Accounts Kit docs

### SIWE login

```typescript
// lib/metamask/siwe.ts
const message = `JobClaw wants you to sign in\nNonce: ${nonce}\nIssued: ${new Date().toISOString()}`;
const signature = await signMessageAsync({ message });
// POST /api/auth/verify → link wallet on User node in Neo4j
```

### Smart account + ERC-7715

```typescript
import { toMetaMaskSmartAccount } from "@metamask/smart-accounts-kit";
// Request Advanced Permissions during /onboarding/permissions
// CREATE Delegation node + HAS_DELEGATION relationship in Neo4j
```

---

## 1Shot Permissionless Relayer

- EIP-7702 upgrade via 1Shot relayer → CREATE OnchainLog node
- EIP-7710 execution → webhook at `/api/webhooks/1shot`
- **Mainnet required** for 1Shot relayer prize in final demo video

---

## x402

### Flow

1. Client `POST /api/jobs/hunt` without payment → **402**
2. Delegated smart account signs EIP-3009
3. Retry with `X-PAYMENT` header
4. 1Shot facilitator settles
5. CREATE X402Payment + OnchainLog in Neo4j → kick `lib/jobs/jobHunt`

### Priced actions

| Route | Price |
|-------|-------|
| `POST /api/jobs/hunt` | $0.05 USDC |
| `POST /api/jobs/analyze-url` | $0.05 USDC |
| `POST /api/jobs/apply/[listingId]` | $0.10 USDC |

---

## OpenClaw (separate repo)

```typescript
// lib/openclaw/client.ts
export async function ensureRunning() {
  await fetch(`${OPENCLAW_BASE_URL}/api/status`, {
    method: "POST",
    headers: { Authorization: `Bearer ${OPENCLAW_ADMIN_SECRET}` },
  });
}
```

- Never run Browserbase inside OpenClaw
- Store `veniceModel` on Application node in Neo4j
- Enable **tool calling** — Venice invokes RAG tools against jobclaw (see Agentic RAG below)

---

## Agentic RAG

OpenClaw's Venice agent retrieves context from Neo4j **during reasoning** — the LLM decides which tools to call.

### jobclaw RAG API (`app/api/rag/*`)

Auth: `Authorization: Bearer ${RAG_API_SECRET}`

```typescript
// lib/rag/queries.ts — example skill match Cypher
export async function getSkillMatch(userId: string, listingId: string) {
  const session = getNeo4jSession();
  const result = await session.run(`
    MATCH (u:User {id: $userId})-[:HAS_RESUME]->(:Resume)-[:HAS_SKILL]->(us:Skill)
    MATCH (j:JobListing {id: $listingId})-[:REQUIRES]->(js:Skill)
    WITH collect(DISTINCT us.name) AS userSkills, collect(DISTINCT js.name) AS jobSkills
    RETURN userSkills, jobSkills,
           [s IN userSkills WHERE s IN jobSkills] AS matchedSkills
  `, { userId, listingId });
  return result.records[0]?.toObject();
}
```

| Endpoint | OpenClaw tool name |
|----------|-------------------|
| `GET /api/rag/profile?userId=` | `query_user_profile` |
| `GET /api/rag/resume?userId=` | `query_resume_skills` |
| `GET /api/rag/job/[listingId]` | `query_job_context` |
| `GET /api/rag/match?userId=&listingId=` | `query_skill_match` |
| `GET /api/rag/applications?userId=` | `query_apply_history` |

### jobclaw-openclaw tool manifest

```json
{
  "name": "query_skill_match",
  "url": "${JOBCLAW_BASE_URL}/api/rag/match",
  "headers": { "Authorization": "Bearer ${RAG_API_SECRET}" }
}
```

Log each RAG call as `LogEntry` with `phase: "rag_retrieve"` for demo visibility.

---

## Venice AI

**API:** `https://api.venice.ai/api/v1` (OpenAI-compatible)

Default: `venice/kimi-k2-5` · Fallback: `venice/zai-org-glm-5`

Stagehand config uses Venice as LLM — see `architecture.md`.

---

## Exa

```typescript
import Exa from "exa-js";
const exa = new Exa(process.env.EXA_API_KEY);
const results = await exa.search("frontend engineer careers remote", { numResults: 10 });
```

- MERGE JobListing nodes with `source: "exa"`

---

## Brave Search API

```typescript
const res = await fetch(
  `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}`,
  { headers: { "X-Subscription-Token": process.env.BRAVE_SEARCH_API_KEY! } }
);
```

- Set `braveContext` on JobListing node
- Server-side only (`lib/jobs/`)

---

## LinkedIn (Browserbase + Stagehand)

- In scope (JobPilot-style)
- Run in `lib/jobs/` only
- MERGE JobListing with `source: "linkedin"`

---

## Browserbase + Stagehand

### Apply pipeline

1. Discover or receive URL
2. Brave Search enrichment (optional)
3. Browserbase extract
4. Venice personalize → Vercel Blob
5. Stagehand apply
6. CREATE Application + LogEntry nodes in Neo4j

**Rules:**
- Always `stagehand.close()` in `finally`
- Max 3 applies per hunt
- Personalize before apply

---

## RetroUI

Components in `components/retroui/`. Registry: `@retroui` in `components.json`.

---

## Removed Libraries (Do Not Implement)

| Removed | Replaced by |
|---------|-------------|
| InsForge | Neo4j |
| **Convex** | **Neo4j** (required) |
| Adzuna | Exa + LinkedIn + Brave Search |
| PostHog | Neo4j LogEntry + OnchainLog nodes |
| OpenAI GPT-4o (primary) | Venice AI |
| @react-pdf/renderer | Vercel Blob (upload resume PDF) |
| InsForge Auth | Web3Auth + MetaMask SIWE |
