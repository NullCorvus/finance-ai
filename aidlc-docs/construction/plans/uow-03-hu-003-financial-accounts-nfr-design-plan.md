# UOW-03 / HU-003 Financial Accounts — NFR Design Plan

## Objective and Boundary

Map the approved account functional and non-functional requirements to the smallest concrete pattern set and logical component design. This stage produces documentation only and adds no source, dependency, migration, OpenAPI, Compose, or CI change.

## Approved Inputs

- HU-003 Functional Design approved on 2026-09-07.
- HU-003 NFR Requirements approved on 2026-09-07.
- Existing modular FastAPI/PostgreSQL, HU-002 session principal, Unit of Work, safe error/diagnostic, Flutter Riverpod/GoRouter/HTTP, Android/Windows, and test foundations.
- Exact decimal strings, derived server-side balances, reversible lifecycle, active-name uniqueness, multi-device server authority, and no new infrastructure.

## Resolved Pattern Questions

The user explicitly authorized the recommended direction. Every mandatory category was evaluated and is constrained by approved artifacts, so no further question file is required.

1. Resilience: fail closed, short database transactions, constraint-authoritative conflicts, explicit rollback, idempotent status changes, no automatic mutation retry, and refresh after transport uncertainty.
2. Scalability: one modular API plus PostgreSQL, indexed owner-scoped queries and database-side aggregation; no cache, queue, worker, distributed lock, or microservice.
3. Performance: bounded list size for the personal profile, one aggregated balance query for lists, indexed detail calculation, and no movement hydration into Python/Flutter.
4. Security: bearer principal at the route boundary, owner-scoped repositories, composite database ownership, allow-listed validation, uniform not-found behavior, and financial-data-free diagnostics.
5. Logical components: add narrowly scoped Account feature components and movement persistence to existing backend/client foundations; no platform-specific fork.

## Execution Checklist

- [x] Record NFR Requirements approval and load approved functional/NFR artifacts.
- [x] Resolve resilience, scalability, performance, security, and logical-component categories.
- [x] Map quality requirements to concrete validation, ownership, transaction, constraint, aggregation, error, client-state, and test patterns.
- [x] Define backend, persistence, API, Flutter, and verification logical components and dependency directions.
- [x] Confirm excluded infrastructure/dependencies and production-only concerns.
- [x] Classify Security/PBT/Resiliency design applicability and validate content.
- [x] Generate the two NFR Design artifacts and request explicit approval before code-generation planning.

## Deliverables

- `aidlc-docs/construction/uow-03-financial-structure/nfr-design/nfr-design-patterns.md`
- `aidlc-docs/construction/uow-03-financial-structure/nfr-design/logical-components.md`

## Status

NFR Design is generated and validated. Explicit approval is pending before the code-generation plan. No executable project file changed.
