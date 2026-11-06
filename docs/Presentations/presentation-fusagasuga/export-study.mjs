/* Genera Finance-AI-guia-de-estudio-aspectos-1-6-7.pdf: guía de lectura (no de exposición)
   con las escenas de los aspectos 1, 6 y 7, en páginas del tamaño de un celular.
   Uso (desde esta carpeta):  node export-study.mjs
   Lee las notas de interactive/index.html, así que cualquier cambio en las notas se refleja al regenerar.
   Reutiliza playwright-core de ../presentation-pgc/node_modules y Chrome instalado. */
import { createRequire } from 'node:module';
import { pathToFileURL, fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';

const here = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(path.join(here, '..', 'presentation-pgc', 'package.json'));
const { chromium } = require('playwright-core');
const chrome = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const indexUrl = pathToFileURL(path.join(here, 'interactive', 'index.html')).href;
const out = path.join(here, 'Finance-AI-guia-de-estudio-aspectos-1-6-7.pdf');

const MINE = ['s-portada', 's-problema', 's-justif', 's-objetivo', 's-concl', 's-aportes', 's-demo'];

const browser = await chromium.launch({ executablePath: chrome, headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
await page.goto(indexUrl + '?motion=off');
await page.addStyleTag({ content: '#hint{display:none!important}' });
await page.waitForTimeout(800);

const data = await page.evaluate((ids) => {
  const all = [...document.querySelectorAll('.scene:not([data-group])')];
  return ids.map((id) => {
    const sc = document.getElementById(id);
    const n = all.indexOf(sc) + 1;
    const nt = sc.querySelector('template.notes');
    const items = [...nt.content.querySelectorAll('p')].map((p) => ({ cls: p.className, step: p.dataset.s ?? null, html: p.innerHTML }));
    return {
      id, n,
      title: sc.dataset.title,
      aspect: sc.dataset.aspect,
      eyebrow: (sc.querySelector('.eyebrow') || {}).textContent || '',
      crit: [...sc.querySelectorAll('.crit .cr')].map((c) => c.textContent.replace(/\s+/g, ' ').trim()),
      time: nt.dataset.time || '',
      key: nt.dataset.key || '',
      items,
    };
  });
}, MINE);

// miniaturas con el estado final de cada escena
for (const d of data) {
  await page.evaluate((h) => { location.hash = h; }, d.n + '/9');
  await page.waitForTimeout(1700);
  const buf = await page.screenshot({ type: 'jpeg', quality: 82 });
  d.img = 'data:image/jpeg;base64,' + buf.toString('base64');
}

const ASPECT = {
  0: 'Aspecto 7 · Metodología y socialización (abre la exposición)',
  1: 'Aspecto 1 · Organización',
  6: 'Aspecto 6 · Conclusiones',
  7: 'Aspecto 7 · Metodología y socialización',
};
const mins = (t) => { const [m, s] = (t || '0:0').split(':').map(Number); return m * 60 + (s || 0); };
const fmt = (s) => Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
const groups = { 1: [], 6: [], 7: [] };
data.forEach((d) => { const g = d.aspect === '0' ? 7 : +d.aspect; groups[g].push(d); });
const total = data.reduce((a, d) => a + mins(d.time), 0);

const sections = data.map((d) => {
  const step = (it, i) => `<div class="say"><span class="no">${i + 1}</span><p>${it.html}</p></div>`;
  const say = d.items.filter((it) => it.cls === '' && it.step !== null);
  const eval_ = d.items.filter((it) => it.cls === 'eval');
  const tip = d.items.filter((it) => it.cls === 'tip');
  const tr = d.items.filter((it) => it.cls === 'tr');
  return `
<section class="sc">
  <p class="kick">${d.n} · ${ASPECT[d.aspect]}${d.time ? ' · ' + d.time : ''}</p>
  <h2>${d.title}</h2>
  ${d.crit.length ? `<p class="crit">${d.crit.join(' · ')}</p>` : ''}
  <img class="shot" src="${d.img}" alt="">
  ${d.key ? `<p class="idea"><b>La idea:</b> ${d.key}</p>` : ''}
  ${eval_.map((e) => `<div class="eval"><b>Evalúan</b><p>${e.html}</p></div>`).join('')}
  <h3>Lo que dices</h3>
  <p class="how" style="margin-top:0">Cada número es un párrafo del guion; van al ritmo de lo que aparece en pantalla.</p>
  ${say.map(step).join('')}
  ${tip.map((t) => `<div class="tip"><b>Ojo</b><p>${t.html}</p></div>`).join('')}
  ${tr.map((t) => `<p class="tr"><b>Para pasar a la siguiente</b><br>${t.html}</p>`).join('')}
</section>`;
}).join('\n');

const rows = data.map((d) => `<tr><td>${d.n}</td><td>${d.title}</td><td>${d.time || ''}</td></tr>`).join('');
const html = `<!doctype html><html lang="es"><head><meta charset="utf-8"><title>Guía de estudio · aspectos 1, 6 y 7</title>
<style>
@page { size: 105mm 187mm; margin: 0; }
* { box-sizing: border-box; }
html, body { margin: 0; }
body { font-family: 'Segoe UI', system-ui, Arial, sans-serif; font-size: 13.4px; line-height: 1.48; color: #1b2430; background: #fff; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.cover, .sc { padding: 9mm 7mm 8mm; }
.sc { break-before: page; }
h1, h2 { font-family: Georgia, 'Times New Roman', serif; color: #00482b; margin: 0; line-height: 1.12; }
h1 { font-size: 27px; } h2 { font-size: 24px; margin-bottom: 6px; }
h3 { margin: 14px 0 6px; font-size: 11px; letter-spacing: .12em; text-transform: uppercase; color: #5b6b5f; }
.bar { height: 5px; width: 60px; background: #daaa00; border-radius: 3px; margin: 0 0 10px; }
.kick { margin: 0 0 4px; font-size: 10.5px; font-weight: 800; letter-spacing: .1em; text-transform: uppercase; color: #8a6800; }
.crit { margin: 0 0 8px; font-size: 11.5px; font-weight: 700; color: #00482b; }
.shot { display: block; width: 100%; border-radius: 8px; border: 1px solid #d9dde3; margin: 6px 0 10px; }
.idea { margin: 0 0 8px; padding: 8px 10px; border-radius: 8px; background: #eef3e4; color: #1f3a12; }
.eval { margin: 8px 0; padding: 8px 10px; border-left: 4px solid #7c6cf0; border-radius: 0 8px 8px 0; background: #efecff; break-inside: avoid; }
.eval b { display: block; font-size: 10.5px; letter-spacing: .1em; text-transform: uppercase; color: #4f3fd6; margin-bottom: 2px; }
.eval p, .tip p { margin: 0; font-size: 12.4px; }
.say { display: flex; gap: 8px; margin: 0 0 8px; break-inside: avoid; }
.say .no { flex: none; width: 20px; height: 20px; margin-top: 2px; border-radius: 50%; background: #00482b; color: #fff; font-size: 11px; font-weight: 800; display: grid; place-items: center; }
.say p { margin: 0; font-size: 14px; line-height: 1.5; }
.say p b { color: #00482b; }
.tip { margin: 10px 0 8px; padding: 8px 10px; border-left: 4px solid #daaa00; border-radius: 0 8px 8px 0; background: #fff6d6; break-inside: avoid; }
.tip b { display: block; font-size: 10.5px; letter-spacing: .1em; text-transform: uppercase; color: #8a6800; margin-bottom: 2px; }
.tr { margin: 10px 0 0; padding: 8px 10px; border-radius: 8px; background: #e6f1ea; font-style: italic; color: #00482b; break-inside: avoid; }
.tr b { font-style: normal; font-size: 10.5px; letter-spacing: .1em; text-transform: uppercase; }
table { width: 100%; border-collapse: collapse; margin: 6px 0 12px; font-size: 12.5px; }
td { padding: 5px 4px; border-bottom: 1px solid #e3e6ea; }
td:first-child { width: 22px; font-weight: 800; color: #00482b; } td:last-child { text-align: right; white-space: nowrap; color: #5b6b5f; }
.how { margin: 8px 0; padding: 8px 10px; border-radius: 8px; background: #f3f5f8; font-size: 12.4px; }
.dot { display: inline-block; width: 9px; height: 9px; border-radius: 50%; background: #7c6cf0; margin-right: 5px; }
</style></head><body>
<section class="cover">
  <p class="kick">Finance AI · Sustentación de Gestión del Conocimiento</p>
  <h1>Guía de estudio</h1>
  <div class="bar" style="margin-top:10px"></div>
  <p><span class="dot"></span><b>Tus aspectos:</b> 1 Organización, 6 Conclusiones y 7 Metodología y socialización (los morados de la barra).</p>
  <p class="how">Para <b>leer</b>, no para presentar. Cada escena trae la captura final, los puntos que evalúa el jurado (con las palabras de la plantilla), lo que dices y lo que debes cuidar.</p>
  <h3>Tu parte en orden</h3>
  <table>${rows}<tr><td></td><td><b>Total, con el cierre y la demo</b></td><td><b>${fmt(total)}</b></td></tr></table>
  <h3>Lo que evalúa cada aspecto (plantilla)</h3>
  <div class="eval"><b>1 · Organización</b><p>Contexto claro; problema bien definido; importancia del proyecto; objetivos medibles y alineados con el problema. 1.1 Introducción (1,0) · 1.2 Planteamiento del problema (1,5) · 1.3 Justificación (1,0) · 1.4 Objetivos (1,5).</p></div>
  <div class="eval"><b>6 · Conclusiones</b><p>Que cada conclusión responda a un objetivo y que se vean los aportes. 6.1 Coherencia con el desarrollo de los objetivos (3,0) · 6.2 Aportes (2,0).</p></div>
  <div class="eval"><b>7 · Metodología y socialización</b><p>Se califica la forma de presentar. 7.1 Presentación personal (1,0) · 7.2 Dominio de grupo (1,0) · 7.3 Presentación de diapositivas (1,0) · 7.4 Manejo verbal y corporal (2,0).</p></div>
  <p class="how">Cada aspecto se califica de 0,5 a 5,0. Las cifras de las notas llevan su fecha de verificación: confírmalas antes de exponer.</p>
</section>
${sections}
</body></html>`;

fs.writeFileSync(path.join(here, '.study-preview.html'), html);
const p2 = await browser.newPage({ viewport: { width: 400, height: 700 } });
await p2.setContent(html, { waitUntil: 'load' });
await p2.waitForTimeout(500);
await p2.pdf({ path: out, width: '105mm', height: '187mm', printBackground: true, margin: { top: '0', right: '0', bottom: '0', left: '0' } });
if (process.env.PREVIEW_PNG) await p2.screenshot({ path: process.env.PREVIEW_PNG, fullPage: true });
await browser.close();
fs.unlinkSync(path.join(here, '.study-preview.html'));
console.log('escrito', path.basename(out), (fs.statSync(out).size / 1e6).toFixed(1) + ' MB');
