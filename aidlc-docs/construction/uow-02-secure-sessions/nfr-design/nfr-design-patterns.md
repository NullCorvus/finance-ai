# UOW-02 Secure Sessions — NFR Design Patterns

## Minimal Pattern Set

| Concern | Pattern | UOW-02 application |
|---|---|---|
| Invalid/unbounded input | Validate early and fail fast | Correlation, content/body/header limits, schema/credential format, and throttles reject before expensive or stateful work |
| Account privacy | Generic authentication plus real/dummy work path | Unknown, inactive, and wrong-password attempts share one public result and comparable Argon2id work |
| Credential safety | Generate once, persist hash only | Independent 32-byte CSPRNG values are encoded only for response/client use; SHA-256 hashes are the database lookup material |
| Login performance/integrity | Snapshot, verify, then locked revalidation | Read a minimal user credential snapshot, verify/prepare rehash outside the write transaction, then lock/recheck before session commit |
| Access authorization | Server-resolved principal | One indexed access-hash lookup joins session/user validity and returns only user/session identifiers |
| Renewal atomicity | One-time rotation under row lock | Consume predecessor, create/link replacement, replace access, advance bounded idle expiry, or revoke on replay in one transaction |
| Client refresh concurrency | Single-flight coordinator | All eligible protected requests join one renewal; each original request retries at most once |
| Secure client publication | Durable credential before authenticated state | Store the renewable credential first, then publish in-memory access/user and protected route state |
| Cross-boundary failure | Fail closed plus compensation | Storage failure never exposes Home; best-effort server revocation compensates after committed issuance |
| Logout uncertainty | Local guarantee, remote best effort | Attempt current-session revocation once, always clear local state, warn safely when confirmation is unavailable |
| Abuse | Layered bounded throttles | Source, HMAC-pseudonymous account, and global Login limits plus source/global renewal limits |
| Errors/diagnostics | Typed failures plus safe global/client mapping | Stable status/code, shared correlation, and copyable allow-listed details without secrets |
| Capacity | Indexed relational state and bounded history | Unique token hashes, deterministic session limit, query indexes, and bounded maintenance cleanup |
| Observability | Security lifecycle events without bearer material | Creation, renewal, replay, eviction, expiry, and Logout are correlatable through safe internal identifiers |

No cache, queue, background worker, Redis, JWT signer, distributed lock, event bus, circuit breaker, service split, or biometric gate is required.

## Request Guard Pipeline

The ordered API boundary is:

1. Establish/sanitize the correlation ID and safe request context.
2. Enforce content type, body/header size, allowed method, and credential representation bounds.
3. Apply the endpoint's layered throttle without storing/logging raw identity or credential data.
4. Parse typed request input or the Bearer header.
5. Invoke a thin route and transport-independent application service/dependency.
6. Map a typed result/failure through the shared safe response mapper and correlation header.
7. Mark credential-bearing responses `Cache-Control: no-store`; add the Bearer challenge to applicable 401 responses.

A rejection stops downstream work. The middleware/error abstractions become operation-neutral; registration-specific codes remain supported but do not control Login/session behavior.

## Login Snapshot and Commit Pattern

Holding a database write transaction during Argon2id work would increase lock/connection time. Trusting an earlier user read without revalidation would permit stale account state. Login therefore uses a two-phase pattern:

### Phase A — bounded read and password work

1. Normalize/bound the command and apply Login throttles.
2. Read a minimal immutable `UserCredentialSnapshot`: user id, password hash, active flag, and version/comparison value. Close/release the read transaction.
3. For an unknown or inactive account, select the prepared dummy Argon2id hash. For an active account, select its current hash.
4. Perform exactly one verification outside a write transaction.
5. Map unknown, inactive, or failed verification to the same typed `InvalidCredentials` result.
6. After a successful real verification, compute an upgraded Argon2id hash outside the write transaction only when `check_needs_rehash` requires it.

### Phase B — short authoritative write

1. Open one Unit of Work and lock/reload the AppUser by the snapshot id.
2. Require the user to remain active and its password hash/version to match the verified snapshot. A mismatch fails generically; it does not commit a session from stale credentials.
3. Apply the precomputed upgraded password hash when present.
4. Revoke/mark expired session rows needed for accurate active counting.
5. If ten active sessions exist, select and revoke the deterministic oldest by `created_at`, then `id`.
6. Generate independent raw access/renewable credentials and derive hashes.
7. Stage UserSession plus its initial RenewableCredential and commit once.
8. Only after commit construct the secret-bearing issued result; raw credentials were never attached to an ORM entity.

There is no automatic Login retry. A concurrent password/account-state change causes safe failure and the user may submit again.

## Access Validation Pattern

Protected requests hash a strictly bounded Bearer credential, then perform one indexed query resolving:

- unique access hash;
- non-revoked UserSession;
- `access_expires_at > server_now`;
- `idle_expires_at > server_now`;
- `absolute_expires_at > server_now`;
- active AppUser.

The result is `AuthenticatedPrincipal(user_id, session_id)`. Absence is one `AuthenticationRequired` failure. Validation does not extend a session, write `last_seen`, collect a fingerprint, or trust a client user/session id. This avoids a write on every protected request and preserves the p95 target.

Every protected application service receives the principal from the API dependency, not from request JSON. Future ownership queries root at `principal.user_id`.

## Renewable Rotation and Replay Pattern

1. Bound/decode/hash the presented renewable credential before transaction work.
2. Open a Unit of Work and select the RenewableCredential plus UserSession/AppUser for update by unique token hash.
3. Unknown, expired, revoked, out-of-idle/absolute-bound, or inactive state returns generic `SessionInvalid` and issues nothing.
4. If the row is already consumed, mark its session revoked with replay reason in the same transaction, commit the defensive action, and return `SessionInvalid`.
5. If current, generate the replacement access/renewable pair; store only hashes.
6. Mark the predecessor consumed, link exactly one successor, replace the session access hash/expiry, and advance idle expiry without crossing absolute expiry.
7. Commit once, then return the raw replacement pair.

Concurrent use of one renewable credential is intentionally fail-secure: at most one transaction issues; a later waiter observes consumed state and revokes the family as replay. Flutter's single-flight pattern prevents a normal installation from creating this race with itself.

## Client Authentication State Machine

The application-lifetime AuthSessionController is the single writer of client authentication state.

| Current state | Event | Allowed next state |
|---|---|---|
| Checking | No stored renewable credential | Unauthenticated |
| Checking | Renewal and secure replacement succeed | Authenticated |
| Checking | Authoritative invalid session | Unauthenticated after secure delete |
| Checking | Transport failure | RestorationRetry with credential retained |
| Checking | Secure-store failure | Unauthenticated/recoverable safe failure; never Home |
| Unauthenticated | Login submitted | SubmittingLogin |
| SubmittingLogin | API and secure write succeed | Authenticated |
| SubmittingLogin | Credentials/API/storage fail | Unauthenticated with safe feedback |
| Authenticated | Eligible access 401 | Refreshing internally; protected routes remain blocked from stale authority |
| Authenticated | Renewal succeeds | Authenticated with replacement |
| Authenticated | Session invalid | Unauthenticated after secure delete |
| Authenticated | Logout chosen | LoggingOut |
| LoggingOut | Any server outcome plus local delete | Unauthenticated, with optional remote-unconfirmed warning |
| RestorationRetry | Retry | Checking |
| RestorationRetry | Clear local session | Unauthenticated |

Widgets and router redirects observe state; they never mutate credentials directly. Secrets are absent from equality, debug output, persisted providers, and diagnostics.

## Secure-Storage Handoff Pattern

Server transaction and native secure storage cannot share an atomic transaction. The design uses a fail-closed handoff:

### Login or renewal success

1. Receive the committed issued result in a request-local secret container.
2. Replace the secure renewable value through SecureCredentialStore.
3. If replacement succeeds, publish the new in-memory access credential/public user and Authenticated state.
4. If replacement fails, destroy request-local/in-memory values, remain unauthenticated, and attempt current-session revocation without recursively refreshing.
5. If the process stops after server commit but before storage completes, restoration cannot authenticate and the user signs in again; no insecure recovery copy exists.

### Logout

1. Read the renewable value only for the current revocation call.
2. Attempt server Logout once when available.
3. Delete local secure state and clear the in-memory session regardless of server outcome.
4. Invalidate protected providers/router history and show only a safe warning if remote confirmation failed.

Storage adapter methods serialize read/replace/delete operations. Native exceptions become allow-listed typed failures; raw platform exception messages never reach logs or copied reports.

## Authenticated HTTP and Retry Policy

| Operation | Automatic retry | Behavior |
|---|---|---|
| Login | None | User may deliberately resubmit after typed failure |
| Refresh/restoration | None | Retry UI is explicit after transport uncertainty |
| Logout | None | Local clearing proceeds; no repeated secret transmission |
| Protected GET current-user | Once after shared successful renewal | Join single-flight; retry original request with new access |
| Future financial read | To be designed with its story | May use the same single renewal, not general network replay |
| Future financial mutation | None until idempotency is approved | Never infer safe replay before synchronization/idempotency design |

The authenticated API layer attaches Authorization immediately before the call and removes any possibility of credentials in URLs or generic diagnostic objects. Login/refresh/Logout calls bypass the refresh interceptor/coordinator to prevent recursion.

## Timeout and Failure Classification

- Each authentication attempt has the approved 15-second client timeout.
- Network timeout/connection errors are transport uncertainty, not credential invalidity.
- A stable authoritative 401 from renewal/current-user changes authentication state according to its code.
- Invalid JSON/contract mismatch is a safe `invalid_response` failure; no raw body is copied.
- Database/configuration/randomness/hasher failures fail closed and issue no authority.
- Client secure-storage failures deny authenticated publication and never fall back.
- The backend performs no automatic transaction retry. Deadlock/serialization failure becomes a safe retryable service response only when positively classified; the current operation is not replayed internally.

## Layered Throttling Pattern

Login applies three independent process-local checks in the reference single instance:

1. network-source burst/minute keys;
2. HMAC-SHA-256 normalized-account key using a dedicated runtime secret;
3. aggregate Login key.

Renewal applies source and aggregate checks without hashing the raw credential into a limiter/log key. Limiter configuration is typed/bounded. Multi-instance deployment replaces only the storage adapter with shared enforcement; application Login/renewal rules remain unchanged.

Throttle events contain safe outcome and correlation data, never email/password/credential. Existence cannot be inferred from whether the account limit is applied or the public 429 shape.

## Persistence and Index Pattern

| Query/constraint | Pattern |
|---|---|
| Protected access | Unique `user_session.access_token_hash` lookup with session/user validity predicates |
| Renewal/Logout | Unique `renewable_credential.token_hash` lookup, then row lock/parent relationship |
| Session limit | Composite user/state/time access path; deterministic `created_at`, `id` ordering |
| Rotation history | Indexed `session_id`; unique predecessor successor relationship |
| Hash integrity | Fixed length/check constraint plus uniqueness; raw field does not exist |
| Expiry integrity | Time-order check constraints where valid across lifecycle |
| Cleanup | Bounded idempotent primary-key batches after terminal retention eligibility |

Query-plan evidence under the reference dataset is a code-generation/test gate. Access validation never traverses the complete renewable history.

## Observability and Redaction Pattern

One final safe outcome/duration is emitted per request; significant lifecycle transitions emit separate bounded events where useful.

Allowed examples include correlation id, internal user/session id, operation, status/outcome, client platform classification, duration, and safe revocation category. Forbidden values include email, password, raw credentials, token hashes, Authorization headers, request/response secret bodies, query/fragment data, secure-store content, raw storage errors, SQL, and stack traces.

The shared Flutter ErrorDiagnostic receives only allow-listed typed fields. Repository/application exceptions are translated before crossing into presentation. A secret-scanning test feeds representative values through every failure path.

## Retention and Cleanup Pattern

Consumed history remains while the family can be replayed within its absolute window. A terminal family becomes eligible for removal 30 days after the later of revocation or absolute expiry.

Cleanup is a bounded, idempotent maintenance function with explicit cutoff and batch size. It never deletes active or still-replay-relevant rows and cascades a complete terminal family only according to database relationships. HU-002 provides no scheduler, daemon, or hosted retention service.

## Testing Pattern

- Example tests pin all HTTP statuses, HU-002 scenarios, restoration/storage outcomes, route behavior, and Logout warning.
- Hypothesis covers codec round trip and hash/expiry/rotation/replay/session-limit/diagnostic invariants with domain strategies, shrinking, and reproducibility.
- PostgreSQL tests prove constraints, real row locks, transaction rollback, double renewal, replay revocation, Logout races, and session-limit races.
- Contract tests pin schemas, no-store/Bearer/correlation headers, and public secret exclusion.
- Flutter tests use failure-capable API/store fakes for deterministic state/route/accessibility behavior.
- Native Android/Windows tests use synthetic renewable values for store/read/replace/restart/delete; values are never printed.
- The Windows helper restores the normal visible executable after the native harness.

## Security Baseline Design Compliance

| Rule | Design status | Pattern evidence |
|---|---|---|
| SECURITY-01 | Compliant local design | Secure native renewable storage, hash-only server persistence, loopback-only HTTP, and TLS gate for non-loopback |
| SECURITY-02 | N/A | No network intermediary in the current topology |
| SECURITY-03 | Compliant | Lifecycle events plus strict allow-list/redaction pattern |
| SECURITY-04 | N/A | No HTML/browser-cookie application; response no-store remains |
| SECURITY-05 | Compliant | Ordered guard pipeline and bounded credential/request representations |
| SECURITY-06 | Compliant current scope | Minimal principal and hash-free read-only viewer boundary |
| SECURITY-07 | Compliant | Existing private PostgreSQL/loopback API topology unchanged |
| SECURITY-08 | Compliant | Server-resolved principal and protected-service ownership root |
| SECURITY-09 | Compliant | Typed config, no fallback, Android backup restriction, safe defaults |
| SECURITY-10 | Compliant design gate | Exact lock/review/native build requirements for the sole new dependency |
| SECURITY-11 | Compliant | Minimal components, misuse/race handling, short credentials/transactions, explicit exclusions |
| SECURITY-12 | Compliant | Generic/dummy Argon verification, throttles, entropy, rotation, expiries, secure storage, Logout |
| SECURITY-13 | Compliant | Constraints, linked history, atomic transaction and contract/lock integrity gates |
| SECURITY-14 | N/A for centralized operations | Safe events/counters defined; hosted alerting/retention absent without target |
| SECURITY-15 | Compliant | Every security/configuration/storage/transaction failure denies authority safely |

No blocking security design finding remains.

## Property-Based Testing Design Compliance

| Rule | Design status | Evidence |
|---|---|---|
| PBT-02 | Compliant | Exact-byte credential base64url inverse is preserved as a test boundary |
| PBT-03 | Compliant | Hash, expiry, chain, replay, limit, and secret-output invariants map to explicit components |
| PBT-07 | Compliant | Domain strategies cover bytes, times, lifecycle histories, state transitions, and adversarial secret text |
| PBT-08 | Compliant | Shrinking/reproduction/CI/regression flow is part of the test pattern |
| PBT-09 | Compliant | Existing locked Hypothesis is retained; Flutter remains example-tested in partial mode |

No blocking PBT design finding remains.

## Excluded Patterns

Automatic Login/refresh/Logout retry, persistent access credentials, plaintext fallback, JWT signing, sender-constrained device keys, biometrics, per-request session writes, distributed sessions/locks, cache-as-authority, queues/sagas, circuit breakers, hosted telemetry, QR credential transfer, offline financial cache, synchronization, remote device management, and product AI are outside or counter to this unit.
