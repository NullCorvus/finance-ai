# HU-006 Plan & Core Architecture Knowledge (80/20 Guide)

> **User Story (PB-004, 5 pts):**
> *"As a user, I want to record an expense with only essential information so that manual capture remains fast without AI or a receipt."*
>
> **Acceptance Criteria:**
> A simple expense needs only account, amount, and merchant/description because date defaults to today, account supplies currency, and category may be Uncategorized; optional fields stay out of the way; one item can reuse the merchant text; AI, receipt, and item rows are not required; invalid references save nothing.

---

# Part 1: The 20% You Must Know (80% Project Understanding)

Understanding these **5 fundamental pillars** is enough to navigate, understand, and build features in this codebase with complete confidence.

```
+-----------------------------------------------------------------------------------+
| 1. LEDGER PATTERN                                                                 |
|   FinancialTransaction (event) ---> AccountMovement (signed delta)                |
|   * Never store mutable balances! Balance is derived from movements.              |
+-----------------------------------------------------------------------------------+
| 2. HARD MULTI-TENANT ISOLATION                                                    |
|   FOREIGN KEY (account_id, user_id) REFERENCES account(id, user_id)               |
|   * Enforced at the SQL engine level. Cross-user data contamination is impossible.|
+-----------------------------------------------------------------------------------+
| 3. UNIT OF WORK (UoW) TRANSACTION ATOMICITY                                       |
|   async with uow:                                                                 |
|       tx = uow.transactions.create(...)                                           |
|       movement = uow.movements.create(...)                                        |
|       expense = uow.expenses.create(...)                                          |
|   * If any step fails, all operations rollback atomically.                        |
+-----------------------------------------------------------------------------------+
| 4. CONTRACT-FIRST API WORKFLOW                                                    |
|   FastAPI Schemas  -->  POST /api/v1/expenses  -->  openapi.json  -->  Flutter DTO|
+-----------------------------------------------------------------------------------+
| 5. FEATURE-FIRST MONOREPO STRUCTURE                                               |
|   backend:  src/finance_ai/{feature}/ (router, schemas, service)                  |
|   frontend: lib/features/{feature}/ (presentation, domain, data)                  |
+-----------------------------------------------------------------------------------+
```

---

### Pillar 1: The Ledger Engine (Movements over Balances)
* **The Rule**: The system **never** maintains a mutable column like `account.balance = 500`. 
* **How it works**:
  1. Every financial action creates a parent record: [`FinancialTransaction`](file:///home/d3ad/codigos/finance-ai/finance-ai-backend/src/finance_ai/db/models/transactions.py) (`type='expense'`, `capture_source='manual'`).
  2. The actual balance impact is recorded in an [`AccountMovement`](file:///home/d3ad/codigos/finance-ai/finance-ai-backend/src/finance_ai/db/models/transactions.py) row with a **signed amount** (expenses are negative, income is positive).
  3. The account's live balance is always computed dynamically:
     $$\text{Live Balance} = \text{opening\_balance} + \sum(\text{account\_movement.amount})$$
* **Why it matters**: We get full auditability, historical integrity, zero race conditions on balance math, and easy rollbacks.

---

### Pillar 2: Composite Multi-Tenant Isolation
* **The Rule**: Every query and every foreign key checks `user_id`.
* **How it works**:
  Look at [`AccountMovement`](file:///home/d3ad/codigos/finance-ai/finance-ai-backend/src/finance_ai/db/models/transactions.py#L42-L55):
  ```python
  ForeignKeyConstraint(
      ["account_id", "user_id"],
      ["account.id", "account.user_id"],
      name="fk_account_movement_account_owner",
      ondelete="RESTRICT",
  )
  ```
* **Why it matters**: If User A tries to pass an `account_id` belonging to User B, PostgreSQL **rejects the SQL insert directly** with a foreign key violation. The database itself guarantees that users can never touch each other's money or records.

---

### Pillar 3: Unit of Work (Atomic Transactions)
* **The Rule**: Database commits are never sprinkled randomly in business logic.
* **How it works**:
  Business logic runs inside a Unit of Work context manager:
  ```python
  async with uow:
      # 1. Validate active account and ownership
      # 2. Add FinancialTransaction
      # 3. Add AccountMovement (amount = -expense.amount)
      # 4. Add Expense record
      await uow.commit()
  ```
* **Why it matters**: If creating the expense metadata fails or if network disconnects, the account movement is never orphaned. Everything commits together or rolls back completely.

---

### Pillar 4: Contract-First API Pipeline
* **The Rule**: Backend Pydantic schemas are the contract.
* **How it works**:
  1. Backend defines `CreateExpenseRequest` and `ExpenseResponse` schemas.
  2. Router exposes the endpoint under `/api/v1/expenses`.
  3. `uv run python scripts/generate_openapi.py` updates [finance-ai-backend/openapi.json](file:///home/d3ad/codigos/finance-ai/finance-ai-backend/openapi.json).
  4. Flutter client reads the JSON keys and types directly.
* **Why it matters**: Zero mismatch between backend fields and frontend forms.

---

### Pillar 5: Feature-First Organization
* **Backend**:
  * Shared database & models: `src/finance_ai/db/`
  * Auth & security: `src/finance_ai/auth/`
  * Features: `accounts/`, `categories/`, `income_sources/`, and now `expenses/`. Each contains `router.py`, `schemas.py`, `service.py`.
* **Frontend**:
  * `lib/features/`: `accounts/`, `categories/`, `income_sources/`, and now `expenses/`.
  * Each feature folder has:
    * `data/`: API calls and HTTP requests.
    * `domain/`: Pure Dart immutable models.
    * `presentation/`: State notifier controllers and Flutter UI widgets.

---

# Part 2: Key Files to Inspect Before Coding

| Priority | File | What to Inspect |
|---|---|---|
| 1 | [transactions.py](file:///home/d3ad/codigos/finance-ai/finance-ai-backend/src/finance_ai/db/models/transactions.py) | See existing `FinancialTransaction` and `AccountMovement` tables and constraints. |
| 2 | [accounts.py](file:///home/d3ad/codigos/finance-ai/finance-ai-backend/src/finance_ai/db/models/accounts.py) | See how `Account` enforces ownership and active status. |
| 3 | [0004_uow03_financial_accounts.py](file:///home/d3ad/codigos/finance-ai/finance-ai-backend/migrations/versions/0004_uow03_financial_accounts.py) | Example migration showing foreign keys and composite constraints. |
| 4 | [account_uow.py](file:///home/d3ad/codigos/finance-ai/finance-ai-backend/src/finance_ai/db/account_uow.py) | Pattern for combining repositories into an atomic Unit of Work. |
| 5 | [income_sources/router.py](file:///home/d3ad/codigos/finance-ai/finance-ai-backend/src/finance_ai/income_sources/router.py) | Standard status code handling (401/404/409/422/500). |

---

# Part 3: Step-by-Step Execution Plan (with Stop Gates)

We execute strictly one step at a time. At each **STOP GATE**, we review the code and concepts together before advancing.

---

### Step 1: AI-DLC Setup & Unit Specification
- [ ] Initialize `aidlc-docs/construction/hu-006-manual-expense/unit-of-work.md`.
- [ ] Update `docs/SPRINT-PLAN.md` with HU-006 as active sprint story.
- [ ] Update `aidlc-docs/aidlc-state.md` to indicate active unit `hu-006-manual-expense`.

**STOP GATE 1**: Review the contract specifications, edge cases, and acceptance criteria.

---

### Step 2: Database Schema & Migration
- [ ] Create SQLAlchemy model `Expense` in `src/finance_ai/db/models/expenses.py`:
  - `id`: BigInteger primary key.
  - `user_id`: FK to `app_user.id`.
  - `transaction_id`: FK to `financial_transaction.id`.
  - `account_id`: FK to `account.id`.
  - `category_id`: Optional FK to `category.id` (`ondelete="SET NULL"` for Uncategorized support).
  - `amount`: Numeric(18, 2), positive constraint.
  - `merchant`: String(200), trimmed non-empty.
  - `note`: String(500), optional.
  - Composite FKs: `(transaction_id, user_id)` and `(account_id, user_id)`.
- [ ] Generate and test Alembic migration `0008_uow04_expense.py`.

**STOP GATE 2**: Review the generated migration and verify database constraints and composite keys.

---

### Step 3: Backend Domain Schemas, UoW & Service
- [ ] Write Pydantic schemas in `src/finance_ai/expenses/schemas.py`:
  - `CreateExpenseRequest`: `account_id`, `amount` ($>0$), `merchant` (min 1 char), `occurred_at` (defaults to today), `category_id` (optional), `note` (optional).
  - `ExpenseResponse`: complete persisted expense summary.
- [ ] Implement `ExpenseRepository` and `ExpenseUnitOfWork`.
- [ ] Implement `ExpenseService`:
  - Enforce ownership and verify the selected account is active (`is_active = true`).
  - Create `FinancialTransaction` + `AccountMovement` (negative amount) + `Expense` atomically.

**STOP GATE 3**: Review the business logic, edge-case validations (inactive accounts, negative values), and rollback mechanics.

---

### Step 4: Backend API Route, Automated Tests & OpenAPI Sync
- [ ] Add `POST /api/v1/expenses` in `src/finance_ai/expenses/router.py`.
- [ ] Mount route in `src/finance_ai/api/router.py`.
- [ ] Write thorough tests in `tests/test_expenses.py`:
  - Valid creation with default today date and Uncategorized category.
  - Rejection of negative/zero amount, inactive account, or unowned account.
  - Verification that account balance updates correctly (movement is negative).
  - Atomic rollback verification.
- [ ] Regenerate `finance-ai-backend/openapi.json`.

**STOP GATE 4**: Run pytest test suite, verify test coverage, and inspect the generated OpenAPI spec.

---

### Step 5: Frontend Feature Layer & State Management
- [ ] Create Flutter data models and request DTOs in `lib/features/expenses/domain/`.
- [ ] Create `ExpensesRepository` in `lib/features/expenses/data/`.
- [ ] Create `ExpensesController` (StateNotifier/Provider) in `lib/features/expenses/presentation/` to handle form state and account list loading.

**STOP GATE 5**: Review the Flutter domain models and state management flow.

---

### Step 6: Frontend Short Form UI (Fast Capture)
- [ ] Implement `ManualExpenseScreen` / Modal:
  - **Always visible essential fields**: Account picker (pre-selects last used or default), Amount (numeric keyboard), Merchant.
  - **Date field**: Defaults to Today with tap-to-change.
  - **Collapsed "More details" section**: Category selector (defaults to "Uncategorized"), Notes/Memo.
  - Quick action feedback and error banners.
- [ ] Add entry button to Home Screen.

**STOP GATE 6**: Review the Flutter widget hierarchy, responsive layout, and form behavior.

---

### Step 7: Final Verification & Definition of Done
- [ ] Run backend checks: `uv run pytest --cov`, `uv run ruff check .`, `uv run mypy .`.
- [ ] Run frontend checks: `flutter analyze`, `flutter test`.
- [ ] Log verification results in `aidlc-docs/audit.md` and mark story complete.
