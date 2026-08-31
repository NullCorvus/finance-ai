# UOW-02 Secure Sessions — NFR Requirements

## Status and Boundary

This document defines measurable quality requirements for HU-002 Login, access validation, current-user context, renewable-session restoration, and Logout. It is a construction design artifact, not application code.

| Defined here | Created only after Code Generation planning is approved |
|---|---|
| Capacity and latency targets, credential/security parameters, platform protection, reliability, observability, quality, and test gates | Session tables/migration, endpoints/services, Flutter state/screens, secure-storage dependency/configuration, tests, locks, and generated OpenAPI changes |

HU-003 preferences, password recovery/change, email verification, MFA, remote device management, financial records, local financial storage/synchronization, QR transfer, hosted infrastructure, and product AI remain outside UOW-02.

## Reference Environment and Capacity

The reference environment remains a Windows development machine with at least four logical CPU cores, 8 GB system memory, and 4 GB available to local containers. Measurements exclude first-time SDK/dependency/image downloads and cold database initialization.

| ID | Requirement |
|---|---|
| NFR-CAP-U02-001 | The reference dataset contains at least 50 registered active users and at least 100 simultaneously active Android/Windows session families distributed across them. |
| NFR-CAP-U02-002 | Login, access validation, renewal, current-user, and Logout support 10 concurrent test clients without duplicate issuance, double renewal, partial state, connection exhaustion, or unhandled error. |
| NFR-CAP-U02-003 | The reference mixed load is 60 successful/expected-rejection authentication operations per minute, including at least 10 Login, 30 protected/current-user, 15 renewal, and 5 Logout operations. Security throttles are measured separately and are never weakened merely to pass load tests. |
| NFR-CAP-U02-004 | One user never has more than 10 active session families after a Login transaction commits; deterministic oldest-session eviction remains correct under concurrent Login attempts. |
| NFR-CAP-U02-005 | The architecture remains one modular FastAPI process and one PostgreSQL database for the local prototype. HU-002 does not authorize Redis, queues, microservices, multiworker claims, or autoscaling. |
| NFR-CAP-U02-006 | Before multi-instance or hosted deployment, the team must reassess shared throttling, connection capacity, TLS, key/secret management, backup, alerting, cleanup scheduling, and availability. |

## Performance and Timeouts

Latency is measured at the API boundary on a warm reference environment. Login includes configured Argon2id verification; security parameters may not be weakened solely to meet latency.

| ID | Requirement |
|---|---|
| NFR-PERF-U02-001 | Login, Logout, restoration retry, and form-validation interactions show visual state change within 100 ms of user action. |
| NFR-PERF-U02-002 | `POST /api/v1/auth/login` has p95 latency at or below 2 seconds and p99 at or below 4 seconds under the reference load, for both valid and generic invalid credential paths. |
| NFR-PERF-U02-003 | An indexed access validation plus `GET /api/v1/auth/me` has p95 latency at or below 250 ms and p99 at or below 500 ms under the reference load. |
| NFR-PERF-U02-004 | `POST /api/v1/auth/refresh` and `POST /api/v1/auth/logout` have p95 latency at or below 500 ms and p99 at or below 1 second, excluding a deliberate Login password-verification path. |
| NFR-PERF-U02-005 | Credential hashing/index lookup does not scan session history or AppUser rows under the reference dataset; database query plans use the unique credential-hash indexes. |
| NFR-PERF-U02-006 | Flutter uses a bounded 15-second timeout for each authentication network attempt. It never retries Login, renewal, or Logout recursively; an eligible protected request retries at most once after one shared renewal. |
| NFR-PERF-U02-007 | Startup enters visible `Checking` within 100 ms. On healthy loopback, secure-store read plus renewal and route resolution targets completion within 2 seconds at p95. |

## Availability, Reliability, and Recovery

No uptime percentage, multi-zone promise, or disaster-recovery SLA applies to the local prototype.

| ID | Requirement |
|---|---|
| NFR-REL-U02-001 | Existing liveness/readiness separation remains. Readiness is false when database access, required auth configuration, Argon2id verification, credential generation, or required schema prerequisites cannot operate safely. |
| NFR-REL-U02-002 | With required images/dependencies available, API and database remain ready within the existing 90-second clean-start target. |
| NFR-REL-U02-003 | Login session creation, active-session limiting, optional password rehash, and initial renewable history commit once or fully roll back. |
| NFR-REL-U02-004 | Renewal locks the relevant state and commits consumption, replacement, access update, idle update, and replay revocation atomically. Two concurrent uses of one credential produce at most one issuance success. |
| NFR-REL-U02-005 | Logout/renewal and concurrent Login-limit races resolve through database transaction/constraint authority; once revocation commits, no later transaction reactivates the session. |
| NFR-REL-U02-006 | Database sessions, locks, HTTP clients, and temporary secret values are released on success, expected 4xx, timeout, storage failure, cancellation, and unexpected failure. |
| NFR-REL-U02-007 | Transport failure during restoration retains the renewable credential and denies Home; authoritative invalid-session failure deletes it. The two outcomes must never share one destructive fallback. |
| NFR-REL-U02-008 | Secure-storage write failure after server issuance/rotation leaves Flutter unauthenticated, clears partial local state, and performs best-effort server revocation without exposing the credential. |
| NFR-REL-U02-009 | Reapplying migrations from an empty/current UOW-01 database is deterministic. Rollback/down behavior follows the existing migration policy and never leaves plaintext credentials. |
| NFR-REL-U02-010 | Corrupt/unreadable local secure storage fails closed with a safe recovery path and copyable diagnostic; it never falls back to plaintext persistence. |

## Security and Privacy

### Endpoint and Input Protection

| ID | Requirement |
|---|---|
| NFR-SEC-U02-001 | Login and renewal are deliberately public authentication endpoints; current-user and every current/future protected endpoint deny by default and require a validated AuthenticatedPrincipal. Logout accepts only its narrowly defined current-session credential behavior. |
| NFR-SEC-U02-002 | Authentication endpoints accept `application/json` only. Request bodies remain bounded at 16 KiB; unknown fields, unexpected types, control characters in bounded metadata, and oversized/malformed bearer values are rejected before expensive work. |
| NFR-SEC-U02-003 | Email normalization and password bounds remain identical to UOW-01. Passwords are not trimmed, rewritten, logged, persisted as plaintext, or sent to any external service. |
| NFR-SEC-U02-004 | Unknown email, wrong password, and inactive user return the same 401 `invalid_credentials` contract and broad Argon2id work path. A prepared dummy hash uses the same current cost settings and is unavailable to public/log output. |
| NFR-SEC-U02-005 | Unsupported methods/media types and all unexpected errors use the existing safe problem contract and correlation header, without stack traces, SQL, paths, environment values, package versions, identities, or credential state. |

### Credential Generation, Storage, and Expiration

| ID | Requirement |
|---|---|
| NFR-SEC-U02-006 | Each access and renewable credential is independently generated from exactly 32 bytes (256 bits) from Python's operating-system CSPRNG and encoded as 43-character unpadded base64url. No predictable prefix or embedded identity/claim is allowed. |
| NFR-SEC-U02-007 | PostgreSQL persists only unique lowercase 64-character SHA-256 credential hashes. Raw access/renewable credentials never enter ORM entities, database views, fixtures, logs, metrics, traces, crash output, screenshots, or diagnostics. |
| NFR-SEC-U02-008 | Access lifetime defaults to 15 minutes, renewable idle lifetime to 30 days, and absolute session lifetime to 90 days. Configuration uses bounded positive durations; server UTC enforces invalidity at `now >= expires_at`. |
| NFR-SEC-U02-009 | Renewal always rotates both raw credentials, consumes/links the predecessor, and retains the relationship. Replay of any consumed renewable credential revokes the complete session family and returns no credential. |
| NFR-SEC-U02-010 | Every protected request checks access hash, revocation, user activity, access expiry, idle expiry, and absolute expiry server-side. Client clocks, route state, and public user fields grant no authority. |
| NFR-SEC-U02-011 | Credential-bearing success responses include `Cache-Control: no-store`; bearer failures use the appropriate `WWW-Authenticate: Bearer` challenge. Credentials appear only in the Authorization header or narrowly defined JSON request/response field, never URLs. |
| NFR-SEC-U02-012 | Password rehash occurs only after successful verification and within successful Login transaction ownership. Argon2id remains at or above the existing 19 MiB, 2-iteration, parallelism-1 baseline. |

### Login and Session Abuse Controls

| ID | Requirement |
|---|---|
| NFR-SEC-U02-013 | Default Login throttling permits at most 3 attempts per 10 seconds and 10 per 60 seconds per network source, 10 per 15 minutes per pseudonymous normalized-account key, and 100 aggregate Login attempts per minute. Rejection returns 429 plus bounded `Retry-After`. |
| NFR-SEC-U02-014 | The account throttle key is HMAC-SHA-256 over the normalized email with a dedicated runtime secret of at least 32 random bytes. Raw emails and unsalted/unencrypted email digests are not limiter keys or logs. Placeholder secrets are rejected outside local/test profiles. |
| NFR-SEC-U02-015 | Renewal defaults to 60 attempts per minute per source and 300 aggregate attempts per minute. Malformed/unknown/replayed values never reveal whether a credential/session exists. |
| NFR-SEC-U02-016 | Process-local limiter state remains acceptable only for the single-instance local profile. Multiworker/hosted operation requires a shared enforcement layer before deployment claims are made. |
| NFR-SEC-U02-017 | Session identifiers, token hashes, or client metadata are not used as bearer-independent authorization factors. IP/platform changes are not automatic revocation signals in HU-002 and no persistent device fingerprint is collected. |

### Native Client Storage and Transport

| ID | Requirement |
|---|---|
| NFR-SEC-U02-018 | Flutter retains the access credential only in memory and the renewable credential only through the selected secure-storage adapter. Shared preferences, SQLite, ordinary files, Riverpod persistence, environment values, clipboard, and logs are forbidden credential stores. |
| NFR-SEC-U02-019 | Android targets API 24 or newer for the selected secure-storage version, uses its recommended RSA-OAEP/AES-GCM defaults without biometric enforcement, sets `android:allowBackup="false"`, and does not add biometric permission in HU-002. |
| NFR-SEC-U02-020 | Windows uses the selected package's AES-GCM encrypted files with its key protected by Windows Credential Manager. Required Visual Studio C++ ATL components must be present in developer/CI build environments and verified by native read/replace/delete tests. |
| NFR-SEC-U02-021 | App uninstall, OS-user change, secure-store corruption, or protected-key loss may require Login again; no insecure recovery copy is created. A package upgrade that changes storage format requires explicit migration/re-login testing before release. |
| NFR-SEC-U02-022 | HTTP is permitted only for loopback/emulator/local-Compose development. Android debug cleartext remains debug-only. Any physical-device/LAN/remote/hosted use carrying passwords or credentials requires HTTPS with certificate validation first. |
| NFR-SEC-U02-023 | PostgreSQL remains private to the internal Compose network. The opt-in DBeaver view may expose safe session metadata only and can never expose token/password hashes or base tables to the viewer role. |

### Privacy, Retention, and Cleanup

| ID | Requirement |
|---|---|
| NFR-PRV-U02-001 | HU-002 persists only user/session ownership, platform classification, credential hashes, expirations, rotation linkage, revocation state/reason, and server timestamps. It collects no device fingerprint, persistent IP/User-Agent history, contacts, financial records, synchronization content, or AI data. |
| NFR-PRV-U02-002 | Renewable history remains available through the session's absolute expiry so replay is detectable. Terminal session/history becomes cleanup-eligible 30 days after the later of revocation/absolute expiry for the local prototype. |
| NFR-PRV-U02-003 | Cleanup must preserve active/replay-relevant rows, operate in bounded batches, and be idempotent. HU-002 may provide a tested maintenance entry point, but no background scheduler/production retention claim is required. |
| NFR-PRV-U02-004 | Safe viewer/log output may use internal user/session identifiers only where operationally necessary; no raw credential or credential hash is used as a correlation identifier. |

## Observability and Copyable Diagnostics

| ID | Requirement |
|---|---|
| NFR-OBS-U02-001 | Backend emits structured safe events/counters for Login attempt/success/generic rejection/throttle, session creation/eviction, access rejection category, renewal success/replay/invalidity, Logout, storage-independent client failure category, configuration failure, and unexpected failure. |
| NFR-OBS-U02-002 | Events contain UTC timestamp, severity, stable event/outcome, request/correlation id, duration, and only approved internal user/session ids when needed. They exclude email, password, Authorization header, raw credential, token hash, request/response secret body, and raw exception. |
| NFR-OBS-U02-003 | Session lifecycle logs allow creation, renewal, replay revocation, expiry, and Logout investigation without making stored/log data sufficient to impersonate the user. |
| NFR-OBS-U02-004 | Every client-visible HU-002 failure uses the shared diagnostic builder/panel with stable operation/code, UTC time, platform, sanitized API location, request/correlation id, bounded allow-listed reason, safe message, and privacy line. |
| NFR-OBS-U02-005 | Tests generate representative emails, passwords, credentials, hashes, Authorization headers, query/fragment text, storage exceptions, and multiline payloads and prove none enters copyable reports or structured logs. |
| NFR-OBS-U02-006 | No external telemetry service is required locally. Centralized immutable logs, alert routing/retention, anomaly thresholds, and incident response become mandatory decisions only for a hosted target. |

## Maintainability and Team Quality

| ID | Requirement |
|---|---|
| NFR-MNT-U02-001 | Reuse the existing backend/frontend roots, global problem/correlation middleware, diagnostics, repository boundaries, Riverpod, router, HTTP client, OpenAPI gate, PostgreSQL integration harness, and CI rather than adding parallel frameworks. |
| NFR-MNT-U02-002 | Session generation/hashing/time policy, persistence, application orchestration, HTTP transport, Flutter state, and platform storage remain separated behind small typed interfaces with no dependency from domain/application logic into adapters. |
| NFR-MNT-U02-003 | Session lifetimes, limits, throttle values, HMAC-key secret, and environment policy are typed/bounded configuration. Production profile rejects disposable local secrets and insecure non-loopback assumptions. |
| NFR-MNT-U02-004 | Exact existing locks remain authoritative. Any new direct/transitive dependency is version-locked, license/maintenance/security reviewed, and followed by full backend/Flutter/Android/Windows quality gates. No `latest` tag or floating SDK is allowed. |
| NFR-MNT-U02-005 | Backend/frontend changed code remains at least 80 percent line coverage. Coverage never substitutes for explicit auth, concurrency, replay, platform storage, routing, and secrecy scenarios. |
| NFR-MNT-U02-006 | Formatting, linting, strict backend type checking, Flutter analysis, migration/model drift, OpenAPI generation, dependency audits, tests, and Android/Windows builds pass locally and in CI where supported. |
| NFR-MNT-U02-007 | Stable problem codes and automation keys are contract elements. Clients/tests must not parse human-readable messages to decide behavior. |
| NFR-MNT-U02-008 | Another team member can start the stack, register, Login, restart/restore, inspect safe session metadata, Logout, and reproduce a copyable failure using documented commands without accessing a secret/hash. |

## Testing Requirements

| ID | Requirement |
|---|---|
| NFR-TST-U02-001 | Example tests cover every HU-002 acceptance criterion and every documented HTTP outcome for Login, refresh, current-user, and Logout. |
| NFR-TST-U02-002 | PostgreSQL integration tests cover migration constraints/indexes, hash-only persistence, Login atomicity, 10-session eviction, expiry boundaries, current-user ownership, Logout, rotation, replay revocation, and rollback. SQLite/in-memory databases are not substitutes. |
| NFR-TST-U02-003 | Concurrency tests prove same-credential double refresh has at most one success, replay revokes the family, Logout/refresh cannot reactivate state, and concurrent Logins leave at most 10 active sessions. |
| NFR-TST-U02-004 | Hypothesis verifies credential encode/decode round trips plus entropy/format, hash, expiry, renewal-chain, replay, session-limit, and diagnostic-secret invariants using reusable domain strategies. |
| NFR-TST-U02-005 | Hypothesis shrinking remains enabled; local/CI failure output contains reproduction information/seed and shrunk input. A discovered defect gains a permanent example regression test. |
| NFR-TST-U02-006 | OpenAPI snapshot/contract tests verify request/response/problem schemas, Authorization behavior, `Cache-Control: no-store`, `WWW-Authenticate`, correlation propagation, and absence of secret fields from public user/problems. |
| NFR-TST-U02-007 | Flutter unit/widget/router tests cover Login validation/submission, generic credentials, secure-store success/failure, startup outcomes, single-flight renewal, one retry, Home guards, online/offline Logout, back navigation, accessibility, automation keys, and diagnostic secrecy. |
| NFR-TST-U02-008 | SecureCredentialStore contract tests use failure-capable fakes; native Android/Windows smoke tests use synthetic credentials to verify read, atomic replace, delete, restart availability, and failure mapping without printing values. |
| NFR-TST-U02-009 | Android debug and Windows debug builds pass. Native Windows testing uses the repository restoration helper and a normal Windows rebuild is verified before the executable is handed to the user. |
| NFR-TST-U02-010 | A real API/PostgreSQL end-to-end path covers Register -> Login -> current-user -> forced access renewal/restoration -> Logout -> protected denial. Android/shared integration and native Windows smoke coverage exercise the same generated contract. |
| NFR-TST-U02-011 | Negative tests attempt credentials in URLs, malformed/oversized bearer headers, method/media-type misuse, invalid configuration, storage corruption, inactive users, rate limits, and raw-secret log/clipboard leakage. |

## Usability and Accessibility

| ID | Requirement |
|---|---|
| NFR-UX-U02-001 | Login/Home/restoration/Logout language is English, manual-first, and understandable without authentication jargon. AI is absent. |
| NFR-UX-U02-002 | Inputs/actions have persistent labels and accessible semantics; errors/progress/warnings are not color-only and keyboard/touch focus order is deterministic. |
| NFR-UX-U02-003 | Generic invalid-credential feedback is actionable without implying whether the account exists or is inactive. Password remains available only for immediate correction and clears on success/disposal. |
| NFR-UX-U02-004 | Startup never flashes protected Home. Restoration transport failure offers Retry and Clear local session; authoritative invalidity returns safely to Login. |
| NFR-UX-U02-005 | Logout is visible from Home, suppresses duplicate action, always removes local protected access, and clearly warns when server revocation was not confirmed. |
| NFR-UX-U02-006 | Windows resizing and common Android text scaling do not hide Login, error-copy, restoration, Home, or Logout actions. Stable keys from Functional Design remain test contracts. |

## Security Baseline Compliance

Status means the rule is represented as an NFR requirement; implementation evidence is required during Code Generation.

| Rule | Status | UOW-02 disposition |
|---|---|---|
| SECURITY-01 | Compliant for local target | Platform-protected renewable storage and hash-only database persistence are required; HTTP is limited to loopback/debug, while non-loopback requires TLS. Hosted at-rest/key design is deferred. |
| SECURITY-02 | N/A | No load balancer, gateway, CDN, or hosted network intermediary exists. |
| SECURITY-03 | Compliant | Secret-free structured session lifecycle logging/correlation is measurable. Central sink/retention awaits hosting. |
| SECURITY-04 | N/A | Native Android/Windows client and JSON API serve no HTML/cookie application. Credential responses still require no-store. |
| SECURITY-05 | Compliant | Body/header size, schema/type, media type, credential format, metadata, and SQL-binding requirements are explicit. |
| SECURITY-06 | Compliant for current scope | Minimal application principal and read-only hash-free viewer are defined; no cloud IAM exists. |
| SECURITY-07 | Compliant | PostgreSQL remains private and API remains loopback-only; HU-002 adds no exposed service. |
| SECURITY-08 | Compliant | Protected endpoints validate server state and derive ownership from AuthenticatedPrincipal; client routes grant no authority. |
| SECURITY-09 | Compliant | Bounded typed configuration, production secret/transport rejection, secure Android backup policy, safe errors, and no insecure fallback are required. |
| SECURITY-10 | Compliant | Existing locks/audits/build gates remain and secure-storage dependency/platform prerequisites require reviewed exact resolution. |
| SECURITY-11 | Compliant | Short-lived opaque access, rotating renewable credentials, replay revocation, session limit, abuse controls, atomic boundaries, and explicit exclusions are defined. |
| SECURITY-12 | Compliant | Argon2id, generic/dummy verification, throttling, 256-bit credentials, secure native storage, server expirations, and Logout revocation are measurable. MFA/admin/browser-cookie controls are N/A. |
| SECURITY-13 | Compliant | Rotation-chain/database integrity, constraints, transactions, migration checks, locked dependencies, and OpenAPI contract checks are required. |
| SECURITY-14 | N/A for centralized operations | Safe lifecycle events/counters exist; hosted alerting, immutable retention, and incident operations wait for a deployment target. |
| SECURITY-15 | Compliant | Configuration/dependency/storage/transaction failures fail closed, roll back/clear safely, and expose only safe diagnostics. |

No blocking Security Baseline finding remains at NFR Requirements.

## Property-Based Testing Compliance

The project remains in partial enforcement mode.

| Rule | Status | UOW-02 disposition |
|---|---|---|
| PBT-02 | Compliant requirement | Exact-byte credential base64url encode/decode round-trip tests are required. |
| PBT-03 | Compliant requirement | Credential/hash/expiry/rotation/replay/session-limit/secret-output invariants are required. |
| PBT-07 | Compliant requirement | Reusable credential, time, session-history, lifecycle, and secret-payload strategies with boundaries are required. |
| PBT-08 | Compliant requirement | Shrinking, reproduction information, CI execution, and permanent regressions are required. |
| PBT-09 | Compliant | Existing locked Hypothesis 6 remains selected for Python properties; no Dart PBT framework is added in partial mode. |

No blocking PBT finding remains at NFR Requirements.
