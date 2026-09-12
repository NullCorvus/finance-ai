# Application Services — Finance AI

## Service Model

The application is one deployable FastAPI service organized by feature. “Service” below means an internal application boundary, not a separately deployed microservice.

| Service | Responsibility | Collaborators |
|---|---|---|
| Registration Application Service | Execute HU-001 as one use case | Policy, hasher, template provider, repositories, Unit of Work |
| Registration Policy Service | Normalize and validate registration input | Email validation and bounded password rules |
| Catalog Initialization Service | Transform approved templates into new user-owned rows | Template provider and catalog repositories |
| API Problem Service | Map validation, conflict, throttling, configuration, and unexpected failures | Route layer and logging boundary |
| Flutter Registration Service | Convert form intent into repository calls and immutable view state | Registration controller, Auth Repository, API client |

## Registration Orchestration

The Registration Application Service performs this sequence:

1. Receive a transport-independent RegisterCommand.
2. Normalize and validate the email, password, and confirmation.
3. Reject invalid input before opening a database transaction.
4. Hash the validated password with the approved adaptive hasher.
5. Open the Unit of Work.
6. Resolve the shared COP currency; treat its absence as a configuration failure.
7. Check whether the normalized email already exists for a fast conflict response.
8. Stage the new user with COP as preferred currency and no role.
9. Load the versioned smallest English catalog template.
10. Stage the user's categories and income sources.
11. Flush as required so database constraints are checked.
12. Commit exactly once.
13. Return public user data and a safe confirmation message.
14. Issue no access or renewable credential; Login remains HU-002.

If any persistence step fails, the Unit of Work rolls back every staged record.

## Concurrency and Uniqueness

The existence check improves the normal response but is not the uniqueness guarantee. The database unique constraint on normalized email is authoritative.

If two equivalent addresses race:

1. Both requests may pass the early existence check.
2. Only one database transaction may satisfy the unique constraint.
3. The losing transaction rolls back completely.
4. The route returns the same safe 409 conflict as an ordinary duplicate.

Only the known email-uniqueness constraint is translated to email_already_registered; unrelated integrity failures remain safe internal errors.

## Catalog Initialization

The initial template contains:

- Categories: Needs, Wants, Other
- Payment methods: Cash, Card, Transfer
- Income sources: Salary, Other
- No initial subcategories

The template provider is deterministic and versioned. Registration copies rows; it does not reference mutable global catalog rows. The transaction creates no financial account.

## Error Policy

| Failure family | Service behavior | Client behavior |
|---|---|---|
| Invalid fields | Return typed validation failure without persistence | Show English field messages and preserve non-secret values |
| Duplicate normalized email | Roll back and return typed conflict | Show registration conflict without retry loop |
| Rate limit | Do not enter use case | Show retry-later message |
| Missing COP seed | Roll back and record safe operational diagnostic | Show temporary-unavailable message |
| Unexpected database failure | Roll back and log correlation context without personal/secret data | Show generic retry message |

Logs may contain a correlation identifier, failure category, and safe operational metadata. They must not contain passwords, hashes, tokens, request bodies, or unnecessary email/financial data.

## Flutter Registration Flow

1. Register Form performs immediate usability checks.
2. Registration Controller ignores additional submit events while already submitting.
3. Auth Repository sends the command through the Finance API Client.
4. The client decodes either the 201 response or ApiProblem.
5. Field errors update immutable Riverpod state.
6. Success displays confirmation and directs App Router to Login.
7. Failure keeps the user on Register and preserves recoverable non-secret input.

Server validation remains authoritative even when Flutter performs the same basic checks.

## Foundation Services

| Foundation concern | Design |
|---|---|
| Health | Root /health reports application liveness; database readiness is represented separately during EN-002 |
| OpenAPI | Versioned application routes appear under /api/v1; interactive docs remain outside that prefix |
| Migration | Alembic owns schema history; registration never creates tables |
| Shared seed | COP/USD are applied repeatably before registration traffic |
| Configuration | Database/session settings are environment-backed; no product-AI settings exist |

## Later Extension Boundary

HU-002 may reuse the password verifier and Auth Repository but adds session behavior separately. Financial modules may reuse the error shape and Unit of Work. Later AI assistance must call normal financial application services and does not alter registration.
