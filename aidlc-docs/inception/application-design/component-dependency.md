# Component Dependencies — Finance AI

## Registration Dependency Flow

~~~mermaid
flowchart LR
    User["New user"]
    Screen["Register Screen"]
    Controller["Riverpod Registration Controller"]
    ClientRepo["Flutter Auth Repository"]
    ApiClient["Finance API Client"]
    Route["Registration Route"]
    Service["Registration Application Service"]
    Policy["Registration Policy"]
    Hasher["Password Hasher"]
    Templates["Catalog Template Provider"]
    Uow["Unit of Work"]
    Repositories["User, Currency, and Catalog Repositories"]
    Database[("PostgreSQL")]

    User -->|"enters email and passwords"| Screen
    Screen -->|"submit intent"| Controller
    Controller -->|"register command"| ClientRepo
    ClientRepo -->|"versioned JSON request"| ApiClient
    ApiClient -->|"POST /api/v1/auth/register"| Route
    Route -->|"transport-independent command"| Service
    Service -->|"normalize and validate"| Policy
    Service -->|"hash validated password"| Hasher
    Service -->|"load default definitions"| Templates
    Service -->|"transaction boundary"| Uow
    Uow -->|"stage through interfaces"| Repositories
    Repositories -->|"SQLAlchemy operations"| Database
    Service -->|"result or typed failure"| Route
    Route -->|"201 or safe problem"| ApiClient
    ApiClient -->|"typed result"| ClientRepo
    ClientRepo -->|"success or failure"| Controller
    Controller -->|"immutable view state"| Screen
~~~

### Text Alternative

The user submits the Flutter Register Screen. A Riverpod controller calls the Flutter Auth Repository and versioned API client. The FastAPI route maps the request to the Registration Application Service. That service uses validation, hashing, and catalog-template components, then controls a Unit of Work whose repositories access PostgreSQL. The result returns through the same boundaries as a 201 success or a safe structured problem.

## Dependency Matrix

Legend: **D** = direct dependency; **—** = no dependency.

| Consumer / Provider | Policy | Hasher | Templates | Unit of Work | Repositories | API Client |
|---|---:|---:|---:|---:|---:|---:|
| Registration Route | — | — | — | — | — | — |
| Registration Application Service | D | D | D | D | D | — |
| Catalog Initialization | — | — | D | D | D | — |
| Flutter Auth Repository | — | — | — | — | — | D |
| Registration Controller | — | — | — | — | — | — |

The controller depends directly on the Flutter Auth Repository; that relationship is omitted from the provider columns only to keep the matrix focused on shared boundaries.

## Direction Rules

- Dependencies point inward toward interfaces and business behavior.
- FastAPI route types stop at the route boundary.
- SQLAlchemy types stop at repository implementations.
- Flutter HTTP DTOs stop at the API client/repository boundary.
- Registration Application Service receives repository and Unit of Work interfaces through dependency injection.
- No backend component imports Flutter code.
- No frontend component receives database credentials or provider secrets.

## Transaction Dependency

The Registration Application Service owns the Unit of Work lifecycle. Repositories participate in its current transaction and cannot commit. This guarantees that user creation and all copied defaults succeed or fail together.

## Enabler Dependencies

| Enabler | Design dependency |
|---|---|
| EN-001 | Establishes backend/frontend roots, dependency injection conventions, pinned toolchains, and lint/format rules |
| EN-002 | Supplies FastAPI/PostgreSQL startup and readiness |
| EN-003 | Supplies SQLAlchemy/Alembic schema plus COP/USD seed |
| EN-004 | Supplies the registration contract and error catalog |
| EN-005 | Supplies Flutter routing, theme, and Riverpod foundation |
| EN-006 | Supplies backend, Flutter, contract, and clean-setup quality checks |

HU-001 consumes these foundations but remains separately estimated and traceable.
