# Application Design — Foundation and HU-001

## Status

Generated for review. This is an implementation-level design baseline, not application code.

## Scope and Traceability

| Item | Coverage |
|---|---|
| User story | HU-001 — Register an Account |
| Technical enablers | EN-001 through EN-006 |
| Product domain | PB-001 — Identity and access |
| Requirements | FR-AUTH-01, FR-AUTH-02, FR-CAT-02, FR-CUR-05, TR-01 through TR-08, applicable security requirements |
| Excluded | HU-002 sessions, email verification/recovery, default financial account, financial CRUD, product AI |

## Approved Decisions

| Concern | Decision |
|---|---|
| Backend organization | Feature-first modular monolith |
| Orchestration | Thin FastAPI route → application service → repositories |
| Transaction owner | Registration Application Service through one Unit of Work |
| API errors | Stable problem-style object with code, safe message, status, and optional field errors |
| API prefix | /api/v1 |
| Flutter state | Riverpod with immutable form/request states |
| Interface language | English |
| Password rule | 8–128 characters, no composition requirement |
| Email verification | Deferred; not part of HU-001 |
| Registration output | Success confirmation and redirect to Login; no automatic session |
| Default account | None; accounts begin in HU-004 |
| Catalog preset | Smallest English preset chosen by the user |

## Component Model

The Flutter Register Screen delegates state to a Riverpod Registration Controller. The controller uses a Flutter Auth Repository, which hides the versioned HTTP client.

The FastAPI Registration Route maps HTTP data to a transport-independent command. The Registration Application Service coordinates:

- Registration Policy
- Password Hasher
- Catalog Template Provider
- User, Currency, and Catalog Repository interfaces
- One Unit of Work
- Safe error mapping

Detailed definitions are in:

- components.md
- component-methods.md
- services.md
- component-dependency.md

## Registration API

| Item | Contract |
|---|---|
| Endpoint | POST /api/v1/auth/register |
| Request | email, password, password_confirmation |
| Success | HTTP 201 with public user identifier, normalized email, preferred currency code, and message |
| Validation | HTTP 422 with stable code and field errors |
| Duplicate | HTTP 409 with stable conflict code |
| Throttling | HTTP 429 |
| Temporary configuration/readiness failure | HTTP 503 |
| Unexpected error | HTTP 500 with no internal detail |

No success response contains a token or password-derived value.

## Data Effects

One successful transaction creates:

1. One app_user with a normalized unique email, adaptive password hash, and preferred COP currency.
2. Three owned categories: Needs, Wants, and Other.
3. Two owned income sources: Salary and Other.

It creates no subcategories, financial accounts, session credentials, or AI records.

The shared COP/USD currency seed is an EN-003 prerequisite rather than a registration side effect.

## Business and Failure Invariants

- Equivalent normalized emails cannot create multiple users.
- The database unique constraint resolves concurrent duplicates.
- User and catalog rows are committed once or rolled back together.
- Repositories never commit independently.
- Passwords are never logged, persisted as plaintext, or returned.
- Validation failures produce no persistent rows.
- Missing seed/configuration fails closed and produces no partial user.
- Repeated Flutter submissions are blocked while the first request is active.

## UI Behavior

The English Register Screen contains:

- Email
- Password
- Confirm password
- Password visibility controls
- Register action
- Inline field feedback
- Disabled/loading submission state
- Safe duplicate/generic error state
- Success confirmation followed by navigation to Login

Non-secret input may remain after recoverable failure. Secrets never enter durable client state or telemetry.

## Quality Mapping

| Quality area | Required verification direction |
|---|---|
| Unit | Email normalization, password bounds, confirmation, error mapping, template determinism |
| Repository | Normalized-email uniqueness, ownership fields, COP resolution |
| Integration | Atomic user/default creation and rollback |
| API | 201/409/422/429/503/500 behavior without secret leakage |
| Flutter widget | Validation, visibility, loading/disabled action, field errors, success navigation |
| End-to-end | Register through real API/database and arrive at Login without a session |
| Property-based | Normalization/idempotence and bounded serialization where it adds value |
| Security | Hashing, rate-limiting behavior, safe logs/errors, dependency checks |

Exact automated test code belongs to the approved construction plan, not this document.

## Construction Boundary

This design intentionally contains no product-AI dependency. Later features reuse the API/error/transaction patterns, while AI remains an optional adapter over already implemented financial forms.
