# UOW-01 Foundation and Registration — NFR Design Plan

## Objective and Boundary

Map the approved UOW-01 quality requirements to a minimal set of logical patterns and components. This is the final design document before Code Generation planning. It creates no application source, dependency manifest, migration, Compose file, or CI workflow.

## Resolved Pattern Questions

The user asked to minimize further documentation and begin coding. Every category below is already resolved by the approved functional and NFR requirements, so no new question is necessary.

1. Resilience pattern?
   [Answer]: Fail fast before persistence, fail closed for security prerequisites, one atomic Unit of Work, explicit rollback/cleanup, no automatic backend retry of registration.
2. Scalability pattern?
   [Answer]: One API instance and PostgreSQL for the local prototype. No queues, caches, Redis, microservices, or autoscaling. Rate limiting remains behind a replaceable storage boundary.
3. Performance pattern?
   [Answer]: Validate and hash before opening the transaction, keep the transaction short, bound request/time/resource use, and measure without weakening Argon2id.
4. Security pattern?
   [Answer]: Layer request validation, local unsafe-password denial, adaptive hashing, database uniqueness, throttling, safe problem mapping, secret-free logs, and deny-by-default route policy.
5. Logical components?
   [Answer]: Reuse the approved Flutter registration, API middleware, application service, policies, repositories, Unit of Work, PostgreSQL, health, and observability boundaries. Add no speculative infrastructure.

## Checklist

- [x] Map resilience, performance, scalability, security, and observability requirements to patterns.
- [x] Define the minimum logical components and their failure behavior.
- [x] Define retry, timeout, transaction, and concurrency boundaries.
- [x] Confirm no cache, queue, external password service, product AI, or hosted service is required.
- [x] Verify security and partial property-testing constraints remain implementable.
- [x] Confirm Infrastructure Design can be skipped because no hosted deployment target exists and local Compose choices are already fixed.
- [x] Confirm no executable application artifact was created.

## Status

NFR Design artifacts generated, validated, and approved by the user on 2026-08-28. Infrastructure Design is skipped for UOW-01 as duplicative and inapplicable without a deployment target. Code Generation Part 1 planning is active.
