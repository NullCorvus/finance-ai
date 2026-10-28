/* ============================================================
   Finance AI · motor de la presentación interactiva
   Escenas con pasos: cada elemento .rv declara en qué paso aparece
   (data-s="n"; sin atributo = al entrar). Las animaciones propias de
   cada escena viven en scenes.js y se registran con Deck.hook().

   Dos grupos de escenas:
   · principal (las diez de la exposición): → ← avanzan y retroceden
   · respaldo (data-group="backup", letras A–D): se abren con A, B, C o D
     y se cierran con Esc o R, que devuelven al punto de la exposición.
   ============================================================ */
(() => {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  // Movimiento: activo por defecto aunque el sistema pida reducirlo (es una presentación y en
  // muchos equipos las animaciones de Windows están apagadas). ?motion=off lo apaga,
  // ?motion=system respeta la preferencia del sistema y la tecla V lo alterna en vivo.
  const motionParam = (location.search.match(/[?&]motion=(\w+)/) || [])[1];
  let reduce = motionParam === 'off' || (motionParam === 'system' && matchMedia('(prefers-reduced-motion: reduce)').matches);
  document.documentElement.setAttribute('data-motion', reduce ? 'off' : 'on');

  const stage = $('#stage');
  const scenes = $$('.scene');
  const mainCount = scenes.filter((s) => !s.dataset.group).length;
  const isBackup = (i) => i >= mainCount;
  const letter = (i) => String.fromCharCode(65 + i - mainCount);
  const hooks = {};
  let cur = -1;
  let step = 0;
  let returnTo = null;

  /* ───── ritmo ─────
     fluid  (por defecto): al entrar a una escena, sus pasos se encadenan solos;
            una pulsación de → salta al siguiente paso o escena sin esperar.
     manual (tecla M):     un paso por pulsación, como diapositivas clásicas.
     tour   (tecla P):     recorrido sin manos; también cambia de escena y se
            detiene en la demostración o al abrir un respaldo.
     DWELL = milisegundos que se queda en un paso antes de pasar al siguiente. */
  const DWELL_DEFAULT = 3000;
  const DWELL = {
    's-problema': { 0: 3800, 1: 3800 },
    's-objetivo': { 0: 2400, 1: 3600, 2: 3600 },
    's-cdio': { 0: 1800, 1: 1900, 2: 1900, 3: 1900, 4: 1900 },
    's-arq': { 0: 2200, 1: 2200, 2: 2600, 3: 12500 },
    's-captura': { 0: 1800, 1: 5200, 2: 4800 },
    's-analisis': { 0: 2200, 1: 3600, 2: 4200 },
    's-seguimiento': { 0: 3400, 1: 3600 },
    's-conclusiones': { 0: 2400, 1: 3800, 2: 3800 },
    's-resp-a': { 0: 3600, 1: 2600, 2: 2600, 3: 2800 },
    's-resp-b': { 0: 2200, 1: 5600, 2: 4200, 3: 3800, 4: 4200 },
    's-resp-c': { 0: 2400, 1: 2600, 2: 3000, 3: 3400, 4: 2800 },
    's-resp-d': { 0: 3800, 1: 4200 },
  };
  const HOLD_DEFAULT = 5200; // pausa tras el último paso, solo en modo tour
  const HOLD = { 's-portada': 7000 };
  let fluid = true;
  let tour = false;
  let timer = null;
  let flashT;

  /* ───── escalado del escenario ───── */
  function fit() {
    const k = Math.min(innerWidth / 1280, innerHeight / 720);
    stage.style.setProperty('--k', k.toFixed(4));
  }
  addEventListener('resize', fit);
  fit();

  /* ───── partículas de fondo (idle) ───── */
  function particles() {
    const box = $('.ambient');
    if (!box || reduce || box.querySelector('.pt')) return;
    const colors = ['rgba(107,142,0,.55)', 'rgba(143,180,44,.6)', 'rgba(37,99,235,.4)', 'rgba(91,75,219,.4)'];
    for (let n = 0; n < 20; n++) {
      const b = document.createElement('b');
      b.className = 'pt' + (n % 3 === 0 ? ' ring' : '');
      const d = 16 + Math.random() * 18;
      b.style.cssText = `--x:${(Math.random() * 100).toFixed(1)}%;--s:${(6 + Math.random() * 16).toFixed(0)}px;--d:${d.toFixed(1)}s;--t:${(-Math.random() * d).toFixed(1)}s;--sw:${(Math.random() * 90 - 45).toFixed(0)}px;--c:${colors[n % colors.length]}`;
      box.appendChild(b);
    }
  }
  particles();

  /* ───── letras sueltas para los títulos .split ───── */
  function splitLetters(el) {
    let n = 0;
    const walk = (node) => {
      Array.from(node.childNodes).forEach((c) => {
        if (c.nodeType === 3) {
          const frag = document.createDocumentFragment();
          Array.from(c.textContent).forEach((ch) => {
            if (ch === ' ') { frag.appendChild(document.createTextNode(' ')); return; }
            const s = document.createElement('span');
            s.className = 'ch';
            s.style.setProperty('--c', n++);
            s.textContent = ch;
            frag.appendChild(s);
          });
          c.replaceWith(frag);
        } else if (c.nodeType === 1) walk(c);
      });
    };
    el.setAttribute('aria-label', el.textContent.trim());
    walk(el);
    Array.from(el.querySelectorAll('.ch')).forEach((s) => s.setAttribute('aria-hidden', 'true'));
  }
  $$('.split').forEach(splitLetters);

  /* ───── preparación de cada escena ───── */
  scenes.forEach((sc) => {
    sc._rv = $$('.rv', sc);
    const declared = +sc.dataset.steps || 0;
    const inEls = Math.max(0, ...sc._rv.map((e) => +e.dataset.s || 0));
    sc._max = Math.max(declared, inEls);
    const seen = {};
    sc._rv.forEach((e) => {
      const s = +e.dataset.s || 0;
      seen[s] = (seen[s] || 0);
      e.style.setProperty('--i', e.dataset.i !== undefined ? e.dataset.i : seen[s]);
      seen[s]++;
    });
  });

  /* ───── HUD ───── */
  const progressMain = $('#progress');
  const progressBack = $('#progress-b');
  const count = $('#count');
  const live = $('#live');
  const hint = $('#hint');
  const backBtn = $('#back');
  const playBtn = $('#play');
  const playUse = $('#play-use');
  const modeEl = $('#mode');
  const hintDefault = hint.textContent;
  const pad = (n) => String(n).padStart(2, '0');

  const segs = scenes.map((sc, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('aria-label', `Ir a «${sc.dataset.title}»`);
    b.innerHTML = (isBackup(i) ? `<span>${letter(i)}</span>` : '') + '<i></i>';
    b.addEventListener('click', (e) => { e.stopPropagation(); go(i, 0); });
    (isBackup(i) && progressBack ? progressBack : progressMain).appendChild(b);
    return b;
  });
  if (backBtn) backBtn.addEventListener('click', (e) => { e.stopPropagation(); closeBackup(); });
  if (playBtn) playBtn.addEventListener('click', (e) => { e.stopPropagation(); toggleTour(); });

  function updateHud() {
    const bk = isBackup(cur);
    document.body.dataset.mode = bk ? 'backup' : 'main';
    segs.forEach((b, i) => {
      const sc = scenes[i];
      let p = 0;
      if (i < cur) p = 1;
      else if (i === cur) p = sc._max ? (step + 1) / (sc._max + 1) : 1;
      b.lastElementChild.style.width = (p * 100).toFixed(1) + '%';
      b.lastElementChild.style.opacity = i < cur ? .55 : 1;
      if (i === cur) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current');
    });
    count.textContent = bk ? `Respaldo ${letter(cur)}` : `${pad(cur + 1)} / ${pad(mainCount)}`;
    modeEl.textContent = tour ? 'recorrido' : (fluid ? 'auto' : 'manual');
    playBtn.classList.toggle('on', tour);
    playBtn.setAttribute('aria-pressed', String(tour));
    playUse.setAttribute('href', tour ? '#i-pause' : '#i-play');
  }

  /* ───── pasos automáticos y recorrido ───── */
  function clearTimer() { clearTimeout(timer); timer = null; }

  function schedule() {
    clearTimer();
    if (!fluid && !tour) return;
    const sc = scenes[cur];
    if (step < sc._max) {
      const ms = (DWELL[sc.id] && DWELL[sc.id][step]) || DWELL_DEFAULT;
      timer = setTimeout(() => setStep(step + 1), ms);
    } else if (tour) {
      if (cur < bounds()[1]) timer = setTimeout(() => go(cur + 1, 0), HOLD[sc.id] !== undefined ? HOLD[sc.id] : HOLD_DEFAULT);
      else setTour(false); // el recorrido termina en la demostración
    }
  }

  function setTour(on) {
    tour = on;
    if (on) fluid = true;
    updateHud();
    schedule();
  }

  function flash(msg) {
    clearTimeout(flashT);
    hint.textContent = msg;
    hint.classList.add('show');
    flashT = setTimeout(() => hint.classList.remove('show'), 1900);
  }
  function toggleTour() {
    setTour(!tour);
    flash(tour ? 'Recorrido automático activado · P para pausar' : 'Recorrido en pausa');
  }
  function toggleMotion() {
    reduce = !reduce;
    document.documentElement.setAttribute('data-motion', reduce ? 'off' : 'on');
    particles();
    flash(reduce ? 'Movimiento reducido · V para activarlo' : 'Movimiento activado');
  }
  function toggleManual() {
    fluid = !fluid;
    if (!fluid) tour = false;
    updateHud();
    schedule();
    flash(fluid ? 'Pasos automáticos' : 'Modo manual: un paso por pulsación');
  }

  /* ───── navegación ───── */
  function hashFor() {
    const tag = isBackup(cur) ? letter(cur).toLowerCase() : String(cur + 1);
    return `#${tag}${step ? '/' + step : ''}`;
  }

  function setStep(s, ctx = {}) {
    const sc = scenes[cur];
    const prev = step;
    step = clamp(s, 0, sc._max);
    sc._rv.forEach((e) => e.classList.toggle('on', (+e.dataset.s || 0) <= step));
    sc.dataset.step = step;
    sc.style.setProperty('--step', step);
    const h = hooks[sc.id];
    if (h && h.step) {
      h.step(step, {
        prev,
        entering: !!ctx.entering,
        animate: ctx.animate !== undefined ? ctx.animate : step === prev + 1,
      });
    }
    updateHud();
    if (ctx.entering) live.textContent = sc.dataset.title;
    try { history.replaceState(null, '', hashFor()); } catch (_) { /* file:// restringido */ }
    if (ctx.noAuto) clearTimer(); else schedule();
  }

  function go(i, s = 0, opts = {}) {
    i = clamp(i, 0, scenes.length - 1);
    clearTimer();
    if (i === cur) { setStep(s, { animate: false, noAuto: opts.noAuto }); return; }
    if (!isBackup(i)) returnTo = null;
    const out = scenes[cur];
    if (out) {
      out.classList.remove('active');
      if (hooks[out.id] && hooks[out.id].leave) hooks[out.id].leave();
      clearTimeout(out._t);
      out._t = setTimeout(() => {
        out._rv.forEach((e) => e.classList.remove('on'));
        out.dataset.step = 0;
        out.style.setProperty('--step', 0);
        if (hooks[out.id] && hooks[out.id].reset) hooks[out.id].reset();
      }, 720);
    }
    const sc = scenes[i];
    clearTimeout(sc._t);
    cur = i;
    step = 0;
    sc.classList.add('active');
    document.body.dataset.theme = sc.dataset.theme || 'light';
    document.body.dataset.scene = sc.id;
    if (hooks[sc.id] && hooks[sc.id].enter) hooks[sc.id].enter();
    // dos cuadros: la escena entra desde su estado oculto y el revelado se anima
    requestAnimationFrame(() => requestAnimationFrame(() => setStep(s, { entering: true, animate: s === 0, noAuto: opts.noAuto })));
  }

  function bounds() { return isBackup(cur) ? [mainCount, scenes.length - 1] : [0, mainCount - 1]; }

  function next() {
    const sc = scenes[cur];
    const hi = bounds()[1];
    if (step < sc._max) setStep(step + 1);
    else if (cur < hi) go(cur + 1, 0);
  }
  function prev() {
    const lo = bounds()[0];
    if (tour) setTour(false); // retroceder es tomar el control: el recorrido se pausa
    if (step > 0) setStep(step - 1, { animate: false, noAuto: true });
    else if (cur > lo) go(cur - 1, scenes[cur - 1]._max, { noAuto: true });
  }

  /* respaldo técnico: se abre desde cualquier punto y regresa al mismo punto */
  function openBackup(n) {
    const target = mainCount + n;
    if (target >= scenes.length) return;
    if (tour) setTour(false); // durante una pregunta, nada avanza solo hacia otra escena
    if (!isBackup(cur)) returnTo = { i: cur, s: step };
    go(target, 0);
  }
  function closeBackup() {
    if (!isBackup(cur)) return;
    const r = returnTo || { i: mainCount - 1, s: 0 };
    returnTo = null;
    go(r.i, r.s);
  }

  /* ───── entrada del usuario ───── */
  function dismissHint() { hint.classList.remove('show'); }
  addEventListener('keydown', (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const k = e.key;
    if (['ArrowRight', 'ArrowDown', 'PageDown', ' ', 'Enter'].includes(k)) { e.preventDefault(); next(); }
    else if (['ArrowLeft', 'ArrowUp', 'PageUp', 'Backspace'].includes(k)) { e.preventDefault(); prev(); }
    else if (k === 'Home') { e.preventDefault(); go(isBackup(cur) ? mainCount : 0, 0); }
    else if (k === 'End') { e.preventDefault(); go(isBackup(cur) ? scenes.length - 1 : mainCount - 1, 0); }
    else if (k === 'f' || k === 'F') {
      if (document.fullscreenElement) document.exitFullscreen(); else document.documentElement.requestFullscreen && document.documentElement.requestFullscreen();
    } else if (k === 'p' || k === 'P') toggleTour();
    else if (k === 'm' || k === 'M') toggleManual();
    else if (k === 'v' || k === 'V') toggleMotion();
    else if (/^[0-9]$/.test(k)) {
      const n = k === '0' ? 9 : +k - 1;
      if (n < mainCount) go(n, 0);
    } else if (/^[a-dA-D]$/.test(k)) openBackup(k.toLowerCase().charCodeAt(0) - 97);
    else if (k === 'Escape' || k === 'r' || k === 'R') closeBackup();
    else return;
    dismissHint();
  });

  addEventListener('click', (e) => {
    if (e.target.closest('a, button')) return;
    next();
    dismissHint();
  });

  let tx = 0, ty = 0;
  addEventListener('touchstart', (e) => { tx = e.touches[0].clientX; ty = e.touches[0].clientY; }, { passive: true });
  addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - tx, dy = e.changedTouches[0].clientY - ty;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) { dx < 0 ? next() : prev(); }
  }, { passive: true });

  // cursor discreto cuando no se usa
  let cursorT;
  addEventListener('mousemove', () => {
    document.body.classList.remove('hide-cursor');
    clearTimeout(cursorT);
    cursorT = setTimeout(() => document.body.classList.add('hide-cursor'), 2600);
  });

  /* ───── arranque: #3, #3/2, #a o #b/2 ───── */
  function fromHash() {
    const m = location.hash.match(/^#(?:(\d+)|([a-dA-D]))(?:\/(\d+))?$/);
    if (!m) return [0, 0];
    const s = +m[3] || 0;
    if (m[2]) return [Math.min(mainCount + m[2].toLowerCase().charCodeAt(0) - 97, scenes.length - 1), s];
    return [clamp(+m[1] - 1, 0, mainCount - 1), s];
  }
  addEventListener('hashchange', () => {
    const [i, s] = fromHash();
    if (i !== cur || s !== step) go(i, s);
  });

  /* ───── API para scenes.js ───── */
  window.Deck = {
    $, $$, sleep, clamp, reduce,
    hook(id, obj) { hooks[id] = obj; },
    // contador animado; `from` permite pasar de un valor a otro (saldo acumulado)
    count(el, to, ms = 1300, fmt = (n) => new Intl.NumberFormat('es-CO').format(Math.round(n)), from = 0) {
      cancelAnimationFrame(el._raf);
      if (!ms || reduce) { el.textContent = fmt(to); return; }
      const t0 = performance.now();
      const tick = (t) => {
        const p = clamp((t - t0) / ms, 0, 1);
        el.textContent = fmt(from + (to - from) * (1 - Math.pow(1 - p, 3)));
        if (p < 1) el._raf = requestAnimationFrame(tick);
      };
      el._raf = requestAnimationFrame(tick);
    },
  };

  window.addEventListener('load', () => {
    const [i, s] = fromHash();
    go(i, s);
    if (i === 0 && s === 0) {
      setTimeout(() => { hint.textContent = hintDefault; hint.classList.add('show'); }, 2400);
      setTimeout(dismissHint, 9000);
    }
    cursorT = setTimeout(() => document.body.classList.add('hide-cursor'), 4000);
  });
})();
