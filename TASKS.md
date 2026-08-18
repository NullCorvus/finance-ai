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
- [x] Backend: **FastAPI (Python)** — team knows Python; lean async JSON API (decided 2026-08-17)
- [x] Frontend: **Flutter (Dart)** — team proposal: mobile (matches PGC title), hot reload, strong AI codegen
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
- [ ] Validate diagrams render — open `docs/ARCHITECTURE.md` in Zed and check both DFDs render (zero errors)

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
> Interactive mockup: `docs/mockups/index.html` (autocontenido, abre en navegador, tabs clicables). Rediseño: la app ES un chat (Inicio=chat, no hay tab Chat ni pantalla de revisión aparte). Prioridad de captura: foto > voz > texto. Confirmar/Editar/Descartar con todos los items del recibo. Motivo (opcional) vía modo "Respondiendo a…".
- [x] Expense upload screen (photo, audio, text) — en el chat (Inicio): botón obturador 📷 + 🎙 + campo texto
- [x] Expense review/confirmation screen — tarjeta IA editable con todos los items + Confirmar/Editar/Descartar
- [x] Dashboard with expenses (graphs, table) — cards + gráfica de barras + tabla
- [x] Chat with AI — fusionado en Inicio (el chat ES la captura/confirmación); conversación libre = Phase 3
- [x] Settings (categories, spending limits) — categorías; límites marcados FASE 3/opcional

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
- [ ] Define data protection details — agent write confirmation + audit log (see `docs/ALCANCE.md` "Data Protection", FEATURES 20)

---

### Step 9 — Formato PGC (submission)
> Guide: `/home/d3ad/codigos/proyecto_grado/guia_paso_a_paso.md`. Rules: **tú decides, la IA redacta**.
> Flow: **interview → decide → approve → draft one section at a time → checklist → paste into the form → radicate**.
> Semestre 2026-2 (clases: 10 ago – 28 nov). Radicación semana 5 ≈ **7–11 sep**. Ciclo II — Profundización.

- [x] 9.1 DATOS GENERALES en `latex/pgc/main.tex` — programa (Ingeniería de Sistemas y Computación), sede (Facatativá), tipo (Proyecto Tecnológico), ciclo (II — Profundización), 3 integrantes con correos
- [x] 9.2 Título — con IA, máx 20–25 palabras: (a) qué se construye, (b) cómo, (c) para qué (guía §2). ⚠️ Si promete IA, el producto final DEBE demostrarla — en `main.tex`: "Aplicación móvil para el registro y análisis de gastos personales con asistencia de IA para la captura automática de recibos" (20 palabras)
- [x] 9.3 Problema — situación → cifra verificada → consecuencia → pregunta problema (guía §3) — v5 aprobado: retención 4,2 % a 30 días en apps de finanzas (Curry 2026, verificado), mediana 59–66 días hábitos de salud (Singh et al. 2024), 66,6 % digital (Banca de las Oportunidades 2024)
- [x] 9.4 Justificación — 4 razones: ahora / útil (beneficiarios: estudiantes UdeC piloto + público general) / diferente (captura foto-voz-texto con confirmación) / viable (bajo costo, niveles gratuitos) (guía §4)
- [x] 9.5 Objetivos — 1 general (UN solo verbo: desarrollar/diseñar/construir/implementar) + 4–5 específicos, uno por fase CDIO, verificables con sí/no (guía §5) — aprobado 2026-08-17, en `main.tex` (5 específicos, E5 = funcionales + encuesta piloto); revisión: E3 = captura IA foto/voz/texto (manual fuera del objetivo), E5 encuesta = usabilidad/aceptación (no hábito)
- [ ] 9.6 Marco referencial + CADIs — completar a mano; verificar CADIs con el coordinador (NO inventar nombres) (guía §0, #9)
- [ ] 9.7 Metodología CDIO + cronograma 2026-2 — concebir (1–3), diseñar (4–7), implementar (8–11), operar (12–16); fechas reales del semestre (guía §6)
- [x] 9.8 Productos esperados — marcar en `main.tex`: Software ✓ · Prototipo ✓ (verificar contra el formato) — marcados con ✗ (boxtimes) 2026-08-17; revisión: solo Software + Prototipo (Documento síntesis y Póster-Ponencia quedan sin marcar)
- [x] 9.9 Referencias — 5 fuentes verificadas en `main.tex` (Business of Apps 2026, Banca de las Oportunidades 2024, Singh et al. 2024, Google Document AI + Gemini pricing); descartadas: Apptopia/Elsalaymeh (no verificable), Zenodo, ResearchGate URLs
- [ ] 9.10 Checklist final (guía §8) → `cd latex/pgc && latexmk -pdf` → diff visual vs `reference/Formato PGC.pdf` → radicar semana 5

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
- [x] Step 2: Stack decided (PROPOSAL) → `docs/STACK.md` (resolves interface, auth, storage, stack of Step 8)
- [~] Step 3: DB designed → Stages 1-2 complete + SQL written (`docs/schema.sql`)
- [x] Step 4: Features prioritized
- [ ] Step 5: Architecture drawn
- [ ] Step 6: Tools learned
- [x] Step 7: Mockups ready → `docs/mockups/index.html` (interactive, 3 screens) + `docs/MOCKUPS.md`
- [~] Step 8: Post-stack sweep → partially resolved by Step 2/`docs/STACK.md` (interface=Flutter, auth=JWT, storage=local disk, stack=FastAPI+Postgres); pending professor confirmation
- [~] Step 9: Formato PGC → 9.1/9.2/9.3/9.4/9.5/9.8/9.9 done; 9.6 (CADIs) y 9.7 (metodología+cronograma) pendientes; radicación semana 5 ≈ 7–11 sep
