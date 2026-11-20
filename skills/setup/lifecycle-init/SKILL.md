---
name: lifecycle-init
description: Initializes or updates lifecycle-os in an app repository. Detects the project's stack, platforms and tooling from the repo, interviews the user only about what it cannot detect (team agents, ticket system, workflow, test app, deploy and operations), then installs exactly the matching skills, writes AGENTS.md, configures MCP servers, adapts git-hook checks and the pipeline template, and records everything in .lifecycle/profile.yml. Use when the user types /lifecycle-init, asks to set up, initialize, onboard or reconfigure lifecycle-os (or its OS for conception, design, dev, test, deploy, operations) in a repo, or when the stack or workflow of a repo has changed.
---

# /lifecycle-init — lifecycle-os im App-Repo einrichten

Ablauf: **erkennen → fragen → Plan zeigen → nach Freigabe ausführen → prüfen → Profil speichern.** Alles aus dem Root des App-Repos. Nichts Bestehendes überschreiben ohne Rückfrage, nie nach API-Keys fragen, nichts committen.

Referenzen in diesem Skill-Ordner:
- `references/questions.md`: Fragenkatalog mit Erkennungsregeln und Standardwerten
- `references/decision-matrix.md`: welche Antwort welche Installation auslöst
- `references/stack-checks.md`: Check-Befehle je Stack
- `assets/profile.template.yml`: Aufbau von `.lifecycle/profile.yml`

## 0. lifecycle-os bereitstellen

Die Vorlagen, Checks und Skripte liegen im OS-Repo. Pfad `OS=${LIFECYCLE_OS:-../lifecycle-os}`.
- Fehlt der Ordner: Git-URL aus `skills-lock.json` (Eintrag `lifecycle-init`, Feld `sourceUrl`) nehmen oder den User fragen, dann `git clone <url> ../lifecycle-os`.
- Existiert er: `git -C $OS pull --ff-only` (bei Fehler weitermachen und es dem User sagen).

## 1. Modus bestimmen

- **Neu:** keine `.lifecycle/profile.yml` → kompletter Ablauf.
- **Aktualisieren:** Profil vorhanden → Profil kurz zusammenfassen und fragen, was sich geändert hat (Stack, Agenten, Ticket-System, Test-App, Deploy, Betrieb). Danach nur die betroffenen Blöcke neu fragen und nur die Differenz anwenden (Skills hinzufügen/entfernen, Checks anpassen).

## 2. Erkennen (vor jeder Frage)

Lies, was das Repo schon verrät, und zeige es später als Vorschlag zum Bestätigen statt als offene Frage. Erkennungsregeln stehen je Frage in `references/questions.md`. Mindestens: Manifest-Dateien (`package.json`, `pyproject.toml`, `go.mod`, `Package.swift`/`*.xcodeproj`, `build.gradle*`, `pubspec.yaml`), Skripte darin, Test-Frameworks, `git remote -v`, `bitbucket-pipelines.yml`, vorhandene `AGENTS.md`/`CLAUDE.md`, `lefthook.yml`, `.vscode/mcp.json`, `.mcp.json`, `skills-lock.json`.

## 3. Fragen

- In **Blöcken** fragen (A Projekt & Team, B Technik, C Arbeitsweise, D Test, E Deploy & Betrieb), höchstens fünf Fragen pro Nachricht, jeweils mit erkanntem Wert oder Standardwert als Vorschlag.
- Blöcke D und E dürfen mit „später“ beantwortet werden; dann im Profil `status: later` vermerken und die zugehörigen OS nicht einrichten.
- Nichts fragen, was erkannt und vom User bestätigt ist.

## 4. Plan zeigen

Aus den Antworten mit `references/decision-matrix.md` einen Plan ableiten und **vor dem Ausführen** als Tabelle zeigen: OS | wird eingerichtet ja/nein | Skills | Checks | MCP-Server | Dateien, die entstehen oder geändert werden. Auf Freigabe warten.

## 5. Ausführen

Reihenfolge, jeweils nur was der Plan enthält:
1. **Rechner:** `agent-browser --version || (npm install -g agent-browser && agent-browser install)` (nur wenn Design OS).
2. **Skills:** `npx -y skills add <quelle> --skill <namen> --agent <agenten> -y` je Quelle; die Agentenliste kommt aus Frage A2. Eigene Skills aus `lifecycle-os` mit dessen Git-URL. Nicht mehr benötigte Skills (Aktualisieren) mit `npx -y skills remove <name> -y`.
3. **AGENTS.md:** aus `$OS/templates/AGENTS.md`; Abschnitt *Projekt* mit den Antworten füllen, Zeilen in *Lebenszyklus und Skills* für nicht eingerichtete OS entfernen. Vorhandene `AGENTS.md`: fehlende Abschnitte ergänzen, Bestehendes nicht ändern. `CLAUDE.md` mit `@AGENTS.md`, falls Claude Code im Team ist.
4. **MCP:** benötigte Server aus `candidates` nach `servers` in `$OS/mcp/servers.json` übernehmen **nur im Kopf**: das OS-Repo nicht ändern, sondern eine Projektliste `.lifecycle/mcp.json` im gleichen Format anlegen und `node $OS/scripts/mcp-sync.mjs --source .lifecycle/mcp.json --agents <…>` ausführen. Codex-Snippet nur anzeigen.
5. **Checks:** `$OS/checks/lefthook.yml` übernehmen und die Befehle nach `references/stack-checks.md` und den erkannten Projekt-Skripten ersetzen. Langsame Checks (native Builds, E2E) in `pre-push` oder nur in die Pipeline. Den User lefthook installieren lassen (https://lefthook.dev), dann `lefthook install`.
6. **Pipeline:** bei Bitbucket `$OS/pipelines/bitbucket-pipelines.example.yml` an Stack und Umgebungen anpassen und als Vorschlag zeigen; eine bestehende `bitbucket-pipelines.yml` nie ersetzen. Produktion bleibt `trigger: manual`.
7. **.gitignore:** `.design-loop/`, `.claude/settings.local.json` ergänzen, falls fehlend.

## 6. Prüfen

- `npx -y skills list` zeigt genau die geplanten Skills.
- Jeder Pfad, den installierte eigene Skills unter `.agents/skills/` aufrufen, existiert.
- Bei Design OS: `printf 'nahtlos!\n' | node .agents/skills/tone-of-voice/scripts/lint.mjs - --lang de` meldet Treffer.
- Check-Befehle aus `lefthook.yml` einmal einzeln ausführen; was fehlschlägt, dem User zeigen (oft fehlende Tools).

## 7. Profil speichern und abschließen

- `.lifecycle/profile.yml` nach `assets/profile.template.yml` schreiben (alle Antworten, eingerichtete OS, installierte Skills mit Quelle, Datum).
- Zusammenfassen: eingerichtet, übersprungen (mit Grund), was der User selbst tun muss (lefthook installieren, Pipeline-Vorschlag übernehmen, neue Agent-Session starten, Commit).
- Zum Commit vorschlagen: `.lifecycle/`, `.agents/skills/`, `.claude/skills/`, `skills-lock.json`, `AGENTS.md`, `CLAUDE.md`, `.vscode/mcp.json`, `.mcp.json`, `lefthook.yml`.
