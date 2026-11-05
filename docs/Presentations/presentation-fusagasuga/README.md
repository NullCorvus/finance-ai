# Finance AI · presentación de Fusagasugá (Gestión del Conocimiento)

Versión interactiva en HTML de **13 escenas de exposición para 15 minutos**, **bibliografía de consulta** y **5 de respaldo** (A–E), organizada por los siete aspectos de la rúbrica de la plantilla. Sin dependencias: son archivos estáticos.

- Plan y decisiones: [PLAN-FUSAGASUGA.md](PLAN-FUSAGASUGA.md)
- Guion oral, matriz de la rúbrica y evidencias verificadas: [contenido.md](contenido.md)
- Plantilla original: `../presentaciones-originals/Fusagasuga_template/`

## Abrir

Doble clic en `interactive/index.html` (probado con `file://`). Con servidor local, si el navegador bloquea algo:

```bash
python -m http.server 3033 --bind 127.0.0.1 --directory interactive
```

`.claude/launch.json` ya tiene la configuración `fusagasuga-interactive` (puerto 3033) para la vista previa del escritorio.

## Ritmo

Por defecto es **fluido**: una pulsación lleva a la escena siguiente y sus pasos se encadenan solos, con los tiempos de cada paso tomados del guion (`DWELL` al inicio de `deck.js`). `Mayús+M` pasa a modo manual (un paso por pulsación) y `Mayús+P` o el botón ▶ al recorrido sin manos. El movimiento está activo aunque Windows tenga las animaciones apagadas; `V` lo reduce y `?motion=system` respeta el sistema.

## Teclas

| Acción | Tecla |
|---|---|
| Avanzar / retroceder | `→` `Espacio` `Enter` clic / `←` `Retroceso` |
| Escena 1–9 / 10 | `1`…`9` / `0` (las escenas 11–13: `Fin`, o un clic en la barra de aspectos) |
| Primera / última | `Inicio` / `Fin` |
| **Respaldo técnico A–E** | `A` `B` `C` `D` `E` `F` desde cualquier punto |
| Volver del respaldo al mismo punto | `Esc` o `R` |
| Notas de estudio (guion de la escena, resaltado por paso) | `N` |
| Recorrido / modo manual | `Mayús+P` / `Mayús+M` |
| Movimiento reducido / activo | `V` |
| Pantalla completa | `Mayús+F` (o `F11`) |

La barra inferior son los **siete aspectos** de la rúbrica; cada segmento se llena con las escenas de ese aspecto y se puede pulsar para saltar a él. El aspecto 7 (Metodología y socialización) se evalúa en la forma de presentar: su segmento se llena en el cierre. Los chips dorados arriba a la derecha de cada escena (1.1, 1.2…) aparecen cuando se habla de ese criterio; los pesos de la rúbrica **no** se muestran, solo están en las notas del respaldo E.

## Escenas

| # | Escena | Aspecto | Tiempo |
|---|---|---|---:|
| 1 | Portada | — | 0:30 |
| 2 | Contexto y problema | 1 | 1:20 |
| 3 | Justificación | 1 | 0:45 |
| 4 | Objetivos | 1 | 1:15 |
| 5 | Producto: captura asistida | 2 | 1:00 |
| 6 | Producto: análisis y seguimiento | 2 | 1:05 |
| 7 | Marco teórico | 3 | 1:45 |
| 8 | Plataformas, integración y escalabilidad | 4 | 1:30 |
| 9 | Seguridad y acceso | 4 | 1:20 |
| 10 | Gestión del conocimiento | 5 | 1:50 |
| 11 | Conclusiones | 6 | 1:15 |
| 12 | Aportes | 6 | 0:55 |
| 13 | Probemos con la app real | 7 | 0:30 |
| A–D | Modelo de datos · IA · Recibos y voz · Seguridad y calidad (del PGC, con la frase de aislamiento corregida) | | |
| E | Dónde se cubre cada criterio | | |

## Cambios de ritmo visual

Tres escenas rompen el verde a propósito (atributo `data-theme` en la escena; los colores están en `uc.css`):

| Escena | Tema | Por qué |
|---|---|---|
| 7 · Marco teórico | `light`: el blanco suave del PGC con verde oliva y violeta | La teoría se lee como una página limpia |
| 9 · Seguridad y acceso | `night`: negro con dorado y tarjetas blancas | Una bóveda; el criterio de más peso |
| 13 · Cierre | `dark`: el negro azulado del PGC con verde oliva | El mismo cierre oscuro de la presentación anterior, antes de la demostración |

Si se añade una escena nueva y no se pone `data-theme`, usa el verde institucional. Si se cambia el CSS, hay que subir el `?v=` de los `<link>` en `index.html` para que los navegadores no sirvan la copia vieja.

## Lo que falta completar a mano (en `interactive/index.html`)

- **Portada:** número de grupo (clase `ph`, con borde punteado). La fecha ya está: 6 de noviembre de 2026. Confirmar que los integrantes son los mismos tres de la propuesta.
- **Quién presenta cada bloque** (criterio 7.2): todavía no hay etiqueta de presentador en las escenas.
- **Marco y fuentes:** el ejemplo registro–información–decisión reemplaza el modelo SECI. Las fuentes originales del PGC se conservan; el enlace «Referencias» del cierre abre las tres fuentes originales del PGC, CDIO/Scrum y el enlace de la API.
- **Antes de presentar:** confirmar la configuración viva de Cloud Run, Neon y el orden de los proveedores de IA (escena 8); recontar las entradas de bitácora (escena 10).

## Archivos

| Archivo | Contenido |
|---|---|
| `interactive/index.html` | Las 18 escenas (13 de exposición y 5 de respaldo), notas y diálogo de referencias. El texto está aquí |
| `deck.css`, `uc.css` | Motor y tokens; `uc.css` es el tema institucional (verde `#00482b`, dorado `#daaa00`, crema, Georgia) con la barra de siete aspectos, el paisaje y la oveja |
| `scenes.css`, `idle.css`, `idle-uc.css` | Composición de cada escena y movimiento en reposo |
| `backup.css`, `backup-uc.css` | Respaldos A–D (del PGC) y E |
| `deck.js`, `scenes.js` | Motor (pasos, ritmo, teclado, barra de aspectos) y animaciones propias |
| `assets/` | Capturas de la app, QR, logo y sello de la plantilla, degradado dorado |
| `export-pdf.mjs` | Genera los PDF |

Para cambiar un texto, edítese en `index.html` (y su guion en el `<template class="notes">` de la misma escena). Para que algo aparezca en un paso: clase `rv` y `data-s="n"`. Nunca se pone `transition` o una animación en reposo sobre un elemento `.rv` sin combinarla con `var(--rv-tr)`: se anima un hijo.

## PDF

```bash
node export-pdf.mjs
```

Genera `Finance-AI-Fusagasuga.pdf` (19 páginas) y `Finance-AI-Fusagasuga-principal.pdf` (las 13 principales). Usa Chrome (`C:/Program Files/Google/Chrome/Application/chrome.exe`, o la variable `CHROME_PATH`) y reutiliza `playwright-core` y `pdf-lib` de `../presentation-pgc/node_modules`. Cada página es una imagen de la escena en su estado final, con el movimiento apagado.

## Verificado el 2026-11-04

- Las 19 escenas se ven bien a 1280 × 720 en el navegador del escritorio, sin errores de consola; una auditoría automática no encontró textos fuera de su zona.
- Pasos automáticos de la escena 3 en 9 s y 21 s, tal como dice `DWELL`.
- Teclas: avanzar, notas (`N`), respaldo `C` y `E`, `Esc` vuelve al punto de origen.
- Apertura desde `file://` con Chrome: sin errores.

**No verificado:** un ensayo completo con cronómetro y con los tres integrantes; el recorrido automático completo (`Mayús+P`); el aspecto de la plantilla original (no hay forma de renderizarla aquí); y los límites de tamaño de letra en un proyector real.

## Edición de fuentes (2026-11-05)

El enlace «Referencias» en la escena 13 abre una ventana con cinco tarjetas con las fuentes del PGC, CDIO/Scrum y accesos a API/Swagger. Se cierra con el botón Cerrar o Escape y devuelve el foco al enlace. Las fuentes quedan fuera del recorrido principal, que termina en la demo (13/13). Los respaldos siguen en A–E y F ya no abre una escena. Se retiró el respaldo Offline-first completo.

Las cifras y sus tres referencias se conservan de `docs/PGC-PROPUESTA.md`, sección 6. El 4,2 % se mantuvo por petición del usuario; su referencia figura como verificada en la propuesta original, pero el editor bloqueó la consulta nueva.

Los PDF incluidos corresponden a una exportación anterior: esta edición modifica la página HTML. Regenerarlos antes de compartirlos como versión actual.

Las referencias empiezan por los enlaces útiles para preguntas: documentación Swagger. Se retiró el catálogo extenso de documentación técnica genérica.
