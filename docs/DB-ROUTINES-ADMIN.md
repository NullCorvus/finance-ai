# Administrator database routines: 2 triggers and 2 stored procedures

**Feature:** PB-014 Administrator (ADM-01…ADM-05) and PB-015 shared security (SEC-01, SEC-02)
**Source of truth (executable):** `finance-ai-backend/migrations/versions/0020_admin_account_management.py`
(backend branch `feat/admin-adm-sec-backend`). This document explains the routines; if the two ever
disagree, the migration wins.
**Database:** PostgreSQL 14+ (`CREATE PROCEDURE` / `CALL`); developed and tested on PostgreSQL 18.

## 1. Why these rules live in the database

The Administrator stories contain invariants that must hold **for every writer**, not only for the
FastAPI endpoints: the controlled provisioning script, a future endpoint, a migration or an operator
typing SQL. Application code can be bypassed; a trigger cannot. The routines below therefore enforce
the three rules that are both security-critical and easy to get wrong under concurrency:

| Rule | Story criteria | Enforced by |
|---|---|---|
| The system can never be left without an active administrator, even when two administrators act at the same time | ADM-02 #8, #9, #10 | Trigger **T1** |
| Suspending an account or changing its role immediately invalidates every live session; reactivation never restores them | ADM-02 #4, #6; ADM-04 #7, #8; SEC-01 #11, #12 | Trigger **T2** |
| Suspension/reactivation is one atomic, validated operation with a history row | ADM-02 #1, #2, #5, #8 | Procedure **P1** |
| Returning an escalated ticket changes status, assignment, ownership and history together or not at all | ADM-05 #9, #10 | Procedure **P2** |

The Python services call the procedures and write the SEC-02 audit event **in the same transaction**
(`finance_ai/admin/accounts_service.py`, `tickets_service.py`), so a critical change can never succeed
without audit evidence: if the event cannot be written, the whole change rolls back.

## 2. Inventory

| # | Object | Kind | Attached to / called by | Language |
|---|---|---|---|---|
| T1 | `app_user_last_admin_guard()` + trigger `app_user_last_admin_guard` | Trigger (BEFORE, row level) | `app_user`: `UPDATE OF is_active, role_id` or `DELETE` | PL/pgSQL |
| T2 | `app_user_revoke_sessions_on_authority_change()` + trigger `app_user_revoke_sessions_on_authority_change` | Trigger (AFTER, row level, conditional) | `app_user`: `UPDATE OF is_active, role_id` | PL/pgSQL |
| P1 | `sp_admin_set_account_suspension(...)` | Stored procedure | `AdminAccountRepository.set_suspension` (ADM-02) | PL/pgSQL |
| P2 | `sp_admin_return_escalated_ticket(...)` | Stored procedure | `AdminTicketService.return_to_support` (ADM-05) | PL/pgSQL |

Not counted, but part of the same protection: the append-only trigger `security_audit_event_append_only`
(migration `0018`) that rejects `UPDATE`/`DELETE` of audit rows.

### Supporting schema (same migration)

| Change | Purpose |
|---|---|
| Table `account_suspension` (id, user_id, suspended_by_user_id, reason ≤ 500, suspended_at, reactivated_by_user_id, reactivated_at) | Suspension history. Partial unique index `uq_account_suspension_open` allows **one open row per account**. Foreign keys are `ON DELETE RESTRICT`: history cannot be cascaded away. |
| Table `staff_mfa_recovery_code` (id, user_id, code_hash, created_at, consumed_at) | SEC-01 single-use recovery codes, stored only as SHA-256 hashes. |
| Column `user_session.issued_role_id` (FK `role`, `SET NULL`) | A staff session remembers the role it was issued for, so a role change cannot carry an old (possibly MFA-verified) session over to different authority. |
| Column `support_ticket.admin_owner_user_id` (FK `app_user`, `RESTRICT`) + CHECK `admin_owner_only_when_escalated` + partial index `ix_support_ticket_escalated_queue` | The administrator who owns an escalated case. The CHECK makes an owner on a non-escalated ticket impossible. |

## 3. Trigger T1: last active administrator guard

**Purpose.** No `UPDATE` or `DELETE` may leave zero active administrators (ADM-02 #8–#10): not a
suspension, not a deactivation, not a role change away from `admin`, not a row delete, and not through
any alternate endpoint or the provisioning script.

**Fires:** `BEFORE UPDATE OF is_active, role_id OR DELETE ON app_user FOR EACH ROW`.

```sql
CREATE FUNCTION app_user_last_admin_guard() RETURNS trigger
LANGUAGE plpgsql AS $$
DECLARE
    v_admin_role_id bigint;
    v_remaining integer;
BEGIN
    SELECT id INTO v_admin_role_id FROM role WHERE name = 'admin';
    IF v_admin_role_id IS NULL OR NOT (OLD.role_id = v_admin_role_id AND OLD.is_active) THEN
        RETURN CASE WHEN TG_OP = 'DELETE' THEN OLD ELSE NEW END;
    END IF;
    IF TG_OP = 'UPDATE' AND NEW.role_id = v_admin_role_id AND NEW.is_active THEN
        RETURN NEW;
    END IF;
    IF current_setting('transaction_isolation') <> 'read committed' THEN
        RAISE EXCEPTION 'administrator changes require READ COMMITTED isolation'
            USING ERRCODE = 'feature_not_supported';
    END IF;
    PERFORM pg_advisory_xact_lock(hashtextextended('finance_ai.active_admin_invariant', 0));
    SELECT count(*) INTO v_remaining
    FROM app_user
    WHERE role_id = v_admin_role_id AND is_active AND id <> OLD.id;
    IF v_remaining = 0 THEN
        RAISE EXCEPTION 'the last active administrator cannot be removed'
            USING ERRCODE = 'check_violation', CONSTRAINT = 'last_active_admin';
    END IF;
    RETURN CASE WHEN TG_OP = 'DELETE' THEN OLD ELSE NEW END;
END;
$$;

CREATE TRIGGER app_user_last_admin_guard
BEFORE UPDATE OF is_active, role_id OR DELETE ON app_user
FOR EACH ROW EXECUTE FUNCTION app_user_last_admin_guard();
```

**How it works**

1. Anything that is not an *active administrator losing that status* returns immediately, so ordinary
   `app_user` updates (email, password hash, customers, staff) pay almost nothing.
2. Otherwise it takes a **transaction-level advisory lock** with a fixed key. All competing
   administrator removals are serialized on it.
3. After the lock is held it counts the *other* active administrators on a fresh `READ COMMITTED`
   snapshot. If none, it raises `check_violation` with constraint name `last_active_admin`.

**Concurrency proof.** Two administrators A and B suspend each other at the same time. The first to
reach the trigger takes the lock and sees the other active, so it proceeds. The second blocks on the
lock; when the first commits, the second counts again, finds nobody left and is rejected. A stale
count can never pass because the count is taken *after* the lock. Exactly one administrator survives.

**Fail-closed on other isolation levels.** Under `REPEATABLE READ`/`SERIALIZABLE` a fixed snapshot
could miss the other transaction's commit, so the trigger refuses (`feature_not_supported`) instead of
guessing. The application uses the PostgreSQL default.

**No deadlock by design.** It reads, it does not lock other administrator rows; only the advisory lock
is contended.

**Observed result codes.** `23514 check_violation`, constraint `last_active_admin` (P1 translates this
into the `last_admin` result).

**Tests** (`tests/integration/test_zzz_admin_account_routines.py`, real PostgreSQL):
single administrator cannot be deactivated, demoted or deleted; allowed while another remains active;
customers/inactive admins/unrelated columns unaffected; two concurrent removals → exactly one wins;
`REPEATABLE READ` is refused.

## 4. Trigger T2: revoke sessions when authority changes

**Purpose.** When an account is suspended or its role changes, every live session of that account
dies in the same statement (ADM-02 #4, ADM-04 #7–#8, SEC-01 #11–#12), whichever code path made the
change. Reactivation never restores a session (ADM-02 #6).

**Fires:** `AFTER UPDATE OF is_active, role_id ON app_user FOR EACH ROW WHEN (the value actually changed)`.

```sql
CREATE FUNCTION app_user_revoke_sessions_on_authority_change() RETURNS trigger
LANGUAGE plpgsql AS $$
DECLARE
    v_reason text;
BEGIN
    IF OLD.is_active AND NOT NEW.is_active THEN
        v_reason := 'suspended';
    ELSIF OLD.role_id IS DISTINCT FROM NEW.role_id THEN
        v_reason := 'role_changed';
    ELSE
        RETURN NULL;
    END IF;
    UPDATE user_session
    SET revoked_at = CURRENT_TIMESTAMP, revocation_reason = v_reason
    WHERE user_id = NEW.id AND revoked_at IS NULL;
    RETURN NULL;
END;
$$;

CREATE TRIGGER app_user_revoke_sessions_on_authority_change
AFTER UPDATE OF is_active, role_id ON app_user
FOR EACH ROW
WHEN (OLD.is_active IS DISTINCT FROM NEW.is_active OR OLD.role_id IS DISTINCT FROM NEW.role_id)
EXECUTE FUNCTION app_user_revoke_sessions_on_authority_change();
```

**How it works.** The `WHEN` clause makes it a no-op for every update that does not change
`is_active` or `role_id`. A suspension sets `revoked_at`/`revocation_reason = 'suspended'` on all of
the user's unrevoked sessions (customer **and** staff). A role change uses `'role_changed'`. A
reactivation (`false → true`) matches neither branch, so already-revoked sessions stay revoked and the
person must sign in again (and complete MFA where required).

**Defense in depth.** The application also revokes explicitly (`AdminStaffService.change_role`), and a
staff session records `issued_role_id`, so even if the trigger were disabled the session service would
deny a session whose issuing role no longer matches.

**Tests:** direct-SQL suspension revokes all of one user's sessions (including a customer `android`
session) and leaves other users' sessions alone; role change revokes; reactivation does not restore;
unrelated updates do not touch sessions. Verified on the live stack: after an administrator suspended a
customer, the customer's previous bearer token returned 401 and all five of their sessions carried
`revocation_reason = 'suspended'`.

## 5. Stored procedure P1: `sp_admin_set_account_suspension`

**Purpose.** One atomic, validated operation for suspending and reactivating a login account (ADM-02).

```sql
CREATE PROCEDURE sp_admin_set_account_suspension(
    IN p_actor_id bigint,
    IN p_target_id bigint,
    IN p_suspend boolean,
    IN p_reason text,
    INOUT p_result text DEFAULT NULL
)
LANGUAGE plpgsql AS $$
DECLARE
    v_target app_user%ROWTYPE;
    v_reason text;
    v_constraint text;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM app_user u JOIN role r ON r.id = u.role_id
        WHERE u.id = p_actor_id AND u.is_active AND r.name = 'admin'
    ) THEN
        p_result := 'actor_not_authorized';
        RETURN;
    END IF;
    IF p_suspend AND p_actor_id = p_target_id THEN
        p_result := 'self_target';
        RETURN;
    END IF;
    SELECT * INTO v_target FROM app_user WHERE id = p_target_id FOR UPDATE;
    IF NOT FOUND THEN
        p_result := 'not_found';
        RETURN;
    END IF;
    IF p_suspend THEN
        v_reason := btrim(coalesce(p_reason, ''));
        IF v_reason = '' OR char_length(v_reason) > 500 THEN
            p_result := 'invalid_reason';
            RETURN;
        END IF;
        IF NOT v_target.is_active THEN
            p_result := 'already_in_state';
            RETURN;
        END IF;
        BEGIN
            UPDATE app_user SET is_active = false WHERE id = p_target_id;
        EXCEPTION WHEN check_violation THEN
            GET STACKED DIAGNOSTICS v_constraint = CONSTRAINT_NAME;
            IF v_constraint = 'last_active_admin' THEN
                p_result := 'last_admin';
                RETURN;
            END IF;
            RAISE;
        END;
        INSERT INTO account_suspension (user_id, suspended_by_user_id, reason)
        VALUES (p_target_id, p_actor_id, v_reason);
    ELSE
        IF v_target.is_active THEN
            p_result := 'already_in_state';
            RETURN;
        END IF;
        UPDATE app_user SET is_active = true WHERE id = p_target_id;
        UPDATE account_suspension
        SET reactivated_by_user_id = p_actor_id, reactivated_at = CURRENT_TIMESTAMP
        WHERE user_id = p_target_id AND reactivated_at IS NULL;
    END IF;
    p_result := 'ok';
END;
$$;
```

**Parameters.** `p_actor_id` the acting administrator; `p_target_id` the account; `p_suspend`
`true` = suspend, `false` = reactivate; `p_reason` required for suspension (trimmed, 1–500 characters);
`p_result` is an `INOUT` result code.

**Result codes**

| Code | Meaning | API outcome |
|---|---|---|
| `ok` | State changed; history written | 200 + new account state |
| `actor_not_authorized` | Actor is not a currently active administrator | 403 |
| `self_target` | Administrator tried to suspend their own account | 409 `admin_self_action_denied` (audited as `denied`) |
| `not_found` | No such account | 404 |
| `invalid_reason` | Blank or longer than 500 characters | 422 |
| `already_in_state` | Already suspended / already active | 409 |
| `last_admin` | Trigger T1 refused (caught here) | 409 `last_active_admin_protected` (audited as `denied`) |

**Atomicity.** The target row is locked `FOR UPDATE`; the flag change, the history row and (through T2)
the session revocation happen in one transaction. The `EXCEPTION` block around the update uses a
sub-transaction so a T1 refusal rolls back only that statement and is reported as `last_admin` instead
of aborting the caller's transaction (which still has to write the audit event).

**Calling it from Python** (psycopg needs explicit casts for `bigint` parameters):

```sql
CALL sp_admin_set_account_suspension(
    CAST(:actor AS bigint), CAST(:target AS bigint), CAST(:suspend AS boolean),
    CAST(:reason AS text), CAST(NULL AS text));
-- returns one row: p_result
```

**Tests:** suspend with trimmed reason, history row, sessions revoked; reactivation closes the history
row and keeps old sessions revoked; blank/oversized reasons change nothing; self-suspension, unknown
target and repeated state rejected; non-administrator actors (customer, support agent, auditor) and a
*suspended* administrator are refused; an administrator can suspend another administrator but never the
last one; two administrators suspending each other concurrently → the second receives `last_admin`
and exactly one stays active; at most one open suspension per account.

## 6. Stored procedure P2: `sp_admin_return_escalated_ticket`

**Purpose.** Return an escalated ticket to Support atomically (ADM-05 #9, #10):

* originating agent still an **active** `support_agent` → assign that agent, status `in_progress`;
* otherwise → clear assignment, status `open` (unassigned queue).

Status, assignment, ownership and the activity row can never be updated partially.

```sql
CREATE PROCEDURE sp_admin_return_escalated_ticket(
    IN p_admin_id bigint,
    IN p_ticket_id bigint,
    IN p_reason text,
    INOUT p_result text DEFAULT NULL,
    INOUT p_new_status text DEFAULT NULL,
    INOUT p_new_assignee bigint DEFAULT NULL
)
LANGUAGE plpgsql AS $$
DECLARE
    v_ticket support_ticket%ROWTYPE;
    v_reason text;
    v_origin_eligible boolean;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM app_user u JOIN role r ON r.id = u.role_id
        WHERE u.id = p_admin_id AND u.is_active AND r.name = 'admin'
    ) THEN
        p_result := 'actor_not_authorized';
        RETURN;
    END IF;
    v_reason := btrim(coalesce(p_reason, ''));
    IF v_reason = '' OR char_length(v_reason) > 4000 THEN
        p_result := 'invalid_reason';
        RETURN;
    END IF;
    SELECT * INTO v_ticket FROM support_ticket WHERE id = p_ticket_id FOR UPDATE;
    IF NOT FOUND THEN
        p_result := 'not_found';
        RETURN;
    END IF;
    IF v_ticket.status <> 'escalated' THEN
        p_result := 'not_escalated';
        RETURN;
    END IF;
    IF v_ticket.admin_owner_user_id IS DISTINCT FROM p_admin_id THEN
        p_result := 'not_owner';
        RETURN;
    END IF;
    SELECT EXISTS (
        SELECT 1 FROM app_user u JOIN role r ON r.id = u.role_id
        WHERE u.id = v_ticket.originating_support_agent_id
          AND u.is_active AND r.name = 'support_agent'
    ) INTO v_origin_eligible;
    IF v_origin_eligible THEN
        p_new_status := 'in_progress';
        p_new_assignee := v_ticket.originating_support_agent_id;
    ELSE
        p_new_status := 'open';
        p_new_assignee := NULL;
    END IF;
    UPDATE support_ticket
    SET status = p_new_status,
        assigned_staff_user_id = p_new_assignee,
        admin_owner_user_id = NULL,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = p_ticket_id;
    INSERT INTO support_ticket_activity (
        ticket_id, actor_user_id, event_type, previous_status, new_status,
        previous_assignee_user_id, new_assignee_user_id, internal_reason
    ) VALUES (
        p_ticket_id, p_admin_id, 'ticket_returned', 'escalated', p_new_status,
        v_ticket.assigned_staff_user_id, p_new_assignee, v_reason
    );
    p_result := 'ok';
END;
$$;
```

**Result codes.** `ok` (with `p_new_status` and `p_new_assignee`), `actor_not_authorized`,
`invalid_reason` (blank or > 4000), `not_found`, `not_escalated`, `not_owner`. The API maps them to
200 / 403 / 422 / 404 / 409 / 409.

**Eligibility is evaluated inside the lock.** The originating agent's state is read after the ticket
row is locked, in the same transaction that writes the result, so an agent suspended a moment earlier
is never reassigned. The CHECK `admin_owner_only_when_escalated` additionally guarantees that the
ownership column and the status cannot disagree.

**The reason is staff-only.** It is stored in `support_ticket_activity.internal_reason`; customer
projections come from the customer schemas and never include it. Verified on the live API: after a
return, the customer's `GET /support/tickets/{id}` contained the administrator's public reply and no
escalation or return reason.

**Tests:** full lifecycle (agent creates/claims/escalates through the real Support workflow → admin
claims, replies, returns → agent is `in_progress` and can write again, activity history in order);
ineligible origin (suspended, role changed, missing) → `open` and unassigned; blank reason → no change;
second return → conflict; non-owner and non-escalated tickets refused; four administrators claiming at
once → exactly one wins; direct SQL setting an owner on a non-escalated ticket is rejected by the CHECK.

## 7. Try it yourself (psql)

```sql
-- T1: the last administrator cannot be deactivated (expect ERROR ... last active administrator)
UPDATE app_user SET is_active = false WHERE email = 'owner@example.com';

-- P1: suspend a customer (result column p_result = 'ok'), see history and revoked sessions
CALL sp_admin_set_account_suspension(1, 3, true, 'Revisión por contracargos', NULL);
SELECT user_id, reason, suspended_at, reactivated_at FROM account_suspension;
SELECT id, revocation_reason FROM user_session WHERE user_id = 3;   -- 'suspended' (T2)

-- P2: return escalated ticket 1 owned by administrator 1
CALL sp_admin_return_escalated_ticket(1, 1, 'Identidad verificada', NULL, NULL, NULL);
SELECT status, assigned_staff_user_id, admin_owner_user_id FROM support_ticket WHERE id = 1;

-- Inspect the objects
SELECT tgname, tgenabled FROM pg_trigger WHERE tgname LIKE 'app_user_%';
\df+ sp_admin_*
```

## 8. Operations and limits

* **Migration:** `alembic upgrade head` creates all four objects; `alembic downgrade 0019_staff_mfa_challenge`
  drops them (procedures, triggers, functions, tables, columns) and is tested as a round trip.
  `alembic check` (model drift) passes; DDL for routines is not tracked by Alembic autogenerate and
  lives only in the migration.
* **Privileges:** the routines run with the caller's privileges (not `SECURITY DEFINER`). The runtime
  role needs `EXECUTE` on the procedures and ordinary DML on the tables they touch.
* **Audit protection gap (known):** `security_audit_event` rejects row `UPDATE`/`DELETE`, but a
  `TRUNCATE` or `DROP` by the table owner is not blocked, and the existing integration tests rely on
  `TRUNCATE` for cleanup. A production deployment should run the API as a role without
  `TRUNCATE`/`DROP` privilege on that table; this is deployment configuration, not application code.
* **Isolation:** administrator-affecting writes must run in `READ COMMITTED` (the default), see T1.
* **Performance:** T1/T2 return before doing work for any update that does not change `is_active` or
  `role_id`; `account_suspension` and the escalated-queue partial index are covered by indexes.
