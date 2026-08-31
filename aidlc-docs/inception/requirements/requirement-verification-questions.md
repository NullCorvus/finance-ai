# Finance AI Documentation Reconciliation Questions

These questions are for aligning the existing documentation before any application code is created.

## Confirmed Product Principle

The following direction is already accepted and does not need another answer:

- Finance AI begins as a complete, usable manual personal-budget application.
- Manual forms and normal database workflows are the source of truth.
- AI is integrated later as an optional assistant that converts photo, audio, or text into proposed form values.
- The user reviews and edits the same normal form before saving.
- Every AI-assisted workflow must retain a fully manual alternative.

Please answer every question by placing the selected letter after its `[Answer]:` tag. The option marked **Recommended** is my proposed default, but the team should choose deliberately.

## Question 1
Which manual feature set must be complete before product AI is integrated?

A) **Full manual MVP (Recommended):** registration/login, profile preferences, currencies, categories/subcategories, payment methods, expense CRUD, income CRUD, budgets, date filters, transaction history, and a basic dashboard

B) Lean manual MVP: registration/login, reference data, expense CRUD, income CRUD, and transaction history; budgets and dashboard are added after the first AI feature

C) Minimal foundation: registration/login and manual expense creation only; AI is integrated before the remaining budgeting features

X) Other (please describe after the [A]: tag below)

[Answer]: 

## Question 2
What should be the primary data model for a purchase or expense?

A) Keep the current design: `Receipt` is the purchase header and `Expense` rows are its items; every manual expense creates a placeholder receipt

B) **Make `Expense` the purchase/transaction header (Recommended):** it can exist manually without a receipt, has optional `ExpenseItem` children, and may have an optional receipt image/attachment

C) Use a generic `Transaction` header for both income and expenses, with specialized expense/income details underneath

X) Other (please describe after the [Answer]: tag below)

[B]: 

## Question 3
What kind of budgeting should be part of the manual core?

A) **Category or subcategory budgets (Recommended):** amount plus weekly or monthly period, with progress calculated from expenses

B) Monthly envelope budgeting: distribute expected income among categories at the start of each month

C) Both category limits and envelope budgeting

D) No budgets before AI; only expense and income tracking

X) Other (please describe after the [A]: tag below)

[A]: something that makes sense but not too complex for the user and that is easy to understand for the future AI

## Question 4
When you mention calendars, which capability do you intend for the manual core?

A) **Dates and periods only (Recommended):** transaction date picker, monthly/weekly filters, and budget periods; no dedicated calendar screen

B) A visual calendar screen showing expenses and income by day

C) A visual calendar plus recurring expenses and income

X) Other (please describe after the [Answer]: tag below)

[A]:  i just mean montry filders and stuff,

## Question 5
How should currencies work before AI is added?

A) **Multi-currency storage without automatic conversion (Recommended):** store each transaction's original amount/currency and give the user a preferred display currency; conversion is deferred

B) Multi-currency storage with automatic exchange-rate conversion in the manual core

C) COP only in the first release; add other currencies later

X) Other (please describe after the [A]: tag below)

[A]: i do not understand the question.... i mean the currencies are just ways to show the current money expendend and etc, it can change if the user desires but moeny is money show different devices is just something that the app itself requires... then the AI reads that normally

## Question 6
Who owns categories, subcategories, payment methods, income sources, and currencies?

A) **Hybrid catalog (Recommended):** seed shared currencies and common defaults; users can create their own categories, subcategories, payment methods, and income sources

B) Global catalog: administrators manage shared lists and normal users cannot create new entries

C) Per-user catalog: everything except the supported-currency list belongs to each user

X) Other (please describe after the [A]: tag below)

aaaaa yeah, like every app of budget you can add currencies and give them the current conversion, categories, accounts when money is stored and used (student account, work account, davivienda, bancolombia, CDAT, cash), incomes, expenses (food, commute....)

## Question 7
What should happen to the currently contradictory Admin role?

A) **Remove Admin from the manual MVP and schema (Recommended):** add administration only if the professor/team later approves it

B) Keep the `admin` role in the schema and seed data, but defer all admin screens and behavior

C) Include the documented admin dashboard and user management in the manual core

X) Other (please describe after the [Answer]: tag below)

Whatrever you think, i do nott have problems, at the start it can be simple as long as it's scalable if the team decides to include new things

## Question 8
What should be the primary app experience before AI exists?

A) **Budget-app home (Recommended):** dashboard or transaction list with a clear Add Expense/Add Income action; the optional AI assistant is added later to those forms

B) Chat-style home from the beginning, with manual forms opened through the conversation interface even before AI exists

C) Transaction-list home first, with dashboard and assistant added later

X) Other (please describe after the [A]: tag below)

[A]: Yeah even whenthe Ai is the differenciation of the app, without de default experience of a budget app, thsi won't be possible...
so the default expreicne include: multiples accounts or sources of money, categories, logs, entries, exchanges Digital account -> cash
cash -> digital account.... etc, and thinking in AI

## Question 9
Which registration behavior should become the single documented decision?

A) **Email/password registration, explicit default `user` role and COP preference, then redirect to Login without automatic login (Recommended)**

B) Email/password registration, but the user selects a preferred currency during registration

C) Email/password registration followed by automatic login

X) Other (please describe after the []: tag below)

i do not know the most standar in the apps.... something reliagble but simple enough to start and expand if any future behavior super spcecific is required, but the most standard in apps is good, and you are good in that so create it is not that hard i think so

## Question 10
How should application code be organized relative to the existing documentation repository?

A) **Keep one monorepo (Recommended):** add `backend/` and `frontend/` to the existing `finance-ai` repository and keep `docs/` with them

B) Keep documentation here but create separate backend and frontend repositories

C) Create one application repository and move/archive the current documentation repository

X) Other (please describe after the [A]: tag below)

[A]: ok, let's create a monorepo BUT clearlly diferenciate pls, i want to konw when the things are and wheren the code is... pretty clear not merge of folders of documentation and then aside code

## Question 11
How should the foundation work currently inside HU-001 be tracked and estimated?

A) **Separate technical-enabler cards (Recommended):** repository baseline, local infrastructure, database migration/seed, API contract, and UI foundation; HU-001 contains only the registration vertical slice

B) Keep all setup tasks inside HU-001 and estimate them together

C) Create an unestimated Sprint 0 for all setup, then begin estimated stories with HU-001

X) Other (please describe after the [A]: tag below)
first things fist and cleally diferenciated of course , step by step

## Question 12
What should be the executable source of truth for database evolution?

A) **SQLAlchemy models plus Alembic migrations (Recommended):** schema documentation describes the model, while migrations create and evolve the database

B) `docs/schema.sql` remains the executable source of truth and is manually updated with every model change

C) Maintain both migrations and `schema.sql` as independently executable artifacts

X) Other (please describe after the [A what the best for this is , i do no tknow....]: tag below)

## Question 13
How should backlog and sprint documentation avoid conflicting HU numbers and assignments?

A) **`BACKLOG-AND-STORIES.md` owns PB/HU identifiers and story definitions (Recommended); `SPRINT-PLAN.md` only references those identifiers and adds sprint allocation/technical tasks**

B) Merge backlog, stories, and sprint planning into one document

C) Trello is the only source of truth; repository documents are non-authoritative snapshots

X) Other (please describe after the [Answer]: tag below)
i do not know...
[Answer]: 

## Question 14
What Definition of Done should apply from the first story?

A) **Working behavior plus automated tests, formatting/lint checks, reviewed documentation/API contract, and verification from a clean local setup (Recommended)**

B) Working behavior and manual testing only; automate tests after the main features are complete

C) Use a separate testing sprint after feature development

X) Other (please describe after the [A]: tag below)


## Question 15
Should the AI-DLC resiliency baseline be applied to this university prototype?

A) Apply the full resiliency baseline as blocking design guidance

B) **Skip the full extension (Recommended):** retain lightweight error handling, database backup notes, health checks, and recoverable local setup without production-level availability requirements

X) Other (please describe after the [Answer]: tag below)
i think so B, i do not understand to much the question but im ok with it

## Question 16
Should the AI-DLC security baseline be enforced?

A) **Apply the security baseline (Recommended):** the app stores credentials and personal financial data, while requirements may still be scoped proportionally for a university prototype

B) Skip the security extension and rely only on story-level security decisions

X) Other (please describe after the [A]: tag below)

## Question 17
Should property-based testing rules be enforced?

A) Apply them to all relevant business logic and data transformations

B) **Apply them partially (Recommended):** use them later for currency, budget-period calculations, and AI JSON serialization/validation, while normal CRUD uses example-based tests

C) Skip property-based testing for this project

X) Other (please describe after the [A]: tag below)

