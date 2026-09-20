# HU-005 Implementation Plan — Manage Income Sources

> Companion to `unit-of-work.md`. This is the executable, phase-by-phase plan for the
> `hu-005-income-sources` unit. Backend-first, then the OpenAPI contract, then a simple
> testing-grade Flutter screen.

## Scope Guardrails
- **In scope:** `income_source` owned CRUD, its unique-index migration, defaults, tests.
- **Out of scope (DEFERRED to other team members):** the rest of the new PostgreSQL draft (enums,
  accounts, `payment_method` removal, transactions, account movements, receipts, expenses, budgets).
  See `deferred-schema-work.md`.
- **UI quality:** simple/testing-grade screen only. Proper UI arrives later, driven by the mockup.

## Confirmed Decisions
| # | Decision |
|---|---|
| D8 | UI is a simple testing-grade screen now; proper UI waits for the mockup |
| D9 | Execution order is backend -> `openapi.json` -> frontend |
| D10 | Superseded: only `income_source` migrates in this unit; the full schema migration is deferred to other team members |
| D11 | `income_source` keeps `is_active` per the draft (reserved/unused); HU-005 uses permanent delete |
| D12 | Unique names are trimmed, case-insensitive, full-unique: `(user_id, lower(name))` |

## Phase 0 — Record decisions (docs) [x]
- [x] Add D8 (simple testing UI), D9 (backend-first order), D10 (income_source-only migration)
- [x] Create this implementation plan
- [x] Link it from `unit-of-work.md` and update `aidlc-state.md` + `audit.md`

## Phase 1 — Functional Design (light)
- [x] Lock the data contract: `income_source(id, user_id, name, is_active, created_at, updated_at)` (draft shape)
- [x] Confirm unique rule: trimmed, case-insensitive per user -> FULL unique `(user_id, lower(name))`
- [x] Confirm name rules: required, trimmed, non-empty, max 100
- [x] Confirm delete rule: permanent delete (row removed); `is_active` stays reserved/unused
- [x] Confirm registration defaults `Salary` / `Other` stay editable
- [x] No mixin split: `IncomeSource` keeps `OwnedCatalogMixin` (keeps `is_active`)
- [x] Write functional-design artifacts
- [x] Get user approval for the design (approved)

## Phase 2 — Migration
- [x] Create `migrations/versions/0004_uow03_income_source.py` (`down_revision = "0003_uow02_constraint_names"`)
- [x] Drop partial index `uq_income_source_active_name`
- [x] Keep `income_source.is_active` (no column drop)
- [x] Create full unique index `uq_income_source_user_name` on `(user_id, lower(name))`
- [x] Implement reversible `downgrade()` (drop new index, recreate the partial index)
- [x] Verify `alembic upgrade head` + `downgrade -1` + `upgrade head` on the test database only

## Phase 3 — Model + repository + unit of work
- [x] Update `src/finance_ai/db/models/catalogs.py`: replace the partial unique index with full `uq_income_source_user_name` on `(user_id, lower(name))`
- [x] Create `src/finance_ai/db/repositories/income_sources.py`
- [x] Repository methods: `list_for_user`, `find_by_id_for_user`, `name_exists`,
      `add`, `rename`, `delete`, `clear_historical_references`
- [x] Repositories stage changes and never commit
- [x] Add `SQLAlchemyIncomeSourceUnitOfWork` to `src/finance_ai/db/uow.py` (rollback on exit unless committed)

## Phase 4 — Errors + schemas + service
- [x] Add `core/errors.py`: `IncomeSourceNameTakenError` (409 `income_source_name_taken`),
      `IncomeSourceNotFoundError` (404 `income_source_not_found`),
      `IncomeSourceValidationError` (422 `income_source_invalid`)
- [x] Add `income_sources/schemas.py`: response + create/rename requests with `to_command()`
- [x] Add `income_sources/repositories.py` + `income_sources/uow.py` Protocols
- [x] Add `income_sources/service.py`: list / create / rename / delete
- [x] Enforce ownership on every operation; uniqueness via `lower(name)` per user
- [x] Map `IntegrityError` on `uq_income_source_user_name` to the 409 error
- [x] Service owns the transaction (commit), repos only stage

## Phase 5 — Router + wiring
- [x] Add `income_sources/dependencies.py`: `get_current_user_id` (wraps `require_bearer_access` +
      `SessionService.current_user().user_id`) and `get_income_source_service`
- [x] Add `income_sources/router.py`:
      `GET /income-sources`, `POST /income-sources`,
      `PATCH /income-sources/{id}`, `DELETE /income-sources/{id}` (204)
- [x] Attach `ProblemResponse` models for 401/404/409/422/500/503
- [x] Register the router in `src/finance_ai/api/router.py` under `/api/v1`
- [x] Confirm list/create responses expose only `id` and `name`

## Phase 6 — Backend tests
- [x] `tests/unit/test_income_source_service.py`: validation, duplicate, not-found, ownership, rollback
- [x] `tests/api/test_income_sources_api.py`: 401/404/409/422 shapes, no secret leakage, correlation ID
- [x] `tests/integration/test_income_source_persistence.py`: unique index, permanent delete,
      cross-user isolation (real PostgreSQL)
- [x] `tests/property/test_income_source_name_properties.py`: trim + case-fold invariants
- [x] Keep coverage >= 80% (measured 89.60% with integration)

## Phase 7 — Contract + backend verification
- [x] Regenerate the contract: `uv run python scripts/export_openapi.py`
- [x] Review the `openapi.json` diff for the new paths/schemas (+489 lines)
- [x] `uv run ruff format .`
- [x] `uv run ruff check .`
- [x] `uv run mypy src`
- [x] `uv run pytest --cov=finance_ai --cov-report=term-missing` (100 passed, 89.60%)
- [x] Integration: `docker compose --profile test run --build --rm test pytest -m integration`
- [x] `uv run pip-audit` (no known vulnerabilities)

## Phase 8 — Frontend (simple testing UI)
- [x] Add `patchJson` / `deleteJson` to `lib/core/api/api_client.dart`
- [x] Add `lib/features/income_sources/domain/income_source_models.dart`
- [x] Add `lib/features/income_sources/data/income_sources_repository.dart`
- [x] Add `lib/features/income_sources/presentation/income_sources_controller.dart` + `_state.dart`
- [x] Add `lib/features/income_sources/presentation/income_sources_screen.dart`
      (list + add field + rename dialog + delete confirm dialog)
- [x] Add `/income-sources` route in `lib/core/router/app_router.dart` and a Home entry point
- [x] Expose `incomeSourceSelectorProvider`; reload after every mutation (selector refresh)
- [x] Use the shared diagnostic contract for user-visible failures
- [x] Widget tests: list / add / rename / delete-confirm (53 Flutter tests pass)
- [x] `flutter analyze` (no issues) + `flutter test` (all passed)

## Phase 9 — Build and Test close-out
- [x] Add build/test instructions under `aidlc-docs/construction/build-and-test/`
- [x] Run backend + frontend verification once more on the frozen contract
- [x] Mark all plan checkboxes complete
- [x] Update `aidlc-state.md` and append results to `audit.md`

## Suggested Execution Slices
| Slice | Phases | Outcome |
|---|---|---|
| 1 | 0, 1, 2, 3 | Decisions + design + migration + persistence layer verified |
| 2 | 4, 5, 6, 7 | Full owned CRUD API, tests green, contract regenerated |
| 3 | 8, 9 | Simple Flutter screen + build/test close-out |

