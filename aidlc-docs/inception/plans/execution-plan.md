# Execution Plan — HU-005 · Manage Income Sources

## Project Information
- **Project Type**: Brownfield (FastAPI backend + Flutter frontend already implemented for auth)
- **Start Date**: 2026-09-12
- **Current Stage**: INCEPTION — Workflow Planning
- **Unit**: `hu-005-income-sources`

## Scope and Impact
- **User-facing**: Yes — new income-source management screen and confirmed deletion.
- **Data model**: Yes — `income_source` archive flag removed, unique index replaced.
- **API**: Yes — new owned CRUD contract, `openapi.json` regenerated.
- **NFR**: Security (ownership isolation, no secret leakage), reliability (transactional rollback).
- **Components affected**: backend `db/models`, `migrations`, new catalog feature module, `api/router.py`,
  `openapi.json`, tests; frontend new `features/catalogs`(or `features/income_sources`) module, router,
  tests.

## Execution Plan Summary
- **Total stages**: 9
- **Stages to execute**: Workflow Planning, Application Design (light), Units Generation (light),
  Functional Design, NFR Requirements (light), Code Generation, Build and Test
- **Stages to skip**: Reverse Engineering (code is small and already mapped), Infrastructure Design
  (reuses existing Compose/PostgreSQL), User Stories (story already defined)
- **Risk level**: Low–Medium (schema change touching registration defaults)

## Stage Progress

### INCEPTION PHASE
- [x] Workspace Detection
- [x] Reverse Engineering — SKIP (small codebase already mapped; no brownfield artifacts needed)
- [x] Requirements Analysis — done via backlog + sprint unit
- [x] User Stories — done (HU-005 defined in latest backlog)
- [x] Workflow Planning
- [ ] Application Design — EXECUTE (light: component/method sketch for the catalog module)
- [ ] Units Generation — EXECUTE (light: single unit `hu-005-income-sources`)

### CONSTRUCTION PHASE
- [ ] Functional Design — EXECUTE (data model, validation, delete/SET-NULL rules)
- [ ] NFR Requirements — EXECUTE (light: security/ownership + rollback)
- [ ] NFR Design — SKIP (no new NFR patterns beyond existing conventions)
- [ ] Infrastructure Design — SKIP (reuses existing Compose/PostgreSQL)
- [ ] Code Generation — EXECUTE (migration → backend → openapi → frontend → tests)
- [ ] Build and Test — EXECUTE

### OPERATIONS PHASE
- [ ] Operations — PLACEHOLDER

## Package Update Sequence
1. **finance-ai-backend** — Alembic migration + model/repository/service/router/schemas + tests + openapi.
2. **finance-ai-frontend** — feature module + routing + diagnostics + tests.
3. **Contract sync** — regenerate/verify `openapi.json`, then update frontend client usage.

## Current Status
- **Lifecycle Phase**: INCEPTION
- **Current Stage**: Workflow Planning complete
- **Next Stage**: Application Design (light) then Code Generation
- **Status**: Awaiting user approval
