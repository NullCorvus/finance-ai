# UOW-02 Secure Sessions — NFR Design Plan

## Objective and Boundary

Map the approved HU-002 functional and non-functional requirements to the smallest concrete pattern set and logical component model that preserves secure Android/Windows sessions. This stage produces documentation only: no source, dependency, platform setting, migration, OpenAPI file, Compose service, or CI workflow changes.

## Approved Inputs

- HU-002 Functional Design approved 2026-08-29.
- HU-002 NFR Requirements approved 2026-08-30.
- Working UOW-01 modular FastAPI/PostgreSQL/Flutter foundation and cross-cutting diagnostics/network boundaries.
- One local API/database profile, independent device sessions, opaque hash-only credentials, rotation/replay revocation, secure native storage, and future synchronization explicitly deferred.

## Resolved Pattern Questions

All mandatory NFR Design categories were evaluated. The approved requirements already constrain each choice, and the user has repeatedly authorized recommended bounded defaults, so another question file would not improve the design.

1. Which resilience pattern applies?
   [Answer]: Fail closed, use database transactions/row locks for state changes, classify authoritative invalidity separately from transport uncertainty, avoid automatic Login/refresh/Logout retries, and use one client single-flight renewal plus at most one eligible protected-request retry.
2. Which scalability pattern applies?
   [Answer]: One modular API and PostgreSQL, unique/indexed credential-hash lookups, short transactions, bounded cleanup, and replaceable limiter storage. No Redis, queue, cache, worker, distributed lock, microservice, or autoscaling component.
3. Which performance pattern applies?
   [Answer]: Perform bounding, normalization, credential hashing, and Argon work outside the shortest possible write transaction; use a credential snapshot plus locked revalidation for Login; use one indexed query for access validation; never write merely to validate an access credential.
4. Which security pattern applies?
   [Answer]: Layer generic real/dummy password verification, 256-bit credential factory, SHA-256 hash-only persistence, HMAC account-limit pseudonyms, server-side principal resolution, rotating renewable history, replay-family revocation, secure-store publish-before-authentication, and secret-free diagnostics/events.
5. Which logical components apply?
   [Answer]: Extend the existing auth, middleware, Unit of Work, PostgreSQL, Riverpod, router, HTTP, diagnostics, health, and test boundaries with narrowly scoped Login/session services, credential policies/repositories, authenticated API client, bootstrap/controller, and secure-storage adapter. Add no speculative infrastructure.

## Execution Checklist

- [x] Record NFR Requirements approval and load the governing NFR Design rules/extensions.
- [x] Analyze the approved functional/NFR artifacts and reusable UOW-01 component patterns.
- [x] Resolve resilience, scalability, performance, security, and logical-component categories without unresolved ambiguity.
- [x] Map each quality requirement family to minimal patterns, including failure and recovery behavior.
- [x] Define Login snapshot/verification/commit, access validation, renewal/replay, restoration, and Logout component interactions.
- [x] Define dependency direction, ownership, transaction/lock, secure-storage handoff, retry, timeout, and observability boundaries.
- [x] Classify Security/PBT design compliance and confirm excluded infrastructure/patterns.
- [x] Generate and validate the two NFR Design artifacts, update progress/audit evidence, and request explicit approval.

## Deliverables

- `aidlc-docs/construction/uow-02-secure-sessions/nfr-design/nfr-design-patterns.md`
- `aidlc-docs/construction/uow-02-secure-sessions/nfr-design/logical-components.md`

## Status

NFR Design artifacts are generated and validated. Explicit approval is pending. Infrastructure remains unchanged and will be formally assessed only after this stage is approved.
