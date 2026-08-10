# Features — Finance AI Tracker

Features organized by build phase. Phase 1 is the foundation and must ship first. Phase 2 depends on the interface decision (Telegram vs web vs app). Phase 3 is enhancements.

## Phase 0 — Platform & Auth (infrastructure)

| # | Feature | Description |
|---|---------|-------------|
| 0a | Multi-user authentication | Email/password login, each user sees only their own data. |
| 0b | Shared AI API key | One API key configured in the backend. All users share it. You pay for usage. |

## Phase 1 — Foundation (input + storage)

| # | Feature | Description |
|---|---------|-------------|
| 1 | Receipt photo → AI extraction | Upload receipt photo, AI with vision extracts line items, store, total, date. User confirms or corrects before saving. |
| 2 | Audio input | Say "spent $15 on lunch at Subway" — AI parses to structured expense. Supports both short sentences and longer voice memos. |
| 3 | Text input | Manually type the expense details. |
| 4 | AI auto-categorization | AI assigns a main category (predefined) + subcategory (generated). User can override. |
| 5 | Reason/context tracking | Each expense can include *why* it was made. Enables behavioral analysis later. |
| 5b | Income registration | Register income (salary, freelance, gift...) with source and optional description. Enables balance analysis ("am I spending more than I earn?"). |

## Phase 2 — Query & Analysis (depends on interface)

| # | Feature | Description | Interface Dependency |
|---|---------|-------------|---------------------|
| 6 | Chat with AI | Ask questions like "how much did I spend on food this month?" in natural language. AI queries the DB and responds. | Works on all interfaces |
| 7 | AI generates graphs | Visual answers to queries: spending by category, trends over time. | Sent as images or inline in Telegram Mini App; embedded in web/app |
| 8 | Dashboard | Overview of expenses: table of recent transactions, summary cards, graphs. | Telegram Mini App or web/app — Telegram has Mini Apps for rich UI |

## Phase 3 — Advanced

| # | Feature | Description |
|---|---------|-------------|
| 9 | Multi-currency | Support USD + COP with AI handling conversion rates. Store original amount + currency; convert when displaying. |
| 10 | Spending limits | AI-assisted awareness. User sets preferences ("keep eating out under $50/month"), AI tracks and reports. Created via settings UI (MVP); the agent can also create/edit limits via chat (Phase 3). |
| 11 | Recurring expenses | Monthly expenses that auto-create each month. Two ways to activate: **(1) Manual** — user marks expense as recurring. **(2) AI suggestion** — AI detects patterns (same store + amount appearing regularly) and asks "Want to make this recurring?". Management: pause, cancel, edit (changes apply to future instances). |
| 12 | Export | Download expenses as CSV or PDF. |
| 13 | What-if simulation | "What if I replace rice with pasta?" → agent simulates the change and shows the difference (e.g., monthly savings). |
| 14 | Supermarket price reference | Agent can reference product prices (e.g., "how much does rice cost?"). Source: to define. Live online scraping not recommended. |
| 15 | Google Keep / Workspace integration | Optional. Connect to Google Workspace (e.g., create a shopping list in Google Keep from expenses). Requires prior user configuration. |
| 16 | Agent-created limits via chat | User says "keep eating out under $50/month" in chat → agent creates/edits the spending limit. |
| 17 | Spending insights | AI flags unnecessary spending ("you spent $40 on impulse purchases this week") powered by reason/context tracking. |
| 18 | Chat history | Save past conversations so the AI remembers what you asked before. |
| 19 | Saved skills | Save a reusable command/preference so you don't repeat yourself. Example: "every month, send me my spending summary" → saved once, agent runs it anytime you ask. Or "I prefer COP" → agent remembers instead of re-explaining. |

## Priority Legend
- **Phase 1** — Must have at launch. Build first.
- **Phase 2** — Core experience. Build once the interface is decided.
- **Phase 3** — Nice-to-have. Build after core is stable.
