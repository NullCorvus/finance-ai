# UOW-01 Android and Windows Client Extension Plan

## Authorization

The user explicitly authorized this bounded extension on 2026-08-29 with: "so go ahead and create the necesary to maintain the PC version as well".

This extension keeps one Flutter application and one shared feature implementation. Windows is a supported build target, not a fork and not a second product.

## Scope

- [x] Confirm the local Windows Flutter, Visual Studio C++, and Windows SDK toolchain.
- [x] Generate and review the Flutter Windows runner under `frontend/windows/`.
- [x] Make the default API location platform-aware while preserving build-time server overrides.
- [x] Add shared configuration tests and a native Windows smoke test.
- [x] Add a checksum-verified Windows build job to continuous integration.
- [x] Document the Android/Windows development and build workflow.
- [x] Run formatting, analysis, shared tests, the Windows smoke test, a Windows build, and an Android regression build.
- [x] Record verification evidence and return the project to completed UOW-01 state.

## Guardrails

- Android and Windows use the same Dart widgets, state, routing, validation, and API contract.
- No AI, login/session, budgeting-domain, synchronization, or later-story behavior is introduced.
- The private Docker network boundary remains unchanged.
- A future intermediary server is supplied with `FINANCE_AI_API_BASE_URL`; no server is hard-coded into the client.
- Property-based testing is not applicable because this extension adds platform scaffolding and endpoint selection, not a new domain invariant. Deterministic unit and native smoke tests cover the change.

## Target Artifacts

- `frontend/windows/`
- `frontend/lib/core/config/app_config.dart`
- `frontend/test/core/config/app_config_test.dart`
- `frontend/integration_test/windows_smoke_test.dart`
- `.github/workflows/ci.yml`
- `README.md`
- `frontend/README.md`
- UOW-01 code summary, state, and audit trail
