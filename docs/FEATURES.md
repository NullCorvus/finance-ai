# Features — Finance AI

Finance AI is designed to make financial capture exceptionally fast. Manual forms provide the reliable data contract and fallback; the AI assistant is the primary speed layer over those same rules.

## Phase 0 — Technical Foundation — Done

EN-001–EN-006 provide separate repositories, repeatable FastAPI/PostgreSQL infrastructure, migrations and seeds, versioned API contracts, the shared Android/Windows Flutter foundation, and continuous quality checks.

## Phase 1 — Identity and Financial Structure

- Registration, login, secure session restoration, renewal, logout, and user isolation
- User-owned accounts representing cash, banks, wallets, savings, or other money locations
- Shared supported currencies, initially COP and USD
- An explicit currency per account; the last-used currency may be suggested for speed without becoming a separate preferences feature
- User-owned categories, stores, and income sources
- Permanent catalog deletion with confirmation; existing transactions survive as `Uncategorized` or without the deleted optional catalog value

## Phase 2 — Manual Transaction Contracts

- Manual expense entry without AI, receipt, or item-detail requirements
- Optional receipt image and zero or more item-detail rows
- Expense viewing, editing, and permanent deletion
- Income entry and management
- Atomic transfers between owned accounts, including explicit cross-currency amounts
- One validated save path per transaction type, shared by manual and AI-assisted entry

## Phase 3 — Control and Visibility Foundation

- Expense viewing, correction, and permanent deletion
- Searchable transaction history with account, movement-type, category, text, and date-period filters
- A basic dashboard with balances, recent movements, income, expenses, and period/category views, always separated by currency
- Reliable recalculation after edits or deletions
- Complete ownership, atomicity, validation, and error behavior across every manual operation

At the end of Phase 3, the deterministic foundation is ready to support AI without accelerating incorrect financial behavior.

## Phase 4 — Multimodal AI Speed Layer

The assistant behaves like a knowledgeable financial clerk. Text establishes the shared proposal/review flow first, audio reuses it second, and receipt photo extends it third. The assistant determines whether natural text or audio describes an expense, income, or transfer; a receipt photo normally proposes an expense.

| Capability | Outcome |
|---|---|
| Natural text — first | Proposed expense, income, or transfer and the initial shared “This is what I understood” interaction |
| Audio capture | Microphone recording with a visible recording state, a 60-second limit, supported temporary formats, permission recovery, and cleanup on discard or failure |
| Receipt photo — third | Proposed purchase group with an optional store, items, printed total, date, categories, and currency |
| High-confidence proposal | A compact “This is what I understood” summary that can be accepted with one tap |
| Uncertain proposal | Only missing or low-confidence fields are highlighted or clarified |
| Correction | Edit in place without restarting the capture |
| Manual fallback | Every normal form works when AI is unavailable or the user prefers direct entry |

AI output remains untrusted and goes through normal validation and ownership rules, but safety must not recreate the full manual-entry workload. Natural text, audio, and receipt photo share one review model: quick glance, Accept, Edit, Retry, or Discard.

## Phase 5 — Budgets and Extended Visibility

- Flexible recurring or one-time overall/category budgets
- Deterministic budget progress from qualifying expenses
- Budget progress added to the existing dashboard
- Currency-safe totals that do not silently combine unlike currencies

Free-form analytics chat, autonomous financial writes, recurring automation, external price lookup, and third-party integrations remain outside the approved backlog unless the team adds separate stories.
