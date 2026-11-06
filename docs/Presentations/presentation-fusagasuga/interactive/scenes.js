/* ============================================================
   scenes.js · animaciones propias de cada escena
   Cada hook recibe step(n, {animate, prev}) y debe dejar la escena en el
   estado del paso n. Con animate=true puede reproducir la transición hacia
   ese paso; con animate=false pinta el estado final de inmediato.
   Todo se busca de forma perezosa ($ dentro de step) para que una escena
   ausente nunca rompa las demás.
   ============================================================ */
(() => {
  'use strict';
  const { $, $$, sleep, count } = Deck;
  const dec1 = (n) => n.toFixed(1).replace('.', ',');
  const es = (n) => new Intl.NumberFormat('es-CO').format(Math.round(n));

  /* ───────── 2 · contexto: la cifra cuenta hasta 66,6 ───────── */
  Deck.hook('s-problema', {
    step(n, ctx) {
      const g = $('#s-problema .gauge');
      if (g) { g.classList.toggle('nt', !(ctx.animate && n === 0)); g.classList.add('on'); }
      count($('#n666'), 66.6, ctx.animate && n === 0 ? 1700 : 0, dec1);
    },
    reset() {
      const g = $('#s-problema .gauge');
      if (g) { g.classList.add('nt'); g.classList.remove('on'); }
      count($('#n666'), 0, 0, dec1);
    },
  });

  /* ───────── 4 · objetivos: lectura guiada y recorrido CDIO ───────── */
  Deck.hook('s-objetivo', {
    step(n) {
      const sc = $('#s-objetivo');
      const t = $('.og-t', sc);
      t.classList.toggle('dim', n < 3);
      $$('.seg', t).forEach((s) => {
        const k = +s.dataset.k;
        s.classList.toggle('lit', n < 3 && k === n);
        s.classList.toggle('done', n >= 3 || k < n);
      });
      const lit = n >= 5 ? 5 : n >= 4 ? 4 : n >= 3 ? 2 : 0;
      $$('.cd', sc).forEach((c) => c.classList.toggle('lit', +c.dataset.k <= lit));
      $('.cdio', sc).style.setProperty('--p', lit ? (lit - 1) / 4 : 0);
    },
  });

    /* ───────── 6 · análisis: el anillo se dibuja y el total cuenta ───────── */
  const Ring = (() => {
    let raf = 0;
    const set = (r) => { const d = $('#donut'); if (d) d.style.setProperty('--r', r.toFixed(3)); };
    return {
      draw(ms) {
        cancelAnimationFrame(raf);
        if (!ms) { set(1); return; }
        const t0 = performance.now();
        const tick = (t) => {
          const p = Math.min(1, (t - t0) / ms);
          set(1 - Math.pow(1 - p, 3));
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      reset() { cancelAnimationFrame(raf); set(0); },
    };
  })();
  Deck.hook('s-analisis', {
    step(n, ctx) {
      const anim = ctx.animate && n === 0;
      Ring.draw(anim ? 1500 : 0);
      count($('#n442'), 442000, anim ? 1500 : 0, es);
    },
    reset() { Ring.reset(); count($('#n442'), 0, 0, es); },
  });

  /* ───────── 9 · seguridad: las capas del escudo se encienden una a una ───────── */
  Deck.hook('s-seg', {
    step(n) {
      const sc = $('#s-seg');
      const lit = n + 1; // paso 0 → capa 1 … paso 3 → capa 4
      $$('.sh', sc).forEach((p) => {
        const k = +p.getAttribute('class').match(/l(\d)/)[1]; // l1 = centro … l4 = exterior
        p.classList.toggle('on', k <= lit);
      });
      $$('.sh-l li', sc).forEach((li, i) => li.classList.toggle('on', i < lit));
    },
  });

    /* ───────── 10 · gestión del conocimiento: la bitácora cuenta hasta ~300 ───────── */
  const approx = (n) => '≈' + es(n);
  Deck.hook('s-gc', {
    step(n, ctx) {
      count($('#n300'), n >= 2 ? 300 : 0, ctx.animate && n === 2 ? 1500 : 0, approx);
    },
    reset() { count($('#n300'), 0, 0, approx); },
  });

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

  /*@@MORE@@*/
})();
