---
theme: default
title: Finance AI
info: |
  Presentación breve ante los jurados. Nueve diapositivas, 6 minutos, más una
  diapositiva final de transición a la demostración con la app real.
  Después: demostración de la app y preguntas.
colorSchema: light
aspectRatio: 16/9
canvasWidth: 1280
fonts:
  sans: Segoe UI
  mono: Cascadia Code
  provider: none
transition: fade
exportFilename: Finance-AI
drawings:
  persist: false
layout: cover
---

<img class="fa-cover-logo pitch-logo" src="/logo-universidad.jpg" alt="Universidad de Cundinamarca" />
<div class="pitch-cover">
  <div>
    <div class="fa-eyebrow">Proyecto de Gestión del Conocimiento</div>
    <h1>Finance <span>AI</span></h1>
    <p class="pitch-cover-sub">Aplicación móvil para el registro y análisis de gastos personales con asistencia de IA para la captura automática de gastos</p>
    <ul class="fa-team pitch-team">
      <li>David Fernando Gonzalez Soler</li>
      <li>Maicol Estiven Fonseca Muñoz</li>
      <li>Ivan David Giraldo Garavito</li>
    </ul>
    <p class="pgc-cover-meta">Ingeniería de Sistemas y Computación · Facatativá<br>Ciclo II · Profundización · 2026-2</p>
  </div>
  <DownloadQr large />
</div>

<!--
[0:20 | acumulado 0:20]
GUION ORAL:
Buenas. Somos David, Maicol e Ivan. Presentamos Finance AI, nuestro proyecto de registro y análisis de gastos personales con asistencia de inteligencia artificial. El código QR permite descargar la aplicación. Al finalizar la exposición mostraremos su funcionamiento.

APOYO Y FUENTES (no leer):
Buenas. Somos David, Maicol e Ivan. Presentamos Finance AI, una aplicación para registrar y analizar gastos personales con asistencia de inteligencia artificial.
Primero explicaremos el problema y las decisiones principales del software. Después mostraremos la app y responderemos sus preguntas.

El código QR permite descargar la app y vuelve a aparecer en pequeño en la esquina superior derecha de las siguientes diapositivas. Agradecer verbalmente al docente Oscar Jobany Gómez Ochoa si corresponde.
Datos académicos y título: docs/PGC-PROPUESTA.md y latex/pgc/main.tex. Por indicación del equipo, usar 2026-2 como referencia de fecha en la portada.
-->
---
layout: slide
eyebrow: Planteamiento del problema
---

# Problema y justificación

<div class="pitch-problem">
  <div>
    <p class="pitch-label">En cada compra</p>
    <p class="pitch-big">Monto, cuenta,<br>categoría y fecha</p>
    <p class="pitch-body">Registrar un gasto exige completar y revisar esos datos una y otra vez.</p>
  </div>
  <div class="pitch-question">
    <p class="pitch-label">Al final de la semana</p>
    <blockquote>¿En qué se fue<br>mi dinero?</blockquote>
    <p class="pitch-body">Un registro incompleto dificulta responder.</p>
  </div>
</div>
<p class="pitch-takeaway">La captura asistida facilita el registro y conecta los gastos con su análisis.</p>

<!--
[0:45 | acumulado 1:05]
GUION ORAL:
Registrar un almuerzo exige introducir un monto, elegir una cuenta, asignar una categoría y revisar la fecha. Ese esfuerzo se repite con cada compra. Cuando quedan movimientos sin registrar, tenemos menos información para responder en qué gastamos.
El proyecto se justifica por la utilidad de facilitar esa captura y conectar los registros con su análisis. Finance AI prepara una propuesta que la persona revisa antes de guardar. La solución se dirige a quienes quieren controlar sus gastos desde el celular, con estudiantes de la Universidad de Cundinamarca como población piloto prevista.

APOYO Y FUENTES (no leer):
Pensemos en una compra cotidiana, como un almuerzo. Para registrarla hay que introducir un monto, escoger una cuenta, asignar una categoría y revisar la fecha. Ese trabajo se repite con cada compra.
Si dejamos movimientos sin registrar, al final de la semana tenemos menos información para entender en qué gastamos.
Ese es el problema específico que aborda el proyecto: el esfuerzo de captura. Nos interesa porque el análisis posterior depende de contar con registros útiles.
Finance AI aborda ese trabajo cotidiano con captura asistida, revisión de los datos y herramientas para consultar los movimientos y entender el gasto.

Situación cotidiana ilustrativa basada en la motivación del proyecto.
-->
---
layout: slide
eyebrow: Propósito del proyecto
---

# Objetivo general

<p class="pgc-general-objective"><strong>Desarrollar una aplicación móvil</strong> para el registro, la categorización y el análisis de gastos personales, con asistencia de IA para la captura automática de gastos, <strong>aplicando la metodología CDIO</strong>, con el fin de reducir el esfuerzo de captura de los gastos y contribuir a la formación del hábito de control financiero en los usuarios.</p>

<!--
[0:25 | acumulado 1:30]
GUION ORAL:
Desarrollar una aplicación móvil para el registro, la categorización y el análisis de gastos personales, con asistencia de IA para la captura automática de gastos, aplicando la metodología CDIO, con el fin de reducir el esfuerzo de captura de los gastos y contribuir a la formación del hábito de control financiero en los usuarios.

APOYO Y FUENTES (no leer):
Objetivo aprobado, transcrito sin cambios de docs/PGC-PROPUESTA.md, sección Objetivo general, y corroborado con latex/pgc/main.tex. El propósito de contribuir al hábito financiero se presenta como objetivo del proyecto.
-->
---
layout: slide
eyebrow: Metodología CDIO
---

# Objetivos específicos

<ol class="pgc-specific-objectives">
  <li><b>Concebir</b><p>Definir alcance, requisitos funcionales y no funcionales, y el flujo de confirmar, editar o descartar.</p></li>
  <li><b>Diseñar</b><p>Definir arquitectura, modelo de datos y mockups de captura y confirmación.</p></li>
  <li><b>Implementar</b><p>Capturar gastos con IA por foto, voz o texto y permitir su confirmación.</p></li>
  <li><b>Implementar</b><p>Mostrar gastos agrupados por categoría en el período seleccionado.</p></li>
  <li><b>Operar</b><p>Validar con pruebas funcionales y una encuesta de usabilidad con estudiantes de la Universidad de Cundinamarca.</p></li>
</ol>

<!--
[0:40 | acumulado 2:10]
GUION ORAL:
Los cinco objetivos siguen CDIO. Primero, definir el alcance, los requisitos y el flujo de revisión. Segundo, diseñar la arquitectura, el modelo de datos y las pantallas. Tercero, implementar la captura con inteligencia artificial por foto, voz o texto, con confirmación del usuario. Cuarto, mostrar el gasto agrupado por categoría en el período elegido. Quinto, validar mediante pruebas funcionales y una encuesta de usabilidad con estudiantes de la Universidad de Cundinamarca.

APOYO Y FUENTES (no leer):
OBJETIVOS APROBADOS COMPLETOS:
1. **Concebir** — Definir el alcance y los requisitos funcionales y no funcionales de la aplicación móvil, cubriendo el registro de gastos, la captura asistida por IA y el flujo de confirmar, editar o descartar la información capturada.

2. **Diseñar** — Diseñar la arquitectura del sistema (aplicación móvil, API y base de datos), el modelo de datos y los mockups de las pantallas de captura y confirmación de gastos.

3. **Implementar** — Implementar la captura de gastos mediante IA por foto, voz o texto, que convierte la entrada en un gasto estructurado (líneas, comercio, fecha, total y categoría) para su confirmación por el usuario.

4. **Implementar** — Implementar el módulo de analítica que muestre los gastos agrupados por categoría en el período seleccionado.

5. **Operar** — Validar la aplicación mediante pruebas funcionales y una encuesta de usabilidad aplicada a estudiantes de la Universidad de Cundinamarca, verificando el funcionamiento de los módulos y la aceptación del piloto.

Fuente: docs/PGC-PROPUESTA.md, Objetivos específicos; texto coincidente en latex/pgc/main.tex. La versión visible resume el texto conservando el orden y alcance de los cinco objetivos. Esta diapositiva presenta objetivos, sin afirmar resultados de una encuesta.
-->
---
layout: slide
eyebrow: Arquitectura y responsabilidades
---

# Propuesta tecnológica

<div class="pitch-architecture" role="img" aria-label="La app Flutter se comunica con FastAPI. El servidor accede a PostgreSQL para los datos y al modelo de IA para interpretar entradas. El modelo no escribe registros financieros directamente.">
  <div class="fa-box pitch-client">
    <div class="ttl">Flutter</div>
    <div class="sub">Android y Windows</div>
    <p>Captura y revisión</p>
  </div>
  <div class="fa-link pitch-rest"><div class="ln both"></div>REST</div>
  <div class="fa-box pitch-server">
    <div class="ttl">FastAPI</div>
    <div class="sub">Python</div>
    <p>Valida y ejecuta las<br>operaciones financieras</p>
  </div>
  <div class="fa-link pitch-sql"><div class="ln"></div>SQL</div>
  <div class="fa-box pitch-database">
    <div class="ttl">PostgreSQL</div>
    <p>Datos y movimientos<br>por usuario</p>
  </div>
  <div class="fa-link pitch-model-link"><div class="ln"></div>API</div>
  <div class="fa-box pitch-model">
    <div class="ttl">Modelo de IA</div>
    <p>Interpreta texto<br>y recibos</p>
  </div>
</div>
<div class="pitch-principles">
  <p><b>Guardado</b>La persona confirma la propuesta</p>
  <p><b>Cálculos</b>El sistema calcula desde los movimientos</p>
</div>

<!--
[0:55 | acumulado 3:05]
GUION ORAL:
La propuesta tecnológica usa Flutter para compartir código entre Android y Windows. La aplicación se comunica mediante una API REST con FastAPI, y PostgreSQL almacena los datos y movimientos de cada usuario.
El servidor conecta con un modelo externo para interpretar frases y recibos. El modelo prepara una propuesta estructurada. FastAPI valida los campos y las referencias a las cuentas y categorías; la persona revisa y confirma.
Los servicios financieros guardan la operación y calculan los saldos desde los movimientos. El formulario manual y las propuestas confirmadas utilizan esas mismas operaciones. La autenticación y el aislamiento por usuario protegen los datos, y las claves del proveedor permanecen en el servidor.

APOYO Y FUENTES (no leer):
Flutter comparte el código de la app entre Android y Windows. Se comunica mediante una API REST con FastAPI, y PostgreSQL almacena los datos.
El servidor conecta con el modelo externo para interpretar frases y recibos. Las claves del proveedor permanecen en el servidor.
El modelo prepara una propuesta estructurada. FastAPI valida los campos y las referencias a las cuentas y categorías del usuario. La persona revisa y confirma.
Los servicios financieros guardan la operación y calculan los saldos desde los movimientos. Por ejemplo, una transferencia genera una salida en la cuenta de origen y una entrada en la de destino.
El formulario manual y las propuestas confirmadas usan esas mismas operaciones financieras. El historial, los presupuestos y el dashboard consultan esos registros.
La autenticación y el aislamiento por usuario protegen los datos. El respaldo amplía el modelo de datos, la IA y las pruebas del software.

Alternativa textual al diagrama: Flutter envía solicitudes a FastAPI. FastAPI valida y consulta PostgreSQL; también solicita interpretación al LLM externo. Los servicios financieros procesan las operaciones confirmadas.
Fuente: arquitectura del proyecto y auditoría online del backend, 16-oct-2026.
-->
---
layout: slide
eyebrow: Solución · Captura
---

# Captura asistida

<div class="pitch-capture-large">
  <div class="pitch-capture-copy">
    <blockquote class="pitch-example">«Almuerzo 18 mil con Nequi»</blockquote>
    <ol class="pitch-steps">
      <li><b>Capturas</b><span>Texto, recibo o dictado.</span></li>
      <li><b>Revisas</b><span>Monto, cuenta y categoría.</span></li>
      <li><b>Confirmas</b><span>El movimiento queda registrado.</span></li>
    </ol>
  </div>
  <figure class="pitch-capture-focus">
    <div class="pitch-capture-viewport"><img src="/screens/captura-propuesta-actual.png" alt="Propuesta de gasto en la interfaz actual de Finance AI: monto, descripción, cuenta, categoría y confirmación" /></div>
    <figcaption>Propuesta de registro · datos de demostración</figcaption>
  </figure>
</div>

<!--
[0:55 | acumulado 4:00]
GUION ORAL:
La captura asistida permite escribir una frase, adjuntar una foto de recibo o usar el texto de un dictado. En este ejemplo escribimos «almuerzo 18 mil con Nequi».
La inteligencia artificial prepara una propuesta con monto, descripción, cuenta, categoría y fecha. La persona comprueba esos campos y puede editar, confirmar o descartar antes de guardar.
Al confirmar, el movimiento entra al historial y alimenta los saldos y las herramientas de análisis. El formulario manual también está disponible. Así, las distintas formas de captura llegan al mismo registro financiero.
Durante la demostración recorreremos ese caso completo y corregiremos un campo para mostrar el control del usuario.

APOYO Y FUENTES (no leer):
Nuestra respuesta es una app que prepara una propuesta a partir de una frase, una foto de recibo o el texto de un dictado.
Por ejemplo, escribimos «almuerzo 18 mil con Nequi». La IA interpreta el movimiento y propone sus campos. Antes de guardar, la persona puede corregirlos, aceptar o descartar.
Una vez confirmado, el registro aparece en el historial y se incorpora a los saldos, categorías y presupuestos. Así conectamos la captura con el análisis de los gastos.
El formulario manual sigue disponible. La asistencia de IA es opcional y requiere conexión con el proveedor a través del servidor.
En la demostración recorreremos un caso completo, desde la entrada hasta el dashboard.

Ejemplo ilustrativo. Fuente visual: render del 27-oct-2026 de los componentes Flutter actuales del cliente conectado, finance-ai-frontend@35df926. Datos sintéticos de revisión de propuesta; fuente local .tools/presentation_capture_test.dart.
-->
---
layout: slide
eyebrow: Solución · Análisis
---

# Gastos por categoría y período

<div class="pitch-screen-pair">
  <figure>
    <h2>Saldo e ingresos del mes</h2>
    <div class="pitch-screen-viewport pitch-dashboard-focus"><img src="/screens/dashboard-actual.png" alt="Dashboard actual con el saldo de las cuentas y los ingresos y gastos del mes" /></div>
    <figcaption>Inicio · datos de demostración</figcaption>
  </figure>
  <figure>
    <h2>Distribución por categoría</h2>
    <div class="pitch-screen-viewport pitch-category-focus"><img src="/screens/analisis-actual.png" alt="Análisis actual de octubre: Alimentación, 252.000 COP y 57 por ciento; Transporte, 190.000 COP y 43 por ciento" /></div>
    <figcaption>Análisis · datos de demostración</figcaption>
  </figure>
</div>

<!--
[0:50 | acumulado 4:50]
GUION ORAL:
Los gastos confirmados alimentan el análisis por categoría y período, que corresponde al cuarto objetivo específico. En estos datos de demostración, octubre registra 442 mil pesos de gastos: 252 mil en alimentación y 190 mil en transporte, equivalentes al 57 y al 43 por ciento.
El desglose permite identificar dónde se concentra el gasto y consultar sus movimientos. En Inicio vemos el saldo de las cuentas, los ingresos y los gastos del mes.
El saldo disponible y el gasto del período responden a preguntas diferentes. La app también permite elegir el período y recorrer la tendencia de gasto, que mostraremos durante la demostración.

APOYO Y FUENTES (no leer):
El registro se conecta con las herramientas de consulta de la aplicación. En Inicio vemos el saldo de las cuentas, los ingresos y los gastos del período, junto con el resumen y la tendencia de gasto.
En Análisis vemos el gasto acumulado y una proyección de cierre calculada a partir de los días observados. Podemos elegir el período y consultar el desglose por categorías.
En este ejemplo de demostración, el gasto confirmado del mes es de 442 mil pesos. La curva permite ver cuándo se concentra y seguir su evolución.
El saldo de las cuentas y el gasto del período responden a preguntas distintas: cuánto dinero tenemos y cuánto hemos gastado durante el mes.

Fuente visual: renders del 27-oct-2026 de DashboardScreen y DashboardAnalysisScreen del cliente conectado actual, finance-ai-frontend@35df926, con datos sintéticos. Fuente local .tools/presentation_capture_test.dart. Los recortes amplían los datos relevantes; los archivos originales completos están en public/screens/.
Encuadre actualizado: se amplía el desglose por categoría de la misma captura completa. La curva de tendencia permanece en la imagen original y se puede recorrer en el showcase.
-->
---
layout: slide
eyebrow: Solución · Seguimiento
---

# Movimientos y presupuestos

<div class="pitch-screen-pair">
  <figure>
    <h2>Búsqueda e historial</h2>
    <div class="pitch-screen-viewport pitch-history-focus"><img src="/screens/historial-actual.png" alt="Historial actual de movimientos con búsqueda, filtros y gastos registrados en Nequi" /></div>
    <figcaption>Movimientos · datos de demostración</figcaption>
  </figure>
  <figure>
    <h2>Progreso y alertas por categoría</h2>
    <div class="pitch-screen-viewport pitch-budget-focus"><img src="/screens/presupuestos-actual.png" alt="Presupuestos de Alimentación y Transporte con progreso y alerta cerca del límite" /></div>
    <figcaption>Presupuestos · datos de demostración</figcaption>
  </figure>
</div>

<!--
[0:45 | acumulado 5:35]
GUION ORAL:
En Movimientos consultamos las operaciones registradas. La búsqueda y los filtros ayudan a localizar una compra por período, cuenta o categoría. Aquí podemos seguir el gasto de 18 mil pesos en Nequi.
En Presupuestos definimos el monto y el calendario. El progreso utiliza los gastos confirmados de la categoría. En este ejemplo, alimentación lleva 252 mil de 400 mil pesos. Transporte lleva 190 mil de 200 mil y muestra una alerta de cercanía al límite.
Así, el mismo registro sirve para revisar una operación concreta y para seguir el presupuesto del período.

APOYO Y FUENTES (no leer):
En Movimientos consultamos el registro de las operaciones. La búsqueda y los filtros permiten encontrar una compra por período, cuenta o categoría.
En Presupuestos definimos el monto y el calendario. El progreso se calcula desde los gastos confirmados de la categoría.
Aquí Alimentación lleva 252 mil de 400 mil pesos. Transporte lleva 190 mil de 200 mil y ya muestra la alerta de cercanía al límite.
Estos datos conectan el registro cotidiano con el seguimiento del gasto.

Fuente visual: renders del 27-oct-2026 de HistoryScreen y BudgetsScreen del cliente conectado, finance-ai-frontend@35df926, con datos sintéticos. Fuente local .tools/presentation_capture_test.dart. Recortes de las pantallas originales completas en public/screens/.
-->
---
layout: slide
eyebrow: Resultados y siguiente paso
---

# Conclusiones

<div class="pgc-conclusions">
  <p>Logramos el flujo central: una frase, un recibo o un dictado se convierte en una <strong>propuesta que la persona revisa y confirma</strong> antes de guardar.</p>
  <p>El gasto confirmado <strong>alimenta</strong> el historial, el análisis por categoría y período y los presupuestos.</p>
  <p>Falta medir lo principal: <strong>si reduce el esfuerzo de captura</strong>. Siguiente paso: la encuesta de usabilidad con estudiantes de la Universidad de Cundinamarca.</p>
</div>

<!--
[0:25 | acumulado 6:00]
GUION ORAL:
Como conclusiones: primero, logramos el flujo central; una frase, un recibo o un dictado se convierte en una propuesta que la persona revisa y confirma. Segundo, ese gasto confirmado alimenta el historial, el análisis y los presupuestos. Y tercero, falta medir lo principal: si reduce el esfuerzo de captura. El siguiente paso: la encuesta de usabilidad con estudiantes de la Universidad de Cundinamarca.

APOYO Y FUENTES (no leer):
Cierra la exposición de las nueve diapositivas principales. La siguiente diapositiva es la transición a la demostración con la app real.
Cada conclusión responde a los objetivos: el flujo central corresponde a los objetivos 1 a 3 (concebir, diseñar e implementar la captura), el uso del gasto confirmado al objetivo 4 (análisis por categoría y período) y el límite al objetivo 5 (validar con pruebas funcionales y encuesta de usabilidad).
Evidencia opcional: 415 pruebas aprobadas del servidor y 573 de la app, según los puntos de control del 16 y 18 de octubre de 2026 (ver respaldo D).
Reducir el esfuerzo de captura y formar el hábito son el propósito del proyecto, todavía no un resultado medido: no afirmar que ya se logró. El tercer punto supone que la encuesta de usabilidad sigue pendiente; si ya hay resultados, cambiarlo.
-->
---
layout: demo
---

<div class="fa-eyebrow">Demostración</div>
<h1>Probemos con la <span>app real</span></h1>
<p class="pitch-close-body">El mismo recorrido de las diapositivas, ahora funcionando de principio a fin.</p>
<div class="fa-g4 pitch-demo-steps">
  <div class="step"><div class="n">1 · ESCRIBIR</div><div class="t">Una frase, como la dirías</div><div class="d">«Almuerzo 18 mil con Nequi»</div></div>
  <div class="step"><div class="n">2 · REVISAR</div><div class="t">La propuesta de la IA</div><div class="d">Monto, cuenta y categoría; corregimos un campo</div></div>
  <div class="step"><div class="n">3 · CONFIRMAR</div><div class="t">Se guarda el movimiento</div><div class="d">Una sola vez, sin duplicados</div></div>
  <div class="step"><div class="n">4 · VER</div><div class="t">Historial, saldo y dashboard</div><div class="d">Todo queda actualizado</div></div>
</div>

<!--
[transición | fuera de los 6:00]
GUION ORAL:
Eso es lo que construimos. Ahora lo probamos con la app real, con un gasto cotidiano: «almuerzo 18 mil con Nequi», desde que lo escribimos hasta que aparece en el saldo.

APOYO Y FUENTES (no leer):
Vamos a recorrer el flujo completo en la aplicación con un gasto cotidiano: «almuerzo 18 mil con Nequi».
Primero veremos la entrada, después revisaremos la propuesta y corregiremos un campo antes de confirmar. Luego seguiremos ese mismo gasto en el historial y comprobaremos el saldo actualizado.
También recorreremos las herramientas de consulta para mostrar cómo se conecta la captura con el control de los gastos. Al terminar, podemos profundizar en las funciones y decisiones técnicas que les interesen.

FIN DE LA EXPOSICIÓN DE NUEVE DIAPOSITIVAS. Esta diapositiva de transición no cuenta en los seis minutos. Cambiar a la app aquí. El tiempo de demostración y preguntas queda fuera de los seis minutos.
GUION DE DEMOSTRACIÓN:
1. Mostrar la cuenta y el saldo inicial. Usar datos sintéticos.
2. Escribir «almuerzo 18 mil con Nequi» con cuenta/categoría previamente creadas.
3. Revisar la propuesta y corregir un campo antes de confirmar.
4. Confirmar una sola vez. Mostrar el movimiento y el saldo actualizado.
5. Abrir Inicio/dashboard y explicar la información del periodo.
6. Si queda tiempo, probar un recibo seleccionado y/o la transferencia «pasé 200 mil de Nequi a Bancolombia».
7. Si falla la IA, continuar con el formulario manual y mostrar el mismo resultado financiero. Si falla el servidor, usar una grabación de respaldo preparada antes.
PREPARACIÓN: servidor y base de datos disponibles, conexión al proveedor de IA, cuenta sintética, dos cuentas de dinero, categorías, recibo de prueba, grabación de respaldo. Ensayar voz en el equipo antes de incluirla.
Las diapositivas posteriores son exclusivamente de respaldo para preguntas. No continuarlas como parte de la exposición.
-->
---
src: ./pages/backup.md
---
