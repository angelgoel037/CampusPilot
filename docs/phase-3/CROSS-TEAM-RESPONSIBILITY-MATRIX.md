# CampusPilot — Cross-Team Responsibility Matrix

**Document Status:** Phase 3 Final  
**Author / Owner:** Angel (Team Lead & Product QA)  
**Purpose:** Eliminate ownership ambiguity across all product features. Each cell defines exactly who owns what. No area should be ambiguous.

---

## Ownership Legend

| Symbol | Meaning |
|--------|---------|
| **OWNER** | This person is accountable for the feature's correctness |
| **IMPL** | This person implements the code for this area |
| **DATA** | This person provides the data this feature depends on |
| **REVIEW** | This person has authority to approve or reject the behavior |
| **NONE** | This person has no responsibility for this area |

---

## Core Feature Responsibility Matrix

| Feature | Angel | Nidhi | Jayant | Prabhav |
|---------|-------|-------|--------|---------|
| **Product behavior specification** | OWNER | NONE | NONE | NONE |
| **UX copy & terminology** | OWNER | REVIEW (follows spec) | NONE | NONE |
| **Content taxonomy (8 categories)** | OWNER | REVIEW (follows spec) | REVIEW (stores correctly) | REVIEW (maps to correctly) |
| **Category constants in code** | OWNER (defined) | IMPL (uses) | IMPL (stores/validates) | IMPL (uses for scoring) |

---

## Onboarding & Preferences

| Feature | Angel | Nidhi | Jayant | Prabhav |
|---------|-------|-------|--------|---------|
| Onboarding UX behavior spec | OWNER | NONE | NONE | NONE |
| Onboarding UI implementation | REVIEW | IMPL (OWNER) | NONE | NONE |
| Category chip display & toggle | REVIEW | IMPL (OWNER) | NONE | NONE |
| Preference persistence (Supabase) | NONE | IMPL (write) | OWNER / IMPL (schema) | NONE |
| Preference read on load | NONE | IMPL | IMPL (API) | NONE |
| StudentPreferences type contract | OWNER (defined) | IMPL (uses) | IMPL (stores) | IMPL (reads) |
| Skip / zero-interest handling | OWNER (spec) | IMPL | NONE | OWNER (fallback ranking) |
| Institutional guarantee notice copy | OWNER | IMPL | NONE | NONE |

---

## Home Screen & Feed Sections

| Feature | Angel | Nidhi | Jayant | Prabhav |
|---------|-------|-------|--------|---------|
| 4-section hierarchy specification | OWNER | NONE | NONE | NONE |
| 4-section home layout implementation | REVIEW | IMPL (OWNER) | NONE | NONE |
| Don't Miss section data sourcing | OWNER (spec) | IMPL (render) | IMPL (data) | OWNER (urgency filter) |
| For You feed composition | OWNER (rules) | IMPL (render) | IMPL (data) | OWNER (ranking) |
| Important Campus section data | OWNER (priority rule) | IMPL (render) | OWNER (source/data) | NONE (no authority to suppress) |
| Explore Something New sourcing | OWNER (spec) | IMPL (render) | IMPL (data) | OWNER (serendipity filter) |
| Match score display | OWNER (spec) | IMPL | NONE | OWNER (score) |
| Match reason display | OWNER (spec) | IMPL | NONE | OWNER (reasons[]) |
| Anti-hallucination enforcement | OWNER | REVIEW | NONE | IMPL (only approved reason strings) |

---

## Event Detail View

| Feature | Angel | Nidhi | Jayant | Prabhav |
|---------|-------|-------|--------|---------|
| Event detail layout spec | OWNER | NONE | NONE | NONE |
| Event detail UI implementation | REVIEW | IMPL (OWNER) | NONE | NONE |
| CampusItem field completeness | OWNER (defines required fields) | IMPL (renders) | OWNER (populates) | NONE |
| registrationUrl CTA behavior | OWNER (spec) | IMPL | IMPL (stores URL) | NONE |
| Add to Plan button behavior | OWNER (spec) | IMPL (OWNER) | IMPL (persistence) | NONE |
| Null field graceful handling | OWNER (spec) | IMPL | NONE | NONE |

---

## My Plan

| Feature | Angel | Nidhi | Jayant | Prabhav |
|---------|-------|-------|--------|---------|
| My Plan UX specification | OWNER | NONE | NONE | NONE |
| My Plan UI implementation | REVIEW | IMPL (OWNER) | NONE | NONE |
| PlanItem persistence | NONE | IMPL (add/remove) | OWNER / IMPL | NONE |
| Chronological sort | OWNER (spec) | IMPL | NONE | NONE |
| De-duplication enforcement | OWNER (spec) | IMPL (UI guard) | OWNER / IMPL (DB constraint) | NONE |
| Time conflict detection logic | OWNER (spec & formula) | IMPL (renders banner) | NONE | OWNER / IMPL (algorithm) |
| Conflict banner copy | OWNER | IMPL | NONE | NONE |
| Conflict resolution UI | OWNER (spec) | IMPL (OWNER) | IMPL (delete PlanItem) | NONE |
| Remove from Plan | OWNER (spec) | IMPL | IMPL (delete PlanItem) | NONE |
| Empty state for My Plan | OWNER (copy) | IMPL | NONE | NONE |

---

## Explore & Discovery

| Feature | Angel | Nidhi | Jayant | Prabhav |
|---------|-------|-------|--------|---------|
| Explore screen UX spec | OWNER | NONE | NONE | NONE |
| Category filter chips UI | REVIEW | IMPL (OWNER) | NONE | NONE |
| Category filter data query | NONE | IMPL (triggers) | OWNER / IMPL | NONE |
| Keyword search UI | REVIEW | IMPL (OWNER) | NONE | NONE |
| Keyword search query | NONE | IMPL (triggers) | OWNER / IMPL | NONE |
| Filter chip taxonomy labels | OWNER | IMPL | NONE | NONE |
| Expired event exclusion from For You | OWNER (spec) | IMPL | OWNER (status field) | IMPL (filter published+upcoming) |

---

## Alerts

| Feature | Angel | Nidhi | Jayant | Prabhav |
|---------|-------|-------|--------|---------|
| Alerts screen UX spec | OWNER | NONE | NONE | NONE |
| Alerts UI (2 sections) | REVIEW | IMPL (OWNER) | NONE | NONE |
| Don't Miss alerts data | OWNER (rules) | IMPL (render) | IMPL (data) | OWNER (urgency classifier) |
| Important Campus alerts data | OWNER (priority rule) | IMPL (render) | OWNER (source/data) | NONE |
| Badge colors & labels | OWNER (copy) | IMPL | NONE | NONE |
| Empty Alerts state | OWNER (copy) | IMPL | NONE | NONE |

---

## Recommendations & Intelligence

| Feature | Angel | Nidhi | Jayant | Prabhav |
|---------|-------|-------|--------|---------|
| Recommendation product rules | OWNER | NONE | NONE | NONE |
| Recommendation scoring weights | OWNER (spec: 40% interest, 25% time, 15% urgency, 10% popularity, 10% discovery) | NONE | NONE | OWNER / IMPL |
| RecommendationResult type contract | OWNER (defined in Phase 2) | IMPL (consumes) | IMPL (data source) | IMPL (produces) |
| Reason string approved set | OWNER | IMPL (renders only) | NONE | IMPL (returns only approved strings) |
| AI provider selection | NONE | NONE | NONE | OWNER |
| Fallback ranking (AI failure) | OWNER (spec: critical > urgent > date) | IMPL | IMPL (data) | IMPL (fallback) |
| AI extraction (poster to CampusItem) | NONE | NONE | NONE | OWNER |

---

## Important Campus (Institutional Integrity)

| Feature | Angel | Nidhi | Jayant | Prabhav |
|---------|-------|-------|--------|---------|
| Non-suppression rule definition | OWNER | NONE | NONE | NONE |
| Non-suppression enforcement | OWNER | IMPL (always renders Section 3) | OWNER (GetImportantCampusUpdates always returns critical items) | NONE (no authority to suppress) |
| important_campus category data | NONE | NONE | OWNER | NONE |
| importance: critical data | NONE | NONE | OWNER | NONE |
| Critical badge display | OWNER (spec) | IMPL | NONE | NONE |
| Institutional Integrity Rule authority | **ANGEL ONLY** — personalization must NEVER override this | FOLLOWS | FOLLOWS | **MUST NOT suppress** |

---

## Accessibility & PWA

| Feature | Angel | Nidhi | Jayant | Prabhav |
|---------|-------|-------|--------|---------|
| Accessibility product requirements | OWNER (spec) | NONE | NONE | NONE |
| WCAG AA contrast implementation | REVIEW | IMPL (OWNER) | NONE | NONE |
| Touch target sizing (44x44px) | OWNER (spec) | IMPL (OWNER) | NONE | NONE |
| Keyboard focus rings | REVIEW | IMPL (OWNER) | NONE | NONE |
| Mobile-first responsive layout | REVIEW | IMPL (OWNER) | NONE | NONE |
| PWA manifest & service worker | REVIEW | IMPL (OWNER) | NONE | NONE |
| Semantic HTML headings | REVIEW | IMPL (OWNER) | NONE | NONE |

---

## Content & Data Quality

| Feature | Angel | Nidhi | Jayant | Prabhav |
|---------|-------|-------|--------|---------|
| Sample data content quality | OWNER | NONE | REVIEW | NONE |
| Demo data seeding | OWNER (defines) | NONE | IMPL (seeds) | NONE |
| Category label consistency | OWNER | IMPL | IMPL | IMPL |
| Date/time format compliance | OWNER (spec: YYYY-MM-DD, HH:mm) | NONE | IMPL | NONE |

---

## Key Invariants — Non-Negotiable

1. **Institutional Integrity (ANGEL's authority):** Important Campus items MUST NEVER be suppressed by personalization. Prabhav has zero authority to filter or downrank importance: 'critical' items. Jayant must always return them via GetImportantCampusUpdates. Nidhi must always render Section 3.

2. **Reason string truthfulness (ANGEL's rule, Prabhav's responsibility):** Prabhav must only return reason strings from the approved set. No hallucinated reasons.

3. **PlanItem uniqueness (Jayant's responsibility):** Enforced at the database layer, not only the UI layer.

4. **Conflict formula (ANGEL's spec, Prabhav's implementation):** `A.start < B.end AND B.start < A.end` on the same date. Non-negotiable formula.
