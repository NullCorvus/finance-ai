"""Generates ai-pipeline.svg for the Finance AI jury presentation.

Plain Python 3, no dependencies. All wording lives in the CONTENT section so it can be
edited or translated (for example to Spanish) and the SVG regenerated.

Run:  python build_ai_pipeline_svg.py [output_dir]
"""
import html
import os
import sys

OUT_DIR = sys.argv[1] if len(sys.argv) > 1 else os.path.dirname(os.path.abspath(__file__))
W, H = 1640, 900

# ----------------------------------------------------------------------------- CONTENT
TITLE = "From a sentence, a voice note or a receipt photo to a saved record"
SUBTITLE = "What happens between your input and the ledger, and what keeps it safe"

LEGEND = [  # (kind, label)
    ("ai", "AI step (external model)"),
    ("rules", "Rules (our code)"),
    ("you", "You"),
    ("prep", "Preparation"),
    ("data", "Data"),
]
LOCATIONS = [("DEVICE", "your phone or PC"), ("BACKEND", "our server"), ("EXTERNAL", "AI provider")]

LANE_LABELS = {"voice": "VOICE", "text": "TEXT", "receipt": "RECEIPT PHOTO", "manual": "MANUAL"}

VOICE = [
    dict(kind="you", tag="DEVICE", title="You speak", lines=["a short spoken", "sentence"]),
    dict(kind="prep", tag="DEVICE", title="Speech to text", lines=["Recognized on the device.", "Audio never leaves it."]),
]
VOICE_NOTE = ["After this step, voice follows the text path:", "the transcript is sent as if you had typed it."]
VOICE_ARROW_LABEL = "transcript"

TEXT = [
    dict(kind="you", tag="DEVICE", title="You type", lines=["“pasé 200 mil de", "Nequi a Bancolombia”"], italic=True),
    dict(kind="prep", tag="BACKEND", title="Build the prompt",
         lines=["Our rules, today's date and", "only your own account,", "category and source names"]),
    dict(kind="ai", tag="EXTERNAL", title="LLM reads it", badge=True,
         lines=["Returns one JSON: intent,", "confidence, amount, date,", "account, category.", "Gemini ↔ DeepSeek fallback"]),
    dict(kind="rules", tag="BACKEND", title="Ground & check",
         lines=["Matches names to your real", "data; never invents one.", "Own-account move =", "transfer, not spending.", "Unsure? Asks 1 question."]),
]

RECEIPT = [
    dict(kind="you", tag="DEVICE", title="You photograph", lines=["Camera, quick check,", "rotate if needed"]),
    dict(kind="prep", tag="BACKEND", title="Check & shrink",
         lines=["JPEG, PNG or HEIC up to", "10 MB. Rotated and resized", "in memory. Never stored."]),
    dict(kind="ai", tag="EXTERNAL", title="Vision LLM reads", badge=True,
         lines=["Returns JSON: merchant,", "date, total, currency,", "category, payment, items.", "Gemini ↔ DeepSeek fallback"]),
    dict(kind="rules", tag="BACKEND", title="Sanitize & verify",
         lines=["Blocks injected text,", "checks the arithmetic,", "warns of duplicates.", "Not a receipt? Rejected."]),
]

MANUAL = dict(kind="prep", tag="DEVICE", title="Short manual form", lines=["Always available. No AI needed."])
MANUAL_LABEL_1 = "Always available, and the fallback if the AI is down"
MANUAL_LABEL_2 = "No AI involved. Same validated save."

PANEL_LABEL = "ONE ENDING FOR EVERY PATH"
PROPOSAL = dict(kind="prep", tag="BACKEND", title="Proposal (draft)",
                lines=["Type, amount, date, account, category;", "items too for receipts. Kept for 24 h.", "Nothing financial is saved yet."])
REVIEW = dict(kind="you", tag="DEVICE", title="You review",
              lines=["Accept (one tap when the AI is confident),", "Edit, or Discard. An unclear message gets", "one short question instead."])
SAVE = dict(kind="rules", tag="BACKEND", title="Validated, atomic save",
            lines=["Same services as the manual forms:", "ownership, account and currency checks.", "All or nothing."])
LEDGER = dict(kind="data", tag="DATABASE", title="PostgreSQL ledger",
              lines=["Transaction + signed movements. Balance is derived."])
EDIT_LABEL = "Edit or answer"

SAFETY_TITLE = "WHAT KEEPS IT SAFE"
SAFETY = [
    ["The AI only proposes. It never saves anything.",
     "The prompt carries only your own account and category names.",
     "Text from messages and photos is treated as untrusted."],
    ["Voice audio is recognized on the device, never uploaded.",
     "Receipt photos are processed in memory, never stored.",
     "If the AI or a provider fails, the manual form still works."],
]

TAKEAWAY = [("ai", "AI proposes"), ("rules", "Rules decide"), ("you", "You confirm")]

# ----------------------------------------------------------------------------- STYLE
K = {
    "ai": dict(fill="#FEF3C7", stroke="#D97706", text="#78350F"),
    "rules": dict(fill="#CCFBF1", stroke="#0F766E", text="#134E4A"),
    "you": dict(fill="#EDE9FE", stroke="#6D28D9", text="#3B0764"),
    "prep": dict(fill="#F1F5F9", stroke="#94A3B8", text="#334155"),
    "data": dict(fill="#DBEAFE", stroke="#1D4ED8", text="#1E3A8A"),
}
INK, MUTED, LINE = "#0F172A", "#475569", "#475569"
BAND_FILL, BAND_STROKE = "#F8FAFC", "#E2E8F0"
FONT = "'Segoe UI', Inter, Roboto, Arial, Helvetica, sans-serif"


def esc(s):
    return html.escape(s, quote=False)


def box(id_, x, y, w, h, spec, title_dy=30, line_dy=54, lh=18):
    c = K[spec["kind"]]
    dash = ' stroke-dasharray="7 5"' if spec.get("dashed") else ""
    out = [f'<g id="{id_}">']
    out.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="12" fill="{c["fill"]}" stroke="{c["stroke"]}" stroke-width="2"{dash}/>')
    tag = spec["tag"]
    tw = len(tag) * 7.6 + 20
    px, py = x + w - tw - 10, y - 11
    out.append(f'<rect x="{px:.1f}" y="{py}" width="{tw:.1f}" height="22" rx="11" fill="#FFFFFF" stroke="{c["stroke"]}" stroke-width="1.5"/>')
    out.append(f'<text x="{px + tw / 2:.1f}" y="{py + 15}" text-anchor="middle" class="tag" fill="{c["text"]}">{esc(tag)}</text>')
    if spec.get("badge"):
        out.append(f'<circle cx="{x + 6}" cy="{y + 2}" r="15" fill="{c["stroke"]}" stroke="#FFFFFF" stroke-width="2"/>')
        out.append(f'<text x="{x + 6}" y="{y + 7}" text-anchor="middle" class="badge" fill="#FFFFFF">AI</text>')
    out.append(f'<text x="{x + 16}" y="{y + title_dy}" class="t" fill="{c["text"]}">{esc(spec["title"])}</text>')
    for i, line in enumerate(spec["lines"]):
        cls = "d di" if spec.get("italic") else "d"
        out.append(f'<text x="{x + 16}" y="{y + line_dy + i * lh}" class="{cls}" fill="{c["text"]}">{esc(line)}</text>')
    out.append("</g>")
    return "\n".join(out)


def arrow(x1, y1, x2, y2, dashed=False):
    d = ' stroke-dasharray="8 6"' if dashed else ""
    return f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{LINE}" stroke-width="2.4"{d} marker-end="url(#arr)"/>'


def band(x, y, w, h, label):
    cy = y + h / 2
    return (
        f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="14" fill="{BAND_FILL}" stroke="{BAND_STROKE}" stroke-width="1.5"/>'
        f'<text transform="translate(36,{cy}) rotate(-90)" text-anchor="middle" class="lane" fill="{MUTED}">{esc(label)}</text>'
    )


# ----------------------------------------------------------------------------- GEOMETRY
COLS = [(70, 190), (288, 225), (541, 225), (794, 225)]  # (x, width)
BAND_X, BAND_W = 16, 1015
VOICE_Y, VOICE_BH, VOICE_H = 150, 90, 72
TEXT_Y, TEXT_BH, TEXT_H = 248, 160, 140
REC_Y, REC_BH, REC_H = 416, 160, 140
MAN_Y, MAN_BH, MAN_H = 584, 80, 56
PANEL_X, PANEL_Y, PANEL_W, PANEL_H = 1066, 150, 518, 662
IN_X, IN_W = 1090, 440
BUS_X = 1045

parts = []
parts.append(f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}" role="img" aria-labelledby="ttl desc">')
parts.append(f'<title id="ttl">{esc(TITLE)}</title>')
parts.append(
    '<desc id="desc">Three input paths (text, voice, receipt photo) plus a manual form. Text and voice go through a prompt, '
    "an external LLM and a rules check. A receipt photo is shrunk in memory, read by a vision LLM and sanitized. All AI paths end in a "
    "short-lived draft proposal that the user reviews, then a validated atomic save into the PostgreSQL ledger. The manual form uses the same save.</desc>"
)
parts.append(
    "<defs>"
    '<marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">'
    f'<path d="M0,0 L10,5 L0,10 z" fill="{LINE}"/></marker>'
    "<style>"
    f"text{{font-family:{FONT};}}"
    ".t{font-size:20px;font-weight:700}"
    ".d{font-size:14.5px}"
    ".di{font-style:italic}"
    ".tag{font-size:11.5px;font-weight:700;letter-spacing:.6px}"
    ".badge{font-size:12px;font-weight:800}"
    ".lane{font-size:14.5px;font-weight:700;letter-spacing:1.6px}"
    ".note{font-size:14.5px;font-style:italic}"
    ".cap{font-size:12.5px;font-weight:700;letter-spacing:1.4px}"
    ".leg{font-size:14px}"
    "</style></defs>"
)
parts.append(f'<rect id="bg" width="{W}" height="{H}" fill="#FFFFFF"/>')

# header
parts.append(f'<text x="40" y="46" style="font-family:{FONT};font-size:30px;font-weight:700" fill="{INK}">{esc(TITLE)}</text>')
parts.append(f'<text x="40" y="76" style="font-family:{FONT};font-size:17px" fill="{MUTED}">{esc(SUBTITLE)}</text>')

# legend
lg = ['<g id="legend">']
x = 40
widths = {"ai": 190, "rules": 150, "you": 70, "prep": 120, "data": 80}
for kind, label in LEGEND:
    c = K[kind]
    lg.append(f'<rect x="{x}" y="113" width="16" height="16" rx="4" fill="{c["fill"]}" stroke="{c["stroke"]}" stroke-width="2"/>')
    lg.append(f'<text x="{x + 24}" y="126" class="leg" fill="{INK}">{esc(label)}</text>')
    x += widths[kind] + 32
x += 20
for tag, label in LOCATIONS:
    tw = len(tag) * 7.6 + 20
    lg.append(f'<rect x="{x}" y="111" width="{tw:.1f}" height="22" rx="11" fill="#FFFFFF" stroke="{MUTED}" stroke-width="1.5"/>')
    lg.append(f'<text x="{x + tw / 2:.1f}" y="126" text-anchor="middle" class="tag" fill="{INK}">{tag}</text>')
    lg.append(f'<text x="{x + tw + 10:.1f}" y="126" class="leg" fill="{MUTED}">{esc(label)}</text>')
    x += tw + 10 + len(label) * 7.4 + 34
lg.append("</g>")
parts.append("\n".join(lg))

# bands
parts.append(band(BAND_X, VOICE_Y, BAND_W, VOICE_BH, LANE_LABELS["voice"]))
parts.append(band(BAND_X, TEXT_Y, BAND_W, TEXT_BH, LANE_LABELS["text"]))
parts.append(band(BAND_X, REC_Y, BAND_W, REC_BH, LANE_LABELS["receipt"]))
parts.append(band(BAND_X, MAN_Y, BAND_W, MAN_BH, LANE_LABELS["manual"]))

# right panel
parts.append(f'<rect x="{PANEL_X}" y="{PANEL_Y}" width="{PANEL_W}" height="{PANEL_H}" rx="16" fill="{BAND_FILL}" stroke="{BAND_STROKE}" stroke-width="1.5"/>')
parts.append(f'<text x="{IN_X}" y="168" class="cap" fill="{MUTED}">{esc(PANEL_LABEL)}</text>')

# ---- connectors (drawn before boxes so boxes sit on top)
conn = ['<g id="connectors">']
# lane-internal arrows
for lane_y, lane_h, n in ((VOICE_Y + 9, VOICE_H, 2), (TEXT_Y + 10, TEXT_H, 4), (REC_Y + 10, REC_H, 4)):
    cy = lane_y + lane_h / 2
    for i in range(n - 1):
        x1 = COLS[i][0] + COLS[i][1]
        x2 = COLS[i + 1][0]
        conn.append(arrow(x1, cy, x2 - 1, cy))
# voice joins text: from "Speech to text" down into "Build the prompt"
vx = COLS[1][0] + COLS[1][1] / 2
conn.append(arrow(vx, VOICE_Y + 9 + VOICE_H, vx, TEXT_Y + 10 - 1))
conn.append(f'<text x="{vx - 9:.0f}" y="{TEXT_Y + 4}" text-anchor="end" class="note" style="font-size:13px" fill="{MUTED}">{esc(VOICE_ARROW_LABEL)}</text>')
# bus from text and receipt rules boxes to the proposal
t_cy = TEXT_Y + 10 + TEXT_H / 2
r_cy = REC_Y + 10 + REC_H / 2
p_cy = 180 + 130 / 2
conn.append(f'<line x1="{COLS[3][0] + COLS[3][1]}" y1="{t_cy}" x2="{BUS_X}" y2="{t_cy}" stroke="{LINE}" stroke-width="2.4"/>')
conn.append(f'<line x1="{COLS[3][0] + COLS[3][1]}" y1="{r_cy}" x2="{BUS_X}" y2="{r_cy}" stroke="{LINE}" stroke-width="2.4"/>')
conn.append(
    f'<path d="M{BUS_X},{r_cy} L{BUS_X},{p_cy} L{IN_X - 2},{p_cy}" fill="none" stroke="{LINE}" stroke-width="2.4" marker-end="url(#arr)"/>'
)
conn.append(f'<circle cx="{BUS_X}" cy="{t_cy}" r="4.5" fill="{LINE}"/>')
conn.append(f'<circle cx="{BUS_X}" cy="{r_cy}" r="4.5" fill="{LINE}"/>')
# panel vertical flow
P1_Y, U1_Y, S1_Y, DB_Y = 180, 364, 552, 736
conn.append(arrow(IN_X + IN_W / 2, P1_Y + 130, IN_X + IN_W / 2, U1_Y - 1))
conn.append(arrow(IN_X + IN_W / 2, U1_Y + 130, IN_X + IN_W / 2, S1_Y - 1))
conn.append(arrow(IN_X + IN_W / 2, S1_Y + 140, IN_X + IN_W / 2, DB_Y - 1))
# edit loop
loop_x = IN_X + IN_W + 20
conn.append(
    f'<path d="M{IN_X + IN_W},{U1_Y + 65} L{loop_x},{U1_Y + 65} L{loop_x},{P1_Y + 65} L{IN_X + IN_W + 2},{P1_Y + 65}" '
    f'fill="none" stroke="{LINE}" stroke-width="2.4" stroke-dasharray="3 5" marker-end="url(#arr)"/>'
)
conn.append(
    f'<text transform="translate({loop_x + 15},{(U1_Y + P1_Y) / 2 + 65}) rotate(-90)" text-anchor="middle" class="note" style="font-size:12.5px" fill="{MUTED}">{esc(EDIT_LABEL)}</text>'
)
# manual dashed arrow into the save box
m_cy = MAN_Y + 10 + MAN_H / 2
conn.append(arrow(COLS[1][0] + COLS[1][1], m_cy, IN_X - 2, m_cy, dashed=True))
conn.append(f'<text x="{COLS[2][0]}" y="{m_cy - 9}" class="note" fill="{MUTED}">{esc(MANUAL_LABEL_1)}</text>')
conn.append(f'<text x="{COLS[2][0]}" y="{m_cy + 20}" class="note" fill="{MUTED}">{esc(MANUAL_LABEL_2)}</text>')
conn.append("</g>")
parts.append("\n".join(conn))

# ---- boxes
parts.append('<g id="lane-voice">')
for i, spec in enumerate(VOICE):
    parts.append(box(f"voice-{i + 1}", COLS[i][0], VOICE_Y + 9, COLS[i][1], VOICE_H, spec, title_dy=28, line_dy=48, lh=16))
parts.append(f'<text x="{COLS[2][0]}" y="{VOICE_Y + 9 + 30}" class="note" fill="{MUTED}">{esc(VOICE_NOTE[0])}</text>')
parts.append(f'<text x="{COLS[2][0]}" y="{VOICE_Y + 9 + 52}" class="note" fill="{MUTED}">{esc(VOICE_NOTE[1])}</text>')
parts.append("</g>")

parts.append('<g id="lane-text">')
for i, spec in enumerate(TEXT):
    parts.append(box(f"text-{i + 1}", COLS[i][0], TEXT_Y + 10, COLS[i][1], TEXT_H, spec))
parts.append("</g>")

parts.append('<g id="lane-receipt">')
for i, spec in enumerate(RECEIPT):
    parts.append(box(f"receipt-{i + 1}", COLS[i][0], REC_Y + 10, COLS[i][1], REC_H, spec))
parts.append("</g>")

parts.append('<g id="lane-manual">')
manual = dict(MANUAL, dashed=True)
parts.append(box("manual-1", COLS[0][0], MAN_Y + 10, COLS[1][0] + COLS[1][1] - COLS[0][0], MAN_H, manual, title_dy=24, line_dy=44, lh=16))
parts.append("</g>")

parts.append('<g id="ending">')
parts.append(box("proposal", IN_X, P1_Y, IN_W, 130, PROPOSAL, line_dy=56, lh=20))
parts.append(box("review", IN_X, U1_Y, IN_W, 130, REVIEW, line_dy=56, lh=20))
parts.append(box("save", IN_X, S1_Y, IN_W, 140, SAVE, line_dy=56, lh=20))
parts.append(box("ledger", IN_X, DB_Y, IN_W, 60, LEDGER, title_dy=26, line_dy=46, lh=16))
parts.append("</g>")

# safety strip (fills the space under the lanes)
sf = ['<g id="safety">']
SX, SY, SW, SH = BAND_X, 688, BAND_W, 124
sf.append(f'<rect x="{SX}" y="{SY}" width="{SW}" height="{SH}" rx="14" fill="#FFFFFF" stroke="{K["rules"]["stroke"]}" stroke-width="1.5"/>')
sf.append(f'<rect x="{SX}" y="{SY + 10}" width="5" height="{SH - 20}" rx="2.5" fill="{K["rules"]["stroke"]}"/>')
sf.append(f'<text x="{SX + 26}" y="{SY + 28}" class="cap" fill="{K["rules"]["text"]}">{esc(SAFETY_TITLE)}</text>')
for col, items in enumerate(SAFETY):
    cx = SX + 26 + col * 500
    for i, item in enumerate(items):
        cy = SY + 54 + i * 25
        sf.append(f'<circle cx="{cx + 8}" cy="{cy - 5}" r="9" fill="{K["rules"]["stroke"]}"/>')
        sf.append(f'<path d="M{cx + 3.5},{cy - 5} l3,3.2 l5.5,-6" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>')
        sf.append(f'<text x="{cx + 24}" y="{cy}" class="d" style="font-size:15px" fill="{INK}">{esc(item)}</text>')
sf.append("</g>")
parts.append("\n".join(sf))

# takeaway
tk = ['<g id="takeaway">']
pw, gap = 270, 70
total = len(TAKEAWAY) * pw + (len(TAKEAWAY) - 1) * gap
x0 = (W - total) / 2
for i, (kind, label) in enumerate(TAKEAWAY):
    c = K[kind]
    x = x0 + i * (pw + gap)
    tk.append(f'<rect x="{x:.0f}" y="834" width="{pw}" height="48" rx="24" fill="{c["fill"]}" stroke="{c["stroke"]}" stroke-width="2.5"/>')
    tk.append(f'<text x="{x + pw / 2:.0f}" y="866" text-anchor="middle" style="font-family:{FONT};font-size:24px;font-weight:700" fill="{c["text"]}">{esc(label)}</text>')
    if i < len(TAKEAWAY) - 1:
        tk.append(arrow(f"{x + pw + 12:.0f}", 858, f"{x + pw + gap - 12:.0f}", 858))
tk.append("</g>")
parts.append("\n".join(tk))

parts.append("</svg>")

os.makedirs(OUT_DIR, exist_ok=True)
path = os.path.join(OUT_DIR, "ai-pipeline.svg")
with open(path, "w", encoding="utf-8") as f:
    f.write("\n".join(parts))
print("written", path)
