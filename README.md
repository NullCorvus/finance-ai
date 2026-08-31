# Finance AI

Finance AI is a manual-first personal budgeting application. Users will always be able to manage their finances through ordinary forms. Optional AI assistance will be added later to propose values for those same forms; it will not replace the application, validation, or database.

This repository is the project hub. It owns product documentation, architecture decisions, delivery history, and the optional local orchestration that connects the two code repositories.

## Repository map

| Repository | Responsibility |
|---|---|
| [`NullCorvus/finance-ai`](https://github.com/NullCorvus/finance-ai) | Documentation, backlog, architecture, decisions, and cross-repository local stack |
| [`Maicol2363/finance-ai-backend`](https://github.com/Maicol2363/finance-ai-backend) | FastAPI, PostgreSQL models/migrations/seeds, OpenAPI contract, and backend tests |
| [`Maicol2363/finance-ai-frontend`](https://github.com/Maicol2363/finance-ai-frontend) | Shared Flutter client for Android and Windows, secure local storage, and client tests |

Keep the three repositories beside one another so the orchestration defaults work without configuration:

```text
Finance App/
├── finance-ai/
├── finance-ai-backend/
└── finance-ai-frontend/
```

See [`docs/REPOSITORIES.md`](docs/REPOSITORIES.md) for ownership and change rules.

## Implemented scope

- Account registration
- Login, automatic session restoration, and logout
- PostgreSQL users, starter catalogs, and hash-only session/credential history
- COP as the initial preference, with COP and USD reference data
- Argon2id password hashing, throttling, correlation IDs, and safe problem responses
- Shared Android and Windows Flutter client
- Copyable, privacy-safe error reports

Personal defaults, accounts, movements, budgets, calendars, synchronization, and AI remain later stories.

## Local development stack

Prerequisites: Docker Desktop with Compose and all three repositories in the sibling layout above.

```powershell
Copy-Item .env.example .env
.\tool\local_stack.ps1 start
```

The API is available at `http://127.0.0.1:8000`, with interactive documentation at `http://127.0.0.1:8000/docs`. PostgreSQL remains private inside Docker. Startup builds the sibling backend repository, applies migrations, and loads repeatable reference data.

Useful commands:

```powershell
.\tool\local_stack.ps1 status
.\tool\local_stack.ps1 stop
.\tool\local_stack.ps1 viewer-start
.\tool\local_stack.ps1 viewer-stop
docker compose --profile integration run --rm flutter-integration
```

The integration profile builds both sibling code repositories and verifies Register → Login → restore → Logout against an isolated test database.

If the repositories use different local locations, set `FINANCE_AI_BACKEND_PATH` and `FINANCE_AI_FRONTEND_PATH` in `.env`.

## Read-only DBeaver access

Run `.\tool\local_stack.ps1 viewer-start`, then connect with:

| Field | Value |
|---|---|
| Host | `127.0.0.1` |
| Port | `55432` |
| Database | `finance_ai` |
| Username | `finance_ai_viewer` |
| Password | `change-me-viewer-local` unless changed in `.env` |

Open `finance_ai` → `Schemas` → `finance_ai_view` → `Views`. The viewer is read-only and cannot query base tables containing password or credential hashes. Run `.\tool\local_stack.ps1 viewer-stop` when inspection is finished.

## Work in a code repository

Backend checks are run from `finance-ai-backend`:

```powershell
uv sync --all-groups --frozen
uv run ruff format --check .
uv run ruff check .
uv run mypy src
uv run pytest --cov=finance_ai --cov-report=term-missing
```

Flutter checks are run from `finance-ai-frontend`:

```powershell
.\tool\verify_shared.ps1
.\tool\build_android.ps1
.\tool\test_windows_and_restore.ps1
```

The Windows executable is generated at `finance-ai-frontend/build/windows/x64/runner/Debug/finance_ai.exe`. Keep it beside the generated `data` and DLL files; distribute the containing `Debug` or release folder, not the `.exe` by itself.

## Identity behavior

Registration deliberately does not log the user in. Login creates an independent device session. The short-lived access credential remains in memory; only the rotating renewable credential is stored in Android/Windows secure storage. Startup rotates it before showing Home. Logout revokes the current session when reachable and always clears local authority.

Errors use stable machine-readable codes, safe messages, and request correlation IDs. Passwords, credentials, entered form values, raw exceptions, and database details are excluded from copyable reports.

## Troubleshooting

- `network_unavailable`: run `.\tool\local_stack.ps1 start`, then `.\tool\local_stack.ps1 status`.
- `[LOCAL_STACK_BACKEND_MISSING]` or `[LOCAL_STACK_FRONTEND_MISSING]`: place the repositories beside this one or configure their paths in `.env`.
- Session restoration cannot reach the API: use **Retry** after the stack is healthy, or **Clear local session** to return safely to Login.
- DBeaver cannot connect: use `viewer-start` and port `55432`, not PostgreSQL's default host port.
- `503` from `/health/ready`: confirm PostgreSQL is healthy, migrations ran, and the COP seed exists.
- Port already in use: change `API_PORT` in `.env` and pass the matching API base URL to the client.
- Never reuse the `change-me-*` local credentials outside disposable local development.
