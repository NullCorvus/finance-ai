# Application Components — Finance AI

## Scope

This design describes the modular monolith and the first vertical product slice, HU-001 registration. It identifies foundation components without implementing later identity, financial, or AI behavior.

## Backend Components

| Component | Responsibility | Exposes | Must not do |
|---|---|---|---|
| API Application | Assemble FastAPI, configuration, middleware, versioned routers, health route, and OpenAPI metadata | Application startup and root operational routes | Contain registration business rules |
| Registration Route | Map POST /api/v1/auth/register to the application service and return safe responses | HTTP registration endpoint | Open transactions or hash passwords |
| Registration Application Service | Orchestrate normalization, validation, uniqueness, hashing, user creation, catalog creation, and one transaction | Registration use case | Depend on HTTP or Flutter types |
| Registration Policy | Normalize email and validate email/password/confirmation | Validated registration values or field errors | Persist data or expose credentials |
| Password Hasher | Produce and later verify adaptive password hashes | Hash/verify interface | Log or return plaintext |
| Catalog Template Provider | Supply immutable initial English catalog definitions | Versioned default template | Query user data |
| User Repository | Query normalized email and stage a new user | User persistence interface | Commit independently |
| Catalog Repositories | Stage owned categories, payment methods, and income sources | Catalog persistence interfaces | Commit independently or create an account |
| Currency Repository | Resolve seeded COP for the new user's preference | Shared-currency lookup | Create arbitrary currency codes during registration |
| Unit of Work | Bound repository work to one commit or rollback | Transaction context | Contain product validation |
| Error Mapper | Convert known failures to the approved safe API problem shape | Problem response mapping | Expose stack traces, SQL, or secrets |

## Flutter Components

| Component | Responsibility | State or interface |
|---|---|---|
| App Router | Define Register and Login routes and perform post-success navigation | Route names and navigation actions |
| Register Screen | Present the English registration UI and accessible loading/error/success states | Watches registration state |
| Register Form | Capture email, password, and confirmation with visibility controls | Local values and immediate field feedback |
| Registration Controller | Coordinate submission and expose immutable idle/submitting/success/failure state | Riverpod notifier/provider |
| Auth Repository | Offer a UI-facing registration operation independent of HTTP details | register(command) |
| Finance API Client | Send versioned JSON and decode success/problem responses | /api/v1 client boundary |
| Secure Error Presenter | Convert stable error codes/field errors into English UI copy | User-safe messages |

## Persistence Components

| Component | Responsibility |
|---|---|
| SQLAlchemy Models | Future executable persistence definitions for user, currency, and user-owned catalogs |
| Alembic Migrations | Versioned schema history and constraints |
| Shared Currency Seed | Repeatably ensure COP and USD exist before application traffic |
| Registration Catalog Copy | Create owned catalog rows within the registration transaction |

## Initial Catalog Template

Registration copies the smallest approved English preset:

- Categories: Needs, Wants, Other
- Payment methods: Cash, Card, Transfer
- Income sources: Salary, Other
- Subcategories: none initially

The template is versioned configuration. Copied records belong to the user and can later be changed or archived. Registration creates no financial account.

## Component Boundary Rules

- Routes translate protocols; application services own use-case orchestration.
- Repositories stage persistence but never commit independently.
- Only the Unit of Work controls commit/rollback.
- API objects, domain values, persistence models, and Flutter state remain separate.
- Flutter screens depend on controllers/repositories, not directly on the HTTP client.
- Product AI has no component, dependency, configuration, or placeholder in this unit.
