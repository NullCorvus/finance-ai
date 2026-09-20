# Domain Entities — HU-005 Income Sources

## Entity: IncomeSource

| Field | Type | Nullable | Notes |
|---|---|---|---|
| `id` | `bigint` | no | PK, identity |
| `user_id` | `bigint` | no | FK -> `app_user.id`, `ON DELETE CASCADE` |
| `name` | `varchar(100)` | no | Display value, trimmed on write |
| `is_active` | `boolean` | no | Retained per draft; reserved and always `true` |
| `created_at` | `timestamptz` | no | server default `now()` |
| `updated_at` | `timestamptz` | no | server default `now()`, on update `now()` |

## Invariants

- `lower(btrim(name))` is unique within a single `user_id`.
- `name` is non-empty after trimming and at most 100 characters.
- A row belongs to exactly one user; there is no shared/global income source.
- `is_active` is retained per the draft but is unused and always `true`; deletion is permanent, so presence means usable.

## Model Shape (`db/models/catalogs.py`)

No mixin split is needed: `IncomeSource` keeps `OwnedCatalogMixin` (which already provides
`id`, `user_id`, `name`, `is_active`, `created_at`, `updated_at`).

- `Category` / `PaymentMethod` keep their partial unique indexes unchanged.
- `IncomeSource` replaces the partial index with a full unique index `uq_income_source_user_name`
  on `(user_id, lower(name))`. Permanent delete makes the full unique index safe (names are reusable).

## Relationships

- `app_user (1) -> (N) income_source`, cascade on user deletion.
- Future `financial_transaction.income_source_id -> income_source.id`, optional, `ON DELETE SET NULL`.
  Used only when the transaction type is `income`.

## Domain Concept: Missing Optional Source

A historical income transaction keeps working with a null source. The presentation layer renders
*Source deleted* for that case; the API returns a null/absent source and never invents a name.
