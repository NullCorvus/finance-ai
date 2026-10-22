# HU-015 — secuencia de captura de recibo

## Entregables

- [Fuente PlantUML](receipt-capture-hu015.puml) y [PNG para el PGC](receipt-capture-hu015.png): representación UML de la secuencia del caso HU-015.
- Contexto: [vista UML de componentes](../../architecture/system-components/uml/architecture-components.png), [fuente editable](../../architecture/system-components/uml/architecture-components.puml) y [HTML Archify](../../architecture/system-components/archify/architecture-archify.html).

La secuencia muestra la creación de un borrador persistido, su revisión y, solo después de la confirmación explícita del usuario, el registro del gasto en otra transacción. El descarte marca el borrador como descartado. La edición de valores ocurre en Flutter hasta el envío de la confirmación. Ante un fallo recuperable de extracción, el backend puede crear una propuesta editable manualmente. El diagrama omite los reintentos para mantener un nivel de detalle apropiado para el informe.

Esta publicación conserva la vista UML formal en PlantUML y PNG. No incluye una versión interactiva Archify de esta secuencia; los flujos alternativos se describen aquí y en el fuente UML.

## Identificación

**Nombre:** captura de recibo mediante IA y confirmación del gasto. **Caso de uso:** HU-015. **Actor principal:** usuario de Finance AI. **Objetivo:** obtener datos sugeridos de la fotografía de un recibo para revisarlos antes de registrar un gasto. La secuencia abarca desde la selección de la imagen hasta la confirmación o el descarte de la propuesta.

Esta descripción es una vista de ejecución de un caso relevante, conforme al enfoque de [arc42, sección 6](https://docs.arc42.org/section-6/): explica cómo cooperan los componentes en tiempo de ejecución. La vista estructural más amplia se encuentra en el [diagrama de componentes](../../architecture/system-components/README.md).

## Participantes y responsabilidades

| Participante | Responsabilidad en HU-015 | Componente asociado |
|---|---|---|
| Usuario | Selecciona la imagen, revisa la propuesta y decide si confirma o descarta. | Actor externo a Finance AI. |
| Flutter: captura y revisión | Verifica el tamaño local, envía la imagen, presenta y edita el formulario; tras confirmar, actualiza el feed de gastos. | `finance-ai-frontend/lib/features/receipt_capture/`. |
| API REST FastAPI | Autentica la solicitud, valida y preprocesa la imagen, coordina la extracción y expone las operaciones de propuesta, confirmación y descarte. | `finance-ai-backend/src/finance_ai/receipts/router.py`. |
| Gateway de visión | Encapsula la solicitud de interpretación visual. | `finance-ai-backend/src/finance_ai/receipts/gateway.py`. |
| Proveedor externo de IA | Devuelve información interpretada de la imagen; no registra gastos. | Dependencia externa consumida por el gateway. |
| Servicio de propuestas | Crea el borrador temporal o lo marca como descartado y delimita esas transacciones. | `finance-ai-backend/src/finance_ai/receipts/service.py`. |
| Servicio financiero de gastos | Comprueba los valores y el estado de la propuesta; registra el gasto tras la confirmación. | `finance-ai-backend/src/finance_ai/expenses/service.py`. |
| Repositorios / Unit of Work | Acceden a propuestas, cuentas, categorías y gastos dentro de las transacciones que controlan los servicios. | `finance-ai-backend/src/finance_ai/db/receipt_uow.py` y `db/expense_uow.py`. |
| PostgreSQL | Conserva el borrador y, en una transacción posterior, el gasto definitivo y el estado confirmado de la propuesta. | Persistencia del backend. |

## Precondiciones

- El usuario dispone de una sesión válida para llamar a los endpoints protegidos de la API.
- Flutter tiene acceso a una fotografía o imagen seleccionada. Comprueba localmente el límite de 10 MiB; la API valida el archivo y su contenido al recibirlo. La validez no se supone antes de esas comprobaciones.
- El backend y su almacenamiento están disponibles para guardar la propuesta. La disponibilidad del proveedor de IA no es requisito absoluto para obtener un borrador: un fallo recuperable permite una propuesta editable manualmente.
- Para **confirmar** más adelante, la propuesta debe pertenecer al usuario, conservar un estado confirmable y no haber expirado; la cuenta, moneda y categorías deben satisfacer las validaciones del servicio financiero.

## Flujo principal: extracción y confirmación

| Paso | Origen | Destino | Operación o mensaje | Resultado |
|---|---|---|---|---|
| 1 | Usuario | Flutter | Fotografiar o seleccionar el recibo. | El cliente prepara la imagen y comprueba su tamaño. |
| 2 | Flutter | API REST | Enviar la imagen para crear una propuesta. | La API autentica, valida y preprocesa la imagen en memoria. |
| 3 | API REST | Gateway de visión | Solicitar extracción de datos. | El gateway invoca al proveedor externo de IA. |
| 4 | Proveedor externo de IA | Gateway y API | Devolver los datos interpretados. | La API sanea y normaliza la propuesta. |
| 5 | API REST | Servicio de propuestas | Crear el borrador. | Repositorios y Unit of Work lo guardan en PostgreSQL y confirman **la primera transacción**. |
| 6 | API REST | Flutter y usuario | Devolver y mostrar la propuesta. | El usuario revisa los valores; todavía no existe un gasto definitivo. |
| 7 | Usuario | Flutter | Confirmar explícitamente los valores definitivos. | Flutter valida el formulario y envía la confirmación a la API. |
| 8 | API REST | Servicio financiero de gastos | Delegar la confirmación. | El servicio bloquea y lee la propuesta; valida estado, titularidad, cuenta, moneda y categorías. |
| 9 | Servicio financiero de gastos | Repositorios / Unit of Work y PostgreSQL | Crear el gasto y marcar la propuesta confirmada. | Ambas escrituras se confirman en **la segunda transacción**. |
| 10 | API REST | Flutter y usuario | Responder con el gasto registrado. | Flutter informa el resultado, carga el feed de gastos y abre el detalle. |

Los pasos agrupan mensajes consecutivos del [PlantUML](receipt-capture-hu015.puml) para explicar el escenario sin repetir literalmente cada flecha. Las respuestas del proveedor y de PostgreSQL siguen el orden temporal que muestra el PNG.

## Flujos alternativos representados

| Fragmento y condición | Comportamiento | Resultado |
|---|---|---|
| `alt` — extracción correcta | La API sanea y normaliza la información obtenida. | Se guarda una propuesta estructurada para revisión. |
| `alt` — fallo de extracción recuperable | La API prepara una propuesta que el usuario puede completar manualmente. | Se guarda un borrador revisable; el fallo del proveedor no crea un gasto. |
| `opt` — el usuario modifica los valores | Flutter actualiza el formulario local antes de enviarlo. | Los cambios se incluyen en una confirmación posterior; editar no llama a la API. |
| `alt` — el usuario confirma | Se ejecuta la validación financiera y la segunda transacción. | Se registra el gasto y se marca confirmada la propuesta. |
| `alt` — el usuario descarta | Flutter solicita el descarte; el servicio de propuestas actualiza su estado. | El borrador queda descartado en PostgreSQL y no se registra gasto. |

Los reintentos de carga no aparecen como `loop` en el diagrama. Tampoco se detallan todos los errores de red o validación.

## Postcondiciones

| Resultado | Estado persistido |
|---|---|
| Confirmación exitosa | Existe un gasto definitivo y la propuesta queda confirmada en la misma transacción de gasto. |
| Descarte | La propuesta queda marcada como descartada; no se crea un gasto. |
| Sin decisión del usuario | El borrador permanece temporalmente revisable hasta que expire o cambie de estado. |
| Fallo recuperable de extracción | Puede existir una propuesta editable para entrada manual; sigue siendo un borrador, no una transacción financiera. |

**Guardar una propuesta nunca equivale, por sí solo, a registrar un gasto.**

## Notación UML usada

| Elemento | Significado | Uso en el diagrama |
|---|---|---|
| Actor | Rol externo que inicia o decide la interacción. | Usuario. |
| Línea de vida | Participante observado a lo largo del tiempo, de arriba hacia abajo. | Flutter, API, servicios, repositorios, proveedor y PostgreSQL. |
| Mensaje continuo `->` | Solicitud o llamada hacia otro participante. | Carga de imagen, interpretación, creación de borrador y confirmación. |
| Respuesta discontinua `-->` | Resultado que vuelve al solicitante. | Propuesta, gasto confirmado y respuestas de persistencia. |
| Barra de activación | Periodo durante el cual participa en la operación. | API, servicios, gateway, repositorios y PostgreSQL. |
| `alt` | Solo se ejecuta la rama cuya condición se satisface. | Extracción correcta o recuperable; confirmar o descartar. |
| `opt` | Interacción opcional condicionada. | Edición local antes de decidir. |
| Automensaje | Acción interna del mismo participante. | Validación/preprocesamiento de la API y actualización local de Flutter. |

No se representan creación ni destrucción de participantes: ya existen durante este caso. Las activaciones no miden tiempo real. El diseño monocromo, `scale 2` y la ausencia de cajas al pie son decisiones de presentación, no requisitos normativos de UML.

## Reglas y decisiones arquitectónicas

- Flutter llama a la API REST; el backend, mediante el gateway, administra la integración con IA. El proveedor solo aporta información interpretada.
- El resultado de la extracción es una **propuesta**. El usuario conserva la decisión de registrar o descartar.
- El servicio financiero aplica las reglas de confirmación, incluidas las validaciones de propuesta, cuenta, moneda y categorías. El router delega esa operación.
- Los servicios controlan las transacciones; los repositorios y Unit of Work realizan el acceso a PostgreSQL. La propuesta y el gasto se confirman en momentos distintos.

## Evidencia del código actual

Las rutas siguientes parten de la raíz del agregador Finance AI. El frontend y el backend son repositorios Git anidados. Se inspeccionaron el frontend `feat/ui-hero-redesign` (`4c6a03a5cbb4d72c3064a964e1d3ec4d0c1d353a`) y el backend `develop` (`6c7c9fc93a46bdd57ef177e8c8551ecc43b60ff2`), ambos con estado de trabajo local. Las referencias describen los archivos inspeccionados y no se presentan como una instantánea inmutable de esas ramas.

| Comportamiento | Evidencia |
|---|---|
| Captura, validación local, envío y revisión | `finance-ai-frontend/lib/features/receipt_capture/application/receipt_capture_notifier.dart:35-173`; `finance-ai-frontend/lib/features/receipt_capture/data/receipt_capture_remote_data_source.dart:25-42` |
| Edición local, confirmación, actualización del feed y detalle | `finance-ai-frontend/lib/features/receipt_capture/application/receipt_capture_notifier.dart:223-360`; `finance-ai-frontend/lib/features/receipt_capture/presentation/screens/receipt_review_screen.dart:841-875` |
| API, autenticación, preprocesamiento, propuesta, descarte y confirmación | `finance-ai-backend/src/finance_ai/receipts/dependencies.py:20-25`; `finance-ai-backend/src/finance_ai/receipts/router.py:112-183,250-286` |
| Gateway, degradación a entrada manual y borrador | `finance-ai-backend/src/finance_ai/receipts/gateway.py:190-203,466-471`; `finance-ai-backend/src/finance_ai/receipts/sanitizer.py:205-244`; `finance-ai-backend/src/finance_ai/receipts/service.py:38-46` |
| Persistencia temporal | `finance-ai-backend/src/finance_ai/receipts/repository.py:37-54`; `finance-ai-backend/src/finance_ai/db/receipt_uow.py:11-43` |
| Validación financiera y transacción definitiva | `finance-ai-backend/src/finance_ai/expenses/service.py:90-225`; `finance-ai-backend/src/finance_ai/db/expense_uow.py:15-51` |
| Pruebas de ciclo de vida y confirmación | `finance-ai-backend/tests/api/test_receipt_proposal_api.py`; `finance-ai-backend/tests/api/test_receipt_confirmation_api.py`; `finance-ai-frontend/test/features/receipt_capture/` |

La interfaz recibe la respuesta antes de mostrar el gasto y cargar de nuevo el feed. El código no evidencia una recarga explícita de la pantalla de historial en este punto.

## Fuentes de notación

La semántica de líneas de vida, mensajes y fragmentos proviene de [OMG UML 2.5.1](https://www.omg.org/spec/UML/2.5.1/). La sintaxis textual de flechas, activaciones y `alt`/`opt` se documenta en [PlantUML Sequence Diagram](https://plantuml.com/sequence-diagram). [IBM explica los operadores de interacción](https://www.ibm.com/docs/en/dma?topic=diagrams-interaction-operators-in-sequence): `alt` elige una rama y `opt` ejecuta su contenido si se satisface la guarda. La validez sintáctica de PlantUML por sí sola no demuestra conformidad semántica con UML.

Para abrir el PNG, usa cualquier visor de imágenes o insértalo como figura en el informe. La exportación mide 3886 × 3594 px; por sus nueve líneas de vida, el texto queda pequeño si se reduce a una página A4. Para impresión, úsalo en una lámina grande o un pliego desplegable; para la sustentación digital, ábrelo a resolución completa. Edita el `.puml` para cambiar el diagrama.

Para consultar la secuencia, abre el PNG o edita el archivo PlantUML enlazado en Entregables.
