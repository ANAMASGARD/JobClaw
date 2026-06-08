# UI Tokens

> **Purpose:** Design tokens — colors, fonts, shadows, spacing from `app/globals.css`.  
> **Read when:** Any styling work. Never hardcode hex values.  
> **UI patterns:** `ui-rules.md` · **Components:** `ui-registry.md`

Design tokens for **JobClaw** RetroUI brutalist theme. Defined in `app/globals.css`. Never hardcode hex in components — use semantic Tailwind classes.

---

## How to Use

Tailwind v4 generates utilities from `@theme inline` in `app/globals.css`:

```tsx
// Correct
className="bg-background text-foreground border-border shadow-md font-sans"

// Correct — semantic tokens
className="bg-primary text-primary-foreground hover:bg-primary-hover"

// Never
className="bg-[#ffdb33] text-[#000000]"
className="bg-yellow-400 text-gray-900"
```

---

## Fonts

| Token | Source | Utility |
|-------|--------|---------|
| `--font-head` | Archivo Black (layout.tsx) | `font-head`, `font-heading` |
| `--font-sans` | Space Grotesk (layout.tsx) | `font-sans` |

---

## Light Mode Colors (`:root`)

| Token | Value | Utility | Usage |
|-------|-------|---------|-------|
| `--background` | `#fff` | `bg-background` | Page background |
| `--foreground` | `#000` | `text-foreground` | Primary text |
| `--primary` | `#ffdb33` | `bg-primary` | CTAs, highlights |
| `--primary-hover` | `#ffcc00` | hover states | Button hover |
| `--primary-foreground` | `#000` | `text-primary-foreground` | Text on primary |
| `--secondary` | `#000` | `bg-secondary` | Secondary buttons |
| `--secondary-foreground` | `#fff` | `text-secondary-foreground` | Text on secondary |
| `--muted` | `#aeaeae` | `bg-muted` | Disabled, subtle bg |
| `--muted-foreground` | `#5a5a5a` | `text-muted-foreground` | Timestamps, hints |
| `--accent` | `#fae583` | `bg-accent` | Highlights, badges |
| `--accent-foreground` | `#000` | `text-accent-foreground` | Text on accent |
| `--destructive` | `#e63946` | `bg-destructive` | Errors, failed status |
| `--destructive-foreground` | `#fff` | `text-destructive-foreground` | Text on destructive |
| `--border` | `#000` | `border-border` | All borders |
| `--card` | `#fff` | `bg-card` | Card surfaces |
| `--card-foreground` | `#000` | `text-card-foreground` | Card text |
| `--input` | `#000` | border on inputs | Input borders |
| `--ring` | `#000` | focus rings | Focus states |

---

## Dark Mode (`.dark`)

Same brutalist palette inverted — dark background, light foreground, yellow primary unchanged. See `app/globals.css` for full values.

---

## Shadows (RetroUI hard shadows)

| Token | Effect |
|-------|--------|
| `shadow-xs` | 1px 1px 0 0 border |
| `shadow-sm` | 2px 2px 0 0 border |
| `shadow` | 3px 3px 0 0 border |
| `shadow-md` | 4px 4px 0 0 border |
| `shadow-lg` | 6px 6px 0 0 border |
| `shadow-xl` | 10px 10px 0 1px border |
| `shadow-2xl` | 16px 16px 0 1px border |

Use on cards and buttons for brutalist depth — not generic blur shadows.

---

## Border Radius

```css
--radius: 0;
```

All components are **sharp-cornered**. Do not override with rounded-lg unless a specific RetroUI component requires it.

---

## Spacing Conventions

| Gap | Usage |
|-----|-------|
| `gap-2` (8px) | Inline badges, tight rows |
| `gap-4` (16px) | Form fields |
| `gap-6` (24px) | Card internal sections |
| `gap-8` (32px) | Page sections |
| `p-6` | Standard card padding |

---

## Component Token Quick Reference

### Primary button
```
bg-primary text-primary-foreground border border-border shadow-sm hover:shadow-md
```

### Card
```
bg-card border border-border shadow-md p-6
```

### Input
```
bg-background border border-border text-foreground placeholder:text-muted-foreground
focus:ring-1 focus:ring-ring
```

### Agent log line
```
text-sm font-sans text-foreground
timestamp: text-muted-foreground
tx link: underline font-mono text-xs
```

---

## Status Colors (applications)

Use semantic tokens — not custom greens/reds:

| Status | Background | Text |
|--------|------------|------|
| submitted | `bg-primary` | `text-primary-foreground` |
| applying | `bg-accent` | `text-accent-foreground` |
| failed | `bg-destructive` | `text-destructive-foreground` |
| matched | `bg-secondary` | `text-secondary-foreground` |
| pending | `bg-muted` | `text-muted-foreground` |

---

## Chart Colors (if using RetroUI charts)

From `@theme` chart tokens in globals.css — aligned with yellow/black palette:

- `--chart-1`: primary yellow
- `--chart-2`: accent
- `--chart-3`–`5`: muted grays

---

## Invariants

- Font headings: **Archivo Black** via `font-head`
- Font body: **Space Grotesk** via `font-sans`
- Primary brand color: **yellow** (`primary`) — not purple
- Borders: always **black** in light mode
- Radius: **zero** globally
- Shadows: **hard offset** — RetroUI tokens only
- Never reference old JobPilot tokens (`#7C5CFC`, `#F6F7FB`, Inter)

---

## globals.css Reference

Source of truth: [`app/globals.css`](../app/globals.css)

Fonts wired in: [`app/layout.tsx`](../app/layout.tsx)

RetroUI registry: [`components.json`](../components.json) → `@retroui`
