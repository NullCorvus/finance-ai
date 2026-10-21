# Finance AI: auditoría del diagrama de componentes

## Entrega actual

- [PNG principal para el PGC](uml/architecture-components.png)
- [SVG vectorial](uml/architecture-components.svg)
- [Fuente PlantUML editable](uml/architecture-components.puml)
- [HTML Archify interactivo](archify/architecture-archify.html) y [fuente editable](archify/architecture-archify.candidate.json).

El PNG final tiene fondo blanco, mide 2953 × 2227 px a 300 dpi y conserva proporción 1,326. En A4 apaisado con márgenes de 1,5 cm, se puede colocar a unos 23,85 × 17,96 cm; el tamaño efectivo de letra calculado desde el SVG es aproximadamente 9,1 pt. Con márgenes de 2,5 cm, el alto útil de 16 cm reduce la figura a unos 21,2 cm de ancho y el texto a aproximadamente 8,1 pt. La densidad de píxeles conserva nitidez al ampliar, pero no agranda el texto impreso.

## Alcance y correcciones

Esta pasada parte de la revisión ya corregida que muestra cajas UML2 visibles y declara `BackendAPI` y `FinanceAPI` dentro de `Backend FastAPI`. La auditoría del código actual detectó que captura textual y recibos quedaban demasiado agregados y que una interfaz externa común sugería una abstracción que el código no define; esta versión separa las dos capturas y los dos gateways, y presenta Gemini/DeepSeek como proveedores externos. No incluye clases, endpoints, tablas ni módulos planificados.

La vista agrupa cuatro paquetes: frontend Flutter, backend FastAPI, persistencia y proveedores externos. En Flutter, la navegación/presentación enlaza con sesión, funcionalidades financieras y cliente de captura; los clientes usan REST. El backend publica REST v1, delega en autenticación, servicios financieros y dos componentes de captura. Texto y recibos guardan propuestas revisables; confirmar texto ejecuta gastos, ingresos o transferencias a través de servicios financieros, y confirmar un recibo crea el gasto. La imagen se valida/preprocesa en memoria; la propuesta estructurada se conserva hasta confirmación. Los servicios usan repositorios/Unit of Work y PostgreSQL.

Los gateways de texto y visión se muestran separados. El código usa contratos y adaptadores distintos; los proveedores Gemini y DeepSeek aparecen como componentes externos porque hay llamadas a ambos según configuración/fallback. No se dibuja una interfaz externa única de Chat Completions: que los adaptadores compartan un protocolo compatible no prueba que exista un contrato runtime común entre proveedores.

En la frontera REST, `FinanceAPI` es una interfaz provista representada como lollipop y conectada a `BackendAPI` con una línea de provisión sin punta; `RestClient` la requiere mediante dependencia `«use»`. Las dependencias restantes son estructurales (PlantUML `..>`), no expresan orden temporal. No se pretende representar ciclo de vida o secuencia. La notación sigue los conceptos de InterfaceRealization, Usage, interfaz y componente de UML 2.5.1; renderizar PlantUML no equivale a certificación formal de conformidad.

## Evidencia actual de implementación

Los paths son relativos al agregador `/home/d3ad/codigos/finance-ai`. Los prefijos `finance-ai-frontend/` y `finance-ai-backend/` son repositorios Git anidados. La evidencia se contrastó con los archivos de trabajo actuales y con los HEAD indicados más abajo.

| Componente o relación | Evidencia local |
|---|---|
| Navegación y pantallas Flutter para cuentas, transferencias, presupuestos, categorías, dashboard, gastos/historial, ingresos y recibos | `finance-ai-frontend/lib/core/router/app_router.dart:4-27,30-78` |
| REST JSON, autenticación Bearer y carga multipart | `finance-ai-frontend/lib/core/api/api_client.dart:71-92,150-180` |
| Sesión cliente y almacenamiento seguro de credenciales | `finance-ai-frontend/lib/features/auth/session/data/auth_session_repository.dart:21-50`; `.../secure_credential_store.dart:1-35` |
| Captura cliente de texto y recibos | `finance-ai-frontend/lib/features/text_capture/data/text_capture_repository.dart:48-74`; `finance-ai-frontend/lib/features/receipt_capture/data/receipt_capture_remote_data_source.dart:19-41` |
| FastAPI, middleware y routers v1 | `finance-ai-backend/src/finance_ai/main.py:11-21`; `finance-ai-backend/src/finance_ai/api/router.py:16-28` |
| Credenciales opacas access/renewable y hash; renovación rotativa | `finance-ai-backend/src/finance_ai/auth/session_schemas.py:80-100`; `.../credentials.py:17-32`; `.../session_service.py:103-148` |
| Servicios de captura textual, borrador temporal y confirmación idempotente | `finance-ai-backend/src/finance_ai/capture/service.py:101-146,225-235,240-281,291-360`; `.../repository.py:16-56` |
| Entrada de recibo, visión y confirmación como gasto | `finance-ai-backend/src/finance_ai/receipts/router.py:139-183,271-283`; `.../service.py:22-56`; `.../gateway.py:190-216` |
| Gateway textual y fallback entre adaptadores configurados | `finance-ai-backend/src/finance_ai/capture/gateway.py:46-74,178-230` |
| Adaptadores de visión Gemini/DeepSeek y fallback condicional | `finance-ai-backend/src/finance_ai/receipts/gateway.py:333-347,414-470` |
| Repositorios/UoW, SQLAlchemy y PostgreSQL | `finance-ai-backend/src/finance_ai/db/session.py:10-27`; `finance-ai-backend/src/finance_ai/db/receipt_uow.py:1-80`; `finance-ai-backend/compose.yaml:3-22` |

Se muestran sólo componentes respaldados por código ejecutable. “Funciones financieras” abrevia gastos, ingresos y transferencias dentro de movimientos, además de cuentas, categorías, presupuestos, dashboard e historial; los routers y pantallas citados documentan el detalle. La agrupación Repositorios/Unit of Work resume varias instancias por dominio, no implica que exista un repositorio único.

## Repositorios y estado Git

| Repositorio | HEAD completo | Rama | Estado al auditar |
|---|---|---|---|
| Agregador `finance-ai` | `05d499103875bc48e937b36e45f2cdcbc5c5fe2f` | `codex/technical-docs-audit` | Sucio previamente; 153 entradas en `status` incluyen archivos preexistentes y esta documentación. No se limpiaron cambios. |
| `finance-ai-frontend` | `4c6a03a5cbb4d72c3064a964e1d3ec4d0c1d353a` | `feat/ui-hero-redesign` | Sucio previamente, 91 entradas. |
| `finance-ai-backend` | `6c7c9fc93a46bdd57ef177e8c8551ecc43b60ff2` | `develop` | Sucio previamente, 4 entradas; las fuentes citadas se leyeron de archivos actuales. |

Los worktrees alternos no fueron fuente de verdad. El grafo Graphify existente estaba sucio y mezclaba etapas/documentación: se consultó como índice auxiliar sin regenerarlo; las afirmaciones finales se comprobaron en el código actual citado. No se ejecutaron builds ni suites Flutter, pues el cambio es documental.

## Render y revisión visual

PlantUML 1.2026.9 se ejecuta localmente desde `/home/d3ad/.local/share/plantuml/plantuml.jar`. El SVG se renderizó por stdin a un temporal nuevo y luego se copió al artefacto de entrega para evitar archivos obsoletos. Una única relación `hidden` entre `RestClient` y `BackendAPI`, junto con `nodesep 100`/`ranksep 18`, ordena la composición para A4; esa restricción no es una relación del sistema ni se muestra como flecha. El SVG pasó parseo XML; contiene 17 entidades/componentes (incluida la interfaz), 24 dependencias, 1 conector de provisión sin punta y cajas de componente con borde visible. La inspección visual del PNG a escala verificó símbolos UML2, fondo blanco, etiquetas sin recorte y ausencia de solapamiento entre componentes. Algunas relaciones cruzan el espacio entre paquetes; el diagrama describe dependencias, no flujo de ejecución.

La plantilla CSS puro de la skill no produjo trazo de componente para la sintaxis UML2 `component "..." as ...` con este motor. Se conservó el estilo CSS y se añadieron los parámetros explícitos `skinparam componentStyle uml2`, `monochrome true` y `shadowing false` como fallback de render, para mantener cajas/iconos, fondos blancos y trazos visibles. Se comprobó el SVG resultante antes de generar el PNG.

Comandos usados desde la raíz:

```bash
java -jar /home/d3ad/.local/share/plantuml/plantuml.jar \
  -tsvg -pipe < docs/diagrams/architecture/system-components/uml/architecture-components.puml \
  > /tmp/finance-ai-components-current.svg
cp /tmp/finance-ai-components-current.svg docs/diagrams/architecture/system-components/uml/architecture-components.svg
rsvg-convert -b white -w 2953 \
  -o docs/diagrams/architecture/system-components/uml/architecture-components.png \
  docs/diagrams/architecture/system-components/uml/architecture-components.svg
mogrify -units PixelsPerInch -density 300 \
  docs/diagrams/architecture/system-components/uml/architecture-components.png
```

En aquella revisión de la auditoría PNG, el browser-check de Archify quedó omitido por ausencia de Chromium/Chrome/Edge en el host y el navegador integrado bloqueó `file://`; no se inició un servidor local ni se eludió esa política. La versión Archify se actualizó posteriormente y su estado vigente, validación y límites se describen en la sección «Archify actualizado».

## Fuentes normativas y skills

- [OMG UML 2.5.1](https://www.omg.org/spec/UML/2.5.1/PDF), especialmente §§ 7.7.3.2 (InterfaceRealization), 7.8.23 (Usage), 10.5.6 (InterfaceRealization), 11.6 (Components).
- [PlantUML: Component Diagram](https://plantuml.com/en/component-diagram).
- [Skill PlantUML](https://github.com/samonysh/plantuml-skill); referencias locales de sintaxis, diseño de bajo nivel y estilo.
- Archify: `/home/d3ad/.agents/skills/archify/SKILL.md`; referencias de authoring y entrega ya aplicadas a la versión anterior.
- Graphify: `/home/d3ad/codigos/finance-ai/.agents/skills/graphify/SKILL.md`; consulta existente, sin regeneración del grafo sucio.

## Archify actualizado (revisión 4)

- [HTML interactivo actualizado](archify/architecture-archify.html)
- [Candidato editable](archify/architecture-archify.candidate.json)
- Recibos de validación y entrega: `archify/validation/architecture-archify.finalize.json`, `archify/validation/architecture-archify.finalize-summary.json` y `archify/validation/architecture-archify.browser-check.json`; `archify/architecture-archify.delivery.json` acompaña al HTML.

El candidato refleja los 16 componentes ejecutables y cuatro regiones del UML vigente (el UML cuenta además la interfaz REST como entidad de notación): aplicación Flutter, backend FastAPI, persistencia y proveedores externos. Diferencia captura cliente/revisión de propuestas de los servicios backend de texto y recibos, que consultan gateways independientes. Las conexiones muestran dependencias; las tarjetas “Registro manual” y “Captura asistida” explican el recorrido sin dibujar una secuencia. La propuesta queda pendiente para revisión en la app: sólo una confirmación explícita invoca los servicios financieros para persistir el movimiento. Los gateways de texto y visión se conectan con Gemini y DeepSeek; el cliente Flutter sólo llega a REST.

Las descripciones breves aparecen en los componentes; la selección/foco nativa del Viewer muestra sus etiquetas y relaciones ascendentes/descendentes, sin callbacks personalizados. Siete tarjetas explican responsabilidades de cada subsistema y recorridos. Las finanzas listan explícitamente cuentas, categorías, gastos, ingresos, transferencias, presupuestos, dashboard e historial. La leyenda utiliza cuatro tipos cromáticos alineados con las cuatro regiones: Flutter (incluida sesión con icono de seguridad), FastAPI, persistencia (repositorios como tipo database con icono backend; PostgreSQL como database) y proveedores externos. Se omite `visual_preset`: el Viewer abre en modo oscuro/clásico de forma nativa y permite cambiar entre oscuro/claro; el esquema no expone un campo para fijar el modo. No se inspeccionó el HTML en navegador.

### Evidencia y procedencia

| Área | Evidencia local contrastada |
|---|---|
| Navegación, funcionalidades y llamadas frontend | `finance-ai-frontend/lib/core/router/app_router.dart:4-27,30-78`; `finance-ai-frontend/lib/core/api/api_client.dart:71-92,150-180` |
| Sesiones y captura cliente | `finance-ai-frontend/lib/features/auth/session/data/auth_session_repository.dart:21-50`; `finance-ai-frontend/lib/features/text_capture/data/text_capture_repository.dart:48-74`; `finance-ai-frontend/lib/features/receipt_capture/data/receipt_capture_remote_data_source.dart:19-41` |
| API, servicios financieros, texto y confirmación | `finance-ai-backend/src/finance_ai/main.py:11-21`; `finance-ai-backend/src/finance_ai/capture/service.py:101-146,225-235,240-281,291-360` |
| Recibos y persistencia | `finance-ai-backend/src/finance_ai/receipts/router.py:139-183,271-283`; `finance-ai-backend/src/finance_ai/receipts/service.py:22-56`; `finance-ai-backend/src/finance_ai/db/session.py:10-27`; `finance-ai-backend/src/finance_ai/db/receipt_uow.py:1-80` |
| Gateways y proveedores | `finance-ai-backend/src/finance_ai/capture/gateway.py:46-74,178-230`; `finance-ai-backend/src/finance_ai/receipts/gateway.py:333-347,414-470` |

Estos paths se inspeccionaron en los repositorios anidados actuales; no se declararon como referencias Git del candidato porque `--repo-root` apunta al agregador, que sólo versiona esos subrepositorios como gitlinks y no puede resolver sus archivos en el commit del agregador. Por ello el candidato omite `meta.repository` y referencias que aparentarían evidencia dentro de un único remoto. El README conserva evidencia reproducible por ruta/línea y separa claramente los repositorios. HEAD/rama observados: agregador `4830f4f70410f4b90e262034f5d4159feb4e901f` (`codex/technical-docs-audit`); frontend `4c6a03a5cbb4d72c3064a964e1d3ec4d0c1d353a` (`feat/ui-hero-redesign`); backend `6c7c9fc93a46bdd57ef177e8c8551ecc43b60ff2` (`develop`). Los tres tenían cambios locales previos; frontend presenta cambios en pantallas de login/captura y backend contiene artefactos locales ajenos a este diagrama. La evidencia es del código de trabajo local indicado y no afirma que todos esos cambios estén incluidos en los HEAD.

### Validación y límites

`validate architecture ... --quality showcase --repo-root /home/d3ad/codigos/finance-ai` pasó: esquema, nueve checks geométricos y composición; cero errores/avisos y legibilidad mínima proyectada de 8 px a 1440×900. El reporte enumera cruces visuales entre rutas, aunque el validador no los clasifica como cruces ambiguos; no se declara revisión visual. `finalize` generó el HTML y pasó `validate`, `deliver` y `check`; el estado general figura `skipped` porque `browser-check` no encontró Chrome/Chromium/Edge. El chequeo visual con navegador no se completó y no se atribuye revisión perceptual. El Viewer permite exportar PNG de diagrama completo, pero esa función requiere abrir el HTML en un navegador; no se generó PNG durante esta auditoría ni se eludió la política de `file://`. Para abrirlo, abre `docs/diagrams/architecture/system-components/archify/architecture-archify.html` localmente en un navegador compatible; desde el menú del Viewer se puede guardar un PNG completo.

Comandos ejecutados desde la raíz:

```bash
node /home/d3ad/.agents/skills/archify/bin/archify.mjs validate architecture docs/diagrams/architecture/system-components/archify/architecture-archify.candidate.json --json --quality showcase --repo-root /home/d3ad/codigos/finance-ai
node /home/d3ad/.agents/skills/archify/bin/archify.mjs finalize architecture docs/diagrams/architecture/system-components/archify/architecture-archify.candidate.json docs/diagrams/architecture/system-components/archify/architecture-archify.html --json --out-dir docs/diagrams/architecture/system-components/archify/validation --quality showcase --repo-root /home/d3ad/codigos/finance-ai
```

La versión Archify final vive en su subcarpeta dedicada. No se modificó el contenido de PlantUML ni del SVG/PNG UML; sólo se reubicaron los tres artefactos canónicos.

### Evidencia manual por componente (no validada automáticamente por el repositorio del agregador)

La skill de Archify sólo admite un `meta.repository` por candidato. El repositorio del agregador (`NullCorvus/finance-ai`) contiene los subrepositorios como gitlinks, de modo que sus rutas fuente no están disponibles en su snapshot; el candidato omite repositorio/fuentes automáticas. Esta tabla es evidencia manual de archivos locales actuales, no un PASS de procedencia Git de Archify.

| Componente | Archivo y líneas inspeccionadas |
|---|---|
| Navegación y presentación | `finance-ai-frontend/lib/core/router/app_router.dart:4-27,30-78` |
| Sesión y credenciales | `finance-ai-frontend/lib/features/auth/session/data/auth_session_repository.dart:21-50`; `.../secure_credential_store.dart:1-35` |
| Funciones financieras — pantallas | `finance-ai-frontend/lib/core/router/app_router.dart:4-27,30-78` |
| Captura y revisión en Flutter | `finance-ai-frontend/lib/features/text_capture/data/text_capture_repository.dart:48-74`; `finance-ai-frontend/lib/features/receipt_capture/data/receipt_capture_remote_data_source.dart:19-41` |
| Cliente HTTP/REST | `finance-ai-frontend/lib/core/api/api_client.dart:71-92,150-180` |
| API REST FastAPI | `finance-ai-backend/src/finance_ai/main.py:11-21`; `finance-ai-backend/src/finance_ai/api/router.py:16-28` |
| Autenticación y sesiones | `finance-ai-backend/src/finance_ai/auth/session_schemas.py:80-100`; `.../credentials.py:17-32`; `.../session_service.py:103-148` |
| Servicios financieros — cuentas | `finance-ai-backend/src/finance_ai/accounts/service.py:30-62` |
| Servicios financieros — categorías | `finance-ai-backend/src/finance_ai/categories/service.py:23-52` |
| Servicios financieros — gastos | `finance-ai-backend/src/finance_ai/expenses/service.py:47-90,228-243` |
| Servicios financieros — ingresos | `finance-ai-backend/src/finance_ai/incomes/service.py:15-43` |
| Servicios financieros — transferencias | `finance-ai-backend/src/finance_ai/transfers/service.py:18-42` |
| Servicios financieros — presupuestos | `finance-ai-backend/src/finance_ai/budgets/service.py:37-88` |
| Dashboard | `finance-ai-backend/src/finance_ai/dashboard/router.py:26-31` |
| Captura de texto | `finance-ai-backend/src/finance_ai/capture/service.py:101-146,225-235,240-281,291-360`; `.../repository.py:16-56` |
| Captura de recibos | `finance-ai-backend/src/finance_ai/receipts/router.py:139-183,271-283`; `.../service.py:22-56`; `.../gateway.py:190-216` |
| Gateway de texto | `finance-ai-backend/src/finance_ai/capture/gateway.py:46-74,178-230` |
| Gateway de visión | `finance-ai-backend/src/finance_ai/receipts/gateway.py:333-347,414-470` |
| Repositorios / Unit of Work | `finance-ai-backend/src/finance_ai/db/receipt_uow.py:1-80`; UoW por dominio en servicios citados arriba |
| PostgreSQL | `finance-ai-backend/src/finance_ai/db/session.py:10-27`; `finance-ai-backend/compose.yaml:3-22` |
| Gemini API | `finance-ai-backend/src/finance_ai/capture/gateway.py:178-230`; `.../receipts/gateway.py:333-347,414-470` |
| DeepSeek API | `finance-ai-backend/src/finance_ai/capture/gateway.py:178-230`; `.../receipts/gateway.py:333-347,414-470` |

El contenido backend se verificó en el checkout de trabajo señalado, no contra el SHA del agregador. Las referencias abreviadas con `.../` conservan el prefijo del directorio padre indicado en la misma celda.
