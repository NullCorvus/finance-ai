# HU-003 Financial Accounts — Frontend Components

## Shared Android/Windows Structure

All components live under one Flutter feature package and are shared by Android and Windows. The backend OpenAPI contract remains authoritative.

```text
HomeScreen
  -> AccountsScreen
       -> AccountList
       -> ShowInactiveControl
       -> NewAccountAction
       -> AccountDetailScreen
            -> EditAccountAction
            -> AccountStatusAction
            -> AccountDeleteAction
       -> AccountFormScreen
```

## Components

| Component | Responsibility | State/input |
|---|---|---|
| Home Accounts Entry | Open account management from authenticated Home | Route action |
| AccountsScreen | Present loading, empty, populated, refresh, failure, and inactive-filter states | AccountsController state |
| AccountList | Render deterministic account cards with name, type, currency, balance, and inactive styling | AccountView list |
| ShowInactiveControl | Reload list with inactive rows included | Boolean filter |
| AccountDetailScreen | Display metadata, opening balance, derived balance, and status | Owned account ID/detail state |
| AccountFormScreen | Shared create/edit form for name, type, currency, and opening balance | Form mode plus AccountOptions |
| AccountStatusAction | Explain and confirm deactivation; reactivate when allowed | Current AccountView |
| AccountDeleteAction | Explain permanent unused-account deletion, obtain a second explicit confirmation, and return to the canonical list after success | Current AccountView plus mutation state |
| AccountsController | Coordinate loads, refreshes, form submissions, and lifecycle mutations | Immutable idle/loading/saving/success/failure state |
| AccountsRepository | Translate Account domain commands to authenticated HTTP requests and typed results/failures | FinanceApiClient plus session controller |

## Routes

- `/accounts` — account list.
- `/accounts/new` — create form.
- `/accounts/:accountId` — detail.
- `/accounts/:accountId/edit` — edit form.

Existing authenticated redirects protect every route. A missing/expired session follows HU-002 restoration/login behavior.

## List and Empty State

- Active accounts appear by default.
- A clearly labeled control includes inactive accounts.
- Each row shows account name, readable type, currency code, and derived balance.
- Negative values use a minus sign and accessible debt/negative semantics; color is never the only indicator.
- The empty state explains that accounts represent Cash, Nequi, Bancolombia, savings, credit cards, or another place where money is tracked.
- A quick Cash suggestion may prefill the form, but the client never creates an account without explicit Save.

## Create and Edit Form

Required controls are name, type, currency, and opening balance. The form obtains account types, active currencies, and suggested currency from the account-list contract.

- Name: trimmed display string, maximum 100 characters.
- Type: controlled dropdown with human-readable labels.
- Currency: explicit dropdown; preselected suggestion remains editable.
- Opening balance: locale-tolerant text entry converted to an exact two-decimal API string without binary floating-point calculations.
- Edit mode retains saved values and does not replace them with suggestions.
- Currency is disabled with an explanation once the API indicates confirmed activity; the server remains authoritative.
- Repeated Save taps are ignored while saving.

## Deactivation Interaction

The confirmation explains:

> This account will remain in your history but will no longer be available for new financial entries.

Deactivation is not presented as deletion. Inactive detail offers Reactivate. A conflict preserves the inactive state and shows a safe diagnostic without including the account name or balances.

## Permanent Deletion Interaction

Account detail presents deletion as a separate destructive action. Selecting it opens a confirmation that explains the account will be permanently removed only if it has no financial activity. The confirmation offers Cancel and the explicit destructive action; repeated taps are disabled while saving.

Successful deletion removes the account from client state, refreshes the authoritative list, and navigates back to `/accounts`. `account_delete_blocked` keeps the detail visible and directs the user to deactivate the account so history remains intact. Uncertain transport outcomes require a list refresh before another deletion attempt.

## State Model

The controller separates list, detail, and mutation progress so a background refresh does not discard a visible form. Successful create/update/status changes refresh the canonical list and replace stale detail. Failed mutations preserve non-sensitive form values locally but never place them into diagnostics.

## Safe Failures

| API code | User-facing direction |
|---|---|
| `account_name_conflict` | Ask the user to choose another active account name |
| `account_currency_invalid` | Refresh currency choices and request a supported currency |
| `account_currency_locked` | Explain that currency cannot change after account activity |
| `account_not_found` | Return to accounts and refresh |
| `account_reactivation_conflict` | Keep inactive and explain that its name/currency must be resolved |
| `account_delete_blocked` | Preserve the account and explain that accounts with financial activity should be deactivated |
| `network_unavailable` | Preserve the screen and offer retry |
| Other safe problem | Use the shared unexpected-response diagnostic |

Every failure uses the shared `ErrorDiagnostic` and copy action. Reports contain operation, UTC time, client platform, sanitized API path, correlation ID, stable code, and bounded safe reason only.

## Automation and Accessibility

Stable keys include `home-accounts-button`, `accounts-list`, `accounts-show-inactive`, `accounts-add-button`, `account-name-field`, `account-type-field`, `account-currency-field`, `account-opening-balance-field`, `account-save-button`, `account-edit-button`, `account-deactivate-button`, `account-reactivate-button`, `account-delete-button`, and `account-confirm-delete-button`.

Labels, focus order, keyboard operation, progress announcements, confirmation dialogs, and minimum touch targets apply equally on Android and Windows. Tests verify that sensitive financial form values never appear in copied diagnostics.
