# Test OS

Um die **eigene Test-App** gebaut, nicht um fremde Skills.

## Zielbild

1. **Die Test-App bekommt eine Agent-Schnittstelle**, am besten einen MCP-Server, sonst eine CLI: Testfälle anlegen, Läufe starten, Ergebnisse und Artefakte lesen. Das ist zugleich ein Produkt-Feature: Kunden werden die App künftig mit ihren eigenen Agenten steuern wollen.
2. **Eigene Skills darauf** (in diesem Ordner, sobald die Schnittstelle steht):

| Skill (geplant) | Aufgabe |
|---|---|
| `test-plan` | aus Spec/Tickets (Konzeption OS) Testfälle in der Test-App erzeugen, inkl. Pflicht-States und Randfälle |
| `test-run` | Läufe starten, Ergebnis zusammenfassen, Flaky-Tests markieren |
| `bug-report` | fehlgeschlagener Test → Ticket mit Reproduktionsschritten, Screenshot, Log-Auszug |
| `verify-fix` | ein Fix gilt erst als erledigt, wenn der zugehörige Test grün ist und vorher rot war |

## Ergänzend aus dem Bestand

- `agent-browser` (schon im Design OS): explorative Tests und Dogfooding im Browser.
- `tdd` (Dev OS): Unit-/Integrationstests während der Entwicklung; das Test OS deckt End-to-End und Abnahme ab.
- Optional `verification-before-completion` (Superpowers) nur, falls das Dev OS Superpowers nutzt.

## Bei der Einrichtung gefragt

`lifecycle-init` fragt nach der Schnittstelle der Test-App (D1), den vorhandenen Testarten (D2) und wo E2E-Tests laufen (D3). Davon hängt ab, ob zuerst ein MCP-Server gebaut wird und wie der Pipeline-Schritt aussieht.
