# CI/CD Improvement Requirements

## Intent

Improve the Finance AI Flutter Android continuous integration workflow so that contributors receive useful checks and can download a short-lived build for manual testing. Keep production deployment separate from development validation.

## Approved Scope

- Run frontend checks on pull requests targeting `develop` or `main`.
- Do not rerun the frontend workflow on `develop`/`main` pushes; the agreed team workflow uses pull requests, and the frontend has no push-triggered production deployment.
- Remove the Windows runner because Windows is not a current product target.
- Keep Flutter formatting, analysis, unit/widget tests, the existing 80% line coverage threshold, and debug APK compilation.
- Upload the unsigned debug APK as a seven-day GitHub Actions artifact for review and testing.
- Add an Android emulator integration test that registers, logs in, restores a session, and logs out against an isolated backend and PostgreSQL database.
- Pin GitHub Actions to immutable commit SHAs and use read-only repository permissions.
- Leave the backend CI and production deploy workflow unchanged. Backend CI already runs on PRs and pushes to `develop` and `main`; production deployment remains a separate `main`-only operation.
- Do not publish a GitHub Release or deploy production from this change.

## Acceptance Criteria

1. A frontend PR targeting `develop` or `main` runs shared Flutter quality checks and produces an Android debug build.
2. CI provides a short-lived APK artifact when the build succeeds.
3. The Android emulator test exercises the existing real-API authentication flow against a disposable backend/database with no production credentials or model API keys.
4. The workflow has no Windows test/build job.
5. Existing user changes in other checkouts remain untouched; no commits, pushes, GitHub settings changes, releases, or production deployments occur.
6. The existing widget test for post-confirmation expense-list refresh sets up a loaded list before asserting its invalidation behavior.

## Testing Boundaries

The emulator test demonstrates that the Android app can communicate with the backend for the authentication/session lifecycle. It does not establish full financial-flow correctness, production readiness, device-vendor secure-storage behavior, or signed release safety. The backend's own CI remains responsible for backend unit/API, migration, schema, and dependency checks.

## Extension Compliance

- Security Baseline: applicable; minimize workflow permissions, pin actions, use only a disposable local database, and expose no production credentials.
- Property-Based Testing: not applicable; this workflow change adds no business logic or serialization implementation.
- Resiliency Baseline: disabled in the existing project configuration; skipped.
