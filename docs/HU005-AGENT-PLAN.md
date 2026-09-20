# HU-005 Agent Plan — Income Sources (Review & Verification)

> **User story (new backlog, PB-003, 2 pts):**
> "As a user, I want to manage my income sources so that income entries use terms that match my finances."
> **Scope:** income sources ONLY. Per PB-003, payment methods are **outside** the product model (accounts replace them).
> **Note:** the old Trello card title still says "Payment Methods and Income Sources" — follow this plan, not the old card title.
> **Role split (AI-DLC):** agent reads, verifies, and proposes → **human approves every gate**. Agent never marks a decision by itself.

## Agent rules — read first

1. **DO NOT reset, clean, overwrite, reformat, or refactor anything.** This code is uncommitted working state.
2. **Read before you write.** There is no code writing in this plan unless a gate says otherwise.
3. **Reuse the existing AI-DLC rules** in `.aidlc-rule-details/` (common rules) if this runs inside the project agent.
4. **Checkboxes:** when you complete a step in the SAME interaction, mark it `[x]`.
5. Report at every **STOP GATE**: what you found, what you propose, and wait for the human's explicit approval.

## The 20% — files to OWN (read fully, twice)

Read in dependency order. The goal is to explain each file in ONE sentence and know which business rule it enforces.

| # | File | What to verify |
|---|------|----------------|
| 1 | `finance-ai-backend/src/finance_ai/db/models/catalogs.py` | `IncomeSource` / `OwnedCatalogMixin`: user_id FK, `is_active` **still exists but is unused** (leftover). `PaymentMethod` model still exists — flag it, do not touch. |
| 2 | `finance-ai-backend/migrations/versions/0004_uow03_income_source.py` | Unique index `uq_income_source_user_name` on `(user_id, lower(name))`; archive-filtered index dropped. |
| 3 | `finance-ai-backend/src/finance_ai/income_sources/service.py` | Business rules: trim + max-length name, per-user `name_exists` check, ownership checks (404), IntegrityError → 409 conversion, delete clears historical references. |
| 4 | `finance-ai-backend/src/finance_ai/db/repositories/income_sources.py` | SQL: list ordered `lower(name)`, `find_by_id_for_user` ownership scoping, `clear_historical_references` is **currently a stub** (documented extension point — no referencing table yet). |
| 5 | `finance-ai-backend/src/finance_ai/income_sources/router.py` | REST surface: `GET ""`, `POST ""`, `PATCH /{id}`, `DELETE /{id}`; error map 401/404/409/422/500/503. |
| 6 | `finance-ai-frontend/lib/features/income_sources/presentation/income_sources_controller.dart` | load/add/rename/delete flows; `incomeSourceSelectorProvider` (selector refresh for new-entry forms); diagnostic contract on failures. |
| 7 | `finance-ai-frontend/lib/features/income_sources/presentation/income_sources_screen.dart` | Add field, list tiles, rename dialog, delete confirmation dialog, empty state, error banner. |

**Tier guidance for the rest** (do NOT deep-read):
- KNOW IT EXISTS: `income_sources/schemas.py`, `dependencies.py`, `uow.py`, `repositories.py` (contracts), frontend `data/income_sources_repository.dart`, `domain/income_source_models.dart`, `presentation/income_sources_state.dart`, `lib/core/router/app_router.dart`, home screen entry point.
- SKIP: build artifacts, `__pycache__`, old docs.
- TRUST THE AI: config files, migration boilerplate outside 0004, test fixtures.

## Phase 1 — Structure (5 min)

- [ ] Confirm the monorepo layout: `finance-ai-backend/`, `finance-ai-frontend/`, `aidlc-docs/`.
- [ ] Confirm `aidlc-docs/aidlc-state.md` says HU-005 income sources implemented/verified.

**STOP GATE 1** — Report: layout confirmed, state doc status quoted.

## Phase 2 — File-by-file (the 20%)

For each of the 7 files above, in order:
- [ ] Read the file fully.
- [ ] Record one-sentence purpose + the business rule(s) it enforces (in the plan checkpoints below).

### 2.1 Model + migration
- [ ] `catalogs.py`: IncomeSource owns `user_id`, `name`, unused `is_active`.
- [ ] Migration 0004: uniqueness is per-user and case-insensitive; no archive filtering.

### 2.2 Service (core business rules)
- [ ] create: normalized trimmed name; duplicate name → `IncomeSourceNameTakenError` (409); DB race → IntegrityError re-mapped.
- [ ] rename: ownership first (404), duplicate excluding self (409).
- [ ] delete: ownership (404), `clear_historical_references`, then delete, commit.
- [ ] `_normalize_name`: empty → 422-style validation error; >100 chars rejected.

### 2.3 Repository
- [ ] Every query is scoped by `user_id` (isolation).
- [ ] `clear_historical_references` is a stub — **flag as known gap** (future `financial_transaction` FK is ON DELETE SET NULL).

### 2.4 Router
- [ ] Four endpoints present; all error paths use `ProblemResponse`.

### 2.5 Frontend
- [ ] Controller: login check before calls; success → reload; failure → diagnostic contract (stable code, no secrets).
- [ ] Selector provider exists (feeds future income-entry forms).
- [ ] Screen: delete requires confirmation dialog.

**STOP GATE 2** — Report: one-sentence summary per file; list any business rule you could NOT find implemented.

## Phase 3 — Verification (evidence, not claims)

- [ ] Backend: `cd finance-ai-backend && uv run pytest tests/unit tests/api tests/property -q` (expect 75+).
- [ ] Backend quality: `uv run ruff format --check . && uv run ruff check . && uv run mypy src` (report any failures without fixing).
- [ ] Migration/seed drift: report `alembic current` vs `heads` (read-only).
- [ ] Frontend: `cd finance-ai-frontend && flutter test` (expect 54+).
- [ ] Frontend analyze: `flutter analyze` (report issues, do not fix).
- [ ] Manual evidence: describe how a human can add/rename/delete an income source (screens + API), and what duplicate-name and cross-user behavior SHOULD look like.

**STOP GATE 3** — Report: exact test counts (never "passed" without the number), lint findings, drift findings.

## Phase 4 — Gap report (propose, do not implement)

Known gaps to confirm and document (no code changes):
- [ ] `PaymentMethod` model still in `catalogs.py` — confirm out of product model per PB-003.
- [ ] `is_active` column still on `IncomeSource` although deletion is permanent.
- [ ] `clear_historical_references` is a stub; no `financial_transaction` table yet (belongs to HU-009/HU-011).
- [ ] No income-entry story implemented yet (HU-009) — income sources only is correct scope for HU-005.
- [ ] `aidlc-docs/construction/hu-005-income-sources/unit-of-work.md` header still "Open · Not started" — flag documentation staleness.

**STOP GATE 4 (final)** — Present:
1. Verified behavior summary (what works).
2. Gap list with severity.
3. Proposed next unit (e.g. HU-006/regular expenses or closing the gaps above).
4. **Wait for the human to decide.** Do not commit, do not mark Trello complete, do not start the next story.
