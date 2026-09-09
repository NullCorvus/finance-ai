# HU-003 Financial Accounts — Logical Components

## Backend Feature Components

| Component | Responsibility | Dependencies |
|---|---|---|
| AccountRouter | Map authenticated HTTP requests and response statuses | AccountService, HU-002 principal dependency |
| AccountSchemas | Bound create/update/status/query inputs and stable outputs | Pydantic, AccountType |
| AccountPolicy | Normalize names and validate decimal/cross-field values | Python Decimal only |
| AccountService | Orchestrate create/list/get/edit/status/delete and error translation | AccountPolicy, AccountUnitOfWork |
| AccountUnitOfWork interface | Expose accounts, currencies, movements, commit/rollback | Repository interfaces |
| AccountRepository | Owner-scoped CRUD/delete, name and movement checks, deterministic list, balance projection | SQLAlchemy implementation |
| AccountCurrencyRepository | Resolve active options and deterministic suggestion | Existing Currency/AppUser persistence |
| AccountMovementRepository | Detect confirmed activity and support aggregate balance reads | FinancialTransaction/AccountMovement models |
| SQLAlchemyAccountUnitOfWork | Own short database sessions and atomic mutation boundaries | Existing session factory |
| AccountError Mapping | Translate known constraints/domain failures to safe AppError values | Shared exception handlers |

The backend feature belongs under a dedicated `finance_ai.accounts` package. SQLAlchemy models and repositories remain under existing database packages. No Account component imports FastAPI types below the router/schema boundary.

## Persistence Components

| Component | Responsibility |
|---|---|
| Account model | Owned account metadata and signed opening balance |
| FinancialTransaction model | Internal owner/type/status/time header for later financial stories |
| AccountMovement model | Signed non-zero account impact used by balance calculation |
| HU-003 Alembic migration | Tables, named checks, foreign keys, composite ownership, partial uniqueness, and indexes |
| Balance projection | Shared SQL expression for list and detail results |

Executable SQLAlchemy models and Alembic migrations become authoritative. The collaborative DBML remains review documentation and does not replace migration validation.

## API Components

| Endpoint | Router action | Service operation |
|---|---|---|
| `POST /api/v1/accounts` | Validate body, return 201 | create |
| `GET /api/v1/accounts` | Validate `include_inactive`, return list/options | list |
| `GET /api/v1/accounts/{account_id}` | Validate ID, return detail | get |
| `PATCH /api/v1/accounts/{account_id}` | Validate non-empty patch | update |
| `PATCH /api/v1/accounts/{account_id}/status` | Validate Boolean status | set_active |
| `DELETE /api/v1/accounts/{account_id}` | Enforce unused-account deletion and return 204 | delete |

All endpoints use the existing access credential dependency and resolve the user principal server-side. The exported OpenAPI document is regenerated from these executable routes.

## Flutter Feature Components

| Layer | Components | Responsibility |
|---|---|---|
| Domain | Account, CurrencyOption, AccountType, AccountListResult, commands | Exact typed business/API values |
| Data | AccountsRepository, HttpAccountsRepository, response/problem decoder | Authenticated account HTTP boundary |
| Application | AccountsState, AccountsController, providers | Immutable list/detail/mutation coordination |
| Presentation | AccountsScreen, AccountDetailScreen, AccountFormScreen, account/status widgets | Shared Android/Windows interactions |
| Core extension | PATCH and DELETE support in FinanceApiClient | Reuse correlation, bearer, timeout, and JSON behavior |
| Routing | Authenticated account routes and Home entry | Preserve HU-002 redirect behavior |
| Diagnostics | Account failure adapter using ErrorDiagnostic | Stable safe copyable reports |

The repository obtains the current in-memory access credential through the existing session application boundary. It never reads secure storage directly and never receives a renewable credential.

## Dependency Direction

1. Flutter presentation depends on controller/domain types.
2. Controller depends on the AccountsRepository interface.
3. HTTP repository depends on FinanceApiClient and authenticated-session access.
4. AccountRouter depends on AccountService and authenticated principal resolution.
5. AccountService depends on policy and Unit of Work interfaces.
6. SQLAlchemy Unit of Work constructs repository implementations over one session.
7. Repositories depend on SQLAlchemy models and PostgreSQL, never Flutter or HTTP DTOs.

No dependency points from backend to Flutter, from domain service to FastAPI, or from client UI to raw credential storage.

## Mutation Interaction

1. User submits once; controller enters saving state and disables repeated submission.
2. HTTP repository sends an authenticated request with a correlation ID.
3. Router validates transport values and resolves owner identity.
4. Service validates policy and executes one Unit of Work.
5. Repository stages data; PostgreSQL validates authoritative constraints.
6. Unit of Work commits once or rolls back and closes resources.
7. Server returns AccountView or a safe problem.
8. Controller replaces state only from confirmed success; uncertain transport failure offers refresh/retry.

## Read Interaction

Account list/detail repositories execute owner-scoped balance projection queries. The API returns exact strings. Flutter renders the response without recalculating financial totals. A refresh from either Windows or Android observes the same committed server state.

## Error Ownership

| Failure source | Owning component |
|---|---|
| Request shape/type/length | AccountSchemas |
| Name/decimal business validation | AccountPolicy |
| Currency/lifecycle/ownership rule | AccountService |
| Concurrent constraint arbitration | PostgreSQL and repository translator |
| Safe HTTP problem | Shared AppError handlers |
| Transport/response decoding | HttpAccountsRepository |
| Copyable user diagnostic | AccountsController/presentation using shared diagnostics |

## Logical Infrastructure

HU-003 uses only the existing Flutter client, loopback-published FastAPI service, private PostgreSQL network, and optional read-only DBeaver viewer workflow. It adds no cache, broker, file store, background worker, analytics service, or cloud component.

## Test Components

- Backend unit tests for AccountPolicy, AccountService, and error mapping.
- Hypothesis tests for normalization, Decimal values, ownership, lifecycle, and balance properties.
- PostgreSQL tests for migration, constraints, aggregate reads, races, and rollback.
- API tests for authentication, contracts, IDOR, errors, and correlation IDs.
- Flutter domain/data/controller/widget tests for all account states and safe diagnostics.
- Shared integration and Windows smoke coverage with the normal bundle restored afterward.

## Security and Resiliency Classification

Applicable controls are incorporated in the components above: SECURITY-05, SECURITY-08, SECURITY-09, SECURITY-11, SECURITY-13, and SECURITY-15; existing SECURITY-03, SECURITY-10, and SECURITY-12 foundations are reused. Deployment/network-only controls are unchanged or not applicable to this unit. PBT applies to all identifiable pure/stateful account invariants. Feature resiliency uses transactions, constraints, timeouts, idempotency, cleanup, and fail-closed ownership without introducing distributed patterns.
