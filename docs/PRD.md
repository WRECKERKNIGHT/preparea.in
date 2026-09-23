# PrepArea — Product Requirements Document

Product: PrepArea
Version: MVP v1.0
Product Type: Student study community and accountability platform
Target Users: JEE, NEET, CUET, Boards and other competitive-exam aspirants

---

## 1. Product Overview

PrepArea is a study community designed to help students build consistency during exam preparation.

The product provides students with a focused environment where they can study together, track study time, participate in challenges, stay accountable, interact with other aspirants, and receive practical guidance from experienced aspirants.

PrepArea is not a coaching or teaching platform. It does not replace teachers, coaching, textbooks, test series, or other academic resources.

The MVP will use existing tools such as Zoom, YPT, Telegram, Discord, Google Forms and Google Sheets instead of developing a dedicated application.

## 2. Problem Statement

Students preparing for competitive examinations often have access to sufficient study material but struggle with:

- Consistency
- Accountability
- Distractions
- Studying alone
- Maintaining long study routines
- Lack of a focused study environment
- Lack of interaction with serious aspirants
- Lack of practical guidance from people who have already experienced the preparation journey

PrepArea aims to solve the environment and consistency problem.

## 3. Product Goal

The primary goal of the MVP is:

«Help students show up consistently and study in a focused environment.»

MVP success condition — demonstrate that students:

1. Join the community.
2. Attend study sessions.
3. Track their study time.
4. Participate in challenges.
5. Return repeatedly.
6. Report that PrepArea helps their consistency.
7. Show willingness to continue after the free trial.

## 4. Target Users

Primary users are students aged approximately 13–18 preparing for JEE, NEET, CUET, board and other competitive examinations. The initial MVP should focus on one or two major student segments. Example initial segment: Class 11–12 JEE/NEET aspirants.

## 5. Personas

- **A — The Inconsistent Student.** Has material, procrastinates. Needs accountability, routine, community, external motivation.
- **B — The Lonely Aspirant.** Studies alone, wants connection. Needs virtual study rooms, community, peer interaction, shared goals.
- **C — The Experienced Aspirant.** Wants to help others. Needs a mentor/community role, structured interaction, ability to share experience.

## 6. Core Value Proposition

For students: Study together. Stay accountable. Build consistency.
For mentors: Share your experience and help other aspirants navigate preparation.

## 7. MVP Features

- **7.1 Student Registration** — simple Google Form: name, class, exam, email, optional Telegram/Discord username, approximate daily study target, main consistency challenge. No unnecessary sensitive data.
- **7.2 Onboarding** — welcome message, community link, study-room info, challenge rules, tracking instructions, community guidelines. Minimal friction from registration to first session.
- **7.3 Virtual Study Rooms** — scheduled study sessions on Zoom or similar: Morning/Afternoon/Evening/Night Focus. Before: set target; during: study together; after: report completion.
- **7.4 Study-Time Tracking** — YPT or similar. Record time, see personal progress, join group challenges. Emphasis on personal consistency, not unhealthy competition.
- **7.5 Accountability** — simple daily check: morning "Today's target: 5 hours", evening "Completed: 4.5 hours", result "Tomorrow's target: 5 hours". No shaming for missed targets.
- **7.6 Study Challenges** — first major feature: 7-Day Study Consistency Challenge (set target → study → check in → record progress). Future: 14-day, 30-day, 100-hour, revision.
- **7.7 Community** — Telegram for announcements/challenge updates/reminders; Discord for discussion, study rooms, subject/exam channels, peer interaction.
- **7.8 Mentor Sessions** — experienced aspirants host scheduled sessions on planning, mistakes, school+coaching balance, revision strategy, consistency, exam-day experience. No result guarantees or professional academic claims unless qualified.
- **7.9 Feedback System** — post-challenge: did it help consistency, sessions attended, what was liked, what to improve, join another challenge, willingness to pay, desired features.

## 8. User Flow

Instagram / YouTube / Referral → Landing Info → Google Form → Confirmation → Telegram/Discord → Onboarding → Daily Target → Virtual Study Room → Study-Time Tracking → Daily Check-In → Challenge Progress → Mentor Interaction → Feedback / Retention → Paid Membership Test

## 9. Functional Requirements

- FR-01 Registration, FR-02 Onboarding, FR-03 Study Sessions, FR-04 Tracking, FR-05 Accountability, FR-06 Challenges, FR-07 Community, FR-08 Mentorship, FR-09 Feedback, FR-10 Administration (students, mentors, sessions, challenges, announcements, feedback).

## 10. Non-Functional Requirements

Simplicity (understandable without instructions), reliability (session links/announcements available), privacy (minimal exposure of student info), safety (rules vs harassment/bullying/inappropriate content), scalability (20 students → hundreds without custom software).

## 11. Admin Dashboard — MVP

No custom dashboard. Google Sheets tracks: name, exam, class, registration date, challenge participation, attendance, study hours, feedback, membership status. A real dashboard may come later.

## 12. Technology Stack — MVP

Google Forms (registration) · Google Sheets (database) · Discord (community) · Telegram (announcements) · Zoom (study rooms) · YPT (tracking) · Canva (design) · Instagram (social) · YouTube/Instagram (video).

Principle: do not build custom technology until the business proves demand.

## 13. MVP Launch Plan

- **Phase 1 Setup:** Instagram, Telegram, Discord, Google Form, Google Sheet, study-room schedule, challenge rules, community guidelines.
- **Phase 2 Recruitment:** first 20 students via personal network, Instagram, student creators, referrals, permitted communities.
- **Phase 3 7-Day Challenge:** run first cohort; track registrations, attendance, daily participation, study hours, completion, feedback.
- **Phase 4 Evaluation:** activation, engagement, retention, value, willingness to pay.

## 14. MVP Success Metrics

Registration→participation rate, Day-1→Day-7 retention, challenge completion rate, average study-room attendance, % willing to continue. Example targets: 20 registrations, 15+ attend one session, 10+ active through Day 7, 5+ strong interest to continue, meaningful feedback from a majority.

## 15. Monetization

MVP free. After proving value, test paid membership (~₹199–399/month): structured accountability, premium study rooms, additional challenges, selected mentor sessions, progress tracking, premium community areas. Validate pricing with real users.

## 16. Roadmap

V1 Community MVP (existing tools) → V2 Organized Community (scheduling, automated reminders, progress tracking, leaderboards, mentor management) → V3 PrepArea Platform (accounts, dashboard, timer, streaks, study groups, analytics, virtual rooms, mentor profiles, challenges, notifications) → V4 Mobile App (only after the community model is proven).

## 17. Future Features

Personal dashboard (hours, streak, weekly progress, goals, challenges), accountability groups, smart study rooms (by exam/class/duration/timezone/subject), mentor marketplace, achievement badges (7/14/30-day streaks, challenge completion) — avoid rewards for excessive study hours or unhealthy competition.

## 18. Community Rules

Respect members · no bullying · no harassment · no spam · no inappropriate content · no cheating-related help · no sharing private info · no guaranteed-rank/selection claims · mentors don't misrepresent qualifications · respectful academic disagreement.

## 19. Out of Scope for MVP

Custom mobile app, custom video conferencing, AI tutor, large content library, full LMS, test series, payment infrastructure, recommendation engine, advanced analytics, physical study centers.

## 20. Risks & Mitigations

- **Empty rooms** → structure sessions; founders participate.
- **Low retention** → improve onboarding, challenges, accountability.
- **Low willingness to pay** → identify real premium value before charging.
- **Mentor quality** → verify mentors, set expectations.
- **Community safety (minors)** → strong moderation, privacy rules, adult oversight.

## 21. Product Principle

Every feature must answer: «Does this help students study more consistently in a safe, focused environment?»

## 22. Core Product Loop

Set Goal → Join Study Room → Study → Track → Check In → Receive Accountability → See Progress → Return Tomorrow.

## 23. One-Sentence Summary

PrepArea is a study-community platform that helps competitive-exam aspirants study together, track their progress, stay accountable, build consistency, and access practical guidance from experienced aspirants.

## 24. Immediate Development Priority

The first version does NOT require developers. Build the MVP manually with Google Forms + Sheets + Telegram + Discord + Zoom + YPT. First milestone: 20 students → 7 days → measurable participation → feedback → willingness to continue. Only after that evidence should you invest in custom technology.

> Note: The technical plan (`PLAN.md`) and repository implement a website + mobile app (Next.js API over Google Sheets + Expo) to operate this community at a slightly larger scale while preserving the manual tools wherever they suffice.