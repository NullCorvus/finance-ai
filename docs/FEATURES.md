# Features — Finance AI Tracker

Features organized by build phase. Phase 1 is the foundation and must ship first. Phase 2 is the dashboard (analytics). Phase 3 is optional ideas — the "agent" features live there and can be skipped without affecting the core.

## Interface

- **Android app** — thin client. Sends input, shows previews, renders charts. Needs internet (talks to the backend).
- **Backend (API + DB)** — runs on a VM. Owns the data, computes analytics (plain SQL), and calls the AI API only for parsing (and Phase 3 chat).
- All core features below work through the Android app; the AI API is never called from the phone.

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
| 4 | AI auto-categorization | AI assigns a main category (predefined) + subcategory. **The backend passes the user's existing subcategories to the AI in the prompt**, so suggestions come from the existing list first. User can override or add a new one. |
| 5 | Reason/context tracking | Each expense can include *why* it was made. Enables behavioral analysis later (Phase 3 insight). |
| 5b | Income registration | Register income (salary, freelance, gift...) with source and optional description. Enables balance analysis ("am I spending more than I earn?"). |

### Input path (AI-assisted, with fallback)

- Manual text entry always works — AI is not required to register an expense.
- AI-assisted path: input (photo/audio/text) → backend calls AI API once → AI returns structured JSON → preview with editable fields → **Confirm / Edit / Discard**. Nothing is saved until the user confirms.

## Phase 2 — Dashboard (core analytics)

| # | Feature | Description |
|---|---------|-------------|
| 8 | Dashboard | Overview of expenses: table of recent transactions, summary cards, graphs (spending by category/subcategory, trends over time, balance vs income). **Computed by the backend with plain SQL — no AI involved.** |

## Phase 3 — Optional ideas (agent features — may be skipped)

These are the "agent" features: they add natural-language chat and AI that *acts on* data. They are **not** part of the core and can be left out entirely.

| # | Feature | Description |
|---|---------|-------------|
| 6 | Chat with AI | Ask questions like "how much did I spend on food this month?" in natural language. AI queries the DB (read-only, via tools) and responds. |
| 7 | AI generates graphs | Visual answers to chat queries: spending by category, trends over time. |
| 9 | Multi-currency | Support USD + COP with AI handling conversion rates. Store original amount + currency; convert when displaying. |
| 10 | Spending limits | AI-assisted awareness. User sets preferences ("keep eating out under $50/month"), AI tracks and reports. Created via settings UI. |
| 11 | Recurring expenses | Monthly expenses that auto-create each month. Manual: user marks expense as recurring. AI suggestion: AI detects patterns and asks "Want to make this recurring?". |
| 12 | Export | Download expenses as CSV or PDF. |
| 13 | What-if simulation | "What if I replace rice with pasta?" → agent simulates the change and shows the difference (e.g., monthly savings). |
| 14 | Supermarket price reference | Agent can reference product prices (e.g., "how much does rice cost?"). Source: to define. Live online scraping not recommended. |
| 15 | Google Keep / Workspace integration | Optional. Connect to Google Workspace (e.g., create a shopping list in Google Keep from expenses). Requires prior user configuration. |
| 16 | Agent-created limits via chat | User says "keep eating out under $50/month" in chat → agent creates/edits the spending limit. |
| 17 | Spending insights | AI flags unnecessary spending ("you spent $40 on impulse purchases this week") powered by reason/context tracking. |
| 18 | Chat history | Save past conversations so the AI remembers what you asked before. |
| 19 | Saved skills | Save a reusable command/preference so you don't repeat yourself. Example: "every month, send me my spending summary" → saved once, agent runs it anytime you ask. |
| 20 | Agent write protection | Agent modifications (limits, subcategories) show a confirmation preview before applying — same Confirm/Edit/Discard pattern as expenses. Optional audit/change-log table for undo. |

## Priority Legend
- **Phase 1** — Must have at launch. Build first.
- **Phase 2** — Dashboard with analytics. Build once Phase 1 is stable.
- **Phase 3** — Optional ideas ("agent" features). Nice-to-have; can be skipped without affecting the core.
