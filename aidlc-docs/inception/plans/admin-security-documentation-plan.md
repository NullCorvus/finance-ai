# Administrator and shared security documentation plan

## Approved scope and authorization
The 2026-11-07 execution request approves the supplied complete Administrator task with five final functional corrections. Maintain exactly ADM-01–ADM-05 and SEC-01–SEC-02. The role model, ticket return rules, workflow metadata visibility, administrator suspension protections, activation event and master PR target are settled; no renewed discovery or approval gate is required for these documentation edits.

Only NullCorvus/finance-ai documentation is changed. No application code, migrations, frontend scaffolding, infrastructure, Trello changes or messages are authorized. Open a PR against master; do not merge it under this task. Keep frontend/backend develop workflows unchanged.

## Workspace and adaptive workflow
- Brownfield project: existing Flutter frontend and modular FastAPI/PostgreSQL backend, with published Support Agent requirements.
- Source branch starts at master 616bec3df2b07f517ba579ccf9cc89220df93888 in an isolated worktree on codex/admin-security-docs-20261107. The original presentation checkout stays intact.
- Existing architecture, stack and code guides provide sufficient reverse-engineering context; reuse them.
- Requirements and story documentation add value because several role owners share MFA, audit and escalation contracts. Reuse the authoritative backlog format; this one plan includes the story assessment and execution tracking.
- Technical design, code generation, migrations, application builds/tests and Operations are outside this documentation-only task. No implementation stage is marked complete.
- Text workflow: inspect approved inputs and existing documentation; write canonical stories and policy specifications; reconcile Support references; validate; publish a documentation branch and open a master PR.

## Execution checklist
- [x] Inspect the approved task, final corrections, existing requirements/backlog, repository boundaries and relevant local source evidence.
- [x] Resolve the rule directory and extension settings; preserve the four-role model and approved scope.
- [x] Create an isolated documentation branch from current master.
- [x] Append raw task inputs and execution authorization to the existing audit.
- [x] Add exactly five ADM and two SEC stories with complete criteria, dependencies, provisional estimates and Not started status.
- [x] Write Administrator and shared security specifications referencing the canonical stories.
- [x] Reconcile only the Support escalation, return, visibility and suspended-customer rules affected by the approved decisions.
- [x] Update requirements decisions, architecture, stack, team reading guide and workflow state.
- [x] Verify inventory, point totals, story preservation, consistency, links, Markdown and documentation-only scope.
- [x] Publish the branch and open a PR against master; verify the PR target and changed files.

## Delivery record
[PR #15](https://github.com/NullCorvus/finance-ai/pull/15) is open from codex/admin-security-docs-20261107 to master. Its eleven changed files are documentation only. The PR is not merged; no code repository, infrastructure or Trello state was modified. All final functional decisions are documented; implementation parameters remain assigned to technical design without a new general review gate.

## Functional decisions carried forward
Return an escalated ticket atomically to the originating active support_agent with in_progress status; otherwise clear assignment and use open in the unassigned queue. A return reason and preserved activity evidence are mandatory. Escalation/return reasons are authorized-staff-only metadata; resolution summaries are customer-visible. There is no general-purpose notes or private-messaging feature.

An MFA-verified administrator may suspend another administrator with confirmation/reason, but never their own account or the last active administrator. Guard all deactivation/equivalent paths and concurrent operations. Sessions remain invalid after reactivation. The portal cannot grant/revoke admin; initial/additional administrators use a controlled backend procedure, without a fifth role or multi-administrator approval system.

SEC-02 records both staff.created and staff.activated without activation credentials. MFA uses existing opaque sessions and requires a verified factor for every ADM operation, including promotion and recovery paths. Shared security stories are estimated once; they do not include an Auditor UI story.

## Implementation handoff
Administrator owner: account metadata/search, suspension, staff invitation/activation, support_agent/security_auditor role changes and escalated-ticket management. Shared security owner: SEC-01/SEC-02 once for all dependent roles. Customer owner: existing USR-SUP dependencies. Support owner: existing six SUP stories with the limited consistency amendments.

Each future implementation task names one existing story ID, approved contracts/dependencies, allowed code boundaries and acceptance/test evidence. Portal foundation and controlled backend admin provisioning are explicit shared technical dependencies, estimated once separately; they are not extra stories in this patch.

## Validation and extension scope
Validate all seven new story records and required fields; retain all 23 previous records/estimates; preserve the 15 original HU definitions. Check atomic ticket return, server-enforced visibility, administrator invariants/concurrency, mandatory activation logging, role/plan separation, exclusions and existing source-vs-plan distinctions.

Security Baseline is enabled and its documentation coverage is evaluated in shared-security-requirements.md. Partial PBT is retained but executable test rules are N/A because no functions, serializers or tests change. Full Resiliency Baseline is disabled and skipped. No diagram is added; portable tables and text describe the workflow. Audit edits are append-only.

## Authorized follow-up — Administrator Trello card
The user's subsequent explicit request authorizes one Administrator parent card on the active Finance AI board, following the Support Agent structure. This supersedes only the earlier no-Trello boundary for this follow-up. PR #15 was independently merged before this follow-up. Use its published master documents; publish tracking on a fresh documentation branch from master. No merge, code or other-card changes are authorized.

- [x] Confirm the active board, inspect all lists/cards and check for an existing Administrator card.
- [x] Create one Backlog card with web stack, repository boundaries, approved criteria and published master/merged PR references.
- [x] Add five ordered ADM subtasks (21 provisional SP) and two separate shared SEC subtasks (21 provisional SP, counted once).
- [x] Read back the full card/checklists and verify status, content, ordering and estimates.
- [ ] Add tracking references, validate documentation and publish the follow-up on the existing PR branch.

**Follow-up card:** [Administrator — account and escalation management MVP](https://trello.com/c/BrAHthwr), verified open/incomplete in Backlog, with exactly two ordered checklists (five ADM and two shared SEC items). All criteria match the canonical backlog. PR #15 merged as 6f1d133 before this follow-up; card links were corrected to master after live verification. Tracking branch: codex/admin-trello-tracking-20261107, based on that master commit. No prerequisite checklist, owner/deadline, other-card edits or code changes.
