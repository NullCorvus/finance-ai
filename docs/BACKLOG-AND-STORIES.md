# Product Backlog & User Stories — Finance AI Tracker

> **Story source:** supplied backlog and user-story register, 2026-09-13.
> The original register contains **15 user-story rows** under **11 product backlog items**;
> HU-007 is absent from that register. Original story wording, scope, acceptance criteria
> and point estimates are preserved.
> **Current status source:** Trello card completion, verified **2026-11-04**, including archived cards.
> PB-001–PB-011 and their 15 original stories are **Done** on the board.
> The Support Agent extension adds eight planned implementation stories under two new backlog
> items; its implementation statuses and provisional estimates are separate from the completed core.
> The approved Administrator/shared-security extension adds seven records under two further items;
> the approved Security Auditor extension adds four more records under PB-016;
> the complete register has 34 stories under 16 product backlog items.
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

**Tracking:** [Support Agent — ticket management MVP](https://trello.com/c/rCyuWwMB), created in Trello Backlog on 2026-11-04. Six role-story checklist items total 24 provisional points; the two customer dependencies are a separate checklist. The shared-prerequisite checklist was removed at the user's request. Card creation does not indicate implementation has started.

This section adds planned work to the preserved historical register above. The six SUP stories and the two customer dependencies below are the authoritative story definitions; the [role specification](../aidlc-docs/inception/requirements/support-agent-role.md) supplies policy, source evidence and pending decisions without duplicating them. This dated extension brought the register to 23 records: 15 historical HU records and eight support-related records; later approved extensions are appended separately. No historical HU is renumbered or re-estimated.

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

1. Allow the assigned agent to read and send messages only within an authorized assigned ticket and in approved reply-eligible states. While escalated, the originating active/authorized Support Agent has read-only access under ADM-05.
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
4. Make the escalated case available for authorized administrator claim under ADM-05, preventing conflicting ownership. Preserve the originating Support Agent reference/history for the approved return workflow.
5. Preserve previous messages and history for authorized principals; the originating active/authorized Support Agent retains read-only access while escalated. Escalation and return reasons are authorized-staff-only metadata; the backend excludes them from customer responses. ADM-05 defines the atomic return to that eligible agent with in_progress or to an unassigned open ticket otherwise.
6. Deny the support agent administrative actions such as account suspension/reactivation, refunds, subscription changes, role changes and system configuration changes.

**Priority:** High

**Dependencies:** SUP-01, ticket activity persistence, SEC-02 and ADM-05's approved administrator claim/return contract. Support-side escalation remains separate from administrator implementation.

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
2. Allow the assigned agent to resolve only a ticket eligible under the approved support transition policy. While escalated, the originating agent is read-only and administrative resolution/return is governed by ADM-05; general non-escalated Support eligibility remains outside that decision.
3. Require a nonblank resolution summary with documented backend length bounds; exact bounds remain pending.
4. Persist resolved status and resolution, and make them visible to the owning active customer through USR-SUP-02. Escalation/return reasons are internal workflow metadata excluded by the backend, including within activity payloads. Suspended customers cannot access support until reactivation.
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
5. Reflect staff replies and resolutions using ordinary request/refresh behavior; real-time chat and push notifications are excluded. Backend projections exclude internal escalation/return reasons. Suspended customers have no protected support access until reactivation; general reply eligibility outside the approved escalation rules remains separate Support policy.

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

## Administrator and shared security extension — 2026-11-07

The approved scope adds exactly five Administrator stories and two shared security stories. The five final execution corrections govern ticket return, internal metadata visibility, suspension of other administrators, staff activation logging and the master documentation PR target. The role and security specifications link to these canonical definitions; they do not create parallel story registers.

The Administrator/shared-security checkpoint contained 30 stories: 15 original HU records, six SUP records, two USR-SUP dependencies, five ADM records and two SEC records, under 15 product backlog items. That extension introduced no Auditor-interface story, super_admin role, internal-notes system or portal-based administrator provisioning. AUD-01–AUD-04 are documented separately below; the other exclusions remain.

### Planned product backlog additions

| Code | Feature | Priority | Status | Ownership |
|---|---|---|---|---|
| PB-014 | Administrator account and escalation management | High | Not started | ADM-01–ADM-05; Administrator role owner |
| PB-015 | Shared staff security | High | Not started | SEC-01–SEC-02; one shared-security owner, estimated once |

### ADM-01 — Search and View User Accounts

**Feature:** PB-014 — Administrator account and escalation management

**Actor:** Administrator

**Story:**
> As an Administrator, I want to search for customer and staff accounts and inspect their authorized account information, so that I can identify users and manage administrative issues.

**Implementation scope:** Provide exact account lookup and read-only metadata detail in the staff web portal. Login accounts are distinct from financial accounts; no financial-record inspection is included.

**Acceptance criteria:**

1. Search customer and staff login accounts using an exact email address or account ID.
2. Return only authorized metadata: ID, email, assigned role, account status and registration date when available in the underlying model.
3. Paginate or bound results to prevent unrestricted bulk disclosure; enforce the bound in the backend.
4. Label login accounts distinctly from financial accounts.
5. Never return private transactions, balances, receipts, passwords, password hashes, tokens or authentication credentials.
6. Require an active admin principal, an MFA-verified session and resource authorization for every search/detail request.
7. Reject unauthorized requests, validate lookup inputs and apply the shared safe-error/audit policy.

**Priority:** High

**Dependencies:** Existing identity/session models, shared staff portal and RBAC foundations, SEC-01 for MFA-verified administrative access. Apply SEC-02 to authorization failures.

**Authorization and validation:** Every operation requires an active admin principal, an MFA-verified session and backend resource checks. Validate IDs, exact-email inputs where applicable, bounded text/reasons and allowed role/status values; reject forged fields and unauthorized requests. See [Administrator requirements](../aidlc-docs/inception/requirements/administrator-role.md) and [shared security requirements](../aidlc-docs/inception/requirements/shared-security-requirements.md).

**Story points:** 3 — provisional Fibonacci estimate; not implementation hours.

**Implementation status:** Not started — the complete new story has not been verified as implemented. Reuse of existing identity/session primitives does not establish completion.

**Mockup:** TBD

---

### ADM-02 — Suspend and Reactivate User Accounts

**Feature:** PB-014 — Administrator account and escalation management

**Actor:** Administrator

**Story:**
> As an Administrator, I want to suspend and reactivate authorized accounts, so that I can restrict access when necessary and restore access when appropriate.

**Implementation scope:** Manage login-account access status without deleting financial or support data. Permit suspension of another administrator under the approved self/last-administrator protections; this is separate from staff role assignment.

**Acceptance criteria:**

1. Allow an authorized administrator with an MFA-verified administrative session to suspend eligible customer and staff login accounts, including another admin.
2. Require explicit confirmation and a nonblank suspension reason; validate the reason in the backend.
3. Prevent suspended accounts from authenticating or accessing any protected functionality, including customer support.
4. Immediately revoke or invalidate relevant existing sessions when suspension takes effect.
5. Allow an authorized administrator to reactivate a suspended account.
6. Never restore sessions issued before suspension on reactivation; the reactivated user must authenticate again and satisfy applicable MFA requirements.
7. Preserve existing financial and support data.
8. Reject attempts to suspend the acting administrator's own account or the last active administrator.
9. Keep self/last-active-administrator protections effective under concurrent operations, including competing suspension/deactivation requests.
10. Apply the last-active-administrator restriction to deactivation and every equivalent operation that could leave the system without an active administrator; alternate endpoints or the controlled backend procedure cannot bypass the invariant.
11. Persist suspension/reactivation security events with actor, target, UTC timestamp, outcome and sanitized context under SEC-02; critical state changes must not silently succeed without audit evidence.
12. Do not create or grant admin accounts through this functionality; initial/additional administrators remain restricted to the secure controlled backend-provisioning procedure.

**Priority:** High

**Dependencies:** ADM-01, shared account/session/RBAC foundations, SEC-01 and SEC-02.

**Authorization and validation:** Every operation requires an active admin principal, an MFA-verified session and backend resource checks. Validate IDs, exact-email inputs where applicable, bounded text/reasons and allowed role/status values; reject forged fields and unauthorized requests. See [Administrator requirements](../aidlc-docs/inception/requirements/administrator-role.md) and [shared security requirements](../aidlc-docs/inception/requirements/shared-security-requirements.md).

**Story points:** 5 — provisional Fibonacci estimate; not implementation hours.

**Implementation status:** Not started — the complete new story has not been verified as implemented. Reuse of existing identity/session primitives does not establish completion.

**Mockup:** TBD

---

### ADM-03 — Create Staff Accounts

**Feature:** PB-014 — Administrator account and escalation management

**Actor:** Administrator

**Story:**
> As an Administrator, I want to create staff accounts, so that authorized personnel can access customer support and security auditing functionality.

**Implementation scope:** Create and activate support_agent/security_auditor accounts through a bounded, expiring, single-use invitation or activation flow. Reuse existing password/session controls; no portal path creates administrators.

**Acceptance criteria:**

1. Allow an authorized, MFA-verified administrator to create a staff login account with a unique email address.
2. Allow only support_agent or security_auditor as its initial staff role.
3. Reject attempts to create an admin account through the ordinary portal or its API, including forged role fields.
4. Use an invitation or activation mechanism with expiration and single-use credentials.
5. Require the new staff member to establish their own password through activation; preserve the existing password-policy and adaptive-hashing controls.
6. Grant no staff privileges until activation completes successfully.
7. Never allow administrators to view or retrieve staff passwords.
8. Keep public registration restricted to ordinary user accounts; it cannot select a staff or privileged role.
9. Reject duplicate accounts, invalid input, expired activation credentials and replayed invitations; concurrent activation attempts cannot consume a single-use credential twice.
10. Record both staff.created and staff.activated through SEC-02 with server-derived available actor/target, UTC timestamp, outcome and sanitized context.
11. Exclude invitation/activation credentials, passwords and other secrets from audit events, regular account responses and diagnostics.

**Priority:** High

**Dependencies:** Existing identity/password/session models and RBAC, shared staff portal, SEC-01 and SEC-02. Initial/additional admin accounts are provisioned separately through the controlled backend procedure.

**Authorization and validation:** Every operation requires an active admin principal, an MFA-verified session and backend resource checks. Validate IDs, exact-email inputs where applicable, bounded text/reasons and allowed role/status values; reject forged fields and unauthorized requests. See [Administrator requirements](../aidlc-docs/inception/requirements/administrator-role.md) and [shared security requirements](../aidlc-docs/inception/requirements/shared-security-requirements.md).

**Story points:** 5 — provisional Fibonacci estimate; not implementation hours.

**Implementation status:** Not started — the complete new story has not been verified as implemented. Reuse of existing identity/session primitives does not establish completion.

**Mockup:** TBD

---

### ADM-04 — Manage Staff Roles and Permissions

**Feature:** PB-014 — Administrator account and escalation management

**Actor:** Administrator

**Story:**
> As an Administrator, I want to change authorized staff roles, so that staff members have the appropriate access permissions.

**Implementation scope:** Inspect and change fixed support_agent/security_auditor role assignments under the approved RBAC policy. This is not a custom permission editor, admin-grant/revoke interface or account deactivation operation.

**Acceptance criteria:**

1. Allow an authorized, MFA-verified administrator to inspect a staff account's existing primary role.
2. Permit only authorized transitions between support_agent and security_auditor through the ordinary portal/API.
3. Retain exactly one primary authorization role per account; do not create an empty/undefined role or convert staff into customers implicitly.
4. Require explicit confirmation before a role change.
5. Reject changes to the acting administrator's own role.
6. Do not grant or revoke admin through the ordinary portal/API; controlled backend provisioning is the separate approved path for initial/additional administrators.
7. Apply role changes immediately to subsequent backend authorization decisions, including requests made with existing sessions.
8. Revoke existing sessions or securely revalidate them against current authority after the change; stale client state cannot retain revoked access.
9. Reject invalid, forged or unauthorized role assignments server-side.
10. Record actor, target, previous role, new role, UTC timestamp and outcome in the role.changed security event; apply SEC-02's consistent failure handling.
11. Prevent Administrators and Support Agents from modifying or deleting the corresponding audit records.

**Priority:** High

**Dependencies:** ADM-03/shared staff identities, existing RBAC/session foundations, SEC-01 and SEC-02. Deactivation belongs to ADM-02.

**Authorization and validation:** Every operation requires an active admin principal, an MFA-verified session and backend resource checks. Validate IDs, exact-email inputs where applicable, bounded text/reasons and allowed role/status values; reject forged fields and unauthorized requests. See [Administrator requirements](../aidlc-docs/inception/requirements/administrator-role.md) and [shared security requirements](../aidlc-docs/inception/requirements/shared-security-requirements.md).

**Story points:** 3 — provisional Fibonacci estimate; not implementation hours.

**Implementation status:** Not started — the complete new story has not been verified as implemented. Reuse of existing identity/session primitives does not establish completion.

**Mockup:** TBD

---

### ADM-05 — Manage Escalated Support Tickets

**Feature:** PB-014 — Administrator account and escalation management

**Actor:** Administrator

**Story:**
> As an Administrator, I want to review and resolve support tickets escalated by Support Agents, so that issues requiring administrative privileges can be handled appropriately.

**Implementation scope:** Deliver administrator escalation claim, authorized customer response, resolution and deterministic return to Support. Reuse existing ticket messages/history; retain only workflow reasons and summaries, with no general-purpose notes or private-messaging feature.

**Acceptance criteria:**

1. Allow authorized, MFA-verified administrators to view escalated tickets.
2. Allow an authorized administrator to claim an escalated case while preventing conflicting simultaneous ownership; enforce resource authorization for subsequent mutations.
3. Expose the escalation reason, allowed customer metadata and relevant case history only within the authorized administrative case context; preserve the originating Support Agent identity for return.
4. Retain read-only case access for the originating Support Agent while the case is escalated, subject to the agent remaining active and authorized.
5. Permit only administrative operations defined by this approved backlog; no billing, financial-record changes, infrastructure settings or portal-based admin grants are included.
6. Allow an authorized administrator to send customer-visible responses through the existing ticket conversation when appropriate.
7. Do not introduce general-purpose internal notes or private messaging. Retain only escalation reason, return-to-support reason, resolution summary, existing ticket messages and activity history.
8. Require a resolution summary to resolve an escalated case, preserve history and expose the resolution to its owning active customer.
9. Require a return reason. If the original Support Agent is active and still has support_agent, atomically return assignment to that agent and status to in_progress.
10. Otherwise, atomically clear assignment and return the ticket to the unassigned support queue with status open. Status and assignment must never be partially updated; preserve ticket history and record the transition.
11. Treat escalation and return reasons as staff-only workflow metadata visible only to authorized staff. Resolution summaries are customer-visible. Enforce these projections in the backend, including direct customer API requests; hiding fields in Flutter/React is insufficient.
12. Record relevant status/assignment changes in ticket activity history and security-sensitive actions under SEC-02, without duplicating full conversations in security audit records.
13. Allow customers to view their final resolution in Flutter only while their accounts are active. Suspended customers cannot access protected support functionality until reactivation.
14. Never grant unrestricted access to private transactions, balances, receipts, passwords or credentials because a ticket was escalated.

**Priority:** High

**Dependencies:** SUP-03, SUP-05, SUP-06, USR-SUP-02, shared ticket persistence/contracts, SEC-01 and SEC-02. Reuse the Support metadata boundary.

**Authorization and validation:** Every operation requires an active admin principal, an MFA-verified session and backend resource checks. Validate IDs, exact-email inputs where applicable, bounded text/reasons and allowed role/status values; reject forged fields and unauthorized requests. See [Administrator requirements](../aidlc-docs/inception/requirements/administrator-role.md) and [shared security requirements](../aidlc-docs/inception/requirements/shared-security-requirements.md).

**Story points:** 5 — provisional Fibonacci estimate; not implementation hours.

**Implementation status:** Not started — the complete new story has not been verified as implemented. Reuse of existing identity/session primitives does not establish completion.

**Mockup:** TBD

---

### SEC-01 — Privileged Staff TOTP MFA

**Feature:** PB-015 — Shared staff security

**Actor:** Administrator and Security Auditor

**Story:**
> As an Administrator or Security Auditor, I want to authenticate with my password and an authenticator application, so that my privileged account remains protected even if my password is compromised.

**Implementation scope:** Implement shared password-plus-TOTP enrollment, authentication, recovery/replacement, replay protection and privileged staff session gating using the existing opaque, database-backed session architecture. This is one shared security story, not duplicated across ADM/AUD features.

**Acceptance criteria:**

1. Require every admin and security_auditor to complete password plus TOTP MFA before accessing their privileged functionality.
2. Support initial authenticator enrollment using a QR code within the authorized enrollment context.
3. Verify a valid TOTP code before activating enrollment.
4. Verify the password before requesting the second factor.
5. Do not issue a fully authorized privileged staff session until MFA succeeds; an incomplete/expired challenge conveys no privileged authority.
6. Reject invalid, expired and previously accepted OTPs for the same authenticator and time step.
7. Keep replay protection effective under concurrent requests.
8. Rate-limit failed MFA attempts using documented bounded behavior.
9. Protect TOTP secrets in backend storage; never expose them, verification codes, passwords or session credentials in logs or regular API responses.
10. Provide a secure recovery and authenticator-replacement procedure with identity verification for lost devices.
11. Revoke or invalidate relevant existing sessions after recovery and authenticator changes.
12. Prevent accounts assigned admin or security_auditor from using privileged access until MFA is completed, including previously issued sessions. Controlled admin provisioning and ADM-04 staff-role assignment cannot turn an existing session into an MFA-verified privileged session.
13. Require backend verification of the active account, current authorized role and MFA-verified session for every ADM/AUD operation, including report delivery. Suspension or role removal immediately denies access through existing sessions; frontend routing alone never grants authority.
14. Record enrollment, successful/failed verification, recovery and replacement under SEC-02.
15. Preserve the existing opaque session architecture and review the current login contract for web compatibility. Technical design must specify secret protection at rest, acceptable clock skew, short-lived challenges, privileged staff session lifetimes, recovery identity verification, safe invalidation and browser authentication integration.

**Priority:** High

**Dependencies:** Existing FastAPI password/session implementation, shared staff browser-authentication/RBAC foundation, SEC-02 event contract/persistence, and controlled backend admin provisioning. No additional administrator UI/provisioning story is created.

**Authorization and validation:** Apply the shared security specification's authentication, event-schema, secret-exclusion and backend access boundaries; do not trust frontend checks. See [Administrator requirements](../aidlc-docs/inception/requirements/administrator-role.md), [Auditor requirements](../aidlc-docs/inception/requirements/security-auditor-role.md) and [shared security requirements](../aidlc-docs/inception/requirements/shared-security-requirements.md).

**Story points:** 13 — provisional Fibonacci estimate; retained after Auditor extension because the same enrollment, challenge, replay, recovery and browser-session infrastructure is reused. Only role coverage and guard/test consumers expand; no second MFA lifecycle or subsystem. Reevaluate during design only if material extra complexity is demonstrated; not implementation hours.

**Implementation status:** Not started — the complete new story has not been verified as implemented. Reuse of existing identity/session primitives does not establish completion.

**Mockup:** TBD

---

### SEC-02 — Shared Security Audit Logging

**Feature:** PB-015 — Shared staff security

**Actor:** Security Auditor

**Story:**
> As a Security Auditor, I want FinanciAI to record authentication events, authorization failures and privileged actions, so that I can investigate suspicious activity and verify administrative operations.

**Implementation scope:** Provide shared security-event persistence and access/integrity controls in existing PostgreSQL, plus application event integration and safe failure handling. Ticket activity history is separate. Auditor viewing/filtering/investigation/reporting belongs to AUD-01–AUD-04, separate from this shared logging story.

**Acceptance criteria:**

1. Record successful and failed login attempts. For admin and security_auditor, auth.login_success means both password and MFA succeeded; a correct password alone is not a completed privileged login. Do not count auth.mfa_success as a second login.
2. Record logout and security-related session revocations.
3. Record successful and failed MFA verification.
4. Record MFA enrollment, recovery and authenticator replacement.
5. Record account suspension and reactivation.
6. Record both staff.created and staff.activated, and record privileged-role changes. Use the appropriate available actor, target, timestamp, outcome and sanitized context; never record activation tokens, passwords or other credentials.
7. Record support ticket escalation as a selected security-sensitive event.
8. Record authorization failures for protected resources.
9. Give each event a unique event ID, UTC timestamp, event type, outcome, actor when identifiable and applicable target identifier.
10. Include request/correlation identifiers and sanitized context where appropriate, using a documented schema and server-derived identity rather than trusting client-supplied actor fields.
11. Exclude passwords, authentication/activation tokens, MFA secrets/codes, financial balances/transaction amounts, receipt contents, sensitive request bodies and unnecessary personal data.
12. Persist events in PostgreSQL with explicit read/write restrictions and an append-only application audit interface.
13. Prevent Administrators, Support Agents and ordinary application roles from modifying or deleting existing audit records.
14. Permit an active, MFA-verified security_auditor to read all system security events through sanitized backend responses consistently across AUD lists, details, investigations, aggregates and reports. Admin/Support roles gain no audit-reader access implicitly; suspend/revoke-role changes take effect on existing sessions immediately.
15. Do not allow critical account/role changes to succeed silently without audit evidence. Their persistence and audit records must follow a consistent failure-handling strategy that is tested.
16. Handle authentication-event logging failures safely and observably, without bypassing authentication/authorization or causing an unnecessary system-wide outage.
17. Verify event generation, access controls, sensitive-data exclusion and logging-failure behavior with automated tests during implementation.
18. Preserve historical actor/target identifiers independently of mutable/deletable identity rows. Missing current accounts or correlation fields do not erase events or justify fabricated evidence.
19. Record audit.report_exported when the backend has generated the authorized PDF and prepared it for delivery. Persist acting Auditor ID, UTC timestamp, outcome, report ID, reporting period, sanitized filters and included-event count; exclude PDF contents, credentials and secret download URLs.
20. Do not expose/deliver a successful export without durable export-audit evidence. Fail closed with a safe actionable error if mandatory recording fails; specify retry/cleanup behavior and verify failure paths. The backend writes this event; Auditors cannot modify existing evidence.

**Priority:** High

**Dependencies:** FastAPI authentication/session/RBAC and PostgreSQL persistence, with shared identity/ticket event contracts and planned authorized Auditor access. Event capture does not wait for an Auditor frontend or AUD-01 implementation.

**Authorization and validation:** Apply the shared security specification's authentication, event-schema, secret-exclusion and backend access boundaries; do not trust frontend checks. See [Administrator requirements](../aidlc-docs/inception/requirements/administrator-role.md), [Auditor requirements](../aidlc-docs/inception/requirements/security-auditor-role.md) and [shared security requirements](../aidlc-docs/inception/requirements/shared-security-requirements.md).

**Story points:** 8 — provisional Fibonacci estimate; not implementation hours.

**Implementation status:** Not started — the complete new story has not been verified as implemented. Reuse of existing identity/session primitives does not establish completion.

**Mockup:** TBD

---

### Provisional estimates and counting boundaries

| Story | Provisional SP | Rationale |
|---|---:|---|
| ADM-01 | 3 | Exact lookup, bounded metadata UI/API and MFA/role/resource guards |
| ADM-02 | 5 | Session invalidation, persistent suspension semantics, concurrent last-admin protections and audit integration |
| ADM-03 | 5 | Expiring single-use activation, staff password establishment, race handling and activation audit |
| ADM-04 | 3 | Two-role transitions with immediate session/authority effects, validation and audit |
| ADM-05 | 5 | Reused case infrastructure with claim, resolution, atomic return/fallback and server-side visibility |
| Administrator subtotal | 21 | Five functional role stories |
| SEC-01 | 13 | Complete TOTP lifecycle, protected browser session integration, recovery/replacement and concurrent replay defenses |
| SEC-02 | 8 | Cross-module security events, protected persistence, sensitive-data exclusions and failure-consistency tests |
| Shared security subtotal | 21 | Two cross-cutting stories counted once |
| New-story total | 42 | Does not include separately estimated shared technical prerequisites |

The existing Fibonacci register has metadata/catalog work around 2–3 points, manual expense and correction at 5 and natural-text capture at 8. Preserve those historical estimates. ADM-01/04 are scoped extensions reusing shared security; suspension/activation/escalation add lifecycle and concurrency cases. SEC-01 is larger than the 8-point capture reference because it includes enrollment, recovery/replacement, browser-session integration and MFA enforcement across promotion/session paths. SEC-02 spans authentication, staff, account and ticket modules; it does not include Auditor UI or advanced analytics. These are provisional relative-complexity estimates, not time commitments or measured team velocity.

Reuse existing password/session infrastructure. Estimate staff portal scaffolding and controlled backend administrator provisioning once as shared technical prerequisites. Staff activation belongs to ADM-03; Admin/Auditor MFA/browser-session integration belongs to SEC-01; shared security audit infrastructure belongs to SEC-02. Do not charge those again to every ADM/SUP/Auditor story. SUP-05's 3 points still cover support-side escalation, not ADM-05's administrator return/resolution flow. SUP-06 and USR-SUP-02 retain their existing history/customer UI responsibilities; this patch does not re-estimate them.

All seven Administrator/shared-security stories remain Not started. Requirements approval and publication do not establish endpoints, tables, MFA, audit persistence or staff interfaces. No Trello changes are part of this task.

## Security Auditor extension — 2026-11-07

The final approved corrections define exactly four read-only Auditor stories. The active MFA-verified security_auditor may read all system security audit events through sanitized FastAPI projections, including lists, details, investigations, statistics and reports. Other roles gain no audit-reader access implicitly; no administrative mutation, ADM-01 permission or private financial access is granted.

The complete register contains 34 stories under 16 product backlog items. SEC-01/SEC-02 remain shared and counted once, with no separate MFA/logging subsystem. Limits below are proposed configurable MVP backend-policy defaults, distinct from audit retention. These requirements do not establish implemented APIs, tables, screens or PDF generation; Trello is not modified.

| Code | Feature | Priority | Status | Ownership |
|---|---|---|---|---|
| PB-016 | Security audit investigation and reporting | High | Not started | AUD-01–AUD-04; one Auditor role owner coordinated with shared security |

### AUD-01 — View and Filter Security Events

**Feature:** PB-016 — Security audit investigation and reporting

**Actor:** Security Auditor

**Story:**
> As a Security Auditor, I want to consult, search and filter recorded security events so that I can monitor authentication activity and privileged system operations.

**Implementation scope:** Provide sanitized read-only security event list/detail and combinable filters in the staff web portal using shared SEC-02 persistence.

**Acceptance criteria:**

1. Display a paginated list of all system security audit events authorized to the active MFA-verified security_auditor; the same sanitized scope applies to event details.
2. Display event ID, timestamp, type, actor identifier when known, affected resource/target when applicable and outcome. Explicitly represent unavailable fields without inventing identities.
3. Order the list newest first by timestamp and unique event ID as a stable tie-breaker; page traversal must not duplicate or skip tied events within its defined read boundary.
4. Combine date range, event type, outcome, actor/user identifier and affected-resource filters. Validate actor and target namespaces and bound pagination server-side.
5. Persist timestamps in UTC; display America/Bogota by default and label the time zone. Normalize date filters to inclusive start and exclusive end.
6. Use a proposed configurable MVP maximum query period of 90 days under backend policy. Reject invalid/reversed/over-limit periods with safe actionable messages; this query limit is separate from retention.
7. Authorize list/detail and direct resource-ID requests in FastAPI. Immediately deny suspended accounts or principals that lost security_auditor, including previously issued sessions; require SEC-01 MFA.
8. Exclude passwords/hashes, tokens, MFA/activation secrets/codes, financial data, receipts, sensitive bodies and disallowed context from all projections.
9. Provide empty-result and safe invalid/unavailable states. Do not substitute backend/query errors for a successful empty dataset.
10. Deny administrative mutations, ticket management and audit update/delete; apply shared access.denied recording without logging sensitive request contents.
11. Verify combined filters, date boundaries/time-zone labels, equal-timestamp pagination, empty/unknown fields, cross-role/direct-ID denials and sensitive-data exclusion during implementation.

**Priority:** High

**Dependencies:** SEC-01, SEC-02, existing staff-web/auth/RBAC/session foundations. Shared event persistence is not counted again.

**Authorization and validation:** Every operation requires an active security_auditor account and MFA-verified session; FastAPI rechecks current role and resource permission, including existing sessions and report delivery. Deny all other roles, suspended accounts, malformed/forged inputs and stale authority. Validate bounded IDs, dates, filter enums and pagination; safely encode output and parameterize queries. Return only allowlisted security metadata, never raw context or private financial/credential data. See [Auditor requirements](../aidlc-docs/inception/requirements/security-auditor-role.md) and [shared security contracts](../aidlc-docs/inception/requirements/shared-security-requirements.md).

**Story points:** 5 — provisional Fibonacci estimate; not implementation hours.

**Implementation status:** Not started — documentation approval is not implementation or acceptance evidence.

**Mockup:** TBD

---

### AUD-02 — Investigate Account and Administrator Activity

**Feature:** PB-016 — Security audit investigation and reporting

**Actor:** Security Auditor

**Story:**
> As a Security Auditor, I want to reconstruct the chronological sequence of security-related actions involving a specific account or administrator so that I can investigate suspicious activity.

**Implementation scope:** Reuse AUD-01 projections/filters for historical identifier investigation and event inspection, without account-management privileges or an investigation case system.

**Acceptance criteria:**

1. Accept a historical account identifier; the referenced account need not be active or exist in the current identity table.
2. Find events in which that identifier is the actor or the affected account target, with typed target/resource matching to avoid unrelated ID collisions.
3. Deduplicate each event by its unique event ID when both actor and target match.
4. Preserve actor/target identifiers independently of mutable/deletable account records under SEC-02; do not require a successful current-identity join to display recorded evidence.
5. Display events chronologically oldest first using timestamp then event ID; apply the same UTC/Bogota, start-inclusive/end-exclusive and configurable query-period policy as AUD-01.
6. Display event type, timestamp, outcome and allowlisted metadata, and allow authorized detailed event inspection.
7. Correlate recorded actor/target and request/correlation identifiers where available. Clearly label unavailable metadata and distinguish facts from any displayed explanation.
8. Never invent missing events, imply complete history beyond retained/available records or infer an action solely from a shared correlation identifier.
9. Require active Auditor/MFA checks for investigation and every detail request, including existing sessions; deny private financial records, administrative actions and audit mutation.
10. Do not grant ADM-01 account-directory/detail permission. No account-edit controls, AI threat classification, automatic attack detection or investigation case-management system.
11. Verify missing/inactive current accounts, actor-only/target-only/both matches, deduplication, missing correlation, stable ordering and denied access during implementation.

**Priority:** High

**Dependencies:** AUD-01, SEC-01 and SEC-02 historical actor/target/correlation contract.

**Authorization and validation:** Every operation requires an active security_auditor account and MFA-verified session; FastAPI rechecks current role and resource permission, including existing sessions and report delivery. Deny all other roles, suspended accounts, malformed/forged inputs and stale authority. Validate bounded IDs, dates, filter enums and pagination; safely encode output and parameterize queries. Return only allowlisted security metadata, never raw context or private financial/credential data. See [Auditor requirements](../aidlc-docs/inception/requirements/security-auditor-role.md) and [shared security contracts](../aidlc-docs/inception/requirements/shared-security-requirements.md).

**Story points:** 5 — provisional Fibonacci estimate; not implementation hours.

**Implementation status:** Not started — documentation approval is not implementation or acceptance evidence.

**Mockup:** TBD

---

### AUD-03 — View Security Activity Summary

**Feature:** PB-016 — Security audit investigation and reporting

**Actor:** Security Auditor

**Story:**
> As a Security Auditor, I want to view a summary of security activity so that I can identify patterns and prioritize manual investigations.

**Implementation scope:** Provide bounded deterministic security counts/charts and navigation to event evidence; reuse shared event persistence and filtered query contracts.

**Acceptance criteria:**

1. Select a reporting period using AUD-01 UTC normalization, labeled America/Bogota default, inclusive start/exclusive end and proposed configurable maximum 90-day query policy.
2. Calculate aggregate statistics in the backend across the complete authorized filtered dataset, never only the current pagination page.
3. Display successful logins (auth.login_success), failed logins (auth.login_failed), failed MFA attempts (auth.mfa_failed), denied access attempts (access.denied), successful account suspensions (account.suspended) and successful staff-role changes (role.changed). Document each event-type/outcome mapping.
4. For admin/security_auditor, count a successful login only after password and MFA complete. auth.mfa_success is a factor event, not another completed login. Separate failed-login and failed-factor metrics; they are not an additive count of distinct people or attacks.
5. Group event counts by type and date using the labeled reporting zone; date buckets and totals obey the selected period/filter scope.
6. Include event-distribution and activity-over-time charts with equivalent readable labels/counts; no unsupported interpretation is attached to a chart.
7. Navigate from a category/count to the matching AUD-01 filtered list, preserving period, type/outcome and applicable filter semantics. Newly arriving events may change a later live query; show the summary cutoff rather than claiming a frozen live dashboard.
8. Authorize aggregate queries in FastAPI with the same all-system sanitized Auditor scope, active-role and MFA checks; aggregates must not bypass role restrictions.
9. Handle zero-event periods accurately and distinguish a retrieval error or unavailable historical coverage from zero activity.
10. All views are read-only. Do not automatically mark accounts compromised, classify users as attackers, perform AI threat detection or introduce advanced predictive analytics.
11. Verify complete-dataset counts against known event fixtures, including pagination, MFA/login separation, outcome mappings, date boundaries, zero data and authorization.

**Priority:** High

**Dependencies:** AUD-01, SEC-01 and SEC-02; shared portal/chart presentation foundations. No duplicate logging implementation.

**Authorization and validation:** Every operation requires an active security_auditor account and MFA-verified session; FastAPI rechecks current role and resource permission, including existing sessions and report delivery. Deny all other roles, suspended accounts, malformed/forged inputs and stale authority. Validate bounded IDs, dates, filter enums and pagination; safely encode output and parameterize queries. Return only allowlisted security metadata, never raw context or private financial/credential data. See [Auditor requirements](../aidlc-docs/inception/requirements/security-auditor-role.md) and [shared security contracts](../aidlc-docs/inception/requirements/shared-security-requirements.md).

**Story points:** 5 — provisional Fibonacci estimate; not implementation hours.

**Implementation status:** Not started — documentation approval is not implementation or acceptance evidence.

**Mockup:** TBD

---

### AUD-04 — Generate and Export Security Audit Reports

**Feature:** PB-016 — Security audit investigation and reporting

**Actor:** Security Auditor

**Story:**
> As a Security Auditor, I want to generate and download structured PDF security reports so that I can document and communicate the results of an audit.

**Implementation scope:** Produce an authorized read-only PDF from a consistent security-event dataset, reusing AUD-01 filters and AUD-03 metrics; generation is future implementation, not part of this documentation task.

**Acceptance criteria:**

1. Allow only an active MFA-verified security_auditor to generate and receive a report. Recheck current backend authority at delivery; existing sessions cannot retain access after suspension or role removal.
2. Select a period and applicable AUD-01 filters; use UTC persistence, a labeled America/Bogota presentation default, inclusive start/exclusive end and the proposed configurable 90-day maximum query period.
3. Generate a downloadable structured PDF with cover/reporting period, executive summary, security statistics, event-distribution and timeline charts, chronological event table, deterministic factual observations and report metadata.
4. Derive summary text and observations through documented deterministic rules from recorded facts. Do not use AI conclusions, unsupported findings, attack labels or an investigation narrative editor.
5. Read statistics, charts and event-table rows from one consistent database snapshot. Record the dataset cutoff; do not mix separately refreshed queries.
6. Use timestamp and event ID for stable chronological table ordering. Include all matching events in that report snapshot within the permitted limit, not merely the visible browser page.
7. Use a proposed configurable MVP maximum of 2,000 event records per PDF. Above the configured limit reject export with an actionable request for narrower filters; never silently truncate or label a partial report complete.
8. Show report ID, actual reporting scope, applied sanitized filters, included-event count, generation timestamp and time zone. Statistics/charts/table must agree with that scope and count.
9. Handle a period with no matching events with an accurate zero-event report and explicit empty-data presentation; never invent chart values or findings.
10. Apply the same backend field allowlist to PDF content as lists/details/aggregates. Exclude credentials, private finances/receipts, disallowed raw context and secret URLs.
11. Record audit.report_exported through the shared backend SEC-02 writer after authorized generation and preparation for delivery, with acting Auditor ID, UTC timestamp, outcome, report ID, reporting period, sanitized filters and number of included events.
12. Do not log PDF contents, authentication credentials or secret download URLs; the Auditor does not gain audit-write/update/delete permission.
13. Persist required successful-export evidence before exposing/delivering the PDF. If logging fails, block delivery, return a safe actionable failure and do not present an unrecorded success; design retry/cleanup to avoid bypass or ambiguous duplicate-success records.
14. Keep the export event outside the report snapshot that produced it; do not change the report count by inserting its own export event. It may appear in later authorized reports.
15. Handle generation failures safely with no partial download or fabricated success; any temporary artifacts remain protected and are cleaned up under the technical design.
16. Verify readable PDF layout, multi-page table continuity, chart/text consistency, snapshot agreement, zero data, configured thresholds (2,000 allowed/2,001 rejected at the proposed default), sanitized content, current-role/MFA denials and export-audit failure paths.

**Priority:** High

**Dependencies:** AUD-01, AUD-03, SEC-01 and SEC-02 including audit.report_exported. Reuse shared MFA/audit/portal infrastructure; no new repository or external report service is selected.

**Authorization and validation:** Every operation requires an active security_auditor account and MFA-verified session; FastAPI rechecks current role and resource permission, including existing sessions and report delivery. Deny all other roles, suspended accounts, malformed/forged inputs and stale authority. Validate bounded IDs, dates, filter enums and pagination; safely encode output and parameterize queries. Return only allowlisted security metadata, never raw context or private financial/credential data. See [Auditor requirements](../aidlc-docs/inception/requirements/security-auditor-role.md) and [shared security contracts](../aidlc-docs/inception/requirements/shared-security-requirements.md).

**Story points:** 8 — provisional Fibonacci estimate; not implementation hours.

**Implementation status:** Not started — documentation approval is not implementation or acceptance evidence.

**Mockup:** TBD

---

### Auditor estimates and implementation ownership

| Story | Provisional SP | Rationale |
|---|---:|---|
| AUD-01 | 5 | Web list/detail/filter UI and bounded authorized backend query/pagination with privacy tests |
| AUD-02 | 5 | Historical actor/target matching, deduplication, correlation and detail across missing identity cases |
| AUD-03 | 5 | Backend complete-dataset metrics, date/outcome mappings, accessible charts and evidence navigation |
| AUD-04 | 8 | Reused queries/metrics plus PDF layout, consistent snapshot, bounded export and mandatory audit-failure safety |
| Auditor subtotal | 23 | Exactly four role stories |
| SEC-01 shared | 13 | Retained shared TOTP estimate; role coverage extends without another lifecycle/subsystem |
| SEC-02 shared | 8 | Existing logging infrastructure estimate retained; history/export schema integration belongs here once |

The Auditor subtotal adds 23 role points; do not add the 21 shared-security points or shared portal scaffolding again. Shared security remains 13+8 once for all consumers. Reevaluate SEC-01 only on demonstrated material design complexity, not simply another role using the same module. Existing HU, SUP, USR-SUP and ADM estimates remain unchanged. These are provisional relative estimates, not velocity or hours.

The role owner coordinates backend query/report contracts with the SEC owner and frontend staff portal owner. A minimal implementation-agent task specifies one existing AUD ID, acceptance criteria, approved dependencies/contracts, allowed repository/files and test/review evidence. Deliver shared MFA/audit foundations before affected acceptance checks; this is an implementation dependency, not a renewed functional question. No Trello card or code is created by this documentation task.
