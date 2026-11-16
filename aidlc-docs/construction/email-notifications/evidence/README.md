# Evidence: email notifications (sandbox run, 2026-11-16)

What this shows: the real services, real PostgreSQL and real templates producing the emails of the notification flow end to end. **Delivery was replaced by the console sender** (it writes the message to disk instead of sending it), because no provider account or domain exists yet. This is therefore evidence that the emails are built, decided and queued correctly and look right, **not** evidence of delivery to a real mailbox. That test (`scripts/send_test_email.py` with an SMTP sandbox inbox) is still open and needs an account the user creates.

## Files

| File | What it is |
|---|---|
| `end-to-end-run.txt` | Transcript of the run: opt-in, verification code, spending crossing 85 % and then the limit, dispatch, test email, unsubscribe. Shows the outbox rows at each step |
| `Tu-c-digo-de-verificaci-n-...-light/dark.png` | The verification code email |
| `Llevas-el-85-de-tu-presupuesto-...-light/dark.png` | The budget alert at 85 % (the 80 % threshold) |
| `Superaste-el-l-mite-...-light/dark.png` | The alert after the limit was passed (the 100 % threshold) |
| `Correo-de-prueba-...-light/dark.png` | The test email |
| `sample-budget-alert-100.eml` | The raw message: multipart/alternative (text and HTML), inline logo, `Auto-Submitted`, `List-Unsubscribe` and `List-Unsubscribe-Post` |

Screenshots are the generated HTML opened in Chrome at 660 px wide, in light and dark mode. Data is synthetic (`persona.demo@example.com`).

## What the transcript demonstrates

1. A 10.000 expense before opting in queues nothing.
2. The code email is sent to the masked address; only a hash of the code is stored; the right code verifies the address and turns email on.
3. Expenses reaching 510.000 of a 600.000 budget queue exactly one `80` alert; the dispatcher sends it.
4. A further 150.000 expense (over the limit) queues one `100` alert; the dispatcher sends it. Nothing is queued twice.
5. The test email is delivered through the same path.
6. The unsubscribe link: opening it changes nothing, confirming it turns email off, and a later expense queues nothing.

## Found by this run

The raw message showed `List-Unsubscribe` rewritten as an RFC 2047 encoded word, which mail clients do not read in that header. Fixed in backend commit `bbb13bc` with a test that failed before the fix. The screenshots and `.eml` here were regenerated after the fix.
