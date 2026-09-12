# Component Methods — Finance AI

## Contract Types

| Type | Fields or purpose |
|---|---|
| RegisterCommand | email, password, password_confirmation |
| ValidatedRegistration | Normalized email and validated secret held only for the request |
| RegisteredUser | Public user identifier, normalized email, preferred currency code |
| RegistrationResult | Registered user plus safe success message; contains no token |
| FieldErrors | Request-field name mapped to safe validation messages |
| ApiProblem | type, title, status, stable code, safe detail, optional field_errors |
| RegistrationViewState | Immutable idle, submitting, success, or failure state |

## Backend Interfaces

### Registration Route

| Method | Input | Output | Notes |
|---|---|---|---|
| register(request) | HTTP JSON registration request | HTTP 201 or safe problem | Protocol mapping only; no token |

### Registration Application Service

| Method | Input | Output | Notes |
|---|---|---|---|
| register(command) | RegisterCommand | RegistrationResult | Owns the complete use case and transaction |

### Registration Policy

| Method | Input | Output |
|---|---|---|
| normalize_email(raw_email) | Raw string | Normalized email or field error |
| validate_password(password) | Secret string | Valid result or field error |
| validate_confirmation(password, confirmation) | Two secret strings | Valid result or field error |
| validate(command) | RegisterCommand | ValidatedRegistration or FieldErrors |

Policy decisions:

- Trim surrounding email whitespace and compare/store a normalized lowercase address.
- Enforce a valid email representation.
- Accept passwords from 8 through 128 characters.
- Do not require character classes.
- Require exact confirmation equality.
- Never include either password in errors or logs.

### Password Hasher

| Method | Input | Output |
|---|---|---|
| hash_password(password) | Valid plaintext password | Adaptive password hash |
| verify_password(password, password_hash) | Candidate plus stored hash | Boolean; reserved for HU-002 |

Argon2 is preferred through a maintained library. Its exact dependency/version is pinned during EN-001.

### Repositories and Unit of Work

| Component and method | Input | Output |
|---|---|---|
| UserRepository.exists_by_email(normalized_email) | Normalized email | Boolean |
| UserRepository.add(new_user) | New user entity | Staged user with identifier |
| CurrencyRepository.require_by_code(code) | ISO currency code | Shared currency or configuration failure |
| CategoryRepository.add_many(user_id, templates) | Owner plus templates | Staged categories |
| IncomeSourceRepository.add_many(user_id, templates) | Owner plus templates | Staged income sources |
| CatalogTemplateProvider.registration_defaults() | None | Immutable catalog template |
| UnitOfWork.commit() | Current staged transaction | Successful commit |
| UnitOfWork.rollback() | Current staged transaction | Rolled-back transaction |

Repository operations never commit.

### Error Mapper

| Method | Input | Output |
|---|---|---|
| to_problem(error, correlation_id) | Known application error | Safe ApiProblem |

| Condition | HTTP status | Stable code |
|---|---:|---|
| Invalid registration fields | 422 | registration_invalid |
| Normalized email already exists | 409 | email_already_registered |
| Request rate limited | 429 | registration_rate_limited |
| Missing COP seed/configuration | 503 | service_unavailable |
| Unexpected failure | 500 | internal_error |

## Flutter Interfaces

| Component and method | Input | Output |
|---|---|---|
| RegistrationController.submit(email, password, confirmation) | Form values | Updated immutable view state |
| RegistrationController.reset_field_error(field) | Field name | State with recoverable error cleared |
| AuthRepository.register(command) | Registration command | Success or typed failure |
| FinanceApiClient.post(path, body) | Versioned path and JSON body | Decoded success/problem |
| SecureErrorPresenter.message_for(problem) | Typed problem | English safe copy and field messages |

## Public Registration Contract

### Request

- Method: POST
- Path: /api/v1/auth/register
- Content type: JSON
- Fields: email, password, password_confirmation

### Success

- Status: 201
- Contains public user identifier, normalized email, preferred currency COP, and confirmation message.
- Contains no access token, renewable credential, password hash, or catalog internals.
- Flutter displays success and navigates to Login.

### Failure Behavior

- Field validation preserves recoverable non-secret form input.
- Repeated taps are ignored while submission is active.
- Safe server failures permit retry without creating a partial user.
- Password values never appear in telemetry, errors, or persisted client state.
