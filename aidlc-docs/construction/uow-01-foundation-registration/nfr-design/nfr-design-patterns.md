# UOW-01 Foundation and Registration — NFR Design Patterns

## Minimal Pattern Set

| Concern | Pattern | UOW-01 application |
|---|---|---|
| Invalid input | Validate early and fail fast | Reject type, size, format, password, and confirmation failures before hashing/database work |
| Credential safety | Isolated security policy | Local unsafe-password check and Argon2id hashing live behind dedicated interfaces; secrets never enter public or logged state |
| Atomicity | Application-owned Unit of Work | User and exact catalogs stage together and commit once or roll back completely |
| Duplicate races | Optimistic check plus authoritative constraint | Early email lookup improves feedback; PostgreSQL normalized-email uniqueness resolves concurrency |
| Abuse | Layered resource controls | Body/content limits, per-source throttling, aggregate ceiling, bounded password work, and safe 429 |
| Errors | Typed failures plus global safe mapper | Known failures become stable problems; unexpected exceptions keep internal detail only in safe logs |
| Diagnostics | Correlation and structured events | One bounded request ID connects safe problem, latency, outcome counter, and log event |
| Dependency readiness | Fail closed | Missing database, COP seed, hasher, or denylist makes readiness false or registration safely unavailable |
| Client uncertainty | Manual retry plus server uniqueness | Flutter times out safely; backend does not automatically replay POST; a later retry cannot duplicate the email |
| Performance | Expensive work outside short transaction | Validate and hash first; open the transaction only for reference lookup, staging, flush, and commit |

## Request Pipeline

The logical order is: correlation ID and safe context, body/content enforcement, rate limit, typed request validation, thin registration route, application service, safe result/problem mapper. Every rejection bypasses downstream work that is no longer needed.

## Transaction Pattern

The application service opens one Unit of Work only after command validation and password hashing. Repositories never commit. The service resolves COP, checks email, stages the user and catalogs, flushes constraints, then commits once. Any exception exits through rollback and resource cleanup.

A unique-email constraint violation is mapped to conflict only when the violated constraint is positively identified. Other integrity errors remain configuration/internal failures, preventing false conflict responses.

## Retry and Timeout Policy

- Flutter prevents repeated taps and uses a 15-second request timeout.
- The registration service does not automatically retry a non-idempotent POST or database commit.
- A user-initiated retry is safe with respect to duplication because normalized-email uniqueness remains authoritative.
- Database connection acquisition and statements use bounded timeouts selected during code planning.
- Health/readiness checks may retry during local service startup; those retries do not execute registration.

## Scalability Restraint

The reference design deliberately uses one API instance. There is no cache, queue, event bus, Redis, background worker, load balancer, or microservice. The rate limiter exposes a storage boundary solely so a future approved multi-instance deployment can substitute shared enforcement without changing registration business logic.

## Security Layers

1. Only explicitly public routes bypass future authentication; registration is public by design.
2. Content type, body size, unknown fields, types, lengths, and formats are bounded.
3. Passwords are not transformed and are checked locally against the approved unsafe-password corpus.
4. Argon2id transforms valid plaintext before persistence work.
5. SQLAlchemy parameter binding and PostgreSQL constraints protect persistence integrity.
6. Throttling limits repeated expensive attempts.
7. Safe errors/logs/metrics exclude credentials and unnecessary PII.
8. Missing security dependencies fail closed.

## Observability Pattern

Every attempt produces one final safe outcome classification and duration. Counters have no email label. Expected 4xx outcomes remain distinguishable from 5xx failures. Health endpoints expose status only. Local output goes to standard output; no hosted telemetry system is introduced.

## Test Pattern

Example tests pin every HU-001 scenario and failure. Hypothesis supplements them for normalization, boundaries, catalog invariants, safe outputs, and applicable serialization round trips. PostgreSQL integration tests prove constraints and rollback. Flutter unit/widget tests prove state and accessibility. Randomized tests keep shrinking and reproduction information.

## Excluded Patterns

Automatic command retry, eventual consistency, sagas, queues, distributed locks, caches, circuit breakers, service discovery, horizontal scaling, external breached-password calls, and product AI are unnecessary or harmful for this unit.
