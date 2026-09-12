# Finance AI — Delivery Queue

## Current Status

The three-repository foundation is operational. EN-001–EN-006 and HU-001–HU-003 are implemented and verified.

The product direction balances two requirements:

- Financial rules and manual operations must be dependable before AI uses them.
- AI is the key differentiator and must make capture materially faster once that foundation exists.

## Completed

- [x] EN-001 — Repository separation and quality baseline
- [x] EN-002 — Local infrastructure
- [x] EN-003 — Database migration and seed baseline
- [x] EN-004 — API contract baseline
- [x] EN-005 — Flutter application foundation
- [x] EN-006 — Continuous quality baseline
- [x] HU-001 — Register an account
- [x] HU-002 — Login, session restoration, renewal, and logout
- [x] HU-003 — Accounts and currencies

## Deterministic Foundation — Next

- [ ] HU-004 — Categories, including permanent deletion
- [ ] HU-005 — Stores and income sources
- [ ] HU-006 — Fast manual expense
- [ ] HU-007 — Optional receipt and item detail
- [ ] HU-008 — View, correct, and permanently delete an expense
- [ ] HU-009 — Income
- [ ] HU-010 — Transfer
- [ ] HU-011 — Transaction history and filters
- [ ] HU-012 — Basic financial dashboard

## AI Speed Layer

- [ ] HU-013 — Natural-text financial proposal
- [ ] HU-014 — Audio financial proposal
- [ ] HU-015 — Rapid expense proposal from a receipt photo

These stories begin after HU-001–HU-012 are stable. They use the same validated transaction contracts and optimize for a compact “This is what I understood” glance with one-tap acceptance.

## Budgets and Visibility

- [ ] HU-016 — Flexible category budgets and dashboard progress

## Team Decisions

- [ ] Estimate ready stories through Planning Poker.
- [ ] Agree sprint length, review cadence, responsibilities, and Definition of Done.
- [ ] Decide how Trello mirrors canonical PB/HU identifiers.
- [ ] Review and approve the consolidated documentation baseline.
- [ ] Replace the historical AI-first HTML prototype with a visual prototype matching the current foundation-first, speed-centered flow.

## Canonical References

| Purpose | File |
|---|---|
| Product context | `docs/CONTEXT.md` |
| Scope and boundaries | `docs/ALCANCE.md` |
| Feature phases | `docs/FEATURES.md` |
| Requirements | `aidlc-docs/inception/requirements/requirements.md` |
| Backlog identifiers | `docs/BACKLOG-AND-STORIES.md` |
| Acceptance scenarios | `aidlc-docs/inception/user-stories/stories.md` |
| Delivery order | `docs/SPRINT-PLAN.md` |
| Data model | `docs/SCHEMA.md` |
| dbdiagram.io draft | `docs/finance-ai-draft.dbml` |
| Architecture | `docs/ARCHITECTURE.md` |
| Current screen direction | `docs/MOCKUPS.md` |

Detailed decisions and completed construction evidence remain in `aidlc-docs/`; they do not redefine current product scope.
