# Finance AI Product Backlog and User Stories

## Story Model

- **Persona:** P-001 — Personal Budget User
- **Story style:** Vertical user outcomes spanning the necessary UI, API, database, and tests
- **Acceptance style:** Given/When/Then scenarios plus explicit financial or security invariants
- **Foundation-to-speed rule:** HU-001 through HU-012 establish deterministic identity, structure, operations, control, transaction history, and the basic dashboard. HU-013 through HU-015 then provide natural-text, audio, and receipt-photo AI speed in that order. HU-016 adds budgets and dashboard budget progress.
- **Technical work:** Enablers are tracked separately and are not counted as user stories.

## Product Backlog Domains

| PB | Domain | Foundation | Purpose |
|---|---|---|---|
| PB-001 | Identity and access | Yes | Registration, authentication, and secure sessions |
| PB-002 | Accounts and currencies | Yes | Places where money is held and their explicit currencies |
| PB-003 | User catalogs | Yes | Categories, stores, and income sources |
| PB-004 | Expenses and receipts | Yes | Fast manual spending records and optional detail |
| PB-005 | Income | Yes | Money entering an account |
| PB-006 | Transfers | Yes | Money moving between the user's accounts |
| PB-007 | Transaction history and filters | Yes | Searchable financial history by period, account, type, and category |
| PB-008 | Basic financial dashboard | Yes | Balances, recent movements, income, expenses, and category totals |
| PB-009 | AI natural-text and audio capture | After HU-001–HU-012 | Written and spoken proposals using one conversational capture capability |
| PB-010 | AI receipt-photo capture | After HU-013 | Receipt extraction with printed-total and item handling |
| PB-011 | Budgets | After AI speed layer | Flexible overall/category targets and dashboard progress |

## Technical Enablers — Not User Stories

| ID | Enabler | Completion outcome |
|---|---|---|
| EN-001 | Repository separation and quality baseline | Separate documentation, backend, and frontend repositories with formatting, linting, review, and pinned toolchain conventions |
| EN-002 | Local infrastructure | API and PostgreSQL start repeatably with service health checks and documented environment configuration |
| EN-003 | Database migration and seed baseline | Alembic creates the approved schema; repeatable seeds provide currencies and per-user default templates |
| EN-004 | API contract baseline | Versioned OpenAPI contract defines Register, Login, session renewal/logout, and current-user behavior before integration |
| EN-005 | Flutter application foundation | Theme, navigation shell, error/loading patterns, and authentication route structure are ready for vertical stories |
| EN-006 | Continuous quality baseline | Automated tests, formatting, linting, dependency checks, and clean-setup verification run consistently |

---

## HU-001 — Register an Account

**PB:** PB-001  
**Persona:** P-001  
**Story:** As a new user, I want to create an account so that I can begin managing my finances.

### Acceptance Criteria

1. **Successful registration** — Given a normalized, unused email and a valid password/confirmation, when I submit registration, then my account and default catalogs are created atomically, I see a success message, and I am redirected to Login without being logged in automatically.
2. **Duplicate email** — Given an existing email regardless of letter case or surrounding spaces, when I register with that email, then no second account is created and I see an understandable conflict message.
3. **Invalid input** — Given an invalid email, a password below the approved minimum, or mismatched confirmation, when I submit, then registration is blocked and the relevant field explains the problem.
4. **Safe submission** — Given a registration request is in progress, when I tap Register again, then duplicate submissions are prevented.
5. **Credential protection** — Given registration succeeds or fails, then the password is never stored or logged as plaintext and no internal error detail is shown.

**Dependencies:** EN-001 through EN-006.

---

## HU-002 — Log In, Restore a Session, and Log Out

**PB:** PB-001  
**Persona:** P-001  
**Story:** As a returning user, I want a secure session so that I can access my financial data without signing in on every app launch.

### Acceptance Criteria

1. **Successful login** — Given valid credentials, when I log in, then I enter the authenticated budget-app home.
2. **Invalid credentials** — Given an unknown email or incorrect password, when I log in, then I receive the same generic error and no account-existence detail is disclosed.
3. **Session restoration** — Given valid securely stored renewable credentials, when I reopen the app, then the session is renewed without exposing tokens to ordinary storage.
4. **Expired or revoked session** — Given renewal is invalid, expired, or revoked, when the app attempts restoration, then credentials are cleared and I return to Login.
5. **Logout** — Given I am logged in, when I log out, then the renewable credential is revoked, local credentials are cleared, and protected screens are no longer accessible.

**Dependencies:** HU-001.

---

## HU-003 — Manage Financial Accounts

**PB:** PB-002  
**Persona:** P-001  
**Story:** As a user, I want accounts for cash, banks, wallets, savings products, or credit cards so that I know where my money is held.

### Acceptance Criteria

1. **Create account** — Given a unique account name, supported type/currency, and valid opening balance, when I save, then the account appears in my account list.
2. **View balance context** — Given an account has financial activity, when I open it, then I see its currency and balance derived consistently from the opening balance and movements.
3. **Edit account** — Given an owned account, when I change editable metadata, then its financial history remains unchanged.
4. **Deactivate account** — Given an account has history, when I deactivate it, then it cannot receive new movements but remains visible in historical records. An unused account may instead be permanently deleted after confirmation.
5. **Ownership isolation** — Given an account belongs to another user, when I attempt to view or mutate it, then access is denied.
6. **Fast currency selection** — Given I create another account or transaction, then the form may suggest COP or my last-used supported currency, but the saved record always stores its explicit currency.

**Dependencies:** HU-002, shared currency seed.

---

## HU-004 — Manage Categories

**PB:** PB-003

**Persona:** P-001
**Story:** As a user, I want customizable spending categories so that my expenses reflect how I understand my money.

### Acceptance Criteria

1. **Default catalog** — Given registration completes, when I first view categories, then I have editable common defaults owned by my account.
2. **Customize** — Given I am authenticated, when I add or rename a category, then only my catalog changes and active names remain unique for me.
3. **Permanent deletion** — Given a category is referenced, when I confirm deletion, then it is permanently removed, existing expenses remain as Uncategorized, and dependent category budgets are removed atomically.
4. **No cross-user effect** — Given another user has a similarly named category, when I edit mine, then theirs is unchanged.

**Dependencies:** HU-001, HU-002.

---

## HU-005 — Manage Stores and Income Sources

**PB:** PB-003

**Persona:** P-001
**Story:** As a user, I want editable stores and income sources so entries use familiar names without modeling how an account was accessed.

### Acceptance Criteria

1. **Supporting lists** — Given I open supporting catalogs, then I can manage my optional stores and income sources.
2. **Customize** — Given I am authenticated, when I add or rename an entry, then it becomes available only in my forms.
3. **Delete** — Given an entry is referenced by history, when I confirm deletion, then the catalog value is permanently removed, prior transactions remain and display the missing value as Deleted, and new forms omit it.
4. **Ownership** — Given a catalog entry belongs to another user, when I address it directly, then access is denied.

**Dependencies:** HU-001, HU-002.

---

## HU-006 — Record a Fast Manual Expense

**PB:** PB-004

**Persona:** P-001
**Story:** As a user, I want to record an expense with only essential information so that manual capture remains fast without AI or a receipt.

### Acceptance Criteria

1. **Create purchase** — Given I select my active account and provide a positive amount and purchase name, when I save, then one receipt group, one expense row, and one negative account movement are recorded atomically in the account's currency.
2. **Minimal typing** — Given a simple purchase, then category may be Uncategorized, the date defaults to now, and optional store, note, quantity, unit price, and images stay collapsed.
3. **No duplicate typing** — Given the purchase contains one row, then the receipt name may initialize the editable expense-row name so I do not enter it twice.
4. **Validation** — Given an invalid amount, date, inactive account/catalog value, or another user's resource, when I submit, then nothing is saved and I see an appropriate error.
5. **Balance and analytics** — Given the expense saves, then the account balance and relevant spending calculations reflect it once.
6. **Manual independence** — Given product AI is unavailable or not configured, then the manual expense flow remains fully usable.

**Dependencies:** HU-003, HU-004; HU-005 is optional when no store is selected.

---

## HU-007 — Add Optional Receipt and Item Detail

**PB:** PB-004

**Persona:** P-001
**Story:** As a user, I want multiple expense rows and optional images in a receipt so important purchases can be recorded precisely without burdening simple purchases.

### Acceptance Criteria

1. **Optional images** — Given an owned receipt or expense row, when I attach a valid supported image, then its backend-managed image path is linked to that record.
2. **Item breakdown** — Given an owned receipt, when I add, edit, reorder, or remove expense rows, then at least one row remains and each keeps its own amount and optional category.
3. **Total integrity** — Given row amounts do not equal the printed receipt total because of tax, discounts, tips, or rounding, then the receipt total may be adjusted and the difference is allowed.
4. **Failure rollback** — Given image or row persistence fails during a combined save, then the operation rolls back without broken references or orphaned files.
5. **Ownership** — Given the receipt belongs to another user, then I cannot attach, view, or mutate its receipt or expense detail.

**Dependencies:** HU-006.

---

## HU-008 — View, Correct, or Delete an Expense

**PB:** PB-004

**Persona:** P-001
**Story:** As a user, I want to view, correct, and permanently delete my expenses so that my records remain accurate and under my control.

### Acceptance Criteria

1. **Edit** — Given an owned expense, when I change valid business fields, then balances, category totals, and budget progress reflect the updated value exactly once.
2. **Permanent delete** — Given an owned expense, when I confirm deletion, then the expense, its item details, and its owned receipt attachment are removed together and calculations update exactly once.
3. **Failure safety** — Given recalculation or persistence fails, when an update/delete is attempted, then the prior record and calculations remain intact.
4. **Ownership** — Given an expense belongs to another user, then view/mutation access is denied.

**Dependencies:** HU-006.

---

## HU-009 — Record and Manage Income

**PB:** PB-005

**Persona:** P-001
**Story:** As a user, I want to record income into an account so that balances and income-versus-expense summaries are complete.

### Acceptance Criteria

1. **Create income** — Given my active account, income source, positive amount, and date, when I save, then income appears in history using the account currency and increases its balance.
2. **Optional description** — Given no description, when all required fields are valid, then income can still be saved.
3. **Edit/delete** — Given an owned income entry, when I edit or confirm permanent deletion, then balances and summaries update exactly once.
4. **Invalid ownership** — Given an account/source/entry belongs to another user, when I use its identifier, then access is denied and no data changes.

**Dependencies:** HU-003, HU-005.

---

## HU-010 — Transfer Money Between Accounts

**PB:** PB-006

**Persona:** P-001
**Story:** As a user, I want to transfer money between my accounts so that withdrawals and internal movements do not look like income or spending.

### Acceptance Criteria

1. **Same-currency transfer** — Given two distinct owned active accounts with the same currency and a positive amount, when I confirm a transfer, then the source decreases and destination increases by that amount atomically.
2. **Cross-currency transfer** — Given owned accounts with different currencies, when I enter the actual source and destination amounts, then both original amounts are stored without requiring a live exchange-rate service.
3. **Analytics invariant** — Given a transfer completes, then total income and expense analytics are unchanged.
4. **Validation** — Given the same source/destination, non-positive amount, inactive account, or another user's account, when I submit, then no movement is saved.
5. **Atomicity** — Given either side of the movement fails, then neither balance/history side is committed.

**Dependencies:** HU-003.

---

## HU-011 — Search and Filter Transaction History

**PB:** PB-007

**Persona:** P-001
**Story:** As a user, I want one searchable history of expenses, income, and transfers so that I can find and inspect any financial operation quickly.

### Acceptance Criteria

1. **Unified history** — Given I have financial entries, when I open activity, then I see expenses, income, and transfers with visibly distinct types.
2. **Period filters** — Given weekly, monthly, or custom dates, when I apply a filter, then only entries within the inclusive approved boundary are shown.
3. **Account/type filters** — Given an owned account or movement type, when I filter, then the result is limited accordingly.
4. **Text/category search** — Given a purchase name, store, description, expense-row name, or category, when I search or filter, then matching entries are returned case-insensitively with newest first.
5. **Currency clarity** — Given results contain multiple currencies, then every amount shows its currency and incompatible totals are not combined.
6. **Ownership** — Given I am authenticated, then the history never includes another user's entries.

**Dependencies:** HU-006, HU-009, HU-010.

---

## HU-012 — Review the Basic Financial Dashboard

**PB:** PB-008

**Persona:** P-001
**Story:** As a user, I want a basic dashboard of balances and movements so that I understand my financial position before and after every capture.

### Acceptance Criteria

1. **Core summary** — Given I select Today, This week, This month, or a custom period, then I see account balances, income, expenses, recent movements, and category spending.
2. **Category view** — Given expenses exist, then I see category totals ordered from largest to smallest.
3. **Transfer neutrality** — Given transfers occurred, then they affect relevant account balances but not income-versus-expense totals.
4. **Currency separation** — Given accounts use different currencies, then totals are grouped by currency until an approved conversion capability exists.
5. **Deterministic analytics** — Given the same stored data and period, then the backend/database returns the same result without AI.
6. **Empty/error and ownership** — Given no data, failure, or another user's data, then I see an honest empty/retry state and never see fabricated or foreign results.

**Dependencies:** HU-011.

---

## HU-013 — Natural-Text Financial Capture

**PB:** PB-009

**Persona:** P-001
**Story:** As a user, I want to write what happened in my own words so that the assistant identifies the financial operation and prepares it for quick review.

### Acceptance Criteria

1. **Natural input** — Given I write naturally, such as “I spent 15,000 on lunch” or “move 100,000 from bank to cash,” then the assistant proposes the correct expense, income, or transfer without saving.
2. **Fast proposal** — Given the proposal is complete and high confidence, then I see “This is what I understood” and can accept it with one tap.
3. **Focused clarification** — Given intent, account, amount, currency, or classification is uncertain, then only unresolved values are highlighted or clarified and my original text remains available.
4. **Transfer recognition** — Given I describe moving money between my accounts, then it is proposed as a transfer rather than income or expense.
5. **Normal save** — Given I accept, then the corresponding normal validated atomic operation runs; Edit, Retry, Discard, and manual fallback remain available.
6. **No direct action** — Given any AI response, then it cannot create or modify financial data without my explicit confirmation.

**Dependencies:** Stable HU-001–HU-012 deterministic foundation.

---

## HU-014 — Audio Financial Capture

**PB:** PB-009

**Persona:** P-001
**Story:** As a user, I want to describe a financial operation by voice so that the assistant prepares it while I avoid typing.

### Acceptance Criteria

1. **Recording experience** — Given microphone permission, when I hold/tap record, then I see a clear recording indicator and recording stops automatically at 60 seconds.
2. **Supported input** — Given an approved M4A or WAV recording, when I submit it, then temporary backend processing produces an expense, income, or transfer proposal without saving financial data.
3. **Fast proposal** — Given the proposal is complete and high confidence, then I see “This is what I understood” and can accept it with one tap; only uncertain values add a short clarification.
4. **Permission and failure recovery** — Given permission is denied, audio is unintelligible/partial, or processing times out, then I receive a clear next action: open settings, retry, edit the partial proposal, type instead, or use the manual form.
5. **Normal save and cleanup** — Given I accept, then the corresponding normal validated atomic operation runs; discard, failure, or expiry removes temporary audio.
6. **No repetition** — Given I edit the proposal, then the recording/transcript context is preserved and I do not have to record the whole operation again.

**Dependencies:** Stable HU-001–HU-012 deterministic foundation.

---

## HU-015 — Rapid Expense Proposal from a Receipt Photo

**PB:** PB-010

**Persona:** P-001
**Story:** As a user, I want a receipt photo to produce a proposed expense so that I can verify it at a glance and accept it instead of typing every value.

### Acceptance Criteria

1. **Supported input** — Given a JPEG, PNG, or HEIC receipt up to 10 MB, when I capture or select it, then the backend may resize/compress it and begins temporary analysis without saving financial data.
2. **Fast proposal** — Given parsing succeeds with high confidence, then I see “This is what I understood” with purchase name, optional store, date, printed total, currency, classification, and extracted expense rows, ready for one-tap acceptance.
3. **Printed-total integrity** — Given taxes, discounts, tips, or rounding make items differ from the printed total, then the printed receipt total remains the proposed expense total until I edit it.
4. **Partial/unreadable states** — Given extraction is partial, unreadable, times out, or fails, then only missing fields are highlighted and I can Edit, Retry, Discard, or continue manually; nothing is saved.
5. **Normal save and cleanup** — Given I accept, then the normal expense validation/save path runs atomically; discard, failure, or expiry removes temporary media.
6. **Backend boundary** — Given AI assistance is used, then provider secrets and calls remain in the backend.

**Dependencies:** Stable HU-001–HU-012 deterministic foundation.

---

## HU-016 — Manage a Spending Budget

**PB:** PB-011

**Persona:** P-001
**Story:** As a user, I want a flexible overall or category budget so that I can compare actual spending with a recurring or one-time target.

### Acceptance Criteria

1. **Create budget** — Given a positive amount, start date, optional category, and valid recurring or one-time schedule, when I save, then the budget appears with calculated progress.
2. **Flexible schedule** — Given recurring is selected, then a positive interval plus day/week/month/year supports patterns such as every 2 weeks or every 3 months; one-time budgets use a custom date range without frequency fields.
3. **Calculated progress** — Given qualifying expenses change, then budget progress is recalculated from transactions rather than edited directly and appears on the existing dashboard.
4. **Period boundary** — Given a budget occurrence or one-time range, then only qualifying expenses inside that inclusive period count.
5. **Currency clarity** — Given spending exists in incompatible currencies, then progress does not silently add unlike amounts.
6. **Ownership** — Given another user's budget or catalog target, then access is denied.

**Dependencies:** HU-004, HU-006, HU-012.

---

## Financial and Security Invariants

| ID | Invariant |
|---|---|
| INV-01 | Every financial resource and catalog entry is scoped to its authenticated owner unless explicitly defined as shared currency reference data. |
| INV-02 | A transfer changes account locations but never counts as income or expense. |
| INV-03 | Multi-record financial operations are atomic. |
| INV-04 | Original monetary amounts and currencies are preserved. Unlike currencies are not silently combined. |
| INV-05 | Budget progress is derived from qualifying expenses in the selected target and period. |
| INV-06 | Deleted catalog entries are removed permanently; financial records survive with Uncategorized or Deleted placeholders, while inactive accounts remain valid for history. |
| INV-07 | AI output is untrusted proposal data and cannot bypass manual validation or confirmation. |
| INV-08 | Passwords, tokens, secrets, and unnecessary personal financial details never appear in logs. |

## Persona-to-Story Mapping

| Persona | Stories |
|---|---|
| P-001 — Personal Budget User | HU-001 through HU-016 |

## Requirements Traceability

| Requirement group | Stories |
|---|---|
| FR-AUTH | HU-001, HU-002 |
| FR-ACC and FR-CUR | HU-003, HU-010, HU-011, HU-012 |
| FR-CAT | HU-004, HU-005 |
| FR-EXP | HU-006, HU-007, HU-008 |
| FR-INC | HU-009 |
| FR-BUD | HU-016 |
| FR-DATE | HU-011, HU-012, HU-016 |
| FR-DASH | HU-012, HU-016 |
| FR-AI | HU-013, HU-014, HU-015 |
| UX requirements | HU-001, HU-002, HU-006, HU-009, HU-010, HU-011, HU-012, HU-013, HU-014, HU-015 |
| Security requirements | All stories; strongest direct coverage in HU-001, HU-002, and ownership scenarios throughout |

## INVEST Validation

| Story | Independent | Negotiable | Valuable | Estimable | Small | Testable | Notes |
|---|---|---|---|---|---|---|---|
| HU-001 | Yes | Yes | Yes | Yes | Yes | Yes | Registration vertical slice; setup remains in enablers |
| HU-002 | Yes | Yes | Yes | Yes | Yes | Yes | Depends on registered account but produces distinct session value |
| HU-003 | Yes | Yes | Yes | Yes | Yes | Yes | Account lifecycle and explicit currency |
| HU-004 | Yes | Yes | Yes | Yes | Yes | Yes | Category hierarchy and confirmed permanent deletion |
| HU-005 | Yes | Yes | Yes | Yes | Yes | Yes | Small supporting-catalog slice |
| HU-006 | Yes | Yes | Yes | Yes | Yes | Yes | Minimal fast manual expense independent of AI |
| HU-007 | Yes | Yes | Yes | Yes | Yes | Yes | Optional receipt/item enhancement after expense creation |
| HU-008 | Yes | Yes | Yes | Yes | Yes | Yes | View, correction, and permanent-delete lifecycle |
| HU-009 | Yes | Yes | Yes | Yes | Yes | Yes | Complete manual income slice |
| HU-010 | Yes | Yes | Yes | Yes | Yes | Yes | Transfer value and invariants are explicit |
| HU-011 | Yes | Yes | Yes | Yes | Yes | Yes | Searchable read journey after movements exist |
| HU-012 | Yes | Yes | Yes | Yes | Yes | Yes | Deterministic basic dashboard before AI |
| HU-013 | Yes | Yes | Yes | Yes | Yes | Yes | Natural-text proposal establishes the shared assistant flow |
| HU-014 | Yes | Yes | Yes | Yes | Yes | Yes | Explicit audio capture, permission, cleanup, and proposal flow |
| HU-015 | Yes | Yes | Yes | Yes | Yes | Yes | Receipt-photo proposal with partial/failure states |
| HU-016 | Yes | Yes | Yes | Yes | Yes | Yes | One-target, one-period budget model |

## Story Count and Academic Requirement

- **Deterministic foundation stories:** 12
- **AI speed-layer stories:** 3
- **Budget stories:** 1
- **Total genuine user stories:** 16
- **Technical enablers:** 6, tracked separately and not counted toward the user-story requirement

The backlog exceeds the required minimum of ten without splitting frontend and backend work into artificial user stories.
