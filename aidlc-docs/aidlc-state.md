# Finance AI Delivery State

## Repository Model

- `finance-ai`: product documentation, decisions, and local orchestration
- `finance-ai-backend`: FastAPI, PostgreSQL, migrations, OpenAPI, deployment, and backend tests
- `finance-ai-frontend`: shared Flutter Android/Windows client and frontend tests

Branch flow is `feature/*` → `develop` → `main`. Feature branches are preserved after completion unless the team explicitly removes them.

## Completed

- EN-001–EN-006: repository, infrastructure, database/API, Flutter, and CI foundations
- HU-001: registration
- HU-002: login, renewable sessions, restoration, and logout
- HU-003: owned accounts, explicit currency, derived balances, deactivation/reactivation, and safe permanent deletion for unused accounts

## Current Gate

HU-003 backend and frontend pull requests target `develop`. Review corrections are being applied before merge. The backend feature branch has been synchronized with the Azure deployment commit already present in `develop`.

## Next

HU-004 begins from updated `develop` after HU-003 review findings are resolved, CI passes, and both code PRs merge.

## Product and Schema Direction

- Account is the only abstraction for where money is held; no payment-instrument/payment-method layer.
- One category level for the MVP; subcategories are deferred.
- Receipt is a purchase group with one or more expense rows.
- No product table.
- Receipt and expense images remain simple optional backend-managed paths.
- Income source is nullable on the common financial transaction.
- Budgets support recurring intervals and one-time/custom periods.

See `docs/README.md` for the current documentation map and `docs/finance-ai-draft.dbml` for the dbdiagram.io draft.
