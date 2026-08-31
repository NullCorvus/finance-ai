# UOW-01 Foundation and Registration — Business Rules

## Rule Authority

The backend is authoritative for every registration rule. Flutter repeats safe deterministic checks only to provide immediate guidance; a client-side pass never guarantees acceptance.

## Identity and Credential Rules

| ID | Rule | Failure behavior |
|---|---|---|
| BR-REG-001 | Remove surrounding whitespace from email, then lowercase it before comparison and storage. Interior characters are not rewritten. | Invalid result proceeds to BR-REG-002 field validation |
| BR-REG-002 | Email is required and must have a valid email representation after normalization. | 422 registration_invalid with an email field error |
| BR-REG-003 | Normalized email is globally unique. A database unique constraint is the final authority, including concurrent requests. | 409 email_already_registered; no second user or catalogs |
| BR-REG-004 | Password is required and its length is inclusively 8 through 128 characters. | 422 registration_invalid with a password field error |
| BR-REG-005 | No uppercase, digit, symbol, or other composition class is required. | No failure for composition alone |
| BR-REG-006 | Password confirmation is required and must exactly equal the submitted password. | 422 registration_invalid with a password_confirmation field error |
| BR-REG-007 | A validated password is stored only as a maintained adaptive hash; Argon2 is preferred. | Registration fails safely if hashing fails |
| BR-REG-008 | Plaintext passwords and password hashes never appear in application logs, telemetry, public responses, problem details, or persisted Flutter state. | Treat any exposure as a security defect |
| BR-REG-009 | Registration creates an active ordinary user and no role or administrator classification. | No role field is accepted or emitted |

## Default-Data Rules

| ID | Rule | Failure behavior |
|---|---|---|
| BR-REG-010 | Shared active currency COP must exist and becomes the new user's preferred currency. | 503 service_unavailable if the required seed is absent |
| BR-REG-011 | Categories copied for the user are exactly Needs, Wants, and Other. | Any inability to create the complete set rolls back registration |
| BR-REG-012 | Payment Methods copied for the user are exactly Cash, Card, and Transfer. | Any inability to create the complete set rolls back registration |
| BR-REG-013 | Income Sources copied for the user are exactly Salary and Other. | Any inability to create the complete set rolls back registration |
| BR-REG-014 | Every copied catalog row is active and owned only by the new user. Shared template definitions do not become shared editable rows. | Ownership/cardinality violation prevents commit |
| BR-REG-015 | Registration creates no Subcategory and no financial Account. | Extra rows violate HU-001 scope |
| BR-REG-016 | The catalog template is versioned in application-owned configuration so future template changes do not mutate existing users' catalogs. | Previously registered users remain unchanged |

## Transaction and Interaction Rules

| ID | Rule | Failure behavior |
|---|---|---|
| BR-REG-017 | User and default catalogs commit in one transaction and become observable together. | Any pre-commit failure rolls back all staged rows |
| BR-REG-018 | Repositories stage or query data but never commit the registration transaction. | Transaction ownership remains with the application service |
| BR-REG-019 | One successful registration performs exactly one commit. | Additional independent commits are a design violation |
| BR-REG-020 | Flutter disables Register while a request is active and ignores repeated submit actions. | No second intentional client request while Submitting |
| BR-REG-021 | Server uniqueness remains mandatory even with client duplicate-tap prevention. | Concurrent/retried duplicates resolve as conflict, not duplicate data |
| BR-REG-022 | HTTP 201 signals complete persistence, not merely accepted processing. | Never return success before commit |
| BR-REG-023 | Registration never issues a token or session and never marks the Flutter app authenticated. | Success routes to Login after confirmation |
| BR-REG-024 | Product AI is neither invoked nor required. Manual entry is the only registration path. | Provider configuration has no effect on registration |

## Public API Rules

| Condition | HTTP status | Stable code | Public content |
|---|---:|---|---|
| Complete registration | 201 | Not applicable | Public user id, normalized email, COP, safe confirmation; no token/catalog internals |
| Invalid email/password/confirmation | 422 | registration_invalid | Safe detail plus field_errors for one or more fields |
| Normalized email already registered | 409 | email_already_registered | Understandable conflict detail; no account-existence internals beyond the submitted address conflict |
| Registration throttled | 429 | registration_rate_limited | Safe retry guidance; exact threshold belongs to NFR Requirements |
| Required COP seed/configuration unavailable | 503 | service_unavailable | Generic temporary-unavailability detail |
| Unexpected failure | 500 | internal_error | Generic safe detail and no exception/SQL/stack information |

A problem response contains type, title, status, stable code, safe detail, and optional field_errors. Field error keys use request-field names: email, password, and password_confirmation. Internal correlation may be recorded safely, but secrets and internal exceptions are not public.

## Validation Order and Aggregation

1. Required and format/length/confirmation checks run before hashing or database work.
2. Independent field validation failures may be returned together so the user can correct the form once.
3. Password confirmation is evaluated only as equality; the server never echoes either value.
4. Database/configuration checks happen only after command validation.
5. A database email-unique violation overrides any optimistic early availability result and maps to the same 409 conflict.
6. An unexpected failure never gets converted into a misleading validation or conflict response.

## Rule Precedence

Security and atomicity rules override convenience behavior. Server validation overrides client assumptions. Database uniqueness overrides a prior absence check. HU-001 exclusions override any catalog template or future feature capable of creating additional records.

## Acceptance-Criteria Mapping

| Criterion | Rules |
|---|---|
| HU-001 AC1 | BR-REG-010 through BR-REG-019, BR-REG-022, BR-REG-023 |
| HU-001 AC2 | BR-REG-001, BR-REG-003, BR-REG-017, BR-REG-021 |
| HU-001 AC3 | BR-REG-002, BR-REG-004 through BR-REG-006 |
| HU-001 AC4 | BR-REG-020, BR-REG-021 |
| HU-001 AC5 | BR-REG-007, BR-REG-008, public API rules |
