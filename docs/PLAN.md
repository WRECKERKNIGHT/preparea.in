# PrepArea — Technical Plan (MVP: Website + Mobile App)

Status: APPROVED v0.2 — decisions confirmed; building Milestone 0

---

## 1. Decisions

These decisions were made with the PRD in mind. Call them out if you disagree.

| Area | Decision | Why |
|---|---|---|
| Website | **Next.js** (App Router, TypeScript) | Landing + registration + web dashboard in one deploy; API routes live here too |
| Mobile app | **Expo (React Native)** | One codebase for iOS + Android, fast iteration, no native toolchain needed for MVP |
| Backend/API | **Next.js API routes** (served by the website) | Both website and app call one API; no separate server to run |
| Database | **Google Sheets** via a Google **Service Account** (server-side) | Matches PRD "Do not build custom tech"; Sheets stays the system of record |
| Auth | **Email OTP (magic-code)**, no passwords | Target users are minors; no password hashing/storage; simple, safe. **APPROVED** |
| Backend/API | **Thin Next.js API layer over Sheets** | Needed for accounts, tracking, check-ins. **APPROVED** |
| Web dashboard | **Light web dashboard included**, classic/no-slop design | Approved (section 1b) |
| Study-time tracking | In-app **timer + manual entry**, plus optional YPT sync later | YPT (PRD) is external; the app needs its own recording mechanism |
| Admin | Edit the **Google Sheet directly** + seed scripts | No custom admin dashboard in MVP (PRD §11) |
| Hosting | Vercel (web + API), EAS (app builds) | Free tiers fit MVP scale (20 → hundreds) |

---

## 1b. Design system — Classic / No Slop

**Style direction:** Swiss Modernism / Editorial Minimal — strict 12-column grid, mathematical spacing (8px base), no gradients, no glassmorphism, no playful flourishes. High contrast, generous white space, fast load.

### Colors

| Token | Hex | Tailwind | Role |
|-------|-----|----------|------|
| `ink` | #0F172A | slate-900 | Headings, primary text |
| `ink-muted` | #334155 | slate-700 | Body text, secondary |
| `ink-faint` | #94A3B8 | slate-400 | Captions, muted labels |
| `paper` | #FBFAF8 | custom `paper` | Page background (warm off-white) |
| `paper-raised` | #FFFFFF | white | Cards, modals, inputs |
| `paper-border` | #E7E5E4 | stone-200 | Borders, dividers |
| `accent` | #0F766E | teal-700 | Primary accent, CTA, links |
| `accent-hover` | #115E59 | teal-800 | CTA hover / active |
| `accent-light` | #CCFBF1 | teal-100 | Accent backgrounds, badges |
| `success` | #16A34A | green-600 | Success states |
| `error` | #DC2626 | red-600 | Errors |

**Rules:** Single accent only (teal). No gradient backgrounds. CTA = solid teal button with white text. Warm paper background throughout — never pure white page (exception: cards on the paper are white).

### Typography

| Role | Font | Weights | Source |
|------|------|---------|--------|
| Headings | Newsreader | 400, 500, 600, 700 | Google Fonts |
| Body/UI | Inter | 400, 500, 600, 700 | Google Fonts |

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;0,6..72,700;1,6..72,400&display=swap');
```

- H1: Newsreader 600, 2.25rem, leading-tight
- H2: Newsreader 500, 1.5rem
- Body: Inter 400, 1rem/1.6
- Labels/UI: Inter 500, 0.875rem
- Data/table: Inter 400, 0.875rem, tabular-nums

### Icons

Lucide React (SVG, stroke-based, 24×24 default). No emojis as UI elements.

### Effects

- Hover transitions: `transition-colors duration-200` only (no scale transforms)
- Border-radius: 6px max (cards, buttons) — 0px for sections/dividers
- Shadows: `0 1px 3px rgba(15,23,42,0.06)` (very subtle) — no heavy shadows
- Prefers-reduced-motion: always respected
- No animated backgrounds or gradient transitions

### Anti-slop rules

- No gradient buttons or text gradients
- No glowing effects
- No purple / violet / neon
- No rounded-full on large elements
- No emoji icons
- No glassmorphism/transparency on text-bearing elements
- No Comic Neue, Baloo, Poppins, or overly geometric/childish fonts
- No drop shadows > 0 4px 12px

---

## 2. Architecture

```
Browser (Next.js site)
   │
   ├── Landing / Register / Web dashboard
   ▼
Next.js (Vercel)  ──────  API routes (/api/*)
   │                          │
   │                          │ JWT (session tokens)
   │                          ▼
   │                 preparea-sheets  (Google Service Account)
   │                          │
   │                          ▼
   │                  Google Sheets (the "database")
   │
   │   Email OTP via SMTP (Gmail app password / Resend)
   └── Expo app (iOS + Android) ──► same /api/*
```

- The **system of record is Google Sheets**. The API is the only thing that reads/writes it.
- The **service account** holds a JSON credential file (never committed, stored in env vars).
- No third-party backend (no Firebase/Supabase) in this MVP — the PRD explicitly says don't build custom tech until demand is proven, and Sheets keeps ops to zero.

---

## 3. Repository layout (monorepo)

```
preparea/
  apps/
    web/        Next.js — landing, registration, web dashboard, API routes
    app/        Expo — mobile app (shared routes matching the API)
  packages/
    shared/     TypeScript types + validators shared by web and app
  sheets/       Service-account-based Sheets client + schema helpers
  scripts/      Seeding: create challenge, add sessions/rooms, watch tests
  docs/         PRD and this plan
```

One repo, one install, shared types. Two entry points: the website `apps/web` and the app `apps/app`.

---

## 4. Data model → Google Sheets tabs

One spreadsheet `PrepArea-MVP` with one tab per entity. Header row on each tab (no merged cells, no charts — keep it machine-parseable).

| Tab | Columns |
|---|---|
| `students` | id, name, class, exam, email, tg_username, discord_username, daily_target_min, main_consistency_challenge, status (new/active/inactive), created_at |
| `otps` | email, code_hash, purpose (verify/login), expires_at, used_at (server-side tab) |
| `rooms` | id, name (Morning Focus…), day, time, duration_min, zoom_link, exam_focus, active |
| `sessions` | id, room_id, date, host_name, attendance |
| `study_logs` | id, student_id, date, minutes, room_id |note, source (timer/manual) |
| `checkins` | id, student_id, date, target_min, completed_min, message, status (hit/miss/partial), createdAt |
| `challenges` | id, name, type (7day/14day/30day/100hr/revision), start_date, end_date, rules, active |
| `challenge_participants` | challenge_id, student_id, joined_at |
| `mentor_sessions` | id, mentor_name, topic, date, time, zoom_link, notes, recording_link |
| `feedback` | id, student_id, helps_consistency, sessions_attended, liked, improve, join_again, would_pay, features, submitted_at |
| `settings` | key, value (e.g. current challenge id, announcement text) |

Mentors are kept in `students` with `status = mentor` (PRD persona C) rather than a separate table in the MVP.

---

## 5. API surface (`/api/*`)

All routes are JSON. Auth = JWT passed as `Authorization: Bearer <token>`.

| Method | Path | Purpose | Auth |
|---|---|---|---|
| POST | `/api/register` | Create student from website form / app | public |
| POST | `/api/auth/request-otp` | Send email OTP for verification or login | public |
| POST | `/api/auth/verify-otp` | Verify code → return JWT | public |
| GET | `/api/me` | Own profile + current streak + stats | JWT |
| PATCH | `/api/me` | Update daily target / preferences | JWT |
| GET | `/api/rooms` | Upcoming / active study rooms | JWT |
| POST | `/api/study-logs` | Log minutes (from timer or manual) | JWT |
| POST | `/api/checkins` | Evening check-in (target vs completed) | JWT |
| GET | `/api/challenges` | Active + own participation status | JWT |
| POST | `/api/challenges/:id/join` | Join a challenge | JWT |
| GET | `/api/challenges/:id/progress` | Per-day progress for the student | JWT |
| GET | `/api/mentor-sessions` | Upcoming mentor sessions | JWT |
| POST | `/api/feedback` | Submit feedback form | JWT |
| GET | `/api/settings` | Announcements, current challenge banner | public |

Rate limits on OTP and register (prevent spam). All writes validate against shared types.

---

## 6. Auth flow (email OTP)

1. Student registers (website form or app) → `POST /api/register` → row in `students`, status `new`.
2. Onboarding: enter email → `POST /api/auth/request-otp` → 6-digit code by email, valid 10 min.
3. `POST /api/auth/verify-otp` → JWT issued (7 days). Stored in secure storage on mobile, httpOnly cookie on web.
4. Every time a logged-out or new student opens the app, they verify email again (no forgotten passwords).

No passwords → no password reset, no breach risk from credential reuse. Appropriate for a minor audience (PRD §18, §20 safety).

---

## 7. Website screens (`apps/web`)

1. **Landing** — value prop, how it works, features, community rules (PRD §1, §18)
2. **Registration** — Google-form-style fields: name, class, exam, email, optional TG/Discord, daily study target, consistency challenge (PRD §7.1)
3. **Success/Confirmation** — welcome copy, community links, what happens next (PRD §7.2)
4. **Web dashboard** (light) — today's target, check-in button, weekly summary, room links — primarily the app, but a working web fallback costs little since the API is shared
5. **Static pages** — features, mentors, FAQ, code of conduct

---

## 8. App screens (`apps/app`) — Expo

Navigation: bottom tabs + stacks.

| Screen | Purpose |
|---|---|
| Onboarding | Register → verify email → set target → community links |
| Dashboard | Today's target, streak, check-in CTA, weekly bar chart, current challenge banner |
| Study Rooms | Schedule list, join (opens Zoom deep link), in-room timer starts |
| Timer / Log | Start/stop study timer → writes `study_logs`; manual entry option |
| Check-in | Morning target set + evening "completed X of Y" (PRD §7.5) |
| Challenges | Active challenge, per-day progress grid (Day 1–7), rules, join |
| Community | Telegram / Discord deep links, mentor session cards, announcements |
| Profile | Personal stats, edit target, privacy note, logout |

Study-time tracking emphasis is *personal consistency*, not leaderboards (PRD §7.4, §17 rewards).

---

## 9. Admin / maintenance workflow (no custom dashboard)

- Founder edits `rooms`, `challenges`, `mentor_sessions`, `settings` directly in the Sheet (they're header-row tables, human-readable).
- `scripts/` helpers: `seed-rooms.ts`, `seed-challenge.ts`, `sync-attendance.ts` (from Zoom report), `watch-tests.ts`.
- Web app and mobile app read everything through the API, so a sheet edit is live immediately.

---

## 10. Build milestones

| # | Milestone | Deliverable |
|---|---|---|
| 0 | Scaffold | Monorepo, Expo app shell, Next.js app, shared types, CI check |
| 1 | Sheets service | Service-account client, schema setup script, CRUD helpers |
| 2 | Auth | OTP request/verify, JWT, register route, email sending |
| 3 | Web | Landing, registration, confirmation, web dashboard, static pages |
| 4 | App core | Onboarding, dashboard, profile, secure token storage |
| 5 | Study loop | Rooms list, timer, study log, daily check-in |
| 6 | Challenges | Join, per-day progress grid, challenge rules |
| 7 | Feedback + community | Feedback form, community deep links, mentor sessions |
| 8 | Hardening | Rate limits, validation, error states, tests, Vercel + EAS deploy |

Suggested order follows the PRD's core loop: registration → study room → track → check-in → progress → return (PRD §22).

---

## 11. Cost / effort

| Item | Cost |
|---|---|
| Vercel (web + API) | Free tier |
| EAS (app build) | Free tier for small use |
| Google Workspace service account | Free |
| Email sending (SMTP/Resend) | Free–small |
| Google Sheets | Free |

---

## 12. Risks & mitigations (aligned to PRD §20)

- **Private student data on Sheets** → service account is server-only; the sheet is never shared publicly; only founders get editor access via their own Google accounts; API never exposes other students' data.
- **OTP email deliverability** → use a real SMTP/Resend domain; log failures; allow resend cooldown.
- **Rate limits / abuse** → OTP cooldown + max attempts; register throttling; sheets calls cached where safe.
- **App store review for minor audience** → form requires no unnecessary PII (PRD §7.1); privacy policy page required for store submission.

---

## 13. What I need from you (setup items, not blocking build start)

1. A Google account to create the `PrepArea-MVP` spreadsheet
2. Google Cloud project + service account JSON (I'll give exact steps)
3. Email sender (Gmail app password, or Resend API key) for OTPs
4. Confirmation of the study-room schedule and first challenge dates
5. Brand/colors/logo preference (Canva asset, per PRD §12) or a placeholder
6. Google Form → decide: keep Google Form separate, or use the custom registration form on the website? (Recommendation: custom form on the site; the form already IS on the site)

---

## 14. Approval gate

- [x] Thin API layer on top of Sheets — **approved**
- [x] Email OTP login without passwords — **approved**
- [x] Light web dashboard (classic, no-slop design, PLAN §1b) — **approved**

Build in progress: Milestone 0 (scaffold).