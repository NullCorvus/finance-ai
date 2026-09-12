# Scope — Finance AI

## Product Vision

Finance AI is a personal budgeting application optimized for capture speed. The user can speak, type naturally, or photograph a receipt; the assistant interprets the input like a financial clerk, prepares the appropriate transaction, and shows a compact confirmation:

> This is what I understood.

The user gives it a quick glance and chooses Accept, Edit, Retry, or Discard. High-confidence results should be accepted with one tap. Missing or uncertain information is the only reason to add questions or highlight fields.

The assistant and manual UI share the same expense, income, and transfer contracts. AI never owns a separate financial-write path, never bypasses server validation, and never needs to make the user re-enter information it already extracted.

## Identity and Sessions

- Register with email and password
- Login, secure session restoration and renewal, and logout
- Strict user-data isolation
- No Admin role or admin dashboard in the approved MVP

## Accounts and Currencies

An account represents a place where the user holds money, such as cash, a bank account, digital wallet, or savings product. It has an owner, name, type, currency, opening balance, and active/inactive state. Each account stores its currency explicitly; the account form may suggest COP or the last-used currency for speed without creating a separate preferences feature.

Balances are derived from the opening balance and financial movements. COP and USD are initially supported. Original amounts remain in their original currency, and unlike currencies are never silently combined.

## User-Owned Catalogs

Each user owns categories, stores, and income sources. Registration may copy small editable defaults where that saves setup time.

Categories are permanently deleted rather than archived. Deletion requires confirmation:

- Existing expenses remain but their deleted classification becomes `Uncategorized`.
- Budgets targeting the deleted category are deleted.
- The operation is atomic and affects only the authenticated user.

Deleted optional stores or income sources are removed from new-entry choices; existing transactions remain and display the missing value as `Deleted`.

## Financial Transactions

### Expenses

A manual purchase is represented by a simple receipt/purchase group containing at least one expense row. It can be saved without AI or an image.

Core fields:

- Account
- Positive amount
- Date
- Purchase name
- Optional store
- Category or `Uncategorized`
- Optional note/context

The receipt/purchase group may include an image and one or more expense rows. Each expense row has its own name, amount, category, quantity, optional unit price, note, and optional image. A lone purchase simply has one row. The receipt total may be calculated from its rows and adjusted when taxes, discounts, tips, or rounding make the printed total differ.

The owner can view, edit, and permanently delete an expense. Deletion removes its owned receipt attachment and item details in the same transaction after confirmation.

### Income

Income records money entering one owned account. It includes the account, source, positive amount, date, and optional description. The owner can view, edit, and permanently delete it.

### Transfers

A transfer moves money between two different accounts owned by the same user. It is neither income nor expense. Both sides are saved atomically. Same-currency transfers use the same amount; cross-currency transfers preserve the actual source and destination amounts without requiring a live exchange-rate service.

## Fast Input Paths

### Manual

```text
Open expense, income, or transfer form
→ Enter fields
→ Validate
→ Save
```

Manual forms are always available and define the reliable fallback.

### AI-assisted

```text
Natural-language text, audio, or receipt photo
→ Assistant identifies intent and extracts values
→ “This is what I understood”
→ Accept / Edit / Retry / Discard
→ Normal validation and save path
```

Rules:

- Photo usually proposes an expense and may include receipt items.
- Voice or text may propose an expense, income, or transfer.
- Audio capture has a visible recording state, a 60-second maximum, supported temporary formats such as M4A/WAV, microphone-permission recovery, and safe cleanup after discard, failure, or expiry.
- Photo capture accepts the supported receipt formats and size limit, preserves the printed receipt total, and distinguishes complete, partial, unreadable, and failed extraction.
- High-confidence proposals remain compact and can be accepted with one tap.
- Low-confidence or missing fields are clearly marked; the assistant asks only necessary follow-up questions.
- Editing happens in place and does not require repeating the capture.
- Nothing is persisted before Accept.
- Temporary photo/audio files are removed after discard, failure, or expiration.
- The phone never contains or calls an AI-provider secret directly.

## Transaction History, Dashboard, and Budgets

The application provides:

- One searchable transaction history for expenses, income, and transfers
- Weekly, monthly, and custom date filters
- Account, movement-type, and category filters
- Flexible recurring or one-time overall/category budgets
- Account balances
- Income-versus-expense summaries
- Category spending and budget progress
- Recent movements

All ordinary analytics are deterministic backend/database calculations. Transfers affect account balances but do not count as income or expense.

## Delivery Boundary

The dependency order is:

1. Technical foundation
2. Identity and sessions
3. Accounts, currencies, and user catalogs
4. Stable manual expense, income, and transfer contracts
5. Correction/deletion, transaction history, and a basic financial dashboard complete the deterministic foundation
6. Multimodal AI speed layer: natural text first, audio second, and receipt photo third
7. Budgets and budget-progress views

AI does not need to wait for budgets, but it does wait until HU-001–HU-012 provide a dependable foundation of identity, accounts, catalogs, operations, correction/deletion, transaction history, and a basic dashboard.

## Outside the Approved Backlog

- Admin functionality
- Bank synchronization
- Automatic exchange-rate conversion
- Recurring transactions
- Autonomous AI writes without confirmation
- External price lookup
- Third-party productivity integrations
- Production-grade high availability and cloud operations
