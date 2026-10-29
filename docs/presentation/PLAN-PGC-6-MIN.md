# Plan de presentación PGC: seis minutos

Estado: aprobado y aplicado el 27-oct-2026. Presentación reorganizada en nueve diapositivas principales, con guion de seis minutos y cuatro respaldos técnicos. La portada conserva 2026-2 por indicación del equipo.

Actualización del 28-oct-2026, a petición del equipo: se añade una décima diapositiva final, «Probemos con la app real», como transición breve a la demostración. No cuenta en los seis minutos y las nueve diapositivas de la exposición no cambian; la invitación a ver la app pasa de la diapositiva 9 a esta.

Actualización del 29-oct-2026, a petición del equipo: las conclusiones de la diapositiva 9 pasan de describir funciones a presentar resultados frente a los objetivos: (1) el flujo central logrado, (2) el uso del gasto confirmado en historial, análisis y presupuestos, (3) lo que falta medir —si reduce el esfuerzo de captura— y el siguiente paso, la encuesta de usabilidad. No se afirma que el esfuerzo ya se redujo ni que se formó el hábito. Cambia también el guion oral de esa diapositiva (unas 63 palabras, 0:25).

## Criterio principal

Conservar el diseño actual de Finance AI y adoptar los puntos y el orden de la plantilla académica. Usar capturas de tamaño medio, con espacio alrededor, el QR de descarga y una explicación centrada en el software construido.

La plantilla de referencia contiene siete secciones, en este orden:

1. Nombre del PGC y datos generales.
2. Planteamiento del problema y justificación.
3. Objetivo general.
4. Objetivos específicos.
5. Propuesta tecnológica.
6. Solución.
7. Conclusiones.

Propuesta: **nueve diapositivas principales para esas siete secciones**. Solución ocupa tres diapositivas consecutivas. La exposición dura aproximadamente seis minutos; la demostración de la app y las preguntas vienen después. Las cuatro diapositivas técnicas de respaldo continúan disponibles fuera de ese tiempo.

## Orden y tiempo

| Diapositiva | Sección de la plantilla | Contenido principal | Tiempo | Acumulado |
|---|---|---|---:|---:|
| 1 | Nombre del PGC | Finance AI, nombre formal del proyecto, integrantes, programa, ciclo, fecha y QR | 0:20 | 0:20 |
| 2 | Planteamiento del problema y justificación | Esfuerzo repetido de registrar compras, consecuencias de registros incompletos y utilidad de facilitar la captura | 0:45 | 1:05 |
| 3 | Objetivo general | Objetivo aprobado, con su propósito y metodología CDIO | 0:25 | 1:30 |
| 4 | Objetivos específicos | Los cinco objetivos aprobados, resumidos fielmente y en el mismo orden | 0:40 | 2:10 |
| 5 | Propuesta tecnológica | Flutter, FastAPI, PostgreSQL, proveedor de IA y responsabilidades | 0:55 | 3:05 |
| 6 | Solución: captura asistida | Ejemplo de 18 mil pesos con Nequi, propuesta, revisión y confirmación | 0:55 | 4:00 |
| 7 | Solución: análisis de gastos | Saldo y resumen del período, con desglose de gastos por categoría | 0:50 | 4:50 |
| 8 | Solución: movimientos y presupuestos | Búsqueda, filtros, progreso por categoría y alertas | 0:45 | 5:35 |
| 9 | Conclusiones | Resultados concretos del software y transición breve a la demostración | 0:25 | 6:00 |

Los tiempos incluyen transiciones breves. Preparar un guion de unas 650 a 720 palabras y ensayarlo con las diapositivas. La demostración completa no se cuenta dentro de estos seis minutos.

## Cambios por sección

### 1. Nombre del PGC

Reutilizar la portada y el QR grande. Conservar Finance AI como nombre del producto y añadir el título formal aprobado como subtítulo:

> Aplicación móvil para el registro y análisis de gastos personales con asistencia de IA para la captura automática de gastos

Mantener los tres integrantes. Incorporar Ingeniería de Sistemas y Computación, Ciclo II - Profundización y la fecha real de la sustentación. Usar la fecha que confirme el equipo, sin confundirla con la fecha de edición del archivo.

La presentación oral identifica al equipo y al proyecto. Evitar una diapositiva adicional de agenda.

### 2. Planteamiento del problema y justificación

Reutilizar la situación de la diapositiva actual sobre registrar cada gasto. Hacer explícitas ambas partes del encabezado académico:

- Problema: cada compra exige introducir y revisar monto, cuenta, categoría y fecha. Los movimientos que quedan sin registrar dificultan analizar el gasto.
- Justificación: una captura asistida permite preparar esos campos para revisión, y el registro resultante alimenta la consulta y el análisis de los gastos personales.

Conectar brevemente con personas que controlan sus gastos desde el celular. La propuesta identifica a estudiantes de la Universidad de Cundinamarca, sede Facatativá, como población piloto prevista.

No añadir una lámina de estadísticas ni ampliar esta sección con una revisión bibliográfica. El caso cotidiano ya introduce el problema en el tiempo disponible. El propósito de apoyar el hábito financiero pertenece a la motivación del proyecto.

### 3. Objetivo general

Añadir una diapositiva explícita. Utilizar el texto aprobado, sin redefinir el objetivo para acomodarlo a funciones adicionales de la aplicación:

> Desarrollar una aplicación móvil para el registro, la categorización y el análisis de gastos personales, con asistencia de IA para la captura automática de gastos, aplicando la metodología CDIO, con el fin de reducir el esfuerzo de captura de los gastos y contribuir a la formación del hábito de control financiero en los usuarios.

El texto cabe en una composición simple, sin capturas. Resaltar con moderación qué se desarrolla, cómo se aborda y para qué. Explicarlo sin agregar otro listado de funciones.

### 4. Objetivos específicos

Añadir una diapositiva con los cinco objetivos, conservando su número y orden. Propuesta de redacción visible, resumida para lectura rápida:

1. **Concebir:** definir alcance, requisitos funcionales y no funcionales, y el flujo de confirmar, editar o descartar.
2. **Diseñar:** definir arquitectura, modelo de datos y mockups de captura y confirmación.
3. **Implementar:** capturar gastos con IA por foto, voz o texto y permitir su confirmación.
4. **Implementar:** mostrar gastos agrupados por categoría en el período seleccionado.
5. **Operar:** validar con pruebas funcionales y una encuesta de usabilidad con estudiantes de la Universidad de Cundinamarca.

Conservar el texto aprobado completo de los cinco objetivos en las notas del orador. La tercera formulación completa incluye líneas, comercio, fecha, total y categoría. La quinta incluye funcionamiento de los módulos y aceptación del piloto.

Usar los nombres CDIO como parte de los objetivos. Evitar añadir una línea de tiempo independiente. Esta sección expresa los objetivos del proyecto; no convertirla en una tabla de porcentajes, pendientes o cumplimiento. Distinguir objetivos de resultados al preparar las conclusiones: una encuesta solo puede presentarse como resultado si existe evidencia de su aplicación.

### 5. Propuesta tecnológica

Mover la arquitectura actual antes de las capturas de la solución. Mantener el diagrama editable y sus responsabilidades:

- Flutter comparte la base de código entre Android y Windows.
- FastAPI valida las solicitudes y ejecuta las operaciones financieras.
- PostgreSQL almacena los datos y movimientos de cada usuario.
- El modelo de IA interpreta las entradas y prepara propuestas estructuradas.
- La persona revisa y confirma antes del registro.

La función de esta sección es explicar cómo se construye y organiza el sistema. Reservar la siguiente sección para mostrar su comportamiento mediante las pantallas.

El libro de movimientos, las validaciones detalladas, los proveedores y las pruebas permanecen en el respaldo técnico. Reducir la explicación oral a las responsabilidades y a la separación entre interpretación, confirmación y guardado.

### 6. Solución

Conservar tres diapositivas consecutivas y las cinco vistas actuales de la app. Identificarlas como parte de Solución mediante los títulos o el encabezado de sección.

**6. Captura asistida**

Reutilizar la vista actual de propuesta y el ejemplo «Almuerzo 18 mil con Nequi». Explicar la entrada, la revisión de campos y la confirmación. Mantener la referencia a texto, recibo y dictado. El formulario manual continúa explicado en las notas y se puede mostrar durante la demostración.

**7. Análisis de gastos**

Reutilizar el dashboard y la pantalla de análisis. Dar prioridad visual al **desglose por categoría y período**, porque responde directamente al cuarto objetivo específico. La captura completa de análisis ya contiene ese desglose, que el encuadre actual deja fuera.

Proponer un encuadre de esa misma pantalla que haga legibles las categorías. La curva de tendencia puede recorrerse durante la demostración y permanece en la imagen original completa y en las notas. Esta es una selección explícita del contenido visible, no la eliminación de la función ni de su fuente.

Conservar el resumen del saldo, ingresos y gastos como contexto. El texto oral diferencia el saldo disponible de los gastos registrados durante un período.

**8. Movimientos y presupuestos**

Reutilizar ambas vistas actuales con tamaños medios y separación clara. Mostrar cómo encontrar movimientos y cómo el gasto confirmado alimenta los presupuestos y sus alertas. Usar los datos de demostración existentes, sin introducir un segundo escenario largo.

No ejecutar todavía el recorrido completo en vivo. Estas tres diapositivas explican el resultado construido y preparan al jurado para verlo después.

### 7. Conclusiones

Reemplazar la diapositiva independiente de transición a la demo por una conclusión explícita. Mantener la invitación a ver la aplicación como última frase oral.

Propuesta de tres conclusiones basadas en el funcionamiento del software:

- La aplicación integra el registro de gastos con el historial y su análisis por categoría.
- La captura asistida produce una propuesta que la persona puede revisar, editar o confirmar.
- Los movimientos confirmados alimentan las consultas y el seguimiento de presupuestos.

Presentarlas como resultados del prototipo. El propósito de reducir esfuerzo y contribuir al hábito financiero conserva su lugar en el objetivo; las conclusiones deben corresponder a evidencia disponible. Las verificaciones técnicas documentadas pueden ampliarse en el respaldo si el jurado pregunta.

Cerrar con una frase breve: «Ahora mostraremos ese recorrido en la aplicación».

## Qué se conserva, añade y mueve

| Elemento actual | Decisión propuesta |
|---|---|
| Diseño, tipografía, colores y capturas de tamaño medio | Conservar |
| QR grande en portada y pequeño en las demás páginas | Conservar |
| Portada con nombre e integrantes | Completar datos académicos de la plantilla |
| Problema | Mantener y hacer explícita la justificación |
| Objetivo general | Añadir como sección propia |
| Cinco objetivos específicos | Añadir como sección propia, sin semáforo de cumplimiento |
| Arquitectura | Mover a Propuesta tecnológica, antes de Solución |
| Captura, dashboard, análisis, historial y presupuestos | Conservar como evidencia de Solución |
| Encuadre de análisis centrado en la curva | Priorizar categorías en la exposición; conservar tendencia para el recorrido y las notas |
| Diapositiva independiente de transición a la demo | Sustituir por Conclusiones y una transición oral breve |
| Guion detallado de la demostración | Conservar en las notas, fuera de los seis minutos |
| Cuatro respaldos técnicos | Conservar para preguntas |

El resto de la información técnica actual permanece en las notas o en los respaldos. No reincorporar comparaciones con la propuesta inicial, inventarios de rutas, backlog, diapositivas de alcance excluido o tablas de pendientes.

## Ejecución del plan

- [x] Preparar los encabezados en el orden de la plantilla y completar la portada.
- [x] Incorporar los objetivos aprobados y sus notas completas.
- [x] Mover la arquitectura a Propuesta tecnológica y agrupar las vistas bajo Solución.
- [x] Ajustar el encuadre de categorías, manteniendo imágenes completas y tamaño medio.
- [x] Escribir las conclusiones y el cierre hacia la app.
- [x] Ajustar las notas a los tiempos: guion oral de 713 palabras, separado del apoyo y las fuentes.
- [x] Comprobar que cada sección exigida aparece de forma explícita y en el orden esperado.
- [x] Revisar tamaños, márgenes, legibilidad y QR en el PDF exportado.
- [x] Actualizar el README y el rango de exportación principal a nueve diapositivas.

Ensayo del equipo: el guion y los tiempos están preparados; quienes exponen deben ensayar su velocidad y las transiciones antes de la sustentación.

## Fuentes locales

- Plantilla académica, siete diapositivas: [Presentación PGC semana 12.pptx](<C:/Users/maico/Downloads/Presentación PGC semana 12.pptx>). Se inspeccionaron los textos en el orden de presentación y la miniatura de portada. La plantilla contiene encabezados y marcadores de posición, sin contenido desarrollado del proyecto ni notas del orador.
- Objetivos y datos académicos: [PGC-PROPUESTA.md](../PGC-PROPUESTA.md), secciones Datos generales, Título, Problema y justificación, Objetivos.
- Texto formal coincidente: [main.tex](../../latex/pgc/main.tex), datos generales y objetivos.
- Presentación actualizada: [slides.md](slides.md), nueve diapositivas principales, cinco vistas de la app y notas.
- Material para preguntas: [backup.md](pages/backup.md), cuatro diapositivas técnicas.

Este plan adopta la estructura de la referencia por solicitud del equipo. No introduce requisitos adicionales a partir de los marcadores de posición del archivo.
