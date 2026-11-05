/* ============================================================
   scenes.js · animaciones propias de cada escena
   Cada hook recibe step(n, {animate}) y debe dejar la escena en el
   estado del paso n. Si animate es true, puede reproducir la transición
   hacia ese paso; si es false, debe pintar el estado final de inmediato.
   ============================================================ */
(() => {
  'use strict';
  const { $, $$, sleep, count } = Deck;

  /* ───────── 3 · Objetivo general: lectura guiada ───────── */
  Deck.hook('s-objetivo', {
    step(n) {
      const sc = $('#s-objetivo');
      $('.obj', sc).classList.toggle('has-lit', n >= 1);
      $$('.seg', sc).forEach((s) => {
        const k = +s.dataset.k;
        s.classList.toggle('lit', k === n);
        s.classList.toggle('done', k < n);
      });
      $$('.ob-card', sc).forEach((c, i) => c.classList.toggle('cur', i + 1 === n));
    },
  });

  /* ───────── 4 · CDIO: el recorrido avanza nodo por nodo ───────── */
  Deck.hook('s-cdio', {
    step(n) {
      const sc = $('#s-cdio');
      $$('.col', sc).forEach((c, i) => {
        c.classList.toggle('lit', i < n);
        c.classList.toggle('cur', i === n - 1);
      });
      $('.cdio', sc).style.setProperty('--p', n >= 1 ? (n - 1) / 4 : 0);
    },
  });

  /* ───────── 5 · Arquitectura: recorrido narrado de una captura ───────── */
  const Arch = (() => {
    const sc = $('#s-arq');
    const pk = $('#packet');
    const capEl = $('#cap');
    const dots = $$('.dots i', sc);
    const checks = $$('.vchk li', sc);
    const phone = $('.mini-phone', sc);
    const node = { flutter: $('#n-flutter'), api: $('#n-api'), db: $('#n-db'), ai: $('#n-ai') };
    const caps = [
      'La persona escribe una frase',
      'FastAPI pide al modelo que la interprete',
      'El modelo devuelve una propuesta',
      'FastAPI valida campos, cuentas y categorías',
      'La persona revisa y confirma',
      'Solo entonces se guarda en PostgreSQL',
    ];
    const idle = 'Una captura recorre el sistema';
    let run = 0;

    const pos = (p) => `translate(${p[0]}px, ${p[1]}px) translate(-50%, -50%)`;
    const hot = (k, on = true) => node[k].classList.toggle('hot', on);
    const clearHot = () => Object.keys(node).forEach((k) => hot(k, false));

    function setDots(i) {
      dots.forEach((d, j) => { d.classList.toggle('dn', j < i); d.classList.toggle('on', j === i); });
    }
    async function setCap(i, my) {
      setDots(i);
      capEl.classList.add('sw');
      await sleep(180);
      if (my !== undefined && my !== run) return;
      capEl.textContent = caps[i];
      capEl.classList.remove('sw');
    }
    async function hop(my, label, from, to, ms = 950, cls = '') {
      pk.className = 'packet ' + cls;
      pk.textContent = label;
      pk.style.transition = 'none';
      pk.style.transform = pos(from);
      pk.style.opacity = '0';
      void pk.offsetWidth;
      pk.style.transition = `transform ${ms}ms cubic-bezier(.55,.05,.25,1), opacity .25s`;
      pk.style.opacity = '1';
      await sleep(170);
      if (my !== run) return false;
      pk.style.transform = pos(to);
      await sleep(ms);
      if (my !== run) return false;
      pk.style.opacity = '0';
      await sleep(240);
      return my === run;
    }

    function reset() {
      run++;
      pk.style.opacity = '0';
      clearHot();
      phone.classList.remove('pressed');
      checks.forEach((c) => c.classList.remove('ok'));
      setDots(-1);
      capEl.textContent = idle;
      capEl.classList.remove('sw');
    }
    function final() {
      run++;
      pk.style.opacity = '0';
      clearHot();
      phone.classList.remove('pressed');
      checks.forEach((c) => c.classList.add('ok'));
      setDots(6);
      capEl.textContent = caps[5];
      capEl.classList.remove('sw');
    }

    async function play() {
      reset();
      const my = run;
      const ok = () => my === run;
      await sleep(350); if (!ok()) return;

      setCap(0, my); hot('flutter');
      await sleep(900); if (!ok()) return;
      if (!(await hop(my, '«Almuerzo 18 mil con Nequi»', [215, 165], [445, 165]))) return;

      hot('flutter', false); hot('api'); setCap(1, my);
      await sleep(250); if (!ok()) return;
      if (!(await hop(my, 'texto + cuentas y categorías', [690, 255], [850, 255], 1000, 'ai'))) return;

      hot('api', false); hot('ai'); setCap(2, my);
      await sleep(500); if (!ok()) return;
      if (!(await hop(my, 'propuesta', [850, 255], [690, 255], 1000, 'ai'))) return;

      hot('ai', false); hot('api'); setCap(3, my);
      for (const li of checks) { await sleep(560); if (!ok()) return; li.classList.add('ok'); }
      await sleep(600); if (!ok()) return;

      hot('api', false); hot('flutter'); setCap(4, my);
      if (!(await hop(my, 'propuesta validada', [445, 165], [215, 165]))) return;
      phone.classList.add('pressed');
      await sleep(900); if (!ok()) return;
      phone.classList.remove('pressed');

      hot('flutter', false); setCap(5, my);
      if (!(await hop(my, 'confirmación', [215, 165], [445, 165], 800))) return;
      hot('api');
      if (!(await hop(my, 'movimiento', [690, 75], [850, 75], 900))) return;
      hot('api', false); hot('db');
      setDots(6);
      await sleep(1400); if (!ok()) return;
      hot('db', false);
    }

    return { reset, final, play, cancel() { run++; pk.style.opacity = '0'; } };
  })();

  Deck.hook('s-arq', {
    step(n, ctx) {
      if (n === 3) { ctx.animate ? Arch.play() : Arch.final(); }
      else if (n >= 4) Arch.final();
      else Arch.reset();
    },
    leave() { Arch.cancel(); },
    reset() { Arch.reset(); },
  });

  /* ───────── 6 · Captura asistida: de una frase a un movimiento ───────── */
  const Cap = (() => {
    const sc = $('#s-captura');
    const typed = $('#typed');
    const chips = $$('.fchip', sc);
    const okBox = $('#capok');
    const ring = $('#ring');
    const cv1 = $('.cv1', sc);
    const cv2 = $('.cv2', sc);
    const items = $$('.steps3 li', sc);
    const phrase = 'Almuerzo 18 mil con Nequi';
    const tokens = '<mark class="t-desc">Almuerzo</mark> <mark class="t-amt">18 mil</mark> con <mark class="t-acc">Nequi</mark>';
    // posición (arriba %, alto %) de cada fila en la captura real de 1120 × 2000
    const rows = [[20.0, 3.4], [23.5, 3.4], [27.0, 3.3], [30.4, 3.4], [33.8, 3.3]];
    const button = [38.3, 4.8, 11.9, 33.7];
    let run = 0;

    function R(top, h, left = 11.4, w = 78.2) {
      ring.style.top = top + '%';
      ring.style.height = h + '%';
      ring.style.left = left + '%';
      ring.style.width = w + '%';
      ring.classList.add('show');
    }
    const ringOff = () => { ring.classList.remove('show', 'pulse'); };
    const chipsOn = () => chips.forEach((c) => c.classList.add('on'));
    const chipsOff = () => chips.forEach((c) => c.classList.remove('on'));
    const okOff = () => okBox.classList.remove('on');

    async function typeIt(my) {
      typed.textContent = '';
      await sleep(350);
      for (let i = 1; i <= phrase.length; i++) {
        if (my !== run) return false;
        typed.textContent = phrase.slice(0, i);
        await sleep(52 + Math.random() * 38);
      }
      await sleep(320);
      if (my !== run) return false;
      typed.innerHTML = tokens;
      return true;
    }

    function resetAll() {
      run++;
      typed.textContent = '';
      cv1.classList.remove('up'); cv2.classList.remove('up');
      chipsOff(); okOff(); ringOff();
      items.forEach((li) => li.classList.remove('act', 'dn'));
    }

    function step(n, ctx) {
      const my = ++run;
      items.forEach((li, i) => { li.classList.toggle('act', i + 1 === n); li.classList.toggle('dn', i + 1 < n); });
      ringOff();

      if (n === 0) {
        typed.textContent = '';
        cv1.classList.remove('up'); cv2.classList.remove('up');
        chipsOff(); okOff();
        return;
      }
      if (n === 1) {
        chipsOff(); okOff(); cv2.classList.remove('up');
        if (ctx.animate) {
          cv1.classList.remove('up');
          typeIt(my).then((done) => { if (done) cv1.classList.add('up'); });
        } else { typed.innerHTML = tokens; cv1.classList.add('up'); }
        return;
      }
      typed.innerHTML = tokens;
      cv1.classList.add('up'); cv2.classList.add('up');
      if (n === 2) {
        okOff();
        if (ctx.animate) {
          chipsOff();
          (async () => {
            await sleep(450);
            for (let i = 0; i < chips.length; i++) {
              if (my !== run) return;
              chips[i].classList.add('on');
              R(rows[i][0], rows[i][1]);
              await sleep(560);
            }
            if (my !== run) return;
            await sleep(350);
            if (my === run) ringOff();
          })();
        } else chipsOn();
        return;
      }
      // n === 3
      chipsOn();
      okBox.classList.add('on');
      R(button[0], button[1], button[2], button[3]);
      ring.classList.add('pulse');
    }

    return { step, reset: resetAll, cancel() { run++; } };
  })();

  Deck.hook('s-captura', { step: Cap.step, leave: Cap.cancel, reset: Cap.reset });

  /* ───────── 7 · Análisis: total que cuenta y anillo que se dibuja ───────── */
  Deck.hook('s-analisis', {
    step(n, ctx) {
      const t = $('#total');
      if (n >= 1) count(t, 442000, ctx.animate && n === 1 ? 1500 : 0);
      else count(t, 0, 0);
    },
    reset() { count($('#total'), 0, 0); },
  });

  /* ============================================================
     Respaldo técnico (A–D)
     ============================================================ */

  /* ───────── A · libro de movimientos: el saldo se va armando ───────── */
  const LEDGER = [0, 500000, 482000, 2482000, 2282000];
  Deck.hook('s-resp-a', {
    step(n, ctx) {
      const sc = $('#s-resp-a');
      $$('.lrow', sc).forEach((r) => r.classList.toggle('cur', +r.dataset.s === n));
      // si avanza un paso, el saldo pasa del valor anterior al nuevo; si salta, lo pinta directo
      count($('#ledger-total'), LEDGER[n], ctx.animate ? 900 : 0, undefined, LEDGER[ctx.prev] || 0);
    },
    reset() { count($('#ledger-total'), 0, 0); },
  });

  /* ───────── B · de palabras a una propuesta: el mensaje recorre el flujo ───────── */
  const Pipe = (() => {
    const sc = $('#s-resp-b');
    const stages = $$('.ps', sc);
    const arrows = $$('.pa', sc);
    let run = 0;
    const paint = (k) => {
      stages.forEach((s, i) => s.classList.toggle('lit', i <= k));
      arrows.forEach((a, i) => a.classList.toggle('lit', i < k));
    };
    async function play() {
      const my = ++run;
      paint(-1);
      await sleep(450);
      for (let i = 0; i < stages.length; i++) {
        if (my !== run) return;
        paint(i);
        await sleep(i < stages.length - 1 ? 820 : 300);
      }
    }
    return { paint, play, cancel() { run++; } };
  })();

  Deck.hook('s-resp-b', {
    step(n, ctx) {
      const sc = $('#s-resp-b');
      // el anclaje encuentra «Nequi» y «Bancolombia» entre las cuentas reales
      $$('.tk.tm', sc).forEach((t) => t.classList.toggle('match', n >= 3));
      if (n === 1 && ctx.animate) Pipe.play();
      else { Pipe.cancel(); Pipe.paint(n >= 1 ? 4 : -1); }
    },
    leave() { Pipe.cancel(); },
    reset() { Pipe.cancel(); Pipe.paint(-1); },
  });

  /* ───────── C · recibos y voz: el paso activo late ───────── */
  Deck.hook('s-resp-c', {
    step(n) {
      $$('.stl li', $('#s-resp-c')).forEach((li) => li.classList.toggle('cur', +li.dataset.s === n));
    },
  });

  /* ───────── D · seguridad y calidad: contadores de pruebas ───────── */
  Deck.hook('s-resp-d', {
    step(n, ctx) {
      const a = $('#n415');
      const b = $('#n573');
      const ms = ctx.animate && n === 1 ? 1300 : 0;
      count(a, n >= 1 ? 415 : 0, ms);
      count(b, n >= 1 ? 573 : 0, ms);
    },
    reset() { count($('#n415'), 0, 0); count($('#n573'), 0, 0); },
  });
})();
