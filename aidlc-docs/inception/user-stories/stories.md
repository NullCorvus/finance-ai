# Finance AI Product Backlog and User Stories

## Story Model

- **Persona:** P-001 — Personal Budget User
- **Story style:** Vertical user outcomes spanning the necessary UI, API, database, and tests
- **Acceptance style:** Given/When/Then scenarios plus explicit financial or security invariants
- **Manual-first rule:** HU-001 through HU-014 form the manual MVP. HU-015 and HU-016 are deferred until the manual MVP is complete.
- **Technical work:** Enablers are tracked separately and are not counted as user stories.

## Product Backlog Domains

| PB | Domain | Manual MVP | Purpose |
|---|---|---|---|
| PB-001 | Identity and access | Yes | Registration, authentication, and secure sessions |
| PB-002 | Preferences | Yes | User defaults without changing historical records |
| PB-003 | Accounts and currencies | Yes | Places where money is held and their currencies |
| PB-004 | User catalogs | Yes | Categories, subcategories, payment methods, and income sources |
| PB-005 | Expenses and receipts | Yes | Manual spending records and optional detail |
| PB-006 | Income | Yes | Money entering an account |
| PB-007 | Transfers | Yes | Money moving between the user's accounts |
| PB-008 | Activity and filters | Yes | Unified financial history by period and account |
| PB-009 | Budgets | Yes | Weekly/monthly category spending targets |
| PB-010 | Dashboard | Yes | Balances, summaries, category totals, and budget progress |
| PB-011 | Optional AI assistance | No — deferred | Propose values for existing forms without direct writes |

## Technical Enablers — Not User Stories

| ID | Enabler | Completion outcome |
|---|---|---|
| EN-001 | Monorepo and quality baseline | Clearly separated backend, frontend, documentation, formatting, linting, review, and pinned toolchain conventions |
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

## HU-003 — Manage Personal Defaults

**PB:** PB-002  
**Persona:** P-001  
**Story:** As a user, I want to manage simple preferences so that new financial entries begin with sensible defaults.

### Acceptance Criteria

1. **View defaults** — Given I am authenticated, when I open preferences, then I see my current preferred currency and supported choices.
2. **Change preference** — Given I choose a supported currency, when I save, then future forms use that preference where applicable.
3. **Historical integrity** — Given I change the preference, then existing account and transaction amounts retain their original currencies and values.
4. **Ownership** — Given another user's identifier, when I attempt to alter their preferences, then access is denied.

**Dependencies:** HU-002.

---

## HU-004 — Manage Financial Accounts

**PB:** PB-003  
**Persona:** P-001  
**Story:** As a user, I want accounts for cash, banks, wallets, or savings products so that I know where my money is held.

### Acceptance Criteria

1. **Create account** — Given a unique account name, supported type/currency, and valid opening balance, when I save, then the account appears in my account list.
2. **View balance context** — Given an account has financial activity, when I open it, then I see its currency and balance derived consistently from the opening balance and movements.
3. **Edit account** — Given an owned account, when I change editable metadata, then its financial history remains unchanged.
4. **Archive account** — Given an account has history, when I archive it, then it cannot be selected for new entries but remains visible in historical records.
5. **Ownership isolation** — Given an account belongs to another user, when I attempt to view or mutate it, then access is denied.

**Dependencies:** HU-002, shared currency seed.

---

## HU-005 — Manage Categories and Subcategories

**PB:** PB-004  
**Persona:** P-001  
**Story:** As a user, I want customizable spending categories so that my expenses reflect how I understand my money.

### Acceptance Criteria

1. **Default catalog** — Given registration completes, when I first view categories, then I have editable common defaults owned by my account.
2. **Customize hierarchy** — Given I own a category, when I add, rename, or archive a subcategory, then only my catalog changes.
3. **Historical preservation** — Given a category/subcategory is referenced, when I archive it, then existing expenses retain their classification while new forms exclude the archived choice.
4. **No cross-user effect** — Given another user has a similarly named category, when I edit mine, then theirs is unchanged.

**Dependencies:** HU-001, HU-002.

---

## HU-006 — Manage Payment Methods and Income Sources

**PB:** PB-004  
**Persona:** P-001  
**Story:** As a user, I want editable payment methods and income sources so that entries use terms that match my finances.

### Acceptance Criteria

1. **Default lists** — Given registration completes, when I open supporting catalogs, then I see editable common payment methods and income sources.
2. **Customize** — Given I am authenticated, when I add or rename an entry, then it becomes available only in my forms.
3. **Archive safely** — Given an entry is referenced by history, when I archive it, then prior records keep their value and new forms omit it.
4. **Ownership** — Given a catalog entry belongs to another user, when I address it directly, then access is denied.

**Dependencies:** HU-001, HU-002.

---

## HU-007 — Record a Manual Expense

**PB:** PB-005  
**Persona:** P-001  
**Story:** As a user, I want to record an expense manually so that spending can always be tracked without AI or a receipt.

### Acceptance Criteria

1. **Create expense** — Given I select my active account and classification and provide a positive amount/date, when I save, then the expense is recorded in the account's currency and appears in history.
2. **Optional details** — Given merchant, payment method, and reason are omitted, when required fields are valid, then the expense can still be saved.
3. **Validation** — Given an invalid amount, date, archived account/catalog value, or another user's resource, when I submit, then nothing is saved and I see an appropriate error.
4. **Balance and analytics** — Given the expense saves, then the account balance and relevant spending/budget calculations reflect it once.
5. **Manual independence** — Given product AI is unavailable or not configured, then the manual expense flow remains fully usable.

**Dependencies:** HU-004, HU-005; HU-006 is optional when no payment method is selected.

---

## HU-008 — Add Optional Receipt and Item Detail

**PB:** PB-005  
**Persona:** P-001  
**Story:** As a user, I want optional receipt evidence and item detail so that important purchases can be recorded more precisely without burdening simple expenses.

### Acceptance Criteria

1. **Optional attachment** — Given an owned expense, when I attach a valid supported image, then it is linked as optional evidence.
2. **Item breakdown** — Given an owned expense, when I add, edit, or remove item rows, then the expense remains the purchase header and items remain optional detail.
3. **Total integrity** — Given item amounts do not equal the expense total because of tax, discounts, or rounding, then the recorded expense total remains authoritative and the difference is allowed.
4. **Failure rollback** — Given attachment or item persistence fails during a combined save, then the operation follows the documented atomic boundary and does not leave broken references.
5. **Ownership** — Given the expense belongs to another user, then I cannot attach, view, or mutate its receipt detail.

**Dependencies:** HU-007.

---

## HU-009 — Correct or Archive an Expense

**PB:** PB-005  
**Persona:** P-001  
**Story:** As a user, I want to correct or archive my expenses so that mistakes do not permanently damage my financial history.

### Acceptance Criteria

1. **Edit** — Given an owned expense, when I change valid business fields, then balances, category totals, and budget progress reflect the updated value exactly once.
2. **Archive** — Given an owned expense, when I archive it, then it is excluded from active financial calculations but remains available for historical traceability according to the approved retention behavior.
3. **Failure safety** — Given recalculation or persistence fails, when an update/archive is attempted, then the prior record and calculations remain intact.
4. **Ownership** — Given an expense belongs to another user, then view/mutation access is denied.

**Dependencies:** HU-007.

---

## HU-010 — Record and Manage Income

**PB:** PB-006  
**Persona:** P-001  
**Story:** As a user, I want to record income into an account so that balances and income-versus-expense summaries are complete.

### Acceptance Criteria

1. **Create income** — Given my active account, income source, positive amount, and date, when I save, then income appears in history using the account currency and increases its balance.
2. **Optional description** — Given no description, when all required fields are valid, then income can still be saved.
3. **Edit/archive** — Given an owned income entry, when I edit or archive it, then balances and summaries update exactly once.
4. **Invalid ownership** — Given an account/source/entry belongs to another user, when I use its identifier, then access is denied and no data changes.

**Dependencies:** HU-004, HU-006.

---

## HU-011 — Transfer Money Between Accounts

**PB:** PB-007  
**Persona:** P-001  
**Story:** As a user, I want to transfer money between my accounts so that withdrawals and internal movements do not look like income or spending.

### Acceptance Criteria

1. **Same-currency transfer** — Given two distinct owned active accounts with the same currency and a positive amount, when I confirm a transfer, then the source decreases and destination increases by that amount atomically.
2. **Cross-currency transfer** — Given owned accounts with different currencies, when I enter the actual source and destination amounts, then both original amounts are stored without requiring a live exchange-rate service.
3. **Analytics invariant** — Given a transfer completes, then total income and expense analytics are unchanged.
4. **Validation** — Given the same source/destination, non-positive amount, archived account, or another user's account, when I submit, then no movement is saved.
5. **Atomicity** — Given either side of the movement fails, then neither balance/history side is committed.

**Dependencies:** HU-004.

---

## HU-012 — Review and Filter Financial Activity

**PB:** PB-008  
**Persona:** P-001  
**Story:** As a user, I want one history of expenses, income, and transfers so that I can understand what happened to my money.

### Acceptance Criteria

1. **Unified history** — Given I have financial entries, when I open activity, then I see expenses, income, and transfers with visibly distinct types.
2. **Period filters** — Given weekly, monthly, or custom dates, when I apply a filter, then only entries within the inclusive approved boundary are shown.
3. **Account/type filters** — Given an owned account or movement type, when I filter, then the result is limited accordingly.
4. **Currency clarity** — Given results contain multiple currencies, then every amount shows its currency and incompatible totals are not combined.
5. **Ownership** — Given I am authenticated, then the history never includes another user's entries.

**Dependencies:** HU-007, HU-010, HU-011.

---

## HU-013 — Manage a Spending Budget

**PB:** PB-009  
**Persona:** P-001  
**Story:** As a user, I want a simple category or subcategory budget so that I can compare actual spending with a weekly or monthly target.

### Acceptance Criteria

1. **Create budget** — Given a positive amount, weekly/monthly period, and one owned active category or subcategory target, when I save, then the budget appears with calculated progress.
2. **Exactly one target** — Given both category and subcategory or neither is selected, when I submit, then the budget is rejected.
3. **Calculated progress** — Given qualifying active expenses change, then budget progress is recalculated from transactions rather than edited directly.
4. **Period boundary** — Given a weekly or monthly budget, then only expenses in the applicable period count.
5. **Currency clarity** — Given spending exists in incompatible currencies, then progress follows the approved account/currency rule and does not silently add unlike amounts.
6. **Ownership** — Given another user's budget or catalog target, then access is denied.

**Dependencies:** HU-005, HU-007.

---

## HU-014 — Review the Budget Dashboard

**PB:** PB-010  
**Persona:** P-001  
**Story:** As a user, I want a dashboard of balances and spending so that I can understand my current financial position.

### Acceptance Criteria

1. **Core summary** — Given I select a period, when the dashboard loads, then it shows account balances, income, expenses, recent activity, category/subcategory spending, and budget progress.
2. **Transfer neutrality** — Given transfers occurred, then they affect relevant account balances but not income-versus-expense totals.
3. **Currency separation** — Given accounts use different currencies, then totals are grouped by currency until an approved conversion capability exists.
4. **Deterministic analytics** — Given the same stored financial data and period, then the backend/database calculation returns the same result without AI.
5. **Empty/error states** — Given there is no data or the request fails, then the dashboard shows a useful empty/retry state rather than fabricated values.
6. **Ownership** — Given I am authenticated, then all dashboard calculations include only my data.

**Dependencies:** HU-012, HU-013.

---

## HU-015 — Prefill an Expense from a Receipt Photo — Deferred AI

**PB:** PB-011  
**Persona:** P-001  
**Story:** As a user, I want optional receipt-photo assistance so that I can start from proposed expense values instead of typing every field.

### Acceptance Criteria

1. **Proposal only** — Given I submit a supported receipt image, when parsing succeeds, then the assistant opens the existing expense form with proposed header, optional item, and classification values; nothing is saved yet.
2. **Review control** — Given a proposal, when I edit, confirm, retry, or discard it, then the normal manual form and validation rules control the result.
3. **Untrusted output** — Given the provider returns missing, invalid, or foreign-user identifiers, then those values are rejected or replaced with safe unresolved fields.
4. **Failure fallback** — Given the provider is unavailable or parsing fails, then I can continue with the manual expense form.
5. **Temporary media** — Given I discard or an unconfirmed proposal expires, then temporary media follows the approved cleanup policy.
6. **Backend boundary** — Given AI assistance is used, then provider secrets and calls remain in the backend.

**Dependencies:** Complete manual MVP, especially HU-007 and HU-008.

---

## HU-016 — Prefill a Financial Form from Audio or Natural-Language Text — Deferred AI

**PB:** PB-011  
**Persona:** P-001  
**Story:** As a user, I want optional audio/text assistance so that a description such as a purchase, payment, income, or ATM withdrawal can prefill the correct existing form.

### Acceptance Criteria

1. **Intent proposal** — Given supported audio or text, when parsing succeeds, then the assistant proposes an expense, income, or transfer form and does not save it.
2. **Transfer recognition** — Given I describe moving money between my own accounts, such as withdrawing from a bank account into cash, then the assistant proposes a transfer rather than an expense and asks for unresolved accounts/amounts.
3. **Ambiguity** — Given intent, account, amount, currency, or classification is uncertain, then the form visibly marks unresolved fields instead of inventing authoritative data.
4. **Normal validation** — Given I confirm a completed proposal, then the same ownership, validation, atomicity, and financial invariants as the manual form apply.
5. **Failure fallback** — Given the provider is unavailable or I decline assistance, then all manual forms remain fully usable.
6. **No direct action** — Given any AI response, then it cannot create or modify financial data without my explicit confirmation.

**Dependencies:** Complete manual MVP, especially HU-007, HU-010, and HU-011.

---

## Financial and Security Invariants

| ID | Invariant |
|---|---|
| INV-01 | Every financial resource and catalog entry is scoped to its authenticated owner unless explicitly defined as shared currency reference data. |
| INV-02 | A transfer changes account locations but never counts as income or expense. |
| INV-03 | Multi-record financial operations are atomic. |
| INV-04 | Original monetary amounts and currencies are preserved. Unlike currencies are not silently combined. |
| INV-05 | Budget progress is derived from qualifying expenses in the selected target and period. |
| INV-06 | Archived catalog/account entries remain valid for history but cannot be selected for new entries. |
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
| Preferences and FR-CUR-05 | HU-003 |
| FR-ACC and FR-CUR | HU-004, HU-011, HU-012, HU-014 |
| FR-CAT | HU-005, HU-006 |
| FR-EXP | HU-007, HU-008, HU-009 |
| FR-INC | HU-010 |
| FR-BUD | HU-013, HU-014 |
| FR-DATE | HU-012, HU-014 |
| FR-DASH | HU-014 |
| FR-AI | HU-015, HU-016 |
| UX requirements | HU-001, HU-002, HU-007, HU-010, HU-011, HU-014, HU-015, HU-016 |
| Security requirements | All stories; strongest direct coverage in HU-001, HU-002, and ownership scenarios throughout |

## INVEST Validation

| Story | Independent | Negotiable | Valuable | Estimable | Small | Testable | Notes |
|---|---|---|---|---|---|---|---|
| HU-001 | Yes | Yes | Yes | Yes | Yes | Yes | Registration vertical slice; setup remains in enablers |
| HU-002 | Yes | Yes | Yes | Yes | Yes | Yes | Depends on registered account but produces distinct session value |
| HU-003 | Yes | Yes | Yes | Yes | Yes | Yes | Narrow preference behavior |
| HU-004 | Yes | Yes | Yes | Yes | Yes | Yes | Account lifecycle bounded to create/edit/archive |
| HU-005 | Yes | Yes | Yes | Yes | Yes | Yes | Category hierarchy and safe archive |
| HU-006 | Yes | Yes | Yes | Yes | Yes | Yes | Small supporting-catalog slice |
| HU-007 | Yes | Yes | Yes | Yes | Yes | Yes | Minimal manual expense independent of receipt AI |
| HU-008 | Yes | Yes | Yes | Yes | Yes | Yes | Optional receipt/item enhancement after expense creation |
| HU-009 | Yes | Yes | Yes | Yes | Yes | Yes | Correction/archive lifecycle |
| HU-010 | Yes | Yes | Yes | Yes | Yes | Yes | Complete manual income slice |
| HU-011 | Yes | Yes | Yes | Yes | Yes | Yes | Transfer value and invariants are explicit |
| HU-012 | Yes | Yes | Yes | Yes | Yes | Yes | Unified read journey after movements exist |
| HU-013 | Yes | Yes | Yes | Yes | Yes | Yes | One-target, one-period budget model |
| HU-014 | Yes | Yes | Yes | Yes | Yes | Yes | Read-only summary with bounded outputs |
| HU-015 | Yes | Yes | Yes | Yes | Yes | Yes | Deferred adapter over existing expense form |
| HU-016 | Yes | Yes | Yes | Yes | Yes | Yes | Deferred adapter over existing financial forms |

## Story Count and Academic Requirement

- **Manual MVP stories:** 14
- **Deferred AI stories:** 2
- **Total genuine user stories:** 16
- **Technical enablers:** 6, tracked separately and not counted toward the user-story requirement

The backlog exceeds the required minimum of ten without splitting frontend and backend work into artificial user stories.
