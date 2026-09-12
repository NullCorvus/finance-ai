# UOW-01 Foundation and Registration — Business Logic Model

## Functional Boundary

UOW-01 establishes the shared application foundations and delivers HU-001 as the first complete vertical product flow. This model specifies registration behavior only. EN-001 through EN-006 enable that behavior through project structure, local services, migrations, seeds, contracts, Flutter foundations, and quality checks.

Registration creates identity and editable supporting catalogs. It does not authenticate the user, create a financial account, accept financial data, or invoke AI.

## Inputs and Outputs

| Boundary | Input | Output |
|---|---|---|
| Flutter form | Email, password, password confirmation | Local field guidance or a submission intent |
| Public API | JSON registration command | HTTP 201 public result or a safe problem response |
| Registration use case | Transport-independent registration command | Registration result or a typed business failure |
| Persistence transaction | Validated identity, password hash, COP reference, catalog templates | One committed user aggregate or no new rows |

The success result contains the public user identifier, normalized email, preferred currency code COP, and an English confirmation message. It contains no password, password hash, token, renewable credential, or internal catalog identifiers.

## Main Registration Flow

1. The client checks the visible form rules and blocks an obviously invalid submission.
2. The client enters Submitting and prevents repeated Register actions.
3. The API receives POST /api/v1/auth/register and maps JSON into a registration command.
4. The registration policy trims surrounding email whitespace, lowercases the email, validates its representation, checks the 8–128 password length, and checks exact password confirmation.
5. Any validation failure is returned before a database transaction is opened.
6. The validated password is converted to an adaptive password hash. Plaintext exists only for the active request and is never logged or persisted.
7. The application service opens one Unit of Work.
8. The service resolves the required shared COP currency. Its absence is a configuration failure, not a user validation error.
9. The service checks the normalized email for an early, understandable conflict response.
10. The service stages one active user with the normalized email, password hash, and COP preference.
11. The service loads the versioned registration catalog template.
12. The service stages owned active Categories Needs, Wants, and Other; Payment Methods Cash, Card, and Transfer; and Income Sources Salary and Other.
13. No Subcategory, Account, session, role, or AI record is staged.
14. The Unit of Work flushes changes so identifiers and constraints are resolved.
15. The Unit of Work commits exactly once.
16. The API returns HTTP 201 with the safe public result.
17. Flutter clears secret values, shows confirmation, and navigates to Login. No authenticated route becomes available from registration alone.

## Transaction and Failure Model

The user and every default-catalog row form one registration transaction. A failure before commit rolls back the entire Unit of Work. A successful commit makes all rows visible together.

| Failure point | Transaction behavior | Public outcome |
|---|---|---|
| Invalid command | No transaction opened | 422 registration_invalid with field errors |
| Email found by early lookup | Nothing staged; transaction exits without commit | 409 email_already_registered |
| COP reference missing | Nothing committed | 503 service_unavailable |
| Catalog staging or constraint failure | User and all catalog rows rolled back | Safe mapped failure; no partial account |
| Concurrent normalized-email insert | Losing transaction rolls back after unique constraint | 409 email_already_registered |
| Unexpected application or persistence failure | Entire transaction rolls back | 500 internal_error with no internal detail |

The early email lookup improves the common conflict path, but the database unique constraint on normalized email is the final concurrency authority. Only a violation positively identified as that email constraint maps to email_already_registered; unrelated integrity failures remain internal/configuration failures.

## Backend State Progression

| State | Allowed next state | Meaning |
|---|---|---|
| Received | Rejected or Validated | Raw command exists only at the request boundary |
| Validated | Hashed | Normalized email and bounded secret passed all rules |
| Hashed | Transaction Open | Plaintext is no longer needed by business logic |
| Transaction Open | Conflict, Configuration Failure, or Staged | Shared data and uniqueness are evaluated |
| Staged | Committed or Rolled Back | User and exact catalogs await one commit |
| Committed | Returned | Public result can be emitted |
| Rejected, Conflict, Configuration Failure, Rolled Back | Returned Failure | No partial registration is observable |

## Flutter State Progression

| Current state | Event | Next state | UI behavior |
|---|---|---|---|
| Idle or Editing | User edits a field | Editing | Relevant stale field error is cleared |
| Editing | Submit with local errors | Validation Failure | Invalid fields explain the correction; no request is sent |
| Editing | Submit valid form | Submitting | Register is disabled and progress is visible |
| Submitting | Repeated tap | Submitting | Tap is ignored; no second intentional request is created |
| Submitting | HTTP 201 | Success | Secrets are cleared; confirmation appears; navigation to Login follows |
| Submitting | HTTP 422 | Validation Failure | Server field errors appear at the relevant controls |
| Submitting | HTTP 409 | Conflict | Email conflict is explained and the email field is addressable |
| Submitting | HTTP 429, 503, network failure, or 500 | Retryable Failure | Safe general feedback and retry are available |
| Any failure | User edits or retries | Editing or Submitting | No success is inferred and no authenticated state is created |

## Observable Side Effects

A successful registration has exactly these durable side effects:

- one active AppUser with normalized unique email and COP preference;
- three active user-owned Categories;
- three active user-owned Payment Methods;
- two active user-owned Income Sources.

It has no other durable product side effect. In particular, it creates zero financial accounts, subcategories, sessions, transactions, budgets, attachments, or AI artifacts.

## Testable Properties

These properties are carried into code-generation planning. They complement the explicit example scenarios in HU-001.

| Component or behavior | Property category | Property |
|---|---|---|
| Email normalization | Idempotence | Normalizing an already normalized valid email produces the same result |
| Email equivalence | Invariant | Letter-case and surrounding-space variants of the same valid email produce one normalized identity |
| Password validation | Invariant | Accepted passwords always have lengths within the inclusive 8–128 boundary; rejected values never reach hashing or persistence |
| Catalog initialization | Invariant | Every successful registration creates exactly 3 categories and 2 income sources, all owned by the created user and active |
| Atomic registration | Business invariant | Observable persisted state is either the complete registration set or none of it |
| Public result/problem mapping | Invariant | No output contains the password or password hash for any generated command or failure |
| Registration state machine | Invariant | A submit event cannot produce authenticated state, and repeated taps during Submitting cannot create an additional client submission intent |
| Round-trip operations | No PBT property identified | UOW-01 defines no business-level parse/format inverse; JSON and database mapping round trips are evaluated later at adapter/test design |
| Oracle or induction | No PBT property identified | Registration has no optimized/reference algorithm or recursive structure requiring these categories |

## Traceability

| HU-001 criterion | Covered behavior |
|---|---|
| AC1 Successful registration | Main flow, exact side effects, atomic commit, 201, confirmation, Login navigation, no session |
| AC2 Duplicate email | Normalization, early lookup, database unique constraint, concurrent conflict mapping |
| AC3 Invalid input | Server-authoritative validation and field-level 422 response |
| AC4 Safe submission | Flutter Submitting state and repeated-tap suppression |
| AC5 Credential protection | Adaptive hashing, secret lifecycle, safe result/problem mapping, rollback |

## Exclusions

Login and sessions are HU-002. Preference editing is HU-003. Financial accounts and richer catalogs belong to later units. Email verification, password recovery, social login, administration roles, financial transactions, and product AI are outside UOW-01.
