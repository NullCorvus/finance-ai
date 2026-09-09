# HU-003 Financial Accounts — Business Rules

## Scope

HU-003 delivers owned financial-account management and the internal movement foundation needed to calculate balances. It exposes no expense, income, transfer, receipt, category, budget, or AI write API.

## Account Rules

| ID | Rule | Enforcement |
|---|---|---|
| BR-ACC-001 | Every account belongs to exactly one authenticated user. | Database foreign key plus owner-scoped repository queries |
| BR-ACC-002 | Supported types are `cash`, `bank`, `digital_wallet`, `savings`, `credit_card`, and `other`. Users create account records; account types are not a user-editable catalog. | API enum and database check |
| BR-ACC-003 | Registration creates no financial account automatically. The empty state may offer quick starting suggestions such as Cash, but saving remains an explicit user action. | Service/UI flow |
| BR-ACC-004 | Account names are trimmed, non-empty, at most 100 characters, and unique case-insensitively among the owner's active accounts. | Policy plus partial database unique index |
| BR-ACC-005 | Inactive accounts may share a name with an active account. Reactivation fails safely when its normalized name conflicts with another active account. | Database constraint translated to a safe conflict |
| BR-ACC-006 | Opening balance is a signed decimal with at most two fractional digits. Zero, positive, and negative values are valid within the `NUMERIC(18,2)` boundary. | API validation and database type |
| BR-ACC-007 | Negative balances represent debt or overdraft. For a credit-card account, a more negative derived balance means more is owed; billing-cycle and statement behavior are outside HU-003. | Display/domain convention |
| BR-ACC-008 | Currency must reference an active shared supported currency when an account is created or its currency changes. Initially supported values are COP and USD. | Currency lookup and foreign key |
| BR-ACC-009 | Before confirmed movements exist, name, type, currency, and opening balance are editable. After a confirmed movement exists, currency is immutable; name, type, and opening balance remain editable. | Account service and movement repository |
| BR-ACC-010 | Editing account metadata never edits or deletes financial movements. Changing opening balance intentionally recalculates the derived balance. | Unit of Work and repository boundaries |
| BR-ACC-011 | There is no mutable stored `current_balance`. Derived balance equals opening balance plus the sum of confirmed signed account movements. Pending and voided transactions do not contribute. | Read query and response assembly |
| BR-ACC-012 | Deactivation preserves the account and all history but excludes it from new financial-movement selection. It does not create, modify, or remove a movement. | Status service and later movement services |
| BR-ACC-013 | Reactivation is allowed only while the currency is supported and no active-name conflict exists. Repeating the current status is idempotent. | Status service |
| BR-ACC-014 | Account lists return active accounts by default. `include_inactive=true` adds inactive accounts; owned inactive detail remains readable directly. | List query and UI toggle |
| BR-ACC-015 | Account order is active first, then case-insensitive name, then identifier for deterministic results. | Repository query |
| BR-ACC-016 | Missing and foreign-owned identifiers return the same `account_not_found` response so callers cannot enumerate another user's resources. | Owner-scoped lookup |
| BR-ACC-017 | An owned account may be permanently deleted only when it has no account movements of any status. Opening balance alone does not block deletion. A used account retains history and must use deactivation in HU-003. | Locked owner-scoped service operation plus restrictive movement foreign key |
| BR-ACC-018 | The suggested currency is the currency of the user's most recently created account when that currency remains active; otherwise it is the user's preferred active currency, then COP. A suggestion never changes a saved record. | List response assembly |
| BR-ACC-019 | Currency, opening balance, and derived balance are returned explicitly for every account. Amounts are serialized as fixed decimal strings, never binary floating-point values. | API contract |
| BR-ACC-020 | Account data is server-authoritative and user-scoped, so authenticated Windows and Android sessions see the same records. No financial data is owned by a device or session. | Service/repository ownership |

## Movement Foundation Rules

| ID | Rule | Enforcement |
|---|---|---|
| BR-MOV-001 | A financial transaction belongs to one user and may own one or more account movements. HU-003 exposes no endpoint for creating these records. | Internal persistence boundary |
| BR-MOV-002 | Each account movement references exactly one account and contains a non-zero signed amount in that account's currency. It has no payment-instrument reference. | Database constraints |
| BR-MOV-003 | A transaction may reference only accounts owned by the same user as the transaction. | Composite ownership constraint/repository validation |
| BR-MOV-004 | Only confirmed transactions affect balances. | Balance query |
| BR-MOV-005 | Later expense, income, and transfer services must reject new movements for inactive accounts. HU-003 proves the selection/query contract but does not expose financial writes. | Later service precondition with HU-003 repository support |
| BR-MOV-006 | Multi-row transactions are committed atomically. This supports transfers and split-account payments without adding payment-access-method detail. | Unit of Work |

## Validation and Error Rules

| Condition | HTTP status | Stable code | Safe behavior |
|---|---:|---|---|
| Invalid name, type, amount, query, or request shape | 422 | `request_invalid` | Return bounded field errors without echoing values |
| Unsupported or inactive currency | 422 | `account_currency_invalid` | Identify the field, not entered financial data |
| Active normalized-name conflict | 409 | `account_name_conflict` | Do not include the account name in logs or diagnostics |
| Missing or foreign-owned account | 404 | `account_not_found` | Same response for both cases |
| Currency change after confirmed movements | 409 | `account_currency_locked` | Preserve account and movements unchanged |
| Reactivation precondition failure | 409 | `account_reactivation_conflict` | Preserve inactive state |
| Permanent deletion when any movement exists | 409 | `account_delete_blocked` | Preserve the account and all history; direct the user to deactivation |
| Authentication/session failure | 401 | Existing authentication/session code | Reuse HU-002 behavior |
| Unexpected persistence failure | 500 | `internal_error` | Roll back and correlate safe UI/API diagnostics |

All failure paths preserve the request correlation ID. Logs and copyable reports exclude account names, balances, opening balances, request bodies, SQL, tokens, email addresses, stack traces, and raw exceptions.

## Selected Decisions

- All seven unanswered `[Answer]:` fields use their recommended option A, per the user's fallback instruction.
- Deactivation is retained because it prevents a closed or unused account from receiving new entries without destroying history. Reactivation makes that choice reversible.
- Permanent deletion of an unused account is deliberately distinct from reversible deactivation. Move-history and advanced delete-all workflows are deferred until the public expense, income, transfer, and receipt dependency graph exists.
