# HU-003 Financial Accounts — NFR Design Patterns

## Exact Money Boundary

- PostgreSQL stores opening balances and movements as `NUMERIC(18,2)`.
- Python uses `Decimal` from request validation through response serialization.
- JSON represents monetary values as fixed two-decimal strings.
- Flutter validates and formats money through integer minor units and retains the server string as the canonical transport value.
- No component converts account money to Python `float` or Dart `double` for calculation.

This pattern prevents rounding drift across create, edit, balance aggregation, Android, and Windows.

## Layered Validation

Validation is deliberately duplicated at different trust boundaries without duplicating business ownership:

1. Flutter performs immediate usability checks for required values and decimal syntax.
2. Pydantic provides authoritative type, length, enum, and numeric bounds.
3. AccountPolicy normalizes names and applies cross-field rules.
4. AccountService resolves supported currency and lifecycle rules.
5. PostgreSQL enforces referential, check, composite-ownership, and active-name constraints under concurrency.

The server never trusts Flutter validation. Repository calls remain parameterized through SQLAlchemy.

## Owner-Scoped Repository Pattern

Every account query accepts the authenticated owner ID and includes it in the persistence predicate. Routes never accept `user_id` in a command. A foreign account ID and an absent ID therefore follow the same path and produce `account_not_found`.

Movement ownership uses composite relationships so a service error cannot associate one user's transaction with another user's account. This gives defense in depth beyond application filters.

## Constraint-Authoritative Uniqueness

AccountService may check normalized active-name availability for friendly feedback. The partial PostgreSQL unique index remains authoritative:

- Scope: one owner.
- Comparison: lowercased trimmed name.
- Applies only to active accounts.
- Concurrent losers roll back and map only the known constraint name to `account_name_conflict`.

Unrelated integrity failures remain safe internal errors.

## Short Unit of Work and Row Protection

- Input parsing and name/decimal normalization occur before opening a write transaction.
- Create opens the Unit of Work only for currency/account reads, stage, flush, and commit.
- Edit/status operations load and protect the owned account during final validation and mutation.
- Permanent deletion locks the owned account row, checks for movements of every status, stages the delete, flushes, and commits in one short Unit of Work.
- The restrictive account-movement foreign key is defense in depth against a missed or concurrent dependency; ordinary deletion never uses a cascade.
- Repositories never commit independently.
- Any exception or missing explicit commit rolls back and closes the session.
- Repeating the same requested active state succeeds without a second semantic transition.

No client automatically retries mutations after timeouts because the outcome may be uncertain. A refresh is the recovery mechanism.

## Derived Balance Query

Account list uses one PostgreSQL aggregation rather than one query per account:

```text
balance = opening_balance + COALESCE(SUM(confirmed movement amount), 0)
```

The query groups by account, filters transactions to `confirmed`, and uses account/transaction/status indexes. Detail applies the same expression for one owned ID. A shared query builder prevents list/detail calculation drift. Pending and voided transactions contribute nothing.

No balance cache or stored balance column is introduced. The initial empty movement set naturally returns opening balance.

## Active Account Gate

The account repository exposes two distinct lookups:

- Owned lookup: returns active or inactive records for account management/history.
- Active-owned lookup: used by future financial writes and fails closed for inactive records.

This avoids scattering `is_active` checks throughout later expense, income, and transfer services.

## Currency Safety

- Create and pre-activity currency edits resolve only active shared currency rows.
- Existing accounts always display their stored currency, even when that currency later becomes inactive.
- Confirmed movement existence locks currency permanently for that account.
- Suggested currency is calculated separately and never participates in update behavior.
- Balance aggregation never combines accounts with different currencies.

## Safe Error and Observability Pattern

Known failures map to stable account codes and shared ProblemResponse fields. The correlation ID is returned in the response and copied into Flutter ErrorDiagnostic.

Structured events may record operation category, outcome, status, correlation ID, and bounded timing. They exclude account names, amounts, currency choices tied to a user, emails, owner IDs when unnecessary, credentials, request bodies, SQL, raw exceptions, and stack traces from user-visible output.

## Client State and Multi-Device Pattern

- PostgreSQL/API remains authoritative; session/device rows do not own accounts.
- Riverpod state holds only the current screen snapshot and form activity.
- Create/edit/status success replaces local state from the server result, then refreshes the list.
- Delete success removes stale detail/list state and refreshes the canonical list before navigation; an uncertain result requires refresh rather than automatic mutation retry.
- Returning to an account screen or user refresh obtains current server state, including changes from another authenticated device.
- Offline writes, local financial persistence, push updates, and conflict merging remain outside HU-003.

## Performance and Resource Pattern

- Owner/active/name and movement aggregation indexes match query predicates.
- Account list is appropriate without pagination for the approved 100-account-per-user profile.
- API and client retain existing bounded timeouts.
- Database sessions close through Unit of Work cleanup paths.
- No cache is introduced; correctness and simplicity outweigh negligible lookup savings.

## Verification Pattern

- Example tests cover workflows and safe errors.
- Hypothesis generates Unicode/whitespace names, case variants, Decimal boundaries, lifecycle sequences, and ownership identifiers.
- PostgreSQL integration tests prove partial uniqueness, composite ownership, aggregation, rollback, concurrent races, and movement/delete serialization.
- Contract tests prove exact string money and stable codes.
- Flutter tests prove parsing, immutable state, repeated-tap suppression, refresh recovery, route protection, accessibility, and secret/financial-data-free diagnostics.
- Android and Windows use the same feature code and finish with the normal Windows bundle restored.

## Pattern Exclusions

No CQRS/event sourcing, balance materialization, optimistic offline merge, Redis, queue, worker, circuit breaker, automatic mutation retry, payment instrument, device-specific account store, or platform-specific UI fork is justified for HU-003.

## Extension Compliance

- Security: layered validation, authentication, object authorization, composite data integrity, safe errors, and least-data observability are incorporated. Deployment-only controls are unchanged.
- PBT: identifiable normalization, numeric, state-machine, ownership, and aggregation properties are assigned to Hypothesis with deterministic reproduction.
- Resiliency: rollback, race arbitration, cleanup, idempotency, bounded timeouts, and fail-closed behavior are incorporated. Hosted HA/DR patterns remain not applicable.
