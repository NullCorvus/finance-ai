# Revisión de diagramas y autenticación

## Alcance y autorización

El usuario aprobó añadir el login a los diagramas explicados en esta conversación y revisar las actividades. Cambio documental de bajo riesgo sobre diagramas existentes. No modifica código, dependencias, datos ni despliegues. La petición «Ok realzia los cmabios» aprueba ejecutar ese alcance; no requiere una nueva decisión de producto.

## Requisitos

- Secuencia y actividad del login basadas en Flutter y FastAPI actuales.
- Secuencia HU-015 con `ref Iniciar sesión`; precondición de sesión válida en README (segunda revisión).
- Actividades manual y asistida con autenticación explícita, corrección, cancelación y resultados coherentes con código.
- Propuestas de IA separadas del registro financiero; confirmación humana obligatoria.
- PNG y SVG locales, revisión visual y texto alternativo en README.

## Plan

- [x] Detectar workspace, estado Git y artefactos existentes; cargar reglas y evidencia.
- [x] Analizar requisitos y aprobar alcance según petición explícita del usuario.
- [x] Generar login y corregir fuentes existentes y documentación; galería SVG actual y Archify anterior identificado como histórico.
- [x] Validar sintaxis, renderizar localmente e inspeccionar imágenes.
- [x] Registrar hallazgos y resultados; mostrar diagramas con PNG/SVG y galería local.

## Etapas adaptadas

Reutilizar ingeniería inversa existente con inspección puntual actual. Omitir historias, diseño de aplicación, unidades, NFR e infraestructura: solo documentación de comportamiento implementado. Construcción consiste en editar y verificar artefactos UML; no se ejecutan pruebas de aplicación porque no cambia código.

## Extensiones

SECURITY-05/08: representar validación y control de acceso; SECURITY-12: no incluir secretos reales. Resto de controles de producción: N/A, no se modifica aplicación ni infraestructura. PBT: N/A, no se añade lógica ni serialización de aplicación. Resiliency: deshabilitada según estado, omitida.

## Orden de trabajo

Evidencia → login → referencias y revisión de actividades → renderizado → inspección → entrega.

## Segunda revisión — comentarios del usuario

- [x] Analizar los doce comentarios y comprobar términos contra código.
- [x] Simplificar los tres diagramas de actividades a Usuario/Sistema.
- [x] Aclarar login y añadir activaciones; dejar solo ref al comienzo del recibo.
- [x] Sincronizar README, galería y PNG/SVG; verificar visualmente y mostrar.
- [x] Aclarar junto a la secuencia HU-015 qué hacen FastAPI/router, gateway de visión y servicio financiero, con rutas a sus archivos.

Autorización: comentarios de edición explícitos sobre los diagramas entregados. Sin cambios de aplicación. Mantener precondiciones y límites técnicos en documentación, fuera de las láminas académicas. Las guardas describen elecciones del usuario, no diálogos nuevos en la app.
