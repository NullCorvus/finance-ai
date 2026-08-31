# Finance AI — Reconciled Product Requirements

## Intent Analysis

| Item | Decision |
|---|---|
| Request | Reconcile the repository documentation before any application code is created |
| Request type | Greenfield project requirements and documentation correction |
| Scope | System-wide documentation: product scope, data model, architecture, backlog, sprint sequence, mockups, stack, and quality rules |
| Complexity | High: the decisions affect authentication, financial data, accounts, transfers, budgets, currencies, UI flows, and the later AI integration |
| Product principle | Build a complete manual budgeting application first; add AI later as an optional assistant over the same forms and business rules |

## Product Definition

Finance AI is a personal budgeting application that works completely without artificial intelligence. Users manually manage the places where their money is held, record income and expenses, move money between accounts, organize transactions, establish simple budgets, and review their financial activity.

After the manual product is stable, optional AI-assisted input may be added. AI can interpret a receipt photo, audio description, or text and propose values for the existing manual forms. AI does not own a separate financial workflow, bypass validation, or save directly. The user always reviews the proposal and explicitly confirms it through the normal application flow.

## Delivery Sequence

1. **Technical foundation:** repository structure, local infrastructure, database migrations and seeds, API contract, quality checks, and UI foundation.
2. **Identity and preferences:** registration, login, logout, authenticated navigation, and user defaults.
3. **Manual financial foundation:** accounts, currencies, categories, subcategories, payment methods, and income sources.
4. **Manual money movement:** expense CRUD, income CRUD, transfers, transaction history, and date/period filters.
5. **Budgeting and visibility:** category/subcategory budgets and a basic dashboard.
6. **Optional AI assistance:** photo/audio/text parsing into the existing forms with review and confirmation.

Product AI must not be introduced into the production feature flow until stages 1–5 provide a usable manual MVP. A time-boxed technical experiment may validate an AI provider earlier, but it is not a user-facing dependency and must not change the delivery order.

## Functional Requirements

### Identity and Access

| ID | Requirement |
|---|---|
| FR-AUTH-01 | A new user can register with email, password, and password confirmation. |
| FR-AUTH-02 | Registration validates the email and password on the server, rejects duplicate normalized email addresses, stores only an adaptive password hash, creates the agreed default settings, shows success, and redirects to Login without automatically logging in. |
| FR-AUTH-03 | A registered user can log in, remain authenticated across app restarts for the configured session lifetime, and log out. |
| FR-AUTH-04 | Logout revokes or invalidates the renewable session credential; a short-lived access credential may remain valid only until its brief expiration. |
| FR-AUTH-05 | All financial endpoints require authentication and enforce user ownership at the server. |
| FR-AUTH-06 | There is no Admin role or admin feature in the manual MVP. Administration may be introduced later through a migration and separately approved stories. |

### Accounts and Currencies

| ID | Requirement |
|---|---|
| FR-ACC-01 | Each user can create and manage financial accounts representing places where money is held, such as cash, a bank account, a digital wallet, or a savings product. |
| FR-ACC-02 | An account has an owner, name, type, currency, opening balance, and active/archived status. |
| FR-ACC-03 | Every expense and income entry belongs to exactly one account owned by the authenticated user. |
| FR-ACC-04 | Users can transfer money between two of their accounts. A transfer is neither income nor expense and must not distort spending or earnings analytics. |
| FR-ACC-05 | A transfer is recorded atomically: both sides succeed or neither side is saved. |
| FR-CUR-01 | The application provides a shared catalog of supported currencies, initially including COP and USD. Users select currencies; they do not create arbitrary currency codes. |
| FR-CUR-02 | Each account uses one currency, and all original transaction amounts remain stored in their account currency. |
| FR-CUR-03 | A cross-currency transfer records both the amount leaving the source account and the amount entering the destination account. This preserves the actual exchange without requiring a live exchange-rate service. |
| FR-CUR-04 | Before conversion is implemented, dashboards show totals separately by currency and never add unlike currencies into a misleading combined value. |
| FR-CUR-05 | A preferred currency defaults to COP and can later guide default selections and converted displays; it does not rewrite original financial records. |

### User-Owned Catalogs

| ID | Requirement |
|---|---|
| FR-CAT-01 | Currencies are shared reference data. Categories, subcategories, payment methods, and income sources are user-owned and isolated by user. |
| FR-CAT-02 | On registration, common category, payment-method, and income-source templates are copied as editable defaults for the new user. |
| FR-CAT-03 | Users can add, edit, archive, and select their own catalog entries without affecting other users. |
| FR-CAT-04 | Catalog entries already referenced by financial records are archived rather than destructively removed when deletion would damage history. |

### Expenses, Income, and Receipts

| ID | Requirement |
|---|---|
| FR-EXP-01 | `Expense` represents the purchase or spending transaction, not an individual receipt line. |
| FR-EXP-02 | A manual expense can exist without a receipt image and without line items. |
| FR-EXP-03 | An expense records its owner, account, amount, date, merchant/description, category or subcategory, optional payment method, and optional reason/context. |
| FR-EXP-04 | An expense may contain zero or more optional `ExpenseItem` records for receipt detail. |
| FR-EXP-05 | A receipt is optional evidence/attachment associated with an expense; it is not a placeholder required for every manual entry. |
| FR-EXP-06 | Users can create, view, edit, and delete or archive only their own expenses. |
| FR-INC-01 | Users can create, view, edit, and delete or archive income entries associated with one of their accounts and income sources. |
| FR-INC-02 | Financial updates that affect multiple records use a database transaction and roll back completely on failure. |

### Budgets, Dates, and Dashboard

| ID | Requirement |
|---|---|
| FR-BUD-01 | Users can create a simple spending budget for either a category or a subcategory. |
| FR-BUD-02 | A budget has an amount and a weekly or monthly period. Budget progress is calculated from qualifying expenses, not stored as an independent truth. |
| FR-BUD-03 | A budget targets exactly one category level to prevent ambiguous or double-counted progress. |
| FR-DATE-01 | The manual core includes transaction date selection and weekly/monthly/custom period filters. |
| FR-DATE-02 | A dedicated calendar screen and recurring transactions are outside the initial manual MVP. |
| FR-DASH-01 | The dashboard provides recent transactions, expenses by category/subcategory, income versus expenses, account balances, and budget progress for a selected period. |
| FR-DASH-02 | Dashboard calculations are deterministic backend/database calculations; AI is not used for ordinary analytics. |

### Optional AI Assistance

| ID | Requirement |
|---|---|
| FR-AI-01 | Product AI is optional and is delivered only after the complete manual MVP. |
| FR-AI-02 | AI input adapters may accept photo, audio, or text and return proposed values matching the existing manual expense, income, or transfer form contract as appropriate. |
| FR-AI-03 | AI output is treated as untrusted input and passes the same validation and ownership rules as manually entered data. |
| FR-AI-04 | The user can review, edit, retry, or discard an AI proposal before saving. |
| FR-AI-05 | AI never writes financial data directly, and every AI-assisted action retains a fully manual alternative. |
| FR-AI-06 | AI provider credentials and calls remain in the backend; the mobile application never contains or calls a provider secret directly. |

## User Experience Requirements

| ID | Requirement |
|---|---|
| UX-01 | Before AI exists, the primary experience is recognizable as a budgeting application, with a dashboard or transaction history and clear Add Expense/Add Income actions. |
| UX-02 | Registration and Login receive explicit mockups covering validation, loading, error, success, password visibility, and navigation states. |
| UX-03 | Manual forms remain first-class after AI is introduced; the assistant pre-fills those same forms rather than replacing them with a separate source of truth. |
| UX-04 | The later assistant may be presented conversationally, but chat is not the required application shell for the manual MVP. |
| UX-05 | Error messages are understandable to users and do not reveal internal paths, queries, stack traces, tokens, or secrets. |

## Technical and Repository Requirements

| ID | Requirement |
|---|---|
| TR-01 | Use three clearly owned repositories: `finance-ai` for documentation/orchestration, `finance-ai-backend` for FastAPI/PostgreSQL/OpenAPI, and `finance-ai-frontend` for the shared Android/Windows Flutter client. |
| TR-02 | Use a modular monolith: Flutter client, FastAPI backend, and PostgreSQL database. Do not introduce microservices for the MVP. |
| TR-03 | SQLAlchemy models and Alembic migrations are the executable source of truth for database creation and evolution. `SCHEMA.md` is explanatory documentation; the current `schema.sql` becomes a reference snapshot or is retired to avoid dual authority. |
| TR-04 | Database reference/default data is created through repeatable seed logic separated from schema migrations where practical. |
| TR-05 | API behavior is defined in a versioned OpenAPI contract before frontend/backend integration. |
| TR-06 | `BACKLOG-AND-STORIES.md` owns PB/HU identifiers and story definitions. `SPRINT-PLAN.md` references those identifiers and owns sprint allocation and technical tasks. Trello reflects these documents but does not silently redefine them. |
| TR-07 | Repository baseline, local infrastructure, database migration/seed, API contract, and UI foundation are separate technical-enabler cards. HU-001 contains the registration vertical slice rather than absorbing all project setup. |
| TR-08 | Docker Compose includes service readiness/health behavior and supports a repeatable clean local setup. Product AI credentials are not required for the manual MVP environment. |

## Quality and Definition of Done

Every story, beginning with HU-001, is complete only when:

- Its acceptance criteria pass through the real application boundary appropriate to the story.
- Relevant automated unit, integration, API, and UI tests pass.
- Formatting and lint checks pass.
- API and product documentation affected by the story are reviewed and synchronized.
- Secrets and local environment files are not committed.
- The feature works from a documented clean local setup.
- Another team member reviews the change.

Testing is continuous; there is no separate final testing sprint used as a substitute for testing each story.

## Security Requirements

The security baseline is enabled proportionally because the application stores credentials and personal financial data.

| ID | Requirement |
|---|---|
| NFR-SEC-01 | Use adaptive password hashing, bounded input validation, normalized email handling, and database uniqueness enforcement. |
| NFR-SEC-02 | Never log passwords, tokens, secrets, receipt contents, or unnecessary personal/financial data. |
| NFR-SEC-03 | Deny access by default and enforce object ownership for accounts, transfers, expenses, income, budgets, catalogs, and attachments. |
| NFR-SEC-04 | Use short-lived access credentials plus a renewable credential that can be revoked on logout; store mobile credentials only in secure platform storage. |
| NFR-SEC-05 | Protect public authentication endpoints against repeated automated attempts using rate limits or progressive delay appropriate to the prototype. |
| NFR-SEC-06 | Keep secrets outside source control, pin dependency versions, use supported runtimes/images, and include dependency vulnerability checks in the project quality process. |
| NFR-SEC-07 | Use safe, generic error responses and roll back financial operations on failure. |
| NFR-SEC-08 | Production-only infrastructure controls such as managed encryption keys, centralized immutable logs, alert retention, load-balancer logging, cloud IAM, and multi-zone availability are deferred until a real deployment target exists. Their current status is N/A, not silently implemented. |

## Reliability Requirements

The full resiliency extension is disabled for this prototype. Lightweight reliability remains required:

- Database service health checks and repeatable startup.
- Atomic transfers and multi-record financial operations.
- Explicit error handling for database, file, and later external AI calls.
- Safe rollback and resource cleanup on failure.
- Documented backup/restore expectations before any hosted demonstration containing non-test data.
- Manual features continue to work when the later AI provider is unavailable.

## Property-Based Testing Requirements

Property-based testing uses partial enforcement for backend domain rules. Hypothesis is the selected Python framework unless the team approves an equivalent maintained framework during construction.

- Use example-based tests for user stories, CRUD scenarios, API contracts, and UI behavior.
- Use property-based tests for transfer/balance invariants, budget-period calculations, currency amount preservation, and later AI structured-data round trips.
- Domain-specific generators must respect valid ownership, positive amounts, supported currencies, and realistic dates.
- Failure output must preserve a reproducible seed and minimized counterexample.
- Property-based tests run in CI and complement rather than replace concrete regression tests.

## Explicitly Deferred or Out of Scope

- Product AI before the full manual MVP.
- Live exchange-rate service and automatic converted totals.
- Dedicated calendar screen and recurring transactions.
- Admin dashboard and user administration.
- Bank API synchronization or automatic transaction detection from financial institutions.
- Investment, debt, bill splitting, and payment/subscription processing.
- Production-grade high availability, cloud monitoring, and disaster-recovery infrastructure.
- Agent actions that modify financial data without the normal form and confirmation flow.

## Documentation Reconciliation Scope

After approval, the repair pass must synchronize at least:

- `docs/CONTEXT.md`
- `docs/ALCANCE.md`
- `docs/FEATURES.md`
- `docs/STACK.md`
- `docs/ARCHITECTURE.md`
- `docs/SCHEMA.md`
- `docs/schema.sql` status or replacement policy
- `docs/MOCKUPS.md` and the prototype direction
- `docs/BACKLOG-AND-STORIES.md`
- `docs/SPRINT-PLAN.md`
- `TASKS.md`

The repair pass must not create application code.

## Extension Compliance at Requirements Stage

### Security Baseline

- **Applicable and represented:** SECURITY-03, SECURITY-05, SECURITY-08, SECURITY-09, SECURITY-10, SECURITY-11, SECURITY-12, and SECURITY-15.
- **Deferred until deployment design:** SECURITY-01, SECURITY-02, SECURITY-06, SECURITY-07, SECURITY-14.
- **Not applicable to the native-app/API MVP unless a web build is deployed:** SECURITY-04.
- **Prototype interpretation documented:** SECURITY-13 applies to source-control and security-event integrity; a full immutable financial audit log remains deferred unless later required.
- **Blocking findings:** None at the requirements-document level. Implementation artifacts must be checked again when they exist.

### Property-Based Testing — Partial Mode

- **Required by partial mode and represented:** PBT-02, PBT-03, PBT-07, PBT-08, and PBT-09.
- **Advisory:** PBT-01, PBT-04, PBT-05, PBT-06, and PBT-10.
- **Blocking findings:** None at the requirements-document level. Applicable tests must be present during construction.
