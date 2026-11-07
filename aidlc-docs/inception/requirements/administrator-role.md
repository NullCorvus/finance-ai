# Administrator role requirements

**Role:** `admin`

**Decision date:** 2026-11-07

**Status:** Approved functional scope; application implementation Not started.

**Canonical stories:** [ADM-01–ADM-05](../../../docs/BACKLOG-AND-STORIES.md#administrator-and-shared-security-extension--2026-11-07). Shared security is defined once by [SEC-01/SEC-02](shared-security-requirements.md).

## Intent and approved scope
Document the five approved Administrator capabilities: exact account lookup, suspension/reactivation, staff creation/activation, authorized staff-role changes and escalated-ticket management. The final five execution corrections override the earlier proposed general-purpose internal notes and stale develop target. This is documentation only; no code, schema migration, scaffold, infrastructure change or Trello action is included.

The initial role model is exactly `user`, `support_agent`, `admin`, `security_auditor`, with one primary role per account. Free/Premium are subscription plans, not roles. Subscription management/expiration is outside this task. No fifth role, super_admin or multi-administrator approval system is introduced.

## Existing source versus planned requirements
Read-only inspection of local backend commit `2cbebf6` and frontend commit `4c6a03a` found existing identity, password and opaque session foundations. The identity model has ID, email, role, active status and registration timestamp. This does not establish a complete Administrator portal, RBAC/MFA flow or audit subsystem.

The inspected `auth/session_schemas.py` login contract accepts android/windows, and its authenticated-user projection does not carry role/MFA assurance. SEC-01 requires reviewing/extending the web contract and server-side principal/session authority. No JWT migration or separate authentication service is approved.

These are local source snapshots, not a hosted-release or live-database assertion. Full ADM/SEC completion is unverified, so all seven new stories remain Not started.

## Story and owner map

| Story | Canonical definition | Responsibility |
|---|---|---|
| ADM-01 | [Account search/detail](../../../docs/BACKLOG-AND-STORIES.md#adm-01--search-and-view-user-accounts) | Administrator owner |
| ADM-02 | [Suspend/reactivate](../../../docs/BACKLOG-AND-STORIES.md#adm-02--suspend-and-reactivate-user-accounts) | Administrator owner; shared session/audit integration |
| ADM-03 | [Staff creation/activation](../../../docs/BACKLOG-AND-STORIES.md#adm-03--create-staff-accounts) | Administrator owner; single-use activation lifecycle |
| ADM-04 | [Staff role assignments](../../../docs/BACKLOG-AND-STORIES.md#adm-04--manage-staff-roles-and-permissions) | Administrator owner; fixed RBAC assignments |
| ADM-05 | [Escalated tickets](../../../docs/BACKLOG-AND-STORIES.md#adm-05--manage-escalated-support-tickets) | Administrator owner; shared Support/customer contracts |
| SEC-01 | [Administrator TOTP MFA](../../../docs/BACKLOG-AND-STORIES.md#sec-01--administrator-totp-mfa) | Shared security owner, estimated once |
| SEC-02 | [Shared Security Audit Logging](../../../docs/BACKLOG-AND-STORIES.md#sec-02--shared-security-audit-logging) | Shared security owner, estimated once |

The backlog owns user-story narratives, acceptance criteria, priority, estimates and status. This specification owns the policy/architecture boundary; it does not duplicate story definitions.

## Common authorization and permissions
Every ADM operation requires an active admin principal, an MFA-verified administrative session and backend resource authorization. Check current authority on every request, including direct API calls, forged role values and requests from stale sessions. Frontend routes are supplemental. Public registration creates only ordinary user accounts.

| Operation | Allowed boundary | Explicit prohibition |
|---|---|---|
| Search/detail | Exact email/ID lookup of customer and staff login accounts; bounded allowlisted metadata | No financial records, credentials or unrestricted bulk disclosure |
| Suspend/reactivate | Authorized customer/staff accounts, including another administrator, with safeguards below | No self-suspension or operation leaving zero active administrators |
| Staff creation | support_agent or security_auditor through expiring single-use activation | No portal/API admin account creation |
| Role change | support_agent to/from security_auditor; exactly one role | No own-role change, empty role, custom permission editor or admin grant/revoke |
| Escalation management | Authorized claim, existing messages, resolution and approved return workflow | No general notes/private messaging, unrestricted finance access or out-of-scope administrative operation |
| Audit interaction | Emit shared security events through the controlled service | No modification/deletion of audit evidence; reading needs explicit authorization |

Never expose transactions, balances, receipts, passwords, password hashes, session/activation credentials or MFA secrets through Administrator account/ticket responses. Do not modify customer financial records. Safe failure responses reveal no secrets, private records or internal implementation details.

## Administrator provisioning and availability invariant
Initial and additional admin accounts, including promotion through an authorized backend procedure, are provisioned securely outside the ordinary portal. The portal API must reject admin grants/revocations even if a client forges a hidden role field. Do not add super_admin, an approval quorum or a new portal provisioning feature.

The controlled procedure's operator authentication, bootstrap/secret handoff and activation mechanics are implementation design responsibilities. No administrative functionality is available before SEC-01 completes. Reuse password protection; no default or hardcoded administrative credentials.

An administrator may suspend another administrator only with MFA-verified authority, explicit confirmation and a reason. Never suspend the actor's own account or the last active administrator. Enforce the invariant across suspension, deactivation and every equivalent state/role path that could leave no active administrator, including controlled backend operations. Concurrent requests cannot independently pass a stale count and disable the remaining administrators.

Suspension invalidates relevant sessions immediately and blocks all protected functionality, including customer support. Reactivation preserves financial/support data but never revives pre-suspension credentials; the person authenticates again, including MFA when applicable.

## Staff creation, activation and role changes
The administrator initiates support_agent/security_auditor accounts; recipients establish their own passwords using expiring, single-use activation credentials. No staff access is available before successful activation. Validate unique normalized email and reject invalid, expired or replayed activation requests. Delivery mechanism, token lifetime and detailed activation protocol are assigned to technical design; no email provider or new infrastructure is selected here.

SEC-02 records `staff.created` and `staff.activated`. Actor/target identities are derived server-side when available. Activation tokens and passwords are excluded from events, diagnostics and normal account projections.

Role changes are limited to the two approved staff roles, require confirmation and immediately alter backend authority. Revoke sessions or securely revalidate against current role. Deactivation belongs to ADM-02; removing access never means leaving an undefined primary role.

## Escalation, return and customer visibility
The current status vocabulary remains `open`, `in_progress`, `escalated`, `resolved`; no additional status is introduced.

| Action | Assignment/status contract | Required evidence |
|---|---|---|
| Support escalates | Ticket becomes escalated; preserve the originating Support Agent for the current escalation; authorized administrator can claim without conflicting ownership | Internal escalation reason, actor/time and preserved case history |
| Administrator investigates/responds | Check authorized case ownership; originating active/authorized Support Agent retains read-only access while escalated | Existing customer-visible messages and relevant activity history |
| Administrator resolves | Require resolution summary; mark resolved through the authorized case operation | Customer-visible resolution; preserved history and applicable audit evidence |
| Return with eligible origin | If original agent is active and still support_agent, set that agent as assignee and in_progress status atomically | Mandatory internal return reason and recorded assignment/status transition |
| Return with ineligible origin | Otherwise clear assignment and set open in the unassigned support queue atomically | Same required reason/history; no partial assignment/status update |

Re-evaluate eligibility as part of the return operation. Preserve the originating agent reference/history while an administrator owns the current case. State and assignment changes must commit consistently; failures cannot create mixed results.

Escalation/return reasons are internal workflow metadata visible only to authorized staff. Resolution summaries and ordinary customer conversation messages are visible to the owning active customer. Enforce response projections in the backend, including nested activity payloads; Flutter/React field hiding alone is insufficient. Suspended customers cannot access protected support resources until reactivation.

No general-purpose internal-note editor, private messaging, attachments or new support-chat infrastructure is included. Only escalation reason, return reason, resolution summary, existing ticket messages and activity history are retained for this workflow.

[Support Agent requirements](support-agent-role.md) and SUP-03/SUP-05/SUP-06/USR-SUP-02 carry these same boundaries. Unrelated Support policies such as general queue membership and reopening are not redefined by this task.

## Planned repository/code structure
Keep the existing three repositories and existing backend/database.

| Repository | Planned location | Responsibility |
|---|---|---|
| NullCorvus/finance-ai | docs/ and aidlc-docs/ | Canonical backlog and shared requirements |
| Maicol2363/finance-ai-frontend | staff-web/src/app/ and staff-web/src/shared/ | Reusable portal shell, navigation and common utilities |
| Same frontend | staff-web/src/features/auth/ | Shared staff authentication/MFA integration |
| Same frontend | staff-web/src/features/admin/ | Administrator screens for ADM-01–ADM-05 |
| Same frontend | staff-web/src/features/support/ | Existing planned Support interface |
| Same frontend | staff-web/src/features/audit/ | Reserved future read-only Auditor feature; no Auditor UI story/scaffold here |
| Same frontend | lib/features/support/ | Existing customer dependency location in Flutter |
| Maicol2363/finance-ai-backend | src/finance_ai/admin/ | Proposed administrative routers/schemas/policies/services following existing module conventions |
| Same backend | Existing auth/ plus proposed audit/ under src/finance_ai/ | Shared session/MFA and security-event service contracts |
| Same backend | Existing db/models/, db/repositories/, database UoW modules, migrations/ and tests/ | Persistence/adapters and later implementation tests |

The staff web technology remains React + Vite + TypeScript + Tailwind CSS. React is outside Flutter's existing web/ runner. FastAPI remains the authorization boundary and PostgreSQL the shared persistence store. These are planned repository-relative paths only; no directories, dependencies or migration files are created.

## Dependency and estimation boundaries
The functional Administrator subtotal is 21 provisional points; shared security subtotal is 21, counted once. See the [backlog estimate rationale](../../../docs/BACKLOG-AND-STORIES.md#provisional-estimates-and-counting-boundaries). Existing normal authentication and ticket infrastructure are reused, not re-estimated as complete new systems.

Staff portal foundation and controlled backend administrator provisioning are explicit shared technical prerequisites, assigned/estimated once separately. SEC-01 owns the Admin MFA lifecycle and browser-session integration; SEC-02 owns shared audit infrastructure; ADM-03 owns invitation/activation. No duplicate security work is charged to every role story.

Implementation should establish shared identity/audit contracts, implement the shared security capabilities and then the dependent ADM slices, coordinated with the Support and customer owners. Audit generation does not depend on the future Auditor frontend. See the [documentation execution plan](../plans/admin-security-documentation-plan.md).

## Technical design responsibilities and blockers
The approved functional decisions are closed; no further general requirements review is required. The implementation agent must specify invitation/challenge/session lifetimes, activation delivery, TOTP secret/key protection and clock skew, recovery identity verification, secure browser sessions/CORS/CSRF, transaction/concurrency mechanisms, input bounds and the audit persistence/failure strategy. These are normal implementation deliverables, not newly opened functional decisions or current documentation blockers.

Existing shared foundations must be delivered/coordinated; their planned status does not justify claiming implementation. No additional user decision blocking this documentation or the approved ADM/SEC scope was identified.

## Exclusions and inherited security constraints
Exclude subscription/refund/billing/expiration workflows, general system settings, infrastructure/cloud/API-key management, private financial-record access/modification, audit edits/deletion, portal admin creation/grants/revocations, a fifth role or multi-administrator approval system, general internal notes/private messaging, AI support and advanced security analytics. Preserve all earlier Support exclusions.

Apply the enabled security baseline's MFA, deny-by-default role/resource control, bounded inputs, safe rendering/errors, protected secrets and structured audit requirements. The [shared security specification](shared-security-requirements.md#security-baseline-coverage) records rule-by-rule documentation coverage; no deployed security compliance is claimed.
