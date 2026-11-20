# Entscheidungsmatrix

Aus den Antworten (`questions.md`) folgt, was installiert wird. `OS_URL` = Git-URL von lifecycle-os, `AGENTS` = Agentenliste aus A2.

## Agenten (A2)

| Antwort | `--agent` | `mcp-sync --agents` | Sonstiges |
|---|---|---|---|
| Copilot in VS Code | `github-copilot` | `copilot` | |
| Claude Code | `claude-code` | `claude` | `CLAUDE.md` mit `@AGENTS.md` |
| Codex | `codex` | – | `--codex` gibt Snippet für `~/.codex/config.toml` aus |
| Cursor | `cursor` | `cursor` | |
| andere | per `npx skills add --help` prüfen, ob unterstützt | von Hand | |

## Konzeption OS (immer)

| Antwort | Aktion |
|---|---|
| immer | `mattpocock/skills`: `setup-matt-pocock-skills grill-me grill-with-docs domain-modeling to-spec to-tickets wayfinder prototype to-questionnaire`; danach `setup-matt-pocock-skills` mit dem User durchlaufen |
| C1 = Jira oder Bitbucket | MCP `atlassian` in Projektliste; im Setup als Ticket-System „Jira über Atlassian MCP“ angeben |
| C1 = GitHub / lokal | kein MCP; im Setup entsprechend wählen |
| C3 = formell | zusätzlich Spec-Dokumente unter `docs/specs/` vereinbaren; Spec Kit nur nach Rückfrage (eigenes Werkzeug, nicht mit `to-spec` mischen) |

## Design OS (nur wenn B1 eine Oberfläche hat)

| Antwort | Aktion |
|---|---|
| B1 = nur Backend/API | Design OS **nicht** einrichten |
| B1 enthält Web | `OS_URL`: `app-mockup design-loop tweak tone-of-voice`; `pbakaus/impeccable`; `vercel-labs/agent-browser`; agent-browser global; MCP `awwwards` |
| B1 nur nativ (iOS/Android) | wie Web, aber in AGENTS.md vermerken: Mockups und `tweak` arbeiten mit HTML-Mockups; Screenshots nativer Screens kommen aus Simulator/Emulator |
| User will lange Referenz-Matches | zusätzlich `Leonxlnx/cook` (nur auf Nachfrage) |
| B4 = Tokens vorhanden | Pfad in AGENTS.md unter *Projekt* eintragen (für `tweak` und `design-loop`) |
| A3 | Sprache für den Copy-Lint in `lefthook.yml` (`--lang de|en|all`) |

## Dev OS (immer)

| Antwort | Aktion |
|---|---|
| immer | `mattpocock/skills`: `implement code-review diagnosing-bugs codebase-design improve-codebase-architecture pr` |
| C4 = ja oder Kernlogik | zusätzlich `tdd implement-spec` |
| B2 Framework | `npx -y skills find <framework>` ausführen, die 1–2 passendsten Treffer mit Installationszahlen zeigen, nur nach Bestätigung installieren |
| B2/B3 | Checks nach `stack-checks.md`; vorhandene Projekt-Skripte haben Vorrang |
| immer | Standards: `$OS/standards/index.yml` in AGENTS.md verlinken; stack-spezifische Standards nur, wenn im OS vorhanden |

## Test OS (wenn D nicht „später“)

| Antwort | Aktion |
|---|---|
| D1 = MCP | Server der Test-App in Projektliste aufnehmen; Test-OS-Skills, sobald im OS vorhanden |
| D1 = CLI oder REST | Befehle/Endpunkte in AGENTS.md unter *Test* dokumentieren; empfehlen, einen MCP-Server zu bauen |
| D1 = keine | Test OS als `pending` im Profil; vorhandene Tests (D2) in Checks und Pipeline aufnehmen |
| D3 = Pipeline | Schritt „Smoke-/E2E-Tests“ im Pipeline-Vorschlag konkretisieren |

## Deploy OS (wenn E nicht „später“)

| Antwort | Aktion |
|---|---|
| E1 | Pipeline-Vorschlag mit genau diesen Umgebungen; Produktion `trigger: manual` |
| E2 | in AGENTS.md: wer freigibt; dem User raten, in Bitbucket die Deployment-Berechtigung auf diese Personen zu beschränken |
| immer | Deploy-Skills, sobald im OS vorhanden; bis dahin Grundsätze aus `skills/deploy/README.md` in AGENTS.md |

## Betrieb OS (wenn E nicht „später“)

| Antwort | Aktion |
|---|---|
| E3 je Werkzeug | offiziellen MCP-Server suchen (Hersteller-Doku, MCP-Registry), Fundstelle zeigen, nur nach Bestätigung in Projektliste |
| E4 | Stufe in AGENTS.md unter *Betrieb* festhalten; ohne Angabe Stufe 1 |
