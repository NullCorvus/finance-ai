# UOW-03 / HU-003 Build and Test Summary

## Overall Status

- **Build:** Success
- **Tests:** Pass
- **Coverage:** Backend 90.41%; Flutter 86.10%
- **Release-candidate status:** Ready for team review
- **Production deployment status:** Not evaluated; Operations remains a separate stage

HU-003 is complete as an authenticated vertical slice for owned financial accounts. It includes exact server-derived balances, supported/suggested currency behavior, create/list/detail/edit/deactivate/reactivate, and permanent deletion of unused accounts. Accounts with any movement history preserve that history and return `account_delete_blocked` with deactivation guidance.

## Build Results

| Target | Result | Artifact/evidence |
|---|---|---|
| Backend source distribution | Passed | `finance-ai-backend/dist/finance_ai_backend-0.1.0.tar.gz` |
| Backend wheel | Passed | `finance-ai-backend/dist/finance_ai_backend-0.1.0-py3-none-any.whl` |
| PostgreSQL schema/seed | Passed | Alembic reports no new upgrade operations; repeatable seed ran twice |
| OpenAPI | Passed | Byte-stable SHA-256 `A1B07FF7EC5C6A7D3F95ABBF62415458F9DAC166E30E201BDA4A216CA3ED0CFE` |
| Android debug | Passed | `finance-ai-frontend/build/app/outputs/flutter-apk/app-debug.apk` |
| Windows debug | Passed | `finance-ai-frontend/build/windows/x64/runner/Debug/finance_ai.exe` |

Observed build timings included 115.3 seconds for the final Android artifact, 102.5 seconds for the Windows native test build, and 97.5 seconds for normal Windows bundle restoration. These are local observations, not performance requirements.

The formal package build found and corrected one release defect: Hatch was force-including a resource directory already included by the package declaration, causing a duplicate wheel path. Removing the redundant `force-include` made both distributions build successfully. Backend CI now runs `uv build` so this packaging regression is caught automatically.

## Test Execution

| Category | Result |
|---|---|
| Backend complete suite | 122 passed |
| Backend PostgreSQL integration | 17 passed |
| Backend line coverage | 90.41%, threshold 80% |
| Flutter shared suite | 70 passed |
| Flutter line coverage | 86.10%, threshold 80% |
| Windows native smoke | 4 passed |
| Android compilation | Passed |
| Dependency vulnerability audit | No known vulnerabilities; unpublished local package correctly skipped |
| OpenAPI drift | No drift |
| Alembic/model drift | No new upgrade operations detected |
| Seed repeatability | Passed twice |

The PostgreSQL suite proves confirmed-only balance calculation, currency locking, active-name races, owner isolation, composite movement ownership, unused deletion, blocking for pending/confirmed/voided movements, and the concurrent movement/delete invariant. The authenticated E2E proves registration, login, account lifecycle, cross-session visibility, successful unused deletion, post-delete `404`, and used-account `409 account_delete_blocked`.

## Local Performance Profile

The warm isolated API was sampled with up to 10 concurrent local clients and zero request errors:

| Operation | Samples | p95 | p99 | Required p95/p99 | Result |
|---|---:|---:|---:|---:|---|
| List | 100 | 244.11 ms | 280.16 ms | 250/500 ms | Pass |
| Detail | 100 | 70.77 ms | 97.64 ms | 250/500 ms | Pass |
| Create | 50 | 277.61 ms | 291.98 ms | 500/1000 ms | Pass |
| Edit | 50 | 87.05 ms | 113.28 ms | 500/1000 ms | Pass |
| Status | 50 | 229.56 ms | 300.38 ms | 500/1000 ms | Pass |
| Delete | 50 | 215.05 ms | 230.34 ms | 500/1000 ms | Pass |

The separate seeded PostgreSQL query-plan test also passed and verifies index-backed account/balance access. These measurements characterize the documented local prototype profile; they do not establish an internet-facing SLA or production capacity.

## Contract, Security, and Runtime Evidence

- Every account route requires authentication and uses server-derived ownership.
- Missing and foreign identifiers remain indistinguishable.
- Permanent deletion returns `204` only for an unused account; movement history is protected by application checks, row locking, and `ON DELETE RESTRICT`.
- Correlation IDs, `no-store`, bounded requests, stable codes, and safe copied diagnostics are tested.
- Diagnostic tests exclude credentials, email addresses, account names, balances, request bodies, SQL, and raw exceptions.
- Git diff checks, hub repository boundaries, tracked-secret checks, and generated contract/client agreement pass.
- Temporary PostgreSQL test data, pytest caches, Flutter drive aliases, and dependency overrides were removed.
- Package metadata contains zero temporary `Q:` references.
- The verified local API is ready on `127.0.0.1:8000`, exposes the DELETE contract, and the normal Windows application is responsive.

## Extension Compliance

| Extension | Status | Evidence |
|---|---|---|
| Security baseline | Compliant | Authentication, object ownership, restrictive integrity, safe errors, correlation, dependency audit, and privacy-negative tests pass. Deployment-only controls are N/A without a target. |
| Property-based testing, partial mode | Compliant | Account normalization, money round-trip, lifecycle, ownership, and deletion-history properties run in the 122-test backend suite. |
| Full resiliency baseline | Disabled/N/A | The prototype did not opt into production HA/DR rules. Required lightweight rollback, concurrency, readiness, cleanup, bounded timeouts, and fail-closed behavior pass. |

## Generated Instructions

- `build-instructions.md`
- `unit-test-instructions.md`
- `integration-test-instructions.md`
- `performance-test-instructions.md`
- `build-and-test-summary.md`

## Pull Requests and CI

- Backend: `https://github.com/Maicol2363/finance-ai-backend/pull/1` — quality passed.
- Frontend: `https://github.com/Maicol2363/finance-ai-frontend/pull/1` — shared/Android and Windows jobs passed.
- Documentation: `https://github.com/NullCorvus/finance-ai/pull/2` — repository-boundary check passed; intentionally stacked on the existing repository-split branch.

## Remaining Scope

Move-history and advanced delete-all workflows remain deliberately deferred until expenses, income, transfers, receipts, budgets, and reporting define their dependency graph. Production TLS, hosting, monitoring, availability, backup/restore objectives, and deployment approval belong to a future Operations stage.
