# Design OS

UI- und UX-Design: von drei Mockup-Varianten über einen Kritiker-Loop bis zur Feinabstimmung der Tokens und den Texten. Bildgenerierung gehört bewusst nicht dazu.

## Eigene Skills (in diesem Ordner)

| Skill | Aufgabe |
|---|---|
| `app-mockup` | 3 deutlich verschiedene Varianten eines Screens nebeneinander in `mockups/<screen>/index.html`, mit Loading/Empty/Error-Umschalter |
| `design-loop` | Kritiker (anderes Modell, optional Codex) bewerten Screenshots gegen Referenz, Messwerte (`metrics.js`) und Slop-Scan, bis 9.2/10; erst Statik, dann Motion |
| `tweak` | Slider-Panel im Browser für alle CSS-Tokens, Elemente ausblenden, Ergebnis zurück in die Token-Datei oder als Stil-Rezept |
| `tone-of-voice` | Texte in eigener Markenstimme, Sperrliste gegen KI-Floskeln mit Linter, Wettbewerbsanalyse |

## Fremde Skills und Werkzeuge

| Was | Installation | Hinweis |
|---|---|---|
| `impeccable` | `npx skills add pbakaus/impeccable` | Kritik, Audit, Slop-Detektor; `design-loop` nutzt `impeccable detect` |
| `cook` | `npx skills add Leonxlnx/cook` | lange Iteration gegen Referenzbilder |
| `agent-browser` (Skill) | `npx skills add vercel-labs/agent-browser` | |
| `agent-browser` (Programm) | `npm i -g agent-browser && agent-browser install` | pro Rechner; Screenshots, Messungen, `tweak`-Panel |
| Awwwards MCP | `mcp/servers.json` | Referenzen und Seitenanalysen |

## Voraussetzungen

- Node ≥ 22.13
- `design-library` neben dem App-Repo (oder `DESIGN_LIBRARY` gesetzt)
- Optional `codex` für den dritten Kritiker in `design-loop`

## Agent-Unterschiede

- `design-loop` braucht Subagenten (Claude Code, VS Code Copilot) oder frische CLI-Aufrufe (`codex exec`, `claude -p`) für Kritiker ohne Gesprächskontext. Wo beides fehlt, läuft er eingeschränkt und vermerkt das im Log.
- `tweak` öffnet ein eigenes Chrome-Fenster und ist damit unabhängig vom Editor.
