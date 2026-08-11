# Architecture — Finance AI Tracker

> **Status:** PROPOSAL — interface-agnostic. The stack and interface are not decided yet
> (professor decides); everything here is the contract, not the implementation.
> Decisions source: `docs/step5-plan.md` (Q1–Q7). Guide: `docs/guides/architecture-diagrams-guide.md`.

## Pending decisions (TBD)

- **Interface** — web / Telegram / app (professor decides)
- **Tech stack** — backend language/framework; DB candidate: PostgreSQL (professor decides)
- **Price source** — Phase 3 supermarket price feature ("to define")

When these are decided, resolve them via TASKS.md **Step 8** (post-stack sweep).

---

## Layer diagram

One subgraph per layer, `[( )]` databases, labeled arrows, TBD where open.

```mermaid
flowchart TD
    subgraph ClientLayer["Client Layer"]
        Client["Client<br/>Web / Telegram / App<br/>interface TBD"]
    end

    subgraph APILayer["API Layer"]
        API["API Server + AI Agent<br/>REST / JSON<br/>stack TBD"]
    end

    subgraph DataLayer["Data Layer"]
        DB[("Main DB<br/>TBD — candidate: PostgreSQL")]
        FS[("File Storage<br/>receipt images — local disk (demo)")]
    end

    Client -->|"HTTPS / JSON"| API
    API -->|"provider API"| LLM["External LLM Provider<br/>OpenAI / Claude"]
    API -->|"SQL / CRUD"| DB
    API -->|"upload / read media"| FS
```

> *Technologies TBD — this diagram is the contract, not the implementation.*

Notes:

- The AI agent is **merged inside the API** (Q3 decision) — no separate AI layer.
- LLM provider is external (outside the system boundary, Q2).
- Agent write-back distinction (limits, subcategories) is shown at module level in the component diagram.
- No vector DB, no cache (Q5: not needed — structured DB via tool calls).
- Admin deliberately excluded (Q1 decision).

---

## Component diagram

The inside view of the API container — the 5 modules and how they relate. The agent→DB arrow here carries the "agent writes limits/subcategories" story (deferred from the layer diagram to this zoom level).

> Uses `flowchart` instead of `C4Component` so it renders in Zed / GitHub mermaid preview. See the guide §6 note on the Zed gotcha with experimental C4C diagrams.

```mermaid
flowchart TD
    subgraph API["API Server (stack TBD)"]
        auth["Auth Module<br/>login, sessions, roles"]
        expenses["Expense Module<br/>register/edit/delete expenses"]
        income["Income Module<br/>register income"]
        agent["AI Agent / Tools<br/>extraction, queries, actions"]
        chat["Chat Module<br/>conversational queries"]
    end

    db[("Main DB (TBD)<br/>users, receipts, expenses, income, limits")]
    llm["LLM Provider (external)<br/>OpenAI / Claude - pay per call"]

    auth -->|"validates session"| expenses
    expenses -->|"requests AI extraction"| agent
    agent -->|"prompt + context"| llm
    agent -->|"reads / writes (tool calls)"| db
    chat -->|"sends natural-language queries"| agent
    expenses -->|"reads / writes"| db
    income -->|"reads / writes"| db
```

Legend:

- Box (subgraph) = the API container (its 5 modules inside).
- `[( )]` cylinder = data store (Main DB).
- Plain box outside the subgraph = external entity (LLM provider).

Notes:

- Only the API is expanded; the Client, DB, and File Storage stay as in the layer diagram.
- LLM provider is external — outside our system boundary (Q2).
- The agent → DB edge ("reads / writes (tool calls)") is where the agent acts on data (creates limits, generates subcategories) — the signature feature shown at this zoom level.
- `TBD` on every technology — stack not decided yet (Step 8 sweep).
- Admin deliberately excluded (Q1 decision).

---

## Data flow

Two journeys (Q6). Conventions per guide §7: entity = rectangle, process = stadium `([ ])`, store = cylinder `[( )]`, every flow labeled. DFD 2 is read-only — agent writes are Phase 3 (see `docs/ALCANCE.md` "Data Protection").

### DFD 1 — Register an expense

```mermaid
flowchart LR
    User["External Entity<br/>User"]:::entity
    LLM["External Entity<br/>LLM Provider"]:::entity
    P1(["P1<br/>Submit input (photo / audio / text)"]):::process
    P2(["P2<br/>AI extracts data"]):::process
    P3(["P3<br/>Show in editable format"]):::process
    P4(["P4<br/>Menu: Confirm / Edit / Discard"]):::process
    P5(["P5<br/>Edit: manual form or subtle fix by message"]):::process
    P6(["P6<br/>Save to DB"]):::process
    D1[("Data Store<br/>Receipts + Expenses")]:::store
    D2[("Data Store<br/>Image file")]:::store

    User -->|"photo / audio / text"| P1
    P1 -->|"raw input"| P2
    P2 -->|"prompt"| LLM
    LLM -->|"extracted data"| P2
    P2 -->|"extracted data"| P3
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

Note: **delete** (post-save) exists separately — this diagram covers the pre-save flow; saved expenses can always be edited or deleted (ALCANCE.md).

### DFD 2 — Ask the AI

```mermaid
flowchart LR
    User["External Entity<br/>User"]:::entity
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

Note: this journey is **read-only**. Agent writes (create limits, subcategories) are Phase 3 and go through the confirmation preview — see `docs/ALCANCE.md` "Data Protection".
