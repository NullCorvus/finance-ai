# Scope — Finance AI

## Core Vision

Finance AI is a personal budgeting application with one shared Flutter client targeting Android and Windows, plus a FastAPI/PostgreSQL backend. Its first complete version is a normal manual budget app: users manage accounts, expenses, income, transfers, catalogs, budgets, activity, and dashboards without depending on AI.

AI is integrated only after the manual MVP is complete. It acts as an optional input assistant that proposes values for existing forms.

## Manual MVP

### Identity and Preferences

- Register with email and password
- Login, session restoration, and logout
- Default preferred currency: COP
- Secure user-data isolation
- No Admin role or admin dashboard in the approved MVP

### Financial Accounts

A financial account represents a place where the user holds money.

Examples:

- Cash
- Bank account
- Digital wallet
- Savings account or savings product
- Other user-defined account type

Each account has:

- Owner
- Name
- Type
- Currency
- Opening balance
- Active/archived state

Account balance is derived consistently from the opening balance and active money movements.

### Expenses

A manual expense is a spending transaction and can be saved without AI, a receipt image, or receipt items.

Core fields:

- Account
- Amount
- Date
- Merchant or description
- Category
- Optional subcategory
- Optional payment method
- Optional reason/context

An expense can optionally include:

- A receipt image/attachment
- Zero or more item-detail rows

The expense total is authoritative. Item totals may differ because of taxes, discounts, tips, or rounding.

### Income

Income records money entering one account.

Core fields:

- Account
- Income source
- Amount
- Date
- Optional description

### Transfers

A transfer moves money between two accounts owned by the same user.

Examples:

- Bank account → Cash after an ATM withdrawal
- Digital wallet → Bank account
- Checking → Savings

Rules:

- A transfer is neither income nor expense.
- Source and destination accounts must be different.
- Both sides are saved atomically.
- Same-currency transfers use the same amount on both sides.
- Cross-currency transfers preserve the actual source and destination amounts.
- No live exchange-rate service is required in the manual MVP.

### User-Owned Catalogs

Currencies are shared reference data. The initial supported list includes COP and USD.

The following catalogs belong to each user:

- Categories
- Subcategories
- Payment methods
- Income sources

Registration copies common editable defaults for the new user. Archived catalog values remain attached to historical records but cannot be selected for new entries.

### Budgets

The manual MVP includes simple spending budgets:

- Target one category or one subcategory
- Weekly or monthly period
- Positive amount
- Explicit currency
- Progress calculated from qualifying active expenses

A budget never targets both a category and a subcategory. Progress is calculated, not manually edited.

### Activity and Dashboard

The manual MVP provides:

- Unified activity containing expenses, income, and transfers
- Weekly, monthly, and custom date filters
- Account and movement-type filters
- Account balances
- Income-versus-expense summaries
- Spending by category/subcategory
- Budget progress
- Recent movements

Transfers affect account balances but not income/expense totals.

Until automatic conversion is explicitly added, amounts from unlike currencies are displayed separately and are never silently summed.

## Manual Data Flow

### Expense or Income

```text
Open normal form
→ Enter or select fields
→ Validate on client and server
→ Save atomically
→ Update activity, account balance, budgets, and dashboard
```

### Transfer

```text
Select source and destination accounts
→ Enter source/destination amount
→ Validate ownership, currencies, and distinct accounts
→ Save both sides atomically
→ Update account balances and activity
```

## Optional AI Assistance — After Manual MVP

AI may later accept:

1. Receipt photo
2. Audio description
3. Natural-language text

The backend sends supported input to the selected provider. The provider returns proposed data matching an existing manual expense, income, or transfer form.

```text
Optional input
→ Backend AI adapter
→ Proposed normal form values
→ Review / Edit / Retry / Discard
→ Explicit Confirm
→ Normal validation and save path
```

AI rules:

- AI output is untrusted input.
- AI does not receive database credentials.
- The Android and Windows clients do not contain provider credentials.
- AI cannot bypass ownership, validation, atomicity, or currency rules.
- AI cannot save or modify data without explicit user confirmation.
- Provider failure never disables the normal manual forms.

## Interface Approach

| Component | Responsibility |
|---|---|
| Flutter app | Manual forms, account/activity/dashboard screens, validation feedback, later optional assistant entry points |
| FastAPI backend | Authentication, authorization, financial rules, API contracts, analytics, persistence, and later AI-provider calls |
| PostgreSQL | Users, accounts, catalogs, expenses, items, receipt attachments, income, transfers, and budgets |
| Local file storage — prototype | Optional receipt images; accessed only through the backend |
| External AI provider — deferred | Produces proposals only; not required by the manual MVP |

The initial home is a recognizable budget-app dashboard or activity screen with clear Add Expense, Add Income, and Transfer actions. A chat interface is not required for the manual MVP.

## Security and Data Protection

- All financial routes require authentication unless explicitly public.
- Every owned resource is checked against the authenticated user.
- Passwords use adaptive hashing and are never logged.
- Renewable session credentials can be revoked on logout.
- Errors do not expose stack traces, queries, tokens, or secrets.
- Multi-record financial operations roll back on failure.
- Archived catalog values preserve history.
- Product AI proposals are never persisted until confirmed.

## Deferred or Out of Scope

- Product AI before the complete manual MVP
- Automatic bank transaction import or bank API integration
- Live exchange-rate conversion and combined converted totals
- Dedicated calendar screen
- Recurring transactions
- Admin dashboard and user administration
- Investments, debt, bill splitting, and subscription/payment processing
- Offline-first synchronization
- Autonomous agent writes
- Production-grade high availability, cloud monitoring, and disaster recovery

## Delivery Boundary

The approved build order is:

1. Technical foundation
2. Identity and preferences
3. Accounts, currencies, and user catalogs
4. Manual expenses, income, and transfers
5. Activity, budgets, and dashboard
6. Optional AI assistance

A time-boxed AI experiment may test provider feasibility earlier, but it is not a production feature and does not alter this dependency order.
