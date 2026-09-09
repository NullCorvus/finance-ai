# Finance AI UOW-03 Unit Test Instructions

## Backend Unit, Property, and API Tests

Restore locked dependencies and run the complete suite with coverage:

```powershell
Set-Location .\finance-ai-backend
uv sync --all-groups --frozen
uv run pytest --cov=finance_ai --cov-report=term-missing
```

For a fast non-PostgreSQL diagnostic pass:

```powershell
uv run pytest tests\unit tests\property tests\api tests\test_logging_safety.py tests\test_observability.py
```

Coverage must remain at least 80%. Hypothesis failures must retain their reproducible seed/minimized counterexample. The account suites cover:

- name normalization and active-name conflicts;
- exact decimal boundaries and serialization;
- derived-balance and currency-lock rules;
- lifecycle idempotency and inactive-account behavior;
- ownership isolation and identical foreign/missing results;
- permanent deletion if and only if no movement exists;
- stable safe errors, correlation IDs, request bounds, and diagnostic privacy.

## Flutter Shared Tests

Use the checked-in helper so locked dependencies, formatting, analysis, tests, and coverage use the same workspace handling:

```powershell
Set-Location .\finance-ai-frontend
.\tool\verify_shared.ps1
```

The shared tests include domain parsing, HTTP repository behavior, authentication refresh, controller state, forms, routing, confirmations, copyable diagnostics, and account deletion success/blocked/uncertain outcomes. Coverage is written to `finance-ai-frontend/coverage/lcov.info` and must remain at least 80%.

## Reviewing Failures

1. Read the first failing assertion and its stable test name.
2. Confirm the failure is reproducible with the locked dependencies.
3. Fix the responsible implementation or contract, not the expected value merely to silence the test.
4. Rerun the focused suite, then rerun the complete repository gate.
5. Confirm failure output contains no credentials, email addresses, account names, balances, request bodies, SQL, or raw exceptions.
