# TASK: Fix buildExport structure in 05-logic.js (v3 bugfix)

Repo: ~/codigos/finance-ai. The v3 build of trip/capture.html has ONE defect found in review: `buildExport()` in trip/_build/05-logic.js returns the wrong JSON structure. Everything else is fine — do not touch anything else.

## The bug

`buildExport()` currently emits **38 sections** (one per question, each reusing its parent section's id/title). The contract requires exactly **6 sections** (the SECTIONS groups s1..s6), each with its full `questions` array.

Observed: sections.length = 38; sections[0] = {id:"s1", questions:[q1_1]}; sections[1] = {id:"s1", questions:[q1_2]} — wrong.

Expected: sections.length = 6; sections[0] = {id:"s1", title:"...", questions:[q1_1, q1_2, ..., q1_5]}.

## The fix (minimal, in trip/_build/05-logic.js only)

1. Find `buildExport()`. Rewrite it to iterate the global `SECTIONS` (6 entries): for each section, map its questions to the export question objects (id, title, question, reference, answer, audio, and `page: { answers, audio }` when any sub content exists). Keep the audio/base64 logic and the meta/notes/audio_total_mb fields exactly as they are.
2. Verify `importJSON()` and `exportMD()` still match the 6-section structure (they should — they iterate generically; if importJSON assumed 38 sections, fix it to be generic).
3. Rebuild the final file with the exact same concatenation as before:
   `cat trip/_build/01-head.html trip/_build/qbank-p1.js trip/_build/qbank-p2.js trip/_build/qbank-p3.js trip/_build/04-guide.js trip/_build/pages-index.js trip/_build/pages-s1.js trip/_build/pages-s2.js trip/_build/pages-s34.js trip/_build/pages-s56.js trip/_build/figures.js trip/_build/05-logic.js trip/_build/06-tail.html > trip/capture.html`

## Rules

- Only trip/_build/05-logic.js and trip/capture.html may change.
- Do not touch the data parts, docs, or any other file.

## Self-verify (report PASS/FAIL)

1. node --check on the final inline script.
2. Stub-DOM test of buildExport: returns sections.length === 6; total questions across sections === 38; question ids match the bank; a question with a typed sub-answer carries page.answers with the text; audio arrays present (empty ok).
3. importJSON round-trip: exporting then importing the JSON restores answers and depthAnswers without error.
4. Confirm the final file still contains: openPage, closePage, pageView, data-dsub, data-drec, buildExport, exportJSON, exportMD, importJSON, clearAll.
