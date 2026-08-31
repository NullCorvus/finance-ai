# UOW-01 Foundation and Registration — NFR Requirements Plan

## Objective

Define measurable quality constraints and select the technology families for UOW-01 before implementation. This stage creates documentation only: it does not create backend/frontend roots, install dependencies, write Compose or CI configuration, generate migrations, or implement HU-001.

## Approved Inputs

- Approved UOW-01 functional design.
- Existing manual-first requirements, security baseline, partial property-testing mode, and Definition of Done.
- Approved Flutter, FastAPI, PostgreSQL modular-monolith direction.
- User authorization to choose best-fit technical defaults and ask only when a decision cannot safely be inferred.

## NFR Question Assessment and Resolved Answers

All required NFR categories were evaluated. The repository already identifies an Android-first university prototype without a hosted production target. The remaining choices are bounded technical defaults within the user's delegated authority, so no new blocking question is required.

1. What load and deployment profile must UOW-01 support?
   [Answer]: A single-instance local university prototype for team development and demonstration, with a benchmark profile of 50 registered users, 10 concurrent registration requests from distinct test clients, and up to 60 aggregate registration requests per minute. No public-production SLA is claimed.
2. What performance is acceptable for registration?
   [Answer]: UI feedback begins within 100 ms. Under the reference load profile, POST registration targets p95 at or below 2 seconds and p99 at or below 4 seconds, including password hashing but excluding environment startup and dependency/image download.
3. What availability and recovery behavior is required?
   [Answer]: No uptime percentage for the local prototype. API/database readiness must be observable, clean startup repeatable, transactions atomic, failures safe, and reruns recoverable without manual database repair.
4. What registration security baseline applies?
   [Answer]: Server-authoritative bounded validation, Argon2id meeting OWASP's minimum parameters, local compromised/common-password denial without sending passwords to an external service, rate limiting, safe structured logs/errors, parameterized persistence, secret isolation, and TLS for any non-loopback environment.
5. Which stack direction is selected?
   [Answer]: Python 3.14 and FastAPI 0.140 line; SQLAlchemy 2, Alembic, psycopg 3, and PostgreSQL 18; Flutter stable 3.44/Dart 3.12 line with Riverpod 3.4; uv and platform lockfiles for reproducibility. Exact compatible patch versions and image digests are resolved and committed only during approved Code Generation.
6. How is reliability and observability handled?
   [Answer]: Correlation IDs, structured secret-free logs, readiness/liveness signals, explicit transaction rollback, bounded timeouts, and repeatable clean setup. Hosted centralized logs/alerts/backup controls wait for an authorized deployment target.
7. What testing and quality gates apply?
   [Answer]: Pytest example/integration/contract tests, Hypothesis for applicable backend properties, Flutter unit/widget/integration tests, formatting, linting, type checks, dependency review, and at least 80 percent line coverage for new UOW-01 backend/frontend code while every HU-001 scenario remains explicitly tested.
8. What usability baseline applies?
   [Answer]: English UI, labeled controls, keyboard traversal, assistive error association, visible progress, no color-only status, stable automation keys, and retry behavior that never implies authentication.

## Execution Checklist

- [x] Analyze approved UOW-01 functional behavior and failure modes.
- [x] Define bounded scalability and measurable performance targets.
- [x] Define local availability, reliability, recovery, and observability requirements.
- [x] Apply the proportional security baseline and classify all SECURITY rules.
- [x] Define maintainability, testing, property-testing, and usability requirements.
- [x] Select runtime, framework, persistence, client, and quality-tool families.
- [x] Verify current supported technology lines against primary official sources.
- [x] Separate documentation decisions from later executable configuration and code.
- [x] Validate no product AI, deployment assumption, or application code was introduced.

## Deliverables

- nfr-requirements.md
- tech-stack-decisions.md

## Status

NFR Requirements artifacts generated, internally validated, and approved by the user on 2026-08-28. NFR Design is the active stage.
