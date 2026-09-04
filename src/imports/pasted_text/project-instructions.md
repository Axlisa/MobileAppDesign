# Project Instructions — Figma Mobile App

**Project:** Bloom — a habit & wellness tracker
**Timeline:** 7 days, idea → interactive Figma prototype
**Owner:** Aga
**Last updated:** 2026-09-04

This document is the working brief for this project. Read it at the start of any session before designing, and update the "Status Log" at the bottom as work progresses.

---

## 1. The concept

**App name (working title):** Bloom
**One-liner:** A calm, encouraging habit and wellness tracker that helps people build small daily routines — habits, mood check-ins, and short reflections — without the guilt-trip energy most habit apps have.

**Why this topic:**
- Scoped correctly for one week: a handful of core flows (not a sprawling multi-sided marketplace or a data-heavy fintech app), so it's achievable end-to-end including a *working* prototype, not just static screens.
- Strong portfolio piece: it touches onboarding, forms, empty states, a light data-viz moment (streaks/progress), microinteractions, and settings — the full range reviewers look for — without requiring complex logic.
- Visually distinctive: a soft, organic, plant-growth visual metaphor (seedling → bloom) gives the design system a clear personality instead of defaulting to another generic blue SaaS look.
- Genuinely useful, which makes writing realistic content, empty states, and copy much easier than an abstract concept.

**Target users:** Busy 20–40 year olds who've tried habit apps before, bounced off ones that feel punishing (broken streak = failure), and want something encouraging and low-friction.

**Core value proposition:** Small, kind nudges — not guilt. Missing a day doesn't reset your progress to zero; the plant just grows a little slower.

If a different topic is preferred later, swap this section out — everything below (process, schedule, system) still applies to any single-user mobile app of similar scope.

---

## 2. Scope for this sprint (what's in / out)

**In scope:**
- Onboarding + account creation
- Home dashboard (today's habits, streak/progress state)
- Add / edit a habit (name, frequency, reminder time, icon/color)
- Habit detail + calendar/streak history
- Daily mood check-in (quick tap, 5-point scale)
- Short reflection / journal entry tied to a check-in
- Insights / stats screen (weekly view, simple trends)
- Reminders & notification settings
- Profile & app settings
- Empty, loading, and success/celebration states
- A fully connected, clickable prototype covering 3 end-to-end flows (below)

**Out of scope (note as "future work," don't build):**
- Social/friends features, leaderboards
- Premium/paywall (unless there's extra time on Day 7)
- Multi-platform (design for mobile only, one primary device size)
- Real backend/data — all content is realistic sample data

---

## 3. Seven-day plan

Mapped to the 8-step process in the reference infographic, compressed to fit a week. Each day has a concrete output — don't move on until that day's output exists.

**Day 1 — Define & Research, Plan & Structure**
- Write short user personas (1–2) and their top pain points with existing habit apps
- Sketch the information architecture: full screen list + navigation map (tab bar vs. stack)
- Define the 3 end-to-end user flows the prototype must support:
  1. First-time onboarding → create first habit → land on home
  2. Log today's habits → do a mood check-in → write a short reflection
  3. Open insights → review weekly streaks → adjust a reminder in settings
- **Output:** one-page brief (personas + flows) + a simple sitemap

**Day 2 — Wireframes (low-fi)**
- Grey-box wireframes for every screen in the sitemap
- Focus on layout, hierarchy, and content — no color/type decisions yet
- **Output:** full low-fi wireframe set, one Figma page

**Day 3 — Design system & components**
- Define the design system first, before any high-fidelity screen: color palette, type scale, spacing (8pt grid), iconography style, corner radii, elevation/shadow rules
- Build the base component library: buttons (primary/secondary/ghost, all states), input fields, cards, nav bar / tab bar, chips/tags, progress ring or streak indicator, modals/sheets
- Use variants + auto layout so components resize and restate correctly
- **Output:** a "Design System" Figma page — styles, variables, and components — ready to reuse

**Day 4 — UI design (high-fi), part 1**
- Apply the design system to the core flow: onboarding, home dashboard, add/edit habit, habit detail
- Maintain consistency: every screen pulls from the same styles/components, nothing hand-rolled per screen
- **Output:** high-fidelity screens for flow 1 (onboarding → first habit → home)

**Day 5 — UI design (high-fi), part 2**
- Remaining screens: mood check-in, reflection entry, insights/stats, reminders, settings, profile, empty/loading/celebration states
- Pass over Day 4 screens again for consistency now that the full set exists
- **Output:** complete high-fidelity screen set, all three flows fully covered

**Day 6 — Prototype & interactions**
- Connect every screen using Figma's Prototype mode for the 3 flows defined on Day 1
- Add real interaction detail: tap targets, transitions, Smart Animate for the streak/progress ring and celebration moments, overlays for modals/sheets, correct transition timing/easing
- **Output:** a fully clickable prototype, start to finish, for all 3 flows

**Day 7 — Test, validate, iterate, deliver**
- Click through the prototype yourself end-to-end as if new to the app; note friction points
- If possible, have 1–2 other people test it and give feedback
- Fix the highest-impact issues found (don't chase every nitpick — time-boxed)
- Tidy the Figma file for handoff: clear page names, clean layer names, a short cover page explaining what it is and how to try it
- **Output:** polished, presentable, working prototype ready to share

---

## 4. Design system guardrails

- **Palette:** soft, organic, calm — greens and warm neutrals as the primary palette (growth metaphor), one accent color for CTAs/highlights, clear semantic colors for success/warning/error. Avoid a generic corporate-blue SaaS palette.
- **Type:** one rounded/humanist sans-serif family, a clear scale (e.g., display / h1 / h2 / body / caption), generous line-height for readability.
- **Spacing:** 8pt grid throughout; consistent margins/padding per component.
- **Accessibility:** minimum 4.5:1 text contrast, minimum 44×44pt tap targets, don't rely on color alone to convey state (streak broken vs. active, etc.).
- **Components over one-offs:** if a screen needs something not in the component library, add it to the library — never build a one-off element directly on a screen.
- **File organization:** the Figma team plan (Starter) caps files at 3 pages, so the file uses 3 pages instead of 5: **Cover + Design System**, **Wireframes**, **UI Screens + Prototype** (prototype connections live on the same canvas as the high-fi screens). Clear, human-readable layer and frame names (no "Frame 47").
- **Plan limits to plan around:** the Starter plan also caps MCP tool calls (Figma AI/agent actions) — Day 3 work paused mid-way when the cap was hit. Spread remaining design-system/component work across sessions if needed, and consider upgrading if this recurs.

---

## 5. How to work in this project

- Start any design work by reviewing this brief so new sessions don't drift from the concept or schedule.
- Build the design system/component library *before* high-fidelity screens — don't design screens with ad hoc styles first and retrofit a system later.
- Keep every screen consistent with the design system; consistency matters more than novelty per-screen.
- Prioritize getting all 3 end-to-end flows fully clickable over polishing screens outside those flows — a complete, working prototype beats a partial, prettier one.
- Log meaningful progress and decisions in the Status Log below so the plan stays current.

---

## 6. Definition of done

- [ ] All screens in scope exist in high-fidelity, using only design-system components
- [ ] All 3 end-to-end flows are fully connected and clickable in Prototype mode
- [ ] Empty, loading, and success states are designed, not skipped
- [ ] File is organized and named cleanly for handoff/presentation
- [ ] Prototype has been clicked through start-to-finish at least once without breaking

---

## 7. Status log

*(Update this section as work happens — date, what was done, what's next.)*

- **2026-09-04:** Project brief and 7-day plan created. Topic selected: Bloom, a habit & wellness tracker. Next: Day 1 research + IA.
- **2026-09-04:** Day 1 complete — 2 personas (Mei, Dev) with pain points, full IA/sitemap (3-tab nav + modal stack), and the 3 end-to-end flows detailed. See `claude/day1-brief.md`. Next: Day 2 low-fi wireframes for every screen in the sitemap, one Figma page.
- **2026-09-04:** Figma connected. Created the working file "Bloom - Habit & Wellness Tracker" (https://www.figma.com/design/ObnQ3HfzRwqK8QjSVDUXz7). Team plan is Starter (3-page cap), so file org adjusted to 3 pages — see section 4. Day 2 complete — all 16 low-fi wireframes built on the Wireframes page (grey-box, no color/type decisions), grouped in 4 rows: Onboarding (4), Home states (4), Habit actions & check-ins (4), Insights/Profile/Settings (4). Next: Day 3 — design system (palette, type scale, 8pt grid, component library) on the Cover + Design System page.
- **2026-09-04:** Day 3 started on the Cover + Design System page. Completed: color variables (Bloom/Primitives — green/neutral/accent/semantic scales; Bloom/Color — semantic aliases for bg, text, border, brand, cta, state), Bloom/Spacing (8pt grid: xs–3xl) and Bloom/Radius variable collections, full type scale as text styles (Display/H1/H2/Body/Label/Caption) using **Fredoka** (rounded, warm, humanist — matches the growth metaphor), two elevation effect styles (Shadow/Low, Shadow/Medium), a foundations documentation section (color swatches + type specimen), the **Button** component set (Primary/Secondary/Ghost × Default/Pressed/Disabled, pill-shaped), and the **Input Field** component set (Default/Focused/Error/Filled). Paused here — hit the Figma Starter plan's MCP tool-call rate limit. Still to do for Day 3: Card, Tab Bar (variant per active tab), Chip/Tag (Default/Selected), Streak/progress ring indicator, and a Bottom Sheet/Modal component. Resume by continuing component creation on the same page (component-set IDs are named clearly: "Button" at y=900, "Input Field" at y=1050 — next components should start around y=1150+).

## Figma file
- **Bloom - Habit & Wellness Tracker:** https://www.figma.com/design/ObnQ3HfzRwqK8QjSVDUXz7
- File key: `ObnQ3HfzRwqK8QjSVDUXz7`