# Delivery Sequence and Sprint Planning — Finance AI

## Status

This is a dependency-aware release sequence, not a unilateral sprint commitment. The team decides sprint length, capacity, assignments, and story points together. Stable identifiers come from `docs/BACKLOG-AND-STORIES.md`.

## Release Gates

1. Manual forms and deterministic financial behavior must work without an AI provider.
2. Each story must meet Definition of Ready before Planning Poker and sprint commitment.
3. HU-015/HU-016 cannot enter a sprint until HU-001–HU-014 form a stable manual MVP.
4. AI may only propose data for existing forms; user confirmation and normal validation remain mandatory.

## Recommended Sequence

| Iteration | Outcome | Candidate work |
|---|---|---|
| Foundation | A clean, repeatable vertical-development baseline | EN-001–EN-006 |
| Identity | A user can register, log in, restore/revoke a session, and set defaults | HU-001–HU-003 |
| Financial structure | A user has accounts/currencies and owned catalogs | HU-004–HU-006 |
| Manual movements | A user can record the three essential money movements | HU-007, HU-010, HU-011 |
| Detail and history | A user can add optional detail, correct expenses, and review unified activity | HU-008, HU-009, HU-012 |
| Planning and overview | A user can create budgets and understand current finances | HU-013, HU-014 |
| Optional AI — later | Existing forms can be prefilled from photo, audio, or text | HU-015, HU-016 |

The team may move a ready story within adjacent iterations when dependencies, capacity, and integration risk permit. It must not renumber the story.

## Foundation Before HU-001

HU-001 is the first product story. Its implementation depends on foundations that remain separate enablers:

- EN-001 establishes repository and quality conventions.
- EN-002 supplies repeatable API/database startup.
- EN-003 supplies the user/default-catalog migration and seed behavior.
- EN-004 fixes the registration/authentication contract and common errors.
- EN-005 supplies the Flutter route, theme, and common form states.
- EN-006 makes checks repeatable from the beginning.

These enablers can be divided across the team and demonstrated through a clean setup plus a thin end-to-end registration path. They are not added to HU-001's story points.

## HU-001 Planning Slice

The first vertical story should include only:

- Register screen and validation states
- Versioned registration request/response behavior
- Normalized-email uniqueness
- Adaptive password hashing
- Atomic creation of user plus owned default catalogs
- Success message and redirect to Login
- Failure, duplicate-submit, ownership, and secret-handling tests

Login/session behavior begins in HU-002.

## Suggested Team Planning Session

1. Confirm sprint length, capacity, roles, and Definition of Done.
2. Review EN-001–EN-006 and split ownership without creating separate identifier systems.
3. Verify HU-001 meets Definition of Ready.
4. Estimate enablers and HU-001 with Planning Poker.
5. Commit only work that fits demonstrated team capacity.
6. Put remaining ready items back in the ordered backlog.

## Risks to Watch

| Risk | Planning response |
|---|---|
| Foundation work hides inside HU-001 | Track EN work separately and keep HU-001 outcome-focused |
| Flutter/API work diverges | Approve EN-004 contract before parallel implementation |
| Seed creation partially fails | Require one database transaction and rollback tests |
| Sessions are oversimplified | Treat login, renewal, revocation, and logout as HU-002 |
| Currency totals become misleading | Preserve currency and group incompatible totals |
| AI distracts from the MVP | Do not configure or schedule product AI before the manual release gate |

## Milestone Demonstrations

- Identity: register, log in, restore session, log out, change preference.
- Financial structure: create/archive accounts and owned catalogs.
- Manual movements: expense, income, and transfer update the correct balances.
- Detail/history: edit/archive behavior and filters preserve history and currencies.
- Planning/overview: budget progress and dashboard calculations are deterministic.
- Optional AI: provider output is an editable proposal; manual flows still work when it fails.
