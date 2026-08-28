# Product Backlog & User Stories — Finance AI Tracker

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
- I enter email + password (min 8 chars) + confirm password → account is created
- After success → I see a confirmation message and am redirected to Login (not logged in automatically)
- If the email is already taken → I see an error message
- If the password is too short (< 8 chars) → I see an error message
- If passwords don't match → I see an error message
- My password is never shown or stored in plain text
- My account is created with default settings without asking me

**Checklist: Setup**
- [ ] Docker Compose (api + postgres)
- [ ] Run schema.sql + seed data (roles, currencies, payment methods)
- [ ] Create FastAPI project structure
- [ ] Create Flutter project + apply mockup theme
- [ ] Write `docs/api-spec.yaml` (register + login + me endpoints)

**Checklist: API**
- [ ] POST /register endpoint (validate → hash → insert user with role="user", currency="COP" → return success)

**Checklist: UI**
- [ ] RegisterScreen (email + password + confirm password + register button)

**Story Points:** *(to be estimated)*

---

### HU-002: Login

**Feature:** PB-001

**Story:**
> As a returning user, I want to log in so that I can access my expense data.

**Acceptance Criteria:**
- I enter email + password → I'm logged in and see the Gastos screen (capture + manual entry + my expenses)
- If the password is wrong → I see "Invalid email or password"
- If my session expires after a long time → I'm redirected to login automatically
- I stay logged in between app restarts until my session expires
- Logout clears my session and returns me to the login screen

**Checklist: API**
- [ ] POST /login endpoint (find user → verify hash → return JWT with 30 day expiry)
- [ ] GET /me endpoint (validate token → return current user)

**Checklist: UI**
- [ ] LoginScreen (email + password + login button)
- [ ] Token storage (flutter_secure_storage)
- [ ] Protected routes — redirect to login if no valid token
- [ ] Logout — clear token and redirect to login
- [ ] Connect to API

**Story Points:** *(to be estimated)*

---

### HU-005: Expense registration & management (CRUD) — EPIC

**Feature:** PB-004

> Split into (manual-first foundation):
> - **HU-005a** — Create expense manually ✅ defined
> - **HU-005b** — Edit & delete my expenses ✅ defined
> - **HU-005c** — Find my expenses (search & filters) ✅ defined
>
> "Only mine" isolation lives as acceptance criteria inside both.

---

### HU-005a: Create expense manually

**Feature:** PB-004 · **Split of:** HU-005 · **Depends on:** — (foundation story)

**Story:**
> As a user, I want to register an expense manually filling only the essentials so that I can save my spending quickly without typing everything.

**Acceptance Criteria:**
- The form has all the fields the database requires (store, date, currency, payment method, total, and each item's name/amount/subcategory) because the AI will fill them later
- For a single-item expense I only type: amount, store, and subcategory (picked from the existing list)
- I can add several items (name, amount, subcategory each) under the same receipt with an "add item" action
- The receipt total is auto-calculated as the sum of the item amounts
- Date defaults to today, currency defaults to COP, and payment method defaults to Efectivo — I can change them
- Photo, purchase_reason, and item_reason are optional and live in a collapsed "Additional fields" menu
- For a single item, the item name is auto-filled with the store text I typed, and I can edit it (I never type it twice)
- The app validates before saving to the DB: every item amount > 0 and required fields present → otherwise I see an error message
- Future dates are allowed
- On save, the receipt and all its items are created together in one action (1 receipt + N item expenses)
- Everything is associated with my account — I cannot create data for another user

> **Note (technical):** one save creates a `receipt` row (store, date, currency, payment method, total, photo, purchase_reason) + one `expense` row per item (name, amount, subcategory, item_reason), linked via `receipt_id`. The AI photo/audio stories later pre-fill this same form and item list.

**Tasks:** *(to be defined in Sprint Planning)*

**Story Points:** *(to be estimated)*

---

### HU-005b: Edit & delete my expenses

**Feature:** PB-004 · **Split of:** HU-005 · **Depends on:** HU-005a (needs the saved expense form and data)

**Story:**
> As a user, I want to see, edit, and delete my saved expenses so that I can keep my records correct and under control.

**Acceptance Criteria:**
- I can see a "My expenses" list showing each item as: name · amount · date · photo indicator, newest first
- I can open an item from the list and edit its fields (name, amount, subcategory, Additional fields) with the same validation as HU-005a (every amount > 0, required fields present)
- I can delete a single item — the receipt stays and its total is re-calculated (auto-sum)
- If I delete the last remaining item of a receipt, the receipt is deleted too (the DB does not allow a receipt with a total of 0)
- I can delete a whole receipt (ticket) with all its items in one action
- The image file is deleted from storage together with the receipt
- I always see a confirmation dialog before deleting — for items and for receipts
- I can only see, edit, and delete MY expenses — I cannot access another user's expenses
- Deleted data is permanently removed (per `ALCANCE.md`: no deleted-row retention)

**Tasks:** *(to be defined in Sprint Planning)*

**Story Points:** *(to be estimated)*

---

### HU-005c: Find my expenses (search & filters)

**Feature:** PB-004 · **Split of:** HU-005 · **Depends on:** HU-005b (needs the expenses list)

**Story:**
> As a user, I want to search and filter my expenses so that I can quickly find any of them.

**Acceptance Criteria:**
- I can search by item name or store — results filter live as I type, ignoring case
- I can filter by category (chips: Todas · Comida · Transporte · …)
- I can filter by date range
- Search and filters combine with each other and with the newest-first order
- If nothing matches, I see a clear "sin resultados" message
- Search/filter runs in the backend with plain SQL (ILIKE) — no AI involved

**Tasks:** *(to be defined in Sprint Planning)*

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

---

## Pending Decisions — HU-005 foundation (manual-first)

> Locked so far: manual-first (HU-005 before AI stories) · vertical splits, no FE/BE · one backlog (this file) · HU-005a: multiple items per receipt, total = auto-sum · expense name = store text (editable) · Single hub "Gastos": no chat — photo/voice/text are capture channels (proposal promises foto/voz/texto), reasons = optional fields.
> Decide in order (1 blocks the rest), then write the HU-005 split.

1. **Receipt required?** `expense.receipt_id` NOT NULL → every expense needs a receipt row (store, date, total: NOT NULL).
   A) no quick-add, schema unchanged · B) quick-add without receipt → make `receipt_id` NULLable (schema change)

   [Decision]: A — complete form, minimal UX (no quick-add, schema unchanged)

2. **Split shape.** Current HU-005 has 10 ACs (create + edit + delete + isolation + validation).
   A) 2 stories: create / edit+delete · B) 3 stories: create / edit+delete / "only mine" · C) keep one story

   [Decision]: A — 2 stories (HU-005a create / HU-005b edit+delete); "only mine" as ACs inside both

3. **List gap.** No story lets the user SEE their expenses to edit/delete (dashboard = analytics, not a list).
   A) basic "my expenses" list in HU-005 · B) edit from dashboard table (couples with HU-006) · C) other

   [Decision]: A — basic "My expenses" list inside HU-005b (name · amount · date · photo indicator, newest first)

4. **Delete cleanup.** Delete is permanent (ALCANCE: retention out of scope). What happens to the image file? Is the receipt row (1:1) deleted too?

   [Decision]: both granularities — delete single item (receipt stays, total re-summed) AND delete whole receipt · last item deleted → receipt auto-deleted (DB CHECK total > 0) · image file deleted with the receipt · confirmation dialog always

5. **Validation.** 5a future dates allowed/rejected? · 5b expense `name` (NOT NULL): default to store name or typed? · 5c store always required? · 5d purchase_reason (receipt) / item_reason (expense) — confirm wording

   [Decision 5a]: future dates allowed (for now) · [5b]: name = store text, editable · [5c]: store always required · [5d]: purchase_reason on receipt · item_reason on expense — confirmed

6. **Form defaults.** Currency COP + payment Efectivo: pre-selected and changeable, or empty required fields?

   [Decision]: pre-selected (COP / Efectivo), changeable

### Parked — HU-003a/b/c/d (after HU-005 is defined)

- [ ] failure paths (AI can't read / backend fails / camera permission denied)
- [ ] orphan temp image when there is no confirm and no discard
- [ ] post-save feedback (where the user lands)
- [ ] 003b: items added later to a saved receipt vs. one single confirm flow
- [ ] 003d (AI suggests subcategory) — story now or Phase 2
- [ ] numbering (003a/b/c suffixes vs new numbers) · AC person ("I" vs "User") · checklist sections consistency