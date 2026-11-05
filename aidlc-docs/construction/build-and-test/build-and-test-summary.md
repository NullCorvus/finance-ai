# Build and Test Summary

The frontend workflow validates formatting and static analysis, runs Flutter unit/widget tests with an 80% line-coverage gate, builds an Android debug APK, and runs one Android-emulator real-API auth/session integration flow against a disposable backend and database.

The backend workflow separately checks PostgreSQL-backed migrations and tests, generated OpenAPI consistency, Python lint/type checks, package builds, and dependency audit. These checks reduce regressions but do not prove every financial workflow correct. Manual QA on a QA build and additional transaction-level integration tests remain valuable before merging release work to `main`.

The downloaded debug APK is unsigned and retained temporarily for QA. A signed APK/AAB and GitHub Release require a separate protected release workflow with signing credentials and an explicit release trigger.

## Local Verification Record

- Flutter 3.47.7 (repository workflow pins a checksum-verified Flutter 3.47.2 archive): formatting passed with 0 changed files; `flutter analyze` reported 0 issues.
- `flutter test --coverage`: 635 passed, 1 intentionally skipped; line coverage 86.06%, above the 80% gate.
- `flutter build apk --debug`: succeeded; output `build/app/outputs/flutter-apk/app-debug.apk` (205 MB, unsigned).
- Pinned backend Docker image built; disposable PostgreSQL/API container became ready and was removed after the check.
- Workflow YAML parsed and structural assertions passed. No local Android emulator is installed; the new Android device integration job still needs its first GitHub Actions run.
- Initial test run exposed a stale precondition in the text-capture refresh widget test. The test now loads the expenses list before checking that confirmation refreshes it; the focused test and full suite pass.
- Hosted emulator run `41638154067` reported transient `adb: device offline` checks but eventually logged `Emulator booted`. It failed before integration assertions because the pinned emulator action executes each input-script line in a separate shell. The workflow now invokes a Bash helper as one line; shell/YAML checks and a simulated one-suite failure check pass. The actual Android journeys need a hosted rerun and are not yet verified.
