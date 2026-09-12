# Screen and Prototype Direction — Finance AI

## Status

The existing `docs/mockups/index.html` prototype is historical evidence of the original capture-first concept. Its fast photo/voice/text entry and compact confirmation interaction remain valuable, but its receipt-centric data model and old HU numbering are not current requirements.

A replacement prototype should follow this document and the canonical HU registry.

## Experience Principle

The deterministic foundation makes financial operations correct. The AI layer makes them fast.

The main capture surface should make these actions immediately available:

- Take a receipt photo
- Speak naturally
- Type naturally
- Add an expense manually
- Add income manually
- Transfer manually

AI-assisted capture produces a compact card:

> This is what I understood.

For a high-confidence result, the whole happy path is capture → glance → Accept. Edit, Retry, and Discard remain visible but secondary. Missing or low-confidence fields receive focused attention without forcing the user through every field.

## Required Foundation Screens

1. Registration and login, including loading, validation, error, success, restoration, and logout
2. Accounts and account detail, including explicit currency
3. Category management with permanent-delete confirmation
4. Store and income-source management
5. Fast manual expense form with optional fields collapsed
6. Optional receipt attachment and item-detail editor
7. Expense detail/edit/delete
8. Manual income form and management
9. Manual transfer form
10. Searchable transaction history and filters
11. Basic dashboard with period and category views

Category deletion must explain that existing expenses remain as Uncategorized and dependent budgets are removed.

## AI Speed-Layer Screens

### Natural Text

- One natural-language input surface
- Assistant infers expense, income, or transfer
- Compact proposed transaction with visible type
- Short clarification only when required data or intent is ambiguous
- Accept, Edit, Retry, and Discard

### Audio

- Immediately discoverable microphone action
- Visible recording state and automatic stop at 60 seconds
- Permission-denied explanation with a direct path to device settings
- Processing state followed by the shared editable proposal card
- Clear partial/unintelligible/timeout states with Retry, Type instead, and Manual options
- Temporary audio cleanup on discard, failure, or expiry

### Receipt Photo

- Capture or choose image
- Processing feedback
- Compact proposed expense
- Receipt items available as detail, not mandatory review clutter
- Uncertain values highlighted
- Accept, Edit, Retry, and Discard

Editing preserves the original capture and updates the proposal in place.

## Basic Dashboard

- Account balances grouped by currency
- Income versus expenses for a selected period
- Recent activity
- Category spending
- Today, This week, This month, and custom period selection
- Useful empty, loading, and retry states

## Budgets

- Flexible recurring or one-time overall/category budgets
- Budget progress added to the existing dashboard

## Navigation

The authenticated home should make both speed and control obvious: fast multimodal capture at the top, recent activity below, and direct access to Accounts, Activity, Budgets, Dashboard, and Settings.
