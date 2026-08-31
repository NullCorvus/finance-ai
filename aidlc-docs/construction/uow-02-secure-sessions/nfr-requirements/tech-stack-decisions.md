# UOW-02 Secure Sessions — Technology Stack Decisions

## Decision Principle

Extend the proven UOW-01 modular monolith with the fewest new dependencies. HU-002 needs one new direct client package for native secure storage; credential generation, encoding, hashing, HMAC keys, and time-safe comparisons use Python's standard library. Exact executable dependency/configuration changes occur only after Code Generation planning is approved.

## Existing Stack Retained

| Area | Working baseline retained | HU-002 use |
|---|---|---|
| Backend runtime | CPython 3.14.7 / locked 3.14 line | `secrets`, `base64`, `hashlib`, and `hmac` primitives plus existing typed application code |
| API/contracts | FastAPI 0.140.13, Pydantic 2, generated OpenAPI | Login/refresh/me/Logout schemas, Bearer dependency, safe problems/correlation |
| Persistence | SQLAlchemy 2.0.52 synchronous Unit of Work, Alembic 1.19.1, psycopg 3.3.4 | Explicit transactions, row locks, constraints/indexes, session migration |
| Database | PostgreSQL 18.6 Bookworm image | Revocable sessions, unique token hashes, renewable history, concurrency authority |
| Password verification | argon2-cffi 25.1.0 | Existing Argon2id verification plus `check_needs_rehash` behavior |
| Throttling | limits 5.8.0 process-local adapter | Separate Login/renewal rules for current single-instance profile |
| Backend testing | Pytest 9, Hypothesis 6.165.10, PostgreSQL integration | Example/property/concurrency/contract coverage |
| Flutter runtime | Flutter 3.47.2 stable / Dart 3.13.2 | Shared Android/Windows application |
| Flutter architecture | Riverpod 3.4.2, go_router 18.0.0, http 1.6.0 | Auth controller, protected routing, typed HTTP, single-flight renewal |
| Cross-cutting quality | Ruff, mypy, Flutter analyze/test, 80% gates, OpenAPI snapshot, dependency audits, Android/Windows builds | Same mandatory local/CI gates extended to HU-002 |

No JWT library, OAuth client SDK, encryption package, Redis client, queue, state-persistence framework, new router, alternate HTTP client, or biometric package is selected.

## Opaque Credential Primitives

| Concern | Decision | Rationale |
|---|---|---|
| Entropy | `secrets.token_bytes(32)` | Uses the operating system's CSPRNG and gives 256 bits per independent credential |
| Encoding | `base64.urlsafe_b64encode(bytes).rstrip(b'=')` with strict inverse validation | Predictable 43-character URL-safe representation without identity/claims |
| Persistence hash | `hashlib.sha256(raw_bytes).hexdigest()` | Fixed indexed 64-character hash; raw value remains unrecoverable from persistence |
| Account limiter pseudonym | `hmac.new(dedicated_secret, normalized_email_bytes, sha256).hexdigest()` | Prevents raw/ordinary email digests from becoming limiter keys or logs |
| Comparison | Database unique equality plus `hmac.compare_digest` where application comparison is required | Avoids avoidable data-dependent comparison behavior |
| Server time | Timezone-aware UTC clock injected at application boundary | Deterministic expiry tests and no client-clock authority |

Python documents `secrets` as the standard facility for cryptographically strong random numbers suitable for authentication tokens in the [Python secrets documentation](https://docs.python.org/3/library/secrets.html). OWASP recommends meaningless identifiers from a CSPRNG with at least 128 bits when custom-generated; this design uses 256 bits and server-side state in the [Session Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html).

The access and renewable credentials are application-native opaque bearer credentials, not a claim that Finance AI implements the OAuth protocol. RFC 9700 remains relevant security guidance because it defines refresh rotation with predecessor relationship retention and family revocation after replay in [OAuth 2.0 Security Best Current Practice](https://www.rfc-editor.org/rfc/rfc9700.html#name-refresh-token-protection).

## Native Secure Storage Selection

| Decision | Selection |
|---|---|
| Direct package | `flutter_secure_storage` 11 stable line; current reviewed candidate 11.0.0 |
| Windows implementation | Federated `flutter_secure_storage_windows` 4.2.2 selected transitively by 11.0.0 |
| Android mode | Default non-biometric `AndroidOptions()` using RSA-OAEP key wrapping and AES-GCM storage |
| Android minimum | Explicit `minSdk = 24`; plugin 11 also requires compileSdk 37, which must be verified against the locked Flutter/Android toolchain |
| Android backup | `android:allowBackup="false"`; no cloud backup of encrypted storage data/key mismatch |
| Windows protection | Package-managed AES-GCM encrypted files with the encryption key protected through Windows Credential Manager |
| Storage namespace/key | One application-owned constant namespace/key, never derived from email/user id and never included in diagnostics |
| Biometric prompt | Not selected for HU-002; secure storage must work without requiring biometric/device challenge |
| Unsupported fallback | None; platform/storage failure produces safe unauthenticated recovery |

The official package registry lists version 11.0.0 with Android and Windows support and explains its Android RSA-OAEP/AES-GCM defaults in [`flutter_secure_storage`](https://pub.dev/packages/flutter_secure_storage). Its version-specific changelog raises Android `minSdk` to 24 and `compileSdk` to 37 in [the 11.0.0 release notes](https://pub.dev/packages/flutter_secure_storage/changelog#1100---2026-08-06). The Windows implementation documents AES-GCM files and Credential Manager key protection in [`flutter_secure_storage_windows` API documentation](https://pub.dev/documentation/flutter_secure_storage_windows/latest/).

### Platform Configuration Gate

Code Generation must prove, before accepting this dependency:

1. Flutter/Dart constraint and lock resolve `flutter_secure_storage` 11.0.0 and Windows implementation 4.2.2 without dependency override.
2. Android compiles with explicit API 24 minimum and required compile SDK while the debug-only cleartext local exception remains outside release configuration.
3. Android manifest disables application backup; no biometric permission/configuration is added.
4. Windows Visual Studio Build Tools include C++ ATL, as required by the package, and debug/release-compatible plugin artifacts load correctly.
5. Synthetic native tests read, replace, restart-read, and delete one value on Android/Windows without printing it.
6. Upgrade/uninstall/corruption behavior maps to safe reauthentication rather than plaintext fallback or crash.

## Session Persistence Direction

| Concern | Decision |
|---|---|
| ORM | Add `UserSession` and `RenewableCredential` SQLAlchemy models in the existing auth/persistence boundaries |
| Migration | One reviewed Alembic revision with timestamp checks, unique SHA-256 hash constraints, foreign keys, self replacement link, and query indexes |
| Token lookup | Exact unique hash lookup; no decryptable token column and no LIKE/full scan |
| Concurrency | PostgreSQL row-level locking through existing synchronous transaction ownership |
| Cleanup | Application maintenance function operating in bounded idempotent batches; no scheduler dependency in HU-002 |
| DBeaver | Optional read-only safe metadata view; hashes and base tables remain denied |

PostgreSQL stays the concurrency/revocation authority. An in-memory token store would lose Logout/replay state on restart, and an additional cache would add invalidation and multi-store consistency risks without reference-profile benefit.

## API and Flutter Integration Direction

### FastAPI

- Extend the existing auth router/application/repository structure rather than create a second service.
- Use FastAPI's Bearer-header parsing at the transport boundary and the application's own opaque-token lookup/AuthenticatedPrincipal dependency.
- Extend the global problem mapper with stable operation-neutral authentication failures and preserve correlation IDs.
- Extend the existing limiter abstraction for Login/renewal and add a dedicated runtime HMAC-key secret.
- Continue synchronous SQLAlchemy to keep row-lock/transaction behavior explicit; no async conversion is justified.

### Flutter

- Keep `package:http`; extend `FinanceApiClient` with typed GET/Bearer support rather than introducing Dio during HU-002.
- Add an application-lifetime Riverpod authentication controller and small secure-store interface; no persisted Riverpod state.
- Use one single-flight renewal future in the authenticated API boundary and one eligible retry.
- Use existing go_router redirects for Checking/Unauthenticated/Authenticated states.
- Reuse the cross-cutting error diagnostic builder/panel for Login, restoration, storage, refresh, and Logout failures.

## Configuration Decisions

| Setting family | Initial value/policy |
|---|---|
| Access lifetime | 15 minutes; bounded positive configuration |
| Renewable idle lifetime | 30 days; never beyond absolute expiry |
| Absolute session lifetime | 90 days; immutable per session |
| Active sessions per user | 10; bounded 1–100 configuration, default 10 |
| Login source limits | 3/10 seconds and 10/minute |
| Login account limit | 10/15 minutes using HMAC pseudonym |
| Login global limit | 100/minute |
| Renewal source/global | 60/minute and 300/minute |
| Auth HTTP timeout | 15 seconds per attempt |
| Terminal retention eligibility | 30 days after later of revocation/absolute expiry |
| HMAC limiter secret | Runtime secret, at least 32 random bytes; local/test placeholder permitted only in explicitly disposable profile, production placeholder rejected |

Configuration validation occurs at startup/readiness where possible and otherwise fails the request closed. Environment examples contain no real credential. No session signing/encryption key is needed because credentials are random opaque values and only hashes persist.

## Testing Tool Decisions

| Layer | Selected approach |
|---|---|
| Backend unit/example | Existing Pytest with injected clock/generator/hasher/repository fakes |
| Backend PBT | Existing Hypothesis 6 strategies for token bytes/codecs, times, histories, transitions, limits, and secret output |
| Database | Existing PostgreSQL integration service plus multi-connection/thread coordination for row-lock races |
| Contract | Generated FastAPI OpenAPI snapshot and concrete headers/problems |
| Flutter unit/widget | Existing Flutter test, Riverpod overrides, fake secure store, fake HTTP client, router/widget tests |
| Android/shared integration | Existing integration profile extended for auth contract; secure-store platform behavior tested on Android-native target where available |
| Windows native | Existing integration_test plus `frontend/tool/test_windows_and_restore.ps1`; normal app rebuild after testing is mandatory |
| Security/dependencies | Existing `pip-audit`, GitHub dependency review/Dependabot, reviewed `pubspec.lock`, analyzer/build gates |

No Dart PBT framework is added because partial enforcement remains focused on Python's testable credential/session domain. Flutter state transitions use explicit example and integration scenarios.

## Explicit Rejections

| Alternative | Reason not selected for HU-002 |
|---|---|
| JWT access credentials | Adds signing-key/claim-validation complexity and weaker immediate revocation while every protected operation already reaches PostgreSQL |
| Store raw tokens encrypted in PostgreSQL | Decryption is unnecessary for equality lookup and increases disclosure/key-management risk |
| Shared preferences or SQLite for renewable credential | Not an approved secret store |
| Biometric-required storage | Changes user/device requirements and recovery UX beyond HU-002 acceptance criteria |
| Custom Windows DPAPI/Android Keystore plugin | Reimplements maintained platform integration and expands native maintenance burden |
| Redis-backed sessions/limits | No multi-instance requirement; adds infrastructure without reference-profile value |
| Automatic network retry for all requests | Future financial mutations require idempotency rules; broad replay is unsafe |
| QR/session transfer | Credentials must not be transferred through QR/sync data; future synchronization is a separate protocol/story |

## Version Resolution and Evidence Gate

Immediately before Code Generation, the approved code plan must:

1. Recheck the selected secure-storage release/security notes against official package sources.
2. Resolve and commit exact Dart/transitive locks without weakening existing SDK pins.
3. Record Android SDK/backup changes and verify Windows ATL/plugin prerequisites.
4. Run dependency/license/vulnerability review and document any exception.
5. Prove the package with synthetic Android/Windows storage tests before wiring real session credentials.
6. Preserve the existing normal Windows application bundle after native tests.

Until that gate is approved, these selections remain documentation and no dependency or executable configuration has changed.
