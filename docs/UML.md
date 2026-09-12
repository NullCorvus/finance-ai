# UML Views — Finance AI

This file contains only the current high-level product views. Detailed data relationships live in `SCHEMA.md`; deployment and module boundaries live in `ARCHITECTURE.md`.

## Use Cases

```mermaid
flowchart LR
    user["Personal budget user"]
    subgraph system["Finance AI"]
        auth(("Register and authenticate"))
        structure(("Manage accounts, currencies, and catalogs"))
        manual(("Manage expenses, income, and transfers"))
        activity(("Search transaction history and view dashboard"))
        assist(("Capture through photo, voice, or text"))
        budget(("Manage budgets"))
    end
    user --> auth
    user --> structure
    user --> manual
    user --> activity
    user --> assist
    user --> budget
```

## AI Proposal State

```mermaid
stateDiagram-v2
    [*] --> Captured
    Captured --> Processing
    Processing --> Proposed: parsed
    Processing --> NeedsInput: missing or uncertain
    Processing --> Failed: provider or format failure
    NeedsInput --> Proposed: clarified or edited
    Proposed --> Proposed: edit
    Proposed --> Processing: retry
    Proposed --> Saved: accept + validation succeeds
    Proposed --> Discarded: discard
    Proposed --> NeedsInput: validation needs information
    Failed --> Captured: retry
    Failed --> ManualForm: manual fallback
    Saved --> [*]
    Discarded --> [*]
    ManualForm --> Saved: normal validation
```

## Transaction Sequence

```mermaid
sequenceDiagram
    actor U as User
    participant F as Flutter
    participant A as FastAPI
    participant M as AI provider
    participant S as Transaction service
    participant D as PostgreSQL

    U->>F: Photo, voice, or text
    F->>A: Supported input
    A->>M: Constrained multimodal request
    M-->>A: Structured proposal + confidence
    A-->>F: “This is what I understood”
    U->>F: Accept or edit
    F->>A: Confirmed normal request
    A->>S: Validate ownership and business rules
    S->>D: Atomic commit
    D-->>S: Saved result
    S-->>F: Success
```
