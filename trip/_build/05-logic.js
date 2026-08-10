"use strict";

const KEY = "fat_trip_v1";
const DB_NAME = "fat-trip-db";
const DB_STORE = "clips";

let state = { answers: {}, notes: "", clipMeta: {}, depthAnswers: {} };
let DB = null;
let dbPromise = null;
let lastSave = Date.now();
let saveTimer = null;
let toastTimer = null;

let recorder = null;
let recQid = null;
let recStart = 0;
let recChunks = [];
let recTimer = null;
let recMime = "";

const urlMap = new Map();

function totalQuestions() {
  return SECTIONS.reduce(function (n, s) { return n + s.questions.length; }, 0);
}

function esc(str) {
  return String(str == null ? "" : str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function pad2(n) { return (n < 10 ? "0" : "") + n; }

function toast(msg) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.style.display = "block";
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function () { t.style.display = "none"; }, 6000);
}

function showWarn() {
  const w = document.getElementById("storageWarn");
  if (w) w.style.display = "block";
}

function storageCheck() {
  try {
    localStorage.setItem("fat_trip_test", "1");
    localStorage.removeItem("fat_trip_test");
  } catch (e) {
    showWarn();
  }
}

function loadState() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const d = JSON.parse(raw);
      if (d && typeof d === "object") {
        state = {
          answers: d.answers || {},
          notes: d.notes || "",
          clipMeta: d.clipMeta || {},
          depthAnswers: d.depthAnswers || {}
        };
      }
    }
  } catch (e) {
    showWarn();
  }
}

function persist() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(saveNow, 400);
}

function saveNow() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
    lastSave = Date.now();
    updateStatus();
  } catch (e) {
    showWarn();
    toast("Could not save \u2014 storage blocked in this browser.");
  }
}

function openDB() {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise(function (res, rej) {
    const rq = indexedDB.open(DB_NAME, 1);
    rq.onupgradeneeded = function () {
      rq.result.createObjectStore(DB_STORE);
    };
    rq.onsuccess = function () { DB = rq.result; res(DB); };
    rq.onerror = function () { rej(rq.error || new Error("IndexedDB failed")); };
  });
  return dbPromise;
}

function idbPut(key, blob) {
  return new Promise(function (res, rej) {
    const tx = DB.transaction(DB_STORE, "readwrite");
    tx.objectStore(DB_STORE).put(blob, key);
    tx.oncomplete = res;
    tx.onerror = function () { rej(tx.error || new Error("IDB put failed")); };
  });
}

function idbGet(key) {
  return new Promise(function (res, rej) {
    const tx = DB.transaction(DB_STORE, "readonly");
    const rq = tx.objectStore(DB_STORE).get(key);
    rq.onsuccess = function () { res(rq.result); };
    rq.onerror = function () { rej(rq.error || new Error("IDB get failed")); };
  });
}

function idbDel(key) {
  return new Promise(function (res, rej) {
    const tx = DB.transaction(DB_STORE, "readwrite");
    tx.objectStore(DB_STORE).delete(key);
    tx.oncomplete = res;
    tx.onerror = function () { rej(tx.error || new Error("IDB delete failed")); };
  });
}

function idbClear() {
  return new Promise(function (res, rej) {
    const tx = DB.transaction(DB_STORE, "readwrite");
    tx.objectStore(DB_STORE).clear();
    tx.oncomplete = res;
    tx.onerror = function () { rej(tx.error || new Error("IDB clear failed")); };
  });
}

function allQuestions() {
  const out = [];
  SECTIONS.forEach(function (s) { out.push.apply(out, s.questions); });
  return out;
}

function qnum(id) {
  return "Q" + String(id).slice(1).replace("_", ".");
}

function fmtTime(ts) {
  const d = new Date(ts);
  return pad2(d.getHours()) + ":" + pad2(d.getMinutes()) + ":" + pad2(d.getSeconds());
}

function fmtDur(sec) {
  return Math.floor(sec / 60) + "m " + (sec % 60) + "s";
}

function fmtClock(sec) {
  return pad2(Math.floor(sec / 60)) + ":" + pad2(sec % 60);
}

function fmtTs(ts) {
  const d = new Date(ts);
  return d.toLocaleString();
}

function updateStatus() {
  let x = 0;
  allQuestions().forEach(function (q) {
    const t = (state.answers[q.id] || "").trim();
    const c = (state.clipMeta[q.id] || []).length;
    if (t || c) x++;
  });
  const tot = totalQuestions();
  const bar = document.getElementById("pbarFill");
  if (bar) bar.style.width = (tot ? (x / tot * 100) : 0) + "%";
  const st = document.getElementById("status");
  if (st) st.innerHTML = "<b>Saved \u2713 " + fmtTime(lastSave) + "</b> \u00b7 " + x + " of " + tot + " questions have content";
}

function scrollToSec(id) {
  const el = document.getElementById(id === "free" ? "freecard" : "sec-" + id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function chipLabel(sec) {
  const main = (sec.title || "").split(" \u2014 ")[0];
  const m = /^(\d+)\.\s+(.+)$/.exec(main);
  if (!m) return sec.title || "";
  const first = m[2].split(/\s+/)[0] || "";
  let label = m[1] + ". " + first;
  const rest = m[2].slice(first.length).trim();
  const am = /^&\s+(\S+)/.exec(rest);
  if (am && first.length <= 7) label += " & " + am[1];
  return label;
}

function buildChips() {
  const c = document.getElementById("chips");
  if (!c) return;
  const defs = SECTIONS.map(function (sec) { return [sec.id, chipLabel(sec)]; });
  defs.push(["free", "Free"]);
  c.innerHTML = defs.map(function (d) {
    return '<button onclick="scrollToSec(\'' + d[0] + '\')">' + esc(d[1]) + "</button>";
  }).join("");
}

function findQuestion(id) {
  for (let i = 0; i < SECTIONS.length; i++) {
    const qs = SECTIONS[i].questions;
    for (let j = 0; j < qs.length; j++) {
      if (qs[j].id === id) return { q: qs[j], sec: SECTIONS[i] };
    }
  }
  return null;
}

function clipIdbKey(metaKey, cid) {
  return metaKey.indexOf(":d") > -1 ? metaKey + ":" + cid : metaKey + "|" + cid;
}

function renderClips(metaKey) {
  const wrap = document.querySelector('.clips[data-qid="' + metaKey + '"]');
  if (!wrap) return;
  const pre = clipIdbKey(metaKey, "");
  urlMap.forEach(function (url, k) {
    if (k.indexOf(pre) === 0) { URL.revokeObjectURL(url); urlMap.delete(k); }
  });
  wrap.innerHTML = "";
  const metas = state.clipMeta[metaKey] || [];
  metas.forEach(function (m) {
    const row = document.createElement("div");
    row.className = "clip";
    row.innerHTML =
      "<audio controls></audio>" +
      '<span class="meta">' + fmtDur(m.dur) + " \u00b7 " + fmtTs(m.ts) + "</span>" +
      '<button class="del" data-del-qid="' + metaKey + '" data-del-cid="' + m.id + '">\u2715</button>';
    wrap.appendChild(row);
    const aud = row.querySelector("audio");
    const key = clipIdbKey(metaKey, m.id);
    idbGet(key).then(function (blob) {
      if (blob) {
        const url = URL.createObjectURL(blob);
        urlMap.set(key, url);
        aud.src = url;
      }
    }).catch(function () {});
  });
}

function populateAllClips() {
  document.querySelectorAll(".clips").forEach(function (el) {
    renderClips(el.getAttribute("data-qid"));
  });
}

function optCard(opt) {
  const pros = String(opt.pros || "").split(";").map(function (s) { return s.trim(); }).filter(Boolean);
  const cons = String(opt.cons || "").split(";").map(function (s) { return s.trim(); }).filter(Boolean);
  let html = '<div class="optcard">';
  html += '<div class="optname"><b>' + esc(opt.o) + ")</b> " + esc(opt.name) + "</div>";
  if (pros.length) {
    html += '<div class="optblk"><b>Pros:</b></div><ul>' +
      pros.map(function (p) { return "<li>" + esc(p) + "</li>"; }).join("") + "</ul>";
  }
  if (cons.length) {
    html += '<div class="optblk"><b>Cons:</b></div><ul>' +
      cons.map(function (c) { return "<li>" + esc(c) + "</li>"; }).join("") + "</ul>";
  }
  html += '<div class="opttags"><b>Complexity:</b> ' + esc(opt.complexity) +
    ' \u00b7 <b>Effort:</b> ' + esc(opt.effort) +
    ' \u00b7 <b>Demo risk:</b> ' + esc(opt.risk) +
    ' \u00b7 <b>Review:</b> ' + esc(opt.review) + "</div>";
  html += "</div>";
  return html;
}

function render() {
  const main = document.getElementById("main");
  if (!main) return;
  let html = "";
  SECTIONS.forEach(function (sec) {
    html += '<div class="section" id="sec-' + sec.id + '">';
    html += "<h2>" + esc(sec.title) + "</h2><p>" + esc(sec.blurb) + "</p>";
    sec.questions.forEach(function (q) {
      const val = state.answers[q.id] || "";
      html += '<div class="qcard">';
      html += '<div class="qhead"><h3>' + esc(q.title) + '</h3><span class="qnum">' + qnum(q.id) + "</span></div>";
      html += '<p class="why">' + esc(q.why) + "</p>";
      html += '<p class="qtext">' + esc(q.q) + "</p>";
      html += '<p class="ref"><code>' + esc(q.ref) + "</code></p>";
      html += '<textarea data-qid="' + q.id + '" placeholder="Your answer\u2026">' + esc(val) + "</textarea>";
      html += '<div class="recrow"><button class="rec" data-rec="' + q.id + '">\u25cf Record</button><span class="timer" data-timer="' + q.id + '">00:00</span></div>';
      html += '<div class="clips" data-qid="' + q.id + '"></div>';
      html += '<details class="help"><summary>Info \u2014 why &amp; how</summary>' +
        "<p>" + esc(q.info) + "</p>" +
        (q.options && q.options.length ? '<div class="opttable">' + q.options.map(optCard).join("") + "</div>" : "") +
        '<p class="ex">' + esc(q.example) + "</p>" +
        '<p class="nxt">' + esc(q.next) + "</p>" +
        "</details>";
      if (PAGES[q.id]) {
        html += '<button class="guidebtn" onclick="openPage(\'' + q.id + '\')">Open full guide</button>';
      }
      html += "</div>";
    });
    html += "</div>";
  });
  html += '<div class="freecard" id="freecard">';
  html += "<h2>Free notes</h2><p>Brain dump: ideas, worries, questions for the professor, anything that does not fit a card.</p>";
  html += '<textarea id="freeNotes" placeholder="Anything on your mind\u2026">' + esc(state.notes || "") + "</textarea>";
  html += '<div class="recrow"><button class="rec" data-rec="__free__">\u25cf Record</button><span class="timer" data-timer="__free__">00:00</span></div>';
  html += '<div class="clips" data-qid="__free__"></div>';
  html += "</div>";
  main.innerHTML = html;
  if (DB) populateAllClips();
}

function effortValue(opt) {
  const hay = String((opt.complexity || "") + " " + (opt.effort || "")).toLowerCase();
  if (hay.indexOf("week") > -1) return 100;
  if (hay.indexOf("high") > -1) return 75;
  if (hay.indexOf("medium") > -1) return 50;
  if (hay.indexOf("low") > -1) return 25;
  if (hay.indexOf("none") > -1) return 25;
  return 50;
}

function riskColor(r) {
  const s = String(r || "").toLowerCase();
  if (s.indexOf("high") > -1) return "#e74c3c";
  if (s.indexOf("medium") > -1) return "#f1c40f";
  return "#2ecc71";
}

function optionChartHTML(q) {
  const rows = q.options.map(function (opt) {
    const v = effortValue(opt);
    const c = riskColor(opt.risk);
    return '<div class="cmprow">' +
      '<div class="cmplabel"><b>' + esc(opt.o) + ")</b> " + esc(opt.name) +
      " \u2014 " + esc(opt.effort) + " \u00b7 " + esc(opt.risk) + "</div>" +
      '<div class="cmptrack"><div class="cmpbar" style="width:' + v + "%;background:" + c + '"></div></div>' +
      "</div>";
  }).join("");
  return '<div class="pv-subhead">Options at a glance</div><div class="cmpchart">' + rows + "</div>";
}

function renderLink(str) {
  const s = String(str || "");
  const m = /(https?:\/\/[^\s]+)/.exec(s);
  if (!m) return esc(s);
  const url = m[1];
  let label = s.slice(0, m.index).replace(/\s*[\u2014\u2013-]\s*$/, "").trim();
  if (!label) label = url;
  return '<a href="' + esc(url) + '" target="_blank" rel="noopener">' + esc(label) + "</a>";
}

function buildPageBody(qid) {
  const page = PAGES[qid];
  if (!page) return "";
  const found = findQuestion(qid);
  let h = '<p class="pv-intro">' + esc(page.intro) + "</p>";
  (page.sections || []).forEach(function (s) {
    h += '<div class="pv-sec"><h4>' + esc(s.h) + "</h4>";
    String(s.b || "").split("\n\n").forEach(function (p) {
      if (String(p).trim() !== "") h += "<p>" + esc(p) + "</p>";
    });
    h += "</div>";
  });
  if (found && found.q.options && found.q.options.length) {
    h += optionChartHTML(found.q);
  }
  h += '<div class="pv-subhead">Dig deeper</div>';
  (page.sub || []).forEach(function (s, i) {
    const da = state.depthAnswers[qid] || [];
    const val = da[i] || "";
    const mk = qid + ":d" + i;
    h += '<div class="pv-sub">';
    h += '<p class="pv-subq">' + esc(s.q) + "</p>";
    if (s.info) h += '<p class="pv-subinfo">' + esc(s.info) + "</p>";
    h += '<textarea data-dsub="' + qid + "|" + i + '" placeholder="Sub-answer\u2026">' + esc(val) + "</textarea>";
    h += '<div class="recrow"><button class="rec" data-drec="' + qid + "|" + i + '">\u25cf Record</button><span class="timer" data-timer="' + mk + '">00:00</span></div>';
    h += '<div class="clips" data-qid="' + mk + '"></div>';
    h += "</div>";
  });
  if (page.figures && page.figures.length) {
    h += '<div class="pv-subhead">Figures</div>';
    page.figures.forEach(function (f) {
      h += '<div class="pv-fig"><p class="pv-figcap">' + esc(f.caption) + "</p>" +
        '<div class="pv-figbody">' + f.svg + "</div></div>";
    });
  }
  if (page.links && page.links.length) {
    h += '<div class="pv-subhead">Sources</div>';
    h += '<ul class="pv-src">' + page.links.map(function (l) {
      return "<li>" + renderLink(l) + "</li>";
    }).join("") + "</ul>";
  }
  return h;
}

function ensurePageView() {
  if (document.getElementById("pageView")) return;
  const pv = document.createElement("div");
  pv.id = "pageView";
  pv.className = "pv";
  pv.innerHTML =
    '<div class="pv-head">' +
    '<button class="pv-back" onclick="closePage()">\u2190 All questions</button>' +
    '<h2 class="pv-title"></h2>' +
    "</div>" +
    '<div class="pv-body"></div>';
  document.body.appendChild(pv);
}

function openPage(qid) {
  const page = PAGES[qid];
  if (!page) return;
  const found = findQuestion(qid);
  const pv = document.getElementById("pageView");
  if (!pv) return;
  const title = pv.querySelector(".pv-title");
  const body = pv.querySelector(".pv-body");
  if (title && found) title.textContent = found.q.title;
  if (body) {
    body.innerHTML = buildPageBody(qid);
    if (DB) {
      (page.sub || []).forEach(function (_, i) {
        renderClips(qid + ":d" + i);
      });
    }
  }
  const main = document.getElementById("main");
  if (main) main.style.display = "none";
  pv.classList.add("open");
  if (window.scrollTo) window.scrollTo(0, 0);
}

function closePage() {
  const pv = document.getElementById("pageView");
  if (pv) pv.classList.remove("open");
  const main = document.getElementById("main");
  if (main) main.style.display = "";
  urlMap.forEach(function (url, k) {
    if (k.indexOf(":d") > -1) { URL.revokeObjectURL(url); urlMap.delete(k); }
  });
}

function pagePayload(qid) {
  const page = PAGES[qid];
  if (!page) return null;
  const subs = page.sub || [];
  const da = state.depthAnswers[qid] || [];
  let hasText = false;
  let hasClips = false;
  subs.forEach(function (_, i) {
    if (String(da[i] || "").trim() !== "") hasText = true;
    const mk = qid + ":d" + i;
    if ((state.clipMeta[mk] || []).length) hasClips = true;
  });
  if (!hasText && !hasClips) return null;
  return {
    answers: subs.map(function (_, i) { return da[i] || ""; }),
    audio: []
  };
}

function injectStyles() {
  if (document.getElementById("optStyles")) return;
  const st = document.createElement("style");
  st.id = "optStyles";
  st.textContent =
    ".opttable{margin-top:8px}" +
    ".optcard{font-size:13px;line-height:1.4;border:1px dashed #2a2f3a;border-radius:8px;padding:8px 10px;margin:6px 0;background:#1d212b}" +
    ".optcard .optname{margin:0 0 4px;font-size:13px}" +
    ".optcard .optname b{color:var(--acc)}" +
    ".optcard ul{margin:2px 0 6px;padding-left:16px}" +
    ".optcard li{margin:1px 0;font-size:12.5px}" +
    ".optcard .optblk{margin-top:2px;font-size:12.5px}" +
    ".optcard .opttags{margin-top:4px;color:var(--dim);font-size:12px}" +
    ".optcard .opttags b{color:var(--txt)}" +
    ".guidebtn{margin-top:10px;width:100%}" +
    ".pv{position:fixed;inset:0;background:var(--bg);display:none;flex-direction:column;z-index:30}" +
    ".pv.open{display:flex}" +
    ".pv-head{max-width:860px;width:100%;margin:0 auto;padding:12px 16px calc(12px + env(safe-area-inset-top));background:var(--card);border-bottom:1px solid var(--line)}" +
    ".pv-back{padding:8px 12px;min-height:40px;font-size:13px;border-radius:20px}" +
    ".pv-title{margin:8px 0 0;font-size:16px;line-height:1.35}" +
    ".pv-body{flex:1;overflow-y:auto;-webkit-overflow-scrolling:touch;max-width:760px;width:100%;margin:0 auto;padding:16px 16px 90px}" +
    ".pv-intro{font-size:14px;color:var(--dim);margin:0 0 4px}" +
    ".pv-sec{margin:18px 0 0}" +
    ".pv-sec h4{font-size:14px;color:var(--acc);margin:0 0 6px}" +
    ".pv-sec p{margin:0 0 10px;font-size:13.5px;line-height:1.55;color:var(--txt)}" +
    ".pv-subhead{font-size:12px;color:var(--acc);text-transform:uppercase;letter-spacing:.5px;margin:22px 0 6px;border-top:1px solid var(--line);padding-top:14px}" +
    ".pv-sub{margin:0 0 16px}" +
    ".pv-subq{font-size:13.5px;margin:0 0 2px;font-weight:600}" +
    ".pv-subinfo{color:var(--dim);font-size:12.5px;margin:0 0 8px}" +
    ".pv-sub textarea{min-height:60px}" +
    ".pv-fig{margin:0 0 18px}" +
    ".pv-figcap{color:var(--dim);font-size:12.5px;margin:0 0 6px}" +
    ".pv-figbody{margin:0 auto;max-width:620px;border:1px solid var(--line);border-radius:10px;padding:8px;background:var(--card)}" +
    ".pv-figbody svg{width:100%;height:auto}" +
    ".pv-src{margin:0;padding-left:18px}" +
    ".pv-src li{font-size:13px;margin:4px 0;color:var(--txt)}" +
    ".pv-src a{color:var(--acc);word-break:break-word}" +
    ".cmpchart{margin:0 0 4px}" +
    ".cmprow{margin:10px 0 0}" +
    ".cmplabel{font-size:12.5px;margin:0 0 3px}" +
    ".cmplabel b{color:var(--acc)}" +
    ".cmptrack{height:10px;background:var(--card2);border:1px solid var(--line);border-radius:6px;overflow:hidden}" +
    ".cmpbar{display:block;height:100%;border-radius:6px;min-width:2px}";
  document.head.appendChild(st);
}

function pickMime() {
  const cands = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/ogg;codecs=opus", "audio/mpeg"];
  for (let i = 0; i < cands.length; i++) {
    if (window.MediaRecorder && MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(cands[i])) {
      return cands[i];
    }
  }
  return "";
}

function makeId() {
  return "c" + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function startRecording(metaKey) {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || !window.MediaRecorder) {
    toast("Recording not supported in this browser \u2014 text only.");
    return;
  }
  recMime = pickMime();
  navigator.mediaDevices.getUserMedia({ audio: true }).then(function (stream) {
    recorder = new MediaRecorder(stream, recMime ? { mimeType: recMime } : undefined);
    recChunks = [];
    recorder.ondataavailable = function (e) { if (e.data && e.data.size) recChunks.push(e.data); };
    recorder.onstop = function () {
      stopClock();
      stream.getTracks().forEach(function (t) { t.stop(); });
      saveClip(metaKey);
    };
    recorder.onerror = function () {
      stopClock();
      stream.getTracks().forEach(function (t) { t.stop(); });
      toast("Recording failed \u2014 try again.");
    };
    recorder.start();
    recQid = metaKey;
    recStart = Date.now();
    startClock(metaKey);
  }).catch(function (err) {
    toast("Microphone unavailable \u2014 check permissions or try another browser.");
  });
}

function toggleRec(metaKey) {
  if (recorder && recorder.state === "recording") {
    if (recQid === metaKey) { recorder.stop(); return; }
    recorder.stop();
    setTimeout(function () { startRecording(metaKey); }, 60);
    return;
  }
  startRecording(metaKey);
}

function saveClip(metaKey) {
  const type = (recorder && recorder.mimeType) || recMime || "audio/webm";
  const blob = new Blob(recChunks, { type: type });
  const cid = makeId();
  const dur = Math.round((Date.now() - recStart) / 1000);
  idbPut(clipIdbKey(metaKey, cid), blob).then(function () {
    if (!state.clipMeta[metaKey]) state.clipMeta[metaKey] = [];
    state.clipMeta[metaKey].push({ id: cid, dur: dur, ts: Date.now() });
    persist();
    updateStatus();
    renderClips(metaKey);
    toast("Recording saved (" + fmtDur(dur) + ")");
  }).catch(function () {
    toast("Audio could not be saved (storage full?).");
  });
}

function startClock(metaKey) {
  const el = document.querySelector('[data-timer="' + metaKey + '"]');
  if (el) el.textContent = "00:00";
  recTimer = setInterval(function () {
    const el2 = document.querySelector('[data-timer="' + recQid + '"]');
    if (el2) el2.textContent = fmtClock(Math.floor((Date.now() - recStart) / 1000));
  }, 250);
}

function stopClock() {
  clearInterval(recTimer);
  recTimer = null;
  if (recQid) {
    const el = document.querySelector('[data-timer="' + recQid + '"]');
    if (el) el.textContent = fmtClock(Math.floor((Date.now() - recStart) / 1000));
  }
  recQid = null;
}

function deleteClip(metaKey, cid) {
  if (!DB) return;
  idbDel(clipIdbKey(metaKey, cid)).then(function () {
    state.clipMeta[metaKey] = (state.clipMeta[metaKey] || []).filter(function (m) { return m.id !== cid; });
    if (state.clipMeta[metaKey] && !state.clipMeta[metaKey].length) delete state.clipMeta[metaKey];
    persist();
    updateStatus();
    renderClips(metaKey);
  }).catch(function () {
    toast("Could not delete clip.");
  });
}

function blobToBase64(blob) {
  return new Promise(function (res, rej) {
    const r = new FileReader();
    r.onload = function () { res(String(r.result).split(",")[1] || ""); };
    r.onerror = rej;
    r.readAsDataURL(blob);
  });
}

function extFor(type) {
  if (type.indexOf("mp4") > -1) return "m4a";
  if (type.indexOf("mpeg") > -1 || type.indexOf("mp3") > -1) return "mp3";
  if (type.indexOf("ogg") > -1) return "ogg";
  if (type.indexOf("wav") > -1) return "wav";
  return "webm";
}

function buildExport() {
  return openDB().then(function () {
    const out = {
      meta: {
        app: "Finance AI Tracker \u2014 Offline Trip Capture",
        generated: new Date().toISOString(),
        source: "trip/capture.html"
      },
      sections: SECTIONS.map(function (sec) {
        return { id: sec.id, title: sec.title, questions: [] };
      }),
      notes: state.notes || "",
      free_audio: [],
      audio_total_mb: 0
    };
    let totalBytes = 0;
    const seq = [];
    SECTIONS.forEach(function (sec, si) {
      sec.questions.forEach(function (q) {
        seq.push(function () {
          const audio = [];
          const metas = state.clipMeta[q.id] || [];
          const reads = metas.map(function (m) {
            return idbGet(clipIdbKey(q.id, m.id)).then(function (blob) {
              if (!blob) return null;
              return blobToBase64(blob).then(function (b64) {
                totalBytes += blob.size;
                return {
                  file: q.id + "-" + m.id + "." + extFor(blob.type),
                  duration_s: m.dur,
                  recorded: m.ts,
                  size_bytes: blob.size,
                  base64: b64
                };
              });
            });
          });
          const payload = pagePayload(q.id);
          const pageAudio = [];
          const subReads = [];
          if (payload) {
            (PAGES[q.id].sub || []).forEach(function (_, i) {
              const mk = q.id + ":d" + i;
              (state.clipMeta[mk] || []).forEach(function (m) {
                subReads.push(idbGet(clipIdbKey(mk, m.id)).then(function (blob) {
                  if (!blob) return null;
                  return blobToBase64(blob).then(function (b64) {
                    totalBytes += blob.size;
                    return {
                      file: q.id + "-d" + i + "-" + m.id + "." + extFor(blob.type),
                      duration_s: m.dur,
                      recorded: m.ts,
                      size_bytes: blob.size,
                      base64: b64,
                      depth: i
                    };
                  });
                }));
              });
            });
          }
          return Promise.all(reads.concat(subReads)).then(function (items) {
            items.forEach(function (it, idx) {
              if (!it) return;
              if (idx < reads.length) audio.push(it); else pageAudio.push(it);
            });
            const question = {
              id: q.id,
              title: q.title,
              question: q.q,
              reference: q.ref,
              answer: state.answers[q.id] || "",
              audio: audio
            };
            if (payload) {
              payload.audio = pageAudio;
              question.page = payload;
            }
            out.sections[si].questions.push(question);
          });
        });
      });
    });
    const freeMeta = state.clipMeta["__free__"] || [];
    seq.push(function () {
      const reads = freeMeta.map(function (m) {
        return idbGet("__free__|" + m.id).then(function (blob) {
          if (!blob) return null;
          return blobToBase64(blob).then(function (b64) {
            totalBytes += blob.size;
            return {
              file: "__free__-" + m.id + "." + extFor(blob.type),
              duration_s: m.dur,
              recorded: m.ts,
              size_bytes: blob.size,
              base64: b64
            };
          });
        });
      });
      return Promise.all(reads).then(function (items) {
        items.forEach(function (it) { if (it) out.free_audio.push(it); });
      });
    });
    return seq.reduce(function (p, f) { return p.then(f); }, Promise.resolve()).then(function () {
      out.audio_total_mb = +((totalBytes / 1048576).toFixed(2));
      return out;
    });
  });
}

function filename(ext) {
  const d = new Date();
  return "finance-ai-trip-answers-" + d.getFullYear() + pad2(d.getMonth() + 1) + pad2(d.getDate()) + "." + ext;
}

function download(name, str, type) {
  const url = URL.createObjectURL(new Blob([str], { type: type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
}

function exportJSON() {
  buildExport().then(function (data) {
    let dataStr;
    try { dataStr = JSON.stringify(data, null, 2); }
    catch (e) { toast("Export failed: " + e.message); return; }
    const mb = +((new Blob([dataStr]).size / 1048576).toFixed(2));
    toast("JSON exported (" + mb + " MB) \u2014 keep a copy!");
    try {
      download(filename("json"), dataStr, "application/json");
    } catch (e) {
      toast("Download failed: " + e.message);
    }
    if (data.audio_total_mb > 15) {
      toast("Heads up: audio is " + data.audio_total_mb + " MB \u2014 keep this file safe.");
    }
  }).catch(function (e) {
    toast("Export failed: " + e.message);
  });
}

function exportMD() {
  const L = [];
  L.push("# Finance AI Tracker \u2014 Trip Answers");
  L.push("");
  L.push("Generated: " + new Date().toLocaleString());
  L.push("");
  SECTIONS.forEach(function (sec) {
    L.push("## " + sec.title);
    L.push("");
    sec.questions.forEach(function (q) {
      const num = qnum(q.id).slice(1);
      L.push("### " + num + " " + q.title);
      L.push("");
      L.push(q.q);
      L.push("");
      const ans = state.answers[q.id] || "";
      const clips = (state.clipMeta[q.id] || []).length;
      L.push(ans.trim() ? ans : "_no text answer_ (" + clips + " audio clips)");
      const subs = (PAGES[q.id] && PAGES[q.id].sub) || [];
      const da = state.depthAnswers[q.id] || [];
      subs.forEach(function (s, i) {
        const v = da[i] || "";
        if (String(v).trim() !== "") {
          L.push("- " + s.q + " \u2192 " + v);
        }
      });
      L.push("");
    });
  });
  L.push("## Free notes");
  L.push("");
  L.push((state.notes || "").trim() ? state.notes.trim() : "_no free notes_");
  L.push("");
  const md = L.join("\n");
  const mb = +((new Blob([md]).size / 1048576).toFixed(2));
  toast("Markdown exported (" + mb + " MB)");
  try {
    download(filename("md"), md, "text/markdown");
  } catch (e) {
    toast("Download failed: " + e.message);
  }
}

function base64ToBytes(b64) {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

function mimeFor(ext) {
  if (ext === "webm") return "audio/webm";
  if (ext === "m4a") return "audio/mp4";
  if (ext === "mp3") return "audio/mpeg";
  if (ext === "ogg") return "audio/ogg";
  if (ext === "wav") return "audio/wav";
  return "application/octet-stream";
}

function importJSON(ev) {
  const file = ev.target.files && ev.target.files[0];
  ev.target.value = "";
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function () {
    let data;
    try { data = JSON.parse(reader.result); }
    catch (e) { toast("Import failed: invalid JSON."); return; }
    const newState = { answers: {}, notes: "", clipMeta: {}, depthAnswers: {} };
    try {
      if (data && typeof data === "object") {
        if (data.notes != null) newState.notes = String(data.notes);
        const clips = [];
        (data.sections || []).forEach(function (sec) {
          (sec.questions || []).forEach(function (q) {
            if (q.id != null && q.answer != null) newState.answers[q.id] = String(q.answer);
            if (q.id != null && q.page && Array.isArray(q.page.answers)) newState.depthAnswers[q.id] = q.page.answers.slice();
            (q.audio || []).forEach(function (a) { clips.push({ a: a, depth: null }); });
            ((q.page && q.page.audio) || []).forEach(function (a) {
              clips.push({ a: a, depth: a.depth != null ? a.depth : null });
            });
          });
        });
        (data.free_audio || []).forEach(function (a) { clips.push({ a: a, depth: null }); });
        openDB().then(function () {
          const tasks = clips.map(function (item) {
            const a = item.a;
            if (!a || !a.file || !a.base64) return Promise.resolve();
            const dash = a.file.indexOf("-");
            if (dash < 1) return Promise.resolve();
            const qid = a.file.slice(0, dash);
            const dot = a.file.lastIndexOf(".");
            const base = dot > 0 ? a.file.slice(0, dot) : a.file;
            const ext = dot > 0 ? a.file.slice(dot + 1) : "webm";
            const parts = base.split("-");
            const cid = parts[parts.length - 1] || "";
            if (!cid) return Promise.resolve();
            const metaKey = item.depth != null ? qid + ":d" + item.depth : qid;
            const blob = new Blob([base64ToBytes(a.base64)], { type: mimeFor(ext) });
            if (!newState.clipMeta[metaKey]) newState.clipMeta[metaKey] = [];
            newState.clipMeta[metaKey].push({
              id: cid,
              dur: a.duration_s || 0,
              ts: a.recorded || Date.now()
            });
            return idbPut(clipIdbKey(metaKey, cid), blob);
          });
          return Promise.all(tasks);
        }).then(function () {
          state = newState;
          persist();
          render();
          buildChips();
          populateAllClips();
          updateStatus();
          toast("Imported " + file.name);
        }).catch(function (e) {
          toast("Import failed: " + e.message);
        });
      } else {
        toast("Import failed: not a valid backup file.");
      }
    } catch (e) {
      toast("Import failed: " + e.message);
    }
  };
  reader.onerror = function () { toast("Import failed: could not read file."); };
  reader.readAsText(file);
}

function clearAll() {
  if (!confirm("Delete ALL answers, notes and recordings on this device? This cannot be undone.")) return;
  state = { answers: {}, notes: "", clipMeta: {}, depthAnswers: {} };
  persist();
  render();
  buildChips();
  updateStatus();
  openDB().then(function () {
    return idbClear();
  }).then(function () {
    populateAllClips();
    toast("All data cleared.");
  }).catch(function () {
    populateAllClips();
    toast("All data cleared (recordings could not be removed).");
  });
}

function openGuide() {
  const m = document.getElementById("guideModal");
  if (!m) return;
  const steps = GUIDE.steps.map(function (s) {
    return "<li><b>" + esc(s.name) + "</b> \u2014 " + esc(s.text) + "</li>";
  }).join("");
  const rowsE = GUIDE.effort.map(function (e) {
    return "<tr><td>" + esc(e[0]) + "</td><td>" + esc(e[1]) + "</td><td>" + esc(e[2]) + "</td></tr>";
  }).join("");
  const rowsG = GUIDE.glossary.map(function (g) {
    return "<tr><td>" + esc(g[0]) + "</td><td>" + esc(g[1]) + "</td></tr>";
  }).join("");
  const rowsC = GUIDE.coverage.map(function (c) {
    return "<tr><td>" + esc(c[0]) + "</td><td>" + esc(c[1]) + "</td></tr>";
  }).join("");
  const sources = GUIDE.sources.map(function (s) {
    return "<li>" + esc(s[0]) + " \u2014 " + esc(s[1]) + "</li>";
  }).join("");
  const tips = GUIDE.tips.map(function (t) {
    return "<li>" + esc(t) + "</li>";
  }).join("");
  m.innerHTML =
    '<div class="modal-box">' +
    '<button class="modal-close" onclick="closeGuide()">\u2715 Close</button>' +
    "<h2>" + esc(GUIDE.title) + "</h2>" +
    "<h3>Steps</h3><ol>" + steps + "</ol>" +
    "<h3>Where does everything live?</h3><p>" + esc(GUIDE.phone) + "</p>" +
    "<h3>Effort cheat-sheet</h3><table><tr><th>Item</th><th>Effort</th><th>Note</th></tr>" + rowsE + "</table>" +
    "<h3>Glossary</h3><table><tr><th>Term</th><th>Definition</th></tr>" + rowsG + "</table>" +
    "<h3>What each section unlocks</h3><table><tr><th>Section</th><th>Advances</th></tr>" + rowsC + "</table>" +
    "<h3>Sources to check online later</h3><ul>" + sources + "</ul>" +
    "<h3>Tips</h3><ul>" + tips + "</ul>" +
    "</div>";
  m.classList.add("open");
}

function closeGuide() {
  const m = document.getElementById("guideModal");
  if (m) m.classList.remove("open");
}

function init() {
  injectStyles();
  ensurePageView();
  loadState();
  render();
  buildChips();
  updateStatus();
  storageCheck();
  openDB().then(function () {
    populateAllClips();
  }).catch(function () {
    showWarn();
    toast("Storage not available \u2014 recordings will not persist in this browser.");
  });
}

document.addEventListener("DOMContentLoaded", init);

document.addEventListener("input", function (ev) {
  const t = ev.target;
  if (!t) return;
  if (t.id === "freeNotes") {
    state.notes = t.value;
    persist();
    updateStatus();
    return;
  }
  if (t.tagName === "TEXTAREA" && t.dataset.dsub) {
    const p = t.dataset.dsub.split("|");
    const qid = p[0];
    const idx = parseInt(p[1], 10);
    if (!state.depthAnswers[qid]) state.depthAnswers[qid] = [];
    state.depthAnswers[qid][idx] = t.value;
    persist();
    return;
  }
  if (t.tagName === "TEXTAREA" && t.dataset.qid) {
    state.answers[t.dataset.qid] = t.value;
    persist();
    updateStatus();
  }
});

document.addEventListener("click", function (ev) {
  const rec = ev.target.closest && ev.target.closest("button.rec");
  if (rec) {
    ev.preventDefault();
    const r = rec.getAttribute("data-rec");
    if (r) {
      toggleRec(r);
      return;
    }
    const d = rec.getAttribute("data-drec");
    if (d) {
      const p = d.split("|");
      toggleRec(p[0] + ":d" + (p[1] || "0"));
    }
    return;
  }
  const del = ev.target.closest && ev.target.closest("button.del");
  if (del) {
    ev.preventDefault();
    deleteClip(del.getAttribute("data-del-qid"), del.getAttribute("data-del-cid"));
  }
});
