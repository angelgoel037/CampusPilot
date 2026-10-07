# CampusPilot — Demo Data Specification

**Document Status:** Phase 3 Baseline  
**Author / Owner:** Angel (Team Lead & Product QA)  
**Related File:** `shared/sample-data/demo-scenario.json`  
**Purpose:** Define which demo records are essential, why they exist, which acceptance criteria they support, and which demo scene uses them.

---

## Guiding Principle

The demo dataset is intentionally minimal. Every record must justify its existence by satisfying at least one acceptance criterion and appearing in at least one demo scene.

Do not add records that do not serve a specific demo purpose.

---

## Demo Student Persona

| Field | Value |
|-------|-------|
| Name | Angel |
| Year | 3rd Year |
| Department | Computer Science & Engineering |
| Selected Interests | Technical, Cultural, Sports |
| Interests NOT selected | Social & Campus Life, Career, Wellness, Learning & Research |
| Important Campus | Always delivered regardless |

**Why this persona?**  
Angel's interest set (Technical + Cultural + Sports) covers three categories and leaves Wellness as the intentional "out-of-interest" serendipitous discovery item. It also confirms that Important Campus (MST datesheet) appears regardless of interest filter — the most important product invariant.

---

## Demo Items — Essential Records

| Demo Item ID | Title | Category | Purpose | Acceptance Criteria | Demo Scene |
|---|---|---|---|---|---|
| ci-demo-tech-01 | Campus AI & Robotics Hackathon 2026 | Technical | High-urgency item with tonight's deadline. Triggers Don't Miss. Demonstrates 94% match explainability. Primary Add to Plan target. | AC-001, AC-005, AC-006, AC-007, AC-010, AC-011, AC-012 | Scene 2, 3, 4, 5 |
| ci-demo-cult-01 | Nukkad Natak Street Play Championship | Cultural | Cultural match for Angel. On Oct 19, 16:30-19:00. Creates time conflict with Wellness session (16:00-17:30). Essential for conflict detection demo. | AC-005, AC-007, AC-012, AC-014, AC-015, AC-016 | Scene 3, 5, 6 |
| ci-demo-sports-01 | Inter-Department Basketball Championship Semifinals | Sports | Sports match for Angel. Confirms all three selected interests appear in For You. | AC-005, AC-007 | Scene 3 |
| ci-demo-acad-01 | MST Official Datesheet Released | Important Campus | Critical institutional item. Must appear in Important Campus regardless of Angel's interests. Confirms institutional non-suppression rule. | AC-008, AC-020 | Scene 3 |
| ci-demo-well-01 | Mindfulness & Stress Management for Midterms | Wellness | Wellness is NOT in Angel's interests. Appears in Explore Something New (serendipity). On Oct 19, 16:00-17:30. Creates conflict with Nukkad Natak (16:30-19:00). | AC-009, AC-012, AC-014, AC-015, AC-016, AC-017 | Scene 3, 5, 6 |
| ci-demo-cult-02 | Acoustic Night & Open Mic Under the Stars | Cultural | Cultural match. Appears in For You as the second cultural example. Added to plan in Scene 5. | AC-005, AC-007 | Scene 3, 5 |

---

## Item Count Summary

| Total demo items | 6 |
|---|---|
| Technical | 1 (ci-demo-tech-01) |
| Cultural | 2 (ci-demo-cult-01, ci-demo-cult-02) |
| Sports | 1 (ci-demo-sports-01) |
| Wellness | 1 (ci-demo-well-01) — outside student interests |
| Important Campus | 1 (ci-demo-acad-01) — institutional override |

---

## Conflict Pair

| Field | Value |
|-------|-------|
| Event A | ci-demo-well-01 — Mindfulness Session — Oct 19, 16:00-17:30 |
| Event B | ci-demo-cult-01 — Nukkad Natak — Oct 19, 16:30-19:00 |
| Overlap | 16:30 to 17:30 |
| Conflict Rule | A.start (16:00) < B.end (19:00) AND B.start (16:30) < A.end (17:30) — TRUE |
| Acceptance Criteria | AC-015, AC-016 |

**Why these two for the conflict?**  
- The Wellness session is outside Angel's interests — which is how the serendipitous discovery in Scene 3 leads naturally to the conflict in Scene 6.
- The flow: Explore Something New → Add Wellness to Plan → Conflict Detected.
- This makes the conflict discovery feel organic, not forced.

---

## Recommendation Expectations for Demo

| Item | Expected Section | Expected Score | Expected Reason(s) |
|------|-----------------|---------------|-------------------|
| ci-demo-tech-01 | Don't Miss (Section 1) + For You | 94 | "Matches your Technical interest", "Happening today", "Registration closes tonight" |
| ci-demo-cult-02 | For You (Section 2) | 88 | "Matches your Cultural interest" |
| ci-demo-sports-01 | For You (Section 2) | 82 | "Matches your Sports interest" |
| ci-demo-acad-01 | Important Campus (Section 3) | N/A — bypasses scoring | Institutional override — no score displayed |
| ci-demo-well-01 | Explore Something New (Section 4) | N/A — serendipity | "Outside your usual interests" |
| ci-demo-cult-01 | For You (Section 2) | ~85 | "Matches your Cultural interest" |

> **Note to Prabhav:** The expected scores above are targets used for demo consistency. The recommendation engine must return reasons[] that match the approved reason strings from the Integration Contract. Scores need not be exactly these numbers but should be in the right relative order.

---

## Items NOT Used in Demo (But Present in Sample Data)

The full `campus-items.sample.json` contains 26 additional items. These are not required for the 3-minute demo but are available for:

- Development and testing of category filtering (AC-018)
- Search testing (AC-019)
- Expired/cancelled item testing (AC-022)

These do not require special demo seeding. The demo-scenario.json covers only the 6 essential items.

---

## Data Integrity Requirements

Every demo item must satisfy these constraints before the demo:

| Constraint | Requirement |
|------------|-------------|
| category | Strictly one of 8 canonical values |
| importance | One of: 'normal', 'high', 'critical' |
| date | Valid YYYY-MM-DD format |
| startTime | HH:mm 24-hour format or null |
| endTime | HH:mm 24-hour format or null |
| registrationUrl | Valid HTTPS URL or null |
| status | 'published' for all demo items |

---

## Schema Compatibility Confirmation

All 6 demo items use the existing `CampusItem` schema from `src/domain/campus-item/types.ts`.

No new fields were invented. No second schema was created. If the schema is insufficient for any feature, that gap must be raised with Jayant (Backend) through the Integration Contract update process documented in `docs/phase-2/INTEGRATION-CONTRACT.md` Section 3.
