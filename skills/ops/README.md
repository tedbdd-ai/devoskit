# Betrieb OS

**Runbooks als Skills, Daten über MCP.** Der Skill beschreibt, wie man eine Störung untersucht oder behebt; MCP-Server für Monitoring, Logs und Fehler-Tracking liefern die Daten.

## Selbstständigkeit in Stufen

| Stufe | Agent darf | Start |
|---|---|---|
| 1 Beraten | lesen, diagnostizieren, Befund schreiben | **hier anfangen** |
| 2 Vorschlagen | Aktion vorschlagen, Mensch gibt frei | nach einigen guten Befunden |
| 3 Handeln | nur Runbooks auf einer Freigabeliste, risikoarm (z. B. Dienst neu starten, Cache leeren) | einzeln freischalten |

Jedes Runbook trägt im Kopf seine Stufe. Ohne Angabe gilt Stufe 1.

## Geplante Skills

| Skill | Aufgabe |
|---|---|
| `incident-triage` | Alarm → betroffene Dienste, Schwere, erste Hypothesen, Befund |
| `runbook-<thema>` | je ein Runbook pro wiederkehrender Störung |
| `postmortem` | Ablauf, Ursache, Maßnahmen; Maßnahmen als Tickets zurück ins Konzeption OS |
| `ops-report` | wöchentlich: Fehlerraten, Auffälligkeiten, offene Maßnahmen |

## Werkzeuge

- MCP-Server für die tatsächlich genutzten Systeme (Monitoring, Logs, Fehler-Tracking, Ticket-System) aufnehmen. Welche Systeme im Einsatz sind, fragt `devoskit-init` (E3).
- Sammlung von SRE-Skills als Vorlage: https://github.com/sinzin91/awesome-sre-skills
- Leitplanken wie im Deploy OS: minimale Rechte, alles nachvollziehbar, Not-Aus (Credentials des Agenten sofort entziehbar).
