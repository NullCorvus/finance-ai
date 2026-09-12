# UOW-01 Foundation and Registration — NFR Requirements

## Status and Boundary

This document defines quality requirements for EN-001 through EN-006 and HU-001. It is a construction design artifact, not application code.

| Defined here | Created only after a Code Generation plan is approved |
|---|---|
| Measurable targets, security rules, quality gates, selected technology families | backend and frontend projects, source files, dependency manifests/locks, containers, migrations, CI workflows, tests, and executable configuration |

Product AI, sessions, financial accounts, financial movements, hosted cloud infrastructure, and production operations remain outside UOW-01.

## Operating and Capacity Profile

UOW-01 targets a shared Android and Windows Flutter university prototype operated locally by the team through one API instance and one PostgreSQL instance. Both targets must be testable from Windows development hosts using a documented clean setup.

| ID | Requirement |
|---|---|
| NFR-CAP-001 | The reference dataset contains at least 50 registered users with complete starter catalogs. |
| NFR-CAP-002 | The registration path supports 10 concurrent requests from distinct test clients without partial registrations, unhandled errors, or connection exhaustion. |
| NFR-CAP-003 | The reference aggregate load is 60 registration requests per minute before rate-limit rejection; load tests use controlled test keys/configuration and never weaken the deployed default. |
| NFR-CAP-004 | The architecture remains one modular API and one database. Capacity findings do not authorize microservices, Redis, queues, or autoscaling for this unit. |
| NFR-CAP-005 | A future hosted target must reassess load, shared rate-limit storage, availability, TLS, backups, and monitoring before release. |

## Performance

The reference environment is a development machine with at least four logical CPU cores, 8 GB system memory, and at least 4 GB available to local containers. Measurements exclude first-time downloads, dependency installation, image pulls, and cold database initialization.

| ID | Requirement |
|---|---|
| NFR-PERF-001 | Register enters visible Submitting state within 100 ms of a valid tap. |
| NFR-PERF-002 | Under the reference capacity profile, POST /api/v1/auth/register has p95 latency at or below 2 seconds and p99 at or below 4 seconds, measured end-to-end at the API boundary and including password hashing. |
| NFR-PERF-003 | A locally invalid form shows field guidance without a network call and without a perceivable blocking operation. |
| NFR-PERF-004 | Password hashing is deliberately expensive and is never weakened solely to satisfy latency. If targets conflict, security parameters remain at or above the minimum and the capacity/latency target is reassessed. |
| NFR-PERF-005 | The Flutter client uses a bounded 15-second registration request timeout and converts timeout/transport failure into a safe retryable state. A later retry must still rely on server uniqueness. |

## Availability, Reliability, and Recovery

No uptime percentage or disaster-recovery SLA applies to the local prototype.

| ID | Requirement |
|---|---|
| NFR-REL-001 | API liveness and readiness are separate: liveness shows the process is running; readiness fails while required database connectivity or seed prerequisites are unavailable. |
| NFR-REL-002 | After required images/dependencies already exist locally, the API and database become ready within 90 seconds on the reference environment. |
| NFR-REL-003 | The user plus 3 categories and 2 income sources commit atomically. Every pre-commit error rolls back all registration rows. |
| NFR-REL-004 | Restarting the API or rerunning repeatable currency/template seed logic does not duplicate or corrupt shared reference data. |
| NFR-REL-005 | Database connections and transactions are released on success, validation failure, conflict, timeout, and unexpected failure. |
| NFR-REL-006 | A documented clean setup and teardown process can be followed by another team member without editing committed secrets. |
| NFR-REL-007 | Before any hosted demonstration containing non-test data, the team must document and rehearse PostgreSQL backup and restore. This is not required for the current local-only unit. |

## Security and Privacy

### Input and Endpoint Protection

| ID | Requirement |
|---|---|
| NFR-SEC-U01-001 | Registration is explicitly public; every other future application route is denied by default unless deliberately classified public. Development API documentation is not exposed in a future production profile without explicit authorization. |
| NFR-SEC-U01-002 | Registration accepts application/json only. The request body is bounded to 16 KiB; unknown fields and unexpected types are rejected. |
| NFR-SEC-U01-003 | Email is required, bounded to 320 characters, trimmed only at its boundaries, lowercased, validated, and protected by a database uniqueness constraint. |
| NFR-SEC-U01-004 | Password and confirmation are 8–128 characters. Password values are not trimmed, case-folded, Unicode-normalized, or silently modified; equality is exact. |
| NFR-SEC-U01-005 | SQL is produced through SQLAlchemy parameter binding. Raw user input is never concatenated into SQL, commands, paths, or log templates. |
| NFR-SEC-U01-006 | Unsupported HTTP methods and media types are rejected consistently; public errors never include stack traces, SQL, paths, environment values, or framework versions. |

### Credential Protection

| ID | Requirement |
|---|---|
| NFR-SEC-U01-007 | Password hashes use Argon2id through a maintained library with a unique salt and at least 19 MiB memory, 2 iterations, and parallelism 1. Stronger calibrated parameters are allowed when the reference environment meets performance targets. |
| NFR-SEC-U01-008 | A versioned local common/breached-password denylist rejects known unsafe candidates without transmitting the password or any password-derived prefix to an external service. The corpus source and license are verified before it is added. |
| NFR-SEC-U01-009 | Failure to initialize the password hasher or required denylist fails closed: readiness is false or registration returns a safe unavailable response. |
| NFR-SEC-U01-010 | Plaintext passwords and hashes never enter logs, metrics, traces, public responses, crash reports, fixtures, screenshots, persisted Flutter/Riverpod state, or source control. Test credentials are synthetic. |

### Abuse Prevention and Secrets

| ID | Requirement |
|---|---|
| NFR-SEC-U01-011 | Default registration throttling allows at most 10 attempts per 60 seconds per network source, with a short burst ceiling of 3 attempts per 10 seconds, and returns 429 plus Retry-After. A 100-attempt aggregate per-minute ceiling protects the single instance. |
| NFR-SEC-U01-012 | Rate-limit keys do not store/log raw email or password data. Local test overrides are explicit and cannot become the default deployment profile. A multi-instance deployment must replace process-local state with a shared enforcement layer. |
| NFR-SEC-U01-013 | Secrets and database credentials come from environment/runtime configuration. A safe .env.example may be committed; real .env files, credentials, and keys may not be committed. |
| NFR-SEC-U01-014 | HTTP is acceptable only on loopback/local Compose development networks. Any non-loopback demonstration or deployment carrying credentials requires HTTPS/TLS before use. |
| NFR-SEC-U01-015 | The PostgreSQL service is private to the Compose network by default. Any developer port exposure is loopback-only and uses non-default documented local credentials. |

### Logging and Privacy

| ID | Requirement |
|---|---|
| NFR-SEC-U01-016 | Backend logs are structured and contain timestamp, severity, event name, correlation/request ID, outcome code, and duration. They omit request bodies, raw email, passwords, hashes, tokens, and unnecessary PII. |
| NFR-SEC-U01-017 | The API accepts or creates a bounded correlation ID, returns it safely, and prevents control characters/log injection. |
| NFR-SEC-U01-018 | Registration records only the identity and catalogs defined by HU-001. No device fingerprint, analytics profile, receipt, financial data, or AI data is collected. |
| NFR-SEC-U01-019 | Local logs go to standard output for team diagnostics. Centralized tamper-resistant collection, retention, and alerting are mandatory design decisions only if a hosted target is authorized. |

## Observability

| ID | Requirement |
|---|---|
| NFR-OBS-001 | Registration emits safe counters for attempts, successes, validation failures, duplicate conflicts, throttles, configuration failures, unexpected failures, and latency buckets without email labels. |
| NFR-OBS-002 | Logs distinguish expected 4xx outcomes from unexpected 5xx failures and share the same correlation ID as the public problem response. |
| NFR-OBS-003 | Health endpoints reveal only safe status and do not expose credentials, connection strings, database names, schema details, or dependency versions. |
| NFR-OBS-004 | No external telemetry service is required for local completion; the logging/metrics boundary must permit one later without changing domain logic. |
| NFR-OBS-005 | Every user-visible client failure provides a stable code and a copyable secret-free report with operation, UTC time, platform, sanitized API location, request/correlation ID, and bounded safe reason. |

## Maintainability and Team Quality

| ID | Requirement |
|---|---|
| NFR-MNT-001 | Backend and frontend remain separate roots with feature-focused modules, shared contracts, and no circular dependency from domain/application logic into transport or persistence adapters. |
| NFR-MNT-002 | Supported runtime lines are documented; exact dependencies, SDKs, container images, and CI actions are pinned through committed locks or immutable references during Code Generation. No latest tag is allowed. |
| NFR-MNT-003 | Formatting, linting, backend type checking, migration checks, API contract checks, dependency vulnerability review, and tests run consistently locally and in GitHub Actions. |
| NFR-MNT-004 | New UOW-01 backend and frontend code reaches at least 80 percent line coverage, but coverage never substitutes for explicit HU-001 success, boundary, conflict, rollback, security, and UI-state tests. |
| NFR-MNT-005 | Another team member must reproduce clean setup and review the change before HU-001 is complete. |
| NFR-MNT-006 | OpenAPI is generated from the backend contract and checked against the Flutter integration assumptions; stable error codes are tested without string-matching human messages. |
| NFR-MNT-007 | Dependency upgrades occur through reviewed lockfile changes followed by the full quality suite. Unused packages are removed. |

## Testing Requirements

| ID | Requirement |
|---|---|
| NFR-TST-001 | Example-based tests cover every HU-001 acceptance criterion, all documented statuses, exact catalog contents, no-account/no-session exclusions, and rollback at each staged failure point. |
| NFR-TST-002 | Database integration tests use PostgreSQL, not an in-memory substitute with different constraint/transaction behavior. |
| NFR-TST-003 | Hypothesis verifies applicable backend properties: normalization idempotence/equivalence, password boundaries, safe output invariants, catalog cardinality/ownership, and serialization round trips where a logical inverse exists. |
| NFR-TST-004 | Domain generators produce structurally valid email variants and bounded Unicode passwords and deliberately include boundary values; shrinking remains enabled. |
| NFR-TST-005 | Property-test failures report a reproducible seed and shrunk example in local/CI output. A discovered regression becomes a permanent example test. |
| NFR-TST-006 | Flutter unit/widget tests cover controller transitions, repeated-tap suppression, safe field mapping, secret clearing, accessibility labels, and single Login navigation. |
| NFR-TST-007 | One integration path verifies Flutter request/response compatibility against the real API/PostgreSQL boundary or an equivalent generated-contract gate plus a real API end-to-end test. |

## Usability and Accessibility

| ID | Requirement |
|---|---|
| NFR-UX-001 | The registration interface and public feedback are English and understandable without technical knowledge. |
| NFR-UX-002 | Every field has a persistent label; errors are associated with controls and are not communicated by color alone. |
| NFR-UX-003 | Keyboard traversal, focus on the first invalid field, visibility-toggle semantics, and progress announcements work in widget tests. |
| NFR-UX-004 | Register remains disabled during submission, safe retry remains possible, and no failure or success falsely implies authentication. |
| NFR-UX-005 | Stable automation keys from the functional design remain part of the test contract. |

## Security Baseline Compliance

Status here means the rule is represented correctly as a requirement for this unit; implementation verification occurs later.

| Rule | Status | UOW-01 disposition |
|---|---|---|
| SECURITY-01 | N/A for local-only target | Non-loopback use requires TLS; hosted encryption design awaits a deployment target |
| SECURITY-02 | N/A | No load balancer, gateway, or CDN exists in UOW-01 |
| SECURITY-03 | Compliant | Structured secret-free application logging defined; centralized sink deferred to hosting |
| SECURITY-04 | N/A | Native Flutter client and JSON API serve no HTML application |
| SECURITY-05 | Compliant | Type, length, format, content-type, body-size, and parameterized-query constraints defined |
| SECURITY-06 | N/A | No cloud IAM roles or policies exist |
| SECURITY-07 | Compliant | Database private on Compose network and loopback-only exception documented |
| SECURITY-08 | Compliant | Registration explicitly public; deny-by-default rule established for other routes |
| SECURITY-09 | Compliant | Safe errors, supported versions, no default credentials/latest images defined |
| SECURITY-10 | Compliant | Locks, reviewed sources, vulnerability checks, immutable CI/image references, and future SBOM requirement defined |
| SECURITY-11 | Compliant | Dedicated auth boundaries, layered uniqueness/validation, rate limiting, and race/retry misuse cases defined |
| SECURITY-12 | Compliant for registration | Argon2id, breached/common denylist, minimum length, no hardcoded secrets, and throttling defined; MFA/admin and sessions are not part of HU-001 |
| SECURITY-13 | Compliant | Safe JSON validation and supply-chain integrity defined; full financial audit trail is outside registration |
| SECURITY-14 | N/A for local-only target | Safe counters/log events defined; centralized alerts and retention await hosting |
| SECURITY-15 | Compliant | Fail-closed dependencies, global safe errors, cleanup, rollback, and resource release defined |

No blocking security finding remains at the NFR Requirements stage.

## Property-Based Testing Compliance

The project remains in partial enforcement mode.

| Rule | Status | UOW-01 disposition |
|---|---|---|
| PBT-02 | Compliant requirement | Logical serialization inverses must have generated round-trip tests |
| PBT-03 | Compliant requirement | Registration invariants and boundaries are explicitly identified |
| PBT-07 | Compliant requirement | Domain-specific email/password/registration generators required |
| PBT-08 | Compliant requirement | Shrinking, seed output, CI execution, and regression capture required |
| PBT-09 | Compliant | Hypothesis selected for applicable Python/backend properties; Flutter property testing is N/A in partial backend-domain mode |

No blocking PBT finding remains at the NFR Requirements stage.
