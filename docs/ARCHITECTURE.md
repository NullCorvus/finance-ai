# Architecture — Finance AI

## Status

Approved manual-first direction for the university prototype. The system is a modular monolith composed of a Flutter client, FastAPI backend, PostgreSQL database, and optional local receipt-image storage.

Product AI is a deferred adapter. The manual application does not require an AI provider or API key.

## Architectural Principles

- Backend owns financial rules, authorization, persistence, and analytics.
- Flutter owns presentation and local interaction state, not financial truth.
- PostgreSQL stores structured user-owned data.
- Transfers are atomic and do not affect income/expense analytics.
- Original currencies are preserved and incompatible currencies are not silently combined.
- Manual forms are the canonical write interface.
- Later AI proposes values for those forms and never writes directly.
- The MVP remains one deployable backend rather than separate microservices.

## Layer Diagram

```mermaid
flowchart TD
    Client["Flutter Android + Windows client<br/>manual forms, activity, budgets, dashboard"]
    API["FastAPI modular monolith<br/>auth, validation, financial rules, analytics"]
    DB[("PostgreSQL<br/>users, accounts, catalogs, movements, budgets")]
    Files[("Optional receipt image storage")]
    LLM["External AI provider<br/>deferred and optional"]

    Client -->|"HTTPS JSON"| API
    API -->|"SQLAlchemy / transactions"| DB
    API -->|"optional image access"| Files
    API -.->|"deferred proposal request"| LLM
    LLM -.->|"untrusted proposed form values"| API
```

### Text Alternative

The Flutter app calls the FastAPI backend. The backend reads/writes PostgreSQL and optionally stores receipt images. Only after the manual MVP, the backend may call an external AI provider and receive proposed form values.

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

    Auth --> DB
    Users --> DB
    Accounts --> DB
    Catalogs --> DB
    Expenses --> DB
    Expenses --> Files
    Income --> DB
    Transfers --> DB
    Budgets --> DB
    Analytics --> DB
    Assistant -.-> LLM
    Assistant -.-> Expenses
    Assistant -.-> Income
    Assistant -.-> Transfers
```

Note: **delete** (post-save) exists separately — this diagram covers the pre-save flow; saved expenses can always be edited or deleted (ALCANCE.md). Manual form entry skips P2/LLM entirely.

The backend contains feature modules for authentication, preferences, accounts/currencies, catalogs, expenses, income, transfers, budgets, and analytics. A deferred assistant module can propose inputs to expense, income, or transfer modules but cannot bypass them.

## Module Responsibilities

| Module | Responsibility |
|---|---|
| Auth and Sessions | Registration, login, short-lived access credentials, renewable-session revocation, current user |
| User Preferences | Preferred defaults such as COP |
| Accounts and Currencies | Owned money locations, currency association, balance calculations |
| User Catalogs | Categories, subcategories, payment methods, and income sources |
| Expenses | Manual expense CRUD, optional item detail, optional receipt attachment |
| Income | Manual income CRUD |
| Transfers | Atomic movement between two owned accounts |
| Budgets | Weekly/monthly category or subcategory targets and progress |
| Activity and Dashboard | User-scoped history, filters, balances, and deterministic summaries |
| AI Input Adapter — deferred | Converts supported photo/audio/text into untrusted proposals for existing forms |

## Core Data Flow — Manual Expense

```mermaid
flowchart LR
    User["User"]
    Form["Manual expense form"]
    API["Expense API"]
    Validate["Validate ownership and fields"]
    Tx["Database transaction"]
    DB[("PostgreSQL")]
    Result["Updated activity and summaries"]

    User -->|"enters data"| Form
    Form -->|"request"| API
    API --> Validate
    Validate -->|"valid"| Tx
    Validate -->|"invalid"| Form
    Tx --> DB
    DB --> Result
    Result --> User
```

### Text Alternative

The user fills the normal expense form. The backend validates the owned account/catalog fields and saves the expense in a transaction. Success updates activity, balances, budgets, and dashboard calculations. Invalid input returns to the form without saving.

## Core Data Flow — Transfer

```mermaid
flowchart LR
    User["User"]
    Form["Transfer form"]
    API["Transfer API"]
    Rules["Validate two distinct owned accounts<br/>and positive source/destination amounts"]
    Tx["Atomic transfer transaction"]
    DB[("PostgreSQL")]
    Activity["Account balances and activity"]

    User --> Form
    Form --> API
    API --> Rules
    Rules -->|"valid"| Tx
    Rules -->|"invalid"| Form
    Tx --> DB
    DB --> Activity
    Activity --> User
```

### Text Alternative

The user selects two distinct owned accounts and provides transfer amounts. The backend validates ownership/currency rules and commits both sides atomically. The movement changes account balances and activity but not income or expense totals.

## Deferred Data Flow — AI-Assisted Input

```mermaid
flowchart LR
    User["User"]
    Input["Photo, audio, or text"]
    Adapter["Backend AI adapter"]
    LLM["External AI provider"]
    Proposal["Existing expense, income, or transfer form"]
    Core["Normal validation and save path"]

    User --> Input
    Input --> Adapter
    Adapter -.-> LLM
    LLM -.-> Adapter
    Adapter -->|"untrusted proposal"| Proposal
    User -->|"review, edit, confirm, or discard"| Proposal
    Proposal -->|"explicit confirm"| Core
```

### Text Alternative

The backend sends optional input to an external provider. The returned values prefill an existing form. The user must review and explicitly confirm before the normal validation/save path runs.

## Security Boundaries

- Registration and login are the only public business endpoints.
- Financial endpoints deny access by default and validate the authenticated owner.
- Native client tokens use secure platform storage on each supported platform.
- Passwords, tokens, secrets, and unnecessary financial content are excluded from logs.
- AI-provider keys exist only in backend configuration and are absent from manual-MVP setup.
- File access is mediated by the backend; clients never submit arbitrary server paths.
- Errors fail closed and return generic user-safe messages.

## Deployment Direction

For development/demo:

- Flutter app runs on an emulator/device.
- FastAPI and PostgreSQL run locally through Docker Compose.
- PostgreSQL is attached only to an internal private network and has no host port.
- FastAPI also joins a client-access bridge and publishes only to Windows loopback (`127.0.0.1:8000`).
- An opt-in development override may temporarily attach PostgreSQL to the client-access bridge at `127.0.0.1:55432` for DBeaver. It uses a database-enforced read-only role and password-hash-free views; it is absent from the default topology.
- Optional receipt files use a backend-controlled local volume.

A VM may host the backend/database later. Production networking, managed encryption, monitoring, backup, and recovery are deferred until the team approves a deployment target.
