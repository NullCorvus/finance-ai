# HU-003 Financial Accounts — Domain Entities

## Account Aggregate

### Account

| Field | Type | Rule |
|---|---|---|
| id | 64-bit identifier | Server-generated |
| user_id | 64-bit identifier | Required owner; never accepted from the client body |
| name | String, 1–100 | Trimmed display value; active uniqueness is case-insensitive per owner |
| type | AccountType | Controlled value |
| currency_id | Currency reference | Required and explicit |
| opening_balance | Decimal(18,2) | Signed and bounded |
| is_active | Boolean | Defaults true |
| created_at | UTC timestamp | Server-generated |
| updated_at | UTC timestamp | Server-managed |

`current_balance` is not a column. It is an account-read value calculated from opening balance and confirmed movements.

### AccountType

`cash`, `bank`, `digital_wallet`, `savings`, `credit_card`, or `other`.

### CurrencySummary

Contains `id`, `code`, `name`, and `decimals`. Only active shared currencies appear as create/edit options. Existing accounts continue displaying their currency even if the catalog entry later becomes inactive.

### AccountMovement Foundation

| Field | Type | Rule |
|---|---|---|
| id | 64-bit identifier | Server-generated |
| transaction_id | FinancialTransaction reference | Required |
| account_id | Account reference | Required |
| amount | Decimal(18,2) | Signed and non-zero in account currency |
| created_at | UTC timestamp | Server-generated |

FinancialTransaction supplies owner, type, status, occurrence time, description, capture source, and timestamps. These entities are internal foundations in HU-003; no movement-write API is exposed until later stories.

## API Contract Types

### AccountCreateCommand

`name`, `type`, `currency_code`, and `opening_balance`.

### AccountUpdateCommand

Optional `name`, `type`, `currency_code`, and `opening_balance`, with at least one supplied field. `is_active` is excluded so lifecycle changes cannot be hidden inside an ordinary metadata edit.

### AccountStatusCommand

Contains the target `is_active` Boolean.

### AccountView

Contains `id`, `name`, `type`, nested currency summary, `opening_balance`, derived `balance`, `is_active`, `created_at`, and `updated_at`. Monetary values use fixed decimal strings.

### AccountListResult

Contains:

- `accounts`: deterministically ordered AccountView values.
- `suggested_currency_code`: last-created-account currency with preferred-currency/COP fallback.
- `supported_currencies`: active shared CurrencySummary values.
- `account_types`: the controlled AccountType values.

This single read contract supports the list and create/edit form without a second preferences record.

## Service and Repository Interfaces

| Interface | Purpose |
|---|---|
| AccountService.create(owner_id, command) | Validate and atomically create an active account |
| AccountService.list(owner_id, include_inactive) | Return owned accounts, balances, form options, and suggestion |
| AccountService.get(owner_id, account_id) | Return one owned active or inactive account |
| AccountService.update(owner_id, account_id, command) | Update allowed metadata while preserving history |
| AccountService.set_active(owner_id, account_id, is_active) | Idempotently deactivate or conditionally reactivate |
| AccountService.delete(owner_id, account_id) | Permanently delete an owned account only when no movements exist |
| AccountPolicy.normalize_name(name) | Trim and validate bounded account names |
| AccountPolicy.validate_opening_balance(value) | Enforce decimal precision and range |
| AccountRepository.find_owned(owner_id, account_id) | Owner-scoped lookup |
| AccountRepository.list_owned(owner_id, include_inactive) | Deterministic owner-scoped list |
| AccountRepository.active_name_exists(owner_id, normalized_name, excluding_id) | Friendly conflict pre-check |
| AccountRepository.has_confirmed_movements(owner_id, account_id) | Protect currency after activity |
| AccountRepository.has_movements(owner_id, account_id) | Protect all historical activity from ordinary deletion |
| AccountRepository.delete(owner_id, account_id) | Stage deletion after the owner row is locked and preconditions pass |
| AccountRepository.derived_balance(owner_id, account_id) | Opening balance plus confirmed movements |
| CurrencyRepository.list_active() | Supported form choices |
| CurrencyRepository.find_active_by_code(code) | Validate an explicit selection |
| CurrencyRepository.suggestion_for(owner_id) | Last-created/preferred/COP fallback |

Repository methods stage or read data but never commit. AccountService owns a Unit of Work for create, edit, and lifecycle mutations.

## Database Integrity Direction

- Account has a foreign key to its owner with cascade on user deletion and a restricted currency foreign key.
- `(id, user_id)` is unique to support composite ownership references from movement records.
- A partial unique index enforces `(user_id, lower(name))` only where `is_active = true`.
- Stored name equals its trimmed representation.
- Movement amount is non-zero.
- Composite references prevent a transaction owned by one user from pointing at another user's account.
- PostgreSQL `NUMERIC(18,2)` is authoritative; API and Flutter avoid binary floating-point arithmetic.

## Lifecycle

```text
Created active -> Metadata edited -> Deactivated -> Reactivated
      |                  |                |
      +------------------+----------------+-> History remains owned and readable
      |
      +-> Permanently deleted only while no movement has ever existed
```

Permanent deletion removes an unused account rather than creating another lifecycle state. Once any movement exists, HU-003 preserves the account and uses reversible deactivation. Later history-migration and delete-all workflows require the full transaction/receipt design.
