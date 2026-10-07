# CampusPilot — Product Definition of Done

**Document Status:** Phase 3 Final  
**Author / Owner:** Angel (Team Lead & Product QA)  
**Purpose:** The product is considered complete ONLY when every item in this document is checked.  
**Usage:** Run this checklist before the final hackathon submission.

---

> ### Instructions
> Mark each item as:
> - `[x]` DONE — Confirmed working
> - `[-]` SKIP — Not applicable to MVP (document reason)
> - `[!]` BLOCKED — Blocked by dependency (document blocker)
>
> The demo may proceed only when all HIGH-priority items are checked.

---

## PRODUCT

**The core student experience works end-to-end.**

- [ ] Core student journey works: Onboard → Select Interests → Discover → Save → Plan → Act
- [ ] Personalization is understandable: student can explain why an item appeared in their feed
- [ ] Important Campus content cannot disappear regardless of selected interests
- [ ] Discovery works: student can browse the full campus beyond their personalized feed
- [ ] My Plan works: events are added, ordered, and removable
- [ ] Conflict state is understandable: student knows two events clash and can resolve it
- [ ] Product USP is obvious within 30 seconds of opening the app for the first time
- [ ] UX copy matches canonical terminology (For You, Don't Miss, Important Campus, Explore Something New, My Plan, Add to Plan, Time Conflict Detected)
- [ ] No anti-hallucination violations: all recommendation reasons are traceable to actual data

---

## FRONTEND

**The interface is production-quality and mobile-first.**

- [ ] Mobile experience works on 360px viewport (iPhone SE)
- [ ] Mobile experience works on 430px viewport (iPhone 15 Pro Max)
- [ ] All primary action buttons are functional (Add to Plan, Register Now, Keep Event, Remove from Plan)
- [ ] Loading states are handled (no flash of empty content)
- [ ] Empty states are handled (My Plan empty, No search results, No alerts)
- [ ] Error states are handled (app does not crash on API failure)
- [ ] UX follows the canonical product specification from Phase 2
- [ ] 4-section homepage hierarchy renders in correct order on all viewports
- [ ] Category filter chips use canonical category constants (not hardcoded strings)
- [ ] Bottom navigation is usable and touch-friendly
- [ ] Text contrast meets WCAG AA standard
- [ ] Focus rings visible on interactive elements
- [ ] Badges use text + color, not color alone
- [ ] No horizontal scroll overflow on mobile viewports
- [ ] Cancelled/expired events show correct status badge

---

## BACKEND

**Data is available, correct, and contract-compliant.**

- [ ] CampusItem data is available via the expected API/use-case interface
- [ ] All 8 canonical categories are stored with correct string values
- [ ] StudentPreferences persistence works (save and read)
- [ ] PlanItem persistence works (add, read, delete)
- [ ] PlanItem uniqueness enforced at database level (no duplicate campusItemId per userId)
- [ ] GetImportantCampusUpdatesUseCase returns important_campus / importance: critical items without applying selectedCategories filter
- [ ] date field in all CampusItem responses is YYYY-MM-DD format
- [ ] startTime / endTime fields are HH:mm format or null (never empty string)
- [ ] registrationUrl is absolute HTTPS URL or null
- [ ] Demo data seeded and accessible (6 demo items from demo-scenario.json)
- [ ] Data contracts match types defined in src/domain/

---

## AI / INTELLIGENCE

**Recommendation and conflict logic is correct and trustworthy.**

- [ ] Recommendation ranking works: Technical items rank higher for Technical-interest student than non-Technical items
- [ ] Recommendation scores are normalized 0-100
- [ ] RecommendationResult.reasons[] is never empty (fallback: ["Upcoming campus event"])
- [ ] All returned reasons use only the approved reason string set
- [ ] No reason is returned that is not traceable to actual CampusItem data or StudentPreferences
- [ ] Time conflict detection works: events with A.start < B.end AND B.start < A.end on same date triggers conflict
- [ ] Sequential non-conflicting events (17:00-18:00 and 18:00-19:00) do NOT trigger conflict
- [ ] AI provider failure falls back gracefully (sort by date/urgency, default reason)
- [ ] AI extraction (poster to CampusItemDraft) goes through human review before publishing
- [ ] important_campus / importance: critical items NEVER pass through the recommendation ranking filter — they have a separate delivery path
- [ ] Explore Something New section intentionally excludes items from student's selectedCategories

---

## INTEGRATION

**All four tracks work as one product.**

- [ ] Shared TypeScript contracts in src/domain/ match across all branches (CampusItem, RecommendationResult, PlanItem, PlanConflict, StudentPreferences)
- [ ] Category constants imported from src/shared/constants/ — not hardcoded in any component
- [ ] No incompatible duplicate data models exist
- [ ] End-to-end flow works: seed data → onboard student → see personalized feed → add to plan → detect conflict → resolve
- [ ] Important Campus items verified to appear for a student who selected only Sports
- [ ] Recommendation reason strings confirmed to be plain English and accurate

---

## DEPLOYMENT

**The product is deployed and accessible.**

- [ ] Production build succeeds: npm run build exits with code 0
- [ ] TypeScript check passes: npm run typecheck exits with code 0
- [ ] Lint passes: npm run lint exits with code 0
- [ ] Tests pass: npm run test exits with code 0
- [ ] Vercel deployment succeeds (no build errors on Vercel dashboard)
- [ ] PWA is installable (manifest.json and service worker configured)
- [ ] App is accessible via the Vercel production URL
- [ ] Environment variables set correctly on Vercel (NEXT_PUBLIC_SUPABASE_URL, etc.)
- [ ] No sensitive secrets in source code

---

## DEMO

**The 3-minute demo works reliably and can be repeated.**

- [ ] Demo data seeded and confirmed in system (6 items from demo-scenario.json)
- [ ] Onboarding screen loads cleanly (no saved state interference)
- [ ] Demo student persona (Angel, Technical + Cultural + Sports) produces expected feed
- [ ] AI Hackathon (ci-demo-tech-01) appears in Don't Miss with deadline badge
- [ ] MST Datesheet (ci-demo-acad-01) appears in Important Campus section
- [ ] Wellness session (ci-demo-well-01) appears in Explore Something New
- [ ] 94% match badge and reasons display on AI Hackathon
- [ ] Adding AI Hackathon and Acoustic Open Mic to My Plan works
- [ ] Adding Wellness session triggers conflict with Nukkad Natak (Oct 19 overlap)
- [ ] Time Conflict Detected banner appears
- [ ] Conflict resolution buttons work
- [ ] Demo can be repeated from scratch without manual database edits
- [ ] Demo runs on mobile viewport (375px or device mirroring)
- [ ] No console errors visible during demo flow
- [ ] 3-minute demo script rehearsed at least once before presentation

---

## SCOPE CONTROL CONFIRMATION

- [ ] No chat or messaging feature was implemented
- [ ] No social networking feature was implemented
- [ ] No attendance tracking was implemented
- [ ] No assignment management was implemented
- [ ] No full ERP functionality was implemented
- [ ] No gamification was implemented
- [ ] No Instagram or WhatsApp scraping was implemented as a hard dependency
- [ ] Product remained focused on: personalized campus discovery + lightweight campus planning

---

## PHASE COMPLETION SIGN-OFF

| Area | Owner | Status |
|------|-------|--------|
| Product QA & Demo Readiness | Angel | Phase 3 Complete |
| Frontend Implementation | Nidhi | Pending Phase 3 integration |
| Backend / Supabase Implementation | Jayant | Pending Phase 3 integration |
| AI / Recommendation Implementation | Prabhav | Pending Phase 3 integration |
| Final Integration | All | Pending Phase 4 |

---

> **This document is Angel's Phase 3 Definition of Done.**
> The Product Definition of Done for the full hackathon submission requires all four team members to complete their implementations and pass this checklist end-to-end.
