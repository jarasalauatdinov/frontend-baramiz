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

- language selection is stored locally and restored on next launch
- static UI copy is translated through `src/shared/i18n`
- the compact `AppHeader` supports title-only, back navigation, header actions, and an inline language switcher
- the active language is also passed through query hooks so backend calls can request localized content later

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
- `/route-generator` - critical AI planning flow for city, interests, duration, and route generation
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
    auth/             Local auth/session MVP and validation schemas
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

### Required endpoints for first-phase stability

These are the endpoints the core demo flow depends on:

Public:

- `GET /api/health`
- `GET /api/categories`
- `GET /api/places`
- `GET /api/places/:id`
- `POST /api/routes/generate`
- `POST /api/chat`

Admin:

- `GET /api/admin/places`
- `POST /api/admin/places`
- `PUT /api/admin/places/:id`
- `DELETE /api/admin/places/:id`
- `POST /api/admin/translate`

### Optional endpoints and graceful fallbacks

These may be missing without breaking the first-phase pages:

Public:

- `GET /api/cities`
- `GET /api/content`
- `GET /api/content/:id`
- `GET /api/content/:id/related`
- `GET /api/service-categories`
- `GET /api/guides`
- `GET /api/services`
- `GET /api/events`
- `GET /api/utility/taxi`
- `GET /api/utility/hospitals`
- `GET /api/utility/pharmacies`
- `GET /api/utility/atms`

Current behavior:

- Home, Places, and Route Generator no longer rely on `/api/cities`; city summaries are derived from `/api/places`.
- Home no longer relies on `/api/content`, `/api/guides`, `/api/services`, or `/api/events` to render safely.
- Place detail can still enrich from `/api/content/:id`, but degrades gracefully if that content endpoint is unavailable.
- The Service hub is backend-ready for `/api/service-categories`, but ships with a seeded mobile category catalog if that endpoint is not available yet.
- Service category detail pages use `/api/places` for discovery categories where possible, `/api/services` for hotels/restaurants/general services, and seeded fallback utility data for taxi, hospitals, pharmacies, and ATMs until dedicated endpoints arrive.

### Data-handling rules in the app

- The frontend keeps API contracts typed and centralized in `src/shared/api` and `src/shared/types`.
- Loading, empty, and error states are handled on every major screen.
- Public place detail intentionally enriches `/api/places/:id` with `/api/content/:id` when available.
- Route results are generated by the backend and only persisted locally for screen-to-screen continuity.
- Admin translation remains backend-owned through `/api/admin/translate`.
- Dev CORS issues are avoided by using a relative `/api` base URL together with the Vite proxy target.

## Auth Access Assumptions

Authentication is intentionally lightweight in the current MVP:

- `Home`, `Service`, `Places`, `Route Generator`, and `Route Result` stay public
- `Login` and `Register` are available as app screens but do not gate discovery
- `Profile` adapts between guest and signed-in states
- `Saved/Booking` remains viewable without auth, but sign-in is positioned as the path to future sync and booking persistence

The current auth flow is frontend-local and demo-friendly. It is ready to be replaced with backend auth later without changing the public-product flow.

## Future Multilingual Backend Support

Static UI is localized now, but richer backend multilingual content is still a future integration step.

Recommended backend follow-up:

- localized names/descriptions for places, services, and utility entries
- language-aware `service-categories` payloads
- multilingual route summaries and stop reasons from `/api/routes/generate`
- authenticated saved/booking persistence tied to real user accounts

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
