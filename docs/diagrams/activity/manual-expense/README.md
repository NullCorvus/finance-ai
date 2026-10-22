# Registro manual de un gasto

## Objetivo

Mostrar las decisiones del registro manual hasta guardar el gasto o abandonar el formulario. Complementa la [vista de componentes](../../architecture/system-components/README.md) sin repetir mensajes de la vista de secuencia.

## Precondiciones

- Sesión autenticada y acceso al formulario de gastos.
- La aplicación puede consultar cuentas y categorías; la cuenta elegida debe pertenecer al usuario y estar activa.

## Actividades y responsables

| Responsable | Actividades |
|---|---|
| Usuario | Abre el registro manual, aporta comercio e importe, elige cuenta y categoría opcional, solicita el registro o sale. |
| Aplicación Flutter | Carga opciones, valida campos, comunica errores, envía el gasto y muestra el resultado. |
| Backend FastAPI | Aplica las reglas financieras y registra gasto, movimiento y recibo dentro de una transacción. |

## Decisiones principales

- **Continuar o cancelar:** salir del formulario no guarda el gasto.
- **Campos locales válidos:** comercio y cuenta obligatorios, importe positivo; fecha y categoría pueden conservar sus valores opcionales o predeterminados. Los errores permiten corregir antes de enviar.
- **Validación del servicio:** comprueba importe, comercio, titularidad y estado de cuenta y categoría. Un rechazo vuelve al formulario para corregir o salir.
- **Resultado incierto:** cuando la respuesta del envío se pierde, la interfaz exige revisar el historial; el diagrama no presupone que reenviar sea seguro.

## Resultados y postcondiciones

| Resultado | Postcondición |
|---|---|
| Éxito | Gasto y movimiento financiero confirmados; Flutter refresca la vista y muestra confirmación. |
| Cancelación | No se solicita una nueva operación. |
| Error corregible | Los datos permanecen en el formulario para revisión. |
| Resultado incierto | Se informa que hay que comprobar el historial antes de iniciar otro registro. |

## Evidencia y artefactos

Código: `finance-ai-frontend/lib/features/expenses/presentation/expense_create_screen.dart`, `finance-ai-frontend/lib/features/expenses/application/expenses_controller.dart`, `finance-ai-frontend/lib/features/expenses/data/expenses_repository.dart`, `finance-ai-backend/src/finance_ai/expenses/router.py`, `finance-ai-backend/src/finance_ai/expenses/service.py` y `finance-ai-backend/src/finance_ai/db/repositories/expenses.py`. La rama inspeccionada del frontend fue `feat/ui-hero-redesign`; la del backend, `develop` (árboles de trabajo locales).

- [Imagen PNG](manual-expense.png)
- [Fuente PlantUML](manual-expense.puml)
- [Vista Archify interactiva](archify/manual-expense-archify.html) ([candidato JSON](archify/manual-expense-archify.candidate.json))

La notación usa nodos iniciales y finales, acciones, decisiones excluyentes con guardas, ciclos de corrección y carriles de responsabilidad conforme a [UML 2.5.1](https://www.omg.org/spec/UML/2.5.1/). La organización sigue la [vista de ejecución de arc42](https://docs.arc42.org/section-6/).

## Validación (10 puntos)

1. Nodo inicial y finales presentes (`start`/`stop` por salida: éxito, cancelación, error, resultado incierto).
2. Decisiones/merge con guardas excluyentes (`¿Continuar?`, `¿Campos válidos?`, `¿Reglas financieras?`, `¿Éxito reconocido?`).
3. Ciclo de corrección modelado con `while` (volver al formulario, no reenvío implícito).
4. Particiones: Usuario, Aplicación Flutter, Backend FastAPI (persistencia como acción backend).
5. Sin `fork`/`join`: no hay paralelismo real; todas las ramas son excluyentes.
6. Español, fondo blanco, sin mensajes HTTP de secuencia ni nombres comerciales.
7. Persistencia como acción backend (`Registrar gasto y movimiento financiero` + `Confirmar transacción en PostgreSQL`).
8. Sintaxis PlantUML válida (`plantuml.jar -checkonly`, v1.2026.9): EXIT 0.
9. PNG renderizado y legible: `manual-expense.png` 2070×1278, verificado con `file` + `PIL.Image.size` + apertura visual.
10. Trazabilidad al código citada en Evidencia (formulario, controller, repository, router, service, repositorio de gastos).
