# Access Model Decisions and Remaining Questions

## Current Support Agent decisions — 2026-11-04
The latest supplied correction supersedes contradictory statements in the archived question sheet below. The shared authorization identifiers are `user`, `support_agent`, `admin` and `security_auditor`; initial accounts have one primary role. The inspected backend currently seeds only `user` and `admin`. This task documents Support Agent only; detailed Admin and Security Auditor backlogs are separate.

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
| 4 — Admin access | Outside this role's detailed design; Support Agent remains prohibited from administrative actions |
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

[Answer]: Pending

### Question SUP-Q4
What is the policy after resolution?

A) The customer must create a new linked request; resolved cases accept no replies

B) The owning customer can reopen the same case under explicitly defined status and assignment rules

C) Other (please describe after [Answer]:)

[Answer]: Pending

Creation status/assignment, other allowed transitions, lookup keys/disclosure, input bounds/categories, reply/resolution eligibility, internal-history visibility and shared session/audit contracts are also pending as listed in the [role requirements](support-agent-role.md#pending-decisions). None changes the confirmed role or technology scope.

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
