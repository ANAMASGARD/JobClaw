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

_Empty until built. Add entries as features ship._

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
| `/` | Not started | Hero, HowItWorks, SponsorBadges |
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
