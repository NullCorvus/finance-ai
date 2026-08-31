# Unit Dependencies — Finance AI

## Dependency Flow

~~~mermaid
flowchart LR
    U1["UOW-01<br/>Foundation and Registration"]
    U2["UOW-02<br/>Sessions and Preferences"]
    U3["UOW-03<br/>Financial Structure"]
    U4["UOW-04<br/>Manual Movements"]
    U5["UOW-05<br/>Expense Detail and Activity"]
    U6["UOW-06<br/>Budgets and Dashboard"]
    U7["UOW-07<br/>Optional AI Assistance"]

    U1 -->|"registered identity and foundations"| U2
    U2 -->|"authenticated user and defaults"| U3
    U3 -->|"accounts and catalogs"| U4
    U4 -->|"financial movements"| U5
    U3 -->|"budget targets and currencies"| U6
    U4 -->|"expense/income/transfer data"| U6
    U5 -->|"unified activity"| U6
    U6 -->|"complete manual MVP gate"| U7
~~~

### Text Alternative

UOW-01 establishes foundations and registration. UOW-02 adds sessions/preferences. UOW-03 adds accounts/catalogs. UOW-04 uses that structure for manual movements. UOW-05 adds detail/history. UOW-06 depends on financial structure, movements, and activity for budgets/dashboard. Only after UOW-01 through UOW-06 form the manual MVP may UOW-07 add optional AI proposals.

## Direct Dependency Matrix

Legend: **D** = direct dependency; **—** = not direct.

| Unit | UOW-01 | UOW-02 | UOW-03 | UOW-04 | UOW-05 | UOW-06 |
|---|---:|---:|---:|---:|---:|---:|
| UOW-01 | — | — | — | — | — | — |
| UOW-02 | D | — | — | — | — | — |
| UOW-03 | — | D | — | — | — | — |
| UOW-04 | — | — | D | — | — | — |
| UOW-05 | — | — | — | D | — | — |
| UOW-06 | — | — | D | D | D | — |
| UOW-07 | — | — | — | — | — | D |

UOW-07 also has a release gate requiring every prior unit, even though UOW-06 is its direct dependency in the construction graph.

## Construction Order

1. UOW-01 — Foundation and Registration
2. UOW-02 — Sessions and Preferences
3. UOW-03 — Financial Structure
4. UOW-04 — Manual Movements
5. UOW-05 — Expense Detail and Activity
6. UOW-06 — Budgets and Dashboard
7. UOW-07 — Optional AI Assistance

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
- UOW-05: unified history exists before final dashboard.
- UOW-06: manual MVP is stable before product AI.
- UOW-07: manual fallback remains available and no provider response writes directly.
