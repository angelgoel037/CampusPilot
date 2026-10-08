# CampusPilot 🧭

> **One campus. Thousands of experiences. One personalized feed.**

CampusPilot is a **working hackathon prototype / PWA-style web app** for personalized campus discovery and planning.

Students often have to follow many society pages, WhatsApp groups, posters, emails and notice boards to discover campus opportunities. CampusPilot brings the important information into one place and lets a student personalize what they see.

🌐 **Live Demo:** [Try CampusPilot](https://campus-pilot-zj7h.vercel.app/)

## 📸 CampusPilot in Action

Explore the interface and see how CampusPilot brings campus discovery and planning together.

### 🏠 Personalized Campus Feed

![CampusPilot Home](./campuspilot-home.png)

### 🧭 Explore Campus Opportunities

![CampusPilot Explore](./campuspilot-explore.png)

### 🎯 Personalize Your Interests

![CampusPilot Interests](./campuspilot-interests.png)

### 📅 Plan Your Campus Life

![CampusPilot My Plan](./campuspilot-plan.png)

## What the final prototype demonstrates

🎯 **Interest-based onboarding** — choose Technical, Cultural, Sports, Social, Career, Wellness, Learning & Research, or Important Campus.

❤️ **For You feed** — events are ranked using a transparent weighted recommendation heuristic.

💡 **Explainable recommendations** — the UI shows a match score and reasons such as “Matches your interest” or “Happening this week”.

📢 **Important Campus channel** — institutional notices remain visible even when a student changes interests.

🧭 **Explore** — search and filter the campus catalogue.

📆 **My Plan** — add events to a personal schedule and remove them later.

⚡ **Conflict detection** — overlapping events are automatically flagged.

☑️ **PWA-ready setup** — responsive mobile-first UI and web app manifest.

🛜 **Offline demo data** — 40 curated campus items are included, so the prototype can be demonstrated without a database or API key.

## Important honesty note

The recommendation feature in this prototype is **not a trained AI model**. It is an explainable, deterministic weighted ranking engine designed for the hackathon proof of concept. AI extraction and database integrations are represented behind provider interfaces in the architecture and can be added later.

## Run it on your PC

You need Node.js 18+ (20+ recommended).

```bash
npm install
npm run dev
```

Then open:

`http://localhost:3000`

## Production check

```bash
npm run typecheck
npm run build
npm run start
```

## Deploy

The easiest deployment target for this Next.js project is **Vercel**. Upload this project to GitHub first, then import the repository into Vercel.

No Supabase account or AI API key is required for the demo build.

## Suggested hackathon demo

1. Open CampusPilot.
2. Go to **Interests** and select Technical + Cultural.
3. Return to **For You** and show the ranked recommendations.
4. Point out the **match percentage** and “Why Recommended” explanation.
5. Add an event to **My Plan**.
6. Add another overlapping event to demonstrate the conflict detector.
7. Open **Important Campus** and show that critical institutional notices remain visible.
8. Open **Explore** and filter/search another category.

## Technology

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Zod
- Vitest
- Lucide React
- Modular-monolith / layered architecture
- Deterministic weighted recommendation engine
- Pure conflict-detection domain service

## Project structure

```text
app/                 Next.js UI and API routes
components/          Reusable UI components
docs/                Product, architecture, QA and demo documentation
shared/              Contracts and curated sample data
src/domain/          Pure business rules
src/application/     Application use cases
src/infrastructure/  Repository/provider adapters
team/                Team work and product documentation
```

## Team contribution story

- **Angel** — product scope, content taxonomy, UX/UI, demo flow, curated campus dataset, domain/application wiring and functional prototype integration.
- **Prabhav** — recommendation intelligence, conflict detection.
- Earlier team work also defined the frontend/backend contracts and system architecture documented in `docs/`.

This repository is intentionally packaged as a **proof of work / hackathon MVP**, not as a production college ERP.
