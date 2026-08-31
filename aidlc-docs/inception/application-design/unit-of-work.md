# Units of Work — Finance AI

## Decomposition Model

Finance AI remains one modular FastAPI backend, one Flutter client, and one PostgreSQL database. The units below are construction and review boundaries inside those shared deployables. They are not microservices, repositories, databases, or separately deployed applications.

## UOW-01 — Foundation and Registration

**Outcome:** A clean checkout can start the API/database and run a Flutter registration flow that creates a user plus minimal owned defaults atomically, then navigates to Login without issuing a session.

**Assigned work:** EN-001, EN-002, EN-003, EN-004, EN-005, EN-006, HU-001.

**Responsibilities:**

- Establish backend/frontend project roots and pinned-tool conventions.
- Establish Compose-based FastAPI/PostgreSQL local startup and readiness.
- Establish SQLAlchemy/Alembic schema and shared COP/USD seed.
- Establish versioned API/error contracts.
- Establish Flutter theme, routing, Riverpod, loading, and error foundations.
- Establish continuous formatting, linting, tests, dependency checks, and clean-setup verification.
- Implement registration as the first vertical product story.

**Explicit exclusions:** Login/session issuance, email verification/recovery, financial accounts, financial movements, budgets, dashboard, and product AI.

**Completion signal:** HU-001 acceptance criteria pass through Flutter, API, and PostgreSQL from a documented clean setup.

## UOW-02 — Sessions and Preferences

**Outcome:** A registered user can log in, restore/revoke a session, log out, and manage simple defaults.

**Assigned work:** HU-002, HU-003.

**Responsibilities:**

- Credential verification and generic invalid-credential behavior.
- Short-lived access plus revocable renewable session design.
- Secure Flutter credential storage and authenticated routing.
- Preferred-currency viewing/updating without rewriting history.

**Explicit exclusions:** Password recovery, social login, multi-factor authentication, and financial accounts.

## UOW-03 — Financial Structure

**Outcome:** A user can define where money is held and maintain owned catalogs used by later forms.

**Assigned work:** HU-004, HU-005, HU-006.

**Responsibilities:**

- Account create/edit/archive and opening balance.
- Shared currency selection and original-currency preservation.
- User-owned categories/subcategories.
- User-owned payment methods and income sources.
- Historical-safe archive behavior and ownership isolation.

**Explicit exclusions:** Expense, income, transfer, budget, or dashboard calculations.

## UOW-04 — Manual Movements

**Outcome:** A user can record expenses and income and move money between owned accounts without AI.

**Assigned work:** HU-007, HU-010, HU-011.

**Responsibilities:**

- Minimal manual expense form and CRUD creation path.
- Manual income creation and lifecycle foundation.
- Same/cross-currency transfer with two stored original amounts.
- Atomicity, ownership, balance effects, and transfer-neutral analytics.

**Explicit exclusions:** Receipt parsing, required images/items, AI, and live exchange rates.

## UOW-05 — Expense Detail and Activity

**Outcome:** A user can enrich/correct expenses and review one trustworthy financial history.

**Assigned work:** HU-008, HU-009, HU-012.

**Responsibilities:**

- Optional receipt attachment and item detail.
- Expense edit/archive with correct recalculation.
- Unified expense/income/transfer activity.
- Period, account, and movement-type filters.
- Currency labels and historical ownership isolation.

**Explicit exclusions:** Budgets, dashboard aggregation, and AI parsing.

## UOW-06 — Budgets and Dashboard

**Outcome:** A user can define spending targets and understand current finances through deterministic calculations.

**Assigned work:** HU-013, HU-014.

**Responsibilities:**

- Weekly/monthly category or subcategory budgets.
- Derived budget progress and period boundaries.
- Account balances, income/expense summaries, category spending, recent activity, and budget progress.
- Transfer neutrality and currency-separated totals.

**Explicit exclusions:** Live conversion, prediction, AI analytics, and autonomous recommendations.

## UOW-07 — Optional AI Assistance

**Outcome:** After the complete manual MVP, a user may prefill existing financial forms from photo, audio, or text.

**Assigned work:** HU-015, HU-016.

**Responsibilities:**

- Backend-only provider adapter.
- Untrusted structured proposals for existing forms.
- Review/edit/retry/discard/confirm control.
- Manual fallback, temporary-media handling, and provider-failure behavior.

**Release gate:** UOW-01 through UOW-06 are complete and the manual application remains fully usable without provider configuration.

**Explicit exclusions:** Direct database writes, autonomous actions, required chat shell, and separate AI financial truth.

## Code Organization Strategy

Future application code uses shared roots:

- backend: feature modules plus shared configuration, database, errors, and tests.
- frontend: feature folders plus shared navigation, theme, API, and test support.
- project hub: cross-repository Compose orchestration; each code repository owns its own quality configuration.

Unit names are planning identifiers only. They do not create folders such as uow-01 or duplicate application shells.

## Boundary Rules

- A story is assigned to one unit only.
- Enablers are assigned to UOW-01 only and remain separately traceable from HU-001.
- Later units extend existing deployables and contracts.
- Each unit preserves security, ownership, atomicity, and currency invariants.
- UOW-07 never becomes a dependency of UOW-01 through UOW-06.
