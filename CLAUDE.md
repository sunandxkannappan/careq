# CLAUDE.md — CareQ UI Design System

This file defines the universal design language, component rules, and coding conventions for the **CareQ** patient portal. Generated from codebase scan and updated after the v2 visual revamp. Follow these rules precisely when building any new screen, component, or feature.

---

## 1. Brand Identity

**Product:** CareQ — a patient-facing healthcare portal for surgical waitlist management.
**Tone:** Calm, trustworthy, clear. Never clinical or cold. Never playful or frivolous.
**Audience:** Patients navigating complex, often anxious healthcare journeys. Every UI decision should reduce cognitive load and build confidence.
**Tech Stack:** React 18 + TypeScript + Tailwind CSS v3 + Shadcn/ui (Radix primitives) + Lucide React icons + Vite.
**Favicon:** `client/public/favicon.svg` — blue rounded square (`#2563EB`) with white "Q" glyph. SVG format for crisp rendering at all sizes.
**Note:** This project is fully off Replit. No `@replit/*` packages or `REPL_ID` environment checks anywhere.

---

## 2. Design Tokens

All tokens live in two places: CSS custom properties in `client/src/index.css` and the Tailwind theme in `tailwind.config.ts`. Always use CSS variables or Tailwind semantic utilities — never hardcode raw hex values in component styles.

### 2.1 Colors

#### Brand Palette (Blue)

```css
/* Primary — buttons, active states, focus rings, icons */
--primary: 221 83% 53%;           /* #2563EB — Blue 600 */
--primary-foreground: 0 0% 100%;  /* White */

/* Secondary — muted actions */
--secondary: 217 91% 60%;         /* #3B82F6 — Blue 500 */
--secondary-foreground: 224 76% 20%; /* #1E3A8A — Blue 900 */
```

Use Tailwind semantics: `bg-primary`, `text-primary`, `border-primary`, `ring-primary`.

#### Accent / Status Colors

| Token | Hex | Use Case |
|---|---|---|
| `bg-blue-50 text-blue-600` | `#EFF6FF / #2563EB` | Info badges, virtual visit pills |
| `bg-green-50 text-green-700` | `#F0FDF4 / #15803D` | Confirmed / success states |
| `bg-amber-50 text-amber-700` | `#FFFBEB / #B45309` | Warnings, pending states |
| `bg-red-50 text-red-600` | `#FEF2F2 / #DC2626` | Destructive actions only |
| `bg-emerald-50 text-emerald-600` | exercise care plan items |
| `bg-purple-50 text-purple-600` | clinical care plan items (intentional differentiation) |

#### Surface & Structural Colors

```css
--background: 210 40% 98%;        /* #F8FAFC — Slate 50 (main app bg) */
--foreground: 222 47% 11%;        /* #0F172A — Slate 900 */
--card: 0 0% 100%;                /* #FFFFFF */
--muted: 210 40% 96%;             /* #F1F5F9 — Slate 100 */
--muted-foreground: 215 16% 47%;  /* #64748B — Slate 500 */
--border: 214 32% 91%;            /* #E2E8F0 — Slate 200 */
--input: 214 32% 91%;
```

#### Sidebar — Dark Slate-Blue

```css
--sidebar: 217 33% 17%;           /* #1E293B — Slate 800 */
--sidebar-foreground: 210 40% 98%; /* #F8FAFC */
--sidebar-border: 215 25% 22%;    /* #263447 */
--sidebar-primary: 221 83% 53%;   /* #2563EB */
--sidebar-accent: 215 28% 24%;    /* hover lift */
--sidebar-accent-foreground: 210 40% 98%;
```

In the sidebar, use raw Tailwind colors that reference the dark context:
- Text: `text-slate-400` (inactive), `text-slate-100` (hover), `text-white` (active)
- Icons: `text-slate-500` (inactive) → `text-slate-300` (hover) → `text-primary` (active)
- Backgrounds: `bg-white/[0.05]` (hover), `bg-primary/[0.15]` (active)
- Borders: `border-white/[0.07]` or `border-white/[0.08]`

### 2.2 Typography

#### Font Families

```css
--font-display: 'Plus Jakarta Sans', sans-serif;  /* Headings, brand name, large numbers */
--font-sans:    'DM Sans', sans-serif;            /* All body text, labels, buttons */
```

Import via Google Fonts:
```html
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap" rel="stylesheet" />
```

Tailwind mapping in `tailwind.config.ts`:
```typescript
fontFamily: {
  sans:    ["'DM Sans'", "sans-serif"],
  display: ["'Plus Jakarta Sans'", "sans-serif"],
}
```

All headings use `font-family: var(--font-display)` — enforced globally:
```css
h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-display);
  font-weight: 600;
  letter-spacing: -0.025em;
}
```

#### Type Scale

| Role | Size | Weight | Font | Tailwind |
|---|---|---|---|---|
| Page title (H1) | 28–32px | 700 | Plus Jakarta Sans | `text-3xl font-bold font-display` |
| Large heading (H2) | 24px | 700 | Plus Jakarta Sans | `text-2xl font-bold font-display` |
| Section title | 20–22px | 600 | Plus Jakarta Sans | `text-xl font-semibold font-display` |
| Card title | 16–18px | 600 | Plus Jakarta Sans | `text-base font-semibold font-display` |
| Body text | 14–15px | 400 | DM Sans | `text-sm` or `text-[15px]` |
| Label / button | 13–14px | 500 | DM Sans | `text-sm font-medium` |
| Caption / metadata | 11–12px | 500–600 | DM Sans | `text-xs font-medium` |
| Hero number | 48–56px | 700 | Plus Jakarta Sans | `text-5xl font-bold font-display` |

**Rules:**
- Never use `font-weight: 800` or `900` anywhere.
- Never use Inter, Roboto, Arial, or `system-ui` for visible text.
- Page subtitles use `font-weight: 300` from DM Sans.
- `letter-spacing: -0.025em` (`tracking-tight`) on all display font usage.

### 2.3 Spacing

All spacing is based on **4px multiples**. Preferred values: `4 8 10 12 14 16 20 24 28 32 36 40 48 56 64`.

| Context | Value | Tailwind |
|---|---|---|
| Card internal padding | 24px | `p-6` |
| Main content (mobile) | 16px | `p-4` |
| Main content (tablet) | 32px | `md:p-8` |
| Main content (desktop) | 48px | `lg:p-12` |
| Sidebar horizontal padding | 20px | `px-5` |
| Sidebar nav item padding | 10px V, 12px H | `px-3 py-2.5` |
| Section gap | 24–32px | `gap-6` or `gap-8` |
| Card gap in a grid | 16–24px | `gap-4` or `gap-6` |
| Inline icon-to-text gap | 8–12px | `gap-2` or `gap-3` |

### 2.4 Border Radius

Defined in `tailwind.config.ts`. Use these values exclusively.

```typescript
borderRadius: {
  sm:   "0.1875rem",  /* 3px  — subtle elements */
  md:   "0.375rem",   /* 6px  — buttons, inputs, tabs */
  lg:   "0.5625rem",  /* 9px  — cards, panels */
  xl:   "0.875rem",   /* 14px — hero cards, modals */
  full: "9999px",     /* ∞   — pills, badges, avatars */
}
```

Note: `--radius: 0.5rem` (8px) in CSS vars — used by Radix components.

| Component | Radius |
|---|---|
| Sidebar nav items | `rounded-lg` |
| Button, Input, Select | `rounded-md` (6px) |
| Card | `rounded-xl` (14px via Shadcn default) |
| Dialog / Sheet | `rounded-xl` |
| Badge / Pill / Avatar | `rounded-full` or `rounded-md` |
| Tab trigger (inner) | `rounded-md` |
| Logo mark | `rounded-xl` |

### 2.5 Shadows

| Token | Value | Use Case |
|---|---|---|
| `shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` | Default card, button resting state |
| `shadow-md` | `0 4px 6px -1px rgba(0,0,0,0.1)` | Card hover states |
| `shadow-lg` | `0 10px 15px -3px rgba(0,0,0,0.1)` | Modals, floating panels |
| `shadow-xl` | standard | Hero cards |
| `shadow-primary/20` | Blue @ 20% opacity | Hero/waitlist card glow |
| `shadow-primary/30` | Blue @ 30% opacity | Logo mark glow |

- **Never** use `shadow-2xl` or heavy custom shadows.
- Cards at rest: `shadow-sm`. On hover: `shadow-md`.

---

## 3. Layout

### 3.1 App Shell

```
┌──────────────────────────────────────────────────────────────┐
│  Sidebar (288px, #1E293B dark) │  Main (flex-1, #F8FAFC bg) │
│  border-r border-[#263447]     │  p-4 md:p-8 lg:p-12        │
│  h-dvh, flex-col               │  overflow-y-auto            │
└──────────────────────────────────────────────────────────────┘
```

**File:** `client/src/components/Layout.tsx`

```
Desktop sidebar:   w-72 (288px), fixed/sticky, h-dvh, bg-[#1E293B]
Mobile sidebar:    fixed inset-0, slides in via -translate-x-full → translate-x-0
Mobile overlay:    bg-black/30 backdrop-blur-sm, z-40
Sidebar z-index:   z-50
Main content:      flex-1 md:min-w-0 overflow-y-auto
Content max-width: max-w-6xl mx-auto (inner wrapper)
Animation:         animate-enter on mount (0.4s spring)
```

### 3.2 Sidebar Structure (dark bg context)

```
[Brand area]          px-5 pt-6 pb-4
  Logo mark + wordmark
  Clinic dropdown     bg-white/[0.06] border-white/[0.08]
[Divider]             h-px bg-white/[0.07]
[Navigation]          px-3 py-3
  Nav items           px-3 py-2.5 rounded-lg
[Divider]             h-px bg-white/[0.07]
[User footer]         p-4
  Avatar + name/email + logout
```

### 3.3 Grid Patterns

| Pattern | Columns | Gap | Use Case |
|---|---|---|---|
| Hero row | `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` | `gap-6` | Dashboard top section |
| Waitlist hero | `lg:col-span-2` + `col-span-1` | `gap-6` | Status card + appointment |
| 3-column equal | `grid-cols-1 sm:grid-cols-3` | `gap-4` | Wait-time blocks |
| Responsive card grid | `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` | `gap-6` | Resource cards |

---

## 4. Component Patterns

### 4.1 Sidebar Navigation (dark context)

```
Nav item states:
  default  → text-slate-400, no background
  hover    → bg-white/[0.05], text-slate-100
  active   → bg-primary/[0.15], text-white, font-semibold
             + small blue dot indicator at right (w-1.5 h-1.5 rounded-full bg-primary)

Icon states:
  default  → text-slate-500
  hover    → text-slate-300
  active   → text-primary (blue)
```

- Nav items: `px-3 py-2.5 rounded-lg text-[13.5px] font-medium`
- No left-border accent — background shift + right dot is the indicator.
- Active items have `font-semibold` applied to the label.

### 4.2 Buttons

**File:** `client/src/components/ui/button.tsx`

Base: `inline-flex items-center gap-2 min-h-9 px-4 py-2 text-sm font-medium rounded-md transition-all`

| Variant | Background | Text | Use Case |
|---|---|---|---|
| `default` | `bg-primary` | `text-white` | Primary action |
| `secondary` | `bg-secondary/10` | `text-secondary-foreground` | Secondary action |
| `outline` | transparent | `text-foreground` | Tertiary action |
| `ghost` | transparent | `text-foreground` | Inline/subtle |
| `destructive` | `bg-destructive` | `text-white` | Irreversible delete |

Zoom/video CTA: `bg-blue-600 hover:bg-blue-700 text-white` (explicit blue-600 — same as primary but written explicitly for semantic clarity in that context).

### 4.3 Cards

**File:** `client/src/components/ui/card.tsx`

```
Base:        bg-card rounded-xl border border-border shadow-sm text-card-foreground
CardHeader:  p-6 flex flex-col space-y-1.5
CardTitle:   font-display font-semibold tracking-tight
CardContent: p-6 pt-0
CardFooter:  p-6 pt-0 flex items-center
```

**Hero / Waitlist card:**
```
bg-gradient-to-br from-primary to-primary/90 text-white
border-none shadow-xl shadow-primary/20
Decorative overlay: absolute div with bg-white/5 rounded-full blur-3xl
```

**Info/secondary surface:**
```
bg-muted/30 rounded-xl border border-border/50 p-5
```

### 4.4 Status Pills

All status pills must pair color with text — never color alone.

```
Base: inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full
Dot:  w-1.5 h-1.5 rounded-full (leading dot)
```

| Status | Background | Text | Dot |
|---|---|---|---|
| Confirmed / Completed | `bg-green-50` | `text-green-700` | `bg-green-500` |
| Booked / Active | `bg-blue-50` | `text-blue-700` | `bg-blue-500` |
| Pending / Warning | `bg-amber-50` | `text-amber-700` | `bg-amber-500` |
| Cancelled | `bg-red-50` | `text-red-600` | `bg-red-500` |

### 4.5 Tabs

```
TabsList:    h-10 bg-muted/50 p-1 rounded-lg
TabsTrigger: data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md transition-all
```

### 4.6 Form Inputs

```
Input:  h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm
        focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
Label:  text-sm font-medium leading-none
```

Required field: `<span className="text-destructive">*</span>` after label text.
Read-only health data (PHN, DOB): `className="bg-muted/30"` — visually distinct from editable.

### 4.7 Progress Bar

```
Track:     h-2.5 w-full bg-secondary rounded-full
Fill:      bg-primary rounded-full transition-all
On dark:   Track: bg-black/20  Fill: bg-white  (e.g. inside hero card)
```

### 4.8 Journey Timeline

```
Connector line: absolute left-[19px], w-0.5, bg-border/60
Stage dot (completed): w-10 h-10 rounded-full, border-2 border-primary, bg-primary, text-white
Stage dot (current):   border-primary, ring-4 ring-primary/10, animated pulse inner dot
Stage dot (future):    border-muted-foreground/30, opacity-50
```

---

## 5. Icons

- **Library:** Lucide React — outline style only.
- **Size:** `w-[17px] h-[17px]` sidebar nav, `w-4 h-4` body/buttons, `w-5 h-5` section headers.
- **Stroke:** Lucide default (strokeWidth 2). Do not override.
- **Color:** `currentColor` unless specifically accented.
- **Icon-only buttons:** always include `aria-label`.

---

## 6. Animation & Motion

**File:** `client/src/index.css`

```css
@keyframes enter {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
.animate-enter {
  animation: enter 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
```

- **Page mount:** `.animate-enter` — 0.4s spring easing (was 0.6s, tightened for premium feel).
- **Hover:** `transition-colors duration-150` or `transition-all duration-200`.
- **Sidebar (mobile):** `transition-transform duration-300 ease-out`.
- **Never** animate `width`, `height`, or `padding`.
- **No** spinners — use `Skeleton` (`animate-pulse bg-muted`) for loading.

---

## 7. Scrollbar

Defined globally in `index.css`:
```css
::-webkit-scrollbar { width: 5px; height: 5px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: hsl(var(--border)); border-radius: 9999px; }
```

Thin (5px), borderless, inherits border color. No custom scrollbar on sidebar — default browser behavior.

---

## 8. Responsive Breakpoints

| Breakpoint | Min-width | Key change |
|---|---|---|
| `sm` | 640px | Minor adjustments, 3-col grids |
| `md` | 768px | Sidebar appears, padding increases |
| `lg` | 1024px | Full desktop layout, max padding |

Mobile patterns:
```
hidden md:block          — desktop-only elements
md:hidden                — mobile-only elements
p-4 md:p-8 lg:p-12      — responsive padding
h-dvh / h-svh           — viewport height units
```

---

## 9. Healthcare UX Rules

1. **Status labels must be explicit.** Always pair color + text. Never color alone.
2. **Emergency info** uses amber (`bg-amber-50 text-amber-700`). Never red for informational warnings — red is for destructive UI only.
3. **Destructive actions** (cancel appointment) require `AlertDialog` confirmation before executing.
4. **Required fields** marked with `<span className="text-destructive">*</span>`. Inline errors, never `alert()`.
5. **PHN / DOB** read-only fields use `bg-muted/30` — visually distinct from editable inputs.
6. **Wait times** always include a label explaining the number (e.g. "Wait Time to See Surgeon", not just "18").
7. **Critical notifications** (test results, appointment changes) must not auto-dismiss — require explicit acknowledgment.

---

## 10. Coding Conventions

### File Structure
```
client/src/
  components/
    ui/           # Shadcn/ui base components — do not modify directly
    Layout.tsx    # App shell (dark sidebar + main)
    CareQLogo.tsx
  pages/          # Page components
  hooks/          # use-toast, use-mobile, use-data
  lib/utils.ts    # cn() helper
  index.css       # CSS vars, global styles, custom utilities
  App.tsx         # Routing
```

### Naming
| Type | Convention |
|---|---|
| React components | PascalCase |
| Files | kebab-case |
| Hooks | camelCase, `use-` prefix |
| CSS variables | `--kebab-case` |

### Class Composition
Use `cn()` from `lib/utils.ts` for all conditional classes:
```typescript
import { cn } from "@/lib/utils";
<div className={cn("base", isActive && "active", className)} />
```

### State Attributes
```
data-[state=active]:...
data-[state=open]:...
data-[active=true]:...
```

### Accessibility
- Icon-only buttons: `aria-label="..."`.
- Focus: `focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`.
- Never remove focus outlines.
- `className="sr-only"` for screen-reader-only text.

---

## 11. Custom Utilities

Defined in `client/src/index.css`:

```css
.glass-card {
  @apply bg-white/80 backdrop-blur-md border border-white/20 shadow-xl shadow-black/5;
}

.animate-enter {
  animation: enter 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.text-balance {
  text-wrap: balance;
}
```

---

## 12. What NOT To Do

- ❌ Don't use `Outfit`, `Inter`, `Roboto`, or `system-ui` — fonts are `Plus Jakarta Sans` (display) and `DM Sans` (body).
- ❌ Don't hardcode hex values (`#2563EB`) in component files — use `bg-primary`, `text-primary`, etc.
- ❌ Don't use warm/ivory backgrounds (`#FBF7F1`) — app background is cool slate (`#F8FAFC`).
- ❌ Don't use purple as a brand color anywhere — the brand is blue.
- ❌ Don't apply `bg-white` or light background to the sidebar — it's always dark `bg-[#1E293B]`.
- ❌ Don't add a left-border accent to active sidebar nav items — use background shift + right dot.
- ❌ Don't use `font-weight: 800` or `900`.
- ❌ Don't use heavy drop shadows (`shadow-2xl`, `0 20px 60px`).
- ❌ Don't use filled/solid Lucide icons — outline only.
- ❌ Don't use `border-radius` values not in the token set (3, 6, 9, 14, 9999px).
- ❌ Don't use `alert()`, `confirm()` — use `AlertDialog` from Radix.
- ❌ Don't use spinning loaders — use `Skeleton`.
- ❌ Don't show status/health info with color only — always pair with text.
- ❌ Don't let destructive actions execute without `AlertDialog` confirmation.
- ❌ Don't animate `width`, `height`, or `padding`.
- ❌ Don't use `!important` in Tailwind classes unless absolutely unavoidable.
