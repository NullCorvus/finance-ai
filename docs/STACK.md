# Stack — Finance AI

## Status

Approved proposal for the manual-first university prototype. Exact supported versions are pinned during EN-001/EN-006 and confirmed with the team/professor before construction.

## Decisions

| # | Layer | Decision | Rationale |
|---|---|---|---|
| 1 | **Interface** | **Flutter (Dart)** | Mobile — matches the PGC title "aplicación móvil". One codebase → Android + iOS + web (web build = free demo fallback). Hot reload → fast iteration for a 16-week prototype. Strong AI-assistant codegen support. |
| 2 | **Backend** | **Python + FastAPI** | Team already knows Python → zero language ramp-up. Lean, async JSON API with auto OpenAPI docs. Fits the pattern: one AI call per receipt + plain-SQL analytics. |
| 3 | **Database** | **PostgreSQL** | `docs/schema.sql` is already PostgreSQL. Runs on the VM. JSONB available for AI output if needed. |
| 4 | **Product AI** | **OpenAI-compatible LLM gateway (vision model)** — see Providers below | AI is used ONLY for AI-assisted input parsing (photo/voice/natural-language text → structured JSON), server-side. The manual form bypasses AI. The phone never calls the LLM directly. In the same parse step it handles **voice → text (STT)**: voice input is sent as audio to the model, which **transcribes and extracts the structured expense in one call**. No separate STT service. Verified during construction with a real voice memo; if accuracy/latency is unacceptable, fall back to a separate STT step (server-side) feeding the same parse prompt. Provider swappable via env config (baseURL + API key + model id). |
| 5 | **Auth** | **JWT (stateless tokens)** | Mobile app + REST API → stateless is standard, no session storage. Resolves the "sessions vs tokens" marker in `ALCANCE.md`. |
| 6 | **File storage** | **Local disk on VM** | Receipt images stored as file paths (DB stays light). Already the design decision in `docs/ARCHITECTURE.md`. |
| 7 | **Deploy** | **VM + Docker Compose** | Separate containers: `api` + `postgres` (and optional Flutter web build). Matches the VM commitment; the mobile app is installed on phones, not deployed on the VM. |
| 8 | **Languages ("glue")** | Dart (UI) · Python 3.12 (API) · SQL (DB) · Docker/bash (tooling) | The languages that stitch the project together — no extra services. |

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
