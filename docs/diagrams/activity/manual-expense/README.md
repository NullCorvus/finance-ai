# Registrar gasto manual — actividades

## Flujo (alternativa textual)

Con sesión iniciada, el usuario abre el registro, completa comercio, importe y fecha, elige cuenta y categoría opcional y pulsa Registrar. El sistema valida los datos y el acceso. Si son válidos, registra el gasto y muestra confirmación. Si no, muestra errores; el usuario puede corregir y volver a guardar o cancelar.

## Alcance

Vista funcional de dos carriles: Usuario y Sistema. No se muestra el refresco interno de listas ni el historial canónico, tal como pidió el usuario. Los errores de red con resultado incierto y los fallos transaccionales no se detallan: un error de comunicación no garantiza que no hubiera escritura remota. El diagrama representa el éxito conocido y la corrección de datos, no todos los fallos técnicos. «¿Corregir y volver a guardar?» es una elección del usuario, no un diálogo nuevo.

El registro requiere una sesión válida y validación del backend. La acción inicial de login se omite cuando la sesión ya está activa; no representa introducir credenciales para cada gasto. Inicio y finales, decisiones con guardas y retorno de corrección se mantienen en la notación. Los rombos sin texto son uniones de caminos alternativos, no nuevas preguntas al usuario.

## Artefactos actuales

- [PNG](manual-expense.png)
- [SVG ampliable](manual-expense.svg)
- [Fuente PlantUML](manual-expense.puml)
- [Galería de los cinco diagramas](../../revision-login.html)
- [Respuestas a los comentarios](../../revision-login.md)

La [vista Archify anterior](archify/manual-expense-archify.html) conserva la versión previa y no representa esta simplificación.

## Evidencia

- `finance-ai-frontend/lib/features/expenses/presentation/expense_create_screen.dart`
- `finance-ai-frontend/lib/features/expenses/application/expenses_controller.dart`
- `finance-ai-backend/src/finance_ai/expenses/router.py`
- `finance-ai-backend/src/finance_ai/expenses/service.py`

Código inspeccionado: frontend local `feat/ui-hero-redesign`, backend local `develop`. Validación documental: sintaxis PlantUML, PNG/SVG generados localmente y revisión visual. No se ejecutaron pruebas de aplicación ni se cambió su comportamiento. La revisión no sustituye los criterios de la profesora.
