# Registro de un gasto asistido mediante IA

## Objetivo

Representar cómo texto o fotografía originan una propuesta temporal que el usuario revisa antes del registro definitivo. Complementa el [diagrama de componentes](../../architecture/system-components/README.md) y la [secuencia de recibo HU-015](../../sequence/receipt-capture/README.md).

## Precondiciones

- Sesión autenticada; los endpoints de captura están disponibles.
- Para fotografía, el usuario dispone de una imagen; Flutter y FastAPI comprueban los límites y el formato antes de procesarla.
- Para confirmar, la propuesta debe pertenecer al usuario, seguir abierta y satisfacer las reglas financieras.

## Actividades y responsables

| Responsable | Actividades |
|---|---|
| Usuario | Elige texto o fotografía; revisa y modifica valores; confirma, descarta o sale. |
| Aplicación Flutter | Envía la entrada, muestra la propuesta y sus avisos, valida el formulario de confirmación y presenta el resultado. |
| Backend FastAPI | Valida la entrada, prepara contexto, contrasta la interpretación, guarda la propuesta y ejecuta la confirmación financiera. |
| Proveedor externo de IA | Interpreta texto o recibo; no confirma ni guarda gastos. |

## Decisiones principales

- **Modalidad excluyente:** texto o fotografía. La entrada inválida termina con error gestionado.
- **Interpretación:** un fallo del proveedor en texto muestra error y permite iniciar un nuevo intento; un fallo recuperable de extracción de foto puede producir una propuesta editable manualmente.
- **Revisión:** la persona puede corregir valores antes de confirmar. En texto, el flujo también admite aclaraciones u opciones de catálogo que actualizan la propuesta; se agrupan en la acción de edición para mantener legible el diagrama. En foto, la edición de los valores es local hasta confirmar.
- **Decisión final:** descartar marca la propuesta como descartada; confirmar solicita validaciones locales y del servicio financiero. Un error corregible devuelve a revisión; una propuesta cerrada, vencida o no confirmable termina con error. Salir deja sin registrar el gasto.

## Resultados y postcondiciones

| Resultado | Postcondición |
|---|---|
| Confirmación exitosa | El servicio financiero registra el gasto y marca la propuesta confirmada en una transacción. |
| Descarte | La propuesta se marca descartada; no existe gasto por esa propuesta. |
| Salida sin confirmar | Puede permanecer una propuesta temporal hasta que expire; no existe gasto definitivo. |
| Fallo de captura | Se presenta el error o, para extracción fotográfica recuperable, un borrador manual revisable. |

## Evidencia y artefactos

Texto: `finance-ai-frontend/lib/features/text_capture/application/text_capture_controller.dart`, `finance-ai-backend/src/finance_ai/capture/router.py`, `capture/service.py` y `capture/grounding.py`. Fotografía: `finance-ai-frontend/lib/features/receipt_capture/application/receipt_capture_notifier.dart`, `finance-ai-frontend/lib/features/receipt_capture/presentation/receipt_review_screen.dart`, `finance-ai-backend/src/finance_ai/receipts/router.py`, `receipts/service.py` y `expenses/service.py`. Ramas inspeccionadas: frontend `feat/ui-hero-redesign`, backend `develop` (árboles de trabajo locales).

- [Imagen PNG](assisted-expense.png)
- [Fuente PlantUML](assisted-expense.puml)
- [Vista Archify interactiva](archify/assisted-expense-archify.html) ([candidato JSON](archify/assisted-expense-archify.candidate.json))

Los carriles, decisiones con guardas y finales siguen [UML 2.5.1](https://www.omg.org/spec/UML/2.5.1/) y la [sintaxis de actividades de PlantUML](https://plantuml.com/en/activity-diagram-beta). La selección de este escenario sigue [arc42, sección 6](https://docs.arc42.org/section-6/).

## Validación (10 puntos)

1. Nodo inicial y finales presentes (`start`/`stop` por salida: confirmación, descarte, salida sin confirmar, fallo gestionado, no recibo).
2. Decisiones/merge con guardas excluyentes (`¿Texto?`, `¿Es recibo?`, `¿Extracción disponible?`, `¿Descartar?`, `¿Confirmar?`, `¿Valores completos?`, `¿Confirmación válida?`, `¿Error corregible?`, expiración 24 h).
3. Ciclo de revisión modelado con `while (¿Mantener propuesta abierta?)`: editar/confirmar/descartar/salir sin paralelismo.
4. Particiones: Usuario, Aplicación Flutter, Backend FastAPI, Proveedor externo de IA (IA solo propone; servicios financieros registran).
5. Sin `fork`/`join`: no hay paralelismo real; todas las ramas son excluyentes.
6. Español, fondo blanco, persistencia como acción backend, sin mensajes HTTP de secuencia ni nombres comerciales.
7. Reglas verificadas: `CONFIRMABLE={complete,partial,failed_extraction}`; `not_a_receipt` no confirmable; `possible_duplicate` como aviso; `failed_extraction → propuesta editable`; `DRAFT_TTL=24h`.
8. Sintaxis PlantUML válida (`plantuml.jar -checkonly`, v1.2026.9): EXIT 0.
9. PNG renderizado: `assisted-expense.png` 4096×1934, verificado con `file` + `PIL.Image.size` + apertura visual; por sus cuatro carriles, ver a resolución completa o en lámina grande (mismo criterio que la secuencia HU-015).
10. Trazabilidad al código citada en Evidencia (texto, recibo, revisión, router, gateway, sanitizer, service, confirmación, pruebas).
