# CareQ — Patient Portal

A patient-facing healthcare portal for surgical waitlist management. Built to reduce cognitive load and build confidence for patients navigating complex healthcare journeys.

## Tech Stack

- **Frontend:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS v3 + Shadcn/ui (Radix primitives)
- **Icons:** Lucide React (outline only)
- **Fonts:** Plus Jakarta Sans (display) · DM Sans (body)
- **Backend:** Node.js + Express + TypeScript

## Design System

### Brand Colors

| Token | Value | Use |
|---|---|---|
| `--primary` | `#2563EB` — Blue 600 | Buttons, active states, focus rings, icons |
| `--primary-foreground` | `#FFFFFF` | Text on primary bg |
| `--secondary` | `#3B82F6` — Blue 500 | Muted actions |
| `--secondary-foreground` | `#1E3A8A` — Blue 900 | Text on secondary bg |

Use Tailwind semantics: `bg-primary`, `text-primary`, `border-primary`, `ring-primary`.

### Surfaces

| Token | Value |
|---|---|
| `--background` | `#F8FAFC` — Slate 50 |
| `--card` | `#FFFFFF` |
| `--sidebar` | `#1E293B` — Slate 800 (dark) |

### Typography

- **Display / Headings:** Plus Jakarta Sans, `font-semibold`, `tracking-tight`
- **Body / Labels:** DM Sans, 14–15px
- **Max weight:** 700 — never 800 or 900

## Development

```bash
npm run dev      # Start dev server (port 5173)
npm run build    # Production build
npm start        # Run production build
```

## Project Structure

```
client/src/
  components/
    ui/           # Shadcn/ui base components
    Layout.tsx    # App shell (dark sidebar + main content)
    CareQLogo.tsx
  pages/          # Page components
  hooks/          # Custom hooks
  lib/utils.ts    # cn() utility
  index.css       # CSS variables + global styles
  App.tsx         # Routing
server/           # Express API
```

## Key UX Rules

- Status labels always pair **color + text** — never color alone
- Destructive actions require `AlertDialog` confirmation
- No spinners — use `Skeleton` for loading states
- Emergency/warning info uses amber, never red (red = destructive UI only)
