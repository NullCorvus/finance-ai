// Exporta la presentación interactiva a PDF: una página por escena, en su estado final.
// Uso (desde esta carpeta):  node export-pdf.mjs
// Genera Finance-AI-Fusagasuga.pdf (13 principales + 6 de respaldo) y
// Finance-AI-Fusagasuga-principal.pdf (solo las 13 principales).
//
// No instala nada: reutiliza playwright-core y pdf-lib de ../presentation-pgc/node_modules
// (ejecutar allí `npm install` una vez si faltan) y Chrome instalado en Windows.
// Cada página es una imagen JPEG (1920 x 1080) de la escena con el movimiento apagado (?motion=off),
// así que el texto del PDF no se puede seleccionar.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(path.join(here, '..', 'presentation-pgc', 'package.json'));
const { chromium } = require('playwright-core');
const { PDFDocument } = require('pdf-lib');

const CHROME = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const root = path.join(here, 'interactive');
const MIME = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml' };

const server = http.createServer((req, res) => {
  const rel = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  const file = path.join(root, rel === '/' ? 'index.html' : rel);
  if (!file.startsWith(root) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const url = `http://127.0.0.1:${server.address().port}/?motion=off`;

const browser = await chromium.launch({ executablePath: CHROME, headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1.5 });
page.on('pageerror', (e) => console.error('error en la página:', e.message));
await page.goto(url, { waitUntil: 'load' });
await page.waitForTimeout(1500);

const info = await page.evaluate(() => {
  const all = Array.from(document.querySelectorAll('.scene'));
  return { total: all.length, main: all.filter((s) => !s.dataset.group).length, titles: all.map((s) => s.dataset.title) };
});

const shots = [];
for (let i = 0; i < info.total; i++) {
  const tag = i < info.main ? String(i + 1) : String.fromCharCode(97 + i - info.main);
  await page.evaluate((h) => { location.hash = h; }, `${tag}/9`);
  await page.waitForTimeout(2800);
  shots.push(await page.screenshot({ type: 'jpeg', quality: 88 }));
  console.log(`${String(i + 1).padStart(2, '0')}/${info.total}  ${info.titles[i]}`);
}
await browser.close();
server.close();

async function build(buffers, file, title) {
  const pdf = await PDFDocument.create();
  pdf.setTitle(title);
  pdf.setAuthor('Finance AI · Universidad de Cundinamarca');
  for (const b of buffers) {
    const img = await pdf.embedJpg(b);
    const pg = pdf.addPage([960, 540]);
    pg.drawImage(img, { x: 0, y: 0, width: 960, height: 540 });
  }
  fs.writeFileSync(path.join(here, file), await pdf.save());
  console.log('escrito', file, buffers.length, 'páginas');
}
await build(shots, 'Finance-AI-Fusagasuga.pdf', 'Finance AI · Sustentación Fusagasugá (principal y respaldo)');
await build(shots.slice(0, info.main), 'Finance-AI-Fusagasuga-principal.pdf', 'Finance AI · Sustentación Fusagasugá (principal)');
