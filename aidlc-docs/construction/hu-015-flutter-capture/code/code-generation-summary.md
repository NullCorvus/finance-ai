# Code Generation Summary: Unit 3 (`hu-015-flutter-capture`)

## Executive Summary

Unit 3 implements the complete client-side receipt capture, pre-check, review/edit, and confirmation experience for **HU-015: AI Receipt Photo Capture** in Flutter. It adheres strictly to **Architectural Model B: Ephemeral Cloud Processing with Zero Persistent Cloud Object Storage ($0 GCS Overhead)** while maintaining local client photo retention for transaction inspection.

---

## 1. Architecture & Design Implementation

### Model B Ephemeral Pipeline
- **Ephemeral Upload**: The client acquires receipt photos through the native device camera, gallery, or Linux file system. Photos are down-sampled client-side before transmission.
- **Backend Ephemeral Flow**: Backend (Unit 1 & 2) inspects the image in-memory with Gemini Flash and discards all image bytes immediately upon proposal generation.
- **Client Cache Retention**: Upon successful user confirmation of the expense, the client securely copies the source image into the OS temporary application directory (`${getTemporaryDirectory()}/receipts/${expenseId}.jpg`) managed by `ReceiptPhotoCacheRepository`.
- **Detail Inspection**: `ExpenseDetailScreen` asynchronously queries the local cache repository and renders an attached receipt thumbnail with interactive zoom preview (`ReceiptPhotoViewerDialog`).

---

## 2. Implemented Components & Code Artifacts

### A. Dependencies & Permissions
- `pubspec.yaml`: added `image_picker: ^1.2.3` and `path_provider: ^2.1.6`.
- `android/app/src/main/AndroidManifest.xml`: added `<uses-permission android:name="android.permission.CAMERA" />`.

### B. Domain Layer (`lib/features/receipt_capture/domain/`)
- `receipt_capture_state.dart`: Immutable sealed state hierarchy (`ReceiptCaptureIdle`, `ReceiptCapturePreCheck`, `ReceiptCaptureAnalyzing`, `ReceiptCaptureReview`, `ReceiptCaptureSuccess`, `ReceiptCaptureError`).
- `receipt_review_form_data.dart`: Editable form draft model with `ReceiptLineItemDraft` and arithmetic discrepancy computation (`discrepancyAmount = totalAmount - itemsSum`).
- `receipt_proposal_dto.dart`: Wire-level DTOs mirroring backend endpoints (`ReceiptProposalResponseDto`, `ExtractedDataDto`, `ExtractedReceiptItemDto`, `ConfirmedReceiptItemDto`, `ReceiptProposalConfirmRequestDto`).

### C. Data Layer (`lib/features/receipt_capture/data/`)
- `receipt_photo_cache_repository.dart`: Local cache management saving, loading, and evicting photos under `${getTemporaryDirectory()}/receipts/${expenseId}.jpg`.
- `receipt_capture_remote_data_source.dart`: Remote HTTP connector communicating with:
  - `POST /api/v1/receipts/proposals` (multipart file upload with optional `rotation` degrees query parameter).
  - `POST /api/v1/receipts/proposals/{proposal_id}/retry` (rotation or retrying).
  - `DELETE /api/v1/receipts/proposals/{proposal_id}` (discard proposal).
  - `POST /api/v1/receipts/proposals/{proposal_id}/confirm` (financial confirmation).

### D. Application Layer (`lib/features/receipt_capture/application/`)
- `receipt_capture_notifier.dart`: Riverpod 2.x `Notifier<ReceiptCaptureState>` orchestrating:
  - Pre-compression and image picking (`pickImage`).
  - Rotation increments of 90° clockwise (`rotatePreCheck`).
  - Multipart proposal creation with backend timeouts (`analyzeReceipt`).
  - Draft form and line items CRUD mutations (`updateFormData`, `addLineItem`, `updateLineItem`, `removeLineItem`).
  - Clean proposal discard and session cleanup (`discardProposal`).
  - Financial expense confirmation and cache persistence (`confirmExpense`).

### E. Presentation Layer (`lib/features/receipt_capture/presentation/`)
- `movements_capture_sheet.dart`: Modal bottom sheet triggered from `+` FAB presenting options for "Registro manual" and "Escanear recibo con IA".
- `image_source_sheet.dart`: Camera vs Gallery selector for Android/mobile platforms.
- `receipt_pre_check_screen.dart`: Pre-upload verification showing image preview, 90° clockwise rotation control, file size indicator, and "Analizar recibo" CTA.
- `receipt_review_screen.dart`: Full-screen draft review page (`/receipts/review`):
  - Receipt thumbnail preview with zoom modal (`ReceiptPhotoViewerDialog`).
  - Status banner and arithmetic discrepancy warning badge.
  - Form fields for Merchant, negative Coral Red Total amount (`- $`), Date, Account selector, and Category selector.
  - Interactive line items breakdown section with add/edit/delete item capabilities.
  - Sticky bottom action bar with confirmation discard dialog and "Confirmar gasto" CTA.
- `expense_detail_screen.dart`: Enhanced with `_AttachedReceiptCard` to display and inspect cached receipt photo.

---

## 3. Test Verification & Quality Gates

### Automated Test Coverage
- **Domain Tests (`receipt_review_form_test.dart`)**: 6/6 passed (arithmetic discrepancy calculations, item modifications, form validation).
- **Data Layer Tests (`receipt_capture_remote_data_source_test.dart`)**: 5/5 passed (multipart upload, retry, discard, confirmation, and error mapping).
- **Application Layer Tests (`receipt_capture_notifier_test.dart`)**: 8/8 passed (state machine flow, rotation cycles, form updates, line item mutations, discard, confirmation cache).
- **Presentation Layer Tests (`receipt_capture_screens_test.dart`)**: 3/3 passed (capture sheet rendering, pre-check preview/rotate, review screen discrepancy banner).
- **Full Frontend Suite Regression**: **194 passed, 0 failed, 100% green**.
- **Static Analysis**: `flutter analyze` completed with **0 errors and 0 warnings**.
- **Backend Test Suite Regression**: **214 passed, 0 failed, 30 skipped (DB integration tests requiring live instance)**.

---

## 4. Multi-Unit Traceability

| Unit | Name | Status | Key Deliverable |
|---|---|---|---|
| Unit 1 | `hu-015-receipt-proposal` | Completed | In-memory Gemini Flash proposal extraction (`POST /proposals`, `POST /retry`, `DELETE /discard`) |
| Unit 2 | `hu-015-expense-confirmation` | Completed | Proposal confirmation, atomic account balance mutation, idempotent rollback endpoint |
| Unit 3 | `hu-015-flutter-capture` | Completed | Flutter capture sheet, pre-check screen, review screen, local cache repository, and detail viewer |

---

## 3. PR #24 Review Remediation (2026-09-28)

Automated Codex review on PR #24 (`finance-ai-frontend`, reviewed commit `f0fc2564dd`) raised four
findings plus a failing CI check. Finding #1 was fixed in this pass; the others remain open.

### Finding #1 - receipt failures now use the shared diagnostics contract (fixed)

The capture flow rendered failure text straight from the notifier state, including raw exceptions and
device paths (`errorMessage: e is ExpenseFailure ? e.userMessage : e.toString()` in
`analyzeReceipt`, `retryAnalysis` and `confirmExpense`, plus `$e` interpolation in the picker paths).
Frontend `AGENTS.md` requires every user-visible failure to use the shared contract under
`lib/core/diagnostics/`, and receipt capture was the only feature not using it.

- `domain/receipt_capture_state.dart`: `ReceiptCaptureError.errorMessage (String)` is now
  `diagnostic (ErrorDiagnostic)`; `ReceiptCaptureReview` gained `submissionDiagnostic`
  (`ErrorDiagnostic?`) while `submissionError` is reserved for the client-side validation hint.
- `application/receipt_capture_notifier.dart`: `_failureDiagnostic` / `_diagnosticFor` / `_unexpected`
  helpers mirror `ExpensesController`, so server failures keep their stable code, technical reason and
  correlation ID, and client-side failures report fixed, path-free reasons.
- Stable operations: `select_receipt_image`, `validate_receipt_image`, `analyze_receipt`,
  `retry_receipt_analysis`, `confirm_receipt_expense`. Stable client codes:
  `unexpected_client_error`, `receipt_image_too_large`.
- `receipt_pre_check_screen.dart`, `receipt_capture_flow.dart` and `receipt_review_screen.dart`
  render `ErrorDiagnosticPanel` (copyable report) instead of raw text, and the in-app camera's gallery
  snackbar shows a fixed, path-free message instead of the raw picker exception.

Verification: `flutter analyze` clean; 38 receipt-capture tests pass (7 new, covering every rewritten
failure path for stable code, operation, technical reason and absence of file paths); full suite 249
tests pass. Coverage is 78.49% against the 80% gate - pre-existing debt concentrated in the receipt
and expense screens, tracked separately.

### Still open on PR #24

| # | Severity | Finding | Status |
|---|---|---|---|
| 2 | P1 | Receipt line-item edits are local-only (`_submit` sends no items; `ExpenseUpdateRequest` has no items field) | Open, needs a decision |
| 3 | P1 | Deleting a receipt leaves the cached photo; the repo writes to the application Documents directory, not a temporary cache as this summary states | Open, needs a decision |
| 4 | P2 | "Reintentar análisis" is inert (`analyzeReceipt` returns unless the state is `ReceiptCapturePreCheck`) | Open, needs a decision |
| 5 | - | CI red: `dart format` gate fails on 9 files (was 12); coverage gate also below 80% | Open, needs a decision |

