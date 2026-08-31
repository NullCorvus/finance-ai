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

| # | Feature | Description |
|---|---------|-------------|
| 1 | Receipt photo → AI extraction + categorization | Upload receipt photo, AI with vision extracts line items (name, amount, subcategory), store, date, total, payment method, currency. purchase_reason and item_reason are optional. User confirms or corrects before saving. Image stored temporarily until confirmation. Atomic save (receipt + items + image + relationships). |
| 2 | Audio input → AI parsing + categorization | Say "spent $15 on lunch at Subway" — AI parses to structured expense AND categorizes. Supports both short sentences and longer voice memos. |
| 4 | Registro manual y gestión de gastos (CRUD) | Crear, editar, eliminar gastos con monto, fecha, comercio, moneda, método de pago, categoría/subcategoría y purchase_reason/item_reason. Guardar recibos con imagen opcional. Aislamiento por usuario. Base para todas las capturas. |
| 5b | Income registration | Register income (salary, freelance, gift...) with source and optional description. Enables balance analysis ("am I spending more than I earn?"). |
| 8 | Dashboard | Overview of expenses: table of recent transactions, summary cards, graphs (spending by category/subcategory, trends over time, balance vs income). **Computed by the backend with plain SQL — no AI involved.** Low priority — build after capture features work. |
| 21 | Expense search & filters | Find expenses by item/store name (live text search) + filter by category and date range. Plain SQL (ILIKE), no AI. Part of expense management (HU-005). |

## Phase 2 — Manual Money Management

- Manual form entry always works — AI is not required to register an expense.
- Manual form path: the user enters the required expense fields directly; the form bypasses AI and saves after validation.
- AI-assisted path: natural-language text, photo, or audio → backend calls AI API once → AI returns structured JSON + category → preview with editable fields → **Confirm / Edit / Discard**. Nothing is saved until the user confirms.
- Auto-categorization is integrated into the AI prompt: the backend passes the user's existing subcategories, so suggestions come from the existing list first. User can override or add a new one.

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

| # | Feature | Description |
|---|---------|-------------|
| 6 | Chat with AI | Ask questions like "how much did I spend on food this month?" in natural language. AI queries the DB (read-only, via tools) and responds. |
| 7 | AI generates graphs | Visual answers to chat queries: spending by category, trends over time. |
| 9 | Multi-currency | Support USD + COP with AI handling conversion rates. Store original amount + currency; convert when displaying. |
| 11 | Recurring expenses | Monthly expenses that auto-create each month. Manual: user marks expense as recurring. AI suggestion: AI detects patterns and asks "Want to make this recurring?". |
| 13 | What-if simulation | "What if I replace rice with pasta?" → agent simulates the change and shows the difference (e.g., monthly savings). |
| 14 | Supermarket price reference | Agent can reference product prices (e.g., "how much does rice cost?"). Source: to define. Live online scraping not recommended. |
| 15 | Google Keep / Workspace integration | Optional. Connect to Google Workspace (e.g., create a shopping list in Google Keep from expenses). Requires prior user configuration. |
| 16 | Agent-created limits via chat | User says "keep eating out under $50/month" in chat → agent creates/edits the spending limit. |
| 17 | Spending insights | AI flags unnecessary spending ("you spent $40 on impulse purchases this week") powered by reason/context tracking. |
| 19 | Saved skills | Save a reusable command/preference so you don't repeat yourself. Example: "every month, send me my spending summary" → saved once, agent runs it anytime you ask. |
| 20 | Agent write protection | Agent modifications (limits, subcategories) show a confirmation preview before applying — same Confirm/Edit/Discard pattern as expenses. Optional audit/change-log table for undo. |
| 18 | Chat history | Save past agent conversations so the AI remembers what you asked before. Optional Phase 3 feature. |

| Feature | Description |
|---|---|
| Receipt-photo assistance | Extract proposed expense and optional item values into the existing expense form |
| Audio assistance | Interpret a spoken expense, income, or transfer and prefill the corresponding normal form |
| Natural-language text assistance | Interpret typed descriptions and prefill the corresponding normal form |
| Review gate | Edit, retry, discard, or explicitly confirm every proposal |
| Manual fallback | All normal forms continue to work when AI is disabled or unavailable |

- **Phase 0** — Infrastructure. Must be done before anything else.
- **Phase 1** — Must have at launch. Build first. Includes capture (photo/audio/natural-language text), income, and dashboard (low priority).
- **Phase 2** — Easy extras. Build once Phase 1 is stable. Spending limits, export, reason tracking.
- **Phase 3** — Optional ideas ("agent" features). Nice-to-have; can be skipped without affecting the core.
