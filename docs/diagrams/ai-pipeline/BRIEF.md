# Card: Diagram — AI pipeline (x1)

**Where it goes:** main presentation (one of the three strongest visuals, with the Architecture diagram and the capture-flow slide).
**Starting point:** a working prototype already exists in this folder. The job is to review it, make it final, and get it verified. It is not a blank page.
**Rough effort (estimate, not measured):** 2–3 hours, mostly checking facts and polishing.
**Files here:** `ai-pipeline.svg` (editable) · `ai-pipeline.png` (2×, for previews) · `build_ai_pipeline_svg.py` (regenerates the SVG from the wording).

---

## 1. Purpose

One glance must answer four questions:

1. Where does the AI run?
2. What does it receive and what does it return?
3. What is checked before anything is saved?
4. Who has the last word?

The jury is mixed. Non-technical professors need the story (three ways in, the AI proposes, you confirm). The technical professors need correctness (what runs where, what is validated).

## 2. The one message

**AI proposes. Rules decide. You confirm.**

If a viewer remembers only that, the diagram worked.

## 3. What the diagram must show

1. **Three input paths plus the manual form:** text, voice, receipt photo, and a manual form that never uses AI.
2. **The same rhythm on every AI path:** input → preparation → AI step → rules check.
3. **Voice has no AI step of its own.** Speech is turned into text on the device, then follows the text path.
4. **One shared ending for every path:** draft proposal → you review (accept, edit, discard) → validated atomic save → ledger.
5. **Where each step runs.** Every box carries a tag: DEVICE, BACKEND, or EXTERNAL (AI provider).
6. **What is and is not AI.** The two AI boxes are visually distinct (amber, "AI" badge) and are the only EXTERNAL ones.
7. **What keeps it safe.** The "What keeps it safe" strip.

## 4. Facts to keep accurate

Do not change wording without checking the source. Paths are relative to the repos.

| Claim on the diagram | Verify in |
|---|---|
| Prompt = our rules + today's date + the user's own account, category and income-source names; the message is treated as untrusted | `finance-ai-backend/src/finance_ai/capture/prompt.py` |
| LLM returns one JSON (intent, confidence, amount, currency, date, description, account, category); temperature 0; Gemini and DeepSeek with fallback between them | `capture/gateway.py`, `capture/prompt.py` |
| Grounding: names matched to the user's real data, never invented; own-account moves are transfers; one clarification question; confidence ≥ 0.8 = one tap | `capture/grounding.py` |
| Draft kept 24 h; nothing financial saved before confirm; confirm uses the same expense / income / transfer services as the manual forms | `capture/service.py` |
| Voice recognized on the device, audio never uploaded, transcript goes through the text flow | `finance-ai-frontend/docs/offline-voice-capture.md` |
| Receipt: JPEG / PNG / HEIC up to 10 MB, checked, rotated and resized in memory, never stored | `receipts/router.py`, `receipts/guards.py`, `receipts/preprocessor.py` |
| Vision JSON: merchant, date, total, currency, category, payment method, items; falls back to a manual draft if extraction fails | `receipts/schemas.py` (`RawExtractionDTO`), `receipts/router.py` |
| Sanitizer: injected-text filter, arithmetic check, "not a receipt" rejected, duplicate warning | `receipts/sanitizer.py`, `receipts/service.py` |
| Ledger: transaction + signed movements, balance derived | `finance-ai/docs/SCHEMA.md`, `db/models/transactions.py` |

## 5. Leave out

Rate limits, timeouts, JSON repair, token limits, model version names (write "Gemini ↔ DeepSeek"), the legacy `/receipts/scan` endpoint, class and function names, database columns, status enum names. All of that belongs in backup slides, not here.

## 6. Design requirements

- **Format:** 16:9-friendly (prototype is 1640×900), white background, readable from the back row. If something is too small when projected, cut words. Do not shrink the font.
- **Color carries meaning** (see the legend on the diagram): amber = AI, teal = our rules, violet = you, grey = preparation, blue = data. Do not add colors. Tags carry the location, so color is never the only signal.
- **Same vocabulary as the Architecture diagram** (component names). Coordinate with whoever draws it.
- **Language:** the deck language is not decided yet. All wording sits in the CONTENT section at the top of `build_ai_pipeline_svg.py`, so a Spanish version is a text edit plus one command.
- **Slidev:** the SVG groups have ids (`lane-voice`, `lane-text`, `lane-receipt`, `lane-manual`, `ending`, `safety`, `takeaway`) so the lanes can be revealed one click at a time.

## 7. Deliverables

1. `ai-pipeline.svg` (final, editable)
2. `ai-pipeline.png` at 2×
3. Spanish versions of both, if the deck is in Spanish

## 8. Acceptance checklist

- [ ] Every box has the right DEVICE / BACKEND / EXTERNAL tag.
- [ ] Only the two AI boxes are EXTERNAL.
- [ ] Voice shows no cloud step.
- [ ] Nothing is saved before "You review" in the flow.
- [ ] The manual form reaches the same save.
- [ ] Every claim is traced to a source in section 4, and a second person has checked it against the code.
- [ ] A non-technical teammate can explain it back in 30 seconds.
- [ ] Readable on a large screen (test it projected, not on a laptop).
- [ ] Names match the Architecture diagram.

## 9. Open items: do not print these as fact

- **Which LLM is primary:** the config defaults to Gemini, but the text gateway's own docstring says "DeepSeek first", and the default Gemini model name differs between `core/config.py` and `compose.yaml`. The diagram says "Gemini ↔ DeepSeek fallback" on purpose. Replace it only once someone confirms what the demo actually runs.
- **One-tap accept:** the 0.8 confidence rule is verified for text capture only. It was not checked for receipts, so the Review box states it in general terms. Check before the jury sees it.
- **Receipt "Camera, quick check, rotate":** taken from the client's screens (camera, pre-check, review). Confirm the wording against the running app.

## 10. How to edit

- The SVG is plain text. Edit it in a code editor, or import it into Figma or Inkscape (both keep it editable).
- To regenerate after changing the wording: `python build_ai_pipeline_svg.py <output folder>` (Python 3, no dependencies).
- The prototype was rendered with Edge headless to check layout. PNG export: `msedge --headless=new --force-device-scale-factor=2 --window-size=1640,900 --screenshot=out.png file:///.../ai-pipeline.svg`.
