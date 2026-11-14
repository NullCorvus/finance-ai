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

## Evidencia final

| Comprobación | Resultado |
|---|---|
| Backend completo, PostgreSQL 18.6 nuevo | 520 pruebas aprobadas; 90% cobertura |
| Ajuste final de nombre de evento SEC-02 | 24 pruebas pertinentes aprobadas, incluidas 8 integraciones PostgreSQL |
| Ruff, mypy, OpenAPI, Alembic check | Aprobados; sin nueva operación de migración |
| Build backend y auditoría de dependencias | Aprobados; dnspython actualizado al parche 2.9.2 |
| Staff Web: tipos, lint, build, pruebas | Aprobados; 88 pruebas, 93,48% cobertura de líneas |
| Chromium E2E | 12 regresiones y 1 flujo real aprobados |
| Flutter local | Análisis sin avisos y 10 pruebas nuevas aprobadas |
| Flutter completo en CI, commit 4139d78 | 645 aprobadas, 1 omitida; 86,17% cobertura |
| CI backend, Staff Web y Flutter | Verdes en los commits finales |
| Demo aislada | Inicio, cuatro tickets, credenciales 0600 y reinicio de volúmenes verificados |
| Build APK local | Bloqueado: Android SDK no instalado |
| Build/ejecución Windows | No ejecutados: falta host Windows |

La suite Flutter global local, más lenta, se detuvo al confirmar el éxito de la CI
completa del mismo commit. No se presenta ese proceso interrumpido como aprobado.
Los resultados completos de Flutter proceden de CI; las diez pruebas nuevas sí
se ejecutaron localmente. Las pruebas nativas y el recorrido manual siguen
pendientes de un dispositivo/host compatible y de la validación del solicitante.

CI backend: https://github.com/Maicol2363/finance-ai-backend/actions/runs/43617877067

CI Staff Web: https://github.com/Maicol2363/finance-ai-frontend/actions/runs/43617600733

CI Flutter: https://github.com/Maicol2363/finance-ai-frontend/actions/runs/43617600729
