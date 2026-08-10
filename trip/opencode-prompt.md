# OpenCode Master Prompt — Finance AI Tracker (post-trip processing)

> HOW TO USE (2 options)
> - Option A (one-shot): `opencode run "$(cat trip/opencode-prompt.md)"` from the repo root
> - Option B (interactive): open `opencode` in the repo, paste everything inside the PROMPT block below,
>   and attach the trip file with `-f trip/finance-ai-trip-answers-YYYYMMDD.json` (or `opencode -f` in TUI).
> - The trip JSON must exist first: open `trip/capture.html`, answer questions, click "Export JSON",
>   and save the file as `trip/finance-ai-trip-answers-YYYYMMDD.json` (any name inside `trip/` works).

---

## PROMPT (copy from here)

You are working in the Finance AI Tracker repository (`~/codigos/finance-ai`). This is a
university pre-semester planning project (Ingeniería de Software II, UCundinamarca). The rule
is ZERO CODE: planning and documentation only. I was offline on a trip and answered a batch of
planning questions; your job is to process those answers and advance the plan.

### 1. Read these first, in order

1. `trip/*.json` — my trip answers (text + audio embedded as base64; audio is optional context).
2. `TASKS.md` — the master plan with checkboxes.
3. `docs/ALCANCE.md`, `docs/CONTEXT.md`, `docs/FEATURES.md` — scope, context, features.
4. `docs/SCHEMA.md`, `docs/schema.sql` — the locked DB design (11 entities).
5. `docs/ARCHITECTURE.md`, `docs/step5-plan.md` — architecture progress and decisions Q1-Q7.
6. `docs/guides/architecture-diagrams-guide.md` — diagram rules (label every box/arrow, TBD annotations).
7. `AGENTS.md` — follow the AIDLC workflow, but in INTERVIEWER mode (see rules).

### 2. Working rules (hard constraints)

- INTERVIEWER MODE: you are processing my decisions, not making them. If an answer is
  missing or ambiguous, ask ONE question at a time and STOP. Never invent or guess a decision.
- If a trip answer contradicts an existing doc (e.g. ALCANCE.md), flag the conflict in your
  summary and ask how to resolve it. Do not silently pick a side.
- Do not write application code. Diagrams in Mermaid only (no PNG exports yet).
- All docs in English. New or changed docs are marked `PROPOSAL` until I approve.
- Validate every Mermaid diagram before saving (syntax check).
- Update `TASKS.md` checkboxes ONLY for steps that are truly complete after this run.
- The trip JSON's text answers are the source of truth. Audio clips are optional elaboration —
  use them only if a text answer is empty.
- If the trip JSON has NO answers for a section, skip that deliverable and list it as
  "pending — needs my input" in the summary. Do not fabricate content for it.

### 3. Deliverables (in this order)

1. **Decision digest** — `docs/trip-digest.md`: a table of every trip question with
   my answer summarized in 1-2 lines, the decision status (LOCKED / PREFERENCE / OPEN),
   and the doc that records it. This is the paper trail for the professor.

2. **Stack matrix** — `docs/STACK.md` (draft, PROPOSAL): from my Section 2 answers, build a
   criteria matrix (backend × {Django, FastAPI}, DB × {PostgreSQL, SQLite}, frontend ×
   {plain HTML+JS, React, none}, AI × {OpenAI, Claude, local}). Each cell: my stated
   preference/reason, what still needs online research, and a "research needed" checklist.
   Do NOT finalize any choice I left open.

3. **Finish Step 5 (architecture)** — update `docs/ARCHITECTURE.md`:
   - Component diagram (Stage 4): 6 components (Auth, Expenses, Income, AI Agent/Tools,
     Chat, File Storage) with responsibilities and labeled arrows, from my Section 5 answers.
   - DFD 1 — register expense (Stage 5): input → AI extraction → preview → confirm/edit/discard
     → save, with the error branches I described.
   - DFD 2 — ask the AI (Stage 5): tool calls, graph generation, no-data case.
   - Run the Stage 7 validation checklist from `TASKS.md` and report pass/fail per item.

4. **Mockups** — from my Section 6 answers: 5 static screens as plain HTML/CSS (no frameworks,
   no JS logic needed) in `docs/mockups/` (upload.html, review.html, dashboard.html, chat.html,
   settings.html) + `docs/MOCKUPS.md` describing each screen. If my descriptions are thin,
   ask me instead of inventing layout details.

5. **AIDLC answers file** — `aidlc-docs/inception/requirements/requirement-verification-questions.md`
   (create the folder structure): turn my Section 4 answers into the [Answer]: tag format the
   AGENTS.md workflow expects, with multiple-choice options (A, B, C, D + X) Other where
   applicable. Mark which answers are pre-filled and which still need my confirmation.

6. **Update** `TASKS.md` checkboxes and `docs/step5-plan.md` progress to reflect completed work.

7. **Summary** — end with a table: decisions LOCKED this run / decisions still OPEN / questions
   you need from me (numbered, one per line).

### 4. Context for your questions

If you need to ask me something, follow the AGENTS.md question format (multiple choice
A/B/C/D + X) and ask only ONE question at a time. I am the architect; you are the assistant.
