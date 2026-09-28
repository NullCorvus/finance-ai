# Functional Design: Business Rules - hu-015-expense-confirmation

## Business Rules Matrix

| Rule ID | Rule Name | Description |
|---|---|---|
| **BR-CONF-01** | Tenant Isolation | The receipt proposal, target account, and optional category must all belong to `current_user_id`. Cross-user access is rejected with HTTP 404. |
| **BR-CONF-02** | Valid Proposal State | Only proposals with status `complete`, `partial` or `failed_extraction` can be confirmed. `failed_extraction` is the provider-outage fallback: the client fills every required field by hand, so the confirmation payload is the source of truth and the draft must not be a dead end. Status `not_a_receipt` or `discarded` is rejected with HTTP 422 / 409. |
| **BR-CONF-03** | Expiration Gate | Proposals past their `expires_at` timestamp cannot be confirmed and return HTTP 422 (Proposal expired). |
| **BR-CONF-04** | Account & Currency Match | The selected `account_id` must be active and owned by the user. The confirmed transaction currency must match the account's registered currency. |
| **BR-CONF-05** | Authoritative Confirmed Total | The confirmed `total_amount` is strictly authoritative for `financial_transaction`, `account_movement` (negative amount), and `receipt.total`. Discrepancies with item sums (due to tips, taxes, or unitemized fees) are permitted. |
| **BR-CONF-06** | Multi-Item Granularity | Confirmed receipt items are persisted as distinct `expense` rows under the shared `receipt.id` with sequential 1-based positions (`position = 1, 2, ... N`), satisfying `uq_expense_receipt_position`. |
| **BR-CONF-07** | Fallback Single Item | If a proposal has zero line items, a single `expense` item is generated with `position = 1`, `name = merchant`, and `amount = total_amount`. |
| **BR-CONF-08** | Idempotency Guarantee | Re-transmitting a confirmation request for an already `confirmed` proposal returns HTTP 200 with the existing expense details, preventing double-counting or duplicate balance deductions. |
| **BR-CONF-09** | Audit Attribution | `financial_transaction.capture_source` is set to `receipt_photo_ai` to track origin and distinguish AI-scanned expenses from manual entries (`manual`). |
| **BR-CONF-10** | Model B Compliance | No persistent cloud object storage (GCS) is used. Neon PostgreSQL stores relational data only; binary image bytes are never written to the database. |
