# UOW-02 Secure Sessions — Code Summary

## Result

HU-002 is implemented as a complete Android/Windows identity slice. A registered user can log in with a generic invalid-credential failure, enter a protected Home placeholder, restore a rotating renewable session after an app restart, recover safely from an invalid or unavailable session, and log out without retaining access to protected screens. Registration still does not sign the user in. Financial CRUD, synchronization, QR transfer, hosted infrastructure, and product AI remain absent.

## Executable Areas

- `backend/`: opaque access and renewable credentials, hash-only PostgreSQL persistence, adaptive password verification, layered throttles, replay-family revocation, bounded session cleanup, protected current-user resolution, safe structured errors/logging, migrations, OpenAPI, and tests.
- `frontend/`: one shared Flutter client for Android and Windows with Login, restoration bootstrap, protected Home, Logout, native secure storage for only the renewable credential, memory-only access credentials, and safe copyable diagnostics.
- `compose.yaml`: the normal private database and loopback API plus test-only backend and Flutter integration services. The Flutter end-to-end flow uses an internal API connected to `finance_ai_test`, never the normal local database.
- `.github/workflows/ci.yml`: real PostgreSQL backend gates, shared Flutter coverage and Android build, and Windows native auth/secure-storage tests followed by restoration of the normal application bundle.

## Session and Security Decisions

- Access credentials are opaque, expire after 15 minutes, remain in client memory only, and are stored server-side only as SHA-256 hashes.
- Renewable credentials are opaque, rotate on every refresh, have a 30-day idle and 90-day absolute limit, use native Android/Windows secure storage, and are stored server-side only as hashes.
- Reuse of a consumed renewable credential revokes its session family. Logout is idempotent, revokes when reachable, always clears local authority, and reports an explicit safe warning when remote revocation cannot be confirmed.
- Each device receives an independent session. A user retains at most ten active sessions; deterministic oldest-session eviction is enforced transactionally.
- Unknown email and incorrect password use the same generic response and real/dummy Argon2 verification path. Login, refresh, and registration have independent bounded throttles.
- Public routes are explicit. Protected routes resolve authority server-side from the presented access credential; user or session identifiers supplied by the client do not grant authority.
- Every user-visible failure uses the shared diagnostic contract with a stable code, operation, UTC time, platform, sanitized API location, correlation ID, and allow-listed reason. Passwords, emails, raw credentials, hashes, headers, request bodies, URLs with query/credentials, SQL, stack traces, environment values, and raw exceptions are excluded.

## Verification Evidence — 2026-08-31

- Preserved normal database: upgraded from `0002_uow02` to `0003_uow02_constraint_names`; exactly 4 existing users remained, with 0 residual sessions.
- Fresh/current migration and repeatable seed: passed. Alembic model drift reports `No new upgrade operations detected` after canonical constraint-name repair.
- Real PostgreSQL integration/concurrency subset: 9 passed, including fresh migration, canonical constraints, hash-only rows, Login/access/refresh/replay/Logout, concurrent same-token refresh, and 12 concurrent logins leaving exactly 10 active sessions.
- Backend full suite: 73 passed on Python 3.14.7 and PostgreSQL 18.6; 89.60% branch-aware coverage against an 80% gate.
- Backend format, Ruff, and strict mypy: 61 files formatted, lint clean, 42 source files type-clean.
- Generated OpenAPI: byte-for-byte current; SHA-256 `6287936FD43909E9743A6AB29FC26D946C02E5A21CFA120A747B5CE7CE69A617`.
- Python dependency audit: no known vulnerabilities; the local unpublished package was correctly skipped.
- Live loopback flow: Register 201, Login 200, current user 200, refresh 200, prior access 401, replayed renewable credential 401 with family revocation, second Login 200, Logout 204, and post-Logout access/refresh 401. Safe failures contained no entered password or issued credential.
- Flutter shared format/analyze/tests: 32 files unchanged by formatting, no analyzer issues, 41 tests passed, 87.31% line coverage.
- Real isolated Flutter → FastAPI → PostgreSQL flow: 1 passed, covering Register → Login → protected Home → app restart/session restoration → Logout → protected Home removal. Its synthetic `flutter-*` account was deleted afterward from `finance_ai_test`.
- Native Windows integration: 4 passed, covering registration, safe copyable failure, Login/Home/Logout, and real Windows secure-storage read/replace/delete with an isolated synthetic key.
- Windows handoff and launch guard: four native tests passed, the test cache was deleted, and the normal visible bundle was rebuilt cleanly. Direct launch displayed the Login window; a second launch reused it and the process count remained one. The runner resolves its bundle from the executable directory and reports stable native errors for missing assets or a 15-second first-frame timeout. `finance_ai.exe` exists at 592,896 bytes.
- Android debug build: passed; `app-debug.apk` exists at 172,556,964 bytes.
- Read-only DBeaver mode: hash-free session metadata was readable through `finance_ai_view`; direct access to `public.app_user` was denied. Viewer mode was closed afterward.
- Final local topology: API and PostgreSQL healthy; API published only at `127.0.0.1:8000`; PostgreSQL has no host port; DBeaver port `55432` is closed; the internal integration API is stopped.
- Compose integration harness: Linux `libsecret` development support was added for the secure-storage plugin, and generated Windows artifacts were excluded from its build context, reducing source transfer from about 327 MB to about 10 KB.

## HU-002 Acceptance Evidence

1. **Successful login:** proven by API, Flutter widget/native, live loopback, and real end-to-end tests.
2. **Invalid credentials:** generic and account-enumeration-safe behavior proven by API and Flutter tests.
3. **Session restoration:** renewable rotation, secure replacement ordering, app restart, and protected Home restoration proven across shared, native-storage, backend, and real end-to-end tests.
4. **Expired or revoked session:** fail-closed clearing and Login redirect proven by session-policy/service/API/controller/router tests, including replay-family revocation.
5. **Logout:** server revocation, local deletion, idempotency/offline warning, and protected-route denial proven by backend, Flutter, native Windows, live loopback, and real end-to-end tests.

## Extension Compliance

### Security Baseline

| Rule | Status | Evidence or applicability |
|---|---|---|
| SECURITY-01 | N/A for local prototype deployment | Hosted encrypted storage and TLS are deployment-stage controls; no hosted target exists. Credentials are nevertheless hash-only at rest and never exposed by the viewer. |
| SECURITY-02 | N/A | No load balancer, gateway, or CDN exists. |
| SECURITY-03 | Compliant for application scope | Structured JSON logging carries timestamp/level/correlation context and excludes secrets/PII; centralized hosted retention is N/A until deployment. |
| SECURITY-04 | N/A | The API serves JSON, not HTML pages. |
| SECURITY-05 | Compliant | Typed bounded schemas, request-size guards, allow-listed formats, and parameterized SQL are verified. |
| SECURITY-06 | Compliant | The DBeaver role is read-only and limited to password/hash-free views. |
| SECURITY-07 | Compliant | PostgreSQL is private; the API is loopback-only; the test API is internal-only. |
| SECURITY-08 | Compliant | Public routes are explicit; protected endpoints validate server-side credentials and deny by default. |
| SECURITY-09 | Compliant for local scope | Safe production errors and supported pinned runtimes are present; disposable local defaults are rejected outside local/test. |
| SECURITY-10 | Compliant for current scope | Python/Flutter locks, immutable CI actions, pinned base images, and dependency audit are present; deployment SBOM is N/A. |
| SECURITY-11 | Compliant | Auth logic is isolated, layered, throttled, and includes replay/brute-force misuse cases. |
| SECURITY-12 | Compliant for user-session scope | Argon2id, common-password denial, throttling, expiration, rotation, and Logout invalidation are verified. Cookie controls and administrative MFA are N/A because credentials use headers/native storage and no admin accounts exist. |
| SECURITY-13 | Compliant for current scope | Untrusted JSON is schema-validated and dependency artifacts are checksum/lock pinned; financial audit history belongs to later stories. |
| SECURITY-14 | N/A for local prototype deployment | Hosted alerting, tamper-evident storage, and retention are operations-stage controls; local auth outcomes are observable without secrets. |
| SECURITY-15 | Compliant | Global safe errors, rollback/resource cleanup, fail-closed authority, and copyable safe diagnostics are verified. |

No blocking security finding remains for HU-002.

### Property-Based Testing — Partial Mode

- PBT-02: credential base64url encode/decode round trips pass for generated exact-byte inputs.
- PBT-03: generated credential format, hash-only, expiry, rotation/replay, session-limit, and diagnostic invariants pass.
- PBT-07: reusable constrained strategies generate domain-valid credentials/session values and adversarial diagnostic samples.
- PBT-08: Hypothesis shrinking and reproducible failure output remain enabled and run in CI.
- PBT-09: Hypothesis is locked in the Python dependency set and integrated with Pytest.

No blocking PBT finding remains under the approved partial enforcement mode.

## Operational Notes

- Docker Desktop 4.88.1 on Windows build 26200 encountered the upstream stale AF_UNIX reparse-point startup defect. Recovery preserved generated runtime folders under timestamped backups and did not reset images, containers, volumes, or Finance AI data.
- Docker's current upstream workaround is to preserve/rename the stale runtime folders and disable Docker Desktop's unrelated `EnableDockerAI` feature until the open Windows defect is fixed. This setting is outside the Finance AI repository and was not changed silently.
- A prior Windows debug bundle could remain as a headless integration-test harness because the restoration build reused its cache. The Windows helper now performs a clean restoration, retains the CMake cache's temporary drive letter when possible, and the native runner enforces one visible desktop instance with copyable stable startup codes.
- The normal local stack is intentionally left running for testing. Use `tool/local_stack.ps1 status`, `viewer-start`, `viewer-stop`, and `stop`; normal stop preserves the PostgreSQL volume.
- Clean setup and peer review by another team member remain team Definition-of-Done activities before merge.
