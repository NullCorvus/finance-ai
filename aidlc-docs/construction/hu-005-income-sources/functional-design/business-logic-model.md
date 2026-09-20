# Business Logic Model — HU-005 Income Sources

## Module Layout

| Layer | Path | Responsibility |
|---|---|---|
| Model | `src/finance_ai/db/models/catalogs.py` | `IncomeSource` entity (keeps `is_active`, unused) |
| Repository impl | `src/finance_ai/db/repositories/income_sources.py` | SQLAlchemy queries/statements, no commit |
| Unit of Work | `src/finance_ai/db/uow.py` | `SQLAlchemyIncomeSourceUnitOfWork` |
| Contracts | `src/finance_ai/income_sources/repositories.py`, `uow.py` | Repository/UoW Protocols |
| Schemas | `src/finance_ai/income_sources/schemas.py` | Request/response DTOs + commands |
| Service | `src/finance_ai/income_sources/service.py` | Business rules, ownership, transaction owner |
| Wiring | `src/finance_ai/income_sources/dependencies.py` | `get_current_user_id`, service factory |
| API | `src/finance_ai/income_sources/router.py` | HTTP routes, `ProblemResponse` models |
| Errors | `src/finance_ai/core/errors.py` | Typed `AppError` subclasses |

## Operation Flows

### list(user_id)
1. Repository selects rows `WHERE user_id = :user_id ORDER BY lower(name)`.
2. Service returns `(id, name)` pairs.

### create(user_id, raw_name)
1. Validate/normalize name (BR-1, BR-2).
2. Insert row; rely on `uq_income_source_user_name` for the final uniqueness guarantee.
3. `IntegrityError` on that index maps to `409 income_source_name_taken`.
4. Commit; return `(id, name)`.

### rename(user_id, income_source_id, raw_name)
1. Validate/normalize name.
2. Load row `WHERE id = :id AND user_id = :user_id`; missing -> `404`.
3. Update name; duplicate -> `409`.
4. Commit; return `(id, name)`.

### delete(user_id, income_source_id)
1. Load row `WHERE id = :id AND user_id = :user_id`; missing -> `404`.
2. Clear historical references: `UPDATE <referencing tables> SET income_source_id = NULL
   WHERE income_source_id = :id` (documented no-op guard today; contract for `financial_transaction`).
3. Delete the row.
4. Commit; respond `204`.

## Transaction Boundary

- The service enters a Unit of Work per operation and commits once.
- On any exception the UoW rolls back, so a failed create/rename/delete leaves prior state intact.
- Repositories never commit; they only stage/flush.

## Concurrency

- Two concurrent creates with the same name: the unique index rejects the loser, surfaced as `409`.
- Rename and delete are single-row operations keyed by `(id, user_id)`.

## Idempotency / Retries

- A retried delete of an already-deleted id returns `404` (the client already removed it locally).
- Create is not idempotent; the duplicate-name rule prevents accidental duplicates.
