# Unit Story Map — Finance AI

## Technical Enabler Map

| Identifier | Unit | Outcome |
|---|---|---|
| EN-001 | UOW-01 | Repository separation and quality baseline |
| EN-002 | UOW-01 | Local API/PostgreSQL infrastructure |
| EN-003 | UOW-01 | Migration and seed baseline |
| EN-004 | UOW-01 | Versioned API contract baseline |
| EN-005 | UOW-01 | Flutter foundation |
| EN-006 | UOW-01 | Continuous quality baseline |

## User Story Map

| Identifier | Product backlog | Unit | Story outcome |
|---|---|---|---|
| HU-001 | PB-001 | UOW-01 | Register an account |
| HU-002 | PB-001 | UOW-02 | Login, restore/revoke a session, and logout |
| HU-003 | PB-002 | UOW-03 | Manage financial accounts and currencies |
| HU-004 | PB-003 | UOW-03 | Manage categories and subcategories |
| HU-005 | PB-003 | UOW-03 | Manage stores and income sources |
| HU-006 | PB-004 | UOW-04 | Record a fast manual expense |
| HU-009 | PB-005 | UOW-04 | Record and manage income |
| HU-010 | PB-006 | UOW-04 | Transfer money between accounts |
| HU-007 | PB-004 | UOW-05 | Add optional receipt and item detail |
| HU-008 | PB-004 | UOW-05 | View, correct, or permanently delete an expense |
| HU-011 | PB-007 | UOW-05 | Search and filter transaction history |
| HU-012 | PB-008 | UOW-06 | Review the basic financial dashboard |
| HU-013 | PB-009 | UOW-07 | Natural-text financial capture |
| HU-014 | PB-009 | UOW-07 | Audio financial capture |
| HU-015 | PB-010 | UOW-07 | Rapid expense proposal from a receipt photo |
| HU-016 | PB-011 | UOW-08 | Manage a spending budget and dashboard progress |

## Unit Coverage Summary

| Unit | Enablers | Deterministic/manual stories | AI speed stories |
|---|---:|---:|---:|
| UOW-01 | 6 | 1 | 0 |
| UOW-02 | 0 | 1 | 0 |
| UOW-03 | 0 | 3 | 0 |
| UOW-04 | 0 | 3 | 0 |
| UOW-05 | 0 | 3 | 0 |
| UOW-06 | 0 | 1 | 0 |
| UOW-07 | 0 | 0 | 3 |
| UOW-08 | 0 | 1 | 0 |
| Total | 6 | 13 | 3 |

## Traceability Rules

- docs/BACKLOG-AND-STORIES.md remains the identifier authority.
- aidlc-docs/inception/user-stories/stories.md remains the detailed acceptance/invariant source.
- This file owns only the mapping from approved identifiers to construction units.
- Trello should copy these identifiers and unit labels without renumbering.
- Story points remain a team Planning Poker decision and are not assigned here.

## Completeness Result

- Every EN-001 through EN-006 appears exactly once.
- Every HU-001 through HU-016 appears exactly once.
- Twelve foundation stories precede the three AI speed stories; the budget story follows.
- No frontend/backend layer work is represented as an artificial user story.
