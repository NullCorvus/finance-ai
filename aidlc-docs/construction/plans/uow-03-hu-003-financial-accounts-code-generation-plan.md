# UOW-03 / HU-003 Financial Accounts — Code Generation Plan

## Objective

Implement and verify HU-003 as one authenticated vertical slice across `finance-ai-backend` and `finance-ai-frontend`: create, list, detail, edit, deactivate, reactivate, and safely delete unused owned accounts; expose exact derived balances and supported/suggested currency context; preserve safe multi-device behavior and financial history; and introduce only the internal movement persistence necessary for balance calculation.

This plan is the single source of truth for HU-003 code generation. Build-and-Test remains the formal stage after code generation, although targeted checks run after each implementation segment.

## Story Traceability

| Requirement | Planned implementation |
|---|---|
| Create account | Backend model/policy/service/API plus Flutter create form |
| List/detail with derived balance | Indexed PostgreSQL projection plus Flutter list/detail screens |
| Edit metadata | PATCH contract with currency lock after confirmed movement |
| Deactivate/reactivate | Dedicated idempotent status route and confirmation UI |
| Ownership isolation | HU-002 principal, owner-scoped repositories, composite constraints, IDOR tests |
| Explicit/suggested currency | Shared currency options and deterministic account/preferred/COP suggestion |
| Multi-device consistency | Server-authoritative API state reused by independent Windows/Android sessions |
| Safe failures | Stable backend codes and shared copyable Flutter diagnostics |

## Dependencies and Boundaries

- Depends on completed HU-001 shared currencies/registration and HU-002 authenticated sessions.
- Implements HU-003 only; HU-004 catalogs and all public receipt, expense, income, transfer, budget, and AI writes remain excluded.
- Adds no runtime package, cache, queue, worker, local financial database, or platform-specific product fork.
- Application source belongs only in the backend/frontend repositories. The hub receives planning/code-summary documentation only.
- Existing unrelated hub working-tree changes must not be overwritten or included in backend/frontend commits.

## Implementation Branches

- Backend: create `feat/hu-003-financial-accounts` from `backend-origin/main` in `finance-ai-backend`.
- Frontend: create `feat/hu-003-financial-accounts-frontend` from `frontend-origin/main` in `finance-ai-frontend`. The suffix is required because both application directories are linked worktrees of the same parent Git repository, which cannot check out one branch in two worktrees simultaneously.
- Do not commit or push until generated code and proportional verification pass; publication remains a separate authorized action.

## Detailed Execution Plan

### Step 1 — Baseline and Branch Isolation

- [x] Confirm both application repositories are clean and their remote main refs are available.
- [x] Create the two HU-003 feature branches without modifying the documentation hub branch.
- [x] Run focused existing backend and Flutter baseline tests before changes.
- [x] Record any pre-existing failure without weakening gates.

Baseline evidence (2026-09-07): backend `tests/unit` and `tests/api` passed 42/42. The frontend verification helper stopped before dependency restoration or tests with its existing safe code `FLUTTER_TOOLCHAIN_UNAVAILABLE` because Flutter 3.47.2 is not installed or discoverable; native/shared Flutter verification remains required in Steps 13–14 once the toolchain is available.

### Step 2 — Backend Persistence Models and Migration

- [x] Create `finance-ai-backend/src/finance_ai/db/models/accounts.py` for Account.
- [x] Create `finance-ai-backend/src/finance_ai/db/models/transactions.py` for internal FinancialTransaction and AccountMovement foundations.
- [x] Update `finance-ai-backend/src/finance_ai/db/models/__init__.py` and `finance-ai-backend/migrations/env.py` model registration.
- [x] Create `finance-ai-backend/migrations/versions/0004_uow03_financial_accounts.py` with explicit names, `NUMERIC(18,2)`, controlled checks, owner/currency foreign keys, composite ownership, active-name partial uniqueness, and balance indexes.
- [x] Keep transaction/movement tables internal; add no public financial-write endpoint.
- [x] Update `finance-ai-backend/infrastructure/postgres/dbeaver-readonly.sql` with password/token-free account and movement views appropriate to the existing local viewer boundary.

### Step 3 — Backend Domain Contracts and Policy

- [x] Create `finance-ai-backend/src/finance_ai/accounts/__init__.py`.
- [x] Create `finance-ai-backend/src/finance_ai/accounts/schemas.py` with AccountType, exact Decimal commands/results, list/options payload, request models, and fixed-string money serialization.
- [x] Create `finance-ai-backend/src/finance_ai/accounts/policy.py` for trimmed bounded names, signed two-decimal opening balances, controlled types, non-empty patches, and lifecycle validation.
- [x] Create `finance-ai-backend/src/finance_ai/accounts/repositories.py` and `finance-ai-backend/src/finance_ai/accounts/uow.py` protocols/records without SQLAlchemy or FastAPI leakage.

### Step 4 — Backend Repository and Unit of Work

- [x] Create `finance-ai-backend/src/finance_ai/db/repositories/accounts.py` with owner-scoped CRUD, active-name checks, active currency resolution, deterministic suggestion, row-protected mutation lookup, confirmed-movement detection, and shared database-side balance projection.
- [x] Create `finance-ai-backend/src/finance_ai/db/account_uow.py` using the existing rollback/commit/close conventions.
- [x] Ensure list/detail aggregate balances in SQL and do not hydrate movement collections.
- [x] Translate only known named constraints to account-domain conflicts.

### Step 5 — Backend Service and Safe Errors

- [x] Create `finance-ai-backend/src/finance_ai/accounts/service.py` for create/list/get/update/set-active orchestration.
- [x] Extend `finance-ai-backend/src/finance_ai/core/errors.py` with `account_name_conflict`, `account_currency_invalid`, `account_not_found`, `account_currency_locked`, and `account_reactivation_conflict` safe errors.
- [x] Preserve identical missing/foreign behavior, atomicity, idempotent status changes, active-currency validation, and no permanent delete.
- [x] Keep account names, amounts, request bodies, SQL, emails, credentials, raw exceptions, and stack traces out of safe diagnostics/log metadata.

### Step 6 — Backend Authenticated API

- [x] Create `finance-ai-backend/src/finance_ai/accounts/dependencies.py` to resolve AccountService and an authenticated public principal through the HU-002 session service.
- [x] Create `finance-ai-backend/src/finance_ai/accounts/router.py` for POST/GET list/GET detail/PATCH metadata/PATCH status endpoints.
- [x] Update `finance-ai-backend/src/finance_ai/api/router.py` to include the account router under `/api/v1`.
- [x] Declare safe response models/statuses, reject client owner IDs, and preserve correlation/no-store middleware behavior.

### Step 7 — Backend Unit and Property Tests

- [x] Create `finance-ai-backend/tests/unit/test_account_policy.py` for names, enums, Decimal bounds/precision, empty patches, and lifecycle rules.
- [x] Create `finance-ai-backend/tests/unit/test_account_service.py` for orchestration, ownership, currency, balance, update, status, rollback, and safe failures.
- [x] Create `finance-ai-backend/tests/property/test_account_properties.py` using Hypothesis for normalization equivalence, Decimal round trips, state transitions, ownership IDs, and balance invariants.
- [x] Verify property failures are reproducible and do not print financial/user secrets.

### Step 8 — Backend API and PostgreSQL Integration Tests

- [x] Create `finance-ai-backend/tests/api/test_account_api.py` for authentication, request/response contracts, stable errors, IDOR behavior, correlation IDs, no-store responses, and absent DELETE route.
- [x] Create `finance-ai-backend/tests/integration/test_account_persistence.py` for migrations, active partial uniqueness, same-owner constraints, exact balance aggregation, confirmed/pending/voided behavior, currency locking, concurrent conflicts, idempotency, and rollback.
- [x] Update shared integration cleanup only where needed so existing registration/session tests remain isolated.
- [x] Add bounded seeded query-plan/performance evidence for the approved personal profile without flaky wall-clock assertions in the ordinary unit suite.

Generation evidence (2026-09-07): all 26 API tests pass. Fifteen PostgreSQL tests collect safely but are skipped on this host because `FINANCE_AI_TEST_DATABASE_URL` and Docker are unavailable; execution remains an explicit Step 9/14 verification gate rather than being reported as passed.

### Step 9 — Backend Contract and Documentation

- [x] Regenerate `finance-ai-backend/openapi.json` with `finance-ai-backend/scripts/export_openapi.py`.
- [x] Update `finance-ai-backend/README.md` with account endpoints and HU-003 behavior.
- [x] Run backend formatting, lint, mypy, focused/full tests, coverage, migration upgrade/downgrade/upgrade, OpenAPI drift, and dependency audit checks as available.

Backend verification evidence (2026-09-08): Ruff format/check and strict mypy pass; OpenAPI regenerates byte-stably; offline PostgreSQL upgrade/downgrade/re-upgrade SQL compiles; dependency audit reports no known vulnerabilities; and the complete locally runnable suite passes 99 tests with 83.61% line coverage. Fifteen real-PostgreSQL tests remain environment-skipped because Docker and `FINANCE_AI_TEST_DATABASE_URL` are unavailable on this host.

### Step 10 — Flutter Core HTTP and Domain/Data Layer

- [x] Extend `finance-ai-frontend/lib/core/api/api_client.dart` with PATCH JSON support through the existing safe request pipeline.
- [x] Create `finance-ai-frontend/lib/features/accounts/domain/account_models.dart` for account/currency/options/commands, exact money strings/minor-unit parsing, and typed failures.
- [x] Create `finance-ai-frontend/lib/features/accounts/data/accounts_repository.dart` for authenticated endpoints, safe ProblemResponse mapping, invalid-session retry through `runProtected`, and strict success decoding.
- [x] Add no decimal or state-management dependency unless the approved plan is explicitly revised.

### Step 11 — Flutter Application State

- [x] Create `finance-ai-frontend/lib/features/accounts/application/accounts_state.dart` with immutable list/detail/form/mutation states.
- [x] Create `finance-ai-frontend/lib/features/accounts/application/accounts_controller.dart` for load, refresh, include-inactive, create, edit, deactivate, reactivate, repeated-submit suppression, and diagnostic mapping.
- [x] Preserve server authority after success and refresh after uncertain transport outcomes.

### Step 12 — Flutter Presentation and Routing

- [x] Create `finance-ai-frontend/lib/features/accounts/presentation/accounts_screen.dart` for loading, empty, populated, failure, refresh, and inactive-filter states.
- [x] Create `finance-ai-frontend/lib/features/accounts/presentation/account_detail_screen.dart` for exact balance/metadata/status and edit/lifecycle actions.
- [x] Create `finance-ai-frontend/lib/features/accounts/presentation/account_form_screen.dart` for shared create/edit behavior, type/currency choices, signed opening balance, suggestion-only defaults, accessible validation, and saving state.
- [x] Update `finance-ai-frontend/lib/core/router/app_router.dart` with authenticated account routes.
- [x] Update `finance-ai-frontend/lib/features/home/presentation/home_screen.dart` with the stable `home-accounts-button` entry.
- [x] Use the approved stable keys, deactivation confirmation language, accessible negative-balance semantics, and shared copyable diagnostic UI.

### Step 13 — Flutter Tests and Native Coverage

- [x] Create `finance-ai-frontend/test/features/accounts/domain/account_models_test.dart` for exact money and decoding.
- [x] Create `finance-ai-frontend/test/features/accounts/data/accounts_repository_test.dart` for HTTP/auth/session refresh, contracts, errors, and financial-data-free failures.
- [x] Create `finance-ai-frontend/test/features/accounts/application/accounts_controller_test.dart` for state transitions, repeated taps, inactive filters, mutations, and refresh recovery.
- [x] Create `finance-ai-frontend/test/features/accounts/presentation/accounts_screens_test.dart` for list/detail/form/deactivation/accessibility behavior.
- [x] Update `finance-ai-frontend/test/features/auth/session/login_and_router_test.dart` for authenticated account routes.
- [x] Update `finance-ai-frontend/integration_test/windows_smoke_test.dart` with a synthetic account-management path and safe failure copy assertion.
- [x] Run Dart format, Flutter analyze, focused/full tests, coverage, Android build, and `tool/test_windows_and_restore.ps1`; ensure the normal Windows application bundle is restored.

Flutter verification evidence (2026-09-08): the standard locked-dependency helper passes formatting (43 files, zero changes), analysis, all 63 shared tests, and 85.55% line coverage. The Android debug build passes. Four real Windows smoke tests pass, including secure storage, and the helper restores a normal debug Windows application bundle. Temporary test overrides and workspace aliases were removed, and package metadata was restored to the ordinary absolute workspace path.

### Step 14 — Cross-Repository Contract and Completion Evidence

- [x] Compare Flutter fixtures/models against the regenerated backend OpenAPI contract.
- [x] Run a local authenticated end-to-end account flow against migrated PostgreSQL for create/list/detail/edit/deactivate/reactivate and cross-session refresh visibility.
- [x] Verify no HU-004 or financial-write behavior leaked into the slice and no duplicate/modified-copy files were created.
- [x] Create `finance-ai/aidlc-docs/construction/uow-03-financial-structure/code/code-summary.md` distinguishing backend/frontend created and modified files, tests, verification, and known deferred work.
- [x] Mark every completed plan step and update `finance-ai/aidlc-docs/aidlc-state.md` only from observed results.
- [x] Present code-generation completion for review before the formal Build-and-Test/publication stage.

Step 14 evidence (2026-09-08): the generated OpenAPI paths and required account response fields match the Flutter repository/models; no public movement write, HU-004 catalog, subcategory, product, or payment-instrument behavior leaked into the slice; and no temporary dependency override or workspace alias remains. An isolated localhost PostgreSQL cluster was created without modifying the machine's existing service. The complete authenticated account lifecycle and cross-session Windows/Android visibility passed against the migrated database, followed by successful unused-account deletion, post-delete `404`, and used-account `409 account_delete_blocked` checks.

### Step 15 — Approved Staged Permanent-Deletion Revision

Approved policy: add safe hard deletion for unused owned accounts now, while reserving move-history and advanced delete-all workflows for the transaction/receipt stories that will define their complete dependency graph. If movement history exists, reject deletion with the stable `account_delete_blocked` conflict and direct the user to deactivation. Opening balance alone does not block deletion. The account-movement foreign key remains `ON DELETE RESTRICT`; no ordinary account deletion may silently cascade or orphan financial history.

- [x] Research established personal-finance deletion patterns and document the distinction among deactivation, history migration, and destructive erasure.
- [x] Record the approved staged delivery policy in the HU-003 functional/NFR design; public repository documentation is completed with the contract work below.
- [x] Add owner-scoped repository/service deletion under an account row lock, any-movement detection, atomic hard delete, and safe `account_delete_blocked` handling without changing the existing migration.
- [x] Add authenticated `DELETE /api/v1/accounts/{account_id}` returning `204`; preserve identical missing/foreign `404`, correlation/no-store behavior, and bounded request handling.
- [x] Add backend unit, API, property/integration, concurrent movement/delete, rollback, IDOR, safe-diagnostic, and OpenAPI coverage; regenerate the contract byte-stably.
- [x] Add shared Flutter DELETE transport/repository/controller behavior with one-refresh authentication, uncertain-outcome refresh, repeated-tap suppression, and navigation back to the canonical list.
- [x] Add a clearly destructive, two-step detail-screen confirmation using stable keys `account-delete-button` and `account-confirm-delete-button`; explain that the action is permanent and that accounts with movements must be deactivated.
- [x] Add Flutter repository/controller/widget/router/native-smoke tests for success, blocked deletion, missing/foreign behavior, safe copied diagnostics, and absence of account names/balances in reports.
- [x] Run backend format/lint/mypy/full coverage, real PostgreSQL integration/E2E using the isolated test cluster, OpenAPI drift, dependency audit, Flutter format/analyze/full coverage, Android build, and Windows smoke/normal-bundle restoration.
- [x] Update the code summary, plan/state/audit evidence, verify no duplicate files or unrelated scope, restart the local API, rebuild/relaunch the Windows client, and present the revised slice for review.

Step 15 evidence (2026-09-08): backend formatting, lint, strict typing, dependency audit, and all 122 tests passed with 90% coverage; 17 PostgreSQL integration tests exercised every movement status and the concurrent insert/delete invariant. OpenAPI regenerated byte-stably with SHA-256 `A1B07FF7EC5C6A7D3F95ABBF62415458F9DAC166E30E201BDA4A216CA3ED0CFE`. The authenticated lifecycle/deletion E2E passed against the isolated migrated database. Flutter formatting and analysis passed, all 70 shared tests passed with 86.10% coverage, the Android debug build passed, four Windows native smoke tests passed, and the normal Windows bundle was restored and relaunched. The ready API and visible client use the verified source; no migration change, public movement route, dependency override, duplicate implementation, commit, or push was introduced.

## Expected Public Contract

- `POST /api/v1/accounts`
- `GET /api/v1/accounts?include_inactive=false`
- `GET /api/v1/accounts/{account_id}`
- `PATCH /api/v1/accounts/{account_id}`
- `PATCH /api/v1/accounts/{account_id}/status`
- `DELETE /api/v1/accounts/{account_id}` — approved Step 15 revision; unused owned accounts only

There is no public movement route in HU-003. Step 15 adds permanent deletion only for accounts with no movement history. Move-history and advanced delete-all behavior remain explicitly deferred to the transaction/receipt stories.

## Completion Criteria

- Every implementation checkbox is completed with evidence or explicitly revised and re-approved.
- Backend/frontend format, static analysis, tests, coverage, contract, migration, Android, and Windows gates pass.
- Account ownership, exact decimals, name races, inactive behavior, the approved deletion policy, movement-history integrity, currency rules, derived balances, multi-device refresh, and secret/financial-data-free diagnostics are tested.
- No unrelated working-tree changes are committed or overwritten.

## Approval Gate

Code generation must not begin until this complete plan is explicitly approved.
