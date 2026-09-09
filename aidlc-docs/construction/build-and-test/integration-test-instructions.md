# Finance AI UOW-03 Integration Test Instructions

## Purpose

These tests exercise boundaries that mocks cannot prove: Alembic/PostgreSQL integrity, API authentication and ownership, backend/OpenAPI/Flutter compatibility, multi-session visibility, deletion concurrency, Android compilation, and native Windows behavior.

## PostgreSQL Integration Suite

The canonical Docker route creates the disposable `finance_ai_test` database through the checked-in initialization script:

```powershell
Set-Location .\finance-ai
docker compose up database --detach --wait
docker compose --profile test run --rm test pytest -m integration
```

For an existing isolated native PostgreSQL instance, create a dedicated `finance_ai_test` database and export only its URL:

```powershell
Set-Location .\finance-ai-backend
$env:FINANCE_AI_TEST_DATABASE_URL = 'postgresql+psycopg://finance_ai@127.0.0.1:55433/finance_ai_test'
uv run pytest -m integration
```

The integration fixtures downgrade and upgrade schemas. Never provide a development, shared, or production database URL.

Expected scenarios include:

- migration/model/constraint agreement;
- confirmed-only balance aggregation and permanent currency lock;
- inactive-name reuse and authoritative reactivation conflicts;
- owner-scoped queries and composite movement ownership;
- unused deletion and blocking for pending, confirmed, and voided movements;
- concurrent movement insertion/account deletion with no orphan or cascade;
- concurrent normalized-name creation with exactly one active winner;
- index-backed owner-list and balance query plans.

## Authenticated API and Cross-Session E2E

Against a freshly migrated disposable API/database:

1. Register one synthetic user and log in from session A.
2. Create an account with an explicit supported currency and signed opening balance.
3. Verify list/detail/edit/deactivate/reactivate from session A.
4. Log in from session B and verify the same updated server-authoritative record.
5. Delete the unused account from session B; verify session A next lists it as absent and detail returns the same `404` as a foreign identifier.
6. Create an account with an internal test movement and verify DELETE returns `409 account_delete_blocked` without exposing financial values.
7. Confirm an invalid or expired access credential refreshes at most once in the Flutter repository and never repeats an uncertain mutation automatically.

The Docker cross-boundary identity flow is available through:

```powershell
Set-Location .\finance-ai
docker compose --profile integration run --rm flutter-integration
```

The account-specific API lifecycle is also covered by backend API/integration suites and the Windows native account smoke path.

## Contract and Security Verification

```powershell
Set-Location .\finance-ai-backend
$before = (Get-FileHash .\openapi.json -Algorithm SHA256).Hash
uv run python scripts\export_openapi.py
$after = (Get-FileHash .\openapi.json -Algorithm SHA256).Hash
if ($before -ne $after) { throw 'OpenAPI drift detected.' }
uv run pip-audit
```

Review the generated contract against the Flutter repository models. Verify authentication on every account route, identical foreign/missing `404`, stable `account_delete_blocked`, request/correlation propagation, `Cache-Control: no-store`, bounded bodies, and diagnostic reports free of secrets and financial values.

## Android and Windows Integration

```powershell
Set-Location .\finance-ai-frontend
.\tool\build_android.ps1
.\tool\test_windows_and_restore.ps1
```

The Windows helper must finish with `[WINDOWS_APP_READY]`. Its four native smoke tests cover secure storage, copyable safe failures, protected Home/session behavior, and account create/delete behavior. Confirm the final executable is the restored normal client, not the temporary harness.

## Cleanup

Stop test-only containers with `docker compose down` when Docker was used. For native PostgreSQL, drop only the explicitly verified `finance_ai_test` database after the test API and test connections have stopped. Keep the normal local application database and the user's running client untouched.
