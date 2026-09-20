# Unit of Work — HU-005 · Manage Income Sources

| Field | Value |
|---|---|
| **Backlog item** | PB-003 · HU-005 |
| **Story points** | 2 |
| **Mockup** | TBD (Michael sheet) |
| **Repos** | `finance-ai-backend` (FastAPI), `finance-ai-frontend` (Flutter) |
| **Database target** | Project FinanceAI (PostgreSQL) — dbdiagram draft is the migration target |
| **Status** | Open · Not started |
| **AI-DLC unit name** | `hu-005-income-sources` |

## 1. User Story

> As a user, I want to manage my income sources so that income entries use terms that match my finances.

## 2. Sprint Objective

Deliver an owned, editable Income Source catalog end-to-end (API + UI): create, list, rename and
permanently delete the current user's income sources, seeded with editable `Salary` / `Other`
defaults. Replace the current `is_active` archive-flag behavior with permanent deletion that clears
future optional historical references (`SET NULL`), and enforce trimmed case-insensitive unique
names per user. Story points: 2.

## 3. Acceptance Criteria (0/4)

- [ ] I receive editable income-source defaults
- [ ] I can add, rename and permanently delete my values
- [ ] Deleted values disappear from new forms while future historical transactions remain and show
      *Source deleted* for a missing optional source
- [ ] Another user's data is unaffected

## 4. Task Objectives

### 4.1 Database & Migration
- [x] Alembic migration `0004`: drop partial index `uq_income_source_active_name`
- [x] Alembic migration `0004`: keep `income_source.is_active` (draft shape, reserved/unused)
- [x] Alembic migration `0004`: add full unique index `uq_income_source_user_name` on `(user_id, lower(name))`
- [x] Document the `financial_transaction.income_source_id → income_source.id ON DELETE SET NULL`
      contract for the future transaction table (references cleared before permanent deletion)
- [x] Keep downgrade path reversible (drop full index, recreate the partial index)

### 4.2 Backend API
- [x] Owned CRUD under `/api/v1/income-sources` (list, create, rename, permanent delete)
- [x] Authenticated via existing `require_bearer_access`; every query scoped by `user_id`
- [x] Validate trimmed, non-empty, max-100 `name`; case-insensitive unique per user
- [x] Conflict on duplicate name → `409 income_source_name_taken`; missing id → `404`
- [x] Delete clears future optional historical references before/permanently removing the row
- [x] Preserve the registration default-copy behavior (`Salary`, `Other`) as editable rows
- [x] Keep service-owned transactions; repositories stage and never commit
- [x] Extend `openapi.json` intentionally and regenerate the contract
- [x] Emit stable machine-readable error codes with safe detail and correlation ID

### 4.3 Frontend UI
- [x] Owned CRUD screen (list, add, rename, permanent delete) following existing auth feature patterns
- [x] Confirm deletion with an explicit dialog
- [x] Refresh selectors: `incomeSourceSelectorProvider` reloads after added/renamed/deleted values
- [x] *Source deleted* handling documented for the future transaction history (no history table yet)
- [x] Use the shared copyable diagnostic contract for every user-visible failure
- [x] Preserve Android/Windows single-codebase rule (no platform forks)

### 4.4 Tests
- [x] Backend: ownership isolation (another user's data unaffected)
- [x] Backend: case-insensitive/trimmed unique-name validation and duplicate conflict
- [x] Backend: rename + permanent delete behavior
- [x] Backend: delete clears historical references (`SET NULL` contract; no-op guard + DB test)
- [x] Backend: rollback — failed mutation leaves prior state intact
- [x] Frontend: list/add/rename/delete-confirm widget tests
- [x] Maintain ≥ 80% line coverage (89.60%); real PostgreSQL integration tests for persistence changes

### 4.5 Mockup
- [ ] TBD — mockup to be defined (Michael sheet)

## 5. Current State (as-is)

- `income_source` exists with `id`, `user_id`, `name`, `is_active`, `created_at`, `updated_at`
  (`src/finance_ai/db/models/catalogs.py` → `OwnedCatalogMixin` + `IncomeSource`).
- Uniqueness is partial: `uq_income_source_active_name` on `(user_id, lower(name)) WHERE is_active`.
- Registration seeds editable defaults `Salary`, `Other` (`src/finance_ai/db/seeds.py`,
  `src/finance_ai/db/repositories/registration.py`).
- No income-source API, service, repository, schemas or router exist yet.
- No income-source Flutter feature exists yet (only auth + home).
- Existing error contract: `src/finance_ai/core/errors.py` (`ProblemResponse`, `AppError` subclasses).
- API wiring: `src/finance_ai/api/router.py`; auth routes live under `/api/v1/auth`.

## 6. Target State (to-be)

- `income_source(id, user_id, name, is_active, ...)` — draft shape; `is_active` reserved/unused;
  `ON DELETE CASCADE` from `app_user`.
- Unique index `(user_id, lower(name))` — full, not partial; permanent delete keeps names reusable.
- Future `financial_transaction.income_source_id` is optional and `ON DELETE SET NULL`, so deleting a
  source keeps history and the UI renders *Source deleted*.
- `/api/v1/income-sources` owned CRUD + Flutter management screen with delete confirmation and
  selector refresh.

## 7. Decisions

| # | Decision | Rationale |
|---|---|---|
| D1 | Sprint scope = HU-005 (income sources) only; PB-003 categories (HU-004) and accounts (HU-003) are separate units | Latest backlog renumbered HU-005 to income sources; keeps the unit at 2 points |
| D2 | Migration target is the new FinanceAI PostgreSQL draft | User-provided schema; draft is non-authoritative and updated to match story tasks |
| D3 (amended) | Keep `is_active` for `income_source` per the draft, but unused; HU-005 uses permanent delete | User chose the draft schema; permanent delete keeps names reusable and satisfies the AC |
| D4 | Uniqueness = trimmed case-insensitive per user (`lower(name)`) | Matches story task "validate trimmed case-insensitive unique names" |
| D5 | Deletion uses `SET NULL` semantics on future optional historical references | Matches draft `financial_transaction.income_source_id ... [delete: set null]` |
| D6 | Deliverable format = AI-DLC per-unit folder under `aidlc-docs/construction/{unit}/` | Keeps sprint docs inside AI-DLC structure, separate from `docs/` product docs |
| D8 | UI is a simple testing-grade screen now; proper UI waits for the mockup | User instruction: team builds the real UI later for the other stories |
| D9 | Execution order is backend -> `openapi.json` -> frontend | Freezes the contract before the client is written |
| D10 | Only `income_source` migrates in this unit; the full schema migration is deferred | Keeps HU-005 at 2 points; other tables belong to other units |

## Related Artifacts

- Detailed execution steps: `implementation-plan.md`
- AI-DLC stage plan: `aidlc-docs/inception/plans/execution-plan.md`
- Deferred (other team members): `deferred-schema-work.md`

## 8. Out of Scope

- Recording or editing income transactions (HU-009) and the `financial_transaction` table itself.
- `payment_method` removal / account & account_movement redesign (HU-003).
- Category CRUD (HU-004), budgets (HU-016), AI capture stories (HU-013/014/015).
- Mockup design (tracked as TBD, not blocking).

## 9. Dependencies

- HB-002 authentication (`require_bearer_access`) — available.
- Registration default-copy path — available, adjusted for the dropped archive flag.
- Future `financial_transaction` consumer of `income_source_id` — contract documented only.

## 10. Definition of Done

- [ ] All four acceptance criteria demonstrably pass.
- [ ] All task-objective checkboxes in section 4 complete (or explicitly deferred with a logged decision).
- [ ] Backend: migration + model + schemas + repository + service + router implemented.
- [ ] `openapi.json` regenerated and reviewed.
- [ ] `uv run` format/lint/type-check/tests (≥ 80% coverage) pass, including PostgreSQL integration tests.
- [ ] Frontend: screen + controller/state + repository + tests pass `tool/verify_shared.ps1`.
- [ ] Decisions and progress saved in `aidlc-docs/aidlc-state.md` and `aidlc-docs/audit.md`.
