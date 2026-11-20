/* Tweak overlay: live sliders for CSS custom properties on :root.
   Inject: agent-browser eval --stdin < tweak-overlay.js
   Read result: agent-browser eval "JSON.stringify(window.__tweak.changes())"
   Idempotent: re-injecting replaces the panel. */
(() => {
  const ID = "__tweak-panel";
  try { window.__tweak?._cleanup?.(); } catch {}
  document.getElementById(ID)?.remove();
  const root = document.documentElement;
  const STORE = "__tweak:" + location.pathname;

  // 1. Collect custom properties declared on :root / html
  const names = new Set();
  const scan = (rules) => {
    for (const r of rules) {
      if (r.cssRules && !r.selectorText) { try { scan(r.cssRules); } catch {} continue; }
      if (!r.selectorText || !/(^|,)\s*(:root|html)\b/.test(r.selectorText)) continue;
      for (const p of r.style) if (p.startsWith("--")) names.add(p);
    }
  };
  for (const sheet of document.styleSheets) { try { scan(sheet.cssRules); } catch { /* cross-origin */ } }
  for (const p of root.style) if (p.startsWith("--")) names.add(p);
  const computed = getComputedStyle(root);
  // Fallback for unreadable sheets (file://, CDN): Chromium enumerates custom props in computed style
  for (const p of computed) if (p.startsWith("--")) names.add(p);
  const original = {};
  for (const n of names) original[n] = computed.getPropertyValue(n).trim();

  // 2. Classify values
  const probe = document.createElement("canvas").getContext("2d");
  const toHex = (v) => {
    probe.fillStyle = "#000"; probe.fillStyle = v;
    const s = probe.fillStyle;
    return s.startsWith("#") && s.length === 7 ? s : null;
  };
  const NUM = /^(-?\d*\.?\d+)(px|rem|em|%|ms|s|deg|vh|vw)?$/;
  const classify = (v) => {
    const m = v.match(NUM);
    if (m) return { kind: "num", n: parseFloat(m[1]), unit: m[2] || "" };
    if (CSS.supports("color", v) && !v.startsWith("var(")) return { kind: "color", hex: toHex(v) };
    return { kind: "text" };
  };
  const range = (n, unit) => {
    const a = Math.abs(n);
    if (unit === "px") return { min: 0, max: Math.max(64, Math.ceil(a * 3)), step: 1 };
    if (unit === "rem" || unit === "em") return { min: 0, max: Math.max(4, a * 3), step: 0.0625 };
    if (unit === "ms") return { min: 0, max: Math.max(1000, a * 3), step: 10 };
    if (unit === "s") return { min: 0, max: Math.max(1, a * 3), step: 0.01 };
    if (unit === "%") return { min: 0, max: 100, step: 1 };
    if (unit === "deg") return { min: -180, max: 360, step: 1 };
    return { min: Math.min(0, n * 2), max: Math.max(2, a * 3), step: a < 2 ? 0.01 : 1 };
  };

  // 3. State
  const current = { ...original };
  const set = (n, v) => { current[n] = v; root.style.setProperty(n, v); save(); };
  const save = () => { try { localStorage.setItem(STORE, JSON.stringify(changes())); } catch {} };
  const changes = () => Object.fromEntries(Object.entries(current).filter(([k, v]) => v !== original[k]));
  const css = () => { const c = changes(); return Object.keys(c).length ? ":root {\n" + Object.entries(c).map(([k, v]) => `  ${k}: ${v};`).join("\n") + "\n}" : "/* no changes */"; };

  // 4. UI (shadow DOM keeps page styles out)
  const host = document.createElement("div");
  host.id = ID;
  host.style.cssText = "position:fixed;top:16px;right:16px;z-index:2147483647;";
  const sh = host.attachShadow({ mode: "open" });
  sh.innerHTML = `
  <style>
    :host { all: initial; }
    .p { width: 320px; max-height: calc(100vh - 32px); display: flex; flex-direction: column; background: #1C1C1E; color: #F2F2F7;
         border-radius: 16px; box-shadow: 0 16px 48px rgba(0,0,0,.4); font: 12px/1.4 -apple-system, system-ui, sans-serif; overflow: hidden; }
    .h { display: flex; align-items: center; gap: 8px; padding: 8px 8px 8px 16px; cursor: move; background: #2C2C2E; user-select: none; }
    .h b { flex: 1; font-size: 13px; }
    button { min-height: 28px; padding: 0 10px; border: 0; border-radius: 8px; background: #3A3A3C; color: inherit; font: inherit; cursor: pointer; }
    button:hover { background: #48484A; }
    button.on { background: #0A84FF; }
    .tools { display: flex; gap: 8px; padding: 8px 16px; align-items: center; border-bottom: 1px solid #38383A; }
    input[type=search] { flex: 1; min-width: 0; min-height: 28px; border-radius: 8px; border: 0; padding: 0 8px; background: #2C2C2E; color: inherit; font: inherit; }
    .list { overflow-y: auto; padding: 8px 16px 16px; }
    .row { padding: 8px 0; border-bottom: 1px solid #2C2C2E; }
    .row.changed .n { color: #64D2FF; }
    .top { display: flex; justify-content: space-between; gap: 8px; margin-bottom: 4px; }
    .n { font-family: ui-monospace, Menlo, monospace; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .ctl { display: flex; gap: 8px; align-items: center; }
    input[type=range] { flex: 1; accent-color: #0A84FF; }
    input[type=color] { width: 32px; height: 24px; border: 0; padding: 0; background: none; }
    input.v { width: 96px; min-height: 24px; border-radius: 6px; border: 0; padding: 0 6px; background: #2C2C2E; color: inherit; font: 11px ui-monospace, Menlo, monospace; }
    .r { min-height: 20px; padding: 0 6px; font-size: 11px; }
    .empty { padding: 16px; color: #98989D; }
    .hid { padding: 8px 16px; border-bottom: 1px solid #38383A; background: #2C2C2E; }
    .hid:empty { display: none; }
    .hid .top b { font-size: 12px; }
    .hid .item { display: flex; justify-content: space-between; align-items: center; gap: 8px; padding: 4px 0; }
    .hint { padding: 8px 16px; background: #0A84FF; color: #fff; display: none; }
    .picking .hint { display: block; }
    .min .tools, .min .list, .min .hid, .min .hint { display: none; }
  </style>
  <div class="p">
    <div class="h"><b>Tweak · ${names.size} Tokens</b><button data-a="copy">CSS kopieren</button><button data-a="min">–</button><button data-a="close">×</button></div>
    <div class="tools"><input type="search" placeholder="Filter (z. B. space, color)"><button data-a="snap" class="on" title="px-Werte auf 4er-Raster">8pt</button><button data-a="hide" title="Element anklicken, um es auszublenden">Ausblenden</button><button data-a="reset">Reset</button></div>
    <div class="hint">Element anklicken zum Ausblenden · Esc beendet</div>
    <div class="hid"></div>
    <div class="list"></div>
  </div>`;
  const list = sh.querySelector(".list");
  let snap = true;

  const render = (filter = "") => {
    list.innerHTML = "";
    const keys = [...names].filter((n) => n.includes(filter)).sort();
    if (!keys.length) { list.innerHTML = `<div class="empty">Keine CSS-Variablen auf :root gefunden.</div>`; return; }
    for (const n of keys) {
      const v = current[n], c = classify(original[n]);
      const row = document.createElement("div");
      row.className = "row" + (v !== original[n] ? " changed" : "");
      row.innerHTML = `<div class="top"><span class="n" title="${n}">${n}</span><button class="r" title="Zurücksetzen">↺</button></div><div class="ctl"></div>`;
      const ctl = row.querySelector(".ctl");
      const txt = Object.assign(document.createElement("input"), { className: "v", value: v });
      const mark = () => row.classList.toggle("changed", current[n] !== original[n]);
      if (c.kind === "num") {
        const r = range(c.n, c.unit);
        const sl = Object.assign(document.createElement("input"), { type: "range", min: r.min, max: r.max, step: r.step, value: parseFloat(v) });
        sl.oninput = () => {
          let x = parseFloat(sl.value);
          if (snap && c.unit === "px") x = Math.round(x / 4) * 4;
          const nv = +x.toFixed(4) + c.unit; txt.value = nv; set(n, nv); mark();
        };
        txt.onchange = () => { set(n, txt.value); sl.value = parseFloat(txt.value) || 0; mark(); };
        ctl.append(sl, txt);
      } else if (c.kind === "color" && c.hex) {
        const cp = Object.assign(document.createElement("input"), { type: "color", value: toHex(v) || c.hex });
        cp.oninput = () => { txt.value = cp.value; set(n, cp.value); mark(); };
        txt.onchange = () => { set(n, txt.value); cp.value = toHex(txt.value) || cp.value; mark(); };
        txt.style.flex = "1"; ctl.append(cp, txt);
      } else {
        txt.style.flex = "1"; txt.onchange = () => { set(n, txt.value); mark(); }; ctl.append(txt);
      }
      row.querySelector(".r").onclick = () => { root.style.removeProperty(n); current[n] = original[n]; save(); render(sh.querySelector("input[type=search]").value); };
      list.append(row);
    }
  };

  // --- Hide parts: click elements to hide them live (display:none, layout reflows) ---
  const HSTORE = STORE + ":hidden";
  const hidden = []; // { selector, label, text, tag, classes }
  const cssPath = (el) => {
    if (el.id) return "#" + CSS.escape(el.id);
    const parts = [];
    for (let n = el; n && n !== document.body && n.nodeType === 1; n = n.parentElement) {
      if (n.id) { parts.unshift("#" + CSS.escape(n.id)); break; }
      const same = [...(n.parentElement?.children || [])].filter((c) => c.tagName === n.tagName);
      parts.unshift(n.tagName.toLowerCase() + (same.length > 1 ? `:nth-of-type(${same.indexOf(n) + 1})` : ""));
    }
    return parts.join(" > ");
  };
  const describe = (el) => ({
    selector: cssPath(el),
    tag: el.tagName.toLowerCase(),
    classes: [...el.classList].join(" "),
    text: (el.innerText || el.getAttribute("aria-label") || el.getAttribute("alt") || "").trim().replace(/\s+/g, " ").slice(0, 80),
    label: el.tagName.toLowerCase() + (el.id ? "#" + el.id : el.classList[0] ? "." + el.classList[0] : ""),
  });
  const applyHidden = () => {
    document.querySelectorAll("[data-tweak-hidden]").forEach((e) => { e.style.removeProperty("display"); e.removeAttribute("data-tweak-hidden"); });
    for (const h of hidden) document.querySelectorAll(h.selector).forEach((e) => { e.style.setProperty("display", "none", "important"); e.setAttribute("data-tweak-hidden", ""); });
    try { localStorage.setItem(HSTORE, JSON.stringify(hidden)); } catch {}
    const box = sh.querySelector(".hid");
    box.innerHTML = hidden.length ? `<div class="top"><b>Ausgeblendet (${hidden.length})</b><button class="r" data-a="showall">Alle einblenden</button></div>` : "";
    hidden.forEach((h, i) => {
      const row = document.createElement("div"); row.className = "item";
      row.innerHTML = `<span class="n" title="${h.selector.replace(/"/g, "&quot;")}"></span><button class="r">einblenden</button>`;
      row.querySelector(".n").textContent = h.label + (h.text ? ` "${h.text.slice(0, 24)}"` : "");
      row.querySelector("button").onclick = () => { hidden.splice(i, 1); applyHidden(); };
      box.append(row);
    });
  };
  const hl = document.createElement("div");
  hl.style.cssText = "position:fixed;pointer-events:none;z-index:2147483646;outline:2px solid #FF453A;background:rgba(255,69,58,.12);border-radius:4px;display:none;";
  let picking = false;
  const outsidePanel = (e) => !e.composedPath().includes(host);
  const onMove = (e) => {
    if (!outsidePanel(e)) { hl.style.display = "none"; return; }
    const r = e.target.getBoundingClientRect();
    Object.assign(hl.style, { display: "block", left: r.left + "px", top: r.top + "px", width: r.width + "px", height: r.height + "px" });
  };
  const onPick = (e) => {
    if (!outsidePanel(e)) return;
    e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation?.();
    if (e.type !== "click") return;
    const t = e.target; if (t === document.body || t === document.documentElement) return;
    hidden.push(describe(t)); applyHidden(); hl.style.display = "none";
  };
  const onKey = (e) => { if (e.key === "Escape") setPicking(false); };
  const setPicking = (on) => {
    picking = on;
    sh.querySelector(".p").classList.toggle("picking", on);
    sh.querySelector('[data-a="hide"]').classList.toggle("on", on);
    document.body.style.cursor = on ? "crosshair" : "";
    const m = on ? addEventListener : removeEventListener;
    m("mousemove", onMove, true); m("click", onPick, true); m("mousedown", onPick, true); m("pointerdown", onPick, true); m("keydown", onKey, true);
    if (on) document.body.appendChild(hl); else hl.remove();
  };

  sh.querySelector("input[type=search]").oninput = (e) => render(e.target.value);
  sh.addEventListener("click", (e) => {
    const a = e.target.dataset?.a; if (!a) return;
    if (a === "hide") setPicking(!picking);
    if (a === "showall") { hidden.length = 0; applyHidden(); }
    if (a === "close") { setPicking(false); host.remove(); }
    if (a === "min") sh.querySelector(".p").classList.toggle("min");
    if (a === "snap") { snap = !snap; e.target.classList.toggle("on", snap); }
    if (a === "reset") { for (const n of names) { root.style.removeProperty(n); current[n] = original[n]; } save(); render(); }
    if (a === "copy") { const t = css(); navigator.clipboard?.writeText(t).catch(() => {}); console.log(t); e.target.textContent = "Kopiert ✓"; setTimeout(() => (e.target.textContent = "CSS kopieren"), 1200); }
  });

  // Drag panel by header
  const head = sh.querySelector(".h");
  head.onpointerdown = (e) => {
    if (e.target.tagName === "BUTTON") return;
    const r = host.getBoundingClientRect(), dx = e.clientX - r.left, dy = e.clientY - r.top;
    const mv = (ev) => { host.style.left = ev.clientX - dx + "px"; host.style.top = ev.clientY - dy + "px"; host.style.right = "auto"; };
    const up = () => { removeEventListener("pointermove", mv); removeEventListener("pointerup", up); };
    addEventListener("pointermove", mv); addEventListener("pointerup", up);
  };

  // Restore earlier session on this path
  try {
    const prev = JSON.parse(localStorage.getItem(STORE) || "{}");
    for (const [k, v] of Object.entries(prev)) if (names.has(k)) { current[k] = v; root.style.setProperty(k, v); }
  } catch {}

  document.body.appendChild(host);
  render();
  try { hidden.push(...JSON.parse(localStorage.getItem(HSTORE) || "[]")); } catch {}
  applyHidden();

  // Full current token set (not only changes), grouped by prefix: basis for a new Design-OS style recipe
  const recipe = () => {
    const groups = {};
    for (const n of [...names].sort()) {
      const g = n.replace(/^--/, "").split("-")[0];
      (groups[g] ||= []).push(`  ${n}: ${current[n]};${current[n] !== original[n] ? " /* tweaked */" : ""}`);
    }
    return ":root {\n" + Object.values(groups).map((l) => l.join("\n")).join("\n\n") + "\n}";
  };

  window.__tweak = {
    changes, css, recipe,
    hidden: () => hidden.map((h) => ({ ...h })),
    original: () => ({ ...original }),
    reset: () => sh.querySelector('[data-a="reset"]').click(),
    _cleanup: () => setPicking(false),
  };
  return `tweak overlay ready: ${names.size} tokens, ${hidden.length} hidden`;
})();
