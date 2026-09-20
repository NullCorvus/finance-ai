# Integration Test Instructions — HU-005

Persistence changes require a real PostgreSQL test database. The integration suite runs
`alembic downgrade base` then `alembic upgrade head`, exercising `0004_uow03_income_source`.

## Run
```bash
cd finance-ai-backend
docker compose --profile test run --build --rm test \
  pytest -m integration -q
```
Full suite with coverage:
```bash
docker compose --profile test run --build --rm test \
  pytest --cov=finance_ai --cov-report=term-missing -q
```

## HU-005 coverage
- `tests/integration/test_income_source_persistence.py`
  - owned CRUD + case-insensitive unique names
  - cross-user isolation (same name allowed per user)
  - permanent delete frees the name
  - unique index enforced at the database level (`uq_income_source_user_name`)

## Safety
- The database name must end in `_test` (enforced by `require_safe_test_database_url`).
- `FINANCE_AI_TEST_DATABASE_URL` is provided by the Compose `test` profile.

Expected result: `100 passed`, coverage `89.60%` (>= 80% gate).
