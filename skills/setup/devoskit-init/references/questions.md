# Fragenkatalog

Je Frage: **erkennen** (vor dem Fragen), **Standard** (wenn nichts erkannt), **wirkt auf** (siehe `decision-matrix.md`). Erkanntes als Vorschlag zeigen: „Erkannt: X. Stimmt das?“

## Block A: Projekt und Team

| # | Frage | Erkennen | Standard | Wirkt auf |
|---|---|---|---|---|
| A1 | Was macht die App, für wen? (ein Satz) | README, `package.json` description | – (muss beantwortet werden) | AGENTS.md |
| A2 | Welche Agenten nutzt das Team? (Copilot in VS Code, Claude Code, Codex, Cursor, andere) | `.vscode/`, `.claude/`, `.cursor/`, `skills-lock.json` | Copilot + Claude Code | `--agent`-Liste, MCP-Ziele, `CLAUDE.md` |
| A3 | Sprache(n) der UI-Texte und Anrede (du/Sie) | i18n-Ordner, Strings-Dateien | de, du | tone-of-voice, Copy-Lint |

## Block B: Technik

| # | Frage | Erkennen | Standard | Wirkt auf |
|---|---|---|---|---|
| B1 | Plattformen: Web, iOS, Android, Desktop, nur Backend/API? | `Package.swift`/`*.xcodeproj` (iOS), `build.gradle*` + `AndroidManifest.xml` (Android), Frontend-Frameworks in `package.json` (Web), `pubspec.yaml` (Flutter) | – | ob Design OS, welche Design-Skills |
| B2 | Sprachen und Frameworks | Manifeste und Lockfiles | – | Stack-Skills, Checks |
| B3 | Befehle für Build, Test, Lint, Format, Dev-Server | `scripts` in `package.json`, `Makefile`, `justfile`, `pyproject.toml` | aus `stack-checks.md` | Checks, AGENTS.md |
| B4 | Gibt es Design-Tokens / ein Theme? Wo? | `tokens.css`, `theme.ts`, `tailwind.config.*`, Asset-Kataloge | – | tweak, design-loop |

## Block C: Arbeitsweise

| # | Frage | Erkennen | Standard | Wirkt auf |
|---|---|---|---|---|
| C1 | Ticket-System (Jira mit Projekt-Key, Bitbucket Issues, GitHub, lokale Dateien) | `git remote` (bitbucket.org → vermutlich Jira), Branch-Namen wie `ABC-123-…` | Jira | Konzeption OS, Atlassian MCP |
| C2 | Branching und Review: Feature-Branches mit PR? Pflicht-Reviewer? | Branch-Liste, Pipeline `pull-requests` | Feature-Branch + PR, 1 Reviewer | AGENTS.md, `pr`-Skill |
| C3 | Wie formell sollen Specs sein? leicht (Ausfragen + Tickets) / formell (eigene Spec-Dokumente für Leute ohne Agent) | `docs/specs/`, `specs/` | leicht | Konzeption OS |
| C4 | Test-Driven Development? ja / an Kernlogik / nein | Testabdeckung, Testordner | an Kernlogik | Dev OS |

## Block D: Test (darf „später“ sein)

| # | Frage | Erkennen | Standard | Wirkt auf |
|---|---|---|---|---|
| D1 | Welche Schnittstelle hat eure Test-App: MCP-Server, CLI, REST-API, keine? | – | – | Test OS, MCP |
| D2 | Welche Testarten gibt es im Repo schon? (Unit, Integration, E2E) und womit? | Test-Frameworks in Manifesten, Testordner | erkannt | Checks, Test OS |
| D3 | Wo laufen E2E-/Abnahmetests: lokal, Pipeline, Test-App-Umgebung? | Pipeline-Schritte | Pipeline | Pipeline-Vorschlag |

## Block E: Deploy und Betrieb (darf „später“ sein)

| # | Frage | Erkennen | Standard | Wirkt auf |
|---|---|---|---|---|
| E1 | Umgebungen (z. B. staging, production) und wohin deployt wird (Hosting, App Store) | `bitbucket-pipelines.yml` `deployment:` | staging + production | Pipeline, Deploy OS |
| E2 | Wer gibt Produktion frei? | Bitbucket Deployment-Einstellungen (nicht lesbar → fragen) | Lead + eine Vertretung | Pipeline, AGENTS.md |
| E3 | Werkzeuge für Monitoring, Logs, Fehler-Tracking, Alarme | Abhängigkeiten (z. B. Error-Tracking-SDKs), Konfig-Dateien | – | Betrieb OS, MCP |
| E4 | Mit welcher Selbstständigkeitsstufe startet der Betriebs-Agent? 1 beraten / 2 vorschlagen / 3 freigegebene Runbooks | – | 1 | Betrieb OS |
