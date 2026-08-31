# Stack — Finance AI

## Status

Approved proposal for the manual-first university prototype. Exact supported versions are pinned during EN-001/EN-006 and confirmed with the team/professor before construction.

## Decisions

| Layer | Decision | Reason |
|---|---|---|
| Client interface | Flutter / Dart | One shared Android/Windows codebase with responsive native forms and later optional assistant entry points |
| Backend | Python / FastAPI | Team familiarity, typed API schemas, OpenAPI support, and a good fit for modular financial services |
| Persistence model | SQLAlchemy | Explicit model/transaction layer for user ownership and financial operations |
| Migrations | Alembic | Versioned database evolution; replaces manual `schema.sql` execution as authority |
| Database | PostgreSQL | Relational integrity, transactions, numeric money values, and reporting queries |
| API | Versioned REST/JSON with OpenAPI contract | Stable frontend/backend integration and testable errors |
| Authentication | Short-lived access credential plus revocable renewable credential | Native client session restoration with meaningful logout |
| Password storage | Maintained adaptive hashing implementation, Argon2 preferred | Avoid plaintext and non-adaptive hashes |
| Receipt files | Backend-controlled local storage for the prototype | Optional attachments without storing image binaries in PostgreSQL |
| Local infrastructure | Docker Compose for API and PostgreSQL | Repeatable development environment with database health checks |
| Backend testing | Pytest plus Hypothesis for selected invariants | Example tests for stories and property tests for transfers/currency/budgets/serialization |
| Flutter testing | Flutter unit, widget, and integration tests as appropriate | Continuous story-level verification |
| Product AI | Provider adapter — deferred and configurable | AI is optional and cannot become a manual-MVP dependency |

## Repository Layout — Construction Target

No application folders are created during documentation reconciliation. EN-001 will create a structure similar to:

```text
finance-ai/
├── backend/
├── frontend/
├── docs/
├── aidlc-docs/
├── compose.yaml
└── README.md
```

Backend and frontend remain visibly separate while sharing one repository, issue history, API contract, and review workflow.

## Backend Organization Direction

Use feature modules inside one FastAPI service:

- auth
- users/preferences
- accounts/currencies
- catalogs
- expenses/receipt detail
- income
- transfers
- budgets
- activity/dashboard
- ai_assistant — deferred

Avoid a microservice split for the MVP.

## Flutter Organization Direction

Use clear UI and data boundaries:

- Feature views/screens
- View models or equivalent presentation logic
- Repositories as application-data sources
- Services for API/platform access
- Shared domain/API models

Manual forms remain reusable when AI is later added.

## Database Authority

- SQLAlchemy models: application persistence definition
- Alembic migrations: executable/versioned schema history
- Seed process: shared currencies and new-user catalog defaults
- `docs/SCHEMA.md`: approved design explanation
- `docs/schema.sql`: non-authoritative review snapshot

## Environment and Secrets

Manual MVP variables include database and session configuration. Product AI configuration is absent until the deferred AI unit begins.

Rules:

- Commit `.env.example`, never real `.env`.
- Do not use default database credentials outside disposable local development.
- Pin dependencies through lock files or exact approved versions.
- Pin container images; do not rely on `latest`.
- Run dependency/security checks in CI.
- Keep provider keys only in backend configuration when AI is introduced.

## AI Provider Boundary — Deferred

The exact provider/model is not a construction prerequisite for the manual MVP.

When the AI phase begins:

- Implement one backend adapter interface.
- Validate provider support with representative receipt/audio samples.
- Require structured output matching existing API form schemas.
- Treat responses as untrusted input.
- Keep a manual fallback.
- Make provider selection configurable without changing domain modules.

Provider pricing and free tiers must be revalidated at that future decision point rather than frozen in current product documentation.

## Still Pending

- Professor/team confirmation of the Flutter project type and deployment expectations
- Exact supported runtime/dependency versions during EN-001
- Hosted environment only when deployment is authorized
- AI provider only when the complete manual MVP is stable
