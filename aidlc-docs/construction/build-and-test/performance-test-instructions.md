# Performance Test Instructions — HU-005

HU-005 is a small catalog CRUD unit (max ~100 chars per name, per-user scoping), so formal load
testing is not required for this story.

Optional smoke checks:
- `GET /api/v1/income-sources` returns a single indexed query on `(user_id, lower(name))`.
- The unique index `uq_income_source_user_name` supports both ordering and duplicate detection.

Record any future performance work with the transactions/history story once volumes grow.
