# Inicio de sesión — secuencia

## Alcance

Login explícito con correo y contraseña, desde la pantalla de acceso hasta Inicio o un error sin acceso autenticado. Usuario previamente registrado. No incluye registro de cuenta, recuperación de contraseña, restauración ni renovación; estas últimas evitan pedir credenciales cada vez que se registra un gasto. Las rutas técnicas son relativas al prefijo `/api/v1`.

## Flujo y alternativas (texto alternativo)

El usuario introduce credenciales y solicita el acceso. Flutter valida campos; FastAPI valida la solicitud y limita intentos. El servicio busca el usuario, verifica contraseña y estado activo, genera claves de sesión y guarda la sesión en la base de datos. Flutter guarda la credencial renovable de forma segura, mantiene la de acceso en memoria, publica el estado autenticado y muestra Inicio.

Campos inválidos y credenciales incorrectas mantienen la pantalla de acceso. Un fallo de red o servicio no habilita la sesión local. Si falla el almacenamiento seguro, Flutter intenta revocar la sesión remota y borrar la credencial local; la revocación no se garantiza si también falla la comunicación. Los detalles internos de rehash, límite de sesiones y concurrencia se agrupan en la política de sesión, no se representan como nuevas acciones del usuario.

## Artefactos

- [PNG](login.png)
- [SVG ampliable](login.svg)
- [Fuente PlantUML](login.puml)
- [Galería de diagramas revisados](../../revision-login.html)

## Evidencia inspeccionada el 2026-10-23

- `finance-ai-frontend/lib/features/auth/session/application/auth_session_controller.dart`: validación local, login, restauración, almacenamiento y publicación de sesión; revocación de mejor esfuerzo cuando falla el almacenamiento.
- `finance-ai-frontend/lib/features/auth/session/data/auth_session_repository.dart`: solicitud al backend.
- `finance-ai-frontend/lib/core/router/app_router.dart`: redirección de rutas protegidas al login; tras autenticar, Inicio.
- `finance-ai-backend/src/finance_ai/auth/router.py`: `/auth/login`, validación y límite de intentos.
- `finance-ai-backend/src/finance_ai/auth/session_service.py`: búsqueda, verificación de contraseña/usuario activo, emisión de credenciales opacas y transacción de sesión.
- `finance-ai-backend/src/finance_ai/auth/dependencies.py`: autenticación de solicitudes protegidas.

## Verificación

Fuente parseada con PlantUML local antes de guardarla. PNG y SVG renderizados localmente; revisión visual de título, participantes/carriles, ramas, finales y límites de imagen. Es verificación documental y estática del código, no una prueba ejecutada de login ni aprobación académica.

## Aclaraciones de la segunda revisión

- Las barras de activación muestran el intervalo en que cada participante ejecuta una tarea o espera a un servicio llamado. La línea punteada es la línea de vida; no equivale a una activación continua durante todo el caso.
- «Verificar contraseña» sustituye el texto ambiguo «real o ficticia». El código compara con un hash de respaldo cuando no encuentra usuario, pero rechaza siempre el login si no existe usuario activo o la contraseña no coincide; nunca admite una contraseña ficticia.
- «Generar claves de sesión» significa emitir identificadores aleatorios para acceder y renovar la sesión. No es crear una contraseña para el usuario. Guardar la clave de renovación permite restaurar/renovar la sesión de forma segura.
- Se agrupan repositorios y Unit of Work bajo «Acceso a datos». La API y el servicio de autenticación siguen siendo participantes diferentes.
- Las respuestas vuelven a la aplicación; la aplicación muestra el formulario/error o Inicio al usuario. El fallo de almacenamiento también termina con error visible, después de intentar anular la sesión y eliminar la clave local. Esos intentos pueden fallar.
- La secuencia agrupa errores de validación/límite/disponibilidad y no dibuja cada excepción. Las respuestas dibujadas describen el resultado lógico; no se garantiza entrega por red en caso de caída.
- Barras generadas con `activate`/`deactivate`, según la [documentación de PlantUML](https://plantuml.com/sequence-diagram#lifeline_activation_and_destruction).
