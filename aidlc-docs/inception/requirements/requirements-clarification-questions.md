# Finance AI Requirements Clarification Questions

I interpreted the following decisions from the first questionnaire and your explanations:

- Complete the full manual budgeting MVP before integrating product AI.
- Make `Expense` the purchase header, with optional items and receipt attachment.
- Include simple category/subcategory budgets in the manual core.
- "Calendar" means transaction dates and monthly/weekly filters, not a dedicated calendar screen.
- Use a hybrid catalog of shared defaults plus user customization.
- Remove Admin from the MVP and reintroduce it only if later approved.
- Use a normal budget-app home before adding the optional assistant.
- Use email/password registration with default user settings and redirect to Login.
- Keep one clearly separated monorepo.
- Separate technical enablers from HU-001.
- Use SQLAlchemy models plus Alembic migrations as the executable database source of truth.
- Make `BACKLOG-AND-STORIES.md` own PB/HU identifiers; make `SPRINT-PLAN.md` reference them.
- Skip the full resiliency extension while retaining lightweight reliability practices.

The following decisions need clarification. Please answer each one by placing its letter after the `[Answer]:` tag.

## Clarification Question 1
You introduced multiple places where money is held (student account, work account, Davivienda, Bancolombia, CDAT, cash) and movements such as digital account to cash. How much of this belongs in the manual MVP?

A) **Accounts and transfers are core (Recommended):** every income/expense belongs to an account; users can create accounts with a name, type, currency, and opening balance; transfers move money between two accounts without counting as income or expense

B) Accounts are core, but transfers between accounts are added after the first AI feature

C) Do not model accounts; expenses and income are recorded directly against the user

X) Other (please describe after the [A]: tag below)

yeah, for exampole you as person have different places when your money are: suppose the basic example
bank account and cash, not everything is in cash not everything is in bank, so you go to the ATM and withdraw money, you open the app and it detects the transfer, 
of course the accounts are linked to this user as normal, your reasoning is correct
## Clarification Question 2
What is the simplest acceptable multi-currency behavior before AI is added?

A) **Account-based currencies without an exchange-rate service (Recommended):** each account has one supported currency; original amounts are preserved; cross-currency transfers record the actual amount leaving and arriving; dashboards show separate totals by currency until conversion is added later

B) Automatic conversion in the manual MVP using a live external exchange-rate service and a preferred display currency

C) User-managed conversion rates: users enter/update rates and the app converts dashboard totals into their preferred currency

X) Other (please describe after the [A]: tag below)

[Answer]: 

## Clarification Question 3
Should the full Definition of Done apply from HU-001?

A) **Yes (Recommended):** working behavior, automated tests, formatting/lint checks, reviewed documentation/API contract, and verification from a clean local setup

B) Start with working behavior and manual testing; introduce automated tests and quality checks in a later sprint

C) Leave the Definition of Done for the team to decide before Sprint 1; document it as an unresolved team decision for now

X) Other (please describe after the [A]: tag below)

[Answer]: 

## Clarification Question 4
Should the AI-DLC security baseline be enabled for this project?

A) **Yes, proportionally (Recommended):** enforce secure credential handling, authorization, user-data isolation, secret management, input validation, and safe logging while marking production-only controls as not applicable to the university prototype

B) No: skip the extension and keep only security acceptance criteria inside individual stories

X) Other (please describe after the [A]: tag below)

[Answer]: 

## Clarification Question 5
Should property-based testing be part of the project approach?

A) Apply it broadly to all suitable business logic and data transformations

B) **Apply it selectively (Recommended):** use it for balance invariants, transfers, budget-period calculations, currency behavior, and later AI structured-data validation; use example-based tests for ordinary CRUD and UI

C) Skip property-based testing and use only example-based unit/integration tests

X) Other (please describe after the [B]: tag below)

[Answer]: 

## Resolution Recorded on 2026-08-27

The user's written response selects **A** for Clarification Question 1. The user's subsequent instruction, "go ahead," authorizes the recommended defaults for the remaining unanswered clarifications:

| Clarification | Resolution |
|---|---|
| 1 | A — Accounts and transfers are core |
| 2 | A — Account-based currencies without an exchange-rate service |
| 3 | A — Full Definition of Done from HU-001 |
| 4 | A — Proportional security baseline |
| 5 | B — Selective property-based testing |
