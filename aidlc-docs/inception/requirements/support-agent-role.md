# Support Agent role requirements

**Role:** `support_agent`

**Decision date:** 2026-11-04

**Status:** Approved scope documented; implementation Not started. Pending workflow decisions below do not block documentation completion.

**Authoritative stories:** [SUP-01–SUP-06 and customer dependencies](../../../docs/BACKLOG-AND-STORIES.md#support-agent-extension--2026-11-04)

## Intent and scope
Document the human-operated Support Agent capability before implementation: handle customer tickets, communicate with their owners, inspect limited account metadata, resolve eligible cases and escalate privileged work. This is a documentation-only change across existing product documents, with no application code, migration, scaffold, infrastructure or Trello changes.

The detailed requirements in this document concern Support Agent. Other role backlogs are separate work. An account has one primary authorization role in the initial design; Free/Premium are subscription plans, not security roles. Subscription-expiration behavior remains undecided and is outside this task. Staff is provisioned by authorized administrators, public registration creates ordinary customers, and users cannot self-select privileged roles. Privileged assignments must be audited. Planned administrator MFA and staff provisioning/RBAC are shared dependencies, not implemented features.

## Sources and implementation evidence
The supplied six-story baseline and 2026-11-04 corrections govern this scope. The [backlog](../../../docs/BACKLOG-AND-STORIES.md), [architecture](../../../docs/ARCHITECTURE.md), [stack](../../../docs/STACK.md) and [code guide](../../../docs/guides/code-architecture-guide.md) provide product and technical context.

Read-only inspection of the current local backend/frontend checkouts found:
- Backend `src/finance_ai/db/seeds.py` seeds `user` and `admin`; `support_agent` is planned.
- `src/finance_ai/db/models/identity.py` has account identifier, email and `is_active`; no customer-name or subscription-status field was found there.
- `src/finance_ai/auth/session_service.py` and `auth/dependencies.py` implement opaque database-backed session credentials. Reuse that architecture; do not assume JWT authentication.
- `src/finance_ai/api/router.py` contains no support router; no support module, ticket-history module or corresponding Flutter feature was found in the inspected source.
- Existing backend feature modules use routers, schemas, policies, services, repository/UoW interfaces and database adapters; Flutter separates domain, data, application and presentation.

These are source observations, not a statement about a live database or a hosted release. Existing architecture/stack documents identify their own historical source snapshots. No missing capability is marked implemented.

## Personas and story traceability
The agent assists identified customers within assigned or otherwise explicitly authorized cases. The authenticated customer creates and follows only their own requests. An administrator receives escalated cases; that role's detailed workflow is owned separately.

| ID | Authoritative definition | Owner boundary |
|---|---|---|
| SUP-01 | [View and claim](../../../docs/BACKLOG-AND-STORIES.md#sup-01--view-and-claim-support-tickets) | Support Agent |
| SUP-02 | [Create on behalf of customer](../../../docs/BACKLOG-AND-STORIES.md#sup-02--create-support-tickets) | Support Agent |
| SUP-03 | [Communicate](../../../docs/BACKLOG-AND-STORIES.md#sup-03--communicate-with-customers) | Support Agent; customer UI dependency |
| SUP-04 | [Limited account information](../../../docs/BACKLOG-AND-STORIES.md#sup-04--view-limited-customer-information) | Support Agent; single information-permissions story |
| SUP-05 | [Escalate](../../../docs/BACKLOG-AND-STORIES.md#sup-05--escalate-tickets-to-administrators) | Support-side handoff; Admin workflow separate |
| SUP-06 | [History and resolution](../../../docs/BACKLOG-AND-STORIES.md#sup-06--review-case-history-and-resolve-tickets) | Support Agent; customer resolution visibility dependency |
| USR-SUP-01 | [Create request](../../../docs/BACKLOG-AND-STORIES.md#usr-sup-01--create-a-support-request) | Customer-role owner |
| USR-SUP-02 | [Track and reply](../../../docs/BACKLOG-AND-STORIES.md#usr-sup-02--track-and-respond-to-support-requests) | Customer-role owner |

Story descriptions, acceptance criteria, priorities, provisional points and statuses live only in the backlog. This table is an index, not a second story register.

## Permissions and data boundary

| Context or action | Allowed | Required boundary |
|---|---|---|
| Unassigned ticket queue | Authorized queue listing/filtering and claim | Return only ID, subject, status, creation time and assignment; queue membership policy pending |
| Assigned ticket | Read case, communicate, review history | Backend verifies role, resource scope and current assignment on every operation |
| Customer identification before ticket creation | Narrow lookup for an identified customer | Approved lookup keys/result limits pending; no unrestricted customer directory |
| Customer metadata | Read only supported name/email/ID/account-status/subscription-status fields | Allowlisted response; authorized case context or narrowly approved lookup |
| Create ticket for a customer | Subject/category/description linked to verified customer | Server validates target and records acting agent |
| Escalation | Assigned case plus documented reason | Restricted action; retain history; ownership after escalation pending |
| Resolution | Assigned eligible ticket plus summary | Approved transition policy; preserve history and customer-visible outcome |
| Audit evidence | Generate action metadata | No permission to change or delete security audit records |

Deny access to private transactions, balances, receipts, passwords, password hashes, tokens and financial credentials through support account-data APIs. A customer may type sensitive content into a ticket; this does not grant financial-record access or justify copying that content into security logs.

Agents cannot modify account information, roles/permissions, subscription entitlements, account suspension/reactivation, refunds/billing operations or system configuration. They cannot access out-of-scope tickets or modify/delete security audit records. Case history is support workflow data; it does not grant access to the independent security audit store.

Backend authorization is mandatory for list, lookup, detail, messages, claim, escalation, resolution and history requests, including direct requests with forged IDs. UI routing is supplemental. Public registration cannot grant a staff role.

## Ticket workflow
The approved status vocabulary is `open`, `in_progress`, `escalated`, `resolved`.

Text journey: authenticated customer or authorized agent creates a ticket; an agent finds and claims an unassigned case; the assigned agent and customer exchange messages; an eligible case is resolved with a summary or escalated with a reason; authorized history is retained. This journey describes approved capabilities, not an invented complete state machine.

| Operation | Confirmed behavior | Pending rule |
|---|---|---|
| Customer creates ticket | Belongs to authenticated customer | Initial status and assignment |
| Agent creates ticket | Existing identified customer; acting agent/timestamp recorded | Initial status and automatic assignment |
| Claim | Only unassigned authorized ticket; atomic single winner | Whether claim changes open to in_progress; eligible source states |
| Message | Assigned authorized agent and owning customer; author/time retained | Reply-eligible statuses; behavior during escalation/after resolution |
| Escalate | Assigned eligible ticket; reason required; target status escalated | Eligible source states; admin queue/person ownership; continuing agent write access |
| Resolve | Assigned eligible ticket; summary required; target status resolved | Eligible source states; whether agents can resolve escalated cases |
| Reassign/unassign | No approved business behavior | Who may perform it and how ownership/history change |
| Reopen | No approved business behavior | Who may reopen, target state, assignment and reply behavior |

Do not infer that every pair of statuses is a legal transition. Reject disallowed mutations; unresolved policies must be approved before implementing the affected operation.

## Validation and audit requirements
The backend must validate types/IDs, nonblank required text, allowed categories and explicit text/payload bounds. Exact category vocabulary, lookup inputs and numeric limits remain pending. Render ticket text as safe content in React and Flutter; prevent script/markup injection and parameterize database queries.

The enabled security baseline also requires rate limiting on externally reachable APIs and
brute-force protection for staff login. Staff authentication design must retain adaptive password
hashing and password-policy controls, server-side session expiry/logout revocation, no hardcoded
credentials, planned administrator MFA and secure browser credential handling. If cookies are used,
apply Secure/HttpOnly/SameSite protections and CSRF controls. The exact browser-session mechanism
remains a shared design dependency; this document does not replace the existing session implementation.

Every important successful action must produce compatible activity/audit evidence: creation, claim/assignment, messages, escalation and resolution. Restricted lookup/access and privileged-role events must follow the shared audit contract. Include actor identifier, ticket/resource identifier, action, server timestamp, outcome and correlation identifier where applicable. Keep credentials, full customer metadata, message bodies and financial records out of security log payloads.

The independent audit contract, durability/failure behavior, retention policy and customer visibility of internal events remain pending with the shared security/audit owner. Do not claim tamper-proof storage or an existing auditor interface. Security-relevant failures deny access and avoid partial unauthorized mutation; response errors expose no internal details.

## Planned architecture and code locations
Keep the existing three repositories. No fourth repository, separate support backend or separate database is introduced.

| Repository | Planned location | Responsibility |
|---|---|---|
| `NullCorvus/finance-ai` | Existing `docs/` and `aidlc-docs/` | Shared product backlog, requirements and technical context |
| `Maicol2363/finance-ai-frontend` | `staff-web/` | Separate React + Vite + TypeScript + Tailwind CSS application |
| Same frontend repository | `staff-web/src/app/` | Portal shell, routing and providers |
| Same frontend repository | `staff-web/src/features/auth/` | Staff session integration and role-aware navigation |
| Same frontend repository | `staff-web/src/features/support/` | Support ticket UI |
| Same frontend repository | `staff-web/src/shared/` | Reusable staff UI/API utilities |
| Same frontend repository | `lib/features/support/` | Customer Flutter domain/data/application/presentation layers |
| `Maicol2363/finance-ai-backend` | `src/finance_ai/support/` | Routers, schemas, policies, services and repository/UoW contracts |
| Same backend repository | Existing `db/models/`, `db/repositories/`, database UoW modules, `migrations/` and `tests/` conventions | Persistence, schema evolution and tests when implementation is authorized |

The React application will have its own `staff-web/package.json` and `staff-web/vite.config.ts`. Flutter's existing `web/` remains its Flutter web runner; React must not be placed there. Future Admin/Security Auditor interfaces may reuse the portal shell, without adding their stories or screens now.

Both clients call the existing FastAPI API; only the backend accesses the existing PostgreSQL database. Reuse opaque session infrastructure and extend staff authorization/session handling as needed. Browser session-storage/CSRF/CORS details require an explicit implementation design; do not copy mobile credential storage into a browser blindly. Staff origins must be explicitly allowed, not wildcarded. New portal hosting, CI and exact routes are not implemented here.

All paths above are plans relative to the named repository, portable across teammates' checkout locations. No implementation directory is created by this task.

## Shared dependencies and ownership
- Staff portal scaffolding and reusable shell: one frontend foundation owner.
- Staff provisioning/authentication/RBAC, deny-by-default resource enforcement and planned administrator MFA: shared identity owner. No public staff signup.
- Ticket persistence, message/event contracts and atomic claim behavior: Support Agent owner, coordinated with backend foundations.
- Customer mobile stories: customer-role owner, linked by the two existing dependency IDs.
- Account-name/subscription-status availability: account/plan owner; show no invented status. No billing or expiration workflow is added.
- Audit contract/integration: security/audit owner; implement action evidence once and reuse it.
- Escalation acceptance/ownership: Admin owner; agree handoff before completing SUP-05.

Foundation work is estimated once separately; backlog story estimates do not double-count Flutter UI or shared authentication. Follow the [role-owner handoff](../plans/support-agent-documentation-plan.md#role-owner-handoff).

## Pending decisions
Documentation can be completed with these explicitly open. Resolve each before implementing the affected behavior:
1. Queue authorization scope and what constitutes a restricted case.
2. Approved lookup identifiers, disclosure/result limits and pre-ticket authorization.
3. Creation/claim status rules, eligible transitions and reassignment/unassignment authority.
4. Ownership and agent access after escalation; administrator acceptance contract.
5. Reply eligibility, resolution eligibility, customer-visible history and reopening.
6. Category values, text/payload length bounds and unavailable-profile-field presentation.
7. Shared staff browser-session design, audit event contract, retention and audit failure behavior.

Subscription-expiration behavior is outside this scope and is not a documentation blocker. The confirmed human-support scope, stack, repository placement and separation of plans from roles are not open questions.

## Explicit exclusions
No AI support or generated responses; knowledge base or response templates; agent performance analytics; personal agent work-history dashboards; complex routing or SLA management; push notifications or real-time chat infrastructure; file attachments; public anonymous ticket portal. Financial product AI is unrelated to this human support workflow.

## Extension compliance for this documentation change
This evaluates requirements coverage only, not implemented controls.

| Rule | Status | Rationale |
|---|---|---|
| SECURITY-01 | N/A | No storage or encryption configuration changed |
| SECURITY-02 | N/A | No network intermediary defined or deployed |
| SECURITY-03 | Compliant | Action metadata and sensitive-data logging boundaries documented |
| SECURITY-04 | Compliant | Planned HTML portal inherits mandatory security-header requirements; verify CSP, HSTS, nosniff, frame and referrer policies during portal design/implementation |
| SECURITY-05 | Compliant | Validation, bounded inputs, safe rendering and parameterized queries required; concrete bounds pending |
| SECURITY-06 | Compliant | Explicit allowlist and separated permitted/denied actions |
| SECURITY-07 | N/A | No network resources or firewall configuration changed |
| SECURITY-08 | Compliant | Per-request backend role/resource checks and explicit staff-origin policy required |
| SECURITY-09 | Compliant | Safe errors and no public staff provisioning required; deployment checks deferred |
| SECURITY-10 | N/A | No packages, build pipeline or deployment artifacts changed; portal lockfile/scanning/SBOM belong to future foundation work |
| SECURITY-11 | Compliant | Separate support domain, authentication, persistence and role-specific UI boundaries |
| SECURITY-12 | Compliant | Reuse sessions, deny self-selected staff roles, planned admin MFA; no credential exposure |
| SECURITY-13 | N/A | No executable dependencies, artifact integrity or deployment pipeline changed |
| SECURITY-14 | N/A | No monitoring deployment; shared audit contract is a documented dependency |
| SECURITY-15 | Compliant | Deny unauthorized requests, safe errors and no partial unauthorized mutation |

PBT-01–PBT-10: N/A to this documentation-only patch; partial PBT configuration is retained and no executable functions, serializers or tests are generated. Full Resiliency Baseline is disabled and skipped.
