# Product Backlog and User Story Registry — Finance AI

## Status and Authority

This is the canonical PB/HU identifier registry as of 2026-09-02. Detailed acceptance scenarios live in `aidlc-docs/inception/user-stories/stories.md`. Sprint planning may schedule these identifiers but must not redefine or renumber them.

Rules:

- HU-001 through HU-012 form the deterministic foundation: identity, accounts, catalogs, manual operations, correction/deletion, transaction history, and the basic dashboard.
- HU-013 through HU-015 add the multimodal AI speed layer after that foundation is stable: natural text first, audio second, and receipt photo third.
- HU-016 adds budgets after the fast capture loop is available.
- AI begins with natural text and audio, followed by receipt photo; it chooses the appropriate expense, income, or transfer form but only proposes data.
- Every AI proposal receives a compact “This is what I understood” glance with one-tap Accept plus Edit, Retry, or Discard, and then uses the normal validated save path.
- Categories are permanently deleted, not archived. Existing expenses remain and become `Uncategorized`; budgets targeting the deleted category are removed after explicit confirmation.
- Technical foundations are EN identifiers, not user stories.
- Story points remain blank until the team estimates ready work through Planning Poker.

## Product Backlog

| ID | Domain | Priority | Release | Status |
|---|---|---|---|---|
| PB-001 | Identity and access | High | Manual MVP | Done |
| PB-002 | Accounts and currencies | High | Foundation | Done |
| PB-003 | User-owned catalogs | High | Foundation | Not started |
| PB-004 | Expenses and optional receipt detail | High | Foundation | Not started |
| PB-005 | Income | High | Foundation | Not started |
| PB-006 | Transfers | High | Foundation | Not started |
| PB-007 | Transaction history and filters | High | Foundation | Not started |
| PB-008 | Basic financial dashboard | High | Foundation | Not started |
| PB-009 | AI capture from natural text and audio | High | AI-assisted release | Not started |
| PB-010 | AI capture from receipt photo | High | AI-assisted release | Not started |
| PB-011 | Spending budgets | Medium | Planning release | Not started |

## Technical Enablers

| ID | Enabler | Status |
|---|---|---|
| EN-001 | Repository separation and quality baseline | Done |
| EN-002 | Repeatable local API and PostgreSQL infrastructure | Done |
| EN-003 | Alembic migration and seed baseline | Done |
| EN-004 | Versioned API contract baseline | Done |
| EN-005 | Shared Android/Windows Flutter foundation | Done |
| EN-006 | Continuous quality and clean-setup verification | Done |

## Canonical User Stories

| ID | PB | User story | Release | Dependencies | Status |
|---|---|---|---|---|---|
| HU-001 | PB-001 | As a new user, I want to create an account so that I can begin managing my finances. | Manual MVP | EN-001–EN-006 | Done |
| HU-002 | PB-001 | As a returning user, I want a secure renewable session so that I can access my data without signing in on every app launch. | Manual MVP | HU-001 | Done |
| HU-003 | PB-002 | As a user, I want accounts for cash, banks, wallets, savings products, or credit cards so that I know where my money is held. | Foundation | HU-002 | Done |
| HU-004 | PB-003 | As a user, I want to manage my categories so that classifications match how I understand my spending. | Foundation | HU-002 | Not started |
| HU-005 | PB-003 | As a user, I want to manage stores and income sources so entries use familiar names without modeling payment access methods. | Foundation | HU-002 | Not started |
| HU-006 | PB-004 | As a user, I want to record an expense manually with only essential information so that I can save it quickly without AI or a receipt. | Foundation | HU-003, HU-004 | Not started |
| HU-007 | PB-004 | As a user, I want optional receipt evidence and item detail so that important purchases can be recorded more precisely. | Foundation | HU-006 | Not started |
| HU-008 | PB-004 | As a user, I want to view, correct, and permanently delete my expenses so that my records stay accurate. | Foundation | HU-006 | Not started |
| HU-009 | PB-005 | As a user, I want to record and manage income in an account so that balances and summaries are complete. | Foundation | HU-003, HU-005 | Not started |
| HU-010 | PB-006 | As a user, I want to transfer money between my accounts so that internal movements do not look like income or spending. | Foundation | HU-003 | Not started |
| HU-011 | PB-007 | As a user, I want one searchable, filterable transaction history so that I can find and inspect any expense, income, or transfer. | Foundation | HU-006, HU-009, HU-010 | Not started |
| HU-012 | PB-008 | As a user, I want a basic dashboard of balances, recent movements, spending, and income so that I understand my financial position before and after every capture. | Foundation | HU-011 | Not started |
| HU-013 | PB-009 | As a user, I want to write naturally to the assistant so that it identifies an expense, income, or transfer and prepares it for quick review. | AI-assisted release | Stable HU-001–HU-012 foundation | Not started |
| HU-014 | PB-009 | As a user, I want to describe a financial operation by voice so that the assistant prepares it while I avoid typing. | AI-assisted release | Stable HU-001–HU-012 foundation, HU-013 proposal flow | Not started |
| HU-015 | PB-010 | As a user, I want a receipt photo to produce a proposed expense so that I can verify it at a glance and accept it instead of typing every value. | AI-assisted release | Stable HU-001–HU-012 foundation, HU-013 proposal flow | Not started |
| HU-016 | PB-011 | As a user, I want flexible category or overall budgets so that I can compare actual spending with recurring or one-time targets. | Planning release | HU-004, HU-006, HU-012 | Not started |

## Definition of Ready

A story is ready for estimation when its outcome, acceptance criteria, dependencies, UX/API expectations, ownership rules, and out-of-scope boundary are understood and the team agrees it can be demonstrated within one sprint.

## Definition of Done

A story is done only when its acceptance criteria pass across the appropriate Flutter/API/database boundary, automated tests and quality checks pass, affected contracts and documentation are synchronized, secrets remain outside source control, clean setup is verified, and another team member reviews the change.

## Story Count

- Deterministic foundation: 12 stories
- AI speed layer: 3 stories
- Planning layer: 1 story
- Total: 16 genuine user stories across 11 product backlog items
- Technical enablers: 6, tracked separately
