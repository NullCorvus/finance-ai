# Access Model Decisions and Remaining Questions

## Current Support Agent decisions — 2026-11-04
The latest supplied correction supersedes contradictory statements in the archived question sheet below. The shared authorization identifiers are `user`, `support_agent`, `admin` and `security_auditor`; initial accounts have one primary role. The inspected backend currently seeds only `user` and `admin`. Support Agent requirements retain their own scope; Administrator and shared security requirements are now documented separately, while detailed Security Auditor interface stories remain separate future work.

Free and Premium are subscription plans, not authorization roles. No plan-role synchronization or subscription-expiration behavior has been approved. Do not infer automatic downgrade, suspend accounts on expiry or implement billing/entitlements in this task.

Confirmed Support Agent decisions:
- Human-operated ticket management only; no AI support.
- Exactly SUP-01–SUP-06, plus customer dependencies USR-SUP-01/02; SUP-04 owns limited customer-information permissions.
- Backend-enforced role and resource authorization, limited queue metadata, assigned-ticket context and narrow pre-ticket customer lookup.
- Staff accounts are administrator-provisioned; public registration cannot select a privileged role. Privileged assignments are audited; administrator MFA is a planned shared security requirement.
- Existing Flutter customer UI, React/Vite/TypeScript/Tailwind staff application in the existing frontend repository's `staff-web/`, and the existing FastAPI/PostgreSQL backend.
- Missing customer-name/subscription-status fields are dependencies, not implemented facts. Subscription behavior is not a blocker for documenting Support Agent.

See the [role requirements](support-agent-role.md) and [authoritative stories](../../../docs/BACKLOG-AND-STORIES.md#support-agent-extension--2026-11-04).

## Disposition of the previous questions
| Original question | Current disposition |
|---|---|
| 1 — Role combination | One primary authorization role per account confirmed; old plan-role names superseded |
| 2 — Support model | Human support only confirmed; AI options superseded |
| 3 — Support data | Limited metadata and authorized ticket information confirmed; private financial-record access excluded |
| 4 — Admin access | Finalized by ADM-01–ADM-05: allowlisted login-account metadata, safeguarded account/staff operations and escalated tickets under MFA; no financial-record access, billing or system configuration |
| 5 — Premium scope | Outside Support Agent; plans are separate, with no entitlement implementation here |
| 6 — Subscription expiration | Not finalized; no downgrade or suspension policy selected |
| 7 — Staff provisioning | Authorized administrator provisioning, no public staff selection, planned admin MFA and assignment audit confirmed |
| 8 — Security Auditor | Confirmed shared role; detailed stories separate, not part of this backlog |

Historical empty [Answer] tags below are not unanswered blockers for this documentation task.

## Pending Support Agent implementation decisions
The following questions record genuine pending behavior. Documentation proceeds with them explicitly open; no option is silently selected.

### Question SUP-Q1
Who may see and claim a ticket before assignment?

A) Any active support agent in the shared authorized support queue

B) Only agents with an explicitly assigned queue scope

C) Other (please describe after [Answer]:)

[Answer]: Pending

### Question SUP-Q2
What should a successful claim do to an open ticket's status?

A) Change it to in_progress atomically with assignment

B) Keep it open until a separate authorized start action

C) Other (please describe after [Answer]:)

[Answer]: Pending

### Question SUP-Q3
Who owns an escalated case?

A) An administrator queue owns it; the originating agent retains read-only case access

B) The originating agent remains assigned while administrators receive explicit escalation access

C) Other (please describe after [Answer]:)

[Answer]: A — Finalized 2026-11-07: administrator queue with authorized claim; originating active/authorized Support Agent retains read-only access. ADM-05 fixes the mandatory internal return reason and atomic return: eligible original support_agent with in_progress, otherwise clear assignment and use open in the unassigned queue. Backend hides escalation/return reasons from customers.

### Question SUP-Q4
What is the policy after resolution?

A) The customer must create a new linked request; resolved cases accept no replies

B) The owning customer can reopen the same case under explicitly defined status and assignment rules

C) Other (please describe after [Answer]:)

[Answer]: Pending

Unrelated Support creation/claim rules, lookup scope, input bounds and general non-escalated reply/resolution/reopening behavior remain as listed in the [Support requirements](support-agent-role.md#pending-decisions). They do not reopen the finalized escalation/return/visibility contract or the Administrator/security scope. Shared session/audit implementation details follow SEC-01/SEC-02.

## Final Administrator and shared security decisions — 2026-11-07
These are approved decisions, not a new questionnaire. The user's execution instruction explicitly replaces further general discovery/review gates for this documentation task.

- Keep exactly ADM-01–ADM-05 and shared SEC-01/SEC-02, separate from the six existing SUP stories. Definitions/criteria/points live in the [canonical backlog](../../../docs/BACKLOG-AND-STORIES.md#administrator-and-shared-security-extension--2026-11-07).
- ADM-01 searches customer/staff login accounts by exact email or ID with bounded results and an allowlisted metadata projection; no financial-record access.
- ADM-02 allows an MFA-verified administrator to suspend another administrator with confirmation/reason, but never their own account or the last active administrator. Protect concurrent and equivalent deactivation paths; invalidate sessions permanently across reactivation.
- ADM-03 creates only support_agent/security_auditor through expiring single-use activation. Recipients establish their passwords and gain no staff privileges before activation.
- ADM-04 allows only support_agent/security_auditor transitions, with exactly one primary role, confirmation and immediate session/authority effects. No own-role change or portal admin grant/revoke.
- Initial/additional admin provisioning is a separate controlled backend procedure. No super_admin or multi-administrator approval system.
- ADM-05 administrator claim prevents conflicting case ownership. Originating authorized Support retains read-only access while escalated. Return requires a reason and atomic assignment/status update: eligible original active support_agent gets in_progress; otherwise unassign and use open in the support queue. Preserve history.
- Escalation/return reasons are authorized-staff-only metadata; resolution summaries are customer-visible. Backend projections enforce this. Suspended customers cannot access protected support until reactivation. No general-purpose internal notes/private messaging.
- SEC-01 uses password plus TOTP, verified enrollment, concurrent replay resistance, recovery/replacement, session invalidation and MFA gating on every ADM request, preserving opaque sessions and adding web compatibility through technical design.
- SEC-02 includes both staff.created and staff.activated, with safe actor/target/time/outcome/context and no activation credentials. Security events and operational ticket history remain distinct; critical account/role changes cannot silently succeed without evidence.
- Keep React/Vite/TypeScript/Tailwind at staff-web/ in the existing frontend repository and existing FastAPI/PostgreSQL. Only docs change here; no Trello actions.
- Documentation branch/PR target is master in NullCorvus/finance-ai. Existing code repositories retain develop.

See [Administrator policy](administrator-role.md) and [shared security contracts](shared-security-requirements.md). Technical design must select bounded lifetimes, recovery verification, storage/browser protection and persistence/concurrency mechanisms; no new user decision blocking the approved functional scope was identified.

## Archived question sheet — superseded where contradictory
The original sheet is preserved for traceability. It is historical evidence only, not the current requirements or a request to revisit finalized choices.

<details>
<summary>Original access-model questions</summary>

# Access Model Clarification Questions

The backend currently defines `user` and `admin` roles; public registration assigns `user`. No support role or subscription-entitlement model was found in the inspected source. The questions below clarify the intended design before it is added to the project requirements.

## Four-role direction

The user has confirmed that the product needs at least four explicit roles. The recommended baseline is:

- `free_user` — manual finance features.
- `premium_user` — Free features plus the AI and other premium features that the product explicitly includes.
- `support_agent` — handles support requests with limited, ticket-scoped access.
- `admin` — manages system configuration and user accounts, without routine access to individual financial records.

Subscription status (for example, `active`, `past_due`, `cancelled`, or `expired`) should be recorded separately as billing state. The server can grant or revoke the `premium_user` role when verified subscription state changes. This preserves the four-role requirement without making an expired payment look active. Public registration must never grant staff roles.

The four-role baseline is accepted; the remaining questions clarify role assignment, support, permissions, entitlements, and subscription behavior.

The screenshot also suggests a possible fifth role, `security_auditor`. It would be read-only and limited to access logs, security events, and privileged administrative actions. It would not grant access to users' financial records or permission to change system configuration.

## Question 1
Should each account have exactly one of the four roles at a time?

A) Yes — customer accounts use `free_user` or `premium_user`; staff accounts use `support_agent` or `admin`

B) No — an account may combine roles, for example `premium_user` and `support_agent`

C) Other (please describe after the [Answer]: tag below)

[Answer]: 

## Question 2
How should support work?

A) AI helps draft or answer routine questions; a human support agent verifies uncertain or sensitive answers and escalates system issues to an admin

B) AI provides self-service answers; a human agent is available only when the user requests escalation

C) Human support only; AI is not part of the support flow

D) Other (please describe after the [Answer]: tag below)

[Answer]: 

## Question 3
What information may Support and its AI assistant access?

A) Only the user's support message and diagnostic metadata; the user must explicitly share any financial details

B) A human agent may inspect a specific user record only after explicit user consent, with access logged; the AI assistant receives only user-shared details

C) Support may view the user's full financial data to investigate issues

D) Other (please describe after the [Answer]: tag below)

[Answer]: 

## Question 4
What should Admin be allowed to access?

A) Manage configuration and account status, plus aggregated system metrics; no individual financial records by default

B) Everything in A, with exceptional individual-record access only through a separate, time-limited and audited approval

C) Full access to all users' financial records as a normal admin capability

D) Other (please describe after the [Answer]: tag below)

[Answer]: 

## Question 5
Which features should a paid plan unlock?

A) AI-assisted text, voice-to-text capture, and receipt-photo capture; manual finance features remain free

B) All AI-assisted capture plus named premium features such as advanced reports or budgets, which must be listed explicitly

C) Decide the plan after the core access roles are documented

D) Other (please describe after the [Answer]: tag below)

[Answer]: 

## Question 6
What should happen when a subscription expires or is cancelled?

A) At the paid-through date, revert the account to Free, retain all financial data, and disable only premium entitlements

B) Apply a defined grace period, then revert to Free while retaining all financial data

C) Suspend the whole account until payment resumes

D) Other (please describe after the [Answer]: tag below)

[Answer]: 

## Question 7
How should staff accounts and privileged-role changes be handled?

A) Staff accounts are provisioned by an existing admin; users cannot self-select staff roles, and admin access requires MFA

B) Users may request a staff role, but an admin must approve it; admin access requires MFA

C) Public sign-up may select Support or Admin

D) Other (please describe after the [Answer]: tag below)

[Answer]: 

## Question 8
Should `security_auditor` be a separate fifth staff role?

A) Yes — add it as a read-only role for security events and administrative audit records

B) Keep it as a future role; Admin handles security review for the first release

C) Do not define a separate role; include those review permissions in Admin

D) Other (please describe after the [Answer]: tag below)

[Answer]: 

</details>
