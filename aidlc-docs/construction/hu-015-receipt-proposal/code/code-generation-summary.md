# Code Generation Summary - hu-015-receipt-proposal

## Unit Overview
- **Unit Name**: `hu-015-receipt-proposal`
- **User Story**: HU-015 (AI Receipt Photo Capture - Unit 1: Proposal Draft Creation & Management)
- **Architectural Model**: Model B (Ephemeral In-Memory Processing, Zero Cloud Object Storage, Neon PostgreSQL JSON Proposals Only)
- **Lifecycle Phase**: CONSTRUCTION

---

## Implemented Components

### 1. Ingress Guards & Resource Bounds
- **File**: `finance-ai-backend/src/finance_ai/receipts/guards.py`
- **Features**:
  - `CountingStreamReader`: Hard 10 MiB limit on streaming multipart uploads to prevent memory exhaustion.
  - `validate_image_magic_header`: Strict binary signature verification for JPEG, PNG, WEBP, and HEIC/HEIF/AVIF.
  - `ReceiptRateLimiter`: Token bucket limiter enforcing 5 requests/minute with a burst capacity of 2 per authenticated user.

### 2. Ephemeral In-Memory Image Preprocessor
- **File**: `finance-ai-backend/src/finance_ai/receipts/preprocessor.py`
- **Features**:
  - `MAX_IMAGE_PIXELS = 20_000_000` (Decompression bomb protection).
  - EXIF orientation auto-normalization and complete metadata stripping (removing GPS/camera metadata).
  - High-resolution downscaling (bounding dimension max 2,400 px) and JPEG Q85 compression.
  - Concurrency limited via `asyncio.Semaphore(1)` with a 10-second timeout budget to bound container RAM usage.
  - Immediate memory cleanup (`finally` block / GC).

### 3. Multimodal AI Provider Gateway
- **File**: `finance-ai-backend/src/finance_ai/receipts/gateway.py`
- **Features**:
  - Abstract base class `ReceiptVisionGateway` with swappable adapters: `GeminiVisionAdapter` and `DeepSeekVisionAdapter`.
  - Untrusted evidence system prompt: instructs models that receipt images are untrusted user input, forbids executing instructions inside images, and mandates setting `is_receipt: false` for non-receipts.
  - Structured output extraction targeting `RawExtractionDTO` (`extra="forbid"`).
  - Concurrency bounded via `asyncio.Semaphore(2)` and 30-second network timeout.

### 4. Proposal Sanitizer & Anti-Injection Rule Engine
- **File**: `finance-ai-backend/src/finance_ai/receipts/sanitizer.py`
- **Features**:
  - **Non-Receipt Gate**: When `is_receipt == false`, sets status to `not_a_receipt`, clears extracted monetary fields, and attaches `IMAGE_NOT_A_RECEIPT`.
  - **Anti-Code & Schema Hijacking Heuristic**: Regex inspection of `merchant_name` and line item names against SQL, `<script>`, Python, bash, and prompt injection patterns. Malicious text is cleared and flagged with `SUSPICIOUS_PAYLOAD_FILTERED`.
  - **Arithmetic Integrity**: Calculates line item sum against `total_amount`; flags `ARITHMETIC_MISMATCH` if discrepancy exceeds $0.05 without synthesizing missing totals.
  - **Fail-Safe Fallback**: `create_fallback_proposal` produces editable draft proposals with `PROVIDER_UNAVAILABLE` on upstream network failures or timeouts.

### 5. Database Persistence & Repository
- **Model**: `finance-ai-backend/src/finance_ai/receipts/models.py` (`ReceiptProposalModel`)
- **Migration**: `finance-ai-backend/migrations/versions/0014_receipt_proposals_table.py`
- **Repository**: `finance-ai-backend/src/finance_ai/receipts/repository.py`
- **Characteristics**:
  - Zero binary media blobs stored in PostgreSQL (Model B).
  - Strict tenant isolation enforced by indexing and filtering on `user_id`.
  - Proposal lifecycle: `create_proposal`, `get_proposal`, `update_proposal`, `discard_proposal`.

### 6. API Endpoints
- **File**: `finance-ai-backend/src/finance_ai/receipts/router.py`
- **Registered Routes**:
  - `POST /api/v1/receipts/proposal`: Authenticated multipart image upload, ephemeral extraction, and draft creation.
  - `GET /api/v1/receipts/proposal/{proposal_id}`: Fetch draft proposal for review.
  - `POST /api/v1/receipts/proposal/{proposal_id}/retry`: Client-driven retry with image rotation angle (0, 90, 180, 270).
  - `DELETE /api/v1/receipts/proposal/{proposal_id}`: Discard proposal draft.
  - Legacy route `/api/v1/receipts/scan` preserved for compatibility (still unused by the client; tracked for removal).
  - `POST /api/v1/receipts/dian-bypass` **removed** in the PR #19 remediation: BR-06 excludes QR decoding and DIAN lookup, no client ever called it, and its failure path returned raw exception text. See `aidlc-docs/construction/plans/hu-015-pr19-review-remediation-plan.md`.

---

## Security & Verification Summary

### Automated Test Suite
- **Backend Unit & API Tests**: 199 passed, 30 skipped (requiring live test DB), 0 failures, 0 warnings.
- **Prompt-Injection Defense Suite**: 50 passed, 0 failures.
  - All 13 baseline adversarial cases (injection instructions, script tags, schema escapes, non-receipts) now pass cleanly.
- **Static Analysis**:
  - Ruff Linter: 0 errors across `src/` and `tests/`.
  - Ruff Formatter: 100% formatted.
  - MyPy Type Checking: 0 errors across 102 source files (strict mode).
- **OpenAPI Synchronization**: `finance-ai-backend/openapi.json` fully regenerated and synchronized.

---

## Architectural Workflow Representation

```text
[Client / Flutter App]
       |
       | 1. POST /proposal (multipart image + rotation)
       v
[Ingress Guards (guards.py)] -> (10MB limit, Magic Header, Rate Limiter)
       |
       v
[Ephemeral Preprocessor (preprocessor.py)] -> (Orientation, EXIF Strip, Downscale 2400px, Q85)
       |
       v
[Vision Gateway (gateway.py)] -> (Untrusted evidence prompt, Semaphore, Provider timeout)
       |
       v
[Proposal Sanitizer (sanitizer.py)] -> (Non-receipt gate, Anti-code filter, Arithmetic check)
       |
       v
[Proposal Repository (repository.py)] -> (Save JSON proposal to Neon DB; image dropped from RAM)
       |
       v
[FastAPI Router (router.py)] -> Return ReceiptProposalResponse
```
