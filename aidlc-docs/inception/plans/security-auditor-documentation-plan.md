# Security Auditor documentation execution plan

## Approved intent and scope
The final supplied corrections explicitly authorize the previously reviewed documentation task. Record exactly AUD-01–AUD-04, with 5/5/5/8 provisional points, and extend shared SEC-01/SEC-02 without adding stories or restarting general discovery. The 90-day query period and 2,000-event PDF limit are proposed configurable MVP backend-policy defaults, not immutable limits or retention settings.

Only documentation in NullCorvus/finance-ai changes. Start from master 6f1d133418bef20c4623dbe779db82d0c45f6f66 on codex/security-auditor-docs-20261107, with a master-targeted PR. No code, migrations, components, PDF generation, infrastructure, Trello action or merge. Keep the frontend/backend develop workflow.

## Adaptive workflow and story assessment
Brownfield product: existing Flutter/FastAPI/PostgreSQL and opaque sessions, with published staff-web architecture and Admin/Support/security requirements. Existing architecture/stack/code guides sufficiently describe the boundaries for this documentation-only change; reuse them rather than reverse-engineering implementation again. Main user checkout has unrelated audit edits and remains untouched.

Requirements/stories need substantive documentation because the read-only Auditor has four user-facing workflows spanning shared security, backend queries and a web interface. Reuse the canonical backlog as the story artifact (no duplicate stories.md) and put the Auditor persona/traceability in its role specification (no duplicate personas.md). The user already approved the feature-based four-story breakdown and final refinements; no new approval/question gate is needed. This plan covers assessment, requirements, story generation and workflow planning. Application design, units generation, Construction, build/test and Operations are skipped: no executable artifacts are authorized.

Text workflow: inspect approved inputs and master; record requirements/stories and shared contracts; reconcile references; validate; publish a documentation PR. No diagram is needed.

## Execution checklist
- [x] Inspect original and final inputs, repository state, canonical Admin/Support/security requirements and architecture.
- [x] Load workflow rule details and inherited extensions; isolate a master-based documentation worktree and preserve local changes.
- [x] Record complete raw task inputs and approved scope in the append-only audit.
- [x] Add exactly four canonical AUD stories with complete criteria, dependencies, 23 provisional SP and Not started status.
- [x] Document the read-only Auditor persona, permission boundaries, workflow, code locations and implementation handoff.
- [x] Extend shared MFA to admin/security_auditor and SEC-02 to historical identity/export contracts without duplicate infrastructure or estimates.
- [x] Reconcile existing Admin/Support, decisions, architecture, stack and team guide references.
- [x] Validate Markdown/links, inventory, estimates, preserved stories, final corrections and documentation-only scope.
- [ ] Publish the branch and open/verify a PR against master; record delivery without merging.

## Validation and extension scope
Verify four AUD records and all required fields; retain 30 prior story IDs/estimates and the original HU/SUP/USR-SUP/ADM definitions. Only SEC-01/SEC-02 contracts change as approved. Validate active-role/MFA gating, historical identity independence and deduplication, UTC/Bogota inclusive-start/exclusive-end filtering, stable order, complete-dataset backend aggregates, one PDF snapshot, no silent truncation and export-audit failure safety. No application tests or runtime compliance claims.

Security Baseline stays enabled; per-rule documentation coverage is recorded in the shared security specification. Partial PBT is inherited: executable function/serializer/test rules are N/A to Markdown-only artifacts. Full Resiliency Baseline is disabled and skipped. Do not reopen extension opt-ins.
