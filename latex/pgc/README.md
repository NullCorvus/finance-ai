# Formato PGC — LaTeX

1:1 LaTeX conversion of `Formato PGC.docx` inside this repo. Source of truth is **Formato PGC**, not Lineamientos (guide only).

## Sources

- **Primary (outside repo):** `/home/d3ad/Documents/David12/Software/Documents/Formato PGC.docx` (95K, OOXML) — the document to clone.
- **Visual reference:** `Formato PGC.pdf` (155K, 2 pages, Letter) — pixel target.
- **Guide only:** `LineamientosPGC-CEvaluadores2026-1.pdf` — not converted, only sanity-check.
- **In-repo reference copy:** `latex/pgc/reference/Formato PGC.docx` + `.pdf`.

## What is inside

- `main.tex` — single-file template (preamble + 3 tables + title block). Tables mirror the 3 `w:tbl` in `word/document.xml` with exact rows/columns: Table 0 (15 rows, grid 4131+4131, DATOS GENERALES), Table 1 (15 rows, grid 8262, ESTRUCTURA), Table 2 (16 rows, grid 562+7701, PRODUCTOS ESPERADOS).
- `assets/logo-universidad.jpg` — `word/media/image1.jpeg` verbatim (771×248, UDeC banner).
- `assets/logo-facultad.jpg` — `word/media/image2.jpeg` verbatim (561×53, thin horizontal line — replicated in LaTeX as a rule for crispness, asset preserved).
- `assets/logo-footer.png` — `word/media/image3.png` verbatim (250×221, footer triangle — replicated as TikZ fill).
- `reference/` — reference copies for diff.

No `sections/` split — Formato PGC is a form (tables + headings), not a chapter book. Content lives in `main.tex` so row order stays 1:1 with `w:tbl` order.

## Measurements (extracted via unzip/pdfinfo)

- **Paper:** Letter 612×792 pt (12240×15840 twips) — confirmed `w:pgSz` + `pdfinfo`.
- **Margins sect 1 (page 1):** top 1960 twips (3.46 cm), right 1580 (2.79 cm), bottom 1580 (2.79 cm), left 1600 (2.82 cm), header 629 (1.11 cm), footer 707 (1.25 cm).
- **Margins sect 2 (pages 2+):** top 1380 (2.43 cm), bottom 280 (0.49 cm), header/footer 0 (content-driven).
- **Geometry used:** `top=1.15cm, bottom=2.79cm, left=2.82cm, right=2.79cm, headheight=2.55cm, headsep=0.35cm, footskip=1.45cm, includehead, includefoot` — maps twips to LaTeX with extra headheight to avoid fancyhdr warning.
- **Fonts:** `fontTable.xml` Arial + Arial MT + Calibri Light + Times New Roman; body style `Normal` rFonts Arial MT, headings Arial Bold; base `w:sz 22` (11 pt). LaTeX: `helvet` (Arial clone), `fontenc T1`, `inputenc utf8`, `babel spanish`.
- **Borders:** `w:tblBorders single sz 4` (0.5 pt) black on all sides + insideH/V — `\arrayrulewidth 0.5pt`.
- **Header:** `word/header1.xml` has 2 `wp:anchor behindDoc` images (image1 2647823×851534 EMU ≈ 7.35×2.36 cm near (1.95,1.11) cm, image2 2772918×261877 EMU ≈ 7.7×0.72 cm). Footer: `word/footer1.xml` image3 1589404×1408430 EMU + `PAGE` field in white textbox. Header2/Footer2 empty.

## Build

Requires `texlive-latex-recommended`, `texlive-latex-extra`, `texlive-fonts-recommended`, `texlive-lang-spanish`, `latexmk`.

```bash
cd latex/pgc
latexmk -pdf main.tex        # or: make pdf
# output: latex/pgc/main.pdf (2 pages, Letter)
make clean                   # remove aux/log/out/toc/etc.
```

Verify:

```bash
pdfinfo main.pdf | grep "Page size"   # → 612 x 792 pts (letter)
pdftotext -layout main.pdf - | head
# side-by-side check vs reference/Formato PGC.pdf
```

## Verification checklist

- [x] `unzip -l` + `pdfinfo` Letter confirmed, recorded above.
- [x] Both JPEGs + PNG extracted verbatim to `assets/`, included (banner via `\includegraphics`, line as rule, footer bar as TikZ).
- [x] `latexmk -pdf` compiles (2 pages, letter, no errors; one 0.0 pt overfull fixed).
- [x] Header banner on page 1, full-width green footer bar + diagonal triangle (matches Word behindDoc anchors), centered page number in white box (`PAGE` field).
- [x] Geometry maps to `w:pgMar` twips; Letter paper.
- [x] Section order/content 1:1 with `Formato PGC.pdf` (tables + labels exactly).
- [x] `.gitignore` extended for LaTeX artifacts.
- [ ] User side-by-side visual diff vs `Formato PGC.pdf` — open both PDFs and approve.

## Publishing

Source lives here (`latex/pgc/`). To submit under `Software/Documents/`, copy the built PDF:

```bash
cp latex/pgc/main.pdf "/home/d3ad/Documents/David12/Software/Documents/Formato PGC — LaTeX.pdf"
```

## Notes

- `image2.jpeg` is a thin line; drawing it as `\draw[udecgreen]` keeps it vector-crisp. Asset preserved verbatim.
- Green footer uses TikZ `AddToShipoutPictureBG` (not an image) to avoid JPEG banding; colors `udecgreen #6B8E00` approximate UDeC palette.
- If professor is strict on exact Arial TTF, switch to `xelatex` + `fontspec` + UDeC font files; current `helvet` is visually equivalent for PGC.
