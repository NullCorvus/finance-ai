# Evidence: real app + real backend + real Gmail delivery (2026-11-16)

Unlike `../README.md` (console sender), this run **delivered real email**. Setup: the Windows debug build of `feat/email-notifications-frontend` talking to the real backend (`feat/email-notifications-backend`) on `127.0.0.1:8000`, a throwaway PostgreSQL, Gmail SMTP from a dedicated project account (`financeaiinfor@gmail.com`, app password), and a loop calling `POST /internal/notifications/dispatch` every 15 seconds in place of Cloud Scheduler. The test user's address is the developer's own mailbox; the app only ever shows it masked.

## What happened

| Step | Evidence |
|---|---|
| Settings now has "Notificaciones"; the address is unverified, so the screen offers "Enviar código" | `01-app-unverified-send-code.jpg` |
| Tapping it sends the code (backend log: `Verification email sent`) and shows the 6-digit field with a resend countdown | `02-app-code-field.jpg` |
| The email arrives (it landed in spam, see findings) | `07-...spam-a.png`, `08-...spam-b.png` |
| The right code verifies the address and opens the switches (email, budget alerts, show amounts, test button) | `03-app-verified-switches.jpg` |
| A budget of 200.000 COP and expenses of 100.000 (50 %, nothing sent), 70.000 (85 %, the 80 % alert) and 40.000 (105 %, the 100 % alert); the API's budget view matched the email numbers at each step | outbox: `80 sent`, `100 sent`; `dispatch-loop.log` shows the scheduler sweeps that sent them |
| "Enviarme un correo de prueba" in the app answers "Enviado. Revisa tu bandeja de entrada." | `04-app-test-email-sent.jpg`; the rendered message is `05-inbox-test-email-rendered.png` |
| Earlier direct run of all four emails (code, 85 %, over limit, test) in the project inbox | `06-inbox-four-emails.png` |

## Findings (open)

1. **The code email went to spam** ("similar to messages that were identified as spam in the past"). The sender is a brand-new free Gmail account sending several identical test messages without domain authentication. This is expected to improve only with a real sending domain (SPF, DKIM, DMARC) and a transactional provider, as the runbook already says. It also means the verification flow must tell people to check spam until then.
2. **The logo shows as a broken image in that spam view.** The same template showed the logo correctly in the inbox (`05`). Gmail blocks images in messages it classifies as spam, so this is most likely a consequence of finding 1, not a template fault; re-check after the sender is authenticated.
3. The Gmail connector available to the assistant could not see this mailbox, so the code was read by the developer and passed on; arrival was confirmed by the developer's screenshots.

The unsubscribe link in these emails points to `http://localhost:8000` (the local backend), so it only works while that backend runs on the same machine.
