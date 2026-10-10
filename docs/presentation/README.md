# Presentación de Finance AI (Slidev)

Presentación del proyecto para los docentes, hecha con [Slidev](https://sli.dev).
13 diapositivas principales + 4 de respaldo (A–D). Notas del orador en español en cada diapositiva.
Duración estimada: ~17 min, de los cuales ~3 son la demo en vivo (diapositiva 9).

Una copia lista para abrir está en [`Finance-AI.pdf`](Finance-AI.pdf) (respaldo por si falla la demo o el equipo).

## Ejecutar

Desde la raíz del repositorio `finance-ai`:

```bash
cd docs/presentation
npm install          # solo la primera vez
npm run dev          # http://localhost:3030
```

- Vista del orador (con notas y cronómetro): http://localhost:3030/presenter
- Vista general de todas las diapositivas: http://localhost:3030/overview
- Exportar desde el navegador (PDF, PPTX o PNG): http://localhost:3030/export
- Exportar a PDF por consola: `npm run export` → genera `Finance-AI.pdf`
  (usa el Chrome instalado; si no está en `C:/Program Files/Google/Chrome/Application/`, ajusta `--executable-path` en `package.json`)

Teclas útiles: `→` / `←` avanzar/retroceder · `o` vista general · `f` pantalla completa.
Las diapositivas 2 y 6 tienen revelados con clic (`v-click`).

## Capturas reales de la app (pendiente)

La diapositiva 5 muestra marcadores de posición. Para reemplazarlos, guarda capturas verticales (relación 9:16)
en `public/screens/` con estos nombres exactos y aparecerán solas:

| Archivo | Qué mostrar |
|---|---|
| `captura-1-entrada.png` | El chat de captura con una frase escrita |
| `captura-2-propuesta.png` | La tarjeta de propuesta de la IA (sin guardar) |
| `captura-3-revision.png` | Editando un campo en la propia tarjeta |
| `captura-4-guardado.png` | El saldo / historial / dashboard ya actualizado |

## Antes de presentar

- [ ] Volver a ejecutar las pruebas y confirmar las cifras de la diapositiva 11 (408 servidor / 442 app, del 5-oct-2026).
- [ ] Confirmar la escritura del nombre del docente en la portada.
- [ ] Confirmar si el despliegue en Google Cloud Run está activo (la diapositiva 10 dice solo «configurado»).
- [ ] Capturas reales en `public/screens/` (ver arriba).
- [ ] Ensayar la demo (guion y lista de verificación en las notas de la diapositiva 9) y grabar un video de respaldo.
- [ ] Voz: no incluirla en la demo en vivo salvo que el reconocimiento en español esté instalado y probado en ese equipo.

## Notas sobre el contenido

- Cifras del problema: Curry (2026), Singh et al. (2024), Banca de las Oportunidades (2024) — tomadas de la propuesta PGC.
  El dato de 59–66 días proviene de hábitos de salud y así se indica en la diapositiva.
- El panel «Análisis inteligente» del dashboard usa reglas, no un modelo de lenguaje (la diapositiva 6 lo aclara).
- El modelo no se nombra en las diapositivas: «LLM comercial de bajo costo vía API (Gemini o DeepSeek, intercambiables)».
