# Trip Guide — Advance Finance AI Tracker Offline

You have no internet. You still have a laptop (or phone). This folder is everything you need.

| File | What it is |
|---|---|
| `trip/capture.html` | The tool. Open it in any browser. Works 100% offline. |
| `trip/opencode-prompt.md` | The master prompt you paste into OpenCode when you are back. |
| `this file` | How to use everything, step by step. |

---

## The flow in 4 steps

```
BEFORE THE TRIP          ON THE TRIP              BACK ONLINE              RUN OPENS
─────────────────        ─────────────────        ─────────────────        ─────────
1. Open capture.html      3. Answer questions     5. Copy the JSON to      6. Paste the
2. Test: record 5s,       (text or audio).        trip/ + opencode          prompt from
   export JSON.           Auto-saves.             prompt → process          opencode-prompt.md
   Fix if broken.         4. Export JSON each     the answers with          (or run the
                          day (keep copies).      the master prompt.        command in it).
```

---

## Step 1 — Before the trip (5 minutes)

1. Open `trip/capture.html` in Chrome/Firefox (laptop) or Safari/Chrome (phone).
2. Record a 5-second test clip on any question. Hit Stop. Play it back.
3. Type one test answer. Click **Export JSON** and **Export Markdown** — check the downloads work.
4. Done. The page saves everything automatically to the device.

If you take only your phone: copy `trip/capture.html` to the phone before leaving
(USB, or open it once while online and the browser keeps it in history/downloads — better:
send yourself the file via WhatsApp/Telegram before the trip and open it from the chat).

---

## Step 2 — On the trip (whenever you have 10 minutes)

- Open `capture.html`. Text answers auto-save as you type (watch the green "Saved ✓").
- Audio: tap **● Record**, speak, tap **■ Stop**. Clips are stored on the device.
  Keep clips under 2 minutes — short and clear beats long rambles.
- Answer in ANY order. A short answer beats a perfect answer you never write.
- The free-notes box at the bottom is your brain dump: ideas, worries, questions for the professor.
- Tap the **Guide** button inside the page for the full manual (steps, storage, effort, glossary, sources).
- Every question card has **Info** (why & how) and **Open full guide** — a whole page per question:
  extended background in sections, an "Options at a glance" comparison chart where the question
  has options, **Dig deeper** sub-questions (each with text + audio answers of their own), figures
  (architecture diagrams, wireframes), and sources. No searching online needed — it is all inside.
- 38 questions, 6 sections. Each card shows WHY it matters and which doc it references —
  you can re-read those docs offline from the repo (`docs/`).

| Section | Topic | What it unlocks |
|---|---|---|
| 1 | Interface & platform (5 Q) | Your proposal for the interface decision |
| 2 | Stack pre-decision (7 Q) | `docs/STACK.md` draft + research checklist |
| 3 | Auth & data decisions (6 Q) | Locks things that survive any stack change |
| 4 | AIDLC interview pre-answers (5 Q) | Skips the workflow's question gate later |
| 5 | Architecture drafts (5 Q) | Finishes Step 5: component diagram + 2 DFDs |
| 6 | Mockups & tools (10 Q) | Step 7 screens + Step 6 tool notes |

### What each section unlocks

| Section | Advances |
|---|---|
| 1. Interface & platform | TASKS.md Step 2 (interface), Step 8 (interface TBD) |
| 2. Stack pre-decision | TASKS.md Step 2 (backend, DB, frontend, AI, deploy), Step 8 (docs/STACK.md) |
| 3. Auth & data | TASKS.md Step 4 (limits), Step 8 (auth, receipt storage, price source) |
| 4. AIDLC pre-answers | AGENTS.md workflow question gate |
| 5. Architecture drafts | TASKS.md Step 5 Stages 4-7 |
| 6. Mockups & tools | TASKS.md Step 6 + Step 7 |

## Step 3 — Export (every day, 10 seconds)

Click **Export JSON** → save as `finance-ai-trip-answers-YYYYMMDD.json`.
Do it daily: even if the device dies, your latest export survives. The Markdown export
(text only) is a nice readable backup — grab it too.
Keep everything in one folder: `trip/`.

---

## Step 4 — Back online: run OpenCode

1. Copy the exported JSON into `~/codigos/finance-ai/trip/` (laptop).
2. Open `trip/opencode-prompt.md` and follow its "HOW TO USE" section:
   - One-shot: `cd ~/codigos/finance-ai && opencode run "$(cat trip/opencode-prompt.md)"`
   - Interactive: `opencode` in the repo → paste the prompt → attach the JSON with `-f trip/finance-ai-trip-answers-YYYYMMDD.json`.
3. The prompt makes OpenCode: digest your answers → draft `docs/STACK.md` → finish
   `docs/ARCHITECTURE.md` (component diagram + 2 DFDs) → build 5 HTML mockups →
   pre-fill the AIDLC answers file → update `TASKS.md` → ask you only what is still missing.
4. It is INTERVIEWER MODE: it asks one question at a time and never invents your decisions.
   You stay the architect.

---

## Rules of the game (from your own TASKS.md)

- NO code before the semester. Planning and docs only.
- Everything is PROPOSAL until the professor confirms.
- You decide; the AI writes. Review every file it produces.
