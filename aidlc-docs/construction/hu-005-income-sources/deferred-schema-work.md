# Deferred Schema Work — NOT part of HU-005

This file records the parts of the new FinanceAI PostgreSQL draft that were **explicitly deferred to
other team members**. HU-005 only changes `income_source`. Do not implement these here.

## Deferred items

| Item | Draft target | Why deferred |
|---|---|---|
| PostgreSQL enums | `account_type`, `transaction_type`, `transaction_status`, `capture_source`, `budget_schedule_type`, `frequency_unit` | Only needed by accounts/transactions/receipts/budgets |
| `account` table | `id, user_id, currency_id, name, type, opening_balance, is_active, timestamps` | HU-003 |
| `payment_method` removal | Drop table + registration seeding + DBeaver view | Belongs with accounts migration |
| `store` table | `id, user_id, name, normalized_name, is_active` | Receipts work |
| `financial_transaction` | `id, user_id, income_source_id, type, status, occurred_at, description, source, timestamps` | HU-006/HU-009/HU-010 |
| `account_movement` | `id, transaction_id, account_id, amount, created_at` | HU-006/HU-009/HU-010 |
| `receipt` | purchase group with optional store/category/currency/image | HU-006/HU-008 |
| `expense` | item rows under a receipt | HU-006/HU-008 |
| `budget` | category budgets with schedule fields | HU-016 |
| `category` changes | `color`, `icon` (draft); future `sort_order`/`parent_id` for HU-004/HU-012/HU-016 | HU-004 |
| Registration defaults | Remove `payment_methods` seeding; decide default account | Accounts work |

## Contract already fixed by HU-005 (for the future transactions unit)

- `financial_transaction.income_source_id` is **optional**, used only when `type = 'income'`.
- FK is **`ON DELETE SET NULL`**; deleting an income source clears the reference and history remains.
- History UI renders *Source deleted* for a null source.

## Source of truth

- New draft: the dbdiagram "Project FinanceAI" schema supplied on 2026-09-12 (non-authoritative draft).
- Actual DB today: Alembic `0001`–`0003` (`currency`, `app_user`, `category`, `payment_method`,
  `income_source`, `user_session`, `renewable_credential`).
- HU-005 adds `0004` (income_source unique index only).
