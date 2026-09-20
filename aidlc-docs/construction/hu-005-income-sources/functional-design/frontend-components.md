# Frontend Components — HU-005 Income Sources (simple testing UI)

> **Scope note (D8):** this is a minimal, testing-grade screen. Proper visual design waits for the
> mockup. Behavior and state wiring are what matter now.

## Component Hierarchy

```
IncomeSourcesScreen
├── IncomeSourcesErrorBanner        (diagnostic contract for failures)
├── AddIncomeSourceField            (text field + Add button)
├── IncomeSourceList
│   └── IncomeSourceTile            (name + Rename + Delete actions)
│       ├── RenameIncomeSourceDialog
│       └── DeleteIncomeSourceConfirmDialog
└── IncomeSourcesEmptyState
```

## State

| Provider | Purpose |
|---|---|
| `incomeSourcesRepositoryProvider` | Talks to `/api/v1/income-sources` |
| `incomeSourcesProvider` (AsyncNotifier) | Holds the list; exposes `create`, `rename`, `delete` |
| `IncomeSourcesState` | `loading` / `data(list)` / `error(diagnostic)` |

- After every successful mutation the notifier reloads (or optimistically updates) and notifies
  listeners so dependent selectors rebuild (BR-12).

## Interactions

| Action | Flow |
|---|---|
| Load screen | Fetch list -> render tiles, or empty state |
| Add | Trim input -> POST -> on success clear field and refresh list; on 422/409 show field error |
| Rename | Open dialog prefilled -> PATCH -> refresh; on 409 show duplicate error |
| Delete | Open **confirm dialog** -> DELETE -> refresh; on success row disappears |

## API Integration Points

| Component | Endpoint |
|---|---|
| List / refresh | `GET /api/v1/income-sources` |
| Add | `POST /api/v1/income-sources` |
| Rename | `PATCH /api/v1/income-sources/{id}` |
| Delete | `DELETE /api/v1/income-sources/{id}` |

All calls use the shared `FinanceApiClient` with the in-memory access credential. `patchJson` and
`deleteJson` are added to the client for this unit.

## Validation (client-side, mirrors server)

- Trim before submit; block empty; max length 100.
- Server remains authoritative; client shows the server's `field_errors` when present.

## Diagnostics

- Every user-visible failure uses `lib/core/diagnostics/` (stable code, operation, correlation id).
- Never surface names of other users, credentials, or raw exceptions.
