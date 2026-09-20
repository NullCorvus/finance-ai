# Unit Test Instructions — HU-005

## Backend
```bash
cd finance-ai-backend
uv run ruff format --check .
uv run ruff check .
uv run mypy src
uv run pytest tests/unit tests/api tests/property -q
```

HU-005 unit/API/property tests:
- `tests/unit/test_income_source_service.py`
- `tests/api/test_income_sources_api.py`
- `tests/property/test_income_source_name_properties.py`

Expected: `75 passed` (without DB).

## Frontend
```bash
cd finance-ai-frontend
dart format --set-exit-if-changed lib test
flutter analyze
flutter test
```

HU-005 widget/repository/controller tests:
- `test/features/income_sources/income_sources_controller_test.dart`
- `test/features/income_sources/income_sources_screen_test.dart`
- `test/features/income_sources/income_sources_repository_test.dart`

Expected: `All tests passed!`.
