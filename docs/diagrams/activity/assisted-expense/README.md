# Registrar gasto con asistencia de IA — actividades

## Flujo (alternativa textual)

Con sesión iniciada, el usuario aporta texto o una fotografía. El sistema valida la entrada y la interpreta con IA. Un resultado utilizable se muestra como propuesta; un fallo o entrada no confirmable se resume como aviso de captura. El usuario revisa y corrige antes de pulsar Confirmar, o descarta/cierra. El sistema valida la confirmación y solo entonces registra el gasto. Los errores permiten volver a revisar o salir.

## Alcance

Vista funcional de dos carriles: Usuario y Sistema. Sistema agrupa Flutter, backend y proveedor de IA; no significa que la IA registre el gasto. Se omiten los detalles internos de extracción, expiración, aclaraciones y transacciones para mantener la lámina legible. Foto puede generar un borrador editable tras fallo recuperable; una imagen no recibo tiene la confirmación bloqueada. Texto y foto conservan límites transaccionales diferentes, comprobados en la revisión técnica anterior. Retirar una propuesta local no garantiza su descarte remoto: Flutter puede cerrar aunque falle la solicitud. No se supone una ventana extra de «¿está seguro?» ni se representa una pregunta real de reintento.

El registro requiere una sesión válida y validación del backend. La acción inicial de login se omite cuando la sesión ya está activa; no representa introducir credenciales para cada gasto. Inicio y finales, decisiones con guardas y retorno de corrección se mantienen en la notación. Los rombos sin texto son uniones de caminos alternativos, no nuevas preguntas al usuario.

## Artefactos actuales

- [PNG](assisted-expense.png)
- [SVG ampliable](assisted-expense.svg)
- [Fuente PlantUML](assisted-expense.puml)
- [Galería de los cinco diagramas](../../revision-login.html)
- [Respuestas a los comentarios](../../revision-login.md)

La [vista Archify anterior](archify/assisted-expense-archify.html) conserva la versión previa y no representa esta simplificación.

## Evidencia

- `finance-ai-frontend/lib/features/text_capture/application/text_capture_controller.dart`
- `finance-ai-frontend/lib/features/receipt_capture/application/receipt_capture_notifier.dart`
- `finance-ai-frontend/lib/features/receipt_capture/presentation/screens/receipt_review_screen.dart`
- `finance-ai-backend/src/finance_ai/capture/service.py`
- `finance-ai-backend/src/finance_ai/receipts/service.py`
- `finance-ai-backend/src/finance_ai/expenses/service.py`

Código inspeccionado: frontend local `feat/ui-hero-redesign`, backend local `develop`. Validación documental: sintaxis PlantUML, PNG/SVG generados localmente y revisión visual. No se ejecutaron pruebas de aplicación ni se cambió su comportamiento. La revisión no sustituye los criterios de la profesora.
