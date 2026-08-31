# Finance AI

Finance AI is a manual-first personal budgeting application. The current identity slice creates an account and supports secure Login, restoration, and Logout. AI is intentionally absent: users will always be able to enter and manage financial information manually, and a future optional assistant will use the same validated application services.

## Current executable scope

- FastAPI registration plus Login, renewable-session rotation, current-user, and Logout APIs under `/api/v1/auth`
- PostgreSQL users, starter catalogs, hash-only sessions, and renewable-credential history through ordered Alembic migrations
- Atomic starter data: Needs/Wants/Other, Cash/Card/Transfer, and Salary/Other
- COP as the initial preferred currency, with COP and USD shared reference data
- Argon2id password hashing, local common-password denial, throttling, correlation IDs, and safe problem responses
- Opaque 15-minute access credentials held only in memory and rotating renewable credentials held in Android/Windows secure storage
- Shared Android and Windows Flutter client with a blocking restoration screen, protected Home, copyable safe errors, native Windows secure-storage tests, and debug builds for both targets

Accounts, movements, budgets, calendars, synchronization, and AI remain later stories and are not hidden inside identity.

## Local stack

Prerequisites: Docker Desktop with Compose. Copy `.env.example` to `.env`; the values are disposable local-only credentials.

```powershell
Copy-Item .env.example .env
.\tool\local_stack.ps1 start
```

The API is available only through Windows loopback at `http://127.0.0.1:8000`, with interactive documentation at `http://127.0.0.1:8000/docs`. PostgreSQL stays entirely inside Docker's internal network and has no Windows host port. The API uses a separate client-access bridge for loopback publishing while retaining its private database connection. Startup applies migrations and the repeatable shared seed before reporting readiness.

Stop the services while preserving data:

```powershell
.\tool\local_stack.ps1 stop
```

Copyable local service status is available with `.\tool\local_stack.ps1 status`. The helper finds Docker Desktop even when `docker.exe` is not on the Windows `PATH` and reports stable bracketed error codes when startup or network-boundary verification fails.

## Read-only DBeaver access

The normal stack keeps PostgreSQL inaccessible from Windows. When local database inspection is needed, explicitly enable the loopback-only DBeaver mode:

```powershell
.\tool\local_stack.ps1 viewer-start
```

Create a PostgreSQL connection in DBeaver using:

| Field | Value |
|---|---|
| Host | `127.0.0.1` |
| Port | `55432` |
| Database | `finance_ai` |
| Username | `finance_ai_viewer` |
| Password | `change-me-viewer-local` unless `POSTGRES_VIEWER_PASSWORD` was changed in `.env` |

After connecting, open `finance_ai` → `Schemas` → `finance_ai_view` → `Views`. Use `registration_summary` for account/starter-data status and `user_session` for hash-free session lifecycle metadata. The viewer is enforced as read-only and cannot query base tables containing password or credential hashes. Avoid sharing screenshots that contain real email addresses.

Close DBeaver access when finished without deleting data or stopping the API:

```powershell
.\tool\local_stack.ps1 viewer-stop
```

Delete the disposable local database volume only when a complete local reset is intended:

```powershell
docker compose down --volumes
```

## Backend development

The backend uses the project-pinned Python 3.14.7 runtime and `uv` lockfile.

```powershell
Set-Location backend
uv sync --all-groups --frozen
uv run ruff format --check .
uv run ruff check .
uv run mypy src
uv run pytest --cov=finance_ai --cov-report=term-missing
```

Generate the committed API contract after an intentional API change:

```powershell
uv run python scripts/export_openapi.py
```

Run the real persistence suite inside the isolated Compose network:

```powershell
docker compose --profile test run --rm test pytest -m integration
```

The integration suite refuses to operate on a database whose name does not end in `_test`.

Run the complete Flutter-to-API-to-PostgreSQL Register → Login → restore → Logout flow without exposing the private network:

```powershell
docker compose --profile integration run --rm flutter-integration
```

The first run builds a checksum-pinned Flutter 3.47.2 Linux test image and is intentionally slower than later runs. The image generates a temporary headless Linux runner and an internal-only API that targets `finance_ai_test`; it never writes synthetic accounts to the normal local database. The committed application targets Android and Windows.

## Flutter client development

Android and Windows are maintained from the same Flutter source under `frontend/lib`; there is no desktop fork. The default Android-emulator API address is `http://10.0.2.2:8000`, while Windows defaults to `http://127.0.0.1:8000`. A physical device, remote environment, or future synchronization server can be selected without changing source code:

```powershell
Set-Location frontend
..\.tools\flutter\bin\flutter.bat run -d windows --dart-define=FINANCE_AI_API_BASE_URL=https://api.example.com
```

Run the repeatable shared checks and build both debug targets from the same checkout. These helpers also handle Flutter's native-tooling issue when the repository path contains spaces:

```powershell
.\tool\verify_shared.ps1
.\tool\build_android.ps1
.\tool\test_windows_and_restore.ps1
```

The Windows executable is generated at `frontend/build/windows/x64/runner/Debug/finance_ai.exe`. It must remain beside its generated `data` and DLL files, so distribute the containing `Debug` or release folder rather than the `.exe` alone. The runner resolves those files from its own location, shows a stable native startup error for an incomplete or non-rendering bundle, and keeps one desktop instance; launching it again focuses the existing window.

For native desktop verification, use `frontend/tool/test_windows_and_restore.ps1`. A direct Windows integration-test run temporarily replaces the debug output's application assets with a headless test harness; the helper clears that test cache and performs a clean normal build before the executable is handed off.

## Identity flow

Registration returns HTTP 201 and deliberately does not sign the user in. Login verifies the password and creates an independent device session. The access credential remains memory-only; the renewable credential is stored by the native secure store. Startup exchanges and rotates the renewable credential before Home is shown. Logout revokes the current session when reachable and always clears local authority, with a safe warning if remote revocation cannot be confirmed.

Errors use a stable problem body with a machine-readable code, safe detail, optional field errors, and the request correlation ID. Credentials and entered values are excluded from copyable reports.

## Troubleshooting

- User-visible failures include a stable error code and `Copy error details`. Paste that safe report when requesting help; it intentionally excludes form values and secrets. The mandatory implementation convention is documented in `aidlc-docs/construction/cross-cutting-error-diagnostics.md`.
- `network_unavailable` on Windows: run `.\tool\local_stack.ps1 start`, then `.\tool\local_stack.ps1 status`. The desktop UI can run even when its API is stopped, so an open window alone does not prove the service is ready.
- Session restoration cannot reach the API: use **Retry** after the stack is healthy, or **Clear local session** to return safely to Login.
- Windows native tests: use `frontend\tool\test_windows_and_restore.ps1`; it cleans stale absolute CMake paths, tests real secure storage with an isolated synthetic key, and rebuilds the normal visible app even after a failure.
- Android build: use `frontend\tool\build_android.ps1`; the project requires AGP 9.1.1 and Android API 37.0 while still supporting devices from API 24.
- DBeaver cannot connect: run `.\tool\local_stack.ps1 viewer-start` and use port `55432`, not PostgreSQL's default Windows port. Accept DBeaver's PostgreSQL driver download if prompted.
- `503` from `/health/ready`: confirm PostgreSQL is healthy, migrations ran, and the COP seed exists.
- Port already in use: change `API_PORT` in the local `.env` and supply the matching `FINANCE_AI_API_BASE_URL` to the client.
- Existing volume lacks `finance_ai_test`: the initialization script runs only for a new PostgreSQL volume. Recreate only the disposable local volume, or create that test database manually.
- Never reuse `change-me-local` credentials outside local development; production configuration rejects them.
