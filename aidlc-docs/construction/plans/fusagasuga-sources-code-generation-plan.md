# Fusagasugá: marco aplicado y fuentes

Alcance aprobado por el usuario en esta conversación: reemplazar SECI por registro, información y decisión; quitar el respaldo Offline-first completo; añadir fuentes al final. La corrección posterior conserva el 4,2 % y exige recuperar las fuentes originales del PGC.

Brownfield: presentación HTML estática existente en docs/Presentations/presentation-fusagasuga/interactive. Rama docs/presentation-fusagasuga, checkout inicialmente limpio. Se reanuda el plan de presentación existente. Una unidad, riesgo bajo; se omiten historias, arquitectura, nuevos modelos e infraestructura porque es una edición de contenido. Requisitos y secuencia autorizados por el usuario; sin otra decisión de producto pendiente.

- [x] 1. Revisar estado, motor, guion, rúbrica y fuentes del PGC original.
- [x] 2. Reemplazar SECI y sus notas por un ejemplo aplicado sin atribuir resultados de aprendizaje.
- [x] 3. Retirar F de HTML, motor, teclado, estilos y documentación.
- [x] 4. Añadir fuentes finales enlazadas: las tres del PGC, metodología, tecnologías y evidencia propia, con el tema que respalda cada una.
- [x] 5. Sincronizar guion y README; conservar las cifras originales.
- [x] 6. Comprobar sintaxis, navegación y composición en navegador; registrar resultados.

Extensiones: Security Baseline 01–03, 05–06, 08, 11–12 y 14–15 N/A (sin servicios, datos, autenticación ni cambios de permisos); 04 N/A (sin cambio de servidor publicado); 07 conforme (vista previa solo loopback); 09 conforme (sin secretos ni nueva publicación); 10 conforme (sin dependencias nuevas); 13 conforme (enlaces explícitos y cambios revisados). PBT parcial N/A: contenido y navegación existente, sin nuevas transformaciones ni serialización. Resiliency deshabilitada: omitida.

Validación: HTML y JavaScript, referencias originales, enlaces externos seguros, teclado A–E, fuentes después de la demo, recorrido automático detenido en la demo y revisión visual de las escenas afectadas. Los PDF existentes se consideran exportaciones anteriores hasta regenerarlos. Publicación y push requieren una petición posterior.

## Ajuste solicitado: referencias solo al pulsar el enlace

- [x] 7. Sacar las fuentes del recorrido principal y reunirlas en un diálogo con scroll desde «Referencias» en la demo. Restaurar 13 escenas principales y conservar A–E.
- [x] 8. Verificar apertura, cierre, Escape, foco y navegación de la presentación mientras el diálogo está abierto; sincronizar documentación.

## Simplificación para preguntas

- [x] 9. Reducir de 17 a 7 tarjetas: Trello, Swagger, código, tres fuentes originales y CDIO/Scrum agrupados. Retirar el catálogo de proveedores y herramientas.
- [x] 10. Comprobar contenido, enlaces y composición del diálogo simplificado.

Corrección posterior: retirar Trello del diálogo y agrupar Swagger y código en una tarjeta. Resultado: cinco tarjetas de consulta.

Estado final: cinco tarjetas (Swagger, tres fuentes originales del PGC, CDIO/Scrum). Trello y repositorios retirados de la ventana; el tablero tiene visibilidad private y Swagger responde 200 sin credenciales.

## Publicación autorizada

- [x] 11. Guardar los cambios, integrar la rama remota y subir docs/presentation-fusagasuga.
- [ ] 12. Publicar los archivos web en Maicol2363/finance-ai-fusagasuga/main conservando las notas y verificar GitHub Pages. PDF: exportaciones anteriores, sin regenerar.

- [x] 13. Corregir el alcance de Fusa: quitar el merge accidental y los cambios importados durante publicación, manteniendo solo esta edición sobre 9fbed65. Master sin modificaciones.
