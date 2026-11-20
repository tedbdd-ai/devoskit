# Dev OS

Umsetzung mit festen Paradigmen und Checks. Drei Schichten:

| Schicht | Was | Wo |
|---|---|---|
| **Paradigmen** | Coding-Standards als kleine Dateien mit Index | [`standards/`](../../standards/README.md) |
| **Arbeitsweise** | Skills: TDD, Umsetzen, Review, Diagnose | fremde Skills, siehe unten |
| **Checks** | Format, Lint, Typen, Tests, Secrets, erzwungen | [`checks/lefthook.yml`](../../checks/lefthook.yml) + [`pipelines/`](../../pipelines/README.md) |

## Empfehlung: Matt Pococks Engineering-Skills

Gleiche Familie wie im Konzeption OS (https://github.com/mattpocock/skills).

| Skill | Aufgabe |
|---|---|
| `implement` / `implement-spec` | Spec oder Tickets umsetzen, TDD an vereinbarten Stellen, Review vor dem Commit |
| `tdd` | Rot-Grün-Refactor in vertikalen Scheiben |
| `code-review` | zwei Achsen getrennt: **Standards** (Coding-Standards + Code-Smells) und **Spec-Treue** |
| `diagnosing-bugs` | Feedback-Schleife bauen, die bei dem Bug rot wird, minimieren, Hypothese, Fix, Regressionstest |
| `codebase-design` | tiefe Module hinter kleinen Schnittstellen |
| `improve-codebase-architecture` | Verbesserungsstellen finden und durchsprechen |
| `pr` | Aufbau eines Pull Requests: Zusammenfassung, Nachweis, Risiko |

```bash
npx skills add mattpocock/skills --skill implement implement-spec tdd code-review diagnosing-bugs codebase-design improve-codebase-architecture pr --agent github-copilot claude-code codex -y
```

**Nicht zusätzlich Superpowers installieren** (`test-driven-development`, `systematic-debugging`, Review-Skills): deckt dasselbe ab und konkurriert. Superpowers ist die Alternative, wenn man das Gesamtpaket bevorzugt.

## Stack-spezifisch

Je nach Stack ergänzen, z. B. React/Next.js: `vercel-labs/agent-skills` (React Best Practices); iOS: Simulator-Werkzeuge des jeweiligen Agenten. `lifecycle-init` sucht passende Skills zum erkannten Stack (`npx skills find <framework>`) und installiert nur nach Bestätigung.

## Standards nach dem Agent-OS-Prinzip

Idee von buildermethods/agent-os übernommen (nicht das Framework): Standards als kleine Einzeldateien plus `standards/index.yml` mit einem Satz pro Standard, damit der Agent nur die passenden lädt. `code-review` prüft gegen diese Dateien.
