# Finance AI: auditoría del diagrama de componentes

## Entrega actual

- [PNG principal para el PGC](uml/architecture-components.png)
- [SVG vectorial](uml/architecture-components.svg)
- [Fuente PlantUML editable](uml/architecture-components.puml)
- [HTML Archify interactivo](archify/architecture-archify.html), [fuente editable](archify/architecture-archify.candidate.json) y [PNG estático del diagrama Archify](archify/architecture-archify.png).
- [Secuencia UML de captura de recibo HU-015](../../sequence/receipt-capture/README.md), con PNG y fuente PlantUML.

El PNG UML actual tiene fondo blanco, mide 2953 × 3199 px a 300 dpi y conserva proporción 0,923. En A4 vertical con márgenes de 1,5 cm, puede colocarse a 18 × 19,5 cm; el tamaño impreso del texto es aproximadamente 8,8 pt. La densidad de píxeles conserva nitidez, pero no agranda el texto impreso.

## Alcance y correcciones

Esta revisión corrige el diagrama UML existente para reflejar las responsabilidades implementadas: mantiene separadas las capturas de texto y recibos y los gateways de texto y visión, traslada Repositorios/Unit of Work al backend y muestra PostgreSQL como sistema de persistencia separado. Sustituye la interfaz `FinanceAPI` y el conector de provisión anteriores por una dependencia directa cliente→API REST, elegida por claridad gráfica. Una interfaz UML provista/requerida también sería válida si se quisiera destacar ese contrato; UML no exige que exista una interfaz de código correspondiente. No incluye clases, endpoints, tablas ni módulos planificados.

La vista agrupa cuatro paquetes: frontend Flutter, backend FastAPI, persistencia PostgreSQL e IA. El paquete IA contiene un único componente abstracto, `Proveedor externo de IA`. En Flutter, navegación/presentación conecta con gestión financiera, captura y sesión; los clientes dependen del cliente HTTP/REST. El backend publica REST v1 y delega en autenticación, servicios financieros y componentes de captura. Las capturas producen propuestas revisables; la confirmación invoca los servicios financieros que registran gastos, ingresos o transferencias. Las propuestas de texto se guardan temporalmente; el procesamiento de imagen usa memoria y conserva la propuesta estructurada hasta la confirmación. Los servicios usan repositorios/Unit of Work y PostgreSQL.

Los gateways internos de texto y visión se mantienen separados; ambos dependen del componente abstracto `Proveedor externo de IA`. No se exponen nombres comerciales, modelos, endpoints ni claves. El bloque externo representa la frontera arquitectónica de integración y no agrega un servicio intermedio.

Las 22 flechas son dependencias dirigidas del cliente al proveedor (`..>` en PlantUML); son relaciones estructurales y no representan el orden de ejecución. El cliente depende de la API mediante HTTPS/REST; el backend depende de servicios de aplicación y estos de persistencia y proveedores. Los gateways aplican la selección y el fallback configurados sobre la misma abstracción externa; esto no representa invocaciones simultáneas. La confirmación de propuestas es una regla de negocio explicada aquí, no una secuencia codificada como flecha temporal. Se usa la notación de componente UML2 y paquetes; no se dibujan interfaces explícitas, lollipops/sockets, puertos/conectores, nodos de despliegue ni artefactos, porque no aportan una abstracción existente necesaria. El estándar define semántica de dependencias, Usage e interfaces (OMG UML 2.5.1 §§7.7.3.1–2, 10.4.3–4 y componentes §11.6); la composición y alineación son decisiones gráficas. Que PlantUML lo renderice no certifica conformidad formal.

## Evidencia actual de implementación

Los paths son relativos al agregador `/home/d3ad/codigos/finance-ai`. Los prefijos `finance-ai-frontend/` y `finance-ai-backend/` son repositorios Git anidados. La evidencia se contrastó manualmente con los archivos de trabajo actuales y los HEAD indicados más abajo. La tabla sigue el enfoque pragmático de building blocks de [arc42 §5](https://docs.arc42.org/section-5/): una vista de nivel superior, responsabilidades, relaciones y ubicación del código.

| Componente | Responsabilidad | Relaciones/dependencias principales | Ubicación en código cuando aplique |
|---|---|---|---|
| Navegación y presentación | Enruta a pantallas y presenta las funciones de Finance AI. | Depende de Interfaz de gestión financiera, Interfaz de captura y Gestión de sesión. | `finance-ai-frontend/lib/core/router/app_router.dart:4-27,30-78` |
| Interfaz de gestión financiera | Presenta cuentas, categorías, gastos, ingresos, transferencias, presupuestos, dashboard e historial. | Depende del Cliente HTTP/REST. | `finance-ai-frontend/lib/core/router/app_router.dart:4-27,30-78` |
| Interfaz de captura texto y recibos | Recoge entradas, muestra propuestas y solicita su confirmación o descarte. | Depende del Cliente HTTP/REST; no invoca directamente proveedores externos. | `finance-ai-frontend/lib/features/text_capture/data/text_capture_repository.dart:48-74`; `finance-ai-frontend/lib/features/receipt_capture/data/receipt_capture_remote_data_source.dart:19-41` |
| Gestión de sesión y credenciales | Gestiona inicio, renovación y cierre de sesión y el almacenamiento cliente de credenciales. | Depende del Cliente HTTP/REST. | `finance-ai-frontend/lib/features/auth/session/data/auth_session_repository.dart:21-50`; `finance-ai-frontend/lib/features/auth/session/data/secure_credential_store.dart:1-35` |
| Cliente HTTP/REST JSON · multipart | Envía solicitudes autenticadas al backend y carga archivos de recibo. | Depende de API REST v1 mediante HTTPS/REST. | `finance-ai-frontend/lib/core/api/api_client.dart:71-92,150-180` |
| API REST v1 | Punto de entrada FastAPI; monta routers y delega en los servicios. | Depende de Autenticación y sesiones, Servicios financieros, Captura de texto y Captura de recibos. | `finance-ai-backend/src/finance_ai/main.py:11-21`; `finance-ai-backend/src/finance_ai/api/router.py:16-28` |
| Autenticación y sesiones | Valida credenciales opacas y administra sesiones renovables. | Depende de Repositorios y UoW por módulo para persistencia. | `finance-ai-backend/src/finance_ai/auth/session_schemas.py:80-100`; `finance-ai-backend/src/finance_ai/auth/credentials.py:17-32`; `finance-ai-backend/src/finance_ai/auth/session_service.py:103-148` |
| Servicios financieros | Ejecuta operaciones de cuentas, categorías, gastos, ingresos, transferencias y presupuestos; expone consultas financieras y dashboard. | Depende de Repositorios y UoW por módulo; las capturas los invocan al confirmar una propuesta. | `finance-ai-backend/src/finance_ai/accounts/service.py:30-62`; `finance-ai-backend/src/finance_ai/categories/service.py:23-52`; `finance-ai-backend/src/finance_ai/expenses/service.py:47-90,228-243`; `finance-ai-backend/src/finance_ai/incomes/service.py:15-43`; `finance-ai-backend/src/finance_ai/transfers/service.py:18-42`; `finance-ai-backend/src/finance_ai/budgets/service.py:37-88`; `finance-ai-backend/src/finance_ai/dashboard/router.py:26-31` |
| Captura de texto propuestas y confirmación | Interpreta texto y mantiene un borrador revisable; la confirmación solicita la operación financiera definitiva. | Depende de Repositorios y UoW por módulo, Servicios financieros y Gateway de texto. | `finance-ai-backend/src/finance_ai/capture/service.py:101-146,225-235,240-281,291-360`; `finance-ai-backend/src/finance_ai/capture/repository.py:16-56` |
| Captura de recibos propuestas y confirmación | Extrae y guarda una propuesta temporal; permite editarla, confirmarla o descartarla. El gasto sólo se registra al confirmar. | Depende de Repositorios y UoW por módulo, Servicios financieros y Gateway de visión. | `finance-ai-backend/src/finance_ai/receipts/router.py:139-183,250-283`; `finance-ai-backend/src/finance_ai/receipts/service.py:22-56`; `finance-ai-backend/src/finance_ai/receipts/repository.py:37-54`; `finance-ai-backend/src/finance_ai/receipts/gateway.py:190-216`; `finance-ai-backend/src/finance_ai/expenses/service.py:90-225` |
| Gateway de texto selección y fallback | Adapta solicitudes textuales y selecciona/fallback entre proveedores configurados. | Depende de Proveedor externo de IA. | `finance-ai-backend/src/finance_ai/capture/gateway.py:46-74,178-230` |
| Gateway de visión selección y fallback | Adapta la extracción visual de recibos y aplica la selección/fallback configurados. | Depende de Proveedor externo de IA. | `finance-ai-backend/src/finance_ai/receipts/gateway.py:333-347,414-470` |
| Repositorios y UoW por módulo | Abstrae lecturas, escrituras y transacciones de persistencia por dominio. Aquí “repositorios” son patrones de acceso a datos, no los repositorios Git anidados del frontend y backend. | Es usado por autenticación, servicios financieros y capturas; depende de PostgreSQL. | `finance-ai-backend/src/finance_ai/db/receipt_uow.py:1-80`; `finance-ai-backend/src/finance_ai/auth/uow.py`; `finance-ai-backend/src/finance_ai/expenses/uow.py`; `finance-ai-backend/src/finance_ai/receipts/uow.py` |
| PostgreSQL almacenamiento relacional | Persiste sesiones, datos financieros y propuestas de recibo. | Proveedor de persistencia para Repositorios y UoW por módulo. | `finance-ai-backend/src/finance_ai/db/session.py:10-27`; `finance-ai-backend/compose.yaml:3-22` |
| Proveedor externo de IA | Frontera abstracta hacia proveedores configurados; representa una integración externa, no un servicio agregador adicional. | Es usado por los gateways internos de texto y visión. | Adaptadores en `finance-ai-backend/src/finance_ai/capture/gateway.py:178-230` y `finance-ai-backend/src/finance_ai/receipts/gateway.py:333-347,414-470` |

Se muestran sólo componentes respaldados por código ejecutable. Los repositorios Git `finance-ai-frontend/` y `finance-ai-backend/` contienen código; el componente Repositorios/UoW, en cambio, es una abstracción de persistencia dentro del backend. Hay UoW por módulo, no una única instancia global. Las propuestas generadas por captura no son operaciones financieras confirmadas: las operaciones definitivas pasan por Servicios financieros después de una confirmación solicitada por la persona.

### Cómo se relacionan Archify y UML

El [HTML Archify](archify/architecture-archify.html) ofrece una vista navegable de alto nivel de las mismas cuatro zonas y las relaciones principales. Para mantener esa vista compacta, agrupa Captura de texto, Captura de recibos y los gateways separados en UML bajo Procesamiento de captura IA y Gateways internos de IA; no añade servicios diferentes. El [diagrama UML](uml/architecture-components.png) expone esas responsabilidades por separado y es la referencia de los nombres exactos de componente y dependencias estructurales. Ninguna flecha debe leerse como secuencia temporal. La secuencia específica de recibo se documenta en [HU-015](../../sequence/receipt-capture/README.md), con su [fuente PlantUML](../../sequence/receipt-capture/receipt-capture-hu015.puml) y [PNG](../../sequence/receipt-capture/receipt-capture-hu015.png).

## Repositorios y estado Git

| Repositorio | HEAD completo | Rama | Estado al auditar |
|---|---|---|---|
| Agregador `finance-ai` | `05d499103875bc48e937b36e45f2cdcbc5c5fe2f` | `codex/technical-docs-audit` | Sucio previamente; 153 entradas en `status` incluyen archivos preexistentes y esta documentación. No se limpiaron cambios. |
| `finance-ai-frontend` | `4c6a03a5cbb4d72c3064a964e1d3ec4d0c1d353a` | `feat/ui-hero-redesign` | Sucio previamente, 91 entradas. |
| `finance-ai-backend` | `6c7c9fc93a46bdd57ef177e8c8551ecc43b60ff2` | `develop` | Sucio previamente, 4 entradas; las fuentes citadas se leyeron de archivos actuales. |

Los worktrees alternos no fueron fuente de verdad. El grafo Graphify existente estaba sucio y mezclaba etapas/documentación: se consultó como índice auxiliar sin regenerarlo; las afirmaciones finales se comprobaron en el código actual citado. No se ejecutaron builds ni suites Flutter, pues el cambio es documental.

## Render y revisión visual

PlantUML 1.2026.9 se ejecutó desde `/home/d3ad/.local/share/plantuml/plantuml.jar`; se renderizó el `.puml` por stdin a un SVG temporal fresco con Graphviz local, luego se generó el PNG a 2953 px y se etiquetó a 300 dpi. El SVG resultante contiene 15 componentes, cuatro paquetes y 22 dependencias. Se validó como XML y se inspeccionó el PNG: fondo blanco, iconos UML2 y bordes de componentes visibles, texto y todos los elementos dentro del lienzo. Se conservaron dependencias necesarias; el tamaño y espaciado se ajustaron para una página A4 dedicada. Algunas dependencias llegan próximas entre sí a Servicios financieros y Repositorios/UoW, debido a que varios servicios consumen esas mismas abstracciones; el render no superpone cajas ni texto. La frontera del paquete de IA cruza una ruta hacia el proveedor, sin tapar nodos ni rótulos.

El bloque `<style>` anterior estaba interfiriendo con los trazos de las cajas UML2 en esta versión del motor. Se retiró y se aplicaron `skinparam` explícitos (`componentStyle uml2`, fondo blanco, borde negro, fuente Helvetica, 18 px y sombreado desactivado). Esta alternativa preserva símbolos de componente legibles y fue verificada en el SVG renderizado. Las restricciones `hidden` restantes sólo guían la distribución; no representan relaciones del sistema.

Comandos reproducibles desde la raíz del repositorio (requieren PlantUML 1.2026.9, Graphviz local, `rsvg-convert` e ImageMagick):

```bash
GRAPHVIZ_DOT=/home/d3ad/.local/share/graphviz/usr/bin/dot \
PATH=/home/d3ad/.local/share/graphviz/usr/bin:$PATH \
LD_LIBRARY_PATH=/home/d3ad/.local/share/graphviz/usr/lib \
GVBINDIR=/home/d3ad/.local/share/graphviz/usr/lib/graphviz \
java -jar /home/d3ad/.local/share/plantuml/plantuml.jar -tsvg -pipe \
  < docs/diagrams/architecture/system-components/uml/architecture-components.puml \
  > /tmp/finance-ai-components-current.svg
rsvg-convert -b white --dpi-x 300 --dpi-y 300 --width 2953 \
  -o docs/diagrams/architecture/system-components/uml/architecture-components.png \
  /tmp/finance-ai-components-current.svg
mogrify -units PixelsPerInch -density 300 \
  docs/diagrams/architecture/system-components/uml/architecture-components.png
```

En aquella revisión de la auditoría PNG, el browser-check de Archify quedó omitido por ausencia de Chromium/Chrome/Edge en el host y el navegador integrado bloqueó `file://`; no se inició un servidor local ni se eludió esa política. La versión Archify se actualizó posteriormente y su estado vigente, validación y límites se describen en la sección «Archify actualizado».

## Fuentes normativas y skills

- [OMG UML 2.5.1](https://www.omg.org/spec/UML/2.5.1/PDF), especialmente §§ 7.7.3.1–2 (Dependency/Usage), 10.4.3–4 (Interfaces), 11.6 (Components).
- [PlantUML: Component Diagram](https://plantuml.com/en/component-diagram).
- [Skill PlantUML](https://github.com/samonysh/plantuml-skill); referencias locales de sintaxis, diseño de bajo nivel y estilo.
- Archify: `/home/d3ad/.agents/skills/archify/SKILL.md`; referencias de authoring y entrega ya aplicadas a la versión anterior.
- Graphify: `/home/d3ad/codigos/finance-ai/.agents/skills/graphify/SKILL.md`; consulta existente, sin regeneración del grafo sucio.

## Archify actualizado (revisión 5 · PNG estático incluido)

- [HTML interactivo](archify/architecture-archify.html)
- [Candidato editable](archify/architecture-archify.candidate.json)
- [PNG estático derivado del SVG de Archify](archify/architecture-archify.png) (2953 × 3275 px; metadatos 300 dpi)
- Recibos vigentes: `archify/validation/architecture-archify.finalize.json`, `archify/validation/architecture-archify.finalize-summary.json` y `archify/validation/architecture-archify.browser-check.json`; `archify/architecture-archify.delivery.json` acompaña al HTML.

El candidato contiene 13 componentes, 17 relaciones estructurales, cuatro regiones y cuatro tarjetas informativas. Flutter agrupa navegación/presentación, sesión, gestión financiera, captura IA y cliente HTTP. FastAPI agrupa API REST, autenticación/sesiones, servicios financieros, procesamiento de captura y gateways internos. Los gateways resumen adaptadores separados de texto y visión existentes en el backend. El diagrama contiene un único componente externo abstracto llamado «Proveedor externo de IA», sin nombres comerciales ni modelos. Representa el límite de integración; no es un servicio agregador adicional. Los gateways internos de texto y visión se conectan a esa abstracción y pueden aplicar selección/fallback según configuración.

La ruta manual enlaza interfaz financiera → cliente HTTP → API REST → servicios financieros → acceso a datos → PostgreSQL y no pasa por captura/gateways IA. La ruta asistida genera una propuesta revisable; la persona puede editar, confirmar o descartar. Sólo después de confirmar, el procesamiento de captura invoca los servicios financieros para crear el gasto, ingreso o transferencia definitiva (la confirmación de recibo crea el gasto). Los borradores de texto/recibo son temporales; la imagen se procesa en memoria. El PNG representa el SVG diagramático; las tarjetas de explicación y controles interactivos permanecen en el HTML.

La tarjeta de finanzas enumera cuentas, categorías, gastos, ingresos, transferencias, presupuestos, dashboard e historial. Los componentes incluyen descripciones visibles en sus subtítulos y etiquetas. La leyenda usa modo automático y los cuatro tipos presentes: frontend azul/cian, backend verde, persistencia morada y proveedor externo gris. El HTML declara tema oscuro y preset clásico como estado inicial del Viewer. La evidencia de cada componente continúa en la tabla manual de abajo; no se atribuye validación automática de procedencia multirepositorio.

### Validación, exportación y límites

En la validación cuyo recibo acompaña al HTML, el candidato pasó los checks de esquema/relaciones y composición `showcase` sin errores; el recibo confirma el SHA del candidato y HTML. `finalize` pasó `validate`, `deliver` y `check`; `browser-check` quedó omitido (`viewer/chrome-unavailable`) porque el host no dispone de Chrome/Chromium/Edge. No se eludió la política que bloquea `file://`, no se inició un servidor local y no se afirma que el HTML interactivo se haya validado en navegador.

Para obtener el PNG se extrajo el único SVG completo embebido en el HTML, se resolvieron offline los tokens oscuros y las clases semánticas del propio Viewer, se mantuvo la pila sans-serif del Viewer (con Arial disponible como fallback), y se renderizó esa geometría vectorial con `rsvg-convert`; `mogrify` añade metadatos 300 dpi sin cambiar las dimensiones en píxeles. El marco de zona conserva la mezcla sRGB oscura del tema clásico. Se inspeccionó visualmente el PNG. Es una representación estática del diagrama, no captura de pantalla, export del Viewer ni comprobación de interacción.

Para explorar descripciones y tarjetas, abre `archify/architecture-archify.html` en un navegador compatible; el HTML se puede abrir localmente desde el gestor de archivos. Las referencias manuales a código y la limitación del agregador/gitlinks siguen documentadas en la sección siguiente.



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

En la revisión 4, `validate architecture ... --quality showcase --repo-root /home/d3ad/codigos/finance-ai` pasó esquema, nueve checks geométricos y composición sin errores ni avisos. El `finalize` de esa revisión pasó `validate`, `deliver` y `check`; `browser-check` quedó omitido porque el host no tenía Chrome/Chromium/Edge, y entonces aún no se había generado PNG. En la revisión actual se generó e inspeccionó visualmente el PNG estático derivado del SVG (descrito arriba); el HTML interactivo sigue sin validación en navegador. No se inició un servidor local ni se eludió la política de `file://`. Para explorar la interacción, abre `archify/architecture-archify.html` en un navegador compatible; desde el menú del Viewer se puede guardar su PNG completo.

Comandos ejecutados desde la raíz:

```bash
node /home/d3ad/.agents/skills/archify/bin/archify.mjs validate architecture docs/diagrams/architecture/system-components/archify/architecture-archify.candidate.json --json --quality showcase --repo-root /home/d3ad/codigos/finance-ai
node /home/d3ad/.agents/skills/archify/bin/archify.mjs finalize architecture docs/diagrams/architecture/system-components/archify/architecture-archify.candidate.json docs/diagrams/architecture/system-components/archify/architecture-archify.html --json --out-dir docs/diagrams/architecture/system-components/archify/validation --quality showcase --repo-root /home/d3ad/codigos/finance-ai
```

La versión Archify final vive en su subcarpeta dedicada. Esta revisión UML posterior sí actualiza el `.puml`, el PNG y el SVG auxiliar; los archivos Archify permanecen sin cambios.

### Evidencia y procedencia Archify

La skill de Archify sólo admite un `meta.repository` por candidato. El agregador (`NullCorvus/finance-ai`) contiene frontend y backend como gitlinks, por lo que el candidato omite `meta.repository` y referencias que aparentarían procedencia automática dentro de un único repositorio. La tabla de building blocks anterior concentra los nombres y paths inspeccionados manualmente; esto no es un PASS de procedencia Git de Archify. El contenido backend se contrastó con el checkout de trabajo indicado en la tabla de repositorios, no contra el SHA del agregador.
