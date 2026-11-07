# Shared security requirements

**Scope:** SEC-01 — Administrator TOTP MFA; SEC-02 — Shared Security Audit Logging.

**Decision date:** 2026-11-07

**Status:** Approved requirements; implementation Not started. These cross-cutting capabilities are estimated and implemented once, separately from Administrator functional stories.

## Canonical stories and dependencies
- [SEC-01 — Administrator TOTP MFA](../../../docs/BACKLOG-AND-STORIES.md#sec-01--administrator-totp-mfa): 13 provisional points.
- [SEC-02 — Shared Security Audit Logging](../../../docs/BACKLOG-AND-STORIES.md#sec-02--shared-security-audit-logging): 8 provisional points.

The backlog owns narratives and acceptance criteria. This document defines shared contracts and technical-design responsibilities. [Administrator requirements](administrator-role.md) and [Support requirements](support-agent-role.md) consume the same services. No extra SEC story or Auditor-interface story is introduced.

Reuse existing FastAPI authentication, opaque database-backed sessions, PostgreSQL and the planned staff-web portal. The inspected local backend has existing password/session primitives but no complete verified TOTP/audit implementation. Requirements are not evidence of runtime availability.

## SEC-01 contract: password, factor and administrative authority
Use password plus TOTP. Verify the password before challenging for the factor. Initial enrollment exposes its QR/secret only within the authorized enrollment flow and becomes active only after a valid code is verified. Regular account/session APIs and logs never expose factor secrets or verification codes.

Incomplete authentication uses a short-lived, account-bound challenge with no administrative authority. Reject invalid/expired challenges and invalid, expired or previously accepted OTPs for the same authenticator/time step, including concurrent requests. Rate-limit failed attempts and maintain safe error behavior.

Every ADM endpoint checks the current active admin role and MFA-verified session state server-side. A correct password alone is not an administrative login; `auth.login_success` for admin is emitted only after password and MFA complete. Promoting an already-authenticated account through controlled backend provisioning does not make its old session MFA-verified.

Recovery and authenticator replacement require a secure identity-verification procedure and invalidate relevant existing sessions. No default recovery bypass or new portal privilege-grant path is approved. The secure controlled backend provisioning process must establish initial/additional administrators without a fifth role or an approval quorum.

Technical design must specify:
- Encryption/protection of TOTP secrets at rest and key access, with no hardcoded secrets.
- Time-step/clock-skew policy and atomic replay prevention.
- Challenge lifetime, administrative session lifetimes, expiry/logout and invalidation behavior.
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
| auth.login_success | Completed login; for admin, both factors completed |
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

Server-derived event identity, UTC timestamp, type and outcome are mandatory. Record actor when identifiable, applicable target and available request/correlation identifier. Sanitize context through an explicit schema/allowlist; untrusted input must not inject event text, actor identity or extra sensitive fields.

Both `staff.created` and `staff.activated` contain the appropriate actor/target, timestamp, outcome and allowed context. An activation token proves only the bounded activation purpose; it is never logged. Neither successful nor failed activation handling may leak credentials.

Exclude passwords/hashes, session/activation tokens, MFA secrets/codes, financial balances/amounts, receipts, complete sensitive request bodies and unnecessary personal information from events and diagnostics. Use bounded context, safe encoding and parameterized persistence.

### Persistence, access and failure consistency
Persist security events in existing PostgreSQL. Define a controlled append-only writer/service, explicit reader authorization and runtime database permissions. Product Administrators, Support Agents and ordinary runtime application roles cannot update or delete existing audit records. Administrator permissions do not implicitly grant an audit-reader interface. The future Security Auditor UI remains separate work.

Critical account/role mutations must have a consistent audit persistence outcome. Do not commit a privileged state change silently without its evidence. Design and test the transaction/error strategy; existing database transaction/UoW patterns are available. No external broker, new database or extra infrastructure is selected.

Authentication-event logging failures must be safe and observable without an unnecessary global outage. Logging failure never turns invalid authentication or denied authorization into access. Distinguish a critical privileged-write audit failure from a noncritical logging-system incident, and test the selected handling.

Shared implementation tests verify:
- Expected events and server-derived actor/target/outcome for successful and denied paths.
- Secret/financial-field exclusion, including activation and MFA failure cases.
- Reader/writer authorization and rejection of update/delete attempts.
- Critical mutation/audit consistency under database/logging failures and retries.
- Authentication logging failure handling without privilege bypass or unintended global outage.

### Operational security constraints
The existing enabled SECURITY-14 baseline requires append-only/tamper-evident handling, an appropriate retention policy (default minimum 90 days) and security alarm configuration for relevant authentication/authorization/privilege signals. Carry those into implementation design and existing operational configuration; no advanced security analytics or new application dashboard is added to this backlog. No infrastructure or monitoring configuration is changed in this documentation task.

### Security audit versus ticket activity
Ticket activity history contains creation, assignments, messages, status changes and resolutions. Security events contain selected security-sensitive evidence; do not copy entire conversations into the security audit store.

An escalated ticket's reason and return-to-support reason are staff-only workflow metadata. Resolution summaries and ordinary ticket messages are customer-visible only through authorized active-customer access. Backend projections must remove restricted fields, including within nested activity data. Staff read access to the ticket is not unrestricted security-log access.

Preserve ticket return history for both atomic branches: eligible original Support Agent plus in_progress, or no assignment plus open. No general-purpose internal notes, private messaging or extra story is added. Ticket history and security logging share traceability identifiers where appropriate but remain distinct concerns.

## Shared ownership and counting
SEC-01 and SEC-02 total 21 provisional points and are implemented once. The five ADM stories total 21 separately. Reuse existing password/session infrastructure. Staff activation work is in ADM-03; Admin MFA/browser integration is in SEC-01; audit infrastructure and event integration are in SEC-02. Existing Support and customer estimates remain unchanged.

Staff portal scaffolding and controlled backend admin provisioning are separate shared technical prerequisites, estimated once. Event persistence can be implemented before the Auditor reader UI; SEC-02 does not depend on completing AUD-01. No Auditor frontend acceptance criteria are added here.

## Security baseline coverage
Coverage below evaluates this documentation and future implementation constraints, not deployed effectiveness. [Enabled baseline rules](../../../.aidlc-rule-details/extensions/security/baseline/security-baseline.md) remain authoritative.

| Rule | Coverage | Scope rationale |
|---|---|---|
| SECURITY-01 | Compliant requirements | Protected TOTP/audit storage and existing TLS/encryption requirements retained; no storage resource changed |
| SECURITY-02 | N/A | No network intermediary is defined or deployed |
| SECURITY-03 | Compliant requirements | Structured event schema, correlation, bounded context and sensitive-data exclusions |
| SECURITY-04 | Compliant requirements | Future HTML staff portal inherits CSP, HSTS, nosniff, frame and referrer security headers; no serving configuration changed |
| SECURITY-05 | Compliant requirements | Bounded typed inputs, exact lookup, safe rendering and parameterized persistence |
| SECURITY-06 | Compliant requirements | Fixed roles, metadata allowlists and explicit reader/writer boundaries |
| SECURITY-07 | N/A | No networking/firewall or infrastructure mutation |
| SECURITY-08 | Compliant requirements | Every ADM request checks current role/resource and MFA authority; explicit browser origins |
| SECURITY-09 | Compliant requirements | No default administrative credentials; generic errors; hardening remains a deployment responsibility |
| SECURITY-10 | N/A | No dependencies, artifacts or CI/deployment pipeline changed; existing lockfile/scanning requirements retained |
| SECURITY-11 | Compliant requirements | Shared auth/audit modules, rate limits and concurrency/abuse cases specified |
| SECURITY-12 | Compliant requirements | TOTP lifecycle, password protection, session expiry/revocation and secure browser handling |
| SECURITY-13 | Compliant requirements | Critical state changes are auditable; validated event schemas and role before/after values; no artifact pipeline changed |
| SECURITY-14 | Compliant requirements | Append-only restrictions, retention baseline and security alarm responsibility carried forward; no advanced analytics added |
| SECURITY-15 | Compliant requirements | No authorization fail-open; consistent privileged write/audit failure handling and safe diagnostics |

No non-compliant applicable documentation control was identified. Partial PBT rules are N/A to this text-only patch because no executable function, serializer or test is generated. Full Resiliency Baseline is disabled and skipped. Operational verification occurs when implementation is authorized.

## Implementation responsibilities and blockers
Technical design must select protection/key handling, challenge/session/invitation lifetimes, recovery verification, browser integration, schema/transaction/concurrency mechanisms and event failure/retention/observability configuration. These normal implementation responsibilities do not reopen the final functional decisions. No additional functional clarification preventing work on the approved scope was identified.
