# Finance AI — Delivery Queue

## Current Status

UOW-01 and UOW-02 are executable and verified: the shared Android/Windows Flutter client now supports registration, login, secure session restoration, protected Home, and logout through FastAPI and PostgreSQL. The approved direction remains a complete manual budgeting application followed by optional AI assistance that pre-fills the same forms.

Personal defaults and all financial/AI stories remain unimplemented. HU-003 is the next dependency-ordered unit and keeps its own design and implementation gate.

## Documentation Baseline

- [x] Clarify the manual-first product boundary and defer AI.
- [x] Define accounts, expenses, optional receipt/items, income, transfers, budgets, activity, and dashboard.
- [x] Reconcile the conceptual model and PostgreSQL reference schema.
- [x] Reconcile modular-monolith architecture and technology direction.
- [x] Specify manual-first screens and mark the chat-first HTML mockup as historical.
- [x] Register PB-001–PB-011, HU-001–HU-016, and EN-001–EN-006.
- [x] Replace the AI-first sprint order with a dependency-aware delivery sequence.
- [ ] Team reviews and approves the reconciled documentation baseline.

## Decisions the Team Must Make Before Construction

- [ ] Confirm the technology proposal with the professor/team.
- [ ] Agree sprint length, meeting/review cadence, and communication channel.
- [ ] Assign responsibilities while keeping shared review and integration ownership.
- [ ] Finalize Definition of Ready and Definition of Done.
- [ ] Estimate ready EN/HU work using team Planning Poker.
- [ ] Decide how Trello mirrors the canonical identifiers without redefining stories.
- [ ] Create a new manual-first visual prototype for the required screens.

## Ordered Construction Queue

### Foundation

- [x] EN-001 — Monorepo and quality baseline
- [x] EN-002 — Local infrastructure
- [x] EN-003 — Database migration and seed baseline
- [x] EN-004 — API contract baseline
- [x] EN-005 — Flutter application foundation
- [x] EN-006 — Continuous quality baseline

### Identity and Preferences

- [x] HU-001 — Register an account
- [x] HU-002 — Login, session restoration, and logout
- [ ] HU-003 — Personal defaults

### Financial Structure

- [ ] HU-004 — Accounts and currencies
- [ ] HU-005 — Categories and subcategories
- [ ] HU-006 — Payment methods and income sources

### Manual Money Management

- [ ] HU-007 — Manual expense
- [ ] HU-008 — Optional receipt and item detail
- [ ] HU-009 — Correct/archive expense
- [ ] HU-010 — Income
- [ ] HU-011 — Transfer
- [ ] HU-012 — Activity and filters
- [ ] HU-013 — Budgets
- [ ] HU-014 — Dashboard

### Optional AI — Deferred Until the Manual MVP Is Complete

- [ ] HU-015 — Receipt-photo form proposal
- [ ] HU-016 — Audio/text form proposal

## First Work Package — Complete

EN-001–EN-006 and HU-001 are implemented as a thin registration flow across Flutter, FastAPI, and PostgreSQL. Verification evidence is in `aidlc-docs/construction/uow-01-foundation-registration/code/code-summary.md`.

HU-001 must not absorb repository setup, Docker Compose, the entire database, login/session behavior, or AI. Its acceptance criteria and exclusions are in `docs/BACKLOG-AND-STORIES.md`.

## Second Work Package — Complete

HU-002 implements independent secure sessions for Android and Windows: login, short-lived access credentials, rotating renewable credentials, app-start restoration, protected Home, and offline-safe logout. The API stores only renewable-credential hashes and rejects replay. Verification evidence is in `aidlc-docs/construction/uow-02-secure-sessions/code/code-summary.md`.

## Reference Map

| Concern | Canonical document |
|---|---|
| Product context | `docs/CONTEXT.md` |
| Scope and exclusions | `docs/ALCANCE.md` |
| Feature phases | `docs/FEATURES.md` |
| Data design | `docs/SCHEMA.md` |
| Technology direction | `docs/STACK.md` |
| Architecture and flows | `docs/ARCHITECTURE.md` |
| Screen direction | `docs/MOCKUPS.md` |
| Identifier registry | `docs/BACKLOG-AND-STORIES.md` |
| Delivery sequence | `docs/SPRINT-PLAN.md` |
| Detailed acceptance scenarios | `aidlc-docs/inception/user-stories/stories.md` |

## Explicitly Not Yet

- Production deployment
- Product AI provider selection or API key
- Bank synchronization, live exchange rates, calendar integration, or autonomous actions
