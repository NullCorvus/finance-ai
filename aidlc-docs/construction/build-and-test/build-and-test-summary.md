# Build and Test Summary — HU-005 Income Sources

**Unit**: `hu-005-income-sources` · **Date**: 2026-09-12 · **Status**: Passed

## Backend
| Check | Command | Result |
|---|---|---|
| Format | `uv run ruff format --check .` | Passed |
| Lint | `uv run ruff check .` | Passed |
| Types | `uv run mypy src` | Passed (50 files) |
| Migration SQL | `alembic upgrade head --sql` / downgrade | Correct (drop partial index, create full unique) |
| Unit/API/Property | `uv run pytest tests/unit tests/api tests/property -q` | 75 passed |
| Full suite + integration | `docker compose --profile test run --build --rm test pytest --cov ...` | 100 passed, 89.60% coverage |
| Dependency audit | `uv run pip-audit` | No known vulnerabilities |

## Frontend
| Check | Command | Result |
|---|---|---|
| Format | `dart format lib test` | Applied |
| Analyze | `flutter analyze` | No issues found |
| Tests | `flutter test` | 53 passed (+1 desktop regression) |

## UI fix (manual testing)
- Blank Income Sources screen traced to `BoxConstraints forces an infinite width` on the Add
  `FilledButton`: `AppTheme.light()` forces `minimumSize: Size.fromHeight(52)` (infinite width), which
  is invalid inside a `Row`. Fixed with bounded `minimumSize: Size(64, 52)` on the Add button and the
  Rename/Delete dialog buttons. Regression test added under the real theme at desktop size.
- `flutter test` now reports **54 passed**; `flutter analyze` clean.

## Contract
- `openapi.json` regenerated; +489 lines for `/api/v1/income-sources` paths and the
  `IncomeSource*` / `CreateIncomeSourceRequest` / `RenameIncomeSourceRequest` schemas.

## Acceptance Criteria
- [x] Editable income-source defaults (`Salary`, `Other` seeded at registration)
- [x] Add, rename and permanently delete own values
- [x] Deleted values leave new forms; permanent delete frees the name (history rendering is future work)
- [x] Another user's catalog is unaffected (ownership scoping + cross-user isolation test)

## Incidental cleanup (not HU-005 scope)
- Removed the default Flutter counter test `test/widget_test.dart`, which referenced a non-existent
  `MyApp` class and broke `flutter analyze`.
- Noted a pre-existing flaky property test
  `tests/property/test_registration_properties.py::test_public_response_can_never_echo_the_supplied_password`
  (asserts a raw-substring match; e.g. password `currency` collides with `preferred_currency`).
  It passes on most seeds; recommended a future fix to compare parsed values instead of raw JSON.

## Deferred (other team members)
- Full new-schema migration (enums, accounts, `payment_method` removal, transactions, receipts,
  expenses, budgets). See `../hu-005-income-sources/deferred-schema-work.md`.
