# Deploy OS

**Grundsatz: Der Agent deployt nie selbst, die Pipeline deployt.** Der Agent bereitet vor, löst aus und prüft nach.

## Ablauf und Rollen

| Phase | Agent | Pipeline / Mensch |
|---|---|---|
| Vorbereiten | Changelog, Version, Release-Notes, Migrationen und Konfig-Änderungen prüfen | |
| Staging | Pipeline auslösen, beobachten | deployt automatisch |
| Prüfen | Smoke-Tests über das Test OS, Ergebnis melden | |
| Produktion | Freigabe vorbereiten (was, Risiko, Rollback-Weg) | **Mensch gibt frei** (Bitbucket Deployment-Umgebung mit Pflicht-Freigabe / `trigger: manual`) |
| Nachher | Smoke-Tests, Fehlerraten über Betrieb OS prüfen | |
| Fehler | Rollback auf letzten guten Release-Tag **vorschlagen** | Mensch entscheidet |

## Leitplanken

- **Migrationen** immer menschliche Freigabe; ein Rollback ist dort oft nicht möglich.
- Agent bekommt nur die Rechte, die er braucht (Pipeline auslösen und lesen), keine Produktions-Credentials.
- Jede Aktion nachvollziehbar: Pipeline-Logs sind das Audit-Log.
- Schrittweise ausrollen, wo möglich (Canary), und den Rollback-Weg vor dem Ernstfall testen.

## Geplante Skills

| Skill | Aufgabe |
|---|---|
| `release-prep` | Changelog, Version, Migrations-Check, Freigabe-Zusammenfassung |
| `deploy-verify` | nach jedem Deploy: Smoke-Tests, Kennzahlen, Ergebnis |
| `rollback-plan` | Rollback-Vorschlag mit Ziel-Tag, Folgen, Befehl für den Menschen |

## Bitbucket

- Pipeline-Baustein mit Staging automatisch und Produktion manuell: [`pipelines/bitbucket-pipelines.example.yml`](../../pipelines/bitbucket-pipelines.example.yml).
- **Bitbucket Agentic Pipelines**: Claude- und Codex-Agenten laufen als Pipeline-Schritt mit eingebautem Bitbucket-Zugriff, z. B. um fehlgeschlagene Builds zu analysieren. Kandidat für `deploy-verify`.
- **Atlassian Rovo MCP** für Bitbucket und Jira aus dem Editor.
