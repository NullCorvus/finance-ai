# Stack — Finance AI

## Status

Implemented technical and identity foundation for the university prototype. Exact dependencies are pinned in the repository that owns each codebase. AI begins after the deterministic HU-001–HU-012 foundation, including transaction history and the basic dashboard, is complete and stable; budgets follow.

## Current decisions

| Layer | Decision | Rationale |
|---|---|---|
| Client | Flutter 3.47.2 / Dart 3.13.2, shared Android and Windows source | One feature implementation with fast desktop testing and a supported mobile target |
| Backend | CPython 3.14.7, FastAPI, Pydantic, SQLAlchemy 2, Alembic, and uv | Typed API, explicit transaction boundaries, reproducible dependencies, and automatic contract generation |
| Database | PostgreSQL 18.6 | Relational integrity, transactional financial data, and a mature migration path |
| Authentication | Opaque short-lived access credentials plus rotating renewable credentials backed by hash-only server sessions | Supports device revocation, rotation/replay detection, bounded idle/absolute lifetimes, and no persisted plaintext credentials |
| Local orchestration | Docker Compose in the project hub | Reproducible API/database and cross-repository integration without exposing PostgreSQL by default |
| Product AI | Backend multimodal assistant using an OpenAI-compatible structured-output boundary | Photo/voice/text proposals optimize capture speed while deterministic validation remains authoritative |
| File storage | Deferred until receipt-image implementation | Storage and retention must be approved when the corresponding manual/AI story is designed |
| Deployment | Not yet selected | Local development is implemented; hosted networking, TLS, secrets, monitoring, backup, and recovery require a deployment decision |

## Repository layout

```text
Finance App/
├── finance-ai/             # docs, backlog, decisions, orchestration
├── finance-ai-backend/     # FastAPI, PostgreSQL, OpenAPI, backend CI
└── finance-ai-frontend/    # Flutter Android/Windows client, frontend CI
```

The code repositories have independent histories and quality gates. The hub composes sibling checkouts for end-to-end testing. Detailed ownership rules are in [`REPOSITORIES.md`](REPOSITORIES.md).

## Backend organization

Use feature modules inside one modular FastAPI service:

- identity and sessions
- accounts and currencies
- categories, stores, and income sources
- expenses and optional receipt detail
- income and transfers
- budgets
- activity and dashboard
- multimodal AI speed layer after the HU-001–HU-012 foundation

Application services control transactions. Persistence repositories do not commit independently. Alembic migrations are executable schema history; `finance-ai-backend/openapi.json` is the client-facing API authority.

## Flutter organization

Android and Windows share feature, domain, API, state-management, routing, diagnostics, and validation code. Platform-specific code is limited to actual operating-system integration such as secure storage and runner behavior.

The client uses:

- feature screens and controllers
- repositories as application-data sources
- services/adapters for API and platform access
- shared immutable models and typed failures
- one copyable, privacy-safe diagnostic contract

Manual forms remain complete fallbacks; after the foundation is stable, multimodal AI is the primary speed-oriented capture workflow.

## Database authority

- SQLAlchemy models: application persistence definition
- Alembic migrations: executable and ordered schema history
- Seed process: shared currencies and new-user catalog defaults
- `docs/SCHEMA.md`: approved design explanation
- `docs/finance-ai-draft.dbml`: non-authoritative future design for dbdiagram.io

The normal Compose network keeps PostgreSQL private. Explicit DBeaver mode publishes loopback access only for a read-only role whose views exclude password and credential hashes.

## Environments and secrets

- Commit `.env.example`; never commit a real `.env`.
- Never use disposable `change-me-*` credentials outside local/test environments.
- Pin dependencies, CI actions, SDK archives/checksums, and container images.
- Keep access credentials in client memory and renewable credentials only in approved native secure storage.
- Keep future AI provider credentials only in backend configuration.
- Copyable errors and logs are allow-listed and exclude entered values, credentials, raw exceptions, request bodies, SQL, and environment values.

## AI Boundary — After the Deterministic Foundation

When HU-001–HU-012 are stable:

1. Define one backend provider adapter and a versioned structured proposal contract.
2. Feed proposals into the same validation/application services used by manual forms.
3. Treat provider output as untrusted and require user review where the story specifies it.
4. Preserve a complete manual fallback.
5. Validate representative receipt, audio, and natural-language samples before choosing a provider/model.
6. Optimize the high-confidence path for a compact glance and one-tap acceptance; clarify only missing or uncertain fields.
7. Revalidate privacy, cost, latency, retention, and provider availability before integration.

## Pending decisions

- Team/professor confirmation of deployment expectations
- Hosted infrastructure, TLS, secrets, monitoring, backup, and recovery
- Receipt-image storage and retention when that story begins
- AI provider/model only after the HU-001–HU-012 deterministic foundation is stable
