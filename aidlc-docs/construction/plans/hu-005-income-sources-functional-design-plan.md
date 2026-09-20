# Functional Design Plan — hu-005-income-sources

Companion to `implementation-plan.md` (Phase 1). Checklist for this stage only.

- [x] Analyze unit context (`unit-of-work.md`, story HU-005)
- [x] Define domain entity `IncomeSource` and the mixin split
- [x] Define business rules BR-1..BR-13
- [x] Define business logic/operation flows and transaction boundaries
- [x] Define the delete + historical-reference (`SET NULL`) contract
- [x] Define frontend component structure and state (simple testing UI)
- [x] Generate `domain-entities.md`
- [x] Generate `business-rules.md`
- [x] Generate `business-logic-model.md`
- [x] Generate `frontend-components.md`
- [ ] User approval of the functional design

## Resolved Questions (no open ambiguities)
- Archive flag: retained per the draft but unused; permanent delete (D3 amended / D11).
- Unique rule: `(user_id, lower(trimmed name))` (D4).
- Ownership miss: `404`, never `403` (BR-5).
- Migration scope: only `income_source` (D10).
- UI scope: simple testing screen (D8).
