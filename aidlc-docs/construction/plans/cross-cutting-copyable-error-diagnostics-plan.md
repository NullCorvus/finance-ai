# Cross-Cutting Copyable Error Diagnostics Plan

## Authorization and Cause

The user explicitly requested copyable, easy-to-detect errors across the application on 2026-08-29. A read-only connection probe confirmed the reported Windows registration failure: no service was listening at the configured PC API origin, `127.0.0.1:8000`.

This is a bounded observability and developer-experience extension. It does not add a product feature, expose the private Docker network, or change registration business behavior.

## Tasks

- [x] Confirm the immediate connection-failure cause.
- [x] Add a reusable, secret-free client diagnostic report and copyable error panel.
- [x] Preserve safe request/correlation IDs and transport reasons through the API and registration layers.
- [x] Apply the shared diagnostic panel to local, server, conflict, transport, and unexpected registration failures.
- [x] Add unit/widget tests for safe formatting, sanitization, propagation, display, and clipboard copy.
- [x] Add mandatory agent guidance and human troubleshooting documentation.
- [x] Run formatting, analysis, shared tests, native Windows smoke, and Android/Windows builds.
- [x] Record evidence and restore the completed UOW-01 state.

## Security and Testing Constraints

- Reports must never contain passwords, confirmation values, email addresses, tokens, request bodies, stack traces, SQL, environment values, or raw exceptions.
- Configured API URLs must be reduced to a safe origin/path with user information, query, and fragment removed.
- Stable codes and request/correlation IDs must remain machine-searchable.
- Property-based testing is not applicable to the UI/propagation change. Deterministic tests cover the report contract and credential-removal invariant.
