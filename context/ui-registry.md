# UI Registry

> **Purpose:** Living inventory of RetroUI components and page build status. **Update after every UI feature.**  
> **Read when:** Before building UI (check reuse) and after building (add entry).  
> **Rules:** `ui-rules.md` · **Tokens:** `ui-tokens.md`

Living document. Updated after every component is built. Read before building new UI — match existing patterns.

**Design system:** RetroUI brutalist (neo-retro) — yellow primary, black borders, hard shadows, zero radius.

---

## How to Use

1. Check if component exists here or in `components/retroui/`
2. Reuse RetroUI primitives before building custom
3. After building — add entry with file path and key classes/tokens

---

## Installed RetroUI Components

Location: `components/retroui/`

| Component | File | Use for |
|-----------|------|---------|
| Button | `Button.tsx` | All CTAs, hunt start, login |
| Card | `Card.tsx` | Dashboard sections, stats |
| Input | `Input.tsx` | Job title, location fields |
| Text | `Text.tsx` | Headings, body copy |
| Badge | `Badge.tsx` | Application status, match score |
| Table | `Table.tsx` | Applications list, onchain txs |
| Loader | `Loader.tsx` | Hunt in progress |
| Dialog | `Dialog.tsx` | x402 payment confirm |
| Drawer | `Drawer.tsx` | Live agent log panel |
| Progress | `Progress.tsx` | Hunt phase progress |
| Alert | `Alert.tsx` | Web2 "Connect MetaMask" banner |
| Sonner | `Sonner.tsx` | Toast notifications |
| Select | `Select.tsx` | Remote preference dropdown |
| Checkbox | `Checkbox.tsx` | Consent checkbox |
| Tab | `Tab.tsx` | Dashboard sections |

Charts: `components/retroui/charts/` (BarChart, LineChart, AreaChart, PieChart)

Install more: `npx shadcn@latest add -y @retroui/{name}`

---

## App Components

### FigureStrip
- **File:** components/landing/FigureStrip.tsx
- **Tokens:** none — hero is pure black (`bg-black`) to match the pony.studio reference exactly
- **RetroUI deps:** none (pure CSS marquee + `next/image`)
- **Notes:** Large, bottom-anchored, seamlessly auto-rotating row of `/images/jobclaw-figures.png` (transparent PNG). 4 `next/image` copies (first `priority`); `.marquee-track` animates `translate3d(0 → -50%)` via `@keyframes jobclaw-marquee` in `globals.css`. Honors `prefers-reduced-motion`. Verified live-scrolling in headless Chrome.

### Template entry

```
## ComponentName
- **File:** components/dashboard/ComponentName.tsx
- **Tokens:** bg-card, text-foreground, border-border, shadow-md
- **RetroUI deps:** Button, Card
- **Notes:** ...
```

---

## Page Registry

| Route | Status | Key components |
|-------|--------|----------------|
| `/` | ✅ Hero + agents section | Pony-style hero (nav, giant headline, auto-rotating FigureStrip) → "agents multiply" section (autoplay video + bot render in neobrutalist rounded cards, then reduced highlight heading) → DancingReviews (pony-style scatter of 11 looping dancer videos in `/public/dancers` + client testimonial) → "Pull up a chair" CTA ending (neobrutalist pill buttons + career-chair image in a subtle tilted rounded frame) → full footer (brand + social pills + Product/Company/Resources columns + oversized JOBCLAW wordmark + legal bar). Dancer clips are placeholder pony.studio assets — replace before launch. Brand favicon (crab) wired via `app/icon.png`/`app/favicon.ico`/`app/apple-icon.png` + dark `app/manifest.ts` |
| `/login` | Not started | Web2LoginButton, MetaMaskLoginButton |
| `/onboarding` | Not started | ResumeUpload, JobPreferencesForm |
| `/onboarding/permissions` | Not started | PermissionStepper, DelegationExplainer |
| `/dashboard` | Not started | StatsBar, LiveLogDrawer, ApplicationTable |
| `/dashboard/hunt` | Not started | HuntControl, X402PaymentFlow |
| `/dashboard/onchain` | Not started | OnchainTxTable |
| `/dashboard/applications/[id]` | Not started | ApplicationDetail, VeniceMatchReason |

---

## Hackathon-Visible UI Elements (judges must see these)

- [ ] "Powered by Venice AI" label on match reasoning
- [ ] ERC-7715 permission grant step UI
- [ ] x402 payment prompt / 402 flow indicator
- [ ] Tx hash with BaseScan link on onchain panel
- [ ] Live agent log with timestamps
- [ ] Sponsor badges: MetaMask, Venice, 1Shot on landing
