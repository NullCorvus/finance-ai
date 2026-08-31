# Architecture Plan — Manual-First Finance AI

## Q1 — Actors

> **Scope note (latest decision):** the core is an **Android app + backend on a VM** that
> tracks expenses. The AI is used in core **only for AI-assisted input parsing** (photo/audio/natural-language text →
> structured JSON, user confirms). The **agent/chat features are optional Phase 3 ideas** and
> are marked as such below.

- Personal Budget User: owns and manages their accounts and financial data.

### Deferred External Actor

- AI Provider: optional parser used only after the manual MVP. It proposes form data and never accesses PostgreSQL directly.

There is no Admin actor in the approved MVP.

## Q2 — System Boundary

### Inside

- Flutter mobile application
- FastAPI modular monolith
- PostgreSQL database
- Backend-controlled optional receipt storage
- Authentication, financial rules, analytics, and later AI adapter

### Outside

- User device platform services
- Optional external AI provider
- Future hosting/network infrastructure

### Explicitly Outside MVP

- Bank APIs
- Live currency-rate APIs
- Calendar integrations
- Autonomous agents
- Admin dashboard

## Q3 — Containers

| Container | Responsibility |
|---|---|
| Flutter app | Manual forms, navigation, activity, accounts, budgets, dashboard, later proposal review |
| FastAPI backend | Auth, ownership, validation, financial rules, analytics, persistence, later AI adapter |
| PostgreSQL | Structured user and financial data |
| Receipt storage | Optional image files |
| AI provider — deferred external | Proposed structured input only |

## Q4 — Backend Modules

1. Auth and Sessions
2. User Preferences
3. Accounts and Currencies
4. User Catalogs
5. Expenses and Receipt Detail
6. Income
7. Transfers
8. Budgets
9. Activity and Dashboard
10. AI Input Adapter — deferred

All modules run inside one backend service.

## Q5 — Data Stores

- PostgreSQL: canonical structured financial data
- Backend-controlled local file storage: optional receipt images
- No vector database
- No required cache
- No AI chat-history store in the manual MVP

## Q6 — Core Journeys

### Journey 1 — Record a Manual Expense

1. User opens the existing expense form.
2. User selects an owned account and catalog values.
3. Client provides immediate field feedback.
4. Backend validates the request, ownership, and active references.
5. Backend saves the expense atomically.
6. Activity, account balance, budget progress, and dashboard reflect the record.

1. **Auth** — login, sessions, roles (FEATURES 0a; User + Role tables)
2. **Expense** — register/edit/delete expenses (photo, audio, natural-language text; plus the manual form; confirmation flow for AI-assisted input) (FEATURES 1–5)
3. **Income** — register income, balance analysis (FEATURES 5b)
4. **AI Parsing** — AI-assisted input → structured JSON for preview/confirm (core; FEATURES 1, 2, 4)
5. **AI Agent / Tools** — *(OPTIONAL Phase 3)* chat, read-only queries (AI Agent Vision)
6. **Chat** — *(OPTIONAL Phase 3)* natural-language queries to the agent (FEATURES 6–7)

### Journey 2 — Transfer Between Accounts

1. User opens Transfer.
2. User selects two distinct owned accounts.
3. User enters the source amount and, if currencies differ, actual destination amount.
4. Backend validates ownership, active state, and positive amounts.
5. Backend commits the transfer atomically.
6. Both account balances and activity update.
7. Income and expense analytics remain unchanged.

### Journey 3 — AI-Assisted Entry — Deferred

1. User optionally supplies photo, audio, or natural-language text.
2. Backend adapter calls the configured provider.
3. Provider returns untrusted proposed values.
4. Existing Expense, Income, or Transfer form opens.
5. User edits, retries, discards, or confirms.
6. Only explicit confirmation enters the normal validation/save journey.

## Q7 — Open Decisions

- Professor/team confirmation of Flutter and deployment expectations
- Exact pinned runtime/dependency versions during EN-001
- New manual-first visual prototype
- AI provider only after the complete manual MVP

**Answer:** Two journeys (Q6). Only journey 1 is core; journey 2 is optional Phase 3.

1. **Register an expense** — photo/audio/natural-language text → AI parses → preview → confirm/edit/discard → save to DB (ALCANCE.md confirmation flow) — **CORE**; the manual form bypasses AI and saves after validation.
2. **Ask the AI** — question → agent decides → tool calls → DB → answer/chart (FEATURES 6–7) — **OPTIONAL Phase 3**

Other flows (income, limits) are shorter and similar to journey 1 — not drawn. The Dashboard analytics use plain SQL endpoints (no AI) — not drawn as a journey.

### Journey 1 — Register an expense (CORE, the exact story, from ALCANCE.md)

1. User sends AI-assisted input (photo / audio / natural-language text) from the Android app, or opens the separate manual form
2. For AI-assisted input, the backend forwards it to the AI parsing logic; for the manual form, the backend receives the validated fields directly
3. AI parsing calls the LLM provider (OpenAI / Claude) to extract structured data
4. AI parsing returns structured JSON: store, date, total, items, suggested category/subcategory
   (suggestions come from the user's existing subcategories, passed in the prompt)
5. AI-assisted input shows a **preview** with editable fields; the manual form proceeds directly to validation
6. For AI-assisted input, the user chooses one of three:
   - **Confirm** → save to DB
   - **Edit** → user changes fields manually in the form, then goes back to step 5 (re-preview)
   - **Discard** → nothing is saved, flow ends
7. On AI confirm, or after the manual form passes validation, the backend saves receipt + expense rows to the DB; the image file goes to file storage when present
8. User sees a saved confirmation

Manual form entry bypasses the AI entirely and saves directly after validation.

### Journey 2 — Ask the AI (OPTIONAL Phase 3, the exact story, from FEATURES 6–7)

1. User sends a question in chat ("how much did I spend on milk?")
2. Chat module forwards it to the agent
3. Agent calls the LLM; the LLM checks the question and **decides whether a tool is needed**
4. If no tool needed → answer directly. If a tool is needed → agent selects the tool and executes the tool call → DB query
5. DB returns the rows
6. Agent builds the answer (text and/or chart data)
7. User sees the answer in chat

Note: this journey is **optional (Phase 3) and read-only**. Agent writes (create/edit limits, subcategories) are also Phase 3 with confirmation preview — see `ALCANCE.md` "Data Protection" and FEATURES 20.

## Q7 — Open decisions / TBD list

**Answer:** Open decisions, drawn as "TBD" in the diagrams (not bugs — features):

1. **Interface** — **Android app** (team proposal; professor confirmation pending)
2. **Tech stack** — backend language/framework; DB candidate: PostgreSQL (professor decides)
3. **Price source** — for the Phase 3 optional supermarket price feature ("to define"), only if Phase 3 is built

**Stage 2 COMPLETE — all 7 questions answered.**
