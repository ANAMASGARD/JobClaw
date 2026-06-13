# Progress Tracker

> **Purpose:** Living status — checkboxes, prize checklist, decisions log. **Update after every feature.**  
> **Read when:** Start and end of every session — always know what is done and what is next.  
> **What to build:** `build-plan.md` · **How to build:** `code-standards.md`

Update after every completed feature. Any agent reading this should know what is done and what is next.

**Project:** JobClaw — MetaMask x 1Shot x Venice AI Dev Cook Off  
**Submission deadline:** June 15, 2026

---

## Current Status

**Phase:** Phase 1 — Foundation (in progress)  
**Last completed:** Phase 1 · 03 RetroUI landing page (dark, pony.studio-inspired hero + agents section + dancing reviews + chair CTA + footer)  
**Next:** Phase 0 · 01 Deploy jobclaw-openclaw + Neo4j init (prerequisite accounts first)

---

## Progress

### Phase 0 — OpenClaw Backend

- [ ] 00 Prerequisites (Venice, 1Shot, Browserbase, Exa, Neo4j, Web3Auth accounts)
- [ ] 01 Deploy jobclaw-openclaw via vclaw + Venice config + verify

### Phase 1 — Foundation

- [ ] 02 Neo4j schema + dashboard shell
- [x] 03 RetroUI landing page
- [ ] 04 Web3Auth login + redirect to onboarding
- [ ] 04b MetaMask connect-wallet + SIWE upgrade

### Phase 2 — Onchain Onboarding

- [ ] 05 Onboarding — resume + job preferences + consent
- [ ] 06 Smart Accounts Kit + ERC-7715 + 7702 via 1Shot

### Phase 3 — Agent Pipeline

- [ ] 07 OpenClaw client + Venice rank + **Agentic RAG API** (`lib/rag/`, `/api/rag/*`)
- [ ] 08 Exa + LinkedIn job discovery
- [ ] 08b Brave Search + analyze-url route
- [ ] 09 x402 + 1Shot on hunt/apply/analyze routes
- [ ] 10 Browserbase apply + Venice personalization (LinkedIn, Greenhouse, direct URLs)
- [ ] 11 Hunt orchestration (`lib/jobs/jobHunt` + `analyzeAndApply`)

### Phase 4 — Dashboard

- [ ] 12 Main dashboard + live logs
- [ ] 13 Hunt control page
- [ ] 14 Onchain panel
- [ ] 15 Application detail page

### Phase 5 — Demo Hardening

- [ ] 16 Pre-seed applications + demo rehearsal
- [ ] 17 Mainnet relayer for final demo video (1Shot prize)

---

## Prize-Track Checklist

- [ ] Smart Accounts Kit visible in demo video main flow
- [ ] ERC-7715 Advanced Permissions grant recorded
- [ ] Venice **agentic RAG** retrieves skills from Neo4j (visible in match reason)
- [ ] Venice model id shown in UI during rank/apply
- [ ] x402 payment with tx hash on dashboard
- [ ] 1Shot relayer tx (7702 + 7710) on onchain panel
- [ ] Autonomous apply with screenshot proof
- [ ] Live agent logs during hunt (SWR poll)

---

## Decisions Made During Build

_Add decisions here as implementation progresses._

| Date | Decision | Reason |
|------|----------|--------|
| 2026-06-13 | Landing page: pony.studio-inspired dark hero, no feature cards, one giant headline + rotating figures strip | Judges should feel the product brand immediately; remove "AI slop" |
| 2026-06-13 | Dancer clips (`/public/dancers/`) are pony.studio placeholder assets — **must replace before public launch** | Prototyping velocity; original footage needed for release |
| 2026-06-13 | All assets self-hosted in `public/` — zero external CDN hits at runtime | Offline-safe demo; no CDN cold-start risk during judging |
| — | Web3Auth first for onboarding, MetaMask upgrade for hackathon onchain | Lower friction entry; Kit still in demo |
| — | Browser automation in jobclaw, not OpenClaw | Hosted OpenClaw cannot run arbitrary skills |
| — | Venice via OpenClaw for rank; Venice via Stagehand for form fill | Latency + prize visibility |
| — | LinkedIn + user URL apply via Browserbase | JobPilot-style scope restored |
| — | **Neo4j** replaces Convex — powers entire website + agent graph | Required hackathon stack; all pages read from graph |
| — | **Agentic RAG** — OpenClaw Venice calls `/api/rag/*` for Neo4j graph context | Judges see skill-based match reasoning from graph, not static prompts |

---

## Notes

- Vercel **Hobby** is sufficient for hackathon demo
- Pre-warm OpenClaw sandbox ~10 min before judging
- Demo video: **MetaMask path only**
- Old JobPilot/InsForge context files replaced June 2026
