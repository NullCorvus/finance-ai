# Project Context — Finance AI

## Academic Context

- **Course:** Ingeniería de Software II
- **University:** Universidad de Cundinamarca
- **Project type:** University prototype
- **Current state:** Documentation and planning only; no application code exists yet
- **Working language:** English for code and technical documentation
- **Decision status:** Product direction is approved; implementation details remain subject to team/professor review

## Product Vision

Finance AI is a personal budgeting application that works completely without artificial intelligence.

The manual product lets a user:

- Create an account and authenticate
- Represent places where money is held, such as cash, bank accounts, digital wallets, or savings products
- Record expenses and income
- Transfer money between their own accounts
- Organize records with categories, subcategories, payment methods, and income sources
- Set simple weekly or monthly budgets
- Review balances, activity, spending, income, and budget progress

## AI Position

AI is a later, optional assistant—not the product's source of truth.

After the complete manual MVP works, photo, audio, or natural-language text may prefill the same expense, income, or transfer forms that users already complete manually. The user reviews and edits the proposal before explicitly saving it. AI never writes financial data directly, and every assisted flow retains a manual alternative.

## Core Constraints

- Manual budgeting must remain fully usable without an AI provider or API key.
- The backend owns validation, authorization, financial rules, and data.
- The shared Flutter client is a thin Android/Windows interface and never connects directly to PostgreSQL or an AI provider.
- Original monetary amounts and currencies are preserved.
- Transfers do not count as income or expense.
- Each user's financial data and customizable catalogs are isolated from other users.
- The MVP is a modular monolith, not a microservice system.
- Production deployment, bank synchronization, and advanced agent behavior are outside the initial project.

## Canonical Planning Sources

1. `aidlc-docs/inception/requirements/requirements.md`
2. `aidlc-docs/inception/user-stories/stories.md`
3. `aidlc-docs/inception/user-stories/personas.md`
4. Reconciled documents under `docs/`

Sprint documents and Trello must reference the approved PB/HU identifiers rather than redefining them.
