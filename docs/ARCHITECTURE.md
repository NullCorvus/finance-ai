# Architecture — Finance AI Tracker

> **Status:** PROPOSAL — core is the Flutter app + backend (API + DB). The "agent" features
> (chat, AI acting on data) are optional Phase 3 ideas and are marked as such below.
> Decisions source: `docs/step5-plan.md` (Q1–Q7). Guide: `docs/guides/architecture-diagrams-guide.md`.
> Code architecture & layers guide: `docs/guides/code-architecture-guide.md`.
> Stack decisions: `docs/STACK.md`.

## Pending decisions (TBD)

- **Interface** — **Flutter app** (team proposal; professor confirmation pending — see `docs/STACK.md`)
- **Price source** — Phase 3 optional supermarket price feature ("to define"), only if Phase 3 is built

Stack (backend FastAPI, PostgreSQL, Gemini flash default) is decided in `docs/STACK.md`.
Anything the professor changes at semester start gets resolved via TASKS.md **Step 8** (post-stack sweep).

---

## Layer diagram

One subgraph per layer, `[( )]` databases, labeled arrows, TBD where open.

```mermaid
flowchart TD
    subgraph ClientLayer["Client Layer"]
        Client["Flutter App<br/>thin client — needs internet"]
    end

    subgraph APILayer["API Layer"]
        API["Backend (API Server)<br/>FastAPI (Python) on VM — REST / JSON<br/>auth, analytics, AI parsing calls"]
    end

    subgraph DataLayer["Data Layer"]
        DB[("Main DB<br/>PostgreSQL<br/>lives on the VM")]
        FS[("File Storage<br/>receipt images — local disk (demo)")]
    end

    Client -->|"HTTPS / JSON"| API
    API -->|"provider API"| LLM["External LLM Provider<br/>Google Gemini flash (default)<br/>parsing only in core"]
    API -->|"SQL / CRUD"| DB
    API -->|"upload / read media"| FS
```

> *Technologies decided in `docs/STACK.md` (Flutter · FastAPI · PostgreSQL · Gemini flash default) — this diagram is the contract.*

Notes:

- The AI logic is **merged inside the backend** (Q3 decision) — no separate AI layer.
- In the core, the LLM provider is used **only for AI-assisted input parsing** (photo/audio/natural-language text → structured JSON). The manual form bypasses AI, and the phone never calls the LLM directly.
- The **agent (chat + AI acting on data)** is optional Phase 3 — if built, it lives inside the backend too. Marked optional in the component diagram.
- LLM provider is external (outside the system boundary, Q2).
- No vector DB, no cache (Q5: not needed — structured DB via tool calls).
- Admin deliberately excluded (Q1 decision).

---

## Component diagram

The inside view of the backend container — the modules and how they relate. The **AI Parsing** module is core; the **Chat / Agent** modules are optional Phase 3 (dashed, marked optional).

> Uses `flowchart` instead of `C4Component` so it renders in Zed / GitHub mermaid preview. See the guide §6 note on the Zed gotcha with experimental C4C diagrams.

```mermaid
flowchart TD
    subgraph API["Backend on VM (FastAPI, Python)"]
        auth["Auth Module<br/>JWT login, roles"]
        expenses["Expense Module<br/>register/edit/delete expenses"]
        income["Income Module<br/>register income"]
        parsing["AI Parsing Module<br/>input → structured JSON<br/>(core)"]
        agent["AI Agent / Tools<br/>(OPTIONAL — Phase 3)<br/>chat, read-only queries"]
        chat["Chat Module<br/>(OPTIONAL — Phase 3)<br/>conversational queries"]
    end

    db[("Main DB (PostgreSQL)<br/>users, receipts, expenses, income, limits")]
    llm["LLM Provider (external)<br/>Gemini flash (default) - pay per call"]

    auth -->|"validates session"| expenses
    expenses -->|"requests AI parsing"| parsing
    parsing -->|"prompt + input"| llm
    parsing -->|"structured JSON"| expenses
    expenses -->|"reads / writes"| db
    income -->|"reads / writes"| db
    chat -.->|"sends natural-language queries"| agent
    agent -.->|"prompt + context"| llm
    agent -.->|"reads (tool calls)"| db
```

Legend:

- Box (subgraph) = the backend container (its modules inside).
- `[( )]` cylinder = data store (Main DB).
- Plain box outside the subgraph = external entity (LLM provider).
- Dashed edges + "(OPTIONAL — Phase 3)" = agent/chat modules, not built in the core.

Notes:

- Only the backend is expanded; the Flutter app, DB, and File Storage stay as in the layer diagram.
- LLM provider is external — outside our system boundary (Q2).
- **Core:** the only LLM interaction is `parsing → llm → structured JSON`. No agent, no writes.
- **Optional Phase 3:** the agent → DB edge ("reads (tool calls)") is where the chat agent queries data — read-only. Agent *writes* (limits, subcategories) would go through a confirmation preview (ALCANCE.md "Data Protection").
- Stack decided in `docs/STACK.md` (FastAPI, PostgreSQL, Gemini flash default).
- Admin deliberately excluded (Q1 decision).

---

## Data flow

Two journeys (Q6). Conventions per guide §7: entity = rectangle, process = stadium `([ ])`, store = cylinder `[( )]`, every flow labeled.

### DFD 1 — Register an expense (CORE)

```mermaid
flowchart LR
    User["External Entity<br/>User (Flutter app)"]:::entity
    LLM["External Entity<br/>LLM Provider"]:::entity
    P1(["P1<br/>Submit input (photo / audio / natural-language text)"]):::process
    P2(["P2<br/>AI parses to JSON"]):::process
    P3(["P3<br/>Show in editable format"]):::process
    P4(["P4<br/>Menu: Confirm / Edit / Discard"]):::process
    P5(["P5<br/>Edit: manual form"]):::process
    P6(["P6<br/>Save to DB"]):::process
    D1[("Data Store<br/>Receipts + Expenses")]:::store
    D2[("Data Store<br/>Image file")]:::store

    User -->|"photo / audio / natural-language text"| P1
    P1 -->|"raw input"| P2
    P2 -->|"prompt"| LLM
    LLM -->|"structured JSON"| P2
    P2 -->|"structured JSON"| P3
    P3 -->|"formatted view"| P4
    P4 -->|"edit"| P5
    P5 -->|"updated data"| P3
    P4 -->|"discard - nothing saved"| User
    P4 -->|"confirmed"| P6
    P6 -->|"receipt + expense rows"| D1
    P6 -->|"image file"| D2
    P6 -->|"saved confirmation"| User

    classDef entity fill:#f9f9f9,stroke:#333,stroke-width:2px;
    classDef process fill:#eef,stroke:#333;
    classDef store fill:#efe,stroke:#333;
```

Note: **delete** (post-save) exists separately — this diagram covers the pre-save flow; saved expenses can always be edited or deleted (ALCANCE.md). Manual form entry skips P2/LLM entirely.

### DFD 2 — Ask the AI (OPTIONAL — Phase 3, not built in core)

```mermaid
flowchart LR
    User["External Entity<br/>User (Flutter app)"]:::entity
    LLM["External Entity<br/>LLM Provider"]:::entity
    P1(["P1<br/>Ask question"]):::process
    P2(["P2<br/>LLM checks the question"]):::process
    P3(["P3<br/>Tool needed?"]):::process
    P4(["P4<br/>Select tool + query DB"]):::process
    P5(["P5<br/>Build output"]):::process
    D1[("Data Store<br/>Main DB")]:::store

    User -->|"question"| P1
    P1 -->|"question"| P2
    P2 -->|"prompt"| LLM
    LLM -->|"understanding"| P2
    P2 -->|"decision"| P3
    P3 -->|"no tool - answer directly"| P5
    P3 -->|"tool needed"| P4
    P4 -->|"tool call: query"| D1
    D1 -->|"result rows"| P4
    P4 -->|"data"| P5
    P5 -->|"answer: text / image / other"| User

    classDef entity fill:#f9f9f9,stroke:#333,stroke-width:2px;
    classDef process fill:#eef,stroke:#333;
    classDef store fill:#efe,stroke:#333;
```

Note: this journey is **optional (Phase 3) and read-only**. Agent writes (create limits, subcategories) would go through the confirmation preview — see `docs/ALCANCE.md` "Data Protection". The core app gets its analytics from the backend via plain SQL endpoints (the Dashboard), not through this flow.
