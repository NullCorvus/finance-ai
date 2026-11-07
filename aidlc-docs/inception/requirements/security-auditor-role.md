# Security Auditor role requirements

**Role:** security_auditor

**Interface:** WEB staff portal — React + Vite + TypeScript + Tailwind CSS.

**Decision date:** 2026-11-07

**Status:** Approved requirements; application implementation Not started.

## Intent, persona and canonical stories
The independent Security Auditor reviews recorded security activity, reconstructs historical actions, reads deterministic summaries and exports factual PDF reports. This person needs trustworthy recorded evidence and consistent query scope, without account administration, ticket handling or private financial data. An account has exactly one primary authorization role: user, support_agent, admin or security_auditor. Free/Premium are subscription plans.

The [authoritative backlog](../../../docs/BACKLOG-AND-STORIES.md#security-auditor-extension--2026-11-07) owns the four narratives, acceptance criteria, priority, dependencies, estimates and status. This specification defines shared policy and traceability rather than duplicating story definitions.

| ID | Canonical story | Provisional SP | Dependency boundary |
|---|---|---:|---|
| AUD-01 | [View and Filter Security Events](../../../docs/BACKLOG-AND-STORIES.md#aud-01--view-and-filter-security-events) | 5 | Shared MFA/event store, portal and authorized list/detail/query contract |
| AUD-02 | [Investigate Account and Administrator Activity](../../../docs/BACKLOG-AND-STORIES.md#aud-02--investigate-account-and-administrator-activity) | 5 | AUD-01 and historical actor/target/correlation evidence |
| AUD-03 | [View Security Activity Summary](../../../docs/BACKLOG-AND-STORIES.md#aud-03--view-security-activity-summary) | 5 | AUD-01 plus backend aggregate contract |
| AUD-04 | [Generate and Export Security Audit Reports](../../../docs/BACKLOG-AND-STORIES.md#aud-04--generate-and-export-security-audit-reports) | 8 | AUD-01/AUD-03 plus consistent snapshot and SEC-02 export recording |
| Total | Exactly four Auditor stories | 23 | No duplicated SEC-01/SEC-02 or portal estimate |

## Permission and session boundary
An active, MFA-verified security_auditor is explicitly authorized to read all system security audit events through sanitized FastAPI responses. The same scope and field allowlist apply to list/detail, historical investigation, aggregates and PDF generation/delivery. This grants no direct database access or arbitrary raw-context/identity-table access.

FastAPI checks authentication, current active status, current role, MFA assurance and requested resource on every operation; role-aware routes/hidden controls are only presentation. Suspension and removal of security_auditor immediately deny access through previously issued sessions, including subsequent report delivery. Existing sessions cannot gain privileged authority after an assignment without completing MFA. Admin/Support do not inherit the Auditor reader permission.

The Auditor cannot create/suspend/reactivate accounts, change roles, invoke administrative operations, manage tickets, inspect financial transactions/balances/receipts, read credentials/MFA secrets or modify configuration. ADM-01 is not granted. No audit update/delete API is exposed. The shared backend writer emits required events on the Auditor's behalf; this is compatible with read-only access to existing records.

Staff identity activation uses ADM-03 and role assignment uses ADM-04. security_auditor must then complete shared SEC-01 TOTP before privileged access. The existing controlled backend-only admin provisioning and last-active-admin safeguards are unchanged; no fifth role, admin-grant interface or approval quorum.

## Query, dates and historical evidence
- Store timestamps in UTC. Default display/reporting zone is America/Bogota, explicitly labeled. Normalize period inputs to inclusive start/exclusive end; a UI end date covering a full day maps to the following midnight as exclusive end.
- Proposed MVP maximum query period: 90 days, configurable by backend policy after UTC normalization, consistently across AUD-01–AUD-04. This bounds a single request; it does not define retention or erase older evidence.
- Validate dates, IDs, enum filters and pagination sizes; combine selected filters and bind values through parameterized queries. Apply safe output encoding and bounded request/rate/resource limits.
- Event lists are newest first; investigation/report timelines are oldest first. Use timestamp plus unique event ID for stable ties. Technical design specifies pagination/read boundaries and indexes without inventing a new user story.
- Historical account investigation matches actor OR typed affected-account target, deduplicated by event ID. Do not require a current identity-table match or active account. Preserve historical identifiers under SEC-02 independently of mutable/deletable account rows.
- Use only recorded timestamps, identifiers and available correlation metadata. Missing actors/targets/correlation are explicitly unavailable. Do not infer an unrecorded action, claim a complete lifetime history beyond retained/available data or turn a correlation match into proof of causation.
- Empty results are valid; query errors and unavailable historical coverage are not zero activity. No account-directory permission follows from identifier-based evidence search.

## Summary and metric semantics
Backend aggregation covers the complete authorized filtered dataset, independently of browser pagination. Use auth.login_success, auth.login_failed, auth.mfa_failed and access.denied for their named counts; suspension/role-change counts include successful account.suspended/role.changed outcomes. Document type/outcome mappings and bucket dates in the labeled reporting zone.

For admin and security_auditor, auth.login_success means password and MFA completed. auth.mfa_success is not another login. Failed login and failed-factor counts are different event measures, not distinct people/attacks. Distribution/timeline charts carry readable counts/labels and no threat classification.

Summary-to-list navigation preserves period, type/outcome and applicable filters. Show the summary cutoff; a later live event list can contain new records and is not falsely represented as the same frozen snapshot. AUD-04 separately requires one database snapshot for its whole report.

## PDF contract and failure safety
The report includes cover/period; executive summary; security statistics; distribution/timeline charts; chronological event table; deterministic factual observations; and metadata (report ID, period, sanitized filters, generation timestamp/time zone, actual included-event count and dataset cutoff). Summary/observations use documented rules, with no AI conclusions, free-form investigation editor or invented findings. Zero-event reports state zero accurately without fake charts.

Statistics, charts and every event row derive from one consistent database snapshot and one authorized filter set. Include all matching events in that snapshot, within the configured limit, not just a browser page. Proposed MVP maximum: 2,000 event records per PDF, configurable by backend policy. Reject selections above the configured maximum with an actionable narrower-filter message. Never silently truncate, hide partial scope or present a partial report as complete.

Apply the backend security-field allowlist to PDF rendering, including nested context. No private finances/receipts, passwords/hashes, session/activation credentials, MFA secrets/codes, sensitive bodies or secret download URLs. Render event/filter text safely. Protect any temporary output and clean up failure paths; no permanent report repository, storage provider or new infrastructure is mandated.

Successful export means the backend generated an authorized PDF and prepared it for delivery, not proof that a person opened/downloaded it. SEC-02 must durably record audit.report_exported before the PDF is exposed/delivered as successful. Include acting Auditor ID, UTC time, outcome, report ID, period, sanitized filters and included-event count; exclude the document contents and secrets.

If mandatory audit recording fails, block delivery and return a safe actionable failure; never silently release an unrecorded successful export. Generation errors cannot produce partial downloads or success evidence. Design protected cleanup and retry/idempotency so a retry cannot bypass auditing or create ambiguous duplicate-success records. Failed attempts may record a sanitized failure outcome when the audit store is available; safe diagnostics must not claim a successful export when it was blocked.

The export event is written after the report's data snapshot and is not inserted into its own statistics/table. It can be read by later reports. Authorization is rechecked when serving an artifact; possession of a report ID or URL alone never authorizes access.

## Planned repository structure
Keep the existing three repositories, shared FastAPI backend/PostgreSQL and opaque sessions. These paths are proposed implementation locations, not generated directories.

| Repository | Location | Responsibility |
|---|---|---|
| NullCorvus/finance-ai | docs/BACKLOG-AND-STORIES.md and aidlc-docs/ | Canonical stories, role/shared contracts, workflow history |
| Maicol2363/finance-ai-frontend | staff-web/src/features/audit/ | AUD list/details, investigation, summary and export UI |
| Same frontend | staff-web/src/features/auth/, src/app/, src/shared/ | Shared staff TOTP/session, shell, API utilities and common presentation |
| Same frontend | Existing Flutter lib/ and web/ | Customer app; no Auditor UI or React app inside the Flutter web runner |
| Maicol2363/finance-ai-backend | Proposed src/finance_ai/audit/ | Shared SEC-02 event writer/persistence contracts plus separately authorized AUD query/aggregate/report services |
| Same backend | Existing auth/, db/models/, db/repositories/, UoW/migrations/tests conventions | Shared MFA/current-role sessions and later persistence/query/test adapters |

Only the backend accesses PostgreSQL; no browser database connection. Reuse the same audit module/store rather than another logging system, new backend/database or fourth repository. Select concrete PDF/chart libraries and package versions during implementation design, not in this documentation task.

## Ownership, estimates and implementation evidence
One Auditor role owner coordinates frontend/backend delivery with the shared security and staff portal owners. SEC-01 remains 13 provisional SP: the same enrollment, verification, replay, recovery/replacement and browser-session lifecycle serves both privileged roles. Only role consumers/guards and test coverage expand; no material new subsystem is identified. Reevaluate only if design demonstrates material additional complexity. SEC-02 remains 8 shared SP, counted once, including the approved historical-ID/export event contracts. Portal scaffolding is also not counted again.

A minimal implementation-agent task names one existing AUD ID, canonical acceptance criteria, approved contracts/dependencies, allowed files and relevant tests/review evidence. Verify permitted/denied role/session access; historical missing identities and actor/target deduplication; date bounds/stable pagination; complete-dataset aggregates and login/MFA mapping; report snapshot/threshold/layout/privacy; and mandatory export-audit failure behavior. No test or deployed control is claimed here.

Technical design owns physical schema/retention preservation strategy, cursor/read-boundary/index/query plans, snapshot transaction mechanism, exact input/rate/resource bounds, MFA/browser-session details, PDF/chart library/layout, protected artifact delivery/cleanup and export retry/audit consistency. Security Baseline applies; partial PBT constraints apply to future relevant pure functions/serializers. Full Resiliency Baseline is disabled. See the [shared security coverage](shared-security-requirements.md#security-baseline-coverage) and [execution plan](../plans/security-auditor-documentation-plan.md).

## Exclusions and remaining dependencies
No automatic attack detection, AI threat classification/conclusions, investigation case management, narrative editor, security evidence mutation, account administration, ticket conversation access, billing/subscriptions, cloud/system configuration or advanced predictive analytics. Preserve Admin/Support permission boundaries and the separation of ticket history from security logs. Basic read-only counts/charts/PDFs are explicitly within these four AUD stories, separate from earlier tasks that deferred Auditor UI.

Implementation depends on shared SEC-01/SEC-02, current-role/activation/session enforcement, staff-web foundations and the approved event/query/export contracts. Those planned capabilities are not verified as implemented. No remaining functional decision prevents documenting the approved four-story scope; the implementation mechanisms above are normal technical design work, not a new general review gate.
