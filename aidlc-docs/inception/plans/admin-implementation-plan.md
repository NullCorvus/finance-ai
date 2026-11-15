# Administrator + shared security — implementation plan

**Role:** `admin` · **Surface:** staff-web (React + Vite + TS + Tailwind) + FastAPI/PostgreSQL
**Stories:** ADM-01..05 (21 provisional SP) + shared SEC-01/SEC-02 (21 SP, counted once)
**Tracker:** Trello card "Administrator — account and escalation management MVP" (Backlog)
**Plan date:** 2026-11-15 · **Status:** executed on feature branches the same day (in review, not merged); see [Execution outcome](#execution-outcome)
**Canonical criteria:** the Trello card text and `docs/BACKLOG-AND-STORIES.md` (merged PR #15). This plan never redefines them; it only says how to build them.

---

## 1. What exists today (verified by reading the repos on 2026-11-15)

| Area | State |
|---|---|
| Roles | `user, support_agent, admin, security_auditor` seeded (`db/seeds.py`, migration 0018). `app_user.role_id` is a single FK, so one primary role holds. |
| Suspension primitive | `app_user.is_active` (bool). No history, no reason, no actor. |
| Invitations | `staff_invitation` table (hashed token, expiry, `consumed_at`, `activated_user_id`, CHECK constraints). **No service or endpoint yet.** |
| TOTP | `admin_totp_factor` table (`secret_ciphertext`, `state`, `last_accepted_time_step`). `user_session.mfa_verified_at` column exists. |
| Audit | `security_audit_event` + trigger `security_audit_event_append_only` (blocks UPDATE/DELETE per row). `SecurityAuditWriter` with event and context allowlists. |
| Support | `support/` module (router `/staff/support/tickets`, `TicketWorkflow`, `SupportRepository`). Tickets have `originating_support_agent_id`; `escalate` keeps `assigned_staff_user_id` on the originating agent. `support_ticket_activity.internal_reason` holds staff-only reasons. |
| Staff browser auth | `staff_auth/` (cookie sessions, `staff_browser` platform, 15 min access / 30 min idle / 8 h absolute). `StaffSessionService` still hardcodes `support_agent` on `develop`. |
| staff-web | Shell, sign-in, support workspace. `features/admin/AdminWorkspacePage.tsx` is a placeholder. |
| Docs | `administrator-role.md`, `shared-security-requirements.md` on `NullCorvus/finance-ai` master. |

### Critical overlap: the Security Auditor branch
`feat/security-auditor-aud` exists on **both** backend and frontend and is **not merged to develop** (backend +12k lines). It already delivers most of SEC-01 and part of SEC-02:

- `staff_auth/mfa.py`: AES-256-GCM secret protection bound to the account, TOTP with 1-step skew, QR SVG enrollment, replay-safe verification.
- Migration `0019_staff_mfa_challenge` (challenge table with attempt counter).
- `core/roles.py` (`STAFF_PORTAL_ROLES`, `MFA_REQUIRED_ROLES`, `CUSTOMER_API_DENIED_ROLES`) with a comment that admin is deliberately denied until the ADM stories land.
- Extended audit catalog (`auth.login_success`, `auth.mfa_*`, `access.denied`), `RequireStaffRole`, `MfaStep.tsx`.

**Decision taken (2026-11-15): stack on it.** Create the Admin branches from `feat/security-auditor-aud`, reuse its MFA, and retarget the PR to `develop` when the auditor PR merges. This avoids a second migration `0019` and a second MFA implementation.

---

## 2. Branches and workspace safety

Use git worktrees so the dirty working trees (docs is on the presentation branch with uncommitted PDFs; frontend has two modified Windows plugin files) are never touched.

| Repo | New branch | Base | Eventual PR target |
|---|---|---|---|
| `finance-ai-backend` | `feat/admin-adm-sec-backend` | `backend-origin/feat/security-auditor-aud` | `develop` (after auditor merge) |
| `finance-ai-frontend` | `feat/admin-adm-sec-frontend` | `frontend-origin/feat/security-auditor-aud` | `develop` |
| `finance-ai` (docs) | `docs/admin-implementation-20261115` | `origin/master` | `master` |

Rules: commit per slice; no push, PR or Trello write without an explicit go-ahead; never touch the auditor branch itself; rebase onto `develop` as soon as the auditor PR lands.

---

## 3. Design decisions (defaults proposed, change any before execution)

| # | Topic | Default |
|---|---|---|
| D1 | Activation delivery | No email provider is approved. The create-staff response returns the one-time activation URL **once** to the admin for manual handoff. Token is 256-bit random, only its SHA-256 is stored, 48 h expiry, never logged or audited. Email delivery plugs into the separate "Notificaciones" card later. |
| D2 | Admin session | Reuse `staff_browser` cookies and the opaque DB sessions. Tighter lifetimes: 10 min access, 15 min idle, 4 h absolute, all in `Settings`. `mfa_verified_at` set only on TOTP success. |
| D3 | Admin authority source | Not `_activation_is_authoritative` (admins have no invitation). Authority = `app_user.is_active` AND role `admin` AND active TOTP factor AND session `mfa_verified_at IS NOT NULL`, re-checked on **every** request. |
| D4 | Provisioning (shared prerequisite) | `scripts/admin_ops.py create-admin | promote | reset-mfa`. Password read by prompt (never argv or env), reuses the password policy and hasher. A promoted account has no admin powers until MFA is enrolled and every earlier session is revoked on promotion. |
| D5 | MFA recovery / replacement | 10 single-use recovery codes, shown once at enrollment, stored hashed. Replacement needs password + a recovery code, then a new pending factor. Lost device without codes goes through `reset-mfa` run by an operator after out-of-band identity verification. All paths revoke sessions and audit. |
| D6 | Suspension reason | Stored in `account_suspension` (staff-visible, 500 chars max). The audit context carries only a fixed marker, never free text. |
| D7 | Lookup bounds | Exact normalized email or numeric ID only, at most 1 row; hard cap 25 in the repository as defence in depth; 30 lookups/min/admin. |
| D8 | Admin on customer API | `admin` joins `CUSTOMER_API_DENIED_ROLES`. |
| D9 | New staff `preferred_currency` | `COP` (column is NOT NULL). |

---

## 4. Target architecture

### 4.1 Backend (`src/finance_ai/admin/`)
```
admin/
  router.py          # /staff/admin/*  (every route depends on require_admin_principal)
  dependencies.py    # require_admin_principal: current role + active + MFA-verified session
  schemas.py         # strict pydantic models, extra="forbid" (rejects forged role fields)
  policy.py          # transition tables, bounds, confirmation rules
  accounts_service.py  # ADM-01, ADM-02
  staff_service.py     # ADM-03, ADM-04
  tickets_service.py   # ADM-05
  repository.py        # queries + calls to DB routines; never commits
audit/service.py     # extended catalog + per-event context allowlists
staff_auth/          # activation endpoint, admin MFA wiring, recovery
scripts/admin_ops.py # controlled provisioning
migrations/versions/0020_admin_account_management.py
```
Services own the transaction; repositories only stage. Every critical write and its audit event commit together (SEC-02 #15).

### 4.2 Endpoints (prefix `/staff/admin`, all need active admin + MFA-verified session)

| Story | Method + path | Notes |
|---|---|---|
| ADM-01 | `GET /accounts/lookup?email=` or `?id=` | exact match, allowlisted projection, labelled "login account" |
| ADM-01 | `GET /accounts/{id}` | same projection |
| ADM-02 | `POST /accounts/{id}/suspend` `{reason, confirm}` | calls procedure P1 |
| ADM-02 | `POST /accounts/{id}/reactivate` `{confirm}` | calls procedure P1 |
| ADM-03 | `POST /staff/invitations` `{email, role}` | role ∈ {support_agent, security_auditor} |
| ADM-03 | `POST /staff/auth/activate` `{token, password}` | public route, rate-limited, atomic single-use consume |
| ADM-04 | `GET /staff/{id}` | current primary role |
| ADM-04 | `POST /staff/{id}/role` `{role, confirm}` | trigger T2 revokes sessions |
| ADM-05 | `GET /tickets/escalated` | |
| ADM-05 | `POST /tickets/{id}/claim` | conditional UPDATE, one winner |
| ADM-05 | `GET /tickets/{id}/conversation` | admin projection |
| ADM-05 | `POST /tickets/{id}/messages` | customer-visible reply |
| ADM-05 | `POST /tickets/{id}/resolve` `{summary}` | |
| ADM-05 | `POST /tickets/{id}/return` `{reason}` | calls procedure P2 |
| SEC-01 | existing `/staff/auth/mfa/*` + recovery/replacement routes | extended to admin |

After the contract settles: regenerate `openapi.json` (`scripts/export_openapi.py`) and hand it to the frontend.

### 4.3 Permission matrix (deny by default; enforced in backend)

| Operation | user | support_agent | security_auditor | admin (no MFA) | admin (MFA ok) |
|---|---|---|---|---|---|
| Account lookup / detail | ✗ | ✗ (own customer lookup only) | ✗ | ✗ | ✓ bounded |
| Suspend / reactivate | ✗ | ✗ | ✗ | ✗ | ✓ not self, not last admin |
| Create staff | ✗ | ✗ | ✗ | ✗ | ✓ support_agent / security_auditor only |
| Change staff role | ✗ | ✗ | ✗ | ✗ | ✓ not own, not admin, not to/from user |
| Escalated tickets | ✗ | read-only on own escalated | ✗ | ✗ | ✓ claim, reply, resolve, return |
| Read audit events | ✗ | ✗ | ✓ MFA | ✗ | ✗ (no implicit access) |
| Modify audit events | ✗ | ✗ | ✗ | ✗ | ✗ (trigger + DB grants) |

Every denied cell writes an `access.denied` event with a server-derived actor.

### 4.4 Schema changes (migration `0020_admin_account_management`, revises `0019_staff_mfa_challenge`)

- `account_suspension(id, user_id, suspended_by_user_id, reason, suspended_at, reactivated_by_user_id, reactivated_at)`; partial unique index → at most one open suspension per user; CHECK reason not blank.
- `admin_recovery_code(id, user_id, code_hash, created_at, consumed_at)`; single-use.
- `support_ticket.admin_owner_user_id` (nullable FK) + CHECK `admin_owner_user_id IS NULL OR status = 'escalated'`. This is the conflict-free claim slot.
- Two triggers and two procedures (section 5).
- Revoke `UPDATE, DELETE, TRUNCATE` on `security_audit_event` from the runtime role, add a `BEFORE TRUNCATE` guard (the current trigger covers row UPDATE/DELETE only), and keep the downgrade refusing to drop a non-empty audit table.
- `ROLE_SEEDS` already contains `admin`; no seed change besides a tested idempotency check.

---

## 5. Database routines: 2 triggers + 2 stored procedures

All four ship in migration 0020 as PostgreSQL objects, are covered by real-PostgreSQL integration tests, and are documented at the end (section 9).

### Trigger T1 — `app_user_last_admin_guard` (BEFORE UPDATE OF is_active, role_id OR DELETE ON `app_user`)
Purpose: ADM-02 #8-10. Takes `pg_advisory_xact_lock` on a fixed key to serialise competing changes, then counts active admins **excluding** the row being changed. If the change would leave zero active admins it raises a `check_violation` with a stable message. Because it is in the database, no alternate endpoint, script or the provisioning CLI can bypass it. Stale-count races are impossible because the lock is held until commit.

### Trigger T2 — `app_user_revoke_sessions_on_authority_change` (AFTER UPDATE OF is_active, role_id ON `app_user`)
Purpose: ADM-02 #4 and ADM-04 #8. When an account is suspended or its role changes, revokes every live `user_session` of that user (`revoked_at`, `revocation_reason` = `suspended` / `role_changed`) and expires its renewable credentials in the same transaction. Reactivation never un-revokes anything (#6). Works for any writer, so stale browser state cannot retain access.

### Procedure P1 — `sp_admin_set_account_suspension(actor_id, target_id, suspend, reason, correlation_id)`
Atomic suspend/reactivate: locks the target row `FOR UPDATE`; rejects self-target, blank reason, role/state ineligible; flips `is_active`; opens or closes the `account_suspension` row; returns a result code (`ok`, `self_target`, `last_admin`, `not_found`, `already_in_state`, `invalid_reason`). The Python service appends the `account.suspended` / `account.reactivated` audit event in the same transaction, so state change and evidence commit or roll back together (T1 and T2 fire inside it).

### Procedure P2 — `sp_admin_return_escalated_ticket(admin_id, ticket_id, reason, correlation_id)`
Atomic return to support (ADM-05 #9-10): locks the ticket, requires `status='escalated'` and `admin_owner_user_id = admin_id`, rejects blank reason. Re-evaluates the originating agent **inside** the transaction (active AND role `support_agent`): eligible → `assigned_staff_user_id = originating agent`, `status = 'in_progress'`; otherwise → assignee `NULL`, `status = 'open'`. Clears `admin_owner_user_id`, inserts the `support_ticket_activity` row with the return reason. Status and assignment can never be updated partially.

---

## 6. Work breakdown (execution order)

Each task = one commit (conventional message), tests first or alongside, no task starts until the previous gate is green.

### Phase 0 — Preflight (no code)
1. Create the three worktrees/branches from section 2.
2. Run baselines on a `_test` database: backend `uv sync --all-groups --frozen`, ruff, mypy, pytest with PostgreSQL; frontend `npm ci`, lint, typecheck, vitest. Record the numbers; red baselines are reported, not fixed silently.
3. Confirm open points by reading code: how `repo.ticket(staff=True)` lets the originating agent read an escalated ticket owned by an admin; customer auth path rejects `is_active=false`; runtime DB role name for the REVOKE grants.

### Phase 1 — Shared foundation (SEC-01, SEC-02, provisioning)
4. Migration 0020 skeleton: tables and columns from 4.4, models, `migrations/env.py` imports, drift check.
5. `core/roles.py`: admin in `STAFF_PORTAL_ROLES`, `MFA_REQUIRED_ROLES`, `CUSTOMER_API_DENIED_ROLES`; remove the hardcoded `support_agent` checks from `StaffSessionService`; admin authority rule D3.
6. `require_admin_principal` dependency + unit tests for every denial reason (inactive, wrong role, no factor, no `mfa_verified_at`, expired session, role changed mid-session).
7. SEC-01 wiring for admin: enrollment with QR, activation of the factor only after a valid code, challenge expiry, attempt rate limit, replay rejection under concurrency, admin session lifetimes (D2).
8. SEC-01 recovery and authenticator replacement (D5) + session revocation + events.
9. `scripts/admin_ops.py` (D4) + tests: promotion revokes old sessions, no powers before MFA, no secrets in output.
10. SEC-02: extend allowed events (`account.suspended`, `account.reactivated`, `staff.created`, `staff.activated`, `role.changed`, `auth.logout`, `auth.mfa_recovered`, `auth.mfa_replaced`, `auth.mfa_failed`) with **per-event context allowlists**, new target types (`account`, `staff_invitation`), failure policy: critical writes roll back with the state change and return `AuditUnavailableError`; authentication-event failures log a counter and never grant access. Add TRUNCATE guard and grants.

### Phase 2 — ADM-01, ADM-02
11. ADM-01 service/router/schemas/tests (bounds, allowlisted projection, no financial or credential fields, `access.denied`, lookup rate limit, input validation).
12. T1 + T2 + P1 in migration 0020; PostgreSQL tests: self-suspend, last admin, two admins suspending each other concurrently (exactly one succeeds), session revocation, reactivation does not restore, support/financial data preserved.
13. ADM-02 service/router on top of P1, confirmation + reason validation, audit in the same transaction, suspended customer blocked from customer API and support.

### Phase 3 — ADM-03, ADM-04
14. ADM-03: create invitation (unique email, role allowlist, forged-role rejection via `extra="forbid"`), activation endpoint (atomic `UPDATE ... WHERE consumed_at IS NULL AND expires_at > now`), password policy reuse, `staff.created` / `staff.activated`, concurrent activation test (one winner), replay/expiry tests, secrets absent from audit and logs.
15. ADM-04: read role, confirmed transition support_agent ↔ security_auditor only, own-role and admin-grant rejection, one-role invariant, T2 revokes sessions, `role.changed` with previous/new role.
16. Verify auditors created here need MFA before any read (hand-off with the auditor branch).

### Phase 4 — ADM-05
17. Claim (conditional UPDATE on `admin_owner_user_id`), escalated queue, admin conversation projection (escalation reason staff-only, no private finance data), reply through the existing message flow.
18. Resolve with summary (customer-visible), P2 return, activity rows, `ticket.escalated` unchanged, no conversation copies in audit.
19. Backend projection tests including **direct customer API calls**: `internal_reason` and escalation/return reasons never appear; suspended customer gets denied.
20. Originating agent keeps read-only access while escalated; concurrent claim test.

### Phase 5 — Frontend (`staff-web/src/features/admin/`)
Can start after step 11 once `openapi.json` is regenerated; backend and frontend slices can run in parallel with the contract as the handshake.
21. Router: `RequireStaffRole role="admin"`, `roleHome`, admin nav, `admin/*` routes.
22. Auth: admin MFA step and QR enrollment (reuse `MfaStep`), recovery screens, `/activate?token=` public page that strips the token from the URL after reading it.
23. `AccountsPage` (lookup, detail card labelled as login account, suspend/reactivate dialogs with reason and confirmation).
24. `StaffPage` (create invitation, one-time activation link with copy-once state, role change dialog).
25. `EscalatedTicketsPage` (queue, case view with history, claim, reply, resolve, return with reason).
26. `adminApi.ts` with safe diagnostic handling following `staff-web/AGENTS.md`; no secrets in console or storage; accessible dialogs (WCAG AA like the existing shell).
27. Vitest component tests for every screen and error code, Playwright e2e for the three journeys against the demo seed.
28. Flutter (`lib/features/support/`): confirm a suspended customer sees a clear safe message and the final resolution displays; change only if a gap shows (verified in step 3).

### Phase 6 — Verification, docs, hand-off
29. Backend gates: `ruff format --check`, `ruff check`, `mypy`, migration/seed drift, OpenAPI drift, pytest ≥ 80% line coverage, real PostgreSQL integration tests, `pip-audit`. Frontend gates: lint, typecheck, vitest coverage, build, Playwright.
30. Security review pass of the diff (authorization, injection, secrets in logs, timing, CSRF/CORS) plus a code review.
31. Demo seed (`scripts/seed_admin_demo.py`) and a review guide, following the support demo.
32. Docs (section 9), then ask before pushing and opening PRs.

---

## 7. Test matrix (must exist before a story is called done)

| Risk | Test |
|---|---|
| Permission denial | each role × each endpoint → 401/403 with stable code and an `access.denied` event |
| Forged role field | create-staff with `role: admin`, role-change to admin, public registration with a role → rejected |
| Stale session | role changed or suspended mid-session → next request denied |
| MFA gate | admin session without `mfa_verified_at` → every ADM route denied; promoted account blocked with old session |
| Concurrency | simultaneous claim (1 winner); simultaneous mutual suspension (last admin survives); simultaneous invitation activation (single use); replayed OTP in parallel |
| DB invariants | T1 and T2 exercised by direct SQL, not only through the API |
| Audit | every critical path produces exactly one event; audit failure rolls the state change back; no token, password, OTP, balance or note text in any event |
| Projection | customer API never returns `internal_reason` or escalation/return reasons |
| Atomic return | eligible and ineligible originating agent produce (`in_progress`, agent) vs (`open`, NULL), never a mixed state |

---

## 8. Risks and open points

- **Auditor branch churn:** its service and router files will keep changing. Mitigation: small commits, rebase early, keep admin code in new modules and touch shared files minimally.
- **Migration numbering:** if the auditor merges first with a different number, renumber 0020 before the PR.
- **SQLite unit fixtures vs PostgreSQL routines:** routines exist only in PostgreSQL; unit tests use fakes and the real behavior is proven in integration tests.
- **Trigger on `app_user` fires for registration/profile paths too:** the T1 guard must act only on `is_active`/`role_id` changes (`UPDATE OF`) and on DELETE; verify registration and login timing tests stay green.
- **D1:** showing the activation link to the admin is a trade-off against "no credentials in responses"; confirmed acceptable only as a one-time handoff. Confirm before execution.
- Out of scope, as the card states: billing, cloud/API-key admin, private finances, portal admin grants, general notes, AI support, audit analytics, extra roles.

---

## 9. Documentation, repo and tracker updates (done last)

1. **Routine documentation:** new `docs/DB-ROUTINES-ADMIN.md` in the docs repo covering, for each of T1, T2, P1, P2: purpose and story, trigger event or call signature, the DDL as shipped, locking and concurrency behavior, error codes, the tests that prove it, and the downgrade path. Link it from `docs/SCHEMA.md`.
2. Update `docs/SCHEMA.md`, `docs/schema.sql`, `docs/schema.dbml` (new tables and columns; triggers and procedures listed in the note, since DBML does not model them) and keep `tests/unit/test_dbml_schema.py` green in the backend.
3. Update `BACKLOG-AND-STORIES.md` status per story with evidence links, `administrator-role.md` and `shared-security-requirements.md` where implementation decisions D1-D9 now close technical-design items, `aidlc-state.md`, and append to `audit.md`.
4. Backend: `AGENTS.md` and `aidlc-docs/.../foundation-schema-mapping.md` get the new modules, routines and the MFA/admin rules; `README` notes the provisioning CLI.
5. Trello (only with your explicit go-ahead, and only for items with evidence): tick checklist items story by story, add a comment with branch and test results, move the card when appropriate.

---

## 10. Execution protocol (for the later "super execution")

- Start with Phase 0 and report the baselines before writing code.
- One story at a time, backend then frontend, with the test matrix rows for that story.
- Report each gate result honestly; red gates are shown, not hidden.
- Stop and ask before: push, PR, Trello writes, deleting anything, changing the auditor branch, or deviating from D1-D9.
- Parallel sessions (backend vs frontend) only if you ask for them after the API contract is frozen.

---

## Execution outcome

Executed 2026-11-15 following this plan. Nothing was pushed, merged or written to Trello.

| Phase | Result |
|---|---|
| 0 Preflight | Three worktrees created; throwaway PostgreSQL cluster used for tests. Baselines: backend 639 passed / 2 pre-existing failures / 91 % coverage; staff-web 135 tests. |
| 1 Shared security | Admin in the staff and MFA role sets and denied on the customer API; role-aware session lifetimes; sessions bound to their issuing role; recovery codes and authenticator reset; `scripts/admin_ops.py`; audit catalog extended. |
| 2 ADM-01/02 | Lookup and suspend/reactivate; triggers T1 and T2 and procedure P1 with concurrency tests on PostgreSQL. |
| 3 ADM-03/04 | Invitation, public activation (single use under concurrency), staff role changes. |
| 4 ADM-05 | Escalation queue, claim, reply, resolve, return via procedure P2; customer projection tests. |
| 5 Frontend | Administración workspace, `/activate`, `/recover`, recovery codes; 224 tests, 91 % coverage. |
| 6 Verification and docs | Backend 913 passed / 2 pre-existing failures / 92 % coverage, Ruff, mypy, Alembic drift, OpenAPI drift and `pip-audit` clean; staff-web lint, typecheck and build clean; this documentation; [DB-ROUTINES-ADMIN](../../../docs/DB-ROUTINES-ADMIN.md). |

Differences from the plan (details in [administrator-role.md](../requirements/administrator-role.md#implementation-record--2026-11-15)):
branch name suffixes; no `TRUNCATE` guard (deployment-level privilege separation instead); staff authority
no longer ties the invitation role to the current role; silent background session revalidation in staff-web;
no automated Playwright journey (the flows were driven manually against the real API instead).
Two defects that unit tests could not see were found and fixed by that real run.
