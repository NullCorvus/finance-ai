# UOW-02 Secure Sessions — NFR Requirements Plan

## Objective

Define measurable quality constraints and the smallest technology changes needed for HU-002 Login, authenticated context, restoration/renewal, and Logout on Android and Windows. This stage creates documentation only; it does not add dependencies, migrations, API endpoints, Flutter screens, platform configuration, or session code.

## Approved Inputs

- HU-002 Functional Design approved by the user on 2026-08-29.
- UOW-01's working FastAPI, PostgreSQL, Flutter Android/Windows, Docker Compose, diagnostics, OpenAPI, test, and CI foundations.
- Existing local-only university-prototype capacity profile and the requirement to preserve a realistic path to future deployment.
- Security Baseline enabled, Property-Based Testing enabled in partial mode, and Resiliency Baseline disabled.
- The user's prior authorization to select recommended defaults when a choice is bounded and consistent with the approved project direction.

## NFR Question Assessment and Resolved Answers

Every required category was evaluated. HU-002 reuses the approved/implemented stack, and its security behavior was fixed in Functional Design. No unresolved product or architecture choice requires another team question file.

1. What capacity profile should session behavior support?
   [Answer]: Keep one local API and PostgreSQL instance; use 50 registered users, at least 100 simultaneously active device sessions, 10 concurrent test clients, and 60 mixed authentication operations per minute as the reference profile. Do not introduce Redis, queues, microservices, or autoscaling.
2. What latency targets apply?
   [Answer]: Client feedback begins within 100 ms; Login targets p95 at or below 2 seconds and p99 at or below 4 seconds including Argon2id; indexed access validation/current-user targets p95 at or below 250 ms and p99 at or below 500 ms; renewal and Logout target p95 at or below 500 ms and p99 at or below 1 second on the reference environment.
3. What availability/recovery promise applies?
   [Answer]: No uptime percentage for the local prototype. Preserve the existing readiness/startup targets, make issuance/rotation/revocation atomic, distinguish authoritative invalidity from transport failure, and recover without manual database repair.
4. What credential security parameters apply?
   [Answer]: Retain the approved 32-byte opaque credentials, SHA-256 hash-only persistence, 15-minute access, 30-day renewable idle, 90-day absolute session, rotation on every renewal, replay-family revocation, and maximum 10 active sessions per user. Server UTC is authoritative.
5. What Login abuse controls apply?
   [Answer]: Use separate bounded source, pseudonymous-account, and global limits with `Retry-After`; preserve one broad work path and one public failure for unknown, wrong-password, and inactive-user attempts. Keep the existing single-instance limiter boundary and require shared enforcement before multi-instance deployment.
6. How should Android/Windows secure persistence be implemented?
   [Answer]: Add the maintained `flutter_secure_storage` 11 line, locked exactly during Code Generation. Use default non-biometric protected storage, Android API 24 minimum with automatic backup disabled, and the Windows AES-GCM/Credential Manager implementation. Biometric gating is deferred.
7. How should session history and privacy be bounded?
   [Answer]: Retain only hashes and minimal lifecycle metadata needed for replay detection and local diagnosis; define cleanup eligibility after the absolute session window plus a bounded 30-day diagnostic period. Do not collect device fingerprints, raw IP history, User-Agent history, or financial/AI data.
8. What reliability and observability are required?
   [Answer]: Correlation IDs, safe structured lifecycle events/counters, bounded request timeouts, single-flight client renewal, transaction/resource cleanup, fail-closed behavior, and existing copyable secret-free client diagnostics. Hosted alerting and centralized retention wait for a deployment target.
9. What testing and quality gates apply?
   [Answer]: Keep all existing gates and at least 80 percent backend/frontend line coverage. Add example, PostgreSQL concurrency/integration, OpenAPI contract, Flutter controller/widget, secure-store adapter, Android/shared integration, and native Windows smoke tests. Hypothesis covers the approved credential/session properties with shrinking and reproducibility.
10. What usability/accessibility baseline applies?
    [Answer]: English manual Login, visible progress, keyboard/touch access, labeled/associated errors, no color-only status, protected-route stability, clear restoration retry, offline-Logout warning, stable automation keys, and copyable errors with no secrets.

## Execution Checklist

- [x] Record Functional Design approval and load the governing NFR rules/extensions.
- [x] Audit the approved UOW-02 artifacts, reusable UOW-01 NFR baseline, and existing code/tool versions.
- [x] Verify current session/security guidance and Android/Windows secure-storage support against primary sources.
- [x] Define measurable capacity, performance, timeout, availability, recovery, and data-retention requirements.
- [x] Define credential, Login-throttling, transport, secure-storage, privacy, and observability requirements.
- [x] Define maintainability, example/property/integration test, coverage, Android/Windows, usability, and accessibility gates.
- [x] Record technology decisions and exact version-resolution/configuration gates without modifying executable dependencies.
- [x] Classify every Security Baseline rule and enforced PBT rule, validate content, update progress/audit evidence, and request NFR approval.

## Deliverables

- `aidlc-docs/construction/uow-02-secure-sessions/nfr-requirements/nfr-requirements.md`
- `aidlc-docs/construction/uow-02-secure-sessions/nfr-requirements/tech-stack-decisions.md`

## Status

NFR Requirements artifacts are generated and validated. Explicit approval is pending before NFR Design. No application code or dependency changed in this stage.
