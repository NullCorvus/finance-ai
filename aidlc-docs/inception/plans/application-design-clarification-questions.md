# Application Design Clarification Questions

## Why Clarification Is Needed

The following responses were incomplete or ambiguous:

- Questions 1 and 2 were left blank.
- Question 3 says `I have no idea`, so the Flutter state pattern remains undecided.
- Question 8 asks for something basic but does not define the exact catalog entries; it also needs to align with the English-only interface selected in Question 4.
- Question 9 says `I do not know`, so the public API base path remains undecided.

The clear answers are retained: English-only interface, 8–128 character password policy, no email verification in HU-001, and no automatically created financial account.

Please answer every question by placing the selected letter after its `[Answer]:` tag.

## Clarification Question 1
Which backend orchestration structure should the design use?

A) Thin route → application service → repositories, with the application service owning the database transaction (recommended for atomic user plus catalog creation)

B) Thin route → feature service that performs persistence directly, using fewer abstractions but coupling business logic to database access

X) Other (please describe after the `[Answer]:` tag below)

[Answer]: A — application service plus repositories; the service owns the transaction

## Clarification Question 2
Which common API error shape should Flutter receive?

A) Stable error code, safe message, HTTP status, and optional field-error map (recommended for field validation and predictable UI behavior)

B) Minimal object with only a message and optional field-error map

X) Other (please describe after the `[Answer]:` tag below)

[Answer]: A — stable problem-style error with code, safe message, status, and field errors

## Clarification Question 3
Which Flutter state-management direction should the team adopt?

A) Riverpod with immutable state (recommended here because the application will have many asynchronous forms and loading/error states while remaining testable)

B) Cubit/BLoC for more explicit state transitions and additional structure

C) Provider/ChangeNotifier for the smallest initial learning curve, accepting more manual asynchronous-state handling

X) Other (please describe after the `[Answer]:` tag below)

[Answer]: A — Riverpod with immutable state

Evidence checked on 2026-08-28: the official `flutter_riverpod` package describes built-in asynchronous loading/error handling and testable separation from UI; the official `flutter_bloc` package describes explicit Bloc/Cubit state integration. Package versions will be pinned only during EN-001.

## Clarification Question 4
Which exact small English catalog preset should registration copy?

A) Practical basic preset (recommended): categories `Food`, `Transport`, `Bills`, `Health`, `Other`; payment methods `Cash`, `Debit Card`, `Credit Card`, `Bank Transfer`; income sources `Salary`, `Freelance`, `Other`

B) Smallest preset: categories `Needs`, `Wants`, `Other`; payment methods `Cash`, `Card`, `Transfer`; income sources `Salary`, `Other`

C) No preset entries, which would revise the approved registration requirement and move all catalog creation to later stories

X) Other (please list the exact entries after the `[Answer]:` tag below)

[Answer]: B — smallest English preset

## Clarification Question 5
Which public API base path should the first contract use?

A) `/api/v1` (recommended because it clearly separates application endpoints from root health/docs routes)

B) `/v1` for a shorter versioned path

X) Other (please describe after the `[Answer]:` tag below)

[Answer]: A — `/api/v1`

## Approval Status

All five clarification questions are resolved. Questions 1–3 and 5 use option A; Question 4 uses option B. The decisions are incorporated into the Application Design artifacts.
