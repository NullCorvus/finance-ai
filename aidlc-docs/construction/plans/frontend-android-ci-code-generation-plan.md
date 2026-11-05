# Frontend Android CI Code Generation Plan

## Unit Context

- Unit: frontend Android continuous integration.
- Repository: `finance-ai-frontend`.
- Base for original implementation: `origin/develop` commit `28c91f2b08492b4f59adec6868b84cce8accc254` (includes merged PR #48).
- Follow-up implementation branch: `codex/ci-emulator-stability-20261104`, based on `origin/develop` at `e6e9d4656b9f9dd1c50d1a3292de8b7fc86c3298` (includes merged PR #49).
- Story mapping: developer workflow improvement; no user-facing feature story is needed.
- Dependencies: Flutter 3.47.2; pinned GitHub Actions; a pinned backend repository commit `37de6dc61a7e4c5215febe7ed3ecca1a3b97e098`; Docker Compose PostgreSQL/API; Android API 35 emulator.
- Contracts: use existing `RUN_REAL_AUTH_FLOW_TEST` and `FINANCE_AI_API_BASE_URL` Dart defines; the backend OpenAPI/API remains authoritative.

## Steps

- [x] 1. Inspect the existing workflow, app config, integration test, backend Compose setup, and action release SHAs.
- [x] 2. Edit `.github/workflows/ci.yml` for branch triggers, remove Windows, and upload the built debug APK with short retention.
- [x] 3. Add a Docker-backed, disposable backend/PostgreSQL and Android emulator job that runs `integration_test/register_flow_test.dart` against the local API.
- [x] 4. Correct the existing text-capture refresh test setup so it loads the expenses list before asserting that confirmation refreshes it.
- [x] 5. Validate the workflow YAML, pinned action references, secret/permission boundaries, and diff.
- [x] 6. Run applicable format, analysis, unit/widget, APK build, and emulator integration checks; report anything blocked by local tooling.
- [x] 7. Fix the emulator action's line-by-line script parsing by moving the two journey commands into a Bash helper invoked as one line; validate shell syntax, YAML configuration, and independent failure handling.
- [x] 8. Diagnose hosted run `41668605623`, including the Android emulator graphics backend, PNG validity, Flutter integration-test target selection, and the 45-minute release-job timeout.
- [x] 9. Update the release emulator workflow to use a supported software graphics mode, run both release integration files in one Flutter invocation to avoid duplicate build/install work, and allow up to 60 minutes for this release-only job.
- [x] 10. Validate the helper, workflow triggers/configuration, pinned dependencies and secrets boundary, and all feasible frontend checks; record that hosted emulator execution remains required.
- [x] 11. Update the AI-DLC execution record, push the follow-up branch, and open PR #50 to `develop` without merging or deploying.

## Emulator Stability Follow-Up

- PR #49 (`44b8e3c`) was merged into `develop` as `e6e9d4656b9f9dd1c50d1a3292de8b7fc86c3298`.
- Hosted run `41668605623` used the corrected helper, but the emulator ran with deprecated `swiftshader_indirect`, logged graphics buffer errors, raised an uncaught Flutter image decode error, and reached the 45-minute job timeout during the next Flutter invocation.
- The current follow-up uses `-gpu software`, includes both release integration files in one `flutter test --no-pub` invocation, and sets a 60-minute limit only on this release/manual emulator job.
- Local validation: Bash syntax, YAML parse and release-gate assertions, combined-target CLI parsing (stopped at the expected no-device check), and `git diff --check` passed. `actionlint` and a local Android emulator are unavailable.
- Extension compliance: Security Baseline compliant; no production/model credentials or deployment triggers added. Partial Property-Based Testing is N/A because no business logic or serialization changed. Resiliency Baseline remains disabled.

## Security and Release Constraints

- Keep `permissions.contents` read-only and disable checkout credential persistence for the cross-repository backend checkout.
- Use a fixed backend commit rather than executing arbitrary moving branch content.
- Never provide production database or AI provider credentials to this job.
- Upload only an unsigned debug APK with a seven-day retention period; do not label it a release or deployable production build.
- The user explicitly authorized pushing the follow-up workflow correction for PR testing; commit `44b8e3c` is on `codex/ci-script-runner-fix-20261103`. PR #49 was opened into `develop`; it has not been merged.
