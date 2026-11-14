# PB-012 — implementación acumulativa, 2026-11-14

La solicitud del usuario autoriza implementar SUP-02–06 y USR-SUP-01/02 de forma
continua, con revisión humana final. No introduce aprobaciones históricas del PO.

## Inspección y alcance

- STAFF-01 está fusionado en develop; SUP-01 permanece abierto en backend #38 y
  frontend #54, con ramas del solicitante. Se extienden sin duplicar su código.
- Se comprobaron PR abiertos y ramas remotas del frontend: no se encontró trabajo
  de USR-SUP-01/02 de otro responsable. Trello conserva ambas dependencias pendientes.
- Se reutilizan las tablas/índices de la migración 0018, sesiones opacas, cookies
  STAFF-01, repositorio de soporte y transacciones SQLAlchemy. No hay nueva migración.
- No se implementan funciones administrativas ni se habilitan cuentas admin sin MFA.

## Reglas aplicadas

La cola global y claim open→in_progress sin reasignación proceden de la aprobación
2026-11-12. Las reglas adicionales proceden de la solicitud 2026-11-14: identificación
exacta, creación open sin asignar, respuestas limitadas por propiedad/asignación y
estado, escalamiento/resolución desde in_progress, estados terminales de solo lectura,
y resolución visible al cliente sin actividad interna.

La documentación ADM-05 más reciente ya resuelve el acceso de lectura del agente
original y la privacidad de los motivos internos. Prevalece sobre la descripción
antigua de Trello que todavía los enumera como pendientes. Se conserva el origen
para la futura reclamación/retorno administrativo autorizado.

Categorías propuestas para este MVP: general, account, technical, other. Asunto
1–160; descripción, mensajes, motivo y resolución 1–4000 caracteres recortados.
No se fabrican nombre ni estado de suscripción: solo ID, correo y activo/inactivo.

## Entrega y aceptación

- Backend acumulativo: https://github.com/Maicol2363/finance-ai-backend/pull/38
- Frontend acumulativo: https://github.com/Maicol2363/finance-ai-frontend/pull/54
- [Guía reproducible y contratos](https://github.com/Maicol2363/finance-ai-backend/blob/codex/sup-01-backend/docs/SUPPORT-MVP.md)

Cada historia tiene implementación backend/interfaz y pruebas; la evidencia final
se registra en los PR. La guía contiene los comandos exactos, datos ficticios
reproducibles y nueve pasos de prueba manual. No se marca Trello completado ni se
fusiona/despliega. La atención administrativa posterior sigue dependiendo de
ADM-05/SEC-01, sin impedir probar cliente↔agente y resolución de soporte.

Pendiente de aceptación del PO: las nuevas reglas de la solicitud y las categorías/
límites técnicos seleccionados. La revisión manual final sigue pendiente.
