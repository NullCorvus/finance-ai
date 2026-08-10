# Scope — Finance AI Tracker

## Core Vision
A personal finance tracking system powered by AI. Users submit expenses through natural language (receipt photo, audio note, or text) — the AI converts it to structured data, saves it to the database, and can answer queries about spending through chat with tool/function calling for graphs and analysis. Users can also register income to enable balance analysis (spending vs. earnings).

## AI Agent Vision

The AI is not just an input parser — it is an **agent** that owns the data:

- **Answers questions** about spending ("how much did I spend on milk?")
- **Acts** on the data: creates spending limits, generates subcategories, edits entries
- **Simulates scenarios**: "what if I replace rice with pasta?" → shows the difference
- **Generates charts and HTML reports** from the data
- **Accessible from the phone** (interface decision pending — Telegram / web / app)
- **Integrates with external tools** (optional): Google Workspace, e.g. Google Keep shopping lists

Advanced versions of these capabilities (simulation, price reference, Google Keep, chat-created limits, insights) are **Phase 3 features** — see `docs/FEATURES.md`.

## Input Methods
1. **Receipt photo** — AI vision extracts line items, store, total, date
2. **Audio** — short sentence or voice memo describing an expense
3. **Text** — manual entry

## Processing Flow

### Confirmation flow
```
User input → AI extracts structured data → Preview → [Confirm] [Edit] [Discard]
                                                              ↓
                                                          Save to DB
```

### Pre-save
- AI extracts data from the input (photo, audio, or text)
- User sees a preview with editable fields
- User can: **Confirm** (saves to DB) / **Edit** (change fields, re-preview) / **Discard** (delete everything, nothing saved)
- This handles edge cases: blurry receipts, inaudible audio, AI API failures, etc.

### Post-save
- Saved expenses can always be edited or deleted
- Specific edit/delete UI will be designed with the interface (Telegram, web, or app)

## Design Decisions

### Categories
- Main categories are predefined (Food, Transport, Entertainment, etc.)
- Subcategories are AI-generated on-the-fly based on purchase analysis
- AI suggests a category; user can override it

### Currencies
- Multiple currencies supported (USD + COP minimum)
- AI handles conversion with current rates
- Original amount + currency stored; conversion happens when displaying

### Spending Limits
- AI-assisted awareness, not rigid hard limits
- User expresses preferences ("I don't want to spend more than $50 on eating out")
- AI tracks and reports progress

### Reason/Context
- Each expense can capture why it was made (e.g., "was hungry", "impulse buy")
- Enables behavioral analysis: "Why am I spending so much on food?"

### Income Tracking
- Users register income (salary, freelance, gift...) with an optional description
- Income sources are a separate list from expense categories (Work, Freelance, Gift...)
- Enables balance analysis: "This month I earned 2M COP, spent 1.2M — balance 800k"
- Same currency rules as expenses: original currency stored, converted on display

### Receipt Items
- Full line-item extraction when available from receipts
- When input is audio/text, only the total + description is stored
- Analytics work at the expense level (total × category), items are bonus drill-down detail

## Interface Approach
To be decided with the professor and team. Options:

| Option | Pros | Cons |
|--------|------|------|
| Telegram bot + Mini App | Native chat + embedded web app, fast to prototype | Mini apps are less known |
| Web dashboard | Richer UI, works on any device | More frontend work |
| Mobile app (React Native/Flutter) | Most polished | Most work |
| Telegram + web combo | Input via Telegram, analytics via web | Two interfaces to maintain |

Note: Telegram has Mini Apps (embedded web apps) and inline keyboards, so it can handle more than just text/images — including interactive dashboards.

The architecture is **interface-agnostic** — core (AI + API + DB) is separated from presentation.

## Roles & Permissions

Two separate roles:

### User
- Register and log in via email/password
- Add expenses (receipt photo, audio, text)
- Register income (salary, freelance, gift...) with optional description
- Chat with AI about their own spending
- View graphs and analysis of their own data
- Set personal spending limits

### Admin
- Separate from User accounts (not a User with extra permissions)
- View system stats dashboard:
  - Total registered users
  - Total expenses in the system (aggregated)
  - Expenses grouped by category (all users combined)
  - Expenses over time (aggregated trend)
  - AI API usage (how many calls made)
- Manage users: list, create, disable accounts
- Configure the shared AI API key
- Admin does NOT view individual user expense data

**Data scoping rule:** every query is filtered by `user_id` — the server never returns another user's rows. The auth mechanism (sessions vs tokens) is defined when the stack is decided.

## Out of Scope
- Bank API integration (auto-import from bank)
- Investment / debt tracking
- Bill splitting
- Recurring subscription auto-detection

## Business Model
- Self-hosted app (runs on your server or locally)
- Shared AI API key configured once in the backend — you pay for API usage
- No subscription, no payment system
- Not a SaaS product — a project demo
