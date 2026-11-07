# Support Agent documentation plan

## Authorization and scope
The 2026-11-04 user correction authorizes documentation-only changes for the existing six Support Agent stories and two customer dependencies. It supersedes the earlier proposed fourth repository and plan-as-role model. No application scaffolding, migrations, Trello changes, merge, or deployment is authorized.

## Execution checklist
- [x] Inspect supplied stories, corrected decisions, existing backlog, stack, architecture, Git boundaries and source patterns.
- [x] Isolate the documentation work from unrelated local changes on `codex/support-agent-backlog`.
- [x] Update the authoritative backlog, preserving the original HU records.
- [x] Document Support Agent permissions, workflow, dependencies and pending decisions.
- [x] Reconcile previous role questions without deleting their historical wording.
- [x] Update architecture, stack and a portable team reading guide.
- [x] Record the task in state and append-only audit history.
- [x] Validate story inventory, acceptance criteria, scope, links, history preservation and Git diff.
- [x] Prepare local review evidence and report the publication boundary.

## Adaptive workflow
Workspace detection and focused source review are complete. Existing architecture and code guides are sufficient for this documentation update; no whole-system reverse engineering is repeated. Requirements and story documentation reuse the user's approved scope. This single plan covers documentation execution and the role-owner handoff; the historical execution-plan.md is preserved.

Text workflow: inspect sources; document confirmed scope and pending decisions; reconcile shared references; validate; prepare local review. Application design details, units generation, code generation, application builds, migrations and Operations are outside this documentation-only task. No implementation stage is marked complete.

## Contribution boundary
The documentation repository uses `master`; the earlier 2026-11-04 local-only checkpoint was waiting for its publication target. The user explicitly authorized publishing this documentation to master on 2026-11-07. Integrate the original `codex/support-agent-backlog` work from `16b3361` with current master `5ce25d6` on the isolated `codex/support-agent-publish-20261107` branch, preserving both histories and submitting a documentation PR. Merge after relevant checks, then verify the remote files. This authorization changes only the publication boundary: no application implementation, branch-rule change or other repository update is included. The original worktree and the user's `docs/presentation-fusagasuga` checkout remain intact.

## Role-owner handoff
Use one parent work item, [Support Agent — ticket management MVP](https://trello.com/c/rCyuWwMB), with one accountable role owner and six story checklist subtasks referencing SUP-01 through SUP-06 in the authoritative backlog. The parent rolls up child points; it has no additional story points. The user authorized creation on 2026-11-04; the open card is in Backlog with a separate customer-dependency checklist. The shared-foundation checklist was subsequently removed at the user's request. If independently tracked child cards become necessary, agree that expansion separately. A role owner is not yet assigned.

Link USR-SUP-01 and USR-SUP-02 to the customer-role owner. Keep staff portal scaffolding, staff authentication/RBAC, ticket persistence foundation and audit integration as explicitly owned shared technical prerequisites, estimated once separately. No agent is delegated or implementation started by this document.

A minimal future agent task contains:
- Story ID and the authoritative acceptance-criteria link.
- Approved dependencies, API contract and pending decisions that must be resolved first.
- Allowed repository, branch and file/module boundaries.
- Required implementation, authorization/validation checks and relevant tests.
- Evidence required for review: changed files, test results and unresolved limitations.

Implement the shared foundations first. Deliver ticket queue/claim and limited lookup/profile, then ticket creation and messaging, then escalation and resolution/history, subject to finalized workflow rules. Audit/history event capture must start with ticket creation and mutation, even though history presentation is accepted under SUP-06. Coordinate Flutter work with the customer owner and agree the Admin escalation handoff before completing SUP-05. Future PRs stay separate per existing code repository and reference the same story IDs.

## Verification and extension applicability
The documentation review checks exact story IDs, preserved historical records, provisional point totals, denied operations, customer ownership, pending transitions, explicit exclusions, planned-vs-implemented labels and portable links. No application tests are required because no application code changes.

Security Baseline is enabled: applicable requirements are carried in the role specification; infrastructure and deployment verification are N/A for this documentation patch. Partial Property-Based Testing remains configured but its test-generation rules are N/A because no executable functions or serializers are changed. Resiliency Baseline is disabled and skipped. Audit history is appended, never rewritten.

## Follow-up — refresh original backlog statuses (2026-11-04)
The user requested checking Trello because completed original features still appeared in progress/not started in the document. This authorizes refreshing those documentation statuses; no application changes or board mutation is necessary.
- [x] Read the active board, all six lists, all open/archived cards and the 15 matching complete story cards; inspect full checklists with no remaining pagination.
- [x] Remove only the exact accidental pasted backlog insertion, preserving a local backup of the pre-edit file.
- [x] Refresh PB-001–PB-011 and all 15 original story statuses using direct card evidence; preserve their story definitions, acceptance criteria and points.
- [x] Keep Support Agent implementation statuses unchanged; record board bookkeeping discrepancies without importing old architecture assumptions.
- [x] Validate inventory, scope, Markdown, links and whitespace; append audit/state and prepare a local review commit.

## Follow-up — create Support Agent Trello card (2026-11-04)
The user's explicit "create it" authorizes creating the previously proposed parent card and six story checklist subtasks. This supersedes the earlier no-Trello-change boundary for this action only. Implementation and repository publication remain separate.
- [x] Refresh board/list/card context and confirm there is no existing Support Agent parent card.
- [x] Prepare a self-contained description from the six canonical stories, provisional points, customer dependencies and code/permission boundaries; flag unpublished repository docs honestly.
- [x] Create one open parent card in Backlog with six ordered story subtasks and separate dependency/foundation checklists.
- [x] Read back the card and full checklists; verify IDs, points, order and incomplete implementation state.
- [x] Record the created card link, update local traceability and prepare the local review commit.

## Follow-up — simplify the card and clarify the web interface (2026-11-04)
- [x] Remove the user-selected Shared prerequisites checklist and its four items from the card; retain six role-story items and two customer dependencies.
- [x] Remove the duplicate prerequisite section from the card description and explicitly identify the web staff portal and React/Vite/TypeScript/Tailwind stack at the top.
- [x] Verify the remaining two checklists, unchanged implementation state and existing FastAPI/PostgreSQL integration; record the correction in local traceability.

## Publication to master — 2026-11-07
The user explicitly requested moving the documentation into master; no further merge approval is required for this scoped publication.
- [x] Refresh remote master and preserve the user's active checkout and original Support Agent branch.
- [x] Merge both documentation histories and resolve audit/state/question-sheet conflicts without losing existing master entries or the archived role questions.
- [x] Validate the merged documentation, role/story inventory, current master preservation and publication diff.
- [x] Publish the documentation PR, integrate into master and verify remote file contents.
- [x] Update the Trello card to link the published team context and record the publication outcome.
