# Mockups — Finance AI Tracker

> **Status:** PROPOSAL — interactive mockup built as a single self-contained HTML file.
> Open it in any browser: `docs/mockups/index.html` (3 tabs · 4 screens, clickable).
> UI in Spanish, mockup documentation in English. No frameworks, no dependencies.

## Design decisions (2026-08-17, revised 2026-08-28: single hub, no chat)

- **ONE hub screen — "Gastos"** (3 tabs: Gastos · Dashboard · Ajustes). Capture,
  confirmation, manual entry and the list all live in the same screen. There is NO chat:
  the conversational parts (reply mode, chat history, agent) are Phase 3 and are not
  mocked up (`ALCANCE.md`: chat is optional and can be skipped entirely).
- **Capture bar (bottom):** **photo · voice · text** — exactly the three channels the
  professor proposal promises ("captura por foto, voz o texto con confirmación"). Text is
  a capture channel, NOT a chat: whatever goes in goes through ONE AI parse → ONE
  confirmation card. Placeholder: "gasté 15 mil en almuerzo en Subway…".
- **Manual entry is ALWAYS visible:** a ✍️ button sits permanently in the capture bar
  (next to 📷 and 🎤) — it opens the form (HU-005a); ✏️ edit opens the SAME form
  pre-filled (HU-005b) — one form for create + edit. It never gets buried or lost.
- **"Mis gastos" is hidden until you search:** a 🔍 button in the header toggles the
  search + category chips + receipt list (HU-005b/005c). The screen starts clean on the
  capture flow.
- **Interactive capture flow (like the original chat menu):** send photo/voice/text →
  the AI card menu appears with items marked "editable" + Confirmar / Editar / Descartar
  + the motivo reply bar. Confirmar → "✅ Gasto guardado"; Editar → the pre-filled form;
  Descartar → back to the empty state.
- **Confirmation card shows ALL receipt items** (product, qty, price, category — editable
  line by line) + Monto total, Fecha, Categoría, Subcategoría, **Pago** (Efectivo/Tarjeta...)
  and **Moneda** (COP/USD) — the AI infers these from the receipt and the user confirms/edits
  them (defaults "Efectivo" / "COP"). No "Nota" field (expenses).
  Buttons: Confirmar / Editar / Descartar. Nothing is saved until Confirmar.
- **Reasons are optional FIELDS, not conversation:** motivo de la compra / motivo del
  item live in "Campos adicionales" (form) and on the card — the old reply-mode flow was
  removed together with the chat.
- **Gasto/Ingreso selection lives in the form, not the capture bar:** a segmented
  toggle at the top of the manual form swaps between the expense form and the income
  form (monto · fecha · fuente · nota — income form is UI-ready, its stories are still
  pending). On capture paths (photo/voice/text) the AI infers the type and the card tag
  shows it; a misdetection is fixed via Editar → toggle. Income stories are still
  pending (proposal E4 keeps analytics category-only).
- **Dashboard:** Balance del mes (Ingresos − Gastos = Balance, green/red) + monthly trend
  (gastos vs ingresos) + bar chart by category with **subcategory drill-down** (tap a bar) +
  recent movements table (income/gasto chips).
- **Ajustes with real actions:** "+ Agregar categoría" and "+ Agregar límite" buttons.
  Limits can also be requested conversationally via chat (Phase 3). Subcategory counts shown.
- **Gastos tab (manual management — HU-005a/005b):** "Mis gastos" list grouped by
  receipt — store + date + Pago/Moneda + total, with 🧾 foto chip — and item rows
  (name · subcategory · amount) with ✏️ edit / 🗑 delete. Manual form ("Agregar gasto
  manual"): the user only types **monto, tienda y subcategoría**; Fecha (hoy), Pago
  (Efectivo) y Moneda (COP) come defaulted and editable; **"Agregar item"** adds item
  rows under the same receipt (1 recibo → N items, per schema 1:N) and the
  **total is auto-calculated** as the sum of item amounts; single-item name auto-fills
  from the store text; "Campos adicionales" (collapsed): foto, motivo de la compra,
  motivo del item. Delete **always confirms**: item delete keeps the receipt and
  re-sums the total (deleting the last item deletes its receipt too — DB CHECK
  `total > 0`); ticket delete removes receipt + items + photo file.
- **Colors:** clean/light — background `#F5F6F8`, white cards, UdeC green `#6B8E00` primary,
  income green `#0E9F6E`, confirm `#16A34A`, discard `#DC2626`.
  **Dark theme included:** toggle (sun/moon) in the chat header switches the whole mockup
  to a dark palette (background `#101318`, cards `#1A2027`, brighter green `#8FB42C`).
  Choice persists via `localStorage`.

## Screens

1. **Gastos (single hub)** — capture bar (photo · voice · text) + AI confirmation card
   sample (all items, Confirmar/Editar/Descartar) + "Agregar gasto manual" button +
   "Mis gastos": live search, category chips, list grouped by receipt (✏️ edit opens the
   same form pre-filled, 🗑 delete with confirmation sheet).
2. **Nuevo gasto** — manual form (back button; multi-item rows, auto-sum total, collapsed
   additional fields). The same form, pre-filled, is used for EDIT.
3. **Dashboard** — Balance del mes, trend, bar chart with subcategory drill-down, recent
   movements. ⚠️ proposal E4 = analytics by category ONLY (no trends/balance) — trim the
   balance/trend sections before the demo.
4. **Ajustes** — categories (with subcategory counts), "+ Agregar categoría", limits
   (FASE 3 / optional) with "+ Agregar límite", currency COP/USD.

## Not represented (deferred)

- **Login/register (auth, Phase 0)** — deliberately out for now (infrastructure, not capture UX).
- Free AI conversation (Phase 3) — the chat tab is merged into Inicio; free talk is optional Phase 3.

## Files

- `docs/mockups/index.html` — the interactive mockup (source of truth for the visual).
- This file — the short design-summary (ASCII/plain version if needed later).

## Related

- Feature list: `docs/FEATURES.md` (Phase 1 capture flow, Phase 2 dashboard).
- Schema (reason fields): `docs/SCHEMA.md` — `purchase_reason` / `item_reason`.
- Pending: user visual review of `index.html` in a browser (I can't view images).
