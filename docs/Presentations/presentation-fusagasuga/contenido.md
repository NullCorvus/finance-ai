# Contenido de la presentación de Fusagasugá

Estado: **borrador del 2026-11-04 para revisión del equipo.** Es la fase 2 de [PLAN-FUSAGASUGA.md](PLAN-FUSAGASUGA.md). La presentación ya está construida a partir de este texto en [interactive/](interactive/index.html) (ver [README.md](README.md)); si se cambia una frase aquí, hay que cambiarla también en su escena y en sus notas de estudio.

Cómo leerlo:

- Las líneas que empiezan con `>` son el **guion oral** de cada escena (lo que se dice en voz alta). Todo lo demás es apoyo y no se lee.
- `[[...]]` marca un dato que falta y que no inventé (grupo, quién presenta).
- `<!-- TODO -->` marca una afirmación o referencia que el equipo debe confirmar antes de ponerla en pantalla.
- Cada cifra lleva su fecha de verificación. Verifiqué contra el código y la documentación de las ramas `develop` (backend `fe6b8f2`, app `35df926`), las mismas que usó la presentación PGC.

## 1. Resumen

| # | Escena | Criterios | Presenta | Tiempo |
|---|---|---|---|---:|
| 1 | Portada | 7.1 | [[ ]] | 0:30 |
| 2 | Contexto y problema | 1.1, 1.2 | [[ ]] | 1:20 |
| 3 | Justificación | 1.3 | [[ ]] | 0:45 |
| 4 | Objetivos | 1.4 | [[ ]] | 1:15 |
| 5 | Producto: captura asistida | 2.1 | [[ ]] | 1:00 |
| 6 | Producto: análisis, historial y presupuestos | 2.1 | [[ ]] | 1:05 |
| 7 | Marco teórico | 3.1 | [[ ]] | 1:45 |
| 8 | Plataformas, integración y escalabilidad | 4.1, 4.2, 4.3 | [[ ]] | 1:30 |
| 9 | Seguridad y acceso | 4.4 | [[ ]] | 1:20 |
| 10 | Gestión del conocimiento | 5.1, 5.2 | [[ ]] | 1:50 |
| 11 | Conclusiones | 6.1 | [[ ]] | 1:15 |
| 12 | Aportes | 6.2 | [[ ]] | 0:55 |
| 13 | Cierre y paso a la app | — | [[ ]] | 0:30 |

Los tiempos salen de contar las palabras de cada guion a unas 119 por minuto (el ritmo del PGC) y se ajustaron para sumar **15:00**. Ver la sección 6 para el conteo.

## 2. Guion por escena

### Escena 1 · Portada (0:30)

**Criterios:** identifica al grupo (7.1). **Presenta:** [[ ]]

**En pantalla:** Finance AI · título formal del proyecto · «Proyecto de Gestión del Conocimiento» · Ingeniería de Sistemas y Computación · Grupo [[N.º]] · 6 de noviembre de 2026 · David Fernando Gonzalez Soler, Maicol Estiven Fonseca Muñoz, Ivan David Giraldo Garavito <!-- TODO: confirmar que son los mismos tres y el número de grupo --> · sello de Acreditación Institucional · QR de descarga.

**Guion oral**

> Buenas. Somos David, Maicol e Ivan, del grupo [[N.º]] de Ingeniería de Sistemas y Computación.
> Presentamos Finance AI, una aplicación móvil para registrar y analizar gastos personales, en la que una inteligencia artificial propone el registro y la persona lo confirma.
> Seguiremos el orden de los aspectos de evaluación y al final mostraremos la aplicación funcionando. El código QR permite descargarla.

**Apoyo:** título formal aprobado (`PGC-PROPUESTA.md`): «Aplicación móvil para el registro y análisis de gastos personales con asistencia de IA para la captura automática de gastos». La portada del PGC agradecía al docente Oscar Jobany Gómez Ochoa; confirmar si es el mismo docente en este evento. La portada no lleva código estudiantil, porque la plantilla solo pide título, grupo y nombres.

### Escena 2 · Contexto y problema (1:20)

**Criterios:** 1.1 Introducción (1,0), 1.2 Planteamiento del problema (1,5). **Presenta:** [[ ]]

**En pantalla:** dato «66,6 % de las operaciones monetarias en Colombia, por canales digitales (Banca de las Oportunidades, 2024)» · formulario que se llena una y otra vez: monto, cuenta, categoría, fecha · días sin registrar con «?» · pregunta guía.

**Guion oral**

> La vida financiera de las personas ocurre cada vez más en el celular: en Colombia, el 66,6 % de las operaciones monetarias se hace por canales digitales, según la Banca de las Oportunidades en su reporte de 2024. Aun así, llevar el control de los propios gastos sigue siendo manual.
> Registrar una sola compra exige escribir el monto, elegir la cuenta, asignar una categoría y revisar la fecha. Ese esfuerzo se repite con cada compra y el registro se interrumpe. Sin un registro sistemático, la persona no sabe en qué gasta y decide sin información.
> Esto afecta a cualquiera que controle sus gastos desde el celular; por eso es una aplicación Android, que pensamos publicar en Google Play. La pregunta que guía el proyecto es cómo puede una aplicación móvil con asistencia de inteligencia artificial facilitar el registro y el análisis de los gastos, reduciendo el esfuerzo de captura y contribuyendo a formar el hábito de control financiero.

**Apoyo:** texto aprobado del problema en `PGC-PROPUESTA.md` (v5, 2026-08-15). La cifra de retención de apps de finanzas (4,2 %, Curry 2026) va en la escena 7, no aquí. En el PGC el equipo decidió no poner en pantalla una cifra de abandono no verificada; esta sí está verificada en la propuesta.

### Escena 3 · Justificación (0:45)

**Criterios:** 1.3 Justificación (1,0). **Presenta:** [[ ]]

**En pantalla:** cuatro tarjetas: «IA accesible» · «Para quién» · «La persona decide» · «Viable como prototipo».

**Guion oral**

> El proyecto se justifica por cuatro razones. La inteligencia artificial para interpretar gastos ya es accesible, lo que permite reducir el esfuerzo de registrar. Sirve a cualquier persona que quiera controlar sus gastos desde el celular: es una aplicación Android, con publicación prevista en Google Play. La persona conserva el control: la inteligencia artificial solo propone, y ella confirma, edita o descarta antes de guardar. Y es viable como prototipo académico, con herramientas de bajo costo.

**Apoyo:** justificación aprobada (v4, 2026-08-15). La viabilidad de la propuesta dice «servicios con niveles gratuitos o cuotas de prueba, sujetos a las condiciones vigentes de los proveedores»; si preguntan por costos, existe `docs/receipt-ai-cost-measurement-2026-10-26.md`.

### Escena 4 · Objetivos (1:15)

**Criterios:** 1.4 Objetivos (1,5). **Presenta:** [[ ]]

**En pantalla:** objetivo general en tres partes (qué, cómo, para qué) · recorrido CDIO de cinco nodos.

**Guion oral**

> Nuestro objetivo general es desarrollar una aplicación móvil para el registro, la categorización y el análisis de gastos personales, con asistencia de IA para la captura automática de gastos, aplicando la metodología CDIO, con el fin de reducir el esfuerzo de captura de los gastos y contribuir a la formación del hábito de control financiero en los usuarios.
> Hay un objetivo específico por fase. Concebir: definir el alcance, los requisitos y el flujo de confirmar, editar o descartar. Diseñar: la arquitectura, el modelo de datos y las pantallas de captura y confirmación. Implementar, en dos objetivos: la captura con inteligencia artificial por foto, voz o texto, y el análisis de gastos por categoría en el período elegido. Operar: publicar la aplicación en Google Play y validarla con usuarios reales.

**Apoyo:** el general es el texto aprobado, sin cambios. Los cinco específicos conservan número y orden. **El objetivo 5 usa el ajuste del 30-oct-2026** (publicar en Google Play y validar con usuarios reales). La propuesta escrita (`PGC-PROPUESTA.md`, `main.tex`) habla de pruebas funcionales y una encuesta de usabilidad. Si el jurado tiene el documento, esa es la diferencia que hay que poder explicar (decisión 1, sección 8, ya resuelta a favor del ajuste). La escena 11 depende de esto: las conclusiones se miden contra el mismo texto.

### Escena 5 · Producto: captura asistida (1:00)

**Criterios:** 2.1 Productos desarrollados (5,0), primera parte. **Presenta:** [[ ]]

**En pantalla:** teléfono con la pantalla real de propuesta (captura `captura-propuesta-actual.png`, datos de demostración) · frase «Almuerzo 18 mil con Nequi» que se escribe sola · tres pasos: Capturas, Revisas, Confirmas.

**Guion oral**

> Esto es lo que construimos. La persona escribe «almuerzo 18 mil con Nequi», fotografía un recibo o dicta; en Android, el dictado se transcribe en el teléfono y entra como texto.
> El servidor pide a un modelo de inteligencia artificial una propuesta con monto, descripción, cuenta, categoría y fecha, y solo puede usar las cuentas y categorías de esa persona. Si falta un dato, como la cuenta o la moneda, pregunta en lugar de adivinar.
> La persona revisa, corrige, confirma o descarta. Al confirmar, el movimiento se guarda una sola vez, aunque la solicitud se repita. El modelo nunca escribe en el registro financiero, y si la IA falla queda el formulario manual.

**Apoyo:** ver evidencias E5–E9 (sección 5). Las vistas son renders del 27-oct-2026 con datos sintéticos. El flujo de recibos incluye líneas, comercio, fecha, total y categoría (objetivo 3).

### Escena 6 · Producto: análisis, historial y presupuestos (1:05)

**Criterios:** 2.1 Productos desarrollados (5,0), segunda parte y «hasta dónde llega». **Presenta:** [[ ]]

**En pantalla:** anillo por categoría (alimentación 252.000, transporte 190.000) · historial con búsqueda · barras de presupuesto (252.000 de 400.000 y 190.000 de 200.000, con alerta) · recuadro «Hasta dónde llega» con tres líneas.

**Guion oral**

> Lo confirmado alimenta el resto de la aplicación. En Análisis, los gastos se agrupan por categoría en el período elegido: con los datos de demostración, octubre suma 442 mil pesos, 252 mil en alimentación y 190 mil en transporte. En Movimientos se busca y se filtra el historial. En Presupuestos, el avance sale de los gastos confirmados, y transporte ya muestra alerta de cercanía.
> Hasta dónde llega: Android y Windows con el mismo código; cuentas, categorías, gastos, ingresos, transferencias, presupuestos, historial y panel de inicio. No se conecta con bancos ni billeteras: Nequi o Bancolombia son nombres de cuentas que la persona crea. La IA y el análisis necesitan conexión.

**Apoyo:** capturas `analisis-actual.png`, `historial-actual.png`, `presupuestos-actual.png`, `dashboard-actual.png` (copiar de `presentation-pgc/interactive/assets/`). La lista de alcance sale del README del backend y de la auditoría del 16-oct (32 rutas). El panel de inicio incluye resumen semanal y proyección del mes (escena 10).

### Escena 7 · Marco teórico (1:45)

**Criterios:** 3.1 Fundamentos teóricos (5,0). **Presenta:** [[ ]]

**En pantalla:** recorrido aplicado de un gasto: registrar el dato, organizar la información y apoyar una decisión. Se mantienen las tarjetas de hábito (59–66 días, conductas de salud), retención (4,2 % a los 30 días, Curry) y CDIO/Scrum.

**Guion:**

> Primero, la gestión de la información financiera. Pensemos en un almuerzo de 18 mil pesos pagado con Nequi: al registrarlo, queda un dato que se puede consultar. Al agrupar los gastos por categoría y período, la persona puede compararlos con su presupuesto. Esa información le permite decidir si ajusta su gasto. Este es un ejemplo del uso de la aplicación; todavía debemos evaluar con usuarios si les ayuda a cambiar sus hábitos.
> Segundo, el hábito. Una revisión sistemática de Singh y colaboradores, de 2024, reporta una mediana de 59 a 66 días para consolidar hábitos de salud. No lo medimos en finanzas, pero indica que el registro tiene que sostenerse en el tiempo.
> Tercero, el contexto: las aplicaciones de finanzas retienen apenas el 4,2 % de sus usuarios al día 30, según Curry en 2026.
> Cuarto, la metodología: CDIO, con un objetivo por fase, y Scrum en la implementación. Las fuentes se consultan desde «Referencias» en el cierre.

**Apoyo:** las tres referencias de cifras se mantienen de `docs/PGC-PROPUESTA.md`, sección 6. El recorrido es una explicación del equipo, sin atribuirle un modelo teórico ni resultados de aprendizaje comprobados. El artículo de hábitos se cotejó en su versión de PMC; la referencia de retención se recuperó de la propuesta original, pues el sitio del editor no permitió una consulta nueva (403).

### Escena 8 · Plataformas, integración y escalabilidad (1:30)

**Criterios:** 4.1 Uso de plataformas (1,0), 4.2 Integración (1,0), 4.3 Escalabilidad (1,0). **Presenta:** [[ ]]

**En pantalla:** tres bloques. Plataformas: Flutter, FastAPI, PostgreSQL. Integración: modelos de lenguaje, reconocimiento de voz de Android, cámara. Escalabilidad: «sin estado de sesión en memoria», «hasta 3 instancias × 80 solicitudes» (con su fecha) y un paso pendiente rotulado. Paquetes de datos que viajan por la arquitectura.

**Guion oral**

> Plataformas. Flutter da una sola base de código para Android y Windows. FastAPI, en Python, expone un contrato OpenAPI de 32 rutas que la aplicación respeta como autoridad. PostgreSQL guarda importes exactos con restricciones de integridad, y los cambios de esquema se versionan con migraciones. En la nube, el servicio corre en Google Cloud Run y la base de datos en Neon.
> Integración. El servidor se conecta con proveedores de modelos de lenguaje, DeepSeek y Gemini, configurables y uno de respaldo del otro; el teléfono nunca los llama. Usamos el reconocimiento de voz de Android y la cámara del dispositivo. No integramos servicios bancarios.
> Escalabilidad. Las sesiones se guardan en la base de datos, no en la memoria del servidor, así que cualquier instancia atiende a cualquier persona. Hoy Cloud Run permite hasta tres instancias de 80 solicitudes simultáneas. El saldo no es un contador: se calcula desde los movimientos. Para crecer más, falta mover los límites de frecuencia, que hoy viven en la memoria de cada instancia, a un almacén compartido.

<!-- TODO: confirmar antes de presentar la configuración viva de Cloud Run, de Neon y el orden de los proveedores de IA; la documentación dice que pueden cambiar (instantánea del 26-oct-2026). -->

**Apoyo:** el servicio es un monolito modular a propósito (`AGENTS.md` del backend: «no crear microservicios sin una decisión de arquitectura aprobada»). No hay prueba de carga: **no afirmar capacidad en usuarios**.

### Escena 9 · Seguridad y acceso (1:20)

**Criterios:** 4.4 Seguridad y acceso (2,0, peso doble). **Presenta:** [[ ]]

**En pantalla:** escudo con cuatro capas: Contraseñas · Sesiones · Acceso a los datos · Información. Ficha de acceso que cuenta 15 minutos y se rota. Carriles de datos por usuario. Es la escena visualmente más grande de la parte técnica.

**Guion oral**

> Seguridad y acceso, en cuatro capas. Las contraseñas se guardan con Argon2id. La credencial de acceso dura 15 minutos y vive solo en la memoria de la aplicación; la renovable rota con cada uso, caduca a los 30 días sin actividad y a los 90 como máximo, se guarda en el almacenamiento seguro del teléfono y en el servidor solo como huella.
> Toda ruta que toca datos financieros exige sesión, y cada consulta se limita a la persona autenticada: una cuenta ajena responde igual que una cuenta que no existe. La base de datos refuerza esa pertenencia con claves foráneas que ligan los movimientos con sus cuentas y los presupuestos con sus categorías, siempre del mismo dueño.
> Las claves de la IA están solo en el servidor y los registros no incluyen contraseñas ni correos. El modelo define dos roles, usuario y administrador, pero hoy no hay funciones de administración.

**Apoyo:** evidencias E10–E14. **No decir «aislamiento por filas» ni «row-level security»:** no existe; la integridad por dueño se logra con restricciones y con el servicio (nota: la diapositiva D del PGC decía «también en la base de datos»; reformular allí). **No afirmar** roles con permisos distintos ni planes premium: la auditoría del 16-oct lo marca como no implementado. Si preguntan por límites, el servidor limita registro, inicio de sesión, renovación y mensajes de IA por usuario; no citar cifras, porque el README (ráfaga de 6) y el código (capacidad de 10) no coinciden. Pendiente de verificar antes de nombrarlo: pruebas contra instrucciones ocultas en imágenes de recibos (hay entradas en la bitácora sobre este tema).

### Escena 10 · Gestión del conocimiento (1:50)

**Criterios:** 5.1 Información actualizada y precisa (2,5), 5.2 Procesos de actualización del conocimiento (2,5). **Presenta:** [[ ]]

**En pantalla:** ciclo circular: capturar → validar → guardar → calcular → aprender de ello (volver a la persona) → actualizar, con reloj de «cada cuánto». Dos tarjetas: «Información precisa» y «Quién, cómo, cada cuánto». Franja inferior «conocimiento del proyecto».

**Guion oral**

> La gestión del conocimiento tiene dos partes: qué tan precisa y al día está la información, y cómo se actualiza.
> Información precisa. Hay una sola fuente de verdad: los movimientos confirmados. El saldo, el avance de los presupuestos, el resumen semanal y la proyección del mes no se guardan como números sueltos; se calculan al consultar, a partir de esos movimientos, así que no se desactualizan. Los importes son decimales exactos. Y todo lo que entra al registro pasa por las mismas validaciones, venga de un formulario o de la IA, que además necesita la confirmación de la persona.
> Actualización. La actualiza la persona. Si corrige un movimiento, el total y el movimiento de la cuenta se recalculan en una sola transacción, y saldo y presupuestos lo reflejan al consultar. Las propuestas de texto caducan a las 24 horas. Cada propuesta se arma con las cuentas y categorías vigentes de la persona, de modo que un cambio se refleja en la siguiente. Un límite: la IA no aprende de las correcciones.
> Aplicamos lo mismo al conocimiento del proyecto: unas 300 entradas de bitácora entre el 24 de septiembre y el 30 de octubre, documentación por historia de usuario, auditorías con fecha, y cifras que siempre citan cuándo se verificaron.

<!-- TODO: confirmar con el equipo la frase final sobre el conocimiento del proyecto; las cifras salen de `aidlc-docs/audit.md` (301 marcas de tiempo, 24-sep a 30-oct-2026) y deben recontarse el día de la presentación. -->

**Apoyo:** evidencias E15–E18. La proyección del mes combina el gasto diario del mes en curso con el histórico, ponderados por los días transcurridos (`dashboard/service.py`). El «aprender» del ciclo se refiere a la persona, no a la IA.

### Escena 11 · Conclusiones (1:15)

**Criterios:** 6.1 Coherencia con el desarrollo de los objetivos (3,0). **Presenta:** [[ ]]

**En pantalla:** cinco pares objetivo → conclusión que encajan con un visado; el quinto, parcial, queda ámbar. Debajo, recuadro «Aún sin medir».

**Guion oral**

> Una conclusión por objetivo. Concebir: el alcance, los requisitos y el flujo de confirmar, editar o descartar están documentados y funcionan en la aplicación. Diseñar: la arquitectura, el modelo de datos y las pantallas quedaron documentados antes de construir. Implementar la captura: una frase, un recibo o un dictado producen una propuesta que la persona confirma. Implementar el análisis: los gastos confirmados se agrupan por categoría y período y alimentan los presupuestos.
> Operar: el servicio está desplegado en la nube y lo probamos en un teléfono real, con 415 pruebas del servidor y 573 de la aplicación, verificadas en octubre. Falta publicarla en Google Play y validarla con usuarios reales.
> Todavía no podemos afirmar que reduzca el esfuerzo de captura ni que forme hábito: eso es lo que sigue por medir.

**Apoyo:** evidencias E1–E4 y E19. Documentos: `ALCANCE.md`, `FEATURES.md`, `BACKLOG-AND-STORIES.md` (objetivo 1), `ARCHITECTURE.md`, `SCHEMA.md`, `UML.md`, `MOCKUPS.md` (objetivo 2). Si el objetivo 5 vuelve al texto de la propuesta, esta conclusión debe decir que falta la encuesta de usabilidad.

### Escena 12 · Aportes (0:55)

**Criterios:** 6.2 Aportes (2,0). **Presenta:** [[ ]]

**En pantalla:** tres anillos: Personas · Ingeniería de software · Sociedad.

**Guion oral**

> Dejamos tres aportes. A las personas que registran sus gastos, una herramienta que propone el registro y no escribe por sí sola; que reduzca el esfuerzo es nuestra hipótesis, todavía sin medir. A la ingeniería de software con IA, un patrón aplicado, probado y documentado: la IA propone, un servicio determinista valida y la persona confirma. A la sociedad, la apuesta de que más personas lleven el control de su dinero y decidan con información, en un país donde el 66,6 % de las operaciones monetarias ya es digital. Publicarla en Google Play la pone al alcance de cualquiera, y validarla con usuarios reales dirá si de verdad ayuda.

<!-- TODO: los tres aportes son una redacción a partir de lo verificado; el equipo decide si los suscribe y si agrega alguno más (por ejemplo, abrir el código o la documentación, si ese es el plan). Cambio del 2026-11-05 a petición del equipo: el tercer aporte ya no es «a la universidad» (no se hizo un proyecto de ese tipo) sino «a la sociedad», con Google Play y la validación con usuarios reales como prueba pendiente. Es una apuesta, no un resultado: no afirmar que ya formó hábitos ni que ya llegó a estudiantes. -->

### Escena 13 · Cierre y paso a la aplicación (0:30)

**Criterios:** ninguno propio; sostiene 7.3. **Presenta:** [[ ]]

**En pantalla:** «Probemos con la app real» con brillo sobre «app real» · cuatro pasos (Escribir, Revisar, Confirmar, Ver) · QR.

**Guion oral**

> Eso es lo que construimos. Ahora lo probamos con la aplicación real, con un gasto cotidiano: «almuerzo 18 mil con Nequi». Lo escribimos, revisamos la propuesta y corregimos un campo, confirmamos una sola vez y vemos el saldo y el historial actualizados. Después responderemos sus preguntas. Gracias.

**Apoyo:** guion y preparación de la demostración: los del PGC (`presentation-pgc/slides.md`, escena 10), con cuenta sintética, dos cuentas, recibo de prueba y grabación de respaldo por si falla el servidor.

## 3. Respaldo (teclas A–E)

| Letra | Tema | Origen | Nota |
|---|---|---|---|
| A | Modelo de datos y libro de movimientos | PGC respaldo A | Reutilizar |
| B | De palabras a una propuesta de IA | PGC respaldo B | Reutilizar |
| C | Recibos y voz | PGC respaldo C | Reutilizar |
| D | Seguridad y calidad | PGC respaldo D | **Reformular** «aislamiento también en la base de datos» (ver escena 9) |
| E | Dónde se cubre cada criterio | Nuevo | Es la matriz de la sección 4, animada |


## 4. Matriz de cobertura de la rúbrica

| Criterio | Valor | Escena | Dónde está la evidencia |
|---|---:|---|---|
| 1.1 Introducción | 1,0 | 2 | Cifra de la Banca de las Oportunidades, propuesta |
| 1.2 Planteamiento del problema | 1,5 | 2 | Problema aprobado v5, pregunta guía |
| 1.3 Justificación | 1,0 | 3 | Justificación aprobada v4 |
| 1.4 Objetivos | 1,5 | 4, 11 | Objetivos aprobados; objetivo 5 ajustado (decisión 1) |
| 2.1 Productos desarrollados | 5,0 | 5, 6, 13 | App en funcionamiento, demostración, E5–E9 |
| 3.1 Fundamentos teóricos | 5,0 | 7 | Referencias, sección 5 (**depende de las decisiones 3 y 4**) |
| 4.1 Uso de plataformas | 1,0 | 8 | E10–E11 |
| 4.2 Integración con sistemas existentes | 1,0 | 8 | E8–E9, E12 |
| 4.3 Escalabilidad | 1,0 | 8 | E12–E13 |
| 4.4 Seguridad y acceso | 2,0 | 9, respaldo D | E14–E18 |
| 5.1 Información actualizada y precisa | 2,5 | 10 | E19–E21 |
| 5.2 Procesos de actualización | 2,5 | 10 | E21–E23 |
| 6.1 Coherencia con los objetivos | 3,0 | 11 | E1–E4, E24 |
| 6.2 Aportes | 2,0 | 12 | Redacción por validar (decisión 6) |
| 7.1 Presentación personal | 1,0 | 1 y ensayo | Lista de roles y vestimenta |
| 7.2 Dominio de grupo | 1,0 | todas | Etiqueta «presenta» por escena |
| 7.3 Presentación de diapositivas | 1,0 | todas | Poco texto, orden de la rúbrica |
| 7.4 Manejo verbal y corporal | 2,0 | ensayo | Cronometraje y lista de ensayo |

## 5. Evidencias verificadas

Revisadas el 2026-11-04 en el código y la documentación; **lo que dice «sin re-verificar» viene de documentos y no lo ejecuté.**

| # | Afirmación | Fuente |
|---|---|---|
| E1 | 415 pruebas del servidor, 0 omitidas, 89 % de cobertura de ramas | `backend-audit.md`, 16-oct-2026 |
| E2 | 573 pruebas de la app | documentación del PGC, 18-oct-2026 (sin re-verificar) |
| E3 | El servicio se desplegó en la nube y se probó en un teléfono físico con depuración por ADB | `deployment-guide.md` (26-oct); bitácora del 27-sep («Device Feedback») |
| E4 | Documentos de alcance, diseño, esquema, UML y mockups existen | `docs/` del repositorio |
| E5 | El modelo solo sugiere; cuentas, categorías y fuentes de ingreso se limitan a las del usuario; pregunta cuando falta cuenta o moneda | README del backend (HU-013) |
| E6 | Confirmar es idempotente: restricción única `(user_id, source_proposal_id)` y reintento devuelve el primer resultado | migración 0017; `backend-audit.md` |
| E7 | Si el proveedor de IA falla, el cliente usa el formulario manual (error 503) | README del backend |
| E8 | El teléfono nunca llama al proveedor de IA; Android transcribe localmente y envía texto | `docs/ALCANCE.md`; `native_speech_service.dart` |
| E9 | Dos proveedores configurables, uno de respaldo del otro | README del backend; `deployment-guide.md` (orden vivo puede cambiar) |
| E10 | Flutter con una sola base de código para Android y Windows | `AGENTS.md` de la app |
| E11 | 32 rutas (51 operaciones) en el contrato OpenAPI, recontadas hoy; PostgreSQL con `NUMERIC(18,2)`; migraciones Alembic (17 revisiones) | `openapi.json`; `backend-audit.md`; README |
| E12 | Cloud Run: 1 CPU, 512 MiB, máximo 3 instancias, 80 solicitudes concurrentes, región `southamerica-east1` | `deployment-guide.md`, 26-oct-2026 |
| E13 | Los límites de frecuencia están en memoria de cada proceso | `core/rate_limit.py` (`MemoryStorage`); `capture/dependencies.py` |
| E14 | Argon2id con 19 456 KiB, 2 pasadas, paralelismo 1 | `auth/passwords.py`; `core/config.py` |
| E15 | Acceso de 15 min; credencial renovable rotativa, 30 días de inactividad, 90 absolutos, solo huella en el servidor, máximo 10 sesiones | README del backend |
| E16 | Credencial de acceso solo en memoria; renovable en almacenamiento seguro nativo | `AGENTS.md` de la app; `flutter_secure_storage` |
| E17 | Toda ruta autenticada se limita al dueño; claves foráneas por dueño en la base de datos | README; modelos `fk_*_owner` |
| E18 | Sin rutas de administración ni modelo premium | `backend-audit.md` |
| E19 | Saldo = saldo inicial + movimientos confirmados; nunca se guarda como estado mutable | README (HU-003) |
| E20 | Avance de presupuestos derivado de gastos confirmados al consultar | README (HG-016) |
| E21 | Resumen semanal y proyección calculados al consultar | `dashboard/service.py` |
| E22 | Editar un gasto recalcula total y movimiento en una transacción; propuestas de texto duran 24 h | README (HU-008, HU-013) |
| E23 | Cada propuesta carga las cuentas y categorías vigentes del usuario | `capture/dependencies.py` |
| E24 | ~300 entradas de bitácora (301 marcas) del 24-sep al 30-oct-2026 | `aidlc-docs/audit.md`, contadas hoy |

**No afirmar** (no existe o no está verificado): que la IA aprende de las correcciones; roles con permisos distintos o planes premium; integración con bancos o billeteras; aislamiento por filas; que reduce el esfuerzo o forma hábito; capacidad en número de usuarios; funcionamiento sin conexión en las escenas principales; cifras de límite de frecuencia.

## 6. Conteo de palabras y tiempos

Palabras del guion oral por escena (script `count_words.py`, solo las líneas `>`) y su duración a 119 palabras por minuto, frente al tiempo asignado:

| # | Escena | Palabras | Hablado | Asignado | Margen para animación |
|---|---|---:|---:|---:|---:|
| 1 | Portada | 61 | 0:31 | 0:30 | −0:01 |
| 2 | Contexto y problema | 155 | 1:18 | 1:20 | 0:02 |
| 3 | Justificación | 77 | 0:39 | 0:45 | 0:06 |
| 4 | Objetivos | 129 | 1:05 | 1:15 | 0:10 |
| 5 | Producto: captura asistida | 113 | 0:57 | 1:00 | 0:03 |
| 6 | Producto: análisis y presupuestos | 110 | 0:55 | 1:05 | 0:10 |
| 7 | Marco teórico | 169 | 1:25 | 1:45 | 0:20 |
| 8 | Plataformas, integración y escalabilidad | 172 | 1:27 | 1:30 | 0:03 |
| 9 | Seguridad y acceso | 150 | 1:16 | 1:20 | 0:04 |
| 10 | Gestión del conocimiento | 209 | 1:45 | 1:50 | 0:05 |
| 11 | Conclusiones | 131 | 1:06 | 1:15 | 0:09 |
| 12 | Aportes | 104 | 0:52 | 0:55 | 0:03 |
| 13 | Cierre y paso a la aplicación | 47 | 0:24 | 0:30 | 0:06 |
| | **Total** | **1 627** | **13:40** | **15:00** | **1:20** |

Quedan unos 80 s de aire en total, que se gastan en las animaciones que se encadenan solas. Las escenas 1, 2, 5, 8, 9 y 12 van justas (menos de 5 s de margen): si en el ensayo se pasan, se recortan palabras, no se acelera la voz. La escena 7 utiliza ese margen para explicar el recorrido de un gasto hasta una decisión. El ritmo real depende de cada persona y debe medirse en el ensayo con las tres voces.

## 7. Referencias

**Verificadas por el equipo en la propuesta (`PGC-PROPUESTA.md`, `main.tex`):**

1. Curry, D. (2026, 7 de enero). *Finance app benchmarks (2026)*. Business of Apps. https://www.businessofapps.com/data/finance-app-benchmarks/
2. Banca de las Oportunidades. (2024). *Reporte de Inclusión Financiera 2024*. https://www.bancadelasoportunidades.gov.co/sites/default/files/2025-05/BDO_RIF%202024_COMPLETO%201.pdf
3. Singh, B., Murphy, A., Maher, C., & Smith, A. E. (2024). Time to form a habit: A systematic review and meta-analysis of health behaviour habit formation and its determinants. *Healthcare, 12*(23), 2488. https://doi.org/10.3390/healthcare12232488

**Fuentes complementarias en «Referencias»:**

4. Worldwide CDIO Initiative. (2020). *CDIO Standards 3.0*. https://cdio.org/content/cdio-standards-30
5. Schwaber, K., y Sutherland, J. (2020). *The Scrum Guide*. https://scrumguides.org/scrum-guide.html

**Enlaces para responder preguntas sobre el proyecto:**

- API / Swagger: https://finance-api-7caahuohmq-rj.a.run.app/docs#/Authentication/register_api_v1_auth_register_post — endpoints y esquemas.

El diálogo de referencias conserva cinco tarjetas: una con Swagger, tres con las fuentes originales del PGC y una de CDIO/Scrum. Se abre desde la última escena y queda fuera del recorrido principal de 13 diapositivas. Se retira de la ventana la lista general de documentación de proveedores, RFC, herramientas y documentos internos para facilitar la consulta durante preguntas. La tabla de tiempos anterior es histórica; volver a medir la escena 7 al ensayar.

## 8. Decisiones pendientes

| # | Decisión | Mi propuesta por defecto |
|---|---|---|
| 1 | Redacción del objetivo 5 | **Decidido el 2026-11-04: ajuste del 30-oct (publicar en Google Play y validar con usuarios reales)**, como en el PGC. Si preguntan, el texto de la propuesta escrita (pruebas funcionales y encuesta de usabilidad) se explica en las notas de la escena 4 |
| 2 | Cifras 66,6 % y 4,2 % en pantalla | Sí, ambas verificadas, con su fuente |
| 3 | Marco de gestión del conocimiento que exige el docente | Recorrido aplicado dato–información–decisión; sin modelo SECI |
| 4 | Antecedentes y trabajos relacionados | Sin fuente hoy; ¿existe el documento de mercado que menciona la bitácora? |
| 5 | Nombrar DeepSeek, Gemini, Cloud Run y Neon en pantalla | Sí, con fecha de verificación |
| 6 | Los tres aportes y la lista de «hasta dónde llega» | Los de este borrador |
| 7 | Grupo, integrantes, fecha, lugar, docente, quién presenta cada bloque | Marcadores `[[ ]]` hasta que los dé |
| 8 | Respaldo F: entra con la lista de «no verificado» a la vista | Sí |
