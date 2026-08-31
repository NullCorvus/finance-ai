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
| HU-003 | PB-002 | UOW-02 | Manage personal defaults |
| HU-004 | PB-003 | UOW-03 | Manage financial accounts |
| HU-005 | PB-004 | UOW-03 | Manage categories and subcategories |
| HU-006 | PB-004 | UOW-03 | Manage payment methods and income sources |
| HU-007 | PB-005 | UOW-04 | Record a manual expense |
| HU-010 | PB-006 | UOW-04 | Record and manage income |
| HU-011 | PB-007 | UOW-04 | Transfer money between accounts |
| HU-008 | PB-005 | UOW-05 | Add optional receipt and item detail |
| HU-009 | PB-005 | UOW-05 | Correct or archive an expense |
| HU-012 | PB-008 | UOW-05 | Review and filter financial activity |
| HU-013 | PB-009 | UOW-06 | Manage a spending budget |
| HU-014 | PB-010 | UOW-06 | Review the budget dashboard |
| HU-015 | PB-011 | UOW-07 | Prefill an expense from a receipt photo |
| HU-016 | PB-011 | UOW-07 | Prefill a financial form from audio or text |

## Unit Coverage Summary

| Unit | Enablers | Manual stories | Deferred AI stories |
|---|---:|---:|---:|
| UOW-01 | 6 | 1 | 0 |
| UOW-02 | 0 | 2 | 0 |
| UOW-03 | 0 | 3 | 0 |
| UOW-04 | 0 | 3 | 0 |
| UOW-05 | 0 | 3 | 0 |
| UOW-06 | 0 | 2 | 0 |
| UOW-07 | 0 | 0 | 2 |
| Total | 6 | 14 | 2 |

## Traceability Rules

- docs/BACKLOG-AND-STORIES.md remains the identifier authority.
- aidlc-docs/inception/user-stories/stories.md remains the detailed acceptance/invariant source.
- This file owns only the mapping from approved identifiers to construction units.
- Trello should copy these identifiers and unit labels without renumbering.
- Story points remain a team Planning Poker decision and are not assigned here.

## Completeness Result

- Every EN-001 through EN-006 appears exactly once.
- Every HU-001 through HU-016 appears exactly once.
- Fourteen manual stories precede the two deferred AI stories.
- No frontend/backend layer work is represented as an artificial user story.
