# Application Design Plan — Foundation and HU-001 Readiness

## Objective

Translate the approved manual-first architecture into standardized component, service, method, and dependency artifacts that can support the first construction unit. This planning stage creates documentation only.

## Approved Constraints

- One modular FastAPI backend, one Flutter client, and PostgreSQL.
- Feature-oriented modules inside the modular monolith.
- SQLAlchemy models and Alembic migrations become executable database truth during construction.
- HU-001 is registration only; EN-001 through EN-006 remain separately traceable technical enablers.
- Registration creates the user and owned default catalogs atomically, then redirects to Login without automatic login.
- Product AI, chat, receipt parsing, and provider configuration are absent from this unit.

## Planned Artifacts

- [x] Generate `aidlc-docs/inception/application-design/components.md` with component responsibilities and interfaces.
- [x] Generate `aidlc-docs/inception/application-design/component-methods.md` with high-level method signatures and input/output types.
- [x] Generate `aidlc-docs/inception/application-design/services.md` with orchestration and transaction ownership.
- [x] Generate `aidlc-docs/inception/application-design/component-dependency.md` with dependency relationships and communication flows.
- [x] Generate `aidlc-docs/inception/application-design/application-design.md` as the consolidated design.
- [x] Validate design consistency against HU-001, EN-001–EN-006, the schema, security requirements, and the no-AI boundary.

## Resolved Design Decisions

- Backend organization is feature-first rather than microservice-based.
- HTTP routes remain thin; financial and identity rules belong in backend application/domain components.
- Flutter never connects directly to PostgreSQL.
- Registration is a public endpoint, while future financial endpoints deny access by default.
- Database transaction boundaries protect user/default-catalog creation from partial initialization.
- API schemas, persistence models, and Flutter view state remain distinct concerns.

## Questions

Please answer every question by placing the selected letter after its `[Answer]:` tag.

## Question 1
Which backend orchestration structure should the design use?

A) Thin route → application service → repositories, with the application service owning the database transaction (recommended)

B) Thin route → feature service that also performs persistence directly, using fewer abstractions

X) Other (please describe after the `[Answer]:` tag below)

[Answer]: A — application service plus repositories; the service owns the transaction

## Question 2
Which common API error shape should Flutter receive?

A) Problem-style object with stable error code, safe message, HTTP status, and optional field-error map (recommended)

B) Minimal object with only `message` and optional field-error map

X) Other (please describe after the `[Answer]:` tag below)

[Answer]: A — stable problem-style error with code, safe message, status, and field errors

## Question 3
Which Flutter state-management direction should the design assume?

A) Riverpod with immutable screen/form state

B) BLoC/Cubit with event/state classes

C) Provider/ChangeNotifier for the smallest initial learning curve

X) Other (please describe after the `[Answer]:` tag below)

[Answer]: A — Riverpod with immutable state (resolved by clarification)

## Question 4
What should be the initial interface language?

A) Spanish first; internal identifiers and API fields remain English (recommended for the current Colombian academic context)

B) English first throughout the interface

C) Spanish and English localization from the first construction unit

X) Other (please describe after the `[Answer]:` tag below)

[Answer]: B — English throughout the interface

## Question 5
Which password rule should HU-001 enforce initially?

A) 8–128 characters with no composition rule; allow password-manager passphrases (recommended prototype baseline)

B) 10–128 characters with no composition rule

C) 12–128 characters with no composition rule

X) Other (please describe after the `[Answer]:` tag below)

[Answer]: A — 8–128 characters, no composition rule

## Question 6
Should email verification be part of HU-001?

A) No; create the account immediately and defer verification/recovery to separately approved stories (recommended for current scope)

B) Yes; require verification before the first login, adding email delivery infrastructure to the first unit

X) Other (please describe after the `[Answer]:` tag below)

[Answer]: A — no email verification in HU-001

## Question 7
What should registration create besides the user and owned catalog defaults?

A) No financial account; the user creates accounts explicitly in HU-004 (recommended and consistent with current story boundaries)

B) One default `Cash` account in COP, even though account management belongs to HU-004

X) Other (please describe after the `[Answer]:` tag below)

[Answer]: A — no financial account is created during registration

## Question 8
Which initial catalog preset should be copied for each new user?

A) Colombian-friendly Spanish preset: common expense categories, Efectivo/Tarjeta débito/Tarjeta crédito/Transferencia payment methods, and Salario/Trabajo independiente/Otros income sources (recommended)

B) Small neutral preset: Necesidades/Deseos/Otros, Efectivo/Tarjeta/Transferencia, and Salario/Otros

X) Other (please list the desired initial entries after the `[Answer]:` tag below)

[Answer]: X — smallest English preset resolved by clarification

## Question 9
Which public API base path should the first contract use?

A) `/api/v1` for all versioned application endpoints (recommended)

B) `/v1` for a shorter versioned path

X) Other (please describe after the `[Answer]:` tag below)

[Answer]: A — `/api/v1` (resolved by clarification)

## Decision Coverage

| Design category | Covered by |
|---|---|
| Component identification | Approved feature modules and planned component artifact |
| Component methods | Planned method-signature artifact and Questions 1–2/9 |
| Service orchestration | Question 1 |
| Dependencies and communication | Questions 1–3/9 and planned dependency artifact |
| Frontend components and state | Questions 2–4 |
| Registration business boundary | Questions 5–8 |
| Design patterns | Approved modular monolith plus Questions 1–3 |

## Approval Status

All answers were resolved and validated. The five planned Application Design artifacts were generated and passed static content/consistency validation. Awaiting explicit artifact approval before Units Generation.
