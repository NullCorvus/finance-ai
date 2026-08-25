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
- I enter email + password → I'm logged in and see the chat screen
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