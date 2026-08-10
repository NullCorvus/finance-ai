# Finance AI Tracker — Pre-Semester Plan

> **Goal:** Everything planned before the semester starts — clear idea, ready to execute.

---

## Main Objective

Have these ready before the semester: scope defined, DB designed, mockups drawn, features prioritized, stack decided, and tools learned. **Zero code.** Planning only.

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
- [ ] Backend: Django or FastAPI? Define with reasoning
- [ ] Frontend: React, plain HTML+JS, or mobile?
- [ ] Database: PostgreSQL or SQLite?
- [ ] AI: OpenAI, Claude, or local?
- [ ] Deploy: Docker, cloud, or both?

**Status:** ON HOLD — Cannot be decided yet. The project type (web app, Android app, web + Telegram, etc.) must be defined by the teacher first. Tech stack depends on platform choice.

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
- [ ] Define how spending limits are created — settings UI (MVP) + chat via agent (Phase 3)
- [ ] Define how spending limits are created — settings UI (MVP) + chat via agent (Phase 3)

**Estimated time:** 1 day

---

### Step 5 — Draw the architecture
> Guide: `docs/guides/architecture-diagrams-guide.md` — read it first; all stages below follow it.

#### Stage 1 — Guide
- [x] Save architecture guide → `docs/guides/architecture-diagrams-guide.md`

#### Stage 2 — Plan (guide §1: "What to define BEFORE drawing")
- [x] Q1: actors — only the regular user (admin excluded by decision)
- [x] Q2: system boundary — inside: API, agent, DB, storage; outside: user, LLM provider
- [x] Q3: containers — Client, API (agent merged inside), DB, File Storage
- [x] Q4: modules per container — Auth, Expense, Income, AI Agent/Tools, Chat (guide §1 Q4)
- [x] Q5: data stores — main DB (11 tables) + file storage (guide §1 Q5)
- [x] Q6: journeys — register expense + ask the AI (guide §1 Q6)
- [x] Q7: open decisions — interface, stack, price source (guide §1 Q7)

#### Stage 3 — Layer diagram (guide §5)
- [x] Mermaid flowchart — one subgraph per layer, `[( )]` DBs, labeled arrows, TBD where open → `docs/ARCHITECTURE.md`
- [x] Validate diagram renders — done via Zed mermaid viewer (zero errors)

#### Stage 4 — Component diagram (guide §6)
- [ ] C4Component — Auth, Expenses, Income, AI Agent/Tools, Chat, File Storage
- [ ] Validate in mermaid.live (guide §9)

#### Stage 5 — Data flow (guide §7 + §4)
- [ ] DFD 1: register expense — confirm/edit/discard loop (guide §7)
- [ ] DFD 2: ask the AI — tool calls → DB → answer/chart (guide §7, §4)
- [ ] Validate in mermaid.live (guide §9)

#### Stage 6 — Document
- [ ] Finalize `docs/ARCHITECTURE.md` — 3 diagrams + pending decisions, marked PROPOSAL (built incrementally from Stage 3; guide §9 checklist)

#### Stage 7 — Validation (guide §9 checklist)
- [ ] Every box has a label describing a responsibility (not a brand)
- [ ] Every arrow has a label (protocol or data name) — no naked arrows
- [ ] External entities (users, LLM provider) are outside the boundary
- [ ] No bidirectional arrows unless the flow really goes both ways
- [ ] TBD annotations list candidate technologies
- [ ] All diagrams render with zero warnings (mermaid.live or IDE mermaid viewer)
- [ ] File storage container present (receipt.image path → storage box)
- [ ] Confirmation loop preview → confirm / edit / discard present in the DFD

**Estimated time:** 1 day

---

### Step 6 — Learn the tools
- [ ] AI-DLC: understand the 3 phases (Inception, Construction, Operations)
- [ ] OpenCode (Codex CLI): how to use with AGENTS.md
- [ ] Antigravity: how it works
- [ ] Docker basics: container, Dockerfile, docker-compose

**Estimated time:** 2-3 days

---

### Step 7 — Mockups / visual prototype
- [ ] Expense upload screen (photo, audio, text)
- [ ] Expense review/confirmation screen
- [ ] Dashboard with expenses (graphs, table)
- [ ] Chat with AI
- [ ] Settings (categories, spending limits)

**Estimated time:** 1-2 days

---

### Step 8 — When the stack is defined (post-semester)
> This step exists so nothing stack-dependent is forgotten when the professor
> defines the platform/stack. It resolves the ON HOLD items of Step 2.

- [ ] Review every doc for "TBD" / "to define" / "candidate" leftovers and resolve them
- [ ] Replace TBD labels in the architecture diagrams with the real stack (guide §9)
- [ ] Define the auth mechanism (sessions vs tokens) for the chosen framework
- [ ] Define where receipt images are stored (local disk vs object storage)
- [ ] Define the price-source decision (Phase 3 supermarket prices)
- [ ] Choose the interface (web / Telegram / app) and update the Client container
- [ ] Write `docs/STACK.md` with final decisions + reasoning

---

## Suggested Order

```
Week 1                    Week 2                    Week 3
┌──────────────┐         ┌──────────────┐          ┌──────────────┐
│  Step 1      │         │  Step 3      │          │  Step 5      │
│  Scope       │────→    │  DB schema   │────→     │  Architecture│
│              │         │              │          │              │
│  Step 2      │         │  Step 4      │          │  Step 6      │
│  Stack       │         │  Features    │          │  Tools       │
└──────────────┘         └──────────────┘          │              │
                                                    │  Step 7      │
                                                    │  Mockups     │
                                                    └──────────────┘
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
- ❌ Don't formally assemble the team (you don't know teammates yet)
- ❌ Don't use university-specific document formats (each professor has their own)
- ❌ Don't deploy to production

---

## Progress

- [x] Step 1: Scope defined
- [~] Step 2: Stack decided → ON HOLD (waiting for teacher to define project type)
- [~] Step 3: DB designed → Stages 1-2 complete + SQL written (`docs/schema.sql`)
- [x] Step 4: Features prioritized
- [ ] Step 5: Architecture drawn
- [ ] Step 6: Tools learned
- [ ] Step 7: Mockups ready
- [ ] Step 8: Post-stack sweep (when the professor defines the stack)
