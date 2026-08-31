# Mockup Direction — Finance AI

## Status

The existing `docs/mockups/index.html` is a historical chat-first concept. It is retained as design history but is no longer the source of truth for the approved manual MVP and is not modified during this documentation-only pass.

New mockups must represent the normal budgeting experience first. Optional AI entry points are added only after the same manual forms exist.

## Experience Principles

- Recognizable budget-app navigation
- Dashboard or activity as the authenticated home
- Clear Add Expense, Add Income, and Transfer actions
- Accounts are visible because money location is a core concept
- Manual forms work without AI
- Currency code is visible beside amounts
- Transfers are visually distinct from income and expenses
- Color is never the only type indicator
- Errors preserve recoverable form input
- AI later pre-fills existing forms rather than introducing a separate data model

## Required Manual-MVP Screens

### 1. Register

- Email
- Password
- Confirm password
- Password visibility controls
- Field validation
- Loading/disabled submit state
- Duplicate-email and generic failure state
- Success message and navigation to Login

### 2. Login

- Email and password
- Invalid-credential state
- Loading state
- Session-expired state
- Navigation to Register

### 3. Home / Dashboard

- Account balances grouped by currency
- Income and expenses for selected period
- Recent movements
- Spending by category/subcategory
- Budget progress
- Clear shortcuts: Add Expense, Add Income, Transfer
- Empty and retry states

### 4. Activity

- Unified expense, income, and transfer rows
- Visible type label/icon
- Currency code on every amount
- Weekly/monthly/custom date filters
- Account and movement-type filters
- Entry-detail navigation

### 5. Accounts

- Account list with name, type, currency, and balance
- Create/edit/archive account
- Opening balance input
- Account detail/history
- Archived-state explanation

### 6. Manual Expense Form

- Account
- Amount and account currency
- Date
- Merchant/description
- Category and optional subcategory
- Optional payment method and reason
- Optional receipt attachment/items entry point
- Validation and retry state

### 7. Manual Income Form

- Account
- Amount and account currency
- Date
- Income source
- Optional description
- Validation and retry state

### 8. Transfer Form

- Source account
- Destination account
- Source amount
- Destination amount when currencies differ
- Date and optional description
- Explanation that transfers are not income or expenses
- Atomic failure/retry state

### 9. Expense Detail

- Expense header
- Optional receipt image
- Optional item rows
- Edit/archive actions
- Historical/archived state

### 10. Budgets

- Budget list and progress
- Category or subcategory target
- Weekly/monthly period
- Currency
- Create/edit/deactivate actions
- Empty and exceeded-target states

### 11. Catalogs and Preferences

- Categories/subcategories
- Payment methods
- Income sources
- Preferred currency
- Archive behavior
- Logout

## Navigation Direction

Recommended bottom navigation:

1. Home
2. Activity
3. Accounts
4. Budgets
5. Settings

Creation actions may use a central add button or clearly visible actions on Home/Activity. The team should validate the final navigation with the professor and usability testers.

## Deferred AI Experience

After the manual MVP:

- Add optional photo, microphone, and natural-language entry points.
- Open the existing Expense, Income, or Transfer form with proposed values.
- Mark uncertain fields visibly.
- Offer Review/Edit/Retry/Discard/Confirm.
- Never save on provider response alone.
- Retain every manual screen and action.

A conversational surface may exist later, but chat is not the required application shell.

## Visual Direction

Retain useful visual choices from the historical prototype where appropriate:

- Clean light and dark themes
- UdeC-inspired green accent
- Clear positive/negative movement treatment
- Accessible contrast and readable cards
- Large mobile touch targets

Visual reuse does not override the approved screen structure.

## Prototype Follow-Up

A later design task should create a new manual-first prototype. Until then:

- `MOCKUPS.md` is the approved UX specification.
- `mockups/index.html` is historical/non-authoritative.
- Auth and manual financial screens must be designed before Flutter implementation.
