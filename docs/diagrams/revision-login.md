# Segunda revisión — respuestas a tus comentarios

Las actividades se simplificaron a Usuario y Sistema. La secuencia del login conserva los participantes técnicos y ahora muestra sus activaciones. En el recibo se deja únicamente `ref Iniciar sesión` al principio y se retira la nota gráfica; la sesión válida sigue siendo una precondición documentada.

| Comentario | Explicación y cambio |
|---|---|
| 1. «Real o ficticia» | La frase era ambigua. Cuando no hay usuario, el código comprueba un hash de respaldo, pero rechaza el acceso. No hay contraseñas ficticias aceptadas. En el diagrama queda «Verificar contraseña y usuario activo». |
| 2. «Emitir credenciales opacas» | Crear claves aleatorias de acceso y renovación. Se cambia a «Generar claves de sesión». No es cambiar la contraseña del usuario. |
| 3. «Guardar credencial renovable» | Guardar de forma segura la clave que permite mantener/renovar la sesión sin pedir contraseña cada vez. Queda «Guardar clave para renovar la sesión». |
| 4. Flechas hacia atrás y error | La secuencia avanza de arriba abajo. Una flecha a la izquierda puede ser una respuesta, y una a la derecha puede ser otra solicitud; no es retroceder en el tiempo. Ahora cada intento de limpieza tiene su respuesta y el error termina mostrándose al usuario. |
| 5. Dejar solo ref | Se elimina el `opt` exterior y se conserva `ref Iniciar sesión`. |
| 6. Quitar nota inicial | Nota retirada de la imagen. La condición de sesión válida permanece en el README. |
| 7. Rombo vacío | Es una unión de caminos alternativos. No ejecuta una tarea ni pregunta algo. Se reduce el anidamiento; las uniones necesarias para los retornos permanecen. |
| 8. Cuadro cruzado por una línea | Se rehace el layout de actividades con dos carriles y menos ramas. Se revisan los renders para evitar líneas atravesando acciones o textos. |
| 9. «Autenticar solicitud de confirmación» | Era comprobar que la sesión autoriza esa petición. No una segunda pregunta de «¿está seguro?». Se renombra a «Verificar sesión del usuario». El usuario ya eligió Confirmar gasto en el mensaje anterior. |
| 10. «Continuar con el registro» | Era una guarda para modelar seguir/cancelar, no una pregunta real de la app. Se elimina del inicio: el usuario completa los datos y pulsa Registrar. Solo se dibuja corrección/reintento cuando hay error. |
| 11. «Historial canónico» | Es el refresco interno de la lista real del backend en `ExpensesController._rejectMutation`, no una pantalla o botón con ese nombre. Se retira del diagrama académico, conservando el límite técnico: un fallo de red no demuestra que el gasto no se haya guardado. |
| 12. Actividad asistida demasiado grande | Se agrupan los detalles de texto/foto y los componentes internos. Quedan entrada, propuesta, revisión, confirmación/descarte y errores en dos carriles. La IA sigue generando propuestas; el gasto solo se registra tras confirmar. |

## Línea de vida y barra de activación

La línea punteada representa la línea de vida del participante. El rectángulo estrecho marca una ejecución concreta: desde que recibe una solicitud hasta que responde; puede incluir la espera a un servicio que ha llamado. No representa necesariamente toda la duración del proceso ni mide tiempo real a escala. Las activaciones son un detalle de notación que puede mostrarse u omitirse según el nivel del diagrama y la rúbrica docente. La secuencia del recibo ya las usaba y se añadieron al login para mantener coherencia. Véase [PlantUML: activación y desactivación](https://plantuml.com/sequence-diagram#lifeline_activation_and_destruction).

## Alcance de la simplificación

Las actividades son vistas funcionales: Sistema agrupa la aplicación y sus servicios. Las guardas describen decisiones o resultados; no añaden ventanas de confirmación a la app. Se mantienen validación y sesión válida, corrección de errores, salida y confirmación humana obligatoria. Los detalles de seguridad, concurrencia, errores de red y transacciones quedan fuera de la lámina y se explican en los README y la evidencia técnica histórica siguiente. Los Archify previos siguen identificados como versiones anteriores, sin cambios de aplicación.


---

# Primera revisión técnica — registro histórico

## Resultado

Las actividades existentes tenían una estructura útil —inicio/fisablesnal, respon, decisiones excluyentes y revisión humana—, pero necesitaban correcciones de autenticación y fidelidad al código. Las fuentes UML revisadas son las que se muestran en la galería. Son documentación del código inspeccionado, no evidencia de pruebas ejecutadas ni aprobación de la profesora.

| Hallazgo | Corrección |
|---|---|
| No había diagramas independientes del login. | Añadidas secuencia y actividad con validación, sesión persistida, almacenamiento seguro, errores y salida sin autenticar. |
| La secuencia de recibos comenzaba directamente con la imagen. | `opt` sin sesión y `ref Iniciar sesión`; sesión válida requerida para continuar. |
| Las actividades suponían sesión pero no la mostraban. | Comprobación inicial y llamada a la actividad del login; fallo bloquea el proceso protegido. |
| Manual mostraba validación antes de solicitar registro. | Pulsar Registrar precede a validación local. API autentica antes de validar reglas financieras. |
| Manual simplificaba demasiado el estado incierto. | Se distingue consulta del historial y bloqueo de nuevos envíos cuando no puede resolverse el resultado. |
| Asistido afirmaba una transacción común para texto y foto. | Foto: gasto y propuesta en una transacción. Texto: servicio financiero y actualización de propuesta tienen límites transaccionales distintos. |
| Descartar parecía garantizar el cambio remoto. | En foto y texto, la app retira la propuesta localmente aunque falle la solicitud. Se diferencia cierre local de descarte remoto. |
| Aclaración de texto y edición de foto se agrupaban sin distinguir persistencia. | Aclaraciones/opciones se envían al backend; edición del formulario se mantiene local hasta confirmar. |
| Imagen no recibo aparecía como cierre automático. | Se muestra revisión con confirmación bloqueada y decisión de descartar o seleccionar otra imagen. |
| README daba por comprobados renders antiguos y contenía ruta desactualizada. | Se reemplazan esas afirmaciones por verificaciones actuales y se corrige la ruta de `presentation/screens/receipt_review_screen.dart`. |

## Cómo leer los diagramas

La autenticación tiene su propio escenario. `ref` hace referencia a él; no reproduce todos sus mensajes. Las acciones de login en actividades son llamadas resumidas al flujo independiente. Las rutas protegidas siguen requiriendo autenticación de servidor, aunque Flutter ya tenga estado autenticado. Restauración y renovación de sesión se agrupan como contexto del subsistema, no como un nuevo login por cada gasto.

En las actividades se modelan decisiones de negocio y responsabilidades; los mensajes HTTP detallados pertenecen a la secuencia. No hay paralelismo real: no se añadieron `fork`/`join`. La propuesta de IA jamás representa un gasto guardado; el usuario debe confirmar.

## Alcance y límites

- La actividad asistida representa únicamente intención de gasto; el chat también soporta ingresos y transferencias, fuera de este escenario.
- Se agrupan errores de red, disponibilidad y validación. Un fallo de comunicación no demuestra que no haya habido escritura remota. El estado `reviewRequired` mostrado corresponde al controller manual; no se inventa el mismo mecanismo para foto/texto.
- Los endpoints de confirmación admiten devolver el resultado de una confirmación previa; el diagrama no muestra todos los reintentos.
- En texto no se demuestra atomicidad conjunta entre el alta financiera y la actualización de propuesta. La separación se documenta; no se cambió implementación.
- Archify se conserva como versión anterior, identificada en los README. Esta entrega revisa los UML formales, sus PNG/SVG y la galería actual; no se afirma haber actualizado ni validado los interactivos históricos.
- Los PNG completos no presentan recortes. Las actividades de varios carriles son amplias: usar SVG con zoom o una lámina apropiada, no comprimirlas a una página A4 con texto diminuto.

## Evidencia principal

Login: `auth_session_controller.dart`, `auth_session_repository.dart`, `app_router.dart`, `auth/router.py`, `auth/session_service.py` y `auth/dependencies.py`.

Manual: `expenses_controller.dart` (`create`, `_validateCreate`, `_rejectMutation`, `_acceptMutation`), `expense_create_screen.dart`, `expenses/router.py` y `expenses/service.py`.

Asistido: `text_capture_controller.dart` (`confirm`, `discard`), `capture/service.py` (`propose`, `confirm`, `_execute`, `discard`), `receipt_capture_notifier.dart` (`discardDraft`, `confirmExpense`), `presentation/screens/receipt_review_screen.dart` (bloqueo `not_a_receipt`), `receipts/service.py` y `expenses/service.py` (`confirm_receipt_proposal`). Frontend local: `feat/ui-hero-redesign`; backend local: `develop`.

## Validación

Cinco fuentes parseadas y renderizadas con PlantUML local, sin usar servicios públicos. Revisión visual de composición completa y regiones de login/decisión/finales. SVG para ampliación sin pérdida. Sin cambios en código, commits, push ni despliegue.
