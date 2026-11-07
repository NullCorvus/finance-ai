# Shared security requirements

**Scope:** SEC-01 — Privileged Staff TOTP MFA; SEC-02 — Shared Security Audit Logging.

**Decision date:** 2026-11-07

**Status:** Approved requirements; implementation Not started. These cross-cutting capabilities are estimated and implemented once, separately from Administrator functional stories.

## Canonical stories and dependencies
- [SEC-01 — Privileged Staff TOTP MFA](../../../docs/BACKLOG-AND-STORIES.md#sec-01--privileged-staff-totp-mfa): 13 provisional points.
- [SEC-02 — Shared Security Audit Logging](../../../docs/BACKLOG-AND-STORIES.md#sec-02--shared-security-audit-logging): 8 provisional points.

The backlog owns narratives and acceptance criteria. This document defines shared contracts and technical-design responsibilities. [Administrator requirements](administrator-role.md) and [Support requirements](support-agent-role.md) consume the same services. The [Auditor specification](security-auditor-role.md) consumes these contracts for AUD-01–AUD-04. No extra SEC story, duplicated MFA or second event store is introduced.

Reuse existing FastAPI authentication, opaque database-backed sessions, PostgreSQL and the planned staff-web portal. The inspected local backend has existing password/session primitives but no complete verified TOTP/audit implementation. Requirements are not evidence of runtime availability.

## SEC-01 contract: password, factor and privileged staff authority
Require password plus TOTP for both admin and security_auditor; reuse one shared infrastructure and lifecycle. Verify the password before challenging for the factor. Initial enrollment exposes its QR/secret only within the authorized enrollment flow and becomes active only after a valid code is verified. Regular account/session APIs and logs never expose factor secrets or verification codes.

Incomplete authentication uses a short-lived, account-bound challenge with no privileged authority. Reject invalid/expired challenges and invalid, expired or previously accepted OTPs for the same authenticator/time step, including concurrent requests. Rate-limit failed attempts and maintain safe error behavior.

Every ADM/AUD endpoint checks the active account, current authorized role, resource scope and MFA-verified session state in FastAPI, including report delivery. Suspension or role removal immediately denies access through previously issued sessions. A correct password alone is not a privileged login; `auth.login_success` for admin and security_auditor is emitted only after password and MFA complete. Assigning either role to an already-authenticated account does not make its old session MFA-verified, whether through controlled admin provisioning or approved staff-role assignment. Do not count `auth.mfa_success` as an additional successful login.

Recovery and authenticator replacement require a secure identity-verification procedure and invalidate relevant existing sessions. No default recovery bypass or new portal privilege-grant path is approved. The secure controlled backend provisioning process must establish initial/additional administrators without a fifth role or an approval quorum.

Technical design must specify:
- Encryption/protection of TOTP secrets at rest and key access, with no hardcoded secrets.
- Time-step/clock-skew policy and atomic replay prevention.
- Challenge lifetime, privileged staff session lifetimes, expiry/logout and invalidation behavior.
- Enrollment, lost-device recovery and replacement identity verification.
- The current login contract's web-platform compatibility and server principal/session assurance data.
- Secure browser credential handling, explicit CORS origins and CSRF controls where applicable. Any cookies use Secure, HttpOnly and SameSite protections.
- Existing password-policy/adaptive-hashing and brute-force protections carried into staff authentication.

Exact lifetimes, recovery protocol and implementation mechanisms are assigned to technical design. They are not requests to reopen the approved MFA method.

## SEC-02 contract: events, privacy and persistence

### Event catalog
The following identifiers name the already approved event semantics. MFA lifecycle names below are technical identifiers for those approved events, not additional features.

| Event identifier | Trigger and evidence |
|---|---|
| auth.login_success | Completed login; for admin/security_auditor, both factors completed; never an extra count for auth.mfa_success |
| auth.login_failed | Failed login attempt with safe, sanitized outcome information |
| auth.logout | Logout |
| session.revoked | Security-related session invalidation/revocation |
| auth.mfa_success | Successful TOTP verification |
| auth.mfa_failed | Failed TOTP verification |
| auth.mfa_enrolled | Verified enrollment becomes active |
| auth.mfa_recovered | Approved recovery action completes |
| auth.mfa_replaced | Authenticator replacement completes |
| account.suspended | Authorized account suspension |
| account.reactivated | Authorized account reactivation |
| staff.created | Staff account/invitation creation |
| staff.activated | Successful staff activation, separately from creation |
| role.changed | Privileged/staff role assignment change; include previous/new role |
| ticket.escalated | Support escalation |
| access.denied | Rejected access to a protected resource |
| audit.report_exported | Backend generated an authorized PDF and prepared it for delivery; mandatory durable recording before exposing successful output |

Server-derived event identity, UTC timestamp, type and outcome are mandatory. Record actor when identifiable, applicable target and available request/correlation identifier. Sanitize context through an explicit schema/allowlist; untrusted input must not inject event text, actor identity or extra sensitive fields.

Both `staff.created` and `staff.activated` contain the appropriate actor/target, timestamp, outcome and allowed context. An activation token proves only the bounded activation purpose; it is never logged. Neither successful nor failed activation handling may leak credentials.

Exclude passwords/hashes, session/activation tokens, MFA secrets/codes, financial balances/amounts, receipts, complete sensitive request bodies and unnecessary personal information from events and diagnostics. Use bounded context, safe encoding and parameterized persistence.

### Historical identifiers, reporting and export evidence
Preserve historical actor and typed affected-target identifiers independently of mutable/deletable current identity rows. Current-account deletion/deactivation cannot cascade away or null out recorded identifiers. A current identity join is optional for investigation; do not fabricate missing actor/correlation metadata. Authorized account-history queries match actor OR affected account target and deduplicate by unique event ID. Physical schema/referential strategy remains technical design.

AUD-01–AUD-04 store UTC timestamps and default to explicitly labeled America/Bogota presentation, with inclusive-start/exclusive-end periods. Use timestamp/event ID for stable ordering. Proposed configurable MVP backend-policy defaults: maximum query period 90 days and maximum 2,000 events per PDF. These are query/export bounds, separate from the baseline retention policy. Backend aggregates cover the complete authorized filtered dataset, not its pagination page; login success for both privileged roles requires password plus MFA. Counts and evidence share documented event-type/outcome mappings.

PDF statistics, charts and event table use one consistent database snapshot. Reject exports above the configured limit with a narrower-filter message; never truncate silently. Report actual scope/count, sanitized filters, report ID, generation time/time zone and cutoff. The report's own export event is created after the data snapshot and does not change its counts; later reports may include it. No AI conclusions or unsupported factual observations.

`audit.report_exported` is emitted by the controlled backend writer, not an Auditor audit-write permission. Required context is acting Auditor identifier, UTC timestamp, outcome, report identifier, reporting period, sanitized filter allowlist and included-event count. Never log PDF contents, authentication credentials, secret download URLs or other excluded fields.

For a successful export, generation and authorized preparation complete, then required event persistence is acknowledged before the PDF is exposed/delivered. If mandatory recording fails, block delivery and return a safe actionable error. Do not release an unrecorded successful export. Generation failure cannot produce a partial download or a successful export event. Technical design specifies protected artifact cleanup and retry/idempotency to avoid bypass or ambiguous duplicate-success evidence; failed attempts can record sanitized failure outcomes when persistence is available. The success event does not prove that a client opened or received the document. Apply current-role/MFA authorization again at delivery, with no bearer access based only on report ID/URL.

### Persistence, access and failure consistency
Persist security events in existing PostgreSQL. Define a controlled append-only writer/service, explicit reader authorization and runtime database permissions. Product Administrators, Support Agents and ordinary runtime application roles cannot update or delete existing audit records. Administrator permissions do not implicitly grant an audit-reader interface. The active MFA-verified security_auditor is explicitly authorized to read all system security events through sanitized API projections, consistently for AUD lists, details, historical investigations, aggregates and PDF generation/delivery. Check current account/role/MFA on every request and deny suspended/former Auditors immediately even through existing sessions. This is no direct database, arbitrary raw-context or ADM-01 account-management permission. AUD-01–AUD-04 own the reader/report interface, separately from shared event capture.

Critical account/role mutations must have a consistent audit persistence outcome. Do not commit a privileged state change silently without its evidence. Design and test the transaction/error strategy; existing database transaction/UoW patterns are available. No external broker, new database or extra infrastructure is selected.

Authentication-event logging failures must be safe and observable without an unnecessary global outage. Logging failure never turns invalid authentication or denied authorization into access. Distinguish a critical privileged-write audit failure from a noncritical logging-system incident, and test the selected handling.

Shared implementation tests verify:
- Expected events and server-derived actor/target/outcome for successful and denied paths.
- Secret/financial-field exclusion, including activation and MFA failure cases.
- Reader/writer authorization and rejection of update/delete attempts.
- Critical mutation/audit consistency under database/logging failures and retries.
- Authentication logging failure handling without privilege bypass or unintended global outage.
- Admin/Auditor shared MFA coverage, promotion/staff-role assignment through existing sessions, suspension and immediate revoked-role denial.
- Historical actor/target preservation after identity changes/deletion and sanitized all-system Auditor reader scope.
- Export-event schema/privacy and protected delivery on success, generation/audit failures and retry, without an unrecorded successful PDF.

### Operational security constraints
The existing enabled SECURITY-14 baseline requires append-only/tamper-evident handling, an appropriate retention policy (default minimum 90 days) and security alarm configuration for relevant authentication/authorization/privilege signals. Carry those into implementation design and existing operational configuration; no advanced security analytics is added by SEC-02. Basic read-only activity counts/charts and reports are explicitly assigned to AUD-03/AUD-04; they do not replace operational alarm configuration. No infrastructure or monitoring configuration is changed in this documentation task.

### Security audit versus ticket activity
Ticket activity history contains creation, assignments, messages, status changes and resolutions. Security events contain selected security-sensitive evidence; do not copy entire conversations into the security audit store.

An escalated ticket's reason and return-to-support reason are staff-only workflow metadata. Resolution summaries and ordinary ticket messages are customer-visible only through authorized active-customer access. Backend projections must remove restricted fields, including within nested activity data. Staff read access to the ticket is not unrestricted security-log access.

Preserve ticket return history for both atomic branches: eligible original Support Agent plus in_progress, or no assignment plus open. No general-purpose internal notes, private messaging or extra story is added. Ticket history and security logging share traceability identifiers where appropriate but remain distinct concerns.

## Shared ownership and counting
SEC-01 and SEC-02 total 21 provisional points and are implemented once. The five ADM stories total 21 separately; the four AUD stories total 23. SEC-01 remains 13 after reassessment: both roles share the same TOTP lifecycle and browser integration, with expanded guards/tests but no identified material new subsystem. Reevaluate only if technical design demonstrates material added complexity. Reuse existing password/session infrastructure. Staff activation work is in ADM-03; Admin/Auditor MFA/browser integration is in SEC-01; audit infrastructure and event integration are in SEC-02. Existing Support and customer estimates remain unchanged.

Staff portal scaffolding and controlled backend admin provisioning are separate shared technical prerequisites, estimated once. Event persistence can be implemented before the Auditor reader UI; SEC-02 does not depend on completing AUD-01. The export-event schema/writer contract can be tested independently with fixtures; AUD-04 invokes it when report generation is later implemented, avoiding a circular UI dependency. Auditor frontend acceptance criteria belong only to the four canonical AUD stories, not SEC-02. The approved shared schema/export additions extend SEC-02 once; no duplicate infrastructure estimate.

## Security baseline coverage
Coverage below evaluates this documentation and future implementation constraints, not deployed effectiveness. [Enabled baseline rules](../../../.aidlc-rule-details/extensions/security/baseline/security-baseline.md) remain authoritative.

| Rule | Coverage | Scope rationale |
|---|---|---|
| SECURITY-01 | Compliant requirements | Protected TOTP/audit storage, PDF delivery/temporary artifacts and existing TLS/encryption requirements retained; no storage resource changed |
| SECURITY-02 | N/A | No network intermediary is defined or deployed |
| SECURITY-03 | Compliant requirements | Structured event schema, historical correlation, sanitized export metadata and sensitive-data exclusions |
| SECURITY-04 | Compliant requirements | Future HTML staff portal inherits CSP, HSTS, nosniff, frame and referrer security headers; no serving configuration changed |
| SECURITY-05 | Compliant requirements | Bounded query/filter/PDF inputs, proposed 90-day/2,000-event policy defaults, safe rendering and parameterized queries |
| SECURITY-06 | Compliant requirements | Four fixed roles, all-system sanitized Auditor read scope and separate controlled event writer; no financial/account-admin permission |
| SECURITY-07 | N/A | No networking/firewall or infrastructure mutation |
| SECURITY-08 | Compliant requirements | Every ADM/AUD request and report delivery checks active current role/resource/MFA; immediate suspension/role-removal denial; explicit browser origins |
| SECURITY-09 | Compliant requirements | No default administrative credentials; generic errors; hardening remains a deployment responsibility |
| SECURITY-10 | N/A | No dependencies, artifacts or CI/deployment pipeline changed; existing lockfile/scanning requirements retained |
| SECURITY-11 | Compliant requirements | Shared auth/audit/query modules, bounded/rate-limited queries and PDF abuse/snapshot/concurrency cases specified |
| SECURITY-12 | Compliant requirements | Shared Admin/Auditor TOTP lifecycle, stale/promotion-session protection, expiry/revocation and secure browser handling |
| SECURITY-13 | Compliant requirements | Critical state changes/export are auditable; preserved historical IDs, consistent report snapshot and validated event schemas; no artifact pipeline changed |
| SECURITY-14 | Compliant requirements | Append-only restrictions, retention baseline and security alarm responsibility carried forward; no advanced analytics added |
| SECURITY-15 | Compliant requirements | No authorization fail-open or unrecorded successful export; safe query/generation/audit failures, protected cleanup and diagnostics |

No non-compliant applicable documentation control was identified. Partial PBT rules are N/A to this text-only patch because no executable function, serializer or test is generated. Full Resiliency Baseline is disabled and skipped. Operational verification occurs when implementation is authorized.

## Implementation responsibilities and blockers
Technical design must select protection/key handling, challenge/session/invitation lifetimes, recovery verification, browser integration, schema/transaction/concurrency mechanisms and event failure/retention/observability configuration. These normal implementation responsibilities do not reopen the final functional decisions. No additional functional clarification preventing work on the approved scope was identified.
