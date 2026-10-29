# PGC — Sustentación Semana 12

Presentación HTML autocontenida (sin dependencias externas) + fuente editable en JSON.

## Archivos

| Archivo | Qué es |
|---|---|
| `pgc-semana-12.html` | Presentación construida (478 KB, 7 slides). Abrir en navegador. |
| `pgc-contenido.json` | Fuente editable. Schema `pgc-semana12/v1`, 7 slides con IDs fijos. |

## Cómo presentar

```bash
xdg-open docs/presentaciones/semana-12-sustentacion/pgc-semana-12.html
# o doble clic. Para ir a un slide: .../pgc-semana-12.html#1 ... #7
```

Atajos: `→ / Espacio` avanzar · `←` retroceder · `F` presentar/salir · `O` índice ·
`E` editar texto · `L` láser · `B` pantalla negra · `A` revelar todo · `?` ayuda.

## Cómo editar (para humanos y agentes)

1. **Fuente de verdad = `pgc-contenido.json`.** No editar el HTML a mano.
2. Mantener `schema`, los 7 `id` y el orden:
   `portada, problema-justificacion, objetivo-general, objetivos-especificos, propuesta-tecnologica, solucion, conclusiones`.
3. Sin HTML en los textos. Notas del orador en `notes`.
4. Opciones para cargar cambios:
   - UI: abrir HTML → `E` o `Archivo > Importar JSON`.
   - Consola: `PGC.setContent(json)` / leer con `PGC.getContent()`.
   - Re-exportar: `Archivo > Descargar HTML` (sobrescribe este archivo).

## Cómo entregar impreso

Abrir HTML → `Archivo > Imprimir` o `Ctrl+P` → guardar como PDF para jurado.

## Origen

Generado desde `Presentación PGC semana 12.pptx` vía
`/home/d3ad/Documents/Codex/2026-10-22/pud/work/build.py`
+ `presentation.template.html`. Solo se importan los outputs;
`work/`, `browsers/` y PNGs intermedios quedan fuera del repo.

## Pendiente

El JSON trae placeholders (`XXXX`). Relleno real con
`docs/PGC-PROPUESTA.md` + `latex/pgc/main.tex` queda como paso siguiente.
