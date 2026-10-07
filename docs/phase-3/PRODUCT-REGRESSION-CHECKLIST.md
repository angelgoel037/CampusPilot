# CampusPilot — Product Regression Checklist

**Document Status:** Phase 3 Baseline  
**Author / Owner:** Angel (Team Lead & Product QA)  
**Purpose:** Run this checklist before every integration test and before the final hackathon demo.  
**Instruction:** Check each item manually or via automated test. Mark PASS / FAIL next to each item.

---

## A. ONBOARDING

- [ ] User can select multiple interests (more than one chip toggles to active state)
- [ ] User can select zero optional interests (all chips remain unselected)
- [ ] User can continue without selecting any interests (Skip for now works, Build My Campus Feed works with zero selection)
- [ ] Selected preferences are visually represented correctly (checkmark, accent color, active border)
- [ ] Important Campus is never treated as optional (no chip for it on onboarding; always delivered)
- [ ] Skip path shows the informational banner on Home ("Showing top campus highlights. Select your interests in Profile to personalize your feed!")
- [ ] Onboarding fits mobile viewport (360px–430px) without horizontal overflow

---

## B. HOME

- [ ] Don't Miss section exists and is in position 1
- [ ] For You section exists and is in position 2
- [ ] Important Campus section exists and is in position 3
- [ ] Explore Something New section exists and is in position 4
- [ ] Section order is preserved on both mobile and desktop viewports
- [ ] Urgent content (imminent deadline or importance: high) appears in Don't Miss
- [ ] Don't Miss shows maximum 3 cards (not more)
- [ ] For You recommendations contain understandable match reasons (plain English, not jargon)
- [ ] Important Campus notices are visible even when user selected only Sports or Cultural interest
- [ ] Important Campus notices are visible even when user skipped onboarding entirely
- [ ] Explore Something New shows content outside the user's selected interests
- [ ] Home screen greeting displays the student's name correctly (morning / afternoon / evening)

---

## C. EVENT DETAILS

- [ ] Event title is visible and correct
- [ ] Category badge is visible (Technical, Cultural, Sports, etc.)
- [ ] Date is visible in readable format
- [ ] Time is visible (start and end time, or start time if no end)
- [ ] Venue is visible
- [ ] Organizer is visible
- [ ] Full description is visible
- [ ] Tags are visible
- [ ] Deadline is visible when present (null handled gracefully — field hidden, not shown as "null")
- [ ] Registration action (Register Now) is visible and works when registrationUrl is present
- [ ] Registration action is absent or disabled when registrationUrl is null
- [ ] Add to Plan button works and toggles to In Plan state
- [ ] Cancelled events show Cancelled badge and have disabled registration CTA

---

## D. MY PLAN

- [ ] Planned events are visible after adding from event detail or card
- [ ] Events are ordered chronologically (earliest date first; within same day, earliest time first)
- [ ] Duplicate events cannot be added (second attempt shows In Plan state, no new entry created)
- [ ] Time Conflict Detected banner appears when two added events overlap on same date
- [ ] Conflict banner does NOT appear for sequential non-overlapping events (17:00-18:00 and 18:00-19:00)
- [ ] [Keep Event A] resolution removes Event B and dismisses the banner
- [ ] [Keep Event B] resolution removes Event A and dismisses the banner
- [ ] User can remove any event from My Plan using Remove from Plan
- [ ] Removing a conflicting event also clears the conflict banner
- [ ] My Plan shows an actionable empty state when no events are saved ("Your campus plan is empty. Bookmark workshops, games, and fests...")

---

## E. DISCOVERY (EXPLORE)

- [ ] All 8 category filter chips are visible in horizontal scroll
- [ ] All filter resets to unfiltered view
- [ ] Selecting a category chip filters items strictly to that category
- [ ] Search input filters by title, organizer, tags, or venue
- [ ] Search for a known term ("hackathon") returns expected items
- [ ] Expired or past events are not presented as upcoming in For You
- [ ] Events outside the user's selected interests can be discovered via Explore
- [ ] Empty search results show an actionable empty state

---

## F. IMPORTANT CAMPUS

- [ ] MST announcements (category: important_campus, subCategory: exam_notification) appear in Important Campus section
- [ ] Final exam announcements appear in Important Campus section
- [ ] Result declarations appear in Important Campus section
- [ ] Official institutional notices (closures, deadlines) appear in Important Campus section
- [ ] Important Campus items are visible regardless of any interest selection
- [ ] Important Campus items display CRITICAL NOTICE or appropriate badge
- [ ] Important Campus items are never filtered out by personalization logic
- [ ] Important Campus items appear in Alerts tab Important Campus sub-section

---

## G. RESPONSIVENESS & MOBILE

- [ ] Mobile experience works on 360px viewport (iPhone SE equivalent)
- [ ] Mobile experience works on 430px viewport (iPhone 15 Pro Max equivalent)
- [ ] Desktop experience is usable (not broken on 1440px)
- [ ] Bottom navigation is accessible and not obscured
- [ ] All primary action buttons (Add to Plan, Register Now, Keep Event) are easily tappable
- [ ] Touch targets are approximately 44x44px or larger
- [ ] Text remains readable at mobile scale (no overflow or clipping)
- [ ] Important Campus section is visually distinct from other sections
- [ ] No horizontal scroll overflow on any screen
- [ ] My Plan timeline is readable on mobile

---

## H. ACCESSIBILITY & LANGUAGE

- [ ] All button labels are meaningful (not just icons with no text)
- [ ] Match badge reasons use plain English only (no "AI thinks", "neural score", etc.)
- [ ] Status information (Cancelled, Completed, Conflict) is not conveyed by color alone (also uses text/icon)
- [ ] Focus rings visible on interactive elements when navigating by keyboard
- [ ] Section headings use semantic heading hierarchy (h1, h2, h3)
- [ ] Text contrast meets WCAG AA standard
- [ ] Empty states are understandable without visual context only
- [ ] UX copy uses canonical terms: For You, Don't Miss, Important Campus, Explore Something New, My Plan, Add to Plan, Time Conflict Detected

---

## I. ANTI-HALLUCINATION CHECK

- [ ] No recommendation reason says "Students like you are attending this" unless attendance data exists
- [ ] No recommendation reason says "AI thinks you'll love this"
- [ ] All match reason strings are traceable to actual data (interest match, time, deadline, category)
- [ ] AI explanation strings are from the approved reason set: "Matches your [X] interest", "Happening today", "Registration closes tonight", "Outside your usual interests", "Upcoming campus event"

---

## Pre-Demo Final Check

Run this immediately before the hackathon demo:

- [ ] Demo data is loaded into the system (seed if using Supabase)
- [ ] AI Hackathon (ci-tech-01) appears in Don't Miss with deadline badge
- [ ] MST Datesheet (ci-acad-01) appears in Important Campus
- [ ] Wellness session (ci-well-01) appears in Explore Something New for a Technical + Sports student
- [ ] Conflict between ci-well-01 (16:00-17:30) and ci-cult-03 (16:30-19:00) on Oct 19 is detectable in My Plan
- [ ] Demo student persona (Angel) loads with interests: Technical, Cultural, Sports
- [ ] No console errors visible in browser dev tools
- [ ] Demo can be repeated from scratch without manual database edits
