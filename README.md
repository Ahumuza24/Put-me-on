# PutMeOn

PutMeOn is a Remix-based web app that connects clients with top local service providers. It offers a modern landing experience, streamlined onboarding, and a robust UI system. The design language follows a refined dark theme with teal accents.

## Table of Contents
- Overview
- Features (Current)
- Features (Planned)
- User Roles
- Core User Flows
- Architecture
- Data Model (Planned)
- Security & Compliance
- Performance & Scalability
- Accessibility & Internationalization
- Monetization
- Analytics & Monitoring
- SEO & Sitemap
- Tech Stack
- Project Structure
- Getting Started
- Environment Variables
- Scripts
- Testing Strategy
- Roadmap
- Contributing
- License

## Overview
- Framework: Remix + Vite (React 18, TypeScript)
- Styling: Tailwind CSS (custom theme), Tailwind Animate
- UI: Radix primitives, custom components
- Animations: Framer Motion
- State: Jotai
- Forms: Formspree
- Analytics: Vercel Analytics
- Monitoring: Highlight.io

Key files:
- `app/routes/_index.tsx` – Landing page
- `app/routes/login.tsx`, `app/components/pages/login/login.tsx` – Login page + form
- `app/routes/signup.tsx`, `app/components/pages/signup/signup.tsx` – Signup page + form
- `app/components/ui/*` – Reusable UI primitives
- `app/root.tsx` – Global shell, fonts, analytics, theme
- `tailwind.config.ts` – Design tokens and palette

## Features (Current)
- Landing page sections: hero, featured categories, how it works, testimonials, pricing, newsletter, contact, footer.
- Authentication pages: signup and login with clean, accessible forms and loading states.
- Modern dark theme with teal accent; consistent typography and spacing.
- Reusable UI primitives (buttons, inputs, labels, selects, tooltips, popovers, switches).
- SEO meta with OpenGraph/Twitter; sitemap generation.
- Basic monitoring and analytics hooks.

## Features (Planned)
- Profiles
  - Provider profiles with bio, skills, pricing, availability, portfolio gallery, ratings.
  - Client profiles with saved providers, saved searches, preferences.
- Search & Discovery
  - Full-text search (by skill, location, category).
  - Smart filters, sort by rating/price/popularity.
  - Geo-aware search (within radius).
- Booking & Contracts
  - Request/quote workflow, proposals, acceptance, in-app contracts (service scope, deliverables, deadlines).
- Messaging
  - Real-time chat between clients and providers, attachments, read receipts.
- Payments & Invoicing
  - Escrow-based or milestone payments, payouts to providers, automated invoicing and receipts.
- Reviews & Ratings
  - Post-completion feedback, dispute handling workflow.
- Notifications
  - Email + in-app notifications for requests, messages, approvals, payments.
- Teams & Organizations
  - Multi-user organizations (admins, members), shared billing.
- Admin Panel
  - User management, KYC/verification, disputes, content moderation, metrics dashboard.
- Marketing & Growth
  - Referral program, coupons, featured listings.
- Integrations
  - Stripe (payments), AWS S3 (media), SendGrid/Resend (email), Mapbox/Google Maps (geolocation), Clerk/Auth0 (auth), Sentry (errors).

## User Roles
- Client
  - Discover providers, request services, manage bookings, pay invoices, review providers.
- Provider
  - Manage profile, proposals, bookings, deliverables, payouts, reviews.
- Admin
  - Governance: user verification, disputes, moderation, analytics.

## Core User Flows
- Client onboarding → search → shortlist → message → book → pay → review.
- Provider onboarding → profile setup → proposals → contract → deliver → payout.
- Admin moderation → approvals/flags → dispute resolution → reporting.

## Architecture
```mermaid
flowchart LR
  A[Browser (Remix React)] --> B[Remix Server (Node)]
  B --> C[Routes in app/routes/*]
  C --> D[Services/Libs in app/lib/*]
  D --> E[(Database/API Layer - planned)]
  B --> F[Static Assets /public]
  B --> G[Analytics/Monitoring: Vercel Analytics, Highlight.io]
```

- SSR by Remix for fast TTFB and SEO.
- Client-side hydration for interactivity.
- Planned backend: Postgres + Prisma or Supabase (see Data Model), or an external API gateway.

## Data Model (Planned)
- `users(id, role, name, email, phone, avatar, created_at)`
- `profiles(user_id FK, type, bio, location, skills[], hourly_rate, rating)`
- `listings/provider_services(profile_id FK, title, description, price, tags[], media[])`
- `messages(thread_id, from_user_id, to_user_id, content, attachments[], created_at)`
- `bookings(id, client_id, provider_id, status, scope, milestones[], start/end, total)`
- `payments(id, booking_id, amount, currency, status, method, created_at)`
- `reviews(id, booking_id, rater_id, ratee_id, rating, comment, created_at)`
- `notifications(id, user_id, type, payload, read)`

## Security & Compliance
- OAuth or password-based auth with strong hashing (planned).
- 2FA (planned).
- Role-based access control.
- Rate limiting on APIs.
- Data encryption at rest (provider-dependent) and in transit (TLS).
- GDPR-friendly data export/delete (planned).

## Performance & Scalability
- SSR + code splitting via Remix and Vite.
- Image optimization (planned: CDN + responsive images).
- Caching layers for search results and public pages (planned).
- Background jobs for email, media processing (planned, e.g., queues).

## Accessibility & Internationalization
- Keyboard navigability and ARIA-friendly Radix components.
- High-contrast dark theme.
- i18n framework (planned) for locales, dates, currencies.

## Monetization
- Commission on transactions.
- Subscription tiers for providers (boosted visibility, analytics).
- Featured listings.
- Team/Org plans with seats.

## Analytics & Monitoring
- `@vercel/analytics` in `app/root.tsx` (prod).
- `@highlight-run/remix` initialized in `app/root.tsx` with `HIGHLIGHT_PROJECT_ID`.
- Optional additions: PostHog/Amplitude, Sentry.

## SEO & Sitemap
- Meta via each route’s `meta` export (see `app/routes/_index.tsx`).
- Social cards (OpenGraph, Twitter).
- `remix-sitemap` for generating `sitemap.xml`.

## Tech Stack
- Remix, React 18, TypeScript, Vite
- Tailwind CSS, Radix UI, Framer Motion, Lucide
- Jotai state management
- Formspree for forms (current)
- Planned: Stripe, Prisma/Supabase, S3, SendGrid/Resend

## Project Structure
- `app/components/ui/*` – Primitives: `button.tsx`, `input.tsx`, `label.tsx`, `select.tsx`, `tooltip.tsx`, `switch.tsx`, etc.
- `app/components/*` – Marketing sections like `hero.tsx`, `pricing-section.tsx`.
- `app/routes/*` – Remix routes: `_index.tsx`, `login.tsx`, `signup.tsx`.
- `app/root.tsx` – Global shell, fonts, analytics, theme toggling.
- `tailwind.config.ts` – Theme colors, fonts, animations.

## Getting Started
```bash
npm install
npm run dev
```
Visit http://localhost:5173 in development (Vite HMR).

## Environment Variables
Create `.env` with, at minimum:
```
HIGHLIGHT_PROJECT_ID=your-highlight-project-id
```

## Scripts
- `dev` – Remix + Vite dev
- `build` – Build Remix + generate sitemap
- `start` – Serve production build
- `typecheck` – TypeScript checking

## Testing Strategy
- Unit tests (planned): Vitest + React Testing Library.
- Integration tests (planned): Playwright for critical flows (signup, search, booking).
- Lint/type checks in CI.

## Roadmap

- Phase 1: Foundation (Current)
  - Landing page, auth pages (login/signup)
  - UI primitives, theme, SEO, analytics, monitoring

- Phase 2: Discovery & Profiles
  - Provider profiles, client profile basics
  - Search & filtering, category pages
  - Messaging MVP

- Phase 3: Booking & Payments
  - Quote/contract workflow
  - Payments (Stripe), invoices, receipts
  - Reviews & ratings

- Phase 4: Admin & Scale
  - Admin dashboard, verification/KYC
  - Dispute resolution, moderation tools
  - Performance tuning, caching, S3 media, email integrations

- Phase 5: Growth & Teams
  - Referrals, couponing, featured listings
  - Teams/organizations with roles and shared billing
  - Internationalization

## Contributing
- Use TypeScript and keep components accessible.
- Run `npm run typecheck` and lint/format before PRs.
- Provide screenshots for UI changes.
- Prefer composable components within `app/components/ui/*`.

## License
See `LICENCE` in the repository root.
