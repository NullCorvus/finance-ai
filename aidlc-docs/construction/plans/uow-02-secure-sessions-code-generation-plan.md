# UOW-02 Secure Sessions — Code Generation Plan

## Status and Approval Boundary

This is the single implementation checklist for HU-002. It deliberately replaces further speculative documentation: Infrastructure Design is skipped because the approved local API/PostgreSQL/Android/Windows topology does not change. The user approved this complete plan on 2026-08-30 and generation is now in progress.

After approval, work moves directly into application code, migration, tests, builds, and executable verification. Each checkbox is marked immediately when its work and proportional verification finish.

## Unit Context and Traceability

| Item | Scope |
|---|---|
| Delivery slice | UOW-02 Secure Sessions, HU-002 only |
| Story | As a returning user, I want a secure session so that I can access my financial data without signing in on every app launch |
| Dependency | Completed HU-001 registration and EN-001 through EN-006 foundation |
| Success | Login -> protected Home; restart restores through rotated renewable credential; invalid/revoked session returns to Login; Logout revokes/clears and blocks Home |
| Targets | One shared Flutter client on Android and Windows, one FastAPI API, one PostgreSQL database |
| Explicitly excluded | HU-003 preferences, financial CRUD, offline financial storage/sync, QR transfer, password recovery/change, MFA, remote session management, hosted infrastructure, product AI |

### HU-002 Acceptance Mapping

| Criterion | Planned proof |
|---|---|
| AC1 Successful Login | Backend Login integration plus Flutter Login -> protected Home end-to-end |
| AC2 Generic invalid credentials | Unknown/wrong/inactive API and UI cases share status/code/message and broad Argon path |
| AC3 Session restoration | Native secure-store plus refresh rotation on app/bootstrap restart |
| AC4 Invalid/expired/revoked restoration | Credential deletion, Login redirect, protected denial |
| AC5 Logout | Server current-session revocation, local deletion, route/provider clearing, offline warning |

## Existing Code Modified In Place

- `backend/src/finance_ai/` and `backend/tests/` — extend the existing auth, error, rate-limit, observability, database, Unit of Work, and API structure.
- `backend/migrations/versions/` and `backend/openapi.json` — add one ordered session migration and regenerate the contract.
- `frontend/lib/`, `frontend/test/`, and `frontend/integration_test/` — replace the Login placeholder and add session/storage/protected-routing behavior without forking Android and Windows code.
- `frontend/pubspec.yaml`, `frontend/pubspec.lock`, and Android runner configuration — add the sole secure-storage dependency and required platform safeguards.
- `.github/workflows/ci.yml`, `compose.yaml`, `.env.example`, safe DBeaver SQL, and human setup/troubleshooting documentation — extend only where HU-002 configuration/evidence requires it.

Markdown implementation evidence belongs only in `aidlc-docs/construction/uow-02-secure-sessions/code/`. Application/configuration files remain outside `aidlc-docs/`.

## Planning Completion Checklist

- [x] Load HU-002 functional, NFR Requirements, NFR Design, story, dependency, security, PBT, diagnostics, and network-boundary inputs.
- [x] Audit the exact current backend/frontend/migration/test/CI files to modify in place.
- [x] Confirm Infrastructure Design is inapplicable: no deployment target or running service/network/storage component changes.
- [x] Resolve the only new dependency direction (`flutter_secure_storage` 11) and its Android/Windows preflight gates.
- [x] Preserve UOW-01 contracts, local database data, private PostgreSQL, opt-in read-only DBeaver mode, and normal Windows executable handoff.
- [x] Define the sequential generation and verification steps below as the single source of truth.

## Generation Steps

### Step 1 — Preflight, Baseline, and Dependency Proof

- [x] Preserve user changes and record the pre-change Git/workspace state without cleaning unrelated files.
- [x] Run the current locked backend and Flutter fast quality baselines so HU-002 does not absorb an existing failure.
- [x] Recheck `flutter_secure_storage` 11's official release/security/platform requirements; resolve the exact compatible package/transitive versions into `frontend/pubspec.yaml` and `frontend/pubspec.lock` only after review.
- [x] Verify Flutter 3.47.2/Dart 3.13.2, Android API 24/compile SDK requirement, Windows C++ ATL/plugin build support, and current Docker/PostgreSQL health.
- [x] Confirm the normal API remains loopback-only, PostgreSQL remains private, the opt-in DBeaver mode remains reversible/read-only, and no data volume is reset.

### Step 2 — Shared Backend Auth Configuration and Safe Boundaries

- [x] Extend `backend/src/finance_ai/core/config.py`, `.env.example`, and `compose.yaml` with bounded lifetimes, session limit/retention, Login/renewal throttles, and a dedicated HMAC limiter secret; reject disposable secret/insecure settings outside local/test.
- [x] Refactor `backend/src/finance_ai/core/errors.py` and request validation so registration keeps its approved stable codes while HU-002 gains `request_invalid`, `invalid_credentials`, `login_rate_limited`, `session_invalid`, and `authentication_required` plus safe Bearer/no-store headers.
- [x] Generalize `backend/src/finance_ai/core/rate_limit.py`, middleware, logging, and observability for operation-specific auth limits/outcomes without raw email, passwords, credentials, token hashes, Authorization headers, or raw exceptions.
- [x] Extend readiness to fail closed for invalid session configuration, Argon verifier/dummy hash, randomness prerequisites, or missing current schema.
- [x] Add/adjust focused shared unit tests proving configuration bounds, registration compatibility, throttle isolation/Retry-After, correlation propagation, safe output, and no secret leakage.

### Step 3 — PostgreSQL Session Schema, Migration, and Safe Viewer

- [x] Add `UserSession` and `RenewableCredential` SQLAlchemy models under `backend/src/finance_ai/db/models/` with timezone-aware lifecycle fields, hash/link/time constraints, foreign keys, relationships, and no raw-token column.
- [x] Create `backend/migrations/versions/0002_uow02_secure_sessions.py` with unique access/renewable hash indexes, user active-session/oldest lookup index, renewable session-history index, and deterministic upgrade from the current UOW-01 schema.
- [x] Add session/user/renewable repository and Unit of Work adapters under `backend/src/finance_ai/db/repositories/` and `backend/src/finance_ai/db/`, keeping commits exclusively in application services and lock order explicit.
- [x] Add bounded idempotent terminal-session cleanup behavior without a scheduler or background worker.
- [x] Extend `infrastructure/postgres/dbeaver-readonly.sql` with hash-free session metadata only; prove the viewer still cannot read base tables, password hashes, or credential hashes.
- [x] Verify empty/current database migration, Alembic model drift, indexes/constraints, repeatability, existing data preservation, and no raw credential persistence.

### Step 4 — Credential, Password, Policy, and Application Services

- [x] Add strict credential codec/generator/hasher and HMAC account pseudonymizer using Python standard-library CSPRNG/base64/SHA-256/HMAC primitives with injected deterministic test boundaries.
- [x] Extend the existing PasswordHasher with real/dummy verification and rehash preparation while preserving registration hashing/common-password behavior.
- [x] Add typed session commands/results/principal, repository protocols, clock, and SessionPolicy for 15-minute access, 30-day idle, 90-day absolute, ten active sessions, deterministic oldest eviction, and retention cutoff.
- [x] Implement Login snapshot -> real/dummy verification -> optional rehash preparation -> locked user revalidation -> one atomic session creation transaction.
- [x] Implement indexed access-principal resolution, current-user projection, atomic renewable rotation, consumed-token replay family revocation, current-session idempotent Logout, and bounded cleanup.
- [x] Ensure raw credentials exist only in request/issued-result scope and every configuration/database/generation/hash failure denies authority and rolls back safely.

### Step 5 — Authentication API and OpenAPI Contract

- [x] Add typed request/response schemas and dependency wiring without exposing password/token hashes, internal session state, or accepting authority-bearing user/session identifiers.
- [x] Add `POST /api/v1/auth/login`, `POST /api/v1/auth/refresh`, `GET /api/v1/auth/me`, and `POST /api/v1/auth/logout` through thin FastAPI routes/application services.
- [x] Enforce JSON/body/header bounds, correct public/protected classification, layered throttles, Bearer parsing, `Cache-Control: no-store`, `WWW-Authenticate: Bearer`, correlation headers, and documented 200/204/4xx/5xx problems.
- [x] Preserve `POST /api/v1/auth/register` behavior and prove registration still issues no session.
- [x] Regenerate/commit `backend/openapi.json` and verify all Flutter-consumed shapes/status/header assumptions through contract tests.

### Step 6 — Backend Example, Property, Security, and Concurrency Tests

- [x] Add unit tests for codec/generator/hash, dummy/real password behavior, session/expiry/limit policy, HMAC limiter key, Login/refresh/access/Logout/cleanup services, and every typed failure.
- [x] Add Hypothesis tests for exact-byte base64url round trip and credential format, hash/expiry/rotation-chain/replay/session-limit/diagnostic invariants with reusable strategies, shrinking, reproduction output, and permanent regressions.
- [x] Add API tests for every endpoint/status/schema/header, generic credentials, throttling, malformed/oversized values, inactive users, correlation, non-cacheability, protected denial, and public secret exclusion.
- [x] Add real PostgreSQL integration/concurrency tests for migration, hash-only rows, atomic Login, rehash, ten-session eviction, access lookup, expiry boundaries, same-token double refresh, replay revocation, Logout/refresh races, rollback, cleanup, and safe views.
- [x] Extend log/diagnostic secret-scanning tests with generated email/password/access/renewable/hash/header/query/multiline/platform-exception samples.
- [x] Pass backend format, Ruff, strict mypy, Alembic upgrade/check, OpenAPI drift, full Pytest/PostgreSQL suite, at least 80 percent coverage, and dependency audit.

### Step 7 — Flutter Auth Domain, API, and Native Secure Storage

- [x] Add `flutter_secure_storage` exactly through the reviewed lock; set Android minimum/compile requirements and `android:allowBackup="false"` without biometric permission or plaintext fallback.
- [x] Generalize `frontend/lib/core/api/api_client.dart` for typed GET/POST, optional/204 bodies, Bearer headers, response headers, 15-second timeouts, stable transport failures, and no secret-bearing diagnostics while preserving registration.
- [x] Add immutable public user/session/failure models and `AuthRepository` for Login/refresh/me/Logout under the shared auth feature.
- [x] Add a narrow `SecureCredentialStore` interface and real Android/Windows adapter for serialized read/replace/delete of one renewable value; access remains memory-only.
- [x] Add application-lifetime `AuthSessionController` and single-flight refresh coordinator with Checking, Unauthenticated, Submitting, Authenticated, RestorationRetry, and LoggingOut transitions.
- [x] Publish authenticated state only after secure replacement succeeds; handle storage failure with secret clearing, best-effort revocation, and safe copyable diagnostics.

### Step 8 — Flutter Login, Protected Home, Restoration, and Logout UI

- [x] Replace the Login placeholder with the approved email/password manual form, visibility control, local/server guidance, submitting state, generic invalid-credential behavior, registration success notice, stable keys, and copyable diagnostic panel.
- [x] Update `FinanceApp`/go_router integration with a blocking authentication bootstrap and deterministic public/protected redirects that never flash or preserve Home without authority.
- [x] Add the minimal protected Home placeholder with public user context and accessible Logout; do not add preferences, financial, synchronization, QR, or AI UI.
- [x] Add restoration progress/retry/clear-local-session behavior and an offline-Logout remote-unconfirmed warning using shared safe diagnostics.
- [x] Ensure Windows keyboard/resizing and Android touch/text-scaling accessibility, focus order, labels, progress, non-color-only errors, and back-navigation protection.

### Step 9 — Flutter Unit, Widget, Contract, and Native Tests

- [x] Add failure-capable fake API/secure-store tests for Login controller, auth state transitions, secure publish ordering, transport-vs-invalid restoration, storage failures, single-flight renewal, one retry, and online/offline Logout.
- [x] Add widget/router tests for Login validation/generic errors/loading/accessibility, bootstrap states, protected redirects, Home/Logout, warning/copy actions, stable keys, and no secret in state/debug/clipboard reports.
- [x] Add API repository/contract tests for every status/body/header, 204 handling, correlation propagation, timeout/invalid JSON, Authorization placement, and registration compatibility.
- [x] Extend the real Flutter -> FastAPI -> PostgreSQL flow through Register -> Login -> me -> forced renewal/restoration -> Logout -> protected denial.
- [x] Add synthetic real secure-storage read/replace/restart/delete smoke coverage on native Android/Windows where the harness supports it; clean all synthetic values and never print them.
- [x] Pass Dart format, Flutter analyze, all shared tests with at least 80 percent coverage, Android debug build, native Windows tests, and normal Windows rebuild/restoration.

### Step 10 — CI, Documentation, Full Verification, and Handoff

- [x] Extend `.github/workflows/ci.yml` with HU-002 PostgreSQL concurrency/security/contract gates, secure-storage Android build, and Windows ATL/plugin/native smoke plus final normal build; keep action/image pins immutable.
- [x] Update root/backend/frontend README and the cross-cutting diagnostics guide with start/test/Login/restore/Logout, Android/Windows storage prerequisites, copyable errors, safe DBeaver inspection, and troubleshooting—no duplicate architecture documents.
- [x] Run the full locked backend and Flutter suites, migration/seed/drift, dependency audits, Compose readiness/private-network checks, Android build, Windows native tests/restored visible executable, and live loopback end-to-end proof.
- [x] Verify every HU-002 AC1–AC5 and NFR security/concurrency/storage/diagnostic invariant from executable evidence; do not mark tool-blocked evidence as passed.
- [x] Confirm no HU-003, financial, synchronization, QR, hosted, or AI behavior was introduced and no credential/secret appears in Git diff, database views, logs, diagnostics, screenshots, or test output.
- [x] Update `TASKS.md` only after all acceptance criteria pass, create `aidlc-docs/construction/uow-02-secure-sessions/code/code-summary.md`, mark every completed plan checkbox immediately, and leave the local stack/viewer/data in a documented safe state.

## Story Completion Rule

HU-002 is complete only when AC1–AC5 pass through the real Flutter/API/PostgreSQL boundary on the shared client, backend concurrency/security properties pass, Android and Windows builds pass, the normal visible Windows bundle is restored after native tests, and no plaintext password/raw credential is stored or exposed.

HU-003 remains unchecked and is the next separately gated story.

## Expected Result

One reviewable vertical slice: registered users can Login, reach a protected Home placeholder, restore a rotated renewable session across app restart, recover safely from network/storage/invalid-session conditions, and Logout locally/server-side on Android and Windows. The existing private local topology remains unchanged and product AI remains absent.
