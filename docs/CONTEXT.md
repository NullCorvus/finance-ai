# Project Context — Finance AI

## Academic Context

- **Course:** Ingeniería de Software II
- **University:** Universidad de Cundinamarca
- **Project type:** University prototype
- **Current state:** Technical foundation, identity, secure sessions, and owned financial accounts are implemented; later financial features remain in planning/construction
- **Working language:** English for code and technical documentation
- **Decision status:** Product direction is approved; implementation details remain subject to team/professor review

## Product Vision

Finance AI is a personal budgeting application whose main product advantage is exceptionally fast AI-assisted capture, backed by complete manual forms and deterministic financial rules.

The manual product lets a user:

- Create an account and authenticate
- Represent places where money is held, such as cash, bank accounts, digital wallets, or savings products
- Record expenses and income
- Transfer money between their own accounts
- Organize records with categories, stores, and income sources
- Set simple weekly or monthly budgets
- Review balances, activity, spending, income, and budget progress

## AI Position

AI is the product's speed layer, not its financial source of truth.

Photo, audio, or natural-language text can be interpreted as an expense, income, or transfer as soon as that transaction's validated manual contract is stable. The assistant shows a compact “This is what I understood” summary. High-confidence proposals need only a glance and one-tap acceptance; uncertain fields are highlighted or clarified. The user can edit, retry, or discard without repeating the capture. AI never owns a second write path, and every assisted flow retains a manual alternative.

## Core Constraints

- Manual budgeting must remain fully usable without an AI provider or API key, while the primary assisted experience stays optimized for speed.
- The backend owns validation, authorization, financial rules, and data.
- The shared Flutter client is a thin Android/Windows interface and never connects directly to PostgreSQL or an AI provider.
- Original monetary amounts and currencies are preserved.
- Transfers do not count as income or expense.
- Each user's financial data and customizable catalogs are isolated from other users.
- Categories are permanently deleted after confirmation; affected expenses remain and become Uncategorized.
- The MVP is a modular monolith, not a microservice system.
- Production deployment, bank synchronization, and advanced agent behavior are outside the initial project.

## Canonical Planning Sources

1. `aidlc-docs/inception/requirements/requirements.md`
2. `aidlc-docs/inception/user-stories/stories.md`
3. `aidlc-docs/inception/user-stories/personas.md`
4. Reconciled documents under `docs/`

Sprint documents and Trello must reference the approved PB/HU identifiers rather than redefining them.
