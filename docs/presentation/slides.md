---
theme: default
title: Finance AI
info: |
  Presentación del proyecto Finance AI ante los docentes.
  Universidad de Cundinamarca · PGC 2026-2.
colorSchema: light
aspectRatio: 16/9
canvasWidth: 1280
fonts:
  sans: Segoe UI
  mono: Cascadia Code
  provider: none
transition: fade
exportFilename: Finance-AI
drawings:
  persist: false
layout: cover
---

<img class="fa-cover-logo" src="/logo-universidad.jpg" alt="Universidad de Cundinamarca" style="align-self:flex-start" />
<div style="display:flex;gap:36px;align-items:center;flex:1;min-height:0">
  <div style="flex:1;min-width:0">
    <div class="fa-eyebrow">Proyecto de Gestión del Conocimiento · 2026-2</div>
    <h1>Finance <span>AI</span></h1>
    <div class="fa-cover-sub" style="margin-top:18px">Aplicación móvil para el registro y análisis de gastos personales con asistencia de IA para la captura automática de gastos</div>
    <ul class="fa-team" style="margin:22px 0 0;padding:0;list-style:none">
      <li>David Fernando Gonzalez Soler</li>
      <li>Maicol Estiven Fonseca Muñoz</li>
      <li>Ivan David Giraldo Garavito</li>
    </ul>
    <div class="fa-thanks" style="margin-top:24px">Con agradecimiento al docente <b>Oscar Jobany Gómez Ochoa</b> por guiarnos en este proceso.</div>
  </div>
  <div class="fa-art">
    <div class="bubble">pasé 200 mil de Nequi a Bancolombia</div>
    <div class="tag"><Icon name="sparkles" :size="18" /> Propuesta de la IA</div>
    <div class="pcard">
      <div class="pc-top"><span class="fa-chip user">Transferencia</span><span class="pc-amt">200.000 COP</span></div>
      <div class="pc-route">Nequi <Icon name="arrow-right" :size="20" /> Bancolombia</div>
      <div class="pc-meta">Cuentas reconocidas · todavía sin guardar</div>
      <div class="pc-actions"><span class="fa-btn ok">Aceptar</span><span class="fa-btn">Editar</span><span class="fa-btn no">Descartar</span></div>
    </div>
    <div class="caption">Ilustración del flujo principal</div>
  </div>
</div>

<!--
[0:30] Buenas. Somos David, Maicol e Ivan, y esto es Finance AI, nuestro proyecto de gestión del conocimiento.
Antes de empezar, un agradecimiento al profesor Oscar Jobany Gómez Ochoa por guiarnos en el proceso.
La ilustración de la derecha resume la idea entera: escribes una frase como lo dirías, la IA propone el registro, y tú decides si se guarda. Eso es lo que vamos a contar y a mostrar en vivo.
-->

---
layout: slide
eyebrow: El problema
---

# Registrar gastos es fricción… y la gente abandona

<div class="fa-lead">Controlar el dinero exige <b>tiempo y disciplina en cada compra</b>, y ese registro se interrumpe con facilidad.</div>
<div class="fa-g3 fa-mt">
  <div class="fa-card fa-stat" style="--c:var(--fa-red)">
    <div class="num">4,2 %</div>
    <div class="lbl">de retención a 30 días en apps de finanzas: <b>más del 95 % las abandona</b></div>
    <div class="src">Curry (2026)</div>
  </div>
  <div class="fa-card fa-stat" style="--c:var(--fa-warn)">
    <div class="num">59–66 <small>días</small></div>
    <div class="lbl">es la <b>mediana para consolidar un hábito</b> (conductas de salud)</div>
    <div class="src">Singh et al. (2024)</div>
  </div>
  <div class="fa-card fa-stat" style="--c:var(--fa-green-d)">
    <div class="num">66,6 %</div>
    <div class="lbl">de las operaciones monetarias en Colombia son por <b>canales digitales</b></div>
    <div class="src">Banca de las Oportunidades (2024)</div>
  </div>
</div>
<div class="fa-card soft fa-mt fa-row" style="align-items:center;gap:12px;padding:12px 20px">
  <span class="fa-chip lg">Sin registro sistemático</span><Icon name="arrow-right" class="fa-arrow" />
  <span class="fa-chip lg">no sabes en qué gastas</span><Icon name="arrow-right" class="fa-arrow" />
  <span class="fa-chip lg">decides sin información</span><Icon name="arrow-right" class="fa-arrow" />
  <span class="fa-chip lg no">sobregiros · crédito costoso · no poder ahorrar</span>
</div>
<div class="fa-row fa-mt" style="align-items:stretch">
  <div class="fa-card fa-grow" style="flex:0.8">
    <h3><span class="fa-ibox user"><Icon name="users" /></span>¿Para quién?</h3>
    <div style="font-size:18px;line-height:1.45">Cualquier persona que quiera controlar sus gastos desde el celular. Piloto: estudiantes de la Universidad de Cundinamarca, sede Facatativá.</div>
  </div>
  <div v-click class="fa-card green fa-grow" style="flex:1.2">
    <h3><span class="fa-ibox"><Icon name="circle-help" /></span>Pregunta guía</h3>
    <div style="font-size:19px;line-height:1.45;font-weight:600">¿Cómo puede una app móvil con IA facilitar el registro y análisis de gastos, reduciendo el esfuerzo de captura y ayudando a formar el hábito de control financiero?</div>
  </div>
</div>

<!--
[1:30] El problema no es que la gente no sepa que debería llevar sus gastos: es que registrar cada compra da pereza y se abandona.
Las apps de finanzas retienen solo el 4,2 % de sus usuarios a los 30 días; más del 95 % se va el primer mes. Y formar un hábito toma una mediana de 59 a 66 días; ojo, ese dato viene de estudios de hábitos de salud, lo decimos con esa precaución.
El contexto: en Colombia el 66,6 % de las operaciones de dinero ya son digitales, la vida financiera ya pasa por el celular.
Sin registro, no sabes en qué gastas y decides a ciegas.
Usuarios: cualquier persona que quiera controlar sus gastos desde el celular; el piloto previsto son estudiantes de la UdeC en Facatativá. [Clic] La pregunta que guía el proyecto es esta.
-->

---
layout: slide
eyebrow: La propuesta
---

# Registrar en segundos, sin perder el control

<div class="fa-card" style="border-left:6px solid var(--fa-green);padding:22px 28px;font-size:25px;line-height:1.4;color:#374151">Una <b style="color:var(--fa-ink)">app móvil y una API</b> donde registras gastos, ingresos y transferencias <b style="color:var(--fa-ink)">escribiendo, hablando o fotografiando</b>. La IA prepara el registro; <b style="color:var(--fa-ink)">tú lo confirmas</b>.</div>
<div class="fa-g3 fa-mt-l" style="gap:24px">
  <div class="fa-card fa-zone" style="--c:var(--fa-ai);padding:26px 28px">
    <h3 style="margin-bottom:16px"><span class="fa-ibox ai lg"><Icon name="sparkles" :size="28" /></span></h3>
    <div style="font-size:27px;font-weight:780;line-height:1.2;margin-bottom:12px">La IA propone,<br>tú decides</div>
    <div style="font-size:19px;line-height:1.45;color:#4b5563">Confirmas, editas o descartas. Nada se guarda sin tu acción.</div>
  </div>
  <div class="fa-card fa-zone" style="--c:var(--fa-blue);padding:26px 28px">
    <h3 style="margin-bottom:16px"><span class="fa-ibox user lg"><Icon name="pencil-line" :size="28" /></span></h3>
    <div style="font-size:27px;font-weight:780;line-height:1.2;margin-bottom:12px">Lo manual siempre<br>funciona</div>
    <div style="font-size:19px;line-height:1.45;color:#4b5563">Los formularios son completos: si la IA falla o no la quieres, sigues registrando.</div>
  </div>
  <div class="fa-card fa-zone" style="--c:var(--fa-green);padding:26px 28px">
    <h3 style="margin-bottom:16px"><span class="fa-ibox lg"><Icon name="calculator" :size="28" /></span></h3>
    <div style="font-size:27px;font-weight:780;line-height:1.2;margin-bottom:12px">El dinero lo calculan<br>reglas, no la IA</div>
    <div style="font-size:19px;line-height:1.45;color:#4b5563">Saldos, presupuestos y dashboard salen de SQL y reglas, no de un modelo de lenguaje.</div>
  </div>
</div>
<div class="fa-card soft fa-mt-l fa-row" style="align-items:center;gap:18px;padding:18px 24px">
  <span class="fa-chip rules lg" style="flex:none"><Icon name="target" :size="18" /> Objetivo general</span>
  <div style="font-size:20px;line-height:1.4">Reducir el esfuerzo de captura de los gastos y contribuir a formar el hábito de control financiero.</div>
</div>

<!--
[1:00] Nuestra propuesta en una frase: una app y una API donde registras tus movimientos escribiendo, hablando o fotografiando un recibo, y la IA te deja el registro listo para que lo confirmes.
Tres principios sostienen todo el diseño.
Uno: la IA propone, tú decides. Nada se guarda sin tu acción.
Dos: lo manual siempre funciona. Los formularios son completos; la IA es una ayuda, no un requisito.
Tres: el dinero lo calculan reglas. Saldos, presupuestos y dashboard salen de SQL y reglas deterministas, no de un modelo de lenguaje.
El objetivo general del proyecto es reducir el esfuerzo de captura y contribuir a formar el hábito de control financiero.
-->

---
layout: slide
eyebrow: El producto
---

# Qué hace la app

<div class="fa-lead">Un <b>flujo manual completo</b>, con capas de IA opcionales encima.</div>
<div class="fa-g4 fa-mt-l">
  <div class="fa-card fa-zone" style="--c:var(--fa-ai);min-height:290px">
    <h3><span class="fa-ibox ai"><Icon name="message-square-plus" /></span>Capturar</h3>
    <ul class="fa-list" style="--c:var(--fa-ai);margin-top:14px">
      <li>Chat de texto con IA</li>
      <li>Dictado por voz</li>
      <li>Foto de recibo</li>
      <li>Formularios manuales</li>
    </ul>
  </div>
  <div class="fa-card fa-zone" style="--c:var(--fa-green);min-height:290px">
    <h3><span class="fa-ibox"><Icon name="wallet" /></span>Dinero</h3>
    <ul class="fa-list" style="margin-top:14px">
      <li>Cuentas: efectivo, banco, billetera, ahorros, tarjeta</li>
      <li>Gastos e ingresos</li>
      <li>Transferencias entre cuentas</li>
    </ul>
  </div>
  <div class="fa-card fa-zone" style="--c:var(--fa-blue);min-height:290px">
    <h3><span class="fa-ibox user"><Icon name="folder-tree" /></span>Organizar</h3>
    <ul class="fa-list" style="--c:var(--fa-blue);margin-top:14px">
      <li>Categorías propias</li>
      <li>Fuentes de ingreso</li>
      <li>Historial con búsqueda y filtros</li>
    </ul>
  </div>
  <div class="fa-card fa-zone" style="--c:var(--fa-warn);min-height:290px">
    <h3><span class="fa-ibox warn"><Icon name="chart-pie" /></span>Entender</h3>
    <ul class="fa-list" style="--c:var(--fa-warn);margin-top:14px">
      <li>Dashboard: saldos, ingresos vs. gastos</li>
      <li>Categorías principales</li>
      <li>Presupuestos con progreso</li>
    </ul>
  </div>
</div>
<div class="fa-g3 fa-mt-l" style="gap:18px">
  <div class="fa-card soft fa-row" style="align-items:center;gap:16px;padding:18px 22px"><span class="fa-ibox gray lg"><Icon name="smartphone" :size="26" /></span><div><div class="fa-b" style="font-size:21px">Android y Windows</div><div class="fa-small fa-muted">una sola base de código Flutter</div></div></div>
  <div class="fa-card soft fa-row" style="align-items:center;gap:16px;padding:18px 22px"><span class="fa-ibox gray lg"><Icon name="plug" :size="26" /></span><div><div class="fa-b" style="font-size:21px">32 rutas de API</div><div class="fa-small fa-muted">contrato OpenAPI entre app y servidor</div></div></div>
  <div class="fa-card soft fa-row" style="align-items:center;gap:16px;padding:18px 22px"><span class="fa-ibox gray lg"><Icon name="user-lock" :size="26" /></span><div><div class="fa-b" style="font-size:21px">Datos por usuario</div><div class="fa-small fa-muted">cada persona ve solo lo suyo</div></div></div>
</div>

<!--
[0:45] Esto es lo que la app hace hoy. Cuatro grupos.
Capturar: chat de texto con IA, dictado por voz, foto de recibo y los formularios manuales.
Dinero: cuentas —efectivo, banco, billetera, ahorros, tarjeta—, gastos, ingresos y transferencias entre cuentas.
Organizar: categorías propias, fuentes de ingreso, e historial con búsqueda y filtros.
Entender: un dashboard con saldos e ingresos contra gastos, categorías principales y presupuestos con su progreso.
Funciona en Android y Windows con el mismo código Flutter, y el servidor expone 32 rutas de API. Cada usuario ve únicamente sus datos.
-->

---
layout: slide
eyebrow: Cómo funciona
---

# Cómo nace un registro: de la entrada a la confirmación

<div class="fa-row fa-mt" style="gap:12px;align-items:flex-start">
  <div class="fa-grow">
    <div class="fa-row" style="align-items:center;gap:10px;margin-bottom:8px"><span class="fa-badge" style="--c:var(--fa-green)">1</span><span style="font-size:22px;font-weight:750">Entrada</span></div>
    <div class="fa-small" style="min-height:92px;line-height:1.35">Escribes, dictas o fotografías un recibo. También puedes usar el formulario manual.</div>
    <Shot name="captura-1-entrada" ratio="9 / 16" width="150px" label="Chat de captura" />
  </div>
  <div class="fa-arrow" style="margin-top:150px"><Icon name="chevron-right" :size="30" /></div>
  <div class="fa-grow">
    <div class="fa-row" style="align-items:center;gap:10px;margin-bottom:8px"><span class="fa-badge" style="--c:var(--fa-ai)">2</span><span style="font-size:22px;font-weight:750">Propuesta de la IA</span></div>
    <div class="fa-small" style="min-height:92px;line-height:1.35">Tipo, monto, fecha, cuenta y categoría (e ítems en recibos). <b>Todavía nada se guarda.</b></div>
    <Shot name="captura-2-propuesta" ratio="9 / 16" width="150px" label="Tarjeta de propuesta" />
  </div>
  <div class="fa-arrow" style="margin-top:150px"><Icon name="chevron-right" :size="30" /></div>
  <div class="fa-grow">
    <div class="fa-row" style="align-items:center;gap:10px;margin-bottom:8px"><span class="fa-badge" style="--c:var(--fa-blue)">3</span><span style="font-size:22px;font-weight:750">Revisión</span></div>
    <div class="fa-small" style="min-height:92px;line-height:1.35">Aceptar con un toque si hay confianza, editar o descartar. Si hay duda real, <b>una pregunta corta</b>.</div>
    <Shot name="captura-3-revision" ratio="9 / 16" width="150px" label="Editar en el sitio" />
  </div>
  <div class="fa-arrow" style="margin-top:150px"><Icon name="chevron-right" :size="30" /></div>
  <div class="fa-grow">
    <div class="fa-row" style="align-items:center;gap:10px;margin-bottom:8px"><span class="fa-badge" style="--c:var(--fa-income)">4</span><span style="font-size:22px;font-weight:750">Guardado</span></div>
    <div class="fa-small" style="min-height:92px;line-height:1.35">La <b>misma operación validada y atómica</b> del formulario manual: saldos, historial y dashboard se actualizan.</div>
    <Shot name="captura-4-guardado" ratio="9 / 16" width="150px" label="Saldo actualizado" />
  </div>
</div>
<div class="fa-card soft fa-mt fa-row" style="align-items:center;gap:12px;padding:12px 18px;flex-wrap:wrap">
  <span class="fa-b" style="font-size:15px;letter-spacing:.08em;text-transform:uppercase;color:var(--fa-muted)">Entradas</span>
  <span class="fa-chip ai">Frase</span><span class="fa-chip ai">Voz (como texto)</span><span class="fa-chip ai">Foto de recibo</span><span class="fa-chip">Formulario</span>
  <Icon name="arrow-right" class="fa-arrow" />
  <span class="fa-b" style="font-size:15px;letter-spacing:.08em;text-transform:uppercase;color:var(--fa-muted)">Salida</span>
  <span class="fa-chip ok">Gasto, ingreso o transferencia confirmados</span>
</div>

<!--
[1:30] Este es el recorrido central, y conviene fijarse en qué entra y qué sale.
Entra: una frase, una transcripción de voz, la imagen de un recibo, o un formulario manual.
Paso 2: la IA devuelve una propuesta —tipo, monto, fecha, cuenta, categoría y, si es recibo, los ítems—. Todavía no hay nada guardado.
Paso 3: aceptas con un toque si hay confianza, editas, o descartas. Solo si hay una duda real, la app hace una pregunta corta.
Paso 4: al aceptar, se usa exactamente la misma operación validada y atómica que usa el formulario manual. Por eso saldos, historial y dashboard se actualizan igual venga el dato de la IA o de tus manos.
Sale: un gasto, ingreso o transferencia confirmados, con registro de cómo se capturó.
-->

---
layout: slide
eyebrow: Inteligencia artificial
---

# Dónde entra la IA… y dónde no

<div style="display:grid;grid-template-columns:1fr 34px 1.15fr 34px 0.85fr;gap:0;align-items:stretch;margin-top:14px">
  <div class="fa-card fa-zone" style="--c:var(--fa-ai);padding:24px 26px">
    <h3><span class="fa-ibox ai"><Icon name="sparkles" /></span>La IA propone</h3>
    <span class="fa-chip ai lg">Modelo de lenguaje vía API</span>
    <ul class="fa-list fa-mt" style="--c:var(--fa-ai)">
      <li>Entiende frases en español (o la transcripción de tu voz)</li>
      <li>Lee fotos de recibos</li>
      <li>Devuelve una propuesta estructurada</li>
    </ul>
    <div class="fa-card red flat fa-mt-s" style="padding:12px 16px"><span class="fa-b" style="color:var(--fa-red)">Nunca:</span> <span style="font-size:17px">guarda datos ni calcula tu dinero</span></div>
  </div>
  <div class="fa-arrow"><Icon name="chevron-right" :size="32" /></div>
  <div class="fa-card fa-zone" style="--c:var(--fa-green);padding:24px 26px">
    <h3><span class="fa-ibox"><Icon name="shield-check" /></span>El sistema decide</h3>
    <span class="fa-chip rules lg">Reglas y código determinista</span>
    <ul class="fa-list fa-mt">
      <li>Compara la propuesta con <b>tus</b> cuentas y categorías reales</li>
      <li>Valida y guarda de forma atómica</li>
      <li>Calcula saldos, presupuestos, historial y dashboard con SQL</li>
    </ul>
  </div>
  <div class="fa-arrow"><Icon name="chevron-right" :size="32" /></div>
  <div class="fa-card fa-zone" style="--c:var(--fa-blue);padding:24px 26px">
    <h3><span class="fa-ibox user"><Icon name="user-check" /></span>Tú confirmas</h3>
    <span class="fa-chip user lg">Control del usuario</span>
    <ul class="fa-list fa-mt" style="--c:var(--fa-blue)">
      <li>Aceptar, editar o descartar</li>
      <li>Nada se guarda sin tu acción</li>
    </ul>
  </div>
</div>
<div v-click class="fa-card green fa-mt-l fa-row" style="align-items:center;gap:16px;padding:18px 24px">
  <span class="fa-ibox lg"><Icon name="git-compare-arrows" :size="26" /></span>
  <div style="font-size:20px;line-height:1.4"><b>Evolución del diseño:</b> empezamos con una captura 100 % IA; terminamos con un <b>flujo manual completo</b> donde la IA es una capa opcional.</div>
</div>
<div v-click class="fa-muted fa-mt" style="display:flex;gap:8px;align-items:center;font-size:16px"><Icon name="info" :size="18" /> Transparencia: incluso el panel «Análisis inteligente» del dashboard funciona con reglas, no con un modelo de lenguaje.</div>

<!--
[1:30] Esta es la diapositiva más importante para entender el proyecto.
La IA hace dos trabajos: entender una frase en español —o la transcripción de la voz— y leer una foto de recibo. En ambos casos devuelve una propuesta estructurada. Y nada más. Nunca guarda datos ni calcula tu dinero.
Después, el sistema decide con código determinista: compara la propuesta con tus cuentas y categorías reales, valida y guarda de forma atómica, y calcula saldos, presupuestos y dashboard con SQL.
Y al final, tú confirmas.
[Clic] Una nota honesta sobre la evolución: empezamos con una idea de captura totalmente basada en IA; el producto terminó siendo un flujo manual completo donde la IA es una capa opcional. Fue una decisión de ingeniería: el dinero no puede depender de una respuesta probabilística.
[Clic] Y por transparencia: el panel «Análisis inteligente» del dashboard son reglas, no un modelo de lenguaje.
-->

---
layout: slide
eyebrow: Inteligencia artificial
---

# De palabras a una propuesta confiable

<div class="fa-row" style="gap:8px;align-items:stretch;margin-top:6px">
  <div class="fa-card fa-grow" style="padding:12px 14px"><div class="fa-row" style="gap:8px;align-items:center"><span class="fa-ibox gray"><Icon name="message-square-text" :size="20" /></span><b>Mensaje</b></div><div class="fa-tiny fa-muted fa-mt-s">frase en español o transcripción de voz</div></div>
  <div class="fa-arrow"><Icon name="chevron-right" :size="22" /></div>
  <div class="fa-card fa-grow" style="padding:12px 14px"><div class="fa-row" style="gap:8px;align-items:center"><span class="fa-ibox gray"><Icon name="file-text" :size="20" /></span><b>Prompt con contexto</b></div><div class="fa-tiny fa-muted fa-mt-s">tus cuentas, categorías, fuentes de ingreso y la fecha de hoy</div></div>
  <div class="fa-arrow"><Icon name="chevron-right" :size="22" /></div>
  <div class="fa-card ai fa-grow" style="padding:12px 14px"><div class="fa-row" style="gap:8px;align-items:center"><span class="fa-ibox ai"><Icon name="sparkles" :size="20" /></span><b>LLM</b></div><div class="fa-tiny fa-muted fa-mt-s">responde en JSON, temperatura 0</div></div>
  <div class="fa-arrow"><Icon name="chevron-right" :size="22" /></div>
  <div class="fa-card green fa-grow" style="padding:12px 14px"><div class="fa-row" style="gap:8px;align-items:center"><span class="fa-ibox"><Icon name="scan-search" :size="20" /></span><b>Anclaje</b></div><div class="fa-tiny fa-muted fa-mt-s">se compara con tus datos reales</div></div>
  <div class="fa-arrow"><Icon name="chevron-right" :size="22" /></div>
  <div class="fa-card fa-grow" style="padding:12px 14px;background:var(--fa-blue-s);border-color:#cfdcff"><div class="fa-row" style="gap:8px;align-items:center"><span class="fa-ibox user"><Icon name="circle-check-big" :size="20" /></span><b>Propuesta</b></div><div class="fa-tiny fa-muted fa-mt-s">un toque para aceptar</div></div>
</div>
<div class="fa-row fa-mt" style="align-items:stretch">
  <div class="fa-card" style="flex:0.9">
    <div class="fa-tiny fa-b fa-muted" style="letter-spacing:.1em;text-transform:uppercase;margin-bottom:8px">Ejemplo ilustrativo</div>
    <div style="display:inline-block;background:var(--fa-green);color:#fff;padding:9px 14px;border-radius:16px 16px 4px 16px;font-size:17px">pasé 200 mil de Nequi a Bancolombia</div>
    <div class="fa-tiny fa-muted fa-mt-s" style="display:flex;gap:6px;align-items:center"><Icon name="sparkles" :size="14" /> El modelo devuelve:</div>
    <div class="fa-chips fa-mt-s">
      <span class="fa-chip ai">intención: transferencia</span><span class="fa-chip ai">monto: 200.000</span>
      <span class="fa-chip ai">origen: Nequi</span><span class="fa-chip ai">destino: Bancolombia</span><span class="fa-chip ai">confianza: 0–1</span>
    </div>
    <div class="fa-small fa-mt" style="display:flex;gap:8px;align-items:flex-start"><Icon name="scan-search" :size="18" style="color:var(--fa-green-d);margin-top:3px" /><span><b>Anclaje:</b> «Nequi» y «Bancolombia» coinciden con tus cuentas ⇒ se propone una <b>transferencia</b>, no un gasto.</span></div>
  </div>
  <div class="fa-card" style="flex:1.1">
    <div class="fa-tiny fa-b fa-muted" style="letter-spacing:.1em;text-transform:uppercase;margin-bottom:8px">Salvaguardas</div>
    <ul class="fa-list sm" style="margin:0">
      <li><b>No inventa:</b> los nombres se comparan con tus cuentas y categorías</li>
      <li><b>Confianza ≥ 0,8:</b> revisión de un toque; menos, revisar con cuidado</li>
      <li><b>Una sola pregunta</b> corta, con opciones, solo ante duda real</li>
      <li><b>Entre tus cuentas ≠ gasto;</b> moneda dudosa: se pregunta</li>
      <li><b>Texto no confiable:</b> defensa contra prompt injection</li>
      <li><b>Respaldo:</b> segundo proveedor, límites de tiempo y uso; si cae la IA, siguen los formularios</li>
    </ul>
  </div>
</div>
<div class="fa-card soft fa-mt fa-row" style="align-items:center;gap:12px;padding:10px 18px">
  <span class="fa-ibox gray"><Icon name="cpu" /></span>
  <div style="font-size:16px;line-height:1.35"><b>Modelo:</b> LLM comercial de bajo costo vía API (Gemini o DeepSeek, intercambiables). <b>Sin entrenar modelos propios:</b> ingeniería de prompts + validación determinista.</div>
</div>

<!--
[2:00] Cómo funciona por dentro, sin entrar al código.
El mensaje —o la transcripción de voz— se envía con un prompt que incluye tus cuentas, tus categorías, tus fuentes de ingreso y la fecha de hoy. El modelo responde un JSON con la intención —gasto, ingreso o transferencia—, monto, fecha, cuenta y una confianza entre 0 y 1; usamos temperatura 0 para que sea lo más estable posible.
Después viene lo importante, el anclaje: lo que dijo el modelo se compara con tus datos reales. Si el modelo dice «Nequi», solo vale si existe una cuenta Nequi tuya. Nunca inventa una cuenta.
Ejemplo ilustrativo: «pasé 200 mil de Nequi a Bancolombia» es una transferencia, no un gasto. Es un caso que cuidamos expresamente.
Las salvaguardas: umbral de confianza de 0,8 para el toque único, una sola pregunta corta si hay duda real, tratamos el texto del usuario como dato no confiable por seguridad, y hay proveedor de respaldo. Si la IA cae, los formularios siguen funcionando.
El modelo es un LLM comercial de bajo costo por API, Gemini o DeepSeek, intercambiables por configuración. No entrenamos nada propio: es ingeniería de prompts más validación determinista.
-->

---
layout: slide
eyebrow: Inteligencia artificial
---

# Más allá del texto: recibos y voz

<div class="fa-g2 fa-mt">
  <div class="fa-card fa-zone" style="--c:var(--fa-ai);padding:22px 26px">
    <h3><span class="fa-ibox ai"><Icon name="receipt-text" /></span>Foto de recibo</h3>
    <div class="fa-steps">
      <div class="st"><span class="fa-badge" style="--c:var(--fa-ai)">1</span><span>Foto <span class="m">(JPEG, PNG o HEIC, hasta 10 MB)</span></span></div>
      <div class="st"><span class="fa-badge" style="--c:var(--fa-ai)">2</span><span>Se normaliza y comprime en el servidor</span></div>
      <div class="st"><span class="fa-badge" style="--c:var(--fa-ai)">3</span><span>LLM con visión → JSON estricto: <span class="m">comercio, fecha, total impreso, moneda, medio de pago, categoría sugerida, ítems</span></span></div>
      <div class="st"><span class="fa-badge" style="--c:var(--fa-green)">4</span><span><b>Validación:</b> defensa anti-inyección y verificación aritmética</span></div>
      <div class="st"><span class="fa-badge" style="--c:var(--fa-blue)">5</span><span><b>Revisión:</b> editar, reintentar o aceptar. El total impreso se conserva</span></div>
    </div>
  </div>
  <div class="fa-card fa-zone" style="--c:var(--fa-blue);padding:22px 26px">
    <h3><span class="fa-ibox user"><Icon name="mic" /></span>Voz</h3>
    <div class="fa-steps">
      <div class="st"><span class="fa-badge" style="--c:var(--fa-blue)">1</span><span>Pulsas el micrófono y hablas</span></div>
      <div class="st"><span class="fa-badge" style="--c:var(--fa-blue)">2</span><span><b>El reconocimiento ocurre en el dispositivo</b> <span class="m">(Android: reconocedor local · Windows: SAPI)</span></span></div>
      <div class="st"><span class="fa-badge" style="--c:var(--fa-ai)">3</span><span>La transcripción entra al <b>mismo flujo de texto</b> de la IA</span></div>
      <div class="st"><span class="fa-badge" style="--c:var(--fa-blue)">4</span><span><b>Revisión:</b> aceptar, editar o descartar</span></div>
    </div>
    <div class="fa-card green flat fa-mt" style="padding:14px 18px;display:flex;gap:12px;align-items:center"><Icon name="lock" :size="24" style="color:var(--fa-green-d)" /><span style="font-size:19px;font-weight:700">El audio nunca sale del dispositivo</span></div>
  </div>
</div>
<div class="fa-card soft fa-mt fa-row" style="align-items:center;gap:16px;padding:16px 22px">
  <span class="fa-ibox gray lg"><Icon name="git-compare-arrows" :size="26" /></span>
  <div style="font-size:19px;line-height:1.4"><b>Cambio frente al plan original</b>, que enviaba el audio al modelo: ahora la voz se convierte en texto en el propio dispositivo. Ambos caminos terminan en la misma revisión: aceptar, editar o descartar.</div>
</div>

<!--
[1:15] Dos caminos más que terminan en el mismo lugar: una propuesta que revisas.
Recibo: subes una foto, el servidor la normaliza y la comprime, un modelo con visión devuelve un JSON estricto —comercio, fecha, total impreso, moneda, medio de pago, categoría sugerida e ítems—, y antes de mostrártelo lo validamos: filtramos instrucciones maliciosas escondidas en la imagen y verificamos la aritmética. Se conserva el total impreso del recibo.
Voz: el reconocimiento ocurre en el dispositivo —Android usa el reconocedor local y Windows el reconocedor del sistema—, así que el audio nunca sale del equipo. La transcripción entra al mismo flujo de texto.
Esto cambió respecto al plan original, que enviaba el audio al modelo. Y los tres caminos —texto, recibo y voz— terminan en la misma revisión.
-->

---
layout: demo
---

<div class="fa-eyebrow">Demostración</div>
<h1>Demo en <span>vivo</span></h1>
<div class="fa-g4" style="margin-top:34px;gap:16px">
  <div class="step"><div class="n">1 · ESCRIBIR</div><div class="t">Una frase, como la dirías</div><div class="d">El chat de captura interpreta el gasto</div></div>
  <div class="step"><div class="n">2 · REVISAR</div><div class="t">La propuesta de la IA</div><div class="d">Cuenta, monto y categoría reconocidos</div></div>
  <div class="step"><div class="n">3 · ACEPTAR</div><div class="t">Un toque</div><div class="d">Se guarda con la misma operación validada</div></div>
  <div class="step"><div class="n">4 · VER</div><div class="t">Saldo y dashboard</div><div class="d">El movimiento ya aparece actualizado</div></div>
</div>
<div style="display:flex;gap:16px;margin-top:26px;flex-wrap:wrap">
  <span class="fallback"><Icon name="receipt-text" :size="20" /> Después: un recibo fotografiado</span>
  <span class="fallback"><Icon name="pencil-line" :size="20" /> Sin IA: el formulario manual sigue a un toque</span>
</div>

<!--
[3:00] DEMO EN VIVO. Guion sugerido (ensayar antes con la cuenta de demostración):
1. Frase de gasto: «almuerzo 18 mil con Nequi» → propuesta → Aceptar → ver el movimiento y el saldo.
2. Frase de transferencia: «pasé 200 mil de Nequi a Bancolombia» → mostrar que se propone una TRANSFERENCIA, no un gasto (necesita las dos cuentas creadas).
3. Foto de un recibo impreso previamente elegido → pantalla de revisión → aceptar o editar.
4. Dashboard: categorías y saldos actualizados.
Si la IA tarda o falla: abrir el formulario manual desde «+» y registrar igual (eso también demuestra el principio de que lo manual siempre funciona).

LISTA ANTES DE SALIR A ESCENA:
· Servidor y base de datos levantados (idealmente en local con Docker Compose) y con clave de IA configurada.
· Internet estable: la IA puede tardar hasta ~25 s antes de caer al respaldo.
· Usuario de demo con al menos dos cuentas (p. ej. Nequi y Bancolombia) y algunas categorías.
· Un recibo impreso y bien iluminado a mano.
· Voz: usar solo si el reconocimiento en español está instalado y probado en el equipo de la demo.
· Video de respaldo con todo el flujo, por si algo falla.
-->

---
layout: slide
eyebrow: Ingeniería
---

# Arquitectura y tecnología

<div class="fa-diagram" style="grid-template-columns:262px 118px 1fr 118px 250px;grid-template-rows:1fr 1fr;row-gap:14px;margin-top:8px;min-height:350px">
  <div class="fa-box" style="grid-column:1;grid-row:1/3;--c:var(--fa-blue)">
    <div class="ttl"><span class="fa-ibox user"><Icon name="smartphone" /></span>Cliente</div>
    <div class="sub">Flutter · Android y Windows</div>
    <ul class="fa-list sm fa-mt" style="--c:var(--fa-blue)">
      <li>Una sola base de código Dart</li>
      <li>Estado con Riverpod</li>
      <li>Credenciales en almacenamiento seguro</li>
      <li>Voz reconocida en el dispositivo</li>
    </ul>
  </div>
  <div class="fa-link" style="grid-column:2;grid-row:1/3"><div class="ln both"></div>HTTPS · REST<br>contrato OpenAPI</div>
  <div class="fa-box" style="grid-column:3;grid-row:1/3;--c:var(--fa-green)">
    <div class="ttl"><span class="fa-ibox"><Icon name="server" /></span>Servidor</div>
    <div class="sub">FastAPI (Python) · monolito modular</div>
    <div class="fa-chips fa-mt">
      <span class="fa-chip rules">Autenticación</span><span class="fa-chip rules">Cuentas</span><span class="fa-chip rules">Gastos</span>
      <span class="fa-chip rules">Ingresos</span><span class="fa-chip rules">Transferencias</span><span class="fa-chip rules">Categorías</span>
      <span class="fa-chip rules">Presupuestos</span><span class="fa-chip rules">Historial</span><span class="fa-chip rules">Dashboard</span>
      <span class="fa-chip ai">Captura de texto (IA)</span><span class="fa-chip ai">Recibos (IA)</span>
    </div>
    <div class="fa-small fa-muted fa-mt">Cada módulo: rutas → servicio → repositorio. Las transacciones las controla el servicio.</div>
  </div>
  <div class="fa-link" style="grid-column:4;grid-row:1"><div class="ln"></div>SQL</div>
  <div class="fa-box" style="grid-column:5;grid-row:1;--c:var(--fa-green)">
    <div class="ttl"><span class="fa-ibox gray"><Icon name="database" /></span>PostgreSQL</div>
    <div class="sub">Datos de cada usuario</div>
  </div>
  <div class="fa-link" style="grid-column:4;grid-row:2"><div class="ln"></div>API compatible con OpenAI</div>
  <div class="fa-box" style="grid-column:5;grid-row:2;--c:var(--fa-ai)">
    <div class="ttl"><span class="fa-ibox ai"><Icon name="sparkles" /></span>LLM externo</div>
    <div class="sub">Gemini o DeepSeek · las claves viven solo en el servidor</div>
  </div>
</div>
<div class="fa-row fa-mt" style="align-items:stretch">
  <div class="fa-card soft fa-grow fa-row" style="align-items:center;gap:14px;padding:14px 20px"><span class="fa-ibox gray lg"><Icon name="container" :size="26" /></span><div style="font-size:17px;line-height:1.4"><b>Local:</b> Docker Compose (API + PostgreSQL)<br><b>Nube:</b> CI/CD con GitHub Actions hacia Google Cloud Run <span class="fa-muted">(configurado)</span></div></div>
  <div class="fa-card green fa-grow" style="padding:14px 20px">
    <div style="font-size:17px;font-weight:700;margin-bottom:8px;display:flex;gap:8px;align-items:center"><Icon name="scale" :size="20" /> Los saldos no se guardan: se calculan</div>
    <div class="fa-formula">saldo = saldo inicial + Σ movimientos firmados</div>
  </div>
</div>

<!--
[1:30] La arquitectura es sencilla a propósito.
Un cliente Flutter, que corre en Android y Windows con el mismo código. Habla por HTTPS y REST con un servidor FastAPI, organizado como un monolito modular: cada funcionalidad es un módulo. Los dos módulos de IA —texto y recibos— están marcados en violeta; son los únicos que hablan con un proveedor de modelos externo, y las claves viven solo en el servidor, nunca en el teléfono.
Los datos están en PostgreSQL. Y el contrato entre app y servidor es un archivo OpenAPI.
Para operar: Docker Compose en local, y una canalización de GitHub Actions hacia Google Cloud Run, que está configurada.
Un detalle de diseño que nos gusta: los saldos no se guardan, se calculan. Cada movimiento queda como un registro firmado y el saldo es el inicial más la suma. Así una transferencia son dos movimientos y no cuenta como gasto ni como ingreso. Más detalle en el anexo.
-->

---
layout: slide
eyebrow: Ingeniería
---

# Seguridad, calidad y forma de trabajo

<div class="fa-g3 fa-mt">
  <div class="fa-card fa-zone" style="--c:var(--fa-ai)">
    <h3><span class="fa-ibox ai"><Icon name="shield-check" /></span>Seguridad y privacidad</h3>
    <ul class="fa-list sm" style="--c:var(--fa-ai)">
      <li>Contraseñas con Argon2</li>
      <li>Acceso de 15 min con credenciales renovables rotativas</li>
      <li>Cada usuario solo ve lo suyo, también a nivel de base de datos</li>
      <li>Los reportes de error no incluyen correos ni contraseñas</li>
      <li>Claves de IA solo en el servidor</li>
      <li>El audio no sale del dispositivo</li>
    </ul>
  </div>
  <div class="fa-card fa-zone" style="--c:var(--fa-green)">
    <h3><span class="fa-ibox"><Icon name="badge-check" /></span>Calidad</h3>
    <div class="fa-row" style="gap:12px;margin-bottom:10px">
      <div class="fa-card soft fa-grow fa-stat" style="padding:12px 14px"><div class="num" style="font-size:44px">408</div><div class="fa-small fa-muted" style="line-height:1.3">pruebas del servidor<br>89&nbsp;% de cobertura</div></div>
      <div class="fa-card soft fa-grow fa-stat" style="padding:12px 14px"><div class="num" style="font-size:44px">442</div><div class="fa-small fa-muted" style="line-height:1.3">pruebas de la app<br>84&nbsp;% de cobertura</div></div>
    </div>
    <ul class="fa-list">
      <li>CI: lint, tipado estricto, pruebas con mínimo 80&nbsp;% de cobertura y auditoría de dependencias</li>
    </ul>
    <div class="fa-small fa-muted fa-mt-s">Última verificación documentada: 5 oct 2026</div>
  </div>
  <div class="fa-card fa-zone" style="--c:var(--fa-blue)">
    <h3><span class="fa-ibox user"><Icon name="git-branch" /></span>Forma de trabajo</h3>
    <ul class="fa-list" style="--c:var(--fa-blue)">
      <li>Metodología <b>CDIO + Scrum</b></li>
      <li>11 ítems de backlog y 15 historias de usuario, con puntos Fibonacci</li>
      <li>Contrato primero: OpenAPI define la API</li>
      <li>Ramas <code>develop</code> → <code>main</code> con pull requests</li>
    </ul>
  </div>
</div>
<div class="fa-card fa-mt" style="padding:14px 22px">
  <div class="fa-tiny fa-b fa-muted" style="letter-spacing:.1em;text-transform:uppercase;margin-bottom:8px">Plan CDIO · 16 semanas</div>
  <div class="fa-row" style="gap:10px">
    <div class="fa-grow fa-card green flat" style="padding:10px 14px"><b style="font-size:19px">Concebir</b><div class="fa-small fa-muted">semanas 1–3 · alcance y requisitos</div></div>
    <div class="fa-grow fa-card green flat" style="padding:10px 14px"><b style="font-size:19px">Diseñar</b><div class="fa-small fa-muted">semanas 4–7 · arquitectura y BD</div></div>
    <div class="fa-grow fa-card green flat" style="padding:10px 14px"><b style="font-size:19px">Implementar</b><div class="fa-small fa-muted">semanas 8–11 · app, API, IA</div></div>
    <div class="fa-grow fa-card green flat" style="padding:10px 14px"><b style="font-size:19px">Operar</b><div class="fa-small fa-muted">semanas 12–16 · pruebas y sustentación</div></div>
  </div>
</div>

<!--
[1:00] Tres frases por columna.
Seguridad: contraseñas con Argon2, credenciales de acceso de 15 minutos con renovables que rotan, aislamiento por usuario incluso en la base de datos, y los reportes de error nunca incluyen correos ni contraseñas. Las claves de IA solo están en el servidor y el audio no sale del dispositivo.
Calidad: la última verificación documentada, del 5 de octubre, muestra 408 pruebas en el servidor con 89 % de cobertura y 442 en la app con 84 %. La integración continua exige lint, tipado estricto, 80 % de cobertura mínima y auditoría de dependencias.
Forma de trabajo: CDIO con Scrum, 11 ítems de backlog y 15 historias de usuario con puntos Fibonacci; el contrato de la API es OpenAPI y trabajamos con ramas y pull requests.
[Antes de presentar, volver a ejecutar las pruebas para confirmar las cifras.]
-->

---
layout: slide
eyebrow: Avance
---

# Dónde estamos: avance frente a los objetivos

<div class="fa-mt-s">
  <div class="fa-obj">
    <span class="fa-badge" style="--c:var(--fa-green)">1</span>
    <span class="fa-chip rules" style="justify-self:start">Concebir</span>
    <div class="goal">Definir alcance y requisitos</div>
    <div class="evi">Alcance, historias de usuario y backlog documentados</div>
    <span class="fa-chip ok" style="justify-self:end"><Icon name="check" :size="16" /> Hecho</span>
  </div>
  <div class="fa-obj">
    <span class="fa-badge" style="--c:var(--fa-green)">2</span>
    <span class="fa-chip rules" style="justify-self:start">Diseñar</span>
    <div class="goal">Arquitectura, modelo de datos y mockups</div>
    <div class="evi">Diagramas, esquema de base de datos y mockup interactivo</div>
    <span class="fa-chip ok" style="justify-self:end"><Icon name="check" :size="16" /> Hecho</span>
  </div>
  <div class="fa-obj">
    <span class="fa-badge" style="--c:var(--fa-ai)">3</span>
    <span class="fa-chip ai" style="justify-self:start">Implementar</span>
    <div class="goal">Captura con IA por foto, voz o texto</div>
    <div class="evi">Texto ✔ · Recibo ✔ · Voz ✔ (dictado local → texto). La precisión aún no está medida</div>
    <span class="fa-chip warn" style="justify-self:end"><Icon name="check" :size="16" /> Hecho · sin medir</span>
  </div>
  <div class="fa-obj">
    <span class="fa-badge" style="--c:var(--fa-ai)">4</span>
    <span class="fa-chip ai" style="justify-self:start">Implementar</span>
    <div class="goal">Analítica de gastos por categoría</div>
    <div class="evi">Dashboard con categorías principales, además de historial y presupuestos</div>
    <span class="fa-chip ok" style="justify-self:end"><Icon name="check" :size="16" /> Hecho</span>
  </div>
  <div class="fa-obj" style="margin-bottom:0">
    <span class="fa-badge" style="--c:var(--fa-blue)">5</span>
    <span class="fa-chip user" style="justify-self:start">Operar</span>
    <div class="goal">Validar con pruebas y encuesta de usabilidad</div>
    <div class="evi">Pruebas automatizadas ✔ · Encuesta con estudiantes de la UdeC: pendiente</div>
    <span class="fa-chip warn" style="justify-self:end"><Icon name="hourglass" :size="16" /> Parcial</span>
  </div>
</div>

<!--
[1:00] Así vamos frente a los cinco objetivos específicos de nuestra propuesta, uno por fase CDIO.
Concebir y Diseñar están hechos: alcance, requisitos, arquitectura, modelo de datos y mockups.
Implementar la captura con IA: los tres caminos —texto, recibo y voz— están construidos. Lo marcamos «sin medir» porque todavía no hemos cuantificado la precisión del modelo; lo decimos con claridad.
Implementar la analítica: el dashboard muestra categorías principales, además de historial y presupuestos.
Operar: tenemos pruebas automatizadas; lo que falta es la encuesta de usabilidad con estudiantes de la UdeC, que es parte de este objetivo y queda pendiente.
-->

---
layout: slide
eyebrow: Cierre
---

# Límites, próximos pasos y cierre

<div class="fa-g2 fa-mt-s">
  <div class="fa-card fa-zone" style="--c:var(--fa-warn)">
    <h3><span class="fa-ibox warn"><Icon name="triangle-alert" /></span>Límites actuales</h3>
    <ul class="fa-list" style="--c:var(--fa-warn)">
      <li>Precisión y tiempos de respuesta de la IA: <b>aún sin medir</b></li>
      <li>Encuesta de usabilidad: pendiente</li>
      <li>La voz depende de modelos locales de reconocimiento; faltan pruebas en dispositivos físicos</li>
      <li>Fuera de alcance: integración bancaria, sincronización sin conexión, rol administrador y agente conversacional</li>
    </ul>
  </div>
  <div class="fa-card fa-zone" style="--c:var(--fa-green)">
    <h3><span class="fa-ibox"><Icon name="rocket" /></span>Próximos pasos</h3>
    <ul class="fa-list">
      <li>Encuesta de usabilidad con estudiantes de la UdeC</li>
      <li>Conjunto de evaluación para medir la precisión de la IA</li>
      <li>Pruebas en dispositivos reales (Android y Windows)</li>
      <li>Actualizar la documentación al estado actual del producto</li>
    </ul>
  </div>
</div>
<div class="fa-card dark fa-mt" style="padding:24px 34px;display:flex;align-items:center;gap:30px">
  <div style="flex:1">
    <div style="font-size:14px;letter-spacing:.14em;text-transform:uppercase;color:#b7d45c;font-weight:700">Lo que nos diferencia</div>
    <div style="font-size:35px;font-weight:800;letter-spacing:-.02em;line-height:1.15;margin-top:6px">La IA propone · las reglas deciden · tú confirmas</div>
    <div style="font-size:18px;color:#cbd5e1;margin-top:10px;line-height:1.4">Funciona con o sin IA, los saldos salen de un libro de movimientos y la voz no sale de tu dispositivo.</div>
  </div>
  <div style="text-align:right;flex:none">
    <div style="font-size:40px;font-weight:800">¡Gracias!</div>
    <div style="font-size:22px;color:#b7d45c;font-weight:650">¿Preguntas?</div>
  </div>
</div>

<!--
[1:00] Para cerrar, con honestidad: lo que aún no sabemos y lo que sigue.
No hemos medido la precisión ni los tiempos de respuesta de la IA, la encuesta de usabilidad está pendiente, y la voz depende de modelos locales de reconocimiento y falta probarla en dispositivos físicos. Quedaron fuera de alcance la integración bancaria, la sincronización sin conexión, el rol de administrador y el agente conversacional.
Lo que sigue: la encuesta con estudiantes de la UdeC, un conjunto de evaluación para medir la IA, pruebas en dispositivos reales y poner la documentación al día.
Y lo que nos diferencia en una línea: la IA propone, las reglas deciden, tú confirmas. Funciona con o sin IA, los saldos salen de un libro de movimientos y la voz no sale de tu dispositivo.
Gracias. Quedamos atentos a sus preguntas.
-->

---
layout: slide
eyebrow: Respaldo · A
---

# Modelo de datos: el libro de movimientos

<div class="fa-row fa-mt-s" style="align-items:stretch">
  <div class="fa-card" style="flex:1.25">
    <div class="fa-tiny fa-b fa-muted" style="letter-spacing:.1em;text-transform:uppercase;margin-bottom:10px">Entidades principales</div>
    <div style="display:grid;grid-template-columns:1fr 34px 1fr 34px 1fr;grid-template-rows:auto 38px auto;align-items:center">
      <div class="fa-box" style="grid-column:1;grid-row:1;--c:var(--fa-blue)"><div class="ttl">Usuario</div><div class="sub">dueño de todo lo demás</div></div>
      <div class="fa-arrow" style="grid-column:2;grid-row:1"><Icon name="arrow-right" /></div>
      <div class="fa-box" style="grid-column:3;grid-row:1;--c:var(--fa-green)"><div class="ttl">Cuenta</div><div class="sub">moneda + saldo inicial</div></div>
      <div class="fa-arrow" style="grid-column:4;grid-row:1"><Icon name="arrow-left" /></div>
      <div class="fa-box" style="grid-column:5;grid-row:1;--c:var(--fa-green)"><div class="ttl">Movimiento</div><div class="sub">monto firmado (+ / −)</div></div>
      <div class="fa-arrow" style="grid-column:5;grid-row:2"><Icon name="arrow-up" /></div>
      <div class="fa-box" style="grid-column:5;grid-row:3;--c:var(--fa-green)"><div class="ttl">Transacción</div><div class="sub">gasto · ingreso · transferencia</div></div>
      <div class="fa-arrow" style="grid-column:4;grid-row:3"><Icon name="arrow-left" /></div>
      <div class="fa-box" style="grid-column:3;grid-row:3;--c:var(--fa-warn)"><div class="ttl">Recibo e ítems</div><div class="sub">grupo de compra</div></div>
      <div class="fa-arrow" style="grid-column:2;grid-row:3"><Icon name="arrow-left" /></div>
      <div class="fa-box" style="grid-column:1;grid-row:3;--c:var(--fa-warn)"><div class="ttl">Categoría</div><div class="sub">definida por el usuario</div></div>
    </div>
    <div class="fa-small fa-muted fa-mt">Aislamiento por usuario con llaves foráneas compuestas en la base de datos. La fuente de captura distingue manual, texto IA y recibo IA.</div>
  </div>
  <div class="fa-card green" style="flex:0.75">
    <div class="fa-tiny fa-b fa-muted" style="letter-spacing:.1em;text-transform:uppercase;margin-bottom:10px">Ejemplo ilustrativo · cuenta Nequi</div>
    <table style="width:100%;font-size:17px;border-collapse:collapse"><tbody>
      <tr><td style="padding:5px 0">Saldo inicial</td><td style="text-align:right;font-weight:700">500.000</td></tr>
      <tr><td style="padding:5px 0">Almuerzo (gasto)</td><td style="text-align:right;font-weight:700;color:var(--fa-red)">− 18.000</td></tr>
      <tr><td style="padding:5px 0">Salario (ingreso)</td><td style="text-align:right;font-weight:700;color:var(--fa-income)">+ 2.000.000</td></tr>
      <tr><td style="padding:5px 0">Transferencia a Bancolombia</td><td style="text-align:right;font-weight:700;color:var(--fa-red)">− 200.000</td></tr>
      <tr style="border-top:2px solid var(--fa-green)"><td style="padding:8px 0;font-weight:800">Saldo</td><td style="text-align:right;font-weight:800;font-size:21px">2.282.000</td></tr>
    </tbody></table>
    <div class="fa-tiny fa-muted fa-mt-s">La transferencia mueve el saldo pero no cuenta como gasto ni ingreso.</div>
  </div>
</div>

<!--
Respaldo para preguntas sobre el modelo de datos. Idea clave: no existe una columna «saldo» editable. Cada hecho financiero es una transacción con uno o más movimientos firmados; el saldo es el inicial más la suma de los movimientos. Una transferencia genera un movimiento negativo en el origen y uno positivo en el destino, por eso no distorsiona ingresos ni gastos. El aislamiento por usuario está reforzado con llaves foráneas compuestas, de modo que la propia base de datos rechaza referencias entre usuarios.
-->

---
layout: slide
eyebrow: Respaldo · B
---

# Propuesta original vs. implementación actual

<table class="fa-table fa-mt-s">
  <thead><tr><th style="width:190px">Aspecto</th><th>Propuesta original</th><th>Implementación actual</th></tr></thead>
  <tbody>
    <tr><td>Plataforma</td><td>Solo Android</td><td>Android y Windows (mismo código Dart)</td></tr>
    <tr><td>Rol de la IA</td><td>Núcleo del producto: captura primero</td><td>Capa opcional sobre un flujo manual completo</td></tr>
    <tr><td>Voz</td><td>Audio enviado al modelo en una sola llamada</td><td>Reconocimiento en el dispositivo; el texto entra al flujo de IA</td></tr>
    <tr><td>Datos</td><td>Método de pago y subcategorías</td><td>Cuentas y libro de movimientos; método de pago y subcategorías fuera del modelo</td></tr>
    <tr><td>Proveedor de IA</td><td>Gemini como opción por defecto</td><td>Gemini o DeepSeek, intercambiables por configuración</td></tr>
    <tr><td>Despliegue</td><td>Máquina virtual con Docker Compose</td><td>Docker Compose en local; CI/CD a Cloud Run configurado</td></tr>
  </tbody>
</table>

<!--
Respaldo por si algún docente compara con la propuesta radicada. Decisiones: ampliamos a Windows porque Flutter lo permite con el mismo código; la IA pasó de ser el núcleo a una capa opcional para que el dinero no dependa de una respuesta probabilística; la voz se resuelve en el dispositivo; el modelo de datos evolucionó a cuentas y libro de movimientos; y el despliegue se orientó a la nube con integración continua.
-->

---
layout: slide
eyebrow: Respaldo · C
---

# Superficie de la API: 32 rutas

<div class="fa-g4 fa-mt-s" style="gap:14px">
  <div class="fa-card" style="padding:14px 16px"><div class="fa-b">Autenticación <span class="fa-chip">5</span></div><div class="fa-tiny fa-muted fa-mt-s">registro · inicio de sesión · renovación · perfil · cierre de sesión</div></div>
  <div class="fa-card" style="padding:14px 16px"><div class="fa-b">Cuentas <span class="fa-chip">3</span></div><div class="fa-tiny fa-muted fa-mt-s">lista y alta · detalle, edición y baja · activar / desactivar</div></div>
  <div class="fa-card" style="padding:14px 16px"><div class="fa-b">Categorías <span class="fa-chip">3</span></div><div class="fa-tiny fa-muted fa-mt-s">lista y alta · detalle, edición y baja · orden</div></div>
  <div class="fa-card" style="padding:14px 16px"><div class="fa-b">Fuentes de ingreso <span class="fa-chip">2</span></div><div class="fa-tiny fa-muted fa-mt-s">lista y alta · edición y baja</div></div>
  <div class="fa-card" style="padding:14px 16px"><div class="fa-b">Gastos <span class="fa-chip">2</span></div><div class="fa-tiny fa-muted fa-mt-s">lista y alta · detalle, edición y baja</div></div>
  <div class="fa-card" style="padding:14px 16px"><div class="fa-b">Ingresos <span class="fa-chip">2</span></div><div class="fa-tiny fa-muted fa-mt-s">lista y alta · detalle, edición y baja</div></div>
  <div class="fa-card" style="padding:14px 16px"><div class="fa-b">Transferencias <span class="fa-chip">1</span></div><div class="fa-tiny fa-muted fa-mt-s">alta atómica entre cuentas propias</div></div>
  <div class="fa-card" style="padding:14px 16px"><div class="fa-b">Presupuestos <span class="fa-chip">2</span></div><div class="fa-tiny fa-muted fa-mt-s">lista y alta · detalle, edición y baja</div></div>
  <div class="fa-card" style="padding:14px 16px"><div class="fa-b">Historial <span class="fa-chip">1</span></div><div class="fa-tiny fa-muted fa-mt-s">búsqueda, filtros y paginación</div></div>
  <div class="fa-card" style="padding:14px 16px"><div class="fa-b">Dashboard <span class="fa-chip">1</span></div><div class="fa-tiny fa-muted fa-mt-s">resumen del período</div></div>
  <div class="fa-card ai" style="padding:14px 16px"><div class="fa-b">Captura de texto (IA) <span class="fa-chip ai">3</span></div><div class="fa-tiny fa-muted fa-mt-s">propuesta · lectura o descarte · confirmación</div></div>
  <div class="fa-card ai" style="padding:14px 16px"><div class="fa-b">Recibos (IA) <span class="fa-chip ai">5</span></div><div class="fa-tiny fa-muted fa-mt-s">escaneo · propuesta · lectura o descarte · confirmación · reintento</div></div>
</div>
<div class="fa-small fa-muted fa-mt">Más 2 rutas de salud (<code>live</code> y <code>ready</code>). Fuente: contrato <code>openapi.json</code> del servidor.</div>

<!--
Respaldo: el contrato OpenAPI tiene 32 rutas agrupadas por módulo. Las de IA (violeta) son solo captura de texto y recibos; todo el resto es el flujo manual y de análisis, determinista.
-->

---
layout: slide
eyebrow: Respaldo · D
---

# Backlog y alcance

<div class="fa-g2 fa-mt-s">
  <div class="fa-card">
    <h3>11 ítems de backlog</h3>
    <ul class="fa-list sm">
      <li>PB-001 Identidad y acceso</li>
      <li>PB-002 Cuentas y monedas</li>
      <li>PB-003 Catálogos del usuario (categorías, fuentes de ingreso)</li>
      <li>PB-004 Gastos y detalle opcional de recibo</li>
      <li>PB-005 Ingresos · PB-006 Transferencias</li>
      <li>PB-007 Historial y filtros · PB-008 Dashboard básico</li>
      <li>PB-009 Captura IA por texto y voz · PB-010 Captura IA por recibo</li>
      <li>PB-011 Presupuestos</li>
    </ul>
  </div>
  <div class="fa-card">
    <h3>Fuera de alcance</h3>
    <ul class="fa-list sm no">
      <li>Integración con bancos (importación automática)</li>
      <li>Inversiones y deudas</li>
      <li>División de cuentas entre personas</li>
      <li>Detección automática de suscripciones</li>
      <li>Rol administrador</li>
      <li>Agente conversacional (idea opcional, no construida)</li>
    </ul>
    <div class="fa-tiny fa-muted fa-mt">Fuente: alcance del proyecto y registro de backlog.</div>
  </div>
</div>

<!--
Respaldo: el backlog tiene 11 ítems y 15 historias de usuario. Lo que está fuera de alcance es deliberado: bancos, inversiones y deudas, división de cuentas, suscripciones, administrador y el agente conversacional.
-->
