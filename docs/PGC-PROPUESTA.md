# PGC Propuesta — Borrador (2026-2)

> Regla: **tú decides, la IA redacta**. Una sección a la vez, español formal académico.
> Guía: `/home/d3ad/codigos/proyecto_grado/guia_paso_a_paso.md`. Formato final: `latex/pgc/main.tex` (radicar semana 5 ≈ 7–11 sep).

## Alineación con la línea base del producto

Esta propuesta describe el resultado académico completo, incluida la asistencia de IA que se demostrará al final. No define el orden del backlog ni convierte la IA en dependencia de la aplicación. La construcción comienza con una aplicación presupuestal manual completa; después se integra la IA como ayuda opcional que precarga los mismos formularios y siempre exige revisión y confirmación. Para alcance, historias y secuencia vigentes, prevalecen `docs/ALCANCE.md`, `docs/BACKLOG-AND-STORIES.md` y `docs/SPRINT-PLAN.md`.

## Datos generales (✅ en `latex/pgc/main.tex`)

| Campo | Valor |
|---|---|
| PROGRAMA | Ingeniería de Sistemas y Computación |
| SEDE | Facatativá |
| TIPO DE PROYECTO | Proyecto Tecnológico |
| CICLO | Ciclo II — Profundización |
| Integrantes | David Fernando Gonzalez Soler · Maicol Estiven Fonseca Muñoz · Ivan David Giraldo Garavito |

## 1. Título (máx 20–25 palabras, con IA — aprobado 2026-08-17)

> **Aplicación móvil para el registro y análisis de gastos personales con asistencia de IA para la captura automática de gastos**
>
> 20 palabras (límite 20–25). Promete IA → el producto DEBE demostrarla (foto/voz/texto con confirmación). ✅ en `main.tex`.

## 2. Planteamiento del problema y justificación

### Problema (aprobado 2026-08-15, v5 — fuente específica de finanzas, Curry 2026)

> El control de los gastos personales suele hacerse de forma manual, y esa tarea genera fricción: registrar cada compra exige tiempo y disciplina, y el registro se interrumpe con frecuencia. En el ámbito de las aplicaciones de finanzas personales, la retención promedio a 30 días es de solo el 4,2 %, lo que implica que más del 95 % de los usuarios las abandona durante el primer mes (Curry, 2026), mientras que, según estudios sobre la formación de hábitos en conductas de salud, la mediana para consolidar un hábito es de 59 a 66 días (Singh et al., 2024). En Colombia, la vida financiera ocurre cada vez más en el celular: el 66,6 % de las operaciones monetarias se realiza por canales digitales (Banca de las Oportunidades, 2024). Sin registro sistemático, el usuario no sabe en qué gasta y decide sin información: sobregiros, crédito costoso o imposibilidad de ahorrar. ¿Cómo puede una aplicación móvil con asistencia de IA facilitar el registro y el análisis de los gastos personales, reduciendo el esfuerzo de captura y contribuyendo a formar el hábito de control financiero?

### Justificación (aprobada 2026-08-15, v4 — población piloto suavizada)

> La presente propuesta se justifica porque las tecnologías de IA para interpretar gastos son hoy accesibles y están consolidadas en el mercado, lo que permite reducir la fricción del registro en un contexto donde la vida financiera ya ocurre de forma digital.
>
> Los estudiantes de la Universidad de Cundinamarca, sede Facatativá, constituyen la población piloto prevista para validar el prototipo; la solución se dirige también a cualquier persona que desee controlar sus gastos desde el celular, y el equipo es además el primer caso de uso.
>
> La propuesta prioriza la captura del gasto por foto, voz o texto: la IA estructura los datos y el usuario los confirma, edita o descarta antes de guardar, conservando el control de su información.
>
> La propuesta es viable como prototipo académico mediante herramientas de bajo costo y servicios con niveles gratuitos o cuotas de prueba, sujetos a las condiciones vigentes de los proveedores.

## 3. Objetivos

### Objetivo general (UN verbo — aprobado 2026-08-17)

> Desarrollar una aplicación móvil para el registro, la categorización y el análisis de gastos personales, con asistencia de IA para la captura automática de gastos, aplicando la metodología CDIO, con el fin de reducir el esfuerzo de captura de los gastos y contribuir a la formación del hábito de control financiero en los usuarios.
>
> 1 verbo (*desarrollar*) + qué/cómo (del título) + para qué (reducir esfuerzo Y formar hábito).

### Objetivos específicos (5, uno por fase CDIO — aprobado 2026-08-17)

> 1. **Concebir** — Definir el alcance y los requisitos funcionales y no funcionales de la aplicación móvil, cubriendo el registro de gastos, la captura asistida por IA y el flujo de confirmar, editar o descartar la información capturada.
> 2. **Diseñar** — Diseñar la arquitectura del sistema (aplicación móvil, API y base de datos), el modelo de datos y los mockups de las pantallas de captura y confirmación de gastos.
> 3. **Implementar** — Implementar la captura de gastos mediante IA por foto, voz o texto, que convierte la entrada en un gasto estructurado (líneas, comercio, fecha, total y categoría) para su confirmación por el usuario.
> 4. **Implementar** — Implementar el módulo de analítica que muestre los gastos agrupados por categoría en el período seleccionado.
> 5. **Operar** — Validar la aplicación mediante pruebas funcionales y una encuesta de usabilidad aplicada a estudiantes de la Universidad de Cundinamarca, verificando el funcionamiento de los módulos y la aceptación del piloto.

**Decisiones:** E2 incluye mockups (opción B) · E3 mantiene la captura IA foto/voz/texto como resultado académico diferenciador, pero el registro manual completo es su prerrequisito explícito y su alternativa permanente · E4 se concentra en analítica por categoría para la evidencia académica, sin invalidar la línea base funcional del producto · E5 usa pruebas funcionales + encuesta de usabilidad/aceptación del piloto, no como evidencia de hábito formado · Metodología = CDIO + Scrum en implementación.

## 4. Marco referencial (opcional) — completo a mano

<!-- CADIs: verificar con el coordinador, NO inventar -->

## 5. Metodología (CDIO) y cronograma

| Fase CDIO | Qué incluye | Semanas |
|---|---|---|
| Concebir | Necesidades, alcance, requisitos | 1–3 |
| Diseñar | Arquitectura, BD, casos de uso, mockups | 4–7 |
| Implementar | Base manual de la app y API, analítica y, después, asistencia de IA para captura | 8–11 |
| Operar | Pruebas, despliegue, docs, sustentación | 12–16 |

<!-- cronograma semanal con fechas reales 2026-2 -->

## 6. Referencias bibliográficas (en `main.tex` — celda REFERENCIAS)

**Fuentes citadas (las 3 del texto):**
1. Curry, D. (2026, 7 de enero). *Finance app benchmarks (2026)*. Business of Apps. https://www.businessofapps.com/data/finance-app-benchmarks/ — ✅ **verificado directamente**: "Finance apps have a retention rate of 4.2% by day 30" (específico de finanzas, no general)
2. Banca de las Oportunidades. (2024). *Reporte de Inclusión Financiera 2024*. https://www.bancadelasoportunidades.gov.co/sites/default/files/2025-05/BDO_RIF%202024_COMPLETO%201.pdf — ✅ 66,6 % operaciones por canales digitales (verificado, cap. 1)
3. Singh, B., Murphy, A., Maher, C., & Smith, A. E. (2024). Time to form a habit: A systematic review and meta-analysis of health behaviour habit formation and its determinants. *Healthcare, 12*(23), 2488. https://doi.org/10.3390/healthcare12232488 — ✅ 59–66 días es **mediana** de hábitos de **salud** (frase del documento acotada a conductas de salud)

**Descartadas por revisión:** Apptopia/Elsalaymeh 62 % (no verificable) · Adjust 9 % (no verificable — sin fuente pública) · Business of Apps *App Retention Rates* 90 % (general, reemplazada por la específica de finanzas) · Zenodo 2025 (self-deposited) · ResearchGate URLs · Banco de la República 94/23 (no citado) · Google pricing (no citado en el texto — fuera por regla APA)

## 7. Productos esperados

> En `main.tex` marcados con ✗ (revisión 2026-08-17: se quitaron Documento síntesis y Póster-Ponencia — solo se prometen los que se construyen).

- [x] Software
- [x] Prototipo
- [ ] Documento síntesis de PGC
- [ ] Póster-Ponencia
