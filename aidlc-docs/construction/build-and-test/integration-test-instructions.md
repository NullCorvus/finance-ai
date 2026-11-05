# Integration Test Instructions

## Android Client to API

The CI integration job starts a disposable PostgreSQL database and backend from the pinned backend source commit, waits for `/health/ready`, then boots an Android API 35 emulator. Emulator requests reach the runner's API through `http://10.0.2.2:8000`.

The existing `integration_test/register_flow_test.dart` is enabled with `RUN_REAL_AUTH_FLOW_TEST=true`. It checks registration, login, renewable-session restoration after app recreation, and logout. It uses an in-memory credential-store override, so it does not verify Android's native secure-storage plugin.

For local runs, first start the backend using the backend repository's Compose file with a disposable database, then run:

```bash
flutter test integration_test/register_flow_test.dart -d <android-emulator-id> --dart-define=RUN_REAL_AUTH_FLOW_TEST=true --dart-define=FINANCE_AI_API_BASE_URL=http://10.0.2.2:8000
```

Use `localhost` or the host's reachable LAN address as appropriate when testing on a physical Android device. Never point this test at production; registration creates a real account in its configured database.

## Backend

The backend's own CI provisions PostgreSQL and runs migration/seed/model-drift checks, generated OpenAPI verification, API/unit tests, lint/type checks, package builds, and dependency audit. The frontend emulator job complements those checks by exercising one real app-to-API path.

## Verification Record

The pinned backend image was built locally and `/health/ready` returned `{"status":"ready"}` with a disposable PostgreSQL database. The host has no Android emulator or Linux desktop project, so the Android device-level flow must be confirmed by the first GitHub Actions run.
