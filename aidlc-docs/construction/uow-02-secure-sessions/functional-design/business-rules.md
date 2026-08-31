# UOW-02 Secure Sessions — Business Rules

## Rule Authority

The backend is authoritative for credentials, identity, session state, expiration, revocation, and access control. Flutter may repeat deterministic validation and route checks for usability, but client state never proves authorization. Security and atomicity rules override convenience behavior.

## Login and Identity Rules

| ID | Rule | Failure behavior |
|---|---|---|
| BR-AUTH-001 | Remove surrounding whitespace from email, then lowercase it using the established UOW-01 normalization policy. | Invalid normalized input proceeds to bounded request validation. |
| BR-AUTH-002 | Email and password are required and must satisfy the existing bounded representation/length limits before database work. | 422 `request_invalid` with safe field errors. |
| BR-AUTH-003 | Unknown email, incorrect password, and inactive user produce the same public HTTP status, stable code, and message. | 401 `invalid_credentials`; no account-state disclosure. |
| BR-AUTH-004 | Every syntactically valid login attempt performs one Argon2id verification. Unknown users and users whose state must remain private use a maintained dummy hash. | Hashing/verifier failure fails closed and does not disclose identity state. |
| BR-AUTH-005 | No exact response-time equality is promised, but implementation must avoid an obvious fast path for unknown accounts. | Timing regression is treated as a security defect. |
| BR-AUTH-006 | An outdated password hash may be upgraded only after successful verification and inside the successful login transaction. | A failed login never changes the stored hash. |
| BR-AUTH-007 | Login never accepts a role, user id, active flag, session duration, or other authority-bearing value from Flutter. | Unknown or forbidden request fields are rejected by the API schema. |

## Credential and Session Rules

| ID | Rule | Failure behavior |
|---|---|---|
| BR-AUTH-008 | Access and renewable credentials are independent values generated from 32 CSPRNG bytes and encoded as unpadded base64url. | Generation/encoding failure rolls back Login or renewal. |
| BR-AUTH-009 | PostgreSQL stores only lowercase 64-character SHA-256 credential hashes. Raw credentials are never persisted, queried in views, logged, or copied into diagnostics. | Any raw-credential persistence or disclosure is a blocking security defect. |
| BR-AUTH-010 | The initial configurable lifetimes are 15 minutes for access, 30 days of renewable idle time, and 90 days absolute session time. | Missing/invalid configuration fails startup or request processing closed. |
| BR-AUTH-011 | Server UTC time is authoritative. Expiry is exclusive: a credential is invalid when `now >= expires_at`. | Expired credentials issue no authority. |
| BR-AUTH-012 | Renewal may advance idle expiry, but never beyond the absolute session expiry. | A session at either bound cannot renew. |
| BR-AUTH-013 | Every successful renewal consumes the presented renewable credential and creates exactly one linked replacement. | Reuse cannot create another credential. |
| BR-AUTH-014 | Reuse of any consumed renewable credential is treated as replay and revokes the complete related session family atomically. | 401 `session_invalid`; no new credentials. |
| BR-AUTH-015 | A protected request succeeds only when its access hash maps to a non-revoked session, all three applicable time bounds are valid, and its user is active. | 401 `authentication_required` and no protected result. |
| BR-AUTH-016 | A user may have at most 10 active device sessions. Creating the eleventh revokes the oldest active session before the new session commits. | Post-commit active count cannot exceed 10. |
| BR-AUTH-017 | Android and Windows installations have independent sessions. Login or Logout on one installation does not normally revoke another. | Only session-limit, replay, expiry, inactivity, or future explicit remote management may affect another session. |
| BR-AUTH-018 | Logout targets only the current session and is idempotent for unknown, expired, or already-revoked renewable credentials. | Return 204 without exposing credential/session existence. |
| BR-AUTH-019 | Login creation, session-limit enforcement, optional password rehash, and initial token history commit once or roll back together. | No partial active session is observable. |
| BR-AUTH-020 | Renewal locks the current renewable credential/session. Consumption, replacement, access update, idle update, and replay revocation are one transaction. | Two concurrent uses of one credential cannot both succeed. |

## Flutter Authentication Rules

| ID | Rule | Failure behavior |
|---|---|---|
| BR-AUTH-021 | Flutter keeps the access credential only in memory and the renewable credential only through the approved platform secure-storage adapter. | Ordinary preferences, Riverpod persistence, files, logs, clipboard, and diagnostics are forbidden stores. |
| BR-AUTH-022 | Login becomes authenticated only after the renewable credential is successfully stored. | Storage failure clears partial state, attempts server revocation, and remains unauthenticated. |
| BR-AUTH-023 | Startup remains in a blocking `checking` state until secure-storage restoration finishes. | Protected Home is not briefly exposed. |
| BR-AUTH-024 | An authoritative invalid-session response deletes the stored credential and routes to Login. | No retry loop with a known-invalid credential. |
| BR-AUTH-025 | A connection failure or timeout during restoration is not proof of invalidity. The stored renewable credential remains and the user receives a retryable safe diagnostic. | The client neither enters Home nor destroys a potentially valid session. |
| BR-AUTH-026 | At most one renewal operation runs in Flutter. Protected calls may join it and retry once; Login, renewal, and Logout never recursively refresh. | Repeated failures end in a typed unauthenticated or retryable state. |
| BR-AUTH-027 | Logout first attempts server revocation when possible, then always clears local authentication and leaves protected routes. | If revocation is unconfirmed, show a copyable secret-free warning on Login. |
| BR-AUTH-028 | UI visibility and navigation redirects are usability controls, never backend authorization controls. | Every protected endpoint independently validates the access credential. |

## Public API Outcomes

All credential-bearing successful responses use `Cache-Control: no-store`. Bearer-authentication 401 responses include an appropriate `WWW-Authenticate: Bearer` challenge. Clients map behavior using HTTP status and stable code, never message-text comparison.

| Operation and condition | HTTP status | Stable code | Public content |
|---|---:|---|---|
| Login succeeds | 200 | Not applicable | Public user, access/renewable credentials, and UTC expirations |
| Login request shape/length invalid | 422 | `request_invalid` | Safe detail and bounded field errors |
| Unknown/wrong/inactive credentials | 401 | `invalid_credentials` | One generic credential message |
| Login throttled | 429 | `login_rate_limited` | Safe retry guidance; no identity disclosure |
| Login dependency/configuration unavailable | 503 | `service_unavailable` | Generic temporary-unavailability detail |
| Renewal succeeds | 200 | Not applicable | Public user plus rotated credential pair and expirations |
| Renewable credential malformed, unknown, expired, revoked, or replayed | 401 | `session_invalid` | Generic sign-in-again guidance |
| Current user succeeds | 200 | Not applicable | Public current-user representation only |
| Access credential absent, malformed, expired, revoked, or otherwise invalid | 401 | `authentication_required` | Generic authentication guidance |
| Logout completes or target is already absent | 204 | Not applicable | Empty body |
| Any operation has an unexpected internal failure | 500 | `internal_error` | Generic safe detail; no exception, SQL, hash, or token |

## Validation and Abuse-Control Order

1. Bound request body/header size and validate representation before expensive work.
2. Apply global and client-level traffic controls, followed by a non-PII normalized-account throttle key for Login.
3. Preserve generic credential behavior after throttling; a rate-limit response must not confirm account existence.
4. Perform real or dummy Argon2id verification exactly once for a syntactically valid Login attempt.
5. Begin state-changing transaction work only after successful verification.
6. Record safe security events with a correlation id, outcome category, and non-secret session/user identifiers only when policy permits.
7. Never log Authorization headers, passwords, raw renewable credentials, request bodies containing secrets, token hashes, or secure-storage contents.

Exact rate thresholds, performance targets, log retention, and deployed monitoring belong to NFR Requirements. The functional behavior here requires bounded throttling, fail-closed processing, and secret-free events.

## Diagnostics Rules

Every user-visible authentication failure follows the existing cross-cutting diagnostic contract:

- stable error code and operation (`login_account`, `restore_session`, `refresh_session`, or `logout_account`);
- UTC timestamp, platform, sanitized API location, request/correlation id when known, allow-listed technical reason, and safe message;
- explicit privacy line;
- no email, password, access/renewable credential, token hash, Authorization header, query, fragment, internal exception, SQL, or storage content.

Copying a report is always a deliberate user action. Credentials are never copied as part of diagnosis.

## Acceptance-Criteria Mapping

| HU-002 criterion | Governing rules |
|---|---|
| Valid registered user can Login | BR-AUTH-001, BR-AUTH-002, BR-AUTH-004, BR-AUTH-006, BR-AUTH-008 through BR-AUTH-012, BR-AUTH-019, BR-AUTH-021, BR-AUTH-022 |
| Invalid credentials do not authenticate or reveal the account | BR-AUTH-003 through BR-AUTH-005, BR-AUTH-007, public API outcomes |
| Authenticated context is required for protected behavior | BR-AUTH-015, BR-AUTH-023, BR-AUTH-028 |
| Session restores safely across application restart | BR-AUTH-010 through BR-AUTH-014, BR-AUTH-021 through BR-AUTH-026 |
| Logout removes local access and revokes the current session when reachable | BR-AUTH-017, BR-AUTH-018, BR-AUTH-027 |
| Credentials are protected and failures are diagnosable | BR-AUTH-008, BR-AUTH-009, BR-AUTH-021, diagnostics rules |

## Misuse and Failure Cases

| Case | Required response |
|---|---|
| Repeated password guessing | Bounded throttling plus generic credential failures; no existence signal |
| Stolen access credential | Authority ends at short expiry or earlier server revocation; every request checks server state |
| Stolen renewable credential used twice | First legitimate rotation consumes it; subsequent replay revokes the session family |
| Concurrent refresh by the same installation | Flutter single-flight plus database locking permits at most one success |
| Secure-storage write fails after Login response | Do not enter Home; clear/revoke and provide a safe copyable error |
| API unavailable during startup | Retain renewable credential, deny Home, and offer retry |
| API unavailable during Logout | Clear local credentials and Home access; warn that remote revocation was unconfirmed |
| Database/configuration/security dependency fails | Fail closed with safe 5xx response and no credential issuance |

## Deferred Synchronization Rules

HU-002 creates independent authenticated device sessions only. A separate future offline-synchronization story must define local persistence, server protocol, migrations, user interaction, and conflict policy before any financial record is synchronized.

That future design must use globally stable client-created identifiers, operation idempotency keys, record revisions, deletion tombstones, and an outbox. It may automatically merge non-conflicting operations, but it must never silently overwrite competing changes to the same financial fact. Server-mediated synchronization is the recommended first transport; QR can later carry the same safe operation format and must never carry session credentials.

## Property-Based Test Properties

| ID | Property |
|---|---|
| P-AUTH-001 | Encode/decode round trip preserves every generated 32-byte credential and the encoding contains only the approved unpadded base64url alphabet. |
| P-AUTH-002 | Equal credentials hash equally, while distinct generated credentials produce distinct hashes for all generated test samples. |
| P-AUTH-003 | For bounded issuance times, `access_expiry > issued_at`, `idle_expiry <= absolute_expiry`, and renewal never changes absolute expiry. |
| P-AUTH-004 | Any successful renewal history has one consumed predecessor and exactly one linked current replacement. |
| P-AUTH-005 | Replaying any consumed credential never returns credentials and leaves its session revoked. |
| P-AUTH-006 | Creating sessions under arbitrary valid histories leaves at most 10 active sessions for the user. |
| P-AUTH-007 | Constructed safe diagnostics never contain generated email, password, raw credential, hash, query, fragment, or line-break payloads. |

These properties supplement, rather than replace, example tests for Login, expiry boundaries, restoration, concurrent renewal, replay, Logout, inactive users, throttle responses, and secure-storage failures.

## Security Baseline Design Compliance

This is a functional-design assessment, not an implementation claim. No blocking security finding remains in the HU-002 design.

| Rule | Design status | HU-002 treatment |
|---|---|---|
| SECURITY-01 Encryption at Rest and in Transit | Applicable with deployment work deferred | Renewable credentials use platform secure storage; raw server credentials are not persisted. Local loopback HTTP remains the approved development boundary. Production TLS and managed storage encryption require a real deployment target. |
| SECURITY-02 Access Logging on Network Intermediaries | N/A in current topology | The local topology has no load balancer, gateway, CDN, or other network intermediary. Reassess when hosting is designed. |
| SECURITY-03 Application-Level Logging | Compliant design | Security outcomes and correlation ids are allowed; passwords, credentials, hashes, Authorization headers, and secret-bearing bodies are forbidden. |
| SECURITY-04 HTTP Security Headers for Web Applications | N/A | Flutter Android/Windows is a native client and no browser UI/cookie session is introduced. API cache prevention for credential responses remains required. |
| SECURITY-05 Input Validation on All API Parameters | Compliant design | Body/header sizes, schema fields, credential representations, platform values, and stable failures are bounded and server-validated. |
| SECURITY-06 Least-Privilege Access Policies | Compliant design; concrete identities in NFR Design | AuthenticatedPrincipal carries minimum identifiers, public projections exclude sensitive fields, and the DBeaver viewer remains view-only without base-table access. |
| SECURITY-07 Restrictive Network Configuration | Compliant current direction | PostgreSQL remains private; only the API is loopback-published for local native clients. HU-002 requires no new exposed service. |
| SECURITY-08 Application-Level Access Control | Compliant design | Every protected endpoint validates server-side session state and derives ownership from the authenticated principal; routes never grant authority. |
| SECURITY-09 Security Hardening and Misconfiguration Prevention | Applicable at NFR/code stages | Invalid credential configuration must fail closed. Debug/production configuration, platform backup behavior, and unused features will be fixed before generation. |
| SECURITY-10 Software Supply Chain Security | Applicable at NFR/code stages | Maintained secure storage, pinned dependencies, supported runtimes/images, lockfiles, and dependency checks remain mandatory quality gates. |
| SECURITY-11 Secure Design Principles | Compliant design | Minimal session scope, short-lived access, hash-only persistence, bounded device count, secure defaults, and explicit exclusions reduce attack surface. |
| SECURITY-12 Authentication and Credential Management | Compliant design | Argon2id verification/rehash, generic failures, throttling, 256-bit opaque credentials, rotation/replay detection, expirations, revocation, and secure client storage are defined. MFA/cookie attributes are N/A to this native MVP slice. |
| SECURITY-13 Software and Data Integrity Verification | Compliant design; pipeline evidence at code stage | Database constraints, atomic rotation, migration/model checks, locked dependencies, and existing quality gates protect state and delivered code. |
| SECURITY-14 Alerting and Monitoring | Partially applicable | Safe security events and future counters are defined. Central alerting, retention, and hosted operational monitoring are N/A until a deployment target exists. |
| SECURITY-15 Exception Handling and Fail-Safe Defaults | Compliant design | Dependency/configuration/validation failures deny authority, roll back issuance, and return safe non-secret problems. |

## Property-Based Testing Extension Compliance

| Rule | Mode/status | HU-002 evidence |
|---|---|---|
| PBT-02 Round-Trip Properties | Required / represented | Generated credential byte-to-base64url encode/decode round trip is specified. |
| PBT-03 Invariant Properties | Required / represented | Hash format, expiry bounds, rotation, replay, session-count, and diagnostic-secrecy invariants are specified. |
| PBT-07 Generator Quality | Required / represented | Strategies must generate exact credential bytes, bounded timestamps, valid histories, boundary cases, and secret samples. |
| PBT-08 Shrinking and Reproducibility | Required / implementation gate | Existing Hypothesis seed/shrinking/CI conventions must be used and minimized failures captured as regressions. |
| PBT-09 Framework Selection | Required / selected | Hypothesis remains the approved locked Python framework. No Dart PBT framework is added; Flutter uses example and integration tests in partial mode. |
| PBT-01, 04, 05, 06, 10 | Advisory | Properties are identified during design and complemented by mandatory concrete scenarios; state-machine/model testing may be added if it lowers implementation risk. |
