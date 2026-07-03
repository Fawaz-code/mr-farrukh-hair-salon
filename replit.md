# Mr Farrukh Hair Saloon

Award-winning luxury website for Mr Farrukh Hair Saloon — Islamabad's leading premium salon for ladies and gents. Features cinematic hero, AI receptionist chatbot, online booking, pricing, gallery, team pages, and an admin dashboard.

## Run & Operate

- `pnpm --filter @workspace/mr-farrukh run dev` — run the frontend (port assigned by workflow)
- `pnpm --filter @workspace/api-server run dev` — run the API server
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, Framer Motion, Tailwind CSS v4, Wouter
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (zod/v4), drizzle-zod
- API codegen: Orval (from OpenAPI spec)
- Fonts: Playfair Display (headings), Inter (body), Cormorant Garamond (accents)

## Where things live

- `artifacts/mr-farrukh/src/pages/` — all frontend pages (Home, Services, Pricing, Gallery, Book, Team, Contact, Admin)
- `artifacts/mr-farrukh/src/components/` — shared components including FloatingElements (AI chat, WhatsApp, cursor)
- `artifacts/api-server/src/routes/` — all API route handlers
- `lib/db/src/schema/` — Drizzle table definitions (appointments, services, pricing, gallery, testimonials, staff, contact)
- `lib/api-spec/openapi.yaml` — single source of truth for API contracts

## Architecture decisions

- Dark-luxury aesthetic permanently enforced via `class="dark"` on `<html>` — no light mode toggle
- AI Receptionist uses a smart rule-based engine in `routes/chat.ts` — no external LLM API needed
- WhatsApp booking opens `wa.me/923477268791` with a pre-filled message template
- Admin panel at `/admin` has no auth guard yet — add Clerk auth as a follow-up
- All prices stored in PKR as integers (paise-free)

## Product

- **Home**: Cinematic hero with floating gold particles, stats counters, services teaser, testimonials carousel
- **Services**: 34 services across 6 categories with animated cards
- **Pricing**: 37 price items with category tabs and live search
- **Gallery**: Masonry grid with lightbox
- **Book Appointment**: Multi-step booking wizard with WhatsApp confirmation
- **Hair Experts**: Stylist cards with specializations
- **Contact**: Form + Google Maps embed + floating WhatsApp/call buttons
- **Admin**: Tabbed dashboard managing all content
- **AI Receptionist**: Floating chat widget with smart rule-based responses

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Tailwind v4 does not support `@apply dark;` — dark mode is enforced via `class="dark"` on `<html>` in `index.html`
- Admin mutation endpoints (PATCH/DELETE on services, pricing, staff, etc.) are currently unauthenticated — add Clerk auth middleware before going to production
- Run `pnpm --filter @workspace/api-spec run codegen` after any OpenAPI spec changes before touching frontend code

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
