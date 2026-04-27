# CareQ

A healthcare portal for surgical waitlist management with separate Patient and Provider interfaces sharing a unified design system.

## Tech Stack

- **Frontend:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS v3 + Shadcn/ui (Radix primitives)
- **Icons:** Lucide React (outline only)
- **Fonts:** Plus Jakarta Sans (display) + DM Sans (body)
- **Routing:** Wouter
- **Backend:** Node.js + Express + TypeScript

## Portals

### Patient Portal (`/patient/*`)
Patients can view their waitlist status, manage appointments, complete forms, review lab/imaging results, and access educational resources.

### Provider Portal (`/provider/*`)
Providers can manage appointments, charting, patient reviews, e-consults, scheduling, and clinical workflows. Includes role-based access for Virtual GP, Waitlist GP, Virtual Nurse, Waitlist Nurse, and Surgeon roles.

## Development

```bash
npm install      # Install dependencies
npm run dev      # Start dev server (port 5173)
npm run build    # Production build
npm start        # Run production build
```

## Project Structure

```
client/src/
  components/
    ui/              # Shadcn/ui base components
    Layout.tsx       # Patient app shell (dark sidebar + main content)
  pages/             # Patient page components
  provider/
    components/      # Provider layout & clinical panels
    pages/           # Provider page components
    lib/             # Role context, mock data, charting templates
  hooks/             # Custom hooks
  lib/               # Utilities, mock data, query client
  index.css          # CSS variables + global styles
  App.tsx            # Routing (landing page, patient/*, provider/*)
server/              # Express API
shared/              # Schema & route definitions
```
