# Email notifications (HTML) — implementation plan, v1

**Surface:** FastAPI + PostgreSQL backend, Flutter customer app (Android and Windows)
**Tracker:** Trello card "Notificaciones — Correo electrónico HTML" (Backlog)
**Plan date:** 2026-11-16 · **Status:** planned; v1 scope approved by the user on 2026-11-16; nothing implemented, no code branch created
**Source requirement (course rubric, section F):** automatic email sending that works; the message is not plain text (HTML layout, logo or image, styles). Reports in PDF or Excel with professional formatting are the second bullet and are planned for v2, not v1. The card asks for evidence of a test send.
**Stories:** EML-01..EML-04 (29 provisional SP). These identifiers are provisional: they are not in `docs/BACKLOG-AND-STORIES.md` yet and must be added there before work starts.

---

## 1. What exists today (verified on 2026-11-16 by reading backend `develop` and the product docs)

- **No email code anywhere.** A search of `src/`, `pyproject.toml` and `.env.example` found no SMTP client, provider SDK, sender, template or notification module. Staff invitations deliberately show their link once instead of emailing it (decision D1 of the Administrator work: no provider was approved).
- **No proof that an email address is real.** `app_user` has `email`, `password_hash`, role, preferred currency, `is_active` and timestamps; registration normalizes and stores the email without verification. Sending alerts to unverified addresses would let anyone trigger mail to a third party, so verification is part of v1.
- **Budgets are derived on the server.** `BudgetView` carries `amount`, `current_period_start/end` and `spent_amount`, computed per read from transactions (`src/finance_ai/budgets/`, unit-of-work pattern in `uow.py`, schedule rules in `periods.py`). A budget covers one category or all expenses, is one-time or recurring, and has its own currency.
- **Where spending changes:** `ExpenseService.create`, `create_with_replay`, `confirm_receipt_proposal`, `update` and `delete` (`src/finance_ai/expenses/service.py`).
- **Runtime:** Google Cloud Run (region `southamerica-east1`) with Neon PostgreSQL, GitHub Actions deploy, Secret Manager for the staff MFA key. Cloud Run only guarantees CPU while a request is being served, so sending mail "in the background" after the response is not reliable. Nothing scheduled exists today.
- **Libraries already present:** `httpx` (provider APIs), `reportlab` (PDF, used by the Auditor reports), `email-validator`. Not present: a template engine and an Excel writer.
- **Flutter Settings** lists budgets, accounts, categories, income sources, theme, help and support, and the session card. There is no notifications section.
- **Offline-first direction (user decisions of 2026-10-19):** the local database is meant to become the source of truth and an account is optional. A user who never syncs never sends their spending to the server, so the server can never email them about it. Email is therefore an *account* channel. The same threshold rules should later be reusable on the device for local notifications, which is why section 4 separates "decide that something happened" from "deliver it". The offline-first work lives on other branches; migration numbers may need renumbering if it merges first.

## 2. Scope

**In v1 (EML-01..EML-04):** email foundation and branded HTML templates; opt-in with email verification by code; budget alerts at 80 % and 100 %; a "send me a test email" button; unsubscribe; hardening, documentation and the evidence for the card.

**Not in v1 (kept visible so they are not forgotten):**

| Later | What | Notes |
|---|---|---|
| v1.1 | Support ticket answered or resolved; account suspended or reactivated | Reuses the same outbox and templates; both events already exist in the support and administrator code |
| v2 | Monthly summary email with a PDF or Excel report | Covers the "Reportes" bullet; PDF can reuse `reportlab`, Excel needs a new library; reuses the data behind the weekly insight on Home |
| v2 | Local (on-device) budget notifications for users without an account | Needed once offline-first lands; same threshold rules |
| later | Push notifications, SMS, in-email deep links | Deep links need an app-link landing page first |

## 3. Decisions (defaults proposed, change any before execution)

| # | Topic | Default |
|---|---|---|
| D1 | Provider | Development: a sandbox inbox that captures mail without delivering it. Real sending: one transactional provider reached over its HTTP API (`httpx`) or SMTP. The choice (and its current free limits) is made before EML-01 closes, after checking the provider's terms and domain requirements. The sender is an interface, so changing provider is a configuration and adapter change, not a redesign |
| D2 | Sender domain | A domain the team controls is needed for production deliverability (SPF, DKIM, DMARC). Without one, the demo sends only to test addresses and the runbook lists the DNS records to add later |
| D3 | Opt-in | Email notifications are **off by default**; turning them on requires a verified email |
| D4 | Verification | A 6-digit code typed in the app (no deep link, works on Android and Windows), valid 15 minutes, 5 attempts, resends rate limited |
| D5 | Amounts in the email | Shown by default (the email goes to the account owner) with a "show amounts" switch; never any individual transaction, merchant or note |
| D6 | Thresholds | 80 % and 100 % of the budget limit, once per budget, period and limit |
| D7 | Delivery model | Transactional outbox written in the same database transaction as the expense, plus a dispatcher that sends pending rows. Triggered right after commit (best effort) and by a scheduled sweep for retries |
| D8 | Dispatch trigger security | A secret header from Secret Manager on an internal endpoint excluded from the public OpenAPI. Google OIDC verification is a later hardening step |
| D9 | Language | Spanish (es-CO formats) for v1; templates are written so another locale can be added |
| D10 | Logo | Embedded as an inline attachment (Content-ID) with alt text, because many clients block remote images and data URIs |

## 4. Architecture (backend, new package `src/finance_ai/notifications/`)

1. **Detect** (`budget_alerts.py`): a `BudgetAlertEvaluator` called by the expense service inside its transaction, after the change is flushed and before it commits. It finds the active budgets the change can affect (same category or an all-expenses budget, whose current period contains the expense date), obtains `spent` from the **same repository calculation the budgets screen uses** (no second implementation of the rule, so the email can never disagree with the app) and decides which thresholds are reached.
2. **Decide once** (`outbox.py`): for each reached threshold it inserts an outbox row with `dedupe_key = budget:{budget_id}:{period_start}:{threshold}:{amount}` using `ON CONFLICT DO NOTHING`. The key includes the limit, so raising or lowering a limit re-arms the alert naturally, and a new period starts clean. If one expense jumps past two thresholds only the highest is sent and the lower one is recorded as `skipped`. Deleting or editing an expense never retracts an email already sent.
3. **Deliver** (`dispatcher.py`): claims pending rows with `FOR UPDATE SKIP LOCKED` (several Cloud Run instances can run it without double sends), checks again at send time that the user is active, verified and opted in, renders the template, calls the sender, records the provider message id, and retries with backoff; after the maximum attempts the row is parked as `failed` with a stable error code (no provider text).
4. **Send** (`senders.py`): an `EmailSender` interface with `ConsoleEmailSender` (writes `.eml` and `.html` files, for development and tests), an SMTP sender (standard library, works with sandbox inboxes) and an HTTP-API sender (provider-specific adapter). Settings choose which; production refuses to start with the console sender or without a configured sender address.
5. **Render** (`templates/`): Jinja2 with autoescape; one base layout plus `budget_alert`, `verification_code` and `test_email`, each with an HTML and a plain-text version.
6. **Channel seam:** the outbox row is a *notification* (`kind`, `user_id`, payload), not an email. Email is one delivery channel; the later on-device channel consumes the same decision rules.

Email addresses are never copied into the outbox or logs: the dispatcher reads the current address from `app_user` at send time, and logs carry only the user id, notification id and a stable result code (backend privacy rule).

## 5. Data model (migration `0021_email_notifications`, revises `0020_admin_account_management`)

```
app_user.email_verified_at            timestamptz NULL

notification_preference               user_id PK -> app_user (ON DELETE CASCADE)
                                      email_enabled bool NOT NULL DEFAULT false
                                      budget_alerts bool NOT NULL DEFAULT true
                                      show_amounts  bool NOT NULL DEFAULT true
                                      updated_at

email_verification                    id, user_id -> app_user, code_hash, expires_at,
                                      attempts smallint, consumed_at, created_at
                                      partial unique index: one open verification per user

notification_outbox                   id, user_id -> app_user, kind (CHECK: budget_alert,
                                      verification_code, test), dedupe_key UNIQUE,
                                      payload jsonb (no address, no secrets),
                                      status (CHECK: pending, sending, sent, failed, skipped),
                                      attempts, next_attempt_at, sent_at,
                                      provider_message_id, last_error_code, created_at
                                      index on (status, next_attempt_at) for pending/sending
```

The payload for a budget alert is a snapshot (budget id and name, period dates, threshold, spent, limit, currency) so the email shows the amounts at the moment of crossing. Existing users start unverified and opted out.

## 6. API (backend contract; the OpenAPI file is regenerated and reviewed)

| Endpoint | Purpose |
|---|---|
| `GET /api/v1/me/notification-preferences` | Current preferences and whether the email is verified |
| `PUT /api/v1/me/notification-preferences` | Change switches; enabling email requires a verified address (409 `email_not_verified`) |
| `POST /api/v1/me/email/verification` | Send a code (rate limited per user and per hour) |
| `POST /api/v1/me/email/verify` | Confirm the code (attempt limited, constant-time comparison) |
| `POST /api/v1/me/notifications/test` | Queue the sample email (rate limited) |
| `GET/POST /public/unsubscribe` | Signed one-click unsubscribe; also advertised with `List-Unsubscribe` and `List-Unsubscribe-Post` headers |
| `POST /internal/notifications/dispatch` | Scheduled sweep; secret header; not in the public contract |

All failures use the existing problem contract (stable code, safe message, correlation id) and never echo the code, token or address.

## 7. Email design (the part the Trello card is about)

- **Structure:** table-based layout, 600 px maximum width, all styles inline, system font stack, `lang="es"`, no scripts and no external stylesheets. A hidden preheader line gives the inbox preview text. A plain-text alternative is always sent (multipart/alternative).
- **Brand:** header bar in the app green with the logo (inline, alt text "Finance AI"), a status banner (amber for 80 %, red for the limit), budget name and period, a progress bar, three figures (spent, limit, available or exceeded), one call-to-action button ("Abrir Finance AI"), and a footer explaining why the email was sent with links to manage notifications and unsubscribe. A mockup of both budget emails was shared with the proposal.
- **Accessibility and dark mode:** text contrast at least 4.5:1 (the colour pairs already audited for the staff portal), meaningful alt text, `color-scheme` meta and a dark-mode media query with safe light defaults, button with padding and a background colour fallback.
- **Verification email:** the same layout with the code in large type, the 15-minute validity and a "ignore this if it was not you" line. The test email proves the layout and branding end to end.

## 8. Flutter (EML-02)

Settings gets a **Notificaciones** row opening one screen: email status (not verified, verified), "Verificar correo" (sends the code, then a code field), switches for budget alerts and showing amounts, and "Enviarme un correo de prueba". Every failure uses the shared copyable diagnostic UI and contract required by the frontend guide (code, operation, UTC time, platform, sanitized API location, correlation id, no entered values). Android and Windows share the same Dart code; widget tests cover each state, large text and dark theme; analysis, format and coverage gates must stay green (at least 80 %).

## 9. Work breakdown (execution order; tick each step when it is verified)

### EML-01 — Email foundation (8 SP, backend)
- [x] 1. Add the story records to `docs/BACKLOG-AND-STORIES.md` (EML-01..EML-04 with acceptance criteria from this plan) and confirm decisions D1, D2 and D5 with the user.
- [ ] 2. Branch `feat/email-notifications-backend` from `develop`; baselines (ruff, mypy, Alembic drift, OpenAPI drift, pytest with PostgreSQL) recorded before any change.
- [x] 3. Settings and production validators (`FINANCE_AI_EMAIL_*`, `FINANCE_AI_PUBLIC_BASE_URL`, dispatch token), `.env.example` and README entries; add `jinja2` and refresh `uv.lock`.
- [x] 4. `EmailMessage`/`EmailSender` interface, console sender, SMTP sender, first provider adapter chosen in D1; error mapping to stable codes.
- [x] 5. Templates (base, verification code, test email, budget alert) in HTML and text; rendering tests; a preview script that writes the HTML files for review.
- [x] 6. Migration `0021` for the four objects in section 5; models; schema mapping document updated; downgrade guard like migration 0020.
- [x] 7. Outbox repository and dispatcher (claim with `SKIP LOCKED`, retry and backoff, stale `sending` recovery), internal endpoint with the secret header.
- [ ] 8. `scripts/send_test_email.py` sends a real message to an address given on the command line; capture the evidence (section 12).
- **Acceptance:** a real HTML email with logo and styles reaches a test inbox; the same run through the console sender produces identical HTML; production start-up fails without a configured sender; no address appears in logs.

### EML-02 — Opt-in, verification and preferences (8 SP, backend + Flutter)
- [x] 9. Verification service (code generation, hash, expiry, attempts, resend limits), preference service, endpoints, API tests.
- [x] 10. Signed unsubscribe (public endpoint, one-click POST, `List-Unsubscribe` headers), tamper and replay tests.
- [x] 11. Branch `feat/email-notifications-frontend` from `develop`; Notificaciones screen, repository, state, diagnostics, tests, analysis and coverage.
- [x] 12. Test email button wired to `POST /me/notifications/test`.
- **Acceptance:** a user can verify an address, turn alerts on and off, receive the test email and unsubscribe from the email itself; an unverified address can never be enabled.

### EML-03 — Budget alerts (8 SP, backend)
- [x] 13. `BudgetAlertEvaluator` and the hook in the expense create, receipt-confirm, update and delete paths inside the same transaction.
- [ ] 14. Alert templates for 80 % and 100 %, amounts switch honoured, Spanish copy reviewed.
- [x] 15. Tests: threshold table (below, exactly at, above, jump over two thresholds), category and all-expenses budgets, recurring and one-time periods, expenses outside the current period, limit change re-arms, new period resets, preferences off or unverified, suspended user, idempotent retry.
- [x] 16. PostgreSQL concurrency tests: two simultaneous expenses cross the same threshold and exactly one email is queued; two dispatchers never send the same row.
- **Acceptance:** saving an expense that crosses a threshold produces exactly one email within the dispatch interval; the figures match the budgets screen to the cent.

### EML-04 — Hardening, documentation and evidence (5 SP)
- [ ] 17. Daily per-user cap, bounce and complaint handling for the chosen provider (suppression list), metrics for sent, failed and skipped.
- [x] 18. Runbook: provider setup, Secret Manager entries, Cloud Scheduler job, DNS records (SPF, DKIM, DMARC), how to rotate the key and how to read the outbox.
- [x] 19. Security and privacy review of the diff (no PII in logs or payloads, injection and header injection, token handling, rate limits), then a code review.
- [ ] 20. (Product docs done 2026-11-16: BACKLOG PB-017 with EML-01..04 and the trigger table, FEATURES 22, ALCANCE, SCHEMA; the Trello card still waits for the user's go-ahead.) Product docs updated (scope, features, backlog statuses with evidence, shared decisions), evidence attached to the Trello card only with the user's go-ahead.

## 9b. Status and deviations from this plan (recorded 2026-11-16)

Built and verified locally in the sandbox-first order the user chose (console and SMTP-sandbox senders; no provider account, no DNS, nothing pushed). Backend branch `feat/email-notifications-backend`, commits 6aef2e9, 21fd8d2 and 4f6a3d1 (EML-01 and EML-02); EML-03 is commit 22606f6 (hook runs after create, receipt confirmation and edit; deleting an expense can only lower spending, so it does not evaluate). Step 14 stays open until the Spanish alert copy is reviewed by the user. Full backend gates green at that commit: 1163 tests, 93 % coverage; the only failures are the 2 `test_text_capture_persistence` tests that fail on an unrelated date mismatch.

Deviations, each one deliberate:

1. **The verification code is not queued.** It is sent straight from the request, so it is never stored in plain text. The outbox `kind` is therefore limited to `budget_alert` and `test` (CHECK constraint), and the plan's four objects became three tables plus `app_user.email_verified_at`.
2. **Outbox gains `claimed_at`.** Needed to recover a row whose instance died while sending (stale `sending` rows go back to `pending` after 10 minutes).
3. **No "Abrir Finance AI" button in v1.** There is no app link to open yet, and a button that does nothing is worse than none.
4. **Preferences use `PATCH`, not `PUT`.** Only the fields sent change, so two switches can never overwrite each other. Values must be real JSON booleans (`"yes"` is rejected).
5. **Verifying the code also turns email on.** The person went through the flow to opt in; one fewer call and no inconsistent state.
6. **Production fails closed at use, not at start-up.** A deployment without a real sender still starts; notification features report `notifications_unavailable` and the app hides them (`delivery_available: false`).
7. **Unsubscribe token and code hashes are derived from `FINANCE_AI_SESSION_LIMITER_SECRET`** (purpose-labelled HMAC) instead of a new secret. Rotating it invalidates open codes and old unsubscribe links; the in-app switch still works. Revisit if a dedicated secret is preferred.
8. **Alert decisions are state based**, not "crossing" based: for each budget whose current period contains today, the highest threshold reached is recorded once (`budget:{id}:{period start}:{threshold}:{limit}`). Budget edits do not send mail by themselves, only expense changes evaluate, and deleting an expense does not.
9. **Found and fixed by the evidence run:** `List-Unsubscribe` was being encoded as an RFC 2047 word because a real link has no spaces to fold at; fixed in commit bbb13bc with a regression test.
10. **Found, not fixed (outside this scope):** two simultaneous first expenses with the same new merchant name collide on `uq_store_user_normalized_name` and return a server error. Reproduced while testing; the alert tests use distinct merchants.

Frontend: branch `feat/email-notifications-frontend` in `finance-ai-frontend-email`, commit 5d90a0b (Notificaciones screen, 26 tests; format and analyze clean; whole suite passes except the dashboard spending-summary golden, which fails identically on an untouched worktree on this machine). Runbook: backend `docs/EMAIL-NOTIFICATIONS.md`. Evidence of the sandbox run: `aidlc-docs/construction/email-notifications/evidence/`. Steps still open: 1 (backlog stories), 2 (baseline record), 8 (a real send; the evidence run used the console sender), 14 (copy review), 17 (bounce handling and metrics need a provider), 19 (formal security review and code review), 20 (product docs and Trello, with the user's go-ahead).

Review before the PRs (2026-11-16): an independent security review of the backend and frontend diffs found no high-confidence vulnerability (one low note: uvicorn's access log records the `?token=` of the unsubscribe URL; consider `--no-access-log` or log filtering at deployment). An independent correctness review found 7 real defects, all confirmed in the code and fixed with tests that failed before: SMTP temporary 4xx replies treated as permanent; whole-message long-line policy mangling accented subjects; duplicate `Auto-Submitted`; a failed resend destroying the previous valid code; the test email reporting "queued" for final failures; an 80 % alert rounding to "100 %"; the dispatch rate limit counting unauthenticated hits; plus, in the app, notification state surviving logout and the verification flow not recovering from a cooldown or a lost reply. Fix commits: backend `16a7db8`, frontend `b794639`. Final backend gates after the fixes: format, lint, mypy, Alembic check, OpenAPI no drift, build and audit clean; 1177 tests pass; the only failures are the 2 `test_text_capture_persistence` tests that fail on an unrelated date mismatch.

Not done yet: provider account, domain and DNS (SPF, DKIM, DMARC), Cloud Scheduler job, bounce handling, runbook, a real send to a sandbox inbox with screenshots, and Trello updates.

## 10. Test matrix (must exist before a story is called done)

| Risk | Test |
|---|---|
| Duplicate emails | Same crossing twice and concurrent crossings produce one outbox row; two dispatchers never send one row; retry after a provider timeout does not resend a sent row |
| Wrong amounts | The alert uses the budgets-screen calculation; a golden comparison against the budgets API for the same data |
| Spam or abuse | Unverified or opted-out users never receive mail; verification and test sends are rate limited; daily cap; unsubscribe works without signing in |
| Information leaks | No email address, code or token in logs, payloads, errors or the OpenAPI contract; templates escape every value |
| Broken rendering | HTML and text snapshots; structural HTML check; a manual check in at least one webmail and one mobile client before the evidence is captured |
| Production safety | Start-up refuses the console sender or a missing sender address; the internal endpoint rejects a missing or wrong secret |
| Offline-first readiness | The detection rules are pure functions of budget, spent amount and prior state, with no email concepts inside |

## 11. Risks and open points

- **Deliverability without a domain:** mail from a shared or unauthenticated sender may land in spam. Mitigation: D2, test addresses for the demo, runbook for the DNS records.
- **Provider limits and terms:** free tiers change. Mitigation: verify before choosing (D1); the sender interface keeps the choice reversible.
- **Cloud Run background work:** mitigation is the outbox plus the scheduled sweep (D7); the best-effort immediate dispatch only improves latency.
- **Email is slower than push:** alerts can arrive a minute or more after the expense. Acceptable for budgets; in-app progress stays the real-time view.
- **Offline-first interaction:** local-only users get no email; the on-device channel in v2 closes that gap. Migration numbering must be rechecked at merge time.
- **Credentials:** the user creates any provider account and places the key in Secret Manager; nobody enters credentials on their behalf.
- **Rendering differences across clients:** keep the layout simple and tested; do not rely on modern CSS.

## 12. Evidence for the Trello card

1. The preview HTML files and the plain-text versions for each template.
2. A real send to a test inbox: screenshots of the received message (webmail and mobile) showing the logo, layout and styles, plus the raw message headers showing `multipart/alternative`.
3. The test results (backend and Flutter gates) and the concurrency test output.
4. The runbook page and the Scheduler job configuration.

## 13. Execution protocol

- One story at a time, backend before Flutter, with the test matrix rows for that story; report every gate honestly, red gates included.
- Code branches start from `develop` in each repository; this plan lives on its own docs branch. **No push, pull request or Trello write until the user says so.**
- Stop and ask before: choosing or creating a provider account, touching DNS, enabling real sending in any shared environment, changing the OpenAPI contract in a breaking way, or deviating from decisions D1-D10.
- The frontend and backend slices can run in parallel only after the API contract in section 6 is frozen.
