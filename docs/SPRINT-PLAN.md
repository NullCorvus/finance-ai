# Delivery Sequence and Sprint Planning — Finance AI

## Status

This is a dependency-aware sequence, not a fixed team commitment. The team decides sprint length, capacity, assignments, and story points. Identifiers come only from `docs/BACKLOG-AND-STORIES.md`.

## Product and Release Gates

1. Manual forms define the validated expense, income, and transfer contracts and remain available as a fallback.
2. AI assistance begins only after identity, accounts, catalogs, manual operations, correction/deletion, transaction history, and the basic dashboard are stable (HU-001–HU-012).
3. AI uses the same save path as manual entry and never bypasses server validation, authorization, or ownership.
4. High-confidence proposals should need only a glance and one tap. Extra questions or highlighted fields appear only when information is missing or confidence is low.
5. A story must meet Definition of Ready before estimation and sprint commitment.

## Recommended Sequence

| Iteration | Outcome | Candidate work |
|---|---|---|
| Foundation | Repeatable development baseline | EN-001–EN-006 — done |
| Identity | Registration and secure renewable sessions | HU-001–HU-002 — done |
| Financial structure | Accounts, currencies, and catalogs | HU-003–HU-005 |
| Core transactions | Manual expense, optional receipt detail, income, and transfers | HU-006–HU-007, HU-009–HU-010 |
| Control and visibility | Expense correction/deletion, searchable transaction history, and the basic dashboard complete the deterministic foundation | HU-008, HU-011–HU-012 |
| AI speed layer 1 | Natural-text proposals establish the shared assistant proposal/review flow | HU-013 |
| AI speed layer 2 | Audio reuses that flow with recording, permission, and temporary-media behavior | HU-014 |
| AI speed layer 3 | Receipt photo adds image extraction and optional receipt/item detail | HU-015 |
| Planning | Flexible overall/category budgets and dashboard budget progress | HU-016 |

HU-013 through HU-015 begin after HU-001–HU-012 are stable. They do not need to wait for budgets in HU-016.

The team may move a ready story within adjacent iterations when dependencies and capacity permit. Story identifiers must never be renumbered to match a sprint.

Testing, documentation, security checks, and usability review belong inside each iteration; they are not postponed to a final testing sprint.
