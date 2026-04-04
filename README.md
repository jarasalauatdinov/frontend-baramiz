# Baramiz Frontend

Premium, mobile-friendly React frontend for the Baramiz AI-assisted tourism platform focused on Karakalpakstan.

This app is web-first, but the architecture intentionally keeps data access, screen structure, and business-flow logic simple enough to adapt later for Expo / React Native demo usage.

## Main App Tabs

The mobile shell is now organized around a fixed bottom tab bar:

- `Home`
- `Service`
- `Route`
- `Saved`
- `Profile`

`Service` is now the main category-driven travel helper surface. `Home` stays focused on the first impression, featured places, and route generation instead of trying to own all discovery logic.

## Languages And Header System

The app now ships with a lightweight app-level i18n system and reusable mobile header pattern.

Supported UI languages:

- `uz`
- `ru`
- `en`
- `kaa`

Implementation notes:

- language selection is stored in `localStorage` under `baramiz.language` and restored on next launch
- static UI copy is translated through `src/shared/i18n`
- translation catalogs are grouped by namespace-style keys such as `common.*`, `tabs.*`, `home.*`, `service.*`, `route.*`, `saved.*`, `profile.*`, `auth.*`, and `errors/state.*`
- the compact `AppHeader` supports title-only, back navigation, header actions, and an inline language switcher
- the active language is passed centrally through the query/hooks layer so backend calls can request localized content without page-level query-string hacks

### Translation file structure

- `src/shared/i18n/en.ts` - canonical message key set and `TranslationKey` source
- `src/shared/i18n/uz.ts`
- `src/shared/i18n/ru.ts`
- `src/shared/i18n/kaa.ts`
- `src/shared/i18n/provider.tsx` - current language state, persistence, and `t(...)`
- `src/shared/i18n/index.ts` - supported languages plus locale mapping helpers

### App header usage

The public mobile app uses the shared `AppHeader` across:

- Home
- Service hub
- Service category
- Service item detail
- Places
- Place detail
- Route Generator
- Route Result
- Saved / Booking
- Profile
- Login
- Register
- Not Found

## Stack

- React 19
- TypeScript
- Vite
- React Router
- TanStack Query
- React Hook Form + Zod
- Framer Motion

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create an environment file:

```bash
copy .env.example .env
```

3. Start the frontend:

```bash
npm run dev
```

4. Make sure the backend is running from the sibling repository:

```bash
cd ../backend-Baramiz
npm install
npm run dev
```

Frontend default URL:

- `http://localhost:5176`

Recommended frontend API base URL for local development:

- `VITE_API_BASE_URL=/api`

Recommended Vite proxy target for local development:

- `VITE_API_PROXY_TARGET=http://localhost:3000`

## Scripts

- `npm run dev` - start local Vite dev server on port `5176`
- `npm run build` - TypeScript check + production build
- `npm run preview` - preview the built app on port `4176`
- `npm run typecheck` - run TypeScript validation only

## Environment Variables

Create `.env` from `.env.example`.

| Variable | Required | Default | Description |
| --- | --- | --- | --- |
| `VITE_API_BASE_URL` | Yes | `/api` | Frontend API base URL. Keep this relative in local dev so Vite proxy avoids CORS issues. |
| `VITE_API_PROXY_TARGET` | No | `http://localhost:3000` | Backend origin used by the Vite dev proxy for `/api` requests |
| `VITE_DEFAULT_LANGUAGE` | No | `en` | Default public language sent to backend endpoints |

## Pages And Routes

- `/` - home screen with hero, featured places, city highlights, route CTA, and Service handoff
- `/login` - public mobile auth screen for returning users
- `/register` - public mobile auth screen for new users
- `/places` - destination listing with city/category filters and local search
- `/places/:placeId` - place detail screen with richer content lookup, gallery, metadata, map CTA, and related suggestions
- `/service` - Service tab hub with category collections for travel and local utility needs
- `/service/services`
- `/service/history-and-culture`
- `/service/nature`
- `/service/museums-and-exhibitions`
- `/service/restaurants`
- `/service/sightseeing`
- `/service/hotels`
- `/service/taxi`
- `/service/hospitals`
- `/service/pharmacies`
- `/service/atms`
- `/service/:categorySlug/:itemSlug` - backend-driven Service item detail screen
- `/route-generator` - critical AI planning flow for city, interests, and route generation
- `/route-result` - generated route result view with ordered stops and continuation CTAs
- `/saved-booking` - lightweight saved route and booking shortcut screen for mobile demos
- `/profile` - guest-friendly profile screen with auth entry points and signed-in account state
- `/services` - legacy compatibility redirect to `/service/services`
- `/guides` - guide discovery page with fast contact actions
- `/events` - future-ready events screen with graceful fallback while dedicated backend events are not exposed
- `/admin/places` - lightweight MVP admin for listing, creating, editing, deleting, and translating places
- `*` - not found fallback page

## Folder Structure

```text
src/
  app/                Providers, router setup, and global styles
  features/
    admin/            Admin forms UI
    auth/             Backend-auth session provider and validation schemas
    route/            Route result session storage
  shared/
    api/              Typed API client, normalization, core data helpers
    i18n/             Translation catalogs, helpers, and language provider
    lib/              Config, icons, query client, storage, utilities
    types/            Shared API and domain types
    ui/               App shell, generic layouts, loading/error states
  entities/
    service/          Service hub cards and category item cards
    place/            Place card UI and entities
    route/            Route stop card
    content/          Reusable content/service/guide cards
  hooks/              TanStack Query hooks
  pages/              Route-based screens
```

## Backend Integration Notes

### Active Day 2 contract used by the main app

These are the endpoints the current public-first app depends on directly:

Public:

- `GET /api/categories`
- `GET /api/places`
- `GET /api/places/:id`
- `GET /api/service/sections`
- `GET /api/service/sections/:slug`
- `GET /api/service/sections/:slug/items`
- `GET /api/service/sections/:slug/items/:itemSlug`
- `POST /api/routes/generate`

Auth:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/auth/logout`

Admin:

- `GET /api/admin/places`
- `POST /api/admin/places`
- `PUT /api/admin/places/:id`
- `DELETE /api/admin/places/:id`
- `POST /api/admin/translate`

### Optional endpoints and graceful fallbacks

These are treated as optional today and must not break the app if unavailable:

Public:

- `GET /api/cities`
- `GET /api/content`
- `GET /api/content/:id`
- `GET /api/content/:id/related`
- `GET /api/health`
- `POST /api/chat`
- `GET /api/guides`
- `GET /api/services`
- `GET /api/events`

Current behavior:

- Home, Places, and Route Generator no longer rely on `/api/cities`; city summaries are derived from `/api/places`.
- `GET /api/categories` is treated as a required contract endpoint now; the frontend no longer swaps in seeded category data if it fails.
- Home no longer relies on `/api/content`, `/api/guides`, `/api/services`, or `/api/events` to render safely.
- Places and Place Detail now use the real place contract fields from `/api/places` and `/api/places/:id`, including `slug`, `shortDescription`, `duration`, `image`, `gallery`, and `tags`.
- Place detail can still enrich from `/api/content/:id`, but degrades gracefully if that content endpoint is unavailable or the content ids do not line up yet.
- The Service hub, Service category pages, and Service item detail pages are driven by `/api/service/sections`, `/api/service/sections/:slug`, `/api/service/sections/:slug/items`, and `/api/service/sections/:slug/items/:itemSlug`.
- Route Generator only shows `city + interests + generate` in the UI. The frontend sends `city`, `interests`, and `language`; the backend default duration is applied when `duration` is omitted.

### Data-handling rules in the app

- The frontend keeps API contracts typed and centralized in `src/shared/api` and `src/shared/types`.
- Loading, empty, and error states are handled on every major screen.
- Public place detail intentionally enriches `/api/places/:id` with `/api/content/:id` when available.
- Route results are generated by the backend and only persisted locally for screen-to-screen continuity.
- Selected language is passed centrally through the query layer to categories, places, place detail, service sections, service section items, service item detail, and route generation.
- Service section and service item media URLs are normalized against the backend origin so backend-hosted assets render correctly in the app shell.
- Admin translation remains backend-owned through `/api/admin/translate`.
- Dev CORS issues are avoided by using a relative `/api` base URL together with the Vite proxy target.

## Auth Access Assumptions

Authentication is intentionally lightweight in the product flow, with a real backend-token session flow:

- `Home`, `Service`, `Places`, `Route Generator`, and `Route Result` stay public
- `Login` and `Register` are available as app screens but do not gate discovery
- `Profile` adapts between guest and signed-in states
- `Saved/Booking` remains viewable without auth, but sign-in is positioned as the path to future sync and booking persistence

Current auth truth:

- `POST /api/auth/register` and `POST /api/auth/login` create the session
- the backend bearer token is stored locally for session continuity
- `GET /api/auth/me` is called on app load when a stored token exists so the frontend can restore the current user
- expired or malformed stored sessions are cleared before they can leave the app in a stale signed-in state
- `POST /api/auth/logout` is called when the user signs out, while the frontend clears local session state immediately for a fast mobile transition
- `Profile` shows guest entry points when signed out and account info plus logout when signed in
- auth supports profile and saved readiness, but it does not block discovery or route generation

### Login and register routes

- `/login` - backend-auth login form with email and password
- `/register` - backend-auth registration form with name, email, and password

### Session persistence behavior

- auth data is stored in `localStorage` under `baramiz.auth.session`
- the stored payload includes `user`, `token`, and `expiresAt`
- session restore is validated against `GET /api/auth/me`
- invalid or expired sessions are removed automatically

## Future Multilingual Backend Support

Static UI is localized now, but richer backend multilingual content is still a future integration step.

Recommended backend follow-up:

- localized names/descriptions for places, guides, services, and events across every public endpoint
- broader multilingual enrichment for place detail content if `/api/content` remains part of the stack
- multilingual route summaries and stop copy from `/api/routes/generate`
- authenticated saved/booking persistence tied to real user accounts

What is localized today:

- bottom tab labels
- app headers and shared buttons
- Home, Service, Service detail, Places, Place detail, Route Generator, Route Result, Saved / Booking, Profile, Login, Register, Not Found
- loading, empty, and error states on the main mobile app flow

What still depends on backend content localization later:

- place names and descriptions
- service item names and descriptions
- guide, event, and other directory content strings returned by the API
- generated route titles and summaries

## Mobile / Expo Adaptation Strategy

This frontend is built to stay Expo-compatible in spirit later:

- business logic is separated from browser presentation
- API access is centralized and reusable
- Service categories and item models are isolated from page components so the same data contracts can later drive React Native screens
- route generation flow is form-based and tap-friendly
- public pages avoid hover-only critical interactions
- admin uses stacked cards and forms instead of dense tables
- route result and place detail screens are structured like mobile-friendly screens already
- route-level lazy loading keeps the web app lighter without changing feature boundaries

For a later Expo adaptation, the main reuse path is:

1. keep `src/api`, `src/types`, and request contracts
2. mirror page flows as mobile screens
3. re-implement presentational components with React Native primitives
4. preserve TanStack Query patterns and backend contracts

## Design Direction

The UI system in this repository follows these principles:

- premium neutral base with restrained teal and warm desert accents
- strong information hierarchy over decorative clutter
- large imagery where it adds tourism value
- smooth but limited motion
- responsive layouts designed for phone-sized screens first, not desktop-only patterns

## Local Run Commands

Frontend only:

```bash
cd C:\Users\HP\Desktop\frontend-baramiz
npm install
copy .env.example .env
npm run dev
```

Backend only:

```bash
cd C:\Users\HP\Desktop\backend-Baramiz
npm install
npm run dev
```

Production build check:

```bash
cd C:\Users\HP\Desktop\frontend-baramiz
npm run build
```
