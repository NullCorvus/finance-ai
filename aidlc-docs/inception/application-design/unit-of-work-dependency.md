# Unit Dependencies — Finance AI

## Dependency Flow

~~~mermaid
flowchart LR
    U1["UOW-01<br/>Foundation and Registration"]
    U2["UOW-02<br/>Secure Sessions"]
    U3["UOW-03<br/>Financial Structure"]
    U4["UOW-04<br/>Manual Movements"]
    U5["UOW-05<br/>Expense Detail and History"]
    U6["UOW-06<br/>Basic Dashboard"]
    U7["UOW-07<br/>Multimodal AI Speed Layer"]
    U8["UOW-08<br/>Budgets"]

    U1 -->|"registered identity and foundations"| U2
    U2 -->|"authenticated user"| U3
    U3 -->|"accounts and catalogs"| U4
    U4 -->|"financial movements"| U5
    U5 -->|"transaction history"| U6
    U6 -->|"stable deterministic foundation"| U7
    U7 -->|"capture loop available"| U8
~~~

### Text Alternative

UOW-01 establishes foundations and registration. UOW-02 adds secure sessions. UOW-03 adds accounts/catalogs. UOW-04 uses that structure for manual movements. UOW-05 adds correction/detail/history. UOW-06 adds the basic deterministic dashboard and completes the foundation. UOW-07 then adds separate natural-text, audio, and receipt-photo AI capture in that order. UOW-08 adds budgets and dashboard budget progress.

## Direct Dependency Matrix

Legend: **D** = direct dependency; **—** = not direct.

| Unit | UOW-01 | UOW-02 | UOW-03 | UOW-04 | UOW-05 | UOW-06 | UOW-07 |
|---|---:|---:|---:|---:|---:|---:|---:|
| UOW-01 | — | — | — | — | — | — | — |
| UOW-02 | D | — | — | — | — | — | — |
| UOW-03 | — | D | — | — | — | — | — |
| UOW-04 | — | — | D | — | — | — | — |
| UOW-05 | — | — | — | D | — | — | — |
| UOW-06 | — | — | — | — | D | — | — |
| UOW-07 | — | — | — | — | — | D | — |
| UOW-08 | — | — | — | — | — | — | D |

UOW-07 has a release gate requiring UOW-01–UOW-06.

## Construction Order

1. UOW-01 — Foundation and Registration
2. UOW-02 — Secure Sessions
3. UOW-03 — Financial Structure
4. UOW-04 — Manual Movements
5. UOW-05 — Expense Detail and History
6. UOW-06 — Basic Dashboard
7. UOW-07 — Multimodal AI Speed Layer
8. UOW-08 — Budgets

The team may prepare non-conflicting research or design early, but it must not merge functionality that violates these dependency gates.

## Shared Dependencies

| Shared concern | Owner and reuse |
|---|---|
| API/error conventions | Established by UOW-01; reused by all later units |
| Database migrations/seeds | Established by UOW-01; extended through ordered Alembic revisions |
| Flutter navigation/state/testing | Established by UOW-01; extended by feature |
| Authentication/session context | Added by UOW-02; required by financial units |
| Accounts/catalogs | Added by UOW-03; required by movement and budget forms |
| Financial invariants | Added by UOW-04; reused by history/dashboard/AI confirmation |
| Manual forms | Added by UOW-04 and refined by UOW-05; required before UOW-07 |

## Release Gates

- UOW-01: clean setup, migrations/seeds, API contract, Flutter foundation, and HU-001 acceptance.
- UOW-02: authenticated context works before owned financial resources.
- UOW-03: accounts/catalogs exist before transaction forms.
- UOW-04: manual financial writes work before detail/analytics/AI.
- UOW-05: correction and searchable transaction history make every movement inspectable.
- UOW-06: the basic deterministic dashboard completes the foundation required before product AI.
- UOW-07: natural text, audio, and receipt photo each provide fast one-tap review in that delivery order; manual fallback remains available and no provider response writes directly.
- UOW-08: budgets reuse the stable deterministic activity/dashboard calculations.
