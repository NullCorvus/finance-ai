"""Content of the Finance AI use case diagrams (Spanish). Rendered by build_use_cases.py.

Every use case, include and extend below was checked against the backend services and the Flutter
screens (see the notes per diagram). To change wording or layout, edit a spec and re-run the builder.

Spec keys
  file        output file name (no extension)
  frame       text of the UML frame tab, after "uc"
  system      system boundary name
  boundary    (x, y, w, h) of the system boundary
  rx          default horizontal radius of the use case ovals
  actors      id, label (lines), x, hand_y, optional stereotype, optional side ("right")
  usecases    id, label (lines), cx, cy, optional rx / ry / ext (extension point)
  assoc       (actor id, use case id): association lines
  relations   kind include|extend, src -> dst (the arrow direction), optional lab=(dx, dy) label offset
              include: src is the base, dst the included use case
              extend:  src is the extending use case, dst the base
"""

SERVICIO = "«Servicio»"
BOUNDARY_WIDE = (440, 96, 1110, 750)


def usuario(hand_y):
    return dict(id="usuario", label=["Usuario Registrado"], x=190, hand_y=hand_y)


# ---------------------------------------------------------------- 01 registro e inicio de sesion
# Checked: auth/service.py (register: validates, rejects unsafe passwords, checks duplicate email,
# creates default catalogs), auth/session_service.py (login, refresh, logout),
# auth_session_controller.dart (login, restoreSession, logout).
UC01 = dict(
    file="uc-01-registro-e-inicio-de-sesion",
    frame="HU-001 - HU-002 Registro e Inicio de Sesión",
    system="Finance AI",
    boundary=BOUNDARY_WIDE,
    actors=[
        dict(id="visitante", label=["Visitante"], x=190, hand_y=410),
        dict(id="usuario", label=["Usuario Registrado"], x=190, hand_y=736),
    ],
    usecases=[
        dict(id="reg", label=["Registrarse"], cx=760, cy=250),
        dict(id="val_reg", label=["Validar Datos", "de Registro"], cx=1290, cy=186),
        dict(id="cat_ini", label=["Crear Categorías y", "Fuentes Iniciales"], cx=1290, cy=314),
        dict(id="ini", label=["Iniciar Sesión"], cx=760, cy=430),
        dict(id="val_cred", label=["Validar Credenciales"], cx=1290, cy=430),
        dict(id="res", label=["Restaurar Sesión"], cx=760, cy=560),
        dict(id="val_ren", label=["Validar Credencial", "de Renovación"], cx=1290, cy=560),
        dict(id="cer", label=["Cerrar Sesión"], cx=760, cy=736),
    ],
    assoc=[("visitante", "reg"), ("visitante", "ini"), ("visitante", "res"), ("usuario", "cer")],
    relations=[
        dict(kind="include", src="reg", dst="val_reg", lab=(-6, -14)),
        dict(kind="include", src="reg", dst="cat_ini", lab=(-6, 28)),
        dict(kind="include", src="ini", dst="val_cred"),
        dict(kind="include", src="res", dst="val_ren"),
    ],
)

# ---------------------------------------------------------------- 02 cuentas de dinero
# Checked: accounts/service.py (create, list, get, update, delete; name conflict, currency lock,
# reactivation conflict, delete blocked when there are movements); account screens
# (list with "Nueva cuenta", detail with "Saldo actual", Editar / Desactivar / Reactivar /
# Eliminar definitivamente).
UC02 = dict(
    file="uc-02-cuentas-de-dinero",
    frame="HU-003 Cuentas de Dinero",
    system="Finance AI",
    boundary=BOUNDARY_WIDE,
    rx=120,
    actors=[usuario(450)],
    usecases=[
        dict(id="G", label=["Gestionar Cuentas"], cx=600, cy=450),
        dict(id="C", label=["Crear Cuenta"], cx=600, cy=190),
        dict(id="Q", label=["Consultar Cuentas"], cx=960, cy=450),
        dict(id="V", label=["Validar Datos", "de la Cuenta"], cx=960, cy=190),
        dict(id="K", label=["Calcular Saldo", "de la Cuenta"], cx=960, cy=710),
        dict(id="E", label=["Editar Cuenta"], cx=1320, cy=190),
        dict(id="D", label=["Desactivar Cuenta"], cx=1320, cy=320),
        dict(id="R", label=["Reactivar Cuenta"], cx=1320, cy=450),
        dict(id="X", label=["Eliminar Cuenta"], cx=1320, cy=580),
        dict(id="Z", label=["Verificar Cuenta", "sin Movimientos"], cx=1320, cy=710),
    ],
    assoc=[("usuario", "G")],
    relations=[
        dict(kind="extend", src="C", dst="G", lab=(52, 5)),
        dict(kind="extend", src="Q", dst="G"),
        dict(kind="extend", src="E", dst="Q"),
        dict(kind="extend", src="D", dst="Q"),
        dict(kind="extend", src="R", dst="Q"),
        dict(kind="extend", src="X", dst="Q"),
        dict(kind="include", src="C", dst="V"),
        dict(kind="include", src="E", dst="V"),
        dict(kind="include", src="Q", dst="K", lab=(52, 5)),
        dict(kind="include", src="X", dst="Z", lab=(52, 5)),
    ],
)

# ---------------------------------------------------------------- 03 registro de movimientos
# Checked: expense_create_screen.dart ("Registrar gasto" / "Registrar ingreso" in one form),
# transfer_form_screen.dart ("Monto que sale" / "Monto que llega" only when currencies differ),
# expenses/service.py, incomes/service.py, transfers/service.py (active owned account, positive
# amount, TransferDestinationAmountRequiredError).
UC03 = dict(
    file="uc-03-registro-de-movimientos",
    frame="HU-006 - HU-009 - HU-010 Registro de Movimientos",
    system="Finance AI",
    boundary=(440, 96, 860, 660),
    height=810,
    rx=130,
    actors=[usuario(450)],
    usecases=[
        dict(id="G1", label=["Registrar Gasto"], cx=640, cy=250),
        dict(id="G2", label=["Registrar Ingreso"], cx=640, cy=450),
        dict(id="G3", label=["Registrar Transferencia"], cx=640, cy=650),
        dict(id="V", label=["Validar Cuentas", "y Montos"], cx=1080, cy=450),
        dict(id="M", label=["Indicar Monto", "que Llega"], cx=1080, cy=650),
    ],
    assoc=[("usuario", "G1"), ("usuario", "G2"), ("usuario", "G3")],
    relations=[
        dict(kind="include", src="G1", dst="V", lab=(-14, -16)),
        dict(kind="include", src="G2", dst="V"),
        dict(kind="include", src="G3", dst="V", lab=(-14, 30)),
        dict(kind="extend", src="M", dst="G3"),
    ],
)

# ---------------------------------------------------------------- 04 correccion de gastos e ingresos
# Checked: expense_detail_screen.dart (Editar gasto / Eliminar gasto definitivamente, with
# confirmation), expense_form_screen.dart (edit), incomes screens and routes
# (/incomes/:id, edit), expenses/service.py (update, delete), incomes/service.py (update, delete).
# Transfers have no edit or delete in the API, so they are not modeled here.
UC04 = dict(
    file="uc-04-correccion-de-gastos-e-ingresos",
    frame="HU-008 - HU-009 Corrección de Gastos e Ingresos",
    system="Finance AI",
    boundary=BOUNDARY_WIDE,
    rx=120,
    actors=[usuario(450)],
    usecases=[
        dict(id="QG", label=["Consultar Gasto"], cx=620, cy=285),
        dict(id="EG", label=["Editar Gasto"], cx=1000, cy=215),
        dict(id="XG", label=["Eliminar Gasto"], cx=1000, cy=355),
        dict(id="QI", label=["Consultar Ingreso"], cx=620, cy=650),
        dict(id="EI", label=["Editar Ingreso"], cx=1000, cy=570),
        dict(id="XI", label=["Eliminar Ingreso"], cx=1000, cy=750),
        dict(id="V", label=["Validar Cuentas", "y Montos"], cx=1380, cy=392),
    ],
    assoc=[("usuario", "QG"), ("usuario", "QI")],
    relations=[
        dict(kind="extend", src="EG", dst="QG"),
        dict(kind="extend", src="XG", dst="QG"),
        dict(kind="extend", src="EI", dst="QI"),
        dict(kind="extend", src="XI", dst="QI"),
        dict(kind="include", src="EG", dst="V", lab=(-8, -14)),
        dict(kind="include", src="EI", dst="V", lab=(-8, 30)),
    ],
)

# ---------------------------------------------------------------- 05 captura por texto y voz
# Checked: capture/service.py (propose, clarification choice, typed correction, confirm, discard),
# capture/grounding.py (match against the user's own accounts and catalogs), proposal_card.dart
# ("Confirmar y guardar", "Editar", "Descartar"), text_capture_chat.dart ("Escribe tu respuesta"),
# voice_controls.dart (dictation, "Prepara el dictado sin conexión"), offline-voice-capture.md.
UC05 = dict(
    file="uc-05-captura-por-texto-y-voz",
    frame="HU-013 - HU-014 Captura por Texto y Voz",
    system="Finance AI",
    boundary=(440, 96, 980, 750),
    rx=115,
    actors=[
        usuario(470),
        dict(id="ia", label=["Proveedor", "de IA"], x=1495, hand_y=400, stereotype=SERVICIO, side="right"),
        dict(id="voz", label=["Reconocedor", "de Voz"], x=1495, hand_y=640, stereotype=SERVICIO, side="right"),
    ],
    usecases=[
        dict(id="T", label=["Capturar por Texto"], cx=600, cy=400, rx=130, ry=40, ext="ingresar mensaje"),
        dict(id="Vz", label=["Capturar por Voz"], cx=600, cy=640),
        dict(id="P", label=["Preparar Dictado", "sin Conexión"], cx=600, cy=790),
        dict(id="Va", label=["Validar Propuesta con", "Datos del Usuario"], cx=945, cy=205),
        dict(id="R", label=["Revisar y Confirmar", "Propuesta"], cx=945, cy=330),
        dict(id="A", label=["Responder Aclaración"], cx=945, cy=530),
        dict(id="Co", label=["Corregir Propuesta"], cx=1290, cy=215),
        dict(id="Ds", label=["Descartar Propuesta"], cx=1290, cy=335),
    ],
    assoc=[("usuario", "T"), ("ia", "T"), ("voz", "Vz")],
    relations=[
        dict(kind="include", src="T", dst="Va", lab=(-14, -18)),
        dict(kind="include", src="T", dst="R", lab=(-6, 26)),
        dict(kind="extend", src="Vz", dst="T", lab=(-50, 4)),
        dict(kind="extend", src="P", dst="Vz", lab=(-50, 4)),
        dict(kind="extend", src="A", dst="T", lab=(0, 28)),
        dict(kind="extend", src="Co", dst="R", lab=(6, -12)),
        dict(kind="extend", src="Ds", dst="R", lab=(6, 26)),
    ],
)

# ---------------------------------------------------------------- 06 captura por foto de recibo
# Checked: receipt_camera_screen.dart ("Tomar foto del recibo", "Elegir de la galería"),
# receipt_pre_check_screen.dart ("Rotar 90°", "Analizar recibo", "Reintentar análisis"),
# receipt_review_screen.dart ("Posible recibo duplicado", "Confirmar gasto", "Descartar"),
# receipts/router.py and receipts/sanitizer.py (injection filter, arithmetic check, duplicate flag).
UC06 = dict(
    file="uc-06-captura-por-foto-de-recibo",
    frame="HU-015 Captura por Foto de Recibo",
    system="Finance AI",
    boundary=(440, 96, 980, 750),
    rx=115,
    actors=[
        usuario(470),
        dict(id="ia", label=["Proveedor", "de IA"], x=1495, hand_y=400, stereotype=SERVICIO, side="right"),
    ],
    usecases=[
        dict(id="F", label=["Capturar por Foto", "de Recibo"], cx=600, cy=400, rx=130),
        dict(id="Gal", label=["Elegir Foto", "de la Galería"], cx=600, cy=180),
        dict(id="Rot", label=["Rotar Foto"], cx=600, cy=640),
        dict(id="Re", label=["Reintentar Análisis"], cx=945, cy=540),
        dict(id="Dup", label=["Advertir Posible", "Duplicado"], cx=945, cy=700),
        dict(id="Val", label=["Validar Extracción", "del Recibo"], cx=945, cy=205),
        dict(id="R", label=["Revisar y Confirmar", "Propuesta"], cx=945, cy=330),
        dict(id="Co", label=["Corregir Propuesta"], cx=1290, cy=215),
        dict(id="Ds", label=["Descartar Propuesta"], cx=1290, cy=335),
    ],
    assoc=[("usuario", "F"), ("ia", "F")],
    relations=[
        dict(kind="include", src="F", dst="Val", lab=(-14, -18)),
        dict(kind="include", src="F", dst="R", lab=(-6, 26)),
        dict(kind="extend", src="Gal", dst="F", lab=(-50, 4)),
        dict(kind="extend", src="Rot", dst="F", lab=(-50, 4)),
        dict(kind="extend", src="Re", dst="F", lab=(0, -14)),
        dict(kind="extend", src="Dup", dst="F", lab=(10, 30)),
        dict(kind="extend", src="Co", dst="R", lab=(6, -12)),
        dict(kind="extend", src="Ds", dst="R", lab=(6, 26)),
    ],
)

# ---------------------------------------------------------------- 07 historial y panel financiero
# Checked: history_screen.dart (search "Buscar comercio, nota o categoría…", filter sheet with
# type, period, account and category), dashboard_screen.dart (month summary, "Seleccionar
# moneda", "Ver análisis"), dashboard_analysis_screen.dart (periods: Este mes, Mes anterior,
# Últimos 3 meses, Este año, Fechas), dashboard/service.py (summary computed on the server).
UC07 = dict(
    file="uc-07-historial-y-panel-financiero",
    frame="HU-011 - HU-012 Historial y Panel Financiero",
    system="Finance AI",
    boundary=BOUNDARY_WIDE,
    rx=120,
    actors=[usuario(425)],
    usecases=[
        dict(id="H", label=["Consultar Historial"], cx=620, cy=275),
        dict(id="S", label=["Buscar por Texto"], cx=1000, cy=205),
        dict(id="F", label=["Filtrar Movimientos"], cx=1000, cy=345),
        dict(id="D", label=["Consultar Panel", "Financiero"], cx=620, cy=620),
        dict(id="Cs", label=["Calcular Resumen", "del Periodo"], cx=1000, cy=500),
        dict(id="Mo", label=["Cambiar Moneda"], cx=1000, cy=650),
        dict(id="An", label=["Ver Análisis"], cx=1000, cy=790),
        dict(id="Pe", label=["Seleccionar Periodo", "de Análisis"], cx=1340, cy=790),
    ],
    assoc=[("usuario", "H"), ("usuario", "D")],
    relations=[
        dict(kind="extend", src="S", dst="H"),
        dict(kind="extend", src="F", dst="H"),
        dict(kind="include", src="D", dst="Cs"),
        dict(kind="extend", src="Mo", dst="D"),
        dict(kind="extend", src="An", dst="D"),
        dict(kind="extend", src="Pe", dst="An"),
    ],
)

# ---------------------------------------------------------------- 08 categorias
# Checked: categories_screen.dart (list, "Arrastrar para reordenar"), category_form_screen.dart
# (Nueva / Editar categoría, name, color, icon; delete dialog: permanent, name reusable, history
# shows "Categoría eliminada", linked budgets are deleted too), HU-004 (unique trimmed names).
UC08 = dict(
    file="uc-08-categorias",
    frame="HU-004 Categorías",
    system="Finance AI",
    height=780,
    boundary=(440, 96, 1110, 620),
    rx=120,
    actors=[usuario(435)],
    usecases=[
        dict(id="G", label=["Gestionar Categorías"], cx=600, cy=435),
        dict(id="C", label=["Crear Categoría"], cx=600, cy=190),
        dict(id="Q", label=["Consultar Categorías"], cx=960, cy=435),
        dict(id="V", label=["Validar Nombre", "Único"], cx=960, cy=190),
        dict(id="E", label=["Editar Categoría"], cx=1320, cy=190),
        dict(id="Rc", label=["Reordenar", "Categorías"], cx=1320, cy=320),
        dict(id="X", label=["Eliminar Categoría"], cx=1320, cy=450),
        dict(id="Pb", label=["Eliminar Presupuestos", "Vinculados"], cx=1320, cy=600),
    ],
    assoc=[("usuario", "G")],
    relations=[
        dict(kind="extend", src="C", dst="G", lab=(52, 5)),
        dict(kind="extend", src="Q", dst="G"),
        dict(kind="extend", src="E", dst="Q"),
        dict(kind="extend", src="Rc", dst="Q"),
        dict(kind="extend", src="X", dst="Q"),
        dict(kind="include", src="C", dst="V"),
        dict(kind="include", src="E", dst="V"),
        dict(kind="include", src="X", dst="Pb", lab=(52, 5)),
    ],
)

# ---------------------------------------------------------------- 09 fuentes de ingreso
# Checked: income_sources_screen.dart (inline "Nueva fuente", "Renombrar fuente de ingreso",
# delete dialog: permanent, history keeps the record without a source), HU-005 (unique names).
UC09 = dict(
    file="uc-09-fuentes-de-ingreso",
    frame="HU-005 Fuentes de Ingreso",
    system="Finance AI",
    height=780,
    boundary=(440, 96, 1110, 620),
    rx=120,
    actors=[usuario(420)],
    usecases=[
        dict(id="G", label=["Gestionar Fuentes", "de Ingreso"], cx=600, cy=420),
        dict(id="C", label=["Crear Fuente"], cx=600, cy=190),
        dict(id="Q", label=["Consultar Fuentes"], cx=960, cy=420),
        dict(id="V", label=["Validar Nombre", "Único"], cx=960, cy=190),
        dict(id="R", label=["Renombrar Fuente"], cx=1320, cy=190),
        dict(id="X", label=["Eliminar Fuente"], cx=1320, cy=420),
        dict(id="Hs", label=["Conservar Historial", "sin Fuente"], cx=1320, cy=620),
    ],
    assoc=[("usuario", "G")],
    relations=[
        dict(kind="extend", src="C", dst="G", lab=(52, 5)),
        dict(kind="extend", src="Q", dst="G"),
        dict(kind="extend", src="R", dst="Q"),
        dict(kind="extend", src="X", dst="Q"),
        dict(kind="include", src="C", dst="V"),
        dict(kind="include", src="R", dst="V"),
        dict(kind="include", src="X", dst="Hs", lab=(52, 5)),
    ],
)

# ---------------------------------------------------------------- 10 presupuestos
# Checked: budgets router and service (create, list, get, update, delete), budget_form_screen.dart
# ("Nuevo / Editar presupuesto", "Todos los gastos" or one category, "Monto objetivo", delete
# dialog), budgets_screen.dart ("El progreso se calcula desde tus gastos confirmados"),
# BE-README (progress derived on read, only expenses in the same currency count).
UC10 = dict(
    file="uc-10-presupuestos",
    frame="HU-016 Presupuestos",
    system="Finance AI",
    boundary=BOUNDARY_WIDE,
    rx=120,
    actors=[usuario(520)],
    usecases=[
        dict(id="Ec", label=["Elegir Categoría", "del Presupuesto"], cx=600, cy=170),
        dict(id="C", label=["Crear Presupuesto"], cx=600, cy=340),
        dict(id="G", label=["Gestionar Presupuestos"], cx=600, cy=520),
        dict(id="V", label=["Validar Datos del", "Presupuesto"], cx=960, cy=340),
        dict(id="Q", label=["Consultar Presupuestos"], cx=960, cy=520),
        dict(id="Pg", label=["Calcular Progreso", "del Presupuesto"], cx=960, cy=710),
        dict(id="E", label=["Editar Presupuesto"], cx=1320, cy=340),
        dict(id="X", label=["Eliminar Presupuesto"], cx=1320, cy=520),
    ],
    assoc=[("usuario", "G")],
    relations=[
        dict(kind="extend", src="Ec", dst="C", lab=(52, 5)),
        dict(kind="extend", src="C", dst="G", lab=(52, 5)),
        dict(kind="extend", src="Q", dst="G"),
        dict(kind="extend", src="E", dst="Q"),
        dict(kind="extend", src="X", dst="Q"),
        dict(kind="include", src="C", dst="V"),
        dict(kind="include", src="E", dst="V"),
        dict(kind="include", src="Q", dst="Pg", lab=(52, 5)),
    ],
)

SPECS = {s["file"]: s for s in (UC01, UC02, UC03, UC04, UC05, UC06, UC07, UC08, UC09, UC10)}
