# PR #19 Follow-up Issues and Review Replies

Paste-ready bodies for the work that was deliberately deferred, plus the reply text for each
Codex review thread. `gh` could not create these automatically (the local token is invalid).

---

## Issue 1 - Remove the remaining dead receipt endpoints and prototype client (Tier B/C)

**Title:** `chore(hu-015): remove the unused legacy /receipts/scan endpoint and deepseek_client prototype`

**Body:**

The DIAN bypass endpoint was deleted in PR #19 remediation because BR-06 excludes QR decoding and
DIAN lookup and no client ever called it. Two related pieces of unused surface remain.

Evidence that nothing calls them:

- `finance-ai-frontend` (all branches) never references `/receipts/scan` or `/dian-bypass`
  (`git log --all -S` finds nothing, with a working control on `/receipts/proposal`).
- Cloud Run logs contain 33 hits on `/receipts/proposal` and zero on `/receipts/scan`.
- `src/finance_ai/receipts/` does not exist on `develop`; the whole module arrived with `7d6e36b`.
- `/receipts/scan` has a single mocked happy-path test and bypasses the sanitizer, the proposal
  lifecycle and the shared error contract.

Scope:

- Remove the `/receipts/scan` route, `ReceiptScanResponse`, the legacy synchronous
  `preprocess_receipt_image()` helper and the two `scan` tests.
- Decide the fate of `src/finance_ai/receipts/deepseek_client.py`: it is unused by `src/` after that
  change but is imported by the **untracked** local corpus `test_receipts/prompt_injection/*` and
  `test_receipts/expanded_benchmark.py`, and its hash is recorded in
  `test_receipts/experiments/expanded-r3-live-20260926/provenance.json`.
- If the prototype client goes, move the prompt-injection and benchmark harness onto the gateway
  adapters, or version `test_receipts/` in git first so the evidence trail survives.
- Regenerate `openapi.json` and update the build/security test instructions.

---

## Issue 2 - Enforce the documented LLM limits (Codex finding #5)

**Title:** `fix(hu-015): consume FINANCE_AI_LLM_* settings in the vision providers`

**Body:**

`llm_timeout_seconds`, `llm_max_output_tokens` and `llm_max_image_bytes` are documented in
`.env.example:34-36` and `deploy/.env.production.template:34-36` and range-validated in
`tests/unit/test_ai_settings.py`, but no runtime code reads them:

- `gateway.py` keeps `max_tokens = 4096` (the setting says 2048) and call sites omit `timeout`, so
  the 30 s method default is used instead of `llm_timeout_seconds`.
- Gemini retries up to four models at `min(timeout, 12s)` each, so the real worst case is ~48 s:
  the configured budget was never a budget.
- `llm_max_image_bytes` is never enforced; ingress allows 10 MiB and the base64 payload is built
  unchecked, so a 10 MiB upload becomes a ~13.3 MiB request.
- `deepseek_client.py` hardcodes `max_tokens: 2048` and `timeout: 30.0` in both methods.

Deliverables:

1. Adapters take the settings (max output tokens, default timeout) and enforce a real total
   deadline across the fallback chain.
2. Enforce the image bound on the compressed payload before encoding.
3. **Measure real receipts first.** `preprocessor.py` normalises to 2400 px at Q85, which can exceed
   the current 1 MiB default, so a naive hard reject would start failing legitimate receipts.
   Choose between raising the documented default (the setting allows up to 5 MiB) or degrading
   gracefully by recompressing until the payload fits.

---

## Issue 3 - Pillow advisories block the dependency audit

**Title:** `chore(deps): upgrade Pillow to 12.3+ to clear 35 pip-audit advisories`

**Body:**

`uv run pip-audit` fails on the current lock:

```
Name   Version ID              Fix Versions
pillow 11.3.0  PYSEC-2026-2249 12.1.1
pillow 11.3.0  PYSEC-2026-3493 12.3.0
... (35 advisories in total, all fixed by 12.x; latest fix 12.3.0)
```

This matters more than usual for this feature: Pillow parses untrusted user-uploaded receipt images.
`pillow-heif 1.8.0` declares `Requires-Dist: pillow>=11.1.0` (no upper bound), so the upgrade is
installable, but `pyproject.toml` currently pins `pillow>=11.0,<12`.

Suggested work: relax the constraint to `pillow>=12.3,<13`, re-lock, then re-run the receipt
preprocessor/guard suites (EXIF stripping, dimension limits, HEIC registration) plus a live
extraction against `test_receipts/inputs` before merging.

---

## Issue 4 - Housekeeping: untracked local tooling fails the repo-wide lint command

**Title:** `chore: keep the local receipt lab and dev scripts out of repo-wide lint and git status`

**Body:**

`scripts/seed_test_account.py`, `scripts/test_receipt_ai.py` and `test_receipts/**` are untracked but
live inside the repository, so a local `uv run ruff check .` reports 64 errors that CI (a clean
checkout) never sees, and `git status` is permanently dirty. Decide per artifact whether to track it
(the prompt-injection corpus is cited as evidence in the design docs) or ignore it via `.gitignore`.

---


## Review replies (one per Codex thread on PR #19)

### 1. `src/finance_ai/expenses/service.py` (+126) - manual confirmation after extraction failure

Fixed in `bfa7897`. You were right, and it was a spec contradiction rather than only a code bug: the
receipt-proposal design says the `failed_extraction` draft exists so the user can complete the fields
by hand, while BR-CONF-02 only allowed `complete`/`partial`. `failed_extraction` is now in
`CONFIRMABLE_PROPOSAL_STATUSES` (with `not_a_receipt` and `discarded` still rejected), the fallback
draft keeps the same 24 h expiry as a normal draft instead of racing a 1 h clock, BR-CONF-02 is
amended, and a regression test confirms the real `create_fallback_proposal()` output end to end. We
kept the distinct status instead of relabelling it `partial` because the client banners are keyed on
`failed_extraction`.

### 2. `src/finance_ai/receipts/router.py` (+161) - provider exception text in responses

Fixed in `5eb989f`. The gateway now raises `VisionProviderError` carrying only the HTTP status (never
`resp.text`), the sanitizer no longer accepts free text and always emits the fixed Spanish message,
and the routes share one helper that logs a structured event with the error type only. We also
stopped logging raw model output on unparseable completions (it is user receipt content), and the
request correlation ID is now inherited by every log record so a copied client report can still be
matched to the provider failure. Two side notes: the free-text parameter was also a latent 500,
because a longer message would have tripped the 255-character `ValidationIssue.message` bound inside
the fallback path; and the same class of leak in the image decode path was closed in `b8d627c`.

### 3. `src/finance_ai/receipts/dian_resolver.py` (+68) - raw DIAN failure reason

Resolved by removal in `c486626`. Investigation showed the endpoint had no consumer: the Flutter app
never called it on any branch, Cloud Run logs show zero hits on `/receipts/dian-bypass` against 33 on
`/receipts/proposal`, the leaking branch had no test, and `src/finance_ai/receipts/` does not exist on
`develop` (the module arrived with this feature commit). BR-06 already excludes "QR decoding, DIAN
lookup, and local OCR", so the endpoint was out of the approved story scope as well as unused. The
route, the resolver module, `DianBypassRequest`, its tests and 66 lines of `openapi.json` are gone.
The remaining legacy `/receipts/scan` route (also unused, coupled to the local benchmark harness) is
tracked separately rather than deleted here.

### 4. `src/finance_ai/receipts/router.py` (+171) - proposal commits in the route

Fixed in `6b79f0e` with the full extraction. `ReceiptProposalService` now owns the draft lifecycle
(`create_draft`/`get_draft`/`replace_draft`/`discard_draft`) through a new `ReceiptProposalUnitOfWork`
and `SQLAlchemyReceiptProposalUnitOfWork`; duplicate detection moved into the service behind an
injected lookup port, preserving its existing separate read transaction; a
`ReceiptProposalNotFoundError` replaces the raw 404 `HTTPException` so missing drafts follow the
shared error contract (with a one-line Flutter map addition in the sibling repo); and the create/retry
duplication is gone. `receipts/router.py` no longer injects a database session - it was the only
module doing so - so proposal writes now match the other modules and can grow related work atomically.
Ten service unit tests were added and the API tests now run against the real service on an in-memory
unit of work.

### 5. `src/finance_ai/receipts/gateway.py` (+301) - P2 LLM limits

Accepted and deferred to a dedicated issue. Verified all three settings are dead: `max_tokens` stays
at the adapter default 4096, call sites never pass `llm_timeout_seconds`, and `llm_max_image_bytes` is
read nowhere. Two findings make the fix less mechanical than it looks, which is why it is not in this
PR: the Gemini chain retries four models at `min(timeout, 12 s)` so the configured budget is not
enforced end to end, and the current 1 MiB image bound would reject legitimate Q85-normalised
receipts, so the bound needs measurement before it is enforced.

### 6. General - CI state of this branch

While verifying, we found the quality job could not have passed: two migration heads (this branch and
`develop` each added a `0014`, so `alembic upgrade head` failed and would also break the deploy
startup command), pre-existing ruff format/lint and mypy failures, and `migrations/env.py` disabling
existing loggers. All are fixed (`bf67853` plus the touched files in `5eb989f`), with merge revision
`0015_merge_hu015_budgets` verified against a throwaway PostgreSQL 18 instance: upgrade, seeds and
`alembic check` all clean, 290 tests passing at 87% coverage, OpenAPI export with no drift. The only
red gate left is `pip-audit`: Pillow 11.3.0 carries 35 advisories fixed by 12.3.0, tracked as its own
issue because it is a major dependency bump.
