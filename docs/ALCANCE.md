# Scope — Finance AI Tracker

## Core Vision
A personal finance tracking system with a **Flutter app** and a **backend (API + DB) running on a VM**. Users register expenses through the app — either manually or AI-assisted (receipt photo, audio note, or text, where the AI converts the input to structured JSON for the user to confirm). The backend owns the data, computes analytics, and answers dashboard queries. Users can also register income to enable balance analysis (spending vs. earnings).

**The AI is used only for input parsing in the core** — one call from the backend to the LLM provider that turns a photo/audio/natural-language text input into structured data. The user always confirms, edits, or retries before anything is saved. Manual form entry always works as a direct fallback. The phone never calls the AI API directly.

## Optional "Agent" Vision (Phase 3 — ideas, not core)

The AI *acting* on data (or chatting about it) is **not part of the core**. It is an optional, Phase 3 set of ideas that can be skipped entirely:

- **Chat with AI** — answers questions about spending ("how much did I spend on milk?") via read-only tool calls
- **Acts** on the data: creates spending limits, generates subcategories, edits entries
- **Simulates scenarios**: "what if I replace rice with pasta?" → shows the difference
- **Generates charts and HTML reports** from the data
- **Integrates with external tools** (optional): Google Workspace, e.g. Google Keep shopping lists

See `docs/FEATURES.md` — Phase 3. The architecture keeps these possible later (the agent would run inside the backend, still not on the phone), but they are explicitly out of the core build.

## Input Methods
1. **Receipt photo** — AI vision extracts line items, store, total, date
2. **Audio** — short sentence or voice memo describing an expense; AI parsing is planned for HU-009
3. **Manual form** — direct entry that bypasses AI and saves after validation
4. **Natural-language text** — a sentence typed in the capture bar; AI converts it into structured data for confirmation

## Processing Flow

### Confirmation flow
```
User input → AI extracts structured data (JSON) → Preview → [Confirm] [Edit] [Discard]
                                                                        ↓
                                                                    Save to DB
```

### Pre-save
- AI extracts data from AI-assisted input (photo, audio, or natural-language text) — **one call from the backend to the AI API**
- Structured data includes the purchase facts: store, date, **payment method**, **currency**, total, and line items (when the receipt has them). The AI infers payment method + currency from the receipt; the *user* confirms or corrects them on the confirmation card (defaults "Efectivo" / "COP" if the input doesn't expose them).
- User sees a preview with editable fields
- User can: **Confirm** (saves to DB) / **Edit** (change fields, re-preview) / **Discard** (delete everything, nothing saved)
- Manual form entry bypasses the AI entirely and saves directly after validation; typed natural-language text in the capture bar uses AI and requires confirmation
- This handles edge cases: blurry receipts, inaudible audio, AI API failures, etc.

### Post-save
- Saved expenses can always be edited or deleted in the app

## Design Decisions

### Categories
- Main categories are predefined (Food, Transport, Entertainment, etc.)
- Subcategories can be AI-suggested on-the-fly, but **the backend sends the user's existing subcategories to the AI in the prompt** so suggestions come from the known list first
- AI suggests a category/subcategory; user can override or add a new one

### Currencies
- Multiple currencies supported (USD + COP minimum)
- AI handles conversion with current rates (Phase 3 — see FEATURES 9)
- Original amount + currency stored; conversion happens when displaying

### Spending Limits
- AI-assisted awareness, not rigid hard limits (Phase 3 — see FEATURES 10)
- User expresses preferences ("I don't want to spend more than $50 on eating out")
- AI tracks and reports progress

### Reason/Context
- Each expense can capture why it was made (e.g., "was hungry", "impulse buy")
- Enables behavioral analysis: "Why am I spending so much on food?" (Phase 3 insight)

### Income Tracking
- Users register income (salary, freelance, gift...) with an optional description
- Income sources are a separate list from expense categories (Work, Freelance, Gift...)
- Enables balance analysis: "This month I earned 2M COP, spent 1.2M — balance 800k"
- Same currency rules as expenses: original currency stored, converted on display

### Receipt Items
- Full line-item extraction when available from receipts
- When AI-assisted input is audio/natural-language text, only the total + description is stored; the manual form may contain multiple receipt items
- Analytics work at the expense level (total × category), items are bonus drill-down detail

## Interface Approach
**Flutter app** (thin client) + **backend API** (stack: see `docs/STACK.md`):

| Piece | Role |
|-------|------|
| Flutter app | Sends input, shows previews, Confirm/Edit/Discard, dashboard + charts. Needs internet. |
| Backend (VM, FastAPI/Python) | Gatekeeper: auth (JWT), owns the data, computes analytics (plain SQL), calls the AI API only for parsing. Holds DB credentials + AI API key. |
| Database (PostgreSQL) | Lives on the VM next to the backend. The phone never connects to it directly. |

No VM is strictly required for a demo (backend can run on a laptop), but the design targets hosting the backend + DB on a VM so the app works from anywhere.

## Roles & Permissions

Two separate roles:

### User
- Register and log in via email/password
- Add expenses (receipt photo, audio, natural-language text — AI-assisted with confirmation; manual form direct-save)
- Register income (salary, freelance, gift...) with optional description
- View dashboard, graphs, and analysis of their own data
- Set personal spending limits (Phase 3)

### Admin (future scope — excluded from the current core)

> The admin role is documented as a future capability, but it is not part of the current
> MVP and is deliberately excluded from the current architecture. The current build targets
> regular users; admin UI, endpoints, and operational permissions remain undefined.

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

**Data scoping rule:** every query is filtered by `user_id` — the server never returns another user's rows. **Auth mechanism decided: JWT** (stateless tokens) — see `docs/STACK.md`.

## Data Protection

- **Core (now):** the confirmation gate. Nothing is saved without the user's explicit action (Confirm/Edit/Discard preview). The AI only *reads* inputs — it never writes to the DB in the core. Post-save edits/deletes are normal user actions. **No audit/change-log table in core** — data is personal, single-account; undo = delete + re-enter.
- **Agent writes (Phase 3 only):** if the optional agent features are built, the AI agent never modifies data without approval. Every agent write (create/edit limits, subcategories, etc.) shows a preview first and goes through the same Confirm/Edit/Discard menu as expenses.
- **Undo (Phase 3 only):** if agent features are built, an `audit_log` table records what changed, who (agent vs user), when, and the old → new value — enables undo of agent or user changes. Created in construction *only if* Phase 3 is actually built.
- **Not in scope:** deleted-row retention, data export, GDPR-style right-to-be-forgotten — out of scope for this prototype.
- **Backups:** database backups (e.g., pg_dump) belong to the operations phase, out of pre-semester scope.

## Out of Scope
- Bank API integration (auto-import from bank)
- Investment / debt tracking
- Bill splitting
- Recurring subscription auto-detection
- Agent/chat features in the core (Phase 3 optional only)
- Offline mode for the app (it needs internet; caching last-loaded data is a possible future idea)
- VM provisioning / deployment in the pre-semester phase (design targets a VM, but setup is post-semester)

## Business Model
- Self-hosted app (runs on your server or locally)
- Shared AI API key configured once in the backend — you pay for API usage
- No subscription, no payment system
- Not a SaaS product — a project demo
