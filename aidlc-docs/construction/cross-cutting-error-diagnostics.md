# Finance AI Copyable Error Diagnostics

## Purpose

Testing users must be able to recognize an error, copy one safe report, and send it to a developer or coding agent without reconstructing console output. The report must be useful for diagnosis without exposing personal or secret information.

## Required User Experience

Every recoverable user-visible failure must provide:

1. A plain-language message explaining what failed or what the user can do.
2. A stable machine-readable error code.
3. A `Copy error details` action using the shared Flutter diagnostic panel.
4. Confirmation that copying succeeded.
5. Field-level guidance when a particular input needs correction.

The current identity implementation lives in:

- `frontend/lib/core/diagnostics/error_diagnostic.dart`
- `frontend/lib/core/diagnostics/error_diagnostic_panel.dart`
- `frontend/lib/features/auth/register/presentation/registration_controller.dart`
- `frontend/lib/features/auth/session/application/auth_session_controller.dart`
- `frontend/lib/features/auth/login/presentation/login_screen.dart`
- `frontend/lib/features/auth/session/presentation/session_bootstrap_screen.dart`

Future features must extend or reuse this shared foundation rather than display raw exceptions or feature-specific diagnostic formats.

HU-003 account deletion uses the stable `account_delete_blocked` code when any financial movement prevents permanent deletion. Its safe guidance recommends deactivation and deliberately excludes the account name, opening/current balance, movement values, owner identity, and entered data. Flutter renders it through the same shared diagnostic panel and clipboard contract.

## Copyable Report Contract

The safe report contains only:

- Product report heading
- Stable error code
- Operation name
- UTC occurrence time
- Client platform
- Sanitized API location
- Request/correlation ID, or `unavailable`
- Bounded safe technical reason
- Curated user message
- Privacy reminder

The API location must omit URL user information, query values, and fragments. Values are bounded to one line to prevent log or report injection.

## Prohibited Content

Never include passwords, confirmation values, email addresses, tokens, cookies, authorization headers, request or response bodies, user-entered financial data, URL credentials or query values, stack traces, SQL, environment variables, filesystem paths, or raw exception messages.

## Backend Correlation

The client generates a bounded request ID before attempting the call. When the API is reached, it accepts or replaces that ID, returns the correlation ID in safe responses, and records it in structured server logs. A copied report can therefore be matched to server output without copying private form data.

## Implementation Checklist for Agents

- [ ] Define or reuse a stable error code.
- [ ] Map technical failures to curated user guidance.
- [ ] Preserve the safe request/correlation ID.
- [ ] Map only an allow-listed technical reason; never serialize the exception.
- [ ] Render the shared copyable diagnostic panel for user-visible failures.
- [ ] Keep field errors attached to their controls.
- [ ] Add unit tests for mapping and report formatting.
- [ ] Add a widget test proving the clipboard action works.
- [ ] Assert representative entered values and secrets are absent.
- [ ] Run formatting, analysis, tests, and supported-platform smoke/build checks.
- [ ] After Windows integration tests, restore the normal visible bundle with `frontend/tool/test_windows_and_restore.ps1` before sharing the executable.
- [ ] When the repository path contains spaces, use the checked-in Flutter helpers so native-hook path failures remain distinguishable from application failures.

## Current Connection-Failure Example

If the Windows client cannot connect to its default `127.0.0.1:8000` API location, registration and Login display `network_unavailable` with a copy action. Restoration retains the renewable credential and offers retry or local clearing; offline Logout clears local authority and reports that remote revocation was not confirmed. Reports identify only safe context and never include email, passwords, access credentials, renewable credentials, authorization headers, or storage values.
