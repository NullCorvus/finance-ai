# UOW-03 / HU-003 Build and Test Plan

## Scope

Treat the approved financial-accounts slice, including staged permanent deletion, as a release candidate across the backend, migrated PostgreSQL, shared Flutter code, Android build, and Windows build. This stage validates and documents the existing implementation; it does not add new product behavior or publish repository changes.

## Execution Plan

- [x] Record the user's approval, enter the Build and Test stage, load the governing rules, and establish this checklist.
- [x] Load the approved HU-003 functional, NFR, contract, code-summary, requirements, and story evidence; map acceptance criteria to test gates.
- [x] Generate and validate `build-instructions.md` for reproducible backend, database, Android, and Windows builds.
- [x] Generate and validate `unit-test-instructions.md` for backend and Flutter unit/property/widget suites and coverage thresholds.
- [x] Generate and validate `integration-test-instructions.md` for PostgreSQL, authentication, ownership, cross-session, contract, and deletion-concurrency scenarios.
- [x] Generate and validate `performance-test-instructions.md` for bounded personal-finance workload/query-plan checks without inventing production-scale guarantees.
- [x] Execute the backend release-candidate gates: format, lint, strict typing, migrations/seeds/contract drift, dependency audit, full coverage, and isolated PostgreSQL integration/E2E.
- [x] Execute the Flutter release-candidate gates: format, analyze, full shared coverage, Android debug build, Windows native smoke tests, and normal bundle restoration.
- [x] Verify live API readiness, the DELETE OpenAPI contract, normal Windows client health, repository boundaries, diagnostic privacy, and absence of temporary dependency overrides or duplicate implementations.
- [x] Generate and validate `build-and-test-summary.md` with observed results, artifacts, extension compliance, limitations, and reproducible commands.
- [ ] Commit the scoped HU-003 backend, frontend, and documentation changes; push their branches; open or update the required linked pull requests; and record CI status.
- [ ] Update plan/state/audit checkboxes from observed evidence and present the mandatory Build and Test review gate.

## Completion Criteria

- Every checkbox is complete from observed evidence.
- Both repositories meet their mandatory verification guides and at least 80% line coverage.
- Real PostgreSQL integration and authenticated cross-session behavior pass against an isolated test database.
- The restrictive financial-history deletion invariant passes under concurrency.
- Android and Windows builds pass, and the normal Windows application is restored before handoff.
- Generated instructions contain no secrets and accurately distinguish tested evidence from future production validation.
