# HU-015 PR #24 (frontend) Codex Review Remediation Plan

**Repo**: `finance-ai-frontend`, branch `feat/hu-015-ai-receipt-photo-capture`, PR #24 (reviewed commit `f0fc2564dd`).
**Scope decisions (confirmed by the user)**: fix finding #1 first, using the shared diagnostics
contract; findings #2, #3 and #4 are discussed one at a time afterwards. This plan covers only #1.

## Verified findings on PR #24

| # | Severity | Codex finding | Verdict |
|---|---|---|---|
| 1 | P1 | Raw exception (and device path) reaches a user-visible error state | Valid, wider than reported (5 raw sites) |
| 2 | P1 | Receipt line-item edits are local-only and never persisted | Valid (deferred to its own decision) |
| 3 | P1 | Deleting a receipt leaves the cached photo on the device | Valid (deferred to its own decision) |
| 4 | P2 | "Reintentar análisis" is inert after an upload failure | Valid (deferred to its own decision) |
| 5 | - | CI red: `dart format --set-exit-if-changed` fails on 12 files | Valid; out of scope here (own decision) |

## Evidence for finding #1

- `receipt_capture_notifier.dart:112` `errorMessage: e is ExpenseFailure ? e.userMessage : e.toString()`
  (same pattern at `:138` retry, `:289` confirm, and `$e` interpolation at `:50` and `:75`).
- `receipt_pre_check_screen.dart:126-130` and `:38`, `receipt_capture_flow.dart:61` and
  `receipt_review_screen.dart:319` render that text verbatim.
- `AGENTS.md` (frontend) mandates the shared contract under `lib/core/diagnostics/` for every
  user-visible failure and forbids raw exceptions. `lib/features/receipt_capture/` used it in
  **zero** files, while ~20 other screens (accounts, categories, expenses, incomes, settings,
  auth) already comply.

## Work plan

### Step 1 - Domain state carries the diagnostic contract
- [x] `receipt_capture_state.dart`: `ReceiptCaptureError.errorMessage (String)` becomes
      `diagnostic (ErrorDiagnostic)`; `localImagePath` and `canRetry` stay untouched so finding #4
      is unaffected
- [x] `receipt_capture_state.dart`: `ReceiptCaptureReview` gains `submissionDiagnostic`
      (`ErrorDiagnostic?`); `submissionError` is kept **only** for the client-side validation hint

### Step 2 - Notifier produces safe diagnostics
- [x] Add `_diagnosticFor(ExpenseFailure, {operation})`, `_unexpected({operation, userMessage,
      technicalReason, code})` and `_failureDiagnostic(...)` helpers mirroring
      `expenses_controller.dart:696-729`
- [x] `pickImage` catch -> operation `select_receipt_image`, `unexpected_client_error`
- [x] `useImageFile` size reject -> operation `validate_receipt_image`, `receipt_image_too_large`
- [x] `useImageFile` catch -> operation `validate_receipt_image`, `unexpected_client_error`
- [x] `analyzeReceipt` catch -> operation `analyze_receipt` (server code when it is an
      `ExpenseFailure`, otherwise `unexpected_client_error`)
- [x] `retryAnalysis` catch -> operation `retry_receipt_analysis`, same rule
- [x] `confirmExpense` catch -> operation `confirm_receipt_expense`, same rule
- [x] No raw exception text in any `code`, `userMessage` or `technicalReason`

### Step 3 - Screens render the shared panel
- [x] `receipt_pre_check_screen.dart`: error branch renders `ErrorDiagnosticPanel`
- [x] `receipt_pre_check_screen.dart:38` and `receipt_capture_flow.dart:61`: snackbars use
      `diagnostic.userMessage`
- [x] `receipt_review_screen.dart`: confirm failure renders `ErrorDiagnosticPanel`; the validation
      hint keeps its inline banner
- [x] `receipt_camera_screen.dart` gallery snackbar: raw `$e` replaced by a fixed, path-free message
      (found by a post-change sweep for `$e`/`errorMessage`; no widget test added because that screen
      needs camera-plugin mocks and has no existing harness - accepted gap)

### Step 4 - Tests
- [x] Notifier: unexpected `FileSystemException` -> safe diagnostic, no path or exception class in
      the report
- [x] Notifier: `ExpenseFailure` -> code and correlation ID propagate, operation recorded
- [x] Notifier: >10 MB image -> `receipt_image_too_large`, no path in the report
- [x] Notifier: unreadable picked file -> `image_inspection_failure`, no path in the report
- [x] Notifier: confirm failure -> `submissionDiagnostic`, `submissionError` stays null
- [x] Widget: error screen renders `ErrorDiagnosticPanel` (`Key('error-diagnostic-code')`)
- [x] Widget: review screen renders the panel for a confirm failure
- [x] Updated the existing picker-failure widget test to assert the safe message and the absence of
      the raw plugin exception

### Step 5 - Verification
- [x] `dart format` on the touched files only (format debt drops from 12 to 9 files)
- [x] `flutter analyze --no-pub` -> No issues found
- [x] `flutter test test/features/receipt_capture` -> 38 passed
- [x] `flutter test --coverage` -> 249 passed; **line coverage 78.49% (7338/9349), below the 80%
      gate** (see open item below)

### Step 6 - Documentation and audit
- [x] This plan file, `audit.md` entries and `aidlc-state.md` updated
- [x] Unit code-generation summary records the remediation
- [x] One commit on the frontend branch (no push)

## Verification log

| Command | Result |
|---|---|
| baseline `dart format --output=none --set-exit-if-changed lib test integration_test` | FAILS: 12 files need formatting (finding #5, out of scope) |
| baseline `flutter analyze --no-pub` | No issues found |
| after change `flutter analyze --no-pub` | No issues found |
| after change `flutter test test/features/receipt_capture` | 38 passed (31 before + 7 new) |
| after change `flutter test --coverage` | 249 passed; 78.49% line coverage |
| after change `dart format --output=none --set-exit-if-changed lib test integration_test` | FAILS: 9 files (was 12) |

## Open items after this change (each needs its own decision)

1. **Coverage gate fails: 78.49% < 80%.** 9349 measurable lines, 7338 covered; **142 more covered
   lines** are needed. The gap is concentrated in receipt capture (57.06% of 1218 lines) and the
   expense screens: `receipt_review_screen.dart` 201, `expense_form_screen.dart` 200,
   `receipt_camera_screen.dart` 168, `expense_create_screen.dart` 149 uncovered lines. This is
   pre-existing branch debt, not introduced here (this change only adds tests).
2. **Format gate fails on 9 files** (was 12). One command fixes it, but those files are outside
   this change's scope.
3. Findings #2, #3 and #4 remain open.

