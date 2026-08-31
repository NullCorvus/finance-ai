# Architecture Plan — Manual-First Finance AI

## Q1 — Actors

### Primary

- Personal Budget User: owns and manages their accounts and financial data.

### Deferred External Actor

- AI Provider: optional parser used only after the manual MVP. It proposes form data and never accesses PostgreSQL directly.

There is no Admin actor in the approved MVP.

## Q2 — System Boundary

### Inside

- Flutter mobile application
- FastAPI modular monolith
- PostgreSQL database
- Backend-controlled optional receipt storage
- Authentication, financial rules, analytics, and later AI adapter

### Outside

- User device platform services
- Optional external AI provider
- Future hosting/network infrastructure

### Explicitly Outside MVP

- Bank APIs
- Live currency-rate APIs
- Calendar integrations
- Autonomous agents
- Admin dashboard

## Q3 — Containers

| Container | Responsibility |
|---|---|
| Flutter app | Manual forms, navigation, activity, accounts, budgets, dashboard, later proposal review |
| FastAPI backend | Auth, ownership, validation, financial rules, analytics, persistence, later AI adapter |
| PostgreSQL | Structured user and financial data |
| Receipt storage | Optional image files |
| AI provider — deferred external | Proposed structured input only |

## Q4 — Backend Modules

1. Auth and Sessions
2. User Preferences
3. Accounts and Currencies
4. User Catalogs
5. Expenses and Receipt Detail
6. Income
7. Transfers
8. Budgets
9. Activity and Dashboard
10. AI Input Adapter — deferred

All modules run inside one backend service.

## Q5 — Data Stores

- PostgreSQL: canonical structured financial data
- Backend-controlled local file storage: optional receipt images
- No vector database
- No required cache
- No AI chat-history store in the manual MVP

## Q6 — Core Journeys

### Journey 1 — Record a Manual Expense

1. User opens the existing expense form.
2. User selects an owned account and catalog values.
3. Client provides immediate field feedback.
4. Backend validates the request, ownership, and active references.
5. Backend saves the expense atomically.
6. Activity, account balance, budget progress, and dashboard reflect the record.

No receipt or AI is required.

### Journey 2 — Transfer Between Accounts

1. User opens Transfer.
2. User selects two distinct owned accounts.
3. User enters the source amount and, if currencies differ, actual destination amount.
4. Backend validates ownership, active state, and positive amounts.
5. Backend commits the transfer atomically.
6. Both account balances and activity update.
7. Income and expense analytics remain unchanged.

### Journey 3 — AI-Assisted Entry — Deferred

1. User optionally supplies photo, audio, or natural-language text.
2. Backend adapter calls the configured provider.
3. Provider returns untrusted proposed values.
4. Existing Expense, Income, or Transfer form opens.
5. User edits, retries, discards, or confirms.
6. Only explicit confirmation enters the normal validation/save journey.

## Q7 — Open Decisions

- Professor/team confirmation of Flutter and deployment expectations
- Exact pinned runtime/dependency versions during EN-001
- New manual-first visual prototype
- AI provider only after the complete manual MVP

These decisions do not block documentation reconciliation or manual product design.
