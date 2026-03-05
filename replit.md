# CareQ - Patient Portal Application

## Overview

CareQ is a healthcare patient portal web application that allows patients to manage their care journey. It includes features for tracking surgery waitlist status, managing appointments, completing tasks, viewing medical results/documents, accessing educational resources, and managing their profile. The app is built as a full-stack TypeScript application with a React frontend and Express backend, using PostgreSQL for data storage.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript, bundled by Vite
- **Routing**: Wouter (lightweight client-side router) with pages for Dashboard, Waitlist, Appointments, Tasks, Results, Resources, and Profile
- **State Management**: TanStack React Query for server state caching and mutations
- **UI Components**: shadcn/ui component library (new-york style) built on Radix UI primitives with Tailwind CSS
- **Styling**: Tailwind CSS with CSS variables for theming (warm ivory palette with teal primary). Custom fonts: DM Sans (body) and Outfit (display)
- **Data Layer**: Currently uses a client-side mock data system (`client/src/lib/mockData.ts`) with localStorage persistence and simulated async delays. The hooks in `client/src/hooks/use-data.ts` read from this mock store rather than making real API calls. The server-side API routes exist but the frontend hooks bypass them.
- **Path Aliases**: `@/` maps to `client/src/`, `@shared/` maps to `shared/`

### Backend Architecture
- **Runtime**: Node.js with Express 5
- **Language**: TypeScript, executed via `tsx` in development
- **API Design**: RESTful routes defined in `server/routes.ts`, with route contracts shared via `shared/routes.ts`
- **Storage**: `server/storage.ts` defines an `IStorage` interface with a `MemStorage` in-memory implementation seeded with mock data. This is designed to be swapped for a database-backed implementation.
- **Development Server**: Vite dev server is integrated as Express middleware (`server/vite.ts`) with HMR support
- **Production Build**: Client is built with Vite, server is bundled with esbuild into `dist/index.cjs`. Static files served from `dist/public`

### Database Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema**: Defined in `shared/schema.ts` with tables for `users`, `appointments`, `tasks`, `waitlist_status`, `medical_results`, and `resources`
- **Validation**: Zod schemas auto-generated from Drizzle schemas via `drizzle-zod`
- **Migrations**: Managed via `drizzle-kit push` (schema push approach, not migration files)
- **Connection**: Uses `pg` Pool with `DATABASE_URL` environment variable (required)

### Shared Code
- `shared/schema.ts` — Database table definitions and Zod insert schemas, shared between frontend and backend
- `shared/routes.ts` — API route contracts (paths, methods, input/output schemas) used by both server routes and potentially client-side type-safe fetching

### Key Design Decisions

1. **Mock data on client vs real API**: The frontend hooks (`use-data.ts`) currently read from localStorage mock data instead of calling the Express API. This means the server routes exist but aren't actively used by the frontend. When transitioning to real data, update the hooks to use `apiRequest` from `queryClient.ts` or the `getQueryFn` pattern.

2. **In-memory storage**: The server uses `MemStorage` class. To connect to PostgreSQL, implement the `IStorage` interface using Drizzle queries against the `db` instance from `server/db.ts`.

3. **Monorepo structure**: Single package with client, server, and shared directories. No workspace setup — just path aliases and a single `package.json`.

## External Dependencies

### Database
- **PostgreSQL** — Required. Connection string via `DATABASE_URL` environment variable. Used with `pg` driver and Drizzle ORM.
- **connect-pg-simple** — Session store for Express sessions (available but not currently wired up)

### Key NPM Packages
- **Frontend**: React, Wouter, TanStack React Query, Radix UI (full suite), Tailwind CSS, shadcn/ui components, react-hook-form, date-fns, embla-carousel, recharts, vaul (drawer), react-day-picker, framer-motion, cmdk
- **Backend**: Express 5, Drizzle ORM, drizzle-zod, Zod, pg
- **Build Tools**: Vite, esbuild, tsx, TypeScript, PostCSS, Autoprefixer
- **Replit Plugins**: `@replit/vite-plugin-runtime-error-modal`, `@replit/vite-plugin-cartographer`, `@replit/vite-plugin-dev-banner`

### Environment Variables
- `DATABASE_URL` — PostgreSQL connection string (required for server and migrations)