# The Complete Scrum Guide: From Zero to Running Sprints

> A practical, step-by-step plan covering **every Scrum topic**: theory, roles, events, artifacts, the backlog, user stories, estimation, planning, tracking, and reviews - with examples and sources for each section.

---

## Table of Contents

1. [What Scrum Is (Theory, Pillars, Values)](#1-what-scrum-is)
2. [The Scrum Team (Roles & Accountabilities)](#2-the-scrum-team)
3. [The 5 Events: What They Are and How to Run Them](#3-the-5-events)
4. [The 3 Artifacts + Commitments](#4-the-3-artifacts)
5. [The Product Backlog: How to Build It](#5-the-product-backlog)
6. [User Stories: Format, Examples, INVEST](#6-user-stories)
7. [Acceptance Criteria (Given/When/Then)](#7-acceptance-criteria)
8. [Definition of Done vs. Acceptance Criteria](#8-definition-of-done)
9. [Splitting Epics: SPIDR](#9-splitting-epics)
10. [Estimation: Story Points & Planning Poker](#10-estimation)
11. [Sprint Planning: Capacity, Velocity, Sprint Goal](#11-sprint-planning)
12. [Running the Sprint: Daily Scrum, Burndown, Tracking](#12-running-the-sprint)
13. [Sprint Review vs. Retrospective](#13-review-vs-retrospective)
14. [The Complete Workflow (One-Page Plan)](#14-one-page-plan)
15. [Sources](#15-sources)

---

## 1. What Scrum Is (Theory, Pillars, Values)

**Definition (official):** "Scrum is a lightweight framework that helps people, teams and organizations generate value through adaptive solutions for complex problems." - *The 2020 Scrum Guide, Schwaber & Sutherland*

Scrum is **empirical**: knowledge comes from experience, and decisions come from what is observed. It is built on **lean thinking**: reduce waste, focus on essentials.

### The 3 Pillars (Empiricism)
| Pillar | Meaning |
|---|---|
| **Transparency** | Work and progress must be visible to everyone involved. |
| **Inspection** | Artifacts and progress are inspected frequently to detect problems. |
| **Adaptation** | If something deviates, adjust as soon as possible. |

### The 5 Values
**Commitment** · **Focus** · **Openness** · **Respect** · **Courage**

> These values + pillars = trust. The Guide says inspection without adaptation is "pointless" - you must close the loop.

**How to do it:** Post the pillars and values where the team can see them; at every retrospective, ask "which value did we violate this sprint?" and pick one to improve.

---

## 2. The Scrum Team (Roles & Accountabilities)

Since the **2020 Scrum Guide**, these are called *accountabilities*, not roles - they are responsibilities, not job titles. One team = 1 Product Owner + 1 Scrum Master + Developers (typically 10 or fewer people). No sub-teams, no hierarchy; the team is **cross-functional** (all skills to deliver value) and **self-managing** (decides who does what, when, how).

| Accountability | Accountable for | What it means day-to-day |
|---|---|---|
| **Product Owner** | Maximizing the value of the product; effective Product Backlog management | Writes/orders backlog items, communicates the Product Goal, is the **single voice** of stakeholders ("one person, not a committee") |
| **Scrum Master** | Scrum effectiveness; establishing Scrum as defined in the Guide | Coaches the team, removes impediments, ensures events happen and stay in their timeboxes, helps the PO with backlog techniques |
| **Developers** | Creating a usable Increment each Sprint | Build the Sprint Backlog plan, adapt it daily, hold each other accountable, instill quality via the Definition of Done |

**How to do it:** Write ONE page naming each accountability and its owner for your project (even for a student project: one person can hold PO + SM + Developer, but state which hat you're wearing when).

---

## 3. The 5 Events

The Sprint is the container; all other events are timeboxed opportunities to inspect and adapt. Maximum timeboxes (2020 Guide):

| Event | Timebox (1-month sprint) | Purpose |
|---|---|---|
| **The Sprint** | 1 month or less | Fixed-length container; no changes that endanger the Sprint Goal; quality never decreases |
| **Sprint Planning** | max 8h | Define Sprint Goal (why), select backlog items (what), plan delivery (how) |
| **Daily Scrum** | max 15 min | Inspect progress toward Sprint Goal; adapt the plan for the next 24h |
| **Sprint Review** | max 4h | Inspect the Increment with stakeholders; adapt the Product Backlog |
| **Sprint Retrospective** | max 3h | Inspect people/process/tools; plan improvements |

*Shorter sprints -> shorter events (e.g. 2-week sprint -> ~4h planning, ~2h review, ~1.5h retro).*

### Sprint
- Sprints are **1 month or less**, fixed length, one starts immediately after the previous ends.
- Scope may be clarified/renegotiated with the PO as learning happens - but the Sprint Goal is protected.
- **Only the PO can cancel a Sprint** (if the Goal becomes obsolete).

**How to do it:** Pick a sprint length (2 weeks is the most common for software teams) and put the dates on a shared calendar. Protect the timeboxes.

---

## 4. The 3 Artifacts

Each artifact carries a **commitment** that makes progress measurable:

| Artifact | What it is | Commitment |
|---|---|---|
| **Product Backlog** | Emergent, ordered list of everything needed to improve the product - the single source of work | **Product Goal** |
| **Sprint Backlog** | Sprint Goal (why) + selected items (what) + plan (how); updated daily; owned by the Developers | **Sprint Goal** |
| **Increment** | Concrete, usable, thoroughly verified step toward the Product Goal; additive to all prior Increments | **Definition of Done** |

Key rules from the Guide:
- An item that doesn't meet the **Definition of Done** is NOT part of the Increment - it goes back to the Product Backlog.
- An Increment may be delivered before the Sprint ends; the Review is **not a gate** for releasing value.
- Commitments exist to reinforce empiricism and the Scrum values.

---

## 5. The Product Backlog: How to Build It

**What it is:** an *emergent, ordered* list - the single source of work for the team. It evolves as the product and market change.

### Step-by-step method to build one from zero

1. **Define the Product Goal first** - the long-term target ("a future state of the product"). Example: *"Allow university students to book study rooms and manage their class schedule from one app."* Everything in the backlog should serve this goal.
2. **Brainstorm features** (epics): gather every idea from stakeholders, users, docs - no filtering yet.
3. **Write each feature as a user story** (see next section) or an epic if it's too big.
4. **Order (prioritize)** the list - this is the PO's core job. Use a technique:
   - **MoSCoW** - Must / Should / Could / Won't (quick, easy for student projects)
   - **Value vs. Effort** - plot on a 2x2; do high-value/low-effort first
   - **WSJF** - (Value + Time criticality + Risk reduction) / Effort; highest score first (SAFe)
   - **Kano** - classify features by customer delight (basic / performance / delighters)
5. **Refine continuously** - the top items must be small, clear, and ready ("sprint-ready") before planning. Typical team rule: top 10-20% of the backlog is refined.
6. **Make it visible** - physical board or tool (Jira, Trello, GitHub Projects). Everyone sees the same list.

**How to do it (practical):** Create a table/spreadsheet with columns: `ID | Story (As a... I want... so that...) | Priority (MoSCoW) | Estimate (points) | Epic | Status`. Sort by priority. Review it at every Sprint Review and refinement session.

---

## 6. User Stories

**Definition (Atlassian):** the smallest unit of work in Agile - "an end goal, not a feature," written from the user's perspective, in non-technical language.

### The 3 C's
- **Card** - the written story (short)
- **Conversation** - discussions that clarify details
- **Confirmation** - the acceptance criteria

### The standard format
```
As a [persona], I want [goal] so that [benefit].
```

### Examples
- As a shopper, I want to save items to a wishlist so that I can purchase them later.
- As a student, I want to see my grades as soon as they're published so that I can know my GPA instantly.
- As an admin, I want to deactivate a user's account so that I can block access after they graduate.

### The INVEST checklist (Bill Wake)
A good story is:
- **I**ndependent - can be developed and delivered on its own
- **N**egotiable - details are not fixed in stone
- **V**aluable - delivers real value to the user
- **E**stimable - the team can size it
- **S**mall - fits in one sprint
- **T**estable - there is a clear yes/no way to verify completion (acceptance criteria)

**How to do it:** Write stories during backlog creation from the user's words, not features. If a story can't be finished in one sprint -> split it (section 9). Testable = "if you can't test it, you can't ship it reliably."

---

## 7. Acceptance Criteria (Given/When/Then)

Acceptance criteria are the **confirmation** of the story: specific conditions that must be met for the story to be accepted. They are a *complementary practice* (not defined in the Scrum Guide itself) and they make the story testable.

### The BDD format (Behavior-Driven Development)
```
Given [context / starting state]
When  [action / event happens]
Then  [expected outcome]
```

### Example - story: "As a shopper, I want to save items to a wishlist so that I can purchase them later."

| Scenario | Criteria |
|---|---|
| Adding | **Given** I am logged in and viewing a product, **When** I click "Add to wishlist", **Then** the item appears in my wishlist |
| Duplicate | **Given** the item is already in my wishlist, **When** I click "Add to wishlist" again, **Then** I see a message "Already in wishlist" and no duplicate is created |
| Not logged in | **Given** I am not logged in, **When** I click "Add to wishlist", **Then** I am redirected to the login page and returned to the product afterwards |

**How to do it:** Write 2-5 scenarios per story. Cover the happy path + at least one edge case (duplicate, error, empty state). If it can be automated (Cucumber/SpecFlow), the scenarios become tests.

---

## 8. Definition of Done (DoD) vs. Acceptance Criteria

The #1 confusion in Scrum. The difference (scrum.org):

| | **Definition of Done** | **Acceptance Criteria** |
|---|---|---|
| Scope | Applies to **every** item in every sprint (team-wide standard) | Applies to **one specific** story |
| Owner | The whole Scrum Team (Developers enforce it) | The Product Owner defines it |
| Type | Quality gate: "what does done mean for ANY item?" | Functional: "what must THIS story do?" |
| In the Guide? | Yes - an official commitment of the Increment | No - complementary practice |

### Example DoD checklist (team-wide)
- [ ] Code written, reviewed, and merged
- [ ] Unit tests written and passing (80%+ coverage)
- [ ] Feature tested in staging by at least one other team member
- [ ] UI matches the approved design
- [ ] No known critical bugs
- [ ] Documentation updated (README, API docs)
- [ ] Deployed to production (or demo environment)

**Rule:** An item that meets ITS acceptance criteria but NOT the DoD is not done - it returns to the Product Backlog.

---

## 9. Splitting Epics: SPIDR

An epic is a big story (weeks/months). The Guide's rule: stories should fit inside one sprint. Mike Cohn's **SPIDR** technique gives 5 splitting patterns:

| Letter | Pattern | Meaning | Example split |
|---|---|---|---|
| **S** | **Spike** | Run a research/experiment task first to reduce uncertainty | "Build chat" -> "Research WebSocket vs polling" + "Build chat v1" |
| **P** | **Path** | Split by user journey steps or happy path vs. error paths | "Process order" -> "Place order (happy path)" + "Handle payment failure" |
| **I** | **Interface** | Split by device/channel/entry point | "File upload" -> "Upload from web" + "Upload from mobile" |
| **D** | **Data** | Split by data type or size of data | "Import data" -> "Import CSV" + "Import Excel" |
| **R** | **Rules** | Split by business rules/conditions | "Apply discounts" -> "Student discount" + "Black Friday coupon" |

**How to do it:** When a story is too big, ask "which SPIDR pattern applies?" and cut along that line - each slice must still deliver *some* user value (vertical slicing: thin slice through the whole stack, not horizontal layers).

---

## 10. Estimation: Story Points & Planning Poker

### Story points
- Relative units of **effort/complexity** - NOT hours. A "3" is bigger than a "2" by feel, not by a clock.
- Fibonacci scale is standard (1, 2, 3, 5, 8, 13, 21) because uncertainty grows with size.
- Only the **Developers** who will do the work size items (Guide: "The Developers who will be doing the work are responsible for the sizing").

### Planning Poker (Mike Cohn / Mountain Goat Software)
1. PO presents one story and answers questions (no leading).
2. Each developer secretly picks a card (estimate).
3. Cards revealed simultaneously.
4. Biggest and smallest estimates explain their reasoning.
5. Discuss, re-vote. Repeat until consensus (usually 2-3 rounds).

### Velocity
- Velocity = story points completed per sprint (sum of points of stories that met the DoD).
- Use the **average of the last 3-5 sprints** to forecast the next sprint.
- Example: 34 + 28 + 31 = avg **31 points** -> plan ~31 points next sprint. "Do not plan..." (more than your average) - *planning-poker.online guide*.

**How to do it:** Pick a reference story (e.g. "login" = 2 points) and compare everything to it. Track velocity honestly - only count what truly met the DoD.

---

## 11. Sprint Planning: Capacity, Velocity, Sprint Goal

Sprint Planning answers **three questions** (the 2020 Guide's three topics):

### Topic 1 - WHY is this Sprint valuable?
Define the **Sprint Goal** (the commitment of the Sprint Backlog): the single objective, written by the team, that gives the sprint coherence.
> Example: "Enable students to complete their full course registration online, from login to payment confirmation."

### Topic 2 - WHAT can be Done this Sprint?
The Developers select items from the top of the Product Backlog, guided by:
- **Velocity** (last 3-5 sprints average)
- **Capacity** (team availability: vacation, meetings, part-time schedules)
- **DoD** (what "done" really costs)

### Topic 3 - HOW will the chosen work get done?
Developers decompose each selected item into tasks (usually 1 day or less each) and own the plan. Nobody else dictates how.

### Capacity calculation (simple formula)
```
Team days this sprint = people x working days
minus: vacations + meetings + other commitments
Capacity % = available days / total days
Forecast = velocity x capacity %
```

**Example:** 4 devs x 10 days = 40 days; 6 days lost to vacations/ceremonies = 85% capacity. If velocity = 31, commit about 26 points.

**How to do it (meeting structure):** PO proposes goal and top items (pre-refined). Team discusses, selects, decomposes into tasks, and estimates the tasks. Timebox: 2-week sprint -> 4 hours max. The Sprint Goal MUST be finalized before planning ends (Guide requirement).

---

## 12. Running the Sprint: Daily Scrum, Burndown, Tracking

### Daily Scrum (max 15 min, same time & place)
Purpose: **inspect progress toward the Sprint Goal** and adapt the Sprint Backlog - NOT a status report to the manager. The 2020 Guide removed the old 3 questions; teams may use any structure, but the classic format still works:
1. What did I do yesterday?
2. What will I do today?
3. Any blockers (impediments)?

The Scrum Master's job: make sure it stays 15 minutes and that blockers get removed *after* the meeting, not during it.

### Sprint Burndown Chart
- X axis = days of the sprint; Y axis = remaining effort (points or hours).
- Ideal line = straight from total to zero; actual line = remaining work each day.
- Update it **daily** (Atlassian: "most useful when data reflects what's actually left at the end of each day").
- Read it: line above ideal = behind; steep drops = big completions; a plateau = stuck/blocker -> adapt in Daily Scrum.

### Tracking rules
- The Sprint Backlog is **updated throughout the Sprint** as more is learned (Guide).
- If the work differs from expectations, the Developers **renegotiate scope with the PO within the Sprint** - but never change the Sprint Goal.
- Impediments: visible list, SM removes them fast.

---

## 13. Sprint Review vs. Retrospective

Both happen at the end of the sprint, but they are opposites in focus:

| | **Sprint Review** (2nd to last event) | **Sprint Retrospective** (last event) |
|---|---|---|
| Focus | **Product** (outward-facing) | **Process/Team** (inward-facing) |
| Attendees | Scrum Team + **stakeholders** | Scrum Team only |
| What happens | Demo the Increment; discuss progress toward Product Goal; adapt the Product Backlog | Discuss what went well / what went wrong; pick improvements |
| Output | Adjusted Product Backlog + feedback | Concrete improvement actions (added to next Sprint Backlog) |
| Timebox (1-mo sprint) | max 4h | max 3h |

**How to do it:**
- **Review:** live demo of working software, not slides. Stakeholders ask/touch it. PO updates the backlog with new insights. It's a "working session," not a presentation (Guide).
- **Retro:** classic format - "What went well? What went wrong? What will we improve?" Pick **1-2 actionable improvements** (not a list of 20) and add them to the next Sprint Backlog so they actually happen.

---

## 14. The Complete Workflow (One-Page Plan)

```
BEFORE THE FIRST SPRINT
  1. Product Goal written (1 sentence)
  2. Feature brainstorm -> backlog (user stories + epics)
  3. Prioritize (MoSCoW / Value vs. Effort)
  4. Define team DoD checklist
  5. Refine top items until INVEST-clean + acceptance criteria written

EVERY SPRINT (2 weeks, for example)
  Sprint Planning (4h, Mon)      -> Sprint Goal + selected stories + tasks
  Daily Scrum (15 min, daily)    -> progress toward Goal + plan for today
  Development                    -> tasks done -> code reviewed -> tests pass -> DoD
  Sprint Review (2h, Fri)        -> demo Increment to stakeholders -> update backlog
  Sprint Retrospective (1.5h)    -> what went well / wrong -> 1-2 improvements

MEASURE & ADAPT
  Velocity after each sprint     -> better forecasts
  Burndown daily                 -> see drift early
  Backlog refinement (mid-sprint)-> keep top items sprint-ready
```

**Minimum viable Scrum checklist for one sprint:**
- [ ] Product Goal exists
- [ ] Backlog ordered, top items refined
- [ ] DoD agreed by the whole team
- [ ] Sprint Goal written in Planning
- [ ] Stories sized (points) by the Developers
- [ ] Daily Scrum happens, 15 min, same time/place
- [ ] Burndown updated daily
- [ ] Review shows a working Increment that meets DoD
- [ ] Retro produces at least 1 improvement that lands in the next Sprint Backlog

---

## 15. Sources

**Official (Scrum Guide):**
- The 2020 Scrum Guide - Schwaber & Sutherland: https://scrumguides.org/scrum-guide.html
- 2020 Scrum Guide PDF: https://scrumguides.org/docs/scrumguide/v2020/2020-Scrum-Guide-US.pdf
- Scrum.org - Accountabilities: https://www.scrum.org/resources/accountability-responsibility-and-roles
- Scrum.org - 2020 Update: Role to Accountabilities: https://www.scrum.org/resources/blog/scrum-guide-2020-update-role-accountabilities
- Scrum.org - The Scrum Artifacts: https://www.scrum.org/resources/scrum-artifacts
- Scrum.org - What is a Sprint Backlog: https://www.scrum.org/resources/what-is-a-sprint-backlog
- Scrum.org - What is a Daily Scrum: https://www.scrum.org/resources/what-is-a-daily-scrum
- Scrum.org - Product Goal & Sprint Goals example: https://www.scrum.org/resources/blog/product-goal-sprint-goals-simple-example
- Scrum.org - DoD vs. Acceptance Criteria: https://www.scrum.org/resources/blog/definition-done-vs-acceptance-criteria-explained (and https://www.scrum.org/resources/blog/what-difference-between-definition-done-and-acceptance-criteria)

**Agile practices (user stories, estimation, prioritization):**
- Atlassian - User Stories with examples and template: https://www.atlassian.com/agile/project-management/user-stories
- Atlassian - Story points & estimation: https://www.atlassian.com/agile/project-management/estimation
- Atlassian - Definition of Done: https://www.atlassian.com/agile/project-management/definition-of-done
- Atlassian - Burndown chart tutorial: https://www.atlassian.com/agile/tutorials/burndown-charts
- Atlassian - Prioritization frameworks: https://www.atlassian.com/agile/product-management/prioritization-framework
- Mountain Goat Software - Planning Poker: https://www.mountaingoatsoftware.com/agile/story-points/planning-poker
- Mountain Goat Software - SPIDR story splitting: https://www.mountaingoatsoftware.com/agile/five-simple-but-powerful-ways-to-split-user-stories
- Mountain Goat Software - Daily Scrum: https://www.mountaingoatsoftware.com/agile/scrum/meetings/daily-scrum
- Testomat.io - Acceptance Criteria BDD format: https://testomat.io/blog/clear-acceptance-criteria-for-user-stories-bdd-way/
- Miro - Given/When/Then framework: https://miro.com/agile/given-when-then-framework/
- Planning-Poker.online - Sprint planning practical guide (velocity example): https://www.planning-poker.online/blog/sprint-planning-practical-guide
- Highberg - Comparison of prioritization methods (Kano, MoSCoW, WSJF): https://highberg.com/insights/a-comparison-of-prioritization-methods/
- Stepsize - Sprint Review vs. Retrospective: https://stepsize.com/blog/sprint-review-vs-sprint-retrospective-and-how-to-run-them
