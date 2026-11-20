/* Design metrics inventory for critics: measured values, not impressions.
   Run: agent-browser eval --stdin < metrics.js > round-NN/metrics.json
   Scans visible elements only; skips the tweak overlay. */
(() => {
  const els = [...document.querySelectorAll("body *")].filter((e) => {
    if (e.closest("#__tweak-panel")) return false;
    const r = e.getBoundingClientRect(), s = getComputedStyle(e);
    return r.width > 0 && r.height > 0 && s.visibility !== "hidden" && s.display !== "none" && +s.opacity > 0;
  });
  const label = (e) => {
    const t = (e.innerText || e.getAttribute("aria-label") || "").trim().replace(/\s+/g, " ").slice(0, 32);
    return e.tagName.toLowerCase() + (e.id ? "#" + e.id : "") + (e.classList[0] ? "." + e.classList[0] : "") + (t ? ` "${t}"` : "");
  };
  const tally = (map, key, el) => { if (!key) return; (map[key] ||= { count: 0, examples: [] }).count++; if (map[key].examples.length < 3) map[key].examples.push(label(el)); };
  const hasOwnText = (e) => [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
  const px = (v) => parseFloat(v) || 0;
  const offGrid = (v) => v > 0 && Math.abs(v / 4 - Math.round(v / 4)) > 0.01; // 4pt half-step allowed

  const type = {}, tracking = {}, leading = {}, radius = {}, shadow = {}, colors = {}, offGridSpacing = [], smallTargets = [], lowContrast = [];

  const lum = (c) => {
    const m = c.match(/[\d.]+/g); if (!m) return null;
    const [r, g, b] = m.slice(0, 3).map((x) => { x = x / 255; return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4; });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const bgOf = (e) => {
    for (let n = e; n; n = n.parentElement) {
      const b = getComputedStyle(n).backgroundColor;
      const a = b.match(/[\d.]+/g); if (a && (a.length < 4 || +a[3] > 0.9)) return b;
    }
    return "rgb(255,255,255)";
  };

  for (const e of els) {
    const s = getComputedStyle(e), r = e.getBoundingClientRect();
    if (hasOwnText(e)) {
      tally(type, `${s.fontSize} / ${s.fontWeight} / ${s.fontFamily.split(",")[0].replace(/"/g, "")}`, e);
      tally(tracking, `${s.letterSpacing} @ ${s.fontSize}`, e);
      tally(leading, `${s.lineHeight} @ ${s.fontSize}`, e);
      tally(colors, "text " + s.color, e);
      const L1 = lum(s.color), L2 = lum(bgOf(e));
      if (L1 != null && L2 != null) {
        const ratio = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05), large = px(s.fontSize) >= 24 || (px(s.fontSize) >= 18.66 && +s.fontWeight >= 700);
        if (ratio < (large ? 3 : 4.5)) lowContrast.push({ el: label(e), ratio: +ratio.toFixed(2), need: large ? 3 : 4.5 });
      }
    }
    if (s.borderTopLeftRadius !== "0px") tally(radius, s.borderTopLeftRadius, e);
    if (s.boxShadow !== "none") tally(shadow, s.boxShadow, e);
    if (s.backgroundColor !== "rgba(0, 0, 0, 0)") tally(colors, "bg " + s.backgroundColor, e);
    for (const p of ["paddingTop", "paddingRight", "paddingBottom", "paddingLeft", "marginTop", "marginBottom", "gap"]) {
      const v = px(s[p]); if (offGrid(v) && offGridSpacing.length < 40) offGridSpacing.push({ el: label(e), prop: p, value: v });
    }
    const interactive = e.matches("a[href], button, input, select, textarea, [role=button], [role=tab], [onclick], summary");
    if (interactive && (r.width < 44 || r.height < 44) && smallTargets.length < 40) smallTargets.push({ el: label(e), size: `${Math.round(r.width)}×${Math.round(r.height)}` });
  }

  const sort = (m) => Object.fromEntries(Object.entries(m).sort((a, b) => b[1].count - a[1].count));
  return JSON.stringify({
    url: location.href,
    viewport: `${innerWidth}×${innerHeight}`,
    elements_scanned: els.length,
    type_styles: sort(type),            // > ~6 distinct sizes = weak scale
    letter_spacing: sort(tracking),
    line_height: sort(leading),
    corner_radius: sort(radius),        // many distinct radii = inconsistent
    elevation_shadows: sort(shadow),    // 0 or 1 level = flat hierarchy; > 3 = noisy
    colors: sort(colors),
    off_grid_spacing: offGridSpacing,   // not a multiple of 4
    tap_targets_under_44: smallTargets,
    low_contrast_text: lowContrast,
  }, null, 2);
})();
