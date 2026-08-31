# UOW-01 Foundation and Registration — Logical Components

## Component Map

| Boundary | Logical component | Responsibility | Failure behavior |
|---|---|---|---|
| Flutter | Register Screen/Form | Collect labeled email/password/confirmation and expose accessible feedback | Local guidance or typed controller event; no secrets persisted |
| Flutter | Registration Controller | Immutable state, duplicate-tap guard, timeout, result/error mapping, one Login navigation | Safe editable/retryable state; never authenticated state |
| Flutter | Auth Repository/API Client | Serialize the versioned command and decode result/problem codes | Typed transport or API failure; no message-string logic |
| API boundary | Request Guard Pipeline | Correlation, JSON/body limits, rate limiting, schema validation | Safe 4xx/429 before business work |
| API boundary | Registration Route | Map HTTP to/from the transport-independent use case | Delegates all behavior; global mapper catches unexpected failure |
| Application | Registration Service | Orchestrate policy, hashing, Unit of Work, repositories, and one commit | Typed failure and rollback; no automatic retry |
| Domain/application | Registration Policy | Normalize email and validate all bounded credential rules | Aggregated safe field errors |
| Security | Unsafe Password Provider | Load and query the verified local denylist | Fail closed/readiness false if unavailable |
| Security | Password Hasher | Produce Argon2id hashes using approved minimum/calibrated parameters | Fail closed; secret-free internal event |
| Application | Catalog Template Provider | Return exact immutable versioned starter names | Configuration failure if invalid/unavailable |
| Persistence | Unit of Work | Own session, flush, commit, rollback, and cleanup | Complete rollback and resource release |
| Persistence | User/Currency/Catalog Repositories | Query/stage parameterized persistence operations without committing | Propagate typed/not-classified persistence errors |
| Data | PostgreSQL | Constraints, normalized-email uniqueness, relationships, atomic commit | Transaction failure is authoritative and never leaves partial rows |
| Operations | Health/Readiness | Report process health and required dependency readiness safely | Not-ready without database/COP/hasher/denylist prerequisites |
| Operations | Safe Logger/Metrics | Emit correlation, outcome, duration, and bounded counters | Must never block registration or expose secrets/PII |

## Dependency Direction

Flutter widgets depend on the controller, which depends on a repository abstraction. The API route depends on the registration application service. The service depends on policy, security, template, repository, and Unit of Work interfaces. Concrete HTTP, SQLAlchemy/PostgreSQL, local denylist, and logging adapters remain outside domain/application logic.

No persistence or transport adapter is allowed to call Flutter or domain presentation code. No repository commits. No security component returns plaintext or public-facing exception text.

## Registration Sequence by Component

1. Register Screen asks Registration Controller to submit.
2. Controller enters Submitting once and calls Auth Repository/API Client.
3. Request Guard Pipeline enforces correlation, resources, throttle, and schema.
4. Registration Route constructs the command and invokes Registration Service.
5. Registration Policy validates; Unsafe Password Provider rejects unsafe candidates; Password Hasher hashes valid plaintext.
6. Registration Service opens Unit of Work, resolves COP, checks uniqueness, and stages AppUser plus exact catalogs through repositories/template provider.
7. Unit of Work flushes and commits once; PostgreSQL enforces the final constraints.
8. Safe result/problem mapping returns to the Controller.
9. Controller exposes feedback and, on success only, clears secrets and navigates once to Login.

## Resource Ownership

| Resource | Owner |
|---|---|
| Ephemeral form secrets | Flutter form lifecycle |
| HTTP request/correlation context | Request Guard Pipeline |
| Plaintext password during validation/hash | Registration service call scope |
| SQLAlchemy session/transaction | Unit of Work |
| Database connection | Session/engine pool; returned on every path |
| Starter catalog definition | Immutable Catalog Template Provider |
| Persisted user/catalog rows | PostgreSQL transaction, then new AppUser ownership |

## Infrastructure Decision

No separate hosted Infrastructure Design stage is useful for UOW-01. The authorized environment is local Docker Compose with one API service and one PostgreSQL service. PostgreSQL remains only on the internal private network; the API also joins a loopback client-access bridge so the Windows client can reach it without exposing the database. There is no cloud provider, hosted compute, managed database, application gateway, load balancer, queue, object storage, or monitoring service to map.

## Code Boundary

These are logical component names and responsibilities, not files or classes. Concrete paths, packages, configuration, and generation order are defined next in the Code Generation plan and require explicit approval before creation.
