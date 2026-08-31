# UOW-02 Secure Sessions — Business Logic Model

## Scope

This design covers HU-002 only: Login, authenticated context, session renewal/restoration, current-user retrieval, and Logout for the shared Android/Windows Flutter client. It extends UOW-01 registration without changing registration behavior.

HU-003 preferences, password recovery, email verification, social login, MFA, financial accounts/data, offline financial CRUD/synchronization, and product AI remain outside this slice.

## Approved Decisions

| Concern | Decision |
|---|---|
| Credential form | Database-backed opaque access and renewable credentials with at least 256 bits of CSPRNG entropy |
| Token persistence | PostgreSQL stores only SHA-256 hashes; raw credentials exist only at issuance/request/client secure-storage boundaries |
| Lifetimes | Access 15 minutes; renewable idle 30 days; absolute session 90 days; all configurable server-side |
| Rotation | Every successful renewal consumes the presented renewable credential and creates a linked replacement |
| Replay | Reuse of a consumed renewable credential revokes its complete session family |
| Device sessions | Up to 10 independent sessions per user; exceeding the limit revokes the oldest active session |
| Client persistence | Access credential stays in memory; renewable credential uses platform secure storage |
| Offline Logout | Attempt revocation, clear all local authentication state regardless, leave protected routes immediately, and show a safe warning if revocation was unconfirmed |
| Delivery boundary | HU-002 ends at a minimal authenticated Home placeholder; HU-003 follows separately |

## System Boundaries

| Boundary | Input | Output |
|---|---|---|
| Login API | Email and password | Public user plus raw access/renewable credentials and expirations, or generic safe failure |
| Renewal API | One raw renewable credential | Rotated credential pair plus public user, or invalid-session failure |
| Access guard | Authorization Bearer credential | Authenticated principal or generic authentication-required failure |
| Current-user API | Authenticated principal | Public current-user representation |
| Logout API | Renewable credential | Idempotent no-content result after revocation attempt |
| Flutter secure store | Raw renewable credential | Persisted/loaded/deleted value through platform protection |
| Flutter session controller | Login/restore/logout intent | Immutable checking/unauthenticated/authenticated/recoverable-failure state |

Token responses must be marked non-cacheable. Raw passwords and credentials never appear in URLs, logs, diagnostics, analytics, DBeaver views, or ordinary Flutter state serialization.

## Login Flow

1. Flutter validates that email and password are present and within bounded lengths, prevents a duplicate active submission, and keeps password data only in the obscured field controller.
2. The API validates JSON shape/size and applies login throttles by client, a non-PII normalized-account key, and global traffic.
3. The application service normalizes the email using the established identity policy.
4. The repository loads the user and stored Argon2id hash when present.
5. The password verifier always performs an Argon2id verification. Unknown/inactive users use a prepared dummy hash so the public status, body, and broad work path match an incorrect password.
6. Unknown email, incorrect password, or inactive user returns the same HTTP status and `invalid_credentials` problem. No field reveals whether the account exists.
7. A successful verification may replace an outdated Argon2id hash inside the login transaction.
8. The service revokes expired sessions and, if 10 active sessions already exist, revokes the oldest active session before creating another.
9. The service generates independent access and renewable credentials from 32 random bytes each, encodes them as unpadded base64url, and immediately derives SHA-256 hashes.
10. One transaction creates the session, its current access hash/expiry, and the first renewable-credential history row. Raw credentials are never attached to persistence entities.
11. After commit, the API returns the public user, credential pair, expirations, and `Cache-Control: no-store`.
12. Flutter first writes the renewable credential to platform secure storage. Only after that succeeds does it retain the access credential in memory and enter authenticated Home.
13. If secure storage fails, Flutter does not enter authenticated state, clears partial local state, attempts to revoke the just-created server session, and presents a copyable safe diagnostic.

## Access Validation Flow

1. A protected request provides one credential in the `Authorization: Bearer` header.
2. The API rejects a missing, malformed, or oversized header before business logic.
3. The access guard hashes the credential and performs one indexed lookup for the current session.
4. Access succeeds only when the hash matches, access expiry is in the future, the session is not revoked, the idle and absolute session limits are in the future, and the user is active.
5. The guard returns an authenticated principal containing only the user/session identifiers required by application services.
6. Every protected service uses that principal as its ownership root. A Flutter route or hidden control is never authorization evidence.
7. Any validation/configuration/database failure fails closed with a safe problem response.

## Session Restoration and Renewal

1. App startup begins in a blocking `checking` state; neither public Login nor protected Home is briefly exposed as authenticated truth.
2. If secure storage contains no renewable credential, the controller enters unauthenticated Login.
3. If one exists, Flutter sends it to the renewal endpoint without first persisting it in ordinary state.
4. The service hashes the presented value and locks the matching renewable history row/session for update.
5. If the credential is current, unconsumed, unexpired, within session idle/absolute limits, and attached to an active user/session, renewal proceeds atomically.
6. The service marks the presented credential consumed, generates a new access credential and renewable credential, links the new renewable row to its predecessor, advances idle expiry up to but never beyond absolute expiry, and commits once.
7. Flutter replaces the stored renewable credential before exposing the new in-memory access credential. A storage failure revokes/clears rather than keeping mismatched client/server state.
8. A consumed renewable credential indicates replay. The service revokes its session family in the same transaction and returns a generic invalid-session failure.
9. An unknown, expired, revoked, malformed, or replayed credential never produces a new credential.
10. An authoritative invalid-session response clears secure storage and routes to Login.
11. A transport timeout/connection failure is not evidence that the credential is invalid. Flutter retains the stored credential and shows a retryable restoration screen; it does not claim authenticated access.

Only one refresh operation may run in Flutter at a time. Protected requests that receive an expiry-related 401 join that single operation, then retry at most once. Login, renewal, and Logout calls are never recursively refreshed.

## Logout Flow

1. Flutter disables repeated Logout actions and reads the renewable credential only for the active call.
2. When reachable, the API hashes it, locks the related session when found, and records revocation. Already unknown/revoked credentials still produce an idempotent no-content response and reveal nothing.
3. Flutter clears the in-memory access credential, deletes the renewable credential from secure storage, resets user/session state, and navigates to Login so protected screens cannot be revisited.
4. If the API is unreachable, local clearing/navigation still occurs. A safe warning explains that server revocation was not confirmed; it includes no credential or user input.
5. A valid server-side renewable credential that could not be revoked remains bounded by its configured expiry. Later remote-session management is outside HU-002.

## Backend State Progression

| State | Allowed next state | Meaning |
|---|---|---|
| Login Received | Throttled, Rejected, or Verified | Public request has no session authority |
| Verified | Session Staged or Failure | Real/dummy password verification is complete |
| Session Staged | Committed or Rolled Back | Hashes and expirations await one transaction outcome |
| Active | Refreshed, Expired, Revoked, or Replayed | Access may authenticate only while every bound is valid |
| Refreshed | Active | Old renewable credential is consumed and linked to replacement |
| Expired | Terminal | No new credential may be issued |
| Revoked | Terminal | Logout/limit/replay invalidated the session |
| Replayed | Revoked | Consumed credential reuse invalidates the session family |

## Flutter Authentication State

| State | Route behavior | Stored state |
|---|---|---|
| Checking | Startup/restoration screen | Renewable credential remains inside secure-store adapter |
| Unauthenticated | Register/Login allowed; Home redirected | No in-memory access/user |
| Submitting Login | Login remains visible and disabled | Password remains only in form controller |
| Authenticated | Home/protected routes allowed | Public user and in-memory access credential/expiry |
| Restoration Retry | Blocking retry UI; no protected access | Stored renewable credential retained after transport failure |
| Logging Out | Home blocked from duplicate actions | Credentials are being revoked/cleared |
| Logout Warning | Login shown with safe warning | No local credential or authenticated state |

## Concurrency and Atomicity

- Login session creation, password rehash, active-session limiting, and initial credential persistence commit atomically.
- Renewal locks the renewable row/session. Consume, replacement insertion, access replacement, idle-expiry update, and replay revocation commit atomically.
- Two concurrent renewals with the same credential cannot both succeed. Flutter single-flight renewal avoids a legitimate self-revocation race.
- Logout and renewal racing on the same session resolve through row locking; a committed revocation prevents subsequent issuance.
- Server time is authoritative for all expiration decisions. Client clocks are display hints only.

## Deferred Offline-First Synchronization Direction

The user's multi-device goal is captured but not implemented by authentication:

- Independent Android/Windows sessions are the prerequisite for each installation to authenticate to a common API.
- Future financial clients may keep a local database plus an outbox of immutable operations while offline.
- Client-created financial records will need stable globally unique identifiers, revision/version metadata, idempotency keys, and deletion tombstones.
- Non-conflicting operations may merge automatically when connectivity returns. Competing edits to the same financial fact must never be silently combined or overwritten; the server must detect the version conflict and apply a documented domain rule or request user resolution.
- A server-mediated synchronization protocol is the first recommended transport because it works across locations and devices. QR/direct transfer can be evaluated later as another transport over the same operation format.
- No session credential is transferred through financial synchronization data, QR payloads, logs, or export files.

This direction becomes a separate future requirement/story before local financial caching or merge behavior is implemented.

## Testable Properties

| Component | Category | Property |
|---|---|---|
| Credential codec | Round-trip | Decoding any generated 32-byte credential encoding returns the original bytes |
| Credential generator | Invariant | Every generated value decodes to exactly 32 bytes and uses only the allowed unpadded base64url alphabet |
| Token hasher | Invariant | Equal raw credentials yield equal 64-character hashes; changed valid credentials yield a different hash for generated samples |
| Expiry calculation | Invariant | Access expiry is after issuance; idle expiry never exceeds absolute expiry; no refresh extends absolute expiry |
| Renewal transition | Invariant | One current credential produces exactly one consumed predecessor and one linked unconsumed replacement |
| Replay transition | Invariant | Presenting any consumed credential never issues credentials and leaves its session revoked |
| Session limit | Invariant | After successful creation, active sessions for a user never exceed 10 |
| Diagnostic construction | Invariant | Generated passwords, emails, and credentials never appear in copied diagnostics |

Hypothesis domain strategies should generate bounded times, valid credential bytes, session histories, and state transitions. Concrete Login/restore/logout/replay examples remain mandatory alongside these properties.
