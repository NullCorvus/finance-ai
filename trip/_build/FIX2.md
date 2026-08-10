# TASK: Compact the header for small phones (v3 CSS fix)

Repo: ~/codigos/finance-ai. The trip tool renders fine but on a PHONE the header stack (title + subtitle + progress + 4 buttons + Clear + chips) takes ~half the screen. Make it compact — CSS only, desktop unchanged.

## Where

The ONLY file to edit: `trip/_build/01-head.html` (its `<style>` block). Then rebuild with the exact concatenation:
`cat trip/_build/01-head.html trip/_build/qbank-p1.js trip/_build/qbank-p2.js trip/_build/qbank-p3.js trip/_build/04-guide.js trip/_build/pages-index.js trip/_build/pages-s1.js trip/_build/pages-s2.js trip/_build/pages-s34.js trip/_build/pages-s56.js trip/_build/figures.js trip/_build/05-logic.js trip/_build/06-tail.html > trip/capture.html`

## Current mobile rules (inside @media (max-width:600px))

```
.btnrow button { flex:1 1 42%; }
.qcard { padding:12px 12px; }
header h1 { font-size:18px; }
```

## Required compact rules (add/replace inside the SAME @media block; do not touch desktop styles)

1. `header { padding:8px 12px calc(8px + env(safe-area-inset-top)); }`
2. `header h1 { font-size:15px; margin:0 0 2px; }`
3. `header p { font-size:11px; margin:0 0 4px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }` (subtitle one line)
4. `#status { font-size:11px; margin-bottom:4px; }`
5. `.pbar { height:4px; margin-bottom:6px; }`
6. `.btnrow { gap:6px; }`
7. `.btnrow button { flex:1 1 auto; padding:7px 8px; font-size:12px; min-height:38px; border-radius:8px; }` (all 4 buttons in ONE row: Guide, Backup JSON, Export MD, Import)
8. The Clear button (it is inside .btnrow too — verify which element it is; if it is a full-width `.btnrow button`, give it `flex-basis:100%; min-height:32px; padding:5px; font-size:12px;` so it stays full-width but slim. If it is NOT in .btnrow, set those values directly on its class/id.)
9. `#chips button { padding:5px 10px; font-size:12px; }` (smaller pills; match the actual chips selector used in 05-logic.js if different)
10. `header { gap adjustments only via margins above — do NOT move or reorder any HTML. }`

Rules: no HTML changes, no logic changes, no other files. Desktop (>600px) must look identical.

## Self-verify (report PASS/FAIL)

1. node --check on the final inline script (rebuild keeps JS intact).
2. grep the final capture.html: the mobile block contains padding:8px 12px, font-size:15px for h1, font-size:12px for .btnrow button, flex-basis:100% for the clear/slim button.
3. grep confirms the desktop rules (header padding:14px 16px, h1 20px) are UNCHANGED.
4. The concatenation byte-count: capture.html should be smaller or equal (only CSS text changed) — report old vs new size.
