# CampusPilot — Product QA Matrix

**Document Status:** Phase 3 Baseline  
**Author / Owner:** Angel (Team Lead & Product QA)  
**Source:** All 24 criteria from `docs/phase-2/PRODUCT-ACCEPTANCE-CRITERIA.md`  
**Total Criteria Mapped:** 24  

---

> ### Validation Status Key
> - `PENDING` — Not yet tested
> - `PASS` — Criterion confirmed working
> - `FAIL` — Criterion failing (document reason)
> - `BLOCKED` — Blocked by cross-team dependency

---

## Section 1: Onboarding & Preferences (AC-001 to AC-004)

| ID | Requirement | User Action | Expected Observable Result | Responsible Area | Dependency | Validation Status |
|----|-------------|-------------|---------------------------|------------------|------------|-------------------|
| AC-001 | Multi-interest selection | Tap one or more category chips on the onboarding screen | Each tapped chip changes visual state (accent background, glowing border, checkmark icon). Multiple chips can be selected simultaneously. | FRONTEND | Nidhi implements chip toggle state; Jayant persists to StudentPreferences | PENDING |
| AC-002 | Zero-interest continuation (Skip) | Click `Skip for now` OR click `Build My Campus Feed` with zero chips selected | App navigates to Home without error. Home feed loads in default trending mode. Banner appears: "Showing top campus highlights. Select your interests in Profile to personalize your feed!" | FRONTEND | Nidhi implements skip path; Prabhav fallback to trending | PENDING |
| AC-003 | Preference persistence | Select interests, navigate away, return to the app or reload | Previously selected categories remain selected. No re-onboarding prompt appears. | INTEGRATION | Jayant (Supabase persistence) + Nidhi (read on load) | PENDING |
| AC-004 | Preference modification | Navigate to Profile tab, edit interests, save | `For You` feed re-ranks immediately upon return to Home to reflect updated preferences. | INTEGRATION | Nidhi (UI re-fetch trigger) + Prabhav (re-score on preference change) | PENDING |

---

## Section 2: Homepage & Information Architecture (AC-005 to AC-009)

| ID | Requirement | User Action | Expected Observable Result | Responsible Area | Dependency | Validation Status |
|----|-------------|-------------|---------------------------|------------------|------------|-------------------|
| AC-005 | Strict 4-section homepage hierarchy | Open the app Home screen (/) | Four sections appear in this exact order: (1) Don't Miss, (2) For You, (3) Important Campus, (4) Explore Something New. Order is fixed on all viewport sizes. | FRONTEND | Nidhi implements layout; Backend supplies data for each section | PENDING |
| AC-006 | Don't Miss urgency filter | Observe the Don't Miss section | Only items with imminent deadline, importance: 'high', or startTime today appear. Maximum 3 cards. No low-priority items appear. | AI / INTEGRATION | Prabhav (urgency scoring) + Jayant (importance field) | PENDING |
| AC-007 | Explainable recommendation scoring | Tap the match badge on any For You card | A tooltip or expanded view shows plain-language explanation strings (e.g. "Matches your Technical interest, Happening today, Registration closes tonight"). No bare numeric score without reasons. | AI | Prabhav must return RecommendationResult.reasons[] per Integration Contract Section C | PENDING |
| AC-008 | Non-suppression of Important Campus | Select only Sports interest, then open Home | MST datesheet and semester result items appear in Section 3 Important Campus regardless of selected interests. Section is never empty when important_campus data exists. | BACKEND / INTEGRATION | Jayant's GetImportantCampusUpdatesUseCase must return critical items irrespective of preference filter | PENDING |
| AC-009 | Explore Something New serendipity | Select only Technical interest, then open Home | Section 4 shows 1-3 items from categories OTHER than technical (e.g. wellness, arts, cultural). Tech-only student always sees something outside their bubble. | AI | Prabhav's serendipity filter must exclude items already matching selectedCategories | PENDING |

---

## Section 3: Event Detail & Actions (AC-010 to AC-013)

| ID | Requirement | User Action | Expected Observable Result | Responsible Area | Dependency | Validation Status |
|----|-------------|-------------|---------------------------|------------------|------------|-------------------|
| AC-010 | Complete event detail anatomy | Tap any campus item card to open its detail view | All fields visible: title, category badge, date, time range, venue, organizer, full description, deadline (if applicable), tags. No placeholder text or undefined values. | FRONTEND / BACKEND | Jayant populates all non-null CampusItem fields; Nidhi handles null gracefully | PENDING |
| AC-011 | Direct external registration action | Open an event with registrationUrl set, tap the button | A prominent `Register Now` CTA button is visible. Clicking it opens the correct external URL in a new browser tab. | FRONTEND | Nidhi renders CTA conditionally; Jayant ensures valid registrationUrl | PENDING |
| AC-012 | Add to Plan toggle action | Tap `+ Add to Plan` on any event card or detail view | Button immediately changes to `In Plan`. Item appears in the My Plan tab. Visual feedback is visible. | FRONTEND / INTEGRATION | Nidhi (toggle state) + Jayant (PlanItem persistence) | PENDING |
| AC-013 | Plan de-duplication | Tap `+ Add to Plan` on an event already in My Plan | No duplicate entry created. Plan shows exactly one instance. Button remains in `In Plan` state. | BACKEND / INTEGRATION | Jayant enforces uniqueness by campusItemId at persistence layer | PENDING |

---

## Section 4: My Plan & Conflict Intelligence (AC-014 to AC-017)

| ID | Requirement | User Action | Expected Observable Result | Responsible Area | Dependency | Validation Status |
|----|-------------|-------------|---------------------------|------------------|------------|-------------------|
| AC-014 | Chronological plan timeline | Add multiple events on different dates, then open My Plan | Events sorted by date ascending. Within same date, sorted by startTime ascending. Oct 15 before Oct 16; 10:00 before 16:00. | FRONTEND / BACKEND | Nidhi renders sorted list; sort by (date, startTime) | PENDING |
| AC-015 | Automated time conflict detection | Add two events with overlapping times on same date (e.g. 17:00-18:00 and 17:30-18:30) | A "Time Conflict Detected" alert banner appears. Non-overlapping sequential events (17:00-18:00 and 18:00-19:00) do NOT trigger the banner. | AI / FRONTEND | Prabhav implements conflict formula: A.start < B.end AND B.start < A.end | PENDING |
| AC-016 | Conflict resolution action | When conflict banner visible, click [Keep Event A] | Event B is removed from plan. Conflict alert banner disappears. Plan timeline updates immediately. | FRONTEND / INTEGRATION | Nidhi implements resolution UI; Jayant removes PlanItem | PENDING |
| AC-017 | Remove from Plan action | Open My Plan, tap Remove from Plan on any event | Event removed from timeline immediately. Related conflict banner also disappears if applicable. | FRONTEND / INTEGRATION | Nidhi implements remove; Jayant deletes PlanItem | PENDING |

---

## Section 5: Explore, Search & Alerts (AC-018 to AC-020)

| ID | Requirement | User Action | Expected Observable Result | Responsible Area | Dependency | Validation Status |
|----|-------------|-------------|---------------------------|------------------|------------|-------------------|
| AC-018 | 8-category taxonomy filtering | Open Explore tab, tap Technical filter chip | List filters strictly to category: 'technical' items. Tapping All resets filter. All 8 category chips plus All are visible in horizontal scrolling row. | FRONTEND / BACKEND | Jayant API supports CampusItemFilter.category; Nidhi implements filter chip UI | PENDING |
| AC-019 | Real-time keyword search | Open Explore, type "hackathon" in search input | Items matching "hackathon" in title, organizer, tags, or venue appear dynamically as user types. | FRONTEND / BACKEND | Jayant supports searchQuery filter; Nidhi implements debounced search | PENDING |
| AC-020 | Grouped Alerts channel | Open the Alerts tab | Two distinct sections visible: (1) Don't Miss with amber deadline badge, (2) Important Campus with red CRITICAL NOTICE badge. Items in correct section by type. | FRONTEND / BACKEND | Jayant supplies importance field; Nidhi implements two-section Alerts layout | PENDING |

---

## Section 6: Content States & Quality (AC-021 to AC-024)

| ID | Requirement | User Action | Expected Observable Result | Responsible Area | Dependency | Validation Status |
|----|-------------|-------------|---------------------------|------------------|------------|-------------------|
| AC-021 | Actionable empty states | Navigate to My Plan with no events; OR search with no results; OR open Alerts with no alerts | Each empty state shows: illustration or icon, explanatory message, and recovery CTA button. No blank screens or raw errors. | FRONTEND | Nidhi implements empty state components for: My Plan, Search results, Alerts | PENDING |
| AC-022 | Expired & cancelled item handling | View events with status: 'cancelled' or past dates | Cancelled items display Cancelled badge. Past events display Completed badge. Both excluded from active For You. Registration CTAs disabled on cancelled events. | FRONTEND / BACKEND | Jayant sets correct status field; Nidhi renders badges conditionally | PENDING |
| AC-023 | Mobile-first responsive PWA | Open app on mobile device (360px-430px viewport) | Fixed bottom navigation usable. All tap targets at least 44x44px. Cards readable without horizontal scrolling. Content reflows correctly. | FRONTEND | Nidhi implements responsive layout | PENDING |
| AC-024 | Accessibility & text contrast | Review text, buttons, and badges | All text meets WCAG AA (4.5:1 contrast). Interactive controls have visible focus rings. Badges always pair color with text or icon. | FRONTEND | Nidhi uses design tokens from UX spec | PENDING |

---

## Contradiction & Flag Log

> No contradictions detected between Phase 2 acceptance criteria and Phase 0 architecture/PRD as of Phase 3 review.
>
> **Observation (not a contradiction):** AC-007 requires reasons[] to always be non-empty. This is already documented in the Integration Contract Section C (RecommendationResult). Prabhav must implement the fallback reason `["Upcoming campus event"]` when no other reason is computable. This is confirmed and consistent.

---

## Coverage Summary

| Section | Criteria Count | Mapped |
|---------|---------------|--------|
| Onboarding & Preferences | 4 (AC-001 to AC-004) | Yes |
| Homepage Architecture | 5 (AC-005 to AC-009) | Yes |
| Event Detail & Actions | 4 (AC-010 to AC-013) | Yes |
| My Plan & Conflict | 4 (AC-014 to AC-017) | Yes |
| Explore, Search & Alerts | 3 (AC-018 to AC-020) | Yes |
| Content States & Quality | 4 (AC-021 to AC-024) | Yes |
| **Total** | **24** | **24 / 24** |
