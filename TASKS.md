# Finance AI Tracker — Pre-Semester Plan

> **Goal:** Everything planned before the semester starts — clear idea, ready to execute.

---

## Main Objective

Have these ready before the semester: scope defined, DB designed, mockups drawn, features prioritized, stack decided. **Zero code.** Planning only.

---

## Tasks

### Step 1 — Define exact scope
- [x] List core features
- [x] List secondary features (nice-to-have)
- [x] List what the project WON'T do (important for the professor)
- [x] Write scope docs: `docs/ALCANCE.md`, `docs/FEATURES.md`, `docs/CONTEXT.md`

**Estimated time:** 1 day

---

### Step 2 — Research and decide the tech stack
- [x] Backend: **FastAPI (Python)** — team knows Python; lean async JSON API (decided 2026-08-17)
- [x] Frontend: **Flutter (Dart)** — team proposal: mobile (matches PGC title), hot reload, strong AI codegen
- [x] **Target platform: Android only for now** (decided 2026-08-19) — Flutter builds Android + iOS + web from one codebase, but we ship Android only. iOS/web possible later with no rewrite (kept as fallback for the demo).
- [x] Database: **PostgreSQL** — matches `docs/schema.sql`
- [x] AI: **Google Gemini flash** (free tier, vision) — server-side only; OpenCode Go / Command Code GOAT / OpenCode Zen documented as interchangeable options in `docs/STACK.md`
- [x] Deploy: **VM + Docker Compose** (separate API + Postgres containers)

**Status:** ✅ DECIDED (as PROPOSAL) 2026-08-17 — full rationale in `docs/STACK.md`. Interface still subject to professor confirmation at semester start; if it changes, redo Step 8 sweep.

**Estimated time:** 2-3 days

---

### Step 3 — Design the database
#### Stage 1 — Domain Level (Entities & Relationships)
- [x] Identify core entities (User, Role, Expense, Category, Subcategory, Receipt, SpendingLimit, Currency, Income, IncomeSource, PaymentMethod)
- [x] Define entity relationships (verbs: tiene, registra, pertenece a, etc.)
- [x] Draw domain-level diagram (names only, no attributes)
- [x] Document in `docs/SCHEMA.md`

**Status:** ✅ COMPLETE — 11 entities identified with relationships

#### Stage 2 — Analysis Level (Attributes & Constraints)
- [x] Add attributes with types to each entity
- [x] Define cardinalities (1, *, 0..1, 1..*)
- [x] Add relationship labels
- [x] Define constraints ({unique}, {nullable}, {encrypted})
- [x] Define indexes
- [x] Update `docs/SCHEMA.md` with analysis-level diagram

**Status:** ✅ COMPLETE — all 11 entities locked with attributes, constraints, and indexes

#### Final Deliverable
- [x] Write schema in SQL or Python models → `docs/schema.sql` (PostgreSQL) ✅

**Rule:** Design it yourself. AI only writes the code after.

**Estimated time:** 1 day

---

### Step 4 — Define features with priorities
- [x] List core features
- [x] List secondary features (nice-to-have)
- [x] Prioritize by build phases
- [x] Cover edge cases (what if AI doesn't understand the receipt?)
- [x] Move agent/chat features to Phase 3 (optional ideas) — core = Android app + backend, AI only for input parsing
- [x] Define how spending limits are created — settings UI (Phase 3), not chat (agent is optional)

**Estimated time:** 1 day

---

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
| `docs/CONTEXT.md` | Project context (university, course, constraints) |
| `docs/ALCANCE.md` | Scope: core features, design decisions, interface approach |
| `docs/STACK.md` | Tech stack with reasoning for each decision |
| `docs/SCHEMA.md` | ER diagram + table definitions |
| `docs/FEATURES.md` | Feature list with build-phase priorities |
| `docs/ARCHITECTURE.md` | Architecture diagrams and data flow |
| `docs/MOCKUPS.md` | Wireframes / visual prototypes |

---

## What NOT to do before the semester

- ❌ Don't write code (the professor may change the stack or scope)
- ❌ Don't use university-specific document formats (each professor has their own)
- ❌ Don't deploy to production

---

## Progress

- [x] Step 1: Scope defined
- [x] Step 2: Stack decided (PROPOSAL) → `docs/STACK.md` (Flutter Android-first, FastAPI, PostgreSQL, Gemini flash, JWT, local disk)
- [x] Step 3: DB designed → 11 entities locked + SQL written (`docs/schema.sql`)
- [x] Step 4: Features prioritized
- [x] Step 5: Architecture drawn → `docs/ARCHITECTURE.md` (layer, component, 2 DFDs)
- [x] Step 7: Mockups ready → `docs/mockups/index.html` (interactive, 3 screens) + `docs/MOCKUPS.md`
- [~] Step 8: Post-stack cleanup → auth/storage/interface/STACK.md resolved; TBD sweep + price source pending
- [ ] Step 9: Team workflow to define (methodology/Scrum, roles, stage reorder, Trello API + shared skill) — 2026-08-19
- [x] Step 10: Design gaps resolved → 5 decisions documented + applied to `schema.sql`, `SCHEMA.md`, `ALCANCE.md`, `STACK.md`, mockup (2026-08-23)
