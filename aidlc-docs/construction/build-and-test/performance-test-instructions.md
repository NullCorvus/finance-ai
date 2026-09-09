# Finance AI UOW-03 Performance Test Instructions

## Scope

HU-003 performance targets are engineering budgets for the local university prototype, not a public SLA or production capacity guarantee. Tests must use synthetic data in an isolated database.

## Targets

- List/detail: p95 at or below 250 ms and p99 at or below 500 ms.
- Create/edit/status/permitted delete: p95 at or below 500 ms and p99 at or below 1 second.
- Profile: 10 concurrent local clients, up to 100 accounts for one user, with indexed movement history.
- Client: visible progress promptly and no duplicate mutation submission.

## Deterministic Query-Plan Gate

Run the PostgreSQL account integration suite:

```powershell
Set-Location .\finance-ai-backend
$env:FINANCE_AI_TEST_DATABASE_URL = 'postgresql+psycopg://finance_ai@127.0.0.1:55433/finance_ai_test'
uv run pytest tests\integration\test_account_persistence.py -k 'index_backed_plans'
```

This gate seeds the approved personal-account profile and verifies that owner/list and balance aggregation queries use the intended indexes without loading all movements into application memory.

## Local Latency Sample

1. Start a warm API against an isolated migrated database.
2. Register a synthetic user and create 100 synthetic owned accounts.
3. Warm list and detail reads before measurement.
4. Run at least 100 list/detail samples and at least 50 samples for each mutation class, with up to 10 concurrent clients.
5. Use a monotonic timer around the HTTP request and record status, elapsed milliseconds, and operation only. Do not record credentials, email addresses, account names, amounts, bodies, query values, or raw errors.
6. Calculate p95/p99 with nearest-rank percentiles and report the slowest status category separately.
7. Delete all eligible synthetic accounts and discard the isolated database.

## Interpretation

- Pass only when all responses have expected safe statuses and measured percentiles meet the targets on the documented reference stack.
- A query-plan pass does not alone prove latency targets.
- A local latency pass does not establish production throughput, internet latency, availability, autoscaling, RTO, or RPO.
- If a target fails, preserve sanitized timing evidence, inspect query plans and resource saturation, correct the bottleneck, and repeat the same profile.
