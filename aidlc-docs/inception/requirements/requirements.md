# Finance AI — Reconciled Product Requirements

## Intent Analysis

| Item | Decision |
|---|---|
| Request | Maintain one concise, consistent product and implementation reference across three repositories |
| Request type | Brownfield product requirements and documentation maintenance |
| Scope | System-wide documentation: product scope, data model, architecture, backlog, sprint sequence, mockups, stack, and quality rules |
| Complexity | High: the decisions affect authentication, financial data, accounts, transfers, budgets, currencies, UI flows, and the later AI integration |
| Product principle | Use stable manual transaction contracts as the safety foundation, then make multimodal AI the fastest way to capture financial activity |

## Product Definition

Finance AI is a personal budgeting application optimized for capture speed. Users manage accounts, record income and expenses, move money between accounts, organize transactions, establish budgets, and review their financial activity.

Manual forms provide complete fallback behavior and stable transaction contracts. Identity, accounts, catalogs, manual expense/income/transfer operations, correction/deletion, searchable transaction history, and a basic dashboard must work reliably before AI is integrated. AI then begins with natural-language text and audio descriptions, followed by receipt-photo interpretation. It identifies the intended transaction and proposes values for the same forms. A high-confidence proposal requires only a quick glance and one-tap acceptance; only missing or uncertain information adds clarification. AI never owns a separate write path, bypasses validation, or saves directly.

## Delivery Sequence

1. **Technical foundation:** repository structure, local infrastructure, database migrations and seeds, API contract, quality checks, and UI foundation.
2. **Identity and sessions:** registration, login, logout, session restoration, and authenticated navigation.
3. **Manual financial foundation:** accounts, currencies, categories, stores, and income sources.
4. **Manual money movement:** expense CRUD, income CRUD, transfers, transaction history, and date/period filters.
5. **Deterministic control and visibility:** correction/deletion, transaction history, and the basic financial dashboard complete the foundation.
6. **AI speed layer:** natural text first establishes the shared proposal/review flow, audio reuses it second, and receipt photo extends it third with image and item extraction.
7. **Budgeting:** flexible overall/category budgets and budget progress added to the dashboard.

Product AI begins after HU-001–HU-012 form a stable deterministic foundation. It does not need to wait for budgets in HU-016.

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
| FR-ACC-02 | An account has an owner, name, type, currency, opening balance, and active/inactive status. |
| FR-ACC-03 | Every expense and income entry belongs to exactly one account owned by the authenticated user. |
| FR-ACC-04 | Users can transfer money between two of their accounts. A transfer is neither income nor expense and must not distort spending or earnings analytics. |
| FR-ACC-05 | A transfer is recorded atomically: both sides succeed or neither side is saved. |
| FR-CUR-01 | The application provides a shared catalog of supported currencies, initially including COP and USD. Users select currencies; they do not create arbitrary currency codes. |
| FR-CUR-02 | Each account uses one currency, and all original transaction amounts remain stored in their account currency. |
| FR-CUR-03 | A cross-currency transfer records both the amount leaving the source account and the amount entering the destination account. This preserves the actual exchange without requiring a live exchange-rate service. |
| FR-CUR-04 | Before conversion is implemented, dashboards show totals separately by currency and never add unlike currencies into a misleading combined value. |
| FR-CUR-05 | Account and transaction forms may suggest COP or the user's last-used supported currency for speed; every saved account and transaction retains its explicit currency. |

### User-Owned Catalogs

| ID | Requirement |
|---|---|
| FR-CAT-01 | Currencies are shared reference data. Categories, stores, and income sources are user-owned and isolated by user. |
| FR-CAT-02 | Small category and income-source defaults may be copied for a new user when the corresponding story approves them. |
| FR-CAT-03 | Users can add, edit, permanently delete, and select their own catalog entries without affecting other users. |
| FR-CAT-04 | Deleting a category requires confirmation, keeps existing expenses, changes their removed classification to Uncategorized, and deletes dependent budgets atomically. |
| FR-CAT-05 | Deleting an optional store or income source keeps existing transactions and displays the removed reference as Deleted. |

### Expenses, Income, and Receipts

| ID | Requirement |
|---|---|
| FR-EXP-01 | `Receipt` is a simple purchase group connected to one expense-type financial transaction. |
| FR-EXP-02 | Every purchase receipt contains one or more `Expense` rows; a lone purchase has exactly one row. |
| FR-EXP-03 | A receipt records a name, currency, date, total, and optional store, category, note, and image path. Its account effect is represented by `account_movement`. |
| FR-EXP-04 | Each expense row records its own name, category, position, quantity, amount, optional unit price, note, and image path. There is no product reference. |
| FR-EXP-05 | Receipt and expense images are optional; the MVP stores backend-managed paths rather than image binaries in PostgreSQL or a generalized attachment model. |
| FR-EXP-06 | Users can create, view, edit, and permanently delete only their own purchases. Deleting one removes its receipt, expense rows, images, and movements atomically. |
| FR-INC-01 | Users can create, view, edit, and permanently delete income transactions associated with one account movement and an optional direct income-source reference. |
| FR-INC-02 | Financial updates that affect multiple records use a database transaction and roll back completely on failure. |

### Budgets, Dates, and Dashboard

| ID | Requirement |
|---|---|
| FR-BUD-01 | Users can create an overall budget or a budget for one category. |
| FR-BUD-02 | A budget has an amount, start date, optional end date, and either a recurring interval (day/week/month/year) or a one-time/custom schedule. Progress is calculated rather than stored as an independent truth. |
| FR-BUD-03 | A nullable category target means an overall budget; a non-null owned category means a category budget. |
| FR-DATE-01 | The manual core includes transaction date selection and weekly/monthly/custom period filters. |
| FR-DATE-02 | A dedicated calendar screen and recurring transactions are outside the initial manual MVP. |
| FR-DASH-01 | Before AI integration, the basic dashboard provides recent transactions, expenses by category, income versus expenses, and account balances for a selected period. |
| FR-DASH-02 | Dashboard calculations are deterministic backend/database calculations; AI is not used for ordinary analytics. |
| FR-DASH-03 | When budgets are implemented, budget progress is added to the existing dashboard without changing its foundational calculations. |

### Multimodal AI Speed Layer

| ID | Requirement |
|---|---|
| FR-AI-01 | AI is the primary capture-speed layer and is introduced after the HU-001–HU-012 deterministic foundation is stable. |
| FR-AI-02 | AI input adapters accept supported photo, audio, or text, infer whether the user intends an expense, income, or transfer, and return proposed values matching the corresponding existing form. |
| FR-AI-03 | AI output is treated as untrusted input and passes the same validation and ownership rules as manually entered data. |
| FR-AI-04 | The user sees a compact “This is what I understood” proposal and can accept it with one tap or edit, retry, or discard it before saving. |
| FR-AI-05 | AI never writes financial data directly, and every AI-assisted action retains a fully manual alternative. |
| FR-AI-06 | AI provider credentials and calls remain in the backend; the mobile application never contains or calls a provider secret directly. |
| FR-AI-07 | High-confidence proposals do not force redundant form traversal; only missing or low-confidence values are highlighted or clarified. |
| FR-AI-08 | Photo, voice, and text use the same review model and preserve the original capture while the user corrects the proposal. |
| FR-AI-09 | Audio capture provides a visible recording state, stops at 60 seconds, accepts the approved temporary formats such as M4A/WAV, handles microphone permission denial, and removes unconfirmed audio after discard, failure, or expiry. |
| FR-AI-10 | Receipt-photo capture accepts the approved JPEG/PNG/HEIC inputs up to 10 MB, distinguishes complete, partial, unreadable, and failed extraction, and removes unconfirmed media after discard, failure, or expiry. |
| FR-AI-11 | Delivery order is natural text first, audio second, and receipt photo third so the shared proposal contract is proven before adding temporary-media complexity. |

## User Experience Requirements

| ID | Requirement |
|---|---|
| UX-01 | The application is recognizable as a budgeting product and makes photo, voice, and text capture immediately discoverable alongside manual Add Expense/Add Income/Transfer actions. |
| UX-02 | Registration and Login receive explicit mockups covering validation, loading, error, success, password visibility, and navigation states. |
| UX-03 | Manual forms remain complete fallbacks; the assistant prepares those same contracts rather than creating a separate source of truth. |
| UX-04 | The assistant is conversational and optimized for a glance-and-accept flow. It asks follow-up questions only when information required to save safely is missing or ambiguous. |
| UX-05 | Error messages are understandable to users and do not reveal internal paths, queries, stack traces, tokens, or secrets. |

## Technical and Repository Requirements

| ID | Requirement |
|---|---|
| TR-01 | Use three clearly owned repositories: `finance-ai` for documentation/orchestration, `finance-ai-backend` for FastAPI/PostgreSQL/OpenAPI, and `finance-ai-frontend` for the shared Android/Windows Flutter client. |
| TR-02 | Use a modular monolith: Flutter client, FastAPI backend, and PostgreSQL database. Do not introduce microservices for the MVP. |
| TR-03 | SQLAlchemy models and Alembic migrations are the executable source of truth for database creation and evolution. `SCHEMA.md` explains decisions and `finance-ai-draft.dbml` is a non-authoritative future design draft. |
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

- AI before identity, accounts, catalogs, manual operations, correction/deletion, transaction history, and the basic dashboard form a stable deterministic foundation.
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
- `docs/finance-ai-draft.dbml` and the removal of conflicting schema snapshots
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
