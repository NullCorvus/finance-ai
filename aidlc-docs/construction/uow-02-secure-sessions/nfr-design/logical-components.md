# UOW-02 Secure Sessions — Logical Components

## Component Map

### Flutter Boundary

| Logical component | Responsibility | Failure behavior |
|---|---|---|
| FinanceApp / AuthBootstrap | Initialize bindings/providers, block routing, start restoration once | Checking/RestorationRetry/Login; never flashes Home |
| AppRouter Auth Redirect | Derive public/protected route from AuthenticationState | Home cannot remain reachable after invalidity/Logout |
| Login Screen/Form | Collect labeled email/password, local guidance, progress, generic feedback | Password stays ephemeral and clears on success/disposal |
| Login Controller | Guard duplicate submit and map typed Login results | Unauthenticated safe state; no secret in provider/debug state |
| Home Screen | Minimal protected HU-002 destination and visible Logout | No preference/financial/sync/AI behavior |
| AuthSessionController | Sole writer for checking/authenticated/refresh/logout state | Fail closed; classify transport vs authoritative invalidity |
| AuthRefreshCoordinator | Own one in-flight renewal joined by eligible protected calls | One result; no recursive refresh; final failure clears/retries appropriately |
| AuthenticatedApiClient | Attach in-memory Bearer value and retry eligible request once | Typed transport/contract/auth failure; credential absent from diagnostics |
| AuthRepository | Call Login, refresh, current-user, and Logout contracts | Decode by status/stable code, not messages |
| SecureCredentialStore | Serialize read/replace/delete renewable credential via native plugin | Typed storage failure; no plaintext fallback |
| Error Diagnostic Builder/Panel | Reuse stable safe copyable reports and Copy UI | Allow-listed fields only; never raw exception/input/secret |

### Backend/API Boundary

| Logical component | Responsibility | Failure behavior |
|---|---|---|
| Correlation/Resource Middleware | Correlation, body/content/header bounds, safe timing/outcome | Safe problem/header and downstream short-circuit |
| Login Rate Guard | Source, HMAC-account, and global Login rules | Generic 429 plus Retry-After; no account existence signal |
| Renewal Rate Guard | Source/global renewal rules | Generic 429; raw credential absent from key/log |
| Login Route | Map Login JSON to LoginCommand and IssuedSession/problem | Thin delegation; no credential logging |
| Refresh Route | Map renewable JSON to rotation service/result | Non-cacheable success or typed invalid session |
| Current User Route | Return PublicAuthenticatedUser from principal | Protected; no session/hash internals |
| Logout Route | Revoke current renewable/session idempotently | 204 for present/absent target; no existence disclosure |
| Bearer Access Dependency | Bound/hash Bearer and resolve AuthenticatedPrincipal | One generic Bearer 401, fail closed |
| Global Problem Mapper | Convert typed/unknown failures to safe problem contract | Correlation preserved; internal detail excluded |

### Application and Security Boundary

| Logical component | Responsibility | Failure behavior |
|---|---|---|
| LoginService | Orchestrate snapshot, verification, rehash preparation, locked session creation, one commit | Generic invalid credentials or safe unavailable; no automatic retry |
| RefreshSessionService | Lock/validate/rotate or replay-revoke one session family | Atomic SessionInvalid on every invalid/replay path |
| GetCurrentUserService | Produce public projection rooted in principal | Deny missing/invalid ownership context |
| LogoutSessionService | Resolve/lock/revoke current family idempotently | Safe no-content result; rollback on internal failure |
| SessionPolicy | Lifetimes, expiry predicate, active limit, deterministic eviction, retention cutoff | Invalid configuration fails readiness/closed |
| CredentialCodec | Strict 32-byte to/from unpadded base64url | Reject malformed/noncanonical values before lookup |
| CredentialGenerator | Produce independent 32-byte CSPRNG values | Generation failure issues no authority |
| CredentialHasher | Produce canonical SHA-256 digest | Raw input remains request-local |
| PasswordVerifier | Real/dummy Argon2id verification and rehash decision | One generic result; no hash/public timing detail |
| AccountKeyPseudonymizer | HMAC normalized email for limiter key | Missing/invalid runtime key fails Login protection closed |
| ServerClock | Supply timezone-aware UTC to policies/services | Injectable deterministic test clock; client time ignored |

### Persistence and Operations Boundary

| Logical component | Responsibility | Failure behavior |
|---|---|---|
| UserCredentialReader | Return minimal immutable credential snapshot outside write transaction | Missing/inactive represented without public disclosure |
| UserRepository | Lock/reload user, compare verified snapshot, update prepared rehash, return public fields | Stale/changed account fails generically |
| SessionRepository | Access lookup, active count/oldest eviction, create/revoke/update session | Constraints/locks are authoritative |
| RenewableCredentialRepository | Unique hash lookup/lock, consume/link history, detect replay | Cannot commit branching/current predecessor |
| AuthUnitOfWork | Own SQLAlchemy transaction/session/commit/rollback/cleanup | One commit or complete rollback/resource release |
| PostgreSQL | Relationships, unique hashes, time/link constraints, row locks, indexes | No partial/duplicate issuance state |
| SessionCleanup | Delete eligible terminal families in bounded idempotent batches | Never deletes active/replay-relevant state |
| Safe Session Viewer | Optional DBeaver metadata projection only | No password/token hashes or base-table privileges |
| Auth Readiness Checks | Database/schema/config/hasher/randomness prerequisites | Not-ready/safe unavailable without secret details |
| Safe Logger/Metrics | Lifecycle events, outcomes, durations, bounded counters | Must never block auth or expose bearer/PII material |

## Dependency Direction

Flutter widgets depend on controllers, which depend on AuthRepository and SecureCredentialStore interfaces. AuthenticatedApiClient obtains in-memory access only through AuthSessionController/credential provider and asks AuthRefreshCoordinator to renew; it does not read native storage directly.

API routes/dependencies depend on application services. Application services depend on policies, credential/password/clock abstractions, repositories, and AuthUnitOfWork. Concrete FastAPI, SQLAlchemy/PostgreSQL, `secrets`/hashlib/HMAC, limiter storage, native secure storage, logging, and HTTP implementations point inward toward those interfaces.

Repositories never commit. Widgets never handle raw backend exceptions. Persistence never imports transport/presentation behavior. Public/user models never contain credentials/hashes.

## API Contract Map

| Endpoint | Public/protected | Application component | Success | Principal/secret source |
|---|---|---|---|---|
| `POST /api/v1/auth/login` | Public + throttled | LoginService | 200 IssuedSession, no-store | Email/password body; returns one credential pair |
| `POST /api/v1/auth/refresh` | Public credential exchange + throttled | RefreshSessionService | 200 rotated IssuedSession, no-store | Renewable body only |
| `GET /api/v1/auth/me` | Protected | Bearer dependency + GetCurrentUserService | 200 PublicAuthenticatedUser | Access Bearer -> server principal |
| `POST /api/v1/auth/logout` | Narrow credential revocation | LogoutSessionService | 204 empty | Renewable body only |

The shared API client/result type must support JSON objects and explicit empty 204 bodies. It keeps correlation headers even when the body is absent/invalid and never includes a secret body in error construction.

## Login Interaction by Component

1. Login Form sends one ephemeral command to Login Controller.
2. Login Controller enters submitting and calls AuthRepository/API client.
3. Middleware and Login Rate Guard bound/classify the request.
4. Login Route invokes LoginService.
5. LoginService asks UserCredentialReader for a snapshot, chooses real/dummy PasswordVerifier input, verifies, and prepares rehash if needed.
6. On valid active snapshot, LoginService opens AuthUnitOfWork, locks/revalidates via UserRepository, applies prepared rehash, and asks SessionPolicy/SessionRepository to enforce the active limit.
7. CredentialGenerator/Codec/Hasher create the initial pair/history; repositories stage hashes only; AuthUnitOfWork commits once.
8. Login Route returns no-store IssuedSession plus correlation.
9. AuthSessionController asks SecureCredentialStore to replace the renewable value.
10. Only successful storage publishes the in-memory access/user, router exposes Home, and the form password clears.
11. Storage failure clears secret/state, attempts Logout compensation, and exposes a safe copyable failure.

## Startup Restoration by Component

1. AuthBootstrap leaves the app in Checking and calls AuthSessionController once.
2. The controller asks SecureCredentialStore for the renewable value.
3. No value routes to Login. A storage exception maps to safe recovery and denies Home.
4. A value is passed request-locally to AuthRepository refresh.
5. Refresh Route/Service lock, validate, and rotate atomically.
6. Flutter securely replaces the renewable value, then publishes access/user and Home.
7. `session_invalid` deletes local state and routes to Login.
8. Timeout/connection retains storage and shows RestorationRetry with Retry/Clear local session.

## Protected Request and Single-Flight Renewal

1. A protected repository asks AuthenticatedApiClient to call the API.
2. The client obtains current in-memory access just before sending and adds Authorization.
3. Bearer Access Dependency hashes/queries and supplies AuthenticatedPrincipal to the protected route.
4. If the eligible request receives an expiry/authentication 401, it joins AuthRefreshCoordinator.
5. The first joiner starts one refresh; all others await that same result.
6. On successful secure replacement/publication, each eligible original request retries once with the new access.
7. A final 401 or invalid renewal clears state/routes to Login. Transport failure maps to recoverable behavior without recursive calls.

Login, refresh, and Logout clients are explicitly outside the authenticated retry wrapper.

## Renewal and Replay by Component

1. RefreshSessionService strictly decodes/hashes the renewable value.
2. AuthUnitOfWork and RenewableCredentialRepository lock the history/session row.
3. SessionPolicy/ServerClock validate current, user active, unrevoked, and idle/absolute bounds.
4. Consumed state invokes SessionRepository replay revocation and commits no issuance.
5. Current state invokes CredentialGenerator/Hasher, consumes/links history, replaces session access, and advances bounded idle expiry.
6. AuthUnitOfWork commits once; only then is IssuedSession returned.

## Logout by Component

1. Home LogoutAction asks AuthSessionController to begin LoggingOut.
2. AuthRepository sends the current renewable value once when available.
3. LogoutSessionService hashes it, locks/revokes the related session when found, and returns 204 without confirming existence.
4. AuthSessionController deletes SecureCredentialStore state, clears in-memory access/user, invalidates protected providers, and routes to Login regardless of the remote result.
5. Transport failure creates only a safe remote-revocation-unconfirmed warning after local clearing.

## Transaction and Lock Ownership

| Operation | Transaction owner | Locked state | Commit outcome |
|---|---|---|---|
| Login snapshot | Short reader/session | None or ordinary read consistency | No state change |
| Login creation | LoginService via AuthUnitOfWork | Revalidated AppUser plus active-session selection as needed | Rehash, evictions, session/history together |
| Access validation | Bearer dependency/read repository | No write lock | No state change |
| Renewal/replay | RefreshSessionService via AuthUnitOfWork | RenewableCredential and parent UserSession | Rotation or replay revocation together |
| Logout | LogoutSessionService via AuthUnitOfWork | Resolved UserSession/history relationship | Current-family revocation or safe no-op |
| Cleanup | SessionCleanup via bounded Unit of Work | Eligible terminal batch only | Complete batch or rollback |

Lock ordering is always AppUser/session before related renewable rows where more than one is required. Concrete SQL and deadlock/timeouts are fixed/tested in Code Generation; services never retry a state-changing transaction automatically.

## Resource and Secret Ownership

| Resource | Owner/lifetime |
|---|---|
| Login password | Flutter form, then request/PasswordVerifier call scope only |
| Raw issued credentials on backend | Credential factory/issued-result request scope after commit only |
| Access credential on client | AuthSessionController memory until rotation/Logout/process exit |
| Renewable credential on client | SecureCredentialStore only, exposed request-locally for refresh/Logout |
| Credential hashes | PostgreSQL session/history entities; never public/viewer/log output |
| AuthenticatedPrincipal | One protected backend request/application call |
| SQLAlchemy session/transaction | AuthUnitOfWork/read repository context |
| In-flight renewal | AuthRefreshCoordinator until all joiners resolve |
| Correlation context | One HTTP request/report, sanitized and bounded |

## Configuration Ownership

| Configuration | Owner | Validation/failure |
|---|---|---|
| Session lifetimes/limit/retention | SessionPolicy from typed backend Settings | Bounded at startup/readiness; fail closed |
| Login/renewal throttle values | Rate guards/limiter adapters | Bounded; no disabled production default |
| Account HMAC key | AccountKeyPseudonymizer from runtime secret | At least 32 bytes; placeholder rejected outside local/test |
| API URL/timeout | Flutter AppConfig/API provider | Sanitized diagnostic location; non-loopback HTTP rejected by deployment policy |
| Secure storage namespace/key | SecureCredentialStore constants | Non-PII, stable, absent from logs |
| Android min/backup and Windows plugin build | Platform runner/build config | Native build/test gate; no runtime insecure fallback |

## Failure Mapping

| Internal condition | Public API/client behavior | Local authentication state |
|---|---|---|
| Unknown/inactive/wrong password | 401 `invalid_credentials` | Unauthenticated; form correction allowed |
| Invalid Login shape | 422 `request_invalid` | Unauthenticated; field guidance |
| Login throttle | 429 `login_rate_limited` + Retry-After | Unauthenticated; safe retry guidance |
| Invalid/expired/revoked/replayed renewable | 401 `session_invalid` | Secure credential cleared; Login |
| Missing/malformed/expired/revoked access | 401 `authentication_required` + Bearer challenge | Single refresh when eligible, otherwise Login |
| API timeout/connection during restoration | Client `network_unavailable`/timeout diagnostic | RestorationRetry; renewable retained |
| API timeout during Logout | Client remote-unconfirmed warning | Local state cleared; Login |
| Secure storage read/write/delete failure | Typed `secure_storage_*` diagnostic | Home denied; reauthentication/recovery |
| Database/config/randomness/hasher failure | Safe 500/503 | No authority issued; transaction rolled back |
| Contract/invalid JSON | Client `invalid_response` | No secret detail; fail closed/retry as classified |

Every diagnostic uses the existing shared safe report and correlation convention.

## Data and Safe Inspection Boundary

The new base tables are accessible only to the application database role and migration tooling. The existing `finance_ai_viewer` keeps no base-table access. If the safe view is extended, it contains only internal session id, user id, platform, creation/expiry/revocation timestamps, boolean/state classification, and safe reason. It excludes access/renewable hashes, password hash, HMAC keys, raw identity, and replacement-chain secret material.

## Infrastructure Assessment

HU-002 introduces no new running infrastructure component. PostgreSQL remains solely on the internal `private` network. FastAPI remains on `private` plus the `client-access` bridge with loopback-only host publication. Secure storage lives inside each native operating-system user/application context, not in Compose.

No cloud provider, hosted compute/database, TLS terminator, load balancer, Redis, queue, worker, object storage, secret manager, or monitoring service is selected. After NFR Design approval, Infrastructure Design should be formally marked skipped as duplicative; the next substantive stage is Code Generation Part 1 planning.

## Code Boundary

These are logical responsibilities and interactions, not prescribed filenames/classes. The Code Generation plan will map them onto the existing repository, specify migrations/contracts/refactors/tests in reviewable steps, recheck the secure-storage dependency/platform prerequisites, and require explicit approval before any executable change.
