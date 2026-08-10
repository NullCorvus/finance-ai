# TASK: Mobile header NOT sticky + subtitle hidden (v3 CSS fix 3)

Repo: ~/codigos/finance-ai. On the phone the sticky top menu eats the screen, especially when the on-screen keyboard opens (nothing is visible). Fix: on small screens the header must NOT stay fixed — it scrolls away with the content — and the subtitle line is hidden.

## Where

The ONLY file to edit: `trip/_build/01-head.html` (its `<style>` block). Then rebuild with the exact concatenation:
`cat trip/_build/01-head.html trip/_build/qbank-p1.js trip/_build/qbank-p2.js trip/_build/qbank-p3.js trip/_build/04-guide.js trip/_build/pages-index.js trip/_build/pages-s1.js trip/_build/pages-s2.js trip/_build/pages-s34.js trip/_build/pages-s56.js trip/_build/figures.js trip/_build/05-logic.js trip/_build/06-tail.html > trip/capture.html`

## Current relevant CSS

- `header { padding:14px 16px calc(14px + env(safe-area-inset-top)); background:var(--card); border-bottom:1px solid var(--line); position:sticky; top:0; z-index:10; }` (desktop rule)
- Inside `@media (max-width:600px)` there are already the compact rules from the previous fix (padding 8px 12px, h1 15px, p 11px one-line ellipsis, status 11px, pbar 4px, .btnrow button 7px 8px / 12px / min-height 38px, .btnrow button.danger flex-basis 100% min-height 32px, #chips button 5px 10px / 12px).

## Required changes (INSIDE the same @media (max-width:600px) block; do not touch desktop styles)

1. `header { position:static; }` — the header scrolls away with the page. (Keep the existing padding/border from the desktop rule; just override position.)
2. `header p { display:none; }` — hide the subtitle line entirely on phones (replaces the one-line ellipsis rule for p in this media block).
3. Everything else stays as-is.

That is the whole task: two CSS overrides inside the mobile media query, nothing else.

## Rules

- No HTML changes, no JS changes, no other files. Desktop (>600px) keeps sticky header + visible subtitle.

## Self-verify (report PASS/FAIL)

1. grep the final capture.html: inside the mobile media block there is `position:static` for header and `display:none` for `header p`.
2. grep confirms the DESKTOP header rule still has `position:sticky`.
3. node --check on the final inline script.
4. Report file size before/after (should be a small CSS-only delta).
