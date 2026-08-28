# Mockups — Finance AI Tracker

> **Status:** PROPOSAL — interactive mockup built as a single self-contained HTML file.
> Open it in any browser: `docs/mockups/index.html` (4 tabs · 5 screens, clickable).
> UI in Spanish, mockup documentation in English. No frameworks, no dependencies.

## Design decisions (decided 2026-08-17)

- **The app IS a chat.** There is no separate home screen, no separate Chat tab, and no
  separate review screen. The Inicio tab opens the chat — capture and confirmation live
  in the same conversation (WhatsApp-style).
- **Capture-first, minimum friction:** "Gastaste → registra → listo". Photo is the hero:
  input bar priority **photo > voice > text** (big round shutter button, mic, text field —
  all visible, 1 tap, no hidden gestures).
- **Gasto / Ingreso toggle:** a stretched oval toggle above the input row switches between
  expense and income mode. Same input methods; for income, voice/text are the natural path
  (photo less likely). Income card = Monto · Fecha · Fuente (Salario/Freelance/Regalo…) · Nota.
- **Confirmation card shows ALL receipt items** (product, qty, price, category — editable
  line by line) + Monto total, Fecha, Categoría, Subcategoría, **Pago** (Efectivo/Tarjeta...)
  and **Moneda** (COP/USD) — the AI infers these from the receipt and the user confirms/edits
  them (defaults "Efectivo" / "COP"). No "Nota" field (expenses).
  Buttons: Confirmar / Editar / Descartar. Nothing is saved until Confirmar.
- **Reason (motivo) is optional and conversational:** tap the card or "💬 Agregar motivo"
  → input bar enters reply mode ("Respondiendo a: recibo $12.500 ✕") → audio/text →
  simple phrase = general reason (`purchase_reason`); phrase with a product = that item's
  reason (`item_reason`). No reply = confirm with no reason.
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

1. **Inicio = Chat** — the first thing seen. Conversation area + input bar with photo/mic/text
   + Gasto/Ingreso oval toggle. Sample: receipt photo → AI editable card (all items) → reply
   bar → income message → income card (source, no line items).
2. **Dashboard** — Balance del mes, trend, bar chart with subcategory drill-down, recent movements.
3. **Ajustes** — categories (with subcategory counts), "+ Agregar categoría", limits
   (FASE 3 / optional) with "+ Agregar límite", currency COP/USD.
4. **Gastos** — "Mis gastos" list grouped by receipt (tap ✏️ to edit, 🗑 to delete with
   confirmation sheet) + "Nuevo gasto" manual form (back button; multi-item rows,
   auto-sum total, collapsed additional fields).

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
