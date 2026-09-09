# HU-003 Financial Accounts — Non-Functional Requirements

## Boundary

These requirements apply to account management, account reads, and the internal movement data needed for derived balances. They do not establish production hosting promises or expand HU-003 into expense, income, transfer, receipt, category, budget, offline-sync, or AI write behavior.

## Performance and Capacity

| ID | Requirement | Verification direction |
|---|---|---|
| NFR-ACC-PERF-01 | On the reference local API/PostgreSQL stack, list and detail endpoints target p95 <= 250 ms and p99 <= 500 ms under 10 concurrent clients. | Deterministic seeded performance test with warm application process |
| NFR-ACC-PERF-02 | Create, edit, deactivate, reactivate, and permitted unused-account deletion target p95 <= 500 ms and p99 <= 1 second under the same profile. | Timed integration scenario excluding client animation time |
| NFR-ACC-PERF-03 | Flutter presents visible progress within 100 ms of an account request and prevents duplicate mutation submissions. | Controller/widget timing and repeated-tap tests |
| NFR-ACC-CAP-01 | The design supports at least 50 registered users, 100 simultaneous device sessions, 100 accounts per user, and 10 concurrent local clients without new infrastructure. | Seeded load profile |
| NFR-ACC-CAP-02 | Account queries remain index-backed as movement history grows; balance calculation does not load all movements into application memory. | Query-plan inspection and repository test |

Targets are engineering budgets for the university prototype, not a public SLA.

## Consistency, Precision, and Reliability

| ID | Requirement | Verification direction |
|---|---|---|
| NFR-ACC-DATA-01 | Account money uses PostgreSQL `NUMERIC(18,2)` and fixed decimal strings at API boundaries. Binary floating point must not calculate or serialize balances. | Decimal boundary/property tests and OpenAPI assertions |
| NFR-ACC-DATA-02 | Derived balance is never persisted as mutable account state; it is opening balance plus confirmed signed movements. | Model/migration inspection and seeded calculation tests |
| NFR-ACC-DATA-03 | A successful write is visible to the user's next server request from either authenticated device. | Cross-client API integration scenario |
| NFR-ACC-REL-01 | Each create/edit/status mutation commits exactly once or rolls back without partial account/movement changes. | Fault injection around flush/commit |
| NFR-ACC-REL-02 | Concurrent equivalent active names produce one success and one safe conflict, never duplicate active rows. | PostgreSQL concurrency test |
| NFR-ACC-REL-03 | Repeating a status request for the current status is semantically idempotent. | API/service example and property tests |
| NFR-ACC-REL-04 | Transport uncertainty never causes the Flutter client to claim a mutation succeeded. The user can refresh before choosing to retry. | Repository/controller transport-failure tests |
| NFR-ACC-REL-05 | Permanent deletion succeeds only without movement history; a concurrent movement/delete race preserves either the account with its movement or a completed deletion with no movement, never an orphan or silent cascade. | PostgreSQL concurrency and restrictive-foreign-key tests |

## Security and Privacy

| ID | Requirement | Verification direction |
|---|---|---|
| NFR-ACC-SEC-01 | Every account endpoint requires a valid HU-002 bearer session. | API authentication matrix |
| NFR-ACC-SEC-02 | All account, transaction, and movement reads/writes are scoped by authenticated owner; client-supplied owner IDs are rejected or absent. | IDOR integration/property tests |
| NFR-ACC-SEC-03 | Foreign and missing account IDs return the same safe 404 contract. | Paired API tests |
| NFR-ACC-SEC-04 | Input schemas bound identifier, string, enum, decimal, and Boolean shapes before processing; persistence uses SQLAlchemy parameterization. | Schema and repository review |
| NFR-ACC-SEC-05 | Logs, screenshots, test failure text, UI diagnostics, and clipboard reports exclude account names, opening balances, balances, entered values, request bodies, SQL, emails, tokens, and raw exceptions. | Allow-list and negative assertions |
| NFR-ACC-SEC-06 | Safe account errors preserve the request correlation ID from response through Flutter diagnostics. | API/client contract tests |
| NFR-ACC-SEC-07 | Inactive accounts cannot be selected by later movement-write services. The reusable active-owned-account lookup fails closed. | Repository/service contract tests |

## Availability and Recovery

- No uptime percentage is promised for the local prototype.
- Existing API health/readiness, PostgreSQL transaction cleanup, bounded client/API/database timeouts, and global safe exception handling remain mandatory.
- Account data persists in PostgreSQL and remains recoverable through the existing local backup/migration practices.
- Hosted encryption, centralized log retention/alerts, multi-zone operation, autoscaling, and disaster-recovery objectives require a separately approved deployment target.

## Maintainability and Compatibility

| ID | Requirement |
|---|---|
| NFR-ACC-MNT-01 | Backend account code follows feature-local policy/service/schema/repository/UoW/router boundaries and strict Ruff/mypy rules. |
| NFR-ACC-MNT-02 | Alembic migration, SQLAlchemy models, and generated OpenAPI remain mutually consistent. |
| NFR-ACC-MNT-03 | Flutter uses shared Android/Windows domain/data/application/presentation components and the existing router/API/diagnostic foundations. |
| NFR-ACC-MNT-04 | Stable account codes and response shapes are documented and contract-tested. |
| NFR-ACC-MNT-05 | No cache, queue, Redis, worker, local financial database, platform fork, or new runtime package is added for HU-003. |
| NFR-ACC-MNT-06 | Future expense/income/transfer services can add confirmed movements without changing AccountView or balance semantics. |

## Usability and Accessibility

- Account fields use plain personal-finance language and readable type labels.
- Deactivation explicitly says history is retained and new entries are disabled.
- Negative balances include a sign and text semantics; color is never the only distinction.
- Forms support keyboard and touch operation, logical focus, associated errors, progress announcements, and retry/refresh recovery.
- Currency suggestions never overwrite saved values or edit forms.
- Stable automation keys support shared widget and Windows integration testing.

## Quality Gates

- Preserve at least 80 percent line coverage in each existing backend/frontend gate.
- Add backend unit, Hypothesis property, API, PostgreSQL integration/concurrency, migration/model, and OpenAPI tests.
- Add Flutter domain/repository/controller/widget tests plus shared integration and native Windows coverage.
- Run backend format/lint/type/test/audit gates and frontend format/analyze/test gates.
- Run Android build and the Windows test-and-restore helper; finish with the normal user application bundle restored.

## Extension Compliance

- Security: input validation, object authorization, safe failure, data-integrity, structured diagnostic, authentication, and dependency controls are applicable and specified. Deployment-only controls remain outside this feature change.
- Property-Based Testing: normalization, decimal boundaries, enum/currency validation, lifecycle transitions, ownership isolation, and balance invariants have explicit property targets with reproducible Hypothesis failures.
- Resiliency: atomicity, constraint races, timeouts, cleanup, fail-closed access, idempotent status, and cross-device server consistency apply. Production topology/DR requirements are not applicable without a deployment target.
