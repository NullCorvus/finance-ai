# UOW-02 Secure Sessions — Functional Design Plan

## Objective

Design HU-002 as the next executable vertical slice: a registered user can log in, enter an authenticated Home placeholder, restore a renewable session on Android and Windows, and log out. HU-003 preferences and all financial/AI behavior remain outside this slice unless the team explicitly expands it.

## Evidence Loaded

- [x] Read the approved requirements, HU-002 acceptance criteria, application design, UOW-02 definition, dependencies, and task queue.
- [x] Audited the registration backend, Argon2id verifier, FastAPI middleware/errors/rate limits, SQLAlchemy/Alembic conventions, OpenAPI gate, and backend tests.
- [x] Audited the Flutter Login placeholder, Riverpod state, GoRouter routes, API/diagnostic contract, Android/Windows runners, tests, and CI builds.
- [x] Checked current OWASP session/authentication guidance, OAuth 2.0 Security BCP refresh-token rotation guidance, and the current Android/Windows secure-storage package requirements.
- [x] Identified cross-cutting refactors required before session code: operation-neutral API validation/errors, reusable authenticated-request handling, login-specific throttling, secure storage bootstrap, and protected routing.

## Planned Functional Artifacts

- [x] Validate the five team decisions below and resolve any ambiguity.
- [x] Define login, access validation, refresh rotation/replay handling, restoration, logout, and failure flows.
- [x] Define session and refresh-token entities, lifecycle states, concurrency rules, timestamps, and revocation invariants.
- [x] Define generic credential errors, inactive-user behavior, rate-limit behavior, and password-rehash-on-login rules.
- [x] Define Flutter authentication bootstrap, secure credential storage, authenticated routing, Login/Home interactions, and offline logout behavior.
- [x] Identify testable properties and example scenarios, including token entropy/format, hash-only persistence, expiry boundaries, one-time refresh consumption, replay revocation, and secret-free diagnostics.
- [x] Validate security/PBT compliance, update progress/audit evidence, and request functional-design approval before NFR Requirements.

## Recommended Technical Direction

The recommended design uses 256-bit cryptographically random opaque credentials. Access credentials are short-lived and held only in Flutter memory. Renewable credentials are stored through platform secure storage and rotated on every refresh. PostgreSQL stores only SHA-256 token hashes and server-side session state; raw tokens never enter the database, logs, diagnostics, URLs, or DBeaver views. Refresh-token history retains the rotation relationship so replay can revoke that session family. Each Android or Windows installation has an independent session.

## Team Decisions

### Question 1
Which credential model should HU-002 use?

A) Database-backed opaque access and rotating renewable credentials, both generated with at least 256 bits of entropy; immediate server-side revocation and no signing-key dependency (Recommended)

B) Signed JWT access credentials plus database-backed rotating renewable credentials; fewer access lookups but additional signing-key, claim-validation, and delayed-revocation complexity

C) Other (please describe after the [Answer]: tag below)

[Answer]: A

### Question 2
Which session lifetimes should be the initial configurable defaults?

A) 15-minute access lifetime, 30-day renewable idle lifetime, and 90-day absolute session lifetime (Recommended)

B) 30-minute access lifetime and 30-day renewable lifetime without a separate absolute limit

C) 10-minute access lifetime, 7-day renewable idle lifetime, and 30-day absolute lifetime

D) Other (please describe after the [Answer]: tag below)

[Answer]: A

### Question 3
How should simultaneous Android/Windows sessions behave?

A) Permit up to 10 independent sessions per user; each logout revokes only the current installation and the oldest active session is revoked when the limit is exceeded (Recommended)

B) Permit only one active session; logging in on one installation revokes every other installation

C) Other (please describe after the [Answer]: tag below)

[Answer]: A — Independent Android/Windows sessions now. Preserve a future offline-first path in which each client keeps local financial data and a queued change log, synchronizes through an intermediary server when connectivity returns, automatically combines non-conflicting changes, and presents true same-record conflicts instead of silently corrupting financial history. Direct QR transport may be evaluated later, but synchronization is not implemented inside HU-002.

### Question 4
What should happen when the user chooses Logout while the API is unreachable?

A) Clear the local renewable credential and leave protected screens immediately; attempt server revocation first and show a safe copyable warning if it cannot be confirmed (Recommended)

B) Keep the user logged in locally until the server confirms revocation

C) Other (please describe after the [Answer]: tag below)

[Answer]: A

### Question 5
Where should this delivery slice stop?

A) Complete HU-002 only and enter a minimal authenticated Home placeholder; implement HU-003 preferences immediately afterward (Recommended)

B) Implement HU-002 sessions and HU-003 preferences together before the next review

C) Other (please describe after the [Answer]: tag below)

[Answer]: A

## Preliminary Verification Boundary

The implementation plan will require unit, property, contract, PostgreSQL integration, Flutter widget/controller, secure-storage adapter, Android/shared integration, and native Windows smoke coverage. The Definition of Done includes formatting, static analysis, migration/model drift, OpenAPI regeneration, dependency audits, at least 80 percent coverage in each existing gate, normal Android/Windows builds, and restoration of the visible Windows application bundle after native tests.

## Extension Compliance at Planning

- Security Baseline: enabled and applicable. The plan includes generic credential behavior, brute-force controls, hash-only token persistence, server-side expiry/revocation, least-privilege protected routing, secure native storage, deny-by-default authorization, secret-free observability, and loopback-only local HTTP. Hosted encryption, centralized alerting/retention, SBOM publication, TLS termination, MFA, and cookie attributes remain production/deployment concerns; no browser cookie transport is used by this native-client slice.
- Property-Based Testing: partial enforcement. PBT-02, PBT-03, PBT-07, PBT-08, and PBT-09 apply to credential encoding/decoding and session invariants; Hypothesis is already selected, locked, and executed in CI. Flutter logic remains primarily example-tested because no Dart PBT framework is currently approved.
- Resiliency Baseline: disabled. Lightweight retry/concurrency/fail-closed behavior remains part of normal session correctness, not extension enforcement.
