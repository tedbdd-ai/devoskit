# Standards

Coding-Paradigmen als **kleine Einzeldateien** plus `index.yml` mit einem Satz pro Standard. Der Agent liest zuerst den Index und lädt nur die Standards, die zur Aufgabe passen. `code-review` (Dev OS) prüft gegen diese Dateien. Idee übernommen von buildermethods/agent-os.

## Aufbau

```
standards/
├── index.yml            # name → Datei, ein Satz, wann relevant
├── global/              # gilt für alle Stacks (Benennung, Fehlerbehandlung, Kommentare)
├── <stack>/             # z. B. typescript/, swift/, kotlin/
└── testing/             # was ein guter Test ist, Testpyramide
```

## Regeln für einen Standard

- Eine Datei, ein Thema, höchstens ~40 Zeilen.
- Erst die Regel, dann ein kurzes Richtig/Falsch-Beispiel.
- Nur aufnehmen, was ein Linter **nicht** prüfen kann. Was ein Linter kann, gehört in dessen Konfiguration (`checks/`).
- Neue Standards entstehen aus Reviews: Wiederholt sich ein Kommentar, wird er ein Standard.

Im App-Repo verweist `AGENTS.md` auf die Standards. Projekt-eigene Abweichungen stehen in `AGENTS.md`.
