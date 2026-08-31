# UOW-01 Foundation and Registration — Functional Design Plan

## Objective

Define the complete behavior of HU-001 inside UOW-01 before implementation: registration validation, atomic creation of the user and smallest owned catalogs, public API outcomes, and Flutter form behavior. EN-001 through EN-006 provide the technical foundation but do not add product behavior beyond what HU-001 requires.

## Approved Inputs

- Unit definition and story map in the approved Application Design artifacts.
- HU-001 acceptance criteria and INV-08 credential-protection invariant.
- Approved modular-monolith application design and public registration contract.
- Approved conceptual schema and construction source-of-truth rule: SQLAlchemy models plus Alembic migrations.
- User direction to keep the app manual-first and defer all product AI.

## Question Assessment and Inherited Answers

The functional-design question categories were evaluated. No new product question is required because the user previously authorized best-fit technical decisions and the approved artifacts already resolve the workflow, domain model, rules, integration behavior, errors, and Flutter state. Reopening those choices would add planning without changing the implementation boundary.

1. What owns registration orchestration and the database transaction?
   [Answer]: A thin route delegates to an application service. The service owns one Unit of Work; repositories stage changes and never commit.
2. What exactly is created for a new user?
   [Answer]: One active user with COP preference; Categories Needs, Wants, Other; Payment Methods Cash, Card, Transfer; and Income Sources Salary, Other. No subcategories or financial account.
3. How are success and failures represented?
   [Answer]: POST /api/v1/auth/register returns 201 with safe public user data and no token. Known failures use stable problem-style responses for validation, conflict, throttling, configuration, and unexpected errors.
4. How does the Flutter form behave?
   [Answer]: English UI, Riverpod immutable submission state, client-side guidance with server-authoritative validation, duplicate-tap prevention, safe errors, success confirmation, then navigation to Login without automatic authentication.
5. Which decisions belong to later stages?
   [Answer]: Exact dependency versions, rate-limit thresholds, deployment topology, infrastructure health settings, and concrete security/performance targets belong to NFR Requirements, NFR Design, Infrastructure Design, or Code Generation.

## Execution Checklist

- [x] Analyze UOW-01 responsibilities, assigned enablers, HU-001, and explicit exclusions.
- [x] Define registration input, normalization, validation, orchestration, and output behavior.
- [x] Define transaction boundaries, rollback behavior, and concurrent duplicate handling.
- [x] Define stable business rules, validation failures, and public error outcomes.
- [x] Define persisted entities, transient values, ownership, relationships, and invariants.
- [x] Define Flutter component hierarchy, immutable states, interactions, form handling, and API mapping.
- [x] Identify testable properties for later example-based and property-based tests.
- [x] Validate HU-001 acceptance-criteria traceability and UOW-01 scope boundaries.
- [x] Confirm that no application code or deferred AI behavior was introduced.

## Deliverables

- business-logic-model.md
- business-rules.md
- domain-entities.md
- frontend-components.md

## Status

Functional design artifacts generated, internally validated, and approved by the user on 2026-08-28. NFR Requirements is the active stage.
