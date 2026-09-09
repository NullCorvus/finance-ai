# Finance AI UOW-03 Build Instructions

## Scope and Repository Layout

These instructions build the approved HU-003 financial-account release candidate across the three sibling repositories:

- `finance-ai`: product records and local cross-repository orchestration.
- `finance-ai-backend`: FastAPI, PostgreSQL migrations/seeds, OpenAPI, and backend tests.
- `finance-ai-frontend`: shared Flutter application for Android and Windows.

Run commands from the parent `Finance App` directory unless a section changes location. Never use a normal or non-test database for automated tests.

## Prerequisites

- Windows 10/11 and PowerShell 7.
- Git and `uv` with Python 3.14 available.
- PostgreSQL 18 or Docker Desktop with Compose.
- Flutter 3.47.2 and Dart 3.13.2; the frontend helper may discover the pinned sibling SDK.
- Android SDK and compatible JDK for Android builds.
- Visual Studio C++ desktop workload for Windows builds.
- Sufficient local space for Python environments, Flutter caches, Android APK output, and Windows native output.

Only variable names belong in documentation. Keep database passwords and other secrets in a local uncommitted environment file or process environment:

- `FINANCE_AI_DATABASE_URL`
- `FINANCE_AI_TEST_DATABASE_URL`
- `FINANCE_AI_API_BASE_URL`
- optional hub path/port settings described in `.env.example`

## Backend Build

```powershell
Set-Location .\finance-ai-backend
uv sync --all-groups --frozen
uv run ruff format --check .
uv run ruff check .
uv run mypy src
uv build
```

Expected package artifacts are created under `finance-ai-backend/dist/`. A successful build reports no formatting, lint, or type errors.

## Database and OpenAPI Build

Set `FINANCE_AI_DATABASE_URL` to a disposable or intended local development database before migration. Do not point these commands at an unknown shared database.

```powershell
Set-Location .\finance-ai-backend
uv run alembic upgrade head
uv run python -m finance_ai.db.seeds
uv run python scripts\export_openapi.py
```

Expected results:

- Alembic reaches revision `0004_uow03_financial_accounts`.
- Repeatable seeds complete without duplicating reference data.
- `openapi.json` regenerates without byte drift when the source is unchanged.
- The contract exposes `DELETE /api/v1/accounts/{account_id}` with `204`, `404`, and `409` behavior.

## Canonical Local Stack

When Docker Desktop is available, the project hub owns startup and preserves the private database boundary:

```powershell
Set-Location .\finance-ai
.\tool\local_stack.ps1 start
.\tool\local_stack.ps1 status
```

Success means the API is ready through `127.0.0.1:8000` and PostgreSQL has no ordinary host-published port. The explicit read-only DBeaver profile is separate and must not be enabled for application builds.

## Flutter Shared Validation and Builds

```powershell
Set-Location .\finance-ai-frontend
.\tool\verify_shared.ps1
.\tool\build_android.ps1
.\tool\test_windows_and_restore.ps1
```

Expected artifacts:

- Android debug APK: `finance-ai-frontend/build/app/outputs/flutter-apk/app-debug.apk`
- Normal Windows debug client: `finance-ai-frontend/build/windows/x64/runner/Debug/finance_ai.exe`

The Windows helper temporarily replaces its output with a native test harness and then restores the normal application in a `finally` block. Do not hand off the executable after running a raw native integration test without restoration.

## Troubleshooting

- `[LOCAL_STACK_DOCKER_NOT_FOUND]`: install/start Docker Desktop, or use a deliberately isolated native PostgreSQL test database.
- `[FLUTTER_TOOLCHAIN_UNAVAILABLE]`: restore the pinned Flutter SDK or make Flutter 3.47.2 discoverable.
- `[FLUTTER_DEPENDENCY_FAILURE]`: verify the lockfile and network/cache availability; do not introduce a temporary dependency override into the commit.
- `[WINDOWS_APP_RESTORE_FAILED]`: close any running test executable and rerun `tool/test_windows_and_restore.ps1`.
- Migration failure: verify the URL targets the intended disposable/local database, inspect the named migration error, and do not reset an unknown database.
