# UI Rules

> **Purpose:** RetroUI brutalist UI patterns — layout, components, accessibility, page structure.  
> **Read when:** Building or reviewing any page or component.  
> **Tokens:** `ui-tokens.md` · **Inventory:** `ui-registry.md` · **Pages list:** `project-overview.md`

Concise rules for building JobClaw UI with **RetroUI** brutalist theme. Match the installed theme in `app/globals.css` — not the old JobPilot purple/Inter design.

Reference designs in `context/designs/` for layout inspiration only — **colors and typography follow RetroUI tokens**, not the purple Figma palette.

---

## Fonts

Configured in `app/layout.tsx`:

```typescript
import { Archivo_Black, Space_Grotesk } from "next/font/google";

const archivoBlack = Archivo_Black({ variable: "--font-head", ... });
const space = Space_Grotesk({ variable: "--font-sans", ... });
```

| Use | Font | Tailwind |
|-----|------|----------|
| Headings, logo | Archivo Black | `font-head` or `font-heading` |
| Body, UI | Space Grotesk | `font-sans` |

Never use Inter or system fonts as primary.

---

## Visual Style — RetroUI Brutalist

- **Zero border radius** (`--radius: 0`) — sharp corners everywhere
- **Hard shadows** — use `shadow`, `shadow-md`, `shadow-lg` (offset black shadows, not soft blur)
- **Black borders** — `border-border` (black in light mode)
- **Yellow primary** — `bg-primary` (#ffdb33) for main CTAs
- **High contrast** — black text on yellow/white; no muted pastels for primary actions

This is intentional neo-brutalism — do not soften with rounded corners or soft shadows.

---

## Component Library

**Always prefer RetroUI** from `components/retroui/`:

```typescript
import { Button } from "@/components/retroui/Button";
import { Card } from "@/components/retroui/Card";
import { Text } from "@/components/retroui/Text";
```

Use shadcn `components/ui/` only when RetroUI has no equivalent.

---

## Layout

- Page max-width: 1280px–1440px, centered
- Main content padding: 24px–32px
- Gap between sections: 24px
- Header height: 64px, full width, `bg-background`, `border-b border-border`
- Top navbar only — no sidebar

---

## Navbar

Items: Dashboard, Hunt, Applications, Onchain, Profile (or subset on mobile)

- Active: `text-foreground font-semibold` or `bg-primary text-primary-foreground` pill
- Inactive: `text-muted-foreground`
- Logo: Archivo Black, uppercase optional for brutalist feel

---

## Cards

RetroUI Card — brutalist shadow:

```
bg-card
border border-border
shadow-md (hard offset shadow)
rounded-none (radius 0)
p-6
```

Never soft drop shadows — use theme shadow tokens only.

---

## Typography Hierarchy

| Level | Classes |
|-------|---------|
| Page title | `font-head text-3xl font-normal` |
| Section heading | `font-head text-xl` |
| Card title | `font-semibold text-foreground` |
| Body | `font-sans text-sm text-foreground` |
| Muted / timestamp | `text-sm text-muted-foreground` |
| Stat number | `font-head text-4xl` |

---

## Buttons

**Primary (main CTA — Start Hunt, Connect MetaMask):**

```
bg-primary text-primary-foreground
border border-border
shadow-sm hover:shadow-md
font-sans font-medium
```

**Secondary:**

```
bg-secondary text-secondary-foreground
border border-border
shadow-sm
```

**Destructive:**

```
bg-destructive text-destructive-foreground
```

Use RetroUI `<Button>` variants — do not invent custom button styles.

---

## Badges (application status)

| Status | Style |
|--------|-------|
| submitted | `bg-primary text-primary-foreground` |
| applying | `bg-accent text-accent-foreground` |
| matched | `bg-secondary text-secondary-foreground` |
| failed | `bg-destructive text-destructive-foreground` |
| discovered | `bg-muted text-muted-foreground` |

Use RetroUI `<Badge>`.

---

## Match Score Display

- Show score as bold number + RetroUI Progress bar
- 70%+: `bg-primary`
- 50–69%: `bg-accent`
- Below 50%: `bg-muted`

---

## Live Agent Log (demo-critical)

- Monospace or small sans for log lines
- Timestamp in `text-muted-foreground`
- Success lines: optional `text-foreground` + check icon
- Error lines: `text-destructive`
- tx hash: truncate middle, link to explorer
- Use Drawer or Card with scroll — judges must read logs during demo

---

## Onchain Panel

- Table with columns: Type, Tx Hash, Amount, Status, Time
- Every tx hash links to block explorer
- Use RetroUI Table

---

## Empty States

- Short muted text
- Primary CTA if logical next step
- RetroUI aesthetic — simple, not illustration-heavy

---

## Hackathon UI Requirements

These must be obvious in the UI (not hidden in devtools):

1. Venice AI attribution on match reasoning
2. MetaMask / Smart Accounts permission step copy
3. x402 payment state (waiting / settled)
4. Sponsor logos on landing (MetaMask, Venice, 1Shot)

---

## Do Nots

- Never use old JobPilot purple (`#7C5CFC`) — wrong project
- Never use `rounded-lg` / large radius — theme is `--radius: 0`
- Never use soft `shadow-sm` blur shadows from generic shadcn — use RetroUI hard shadows
- Never use Tailwind palette classes (`bg-purple-500`, `text-gray-600`)
- Never use hardcoded hex in components
- Never show raw wallet errors to users
- Never hide tx hashes when available

---

## Tailwind v4

Tokens in `app/globals.css` via `@theme inline`. No `tailwind.config.ts` for colors. See `ui-tokens.md`.
