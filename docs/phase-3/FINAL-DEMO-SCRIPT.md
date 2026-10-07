# CampusPilot — Final Hackathon Demo Script

**Document Status:** Phase 3 Final  
**Author / Owner:** Angel (Team Lead & Lead Presenter)  
**Demo Duration:** 3 minutes  
**Brand Statement (verified from team/angel/ux-copy.md):** "One campus. Thousands of experiences. One personalized feed."

> **Presenter Note:** This is the canonical demo script. Do not ad-lib additional features. Stick to the 7 scenes. The goal is to communicate the USP clearly, not to show every feature.

---

## Pre-Demo Setup Checklist

Before presenting, verify:

- [ ] App is loaded at the Onboarding screen (clear any saved state or use incognito mode)
- [ ] Demo data is seeded (run seed script or confirm Supabase demo data exists)
- [ ] AI Hackathon (ci-demo-tech-01) is loaded with deadline: tonight
- [ ] MST Datesheet (ci-demo-acad-01) is loaded as important_campus, importance: critical
- [ ] Wellness session (ci-demo-well-01) is on Oct 19, 16:00-17:30
- [ ] Nukkad Natak (ci-demo-cult-01) is on Oct 19, 16:30-19:00 (creates conflict with Wellness)
- [ ] Browser is on mobile viewport (375px wide) or device mirroring is active

---

## SCENE 1 — THE PROBLEM (25 seconds)

**Presenter says:**

> "Right now, every student on campus is missing something they would have loved — a hackathon they didn't know closed last night, a music open mic they only heard about through a friend's story, or an MST datesheet that got buried under 300 WhatsApp messages.
>
> Campus life is scattered across multiple society Instagram pages, college notice boards, event groups, academic announcements, and sports channels. No single student can track all of this.
>
> CampusPilot brings it together."

**Screen:** Show the problem visually if available (scatterplot of channels) OR keep on the app's loading/welcome screen.

**Time target:** 25 seconds.

---

## SCENE 2 — PERSONALIZATION (30 seconds)

**Presenter says:**

> "When a student opens CampusPilot for the first time, they choose what matters to them."

**Action:** Tap the interest chips:
1. Tap `Technical & Coding`
2. Tap `Cultural & Arts`
3. Tap `Sports & Esports`

**Presenter says:**

> "You don't have to select everything. Just what you care about. CampusPilot handles the rest — and it guarantees that critical academic notices reach you no matter what."

**Action:** Point to the institutional callout:  
*"Important exam datesheets, semester results, and university circulars will always reach you — even if you skip categories."*

**Action:** Tap `Build My Campus Feed`.

**Time target:** 30 seconds.

---

## SCENE 3 — PERSONALIZED HOME (35 seconds)

**Presenter says:**

> "Here is the personalized Home feed. Notice the structure."

**Action:** Point to each section in order:

**Don't Miss** (Section 1):
> "Section 1: Don't Miss. This is urgent. The AI Hackathon registration closes tonight."

Point to the `Closes Tonight` deadline badge on the AI Hackathon card.

**For You** (Section 2):
> "Section 2: For You. These events match the interests we just selected."

Point to:
- AI Hackathon card (Technical match)
- Acoustic Open Mic card (Cultural match)
- Basketball Championship card (Sports match)

**Important Campus** (Section 3):
> "Section 3: Important Campus. This never disappears. The MST datesheet is right here — even though we only selected Technical, Cultural, and Sports."

Point to the MST Datesheet card with CRITICAL NOTICE badge.

**Explore Something New** (Section 4):
> "Section 4: Explore Something New. This deliberately shows something outside your selected interests — today it's a Mindfulness session — so you don't stay in a bubble."

**Time target:** 35 seconds.

---

## SCENE 4 — EXPLAINABILITY (25 seconds)

**Presenter says:**

> "Let's open the AI Hackathon."

**Action:** Tap the AI Hackathon card to open its detail view.

**Presenter says:**

> "See this: 94% match. But we don't leave it at a number."

**Action:** Tap the match badge / expand the explanation.

**Screen shows the reasons:**
- `Matches your Technical interest`
- `Happening today`
- `Registration closes tonight`

**Presenter says:**

> "Every recommendation has a plain English reason traceable to the actual data. No black-box AI magic — just transparent, explainable relevance."

**Time target:** 25 seconds.

---

## SCENE 5 — PERSONAL PLAN (25 seconds)

**Presenter says:**

> "Adding to My Plan is one tap."

**Action:** Tap `+ Add to Plan`. Button changes to `In Plan`.

**Action:** Go back. Tap the Acoustic Open Mic card.

**Action:** Tap `+ Add to Plan` again.

**Action:** Navigate to My Plan tab.

**Presenter says:**

> "My Plan is now a personalized campus schedule. Chronological. Clear. The student's campus life, organized by them."

**Screen shows:** Two events in chronological order in My Plan.

**Time target:** 25 seconds.

---

## SCENE 6 — CONFLICT (25 seconds)

**Action:** Return to Explore. Tap the Mindfulness & Stress Management session (Oct 19, 16:00-17:30).

**Action:** Tap `+ Add to Plan`.

**Action:** Navigate to My Plan.

**Presenter says:**

> "CampusPilot automatically detected a time conflict."

**Screen shows:** `Time Conflict Detected` banner with:  
*"Mindfulness Session and Nukkad Natak both take place on October 19 between 4:00 PM and 5:30 PM. Choose which to attend."*

**Action:** Point to the two resolution buttons: `[Keep Mindfulness Session]` and `[Keep Nukkad Natak]`.

**Presenter says:**

> "The student chooses. One tap resolves the conflict. No double-booking. No regret."

**Time target:** 25 seconds.

---

## SCENE 7 — CLOSE (15 seconds)

**Action:** Navigate back to Home.

**Presenter says:**

> "In three minutes, we showed you CampusPilot's core promise.
>
> WHAT is happening on campus.  
> WHAT matters to you specifically.  
> WHAT you should not miss tonight.  
> WHAT might surprise and delight you.  
> WHAT actually fits into your day without conflicts.
>
> One campus. One place. Personalized for you."

**Time target:** 15 seconds.

---

## Total Demo Time

| Scene | Content | Time |
|-------|---------|------|
| 1 | The Problem | 25s |
| 2 | Personalization | 30s |
| 3 | Personalized Home | 35s |
| 4 | Explainability | 25s |
| 5 | Personal Plan | 25s |
| 6 | Conflict | 25s |
| 7 | Close | 15s |
| **Total** | | **~3 minutes** |

---

## Handling Q&A

Common expected questions and approved answers:

**Q: How do you get the campus data?**  
A: Publishers (societies, departments, organizers) upload a poster or text. Our extraction pipeline structures it into a CampusItem. A human reviewer confirms before it goes live.

**Q: Does the AI learn from student behavior?**  
A: In the MVP, we use deterministic weighted ranking — interest match, time relevance, urgency, and discovery factor. No personal data is used beyond the interests the student explicitly selects.

**Q: Can important notices be missed?**  
A: No. Important Campus items bypass the personalization filter entirely. They are delivered to every student regardless of selected interests.

**Q: What happens if a student selects no interests?**  
A: The app shows a trending campus feed with the informational banner. Important Campus information still appears. The student can set interests anytime from their Profile.

---

## Presenter Notes

- Never say: "Our AI decides what you see."
- Always say: "Your interests decide what you see."
- Never say: "Machine learning" during the demo unless asked directly.
- Always say: "Explainable match" or "plain-language reasons."
- Important Campus section: Always emphasize it appears regardless of interest selection. This is the key trust differentiator.
- The demo must work offline or with pre-seeded data. Do not rely on live scraping or real-time extraction during the demo.
