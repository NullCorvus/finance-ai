# UOW-01 Foundation and Registration — Code Generation Plan

## Status and Approval Boundary

This is the single source of truth for generating executable UOW-01 files. The user approved the complete plan on 2026-08-28 with the raw response "iok, go ahead and START". Code Generation Part 2 completed on 2026-08-29 with executable backend, Flutter, PostgreSQL, Compose, CI, and end-to-end evidence. Required tool installation approvals were obtained when encountered.

## Unit Context

| Item | Scope |
|---|---|
| Unit | UOW-01 Foundation and Registration |
| Enablers | EN-001 through EN-006 |
| Product story | HU-001 Register an Account |
| Deployables | One FastAPI backend, one Android-first Flutter client, one PostgreSQL database |
| Success | User plus exact starter catalogs commit atomically; Flutter confirms and navigates to Login without a session |
| Exclusions | Login/session, account creation, financial movements, email verification, hosted deployment, and product AI |

## Preflight Evidence

Initial state checked on 2026-08-28; final state verified on 2026-08-29:

- uv 0.12.5 is available and can manage the selected Python runtime.
- uv provisioned the locked CPython 3.14.7 environment.
- Flutter 3.47.2 / Dart 3.13.2 are checksum-verified under the ignored project tool directory.
- Docker Desktop 4.88.1, Compose 5.4.0, and Engine 29.7.2 are installed and verified.

All planned code, migration, security, client, container, and end-to-end checks completed. Exact evidence is recorded in `aidlc-docs/construction/uow-01-foundation-registration/code/code-summary.md`.

## Target Structure

Application code and executable configuration are created outside aidlc-docs:

- backend/ — Python/FastAPI source, migrations, resources, and tests.
- frontend/ — Flutter Android application and tests.
- compose.yaml — local API/PostgreSQL orchestration.
- .github/workflows/ci.yml — continuous quality checks.
- README.md and root .env.example — clean setup and safe configuration.

Documentation summaries remain under aidlc-docs/construction/uow-01-foundation-registration/code/ only.

## Generation Steps

### Step 1 — Guardrails and Toolchain Resolution

- [x] Preserve all existing user/documentation changes and confirm no application roots already exist.
- [x] Recheck Python, uv, Flutter, Dart, Docker, and Compose, including common Windows installation locations.
- [x] Use uv to provision the selected Python 3.14 patch in the project environment if required.
- [x] If Flutter or Docker requires installation/admin interaction, request user approval rather than silently changing the system.
- [x] Resolve exact compatible package versions from official registries and record them in committed lockfiles; use no latest image/action references.
- [x] Verify and record the source, license, and SHA-256 for the local common-password corpus before vendoring it.

### Step 2 — Repository and Quality Baseline (EN-001, EN-006)

- [x] Create backend/pyproject.toml, backend/uv.lock, backend/.python-version, backend/README.md, and backend/.env.example.
- [x] Create the backend src layout under backend/src/finance_ai/ and test layout under backend/tests/.
- [x] Create the Android Flutter scaffold under frontend/ with package finance_ai and organization com.nullcorvus.
- [x] Pin Flutter/Dart and packages through frontend/pubspec.yaml and frontend/pubspec.lock.
- [x] Update root .gitignore for Python, Dart/Flutter, local environment, coverage, IDE, and build artifacts without removing existing rules.
- [x] Establish Ruff, mypy, Pytest/coverage/Hypothesis, dart format, flutter analyze, and Flutter test settings.

### Step 3 — Backend Shared Foundation (EN-004)

- [x] Create backend/src/finance_ai/main.py and backend/src/finance_ai/api/router.py for the application factory and /api/v1 routing.
- [x] Create backend/src/finance_ai/core/config.py for validated environment configuration.
- [x] Create backend/src/finance_ai/core/logging.py for structured secret-free events and correlation IDs.
- [x] Create backend/src/finance_ai/core/errors.py for typed failures and stable problem responses.
- [x] Create backend/src/finance_ai/core/middleware.py for request correlation, JSON/body enforcement, and safe global handling.
- [x] Create backend/src/finance_ai/core/rate_limit.py for the replaceable single-instance registration limiter.
- [x] Create backend/src/finance_ai/api/health.py with distinct safe liveness/readiness behavior.

### Step 4 — PostgreSQL, Migrations, and Seeds (EN-003)

- [x] Create backend/src/finance_ai/db/base.py and backend/src/finance_ai/db/session.py.
- [x] Create SQLAlchemy models in backend/src/finance_ai/db/models/reference.py, identity.py, and catalogs.py for Currency, AppUser, Category, PaymentMethod, and IncomeSource only.
- [x] Create backend/alembic.ini, backend/migrations/env.py, backend/migrations/script.py.mako, and backend/migrations/versions/0001_uow01_foundation_registration.py.
- [x] Enforce normalized unique email, ownership, active-name uniqueness, foreign keys, bounded columns, and audit timestamps in models/migration.
- [x] Create backend/src/finance_ai/db/seeds.py with repeatable COP/USD shared seed and immutable registration-template definition.
- [x] Verify migration upgrade from an empty PostgreSQL database and repeatable seed execution when Docker/PostgreSQL is available.

### Step 5 — Registration Domain and Application Logic (HU-001)

- [x] Create backend/src/finance_ai/auth/schemas.py for RegisterCommand, RegisteredUser, RegistrationResult, field errors, and public problems.
- [x] Create backend/src/finance_ai/auth/policy.py for email normalization/validation, 8–128 password bounds, exact confirmation, and no password transformation.
- [x] Create backend/src/finance_ai/auth/passwords.py for file-backed unsafe-password denial and Argon2id hashing/check-upgrade behavior.
- [x] Create backend/src/finance_ai/resources/common-passwords.txt and common-passwords.source.json from the verified licensed corpus.
- [x] Create backend/src/finance_ai/auth/repositories.py and backend/src/finance_ai/auth/uow.py as application-facing protocols.
- [x] Create backend/src/finance_ai/db/repositories/registration.py and backend/src/finance_ai/db/uow.py as SQLAlchemy implementations that never commit from repositories.
- [x] Create backend/src/finance_ai/auth/service.py with validate, hash, open transaction, resolve COP, check email, stage user/catalogs, flush, commit-once, rollback behavior.
- [x] Map only the identified normalized-email constraint race to email_already_registered.

### Step 6 — Registration API and Contract (HU-001, EN-004)

- [x] Create backend/src/finance_ai/auth/router.py with POST /api/v1/auth/register.
- [x] Return HTTP 201 public user id/email/COP/message and no token, session, hash, or catalog internals.
- [x] Return stable 422, 409, 429, 503, and 500 problems with safe field mappings and correlation IDs.
- [x] Apply request limits, content-type enforcement, throttling, and explicit public-route classification.
- [x] Generate and commit backend/openapi.json from the implemented FastAPI contract.

### Step 7 — Backend Tests and Security Proof (EN-006, HU-001)

- [x] Create backend/tests/unit/test_registration_policy.py, test_passwords.py, test_registration_service.py, and test_rate_limit.py.
- [x] Create backend/tests/property/test_registration_properties.py with domain generators, shrinking, and reproducibility for normalization, password boundaries, safe output, and exact catalog invariants.
- [x] Create backend/tests/api/test_register_api.py for every public status/shape and secret-free output.
- [x] Create backend/tests/integration/test_registration_persistence.py for migration/seed, atomic success, staged rollback failures, concurrent duplicate race, ownership, and no account/subcategory/session rows.
- [x] Create backend/tests/test_logging_safety.py to prove passwords, hashes, request bodies, and raw email do not enter captured logs.
- [x] Meet the approved 80 percent new-code coverage threshold without replacing scenario assertions with coverage-only checks.

### Step 8 — Flutter Application Foundation (EN-005)

- [x] Create frontend/lib/main.dart and frontend/lib/app.dart.
- [x] Create frontend/lib/core/config/app_config.dart, core/theme/app_theme.dart, and core/router/app_router.dart.
- [x] Create frontend/lib/core/api/api_client.dart and api_problem.dart with configurable API base URL, 15-second timeout, correlation propagation, and typed problems.
- [x] Create a minimal frontend/lib/features/auth/login/presentation/login_screen.dart as the registration destination only; do not implement HU-002 authentication.
- [x] Keep the standard Android scaffold minimal and remove unused sample-counter code/tests.

### Step 9 — Flutter Registration Feature (HU-001)

- [x] Create frontend/lib/features/auth/register/domain/registration_models.dart.
- [x] Create frontend/lib/features/auth/register/data/auth_repository.dart.
- [x] Create frontend/lib/features/auth/register/presentation/registration_state.dart and registration_controller.dart using Riverpod immutable state.
- [x] Create frontend/lib/features/auth/register/presentation/register_screen.dart with email, password, confirmation, visibility controls, loading, safe field/general errors, success, and Login navigation.
- [x] Implement all stable automation keys defined in frontend-components.md.
- [x] Keep secrets only in ephemeral form controllers; clear them on success/disposal; never store a token or authenticated state.

### Step 10 — Flutter Tests and API Compatibility (EN-006, HU-001)

- [x] Create frontend/test/features/auth/register/registration_controller_test.dart.
- [x] Create frontend/test/features/auth/register/register_screen_test.dart covering validation, visibility, accessibility, repeated tap, every typed failure, secret clearing, and single Login navigation.
- [x] Create frontend/test/features/auth/register/auth_repository_test.dart against captured OpenAPI-compatible fixtures.
- [x] Create frontend/integration_test/register_flow_test.dart for the configurable real API path when the complete local stack is available.
- [x] Run dart format, flutter analyze, Flutter unit/widget tests, coverage gate, and the real integration flow when Flutter/Docker are available.

### Step 11 — Local Infrastructure, CI, and Clean Setup (EN-002, EN-006)

- [x] Create backend/Dockerfile with a pinned supported Python base and non-root runtime user.
- [x] Create compose.yaml with API and PostgreSQL 18.6 services, private network, persistent local volume, health/readiness checks, and no AI settings.
- [x] Create root .env.example with safe local values and no real credential.
- [x] Create .github/workflows/ci.yml with pinned actions for backend format/lint/type/test/migration/security and Flutter format/analyze/test jobs.
- [x] Create/update root README.md with prerequisites, setup, migration/seed, API, Flutter emulator/device, tests, teardown, and troubleshooting.
- [x] Ensure no latest image/action, committed secret, public database binding, or unsupported runtime remains.

### Step 12 — Verification, Traceability, and Handoff

- [x] Run available backend unit/property/API tests and static checks through the locked environment.
- [x] Run PostgreSQL migration/seed/integration/concurrency tests through Compose when Docker is available.
- [x] Run Flutter format/analyze/unit/widget/integration checks when Flutter is available.
- [x] Verify HU-001 AC1–AC5 and EN-001–EN-006 against executable evidence; report any tool-blocked checks honestly.
- [x] Verify application files exist only under backend/, frontend/, root configuration, and .github/—never under aidlc-docs/.
- [x] Create aidlc-docs/construction/uow-01-foundation-registration/code/code-summary.md with created files, decisions, tests run, results, and remaining environment blockers.
- [x] Mark this plan's completed steps immediately and update aidlc-state.md without altering unrelated user changes.

## Story and Enabler Completion Rules

| Identifier | Mark complete only when |
|---|---|
| EN-001 | Separate roots, pinned tools/locks, format/lint/review conventions exist |
| EN-002 | API/PostgreSQL local orchestration and readiness are executable and documented |
| EN-003 | Alembic schema and repeatable COP/USD/template seeds pass from empty PostgreSQL |
| EN-004 | Versioned registration contract and stable problems are generated and checked |
| EN-005 | Flutter theme/router/Riverpod/loading/error foundation and Login destination exist |
| EN-006 | Continuous quality commands/CI and clean setup are present; tool-blocked checks are not falsely marked passed |
| HU-001 | AC1–AC5 pass through the real Flutter/API/PostgreSQL boundary with no partial data or credential exposure |

## Expected Generation Result

All twelve sequential steps completed. The private network was retained when Docker Desktop host forwarding proved incompatible; isolated backend and headless Flutter test services provided the full real boundary evidence without weakening the requirement. No later story or AI placeholder was implemented.
