# UOW-01 Foundation and Registration — Code Summary

## Result

HU-001 is implemented as the first executable vertical slice. A user can enter email, password, and confirmation in Flutter; the live FastAPI API validates and hashes the password; PostgreSQL atomically creates the user and exact starter catalogs; Flutter confirms success and navigates once to Login without creating a session. Product AI remains absent and manual entry remains the product foundation.

## Executable Areas

- `backend/`: Python 3.14.7, FastAPI, SQLAlchemy, Alembic, PostgreSQL adapters, Argon2id security, stable problems, rate/resource guards, safe observability, seeds, OpenAPI, and tests.
- `frontend/`: One Flutter 3.47.2 / Dart 3.13.2 client targeting Android and Windows, with shared Riverpod registration state, typed repository/client, accessible registration UI, Login placeholder, tests, and an optional isolated integration harness.
- `compose.yaml`: pinned PostgreSQL and non-root API runtime; PostgreSQL stays only on the internal private network while the API also joins a loopback client-access bridge, plus opt-in backend and Flutter integration test services.
- `.github/workflows/ci.yml`: immutable action revisions, real PostgreSQL backend checks, API drift/security gates, shared Flutter checks and coverage, a Windows native smoke test, and Android/Windows debug builds.

## Fixed Product and Technical Decisions

- Registration normalizes email, requires an 8–128 character confirmed password, rejects the vendored common-password corpus, and stores only Argon2id hashes.
- Success returns public ID, normalized email, COP, and a Login direction; it returns no password, hash, token, session, or catalog internals.
- One transaction creates exactly 3 categories (`Needs`, `Wants`, `Other`) and 2 income sources (`Salary`, `Other`). Accounts are the only representation of where money is held or spent from.
- COP and USD are repeatable shared seeds; COP is the initial preference.
- Login/sessions, accounts, movements, budgets, calendars, and AI are explicitly outside UOW-01.
- Registration observability uses bounded process-local counters and secret-free final outcomes: success, validation failure, duplicate conflict, throttle, configuration failure, or unexpected failure.
- User-visible client failures use a shared copyable diagnostic contract with stable code, operation, UTC time, platform, sanitized API location, request/correlation ID, and allow-listed safe reason. Reports exclude form values, secrets, URL credentials/query values, stack traces, SQL, environment data, and raw exceptions.

## Verification Evidence — 2026-08-29

- Backend formatting, Ruff lint, and strict mypy: passed.
- Backend full suite on Python 3.14.7 with real PostgreSQL 18.6: 49 passed; 91.69% coverage.
- PostgreSQL integration subset: 5 passed, including empty migration/seed, exact ownership/cardinality, staged rollback, concurrent duplicate race, and absence of later tables.
- Alembic model drift: no new upgrade operations; the COP/USD seed passed twice.
- Generated OpenAPI: unchanged after regeneration; SHA-256 `77751FB5351D0AF25AC7C715D603738B1520FAAF086744A72AF33517E88468E3`.
- Python dependency audit: no known vulnerabilities; the local package is correctly reported as not present on PyPI.
- Live API: liveness/readiness 200; registration 201; duplicate 409 with `email_already_registered`; safe correlation returned; no authentication created.
- Controlled live API persistence originally included payment-method starter rows. Migration `0005_drop_payment_method` later removed that unused catalog and current registrations create only categories and income sources.
- API runtime: UID/GID 10001, no pytest installed.
- Flutter format/analyze: passed with no changes/issues.
- Flutter unit/widget/contract/configuration/diagnostic tests: 23 passed; 91.76% coverage.
- Flutter → live API → PostgreSQL headless integration: 1 passed, including form submission, success feedback, and single Login navigation.
- Current registration persistence expects 2 users, 6 categories, and 4 income sources for two complete registration aggregates.
- Android debug build: passed; `app-debug.apk` size 191,497,044 bytes.
- Windows native smoke tests: 2 passed in the generated desktop runner, covering registration success and copyable connection failure UI.
- Windows debug build: passed; `finance_ai.exe` size 575,488 bytes with `Finance AI` product metadata.
- Windows handoff guard: `frontend/tool/test_windows_and_restore.ps1` passed and restored the normal visible application bundle after native tests; final inspection found no test-harness marker.
- Compose rendering: valid; API and database health checks passed while isolated.
- Windows host readiness: HTTP 200 through `http://127.0.0.1:8000/health/ready`; the API port is reachable and PostgreSQL has no published host port.
- Windows host registration: HTTP 201 with normalized email, COP preference, safe success message, and returned correlation ID.
- Local stack helper: `tool/local_stack.ps1 start` and `status` passed; it locates Docker Desktop even when `docker.exe` is absent from `PATH`, waits for health, validates the configured API loopback port, and rejects any published PostgreSQL host port.
- Opt-in DBeaver mode: loopback `127.0.0.1:55432` passed; `finance_ai_viewer` authenticated with transaction read-only enabled, read all 4 registrations through `finance_ai_view.registration_summary`, had SELECT denied on the password-bearing `public.app_user` table, and had INSERT denied on the safe view. API health remained ready.

## Operational Notes

- Docker Desktop 4.88.1 on this host does not publish ports from an `internal: true` network. The API therefore joins a second client-access bridge for loopback-only publishing while PostgreSQL remains solely on the internal network with no host port.
- `compose.dbeaver.yaml` is an explicit local inspection exception. `tool/local_stack.ps1 viewer-start` enables the loopback-only port and safe views; `viewer-stop` restores the private default without deleting the database volume.
- The database volume is disposable local data and is preserved by normal `docker compose down`; only `--volumes` resets it.
- A second team member must still reproduce clean setup and perform normal peer review before merge, as required by NFR-MNT-005.
