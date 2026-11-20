#!/usr/bin/env node
// Copy lint: scans text or UI source files for banned AI-speak terms and patterns.
//   node lint.mjs <file|dir> ... [--lang de|en|all] [--extra <voice-profile.md>] [--json]
//   echo "text" | node lint.mjs - [--lang de]
// --extra reads a "## Verbotene Wörter" list (one "- term" per line) from a voice profile.
// Exit 0 = clean, 2 = findings.
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, dirname, extname } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ban = JSON.parse(readFileSync(join(HERE, "..", "banlist.json"), "utf8"));
const args = process.argv.slice(2);
const opt = (n, d) => { const i = args.indexOf(n); if (i < 0) return d; const v = args[i + 1]; args.splice(i, 2); return v; };
const flag = (n) => { const i = args.indexOf(n); if (i < 0) return false; args.splice(i, 1); return true; };
const lang = opt("--lang", "all"), extra = opt("--extra", null), asJson = flag("--json");

const EXT = new Set([".txt", ".md", ".mdx", ".html", ".htm", ".js", ".jsx", ".ts", ".tsx", ".vue", ".svelte", ".astro", ".json", ".strings", ".stringsdict", ".xcstrings", ".swift", ".kt", ".xml", ".arb", ".yml", ".yaml", ".po"]);
const SKIP = new Set(["node_modules", ".git", "dist", "build", ".next", "DerivedData", "Pods", ".design-loop"]);

const rules = [];
const wb = (t) => new RegExp(`(?<![\\p{L}\\p{N}])(?:${t})(?![\\p{L}\\p{N}])`, "giu");
for (const l of lang === "all" ? ["de", "en"] : [lang]) for (const r of ban[l] || []) rules.push({ id: r.term, re: wb(r.term), fix: r.fix });
for (const p of ban.patterns) rules.push({ id: p.name, re: new RegExp(p.regex, "gmu"), fix: p.fix });
if (extra && existsSync(extra)) {
  const md = readFileSync(extra, "utf8");
  const sec = md.split(/^##\s+/m).find((s) => /^Verbotene Wörter/i.test(s)) || "";
  for (const m of sec.matchAll(/^\s*-\s+(.+?)\s*(?:→\s*(.+))?$/gm)) {
    const term = m[1].replace(/[`"„“]/g, "").trim();
    // literal term; trailing letters allowed so German inflections match (Kunde → Kunden)
    if (term) rules.push({ id: term, re: wb(term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\p{L}*"), fix: m[2] || "Markenprofil: nicht verwenden" });
  }
}

const files = [];
const walk = (p) => {
  const s = statSync(p);
  if (s.isDirectory()) { for (const f of readdirSync(p)) if (!SKIP.has(f) && !f.startsWith(".")) walk(join(p, f)); }
  else if (EXT.has(extname(p).toLowerCase())) files.push(p);
};
// In code files only user-facing text counts: string literals and JSX/HTML text. Everything else is blanked (columns stay intact).
const CODE = new Set([".js", ".jsx", ".ts", ".tsx", ".vue", ".svelte", ".astro", ".swift", ".kt"]);
const userText = (line) => {
  const keep = new Array(line.length).fill(false);
  for (const m of line.matchAll(/(["'`])((?:\\.|(?!\1).)*)\1/g)) for (let k = m.index + 1; k < m.index + m[0].length - 1; k++) keep[k] = true;
  for (const m of line.matchAll(/>([^<>{}]*[\p{L}][^<>{}]*)</gu)) for (let k = m.index + 1; k < m.index + m[0].length - 1; k++) keep[k] = true;
  return [...line].map((c, k) => (keep[k] ? c : " ")).join("");
};
const findings = [];
const scan = (name, text) => {
  const code = CODE.has(extname(name).toLowerCase());
  const lines = text.split("\n").map((l) => (code ? userText(l) : l));
  lines.forEach((line, i) => {
    for (const r of rules) {
      r.re.lastIndex = 0;
      for (const m of line.matchAll(r.re)) findings.push({ file: name, line: i + 1, col: m.index + 1, match: m[0], rule: r.id, fix: r.fix });
    }
  });
};

if (!args.length) { console.error("Nutzung: lint.mjs <datei|ordner|-> … [--lang de|en|all] [--extra profil.md] [--json]"); process.exit(1); }
for (const a of args) {
  if (a === "-") scan("stdin", readFileSync(0, "utf8"));
  else if (existsSync(a)) walk(a);
  else { console.error("Nicht gefunden: " + a); process.exit(1); }
}
for (const f of files) scan(f, readFileSync(f, "utf8"));
findings.sort((a, b) => a.file.localeCompare(b.file) || a.line - b.line || a.col - b.col);

if (asJson) console.log(JSON.stringify(findings, null, 2));
else if (!findings.length) console.log(`✓ Keine Treffer (${files.length || 1} Quelle(n), ${rules.length} Regeln)`);
else {
  for (const f of findings) console.log(`${f.file}:${f.line}:${f.col}  „${f.match}“  → ${f.fix}`);
  console.log(`\n${findings.length} Treffer in ${new Set(findings.map((f) => f.file)).size} Datei(en)`);
}
process.exit(findings.length ? 2 : 0);
