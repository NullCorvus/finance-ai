# UOW-02 Secure Sessions — Frontend Components

## UI Boundary

The shared Flutter client implements manual Login, secure session restoration, protected routing, a minimal authenticated Home placeholder, and Logout on Android and Windows. The UI does not authorize backend operations and does not implement preferences, financial CRUD, offline financial data, synchronization, or AI assistance.

## Component Hierarchy

`FinanceApp` owns the application router and an application-lifetime `AuthSessionController`. `AuthBootstrap` blocks routing while restoration is unresolved. Public routes contain the existing Register screen and the new Login screen. Protected routes contain the minimal Home screen and Logout action. Repository, API-client, and secure-store adapters stay outside widgets.

## Component Responsibilities

| Component | Inputs and dependencies | State/output | Responsibility |
|---|---|---|---|
| FinanceApp / ProviderScope | Environment configuration and dependency providers | Root application lifetime | Own one authentication scope shared by Android/Windows |
| AuthBootstrap | AuthSessionController | Checking, retry, or routed child | Restore safely before protected/public route decisions |
| AppRouter redirect | AuthenticationState | Register, Login, restoration, or Home route | Enforce navigation UX without claiming backend authorization |
| LoginScreen | LoginController and router | Form, loading, feedback, success navigation | Compose manual credential entry and submit once |
| LoginForm | Empty email/password controllers | Ephemeral input, focus, visibility, local errors | Collect Login intent without persisting secrets |
| HomeScreen | Authenticated public user and Logout callback | Minimal authenticated placeholder | Prove protected routing only; no HU-003/financial content |
| LogoutAction | AuthSessionController | Disabled/progress state | Revoke when possible, clear locally, return to Login |
| AuthSessionController | AuthRepository and SecureCredentialStore | Immutable AuthenticationState | Restore, accept Login, single-flight renewal, and Logout |
| LoginController | AuthRepository and AuthSessionController | Login view state | Validate, prevent duplicates, map typed failures, hand off successful issuance |
| AuthRepository | FinanceApiClient | Typed user/session result or typed failure | Call Login, renewal, current-user, and Logout contracts |
| AuthenticatedApiClient | Access credential provider and AuthSessionController | Protected HTTP response | Attach Bearer access, join one renewal, retry eligible request once |
| SecureCredentialStore | Platform secure-storage implementation | Read/replace/delete renewable credential | Keep renewable secret outside ordinary app storage/state |
| DiagnosticReportBuilder | Safe typed failure metadata | Copyable secret-free report | Preserve the cross-cutting testing/error convention |

## Authentication and Routing State

| State | Permitted route behavior | Credential behavior |
|---|---|---|
| Checking | Show blocking startup indicator; do not expose Login or Home as resolved truth | Secure store may be read only by its adapter |
| Unauthenticated | Register and Login permitted; Home redirects to Login | No in-memory access credential |
| Submitting Login | Login remains visible; inputs/submit protected from duplicate action | Password only in ephemeral form controller |
| Authenticated | Home and future protected routes permitted; Login/Register redirect to Home | Access in memory; renewable remains in secure storage |
| Restoration Retry | Show retry/clear-local-session choices; Home denied | Renewable retained because transport failure is inconclusive |
| Logging Out | Block protected interaction and duplicate Logout | Revocation/delete in progress |

Router redirects must be deterministic and derived from the controller state. Browser-style deep links are not a security boundary; arriving at a protected location while unauthenticated resolves to Login.

## Login Form Behavior

| Element | Behavior |
|---|---|
| Email | Visible persistent label; required; surrounding whitespace trimmed for submission; bounded format guidance |
| Password | Visible persistent label; required; 8–128 characters; obscured by default; accessible visibility control |
| Login button | Enabled for one submit intent; disabled with visible/announced progress during submission |
| General failure | Shows generic credential or safe retry guidance plus `Copy details`; never identifies account status |
| Registration success notice | Existing safe notice may appear when Register routes to Login; it contains no password/session data |

Login intentionally has no password confirmation. Password recovery, “remember me” duration selection, email verification, social Login, MFA, and device-management UI remain separate stories.

## Login Interaction Flow

1. Login opens with labeled email/password fields and no authenticated state.
2. Local checks prevent empty, malformed, or over-bounded requests and focus the first invalid control.
3. A valid submission enters `Submitting Login` before invoking the repository; repeated taps are ignored.
4. A 401 `invalid_credentials` shows the same message for unknown email, wrong password, or inactive user.
5. A 422 maps safe field errors; 429/503/500/network conditions map to safe retryable feedback.
6. On 200, the controller writes the renewable credential to secure storage first.
7. Only after storage succeeds does it retain the access credential in memory, clear the password, enter `Authenticated`, and route once to Home.
8. If storage fails, it clears partial local state, requests best-effort server revocation, remains on Login, and shows a safe copyable error.

Email may remain for correction after a failure. Password is never copied into Riverpod state, diagnostics, logs, analytics, preferences, or clipboard and is cleared on success/disposal.

## Startup Restoration Flow

| Outcome | Client behavior |
|---|---|
| No stored renewable credential | Enter Unauthenticated and show Login |
| Renewal succeeds and replacement storage succeeds | Hold new access in memory and enter Home |
| API says session is invalid/expired/revoked/replayed | Delete stored credential and show Login with safe sign-in-again guidance |
| API timeout/connection failure | Retain stored credential, deny Home, show Restoration Retry with copyable diagnostic |
| Secure-store read/decrypt failure | Clear only as defined by platform-safe recovery policy, deny Home, and show copyable storage error |
| New credential cannot be stored after server rotation | Clear local authentication, best-effort revoke server session, and require Login |

The retry screen must distinguish “service unavailable” from “session invalid” without exposing token state. A user may explicitly clear the local session and return to Login from the retry screen.

## Authenticated Request and Renewal Behavior

1. The API client obtains the current in-memory access credential immediately before a protected call and adds it only to the Authorization header.
2. An eligible access-expiry 401 asks `AuthSessionController` for renewal. Concurrent calls join the same future/promise.
3. Renewal reads the renewable credential through the secure-store adapter and calls the renewal endpoint.
4. A successful replacement is written to secure storage before the new access credential becomes active.
5. The original protected call retries at most once with the new access credential.
6. Login, renewal, and Logout requests never trigger automatic renewal, and a retried protected request never retries again.
7. Authoritative invalid-session failure clears local authentication and routes to Login; transport failure becomes a retryable typed failure without claiming that Home remains authorized.

Request retry is safe only for operations whose API contract supports it. Future financial mutations will require idempotency keys before automatic replay; HU-002 does not invent that policy.

## Logout Behavior

1. Logout disables itself and begins a blocking transition out of protected state.
2. If a renewable credential exists, the repository attempts current-session revocation once.
3. Regardless of the network outcome, Flutter deletes the renewable credential, clears the in-memory access/user, invalidates protected providers, and routes to Login.
4. A successful/unknown server target needs no success body. If revocation could not be confirmed, Login displays a safe warning and `Copy details` report.
5. Back navigation cannot reveal Home after local clearing.

Offline Logout does not promise immediate invalidation on another machine or the unreachable server; server-side expirations bound the remaining credential. Remote device management is outside HU-002.

## API Integration

| UI action | Endpoint | Success | Typed failure mapping |
|---|---|---|---|
| Submit Login | `POST /api/v1/auth/login` | 200 issued session | 422 field guidance; 401 generic credentials; 429 throttled; 5xx/network safe retry |
| Restore/renew | `POST /api/v1/auth/refresh` | 200 rotated issued session | 401 clear/Login; 5xx/network retain/retry |
| Load current user | `GET /api/v1/auth/me` | 200 public user | Eligible 401 single renewal then one retry; final 401 clear/Login |
| Logout | `POST /api/v1/auth/logout` | 204 | Any failure still clears locally; unconfirmed revocation warning when applicable |

The API client decodes stable status/code, propagates safe correlation IDs, honors non-cacheable credential responses, and excludes secret-bearing request/response bodies from all instrumentation.

## Secure Storage Adapter

The domain-facing interface is intentionally small: `readRenewableCredential`, `replaceRenewableCredential`, and `deleteRenewableCredential`. The implementation uses the approved maintained Flutter secure-storage package for both targets.

- Android uses platform-backed protected storage and must follow the package's supported SDK/backup configuration.
- Windows uses the package's supported Windows protection mechanism and stays within one app installation/user context.
- Tests replace the adapter with an in-memory fake containing explicit read/write/delete failure modes.
- No fallback to plain shared preferences, environment variables, files, SQLite, logs, or hard-coded values is allowed.

Exact platform configuration, dependency versions, and backup/build controls are fixed in NFR Requirements/Design before code generation.

## Stable Automation Keys

| Element | Key |
|---|---|
| Login email | `login-email-input` |
| Login password | `login-password-input` |
| Password visibility | `login-password-visibility-button` |
| Login submit | `login-submit-button` |
| Login general error | `login-error-banner` |
| Copy Login diagnostic | `login-copy-error-button` |
| Restoration progress | `auth-restoration-progress` |
| Restoration retry | `auth-restoration-retry-button` |
| Clear local session | `auth-clear-local-session-button` |
| Home screen | `home-screen` |
| Logout action | `logout-button` |
| Logout warning | `logout-warning-banner` |
| Copy Logout diagnostic | `logout-copy-warning-button` |

## Accessibility and Usability

- Inputs have persistent labels; errors are associated with their controls and not conveyed by color alone.
- Password visibility announces its current action and applies only to the password field.
- Progress and restoration states are announced without repeatedly moving focus.
- Keyboard traversal is email, password, Login; Enter submits once when eligible.
- The first invalid field receives focus, while generic credential failure does not imply which field was wrong.
- Home and Logout are keyboard-accessible on Windows and touch-accessible on Android.
- Copyable diagnostics provide visible confirmation after copying and remain readable/selectable without exposing secrets.
- Layout supports Windows resizing and common Android text scaling without hiding the primary action or error report.

## Required Component Tests

| Scenario | Observable result |
|---|---|
| Empty/malformed Login input | Local field guidance; no request |
| Duplicate tap while submitting | One Login intent/request |
| Unknown, wrong, or inactive credential response | Same public error UI and code; no Home |
| Successful Login and secure-store write | Password cleared; Home shown once; renewable absent from view state/debug output |
| Successful API Login but storage write fails | No Home; partial state cleared; safe copyable storage error |
| Startup with no stored credential | Login shown after Checking |
| Startup with valid renewable credential | Rotated credential stored and Home shown |
| Startup with authoritative invalid session | Stored credential deleted and Login shown |
| Startup with network failure | Credential retained; Home denied; Retry and safe diagnostic shown |
| Multiple protected calls receive expiry 401 | One renewal; each eligible call retries no more than once |
| Renewal replay/invalid response | Local session cleared; Login shown |
| Online Logout | Revocation attempted, local credentials removed, Login shown |
| Offline Logout | Local credentials removed, Login shown with unconfirmed-revocation warning |
| Back after Logout | Home remains inaccessible |
| Diagnostic construction | User email/password/raw credentials and unsafe URI data are absent |

Tests include controller/repository units, widget/router cases, secure-store adapter contract cases, Android shared integration coverage, and native Windows smoke coverage. The existing helper must restore the normal visible Windows bundle after native tests.

## Future Offline-First Boundary

Future financial screens may depend on `LocalFinancialStore` and `SyncCoordinator` abstractions, but HU-002 does not create or simulate them. Session restoration must not be confused with financial synchronization. A future client may show locally stored data while offline only after an approved authorization/cache policy defines when protected financial data may remain visible.

The eventual sync UI must separately communicate pending changes and true conflicts; Login and Home contain no QR pairing, merge, outbox, or silent conflict-resolution behavior.

## Exclusions

HU-003 preferences, password recovery/change, email verification, MFA, remote session management, financial records, local financial database, synchronization, QR transfer, budgets, calendar behavior, currencies editing, and product AI are not frontend responsibilities of HU-002.
