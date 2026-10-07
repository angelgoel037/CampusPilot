# CampusPilot — Integration Risk Register

**Document Status:** Phase 3 Baseline  
**Author / Owner:** Angel (Team Lead & Product QA)  
**Purpose:** Identify, assess, and mitigate realistic integration risks across the four parallel development tracks.

---

## Risk Severity Scale

| Level | Meaning |
|-------|---------|
| **HIGH** | Would break the demo or a core acceptance criterion |
| **MEDIUM** | Would degrade the experience but not block the demo |
| **LOW** | Minor UX inconsistency; easily patched |

## Risk Probability Scale

| Level | Meaning |
|-------|---------|
| **HIGH** | Very likely to occur without coordination |
| **MEDIUM** | Possible if assumptions diverge |
| **LOW** | Unlikely but documented as a precaution |

---

## RISK-001: Frontend expects a CampusItem field that Backend does not provide

**Description:** Nidhi's frontend renders a field (e.g. `subCategory`, `tags`, `imageUrl`) that Jayant's Supabase schema or API response does not include or returns in a different shape.

| Attribute | Value |
|-----------|-------|
| Severity | HIGH |
| Probability | MEDIUM |
| Affected AC | AC-010 (Complete event detail anatomy) |
| Owner | Jayant (Backend) |
| Prevention | Jayant must implement all fields defined in `src/domain/campus-item/types.ts`. Nidhi must read from the CampusItem type, not assume fields. |
| Detection | Integration test: render an event detail view and verify no `undefined` values are visible. Check browser console for undefined warnings. |
| Resolution | Jayant adds the missing field. If field is intentionally optional, Nidhi adds null-safe rendering. |

---

## RISK-002: AI returns a RecommendationResult format incompatible with Frontend

**Description:** Prabhav's recommendation engine returns a `RecommendationResult` shape that differs from the contract in `src/domain/recommendation/index.ts`, e.g. `reasons` as a string instead of `string[]`, or `score` as a decimal instead of integer.

| Attribute | Value |
|-----------|-------|
| Severity | HIGH |
| Probability | MEDIUM |
| Affected AC | AC-007 (Explainable recommendation scoring) |
| Owner | Prabhav (AI) |
| Prevention | Prabhav must implement exactly the TypeScript type in `src/domain/recommendation/index.ts`. Use Zod validation at the boundary. |
| Detection | Unit test: `src/domain/recommendation/index.ts` types. Integration test: render For You section and confirm reasons[] displays correctly. |
| Resolution | Prabhav corrects the return shape. Nidhi adds defensive rendering that handles both string and string[] with a console warning. |

---

## RISK-003: Category names diverge between tracks

**Description:** One or more developers uses a different string for a category (e.g. "tech" instead of "technical", "acad" instead of "important_campus", "cultural_arts" instead of "cultural").

| Attribute | Value |
|-----------|-------|
| Severity | HIGH |
| Probability | MEDIUM |
| Affected AC | AC-018 (8-category taxonomy filtering), AC-008 (non-suppression) |
| Owner | All four developers |
| Prevention | All code must import category values from `src/shared/constants/index.ts`. Never hardcode category strings in components or queries. |
| Detection | Search all files for hardcoded category strings: `grep -r "\"tech\"" src/` — should return zero results. |
| Resolution | Replace any divergent string with the canonical constant. |

---

## RISK-004: Important Campus items become filtered out by personalization logic

**Description:** Prabhav's recommendation engine or Jayant's API query applies the student's selectedCategories filter to important_campus items, causing them to disappear from the feed for students who did not select an academic category.

| Attribute | Value |
|-----------|-------|
| Severity | HIGH |
| Probability | HIGH |
| Affected AC | AC-008 (Non-suppression of Important Campus) |
| Owner | Prabhav (scoring must not filter), Jayant (GetImportantCampusUpdates must bypass preference filter) |
| Prevention | GetImportantCampusUpdatesUseCase in `src/application/campus-items/` must never apply selectedCategories filter. Important Campus items must NEVER pass through RecommendationEngine. They have a separate, guaranteed delivery path. |
| Detection | Demo test: Select only "Sports" → confirm MST datesheet appears in Section 3. |
| Resolution | Jayant adds a dedicated API endpoint or query for important_campus that ignores selectedCategories. Prabhav removes any importance-override logic from the ranking engine. |

---

## RISK-005: Date and time formats differ between tracks

**Description:** Jayant stores dates in a format other than `YYYY-MM-DD` (e.g. Unix timestamp, DD/MM/YYYY), or stores times in `HH:mm:ss` instead of `HH:mm`, causing conflict detection or display to fail.

| Attribute | Value |
|-----------|-------|
| Severity | HIGH |
| Probability | MEDIUM |
| Affected AC | AC-015 (Conflict detection), AC-014 (Chronological sort), AC-010 (Event detail display) |
| Owner | Jayant (Backend) |
| Prevention | Integration Contract Section A specifies: date as YYYY-MM-DD, startTime/endTime as HH:mm. Jayant must transform to this format before returning. Prabhav's conflict algorithm depends on HH:mm string comparison. |
| Detection | Log the raw API response and confirm date/time field formats. Run conflict test with two Oct 19 events. |
| Resolution | Jayant adds a serialization layer converting DB timestamps to the specified format. |

---

## RISK-006: Duplicate PlanItems appear in My Plan

**Description:** A student adds the same event twice (e.g. by tapping Add to Plan rapidly, or from two different UI entry points) and both entries appear in My Plan.

| Attribute | Value |
|-----------|-------|
| Severity | MEDIUM |
| Probability | MEDIUM |
| Affected AC | AC-013 (Plan de-duplication) |
| Owner | Jayant (Backend — primary enforcement), Nidhi (Frontend — UI guard) |
| Prevention | Jayant adds a database unique constraint on (userId, campusItemId). Nidhi disables the Add to Plan button immediately on first tap and shows "In Plan" state. |
| Detection | Attempt to add the same item twice rapidly. Count PlanItem records for that userId + campusItemId combination. |
| Resolution | Jayant adds UNIQUE constraint. Nidhi adds optimistic UI update. |

---

## RISK-007: Demo data does not trigger recommendation logic correctly

**Description:** The demo scenario items (ci-demo-tech-01, ci-demo-well-01, etc.) do not appear in the expected sections because the recommendation engine's scoring logic does not recognize them, they have wrong dates, or they are not seeded into the database before the demo.

| Attribute | Value |
|-----------|-------|
| Severity | HIGH |
| Probability | MEDIUM |
| Affected AC | AC-006 (Don't Miss urgency), AC-007 (Explainability), AC-008 (Important Campus), AC-009 (Serendipity) |
| Owner | Angel (defines demo-scenario.json), Jayant (seeds data), Prabhav (scoring confirms expected sections) |
| Prevention | Run a complete end-to-end demo rehearsal at least 30 minutes before the hackathon presentation. Confirm all 6 demo items appear in expected sections. |
| Detection | Load demo student persona, run the app, verify section placement matches demo-scenario.json expectations. |
| Resolution | Correct the seed data or adjust the scoring thresholds so expected items appear in correct sections. |

---

## RISK-008: Frontend uses hardcoded assumptions that conflict with Backend data

**Description:** Nidhi's components hardcode category labels, section counts, or item counts rather than reading them from the API response or shared constants, creating a mismatch when Jayant's real data differs.

| Attribute | Value |
|-----------|-------|
| Severity | MEDIUM |
| Probability | MEDIUM |
| Affected AC | AC-005 (Section hierarchy), AC-018 (Category filtering) |
| Owner | Nidhi (Frontend) |
| Prevention | Nidhi must read category labels from `src/shared/constants/index.ts`. Section logic must be data-driven. Do not hardcode "Show 3 items" — use the API response length. |
| Detection | Code review: search for hardcoded category strings or item count magic numbers in component files. |
| Resolution | Nidhi replaces hardcoded values with constants and API-driven rendering. |

---

## RISK-009: AI explanation claims reasons not supported by actual data

**Description:** Prabhav's recommendation engine returns a reason like "Matches your Career interest" for a student who selected only Technical, or "Registration closes tonight" when the deadline is in 3 days.

| Attribute | Value |
|-----------|-------|
| Severity | HIGH |
| Probability | LOW |
| Affected AC | AC-007 (Explainable recommendation scoring) |
| Owner | Prabhav (AI) |
| Prevention | Prabhav must only generate reasons that are directly computed from: (a) selectedCategories match, (b) today's date comparison, (c) deadline proximity. Never invent reasons. |
| Detection | Manual QA: For a student with only Technical selected, verify no "Matches your Cultural interest" reasons appear on technical items. |
| Resolution | Prabhav refactors reason generation to use only checked data fields, not approximations. |

---

## RISK-010: One branch introduces breaking changes to shared contracts

**Description:** A developer modifies `CampusItem`, `RecommendationResult`, `PlanItem`, or `PlanConflict` types in a way that is not backward-compatible, breaking other developers' implementations.

| Attribute | Value |
|-----------|-------|
| Severity | HIGH |
| Probability | LOW |
| Affected AC | All integration-dependent criteria (AC-003, AC-007, AC-008, AC-012, AC-013, AC-015) |
| Owner | All developers |
| Prevention | Never modify a shared type without notifying all team members. Any addition should use optional fields (`?`). Any removal or rename requires team consensus. Changes go through `src/domain/` only. |
| Detection | TypeScript compiler errors across the codebase: run `npm run typecheck`. Any error pointing to a type import indicates a breaking change. |
| Resolution | Revert the breaking change or provide a migration that preserves backward compatibility. |

---

## Risk Summary Table

| Risk ID | Description | Severity | Probability | Owner |
|---------|-------------|----------|-------------|-------|
| RISK-001 | Missing CampusItem field in Backend | HIGH | MEDIUM | Jayant |
| RISK-002 | Incompatible RecommendationResult format | HIGH | MEDIUM | Prabhav |
| RISK-003 | Category name divergence | HIGH | MEDIUM | All |
| RISK-004 | Important Campus filtered out | HIGH | HIGH | Prabhav, Jayant |
| RISK-005 | Date/time format mismatch | HIGH | MEDIUM | Jayant |
| RISK-006 | Duplicate PlanItems | MEDIUM | MEDIUM | Jayant, Nidhi |
| RISK-007 | Demo data not triggering logic | HIGH | MEDIUM | Angel, Jayant, Prabhav |
| RISK-008 | Frontend hardcoded assumptions | MEDIUM | MEDIUM | Nidhi |
| RISK-009 | AI reasons not traceable to data | HIGH | LOW | Prabhav |
| RISK-010 | Breaking changes to shared contracts | HIGH | LOW | All |

---

## Pre-Integration Meeting Agenda

Before merging branches, hold a 15-minute sync covering:

1. Confirm category constant values match across all branches (RISK-003)
2. Confirm CampusItem schema is identical across all branches (RISK-010)
3. Confirm date/time format in API responses (RISK-005)
4. Confirm GetImportantCampusUpdates bypasses preference filter (RISK-004)
5. Seed demo data and run one complete demo rehearsal (RISK-007)
