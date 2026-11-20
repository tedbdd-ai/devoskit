# devoskit

Repo: https://github.com/tedbdd-ai/devoskit

Gemeinsames Betriebssystem für KI-Agenten in einem Projekt mit mehreren App-Repos: Skills, Standards, Checks und Pipeline-Bausteine für den ganzen Lebenszyklus einer App. **Agent-agnostisch**: funktioniert mit GitHub Copilot in VS Code, Claude Code, Codex, Cursor und anderen Agenten, die die offenen Standards lesen.

```
Konzeption → Design → Dev → Test → Deploy → Betrieb
     ↑                                          │
     └──────── Erkenntnisse, Incidents ─────────┘
```

## Aufbau im Bitbucket-Projekt

| Repo | Inhalt | Ändert sich |
|---|---|---|
| `devoskit` (dieses) | Werkzeuge: Skills, Standards, Checks, Pipeline-Bausteine, MCP-Liste, Vorlagen | selten, kuratiert, versioniert |
| `design-library` | Inhalte: Referenzen, Stil-Rezepte, Basis-Tokens, Icon-Packs, Markenstimmen | laufend, bei der Arbeit |
| `app-…` | die Apps. Bekommen `AGENTS.md`, `.agents/skills/` + `skills-lock.json`, Checks, Pipelines | |

Konvention: `design-library` wird als **Geschwister-Ordner** neben die App-Repos geklont (`../design-library`). Abweichend per Umgebungsvariable `DESIGN_LIBRARY`.

## Offene Standards statt agent-spezifischer Features

| Baustein | Standard | Ort im App-Repo |
|---|---|---|
| Skills | Agent Skills (`SKILL.md`) | `.agents/skills/` (Claude Code bekommt eine Verknüpfung in `.claude/skills/`) |
| Projekt-Regeln | AGENTS.md | `AGENTS.md`, dazu `CLAUDE.md` mit nur `@AGENTS.md` |
| Zugriff auf Systeme | MCP | aus `mcp/servers.json` erzeugt: `.vscode/mcp.json`, `.mcp.json` |
| Checks | Git-Hooks (lefthook) + Bitbucket Pipelines | `lefthook.yml`, `bitbucket-pipelines.yml` |

**Grundsatz für Checks:** Alles, was *immer* gelten muss (Format, Lint, Typen, Tests, Sicherheits-Scans), läuft in Git-Hooks und in der Pipeline, nicht in agent-spezifischen Hooks. Dann wird gleich geprüft, egal ob Copilot, Claude oder ein Mensch den Code geschrieben hat.

## Die sechs OS

| OS | Ordner | Stand | Kern |
|---|---|---|---|
| Konzeption | [`skills/conception/`](skills/conception/README.md) | Plan, fremde Skills | Ausfragen (grill-me), Spec, Tickets, Glossar, ADRs |
| Design | [`skills/design/`](skills/design/README.md) | **fertig** | Mockups, Kritiker-Loop, Token-Tuning, Tone of Voice |
| Dev | [`skills/dev/`](skills/dev/README.md) | Plan, fremde Skills | TDD, Review gegen Standards und Spec, Diagnose; Checks als Hooks |
| Test | [`skills/test/`](skills/test/README.md) | Plan | um die eigene Test-App gebaut (MCP/CLI) |
| Deploy | [`skills/deploy/`](skills/deploy/README.md) | Plan | Agent bereitet vor und prüft nach, die Pipeline deployt |
| Betrieb | [`skills/ops/`](skills/ops/README.md) | Plan | Runbooks als Skills, Daten über MCP, Selbstständigkeit in Stufen |

## Installation in ein App-Repo

Siehe [`INSTALL.md`](INSTALL.md). Die Einrichtung übernimmt der Skill [`devoskit-init`](skills/setup/devoskit-init/SKILL.md):

1. **Erkennen:** Stack, Plattformen, Befehle, Test-Frameworks, Pipeline, Git-Remote aus dem Repo lesen.
2. **Fragen:** nur, was nicht erkennbar ist, in fünf Blöcken (Projekt & Team, Technik, Arbeitsweise, Test, Deploy & Betrieb); Test und Deploy dürfen „später“ sein.
3. **Plan zeigen:** welche OS, Skills, Checks, MCP-Server und Dateien. Erst nach Freigabe ausführen.
4. **Profil speichern:** `.devoskit/profile.yml`. Ein erneuter Aufruf ändert nur die Differenz.

Welche Antwort was auslöst, steht in [`decision-matrix.md`](skills/setup/devoskit-init/references/decision-matrix.md); die Fragen in [`questions.md`](skills/setup/devoskit-init/references/questions.md).

## Grundsätze für alle OS

1. **Eine Skill-Familie pro Aufgabe.** Nie zwei TDD- oder zwei Review-Skills parallel; sie konkurrieren um denselben Auftrag.
2. **Skills beschreiben das Wie, MCP liefert den Zugriff, Pipelines erzwingen.**
3. **Menschliche Freigabe** für alles Irreversible: Produktions-Deploy, Migrationen, Löschungen, Kosten über Schwellwert.
4. **Selbstständigkeit in Stufen** (vor allem Deploy und Betrieb): beraten → vorschlagen mit Freigabe → selbst handeln nur bei freigegebenen, risikoarmen Abläufen.
5. **Keine Secrets im Repo.** Keys persönlich (`~/.config/…`) oder als Pipeline-Variablen.
