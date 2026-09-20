> **Note:** This file is the consolidated overview. The normative AI-DLC artifacts for this stage are
> `domain-entities.md`, `business-rules.md`, `business-logic-model.md` and `frontend-components.md`
> in the same folder.


# Functional Design — HU-005 · Manage Income Sources

**Unit**: `hu-005-income-sources` · **Backlog**: PB-003 / HU-005 · **Points**: 2

## 1. Purpose

Define the owned Income Source catalog: create, list, rename and permanently delete the current
user's values, backed by editable `Salary` / `Other` defaults, with trimmed case-insensitive unique
names and permanent deletion that clears future optional historical references.

## 2. Data Model

Target table:

| Column | Type | Rules |
|---|---|---|
| `id` | `bigint` | PK, identity |
| `user_id` | `bigint` | NOT NULL, FK `app_user.id` ON DELETE CASCADE |
| `name` | `varchar(100)` | NOT NULL |
| `created_at` | `timestamptz` | NOT NULL, server default now |
| `updated_at` | `timestamptz` | NOT NULL, server default now, on update now |

- Unique index `uq_income_source_user_name` on `(user_id, lower(name))` — full, not partial.
- `is_active` is retained per the draft but unused (always `true`); deletion is permanent.

### SQLAlchemy model shape

No mixin split: `IncomeSource` keeps `OwnedCatalogMixin` and therefore keeps `is_active`.
Only its unique index changes to a full unique index `(user_id, lower(name))`. Existing partial
indexes for `category` / `payment_method` stay unchanged.

## 3. Validation Rules

- `name` is trimmed of leading/trailing whitespace (including Unicode whitespace).
- After trimming: required, non-empty, at most 100 characters.
- Uniqueness is per user and case-insensitive: `lower(trimmed_name)` must be unique among that
  user's rows. Two names that differ only by case or surrounding spaces are duplicates.
- A deleted name becomes reusable immediately (no archive row blocks it).
- Invalid name -> `422 income_source_invalid` with field error for `name`.

## 4. Service Operations

| Operation | Behavior |
|---|---|
| `list(user_id)` | All rows for the user, ordered by `lower(name)` ascending |
| `create(user_id, name)` | Validate -> insert -> return `(id, name)` |
| `rename(user_id, income_source_id, name)` | Validate ownership -> validate name -> update -> return `(id, name)` |
| `delete(user_id, income_source_id)` | Validate ownership -> clear historical references -> delete row |

- The service owns the transaction and commits; repositories stage only.
- A missing or foreign-owned id -> `404 income_source_not_found` (never reveal foreign existence).
- A duplicate name -> `409 income_source_name_taken` (mapped from the unique-index `IntegrityError`).
- Any failure rolls back and leaves prior state intact.

## 5. Ownership

- Every query includes `WHERE user_id = :current_user_id`.
- `user_id` comes from `SessionService.current_user(access_credential).user_id`.
- Foreign-owned ids return `404`, never `403`, to avoid leaking existence.

## 6. Deletion and Historical References

Contract for the future `financial_transaction.income_source_id` (null unless type is income):

1. Within one transaction, `UPDATE` each referencing table `SET income_source_id = NULL
   WHERE income_source_id = :id AND user_id = :user_id`.
2. Then `DELETE` the income source row.
3. History rows survive; the UI renders *Source deleted* when an income transaction has a null source.

Today `financial_transaction` does not exist, so step 1 is a documented no-op guard implemented in
the repository; the future table's FK is `ON DELETE SET NULL`.

## 7. Registration Defaults

- `RegistrationCatalogTemplate.income_sources = ("Salary", "Other")` remains the source of truth.
- Defaults are inserted as ordinary editable rows (no archive flag) at registration.
- Users may rename or permanently delete them like any other value.

## 8. Error Mapping

| Condition | Status | Code |
|---|---|---|
| Missing/invalid access credential | 401 | `authentication_required` |
| Unknown or foreign-owned id | 404 | `income_source_not_found` |
| Duplicate name for the user | 409 | `income_source_name_taken` |
| Name fails validation | 422 | `income_source_invalid` |
| Unexpected failure | 500 | `internal_error` |

All errors use the shared `ProblemResponse` shape with a correlation ID and no sensitive values.

## 9. API Contract (sketch)

| Method | Path | Request | Success |
|---|---|---|---|
| GET | `/api/v1/income-sources` | — | 200 `{ "items": [{ "id", "name" }] }` |
| POST | `/api/v1/income-sources` | `{ "name": "..." }` | 201 `{ "id", "name" }` |
| PATCH | `/api/v1/income-sources/{id}` | `{ "name": "..." }` | 200 `{ "id", "name" }` |
| DELETE | `/api/v1/income-sources/{id}` | — | 204 |

All routes require `Authorization: Bearer <access_credential>`. Responses expose only `id` and `name`.

## 10. Resolved Questions

- **Archive flag conflict:** the draft keeps `income_source.is_active`; it is retained but unused, and
  HU-005 uses permanent delete (D3 amended / D11).
- **Full schema migration:** deferred; only `income_source` changes in this unit (D10).
- **Uniqueness scope:** per user, case-insensitive, after trimming (D4).
- **Frontend scope:** simple testing-grade screen; no mockup work (D8).
