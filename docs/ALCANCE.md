# Scope — Finance AI Tracker

> **Academic scope and implementation status:** this document preserves the project's stated
> goals and original design choices. Technical statements marked as original plans are not a
> description of the current runtime. For the implementation snapshot, see `docs/ARCHITECTURE.md`
> and `docs/STACK.md` (backend `origin/develop` `1fae699`; frontend `origin/develop` `a23a8a6`).

## Core Vision
A personal finance tracking system with a **Flutter app** and a **backend (API + DB)**. A VM was the original hosting target; local development now uses Docker Compose with PostgreSQL, and the backend repository has a separate Cloud Run deployment workflow. Users register expenses through the app — either manually or AI-assisted (receipt photo, spoken input, or text, where AI proposes structured data for review). The backend owns financial data, computes analytics, and answers dashboard queries. Users can also register income to enable balance analysis (spending vs. earnings).

**The AI is used for assisted capture in the core**, not autonomous financial writes. The original one-call design is superseded by backend text and receipt gateways for Gemini and DeepSeek, with conditional retries/fallback. Android recognizes speech locally and sends the transcript through text capture; the backend does not send raw audio to a model. A proposal may be stored temporarily, but no financial operation is committed until the user confirms. Manual form entry remains a direct fallback. The phone never calls the AI provider directly.

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
2. **Spoken input** — a short utterance is transcribed locally, then its text enters the proposal flow (HU-014). Direct server-side audio parsing was an earlier design, not the implemented path.
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
- Text and receipt-photo proposals use backend gateways; configured provider retries or fallback can make more than one external request. Spoken input is first transcribed on the device and then follows the text path.
- Structured data includes the purchase facts: store, date, **payment method**, **currency**, total, and line items (when the receipt has them). The AI infers payment method + currency from the receipt; the *user* confirms or corrects them on the confirmation card (defaults "Efectivo" / "COP" if the input doesn't expose them).
- User sees a preview with editable fields
- User can: **Confirm** (commits the financial operation) / **Edit** (change fields, re-preview) / **Discard** (remove the proposal without committing an operation). Temporary proposal data can exist before confirmation.
- Manual form entry bypasses the AI entirely and saves directly after validation; typed natural-language text in the capture bar uses AI and requires confirmation
- This handles edge cases: blurry receipts, inaudible audio, AI API failures, etc.

### Post-save
- Saved expenses can always be edited or deleted in the app

## Design Decisions

### Categories
- Original design: main categories are predefined (Food, Transport, Entertainment, etc.);
  subcategories may be AI-suggested and the user may override or add classification.
- Implemented text capture supplies the user's **categories** in `CaptureContext` for proposals;
  it does not send a list of existing subcategories as the original design assumed. This does not
  change the future subcategory objective.

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
| Backend (FastAPI/Python) | Gatekeeper: opaque, renewable database-backed sessions; owns financial data, computes analytics, and calls configured AI gateways for text/receipt proposals. Holds DB credentials and provider keys. |
| Database (PostgreSQL) | Used by the backend. Local Compose runs PostgreSQL for development; the phone never connects to it directly. Production deployment must be assessed separately. |

The VM target is preserved as an original design decision. It does not describe the current development setup or prove a production topology.

## Roles & Permissions

The original scope considered two roles; only the regular user is part of the current core:

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

**Data scoping rule:** user-owned financial records must be isolated by owner. The original JWT decision was replaced by opaque access and renewable credentials backed by revocable server sessions; see `docs/STACK.md` and the backend auth module.

## Data Protection

- **Core (now):** the confirmation gate prevents a financial operation from being committed without the user's explicit action. Application services may persist a temporary proposal before confirmation; the external AI provider does not directly write financial records. Post-save edits/deletes are normal user actions. **No audit/change-log table in core** — this remains the original scope decision, not a claim that no operational records exist.
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

## Business Model (original proposal)
- Self-hosted app (runs on your server or locally)
- Shared AI API key configured once in the backend — you pay for API usage
- No subscription, no payment system
- Not a SaaS product — a project demo
