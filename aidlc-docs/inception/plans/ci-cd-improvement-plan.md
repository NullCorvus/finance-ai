# CI/CD Improvement Plan

## Context

Brownfield change to the frontend GitHub Actions workflow. The application is a Flutter Android client with a separate FastAPI/PostgreSQL backend. The frontend repository's `develop` branch is the feature integration target; `main` is the production-ready branch. The backend CI already runs on PRs and both branches, and its production deploy is `main` only.

## Scope and Risk

- Components: frontend `.github/workflows/ci.yml`, existing auth integration test, backend's pinned `compose.yaml` used as an ephemeral CI dependency, and AI-DLC verification documentation.
- User impact: contributors get faster feedback about Android compilation and an APK they can install for manual QA.
- Risk: medium. The emulator and Docker job is slower and can fail due to runner/toolchain instability; it does not alter deployed services.
- Out of scope: Windows, backend workflow edits, branch-protection settings, signed releases, production deployment, Copilot/agent features, and test coverage for all financial workflows.

## Execution Steps

- [x] 1. Inspect current frontend/backend workflows, branch triggers, integration test, and dirty checkout state.
- [x] 2. Record requirements and isolate frontend work from existing local edits in a clean worktree based on current `origin/develop`.
- [x] 3. Update Android CI: run on PRs targeting `develop`/`main`, remove redundant push triggers and Windows, upload a seven-day debug APK artifact.
- [x] 4. Add a pinned Android emulator job that starts the backend and PostgreSQL in Docker and runs the existing real-auth integration flow.
- [x] 5. Validate workflow syntax and run applicable Flutter/backend/build checks; record results and limitations.
- [x] 6. Complete the AI-DLC build/test instructions and report the local branch and artifact/release distinction.

## Text Workflow

Pull request targeting `develop`/`main` -> Flutter format/analyze/tests/coverage -> debug APK build -> seven-day Actions artifact. In parallel, a disposable Docker backend/database plus Android emulator runs registration/login/session restore/logout. A separate production release remains a reviewed `main` deployment concern.

## Approval

The user's response, “Ok so we should make those changes ok ??”, approves the previously discussed scope: Android-focused CI, remove Windows CI, make the APK useful as a downloadable artifact, and improve integration confidence. The user's later clarification states the team uses PRs; frontend `push` triggers were removed to avoid duplicate post-merge runs. No external repository or production changes are authorized.

## Extension Compliance

- Security Baseline: compliant by design; immutable action SHAs, minimal permissions, ephemeral local services, no model/provider or production secrets.
- Property-Based Testing: N/A; no pure business logic or serialization code changes.
- Resiliency Baseline: N/A; extension is disabled in `aidlc-docs/aidlc-state.md`.
