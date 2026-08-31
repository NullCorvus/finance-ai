# Product Backlog and Story Registry — Finance AI

## Status and Authority

This file owns the stable PB, HU, and EN identifiers used by repository documents and the team board. The detailed acceptance scenarios and invariants live in `aidlc-docs/inception/user-stories/stories.md`; they must keep the identifiers and story statements registered here.

Rules:

- HU-001 through HU-014 are the complete manual MVP.
- HU-015 and HU-016 are optional, deferred AI assistance.
- EN identifiers describe technical foundations and are not user stories.
- Story points are assigned by the team through Planning Poker only after Definition of Ready is met.
- A later AI story may prefill an existing form, but it cannot create a second financial-write path.

## Product Backlog Domains

| ID | Domain | Release |
|---|---|---|
| PB-001 | Identity and access | Manual MVP |
| PB-002 | Preferences | Manual MVP |
| PB-003 | Accounts and currencies | Manual MVP |
| PB-004 | User catalogs | Manual MVP |
| PB-005 | Expenses and receipts | Manual MVP |
| PB-006 | Income | Manual MVP |
| PB-007 | Transfers | Manual MVP |
| PB-008 | Activity and filters | Manual MVP |
| PB-009 | Budgets | Manual MVP |
| PB-010 | Dashboard | Manual MVP |
| PB-011 | Optional AI assistance | Deferred |

## Technical Enablers

| ID | Enabler | Completion outcome |
|---|---|---|
| EN-001 | Monorepo and quality baseline | Backend/frontend boundaries, supported toolchains, formatting, linting, and review conventions are established |
| EN-002 | Local infrastructure | API and PostgreSQL start repeatably through Docker Compose with health checks |
| EN-003 | Migration and seed baseline | Alembic creates the approved schema and repeatable seeds provide shared currencies and new-user catalog defaults |
| EN-004 | API contract baseline | Versioned OpenAPI contracts define registration, login, renewal/logout, current-user behavior, and common errors |
| EN-005 | Flutter application foundation | Theme, navigation, loading/error patterns, and authentication route structure are ready |
| EN-006 | Continuous quality baseline | Automated tests, formatting, linting, dependency checks, and clean-setup verification run consistently |

## Canonical User Stories

| ID | PB | Story | Release | Dependencies |
|---|---|---|---|---|
| HU-001 | PB-001 | As a new user, I want to create an account so that I can begin managing my finances. | Manual MVP | EN-001–EN-006 |
| HU-002 | PB-001 | As a returning user, I want a secure session so that I can access my financial data without signing in on every app launch. | Manual MVP | HU-001 |
| HU-003 | PB-002 | As a user, I want to manage simple preferences so that new financial entries begin with sensible defaults. | Manual MVP | HU-002 |
| HU-004 | PB-003 | As a user, I want accounts for cash, banks, wallets, or savings products so that I know where my money is held. | Manual MVP | HU-002, currency seed |
| HU-005 | PB-004 | As a user, I want customizable spending categories so that my expenses reflect how I understand my money. | Manual MVP | HU-001, HU-002 |
| HU-006 | PB-004 | As a user, I want editable payment methods and income sources so that entries use terms that match my finances. | Manual MVP | HU-001, HU-002 |
| HU-007 | PB-005 | As a user, I want to record an expense manually so that spending can always be tracked without AI or a receipt. | Manual MVP | HU-004, HU-005; HU-006 optional |
| HU-008 | PB-005 | As a user, I want optional receipt evidence and item detail so that important purchases can be recorded more precisely without burdening simple expenses. | Manual MVP | HU-007 |
| HU-009 | PB-005 | As a user, I want to correct or archive my expenses so that mistakes do not permanently damage my financial history. | Manual MVP | HU-007 |
| HU-010 | PB-006 | As a user, I want to record income into an account so that balances and income-versus-expense summaries are complete. | Manual MVP | HU-004, HU-006 |
| HU-011 | PB-007 | As a user, I want to transfer money between my accounts so that internal movements do not look like income or spending. | Manual MVP | HU-004 |
| HU-012 | PB-008 | As a user, I want one history of expenses, income, and transfers so that I can understand what happened to my money. | Manual MVP | HU-007, HU-010, HU-011 |
| HU-013 | PB-009 | As a user, I want a category or subcategory budget so that I can compare actual spending with a weekly or monthly target. | Manual MVP | HU-005, HU-007 |
| HU-014 | PB-010 | As a user, I want a dashboard of balances and spending so that I can understand my current financial position. | Manual MVP | HU-012, HU-013 |
| HU-015 | PB-011 | As a user, I want optional receipt-photo assistance so that I can start from proposed expense values instead of typing every field. | Deferred AI | Complete manual MVP; HU-007, HU-008 |
| HU-016 | PB-011 | As a user, I want optional audio/text assistance so that a description can prefill the correct existing financial form. | Deferred AI | Complete manual MVP; HU-007, HU-010, HU-011 |

## Current First Story — HU-001 Register

HU-001 creates an application user; it does not own repository setup, infrastructure, schema creation, or the Flutter project foundation. Those are EN-001 through EN-006 and may be worked in the same iteration by different team members.

### Acceptance Summary

1. A normalized, unused email plus valid matching passwords creates the user and default catalogs atomically.
2. Success shows confirmation and redirects to Login without automatic login.
3. Duplicate email comparison is case-insensitive and ignores surrounding spaces.
4. Invalid email, insufficient password, or mismatched confirmation blocks the request with field-level feedback.
5. In-progress submission prevents accidental duplicate requests.
6. Passwords are adaptively hashed and never stored or logged in plaintext.
7. Failures do not expose internal details or leave a partially initialized user.

### Not Part of HU-001

- Docker Compose and project scaffolding
- The complete schema migration
- Login/session behavior
- Accounts, movements, budgets, dashboard, or AI

## Definition of Ready

A story is ready for estimation when:

- Its identifier, persona, outcome, acceptance criteria, dependencies, and out-of-scope boundary are understood.
- Required UX and API contracts are available at the level needed for the story.
- Relevant schema support and ownership rules are agreed.
- Open questions that could materially change the estimate are resolved.
- The team agrees it can be demonstrated within one sprint or splits it vertically.

## Definition of Done Direction

A construction story is done only when its accepted UI/API/data behavior works together, ownership/security rules are verified, relevant automated tests pass, documentation is updated, and another team member has reviewed it. The team must finalize this definition before construction.

## Estimation

No story points are assigned in documentation by an individual. The team estimates ready stories using Planning Poker and records the agreed value on the board and here if the repository becomes the chosen reporting source.
