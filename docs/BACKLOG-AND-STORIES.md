# Product Backlog & User Stories — Finance AI Tracker

> **Story source:** supplied backlog and user-story register, 2026-09-13.
> The original register contains **15 user-story rows** under **11 product backlog items**;
> HU-007 is absent from that register. Original story wording, scope, acceptance criteria
> and point estimates are preserved.
> **Current status source:** Trello card completion, verified **2026-11-04**, including archived cards.
> PB-001–PB-011 and their 15 original stories are **Done** on the board.
> The Support Agent extension adds eight planned implementation stories under two new backlog
> items; its implementation statuses and provisional estimates are separate from the completed core.
> **Estimation scale:** Story Points — standard **Fibonacci** (1, 2, 3, 5, 8, 13…).
> Card completion is project-tracking evidence; it does not assert a new runtime test or release.

---

## Product Backlog

| Code | Feature | Priority | Status | Notes |
|---|---|---|---|---|
| PB-001 | Identity and access | High | Done | HU-001 registration and HU-002 secure renewable sessions are implemented. |
| PB-002 | Accounts and currencies | High | Done | HU-003 complete. Owned accounts, derived balances, deactivate/reactivate, and safe permanent deletion are merged into develop for backend and frontend. |
| PB-003 | User-owned catalogs | High | Done | HU-004 categories and HU-005 income sources. Accounts replace payment methods; subcategories and payment methods are outside the product model. Catalog deletion is confirmed and permanent rather than archived. |
| PB-004 | Expenses and optional receipt detail | High | Done | HU-006–HU-008. Fast manual expense, optional evidence/items, correction and permanent deletion. |
| PB-005 | Income | High | Done | HU-009. Manual income lifecycle tied to an owned account. |
| PB-006 | Transfers | High | Done | HU-010. Atomic movement between owned accounts; never income or expense. |
| PB-007 | Transaction history and filters | High | Done | HU-011. Search and inspect expenses, income and transfers together before AI is introduced. |
| PB-008 | Basic financial dashboard | High | Done | HU-012. Deterministic balances, recent movements, income/expense and period/category views before AI. |
| PB-009 | AI capture from natural text and audio | High | Done | HU-013–HU-014. Written and spoken language share one conversational capture capability, with separate stories for text and microphone behavior. |
| PB-010 | AI capture from receipt photo | High | Done | HU-015. Receipt images produce a fast editable expense proposal with printed-total and item extraction. |
| PB-011 | Spending budgets | Medium | Done | HU-016. Weekly/monthly category or subcategory targets and dashboard progress after the AI speed layer. |

---

## Status verification — 2026-11-04

The current statuses above were refreshed from the [active Finance AI board](https://trello.com/b/jv4JziIh/%F0%9F%A5%9A%F0%9F%92%A5-ballbreakers-board-finance-ai), including archived cards. All 15 matching story cards have `complete=true` and `closed=true`; they are archived in the Deploy list. Their explicit completion flag, not the list name or archive flag alone, establishes the board status used here. Older archived Backlog duplicates are superseded story versions and were not used.

| Story | Current status | Trello evidence |
|---|---|---|
| HU-001 | Done | [Completed, archived card](https://trello.com/c/PKBB2xx4) |
| HU-002 | Done | [Completed, archived card](https://trello.com/c/xmhToqTz) |
| HU-003 | Done | [Completed, archived card](https://trello.com/c/fUGYcuPr) |
| HU-004 | Done | [Completed, archived card](https://trello.com/c/9FK5NZx2) |
| HU-005 | Done | [Completed, archived card](https://trello.com/c/nATpdJCB) |
| HU-006 | Done | [Completed, archived card](https://trello.com/c/VR6CZCu8) |
| HU-008 | Done | [Completed, archived card](https://trello.com/c/UBioNGpa) |
| HU-009 | Done | [Completed, archived card](https://trello.com/c/sUSWe8ng) |
| HU-010 | Done | [Completed, archived card](https://trello.com/c/TtADvIZz) |
| HU-011 | Done | [Completed, archived card](https://trello.com/c/1pKHRnzQ) |
| HU-012 | Done | [Completed, archived card](https://trello.com/c/GbOnkvKd) |
| HU-013 | Done | [Completed, archived card](https://trello.com/c/Ds4Uqude) |
| HU-014 | Done | [Completed, archived card](https://trello.com/c/HmAVil0G) |
| HU-015 | Done | [Completed, archived card](https://trello.com/c/NppYhEvb) |
| HU-016 | Done | [Completed, archived card](https://trello.com/c/ggU2nUlK) |

This is a board-status reconciliation, not a new execution of application acceptance tests or proof of a particular production release. Four completed cards still contain unmarked legacy checklist items (HU-002, HU-008, HU-011 and HU-013); that bookkeeping inconsistency is retained explicitly rather than silently reopening completed work. Historical card text also contains superseded details such as JWTs, subcategories and older PB mappings: only the completion status is synchronized here, not those old architecture/scope values or point estimates. Current technical behavior remains described in the architecture/stack documentation.

The separately planned Support Agent extension has documentation completed but application implementation Not started. Open RBAC requirements/implementation cards cover broader role work and do not reverse completion of the original HU stories.

---

## User Stories

### HU-001 — Registration

**Feature:** PB-001 — Identity and access

**Story:**
> As a new user, I want to create an account so that I can begin managing my finances.

**Implementation scope:** Validate and normalize email; enforce password policy; hash password adaptively; create user and default catalogs atomically; build accessible registration states; test duplicates, validation, rollback and safe diagnostics.

**Acceptance criteria:** A valid unused normalized email and matching valid passwords create one account and defaults; success redirects to Login without automatic login; duplicate/invalid input gives field-level feedback; duplicate submissions are blocked; passwords and internals are never exposed.

**Story points:** 3

**Implementation status:** Done — [Trello card](https://trello.com/c/PKBB2xx4), marked complete and archived; verified 2026-11-04.

**Mockup:** TBD

---

### HU-002 — Secure renewable sessions

**Feature:** PB-001 — Identity and access

**Story:**
> As a returning user, I want a secure renewable session so that I can access my data without signing in on every app launch.

**Implementation scope:** Implement login, short-lived access credentials, rotating renewable credentials, restoration, replay protection, logout revocation, secure Android/Windows storage, protected routing and end-to-end tests.

**Acceptance criteria:** Valid credentials open the authenticated home; invalid credentials use one generic error; restart restores a valid session; invalid/expired/revoked renewal returns to Login and clears authority; logout revokes the current renewable credential and removes protected access.

**Story points:** 3

**Implementation status:** Done — [Trello card](https://trello.com/c/xmhToqTz), marked complete and archived; verified 2026-11-04.

**Mockup:** TBD

---

### HU-003 — Accounts and currencies

**Feature:** PB-002 — Accounts and currencies

**Story:**
> As a user, I want accounts for cash, banks, wallets, or savings products so that I know where my money is held.

**Implementation scope:** Implement owned account create/list/detail/edit/deactivate/reactivate/safe-delete API and UI; validate unique name, type, currency and opening balance; derive balances from movements; suggest COP or the last-used currency without a separate preference record; allow permanent deletion only before movements; enforce ownership and test currency, inactive-account and deletion rules.

**Acceptance criteria:** I can create and edit an account with name, type, explicit currency and opening balance; its balance is derived consistently; inactive accounts remain visible in history but cannot receive new movements; unused accounts can be permanently deleted while used accounts retain history; suggestions never change existing records; I cannot access another user's account.

**Story points:** 2

**Implementation status:** Done — [Trello card](https://trello.com/c/fUGYcuPr), marked complete and archived; verified 2026-11-04.

**Mockup:** TBD

---

### HU-004 — Categories

**Feature:** PB-003 — User-owned catalogs

**Story:**
> As a user, I want to manage my categories so that classifications match how I understand my spending.

**Implementation scope:** Implement owned category create/list/detail/edit/reorder/permanent-delete API and UI; replace archive flags through Alembic; support required name, optional color and icon, and manual order; validate trimmed case-insensitive unique names and ownership; keep editable Needs/Wants/Other defaults; confirm deletion; refresh selectors; document that future expense forms require a valid category, deleted historical references display Category deleted, and dependent category budgets cascade without prebuilding those features; test rollback and isolation.

**Acceptance criteria:** I can create, rename, recolor, re-icon, reorder and permanently delete only my categories; starter categories are editable; deletion asks for confirmation; deleted names can be reused; no Uncategorized option is offered for new records; future dependency rules preserve expenses and remove category budgets; only my data changes.

**Story points:** 3

**Implementation status:** Done — [Trello card](https://trello.com/c/9FK5NZx2), marked complete and archived; verified 2026-11-04.

**Mockup:** TBD

---

### HU-005 — Income sources

**Feature:** PB-003 — User-owned catalogs

**Story:**
> As a user, I want to manage my income sources so that income entries use terms that match my finances.

**Implementation scope:** Implement owned income-source CRUD, editable Salary/Other defaults and migration away from archive flags; validate trimmed case-insensitive unique names; confirm permanent deletion; clear future optional historical references before deletion; refresh selectors; test ownership and rollback.

**Acceptance criteria:** I receive editable income-source defaults; I can add, rename and permanently delete my values; deleted values disappear from new forms while future historical transactions remain and show Source deleted for a missing optional source; another user's data is unaffected.

**Story points:** 2

**Implementation status:** Done — [Trello card](https://trello.com/c/nATpdJCB), marked complete and archived; verified 2026-11-04.

**Mockup:** TBD

---

### HU-006 — Manual expense

**Feature:** PB-004 — Expenses and optional receipt detail

**Story:**
> As a user, I want to record an expense with only essential information so that manual capture remains fast without AI or a receipt.

**Implementation scope:** Define one expense request contract; implement authenticated create API and a short form; require active owned account, positive amount, date and merchant/description; default date to today and allow Uncategorized; collapse optional fields; avoid duplicate typing for one optional item; save atomically and test ownership/currency.

**Acceptance criteria:** A simple expense needs only account, amount and merchant/description because date defaults to today, account supplies currency and category may be Uncategorized; optional fields stay out of the way; one item can reuse the merchant text; AI, receipt and item rows are not required; invalid references save nothing.

**Story points:** 5

**Implementation status:** Done — [Trello card](https://trello.com/c/VR6CZCu8), marked complete and archived; verified 2026-11-04.

**Mockup:** TBD

---

### HU-008 — Expense correction and permanent deletion

**Feature:** PB-004 — Expenses and optional receipt detail

**Story:**
> As a user, I want to view, correct, and permanently delete my expenses so that my records stay accurate and under my control.

**Implementation scope:** Implement owned list/detail/edit/delete API and UI; recalculate balances, history, budgets and summaries once; confirm deletion; remove items and owned attachment atomically; test unauthorized access and rollback.

**Acceptance criteria:** I can view and edit only my expenses; valid edits update derived results exactly once; permanent deletion requires confirmation and removes the expense, item details and receipt file together; failure preserves the prior record; another user's expense is never exposed.

**Story points:** 5

**Implementation status:** Done — [Trello card](https://trello.com/c/UBioNGpa), marked complete and archived; verified 2026-11-04.

**Mockup:** TBD

---

### HU-009 — Income lifecycle

**Feature:** PB-005 — Income

**Story:**
> As a user, I want to record and manage income in an account so that balances and summaries are complete.

**Implementation scope:** Implement owned income create/list/detail/edit/delete API and UI; validate active account, positive amount/date and optional owned source; update balance/history; confirm deletion; test ownership and rollback.

**Acceptance criteria:** Valid income increases the selected account balance and appears in history; description/source follow their optionality rules; edits recalculate once; confirmed deletion removes the income and reverses its effect; foreign-owned resources are rejected.

**Story points:** 2

**Implementation status:** Done — [Trello card](https://trello.com/c/sUSWe8ng), marked complete and archived; verified 2026-11-04.

**Mockup:** TBD

---

### HU-010 — Transfers

**Feature:** PB-006 — Transfers

**Story:**
> As a user, I want to transfer money between my accounts so that internal movements do not look like income or spending.

**Implementation scope:** Implement atomic transfer API and form; validate distinct active owned accounts and positive amounts; preserve source/destination values for cross-currency transfers; update both balances/history; test rollback and analytics neutrality.

**Acceptance criteria:** A same-currency transfer moves the same amount between distinct owned accounts; a cross-currency transfer stores both actual amounts; both sides commit or neither does; transfers affect balances but never income/expense totals; foreign or invalid accounts save nothing.

**Story points:** 2

**Implementation status:** Done — [Trello card](https://trello.com/c/TtADvIZz), marked complete and archived; verified 2026-11-04.

**Mockup:** TBD

---

### HU-011 — Transaction history and filters

**Feature:** PB-007 — Transaction history and filters

**Story:**
> As a user, I want one searchable, filterable transaction history so that I can find and inspect any expense, income, or transfer.

**Implementation scope:** Implement one ordered history query and UI; distinguish movement types; add live text search plus weekly/monthly/custom, account, type and category filters; search merchant, description and item text case-insensitively; preserve currency labels; paginate; test combined filters and isolation.

**Acceptance criteria:** I see only my expenses, income and transfers, newest first; text and filters combine correctly; every amount shows currency; unlike currencies are not combined; Uncategorized expenses remain visible; a clear no-results state appears when nothing matches.

**Story points:** 2

**Implementation status:** Done — [Trello card](https://trello.com/c/1pKHRnzQ), marked complete and archived; verified 2026-11-04.

**Mockup:** TBD

---

### HU-012 — Basic financial dashboard

**Feature:** PB-008 — Basic financial dashboard

**Story:**
> As a user, I want a basic dashboard of balances, recent movements, spending, and income so that I understand my financial position before and after every capture.

**Implementation scope:** Implement deterministic aggregation API and dashboard UI; add Today/This week/This month/custom periods; show balances, income/expense, recent movements and category totals; allow subcategory breakdown; separate currencies; test transfer neutrality, ownership and empty/error states.

**Acceptance criteria:** For the selected period I see owned balances, income, expenses, recent movements and categories ordered by spending; I can inspect subcategory detail; transfers affect balances only; totals remain separated by currency; the same stored data produces the same result without AI; empty/error states never fabricate values.

**Story points:** 3

**Implementation status:** Done — [Trello card](https://trello.com/c/GbOnkvKd), marked complete and archived; verified 2026-11-04.

**Mockup:** TBD

---

### HU-013 — Natural-text capture

**Feature:** PB-009 — AI capture from natural text and audio

**Story:**
> As a user, I want to write what happened in my own words so that the assistant identifies the financial operation and prepares it for quick review.

**Implementation scope:** Implement natural-text input, intent classification for expense/income/transfer, structured proposal/confidence, account/catalog grounding, compact review, focused clarification, in-place edit, retry/discard, latency/error UX and tests.

**Acceptance criteria:** Natural text proposes the correct operation without saving; transfers are not misclassified as spending; complete high-confidence proposals need one-tap acceptance; only ambiguity triggers a short clarification; corrections preserve the original text; Accept uses the normal validated atomic operation; manual forms remain available.

**Story points:** 8

**Implementation status:** Done — [Trello card](https://trello.com/c/Ds4Uqude), marked complete and archived; verified 2026-11-04.

**Mockup:** TBD

---

### HU-014 — Voice capture

**Feature:** PB-009 — AI capture from natural text and audio

**Story:**
> As a user, I want to describe a financial operation by voice so that the assistant prepares it while I avoid typing.

**Implementation scope:** Reuse the HU-013 proposal/review flow; implement microphone permission, visible recording state, automatic stop at 60 seconds, temporary M4A/WAV handling, speech plus intent extraction, partial/unintelligible/timeout recovery, edit/retry/type/manual actions, cleanup and tests.

**Acceptance criteria:** Voice proposes an expense, income or transfer without saving; recording visibly stops by 60 seconds; denied permission links to settings; high-confidence results need one-tap acceptance; partial/unintelligible/timeouts preserve useful context and offer retry or text/manual fallback; Accept uses the normal save path; temporary audio is cleaned.

**Story points:** 3

**Implementation status:** Done — [Trello card](https://trello.com/c/HmAVil0G), marked complete and archived; verified 2026-11-04.

**Mockup:** TBD

---

### HU-015 — Receipt-photo capture

**Feature:** PB-010 — AI capture from receipt photo

**Story:**
> As a user, I want a receipt photo to produce a proposed expense so that I can verify it at a glance and accept it instead of typing every value.

**Implementation scope:** Reuse the shared proposal/review flow; implement temporary JPEG/PNG/HEIC upload up to 10 MB, resize/compression, structured extraction status/confidence, printed-total preservation, mapping to the expense form, focused uncertainty, edit/retry/discard, cleanup and provider-failure tests.

**Acceptance criteria:** A supported photo produces “This is what I understood” without saving; merchant, date, printed total, currency, payment method, classification and items are editable; a high-confidence proposal is accepted with one tap; partial/unreadable/error states offer focused recovery; Accept uses the normal save path; temporary media is cleaned.

**Story points:** Not provided in supplied register

**Implementation status:** Done — [Trello card](https://trello.com/c/NppYhEvb), marked complete and archived; verified 2026-11-04.

**Mockup:** TBD

---

### HU-016 — Spending budgets

**Feature:** PB-011 — Spending budgets

**Story:**
> As a user, I want a category or subcategory budget so that I can compare actual spending with a weekly or monthly target.

**Implementation scope:** Implement owned budget CRUD; require positive amount, currency, period and exactly one target; calculate progress from qualifying expenses; delete dependent budgets with deleted classifications; add progress to the existing dashboard; test period, currency and ownership rules.

**Acceptance criteria:** I can create a weekly/monthly budget for exactly one owned category or subcategory; progress is derived, not manually stored, and appears on the dashboard; only matching period/currency expenses count; deleting its classification removes the budget after confirmation; ownership is enforced.

**Story points:** 1

**Implementation status:** Done — [Trello card](https://trello.com/c/ggU2nUlK), marked complete and archived; verified 2026-11-04.

**Mockup:** TBD

---

## Register consistency

- HU-001 through HU-006, HU-008 through HU-016 are present in the supplied register.
- HU-007 is intentionally absent from the supplied register; no replacement story was invented.
- Product backlog status belongs to the PB row. Individual HU completion must be verified against its acceptance criteria and implementation evidence.

## Support Agent extension — 2026-11-04

**Tracking:** [Support Agent — ticket management MVP](https://trello.com/c/rCyuWwMB), created in Trello Backlog on 2026-11-04. Six role-story checklist items total 24 provisional points; the two customer dependencies and shared prerequisites are separate checklists. Card creation does not indicate implementation has started.

This section adds planned work to the preserved historical register above. The six SUP stories and the two customer dependencies below are the authoritative story definitions; the [role specification](../aidlc-docs/inception/requirements/support-agent-role.md) supplies policy, source evidence and pending decisions without duplicating them. There are now 23 story records: 15 historical HU records and eight new support-related records. No historical HU is renumbered or re-estimated.

### Planned product backlog additions

| Code | Feature | Priority | Status | Story ownership |
|---|---|---|---|---|
| PB-012 | Support Agent ticket management | High | Not started | SUP-01–SUP-06; one Support Agent role owner |
| PB-013 | Customer support dependencies | High | Not started | USR-SUP-01–USR-SUP-02; customer-role owner, linked to PB-012 |

### SUP-01 — View and claim support tickets

**Feature:** PB-012 — Support Agent ticket management

**Actor:** Support Agent

**Story:**
> As a Support Agent, I want to view available support tickets and claim unassigned tickets, so that I can begin assisting customers.

**Implementation scope:** Provide a restricted ticket queue, status filtering and atomic ticket claims in the staff portal and FastAPI service.

**Acceptance criteria:**

1. Display authorized queue entries with ticket ID, subject, status, creation timestamp and assignment. Before assignment, return only this limited queue projection; exclude conversation bodies and customer account details.
2. Allow filtering by status without bypassing the caller's queue scope.
3. Allow an authorized agent to claim an unassigned ticket atomically. Concurrent claims have exactly one winner; the losing attempt receives a safe conflict and cannot overwrite the assignment.
4. After assignment, allow the assignee to access the full authorized ticket context, subject to SUP-04's field restrictions; assignment never grants access to financial records.
5. Enforce staff role and ticket/resource authorization in the backend for queue, detail and claim operations. Reject unauthenticated, customer-role and out-of-scope requests without exposing ticket contents.
6. Record successful assignment as a traceable activity/audit event. The queue's organizational scope, claim-related status transition and reassignment rules remain pending in the role specification.

**Priority:** High

**Dependencies:** Shared staff portal, staff authentication/RBAC and ticket persistence; tickets may originate from USR-SUP-01 or SUP-02.

**Authorization and validation:** The criteria above are enforced by FastAPI for each operation, including direct requests that bypass the frontend. Apply the [role permission boundary](../aidlc-docs/inception/requirements/support-agent-role.md#permissions-and-data-boundary) and deny by default.

**Story points:** 5 — provisional, pending team estimation.

**Implementation status:** Not started — no support module or support UI found in the inspected source.

**Mockup:** TBD

---

### SUP-02 — Create support tickets

**Feature:** PB-012 — Support Agent ticket management

**Actor:** Support Agent

**Story:**
> As a Support Agent, I want to create a ticket on behalf of an identified customer, so that issues reported through another support channel can be documented.

**Implementation scope:** Capture an externally reported issue using a narrowly scoped account lookup and create a customer-linked ticket; reuse SUP-04's metadata boundary rather than introducing another customer-information story.

**Acceptance criteria:**

1. Identify an existing customer through an authorized, narrowly scoped account lookup. Do not offer unrestricted customer browsing or expose financial data. The permitted lookup keys and result-disclosure rules are pending.
2. Require a nonblank subject, category and description, with backend-defined length limits, allowed categories and safe text rendering. Exact limits/category values remain pending.
3. Link the ticket to the identified customer using the server-validated account identifier; reject nonexistent or unauthorized targets.
4. Record the creation timestamp and responsible agent separately from the customer identity.
5. Prevent unauthorized customer-data access on lookup and creation. Use only the limited metadata permitted by SUP-04.
6. Preserve creation activity/audit evidence. Initial status and assignment for agent-created tickets remain pending; no automatic assignment is assumed.

**Priority:** High

**Dependencies:** Ticket persistence, staff authorization and the restricted customer-lookup contract governed by SUP-04. Name/subscription fields depend on the customer/account model.

**Authorization and validation:** The criteria above are enforced by FastAPI for each operation, including direct requests that bypass the frontend. Apply the [role permission boundary](../aidlc-docs/inception/requirements/support-agent-role.md#permissions-and-data-boundary) and deny by default.

**Story points:** 3 — provisional, pending team estimation.

**Implementation status:** Not started — no support module or support UI found in the inspected source.

**Mockup:** TBD

---

### SUP-03 — Communicate with customers

**Feature:** PB-012 — Support Agent ticket management

**Actor:** Support Agent

**Story:**
> As a Support Agent, I want to exchange messages with customers through assigned tickets, so that I can investigate and resolve their problems.

**Implementation scope:** Implement staff conversation viewing/sending and shared persisted message behavior. Customer Flutter screens and reply interactions are delivered once under USR-SUP-02; this story's completion depends on that integration.

**Acceptance criteria:**

1. Allow the assigned agent to read and send messages only within an authorized assigned ticket and in approved reply-eligible states.
2. Allow the owning customer to read and reply through the existing Flutter application under USR-SUP-02; verify the staff/customer exchange as one integrated conversation.
3. Derive each message author from the authenticated principal and record a server timestamp; clients cannot impersonate another author.
4. Reject empty or oversized messages according to documented validation limits and render user text safely. Exact limits remain pending.
5. Prevent unauthorized agents and other customers from reading or sending messages, including direct resource-ID requests.
6. Preserve message order/history and record message-action metadata without copying message bodies or credentials into security logs. Real-time delivery, push notifications and attachments are excluded.

**Priority:** High

**Dependencies:** SUP-01 assignment and authorization, shared message persistence/API, USR-SUP-02 for the customer interface; approved reply-state rules.

**Authorization and validation:** The criteria above are enforced by FastAPI for each operation, including direct requests that bypass the frontend. Apply the [role permission boundary](../aidlc-docs/inception/requirements/support-agent-role.md#permissions-and-data-boundary) and deny by default.

**Story points:** 5 — provisional, pending team estimation.

**Implementation status:** Not started — no support module or support UI found in the inspected source.

**Mockup:** TBD

---

### SUP-04 — View limited customer information

**Feature:** PB-012 — Support Agent ticket management

**Actor:** Support Agent

**Story:**
> As a Support Agent, I want to inspect relevant customer account information, so that I can identify customers and provide appropriate assistance.

**Implementation scope:** Define one allowlisted, read-only customer metadata projection for authorized ticket context and the restricted SUP-02 lookup. This is the only Support Agent story for customer-information permissions.

**Acceptance criteria:**

1. Within an authorized support context, display customer name, email, account identifier, account status and subscription status only where the underlying model supports those fields. The inspected source supports email, identifier and active status; missing name/subscription fields are explicit dependencies, never fabricated values.
2. Exclude private transactions, balances, receipts, passwords, password hashes, tokens and financial credentials from support responses and joins.
3. Prevent agents from modifying account details, role permissions or subscription entitlements; read-only UI controls are supplemented by backend denial of write operations.
4. Enforce the metadata allowlist, staff permissions and resource context in the backend for every request.
5. Restrict pre-ticket lookup to the approved SUP-02 identification purpose. Possessing an account ID alone does not authorize broad account access.
6. Do not make billing or subscription-expiration implementation a blocker for this documentation. How to present unavailable fields requires a supported contract before implementation.

**Priority:** High

**Dependencies:** Backend staff/resource authorization and the existing identity model; customer-name and subscription-status fields require an underlying supported model.

**Authorization and validation:** The criteria above are enforced by FastAPI for each operation, including direct requests that bypass the frontend. Apply the [role permission boundary](../aidlc-docs/inception/requirements/support-agent-role.md#permissions-and-data-boundary) and deny by default.

**Story points:** 3 — provisional, pending team estimation.

**Implementation status:** Not started — no support module or support UI found in the inspected source.

**Mockup:** TBD

---

### SUP-05 — Escalate tickets to administrators

**Feature:** PB-012 — Support Agent ticket management

**Actor:** Support Agent

**Story:**
> As a Support Agent, I want to escalate cases requiring administrative privileges, so that an authorized administrator can resolve them.

**Implementation scope:** Provide the support-side escalation action and a documented handoff contract to the Admin owner. Administrative execution and Admin screens belong to separate role work.

**Acceptance criteria:**

1. Allow an authorized assigned agent to escalate an eligible ticket.
2. Require a nonblank escalation reason with documented backend length bounds; exact bounds remain pending.
3. Change the ticket status to escalated and record the actor, timestamp and reason as part of the case history.
4. Make the escalated case available to the appropriate administrator workflow through the agreed backend contract; the responsible administrator/queue and ownership transfer policy are pending.
5. Preserve previous messages and history for principals whose access remains authorized. Continued agent access after escalation must follow the approved ownership policy.
6. Deny the support agent administrative actions such as account suspension/reactivation, refunds, subscription changes, role changes and system configuration changes.

**Priority:** High

**Dependencies:** SUP-01, ticket activity/audit persistence and an agreed administrator escalation contract; ownership after escalation remains pending.

**Authorization and validation:** The criteria above are enforced by FastAPI for each operation, including direct requests that bypass the frontend. Apply the [role permission boundary](../aidlc-docs/inception/requirements/support-agent-role.md#permissions-and-data-boundary) and deny by default.

**Story points:** 3 — provisional, pending team estimation.

**Implementation status:** Not started — no support module or support UI found in the inspected source.

**Mockup:** TBD

---

### SUP-06 — Review case history and resolve tickets

**Feature:** PB-012 — Support Agent ticket management

**Actor:** Support Agent

**Story:**
> As a Support Agent, I want to review ticket history and document resolutions, so that support outcomes remain traceable.

**Implementation scope:** Present the case timeline and support resolution action, reusing events captured by the earlier ticket operations. The inspected backend has no existing support-history module; shared history capture must be planned, not assumed.

**Acceptance criteria:**

1. Display the authorized ticket's messages, relevant status changes and assignment history with recorded actors/timestamps.
2. Allow the assigned agent to resolve only a ticket eligible under the approved transition policy. Eligibility and escalated-ticket resolution authority remain pending.
3. Require a nonblank resolution summary with documented backend length bounds; exact bounds remain pending.
4. Persist resolved status and resolution, and make them visible to the owning customer through USR-SUP-02. Customer visibility of internal history or escalation reasons is pending.
5. Preserve case history after resolution and record the resolution actor/timestamp. The Support Agent cannot modify or delete security audit records.
6. Do not implement reopening or permit replies to resolved tickets until the reopening/reply-state policy is approved. Record that policy as pending, without assuming a business outcome.

**Priority:** High

**Dependencies:** SUP-01 authorization, SUP-03 messages, ticket status/assignment events including SUP-05 escalation, and USR-SUP-02 customer visibility; approved resolution eligibility.

**Authorization and validation:** The criteria above are enforced by FastAPI for each operation, including direct requests that bypass the frontend. Apply the [role permission boundary](../aidlc-docs/inception/requirements/support-agent-role.md#permissions-and-data-boundary) and deny by default.

**Story points:** 5 — provisional, pending team estimation.

**Implementation status:** Not started — no support module or support UI found in the inspected source.

**Mockup:** TBD

---

### USR-SUP-01 — Create a support request

**Feature:** PB-013 — Customer support dependencies

**Actor:** Authenticated FinanciAI User

**Story:**
> As a Authenticated FinanciAI User, I want to create a support ticket from the Flutter mobile application, so that I can request assistance.

**Implementation scope:** Deliver the customer-owned mobile support-request form and customer create behavior. This is a dependency owned by the customer-role work, not a seventh Support Agent story.

**Acceptance criteria:**

1. Provide access through Settings → Help & Support in the existing Flutter application.
2. Require authentication; the backend associates the ticket with the authenticated user.
3. Require subject, category and description using the agreed shared validation contract.
4. Reject attempts to create tickets on behalf of another customer, including forged customer identifiers.
5. Keep initial status/assignment consistent with the finalized ticket workflow; these decisions remain pending.

**Priority:** High

**Dependencies:** Existing Flutter Settings and session flow; shared ticket API/persistence and validation contract.

**Authorization and validation:** The criteria above are enforced by FastAPI for each operation, including direct requests that bypass the frontend. Apply the [role permission boundary](../aidlc-docs/inception/requirements/support-agent-role.md#permissions-and-data-boundary) and deny by default.

**Story points:** 3 — provisional, pending team estimation.

**Implementation status:** Not started — no support module or support UI found in the inspected source.

**Mockup:** TBD

---

### USR-SUP-02 — Track and respond to support requests

**Feature:** PB-013 — Customer support dependencies

**Actor:** FinanciAI User

**Story:**
> As a FinanciAI User, I want to view my tickets and respond to support messages, so that I can track the resolution of my problems.

**Implementation scope:** Deliver the Flutter ticket list, conversation, reply and resolution views plus customer-specific authorization. Reuse the shared messaging backend rather than estimating a duplicate messaging service.

**Acceptance criteria:**

1. Display only tickets belonging to the authenticated user; enforce ownership in the backend for listing, detail and replies.
2. Show ticket status, authorized conversation and resolution when present.
3. Allow replies only to eligible tickets using the agreed status policy and shared message validation.
4. Prevent access to another customer's tickets or messages, including direct ID manipulation.
5. Reflect staff replies and resolutions using ordinary request/refresh behavior; real-time chat and push notifications are excluded. Reply eligibility and customer-visible internal history remain pending.

**Priority:** High

**Dependencies:** USR-SUP-01/shared tickets, SUP-03's shared message contract and SUP-06's resolution contract; approved customer reply-state and visibility rules.

**Authorization and validation:** The criteria above are enforced by FastAPI for each operation, including direct requests that bypass the frontend. Apply the [role permission boundary](../aidlc-docs/inception/requirements/support-agent-role.md#permissions-and-data-boundary) and deny by default.

**Story points:** 5 — provisional, pending team estimation.

**Implementation status:** Not started — no support module or support UI found in the inspected source.

**Mockup:** TBD

---

### Estimation boundaries

| Story | Provisional points | Relative complexity |
|---|---:|---|
| SUP-01 | 5 | Queue/filter UI and atomic concurrent claim with resource authorization |
| SUP-02 | 3 | Validated create form and narrow lookup using shared ticket foundations |
| SUP-03 | 5 | Staff conversation UI and shared messaging behavior; Flutter UI counted under USR-SUP-02 |
| SUP-04 | 3 | Dedicated allowlisted metadata response and read-only authorization checks |
| SUP-05 | 3 | Escalation transition and Admin handoff; Admin implementation excluded |
| SUP-06 | 5 | History presentation and resolution eligibility/summary/visibility |
| Support Agent subtotal | 24 | Six role stories |
| USR-SUP-01 | 3 | Customer form and authenticated ticket creation |
| USR-SUP-02 | 5 | Flutter ticket list/detail/replies/resolution and isolation |
| Customer dependency subtotal | 8 | Owned outside the Support Agent role |
| Story total | 32 | Excludes separately estimated shared technical prerequisites |

The historical register uses Fibonacci: registration/session stories are 3, manual expense and correction are 5, natural-text capture is 8. Those supplied estimates are preserved, not treated as demonstrated team velocity. Retain the proposed support estimates provisionally: most operations reuse the planned ticket/auth foundations, while concurrency, history and cross-client messaging warrant 5 rather than basic CRUD estimates.

SUP-03 spans React, FastAPI and integration with Flutter. Its 5-point estimate assumes the Flutter implementation is counted once in USR-SUP-02; completion still requires the integrated customer exchange. Re-estimate if that ownership boundary changes. SUP-06 remains 5 because no support-history infrastructure was found; it reuses event capture delivered by earlier operations, not an assumed existing subsystem.

Staff portal scaffolding, staff session/RBAC foundations, shared ticket persistence/contracts and audit integration are shared technical prerequisites. Assign and estimate them once before implementation; the 32 points are not a complete project estimate. No numerical estimates are claimed to come from Trello, and no board changes are made.
