# Konzeption OS

Von der Idee zu Spec und Tickets. Ergebnis liegt im App-Repo (Spec, `GLOSSARY.md`, ADRs) bzw. im Ticket-System.

## Empfehlung: Matt Pococks Skills

Quelle: https://github.com/mattpocock/skills. Zusammenhängende Kette, leichtgewichtig, der De-facto-Standard für „grill-me“. **Dieselbe Familie auch im Dev OS nutzen**, damit Spec → Tickets → Umsetzung → Review ineinandergreifen.

| Skill | Aufgabe |
|---|---|
| `grill-me` / `grill-with-docs` | Ausfragen, bis jeder Zweig der Entscheidung geklärt ist; die Docs-Variante pflegt `GLOSSARY.md` und ADRs |
| `domain-modeling` | Fachbegriffe schärfen, an Randfällen testen |
| `to-spec` | Gespräch → Spec im Ticket-System |
| `to-tickets` | Spec/Plan → Tickets mit Abhängigkeiten |
| `wayfinder` | Vorhaben größer als eine Session als Karte von Entscheidungs-Tickets |
| `prototype` | Wegwerf-Prototyp für eine Designfrage |
| `to-questionnaire` | Fragebogen für die Person, die entscheiden muss |
| `setup-matt-pocock-skills` | **einmal pro Repo zuerst**: Ticket-System, Labels, Doku-Struktur |

Installation (Auswahl):
```bash
npx skills add mattpocock/skills --skill setup-matt-pocock-skills grill-me grill-with-docs domain-modeling to-spec to-tickets wayfinder prototype to-questionnaire --agent github-copilot claude-code codex -y
```

## Bei der Einrichtung gefragt

- **Ticket-System** (C1) und **Spec-Tiefe** (C3) fragt `lifecycle-init`. Bei Jira/Bitbucket nimmt es den Atlassian-MCP-Server in die Projektliste auf und gibt das Ticket-System an `setup-matt-pocock-skills` weiter.
- Verbindung zum Design OS: nach `to-spec` für UI-Features `app-mockup`; Texte über `tone-of-voice`.

## Alternativen (nicht mischen)

- **Superpowers** (`brainstorming`, `writing-plans`): Wenn das Dev OS auf Superpowers setzt.
- **Spec Kit / BMAD**: Wenn Specs formell sein und von Leuten ohne Agent gelesen werden müssen.
