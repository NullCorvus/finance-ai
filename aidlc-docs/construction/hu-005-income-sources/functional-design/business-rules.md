# Business Rules — HU-005 Income Sources

| # | Rule | Detail | Acceptance Criteria |
|---|---|---|---|
| BR-1 | Name normalization | `name` is trimmed of surrounding whitespace before validation and persistence | CRUD works with value as typed |
| BR-2 | Name validity | After trimming: required, non-empty, at most 100 characters; otherwise `422 income_source_invalid` | Add / rename |
| BR-3 | Unique names | `lower(trimmed name)` must be unique per user; duplicates -> `409 income_source_name_taken` | Add / rename |
| BR-4 | Name reuse | Deleting a value frees its name for immediate reuse (no archive row) | Permanent delete |
| BR-5 | Ownership | Every read/write is scoped to the authenticated `user_id`; foreign/unknown id -> `404 income_source_not_found` | Another user's data is unaffected |
| BR-6 | Editable defaults | Registration copies `Salary` / `Other` as ordinary editable rows | I receive editable defaults |
| BR-7 | Permanent delete | Delete removes the row; deletion is confirmed in the UI | Add / rename / permanently delete |
| BR-8 | Historical safety | Before deletion, referencing rows have `income_source_id` set to `NULL`; history survives | Deleted values disappear from new forms while history remains |
| BR-9 | Archive flag retained, unused | `income_source.is_active` stays per the draft and is always `true`; deletion is permanent | Permanent delete behavior |
| BR-10 | Atomicity | A failed mutation rolls back and leaves prior state intact | Ownership and rollback tests |
| BR-11 | Error contract | All failures use `ProblemResponse` (code, safe detail, correlation id); no secrets | Error-contract tests |
| BR-12 | Selector refresh | After any mutation, selectors for new-entry forms reflect the change | Deleted values disappear from new forms |
| BR-13 | Privacy | Responses expose only `id` and `name`; never user ids or internal fields | API tests |

## Error Codes

| Condition | Status | Code |
|---|---|---|
| Missing/invalid access credential | 401 | `authentication_required` |
| Unknown or foreign-owned id | 404 | `income_source_not_found` |
| Duplicate name for the user | 409 | `income_source_name_taken` |
| Name fails validation | 422 | `income_source_invalid` |
| Unexpected failure | 500 | `internal_error` |
