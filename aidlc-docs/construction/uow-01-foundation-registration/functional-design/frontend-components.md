# UOW-01 Foundation and Registration — Frontend Components

## UI Boundary

The Flutter registration UI is an English manual form. It collects identity credentials, guides correction, submits to the versioned backend contract, and navigates to Login after success. It has no AI affordance and creates no authenticated client state.

## Component Hierarchy

AppRouter exposes RegisterScreen and LoginScreen as public routes. RegisterScreen owns the presentation boundary and contains RegisterForm, submission feedback, and navigation behavior. RegisterForm contains EmailField, PasswordField, PasswordConfirmationField, PasswordVisibility controls, and RegisterButton.

## Component Responsibilities

| Component | Inputs and dependencies | State/output | Responsibility |
|---|---|---|---|
| AppRouter | Authentication route configuration | Current public route | Permit Register to Login navigation without treating registration as authentication |
| RegisterScreen | Registration controller/provider, router | Rendered registration state | Compose the form, feedback, loading state, and post-success navigation |
| RegisterForm | Initial empty values, submit callback | Ephemeral controllers, focus, visibility toggles, local field errors | Collect email/password/confirmation and create one submit intent |
| EmailField | Current text and field error | Email change events | Accept an email keyboard/input mode and expose a clear label/error |
| PasswordField | Current secret, visibility flag, field error | Secret change and visibility events | Obscure by default; expose accessible visibility toggle |
| PasswordConfirmationField | Current secret, visibility flag, field error | Secret change and visibility events | Obscure by default; explain exact-match requirement |
| RegisterButton | Form validity guidance and submission status | Submit event | Start submission once; disabled with visible progress while active |
| RegistrationFeedback | Typed failure or success | Visible field/general message | Show safe English guidance without internal details |
| RegistrationController | AuthRepository | Immutable RegistrationViewState | Coordinate local validation, API call, typed result mapping, and duplicate-submit guard |
| AuthRepository | FinanceApiClient | RegistrationResult or typed failure | Call POST /api/v1/auth/register and decode the stable contract |

## Immutable View State

| State | Required data | Form behavior |
|---|---|---|
| Idle | No error, not submitting | Empty editable form |
| Editing | Current safe field-error map if any | Editable; relevant error clears when its field changes |
| Submitting | In-progress flag | Inputs remain visible; Register disabled; progress announced |
| Validation Failure | Field errors and optional safe general detail | Focus first invalid field; correction allowed |
| Conflict | Email conflict message | Email remains editable and focusable |
| Retryable Failure | Safe general message | Form remains available; retry allowed |
| Success | Safe confirmation and public result | Secrets cleared; navigation to Login scheduled/performed once |

Passwords are not copied into Riverpod state, application storage, analytics, or logs. They remain only in ephemeral obscured form controls long enough for correction/submission and are cleared on successful registration or screen disposal. Email may remain visible after a recoverable failure.

## Form Rules

| Field | Local guidance | Server authority |
|---|---|---|
| Email | Required; trim surrounding spaces for submission; show format guidance | Normalizes, validates, and enforces global uniqueness |
| Password | Required; 8–128 characters; no composition rule | Enforces the same bounded length and hashes only valid input |
| Password confirmation | Required; exact equality with password | Enforces exact equality without echoing either secret |

Local checks prevent unnecessary requests, but server field_errors replace/augment local guidance when the backend rejects the command. The UI must not claim that an email is available before server success.

## Interaction Flow

1. The user opens Register and sees three labeled empty fields plus Register.
2. Password fields are obscured by default; each visibility control changes only its own display state.
3. On submit, local validation focuses the first invalid field and shows all known field errors.
4. If locally valid, the controller enters Submitting before beginning the API call.
5. Further Register taps are ignored while Submitting.
6. On 422, field_errors appear beside the corresponding controls.
7. On 409, the email conflict is understandable and focus returns to email.
8. On 429, 503, network failure, or 500, a safe general retry message appears. No internal detail is shown.
9. On 201, the controller clears secrets, shows confirmation, and navigates once to Login.
10. Register success stores no token and cannot open an authenticated screen.

## API Integration

| UI action | Endpoint | Request | Success mapping | Failure mapping |
|---|---|---|---|---|
| Submit Register | POST /api/v1/auth/register | email, password, password_confirmation | 201 to Success, confirmation, Login navigation | 422 to field errors; 409 to email conflict; 429/503/500/network to safe retryable failure |

The API client must decode by stable status/code rather than compare human-readable message strings.

## Stable Automation Keys

| Element | Key |
|---|---|
| Email input | register-email-input |
| Password input | register-password-input |
| Password confirmation input | register-password-confirmation-input |
| Password visibility button | register-password-visibility-button |
| Confirmation visibility button | register-confirmation-visibility-button |
| Submit button | register-submit-button |
| General error feedback | register-error-banner |
| Success feedback | register-success-message |

## Accessibility and Usability Rules

- Every input has a persistent visible label; placeholder text is not the only label.
- Errors are associated with their controls and are not conveyed by color alone.
- Obscured fields identify the visibility button's current action to assistive technology.
- Submission progress is announced and the disabled state is visually clear.
- Keyboard traversal follows email, password, confirmation, Register.
- The first invalid field receives focus after validation.
- Safe failure text remains readable and retry does not require re-entering email.

## Required UI Scenarios

| Scenario | Expected observable result |
|---|---|
| Empty or malformed email | Email guidance; no request |
| Password length 7 | Password guidance; no request |
| Password length 8 or 128 with matching confirmation | Locally eligible for request |
| Password length 129 | Password guidance; no request |
| Confirmation differs | Confirmation guidance; no request |
| Repeated tap during submission | One active submission intent |
| Server returns duplicate conflict | Email conflict displayed; no success/navigation |
| Server returns validation field errors | Errors shown at matching fields |
| Network/server temporary failure | Safe retry state; no authenticated state |
| Server returns 201 | Secrets cleared, confirmation shown, one navigation to Login, no token stored |

## Exclusions

Login behavior beyond being the success destination, session storage, authenticated navigation, social login, email verification, password recovery, financial forms, and AI assistance are not frontend responsibilities of HU-001.
