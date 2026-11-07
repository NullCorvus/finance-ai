# FinanciAI team documentation

Start here to understand the product and this role. These are ordinary Markdown files: teammates do not need a local AI-DLC installation, a particular editor or the author's checkout path to read them.

## Reading order
1. [Project context](../docs/CONTEXT.md): academic context and distinction between historical plans and implementation.
2. [Technology stack](../docs/STACK.md): existing Flutter/FastAPI/PostgreSQL/session architecture and planned React staff application.
3. [Architecture](../docs/ARCHITECTURE.md) and [code/layers guide](../docs/guides/code-architecture-guide.md): module responsibilities and request flow.
4. [Authoritative backlog](../docs/BACKLOG-AND-STORIES.md#support-agent-extension--2026-11-04): six Support Agent stories and two customer dependencies, acceptance criteria and provisional points.
5. [Support Agent requirements](inception/requirements/support-agent-role.md): permissions, workflow, code boundaries and pending decisions.
6. [Administrator requirements](inception/requirements/administrator-role.md) and [shared security contracts](inception/requirements/shared-security-requirements.md): five ADM stories, two shared SEC stories, MFA/provisioning restrictions and the approved escalation return/visibility rules.
7. [Support documentation plan and role-owner handoff](inception/plans/support-agent-documentation-plan.md), plus [Administrator/security execution plan](inception/plans/admin-security-documentation-plan.md): ownership, shared prerequisites, task boundaries and contribution status.
8. [Security Auditor requirements](inception/requirements/security-auditor-role.md) and [four Auditor stories](../docs/BACKLOG-AND-STORIES.md#security-auditor-extension--2026-11-07): all-system sanitized read scope, shared TOTP, historical investigation, deterministic summaries and bounded/audited PDF export; [Auditor execution plan](inception/plans/security-auditor-documentation-plan.md).
9. [Corrected requirements decisions](inception/requirements/requirement-verification-questions.md): final functional decisions plus clearly archived earlier questions.

The backlog owns story definitions. Role specifications own their policy boundaries; shared security requirements define SEC-01/SEC-02 once for all consumers. Architecture/stack own the shared technical map. The AI-DLC state and audit files are process history, not a substitute for acceptance criteria or proof of deployed functionality.

## Three repositories, portable paths
| Repository | What a teammate gets |
|---|---|
| [NullCorvus/finance-ai](https://github.com/NullCorvus/finance-ai) | Product documentation, backlog, shared requirements and tracked workflow files |
| [Maicol2363/finance-ai-frontend](https://github.com/Maicol2363/finance-ai-frontend) | Existing Flutter application; planned React portal in staff-web/ inside this repository |
| [Maicol2363/finance-ai-backend](https://github.com/Maicol2363/finance-ai-backend) | Existing FastAPI application, PostgreSQL models/migrations, session implementation and tests |

Clone the documentation repository as well as the code repository relevant to the assigned role. The code repositories are independent Git repositories, not submodules delivered by cloning the documentation repo. They can be adjacent folders or placed elsewhere. Paths in product requirements are relative to the named repository; local absolute paths in older process history are historical examples.

For staff roles, read both backend and frontend context: the web UI is React + Vite + TypeScript + Tailwind CSS, the customer support UI is existing Flutter at Settings → Help & Support, and both use the same FastAPI/PostgreSQL backend. Administrator screens are planned under staff-web/src/features/admin/; shared authentication is under features/auth/, and features/audit/ contains the planned AUD-01–AUD-04 interface. Admin and Auditor share SEC-01 TOTP; SEC-02 supplies the common event store/export evidence. The portal and new security capabilities are planned; no implementation directories are part of this documentation change.

## Shared files versus local setup
AI-DLC names do not make files private. Git tracking and repository access control determine what collaborators can receive.

| Path in the documentation repository | Current Git boundary | Purpose |
|---|---|---|
| docs/ | Tracked product documents | Shared context, architecture, stack and authoritative backlog |
| aidlc-docs/ | Shared process/requirements directory; individual new files must be explicitly added | Role requirements, plans, state and audit history |
| AGENTS.md | Tracked | Repository instructions for agents |
| .aidlc-rule-details/ | Tracked | Versioned workflow rules |
| .aidlc/ | Ignored by .gitignore | Local downloaded setup, not delivered by a normal clone |
| finance-ai-backend/ and finance-ai-frontend/ | Ignored in this repository | Independent code repositories |
| logs/ and run.sh | Ignored | Local execution artifacts |

A new or modified local file is not automatically uploaded. Only selected files included in a commit and pushed to a remote branch become available there; the target branch changes only after integration. A PR branch may contain the documents before they are merged into the branch teammates normally pull. Publication of this Support Agent documentation to master was explicitly authorized on 2026-11-07; consult the publication checkpoint in aidlc-state.md and the repository's merged PR history for the outcome.

Share product requirements, stack, architecture and the versioned workflow files already used by the project. Teammates can read the Markdown without configuring the tooling; agents operating in the repository must still follow AGENTS.md. Keep credentials, .env files, local account/session configuration, private customer material and machine-specific logs outside published commits. Audit logs can contain raw prompts and local paths: inspect new entries before staging; this task does not change the repository's existing audit policy or rewrite old logs.

## Minimal role handoff
Give the role owner the reading links above and the applicable canonical story IDs: six SUP plus customer dependencies, five ADM, or four AUD. Identify shared SEC-01/SEC-02 and portal owners once; do not duplicate their estimates for every role. A future agent needs one story, approved dependencies/contracts, allowed code locations and required verification evidence. No broad copy of a private chat is needed to understand the role specification.

Use develop-based branches/PRs in the existing code repositories. The documentation repository uses master; the user explicitly selected master as the documentation publication target on 2026-11-07. The Support Agent changes are integrated through a documentation PR while preserving the current master content. No fourth repository or new remote develop branch is created.
