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
