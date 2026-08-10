# TASK: v3 — add the full "page view" per question (with figures + charts) to the offline trip tool

Repo: ~/codigos/finance-ai. The single-file offline tool `trip/capture.html` (v2) has 38 questions with Info panels and option cards. NEW: every question gets an "Open full guide" button that opens a dedicated in-app PAGE (full-height view with own scroll + back button) containing: intro, titled sections, sub-questions (each answerable with text + audio), figures (inline SVG), and sources. Plus auto-generated comparison charts for option tables.

## Parts (in trip/_build/) — read them all first

- `01-head.html` — head + CSS + skeleton + open `<script>` (do NOT modify)
- `qbank-p1.js` + `qbank-p2.js` + `qbank-p3.js` — `const SECTIONS = [...]`, 38 questions (VERIFIED, do NOT modify)
- `04-guide.js` — `const GUIDE = {...}` (do NOT modify)
- `pages-index.js` — `const PAGES = {};`
- `pages-s1.js`, `pages-s2.js`, `pages-s34.js`, `pages-s56.js` — `PAGES.qX_Y = {...}` (VERIFIED content, do NOT modify)
- `figures.js` — `PAGES.qX_Y.figures = [{caption, svg}]` on 8 pages (q5_2, q5_3, q5_4, q6_1..q6_5) (do NOT modify)
- `06-tail.html` — closing tags

Page shape: { intro, sections: [{h, b}] (b uses \n\n paragraph breaks), sub: [{q, info?}], links: [...], figures?: [{caption, svg}] }.

## Deliverable: rewrite trip/_build/05-logic.js

Base: the CURRENT logic in trip/capture.html (read it first — it already has: localStorage autosave `fat_trip_v1` = {answers, notes, clipMeta}, IndexedDB `fat-trip-db`/`clips`, render, details.help with option cards, chips, progress bar, MediaRecorder, exportJSON/exportMD, importJSON, clearAll, guide modal, storage-health warning, esc(), init). Keep ALL of it and add:

1. PAGE VIEW: in each question card add a button "Open full guide" (only when PAGES[q.id] exists — all 38 have one). Clicking shows `#pageView` (a full-height div replacing `#main`; `#main` hidden): header with back button ("← All questions") + question title (from SECTIONS); body scrollable:
   - intro paragraph
   - one block per section: `<h4>` + paragraphs (split b on "\n\n")
   - "Dig deeper" — one block per sub-question: sub question text, optional hint (dim), textarea (data-dsub="qid|i"), record button (data-drec="qid|i") + timer + clips
   - "Figures" — for each figure: caption + inline `<div>` with the svg string (inject via innerHTML, NOT escaped — it is trusted data)
   - "Sources" — links list
   Back button returns to #main (state preserved).
2. AUTO COMPARISON CHARTS: in the page view, if the question has `options` (from SECTIONS data: q1_2, q2_1..q2_5, q3_1..q3_3, q3_5, q4_5), render a small chart section "Options at a glance" BEFORE "Dig deeper": for each option a horizontal bar whose width is proportional to effort rank (Low=25%, Medium=50%, High=75%, "2 weeks+"=100%; map: complexity Low/Medium/High and effort strings containing 'Low'/'Medium'/'High'/'week' — derive a 0-100 value) colored by demo risk (Low=#2ecc71, Medium=#f1c40f, High=#e74c3c), with label "A) name — effort · risk". Pure inline divs + CSS widths (no canvas). Keep it compact.
3. SUB-ANSWER STATE: extend the localStorage payload with `depthAnswers` = { "q1_1": ["", "answer", ...] } (array per sub index; backward-compatible default {}). Debounced persist. Sub-question audio clips: reuse the recorder with clip key prefix `d:` (key "qid:d<i>:<cid>") in the same IndexedDB store; clipMeta key "qid:d<i>"; display in that sub-question's clips list with play/delete.
4. EXPORT JSON: per question add `page: { answers: [...], audio: [{file, duration_s, recorded, size_bytes, base64}] }` when any content exists. Export MD: under each question append depth sub answers as "- <sub-question> → <answer>". IMPORT restores depthAnswers + d: clips. CLEAR ALL wipes them.
5. Progress bar/counter: unchanged (main questions, 38).
6. Do NOT hardcode 38 or 29. Derive from data.

## Concatenate (run exactly)

cat trip/_build/01-head.html trip/_build/qbank-p1.js trip/_build/qbank-p2.js trip/_build/qbank-p3.js trip/_build/04-guide.js trip/_build/pages-index.js trip/_build/pages-s1.js trip/_build/pages-s2.js trip/_build/pages-s34.js trip/_build/pages-s56.js trip/_build/figures.js trip/_build/05-logic.js trip/_build/06-tail.html > trip/capture.html

## Rules

- Only `trip/capture.html` and `trip/_build/05-logic.js` may change. Do NOT touch the other _build parts, docs/, AGENTS.md, TASKS.md, trip/TRIP-GUIDE.md, trip/opencode-prompt.md.
- Single self-contained file: no runtime network, no fonts/CDN. URLs inside PAGES links are data — fine.
- Keep existing function names (openGuide, closeGuide, exportJSON, exportMD, importJSON, clearAll, buildExport) and the dark design language (:root colors).
- The page view must work on small phones: max-width container, scrollable body, back button sticky.

## Self-verify before finishing (report PASS/FAIL)

1. node --check on the final inline script.
2. PAGES has exactly 38 keys matching the 38 question ids; every page has intro/sections/sub/links; 8 pages have figures.
3. Stub-DOM smoke (like v2): render builds 38 cards each with "Open full guide"; opening the page view renders intro + N sections + N sub blocks + figures (svg present) + sources; typing in a sub textarea persists into depthAnswers; exportJSON includes page answers; clearAll wipes them; back button restores #main.
4. Final file contains: openPage, closePage, pageView, data-dsub, data-drec, buildExport, exportJSON, exportMD, importJSON, clearAll, openGuide, closeGuide.
5. No '29' or '38' hardcoded in logic strings.
