# HU-015 PR #24 Follow-up — Receipt Item Editing (Finding #2, Option B)

**Decision (user, 2026-09-28)**: implement real receipt-item editing across app + API instead of the
read-only interim.
**Frontend driver**: Codex P1 on PR #24 - the "Productos del recibo" editor in the expense form
(`expense_form_screen.dart:700-790`) changes only local state; `_submit` sends an
`ExpenseUpdateCommand` with no items, and `PATCH /api/v1/expenses/{id}` accepts no item field
(`ExpenseUpdateRequest` in `expenses/schemas.py:133-146`), so products silently revert while the
total changes.

## Verified storage model (drives the design)

| Fact | Evidence |
|---|---|
| A receipt's "items" are rows in the **`expense` table sharing one `receipt_id`**, ordered by `position`; the API expense id is the row the client holds | `db/models/receipts.py:75-118`, `db/repositories/expenses.py:638-660` |
| `UNIQUE (receipt_id, position)` + `CHECK amount > 0`, `position > 0`, `quantity > 0` | `db/models/receipts.py:78-85` |
| Confirmation creates 1 transaction + 1 movement + 1 receipt + N expense rows; with no AI items it creates a **fallback row** named after the merchant | `db/repositories/expenses.py:254-291` |
| **The official total is already derived from the rows**: after an update the repository computes `receipt.total = SUM(expense.amount)` and sets the movement to `-total` | `db/repositories/expenses.py:393-413` |
| Only `confirmed` expenses are editable | `expenses/service.py:378-383` (existing gate) |
| **No schema migration is required** - storage, `ExpenseItemResponse` and the detail rendering already exist | `expenses/schemas.py:216-276`, `expense_detail_screen.dart:346-375` |
| The product UI itself is new in this PR (not on `develop`) | `git show origin/develop:.../expense_form_screen.dart` has no item section |

## Proposed API contract (one decision needed)

Extend the existing update endpoint; **no new route**:

```
PATCH /api/v1/expenses/{expense_id}
{
  "amount": "40000.00",                                   # unchanged semantics
  "items": [                                              # full replacement when present
    {"name": "Bloqueador Solar", "total_price": "40000.00", "quantity": "1",
     "unit_price": "40000.00", "category_id": 3, "note": null}
  ]
}
```

- `items` absent/`null` -> items untouched (backwards compatible with every existing client).
- `items: []` -> one fallback row named after the receipt, mirroring the confirmation fallback, so a
  receipt always keeps at least one line and the expense degrades to a plain expense.
- Item fields reuse the **confirmation schema** (`ConfirmedReceiptItem`: name <=200 trimmed
  non-empty, `total_price` > 0, `quantity` > 0 default 1, `unit_price` >= 0 optional, `category_id`
  >= 1 optional and ownership-checked, `note` <=500) so capture-time and post-hoc editing share one
  contract.
- **Decision A (recommended)**: when `items` is present the line sum defines the official total, which
  is what the repository already does (`SUM(expense.amount)` -> `receipt.total` -> movement). The app
  already derives the displayed total from the items, so nothing changes conceptually.
- **Decision B (alternative)**: keep the client `amount` authoritative and store items verbatim
  (allows a total that does not match the lines, e.g. tips/rounding). Requires an explicit
  precedence rule and the app must stop auto-deriving the total.
- Item row **ids and the primary id stay stable**: rows 1..min(N,M) are updated in place, surplus rows
  deleted, extras inserted, then positions renumbered 1..M. Renumbering writes through temporary
  positions (>1000) to respect `UNIQUE (receipt_id, position)`.

## Work plan

### Step 1 - Backend: schemas and command
- [x] `expenses/schemas.py`: `ExpenseItemUpdateRequest` (same limits as `ConfirmedReceiptItem`) and
      `items: list[ExpenseItemUpdateRequest] | None` on `ExpenseUpdateRequest`
- [x] `expenses/schemas.py`: `ExpenseUpdateCommand.items`; `to_command()` adds `items` to `fields`
      only when a list is supplied (explicit `null` leaves the lines untouched) and an
      items-only `null` payload is rejected as `request_invalid`
- [x] Validation: per-item bounds (pydantic) and item `category_id` ownership (service)

### Step 2 - Backend: repository replace + service wiring
- [x] `expenses/repositories.py`: `ExpenseItemInput` + `replace_items(*, owner_id, expense_id, items,
      fallback_amount)` on the port
- [x] `db/repositories/expenses.py`: in-place replacement (kept rows keep their ids, temporary
      positions then renumber 1..M, surplus deleted, extras inserted) followed by the existing
      `SUM(Expense.amount) -> receipt.total -> movement` recomputation
- [x] `expenses/service.py`: routes `items` through `update()` and keeps `_require_editable`;
      a submitted item list defines the total, so a submitted `amount` is not applied separately
- [x] Empty list -> single fallback row named after the store, mirroring confirmation

### Step 3 - Backend: tests and contract
- [x] Unit (SQLite): rewrite + total/movement sync, grow + renumber, collapse to the fallback row,
      and a foreign owner leaving the lines untouched; non-editable status stays covered by the
      existing integration test
- [x] API contract: items parse (money accepts strings, names trimmed, `note: ""` -> null), invalid
      lines rejected with `request_invalid`, null items untouched
- [x] Integration (PostgreSQL): end-to-end replace (response + rows + positions + receipt total +
      movement), collapse with an explicit amount, foreign-category rejection with rollback
- [x] `alembic check`: "No new upgrade operations detected" - no migration, as predicted
- [x] `openapi.json` regenerated: +103 lines, additive only (`ExpenseItemUpdateRequest` + `items`)
- [x] `ruff format`/`ruff check`/`mypy src` clean; full `pytest --cov` -> 300 passed, 87%


### Step 4 - Frontend: send the items
- [x] `expenses/domain/expense_models.dart`: `ExpenseItemUpdateCommand` + optional `items` on
      `ExpenseUpdateCommand.toJson()` (omitted when not supplied)
- [x] `_LineItemDraft` carries `categoryId`/`note` pass-through (loaded from `editExpense.items`, and
      preserved when the edit dialog rewrites a line); `ExpenseItem` now parses `category.id`
- [x] `expenses/application/expenses_controller.dart`: `items` validation + pass-through
- [x] `expense_form_screen.dart`: submits the receipt line list on save (never for plain expenses)

### Step 5 - Frontend: tests and verification
- [x] Model: money as exact 2-decimal strings, `items` omitted unless supplied, category id parsed
- [x] Controller: pass-through payload + invalid line rejected before any API call
- [x] Widget: receipt edit (delete one product, rename the other) asserts the submitted lines,
      category and total; plain expense asserts no line list is sent
- [x] `flutter analyze` clean; `flutter test test/features/expenses` 53 passed; full suite 256 passed
- [x] Line coverage **80.08%** (gate 80%, up from 78.49%); touched files formatted

### Step 6 - Sequencing, docs and audit
- [x] Backend on `feat/hu-015-expense-items-editing`, stacked on the HU-015 backend branch
- [x] Frontend wired on the PR #24 branch (`2f2b39d`); merge the backend PR first
- [x] Plan checkboxes, `audit.md` entries, `aidlc-state.md` updated

## Branch decision (corrected during implementation)

The plan said "new branch off `origin/develop`". Verification showed `develop` has **none** of the
HU-015 receipt backend - no `create_from_receipt_proposal`, no `ExpenseItemResponse`, no `items`
concept at all - so the work was branched off the HU-015 backend feature branch instead and the PR is
stacked (base = `feat/hu-015-ai-receipt-photo-capture`). Retarget it to `develop` after PR #19 lands.

## Verification log

| Command | Result |
|---|---|
| `uv run pytest tests/unit/test_expense_repository_adapter.py` | 5 passed |
| `uv run pytest tests/api/test_expense_history_api.py` | 9 passed |
| `uv run pytest tests/integration/test_expense_history_persistence.py` (PG 18) | 5 passed |
| `uv run pytest tests --cov=finance_ai` | **300 passed, 87%** |
| `uv run ruff format --check` / `ruff check` / `mypy src` | clean |
| `uv run alembic upgrade head` + `alembic check` (throwaway finance_ai_test) | no new upgrade operations |
| `uv run python scripts/export_openapi.py` | +103 lines, additive |
| `flutter analyze --no-pub` | No issues found |
| `flutter test --no-pub --coverage` | **256 passed, 80.08%** |
| `dart format --output=none --set-exit-if-changed lib test integration_test` | 7 files still unformatted (was 12) |

## Open items

1. **Deployment order**: the frontend sends `items`; a backend without this change rejects the field
   (`extra="forbid"`) with `request_invalid`, so the backend PR must merge/ship first.
2. **Adjacent quirk found while implementing** (not changed): patching only `amount` on a multi-line
   receipt sets row 1 to that amount and then recomputes the total as `row1 + other rows`
   (`db/repositories/expenses.py` update path). With `items` in play the client always sends the lines,
   so this path is only reachable by a future client that sends `amount` alone; worth a small guard.
3. Frontend format gate still fails on 7 files (was 12) and PR #24 remains unmergeable until that
   single `dart format` run lands.

## Risks / notes

- Money path: the replacement runs inside the existing unit of work, and a partial failure cannot leave
  the receipt with zero rows or duplicated positions (verified by the constraint-crossing grow/shrink
  tests).
- Non-breaking: `items` is optional, every existing client keeps working.
- Definition of done for the user-visible bug: edit a product in "Editar recibo", save, reopen -> the
  edited products are still there and the total matches them.

