# UOW-03 / HU-003 Financial Accounts — Code Summary

## Outcome

HU-003 is implemented across the backend and shared Flutter client. An authenticated user can create, list, inspect, edit, deactivate, reactivate, and permanently delete an unused owned account. Balances are exact and server-derived, inactive accounts remain available to history, confirmed activity locks currency changes, used accounts preserve financial history, and no account can be read or changed by another owner.

The approved staged deletion policy is implemented: an account with no movements can be permanently deleted, while an account with pending, confirmed, or voided movement history returns the safe `account_delete_blocked` conflict and remains available for deactivation. Opening balance alone is account metadata and does not block deletion. Move-history and advanced delete-all workflows remain deferred until the transaction/receipt stories define their complete dependency graph.

## Public Contract

- `POST /api/v1/accounts`
- `GET /api/v1/accounts?include_inactive=false`
- `GET /api/v1/accounts/{account_id}`
- `PATCH /api/v1/accounts/{account_id}`
- `PATCH /api/v1/accounts/{account_id}/status`
- `DELETE /api/v1/accounts/{account_id}` — returns `204` only for an unused owned account

Missing and foreign account identifiers have the same safe `404` response. Deletion of an account with any movement has the stable `409 account_delete_blocked` response. There is no public transaction or movement write endpoint in HU-003. The generated `AccountResponse` requires `id`, `name`, `type`, `currency`, `opening_balance`, `balance`, `currency_is_locked`, `is_active`, `created_at`, and `updated_at`.

## Backend Changes

Created:

- Account domain schemas, policy, protocols, service, dependencies, and authenticated router under `src/finance_ai/accounts/`.
- Account, internal financial-transaction, and account-movement persistence models.
- Owner-scoped SQLAlchemy repository and rollback-safe account Unit of Work.
- Alembic revision `0004_uow03_financial_accounts.py` with exact numeric values, active-name uniqueness, owner/currency constraints, a restrictive account-movement foreign key, and balance indexes.
- Unit, property, API, adapter, and PostgreSQL integration tests for the account slice.

Modified:

- Shared API router, safe errors, request middleware, model registration, migration environment, DBeaver read-only views, OpenAPI document, README, and integration cleanup.
- Account repository/service/API behavior for locked, owner-scoped deletion and named foreign-key race handling.

Important behavior:

- `balance = opening_balance + confirmed movement deltas`; pending and voided movements do not affect it.
- Currency lock uses the existence of confirmed activity, including net-zero activity, rather than inferring from balance.
- Every lookup and mutation is owner-scoped; foreign and missing identifiers produce the same safe result.
- Inactive accounts cannot receive new internal movements, but their historical records and balance remain visible.
- Suggested currency is derived deterministically from account history, registration currency, or COP and never mutates saved accounts.
- Permanent deletion locks the account row, checks movements of every status, and relies on `ON DELETE RESTRICT` as the concurrent-write backstop. A named foreign-key conflict is translated to `account_delete_blocked` and rolled back safely.

## Flutter Changes

Created:

- Exact-money account models and validation under `lib/features/accounts/domain/`.
- Authenticated account repository under `lib/features/accounts/data/`.
- Immutable state and controller under `lib/features/accounts/application/`.
- Account list, detail, and shared create/edit screens under `lib/features/accounts/presentation/`.
- Domain, repository, controller, and widget test suites under `test/features/accounts/`.

Modified:

- Shared API client DELETE/PATCH support, authenticated routing, Home account entry, auth/router tests, Windows integration smoke flow, README, and Flutter workspace helper.

Important behavior:

- Monetary input is parsed into signed minor units and serialized as canonical two-decimal strings without binary floating point.
- Create suggests a currency; edit preserves the stored currency and respects the server-provided currency lock.
- Mutations suppress repeated taps and refresh server-authoritative state after success or an uncertain transport outcome.
- Active accounts are listed by default, while an explicit control reveals inactive accounts.
- Account detail offers a clearly destructive permanent-delete action with a second confirmation. Successful deletion returns to the canonical list; blocked deletion directs the user to deactivate without exposing account names or balances in diagnostics.
- The same API/session state is used on Android and Windows; no device-local financial database or preference record was introduced.
- The workspace helper discovers the pinned sibling Flutter SDK and supports Windows PowerShell runtimes that do not implement `Path.GetRelativePath`.

## Verification Evidence

| Area | Observed result |
|---|---|
| Backend format/lint/types | Ruff format/check and strict mypy passed |
| Backend tests | 122 passed against an isolated migrated PostgreSQL database |
| Backend coverage | 90% line coverage |
| PostgreSQL integration | 17 tests passed, including pending/confirmed/voided blocking and the concurrent movement/delete invariant |
| Authenticated E2E | Register/login, create/list/detail/edit/deactivate/reactivate, cross-session refresh visibility, unused deletion, post-delete `404`, and used-account `409` passed |
| Backend contract/migrations | OpenAPI regenerated byte-stably; existing migration and restrictive foreign key require no revision |
| Backend dependency audit | No known vulnerabilities reported; the local project package was correctly skipped as unpublished |
| OpenAPI SHA-256 | `A1B07FF7EC5C6A7D3F95ABBF62415458F9DAC166E30E201BDA4A216CA3ED0CFE` |
| Flutter format/analyze | Formatting clean; no analysis issues |
| Flutter shared tests | 70 passed using the locked dependencies |
| Flutter coverage | 86.10% line coverage |
| Android | Debug APK build passed |
| Windows | 4 native smoke tests passed; normal debug application bundle restored and relaunched |
| Runtime | Migrated isolated PostgreSQL, ready API on `127.0.0.1:8000`, and visible Windows client verified |
| Scope/cleanliness | OpenAPI matches Flutter behavior; no public movement/HU-004 route or temporary dependency override remains |

## Deliberately Deferred Product Scope

HU-003 does not guess how to rewrite future receipts, transfers, expenses, income, budgets, reports, or AI-derived records. When those dependency graphs exist, the product can add an explicit move-history workflow and, if still desired, a separately confirmed delete-all workflow. Until then, deactivation is the correct history-preserving action for a used account.

No commit or push was performed as part of this revision. Publication remains a separate authorized action.
