# Unit of Work Plan — Finance AI

## Objective

Map the already approved backlog into small dependency-aligned construction units inside one modular monolith. This stage does not add product scope, revisit architecture, or create application code.

## Decomposition Decision

Finance AI remains one deployable FastAPI backend plus one Flutter client. Units are delivery boundaries and logical feature modules, not microservices or separate repositories.

The first unit contains the technical foundations plus HU-001 because registration is the first end-to-end proof that Flutter, FastAPI, PostgreSQL, migrations, contracts, and quality checks work together. HU-002 and later stories remain outside it.

## Planned Units

| Unit | Outcome | Assigned work |
|---|---|---|
| UOW-01 — Foundation and Registration | Repeatable project foundation plus successful registration redirecting to Login | EN-001–EN-006, HU-001 |
| UOW-02 — Sessions and Preferences | Login, session renewal/revocation, logout, and user defaults | HU-002, HU-003 |
| UOW-03 — Financial Structure | Accounts/currencies and user-owned supporting catalogs | HU-004–HU-006 |
| UOW-04 — Manual Movements | Manual expenses, income, and atomic transfers | HU-007, HU-010, HU-011 |
| UOW-05 — Expense Detail and Activity | Optional receipt/items, correction/archive, and unified history | HU-008, HU-009, HU-012 |
| UOW-06 — Budgets and Dashboard | Spending targets and deterministic overview | HU-013, HU-014 |
| UOW-07 — Optional AI Assistance | Photo/audio/text proposals for existing forms | HU-015, HU-016; deferred until UOW-01–UOW-06 are complete |

## Planned Artifacts

- [x] Generate aidlc-docs/inception/application-design/unit-of-work.md with unit definitions, responsibilities, boundaries, and code-organization strategy.
- [x] Generate aidlc-docs/inception/application-design/unit-of-work-dependency.md with the dependency matrix and release gates.
- [x] Generate aidlc-docs/inception/application-design/unit-of-work-story-map.md mapping every HU and EN identifier exactly once.
- [x] Validate that all 16 stories and 6 enablers are assigned with no duplicates or omissions.
- [x] Validate that UOW-07 depends on the complete manual MVP and that no unit becomes independently deployable.
- [x] Confirm that no application code or runtime project is created.

## Code Organization Strategy

The future monorepo retains:

- backend/ for the FastAPI modular monolith, organized by feature modules and shared infrastructure boundaries.
- frontend/ for Flutter, organized by features plus shared API/navigation/theme components.
- docs/ and aidlc-docs/ for product and lifecycle documentation.
- One root Compose definition for local API/PostgreSQL development.

Each unit extends these same deployables. Units never create separate services, databases, or duplicate app shells.

## Category Evaluation

| Required category | Resolution |
|---|---|
| Story grouping | Dependency/value slices already approved in the delivery sequence; HU-001 intentionally isolated |
| Dependencies | Foundation → identity → structure → movements → activity → budgets/dashboard → optional AI |
| Team alignment | Unit boundaries are shared integration boundaries; individual assignment remains a team sprint decision |
| Technical considerations | One modular monolith; no per-unit scaling/deployment difference |
| Business domain | Units follow identity, financial structure, movements, history, planning/analytics, and deferred assistance |
| Greenfield code organization | One monorepo with backend/frontend roots, not one directory per unit |

No new user question is required because every decomposition choice follows the approved backlog, architecture, and explicit request to avoid unnecessary planning. A change to deployable boundaries, team structure, or story scope would require user/team input later.

## Generation Sequence

1. Define all seven units and their explicit exclusions.
2. Record direct and transitive dependencies.
3. Map PB/HU/EN identifiers to units.
4. Validate complete unique coverage.
5. Mark this plan complete and present generated artifacts for approval before Construction.

## Approval Status

The plan was approved through the user's explicit delegation. All three unit artifacts were generated and validated. Awaiting final Units Generation artifact approval before UOW-01 enters Construction.
