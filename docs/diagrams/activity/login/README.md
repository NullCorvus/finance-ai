# Inicio de sesión — actividades

## Flujo (alternativa textual)

El usuario abre el login, introduce correo y contraseña y pulsa Iniciar sesión. El sistema valida el acceso, crea la sesión y la guarda de forma segura antes de mostrar Inicio. Un error permite volver a intentar o salir.

## Alcance

La actividad agrupa validación local, usuario activo, controles del backend y almacenamiento seguro. No desglosa hashes, claves ni revocaciones; esos detalles se conservan en la secuencia y el código. «¿Volver a intentarlo?» representa la elección de volver a enviar el formulario, no una ventana adicional.

El registro requiere una sesión válida y validación del backend. La acción inicial de login se omite cuando la sesión ya está activa; no representa introducir credenciales para cada gasto. Inicio y finales, decisiones con guardas y retorno de corrección se mantienen en la notación. Los rombos sin texto son uniones de caminos alternativos, no nuevas preguntas al usuario.

## Artefactos actuales

- [PNG](login.png)
- [SVG ampliable](login.svg)
- [Fuente PlantUML](login.puml)
- [Galería de los cinco diagramas](../../revision-login.html)
- [Respuestas a los comentarios](../../revision-login.md)

## Evidencia

- `finance-ai-frontend/lib/features/auth/session/application/auth_session_controller.dart`
- `finance-ai-frontend/lib/core/router/app_router.dart`
- `finance-ai-backend/src/finance_ai/auth/session_service.py`

Código inspeccionado: frontend local `feat/ui-hero-redesign`, backend local `develop`. Validación documental: sintaxis PlantUML, PNG/SVG generados localmente y revisión visual. No se ejecutaron pruebas de aplicación ni se cambió su comportamiento. La revisión no sustituye los criterios de la profesora.
