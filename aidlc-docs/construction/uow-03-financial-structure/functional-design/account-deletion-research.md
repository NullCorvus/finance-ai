# Account Deletion Research

## Purpose

Define what "delete account" should mean in Finance AI before adding a destructive API or UI. Account deletion is not equivalent to deleting an ordinary profile row: an account anchors balances, expenses, income, transfers, receipts, budgets, and reports.

## What Established Personal-Finance Apps Do

The common product model has three distinct actions:

1. **Hide or close the account.** History is preserved, the account leaves normal day-to-day views, and it can usually be reopened. YNAB recommends closing accounts that contain transaction history rather than deleting them. Actual Budget similarly keeps closed accounts in a separate section and can transfer a remaining balance during closure.
2. **Move or merge the history, then delete the old account.** YNAB documents creating a replacement account, moving transactions, and only then deleting the original. Monarch provides an explicit flow to transfer transaction and balance history to another account before the old account is removed.
3. **Permanently erase the account and its related data.** Monarch exposes this as a last-resort operation and warns that account history is removed. Actual Budget's API also distinguishes closing from deleting and warns that deleting an on-budget account makes its money disappear.

These are different user intentions and should not share one ambiguous button.

## Sources

- YNAB, "How to Close or Delete an Account": https://support.ynab.com/how-to-close-or-delete-an-account-in-ynab-ry_409Gko?mobile-help=true
- YNAB, "File-Based Import: A Guide": https://support.ynab.com/en_us/file-based-import-a-guide-Bkj4Sszyo
- Actual Budget, "Accounts": https://master.www.actualbudget.org/docs/accounts/
- Actual Budget, "API Reference": https://actualbudget.org/docs/api/reference/
- Monarch, "Hiding an Account": https://help.monarch.com/hc/en-us/articles/4407859794580-Hiding-an-Account
- Monarch, "Delete a Connection vs. Delete an Account": https://help.monarch.com/hc/en-us/articles/360054863431-Delete-a-Connection-Financial-Institution-vs-Delete-an-Account
- Monarch, "Transfer Balance and/or Transaction History to Another Account": https://help.monarch.com/hc/en-us/articles/14329385694484-Transfer-Balance-and-or-Transaction-History-to-Another-Account

## Recommended Finance AI Product Model

### 1. Deactivate — normal and reversible

- Keep the existing deactivate/reactivate action as the normal choice for an account the user no longer uses.
- Preserve every historical expense, income, transfer, receipt relationship, budget result, and report.
- Keep the inactive account visible in history while preventing new movements.

### 2. Delete an unused account — simple permanent deletion

- If an account has no movements, allow immediate hard deletion after a clear confirmation.
- An opening balance does not need to block deletion because it is account metadata, not an independent movement in the current model.
- Ownership checks must make a foreign account indistinguishable from a missing account.

### 3. Delete a used account — explicit advanced workflow

Offer two deliberate paths once public expense, income, transfer, and receipt dependencies are implemented:

- **Move history, then delete** (recommended): select another owned account with a compatible currency, move eligible history atomically, recompute derived balances, preview the result, and delete the now-unused account.
- **Delete the account and all associated financial data** (advanced danger zone): show the exact impact first, require the account name to be typed, require a final confirmation, and delete the affected financial records atomically. Never silently cascade from a routine delete button.

Before destructive deletion, show counts for transactions, expenses, transfers, receipt/media relationships, and any affected budgets or reports. Offer a data export when that feature exists.

## Important Data Rules

- Retain the database's restrictive account-movement foreign key as the last safety barrier. Destructive workflows should perform explicit service-level operations inside one transaction rather than relying on a blind database cascade.
- A transfer is one financial event with movements in at least two accounts. Deleting only one movement would corrupt the event. A destructive delete must either move/rehome the transfer or delete the entire transfer event; deleting it changes the other account's derived balance and must be shown in the impact preview.
- Moving history is permitted only between accounts owned by the same user. Same-currency movement is the safe MVP rule; cross-currency migration needs an explicit conversion model and is outside HU-003.
- When an expense is removed, delete a shared receipt or image only if it becomes orphaned. A receipt containing other expenses must remain.
- Budgets and reports are projections of remaining transactions and must be recalculated after a move or destructive deletion.
- Record an audit event for the destructive action without logging account names, balances, transaction descriptions, or image contents.

## Delivery Recommendation

Implement this in two stages:

1. **HU-003 now:** add hard deletion for unused owned accounts. If history exists, present deactivate as the safe available action.
2. **With the transaction/receipt stories:** add impact preview, move-history-and-delete, and the advanced delete-all workflow after the final expense, income, transfer, and receipt ownership rules exist.

This staging does not deny users a true deletion feature. It avoids defining destructive behavior against internal placeholder movement tables before the real transaction graph exists, while making the common unused-account cleanup available immediately.
