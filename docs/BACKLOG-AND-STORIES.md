# Product Backlog & User Stories — Finance AI Tracker

> **Source:** supplied backlog and user-story register, 2026-09-13.
> This file is now synchronized to that register. It contains **15 user-story rows** under
> **11 product backlog items**. The supplied register does not include HU-007.
> Product backlog names, priorities, statuses, notes, story wording, implementation scope,
> acceptance criteria, and points below are the supplied values.
> **Estimation scale:** Story Points — standard **Fibonacci** (1, 2, 3, 5, 8, 13…).

---

## Product Backlog

| Code | Feature | Priority | Status | Notes |
|---|---|---|---|---|
| PB-001 | Identity and access | High | Done | HU-001 registration and HU-002 secure renewable sessions are implemented. |
| PB-002 | Accounts and currencies | High | Done | HU-003 complete. Owned accounts, derived balances, deactivate/reactivate, and safe permanent deletion are merged into develop for backend and frontend. |
| PB-003 | User-owned catalogs | High | In progress | HU-004 categories and HU-005 income sources. Accounts replace payment methods; subcategories and payment methods are outside the product model. Catalog deletion is confirmed and permanent rather than archived. |
| PB-004 | Expenses and optional receipt detail | High | Not started | HU-006–HU-008. Fast manual expense, optional evidence/items, correction and permanent deletion. |
| PB-005 | Income | High | Not started | HU-009. Manual income lifecycle tied to an owned account. |
| PB-006 | Transfers | High | Not started | HU-010. Atomic movement between owned accounts; never income or expense. |
| PB-007 | Transaction history and filters | High | Not started | HU-011. Search and inspect expenses, income and transfers together before AI is introduced. |
| PB-008 | Basic financial dashboard | High | Not started | HU-012. Deterministic balances, recent movements, income/expense and period/category views before AI. |
| PB-009 | AI capture from natural text and audio | High | Not started | HU-013–HU-014. Written and spoken language share one conversational capture capability, with separate stories for text and microphone behavior. |
| PB-010 | AI capture from receipt photo | High | Not started | HU-015. Receipt images produce a fast editable expense proposal with printed-total and item extraction. |
| PB-011 | Spending budgets | Medium | Not started | HU-016. Weekly/monthly category or subcategory targets and dashboard progress after the AI speed layer. |

---

## User Stories

### HU-001 — Registration

**Feature:** PB-001 — Identity and access

**Story:**
> As a new user, I want to create an account so that I can begin managing my finances.

**Implementation scope:** Validate and normalize email; enforce password policy; hash password adaptively; create user and default catalogs atomically; build accessible registration states; test duplicates, validation, rollback and safe diagnostics.

**Acceptance criteria:** A valid unused normalized email and matching valid passwords create one account and defaults; success redirects to Login without automatic login; duplicate/invalid input gives field-level feedback; duplicate submissions are blocked; passwords and internals are never exposed.

**Story points:** 3

**Mockup:** TBD

---

### HU-002 — Secure renewable sessions

**Feature:** PB-001 — Identity and access

**Story:**
> As a returning user, I want a secure renewable session so that I can access my data without signing in on every app launch.

**Implementation scope:** Implement login, short-lived access credentials, rotating renewable credentials, restoration, replay protection, logout revocation, secure Android/Windows storage, protected routing and end-to-end tests.

**Acceptance criteria:** Valid credentials open the authenticated home; invalid credentials use one generic error; restart restores a valid session; invalid/expired/revoked renewal returns to Login and clears authority; logout revokes the current renewable credential and removes protected access.

**Story points:** 3

**Mockup:** TBD

---

### HU-003 — Accounts and currencies

**Feature:** PB-002 — Accounts and currencies

**Story:**
> As a user, I want accounts for cash, banks, wallets, or savings products so that I know where my money is held.

**Implementation scope:** Implement owned account create/list/detail/edit/deactivate/reactivate/safe-delete API and UI; validate unique name, type, currency and opening balance; derive balances from movements; suggest COP or the last-used currency without a separate preference record; allow permanent deletion only before movements; enforce ownership and test currency, inactive-account and deletion rules.

**Acceptance criteria:** I can create and edit an account with name, type, explicit currency and opening balance; its balance is derived consistently; inactive accounts remain visible in history but cannot receive new movements; unused accounts can be permanently deleted while used accounts retain history; suggestions never change existing records; I cannot access another user's account.

**Story points:** 2

**Mockup:** TBD

---

### HU-004 — Categories

**Feature:** PB-003 — User-owned catalogs

**Story:**
> As a user, I want to manage my categories so that classifications match how I understand my spending.

**Implementation scope:** Implement owned category create/list/detail/edit/reorder/permanent-delete API and UI; replace archive flags through Alembic; support required name, optional color and icon, and manual order; validate trimmed case-insensitive unique names and ownership; keep editable Needs/Wants/Other defaults; confirm deletion; refresh selectors; document that future expense forms require a valid category, deleted historical references display Category deleted, and dependent category budgets cascade without prebuilding those features; test rollback and isolation.

**Acceptance criteria:** I can create, rename, recolor, re-icon, reorder and permanently delete only my categories; starter categories are editable; deletion asks for confirmation; deleted names can be reused; no Uncategorized option is offered for new records; future dependency rules preserve expenses and remove category budgets; only my data changes.

**Story points:** 3

**Mockup:** TBD

---

### HU-005 — Income sources

**Feature:** PB-003 — User-owned catalogs

**Story:**
> As a user, I want to manage my income sources so that income entries use terms that match my finances.

**Implementation scope:** Implement owned income-source CRUD, editable Salary/Other defaults and migration away from archive flags; validate trimmed case-insensitive unique names; confirm permanent deletion; clear future optional historical references before deletion; refresh selectors; test ownership and rollback.

**Acceptance criteria:** I receive editable income-source defaults; I can add, rename and permanently delete my values; deleted values disappear from new forms while future historical transactions remain and show Source deleted for a missing optional source; another user's data is unaffected.

**Story points:** 2

**Mockup:** TBD

---

### HU-006 — Manual expense

**Feature:** PB-004 — Expenses and optional receipt detail

**Story:**
> As a user, I want to record an expense with only essential information so that manual capture remains fast without AI or a receipt.

**Implementation scope:** Define one expense request contract; implement authenticated create API and a short form; require active owned account, positive amount, date and merchant/description; default date to today and allow Uncategorized; collapse optional fields; avoid duplicate typing for one optional item; save atomically and test ownership/currency.

**Acceptance criteria:** A simple expense needs only account, amount and merchant/description because date defaults to today, account supplies currency and category may be Uncategorized; optional fields stay out of the way; one item can reuse the merchant text; AI, receipt and item rows are not required; invalid references save nothing.

**Story points:** 5

**Mockup:** TBD

---

### HU-008 — Expense correction and permanent deletion

**Feature:** PB-004 — Expenses and optional receipt detail

**Story:**
> As a user, I want to view, correct, and permanently delete my expenses so that my records stay accurate and under my control.

**Implementation scope:** Implement owned list/detail/edit/delete API and UI; recalculate balances, history, budgets and summaries once; confirm deletion; remove items and owned attachment atomically; test unauthorized access and rollback.

**Acceptance criteria:** I can view and edit only my expenses; valid edits update derived results exactly once; permanent deletion requires confirmation and removes the expense, item details and receipt file together; failure preserves the prior record; another user's expense is never exposed.

**Story points:** 5

**Mockup:** TBD

---

### HU-009 — Income lifecycle

**Feature:** PB-005 — Income

**Story:**
> As a user, I want to record and manage income in an account so that balances and summaries are complete.

**Implementation scope:** Implement owned income create/list/detail/edit/delete API and UI; validate active account, positive amount/date and optional owned source; update balance/history; confirm deletion; test ownership and rollback.

**Acceptance criteria:** Valid income increases the selected account balance and appears in history; description/source follow their optionality rules; edits recalculate once; confirmed deletion removes the income and reverses its effect; foreign-owned resources are rejected.

**Story points:** 2

**Mockup:** TBD

---

### HU-010 — Transfers

**Feature:** PB-006 — Transfers

**Story:**
> As a user, I want to transfer money between my accounts so that internal movements do not look like income or spending.

**Implementation scope:** Implement atomic transfer API and form; validate distinct active owned accounts and positive amounts; preserve source/destination values for cross-currency transfers; update both balances/history; test rollback and analytics neutrality.

**Acceptance criteria:** A same-currency transfer moves the same amount between distinct owned accounts; a cross-currency transfer stores both actual amounts; both sides commit or neither does; transfers affect balances but never income/expense totals; foreign or invalid accounts save nothing.

**Story points:** 2

**Mockup:** TBD

---

### HU-011 — Transaction history and filters

**Feature:** PB-007 — Transaction history and filters

**Story:**
> As a user, I want one searchable, filterable transaction history so that I can find and inspect any expense, income, or transfer.

**Implementation scope:** Implement one ordered history query and UI; distinguish movement types; add live text search plus weekly/monthly/custom, account, type and category filters; search merchant, description and item text case-insensitively; preserve currency labels; paginate; test combined filters and isolation.

**Acceptance criteria:** I see only my expenses, income and transfers, newest first; text and filters combine correctly; every amount shows currency; unlike currencies are not combined; Uncategorized expenses remain visible; a clear no-results state appears when nothing matches.

**Story points:** 2

**Mockup:** TBD

---

### HU-012 — Basic financial dashboard

**Feature:** PB-008 — Basic financial dashboard

**Story:**
> As a user, I want a basic dashboard of balances, recent movements, spending, and income so that I understand my financial position before and after every capture.

**Implementation scope:** Implement deterministic aggregation API and dashboard UI; add Today/This week/This month/custom periods; show balances, income/expense, recent movements and category totals; allow subcategory breakdown; separate currencies; test transfer neutrality, ownership and empty/error states.

**Acceptance criteria:** For the selected period I see owned balances, income, expenses, recent movements and categories ordered by spending; I can inspect subcategory detail; transfers affect balances only; totals remain separated by currency; the same stored data produces the same result without AI; empty/error states never fabricate values.

**Story points:** 3

**Mockup:** TBD

---

### HU-013 — Natural-text capture

**Feature:** PB-009 — AI capture from natural text and audio

**Story:**
> As a user, I want to write what happened in my own words so that the assistant identifies the financial operation and prepares it for quick review.

**Implementation scope:** Implement natural-text input, intent classification for expense/income/transfer, structured proposal/confidence, account/catalog grounding, compact review, focused clarification, in-place edit, retry/discard, latency/error UX and tests.

**Acceptance criteria:** Natural text proposes the correct operation without saving; transfers are not misclassified as spending; complete high-confidence proposals need one-tap acceptance; only ambiguity triggers a short clarification; corrections preserve the original text; Accept uses the normal validated atomic operation; manual forms remain available.

**Story points:** 8

**Mockup:** TBD

---

### HU-014 — Voice capture

**Feature:** PB-009 — AI capture from natural text and audio

**Story:**
> As a user, I want to describe a financial operation by voice so that the assistant prepares it while I avoid typing.

**Implementation scope:** Reuse the HU-013 proposal/review flow; implement microphone permission, visible recording state, automatic stop at 60 seconds, temporary M4A/WAV handling, speech plus intent extraction, partial/unintelligible/timeout recovery, edit/retry/type/manual actions, cleanup and tests.

**Acceptance criteria:** Voice proposes an expense, income or transfer without saving; recording visibly stops by 60 seconds; denied permission links to settings; high-confidence results need one-tap acceptance; partial/unintelligible/timeouts preserve useful context and offer retry or text/manual fallback; Accept uses the normal save path; temporary audio is cleaned.

**Story points:** 3

**Mockup:** TBD

---

### HU-015 — Receipt-photo capture

**Feature:** PB-010 — AI capture from receipt photo

**Story:**
> As a user, I want a receipt photo to produce a proposed expense so that I can verify it at a glance and accept it instead of typing every value.

**Implementation scope:** Reuse the shared proposal/review flow; implement temporary JPEG/PNG/HEIC upload up to 10 MB, resize/compression, structured extraction status/confidence, printed-total preservation, mapping to the expense form, focused uncertainty, edit/retry/discard, cleanup and provider-failure tests.

**Acceptance criteria:** A supported photo produces “This is what I understood” without saving; merchant, date, printed total, currency, payment method, classification and items are editable; a high-confidence proposal is accepted with one tap; partial/unreadable/error states offer focused recovery; Accept uses the normal save path; temporary media is cleaned.

**Story points:** Not provided in supplied register

**Mockup:** TBD

---

### HU-016 — Spending budgets

**Feature:** PB-011 — Spending budgets

**Story:**
> As a user, I want a category or subcategory budget so that I can compare actual spending with a weekly or monthly target.

**Implementation scope:** Implement owned budget CRUD; require positive amount, currency, period and exactly one target; calculate progress from qualifying expenses; delete dependent budgets with deleted classifications; add progress to the existing dashboard; test period, currency and ownership rules.

**Acceptance criteria:** I can create a weekly/monthly budget for exactly one owned category or subcategory; progress is derived, not manually stored, and appears on the dashboard; only matching period/currency expenses count; deleting its classification removes the budget after confirmation; ownership is enforced.

**Story points:** 1

**Mockup:** TBD

---

## Register consistency

- HU-001 through HU-006, HU-008 through HU-016 are present in the supplied register.
- HU-007 is intentionally absent from the supplied register; no replacement story was invented.
- Product backlog status belongs to the PB row. Individual HU completion must be verified against its acceptance criteria and implementation evidence.
