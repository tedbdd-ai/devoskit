# devoskit in ein App-Repo bringen

Die eigentliche Einrichtung macht der Skill **`devoskit-init`**: Er erkennt Stack und Werkzeuge aus dem Repo, fragt nur, was er nicht erkennen kann (Agenten im Team, Ticket-System, Arbeitsweise, Test-App, Deploy, Betrieb), zeigt einen Plan und installiert nach Freigabe genau die passenden Skills, Checks und MCP-Server. Die Antworten landen in `.devoskit/profile.yml`; ein späterer Aufruf aktualisiert nur, was sich geändert hat.

## Start (einmal pro App-Repo)

Im Root des App-Repos, mit `<OS_URL>` = Git-URL von devoskit (`https://github.com/tedbdd-ai/devoskit.git`):

```bash
git clone <OS_URL> ../devoskit          # falls noch nicht neben dem Repo
git clone <bitbucket-url>/design-library.git ../design-library   # falls Design OS genutzt wird
```

Dann **einen** der beiden Wege:

**a) Ohne Installation**: dem Agenten im Chat sagen:
> Lies `../devoskit/skills/setup/devoskit-init/SKILL.md` und richte devoskit danach in diesem Repo ein.

**b) Als Skill** (dann später erneut aufrufbar mit `/devoskit-init`):
```bash
npx -y skills add <OS_URL> --skill devoskit-init --agent github-copilot claude-code codex -y
```
Neue Agent-Session starten, dann `/devoskit-init`.

## Voraussetzungen

- Node ≥ 22.13, Git mit Zugriff auf das devoskit-Repo (`git ls-remote <OS_URL> HEAD` funktioniert)
- Ein Agent, der Agent Skills liest: GitHub Copilot in VS Code, Claude Code, Codex, Cursor u. a.

## Später

- **Etwas hat sich geändert** (Stack, Agenten, Ticket-System, Test-App …): `/devoskit-init` erneut aufrufen.
- **Neue Versionen der Skills:** `npx -y skills update -p`.
- **Neuer Rechner, gleiches Repo:** `npx -y skills experimental_install` stellt den Stand aus `skills-lock.json` wieder her.
