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

> This schedule is synchronized with `docs/BACKLOG-AND-STORIES.md` as of 2026-08-30.
> Infrastructure setup is pre-Sprint 1 work, not a user story.

### Sprint 1 — Authentication
| Tarea/HU | Prioridad |
|----------|-----------|
| HU-001: Register | Alta |
| HU-002: Login | Alta |

### Sprint 2 — Manual expense foundation
| Tarea/HU | Prioridad |
|----------|-----------|
| HU-003: Create expense manually | Media |
| HU-004: Edit & delete my expenses | Media |
| HU-005: Find my expenses | Media |

### Sprint 3 — AI-assisted capture
| Tarea/HU | Prioridad |
|----------|-----------|
| HU-006: Photo receipt happy path | Alta |
| HU-007: Photo capture failure paths | Alta |
| HU-008: Natural-language text → AI parse | Media |

### Sprint 4 — Future scope (definitions pending)
| Tarea/HU | Prioridad |
|----------|-----------|
| HU-009: Audio → AI parsing + categorization | Media — pendiente de definición |
| HU-010: Dashboard by category + date filter | Media — pendiente de definición |
| Pruebas funcionales | Tarea |
| Encuesta de usabilidad | Tarea |
