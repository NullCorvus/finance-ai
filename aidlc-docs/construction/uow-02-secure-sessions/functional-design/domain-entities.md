# UOW-02 Secure Sessions — Domain Entities

## Domain Boundary

The secure-session domain extends the UOW-01 identity boundary with revocable device sessions and one-time renewable-credential history. Raw passwords and credentials are transient secrets, not business records. Financial records, preferences, synchronization operations, and AI data remain outside this unit.

## Existing Entity Used

### AppUser

UOW-02 reads the existing normalized email, Argon2id password hash, active status, public identifier, and preferred currency relationship. A successful Login may upgrade an outdated password hash. The public authenticated-user projection never contains `password_hash`.

## Persisted Entities

### UserSession

One row represents one Android or Windows installation's independently revocable session family.

| Field | Rule |
|---|---|
| id | Server-generated primary identifier; safe internal session reference |
| user_id | Required foreign key to AppUser; indexed ownership root |
| access_token_hash | Required unique lowercase SHA-256 hex digest; raw access credential is absent |
| access_expires_at | Required timezone-aware UTC instant; access is invalid at or after this time |
| idle_expires_at | Required timezone-aware UTC instant; renewable activity may extend it only to the absolute bound |
| absolute_expires_at | Required immutable timezone-aware UTC upper bound for the session family |
| client_platform | Required bounded value: `android`, `windows`, or `unknown`; informational, not authority-bearing |
| revoked_at | Nullable timezone-aware UTC instant; present means the entire session is inactive |
| revocation_reason | Nullable bounded internal classification such as `logout`, `session_limit`, `replay`, or `user_inactive` |
| created_at | Server-managed timezone-aware UTC creation instant |
| updated_at | Server-managed timezone-aware UTC last mutation instant |

Constraints require `access_expires_at > created_at`, `idle_expires_at > created_at`, `absolute_expires_at > created_at`, and `idle_expires_at <= absolute_expires_at` at valid creation. A revoked session never becomes active again. Rotation updates the access hash/expiry and idle expiry but not `user_id`, `created_at`, or `absolute_expires_at`.

### RenewableCredential

One row records one link in a session family's renewable-credential chain. History is retained long enough to detect replay.

| Field | Rule |
|---|---|
| id | Server-generated primary identifier |
| session_id | Required foreign key to UserSession with session-family ownership |
| token_hash | Required unique lowercase SHA-256 hex digest; raw credential is absent |
| created_at | Required server UTC issuance instant |
| expires_at | Required UTC expiry, bounded by the session idle and absolute expirations |
| consumed_at | Nullable UTC instant; present means this credential can never renew again |
| replaced_by_id | Nullable self-reference to the one credential created by successful consumption |

`expires_at > created_at`. An unconsumed current credential has both `consumed_at` and `replaced_by_id` null. A successfully consumed credential has both populated, and `replaced_by_id` is unique so one predecessor cannot create multiple replacements. A replayed credential remains consumed; replay changes the parent session to revoked rather than creating another row.

## Relationships and Cardinality

| Source | Relationship | Target | Cardinality |
|---|---|---|---|
| AppUser | Owns device sessions | UserSession | 0..10 active; any number of bounded historical rows |
| UserSession | Contains rotation history | RenewableCredential | 1..many after successful Login |
| RenewableCredential | Replaced by | RenewableCredential | 0..1 successor and 0..1 predecessor |

Deleting a development user may cascade session data according to the existing database lifecycle. Normal product behavior revokes rather than deletes sessions so security history remains available under the later retention policy.

## Transient Backend Values

### LoginCommand

Carries email, password, and client platform from the transport boundary. It is request-scoped and must not be logged or persisted as a whole. Client platform is server-validated metadata and grants no permissions.

### RenewableCredentialCommand

Carries one raw renewable credential for restoration, renewal, or Logout. It is request-scoped, bounded before hashing, and absent from all public diagnostics.

### GeneratedCredential

A secret value wrapping exactly 32 random bytes and its unpadded base64url representation. It can be returned once at a successful issuance boundary and hashed for persistence. It must never be attached to an ORM entity.

### AuthenticatedPrincipal

Contains the validated `user_id` and `session_id` needed by application services. It contains no raw credential, password hash, role claim, or client-provided ownership value.

### IssuedSession

The application result produced only after commit. It contains the public user projection, raw access/renewable credentials, and their UTC expirations. Transport marks it non-cacheable and does not log/serialize it outside the response.

### PublicAuthenticatedUser

Contains only safe fields required immediately after Login/renewal and by `GET /auth/me`, such as public user id, normalized email, and preferred currency code. It excludes hashes, session history, internal status classifications, and owned financial/catalog data.

### ApiProblem

Uses the existing safe problem contract with stable code, status, detail, optional bounded field errors, and correlation id propagation. It contains no raw input, hash, internal exception, SQL, or storage detail.

## Flutter Authentication Values

### AuthSession

An in-memory-only value containing PublicAuthenticatedUser, raw access credential, access expiry, and non-secret session timing hints. It is not written to ordinary preferences, disk cache, analytics, logs, diagnostics, or clipboard.

### StoredRenewableCredential

A value accessible only inside `SecureCredentialStore`. The adapter can read, replace, and delete it but never exposes it to Riverpod serialization, widget diagnostics, generic exception text, or copyable reports.

### AuthenticationState

An immutable discriminated state with these variants:

| Variant | Required safe data |
|---|---|
| Checking | No authenticated principal; restoration in progress |
| Unauthenticated | Optional safe notice/diagnostic; no credentials |
| SubmittingLogin | No credential; duplicate submissions disabled |
| Authenticated | In-memory AuthSession only |
| RestorationRetry | Safe diagnostic; renewable credential remains inside secure storage |
| LoggingOut | Existing session is blocked from duplicate Logout actions |

Secrets are never embedded in equality output, debug descriptions, persisted state, or error values.

## Aggregate Invariants

1. Every UserSession belongs to exactly one existing AppUser.
2. Every RenewableCredential belongs to exactly one UserSession and therefore one AppUser.
3. Raw access and renewable credentials are absent from every persisted entity.
4. Hash columns are unique, 64-character lowercase hexadecimal SHA-256 values.
5. A valid active session is not revoked, belongs to an active user, and is before access, idle, and absolute expiration as applicable.
6. A successful renewal consumes exactly one current credential and creates exactly one linked current replacement.
7. A consumed credential is never current again.
8. Replay revokes the complete UserSession and creates no replacement.
9. Absolute expiry is immutable and no idle/renewable expiry exceeds it.
10. At most 10 UserSession rows for one user are active after a Login transaction commits.
11. Logout revokes only the session resolved from the presented renewable credential.
12. Session creation/rotation is all-or-nothing; no credential is returned before commit.

## Lifecycle Transitions

### UserSession

| Current state | Event | Next state | Required mutation |
|---|---|---|---|
| Absent | Successful Login | Active | Create session and initial renewable row atomically |
| Active | Valid protected request | Active | No authority extension |
| Active | Successful renewal | Active | Replace access hash/expiry, advance bounded idle expiry, rotate renewable row |
| Active | Access expires | Active session, expired access | Renewal may still restore while idle/absolute bounds allow |
| Active | Idle or absolute bound reached | Expired | No credential may restore it |
| Active | Logout | Revoked | Set revoked time/reason |
| Active | Session limit evicts oldest | Revoked | Set revoked time/reason before new session commit |
| Active | Consumed credential replay | Revoked | Revoke family atomically and issue nothing |
| Any non-revoked state | User becomes inactive | Denied/revoked by policy | No protected authority or renewal |
| Revoked or Expired | Any request | Terminal | Never reactivate |

### RenewableCredential

| Current state | Event | Next state |
|---|---|---|
| Current | Valid renewal under row lock | Consumed and linked to one new Current credential |
| Current | Expiry/session invalidation | Expired/Unusable; no successor |
| Consumed | Presented again | Replayed; parent session revoked |
| Any | Parent session revoked/expired | Unusable |

## Concurrency Model

- Renewable lookup and parent session are locked for a state-changing renewal or Logout.
- The database uniqueness constraints and one transaction are final authority even if two application workers race.
- Flutter single-flight renewal reduces accidental replay, but correctness does not depend on the client behaving properly.
- A Logout/renewal race has one serialized database result. Once revocation commits, no later renewal can issue authority.
- Session-limit selection uses a deterministic oldest order (`created_at`, then `id`) under transaction protection.

## Required Indexes and Safe Inspection

| Data | Required access path |
|---|---|
| UserSession access_token_hash | Unique indexed lookup for every protected request |
| UserSession user_id/state/created_at | Indexed active-session count and deterministic oldest selection |
| RenewableCredential token_hash | Unique indexed renewal/Logout lookup |
| RenewableCredential session_id | Indexed session-history and revocation lookup |

The opt-in DBeaver viewer may expose a `finance_ai_view.user_session` metadata view containing safe identifiers, platform, timestamps, active/revoked state, and reason. It must exclude access hashes, renewable hashes, replacement hashes, password hashes, and all raw credentials. The read-only viewer receives no base-table access.

## Deferred Synchronization Entities

HU-002 does not create `ClientReplica`, `SyncOperation`, `OutboxEntry`, `RecordRevision`, `Conflict`, or `Tombstone`. Those concepts require a separately approved financial synchronization story. Authentication identifiers must not be reused as financial record identifiers, synchronization operations, or QR payload contents.

The later story should prefer client-generated UUID-compatible record identifiers, explicit revisions, idempotency keys, and deletion tombstones so Android/Windows offline operations can reconcile through a server without silent loss.

## Property-Oriented Entity Tests

- Generated credential codecs preserve all 32 input bytes and hashes have canonical format.
- Arbitrary valid timestamp combinations preserve idle and absolute bounds through renewal.
- Arbitrary valid rotation chains contain exactly one current leaf and no branching predecessor.
- Presenting any non-current chain member cannot create a new leaf and revokes its session.
- Arbitrary session histories processed by the limit rule produce at most 10 active rows and evict the deterministic oldest rows.
- Entity/result/debug representations never contain generated raw secret samples.
