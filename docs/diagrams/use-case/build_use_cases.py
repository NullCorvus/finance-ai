"""Finance AI: use case diagrams in plain UML 2 notation (StarUML look), in Spanish.

One small diagram per module or requirement group, like the course reference:
a UML frame ("uc ..."), a system boundary, specific actors, individual use cases,
associations, and <<include>> / <<extend>> only where they are correct.

Black and white, stick-figure actors, no legend. Plain Python 3, no dependencies.
Each diagram is a data spec in SPECS below; add a spec to add a diagram.

Run:  python build_use_cases.py [output_dir] [spec_name ...]
"""
import html
import math
import os
import sys

W, H = 1600, 900
FONT = "'Helvetica Neue', Helvetica, Arial, sans-serif"
INK = "#000000"
SW = 1.7  # stroke width of shapes
LW = 1.4  # stroke width of lines


def esc(s):
    return html.escape(s, quote=False)


# ----------------------------------------------------------------------------- GEOMETRY
class Oval:
    def __init__(self, cx, cy, rx, ry):
        self.cx, self.cy, self.rx, self.ry = cx, cy, rx, ry

    def edge_toward(self, px, py):
        """Point on the ellipse boundary on the ray from the centre towards (px, py)."""
        dx, dy = px - self.cx, py - self.cy
        s = 1.0 / math.sqrt((dx / self.rx) ** 2 + (dy / self.ry) ** 2)
        return self.cx + dx * s, self.cy + dy * s


def shorten(x1, y1, x2, y2, start=0.0, end=0.0):
    """Trim a segment at both ends so lines leave a small gap next to shapes."""
    dx, dy = x2 - x1, y2 - y1
    n = math.hypot(dx, dy)
    ux, uy = dx / n, dy / n
    return x1 + ux * start, y1 + uy * start, x2 - ux * end, y2 - uy * end


# ----------------------------------------------------------------------------- PRIMITIVES
def line(x1, y1, x2, y2, dashed=False, arrow=False):
    d = ' stroke-dasharray="6 4"' if dashed else ""
    m = ' marker-end="url(#open)"' if arrow else ""
    return f'<line x1="{x1:.1f}" y1="{y1:.1f}" x2="{x2:.1f}" y2="{y2:.1f}" stroke="{INK}" stroke-width="{LW}"{d}{m}/>'


def oval_svg(o, lines, id_, ext_point=None):
    s = [f'<g id="{id_}">']
    s.append(f'<ellipse cx="{o.cx}" cy="{o.cy}" rx="{o.rx}" ry="{o.ry}" fill="#FFFFFF" stroke="{INK}" stroke-width="{SW}" filter="url(#shadow)"/>')
    if ext_point:
        # UML extension-points compartment: name above a divider, extension point below it
        n = len(lines)
        first = o.cy - (26 if n == 2 else 9)
        for i, t in enumerate(lines):
            s.append(f'<text x="{o.cx}" y="{first + i * 20}" text-anchor="middle" class="uc">{esc(t)}</text>')
        y_div = first + (n - 1) * 20 + 12
        half = o.rx * math.sqrt(1 - ((y_div - o.cy) / o.ry) ** 2)
        s.append(f'<line x1="{o.cx - half:.1f}" y1="{y_div:.1f}" x2="{o.cx + half:.1f}" y2="{y_div:.1f}" stroke="{INK}" stroke-width="1.3"/>')
        s.append(f'<text x="{o.cx}" y="{y_div + 15:.1f}" text-anchor="middle" class="ep">puntos de extensión</text>')
        s.append(f'<text x="{o.cx}" y="{y_div + 29:.1f}" text-anchor="middle" class="ep">{esc(ext_point)}</text>')
    elif len(lines) == 1:
        s.append(f'<text x="{o.cx}" y="{o.cy + 6}" text-anchor="middle" class="uc">{esc(lines[0])}</text>')
    else:
        for i, t in enumerate(lines):
            s.append(f'<text x="{o.cx}" y="{o.cy - 4 + i * 21}" text-anchor="middle" class="uc">{esc(t)}</text>')
    s.append("</g>")
    return "\n".join(s)


def stick_actor(x, top, stereotype, name_lines, id_):
    """UML stick figure with a bold label (and optional stereotype) underneath. Returns (svg, hand point)."""
    s = [f'<g id="{id_}">']
    s.append(f'<circle cx="{x}" cy="{top + 18}" r="17" fill="#FFFFFF" stroke="{INK}" stroke-width="{SW}"/>')
    s.append(f'<line x1="{x}" y1="{top + 35}" x2="{x}" y2="{top + 84}" stroke="{INK}" stroke-width="{SW}"/>')
    s.append(f'<line x1="{x - 27}" y1="{top + 50}" x2="{x + 27}" y2="{top + 50}" stroke="{INK}" stroke-width="{SW}"/>')
    s.append(f'<line x1="{x}" y1="{top + 84}" x2="{x - 23}" y2="{top + 120}" stroke="{INK}" stroke-width="{SW}"/>')
    s.append(f'<line x1="{x}" y1="{top + 84}" x2="{x + 23}" y2="{top + 120}" stroke="{INK}" stroke-width="{SW}"/>')
    y = top + 150
    if stereotype:
        s.append(f'<text x="{x}" y="{y}" text-anchor="middle" class="stereo">{esc(stereotype)}</text>')
        y += 24
    for t in name_lines:
        s.append(f'<text x="{x}" y="{y}" text-anchor="middle" class="actor">{esc(t)}</text>')
        y += 24
    s.append("</g>")
    return "\n".join(s), (x, top + 50)


def note(x, y, w, h, lines, id_):
    """UML note: rectangle with a folded corner."""
    f = 14
    s = [f'<g id="{id_}">']
    s.append(f'<path d="M{x},{y} L{x + w - f},{y} L{x + w},{y + f} L{x + w},{y + h} L{x},{y + h} Z" fill="#FFFFFF" stroke="{INK}" stroke-width="1.5"/>')
    s.append(f'<path d="M{x + w - f},{y} L{x + w - f},{y + f} L{x + w},{y + f}" fill="none" stroke="{INK}" stroke-width="1.3"/>')
    lh = 19
    y0 = y + (h - lh * len(lines)) / 2 + 14
    for i, t in enumerate(lines):
        s.append(f'<text x="{x + 12}" y="{y0 + i * lh:.1f}" class="note">{esc(t)}</text>')
    s.append("</g>")
    return "\n".join(s)


def frame_svg(title, fx, fy, fw, fh):
    """UML frame: outer rectangle with a pentagon heading tab ('uc <name>') at the top left."""
    tw = 22 + 9.0 * (len(title) + 4)
    th = 36
    s = ['<g id="frame">']
    s.append(f'<rect x="{fx}" y="{fy}" width="{fw}" height="{fh}" fill="#FFFFFF" stroke="{INK}" stroke-width="1.5"/>')
    s.append(
        f'<path d="M{fx},{fy} L{fx + tw},{fy} L{fx + tw},{fy + th - 12} L{fx + tw - 14},{fy + th} L{fx},{fy + th} Z" fill="#FFFFFF" stroke="{INK}" stroke-width="1.5"/>'
    )
    s.append(f'<text x="{fx + 12}" y="{fy + 24}" class="frame"><tspan style="font-weight:700">uc</tspan>  {esc(title)}</text>')
    s.append("</g>")
    return "\n".join(s)


def svg_open(title, desc, height=H):
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{height}" viewBox="0 0 {W} {height}" role="img" aria-labelledby="ttl desc">\n'
        f'<title id="ttl">{esc(title)}</title>\n<desc id="desc">{esc(desc)}</desc>\n'
        "<defs>"
        '<marker id="open" viewBox="0 0 12 12" refX="11" refY="6" markerWidth="11" markerHeight="11" orient="auto">'
        f'<path d="M1.5,1.5 L11,6 L1.5,10.5" fill="none" stroke="{INK}" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"/></marker>'
        '<filter id="shadow" x="-8%" y="-12%" width="122%" height="140%">'
        '<feGaussianBlur in="SourceAlpha" stdDeviation="2.6" result="b"/>'
        '<feOffset in="b" dx="3" dy="4" result="o"/>'
        '<feComponentTransfer in="o" result="s"><feFuncA type="linear" slope="0.28"/></feComponentTransfer>'
        '<feMerge><feMergeNode in="s"/><feMergeNode in="SourceGraphic"/></feMerge></filter>'
        "<style>"
        f"text{{font-family:{FONT};fill:{INK};}}"
        ".uc{font-size:17.5px;font-weight:700}"
        ".ep{font-size:12.5px}"
        ".actor{font-size:20px;font-weight:700}"
        ".stereo{font-size:20px}"
        ".note{font-size:14.5px}"
        ".frame{font-size:17px}"
        ".rel{font-size:16px;paint-order:stroke;stroke:#FFFFFF;stroke-width:5px;stroke-linejoin:round}"
        ".sys{font-size:24px;font-weight:700}"
        "</style></defs>\n"
        f'<rect id="bg" width="{W}" height="{height}" fill="#FFFFFF"/>'
    )


# ----------------------------------------------------------------------------- RENDERER
def render(spec):
    """Builds one SVG from a diagram spec (see SPECS)."""
    ovals = {}
    for u in spec["usecases"]:
        ovals[u["id"]] = Oval(u["cx"], u["cy"], u.get("rx", spec.get("rx", 150)), u.get("ry", 34))
    desc = (
        f'Diagrama de casos de uso UML: {spec["frame"]}. Actores: '
        + ", ".join(" ".join(a["label"]) for a in spec["actors"])
        + ". Casos de uso: "
        + ", ".join(" ".join(u["label"]) for u in spec["usecases"])
        + "."
    )
    height = spec.get("height", H)
    p = [svg_open(f'Finance AI: {spec["frame"]}', desc, height)]

    # frame and system boundary
    fx, fy, fw, fh = spec.get("frame_box", (24, 24, 1552, height - 48))
    p.append(frame_svg(spec["frame"], fx, fy, fw, fh))
    bx, by, bw, bh = spec["boundary"]
    p.append(f'<rect id="system-boundary" x="{bx}" y="{by}" width="{bw}" height="{bh}" fill="#FFFFFF" stroke="{INK}" stroke-width="{SW}" filter="url(#shadow)"/>')
    p.append(f'<text x="{bx + bw / 2}" y="{by + 38}" text-anchor="middle" class="sys">{esc(spec["system"])}</text>')

    # actors
    actors, hands = [], {}
    for a in spec["actors"]:
        svg, hand = stick_actor(a["x"], a["hand_y"] - 50, a.get("stereotype"), a["label"], f'actor-{a["id"]}')
        actors.append(svg)
        hands[a["id"]] = (hand, a.get("side", "left"))

    # associations: plain lines with a small gap beside the actor and beside the use case
    g = ['<g id="associations">']
    for actor_id, uc_id in spec["assoc"]:
        (hx, hy), side = hands[actor_id]
        o = ovals[uc_id]
        tip_x = o.cx - o.rx if side == "left" else o.cx + o.rx
        x1, y1, x2, y2 = shorten(hx, hy, tip_x, o.cy, start=34, end=4)
        g.append(line(x1, y1, x2, y2))
    g.append("</g>")
    p.append("\n".join(g))

    # relationships between use cases
    r = ['<g id="relationships">']
    for rel in spec.get("relations", []):
        src, dst = ovals[rel["src"]], ovals[rel["dst"]]
        sx, sy = src.edge_toward(dst.cx, dst.cy)
        ex, ey = dst.edge_toward(src.cx, src.cy)
        r.append(line(sx, sy, ex, ey, dashed=True, arrow=True))
        word = "«include»" if rel["kind"] == "include" else "«extend»"
        dx, dy = rel.get("lab", (0, -10))
        r.append(f'<text x="{(sx + ex) / 2 + dx:.1f}" y="{(sy + ey) / 2 + dy:.1f}" text-anchor="middle" class="rel">{word}</text>')
    r.append("</g>")
    p.append("\n".join(r))

    # use cases
    p.append('<g id="use-cases">')
    for u in spec["usecases"]:
        p.append(oval_svg(ovals[u["id"]], u["label"], f'uc-{u["id"]}', ext_point=u.get("ext")))
    p.append("</g>")

    p.extend(actors)

    # notes (UML note + dashed connector)
    for i, n in enumerate(spec.get("notes", [])):
        x, y, w, h = n["box"]
        tx, ty = n["to"]
        p.append(line(x + (0 if tx < x else w), y + h / 2, tx, ty, dashed=True))
        p.append(note(x, y, w, h, n["lines"], f"note-{i + 1}"))

    p.append("</svg>")
    return "\n".join(p)


from use_case_specs import SPECS  # noqa: E402  (the content of every diagram)


if __name__ == "__main__":
    out_dir = sys.argv[1] if len(sys.argv) > 1 else os.path.dirname(os.path.abspath(__file__))
    wanted = sys.argv[2:] or list(SPECS)
    os.makedirs(out_dir, exist_ok=True)
    for name in wanted:
        path = os.path.join(out_dir, name + ".svg")
        with open(path, "w", encoding="utf-8") as f:
            f.write(render(SPECS[name]))
        print("written", path)
