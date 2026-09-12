# Finance AI Agent Guide

## Work Efficiently

- Treat the user's current request as the authority. Keep simple changes simple.
- Inspect existing work before editing and preserve unrelated teammate changes.
- Lead with concrete results and proof. Do not generate ceremonial plans, raw conversation audits, or duplicate documents unless the user asks for them.
- Current product context starts at `docs/README.md`. Read only the documents relevant to the task.

## Repository Boundaries

- `finance-ai` owns product documentation, architecture decisions, delivery status, and local cross-repository orchestration.
- `finance-ai-backend` owns FastAPI, PostgreSQL models, Alembic migrations, seeds, OpenAPI, deployment files, and backend tests.
- `finance-ai-frontend` owns shared Flutter code for Android/Windows, client storage/diagnostics, and frontend tests.
- Never put application source or language dependency locks in this documentation hub.

## Branch Workflow

- `main` contains fully tested, release-ready work.
- `develop` is the team integration branch.
- Create one descriptive feature branch per user story or focused change from current `develop`.
- Feature pull requests target `develop`; release pull requests target `main`.
- Preserve completed feature branches unless the team explicitly decides to remove them.

## Current Product Decisions

- Finance AI is a modular monolith: Flutter, FastAPI, and PostgreSQL.
- Manual forms and deterministic services are authoritative. AI proposes values but never bypasses normal validation or ownership rules.
- An account is the place where money is held; there is no payment-instrument/payment-method layer.
- The current data-model direction has one category level, no product table, a receipt as a purchase group, and one or more expense rows per receipt.
- Use `docs/finance-ai-draft.dbml` for future schema discussion and backend migrations/models for the implemented schema.

## Error and Privacy Contract

- Every user-visible failure uses a stable machine-readable code, a safe plain-language message, and a request/correlation ID when applicable.
- Flutter uses the shared diagnostic contract under `finance-ai-frontend/lib/core/diagnostics/`.
- Never expose passwords, emails, credentials, authorization headers, request bodies, financial form values, SQL, environment values, raw exceptions, or stack traces in UI diagnostics, logs, screenshots, or tests.

## Verification

- Backend: formatting, lint, strict typing, OpenAPI drift, relevant tests, at least 80% line coverage, and PostgreSQL integration when persistence changes.
- Frontend: `tool/verify_shared.ps1`; add Android/Windows build checks when platform or packaging behavior changes.
- Cross-repository changes land in dependency order: decision/documentation when needed, backend contract, then frontend integration.
- Do not call a story complete while blocking review findings or required CI checks remain unresolved.

## Local Network Boundary

- PostgreSQL stays on the private internal Compose network with no normal host port.
- The API remains loopback-bound for local development.
- DBeaver access uses only the explicit loopback, read-only viewer override documented in the root README.
