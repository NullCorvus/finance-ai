# Product Backlog & User Stories — Finance AI Tracker

---

> **Note:** Teacher requires at least **10 user stories**. Current: **11 numbered stories** —
> all fully defined (HU-001…HU-011).
> Renumbered 2026-08-30 so HU codes follow build order (old → new: 005a→003 · 005b→004 ·
> 005c→005 · 003→006 · 003a→007 · 003b→008 · 004→009 · 006→010). PB codes renumbered
> 2026-08-31 to match build/sprint order: PB-002 CRUD · PB-003 AI capture (photo + text) ·
> PB-004 audio · PB-005 dashboard (HU codes unchanged).
> **Estimation scale:** Story Points — standard **Fibonacci** (1, 2, 3, 5, 8, 13…).

---

## Product Backlog

| Code | Feature | Priority | Status | Notes |
|------|---------|----------|--------|-------|
| PB-001 | Auth multi-user | High | Not started | Sprint 1 — Register + Login |
| PB-002 | Expense registration & management (CRUD) | High | Not started | Sprint 2 — manual-first foundation |
| PB-003 | AI-assisted capture: photo + natural-language text | High | Not started | Sprint 3 |
| PB-004 | Audio → AI parsing + categorization | Medium | Not started | Sprint 4 — happy path (HU-009) + failure paths (HU-011) |
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

**Story Points:** 3

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

**Story Points:** 2

---

### Expense CRUD — Feature PB-004 (manual-first foundation)

> One story each: create (**HU-003**) · edit & delete (**HU-004**) · find (**HU-005**).
> "Only mine" isolation lives as acceptance criteria inside all three.

---

### HU-003: Create expense manually

**Feature:** PB-002 · **Depends on:** — (foundation story)

**Story:**
> As a user, I want to register an expense manually by filling only the essentials so that I can save my spending quickly without typing everything.

**Acceptance Criteria:**
- The manual form has all the fields the database requires (store, date, currency, payment method, total, and each item's name/amount/subcategory)
- Manual form entry bypasses AI and saves directly after the required-field and amount validation passes
- For a single-item expense I only type: amount, store, and subcategory (picked from the existing list)
- I can add several items (name, amount, subcategory each) under the same receipt with an "add item" action
- For manual multi-item entry, the receipt total is auto-calculated as the sum of the item amounts
- Date defaults to today, currency defaults to COP, and payment method defaults to Efectivo — I can change them
- Photo, purchase_reason, and item_reason are optional and live in a collapsed "Additional fields" menu
- For a single item, the item name is auto-filled with the store text I typed, and I can edit it (I never type it twice)
- The app validates before saving to the DB: every item amount > 0 and required fields present → otherwise I see an error message
- Future dates are allowed
- On save, the receipt and all its items are created together in one action (1 receipt + N item expenses)
- Everything is associated with my account — I cannot create data for another user

> **Note (technical):** one manual save creates a `receipt` row (store, date, currency, payment method, total, photo, purchase_reason) + one `expense` row per item (name, amount, subcategory, item_reason), linked via `receipt_id`. The AI-assisted photo/audio/text stories later pre-fill this same form and item list. Manual totals use the item sum; photo totals follow the printed receipt total.

**Checklist: API**
- [ ] Create request schemas for a receipt, its items, and optional fields
- [ ] Implement `POST /receipts` for manual expense creation
- [ ] Validate required fields and item amounts greater than zero
- [ ] Apply defaults: today, COP, and Efectivo
- [ ] Calculate the manual receipt total from item amounts
- [ ] Save the receipt and all items atomically in one transaction
- [ ] Associate the receipt and items with the authenticated user
- [ ] Return the saved receipt with its items and total

**Checklist: UI**
- [ ] Build the manual expense form
- [ ] Add store, amount, date, currency, payment method, and subcategory fields
- [ ] Add and remove multiple receipt items
- [ ] Auto-fill the single-item name from the store field
- [ ] Add optional photo, purchase reason, and item reason fields
- [ ] Show default values for date, currency, and payment method
- [ ] Recalculate the manual total when item amounts change
- [ ] Display validation errors before submission
- [ ] Show success feedback and return to the Gastos hub

**Checklist: Tests**
- [ ] Test required-field and amount validation
- [ ] Test default values
- [ ] Test single-item and multi-item creation
- [ ] Test manual total calculation
- [ ] Test atomic rollback when item creation fails
- [ ] Test user ownership isolation

**Checklist: Mockup**
- [ ] Demonstrate manual validation, multi-item totals, and direct-save success feedback
- [ ] Keep manual entry separate from the AI confirmation flow

**Story Points:** *(to be estimated)*

---

### HU-004: Edit & delete my expenses

**Feature:** PB-002 · **Depends on:** HU-003 (needs the saved expense form and data)

**Story:**
> As a user, I want to see, edit, and delete my saved expenses so that I can keep my records correct and under control.

**Acceptance Criteria:**
- I can see a "My expenses" list showing each item as: name · amount · date · photo indicator, newest first
- I can open an expense from the list and edit receipt fields (store, date, currency, payment method, image, and purchase reason) and item fields (name, amount, subcategory, and item reason) with the same validation as HU-003
- Technical fields (user_id, receipt_id, and IDs) remain read-only and cannot be changed
- For a manually created receipt, deleting a single item keeps the receipt and re-calculates its total as the sum of the remaining items
- For a photo receipt, deleting or editing items preserves the printed receipt total unless I explicitly edit that total
- If I delete the last remaining item of a receipt, the receipt is deleted too (the DB does not allow a receipt with a total of 0)
- I can delete a whole receipt (ticket) with all its items in one action
- The image file is deleted from storage together with the receipt
- I always see a confirmation dialog before deleting — for items and for receipts
- I can only see, edit, and delete MY expenses — I cannot access another user's expenses
- Deleted data is permanently removed (per `ALCANCE.md`: no deleted-row retention)

**Checklist: API**
- [ ] Implement `GET /receipts` for the authenticated user’s expenses
- [ ] Implement `GET /receipts/{id}` for receipt details and items
- [ ] Implement `PATCH /receipts/{id}` for receipt and item edits
- [ ] Implement item deletion
- [ ] Implement whole-receipt deletion
- [ ] Enforce ownership checks on every operation
- [ ] Recalculate totals for manually created receipts after item changes
- [ ] Preserve printed totals for photo receipts unless explicitly changed
- [ ] Delete the stored image when its receipt is deleted
- [ ] Delete the receipt when its last item is removed

**Checklist: UI**
- [ ] Build the “Mis gastos” list
- [ ] Display receipt and item information newest first
- [ ] Open a saved receipt in the editable form
- [ ] Allow editing receipt fields and item fields
- [ ] Keep technical fields read-only
- [ ] Show the correct total behavior for manual and photo receipts
- [ ] Add item and receipt delete actions
- [ ] Add confirmation dialogs before deletion
- [ ] Show success feedback after editing or deleting

**Checklist: Tests**
- [ ] Test receipt and item editing
- [ ] Test manual total recalculation
- [ ] Test photo printed-total preservation
- [ ] Test last-item deletion
- [ ] Test whole-receipt deletion and image cleanup
- [ ] Test delete confirmation behavior
- [ ] Test ownership isolation

**Checklist: Mockup**
- [ ] Demonstrate edit, cancel, and confirm as separate actions
- [ ] Demonstrate item and whole-receipt deletion confirmations
- [ ] Demonstrate manual and photo receipt total behavior

**Story Points:** *(to be estimated)*

---

### HU-005: Find my expenses (search & filters)

**Feature:** PB-002 · **Depends on:** HU-004 (needs the expenses list)

**Story:**
> As a user, I want to search and filter my expenses so that I can quickly find any of them.

**Acceptance Criteria:**
- I can search by item name or store — results filter live as I type, ignoring case
- I can filter by category (chips: Todas · Comida · Transporte · …)
- I can filter by date range
- Search and filters combine with each other and with the newest-first order
- If nothing matches, I see a clear "sin resultados" message
- Search/filter runs in the backend with plain SQL (ILIKE) — no AI involved

**Checklist: API**
- [ ] Implement the expense search endpoint
- [ ] Add case-insensitive search by item name and store
- [ ] Add category filtering
- [ ] Add date-range filtering
- [ ] Combine text, category, and date filters
- [ ] Return results newest first
- [ ] Restrict results to the authenticated user
- [ ] Use plain SQL/ILIKE without AI

**Checklist: UI**
- [ ] Build the “Mis gastos” search screen
- [ ] Add live search input
- [ ] Add category filter chips
- [ ] Add date-range filter controls
- [ ] Combine search and filters in the UI
- [ ] Show loading and empty-result states
- [ ] Show matching receipts and items
- [ ] Add navigation back to the Gastos hub

**Checklist: Tests**
- [ ] Test search by store
- [ ] Test search by item name
- [ ] Test case-insensitive matching
- [ ] Test category and date filters
- [ ] Test combined filters
- [ ] Test newest-first ordering
- [ ] Test empty results
- [ ] Test user isolation

**Checklist: Mockup**
- [ ] Demonstrate live search and category filtering
- [ ] Demonstrate date-range filtering and combined filters
- [ ] Demonstrate the empty-result state

**Story Points:** *(to be estimated)*

---

### HU-006: Register an expense by photographing the receipt (happy path)

**Feature:** PB-003 · SPIDR **Path** split (guide §9): happy path (this) / failure paths (HU-007) · **Depends on:** HU-003 (Editar opens its form)

**Story:**
> As a user, I want to photograph a receipt so that the AI fills in the whole expense for me and I only have to confirm it before anything is saved.

**Acceptance Criteria:**
- From the Gastos hub I tap the camera shutter → the app opens the camera and captures the receipt photo
- The photo is sent to the backend as a temporary upload — nothing is saved to the DB yet
- The AI returns a strict structured result with `status` (`ok`, `partial`, `unreadable`, or `error`), source type, receipt fields, item fields, optional reasons, and a machine-readable error when applicable
- For a photo, the AI returns: store, date, currency, payment method, the printed receipt total, and each item (name · amount · subcategory picked from my existing subcategories)
- Photo uploads accept JPEG, PNG, or HEIC files up to 10 MB; oversized or unsupported files are rejected with a clear message, and accepted files may be resized/compressed by the backend
- I see the confirmation card with **all items editable line by line** + Monto total, Fecha, Categoría/Subcategoría, Pago and Moneda (defaults **Efectivo / COP** when the AI doesn't infer them)
- For a photo receipt, the printed receipt total is the source of truth and may differ from the sum of item amounts because of taxes, discounts, or rounding
- **Editar** opens the same pre-filled manual form as HU-003 (add/remove items, additional fields); saving returns me to the updated card
- Nothing is saved until I tap **Confirmar**
- On **Confirmar**: one save creates the receipt + all items together (1 receipt + N expenses), the photo file goes to file storage and the DB stores its path — atomically
- I can tap **Descartar** → nothing is saved and the temporary image is deleted
- On success I see "✅ Gasto guardado" and land back on the clean hub
- I CANNOT edit technical fields (user_id, receipt_id, etc.)
- purchase_reason and item_reason are optional — "Campos adicionales" via the Editar form
- Everything is associated with my account — I cannot create data for another user

**Scenarios:**

| Scenario | Criteria |
|---|---|
| Confirm | **Given** the AI card with extracted data, **When** I tap Confirmar, **Then** receipt + items are saved and I see "✅ Gasto guardado" on the clean hub |
| Edit → confirm | **Given** the AI card, **When** I tap Editar, correct a value in the form and save, **Then** the card shows the corrected values and Confirmar saves them |
| Discard | **Given** the AI card, **When** I tap Descartar, **Then** nothing is saved and the temporary image is deleted |

> **Note (technical):** "unreadable" is judged by the AI itself — the parsing contract requires `status: unreadable` when the minimum photo facts (store + total) cannot be extracted (see HU-007). Voice follows the same shape later in HU-009.

**AI response contract:** All AI-assisted capture paths use the same normalized result:

| Field | Rule |
|---|---|
| `status` | `ok`, `partial`, `unreadable`, or `error` |
| `source` | `photo`, `text`, or `audio` |
| Receipt data | `store`, `date`, `currency`, `payment_method`, and `total`; values may be null when `status` is `partial` |
| `items` | List of `name`, `amount`, `subcategory`, and optional `item_reason` |
| Optional data | `purchase_reason` |
| `error` | Machine-readable `code` and user-safe `message` when `status` is `error` |

Invalid AI responses are rejected before the confirmation card is shown.

**Checklist: API**
- [ ] Implement temporary receipt-image upload
- [ ] Validate JPEG, PNG, and HEIC formats
- [ ] Reject files larger than 10 MB
- [ ] Resize or compress accepted images when necessary
- [ ] Send the temporary image to the AI parsing service
- [ ] Validate the normalized AI response contract
- [ ] Return receipt fields, items, totals, and optional reasons
- [ ] Preserve the printed receipt total
- [ ] Keep the image and database unchanged until confirmation
- [ ] Save receipt, items, and image atomically after confirmation
- [ ] Delete the temporary image after discard

**Checklist: UI**
- [ ] Connect the camera shutter to receipt capture
- [ ] Show upload and AI-processing states
- [ ] Display the AI confirmation card
- [ ] Display all extracted receipt items
- [ ] Make receipt fields and item fields editable
- [ ] Add Confirmar, Editar, and Descartar actions
- [ ] Open the HU-003 manual form from Editar
- [ ] Preserve the printed photo total in the confirmation card
- [ ] Show success feedback and return to the clean hub

**Checklist: Tests**
- [ ] Test supported image formats
- [ ] Test the 10 MB upload limit
- [ ] Test normalized AI response validation
- [ ] Test confirmation without changing extracted data
- [ ] Test editing before confirmation
- [ ] Test discard and temporary-image deletion
- [ ] Test atomic receipt, item, and image saving
- [ ] Test printed-total preservation

**Checklist: Mockup**
- [ ] Demonstrate the photo confirmation card with the store field
- [ ] Demonstrate all extracted items and editable confirmation data
- [ ] Demonstrate printed-total preservation when item sums differ
- [ ] Demonstrate Confirmar, Editar, and Descartar

**Story Points:** *(to be estimated)*

---

### HU-007: The capture fails or the AI can't read my receipt

**Feature:** PB-003 · **Split of:** HU-006 (SPIDR Path: error paths) · **Depends on:** HU-006

**Story:**
> As a user, when capture or AI parsing fails, I want a clear message and a way forward so that nothing is saved by mistake and I can retry or fall back to manual entry.

**Acceptance Criteria:**
- If the AI can't extract the minimum (store + total) from the photo → I see "No pudimos leer el recibo" + **Reintentar** (new photo) + the manual ✍️ option — nothing is saved
- If the AI extracts **partial** data (e.g., total but no items) → the card shows what it got, marks missing required fields, and keeps Confirmar disabled until I complete valid data through Editar
- If the backend or the LLM fails / times out → error message + **Reintentar**; nothing is saved
- If camera permission is denied → an explanation of why it's needed + a shortcut to system settings; manual ✍️ entry always stays available
- On any failure, the temporary image is deleted — no orphans from failed attempts
- Temp images never confirmed are cleaned by the backend after **24h** (scheduled cleanup)
- A failure never creates receipt or expense rows (save is all-or-nothing)

**Scenarios:**

| Scenario | Criteria |
|---|---|
| Unreadable | **Given** a blurry photo, **When** the AI reports `status: unreadable`, **Then** I see the error + Reintentar + manual option, nothing is saved, temp image deleted |
| Partial | **Given** a receipt where only the total is legible, **When** parsing returns partial data, **Then** the card shows the partial data, marks missing required fields, and keeps Confirmar disabled until the fields are completed |
| Backend failure | **Given** the backend/LLM fails or times out, **When** I send the photo, **Then** I see an error + Reintentar and nothing is saved |
| Permission denied | **Given** I haven't granted camera permission, **When** I tap the shutter, **Then** I see the explanation + settings shortcut and manual entry is still available |

**Checklist: API**
- [ ] Handle `ok`, `partial`, `unreadable`, and `error` AI statuses
- [ ] Return machine-readable error codes and safe messages
- [ ] Handle AI and backend timeouts
- [ ] Ensure failed parsing creates no receipt or item rows
- [ ] Delete temporary images after failure
- [ ] Clean up unconfirmed images older than 24 hours
- [ ] Preserve the response contract used by HU-006

**Checklist: UI**
- [ ] Show the unreadable-receipt state
- [ ] Show the partial-extraction state
- [ ] Mark missing required fields
- [ ] Disable Confirmar until required fields are completed
- [ ] Allow Editar to complete partial data
- [ ] Add Reintentar action
- [ ] Show backend and AI timeout errors
- [ ] Handle denied camera permission
- [ ] Link users to device settings when permission is denied
- [ ] Keep manual entry available in every failure state

**Checklist: Tests**
- [ ] Test unreadable AI responses
- [ ] Test partial AI responses
- [ ] Test backend and AI timeout failures
- [ ] Test camera permission denial
- [ ] Test that failures create no database rows
- [ ] Test temporary-image cleanup
- [ ] Test 24-hour cleanup behavior
- [ ] Test partial data completion before confirmation

**Checklist: Mockup**
- [ ] Add reachable demo states for unreadable, partial, timeout, and permission failure
- [ ] Demonstrate retry and manual fallback actions
- [ ] Demonstrate disabled Confirmar for incomplete partial data

**Story Points:** *(to be estimated)*

---

### HU-008: Register an expense by typing what I spent (text → AI parse)

**Feature:** PB-003 · SPIDR Path family: photo (HU-006) · text (this) · audio (HU-009) · **Depends on:** HU-003 (Editar opens its form)

**Story:**
> As a user, I want to type what I spent in my own words in the capture bar so that the AI turns it into an expense and I only have to confirm it before anything is saved.

**Acceptance Criteria:**
- I type "gasté 15 mil en almuerzo en Subway…" in the capture bar and press Enter
- Natural-language text goes to the backend, which calls the AI parsing module (same strict response contract as photo) — nothing is saved yet
- The AI returns: store, date, total, and a description for the item; currency and payment method if I mention them — otherwise defaults **Efectivo / COP**
- I see the confirmation card with the parsed data editable (no receipt line-item list and no photo — text has neither; confirmation creates one description item)
- **Editar** opens the same pre-filled manual form as HU-003; saving returns me to the updated card
- Nothing is saved until I tap **Confirmar**
- On **Confirmar**: one minimal receipt (store, date, total — no image) + its item are saved together, atomically
- The single description item's amount is the parsed or corrected total
- I can tap **Descartar** → nothing is saved
- On success I see "✅ Gasto guardado" and land back on the clean hub
- If the AI can't understand my text → I see "No entendí lo que escribiste" + I can rephrase or use manual ✍️ — nothing is saved
- This is the AI-assisted text-capture path; the manual form in HU-003 is a separate path that bypasses AI
- Technical fields (user_id, receipt_id, etc.) are not editable; purchase_reason / item_reason stay optional via "Campos adicionales"
- Everything is associated with my account

**Scenarios:**

| Scenario | Criteria |
|---|---|
| Confirm | **Given** the card with parsed data, **When** I tap Confirmar, **Then** the minimal receipt + item are saved and I see "✅ Gasto guardado" on the clean hub |
| Edit → confirm | **Given** the card, **When** I tap Editar, correct the amount in the form and save, **Then** the card shows the correction and Confirmar saves it |
| AI doesn't understand | **Given** I type something the AI can't parse as an expense, **When** parsing returns no usable data, **Then** I see the error, nothing is saved, and I can rephrase or use ✍️ |

> **Note (technical):** "unreadable text" is judged by the AI (same `status: unreadable` mechanism as HU-007). Per ALCANCE, text input has no image — nothing to upload or clean up.

**Checklist: API**
- [ ] Implement the natural-language text capture endpoint
- [ ] Send the text to the AI parsing service
- [ ] Reuse the normalized AI response contract from HU-006
- [ ] Parse store, date, total, and item description
- [ ] Apply COP and Efectivo defaults when missing
- [ ] Return a minimal receipt plus one description item
- [ ] Reject unusable or invalid AI responses
- [ ] Save only after explicit confirmation
- [ ] Associate the receipt and item with the authenticated user

**Checklist: UI**
- [ ] Connect the capture-bar text field to the AI endpoint
- [ ] Submit text when the user presses Enter
- [ ] Show the parsed confirmation card
- [ ] Display one description item and the parsed total
- [ ] Add Confirmar, Editar, and Descartar actions
- [ ] Open the HU-003 form from Editar
- [ ] Show the AI error and manual fallback when parsing fails
- [ ] Show success feedback and return to the clean hub

**Checklist: Tests**
- [ ] Test successful natural-language parsing
- [ ] Test store, date, total, and description extraction
- [ ] Test COP and Efectivo defaults
- [ ] Test one-item receipt creation
- [ ] Test editing the parsed amount
- [ ] Test discard without saving
- [ ] Test unusable text responses
- [ ] Test confirmation-gated persistence
- [ ] Test user ownership isolation

**Checklist: Mockup**
- [ ] Demonstrate a text-specific confirmation card with one description item
- [ ] Hide photo-only fields for text capture
- [ ] Demonstrate AI failure and manual fallback
- [ ] Demonstrate Editar returning to the card before Confirmar

**Story Points:** *(to be estimated)*

---

### HU-009: Record a voice expense (happy path)

**Feature:** PB-004 · SPIDR **Path** split (guide §9): happy path (this) / failure paths (HU-011) · **Depends on:** HU-003 (Editar opens its form)

**Story:**
> As a user, I want to record a voice note of what I spent so that the AI fills in the expense for me and I only have to confirm it before anything is saved.

**Acceptance Criteria:**
- From the Gastos hub I tap the mic button in the capture bar → recording starts with a visible indicator; I tap again to stop
- The recording is sent to the backend as a temporary upload — nothing is saved to the DB yet
- Recordings are capped at **60 seconds** — recording stops automatically at the limit and is sent
- Accepted formats: **M4A or WAV**, max 60 s; invalid recordings are rejected with a clear message before parsing
- The backend sends the audio to the AI model, which transcribes and extracts the structured expense **in one call** (per STACK.md — no separate STT service; a separate STT step is only a fallback), using the same strict normalized contract as photo/text with `source: audio` — nothing is saved yet
- The AI returns: store, date, total, and a description for the item; currency and payment method if I mention them — otherwise defaults **Efectivo / COP**
- I see the confirmation card with the parsed data editable (same card shape as text — no line-item list and no photo; confirmation creates one description item)
- **Editar** opens the same pre-filled manual form as HU-003; saving returns me to the updated card
- Nothing is saved until I tap **Confirmar**
- On **Confirmar**: one minimal receipt (store, date, total — no image) + its item are saved together, atomically
- The single description item's amount is the parsed or corrected total
- I can tap **Descartar** → nothing is saved and the temporary audio is deleted
- On success I see "✅ Gasto guardado" and land back on the clean hub
- I CANNOT edit technical fields (user_id, receipt_id, etc.)
- Everything is associated with my account — I cannot create data for another user

**Scenarios:**

| Scenario | Criteria |
|---|---|
| Record → confirm | **Given** the AI card with parsed data, **When** I tap Confirmar, **Then** receipt + item are saved and I see "✅ Gasto guardado" on the clean hub |
| Record → edit → confirm | **Given** the AI card, **When** I tap Editar, correct a value in the form and save, **Then** the card shows the corrected values and Confirmar saves them |
| Record → discard | **Given** the AI card, **When** I tap Descartar, **Then** nothing is saved and the temporary audio is deleted |

> **Note (technical):** voice follows the same shape as photo/text (see HU-006 contract) with `source: audio`; the minimum facts are store + total — otherwise the AI reports `status: unreadable` (see HU-011).

**Checklist: API**
- [ ] Implement temporary recording upload
- [ ] Validate M4A/WAV formats and the 60 s limit
- [ ] Send the temporary audio to the AI parsing service (STT handled in the same model call per STACK.md)
- [ ] Validate the normalized AI response contract with `source: audio`
- [ ] Return parsed receipt data, item, and optional reasons
- [ ] Keep the database unchanged until confirmation
- [ ] Save receipt + item atomically after confirmation
- [ ] Delete the temporary audio after discard

**Checklist: UI**
- [ ] Add the mic button to the capture bar with a recording indicator
- [ ] Stop recording automatically at 60 s
- [ ] Show recording and AI-processing states
- [ ] Display the audio confirmation card with editable parsed data
- [ ] Add Confirmar, Editar, and Descartar actions
- [ ] Open the HU-003 manual form from Editar
- [ ] Show success feedback and return to the clean hub

**Checklist: Tests**
- [ ] Test accepted formats and the 60 s limit
- [ ] Test normalized AI response validation (`source: audio`)
- [ ] Test confirmation without changing parsed data
- [ ] Test editing before confirmation
- [ ] Test discard and temporary-audio deletion
- [ ] Test atomic receipt + item saving

**Checklist: Mockup**
- [ ] Demonstrate the mic button and recording state
- [ ] Demonstrate the audio confirmation card with editable data
- [ ] Demonstrate Confirmar, Editar, and Descartar

**Story Points:** *(to be estimated)*

---

### HU-010: Dashboard by category + date filter

**Feature:** PB-005

**Story:**
> As a user, I want to see my spending by category for a period so that I can understand where my money goes.

**Acceptance Criteria:**
- I open the Dashboard tab and see my spending for a selected period
- Period presets: **Hoy / Esta semana / Este mes** — switching presets recalculates everything shown
- I see the **total spent** in the period and **per-category totals** (top categories first)
- Totals are shown as a **pie chart + a category table** (category name · amount · share of the total)
- The dashboard is read-only analytics: I cannot edit or delete anything from here (editing lives in the HU-004 "My expenses" list)
- Totals include every expense of mine in the period regardless of how it was registered — manual (HU-003), photo (HU-006), text (HU-008), or voice (HU-009)
- I only ever see MY data — the dashboard is scoped to my user
- If I have no expenses in the selected period → friendly empty state ("No hay gastos en este período") instead of an empty chart

> **Note (technical):** analytics are computed by the backend (GROUP BY category over the authenticated user's expenses in the period), per ALCANCE.md — the backend owns the data and answers dashboard queries.

**Scenarios:**

| Scenario | Criteria |
|---|---|
| Switch period | **Given** the dashboard, **When** I tap "Esta semana", **Then** the total, category totals, and chart recalculate for the week |
| Mixed sources | **Given** expenses registered manually, by photo, by text, and by voice, **When** I open the dashboard, **Then** all of them are included in the totals |
| Empty period | **Given** I have no expenses in the selected period, **When** the dashboard loads, **Then** I see the empty state instead of an empty chart |

**Checklist: API**
- [ ] Implement the dashboard endpoint: totals per category for the authenticated user and period
- [ ] Compute analytics on the backend (GROUP BY category, filtered by period)
- [ ] Return total spent, per-category amounts, and shares
- [ ] Enforce ownership scoping
- [ ] Handle empty result sets

**Checklist: UI**
- [ ] Build the Dashboard screen with period preset chips (Hoy / Esta semana / Este mes)
- [ ] Render the pie chart (per-category shares)
- [ ] Render the category table (name · amount · share), top categories first
- [ ] Show the total spent for the period
- [ ] Implement the empty state
- [ ] Handle loading and error states

**Checklist: Tests**
- [ ] Test period preset filtering
- [ ] Test per-category sums including all capture sources
- [ ] Test share calculations
- [ ] Test ownership isolation
- [ ] Test empty-state behavior

**Checklist: Mockup**
- [ ] Demonstrate the dashboard with chart + category table
- [ ] Demonstrate period switching
- [ ] Demonstrate the empty state

**Story Points:** *(to be estimated)*

---

### HU-011: Voice capture fails or the AI can't hear me

**Feature:** PB-004 · **Split of:** HU-009 (SPIDR Path: error paths) · **Depends on:** HU-009

**Story:**
> As a user, when voice capture or AI parsing fails, I want a clear message and a way forward so that nothing is saved by mistake and I can retry or fall back to typing.

**Acceptance Criteria:**
- If the AI can't extract the minimum (store + total) from the audio → I see "No pudimos escuchar el audio" + **Reintentar** (record again) + the manual ✍️ option — nothing is saved
- If the AI extracts **partial** data (e.g., total but no store) → the card shows what it got, marks missing required fields, and keeps Confirmar disabled until I complete valid data through Editar
- If the backend or the AI model (STT + parsing in one call) fails / times out → error message + **Reintentar**; nothing is saved
- If mic permission is denied → an explanation of why it's needed + a shortcut to system settings; manual ✍️ entry always stays available
- On any failure, the temporary audio is deleted — no orphans from failed attempts
- Temp audio never confirmed is cleaned by the backend after **24h** (same scheduled cleanup as temp images)
- A failure never creates receipt or expense rows (save is all-or-nothing)

**Scenarios:**

| Scenario | Criteria |
|---|---|
| Unintelligible audio | **Given** audio the AI can't parse to store + total, **When** parsing returns `unreadable`, **Then** I see "No pudimos escuchar el audio" with Reintentar and manual ✍️ — nothing is saved |
| Partial data | **Given** an AI result with missing required fields, **When** the card is shown, **Then** Confirmar is disabled until I complete valid data via Editar |
| Mic permission denied | **Given** mic permission is denied, **When** I tap the mic button, **Then** I see the explanation + settings shortcut, and manual ✍️ stays available |
| Timeout | **Given** the backend or STT/LLM fails or times out, **When** I retry, **Then** nothing was saved and the temporary audio was deleted |

**Checklist: API**
- [ ] Handle `unreadable` results with a clear error response
- [ ] Handle partial results (mark missing required fields)
- [ ] Handle backend/AI-model failures and timeouts
- [ ] Delete the temporary audio on every failure
- [ ] Scheduled cleanup of temp audio after 24h
- [ ] Ensure failures never create receipt or expense rows

**Checklist: UI**
- [ ] Show failure messages with Reintentar and manual ✍️ fallback
- [ ] Show partial data with missing fields marked and Confirmar disabled
- [ ] Show mic-permission explanation + system settings shortcut
- [ ] Show retry and processing states

**Checklist: Tests**
- [ ] Test unreadable-audio handling
- [ ] Test partial-data completion flow
- [ ] Test timeout and retry behavior
- [ ] Test mic-permission-denied flow
- [ ] Test temp-audio deletion on failure and 24h cleanup
- [ ] Test no rows are created on failure

**Checklist: Mockup**
- [ ] Demonstrate the failure message with Reintentar + manual ✍️
- [ ] Demonstrate partial data with Confirmar disabled

**Story Points:** *(to be estimated)*

---

## Sprint Plan

| Sprint | Features |
|--------|----------|
| Sprint 1 | Register (HU-001) + Login (HU-002) |
| Sprint 2 | CRUD foundation (HU-003 + HU-004 + HU-005) — manual-first (locked decision) |
| Sprint 3 | Photo capture (HU-006 + HU-007) + Text capture (HU-008) |
| Sprint 4 | Audio capture (HU-009 + HU-011) + Dashboard (HU-010) + Testing + Survey |

---

## Pending Decisions — expense CRUD foundation (manual-first)

> Locked so far: manual-first (HU-003–HU-005 before AI stories) · vertical splits, no FE/BE · one backlog (this file) · HU-003: multiple items per receipt, manual total = item sum · photo total = printed receipt total · expense name = store text (editable) · manual form bypasses AI, while natural-language text in the capture bar uses AI · single hub "Gastos": no core chat — photo/voice/natural-language text are capture channels, reasons = optional fields · HU-006 split by SPIDR Path (guide §9): photo happy path (HU-006) / failure paths (HU-007) / text parse (HU-008) · Editar opens the HU-003 form · post-save = "✅ Gasto guardado" + clean hub · temp images: deleted on discard/failure + 24h backend cleanup · unreadable = the AI reports `status: unreadable` (no blur detection) · photo uploads: JPEG/PNG/HEIC, max 10 MB · audio last (STT is the riskiest channel).
> Decide in order (1 blocks the rest); the CRUD split is already documented above.

1. **Receipt required?** `expense.receipt_id` NOT NULL → every expense needs a receipt row (store, date, total: NOT NULL).
   A) no quick-add, schema unchanged · B) quick-add without receipt → make `receipt_id` NULLable (schema change)

   [Decision]: A — complete form, minimal UX (no quick-add, schema unchanged)

2. **Split shape.** Current HU-005 has 10 ACs (create + edit + delete + isolation + validation).
   A) 2 stories: create / edit+delete · B) 3 stories: create / edit+delete / "only mine" · C) keep one story

   [Decision]: A — 2 stories (HU-003 create / HU-004 edit+delete); "only mine" as ACs inside both

3. **List gap.** No story lets the user SEE their expenses to edit/delete (dashboard = analytics, not a list).
   A) basic "my expenses" list in HU-005 · B) edit from dashboard table (couples with HU-010) · C) other

   [Decision]: A — basic "My expenses" list inside HU-004 (name · amount · date · photo indicator, newest first)

4. **Delete cleanup.** Delete is permanent (ALCANCE: retention out of scope). What happens to the image file? Is the receipt row (1:1) deleted too?

   [Decision]: both granularities — delete single item (receipt stays, total re-summed) AND delete whole receipt · last item deleted → receipt auto-deleted (DB CHECK total > 0) · image file deleted with the receipt · confirmation dialog always

5. **Validation.** 5a future dates allowed/rejected? · 5b expense `name` (NOT NULL): default to store name or typed? · 5c store always required? · 5d purchase_reason (receipt) / item_reason (expense) — confirm wording

   [Decision 5a]: future dates allowed (for now) · [5b]: name = store text, editable · [5c]: store always required · [5d]: purchase_reason on receipt · item_reason on expense — confirmed

6. **Form defaults.** Currency COP + payment Efectivo: pre-selected and changeable, or empty required fields?

   [Decision]: pre-selected (COP / Efectivo), changeable

7. **Input channels.** Does typed input from the capture bar bypass AI like the manual form, or use AI parsing?

   [Decision]: two separate paths — the manual form bypasses AI and saves directly; natural-language text from the capture bar uses AI, shows structured JSON in the confirmation card, and requires Confirmar.

8. **Receipt totals.** Should all receipts use the item sum, or should photo receipts preserve the printed total?

   [Decision]: source-dependent — manual multi-item receipts use the item sum; natural-language text/audio use the parsed or entered amount as the single item total; photo receipts preserve the printed total, even when taxes, discounts, or rounding make it differ from item sums.

9. **Photo receipt editing.** What happens when item edits change the sum of a saved photo receipt's items?

   [Decision]: preserve the printed receipt total; item edits do not overwrite it unless the user explicitly edits the total.

10. **Partial photo extraction.** Can a partial AI result be saved?

   [Decision]: yes, after completion — show extracted values, mark missing required fields, keep Confirmar disabled, and allow Editar to complete valid data before saving.

11. **AI response and image boundary.** What contract and upload boundary apply to the active photo path?

   [Decision]: one strict normalized response with `status` (`ok`, `partial`, `unreadable`, `error`), `source`, receipt data, item data, optional reasons, and a machine-readable error; accept JPEG/PNG/HEIC up to 10 MB and reject invalid files before parsing.

12. **Audio input and limits.** How does the user capture voice — in-app recording or file upload? Duration/format limits?

   [Decision]: in-app mic button in the capture bar · max 60 s · M4A/WAV · server-side STT reusing the HU-006 normalized contract with `source: audio` (2026-08-31)

13. **Audio split.** One audio story, or split happy path from failure paths like photo?

   [Decision]: B — split like photo (SPIDR Path, guide §9): HU-009 happy path / HU-011 failure paths (2026-08-31)

14. **Dashboard scope.** Period filter style, metrics, and scope of HU-010?

   [Decision]: period presets (Hoy / Esta semana / Este mes) · total spent + per-category totals as pie chart + category table · read-only analytics (no editing, no expense list — that is HU-004) · friendly empty state · backend computes the analytics · estimation scale restored to standard Fibonacci (2026-08-31)

### Parked — capture stories: resolved & remaining

Resolved via the HU-006 happy-path / failure-path split (SPIDR Path, guide §9) and decisions of 2026-08-30:

- [x] failure paths (AI can't read / backend fails / camera permission denied) → **HU-007**
- [x] orphan temp image when there is no confirm and no discard → backend cleanup after 24h (HU-007)
- [x] post-save feedback (where the user lands) → "✅ Gasto guardado" + clean hub
- [x] numbering → 2026-08-30 renumber to build order: HU-006 photo · HU-007 photo failures · HU-008 text · HU-009 audio · HU-010 dashboard
- [ ] items added later to a saved receipt vs. one single confirm flow (was "003b" under the old numbering)
- [ ] AI suggests subcategory on the fly (was "003d") — story now or Phase 2
- [x] HU-009 (voice) failure ACs → split like photo: HU-009 happy path / HU-011 failure paths (2026-08-31)
- [ ] AC person ("I" vs "User") · checklist sections consistency
