#!/usr/bin/env node
// Writes per-agent MCP configs into the current app repo.
//   node <devoskit>/scripts/mcp-sync.mjs [--source .devoskit/mcp.json] [--agents copilot,claude,cursor] [--codex] [--dry-run]
// Source: a file with {"servers": {...}} in the format of devoskit/mcp/servers.json (default: that file).
// Merges: servers already in the target files stay; servers from the source are added or updated.
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const opt = (n, d) => { const i = args.indexOf(n); return i < 0 ? d : args[i + 1]; };
const srcFile = opt("--source", join(HERE, "..", "mcp", "servers.json"));
if (!existsSync(srcFile)) { console.error("Quelle nicht gefunden: " + srcFile); process.exit(1); }
const src = JSON.parse(readFileSync(srcFile, "utf8")).servers || {};
const agents = opt("--agents", "copilot,claude").split(",").map((s) => s.trim());
const dry = args.includes("--dry-run");

const entry = (s, typeKey) => {
  if (s.remote) return { type: "http", url: s.remote };
  const e = { [typeKey]: "stdio", command: s.command, args: s.args || [] };
  if (s.env) e.env = s.env;
  return e;
};
const targets = {
  copilot: { file: ".vscode/mcp.json", root: "servers" },
  claude: { file: ".mcp.json", root: "mcpServers" },
  cursor: { file: ".cursor/mcp.json", root: "mcpServers" },
};

for (const a of agents) {
  const t = targets[a];
  if (!t) { console.error(`Unbekannter Agent: ${a} (copilot, claude, cursor)`); process.exit(1); }
  let cur = {};
  if (existsSync(t.file)) {
    try { cur = JSON.parse(readFileSync(t.file, "utf8")); }
    catch { console.error(`✗ ${t.file} ist kein gültiges JSON (Kommentare?). Bitte von Hand ergänzen.`); continue; }
  }
  cur[t.root] ||= {};
  const changed = [];
  for (const [name, s] of Object.entries(src)) {
    const next = entry(s, "type");
    if (JSON.stringify(cur[t.root][name]) !== JSON.stringify(next)) changed.push(name);
    cur[t.root][name] = next;
  }
  if (dry) { console.log(`${t.file}: würde ${changed.length ? changed.join(", ") : "nichts"} setzen`); continue; }
  mkdirSync(dirname(t.file), { recursive: true });
  writeFileSync(t.file, JSON.stringify(cur, null, 2) + "\n");
  console.log(`✓ ${t.file}${changed.length ? ": " + changed.join(", ") : " (unverändert)"}`);
}

if (args.includes("--codex")) {
  console.log("\n# Für ~/.codex/config.toml (Codex liest MCP-Server aus der Benutzer-Konfiguration):");
  for (const [name, s] of Object.entries(src)) {
    if (s.remote) { console.log(`[mcp_servers.${name}]\nurl = "${s.remote}"\n`); continue; }
    console.log(`[mcp_servers.${name}]\ncommand = "${s.command}"\nargs = ${JSON.stringify(s.args || [])}\n`);
  }
}
