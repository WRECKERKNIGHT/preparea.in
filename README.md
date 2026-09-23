# PrepArea

Study together. Stay accountable. Build consistency.

A study community for JEE, NEET, CUET and board exam aspirants. Virtual study
rooms, daily check-ins, consistency challenges and mentor sessions — for web
and mobile, off one shared API.

## Repository layout

| Path | What it is |
|------|------------|
| `apps/web` | Next.js website + API (landing, registration, dashboard, `app/api/*`) |
| `apps/app` | Expo / React Native mobile app (iOS + Android) |
| `packages/shared` | TypeScript types + validators shared by web and app |
| `docs/` | PRD, technical plan |
| `PLAN.md` | Approved technical plan incl. design system |

## Quick start (web)

```bash
cd apps/web
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000.

Without any credentials the app runs on a built-in **mock store** — log in with
`demo@preparea.in`, request a code, and the dev code is shown on screen. Once
you configure `GOOGLE_SERVICE_ACCOUNT` + `GOOGLE_SPREADSHEET_ID` the same API
reads/writes Google Sheets (see `PLAN.md` for the tab schema).

## Quick start (mobile)

```bash
cd apps/app
npm install
npm run link:shared   # links ../../packages/shared into node_modules
npm start             # then scan with Expo Go
```

`@preparea/shared` is resolved by Metro through that junction (see
`apps/app/AGENTS.md`). Re-run `npm run link:shared` after any clean install.

Point the app at the web API by setting `LAN_BASE` in
`apps/app/src/constants/config.ts` — your computer's LAN IP while developing,
or the deployed API URL in production.

## Design

Classic editorial minimalism — see `PLAN.md` §1b. Strict three-part palette
(warm ivory paper, warm ink, deep forest-green accent), Newsreader serif
headings + Inter UI on both web and mobile, Lucide icons, no gradients,
subtle 200ms hovers, prefers-reduced-motion respected.

## API

All routes live in `apps/web/app/api/*` and are shared by web + mobile. Auth is
email OTP (no passwords) with a signed bearer JWT. See `PLAN.md` §5 for the
full surface.

## Docs

- `docs/PRD.md` — product requirements
- `docs/PLAN.md` — technical plan, data model, API surface, milestones
- `apps/app/AGENTS.md` — Expo SDK 57 conventions for working in the app