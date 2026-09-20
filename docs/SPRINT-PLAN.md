# Sprint Planning — Finance AI Tracker

## Setup de infraestructura (Sprint 1 — ANTES de Auth)

### Repositorios Git
- [x] Crear repo backend (FastAPI)
- [x] Crear repo frontend (Flutter)
- [x] Monorepo con carpetas `finance-ai-backend/` y `finance-ai-frontend/`

### Backend (FastAPI)
- [x] Crear proyecto FastAPI con uv
- [x] Virtual environment + dependencias
  - fastapi, uvicorn, sqlalchemy, psycopg2, python-jose, passlib, bcrypt, pydantic, alembic
- [x] Estructura de carpetas modular por features
- [x] Archivo `.env` con variables de entorno

### Frontend (Flutter)
- [x] Crear proyecto Flutter
- [x] Dependencias: http, provider, etc.
- [x] Estructura de carpetas modular por features
- [x] Scripts de ejecución y build (`run.sh`, `runCloud.sh`)

### Base de datos (PostgreSQL)
- [x] PostgreSQL en Docker (`compose.yaml`)
- [x] Migraciones Alembic aplicadas

---

## Sprints & User Stories Synchronization

> Synchronized with `docs/BACKLOG-AND-STORIES.md` (15 user stories, 11 PB items).

### Completed Work
| Story | Feature | Description | Status |
|---|---|---|---|
| **HU-001** | PB-001 Identity and access | Registration & starter defaults | ✅ Done |
| **HU-002** | PB-001 Identity and access | Secure renewable sessions | ✅ Done |
| **HU-003** | PB-002 Accounts and currencies | Owned accounts & derived balances | ✅ Done |
| **HU-004** | PB-003 User-owned catalogs | Categories management | ✅ Done |
| **HU-005** | PB-003 User-owned catalogs | Income sources management | ✅ Done |

---

### Active Sprint — PB-004 Expenses Foundation
> **Detailed Execution Plan & 80/20 Architecture Guide:**  
> Refer to [docs/HU006-PLAN-AND-CORE-CONCEPTS.md](file:///home/d3ad/codigos/finance-ai/docs/HU006-PLAN-AND-CORE-CONCEPTS.md)

| Story | Priority | Points | Description | Status |
|---|---|---|---|---|
| **HU-006** | High | 5 | **Manual expense**: Record expense with only essential info (account, amount, merchant) quickly without AI or receipt. | 🟡 In Progress |
| **HU-008** | High | 5 | **Expense correction & permanent deletion**: Edit & delete manual expenses, atomic rollback. | ⏳ Planned |

---

### Upcoming Sprints Roadmap

#### Sprint: PB-005 Income & PB-006 Transfers
| Story | Priority | Points | Description |
|---|---|---|---|
| **HU-009** | High | 3 | **Income lifecycle**: Record and manage income in an account. |
| **HU-010** | High | 3 | **Transfers**: Atomic movement between owned accounts. |

#### Sprint: PB-007 History & PB-008 Financial Dashboard
| Story | Priority | Points | Description |
|---|---|---|---|
| **HU-011** | High | 3 | **Transaction history & filters**: Search and inspect expenses, income, and transfers. |
| **HU-012** | High | 5 | **Basic financial dashboard**: Deterministic balances, period & category views. |

#### Sprint: PB-009 & PB-010 AI Capture Layer
| Story | Priority | Points | Description |
|---|---|---|---|
| **HU-013** | High | 5 | **AI text capture**: Natural language expense entry. |
| **HU-014** | High | 5 | **AI voice capture**: Audio microphone input. |
| **HU-015** | High | 8 | **AI receipt photo**: Photo receipt proposal and item extraction. |

#### Sprint: PB-011 Budgets
| Story | Priority | Points | Description |
|---|---|---|---|
| **HU-016** | Medium | 1 | **Spending budgets**: Weekly/monthly category targets and progress. |
