# AI-DLC Audit Log

## Workspace Detection / Initial Request
**Timestamp**: 2026-08-25T00:00:00Z
**User Input:**

```text
puedes revisar esto pls con docs y guides que tenemos y ver tambien las task si se nos olvida algo por definir y si todo tiene sentido y esta ready para el poker scrum # Product Backlog & User Stories — Finance AI Tracker

---

> **Note:** Teacher requires at least **10 user stories**. Current: 2 (HU-001, HU-002).
> The remaining 8+ will come from splitting future stories (receipt photo, audio, CRUD, dashboard)
> into frontend/backend pairs and adding income tracking + spending limits.

---

## Product Backlog

| Code | Feature | Priority | Status | Notes |
|------|---------|----------|--------|-------|
| PB-001 | Auth multi-user | High | Not started | Sprint 1 — Register + Login |
| PB-002 | Photo → AI extraction + categorization | High | Not started | Sprint 2 |
| PB-003 | Audio → AI parsing + categorization | Medium | Not started | Sprint 3 |
| PB-004 | Expense registration & management (CRUD) | Medium | Not started | Sprint 3 |
| PB-005 | Dashboard by category + date filter | Medium | Not started | Sprint 4 |

---

## User Stories

---

### HU-001: Register

**Feature:** PB-001

**Story:**
> As a new user, I want to create an account so that I can start using the app.

**Acceptance Criteria:**
- I enter email + password + confirm password → account is created
- If the email is already taken → I see an error message
- If the password is too short → I see an error message
- My password is never shown or stored in plain text

**Checklist: Setup**
- [ ] Docker Compose (api + postgres)
- [ ] Run schema.sql + seed data (roles, currencies, payment methods)
- [ ] Create FastAPI project structure
- [ ] Create Flutter project + apply mockup theme
- [ ] Write `docs/api-spec.yaml` (register + login + me endpoints)

**Checklist: API**
- [ ] POST /register endpoint (validate → hash → insert → return token)

**Checklist: UI**
- [ ] RegisterScreen (email + password + confirm password + register button)

**Story Points:** *(to be estimated)*

---

### HU-002: Login

**Feature:** PB-001

**Story:**
> As a returning user, I want to log in so that I can access my expense data.

**Acceptance Criteria:**
- I enter email + password → I'm logged in and see the chat screen
- If the password is wrong → I see "Invalid email or password"
- If my token expires → I'm redirected to login
- I stay logged in until I log out

**Checklist: API**
- [ ] POST /login endpoint (find user → verify hash → return JWT)
- [ ] GET /me endpoint (validate token → return current user)

**Checklist: UI**
- [ ] LoginScreen (email + password + login button)
- [ ] Token storage
- [ ] Protected routes — redirect to login if no valid token
- [ ] Connect to API

**Story Points:** *(to be estimated)*

---

### HU-003: Receipt photo → AI extraction + categorization

**Feature:** PB-002

**Story:**
> As a user, I want to upload a photo of my receipt so that the AI automatically extracts the data — merchant, date, currency, payment method, total, and each item with its name, amount, and subcategory — and I can confirm, edit, or discard before saving.

**Acceptance Criteria:**
- The app opens the camera and captures the image
- The image is temporarily sent to the backend
- AI returns: merchant, date, currency, payment method, total
- AI returns each item: name, amount, subcategory
- purchase_reason and item_reason are optional
- User sees a confirmation card with receipt data
- User sees the list of extracted items
- User can edit business fields (merchant, date, total, items, etc.)
- User CANNOT edit technical fields (user_id, receipt_id, etc.)
- User can add or remove items
- User can Confirm / Edit / Discard
- If discarded, the temporary image is deleted
- On confirm, everything saves atomically (receipt + items + image + relations)
- On failure, nothing is saved (rollback)

**Tasks:** *(to be defined in Sprint Planning)*

**Story Points:** *(to be estimated)*

---

### HU-004: Audio → AI parsing + categorization

**Feature:** PB-003

**Story:** *(to be defined)*

**Acceptance Criteria:** *(to be defined)*

**Tasks:** *(to be defined)*

**Story Points:** *(to be estimated)*

---

### HU-005: Expense registration & management (CRUD)

**Feature:** PB-004

**Story:**
> As a user, I want to register expenses manually and manage them (create, edit, delete) to have full control over my information.

**Acceptance Criteria:**
- I can create an expense with amount, date, merchant, currency, payment method, and category/subcategory
- I can optionally add purchase_reason or item_reason
- The expense is associated with the authenticated user
- I can edit my own expense
- I can delete my own expense
- I cannot view/edit/delete another user's expenses
- Categories and subcategories are saved correctly
- I can save a receipt with data and an optional image
- Manual expenses can be saved without an image
- Invalid amounts or missing required fields are rejected

**Tasks:** *(to be defined in Sprint Planning)*

**Story Points:** *(to be estimated)*

---

### HU-006: Dashboard by category + date filter

**Feature:** PB-005

**Story:** *(to be defined)*

**Acceptance Criteria:** *(to be defined)*

**Tasks:** *(to be defined)*

**Story Points:** *(to be estimated)*

---

## Sprint Plan

| Sprint | Features |
|--------|----------|
| Sprint 1 | Register (HU-001) + Login (HU-002) |
| Sprint 2 | Photo → AI (HU-003) |
| Sprint 3 | Audio (HU-004) + CRUD (HU-005) |
| Sprint 4 | Dashboard (HU-006) + Testing + Survey |
```

**AI Response:** Reviewed the workspace, persistent project graph, backlog, Scrum guide, scope, feature list, architecture, schema, stack, mockups, sprint plan, and task list. The request is a documentation/backlog refinement review, not an implementation change.

**Context:** Workspace detection and requirements completeness review for Scrum Poker readiness.

---

## Workspace Detection / Findings
**Timestamp**: 2026-08-25T00:00:00Z
**User Input:** "Review the backlog against the repository documentation and guides, check tasks and unresolved decisions, validate consistency, and assess readiness for Scrum Poker."

**AI Response:** Brownfield planning workspace detected. Existing project documentation and a persistent graph are present; no application code or prior AI-DLC state/audit artifacts were found. Review identified conflicting backlog versions, undefined stories, unresolved scope decisions, missing API specification, missing seed data, and a schema creation-order issue.

**Context:** Workspace detection completed; requirements depth assessed as standard for backlog refinement.

---

## Requirements Scope Clarification
**Timestamp**: 2026-08-25T00:00:00Z
**User Input:** "solo register and login ...."

**AI Response:** Narrowed the review and Poker scope to HU-001 Register and HU-002 Login only. Photo, audio, CRUD, dashboard, income, and spending limits remain future backlog items and are not required for this estimation session.

**Context:** Requirements scope clarification received after initial backlog review.

---

## Schema Clarification
**Timestamp**: 2026-08-25T00:00:00Z
**User Input:** "correjirr el orden de creacion en docs schema como asi ?? que pasa ??"

**AI Response:** Explained that the `user` table references `currency(id)` before the `currency` table is created, which can cause PostgreSQL schema initialization to fail. No schema file was changed in this interaction.

**Context:** Clarification of a pre-existing database schema ordering issue.

---

## Backlog Classification Clarification
**Timestamp**: 2026-08-25T00:00:00Z
**User Input:** "uan duda esto que cambia: contraseña mínima de 8 caracteres; Register devuelve JWT o redirige a Login; duración y expiración del JWT; logout borrando el token local; nuevo usuario con rol user y moneda COP. ¿Esto va como acceptance, user story o task?"

**AI Response:** Classified the listed items as decisions that refine existing user stories: acceptance criteria for observable behavior, non-functional/security requirements where applicable, and implementation/setup tasks for the technical work. No new feature story is required.

**Context:** Clarification of where authentication decisions belong in the backlog.

---

## Diagram Analysis Question
**Timestamp**: 2026-08-25T00:00:00Z
**User Input:** "Una duda me ayudas a ver que diagramas puedo hacer con la informacion que tengo en el repo que diagramas uml osea automaticmanete inferidos de la data que ya esta???"
**AI Response:** Performed workspace detection and analyzed all documentation sources (docs/ARCHITECTURE.md, docs/SCHEMA.md, docs/schema.sql, docs/ALCANCE.md, docs/FEATURES.md, docs/BACKLOG-AND-STORIES.md, docs/STACK.md, docs/mockups/, graphify-out/). Presented the UML diagram inventory that can be auto-inferred from existing data and asked which ones to generate. No files were changed.
**Context:** Advisory analysis question — no code generation requested.

---

## UML Diagrams Generation
**Timestamp**: 2026-08-25T00:00:00Z
**User Input:** "Generalo de todas maneras, peor primero dime cuales uml exiten y cuiales exigen en un proyecto y cuales pdoemos hacer ahora y cuales dberiamos hacer"
**AI Response:** Inventoried existing diagrams (SCHEMA.md classDiagram+erDiagram, ARCHITECTURE.md layer/component/2 DFDs, guide examples, graphify graph.html) and generated docs/UML.md with 8 new Mermaid diagrams: use case (User+Admin), class data model from schema.sql, activity (capture), state machine (expense lifecycle), deployment, and 3 sequence diagrams (register expense, login JWT, ask AI). All 8 blocks validated with mmdc 11.16.0 + Chrome (zero errors). Roles caveat documented: Admin per ALCANCE.md vs step5-plan Q1 exclusion.
**Context:** Advisory question escalated to explicit generation request; content validated per content-validation.md.

---

## Educational Question — Class Diagram
**Timestamp**: 2026-08-25T00:00:00Z
**User Input:** "QUE ES EL DIAGRAMA DE CLASES Class Diagram"
**AI Response:** Explained what a UML class diagram is (structural/static view: classes, attributes, methods, relationships), the notation (3 compartments, visibility symbols, multiplicities), relationship types, the three levels (domain/analysis/design), the difference vs ER, and how it applies to the project's docs/UML.md class diagram (data model level, no methods until code exists). No files changed.
**Context:** Educational clarification question.

---

## HU-003 Family Redefinition (Happy Path / Failure Path / Text Parse)
**Timestamp**: 2026-08-30T00:00:00Z
**User Input:** "q1. A / q2. A / q3. but how wee know if the recipt is blurry ?? / q4. I think a retro is enought / q5. C is best option / q6. A / q7I think is ok" — then "I think is all right save that vercion i think is good"
**AI Response:** Defined the HU-003 family per SPIDR Path split (guide §9): HU-003 photo happy path (photo-only scope; Editar opens the HU-005a form; post-save "✅ Gasto guardado" + clean hub; technical fields locked; optional reasons), HU-003a failure paths (unreadable = AI reports status:unreadable, no blur detection; partial extraction shown; backend fail → Reintentar; permission denied → settings shortcut + manual fallback; temp image cleanup 24h; atomic rollback), HU-003b text → AI parse (text field confirmed as AI-parse channel from mockup evidence — placeholder 'gasté 15 mil en almuerzo en Subway…', Enter triggers the same AI card; minimal receipt, no image). Fixed Sprint Plan to match locked manual-first decision (Sprint 2 = CRUD 005a/b/c, Sprint 3 = photo+text, Sprint 4 = audio+dashboard). Updated story count note (8 fully defined) and parked section (4 items resolved, 4 remaining). Cross-checked against ALCANCE.md, FEATURES.md, step5-plan.md, mockups, schema — no other files needed changes.
**Context:** docs/BACKLOG-AND-STORIES.md — user-story definition session, decisions logged with [Answer] format.

---

## Story Renumbering to Build Order
**Timestamp**: 2026-08-30T00:00:00Z
**User Input:** "but organize the numbers in order i mean like is it but with 1 2 3 login manual image"
**AI Response:** Renumbered all stories so codes follow build order: HU-001 Register · HU-002 Login · HU-003 Create manually (was 005a) · HU-004 Edit & delete (was 005b) · HU-005 Find/search (was 005c) · HU-006 Photo happy path (was 003) · HU-007 Photo failures (was 003a) · HU-008 Text parse (was 003b) · HU-009 Audio (was 004) · HU-010 Dashboard (was 006) — exactly 10 stories, meeting the teacher requirement. Applied via two-pass placeholder rename (no code collisions) to BACKLOG-AND-STORIES.md, MOCKUPS.md, FEATURES.md, mockups/index.html, menu-variants.html, input-variants.html. Replaced the old HU-005 epic block with a CRUD note, fixed all "Split of:" lines, rewrote top note with the old→new mapping, updated sprint plan/parked/decisions headers. Verified 0 stale references remain. Left untouched: audit.md (historical), index-backup.html (backup), docs/SPRINT-PLAN.md (older doc with its own numbering scheme — flagged to user as a separate cleanup task).
**Context:** docs/BACKLOG-AND-STORIES.md — numbering consistency pass across all docs.

---

## Requirements Analysis / Backlog and User Stories Review
**Timestamp**: 2026-08-30T20:58:11Z
**User Input**: "check if the backlog makes sense and the user histories are god based on the guide and all the other info in the repo"
**AI Response**: Began a brownfield documentation review of the backlog and user stories against the repository guides, architecture, schema, features, mockups, sprint plan, tasks, and project context. The review will assess story quality, consistency, missing definitions, dependencies, and Scrum Poker readiness.
**Context:** Requirements analysis and backlog refinement review.

---

## Requirements Analysis / Review Findings
**Timestamp**: 2026-08-30T21:02:02Z
**User Input**: "check if the backlog makes sense and the user histories are god based on the guide and all the other info in the repo"
**AI Response**: Reviewed the current backlog and stories against the Scrum guide, repository scope, features, architecture, schema, mockups, tasks, sprint plans, and project context. Findings: HU-001 through HU-008 have a useful user-centered structure, vertical dependencies, confirmation/error paths, and ownership rules, but HU-009 and HU-010 are still placeholders. The backlog is not ready as a complete Poker package because the Product Goal, Definition of Done, team/capacity assumptions, story estimates, and a single authoritative sprint plan are missing. Blocking consistency issues include manual/text input being defined both as AI parsing and direct manual save, and receipt totals being defined both as item auto-sums and as printed totals that may differ. The repository also contains a stale `docs/SPRINT-PLAN.md`, a schema creation-order defect where `user.preferred_currency_id` references `currency` before it is created, no seed-data file despite the backlog requiring seed data, and missing `docs/api-spec.yaml`. Income is in the scope/schema/mockup but has no user story, while dashboard scope is inconsistent between category-only analytics and income/balance/trend analytics. No backlog or application-code files were changed; only the required audit and state tracking were updated.
**Context:** Requirements analysis completed for a documentation/backlog readiness review; implementation is not authorized.

---

## Documentation Refinement / Implementation Request
**Timestamp**: 2026-08-30T21:33:18Z
**User Input**: "Implement the plan."
**AI Response**: Implemented the approved documentation refinement plan: synchronized the sprint plan with the current backlog, clarified manual versus AI-assisted text capture, documented source-dependent receipt totals, refined the active expense stories, and removed stale core-chat wording. Deferred database/API setup, Scrum preparation, audio definition, and dashboard definition as requested.
**Context:** Documentation-only backlog and user-story refinement.

---

## Documentation Refinement / Completion
**Timestamp**: 2026-08-30T21:48:04Z
**User Input**: "Implement the plan."
**AI Response:** Completed the approved documentation refinement. Sprints now match the active backlog; manual-form and AI-assisted text paths are distinct; receipt totals are source-dependent; HU-003 through HU-008 contain the selected behavior, failure, editing, contract, and upload decisions; core chat wording is removed; and admin is explicitly future scope outside the current core. Validation passed for story/sprint consistency, mockup JavaScript syntax, Mermaid architecture/schema diagrams, and `git diff --check`.
**Context:** Implementation and verification of the documentation-only backlog refinement; database/API setup, Scrum preparation, HU-009 audio definition, and HU-010 dashboard definition were intentionally deferred.

---

## User Story Task Checklists and Mockup / Completion
**Timestamp**: 2026-08-30T22:38:50Z
**User Input**: "Implement the plan."
**AI Response:** Added API, UI, Tests, and Mockup checklists for HU-003 through HU-008 in `docs/BACKLOG-AND-STORIES.md`. Updated `docs/mockups/index.html` and `docs/MOCKUPS.md` to cover manual direct-save validation, source-specific photo/text AI previews, edit-before-confirm, printed versus item-sum totals, date filtering, deletion feedback, and representative AI failure states. Normalized edited totals and validated the interactive flows with a headless browser smoke suite.
**Context:** Implementation of the approved task-definition and mockup-verification plan. HU-009 audio and HU-010 dashboard task definitions remain intentionally deferred; no application backend or frontend source code was added.

---

## Backlog Renumbering — PB codes aligned to build order
**Timestamp**: 2026-08-31T00:00:00Z
**User Input**: "can you help organizene this better pls thi sway:PB-001 Auth multi-usuario / PB-002 Registro manual y gestión de gastos (CRUD) / PB-003 Photo → AI extraction + categorization / PB-004 Audio → AI parsing + categorization / PB-005 Dashboard por categoría + filtro período — in this order the backlog is like that ??"
**AI Response**: Confirmed the proposed order matches build/sprint order and dependency order. Updated `docs/BACKLOG-AND-STORIES.md`: backlog table reordered to PB-001 Auth (Sprint 1) · PB-002 CRUD (Sprint 2, priority raised to High) · PB-003 AI capture photo+text (Sprint 3) · PB-004 audio (Sprint 4) · PB-005 dashboard (Sprint 4). Updated the header renumbering note and all `**Feature:**` references (HU-003/004/005 → PB-002 · HU-006/007/008 → PB-003 · HU-009 → PB-004 · HU-010 → PB-005, HU codes unchanged). Verified no other docs reference PB codes (SPRINT-PLAN.md, UML.md, TASKS.md use HU codes only).
**Context:** Documentation-only backlog renumbering approved by user ("ok"); no application code changed.

---

## Estimation Scale and Story Points (HU-001/HU-002)
**Timestamp**: 2026-08-31T00:00:00Z
**User Input**: "Ok primero que todo pon que la escala de esto es por dias y ponle a register y login done y story point 3 register y login 2" then "actually wait dont put that to done again only the points"
**AI Response**: Added "**Estimation scale:** Story Points = days of work (not Fibonacci)" to the header note of `docs/BACKLOG-AND-STORIES.md`. Set HU-001 Register → 3 (days) and HU-002 Login → 2 (days); normalized the remaining 8 stories to *(days — to be estimated)*. Per the user's correction, the Done status was NOT applied — PB-001 remains "Not started" in the Product Backlog table.
**Context:** Story-point scale definition and partial estimation; HU-009/HU-010 definitions and remaining estimates still pending.

---

## HU-009 Audio Story Definition (Option B split)
**Timestamp**: 2026-08-31T00:00:00Z
**User Input**: "I prefer b" (split audio into happy path + failure paths like photo, SPIDR Path guide §9)
**AI Response**: Fully defined HU-009 "Record a voice expense (happy path)" (Story, 15 ACs, 3 scenarios, technical note on the shared AI contract with source: audio, API/UI/Tests/Mockup checklists) and added new HU-011 "Voice capture fails or the AI can't hear me" (Story, 7 failure ACs, 4 scenarios, checklists) mirroring the HU-006/HU-007 pattern. Assumptions applied per recommendation: in-app mic button in the capture bar, max 60 s, M4A/WAV, server-side STT. Recorded decisions #12 (audio input/limits) and #13 (audio split) in Pending Decisions; marked the parked item about HU-009 failure ACs as resolved; updated header note (11 numbered stories, 10 defined), PB-004 row note, and Sprint Plan Sprint 4 row. HU-010 dashboard remains the only pending definition.
**Context:** Documentation-only backlog refinement; story points for HU-009/HU-011 left *(days — to be estimated)* pending user estimation.

---

## Cross-Doc Consistency Check — Audio Stories vs Guides and Other Docs
**Timestamp**: 2026-08-31T00:00:00Z
**User Input**: "ok I think is good both of these check guide and all the other docs if it makes sense"
**AI Response**: Verified HU-009/HU-011 against ALCANCE.md, FEATURES.md, STACK.md, SCHEMA.md/schema.sql, ARCHITECTURE.md, UML.md, MOCKUPS.md/mockups, SPRINT-PLAN.md, and the Scrum guide. Consistent: audio as an AI-assisted channel with confirm-before-save; schema supports audio receipts (image nullable); single parsed amount = item + receipt total; mockups already include mic button and 'Nota de voz' card; UML diagrams already cover audio; SPIDR Path split matches guide §9; 11 stories satisfies the ≥10 requirement. Fixed 4 inconsistencies: (1) HU-009/HU-011 wording now matches STACK.md one-call STT (no separate STT service, fallback only); (2) FEATURES.md audio feature now states the 60 s M4A/WAV cap; (3) SPRINT-PLAN.md Sprint 4 retitled with HU-009 + HU-011 rows marked defined and sync date bumped to 2026-08-31; (4) added `record` Flutter dependency for mic capture. Noted (not changed): Scrum guide recommends Fibonacci for story points while the project uses a days scale per user decision.
**Context:** Documentation-only consistency review; HU-010 dashboard remains the only pending story definition.

---

## HU-010 Dashboard Definition and Fibonacci Restoration
**Timestamp**: 2026-08-31T00:00:00Z
**User Input**: "ok write that and restore fibonacci pls" then "ok writte"
**AI Response**: Fully defined HU-010 "Dashboard by category + date filter" (Story, 8 ACs, technical note on backend-computed analytics, 3 scenarios, API/UI/Tests/Mockup checklists) using the recommended decisions: period presets Hoy/Esta semana/Este mes, total spent + per-category totals as pie chart + category table, read-only analytics with empty state, ownership scoping, all capture sources included. Restored the standard Fibonacci estimation scale: header note updated, HU-001 → 3 / HU-002 → 2 (valid Fibonacci points), all other stories back to *(to be estimated)*. Updated header note to "all 11 stories fully defined", PB-005 backlog row note to "Sprint 4", SPRINT-PLAN.md HU-010 row to "defined (2026-08-31)", and added decision #14 (dashboard scope + Fibonacci restoration) to Pending Decisions. Verified no "to be defined", "pendiente de definición", or "days" references remain.
**Context:** Documentation-only backlog refinement; the backlog is now fully defined — only story-point estimation for HU-003…HU-011 remains open.
