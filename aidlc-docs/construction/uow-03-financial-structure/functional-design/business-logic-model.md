# HU-003 Financial Accounts — Business Logic Model

## Create Account

1. Require a valid HU-002 bearer session and obtain the owner ID server-side.
2. Validate and normalize name, type, explicit currency code, and signed opening balance.
3. Open the Account Unit of Work.
4. Resolve an active shared currency by code.
5. Check for an active case-insensitive name conflict for fast feedback.
6. Stage the owned active account and flush so database constraints arbitrate concurrent requests.
7. Translate only the known active-name constraint to `account_name_conflict`; roll back every failure.
8. Commit once and return AccountView with derived balance equal to opening balance.

No default account is silently created during registration. The empty UI may prefill a suggested type/name, but the user explicitly saves it.

## List Accounts and Form Options

1. Authenticate and parse the bounded `include_inactive` Boolean, default false.
2. Query only the authenticated owner's accounts.
3. Calculate each balance from opening balance plus confirmed movements.
4. Order active first, then normalized name and identifier.
5. Resolve active supported currencies and the most-recent-account/preferred/COP suggestion.
6. Return accounts plus account types, currencies, and suggested currency in one response.

The same server data is returned to authenticated Android and Windows sessions; device identity never scopes financial records.

## Get Account Detail

1. Authenticate and validate the identifier shape.
2. Query by both owner ID and account ID.
3. Return the same `account_not_found` for missing and foreign-owned rows.
4. Calculate and return the derived balance; inactive accounts remain readable.

## Edit Account

1. Reject an empty patch and validate every supplied field.
2. Open a Unit of Work and lock or otherwise protect the owned row against concurrent mutation.
3. If name changes, enforce active normalized-name uniqueness.
4. If currency changes, require an active supported currency and reject the change when a confirmed movement exists.
5. Apply name, type, opening-balance, and permitted currency changes without touching movements.
6. Flush, translate known constraint conflicts, commit once, and return the recalculated AccountView.

Changing opening balance is a correction to the account starting point, so the resulting derived balance may change. It does not rewrite transaction history.

## Deactivate or Reactivate

1. Authenticate and load the owned account.
2. If requested status equals current status, return the current AccountView without a second semantic change.
3. Deactivation sets `is_active=false`; no movement or history row changes.
4. Reactivation verifies that the currency is supported and the normalized name does not conflict with an active account.
5. Commit atomically and return the updated AccountView.

Later financial-write services must use an active-owned-account lookup. This prevents a closed bank account or unused wallet from receiving new entries while retaining historical accuracy.

## Permanently Delete an Unused Account

1. Authenticate and load the owned account under a row lock; missing and foreign identifiers share `account_not_found`.
2. Check for account movements of every status. Opening balance alone is metadata and does not block deletion.
3. When any movement exists, preserve the account and history, return `account_delete_blocked`, and direct the user to deactivation.
4. Otherwise stage the account delete, flush, and commit once.
5. Keep the account-movement foreign key restrictive so a concurrent movement insert prevents deletion rather than cascading or orphaning history.
6. Translate only that named foreign-key race to `account_delete_blocked`; roll back all failures.

Move-history and advanced delete-all workflows remain deferred until later transaction and receipt stories define the complete dependency graph.

## Balance Calculation

```text
derived balance = opening balance
                + sum(confirmed signed account movements)
```

Examples:

- Cash opening at COP 100,000 with a confirmed -20,000 expense returns COP 80,000.
- Credit card opening at COP -300,000 with a confirmed -50,000 purchase returns COP -350,000.
- Pending and voided movements contribute zero.
- Unlike currencies are never combined because each movement uses its referenced account's currency.

HU-003 creates the internal movement persistence and read contract but no movement-write route. Later expense, income, and transfer stories own those writes.

## Currency Suggestion

The suggestion algorithm is deterministic:

1. Use the currency of the user's most recently created account when that currency is active.
2. Otherwise use the user's active preferred currency.
3. Otherwise use active COP.
4. If no fallback currency is configured, fail with the existing safe service-unavailable behavior.

The suggested value is only a form default. Create and edit commands must still submit and persist an explicit currency.

## Concurrency and Failure Behavior

- Database uniqueness wins concurrent same-name creates/reactivations; the losing transaction rolls back.
- Owner-scoped queries and composite constraints prevent IDOR and cross-user movement references.
- Mutations commit exactly once or roll back completely.
- Expected errors map to stable safe problems; unexpected failures use the shared global handler and correlation ID.
- Account names, amounts, email addresses, credentials, request bodies, SQL, and raw exceptions do not enter logs or copyable diagnostics.

## HTTP Boundary

| Method and path | Purpose | Success |
|---|---|---:|
| `POST /api/v1/accounts` | Create an account | 201 |
| `GET /api/v1/accounts?include_inactive=false` | List accounts plus form options and suggestion | 200 |
| `GET /api/v1/accounts/{account_id}` | Read owned active/inactive detail | 200 |
| `PATCH /api/v1/accounts/{account_id}` | Edit account metadata | 200 |
| `PATCH /api/v1/accounts/{account_id}/status` | Deactivate/reactivate | 200 |
| `DELETE /api/v1/accounts/{account_id}` | Permanently delete an unused account | 204 |

There is no public transaction or movement-write route in HU-003.
