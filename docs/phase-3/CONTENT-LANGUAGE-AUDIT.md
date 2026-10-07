# CampusPilot — Content & Language Audit

**Document Status:** Phase 3 Baseline  
**Author / Owner:** Angel (Team Lead, UX & Content)  
**Source of Truth:** `team/angel/ux-copy.md` (Canonical UX Copy & Microcopy Guide)  
**Purpose:** Verify all user-facing text across the product follows canonical terminology and tone. Flag deviations.

---

## Audit Rules

1. **Use canonical terms exactly.** No synonyms, no variations.
2. **No AI jargon.** Never say "AI thinks", "neural network", "machine learning score", "algorithm determined."
3. **No hallucinated reasons.** Every recommendation reason must be traceable to data.
4. **Action buttons must match exactly.** Button labels must follow the CTA Standards table.
5. **Tone must be student-first.** Direct, concise, friendly. Not ERP-formal.

---

## Section 1: Onboarding Screen

### Headline

| Expected | Acceptable Variation | Unacceptable |
|----------|----------------------|-------------|
| `Make CampusPilot yours.` | None — use exactly this | "Personalize your experience", "Welcome to CampusPilot", "Set up your profile" |

**Audit Checklist:**
- [ ] Headline matches exactly: "Make CampusPilot yours."
- [ ] Subtitle matches: "Pick what you care about. We'll bring the rest together without overwhelming you."
- [ ] Institutional guarantee notice present and reads: "Important exam datesheets, semester results, and university circulars will always reach you — even if you skip categories."
- [ ] Primary CTA reads: "Build My Campus Feed"
- [ ] Secondary CTA reads: "Skip for now"
- [ ] No category chips are labelled "Academics" or "Institutional" — those are not student-facing categories

### Category Chip Labels

| Expected | Unacceptable |
|----------|-------------|
| "Technical & Coding" or "Technical" | "Tech", "Engineering", "CS" |
| "Cultural & Arts" | "Culture", "Arts & Culture", "Entertainment" |
| "Sports & Esports" | "Sport", "Athletics & Gaming" |
| "Social & Campus Life" | "Social", "Fun", "Events" |
| "Career & Internships" | "Career", "Jobs", "Placement" |
| "Wellness & Psychology" | "Health", "Mental Health" |
| "Learning & Research" | "Learning", "Academic", "Research" |

**Audit Checklist:**
- [ ] All 7 optional interest chip labels match the canonical list above
- [ ] Category `important_campus` does NOT appear as an onboarding chip

---

## Section 2: Home Screen

### Greeting

- [ ] Morning (05:00–11:59): "Good morning, [First Name]"
- [ ] Afternoon (12:00–16:59): "Good afternoon, [First Name]"
- [ ] Evening (17:00–04:59): "Good evening, [First Name]"
- [ ] Sub-greeting present: "Here's what matters on your campus today."
- [ ] Student's first name used, not full name or username

### Section Headers

| Expected Header | Expected Sub-tag | Unacceptable Header |
|-----------------|------------------|---------------------|
| "Don't Miss" | "Urgent registrations & happening soon" | "Urgent", "Today", "Hot" |
| "For You" | "Personalized to your interests" | "Recommended", "Based on you", "Top Picks" |
| "Important Campus" | "Official announcements from university offices" | "Academic", "Notices", "Official" |
| "Explore Something New" | "Curated beyond your selected interests" | "Discover", "Other Events", "Random" |

**Audit Checklist:**
- [ ] Section 1 header reads: "Don't Miss"
- [ ] Section 2 header reads: "For You"
- [ ] Section 3 header reads: "Important Campus"
- [ ] Section 4 header reads: "Explore Something New"
- [ ] Sub-tags are present on all sections

### Urgency Pill Copy

| Allowed | Unacceptable |
|---------|-------------|
| "Closes Tonight" | "Closing Soon", "Ends Today", "Last Chance" |
| "Starts in 2 Hours" | "Starting Soon", "In 2 hrs" |
| "Limited Seats Left" | "Few Spots", "Almost Full" |

**Audit Checklist:**
- [ ] Urgency pill copy matches one of the allowed options above
- [ ] No urgency pill appears on non-urgent items

### Recommendation Reason Language

**Approved reason strings (exact or paraphrased consistently):**

| Approved | Unacceptable |
|----------|-------------|
| "Matches your Technical interest" | "AI thinks you'll like this", "Based on your behavior", "Popular in your department" |
| "Matches your Cultural interest" | Same prohibitions |
| "Matches your Sports interest" | Same prohibitions |
| "Happening today" | "Today's event" |
| "Registration closes tonight" | "Deadline today" |
| "Outside your usual interests" | "You might also like", "Try something new", "Recommended for you" |
| "Upcoming campus event" (fallback) | Any hallucinated reason |

**Audit Checklist:**
- [ ] Every match badge has at least one accompanying reason string
- [ ] No reason string contains "AI", "algorithm", "machine learning", "neural", "based on students like you"
- [ ] No reason string claims a match to a category the student did NOT select
- [ ] Fallback reason "Upcoming campus event" appears only when no better reason is computable

### Important Campus Badges

| Expected | Unacceptable |
|----------|-------------|
| "CRITICAL NOTICE" (red) | "URGENT", "HIGH PRIORITY", "IMPORTANT" |
| "OFFICIAL CIRCULAR" (amber/slate) | "NOTICE", "ANNOUNCEMENT", "UPDATE" |

**Audit Checklist:**
- [ ] Critical items (importance: critical) display "CRITICAL NOTICE" badge
- [ ] Other Important Campus items display "OFFICIAL CIRCULAR" badge
- [ ] Badges are not color-only (text readable even without color perception)

---

## Section 3: Event Detail

**Audit Checklist:**
- [ ] "Register Now" button present (with right-arrow or external-link icon) when registrationUrl exists
- [ ] Registration button absent or disabled when registrationUrl is null
- [ ] "Add to Plan" button uses exactly this label (not "Save Event", "Bookmark", "Attend")
- [ ] "In Plan" confirmation state uses exactly this label (not "Saved", "Added", "Attending")
- [ ] No placeholder text visible ("Lorem ipsum", "Event description here", "TBD")
- [ ] No `undefined`, `null`, or `[object Object]` visible in the UI
- [ ] Cancelled items display "Cancelled" badge (not "Inactive", "Removed", "Ended")
- [ ] Past items display "Completed" badge (not "Past", "Done", "Finished")

---

## Section 4: My Plan

**Audit Checklist:**
- [ ] Screen header reads: "My Plan"
- [ ] Screen subtitle reads: "Your saved campus schedule"
- [ ] Conflict banner reads: "Time Conflict Detected" (not "Schedule Conflict", "Double Booking", "Overlap")
- [ ] Conflict banner body follows template: "[Event A] and [Event B] both take place on [Date] at [Time]. Choose which to attend."
- [ ] Conflict resolution buttons read: "[Keep [Event Name]]" (not "Remove", "Delete", "Cancel")
- [ ] Empty state heading: "Your campus plan is empty."
- [ ] Empty state body: "Bookmark workshops, games, and fests to build your personal timeline."
- [ ] Empty state CTA: "Find Something to Attend"

---

## Section 5: Explore Screen

**Audit Checklist:**
- [ ] Search input placeholder: "Search events, clubs, hackathons, or venues..."
- [ ] Time filters match: "All Dates", "Today", "This Weekend", "Next 7 Days"
- [ ] Category filter labels use canonical category display names (Technical, Cultural, Sports, Social, Career, Wellness, Research)
- [ ] "All" filter chip resets to unfiltered state
- [ ] No search result empty state shows raw "No results" — must include illustration, message, and CTA
- [ ] Empty search message: "Nothing matched your selected interests for this week yet."
- [ ] Empty search body: "Explore all campus activities or add more interests in your Profile."
- [ ] Empty search CTA: "Browse All Campus Events"

---

## Section 6: Alerts Tab

**Audit Checklist:**
- [ ] Alerts screen has two distinct sections, labelled "Don't Miss" and "Important Campus"
- [ ] Empty state heading: "You're all caught up!"
- [ ] Empty state body: "No urgent deadlines or critical notices right now."
- [ ] No confusing mixed terminology (Alerts and Notifications — pick one consistently)

---

## Section 7: Global Tone Check

Review any static text in the product against these rules:

| Rule | Pass | Fail Example |
|------|------|-------------|
| Never use ERP-formal language | "Here's what matters on campus today" | "Please review the following notifications as per policy" |
| Never claim data you don't have | "Matches your Technical interest" | "Based on students like you" |
| Never over-promise AI capabilities | "Explainable match" | "Our AI perfectly predicts what you'll love" |
| Always be action-oriented | "Register Now", "Add to Plan", "Find Something to Attend" | "Click here", "More", "See all" |
| Always explain empty states | "Your campus plan is empty. Bookmark..." | "Nothing here" |

**Audit Checklist:**
- [ ] No ERP-formal language found
- [ ] No data claims beyond what system actually knows
- [ ] No AI over-promise language
- [ ] All CTAs are action-oriented and specific
- [ ] All empty states have explanatory text

---

## Audit Summary

| Section | Items | Status |
|---------|-------|--------|
| Onboarding Screen | 12 items | Pending audit |
| Home Screen | 20 items | Pending audit |
| Event Detail | 8 items | Pending audit |
| My Plan | 8 items | Pending audit |
| Explore Screen | 9 items | Pending audit |
| Alerts Tab | 5 items | Pending audit |
| Global Tone | 5 rules | Pending audit |
| **Total** | **67 items** | **Pending** |

---

## Known Approved Deviations

> None at Phase 3 baseline.

Document any intentional deviations from canonical copy here, with justification and Angel's approval.
