# -*- coding: utf-8 -*-
"""Guía de estudio en PDF para leer en el celular.

Una página (o dos, si el guion es largo) por diapositiva: la imagen de la
diapositiva y debajo lo que se puede decir al jurado, con el tiempo, la idea
clave, los avisos y la frase para pasar a la siguiente.

Los textos salen de las notas de estudio de la versión interactiva
(interactive/index.html, <template class="notes">), así que basta editar
allí y volver a ejecutar:

    python build-study-guide.py            # exporta las diapositivas y genera el PDF
    python build-study-guide.py --images DIR   # reutiliza imágenes ya exportadas (1.png … 14.png)

Necesita Python con Pillow, Node (npx slidev) y Google Chrome.
"""
import argparse
import base64
import html
import io
import re
import subprocess
import sys
import tempfile
from pathlib import Path

from PIL import Image

HERE = Path(__file__).resolve().parent
CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
OUT_PDF = HERE / "Finance-AI-guia-de-estudio.pdf"
KEEP_B = re.compile(r"<(?!/?b>)[^>]+>")  # se conserva solo <b>


def tidy(fragment: str) -> str:
    return KEEP_B.sub("", fragment).strip()


def read_scenes():
    src = (HERE / "interactive" / "index.html").read_text(encoding="utf-8")
    scenes = []
    for m in re.finditer(r'<section class="scene" id="(s-[\w-]+)"([^>]*)>', src):
        sid, attrs = m.group(1), m.group(2)
        title = html.unescape(re.search(r'data-title="([^"]*)"', attrs).group(1))
        end = src.index("</section>", m.end())
        block = src[m.end():end]
        t = re.search(r'<template class="notes"([^>]*)>(.*?)</template>', block, re.S)
        meta, items = {}, []
        if t:
            for k, v in re.findall(r'data-(\w+)="([^"]*)"', t.group(1)):
                meta[k] = html.unescape(v)
            for p in re.finditer(r'<p([^>]*)>(.*?)</p>|<ol class="demo">(.*?)</ol>', t.group(2), re.S):
                if p.group(3) is not None:
                    steps = [tidy(x) for x in re.findall(r"<li>(.*?)</li>", p.group(3), re.S)]
                    items.append(("demo", None, steps))
                    continue
                a, body = p.group(1), tidy(p.group(2))
                if 'class="tip"' in a:
                    items.append(("tip", None, body))
                elif 'class="tr"' in a:
                    items.append(("tr", None, body))
                else:
                    s = re.search(r'data-s="(\d+)"', a)
                    items.append(("say", int(s.group(1)) if s else None, body))
        scenes.append({"id": sid, "title": title, "meta": meta, "items": items,
                       "backup": "data-group=\"backup\"" in attrs})
    return scenes


def jpeg_data_uri(png: Path) -> str:
    im = Image.open(png).convert("RGB")
    im.thumbnail((1000, 1000))
    buf = io.BytesIO()
    im.save(buf, "JPEG", quality=82, optimize=True)
    return "data:image/jpeg;base64," + base64.b64encode(buf.getvalue()).decode()


CSS = """
@page { size: 105mm 225mm; margin: 6mm 7mm; }
* { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
html { font-family: 'Segoe UI', system-ui, sans-serif; color: #1b2430; font-size: 10.3pt; line-height: 1.4; }
html, body { background: #fff; }
body { margin: 0; }
h1, h2, p, ul, ol { margin: 0; padding: 0; }
a { color: inherit; text-decoration: none; }
.pg { break-after: page; }
.pg:last-child { break-after: auto; }
p { break-inside: avoid; }
.top { display: flex; align-items: baseline; gap: 2.5mm; margin-bottom: 2.5mm; }
.num { font-size: 21pt; font-weight: 800; color: #6b8e00; line-height: 1; letter-spacing: -.03em; }
.num small { font-size: 10pt; font-weight: 700; color: #8b95a3; margin-left: .5mm; }
.top h2 { flex: 1; font-size: 14.5pt; line-height: 1.12; font-weight: 800; letter-spacing: -.02em; }
.time { padding: .6mm 2.4mm; border-radius: 99px; background: #eef0f3; font-size: 8.5pt; font-weight: 650; color: #4a5565; white-space: nowrap; }
img { display: block; width: 88%; margin: 0 auto 2.4mm; border-radius: 2mm; border: .3mm solid #dfe3e8; }
.key, .when { margin-bottom: 2.4mm; padding: 2mm 2.8mm; border-radius: 2.2mm; background: #e9f2d8; color: #3f5200; font-weight: 650; font-size: 10pt; line-height: 1.35; }
.when { background: #ece9ff; color: #3b2fb0; }
.key b, .when b { display: block; margin-bottom: .4mm; font-size: 7.6pt; letter-spacing: .12em; text-transform: uppercase; color: #6b8e00; }
.when b { color: #5b4bdb; }
.say { padding-left: 7mm; position: relative; margin: 0 0 1.6mm; }
.say i { position: absolute; left: 0; top: .6mm; width: 4.8mm; height: 4.8mm; border-radius: 50%; background: #6b8e00; color: #fff; font-style: normal; font-size: 7.6pt; font-weight: 800; text-align: center; line-height: 4.8mm; }
.say.plain { padding-left: 0; }
ol.demo { margin: 0 0 2.4mm 5mm; padding: 0; list-style: decimal; }
ol.demo li { margin-bottom: 1.2mm; padding-left: 1mm; }
ol.demo li::marker { color: #6b8e00; font-weight: 800; }
.tip { margin: 2.4mm 0 1.6mm; padding: 1.8mm 2.6mm; border-radius: 2.2mm; background: #fdf0cf; color: #6b5200; font-size: 9pt; line-height: 1.35; }
.tip b { color: #8a6a00; text-transform: uppercase; font-size: 7.6pt; letter-spacing: .1em; margin-right: 1mm; }
.tr { margin-top: 1.6mm; color: #4d6600; font-size: 9.2pt; font-style: italic; }
.tr b { font-style: normal; text-transform: uppercase; font-size: 7.6pt; letter-spacing: .1em; color: #6b8e00; margin-right: 1mm; }
/* portada y listas */
.cover h1 { font-size: 30pt; font-weight: 800; letter-spacing: -.04em; line-height: 1; margin: 4mm 0 2mm; }
.cover h1 span { color: #6b8e00; }
.cover .sub { font-size: 11.5pt; color: #4a5565; margin-bottom: 4mm; }
.cover .hint { padding: 2.4mm 3mm; border-radius: 2.4mm; background: #f3f5f8; font-size: 9.4pt; color: #4a5565; margin-bottom: 4mm; }
.cover h3, .end h3 { margin: 4mm 0 1.6mm; font-size: 8.4pt; letter-spacing: .13em; text-transform: uppercase; color: #6b8e00; }
table { width: 100%; border-collapse: collapse; font-size: 9.6pt; }
td { padding: 1.5mm 0; border-bottom: .25mm solid #e3e6ea; vertical-align: top; }
td.n { width: 6mm; font-weight: 800; color: #6b8e00; }
td.t { width: 14mm; text-align: right; color: #6b7482; white-space: nowrap; }
tr.sum td { font-weight: 800; border-bottom: 0; }
.end ul { list-style: none; }
.end li { position: relative; padding: 1.2mm 0 1.2mm 6mm; border-bottom: .25mm solid #eef0f3; }
.end li::before { content: ""; position: absolute; left: 0; top: 2.4mm; width: 3.2mm; height: 3.2mm; border: .4mm solid #6b8e00; border-radius: 1mm; }
.keys { display: grid; grid-template-columns: auto 1fr; gap: 1mm 3mm; font-size: 9.4pt; }
.keys b { color: #4d6600; font-family: 'Cascadia Code', Consolas, monospace; font-size: 9pt; }
"""

CHECKLIST = [
    "Ensayar las nueve diapositivas con cronómetro.",
    "Confirmar que la versión de la app que se mostrará corresponde al alcance descrito.",
    "Preparar cuenta sintética, dos cuentas de dinero, categorías y recibo de ejemplo.",
    "Comprobar servidor, base de datos y conexión al proveedor de IA.",
    "Ensayar la corrección de un campo y comprobar la actualización del historial y del saldo.",
    "Preparar una grabación completa de respaldo.",
    "Actualizar las cifras y sus fechas si se realiza una verificación nueva.",
]
KEYS = [
    ("→ o Espacio", "avanzar (una pulsación por diapositiva; los pasos se encadenan solos)"),
    ("A  B  C  D", "abrir el respaldo técnico (Esc para volver al mismo punto)"),
    ("N", "mostrar u ocultar las notas de estudio (solo para ensayar)"),
    ("Mayús+P", "recorrido automático · Mayús+M modo manual"),
    ("F", "pantalla completa · V reduce o activa el movimiento"),
]


def build_html(scenes, images):
    main = [s for s in scenes if not s["backup"]]
    out = ['<!doctype html><html lang="es"><head><meta charset="utf-8"><title>Finance AI · Guía de estudio</title>',
           f"<style>{CSS}</style></head><body>"]

    # portada con índice
    rows = []
    for i, s in enumerate(main, 1):
        t = s["meta"].get("time", "")
        t = t if t[:1].isdigit() else ("demo" if s["id"] == "s-demo" else "")
        rows.append(f'<tr><td class="n">{i}</td><td><a href="#{s["id"]}">{html.escape(s["title"])}</a></td><td class="t">{t}</td></tr>')
    rows.append('<tr class="sum"><td></td><td>Exposición</td><td class="t">6:00</td></tr>')
    brows = "".join(
        f'<tr><td class="n">{chr(65 + i)}</td><td><a href="#{s["id"]}">{html.escape(s["title"].split("· ", 1)[-1])}</a></td><td class="t"></td></tr>'
        for i, s in enumerate([s for s in scenes if s["backup"]]))
    out.append(f"""<section class="pg cover">
  <p class="sub" style="margin-bottom:0;color:#6b8e00;font-weight:800;letter-spacing:.14em;text-transform:uppercase;font-size:8.6pt">Guía de estudio</p>
  <h1>Finance <span>AI</span></h1>
  <p class="sub">Qué decir al jurado, diapositiva por diapositiva.</p>
  <p class="hint">Cada página trae la diapositiva y debajo el guion. Los círculos con número marcan en qué paso de la animación se dice cada parte. Toca un título del índice para ir a esa página.</p>
  <h3>Diapositivas</h3><table>{''.join(rows)}</table>
  <h3>Respaldo para preguntas</h3><table>{brows}</table>
</section>""")

    for idx, s in enumerate(scenes):
        meta = s["meta"]
        if s["backup"]:
            num = chr(65 + idx - len(main))
            numhtml = f'<span class="num">{num}</span>'
            title = s["title"].split("· ", 1)[-1]
        else:
            numhtml = f'<span class="num">{idx + 1}<small>/{len(main)}</small></span>'
            title = s["title"]
        time = meta.get("time", "")
        timehtml = f'<span class="time">{"⏱ " + time if time[:1].isdigit() else time}</span>' if time else ""
        body = []
        if meta.get("when"):
            body.append(f'<p class="when"><b>Úsala si preguntan por</b>{html.escape(meta["when"])}</p>')
        if meta.get("key"):
            body.append(f'<p class="key"><b>Idea clave</b>{html.escape(meta["key"])}</p>')
        for kind, step, text in s["items"]:
            if kind == "say":
                chip = f"<i>{step}</i>" if step else ""
                body.append(f'<p class="say{"" if step else " plain"}">{chip}{text}</p>')
            elif kind == "demo":
                body.append('<ol class="demo">' + "".join(f"<li>{x}</li>" for x in text) + "</ol>")
            elif kind == "tip":
                body.append(f'<p class="tip"><b>Ojo</b>{text}</p>')
            elif kind == "tr":
                body.append(f'<p class="tr"><b>Para pasar a la siguiente</b>{text}</p>')
        out.append(f'<section class="pg" id="{s["id"]}"><div class="top">{numhtml}<h2>{html.escape(title)}</h2>{timehtml}</div>'
                   f'<img src="{images[idx]}" alt="Diapositiva {idx + 1}">{"".join(body)}</section>')

    out.append('<section class="pg end"><h3>Antes de presentar</h3><ul>'
               + "".join(f"<li>{html.escape(c)}</li>" for c in CHECKLIST)
               + '</ul><h3>Teclas de la versión interactiva</h3><div class="keys">'
               + "".join(f"<b>{html.escape(k)}</b><span>{html.escape(v)}</span>" for k, v in KEYS)
               + "</div></section></body></html>")
    return "".join(out)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--images", help="carpeta con 1.png … N.png ya exportadas")
    ap.add_argument("--chrome", default=CHROME)
    ap.add_argument("--html", help="guarda también la página HTML intermedia (para revisarla)")
    args = ap.parse_args()

    scenes = read_scenes()
    tmp = Path(tempfile.mkdtemp(prefix="fa-guide-"))
    if args.images:
        img_dir = Path(args.images)
    else:
        img_dir = tmp / "slides"
        subprocess.run(["npx", "slidev", "export", "slides.md", "--format", "png", "--output", str(img_dir / "slide"),
                        "--timeout", "120000", "--executable-path", args.chrome], cwd=HERE, check=True, shell=True,
                       stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        img_dir = img_dir / "slide"
    images = []
    for i in range(1, len(scenes) + 1):
        png = img_dir / f"{i}.png"
        if not png.exists():
            sys.exit(f"Falta la imagen {png}")
        images.append(jpeg_data_uri(png))

    page = tmp / "guia.html"
    page.write_text(build_html(scenes, images), encoding="utf-8")
    if args.html:
        Path(args.html).write_text(page.read_text(encoding="utf-8"), encoding="utf-8")
    subprocess.run([args.chrome, "--headless", "--disable-gpu", "--no-pdf-header-footer",
                    f"--print-to-pdf={OUT_PDF}", page.as_uri()], check=True, timeout=180,
                   stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    print(f"Listo: {OUT_PDF} ({OUT_PDF.stat().st_size // 1024} KB)")


if __name__ == "__main__":
    main()
