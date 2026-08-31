# Features — Finance AI

Features are ordered by dependency. The complete manual budgeting application is built before product AI.

## Phase 0 — Technical Foundation

These are technical enablers, not user stories:

| ID | Enabler | Outcome |
|---|---|---|
| EN-001 | Monorepo and quality baseline | Clearly separated documentation, backend, and frontend areas with pinned tools, formatting, linting, and review conventions |
| EN-002 | Local infrastructure | FastAPI and PostgreSQL start repeatably with database health checks |
| EN-003 | Migration and seed baseline | SQLAlchemy/Alembic database creation plus repeatable currency and default-catalog setup |
| EN-004 | API contract baseline | Versioned OpenAPI contract for identity and initial resources |
| EN-005 | Flutter foundation | Theme, navigation shell, loading/error patterns, and auth route structure |
| EN-006 | Continuous quality baseline | Automated tests, dependency checks, and clean-setup verification |

No AI key or provider is required in Phase 0.

## Phase 1 — Identity and Financial Foundation

| Feature | Description |
|---|---|
| Registration | Email/password registration with default user settings and editable catalog templates |
| Authentication | Login, secure session restoration, renewal, and logout |
| Preferences | Preferred default currency without rewriting historical amounts |
| Accounts | Cash, bank, wallet, savings, and other user accounts with one currency each |
| Categories | User-owned categories and optional subcategories |
| Supporting catalogs | User-owned payment methods and income sources |
| Shared currencies | Supported reference list beginning with COP and USD |

## Phase 2 — Manual Money Management

| Feature | Description |
|---|---|
| Manual expenses | Create a spending transaction through a normal form without AI or receipt requirements |
| Optional expense detail | Add receipt image and zero or more item rows when useful |
| Expense correction/archive | Correct mistakes while preserving consistent balances and analytics |
| Income | Create and manage income associated with an account and source |
| Transfers | Move money between owned accounts without counting it as income or expense |
| Cross-currency transfers | Record actual source and destination amounts without a live exchange-rate service |
| Activity | Unified expenses, income, and transfers with date/account/type filters |

## Phase 3 — Budgets and Visibility

| Feature | Description |
|---|---|
| Category/subcategory budgets | Simple weekly or monthly targets in an explicit currency |
| Budget progress | Deterministic calculation from qualifying expenses |
| Account balances | Opening balance plus active movements |
| Dashboard | Income, expenses, balances, recent activity, category totals, and budget progress |
| Currency-safe summaries | Group totals by currency until conversion is intentionally implemented |

At the end of Phase 3, the application is a complete usable manual MVP.

## Phase 4 — Optional AI Assistance

Phase 4 begins only after Phases 0–3 are stable.

| Feature | Description |
|---|---|
| Receipt-photo assistance | Extract proposed expense and optional item values into the existing expense form |
| Audio assistance | Interpret a spoken expense, income, or transfer and prefill the corresponding normal form |
| Natural-language text assistance | Interpret typed descriptions and prefill the corresponding normal form |
| Review gate | Edit, retry, discard, or explicitly confirm every proposal |
| Manual fallback | All normal forms continue to work when AI is disabled or unavailable |

AI does not calculate the ordinary dashboard, own separate financial data, or write directly to the database.

## Future Ideas — Not Approved MVP

- Live exchange-rate service and converted combined totals
- Recurring transactions
- Dedicated calendar screen
- Conversational financial questions
- AI-generated charts or reports
- What-if simulations
- Autonomous agent actions
- External workspace/shopping-list integrations
- Admin dashboard
- Export, investments, debt, and bank synchronization

These ideas require separate approval and stories before implementation.

## Priority Rule

1. Protect correctness of balances and ownership.
2. Preserve a complete manual path.
3. Build user value in vertical stories.
4. Add AI only when it reduces entry effort without changing financial truth.
