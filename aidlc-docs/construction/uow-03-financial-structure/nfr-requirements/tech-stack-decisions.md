# HU-003 Financial Accounts — Technology Stack Decisions

## Decision Summary

HU-003 reuses the existing stack. No new runtime or infrastructure dependency is justified.

| Area | Decision | Rationale |
|---|---|---|
| API | Existing FastAPI and Pydantic schemas | Authenticated validation and OpenAPI foundations already exist |
| Domain/application | Feature-local Python policy/service and typed commands/results | Keeps business behavior independent of HTTP and persistence |
| Persistence | Existing SQLAlchemy 2 and Unit of Work | Owner scoping, parameterization, transactions, and repository conventions already exist |
| Schema evolution | Existing Alembic chain | Repeatable forward/backward schema history and model drift checks |
| Database | Existing PostgreSQL | Partial indexes, exact decimals, constraints, row locking, and concurrency behavior fit the account rules |
| Flutter state | Existing Riverpod | Immutable async list/detail/form state without platform forks |
| Flutter navigation | Existing GoRouter | Authenticated route protection already integrates with HU-002 |
| HTTP | Existing shared FinanceApiClient | Reuses timeouts, correlation IDs, bearer credentials, and safe response decoding |
| Diagnostics | Existing ErrorDiagnostic contract | Required stable copyable failures without financial-data leakage |
| Testing | Existing pytest/Hypothesis/httpx2/PostgreSQL and Flutter test/integration_test | Covers examples, generated invariants, contract, persistence, Android/shared, and Windows behavior |

## PostgreSQL Shape

The HU-003 migration introduces Account and the smallest internal FinancialTransaction/AccountMovement foundation required to prove derived balance behavior. No public financial-transaction route is added.

### Account

- `BIGINT IDENTITY` primary key.
- Required owner and currency foreign keys.
- `VARCHAR(100)` trimmed name.
- Controlled account-type value.
- `NUMERIC(18,2)` signed opening balance.
- Active flag and UTC timestamps.
- Unique `(id, user_id)` ownership key for future composite references.
- Partial unique index on owner plus lowercased name for active rows.
- Owner/active and deterministic-list indexes.

### FinancialTransaction and AccountMovement

- Internal owner-scoped transaction header with controlled type/status and UTC occurrence time.
- Movement references one transaction and one same-owner account.
- `NUMERIC(18,2)` non-zero signed amount.
- Indexes support confirmed balance aggregation by account without materializing movements in memory.
- Composite foreign keys prevent cross-user links.

The migration must use explicit constraint names consistent with the repository convention. PostgreSQL constraints remain authoritative under concurrency.

## API Representation

- Monetary values are JSON strings such as `"100000.00"` and `"-350000.00"`.
- Dates/timestamps use ISO 8601; server UTC is authoritative.
- Account type is a stable lowercase enum value with UI labels mapped in Flutter.
- Account list returns items, supported currencies, account types, and suggested currency in one authenticated payload.
- PATCH distinguishes omitted fields from explicit values and rejects an empty update.
- Error responses reuse the shared ProblemResponse and correlation header behavior.

## Flutter Money Handling

No decimal package is added during planning. Flutter retains API money as a validated decimal string and uses a small feature-local parser/formatter based on integer minor units for display and form conversion. Implementation must prove locale input, negative values, two-decimal precision, bounds, and round-trip behavior. If that approach cannot satisfy tests cleanly, a maintained decimal dependency requires explicit plan revision rather than silent addition.

## Query and Concurrency Decisions

- List/detail balance aggregation executes in PostgreSQL with indexed joins and `COALESCE`.
- Mutations use short Unit of Work transactions.
- Friendly name-conflict prechecks improve feedback but never replace the database constraint.
- Edit/reactivation protects the account row during its final validation and write.
- No automatic client retry is applied to account mutations; refresh establishes authoritative outcome after transport uncertainty.
- No caching is needed for personal account counts or shared COP/USD reference rows.

## Multi-Device Boundary

Account state is held only by the API/PostgreSQL authority. Independent Windows and Android sessions can read and update the same user-owned accounts, and a successful mutation is visible on the next refresh. Offline local persistence, change queues, push updates, and merge/conflict UI remain separate future work.

## Version and Dependency Policy

- Keep the locked backend and Flutter dependency ranges already present.
- Add no database driver, decimal library, cache, queue, state package, or platform plugin.
- Regenerate and verify `openapi.json` from the executable API.
- Continue exact resolved versions through `uv.lock` and `pubspec.lock`.

## Rejected Alternatives

| Alternative | Reason not selected |
|---|---|
| Store `current_balance` on Account | Creates synchronization and double-application risk |
| Binary floating-point money | Cannot guarantee exact decimal behavior |
| Client-only ownership filtering | Fails object-level authorization |
| Global/user-editable account-type table | Adds catalog complexity without current value |
| Payment instrument model | Account already answers where personal money is held |
| Redis/cache or queue | No measured load or workflow requires it |
| Device-owned financial storage | Conflicts with current server-authoritative multi-device behavior |

## Deployment Applicability

This story changes application and PostgreSQL schema behavior inside the existing loopback-only local architecture. It does not select a production cloud, TLS terminator, centralized log service, availability topology, autoscaling policy, RTO/RPO, or DR strategy. Those decisions remain explicitly deferred until a production deployment is approved.
