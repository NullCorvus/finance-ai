# HU-003 Account Deletion Revision

Research showed that established personal-finance apps normally separate closing, moving history, and permanent erasure. Please choose the Finance AI delivery policy. This decision controls the API, database behavior, UI confirmation, and future transaction-history safety.

## Question 1
How should Finance AI deliver permanent account deletion?

A) **Staged deletion (Recommended).** Implement hard deletion of unused accounts in HU-003. Keep deactivation for used accounts now. When the expense, income, transfer, and receipt stories define the complete dependency graph, add both "move history, then delete" and an advanced "delete account and all related data" danger-zone workflow with an impact preview.

B) **Full destructive deletion now.** Implement deletion of the account and all current related transactions/movements in HU-003, accepting that transfer behavior and future receipt/budget dependencies will need to be revised as those stories are built.

C) **Preserve-history deletion only.** A used account can be permanently deleted only after the user manually moves or removes all of its transactions; never offer a delete-all cascade.

[Answer]: A — approved by the user after reviewing the product research.

The earlier fallback answer was reopened after the user requested research into genuine deletion of a used account. The researched staged policy is now explicitly approved. Supporting analysis is in `../uow-03-financial-structure/functional-design/account-deletion-research.md`.
