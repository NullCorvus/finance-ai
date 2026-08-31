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

### Step 5 — Draw the architecture
> Guide: `docs/guides/architecture-diagrams-guide.md` — read it first; all stages below follow it.

#### Stage 1 — Guide
- [x] Save architecture guide → `docs/guides/architecture-diagrams-guide.md`

#### Stage 2 — Plan (guide §1: "What to define BEFORE drawing")
- [x] Q1: actors — only the regular user (admin excluded by decision)
- [x] Q2: system boundary — inside: API (incl. AI parsing), DB, storage; outside: user, LLM provider
- [x] Q3: containers — Android app (thin client), API (parsing merged inside, on VM), DB, File Storage
- [x] Q4: modules per container — Auth, Expense, Income, AI Parsing (core); AI Agent/Tools + Chat (optional Phase 3) (guide §1 Q4)
- [x] Q5: data stores — main DB (11 tables) + file storage (guide §1 Q5)
- [x] Q6: journeys — register expense (core) + ask the AI (optional Phase 3) (guide §1 Q6)
- [x] Q7: open decisions — interface (Android proposal), stack, price source (Phase 3 only) (guide §1 Q7)

#### Stage 3 — Layer diagram (guide §5)
- [x] Mermaid flowchart — one subgraph per layer, `[( )]` DBs, labeled arrows, TBD where open → `docs/ARCHITECTURE.md`
- [x] Validate diagram renders — done via Zed mermaid viewer (zero errors)

#### Stage 4 — Component diagram (guide §6)
- [x] C4Component — Auth, Expenses, Income, AI Parsing (core); AI Agent/Tools + Chat (optional Phase 3), File Storage → `docs/ARCHITECTURE.md`
- [x] Validate diagram renders — done via Zed mermaid viewer (zero errors)

#### Stage 5 — Data flow (guide §7 + §4)
- [x] DFD 1: register expense — confirm/edit/discard loop (guide §7) → `docs/ARCHITECTURE.md`
- [x] DFD 2: ask the AI — tool calls → DB → answer/chart (guide §7, §4) → `docs/ARCHITECTURE.md` (marked OPTIONAL Phase 3)
- [x] Validate diagrams render — both DFDs validated (syntax checked in review 2026-08-19; final visual check in Zed)

#### Stage 6 — Document
- [x] Finalize `docs/ARCHITECTURE.md` — 3 diagrams + pending decisions, marked PROPOSAL (built incrementally from Stage 3; guide §9 checklist)

#### Stage 7 — Validation (guide §9 checklist)
- [x] Every box has a label describing a responsibility (not a brand)
- [x] Every arrow has a label (protocol or data name) — no naked arrows
- [x] External entities (users, LLM provider) are outside the boundary
- [x] No bidirectional arrows unless the flow really goes both ways
- [x] TBD annotations list candidate technologies
- [x] All diagrams render with zero warnings (mermaid.live or IDE mermaid viewer)
- [x] File storage container present (receipt.image path → storage box)
- [x] Confirmation loop preview → confirm / edit / discard present in the DFD

**Estimated time:** 1 day

---

### Step 7 — Mockups / visual prototype
> Interactive mockup: `docs/mockups/index.html` (autocontenido, abre en navegador, tabs clicables). Rediseño: la app usa un hub único de Gastos (no hay chat en el core ni pantalla de revisión separada). Prioridad de captura: foto > voz > texto. Las vías foto, voz y texto natural usan AI para devolver JSON y mostrar Confirmar/Editar/Descartar; el formulario manual bypasses AI y guarda directamente tras validar. Los motivos son campos opcionales.
- [x] Expense capture screen (photo, audio, natural-language text) — en el hub Gastos: botón obturador 📷 + 🎙 + campo texto
- [x] Expense review/confirmation screen — tarjeta IA editable con todos los items + Confirmar/Editar/Descartar
- [x] Dashboard with expenses (graphs, table) — cards + gráfica de barras + tabla
- [x] AI-assisted capture — fusionado en Gastos (la captura devuelve JSON y usa Confirmar/Editar/Descartar); conversación libre con el agente = Phase 3
- [x] Settings (categories, spending limits) — categorías; límites marcados FASE 3/opcional

**Estimated time:** 1-2 days

---

### Step 8 — Post-stack cleanup (stack already defined in `docs/STACK.md`)
- [x] Define the auth mechanism → **JWT** (decided in `docs/STACK.md`)
- [x] Define where receipt images are stored → **local disk on VM** (decided)
- [x] Choose the interface → **Flutter, Android for now** (decided)
- [x] Write `docs/STACK.md` with final decisions + reasoning (done)
- [ ] Review every doc for "TBD" / "to define" / "candidate" leftovers and resolve them
- [ ] Replace TBD labels in the architecture diagrams with the real stack (guide §9)
- [ ] Price-source decision (Phase 3 supermarket prices) — only if Phase 3 is built

---

### Step 9 — Define the team workflow (methodology, roles, kanban)
> How we work as a group — decide before/at semester start, with the team (and the professor where it matters).

- [ ] Define/refine the work methodology — keep CDIO + Scrum as-is, or modify Scrum to fit the team (sprint length, planning, reviews, definition of done)
- [ ] Define roles and responsibilities per member (backend/FastAPI, Flutter, AI/LLM, DB, testing, docs, kanban/PM)
- [ ] Reorganize the stages in this file so the most important tasks come first (dependencies → high value → low value)
- [ ] Define the general way of working: meeting cadence, task assignment, review process, communication channel, how decisions get recorded
- [ ] Research the **Trello API** (or another kanban) integration and build a **shared skill** the whole group can use so agents document/update the board easily (create/move cards, log progress from agent output)

**Estimated time:** 2-3 days

---

### Step 10 — Resolve design gaps (from review 2026-08-19)

> Found during the docs consistency review. Decide each BEFORE writing code (construction phase).

- [x] **User preferred display currency** — DECIDED: add `"user".preferred_currency_id INTEGER REFERENCES currency(id)` (nullable; app falls back to "COP"). Stores the user's *display preference* only — original amounts + currency stay the truth. Applied to `docs/schema.sql` + `docs/SCHEMA.md` (2026-08-23).
- [x] **Receipt payment method + currency capture path** — DECIDED: AI infers payment method + currency from the receipt, shown as editable **Pago** + **Moneda** fields on the confirmation card (defaults "Efectivo" / "COP"). No schema change (columns already NOT NULL). Applied to `docs/ALCANCE.md` + mockup (2026-08-23).
- [x] **Audio → text (STT)** — DECIDED: Gemini parses audio natively — voice input is sent as audio and the same model call transcribes + extracts the structured expense (one call, no separate STT service). Fallback if quality/latency fails: separate server-side STT feeding the same parse prompt. Verified in construction with a real voice memo. Applied to `docs/STACK.md` (2026-08-23).
- [x] (Minor) **UNIQUE on `paymentmethod.name` and `incomesource.name`** — DECIDED: add UNIQUE constraints to `docs/schema.sql` (applied 2026-08-23).
- [x] **Data protection details** — DECIDED: core = confirmation gate only, **no audit table**; audit_log + agent-write confirm flow = Phase 3 only (created in construction only if Phase 3 is built). "Not in scope": deleted-row retention, data export, GDPR-style right-to-be-forgotten. Applied to `docs/ALCANCE.md` (2026-08-23).

**Estimated time:** 1 day (decisions, no code)

---

## Suggested Order

```
Week 1                    Week 2                    Week 3
┌──────────────┐         ┌──────────────┐          ┌──────────────┐
│  Step 1      │         │  Step 3      │          │  Step 5      │
│  Scope       │────→    │  DB schema   │────→     │  Architecture│
│              │         │              │          │              │
│  Step 2      │         │  Step 4      │          │  Step 7      │
│  Stack       │         │  Features    │          │  Mockups     │
└──────────────┘         └──────────────┘          └──────────────┘

Steps 8–10 (cleanup, workflow, design gaps) are decisions — do them in parallel or as needed.
```

---

## Deliverables

| File | Purpose |
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
