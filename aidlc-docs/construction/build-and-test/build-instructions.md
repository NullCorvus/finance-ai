# Build Instructions — HU-005

## Backend (`finance-ai-backend`)
```bash
cd finance-ai-backend
uv sync --all-groups --frozen
uv run alembic upgrade head
uv run python -m finance_ai.db.seeds
uv run uvicorn finance_ai.main:app --reload
```
Docker: `docker compose up --build -d` (runs migrate + seed at start).

## Frontend (`finance-ai-frontend`)
```bash
cd finance-ai-frontend
flutter pub get
flutter run                 # Android or Windows
```
Verify helpers (Windows): `tool/verify_shared.ps1`, `tool/build_android.ps1`.

## Notes
- The HU-005 migration `0004_uow03_income_source` changes only one index; `is_active` is retained.
- Never point `FINANCE_AI_DATABASE_URL` automated tests at a non-test database.
