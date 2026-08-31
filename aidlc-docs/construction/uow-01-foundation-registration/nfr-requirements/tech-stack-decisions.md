# UOW-01 Foundation and Registration — Technology Stack Decisions

## Decision Principle

Select the smallest supported stack that delivers the approved modular monolith, secure registration, reproducible team setup, and continuous quality. A selected tool in this document is not installed yet. Exact compatible patches and immutable image/action references are created only in the approved Code Generation stage and committed through lockfiles.

## Runtime and Framework Baseline

| Area | Selected direction | Pinning rule | Rationale |
|---|---|---|---|
| Backend language | CPython 3.14 stable line | Exact latest supported 3.14 patch in repository tool version and CI | Current supported feature line with modern typing and Hypothesis support |
| Backend API | FastAPI 0.140 line with Pydantic 2 | Exact compatible patch in uv.lock | Typed validation, OpenAPI, stable problem mapping; FastAPI recommends pinning the known-working minor/patch line |
| Dependency manager | uv project workflow | Pin uv itself; commit pyproject.toml and uv.lock | Cross-platform exact lock and reproducible sync for a Windows/team repository |
| Persistence | SQLAlchemy 2 synchronous sessions with explicit Unit of Work | Exact patch in uv.lock | Simpler transaction reasoning for the team; avoids mixed sync/async repository behavior |
| PostgreSQL driver | psycopg 3 | Exact binary/runtime-compatible patch in uv.lock | Maintained PostgreSQL driver compatible with the selected synchronous design |
| Migrations | Alembic current 1.x line | Exact patch in uv.lock | SQLAlchemy-aligned versioned schema authority |
| Database | PostgreSQL 18, initially verified against 18.6 | Exact official image patch plus immutable digest; no latest tag | Current stable PostgreSQL major with relational constraints and transactions |
| Password hashing | argon2-cffi using Argon2id | Exact patch in uv.lock; parameters stored in reviewed configuration | Maintained adaptive implementation and upgrade/check support |
| Backend property testing | Pytest plus Hypothesis 6 | Exact patches in uv.lock | Mature generators, shrinking, reproducible failures, and Python 3.14 support |

Python 3.14 is the current stable feature series in the [Python release documentation](https://www.python.org/downloads/release/python-3140/). FastAPI documents exact version pinning because its 0.x minor releases can introduce breaking changes in [its version guidance](https://fastapi.tiangolo.com/deployment/versions/). Hypothesis documents support for maintained Python versions and seed/shrinking-capable property tests in [its compatibility guidance](https://hypothesis.readthedocs.io/en/latest/compatibility.html). PostgreSQL 18 is the current stable manual line, with 18.6 current during this assessment, in the [official PostgreSQL documentation](https://www.postgresql.org/docs/).

## Backend Package Set

| Concern | Decision | Boundary |
|---|---|---|
| Request validation | Pydantic 2 models with explicit unknown-field rejection and bounded strings | Request schemas never double as unrestricted persistence models |
| Email validation | Standards-aware maintained validator through the Pydantic-compatible email type | Backend normalization policy remains explicit and testable |
| Rate limiting | Dedicated registration middleware/service with a maintained limiter selected after dependency-health review | Process-local storage is permitted only for single-instance local profile; interface allows shared storage later |
| Common/breached password check | Local denylist provider with versioned corpus metadata and verified license/source | No live password-check API and no password-derived external request |
| Errors | One global problem mapper plus typed application failures | Exception internals stay in secret-free logs, never public detail |
| Logging | Python structured logging facade emitting JSON-compatible records to stdout | No raw request bodies, emails, passwords, hashes, or tokens |
| HTTP testing | FastAPI-supported test client plus PostgreSQL integration boundary | SQLite is not accepted as the transaction/constraint authority |

The exact limiter and denylist corpus are resolved in the Code Generation plan only after checking maintenance, license, Python 3.14 support, and transitive dependencies. That is an implementation dependency choice, not permission to install anything during this documentation stage.

## Flutter Baseline

| Area | Selected direction | Pinning rule | Rationale |
|---|---|---|---|
| SDK | Flutter stable 3.44 line with bundled Dart 3.12 line | Exact SDK recorded by the repository and CI before generation | Official documentation currently reflects this stable line; do not chase an unreleased channel |
| State management | flutter_riverpod 3.4 line using Notifier/AsyncNotifier APIs | Exact compatible version in pubspec.lock | Approved immutable state model; testable loading/error/success behavior |
| Routing | go_router current compatible stable line | Exact version in pubspec.lock | Explicit public Register and Login routes with later auth guards |
| HTTP | Dio current compatible stable line | Exact version in pubspec.lock | Bounded timeouts, typed transport errors, correlation headers, and later upload support |
| Models | Small hand-written immutable API/domain models for UOW-01 | Add code generation only when repeated model volume justifies it | Avoid unnecessary generator/build complexity in the first story |
| Testing | Flutter unit and widget tests plus SDK integration_test | SDK/package pins follow Flutter lock | Official layers match controller, component, and end-to-end needs |

The selected Flutter baseline follows the current [Flutter stable documentation and archive](https://docs.flutter.dev/install/archive). The official testing guidance recommends many unit/widget tests with enough integration tests for important flows in [Testing Flutter apps](https://docs.flutter.dev/testing/overview). Riverpod 3.4 is the current stable package line in the [official Dart package registry](https://pub.dev/packages/flutter_riverpod).

## Quality Toolchain

| Area | Selected tool family | Required gate |
|---|---|---|
| Python format/lint | Ruff | Format check and lint pass |
| Python typing | mypy with a practical strict configuration | No type errors in application code |
| Backend tests/coverage | Pytest, pytest-cov, Hypothesis | HU-001 scenarios pass; new-code line coverage at least 80 percent; PBT seed visible on failure |
| Migration validation | Alembic upgrade from empty database and current-head check | Clean schema and seeds succeed repeatedly |
| API contract | FastAPI OpenAPI snapshot/compatibility check | Flutter-consumed request/result/problem shapes remain synchronized |
| Dart format/lint | dart format, flutter analyze, recommended Flutter lints | No formatting or analyzer failures |
| Flutter tests/coverage | flutter test plus integration_test | Unit/widget/integration story paths pass; new-code line coverage at least 80 percent |
| Dependency security | GitHub Dependabot/dependency review plus Python audit tooling and reviewed pub lock changes | No unresolved high/critical relevant vulnerability; exceptions documented and approved |
| Supply-chain inventory | uv lock export or equivalent CycloneDX SBOM for a future hosted/release build | Required before production distribution, optional for local prototype |

uv documents that uv.lock records exact cross-platform resolutions and should be committed in its [project layout guidance](https://docs.astral.sh/uv/concepts/projects/layout/). It can also export CycloneDX inventory according to its [lockfile export documentation](https://docs.astral.sh/uv/concepts/projects/export/).

## Local Infrastructure Direction

| Concern | Decision |
|---|---|
| Orchestration | Docker Compose for API and PostgreSQL |
| API process | One development instance for the reference profile; no multiworker claim until shared rate limiting is designed |
| Local network boundary | PostgreSQL only on the internal private Compose network; API also on a client-access bridge with loopback-only port publishing |
| Readiness | PostgreSQL health plus API readiness that checks database/required seed prerequisites |
| Configuration | Committed safe examples; real local secrets ignored; no product-AI variables |
| Images | Supported official image tags pinned to patch and digest during Code Generation; never latest |
| Hosted services | None selected or authorized |

## Security Parameter Decisions

Argon2id starts at memory 19 MiB, iterations 2, parallelism 1, with a unique salt. These are OWASP's documented minimums in the [Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html). Calibration may increase cost but may not reduce it below the minimum merely to pass latency tests.

The JSON API restricts content type and body size, validates structured input, uses safe response types, rejects excessive traffic with 429, and hides internal errors. These constraints follow the [OWASP REST Security guidance](https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html).

## Property-Based Testing Framework Decision

Hypothesis is the selected UOW-01 PBT framework because enforced properties live in Python domain/application/contract behavior. Generators cover normalized-email variants, bounded Unicode password candidates, catalog templates, and public result/problem shapes. Shrinking stays enabled, CI exposes reproduction information, and example tests remain mandatory.

No Dart PBT library is added in this unit. Partial enforcement was explicitly scoped to backend domain rules; Flutter state transitions use deterministic unit/widget scenarios. This avoids adding an unneeded dependency while preserving the functional invariant.

## Version Resolution Gate

Immediately before Code Generation, the approved code plan must:

1. Recheck the selected stable lines against official release/support pages.
2. Resolve a mutually compatible set on the team's Windows/Docker environment.
3. Record exact runtime/SDK/tool versions, package locks, image digests, and CI action commits.
4. Run smoke, security, migration, backend, and Flutter baseline checks.
5. Submit changes as a reviewable code/configuration diff separate from these documentation artifacts.

Until that gate is approved, these decisions remain documentation and no executable project exists.
