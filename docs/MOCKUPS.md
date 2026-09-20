# Mockups — Finance AI Tracker

> **Status:** PROPOSAL — interactive mockup built as a single self-contained HTML file.
> Open it in any browser: `docs/mockups/index.html` (auth flow · 3 tabs · management screens, clickable).
> UI in Spanish, mockup documentation in English. No frameworks, no dependencies.

## Design decisions (2026-08-17, revised 2026-08-28: single hub, no chat)

- **ONE hub screen — "Gastos"** (3 tabs: Gastos · Dashboard · Ajustes). Capture,
  confirmation, manual entry and the list all live in the same screen. There is NO chat:
  the conversational parts (reply mode, chat history, agent) are Phase 3 and are not
  mocked up (`ALCANCE.md`: chat is optional and can be skipped entirely).
- **Hub shows recent history (2026-09-20):** the capture-only empty hub now opens with a
  preloaded "Historial reciente" (4 demo movements) grouped like the schema:
  `financial_transaction(source)` > `receipt(store, total)` > `expense(items)` — capture badge
  per source (📷 foto / 🎤 voz / T texto / ✎ manual), receipt groups expand on tap to show
  items, and income rows render green "+ $" with the income source. Saving from the AI card
  (Confirmar) or the manual form prepends a new entry. A pretty empty state (🧾 + CTA)
  replaces the list if everything is removed; the hint text lives there now.
- **Radial capture menu — fan-out from the launcher (2026-09-20, rev 2):** the static capture
  bar was replaced by a circular launcher button (+, bottom-right). Tapping it shows a soft
  scrim and 4 small app-styled bubbles (54px, white cards, UdeC-green hover) that pop out
  from the button in a quarter-arc — 📷 Foto · 🎤 Voz · T Texto · ✎ Manual — each staggered
  50 ms; the + icon rotates 45° into a close affordance. Picking a bubble closes the menu and
  opens the existing flow (AI card / manual form). Close by tapping the scrim or Esc; demo
  failure buttons sit above the fan and close it too. Decided after reviewing the
  sheet-of-cards variant B (see `input-variants.html` and `input-flow-b.html` for the
  full-flow standalone reference).
- **Fast manual entry is ALWAYS reachable (HU-006 & HU-005):** the ✎ Manual slot in the
  wheel opens the fast manual capture form — Hero Amount ($ 0), Merchant/Description, and
  Payment Account chips (💵 Efectivo, 🟣 Nequi, 🟡 Bancolombia) with collapsed optional
  details (Category, Date, Note); ✏️ edit opens the SAME form pre-filled (HU-008). Incomes
  use the same fast model (+ $ 0, Source chips, Destination Account). No receipt rows required.
- **"Mis gastos" opens as a sub-screen (not inline):** tapping 🔍 in the header hides
  the hub and shows the search screen with a back arrow (←) to return. The search + chips
  + date range + receipt list live there; the hub stays clean for capture. Delete
  confirmations still work in the list.
- **Dedicated AI capture preview screen (Foto / Voz / Texto):** tapping 📷 Foto, 🎤 Voz, or
  T Texto now opens a dedicated review screen (`#screen-capture-preview`) with a back button (←)
  and evidence preview instead of cluttering the main Hub inline:
  - For photo: shows photo evidence with an "＋ Agregar otra foto / página" button for multi-page/long receipts.
  - For voice: shows voice memo player with waveform and transcription.
  - For text: shows natural language input card.
  - Below the evidence: the AI confirmation card with Confirmar y guardar / Editar / Descartar.
  - Tapping ← or Descartar returns cleanly to the Hub.
- **Failure states are demonstrable in the prototype:** compact Demo controls expose
  partial extraction, unreadable receipt, timeout, and camera-permission-denied states;
  each keeps saving blocked and offers retry or manual fallback as appropriate.
- **Confirmation card shows ALL receipt items** (product, qty, price, category — editable
  line by line) + Monto total, Fecha, Categoría, Subcategoría, **Pago** (Efectivo/Tarjeta...)
  and **Moneda** (COP/USD) — the AI infers these from the receipt and the user confirms/edits
  them (defaults "Efectivo" / "COP"). For photos, the printed receipt total is preserved even
  when it differs from the item sum; manual multi-item forms calculate the total from items.
  No "Nota" field (expenses).
  Buttons: Confirmar / Editar / Descartar. Nothing is saved until Confirmar.
- **Reasons are optional FIELDS, not conversation:** motivo de la compra / motivo del
  item live in "Campos adicionales" (form) and on the card — the old reply-mode flow was
  removed together with the chat.
- **Gasto/Ingreso selection lives in the form, not the capture bar:** a segmented
  toggle at the top of the manual form swaps between the expense form and the income
  form (monto · fecha · fuente · nota — income form is UI-ready, its stories are still
  pending). On capture paths (photo/voice/natural-language text) the AI infers the type and the card tag
  shows it; a misdetection is fixed via Editar → toggle. Income stories are still
  pending (proposal E4 keeps analytics category-only).
- **Dashboard:** Balance del mes (Ingresos − Gastos = Balance, green/red) + monthly trend
  (gastos vs ingresos) + bar chart by category with **subcategory drill-down** (tap a bar) +
  recent movements table (income/gasto chips).
- **Ajustes with real actions:** "+ Agregar categoría" and "+ Agregar límite" buttons.
  Limits can also be requested conversationally via chat (Phase 3). Subcategory counts shown.
- **Gastos tab (manual management — HU-003/HU-004):** "Mis gastos" list grouped by
  receipt — store + date + Pago/Moneda + total, with 🧾 foto chip — and item rows
  (name · subcategory · amount) with ✏️ edit / 🗑 delete. Manual form ("Agregar gasto
  manual"): the user only types **monto, tienda y subcategoría**; Fecha (hoy), Pago
  (Efectivo) y Moneda (COP) come defaulted and editable; **"Agregar item"** adds item
  rows under the same receipt (1 recibo → N items, per schema 1:N) and the
  **manual total is auto-calculated** as the sum of item amounts; single-item name auto-fills
  from the store text; "Campos adicionales" (collapsed): foto, motivo de la compra,
  motivo del item. Delete **always confirms**: item delete keeps a manual receipt and
  re-sums its total; for a photo receipt, the printed total is preserved unless the user
  explicitly edits it (deleting the last item deletes its receipt too — DB CHECK
  `total > 0`); ticket delete removes receipt + items + photo file.
- **Colors:** clean/light — background `#F5F6F8`, white cards, UdeC green `#6B8E00` primary,
  income green `#0E9F6E`, confirm `#16A34A`, discard `#DC2626`.
  **Dark theme included:** toggle (sun/moon) in the app header switches the whole mockup
  to a dark palette (background `#101318`, cards `#1A2027`, brighter green `#8FB42C`).
   Choice persists via `localStorage`.
- **Auth visual language:** supplied Android-style composition with full neutral background,
  compact orbit logo, icon inputs, dynamic focus border, loading button state, ordered links,
  and no social-login providers.

## Screens

1. **Login / Registro** — reference-style centered auth layout with email and password fields,
   visibility controls, validation, generic invalid-credentials state, registration success,
   and demo-only navigation into the app. No Google or Apple buttons.
2. **Gastos (single hub)** — capture bar (photo · voice · text) + AI confirmation card
   sample (all items, Confirmar/Editar/Descartar) + "Agregar gasto manual" button +
   "Mis gastos": live search, category chips, list grouped by receipt (✏️ edit opens the
   same form pre-filled, 🗑 delete with confirmation sheet).
3. **Nuevo gasto** — manual form (back button; multi-item rows, auto-sum total, collapsed
   additional fields). The same form, pre-filled, is used for EDIT.
4. **Dashboard** — Balance del mes, trend, bar chart with subcategory drill-down, recent
   movements. ⚠️ proposal E4 = analytics by category ONLY (no trends/balance) — trim the
   balance/trend sections before the demo.
5. **Ajustes** — account entry point, categories, and income sources. Unimplemented limits and
   preferences stay hidden until their code exists.
6. **Cuentas y saldos** — owned cash, bank, and savings accounts with type, currency,
   balance, add-account form, and edit actions (HU-003).
7. **Categorías / Fuentes de ingreso** — owned catalog lists with add and edit forms,
   delete confirmation, subcategory/source details, visible color swatches, icon choices,
   currency choices, and historical-record copy (HU-004/HU-005).

## Not represented (deferred)

- Real authentication, API calls, token storage, and protected routing — auth screens are visual-only.
- Free AI conversation (Phase 3) — the chat tab is merged into Inicio; free talk is optional Phase 3.

## Files

- `docs/mockups/index.html` — the interactive mockup (source of truth for the visual).
- `docs/mockups/input-flow-b.html` — full flow mockup of the chosen input variant B
  (Extended FAB → bottom sheet → camera / voice / text / manual form → AI confirmation card
  → saved), with failure states (permission denied, unreadable receipt), edit-prefilled form
  and Gasto/Ingreso toggle. Standalone, same visual language as `index.html`.
- This file — the short design-summary (ASCII/plain version if needed later).

## Related

- Feature list: `docs/FEATURES.md` (Phase 1 capture flow, Phase 2 dashboard).
- Schema (reason fields): `docs/SCHEMA.md` — `purchase_reason` / `item_reason`.
- Pending: user visual review of `index.html` in a browser (I can't view images).
