# Presentación breve de Finance AI (Slidev)

**9 diapositivas principales · 6 minutos de exposición, más una diapositiva final (la 10) que da paso a la app real.**
Después se muestra la app y se responden las preguntas de los jurados.
Las 4 diapositivas restantes son respaldo técnico, no parte de la exposición.

El PDF completo se genera en [`Finance-AI.pdf`](Finance-AI.pdf).

Para estudiar en el celular hay una **guía de estudio en PDF**, [`Finance-AI-guia-de-estudio.pdf`](Finance-AI-guia-de-estudio.pdf): páginas del tamaño de un teléfono, cada una con la diapositiva y debajo qué decir al jurado (idea clave, guion por paso, avisos y frase para pasar a la siguiente), más el respaldo A–D y la lista de verificación. Sale de las notas de estudio de la versión interactiva; para regenerarla tras cambiar un texto: `python build-study-guide.py` (necesita Python con Pillow, Node y Chrome).

Hay además una **versión interactiva en HTML**, con animaciones, pasos que se encadenan solos, recorrido automático y el respaldo técnico A–D (teclas `A`–`D`), sin dependencias: [`interactive/`](interactive/README.md). Se abre con doble clic en `interactive/index.html`. Las notas del orador siguen solo en esta versión de Slidev.

## Guion principal

| # | Diapositiva | Tiempo | Acumulado |
|---|---|---:|---:|
| 1 | Finance AI | 0:20 | 0:20 |
| 2 | Problema y justificación | 0:45 | 1:05 |
| 3 | Objetivo general | 0:25 | 1:30 |
| 4 | Objetivos específicos | 0:40 | 2:10 |
| 5 | Propuesta tecnológica | 0:55 | 3:05 |
| 6 | Captura asistida | 0:55 | 4:00 |
| 7 | Gastos por categoría y período | 0:50 | 4:50 |
| 8 | Movimientos y presupuestos | 0:45 | 5:35 |
| 9 | Conclusiones | 0:25 | 6:00 |
| 10 | Probemos con la app real (transición a la demostración) | fuera del tiempo | — |

Las notas del orador están en español, con tiempo por diapositiva y acumulado. Cada bloque separa el **GUION ORAL** del **APOYO Y FUENTES (no leer)**. El guion ronda las 710 palabras. Los objetivos completos y la información ampliada se conservan en el apoyo.
La diapositiva 10 dura unos segundos y no cuenta en los seis minutos: es la invitación a ver la app. Después de ella, cambiar a la app. El showcase y las preguntas quedan fuera de los seis minutos.

Se sigue el orden de las siete secciones de la plantilla PGC: portada, problema y justificación, objetivo general, objetivos específicos, propuesta tecnológica, solución y conclusiones. Solución ocupa las diapositivas 6 a 8. La portada usa **2026-2**, según la indicación del equipo.

## Ejecutar y exportar

Desde `finance-ai/docs/presentation`:

```bash
npm install            # solo la primera vez
npm run dev            # http://localhost:3030
npm run build          # comprueba la compilación
npm run export         # PDF completo: 10 principales + 4 de respaldo
npm run export:main    # PDF de solo las 10 principales
```

- Notas y cronómetro: http://localhost:3030/presenter
- Vista general para localizar respaldo: http://localhost:3030/overview
- Exportación desde el navegador: http://localhost:3030/export
- Teclas: derecha/izquierda para avanzar, `o` para vista general, `f` para pantalla completa.

La exportación usa Chrome en `C:/Program Files/Google/Chrome/Application/`.
Si se instala en otra ruta, ajustar `--executable-path` en `package.json`.

## Editar con una persona o un LLM

| Archivo | Qué editar |
|---|---|
| `slides.md` | Las diez diapositivas principales y sus notas |
| `pages/backup.md` | Las cuatro diapositivas para preguntas |
| `style.css` | Tipografía, colores y composición compartida |
| `public/screens/` | Capturas reales usadas por las diapositivas |
| `components/DownloadQr.vue` | QR de descarga y enlace del PDF |
| `public/app-download-qr.jpg` | Imagen original del QR, con su margen blanco |
| `PLAN-PGC-6-MIN.md` | Plan aprobado, correspondencia con la plantilla y comprobaciones |

El contenido sigue en texto editable, no dentro de imágenes de las diapositivas.
Los separadores `---` delimitan las diapositivas; el último bloque de `slides.md` importa el respaldo.
Los comentarios HTML al final de cada diapositiva contienen las notas del orador.
La composición breve usa clases `pitch-*`, concentradas al final de `style.css`, para evitar estilos en línea en el guion principal.
Conservar las nueve diapositivas de la exposición, el orden de la plantilla y el reparto de tiempos al revisar el texto. La décima, de transición a la demo, usa el layout `demo` y las clases `pitch-close-body` y `pitch-demo-steps`. El relato se centra en las funciones y decisiones del software actual. Las vistas de la app usan imágenes de tamaño medio, recortadas con CSS para enfocar los datos relevantes. La analítica muestra explícitamente categorías y período. Conservar los archivos completos en `public/screens/`. La tendencia de gasto, los detalles técnicos y el guion de la demostración se conservan en el respaldo o en las notas.

La portada muestra el QR en grande; las demás diapositivas lo muestran en pequeño arriba a la derecha.
También se puede hacer clic en el QR o en su etiqueta para abrir la descarga desde el PDF.
Si cambia el destino, actualizar tanto la imagen original como el enlace en `DownloadQr.vue`.

## Showcase de la app

1. Mostrar una cuenta sintética y su saldo inicial.
2. Escribir «almuerzo 18 mil con Nequi» con esa cuenta y una categoría disponibles.
3. Revisar la propuesta y corregir un campo antes de confirmar.
4. Confirmar una sola vez y mostrar el movimiento y el saldo actualizado.
5. Abrir Inicio/dashboard y explicar la información del periodo.
6. Si queda tiempo, mostrar un recibo elegido o una transferencia entre dos cuentas propias.

Si falla la IA, continuar con el formulario manual. Si falla el servidor, usar una grabación de respaldo preparada antes.
Esta presentación describe la versión online: el formulario manual no implica funcionamiento sin conexión.
Incluir voz en vivo solo después de ensayarla en el dispositivo de la demostración.

## Respaldo para preguntas

| Letra | Tema | Número en el PDF |
|---|---|---:|
| A | Modelo de datos y libro de movimientos | 11 |
| B | Propuesta de IA y validación | 12 |
| C | Recibos y voz | 13 |
| D | Seguridad y calidad del software | 14 |

## Evidencia y procedencia

- Título, datos académicos y objetivos: `docs/PGC-PROPUESTA.md` y `latex/pgc/main.tex`. El objetivo general se conserva completo y los cinco objetivos específicos mantienen su orden, con la redacción completa en las notas.
- Las cinco vistas en `public/screens/` (`dashboard-actual.png`, `captura-propuesta-actual.png`, `analisis-actual.png`, `historial-actual.png` y `presupuestos-actual.png`) son renders del 27-oct-2026 de los componentes Flutter actuales del cliente conectado (`finance-ai-frontend@35df926`), con datos sintéticos. Se generaron con el tema de la app y fixtures aislados en `.tools/presentation_capture_test.dart`. Los recortes CSS amplían los datos relevantes y conservan los originales completos. El flujo completo conectado se muestra en el showcase.
- Servidor: **415 pruebas aprobadas, 0 omitidas, 89% de cobertura de ramas**, punto de control del 16-oct-2026 en `finance-ai-backend/aidlc-docs/construction/release-audit-20261016/backend-audit.md`, sección «Follow-up verification».
- App: **573 pruebas aprobadas**, punto de control del 18-oct-2026 en `finance-ai-frontend/aidlc-docs/construction/release-audit-20261017/final-validation.md`, sección «Revisión del aviso de fuentes de ingreso». Esa sección no informa una cobertura actual de Flutter.
- Son verificaciones documentadas de esas fechas. Editar la presentación no vuelve a ejecutar ni certifica las suites de la aplicación.
- El guion describe capacidades del producto mediante acciones y pantallas reales. Las cifras visibles de las capturas corresponden a datos de demostración.
- La presentación conserva el alcance online del PDF original. No mezcla funciones ni cifras de la rama offline-first.

## Antes de presentar

- [ ] Ensayar las nueve diapositivas con cronómetro.
- [ ] Confirmar que la versión de la app que se mostrará corresponde al alcance descrito.
- [ ] Preparar cuenta sintética, dos cuentas de dinero, categorías y recibo de ejemplo.
- [ ] Comprobar servidor, base de datos y conexión al proveedor de IA.
- [ ] Ensayar la corrección de un campo y comprobar la actualización del historial y del saldo.
- [ ] Preparar una grabación completa de respaldo.
- [ ] Actualizar las cifras y sus fechas si se realiza una verificación nueva.
