# Step 5 — Architecture Plan (answers to guide §1 questions)

> **Historical planning record:** the answers below preserve the original team decisions for
> Step 5, including the VM and server-file-storage proposal. They are not an implementation
> inventory. Current auth, capture, storage and deployment are described in `docs/ARCHITECTURE.md`
> and `docs/STACK.md`; this record does not override those verified descriptions.

> Source of truth for the Stage 2 answers. Each answer is a decision made by the team
> (the architect), recorded here so any agent working on Step 5 follows them.
> Guide: `docs/guides/architecture-diagrams-guide.md`

> **Original scope decision:** the core is an **Android app + backend on a VM** that
> tracks expenses. The AI is used in core **only for AI-assisted input parsing** (photo/audio/natural-language text →
> structured JSON, user confirms). The **agent/chat features are optional Phase 3 ideas** and
> are marked as such below.

## Q1 — Actors (who uses the system?)

**Answer:** Only the **regular user** (one actor). Admin exists in the product but is deliberately excluded from the architecture diagrams (project decision).

## Q2 — System boundary (inside vs outside)

**Answer:**

| Side | Elements |
|---|---|
| INSIDE (we build) | Backend/API (incl. AI parsing logic) · Database · File storage (folder for receipt images) |
| OUTSIDE (we rent) | User (the person) · LLM provider (OpenAI / Claude) |
| SEPARATE CLIENT BOX | **Android app** (thin client) — we build it, but it is the presentation layer, kept apart from the core (interface-agnostic rule from `CONTEXT.md`) |

**Deployment:** the backend + DB are hosted on a **VM** so the app works from anywhere. For demos, running locally is acceptable.

## Q3 — Containers (top-level deployable units)

**Answer:** 4 containers — the AI parsing logic is **merged inside the API** (it is code within the backend, not a separate program; stopping the API stops the parsing):

1. **Client** — the Android app (thin client)
2. **API Server** — backend incl. AI parsing logic (core) — on the VM
3. **Database** — main DB (candidate: PostgreSQL) — on the VM
4. **File Storage** — folder for receipt images (local disk for demo)

External (outside boundary, not containers of ours): LLM provider (OpenAI / Claude).

Optional Phase 3: if the agent/chat is built, it is merged inside the API too (never on the phone).

## Q4 — Modules per container

**Answer:** The API container has 4 core modules + 2 optional (one folder each). Chosen as separate modules also because it lets the team divide the work between colleagues:

1. **Auth** — login, sessions, roles (FEATURES 0a; User + Role tables)
2. **Expense** — register/edit/delete expenses (photo, audio, natural-language text; plus the manual form; confirmation flow for AI-assisted input) (FEATURES 1–5)
3. **Income** — register income, balance analysis (FEATURES 5b)
4. **AI Parsing** — AI-assisted input → structured JSON for preview/confirm (core; FEATURES 1, 2, 4)
5. **AI Agent / Tools** — *(OPTIONAL Phase 3)* chat, read-only queries (AI Agent Vision)
6. **Chat** — *(OPTIONAL Phase 3)* natural-language queries to the agent (FEATURES 6–7)

Other containers have no sub-modules: Client = screens, DB = tables, File storage = folder.

## Q5 — Data stores

**Answer:** Two stores only:

1. **Main DB** — the 11 tables (User, Role, Receipt, Expense, Subcategory, Category, Currency, PaymentMethod, Income, IncomeSource, SpendingLimit)
2. **File Storage** — folder for receipt images (local disk for demo)

Chat history + saved skills are **Phase 3 optional features** (FEATURES 18–19) — they will add new tables later, not now.

## Q6 — Journeys

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
