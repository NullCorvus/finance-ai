# HU-015 PR #19 Codex Review Remediation Plan

**Branch**: `feat/hu-015-ai-receipt-photo-capture` (backend `finance-ai-backend`)
**Source**: automated Codex review on PR #19 (reviewed commit `7d6e36b`), verified against `dbad8c7`.
**Scope decisions (confirmed by the user)**: fix #1, #2, #4 and #3-Tier A in this PR; defer #5 to a follow-up issue.

## Verified findings and dispositions

| # | Codex finding | Verdict | Decision |
|---|---|---|---|
| 1 | `failed_extraction` proposals cannot be confirmed | Valid (spec contradiction BR-CONF-02 vs provider-failure recovery) | Fix: status becomes confirmable + 24 h expiry |
| 2 | Provider exception text exposed in proposal responses | Valid (client-visible leak + latent 255-char validation crash) | Fix: strict sanitization, no raw text in body or logs |
| 3 | Raw DIAN exception returned in `reason` | Valid but unused code (no client ever called it) | Tier A: delete the DIAN path (story excludes QR/DIAN lookup) |
| 4 | Proposal commits owned by the HTTP router | Valid (AGENTS.md L22; only module injecting `get_db_session`) | Fix: full service + UoW extraction |
| 5 | `FINANCE_AI_LLM_*` limits never applied | Valid (all three knobs dead) | Defer to follow-up issue (image bound needs measurement) |

## Work plan

### Commit 1 - Finding #1: provider-outage manual recovery
- [x] `expenses/service.py`: `CONFIRMABLE_PROPOSAL_STATUSES` includes `failed_extraction`
- [x] `receipts/sanitizer.py`: fallback draft expiry 1 h -> 24 h
- [x] Unit tests: manual confirm of `failed_extraction`; regression test using the real
      `create_fallback_proposal()` output; 24 h window assertion
- [x] Amend BR-CONF-02 + audit/state bookkeeping (docs commit)

### Commit 2 - Finding #2: no provider internals in responses or logs
- [x] `receipts/gateway.py`: raise `VisionProviderError` without the upstream body; structured log
- [x] `receipts/gateway.py`: stop logging model output on invalid JSON (+ fix 3 mypy errors)
- [x] `receipts/sanitizer.py`: remove the free-text `error_message` parameter
- [x] `receipts/router.py`: shared sanitized helper; log error type only
- [x] `core/logging.py` + `middleware.py`: publish the request correlation ID to every log record
- [x] Tests: marker string absent from the response body and from the captured logs
- [x] Same-family fix: image decode failures no longer echo the decoder exception (`b8d627c`)

### Commit 3 - Finding #3 (Tier A): delete the DIAN path
- [x] Delete `receipts/dian_resolver.py`, `/dian-bypass` handler, `DianBypassRequest`, DIAN tests
- [x] Regenerate `openapi.json` (66 lines removed)
- [x] Docs note citing the scope exclusion (BR-06 + code-generation summary)
- [x] Follow-up issue text for Tier B/C (`/scan` + `deepseek_client.py`)

**Evidence for removal**: BR-06 in `hu-015-receipt-proposal/functional-design/business-rules.md:19` already
excludes "QR decoding, DIAN lookup, and local OCR". `git ls-tree develop src/finance_ai/receipts/` is empty, so
the module (and the endpoint) arrived with commit `7d6e36b` and never existed on `develop`. No Flutter branch
ever referenced the path (`git log --all -S 'dian-bypass'` is empty with a working control), and Cloud Run logs
show 33 hits on `/receipts/proposal` versus zero on `/receipts/scan` and `/receipts/dian-bypass`. The only
compiler of the leaked string (`f"DIAN_ERROR: {exc}"`) was therefore unreachable in production.

### Commit 4 - Finding #4: application service owns proposal transactions
- [x] `receipts/uow.py` + `db/receipt_uow.py`
- [x] `receipts/service.py` (`ReceiptProposalService` + duplicate-lookup port)
- [x] `core/errors.py`: `ReceiptProposalNotFoundError`
- [x] `receipts/dependencies.py`: service factory
- [x] `receipts/router.py`: thin routes, no `get_db_session`, de-duplicated extraction helper
- [x] Tests rewired to override the service (SQLite UoW + stub duplicate lookup)
- [x] Fix `repository.py` mypy `rowcount` error
- [x] Frontend: one-line addition to the known error-code map (other repo, `17f0fd6`)

### Commit 5 - Verification and PR hygiene
- [x] ruff format/check, mypy src (clean on all tracked files)
- [x] alembic upgrade/seed/check on a throwaway PostgreSQL 18 container (no drift)
- [x] `scripts/export_openapi.py` drift check (no diff)
- [x] `pytest --cov=finance_ai` -> 290 passed, 87% (>= 80% required)
- [x] `uv build` succeeded
- [x] CI blockers repaired: migration heads merged (`0015_merge_hu015_budgets`), `env.py` no longer
      disables loggers, pre-existing ruff/mypy failures in the touched files cleared
- [x] Reply text prepared for each of the six Codex threads (see `hu-015-pr19-follow-up-issues.md`)
- [x] Follow-up texts written (#5 LLM limits, Tier B/C cleanup, Pillow advisories, lint housekeeping)
- [ ] Blocked on a decision: `pip-audit` (35 Pillow advisories) needs a major dependency bump

## Verification log

| Date | Command | Result |
|---|---|---|
| baseline | `uv run pytest -q -m 'not integration'` | 245 passed, 33 deselected |
| baseline | `uv run mypy src` | 4 pre-existing errors (gateway.py x3, repository.py x1) |
| baseline | `uv run ruff check` / `ruff format --check` at `dbad8c7` | 7 lint errors, 5 files unformatted |
| baseline | `uv run alembic upgrade head` at `dbad8c7` | FAILED: multiple head revisions |
| commit 1 | `uv run pytest tests/unit/test_expense_confirmation.py tests/unit/test_receipt_sanitizer.py -q` | 21 passed |
| commit 2 | `uv run pytest -q -m 'not integration'` | 250 passed |
| commit 3 | `uv run pytest -q -m 'not integration'` + OpenAPI export | 247 passed, openapi.json -66 lines |
| commit 4 | `uv run pytest -q -m 'not integration'` | 257 passed |
| commit 5 | `uv run pytest --cov=finance_ai -q` (integration included) | 290 passed, 87% coverage |
| commit 5 | `uv run alembic upgrade head && seeds && alembic check` (throwaway PG 18) | clean, no drift |
| commit 5 | `uv build` | sdist + wheel built |
| commit 5 | `uv run pip-audit` | FAILED: 35 advisories in Pillow 11.3.0 (deferred, needs decision) |
| commit 5 | `flutter analyze` + `flutter test test/features/receipt_capture` (frontend) | clean, 7/7 passed |

