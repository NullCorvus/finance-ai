# UOW-03 / HU-003 Financial Accounts — Functional Design Plan

## Objective

Design HU-003 as the next complete vertical slice: an authenticated user can create, list, inspect, edit, deactivate, and optionally reactivate owned financial accounts from the shared Android/Windows Flutter client. Each account has an explicit supported currency and a derived balance. HU-004 catalogs and all expense, income, receipt, transfer, budget, and AI writes remain outside this slice.

## Evidence Loaded

- [x] Read HU-003, FR-ACC-01 through FR-ACC-05, FR-CUR-01 through FR-CUR-05, the UOW-03 definition/dependencies, and current application-design artifacts.
- [x] Confirmed HU-001 registration, shared COP/USD currency seeds, HU-002 authentication, ownership dependencies, safe API problems, and shared Flutter foundations are implemented.
- [x] Reviewed the collaborative DBML account, transaction, and account-movement direction without treating that non-authoritative draft as an executable migration.
- [x] Confirmed the backend and frontend repositories are on their published main worktrees and currently have no uncommitted changes.
- [x] Loaded security, property-based-testing, resiliency, content-validation, and copyable-diagnostic constraints applicable to this unit.

## Planned Functional Artifacts

- [x] Validate the seven team decisions below and resolve any ambiguity.
- [x] Define the Account entity, allowed types, signed opening-balance semantics, active lifecycle, ownership, timestamps, and derived-balance contract.
- [x] Define create, list, detail, edit, deactivate/reactivate, supported-currency, and currency-suggestion flows.
- [x] Define database and application invariants for active-name uniqueness, supported currencies, cross-user references, inactive-account behavior, and future movement compatibility.
- [x] Define safe errors and stable diagnostic codes without exposing account names, balances, entered values, SQL, or raw exceptions.
- [x] Define the shared Flutter account list, account form, account detail, inactive-state presentation, confirmation interactions, and authenticated routing.
- [x] Define unit, property, API contract, PostgreSQL integration, Riverpod/controller, repository, widget, Android, and Windows verification scenarios.
- [x] Generate the four functional-design artifacts, validate their consistency, and request approval before NFR/code-generation planning.

## Recommended Direction

Keep Account as the only public financial concept in HU-003. Persist no mutable `current_balance`; return a calculated balance. Until movement-producing stories exist, that calculation equals `opening_balance`. The query/service contract will be shaped so later expense, income, and transfer movements extend the calculation without changing the Account API. Use database constraints as the authoritative uniqueness and ownership boundary, with application validation for fast safe feedback.

## Team Decisions

### Question 1
Which account types should HU-003 expose now?

A) Cash, bank, digital wallet, savings, credit card, and other; treat credit-card balances as signed values and defer credit-specific billing behavior (Yeah... i mean the user can add , delete, edit all this... i mean i do not see what is the question exactly, is just develop the general mechanism, (if there are default ones, well that's ok, but not something super hard, for example default cash and main bank))

B) Cash, bank, digital wallet, savings, and other only; introduce credit cards in a separate liability story

C) User-defined account types instead of a controlled catalog

D) Other (please describe after the [Answer]: tag below)

[Answer]: A — Use the recommended controlled types. Users create, edit, deactivate, and reactivate account instances; types are not a separate editable catalog. Registration does not silently create Cash or Main bank.

### Question 2
Which opening balances should be valid?

A) Any signed monetary value, including zero and negative balances; this supports overdrafts and existing credit-card debt (Recommended) what yo uanalize the best sweetheart

B) Zero or positive values only

C) Positive values only; zero must be entered as a later adjustment

D) Other (please describe after the [Answer]: tag below)

[Answer]: A — Use the recommended signed balance rule.

### Question 3
How should account fields behave after financial movements exist?

A) Before movements, all fields are editable; afterward, name, type, and opening balance remain editable but currency is locked to protect historical amounts (Recommended) the best but ofcourse we will have to proof this in reality so maybe we can change our perspective later, anyway i think that this version for now is pretty solid

B) After movements, only the name is editable

C) All fields remain editable, including currency

D) Other (please describe after the [Answer]: tag below)

[Answer]: A — Use the recommended edit boundary and revisit it only if real usage provides contrary evidence.

### Question 4
How should account-name uniqueness treat inactive accounts?

A) Names are unique among active accounts; a name may be reused after deactivation, and reactivation requires resolving any active-name conflict (Recommended) what you believe the best...

B) A user can never reuse an account name, even after deactivation

C) Duplicate names are always allowed and the UI distinguishes accounts by type/currency

D) Other (please describe after the [Answer]: tag below)

[Answer]: A — Use the recommended active-name uniqueness rule.

### Question 5
Should a deactivated account be reactivatable?

A) Yes; allow reactivation when its currency is still supported and no active-name conflict exists (Recommended)
i do not understand the concept of activation or deactivation of accoutns actually.. what is it, is it that imporatnt? is someone ever gonna use that?

B) No; deactivation is permanent, although history remains readable

C) Other (please describe after the [Answer]: tag below)

[Answer]: A — Retain reversible deactivation because closed/unused accounts must leave history intact while disappearing from new-entry choices.

### Question 6
How should account lists present inactive accounts?

A) Show active accounts by default, with a clear UI toggle and API `include_inactive` option; detail links continue to open inactive accounts (Recommended) what you want

B) Always show active and inactive accounts together, with inactive styling

C) Hide inactive accounts from account management and show them only through future transaction history

D) Other (please describe after the [Answer]: tag below)

[Answer]: A — Use the recommended active-first list plus explicit inactive toggle.

### Question 7
How should the new-account form obtain its suggested currency without a separate preference record?

A) The backend account-list response supplies the most recently created account's active currency, falling back to the user's preferred currency/COP; the user can always change it before saving (Recommended)

B) Flutter derives the suggestion from the currently loaded account list, falling back to the user's preferred currency/COP

C) Always suggest the user's preferred currency/COP and do not consider previous accounts

D) Other (please describe after the [Answer]: tag below)

[Answer]: A — Use the recommended server-derived suggestion with preferred-currency/COP fallback.

## Preliminary API and UI Boundary

The design will evaluate `POST /api/v1/accounts`, `GET /api/v1/accounts`, `GET /api/v1/accounts/{account_id}`, `PATCH /api/v1/accounts/{account_id}`, and a narrowly scoped active-state operation. The API will also expose supported currencies or reuse a small authenticated reference endpoint. Flutter will add an Accounts destination, list/empty/inactive states, a create/edit form, detail context, and safe confirmation for deactivation.

## Preliminary Verification Boundary

The implementation plan will cover migration/model drift, composite ownership, concurrent case-insensitive name conflicts, supported/inactive currency behavior, signed and bounded decimal values, balance non-persistence, cross-user IDOR attempts, inactive-account exclusion from future movement selection, safe diagnostics, OpenAPI regeneration, shared Flutter analysis/tests, Android build, Windows integration, and restoration of the normal Windows application bundle.

## Extension Compliance at Planning

- Security Baseline: applicable to authenticated ownership, bounded validation, parameterized persistence, safe errors, structured correlation IDs, and deny-by-default resource access. Deployment-only encryption, cloud IAM, CDN, production monitoring, MFA/admin, and hosted topology rules are outside this local feature artifact and remain unchanged.
- Property-Based Testing: applicable to name normalization, decimal boundaries, enum/currency validation, state transitions, ownership isolation, and balance invariants; Hypothesis will complement example tests. Flutter remains example-tested unless an approved Dart PBT dependency is introduced.
- Resiliency Baseline: feature-level atomicity, rollback, database timeout, and safe failure behavior apply. Production RTO/RPO, multi-zone, autoscaling, DR, and incident-response decisions are outside HU-003 and the approved university-prototype delivery boundary.

## Approval Gate

All answers are resolved. Functional artifacts are complete and now require explicit approval before NFR/code-generation planning.
