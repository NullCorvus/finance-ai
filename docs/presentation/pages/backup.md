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
Cada hecho financiero es una transacción con uno o más movimientos firmados. El saldo corresponde al saldo inicial más la suma de esos movimientos. Una transferencia genera un movimiento negativo en el origen y uno positivo en el destino. Las llaves foráneas compuestas refuerzan el aislamiento de datos por usuario.
Fuente: modelo de datos de la presentación original y documentación de arquitectura del servidor.
-->

---
layout: slide
eyebrow: Respaldo · B
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
      <li><b>Validación:</b> los nombres propuestos se comparan con tus cuentas y categorías</li>
      <li><b>Umbral configurado ≥ 0,8:</b> revisión de un toque; menos, revisar con cuidado</li>
      <li><b>Una sola pregunta</b> corta, con opciones, solo ante duda real</li>
      <li><b>Entre tus cuentas ≠ gasto;</b> moneda dudosa: se pregunta</li>
      <li><b>Texto no confiable:</b> defensa contra prompt injection</li>
      <li><b>Respaldo:</b> segundo proveedor, límites de tiempo y uso; si cae la IA, siguen los formularios</li>
    </ul>
  </div>
</div>
<div class="fa-card soft fa-mt fa-row" style="align-items:center;gap:12px;padding:10px 18px">
  <span class="fa-ibox gray"><Icon name="cpu" /></span>
  <div style="font-size:16px;line-height:1.35"><b>Modelo:</b> LLM vía API (Gemini o DeepSeek, intercambiables). <b>Integración:</b> ingeniería de prompts y validación determinista.</div>
</div>

<!--
El servidor construye el contexto con las cuentas, categorías, fuentes de ingreso y fecha del usuario. El modelo devuelve una propuesta JSON. El sistema valida campos y referencias antes de presentarla para revisión y confirmación. El umbral de confianza configurado organiza la revisión; la persona confirma el guardado. Los límites de tiempo y el proveedor de respaldo acompañan el flujo asistido.
Fuente: flujo de captura y salvaguardas documentados en la presentación original.
-->

---
layout: slide
eyebrow: Respaldo · C
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
    <div class="fa-card green flat fa-mt" style="padding:14px 18px;display:flex;gap:12px;align-items:center"><Icon name="lock" :size="24" style="color:var(--fa-green-d)" /><span style="font-size:19px;font-weight:700">Dictado local: el flujo de IA recibe texto</span></div>
  </div>
</div>
<div class="fa-card soft fa-mt fa-row" style="align-items:center;gap:16px;padding:16px 22px">
  <span class="fa-ibox gray lg"><Icon name="circle-check-big" :size="26" /></span>
  <div style="font-size:19px;line-height:1.4">La captura termina en una propuesta que el usuario revisa y confirma.</div>
</div>

<!--
Recibos: el servidor normaliza la imagen, solicita una propuesta estructurada al modelo con visión y aplica validación de campos y aritmética. La revisión permite editar, reintentar o aceptar conservando el total impreso. Voz: el reconocimiento ocurre en el dispositivo; la transcripción alimenta el mismo flujo de captura por texto. Ambas entradas terminan en la revisión y confirmación del usuario.
Fuentes: flujo de recibos de la presentación original; finance-ai-frontend/aidlc-docs/construction/release-audit-20261017/final-validation.md, sección «Validación física final del dictado offline».
-->

---
layout: slide
eyebrow: Respaldo · D
---
# Seguridad y calidad del software

<div class="fa-g2 fa-mt">
  <div class="fa-card fa-zone" style="--c:var(--fa-ai)">
    <h3><span class="fa-ibox ai"><Icon name="shield-check" /></span>Seguridad y privacidad</h3>
    <ul class="fa-list sm" style="--c:var(--fa-ai)">
      <li>Contraseñas con Argon2</li>
      <li>Acceso de 15 min con credenciales renovables rotativas</li>
      <li>Aislamiento de los datos de cada usuario, también en la base de datos</li>
      <li>Reportes de error con datos sensibles filtrados</li>
      <li>Claves de IA en el servidor</li>
      <li>Reconocimiento de voz en el dispositivo</li>
    </ul>
  </div>
  <div class="fa-card fa-zone" style="--c:var(--fa-green)">
    <h3><span class="fa-ibox"><Icon name="badge-check" /></span>Calidad</h3>
    <div class="fa-row" style="gap:12px;margin-bottom:16px">
      <div class="fa-card soft fa-grow fa-stat" style="padding:16px"><div class="num" style="font-size:52px">415</div><div class="fa-small fa-muted" style="line-height:1.4">pruebas del servidor<br>89&nbsp;% cobertura de ramas<br>16 oct 2026</div></div>
      <div class="fa-card soft fa-grow fa-stat" style="padding:16px"><div class="num" style="font-size:52px">573</div><div class="fa-small fa-muted" style="line-height:1.4">pruebas de la app<br>Análisis estático aprobado<br>18 oct 2026</div></div>
    </div>
    <ul class="fa-list sm">
      <li>CI con lint, tipado estricto, pruebas y auditoría de dependencias</li>
      <li>Umbral de cobertura del 80&nbsp;% en integración continua</li>
    </ul>
    <div class="fa-small fa-muted fa-mt">Verificaciones documentadas: 16 y 18 oct 2026</div>
  </div>
</div>

<!--
El servidor registra 415 pruebas aprobadas, ninguna omitida y 89 % de cobertura de ramas en el punto de control del 16 oct 2026. La app registra 573 pruebas aprobadas y análisis estático aprobado el 18 oct 2026. Las fechas identifican los puntos de control documentados.
Fuentes: finance-ai-backend/aidlc-docs/construction/release-audit-20261016/backend-audit.md; finance-ai-frontend/aidlc-docs/construction/release-audit-20261017/final-validation.md.
-->
