# Database Schema — Finance AI

## Authority

The executable database is defined by SQLAlchemy models and Alembic migrations in `finance-ai-backend`. The future-oriented diagram draft is [`finance-ai-draft.dbml`](finance-ai-draft.dbml), which can be pasted directly into dbdiagram.io. This document explains the agreed direction without creating a second executable schema.

## Current Decisions

- `account` represents where money is held: cash, bank, digital wallet, savings, credit card, or another account type.
- `account_movement` references an account directly. There is no payment-instrument or payment-method layer.
- There is one category level. Subcategories are intentionally deferred.
- There is no product table. Expense rows retain their own names and prices.
- A receipt is a simple purchase group, not merely an uploaded image.
- Every expense belongs to a receipt. A lone purchase has one receipt and one expense row; a mixed receipt has multiple expense rows.
- Receipt and expense images are optional backend-managed paths. Image binaries are not stored in PostgreSQL.
- Income-specific `income_source_id` lives directly on `financial_transaction`; there is no separate income-detail table.
- Budget schedules support recurring intervals and one-time/custom ranges.

## Core Model

| Entity | Purpose |
|---|---|
| `currency` | Shared supported currency reference such as COP and USD |
| `app_user` | Identity owner; credentials remain hash-only in the implemented schema |
| `user_session`, `renewable_credential` | Independent phone/computer sessions and renewable credential rotation |
| `account` | User-owned money location with explicit currency and opening balance |
| `financial_transaction` | Common owned history event for expense, income, transfer, or adjustment |
| `account_movement` | Signed amount entering or leaving one account |
| `category` | User-owned single-level expense classification |
| `store` | Optional normalized store name for purchase grouping and later analytics |
| `income_source` | Optional owned classification used only by income transactions |
| `receipt` | Purchase name, date, currency, total, optional store/category/note/image |
| `expense` | One item/expense inside a receipt, with its own name, category, quantity, prices, note, and optional image |
| `budget` | Overall or category target with a recurring or one-time schedule |

## Relationships and Movement Rules

- A user owns accounts, categories, stores, income sources, transactions, and budgets.
- An expense transaction normally has one negative account movement.
- An income transaction normally has one positive account movement.
- A transfer has at least one negative source movement and one positive destination movement.
- One expense transaction has one receipt; one receipt contains one or more expenses.
- Deleting an account is allowed only before it has movements. Otherwise it is deactivated so history remains valid.
- Inactive accounts remain visible in history but cannot receive new movements.
- Deleting a category sets historical optional references to null and removes dependent category budgets atomically.

## Balance and Budget Calculations

Account balance is derived as:

```text
opening_balance + sum(confirmed account_movement.amount)
```

Budget progress is derived from qualifying confirmed expenses. It is not stored as a second source of truth. Totals in different currencies are never silently combined.

## Budget Schedule

`schedule_type` distinguishes recurring and one-time budgets.

- Recurring budgets require `frequency_unit` (`day`, `week`, `month`, or `year`) and a positive `frequency_interval`.
- Examples include every day, every week, every 2 weeks, every 3 months, or every year.
- One-time budgets omit frequency fields and use `starts_on` plus optional `ends_on`.

## Explicitly Deferred

- Subcategories
- Payment instruments or payment access methods such as physical card, virtual card, QR, or PSE
- Product matching and product-level price history
- A generalized attachment/media subsystem
- Automatic exchange-rate conversion

These can be added later through migrations if an approved user story justifies the additional complexity.

Backend migration `0005_drop_payment_method` retires the unused catalog without rewriting the original migration history. Current models, registration defaults, account movements, and read-only views contain no payment-method layer.
