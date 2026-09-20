# Unit of Work — HU-006 · Manual Expense Capture

| Field | Value |
|---|---|
| **Backlog item** | PB-004 · HU-006 |
| **Story points** | 5 |
| **Branch (Backend)** | `feat/hu-006-manual-expense` |
| **Branch (Frontend)** | `feat/hu-006-manual-expense` |
| **Repos** | `finance-ai-backend` (FastAPI), `finance-ai-frontend` (Flutter) |
| **Database target** | PostgreSQL (`financial_transaction`, `account_movement`, `receipt`, `expense`, `store`) |
| **Status** | Completed · All Steps 1–7 Verified |
| **AI-DLC unit name** | `hu-006-manual-expense` |

---

## 1. User Story

> **As a user**, I want to record an expense with only essential information so that manual capture remains fast without AI or a receipt.

---

## 2. Sprint Objective

Deliver manual expense creation end-to-end (API + UI):
1. **Backend**: Implement `POST /api/v1/expenses` endpoint creating `FinancialTransaction`, `AccountMovement` (negative amount), `Receipt`, and `Expense` atomically in a single Unit of Work.
2. **Frontend**: Implement the fast manual expense capture form in Flutter with essential fields (Account, Amount, Merchant/Description) immediately visible, sensible defaults (Date = Today, Currency derived from Account, Category = Uncategorized), and collapsed optional details.

---

## 3. Acceptance Criteria

- [x] **AC-1 (Essential fields only)**: A simple expense requires only an active owned `account_id`, positive `amount`, and `merchant` (min 1 non-whitespace char).
- [x] **AC-2 (Sensible defaults)**: `occurred_at` defaults to current date/time if omitted; account provides the currency; `category_id` is optional (`None` represents Uncategorized).
- [x] **AC-3 (Collapsed optional details)**: Notes, optional category, and specific date stay out of the way on capture.
- [x] **AC-4 (Atomic ledger integration)**: Creates `FinancialTransaction` (type='expense', capture_source='manual'), `AccountMovement` (negative amount), `Receipt`, and `Expense` atomically. Account balance derived correctly.
- [x] **AC-5 (Strict multi-tenant & reference validation)**: Cannot post against inactive accounts, unowned accounts, unowned categories, or non-positive amounts. Invalid input saves nothing (atomic rollback).

---

## 4. API Contract & Schemas

### Request: `POST /api/v1/expenses`
```json
{
  "account_id": 1,
  "amount": "25000.00",
  "merchant": "Supermercado Éxito",
  "occurred_at": "2026-09-19T16:20:00Z", // optional, defaults to now()
  "category_id": 3,                      // optional, nullable
  "note": "Compra de despensa"           // optional, nullable
}
```

### Response: `201 Created` (`ExpenseResponse`)
```json
{
  "id": 10,
  "transaction_id": 42,
  "receipt_id": 15,
  "name": "Supermercado Éxito",
  "amount": "25000.00",
  "quantity": "1.000",
  "unit_price": null,
  "note": "Compra de despensa",
  "category": {
    "id": 3,
    "name": "Alimentación"
  },
  "receipt_name": "Supermercado Éxito",
  "receipt_note": "Compra de despensa",
  "store": "Supermercado Éxito",
  "description": "Supermercado Éxito",
  "occurred_at": "2026-09-19T16:20:00Z",
  "status": "confirmed",
  "capture_source": "manual",
  "account_id": 1,
  "account_name": "Bancolombia Principal",
  "account_is_active": true,
  "currency": {
    "id": 1,
    "code": "COP",
    "name": "Peso colombiano",
    "decimals": 2
  },
  "created_at": "2026-09-19T16:20:00Z",
  "updated_at": "2026-09-19T16:20:00Z"
}
```

---

## 5. Architectural Alignment & Database Mapping

In the current schema:
- **`financial_transaction`**: `user_id`, `type='expense'`, `status='confirmed'`, `occurred_at`, `description=merchant`, `capture_source='manual'`.
- **`account_movement`**: `user_id`, `transaction_id`, `account_id`, `amount = -amount` (strictly negative to decrease balance).
- **`receipt`**: `user_id`, `transaction_id`, `store=merchant`, `date=occurred_at.date()`, `currency_id=account.currency_id`, `category_id`, `total=amount`, `payment_method_id=1`.
- **`expense`**: `user_id`, `receipt_id`, `name=merchant`, `quantity=1`, `amount=amount`, `category_id`, `note`.

---

## 6. Edge Cases & Validation Rules

1. **Inactive Account**: If `account.is_active` is `false`, return `409 Conflict` (`expense_account_inactive`).
2. **Account Ownership**: If `account_id` does not belong to `user_id`, return `404 Not Found` (`expense_account_invalid`).
3. **Category Ownership**: If `category_id` provided does not belong to `user_id`, return `404 Not Found` (`expense_category_not_found`).
4. **Amount Bounds**: `amount > 0` and `amount <= 9999999999.99`. Zero or negative amounts rejected with `422`.
5. **Merchant Validation**: Trimmed non-empty string, max 200 chars. Empty or whitespace-only rejected with `422`.
6. **Atomicity**: If any insert fails, the entire transaction rolls back; no orphaned transaction or account movement rows.
