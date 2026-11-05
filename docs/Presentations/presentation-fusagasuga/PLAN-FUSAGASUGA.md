# Plan: presentación para Fusagasugá (Gestión del Conocimiento)

Estado: **borrador del 2026-11-04**. Decisiones tomadas por el equipo ese día: entregable HTML interactivo + PDF, exposición de **15 minutos**, Offline-first retirado de la presentación por decisión del usuario (2026-11-05), estética «marco UC + acentos Finance AI» (sección 8). **Fases 2 a 5 hechas el 2026-11-04:** el contenido está en [contenido.md](contenido.md) y la presentación interactiva (13 escenas, respaldo A-E, notas de estudio y PDF) en [interactive/](interactive/) (ver [README.md](README.md)). Quedan abiertos los datos de portada, quién presenta cada bloque, la confirmación de las referencias de teoría y el ensayo con cronómetro (fase 6).

## 1. Qué es realmente la plantilla

Archivo: `../presentaciones-originals/Fusagasuga_template/Plantilla de sustentación – Proyectos de Gestión del Conocimiento.pptx` (8 diapositivas, 20 × 11,25 in, 16:9, en español).

- **Es una rúbrica de evaluación maquetada como diapositivas.** Portada + una diapositiva por aspecto. Son 7 aspectos, cada uno se califica de 0,5 a 5,0, así que cada uno pesa 5/35 = **14,3 %** de la nota. La portada dice «Plantilla de preparación para estudiantes» y las notas de cada diapositiva dicen «Qué evalúa el jurado… Borra estas notas al terminar».
- **La diapositiva 8 (Metodología y socialización) no es contenido**: se califica *cómo* presentamos (roles, quién presenta cada parte, claridad de las diapositivas, voz y postura). Es una lista de verificación para el ensayo.
- **Estilo:** fondo verde institucional `00482B`, tarjetas blancas redondeadas, títulos dorados `DAAA00` en Georgia, texto crema `F5F2EA` y gris `6A7179` en Helvetica, sello de Acreditación Institucional de Alta Calidad y logo blanco de la UCundinamarca en la portada, degradado dorado en la portada, paisaje de colinas verdes con una oveja diminuta en las diapositivas de contenido, pie «Sustentación · Gestión del Conocimiento».
- **Construcción:** todas las diapositivas usan el layout en blanco sobre el tema Office por defecto; las formas son freeforms y cuadros de texto, no marcadores reales. Se edita bien, pero no se restyla desde el patrón. Trae incrustadas Georgia, Helvetica y Helvetica Bold.
- **Limitación de este análisis:** no encontré LibreOffice ni PowerPoint en sus rutas habituales de este equipo, así que no pude renderizar la plantilla. Lo anterior sale de leer el XML, las 4 imágenes y las coordenadas.

### Rúbrica (18 criterios)

| Aspecto | Criterios (valor) |
|---|---|
| 1 Organización | 1.1 Introducción (1,0) · 1.2 Planteamiento del problema (1,5) · 1.3 Justificación (1,0) · 1.4 Objetivos (1,5) |
| 2 Alcances | 2.1 Productos desarrollados (5,0) |
| 3 Marco teórico | 3.1 Fundamentos teóricos (5,0): conceptos de gestión del conocimiento, antecedentes, referencias |
| 4 Impacto tecnológico | 4.1 Uso de plataformas (1,0) · 4.2 Integración con sistemas existentes (1,0) · 4.3 Escalabilidad (1,0) · **4.4 Seguridad y acceso (2,0)** |
| 5 Gestión del conocimiento | 5.1 Información actualizada y precisa (2,5) · 5.2 Procesos de actualización del conocimiento (2,5) |
| 6 Conclusiones | 6.1 Coherencia con el desarrollo de los objetivos (3,0) · 6.2 Aportes (2,0) |
| 7 Metodología y socialización | 7.1 Presentación personal (1,0) · 7.2 Dominio de grupo (1,0) · 7.3 Presentación de diapositivas (1,0) · **7.4 Manejo verbal y corporal (2,0)** |

Los tipos de producto de la plantilla (software, prototipo, comunidad de práctica…) son exactamente la lista de la propuesta PGC (`latex/pgc/main.tex`), donde marcamos **Software** y **Prototipo**. Es el mismo curso; cambia el público y el formato.

## 2. Qué cambia respecto a la presentación PGC

| | PGC (semana 12) | Fusagasugá |
|---|---|---|
| Función | Mostrar el producto y los objetivos | Cubrir 6 aspectos de contenido, en orden fijo, y ser calificado en cada uno |
| Teoría y gestión del conocimiento | No tenía | **28 % de la nota** (aspectos 3 y 5) |
| Seguridad | Solo en el respaldo D | Criterio propio, con peso doble |
| Conclusiones | Tres, sobre el flujo logrado | Una por objetivo (3,0 puntos) y aportes (2,0) |
| Producto | Tres diapositivas de «Solución» | «Productos desarrollados» vale 5,0 por sí solo |

Ya tenemos casi todo para los aspectos 1, 2, 4 y la parte técnica de la seguridad. **Falta contenido nuevo** para: marco teórico, gestión del conocimiento, escalabilidad, conclusiones por objetivo y aportes.

## 3. Mapa de escenas propuesto

Un solo «motor» interactivo, español, 13 escenas principales para **15 minutos** (900 s), con el tiempo repartido aproximadamente por peso en la rúbrica: cada aspecto vale lo mismo, así que los aspectos nuevos (3 y 5) reciben casi dos minutos cada uno. El guion de [contenido.md](contenido.md) tiene 1 627 palabras: unos 13:40 hablados a 119 palabras por minuto (el ritmo del PGC), y los 1:20 restantes quedan para animaciones. La demostración de la app y las preguntas quedan fuera de los 15 minutos. Si el tiempo se acorta hay versión compacta: fusionar Justificación con Problema, Aportes con Conclusiones y las dos escenas de producto en una.

| # | Escena | Criterios | Origen | Tiempo | Acum. |
|---|---|---|---|---:|---:|
| 1 | Portada: título, grupo, integrantes, sello, QR | cubre 7.1 | Adaptar PGC + plantilla | 0:30 | 0:30 |
| 2 | Contexto y problema | 1.1, 1.2 | Reusar PGC (esc. 2) | 1:20 | 1:50 |
| 3 | Justificación | 1.3 | Nueva (sale del problema) | 0:45 | 2:35 |
| 4 | Objetivo general y 5 específicos (CDIO) | 1.4 | Reusar PGC (esc. 3-4) | 1:15 | 3:50 |
| 5 | Producto: captura asistida | 2.1 | Reusar PGC (esc. 6) | 1:00 | 4:50 |
| 6 | Producto: análisis, historial y presupuestos + hasta dónde llega | 2.1 | Reusar PGC (esc. 7-8) | 1:05 | 5:55 |
| 7 | Marco teórico: gestión del conocimiento, CDIO, hábito, inclusión financiera | 3.1 | **Nueva** | 1:45 | 7:40 |
| 8 | Plataformas, integración y escalabilidad | 4.1, 4.2, 4.3 | PGC (esc. 5) + nueva | 1:30 | 9:10 |
| 9 | Seguridad y acceso | 4.4 | PGC respaldo D, ampliada | 1:20 | 10:30 |
| 10 | Gestión del conocimiento: información precisa y cómo se actualiza | 5.1, 5.2 | **Nueva** | 1:50 | 12:20 |
| 11 | Conclusiones: una por objetivo | 6.1 | Reescribir PGC (esc. 9) | 1:15 | 13:35 |
| 12 | Aportes | 6.2 | **Nueva** | 0:55 | 14:30 |
| 13 | Cierre y paso a la app real | — | Reusar PGC (esc. 10) | 0:30 | 15:00 |

Con 15 minutos y tres integrantes, el reparto natural es por aspectos (por ejemplo, escenas 1-4, 5-9 y 10-13); queda por decidir quién presenta cada bloque y se mostrará como una etiqueta discreta por escena (criterio 7.2).

Respaldo (teclas A–E): A modelo de datos, B propuesta de IA, C recibos y voz, D seguridad y calidad y E mapa de la rúbrica. En la demo hay un enlace «Referencias» que abre todas las fuentes en una ventana desplazable, fuera del recorrido.

### Marco teórico y gestión del conocimiento (a validar)

- Enfoque aprobado el 2026-11-05: dato de un gasto, información organizada por categoría/período y apoyo a una decisión. Ejemplo propio sin prometer cambios de hábitos comprobados.
- Fuentes originales del PGC: Curry (2026), Banca de las Oportunidades (2024), Singh et al. (2024). Se añaden al final documentos oficiales de CDIO, Scrum y las tecnologías, más enlaces a la evidencia propia. El detalle está en contenido.md, sección 7.
- 5.1 y 5.2 piden «quién, cómo y cada cuánto se actualiza». Antes de escribirlo verificaré en el código qué hace de verdad la app (por ejemplo, si la IA aprende de las correcciones o si solo propone). No afirmaré nada que el software no haga.

## 4. Look & feel

**Del template:** escenario verde `00482B`, títulos dorados en Georgia, tarjetas blancas, sello y logo en la portada, pie «Sustentación · Gestión del Conocimiento», etiqueta «ASPECTO n DE 7» en cada escena, colinas con oveja.
**Del PGC:** teléfonos con capturas reales y balanceo 3D, verde oliva de la app (`#8fb42c` sobre fondo oscuro, `#6b8e00` sobre blanco) y violeta de IA `#5b4bdb`, partículas, órbitas, paquetes de datos, ritmo fluido/manual/recorrido, notas de estudio (`N`), respaldo por teclas, movimiento activo aunque Windows tenga animaciones apagadas.
**Animaciones (la idea es exagerar):**

- Barra de rúbrica permanente: 7 segmentos que se llenan por aspecto, y chips (1.2, 1.4…) que se encienden cuando se habla de ese criterio.
- Portada: barrido dorado, sello que entra girando, mini demostración en bucle (frase → propuesta de IA).
- Problema: formulario que se llena una y otra vez, días sin registrar con halo ámbar.
- Objetivos: recorrido CDIO de cinco nodos con órbitas.
- Producto: teléfono con balanceo, escritura en vivo, anillo por categoría, barras de presupuesto con rayas en movimiento.
- Marco teórico: recorrido del registro de un gasto a una decisión; tarjetas de hábito, contexto y metodología.
- Arquitectura: paquetes viajando Flutter → FastAPI → IA → PostgreSQL; escalabilidad con carriles aislados por usuario.
- Seguridad: escudo, ficha de acceso de 15 min que se agota y se rota, carriles de datos por usuario (solo lo que está documentado).
- Gestión del conocimiento: ciclo capturar → validar → guardar → analizar → actualizar, con reloj de «cada cuánto».
- Conclusiones: cinco pares objetivo → conclusión que encajan con un visado, sin sobreprometer.
- Opcional: la oveja de la plantilla paseando por las colinas del pie como bucle en reposo.

Contraste: el verde oliva sobre el verde institucional casi no se lee, así que en el escenario oscuro uso verde claro y dorado para énfasis.

## 5. Archivos y motor

- Se **copia** el motor de `../presentation-pgc/interactive/` (`deck.js`, sistema de revelado `rv`, ritmo, hash, notas, respaldo) a `interactive/` de esta carpeta. La presentación PGC no se toca.
- Carpeta de trabajo: `presentation-fusagasuga/` (`interactive/`, `assets/` con las capturas, el sello, el logo y el QR, y este plan). `presentaciones-originals/` solo guarda originales.
- Texto en `index.html`, notas de estudio en `<template class="notes">`, y un `contenido.md` con el guion por escena y tiempos para que el equipo lo revise sin abrir HTML.
- Nota: la memoria y el README del PGC citan `docs/presentation/`; la ruta actual es `docs/Presentations/presentation-pgc/`.

## 6. Fases

1. **Plan y preguntas** (esta fase).
2. **Contenido:** `contenido.md` con el guion de cada escena, la correspondencia con los 18 criterios, las referencias y las afirmaciones verificadas en el código. **Punto de revisión suyo antes de diseñar.**
3. **Andamio** (hecho): motor copiado del PGC, tema institucional en `uc.css`, barra de siete aspectos, paisaje con oveja y portada.
4. **Escenas** (hecho): las 13, verificadas en la vista previa con un servidor local (el panel muestra file:// sin estilos; con Chrome sí se comprobó `file://`).
5. **Respaldo, notas de estudio y exportación** (hecho): A-E, panel `N` y PDF de 19 y 13 páginas con `export-pdf.mjs`. La guía de estudio en PDF para el celular no se hizo.
6. **Ensayo:** lista de verificación del aspecto 7 con roles por integrante y cronometraje contra la tabla de la sección 3.

## 7. Reglas que mantengo

- Nada de afirmaciones que el software no respalde; las cifras de las capturas son datos de demostración; las pruebas (415 y 573) llevan su fecha de verificación.
- Sin offline-first en las escenas principales. El respaldo F lo describe como trabajo en curso y nombra lo que **no** está verificado (la app no se ha probado en un teléfono en modo local y la última compilación de Windows no se ha repetido); no lo presenta como terminado.
- No invento grupo, integrantes, fecha, docente ni referencias. La portada lleva solo lo que la plantilla pide: título, grupo y nombres (sin código estudiantil).
- Las escenas «manuales» se reservan para lo que se lee por partes.

## 8. Decisiones y preguntas abiertas

**Decididas el 2026-11-04**

1. Entregable: **HTML interactivo + PDF**. No se hace `.pptx` (por tanto no hace falta instalar un renderizador).
2. Tiempo: **15 minutos** de exposición, sin contar preguntas ni demostración.
3. Offline-first: **retirado**, incluida su diapositiva y acceso F (decisión 2026-11-05).
4. Estética: **marco institucional UC + acentos Finance AI**.

**Siguen abiertas** (con lo que haré por defecto si no se contestan; ninguna bloquea la fase de contenido)

5. **Datos de portada:** número de grupo, integrantes (¿los mismos tres de la propuesta?), fecha, sede o lugar, docente o jurado, y si la portada debe decir Facatativá. *Sin esto dejo marcadores visibles, no invento.*
6. **Reparto:** quién presenta cada bloque de escenas. *Por defecto: etiqueta de presentador vacía.*
7. **Rúbrica visible:** *por defecto, nombres de los aspectos como «ASPECTO n DE 7» y chips de criterio; los pesos solo en las notas de estudio.*
8. **Logística:** portátil propio, proyector, control remoto, internet en la sala (la app real necesita servidor). *Por defecto: archivos estáticos sin internet; demostración con grabación de respaldo.*
9. **Gestión del conocimiento:** resuelto el 2026-11-05: se retira SECI y se usa el recorrido aplicado dato–información–decisión.

## Actualización aprobada 2026-11-05

Sustituir SECI por ejemplo aplicado, retirar el respaldo Offline-first y añadir un enlace de referencias en la demo con las fuentes en un diálogo de consulta. Conservar las cifras del PGC original. La validación y los pasos están en `aidlc-docs/construction/plans/fusagasuga-sources-code-generation-plan.md`.
