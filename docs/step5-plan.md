# Step 5 — Architecture Plan (answers to guide §1 questions)

> Source of truth for the Stage 2 answers. Each answer is a decision made by the team
> (the architect), recorded here so any agent working on Step 5 follows them.
> Guide: `docs/guides/architecture-diagrams-guide.md`

## Q1 — Actors (who uses the system?)

**Answer:** Only the **regular user** (one actor). Admin exists in the product but is deliberately excluded from the architecture diagrams (project decision).

## Q2 — System boundary (inside vs outside)

**Answer:**

| Side | Elements |
|---|---|
| INSIDE (we build) | Backend/API · AI agent logic (orchestration + tool calls) · Database · File storage (folder for receipt images) |
| OUTSIDE (we rent) | User (the person) · LLM provider (OpenAI / Claude) |
| SEPARATE CLIENT BOX | Interface (web / Telegram / app) — we build it, but it is the presentation layer, kept apart from the core (interface-agnostic rule from `CONTEXT.md`) |

## Q3 — Containers (top-level deployable units)

**Answer:** 4 containers — the AI agent is **merged inside the API** (it is code within the backend, not a separate program; stopping the API stops the agent):

1. **Client** — the interface (web / Telegram / app, TBD)
2. **API Server** — backend incl. the AI agent logic (orchestration + tool calls)
3. **Database** — main DB (candidate: PostgreSQL)
4. **File Storage** — folder for receipt images (local disk for demo)

External (outside boundary, not containers of ours): LLM provider (OpenAI / Claude).

## Q4 — Modules per container

**Answer:** The API container has 5 separate modules (one folder each). Chosen as separate modules also because it lets the team divide the work between colleagues:

1. **Auth** — login, sessions, roles (FEATURES 0a; User + Role tables)
2. **Expense** — register/edit/delete expenses (photo, audio, text; confirmation flow) (FEATURES 1–5)
3. **Income** — register income, balance analysis (FEATURES 5b)
4. **AI Agent / Tools** — extraction, queries, actions (limits, subcategories) (AI Agent Vision)
5. **Chat** — natural-language queries to the agent (FEATURES 6–7)

Other containers have no sub-modules: Client = screens, DB = tables, File storage = folder.

## Q5 — Data stores

**Answer:** Two stores only:

1. **Main DB** — the 11 tables (User, Role, Receipt, Expense, Subcategory, Category, Currency, PaymentMethod, Income, IncomeSource, SpendingLimit)
2. **File Storage** — folder for receipt images (local disk for demo)

Chat history + saved skills are **Phase 3 optional features** (FEATURES 18–19) — they will add new tables later, not now.

## Q6 — Journeys

**Answer:** Two end-to-end journeys — one data-flow diagram each (Stage 5):

1. **Register an expense** — photo/audio/text → AI extracts → preview → confirm/edit/discard → save to DB (ALCANCE.md confirmation flow)
2. **Ask the AI** — question → agent decides → tool calls → DB → answer/chart (FEATURES 6–7)

Other flows (income, limits) are shorter and similar to journey 1 — not drawn.

### Journey 1 — Register an expense (the exact story, from ALCANCE.md)

1. User sends input (photo / audio / text)
2. Backend forwards it to the AI agent
3. Agent calls the LLM provider (OpenAI / Claude) to extract structured data
4. Agent returns extracted data: store, date, total, items, suggested category
5. User sees a **preview** with editable fields
6. User chooses one of three:
   - **Confirm** → save to DB
   - **Edit** → user changes fields, goes back to step 5 (re-preview)
   - **Discard** → nothing is saved, flow ends
7. On confirm: backend saves receipt + expense rows to the DB, image file to file storage (if photo)
8. User sees a saved confirmation

### Journey 2 — Ask the AI (the exact story, from FEATURES 6–7)

1. User sends a question in chat ("how much did I spend on milk?")
2. Chat module forwards it to the agent
3. Agent calls the LLM; the LLM decides which tool(s) to use (e.g., query the DB)
4. Agent executes the tool call → DB query
5. DB returns the rows
6. Agent builds the answer (text and/or chart data)
7. User sees the answer in chat

## Q7 — Open decisions / TBD list

**Answer:** Three open decisions, drawn as "TBD" in the diagrams (not bugs — features):

1. **Interface** — web / Telegram / app (professor decides)
2. **Tech stack** — backend language/framework; DB candidate: PostgreSQL (professor decides)
3. **Price source** — for the Phase 3 supermarket price feature ("to define")

**Stage 2 COMPLETE — all 7 questions answered.**
