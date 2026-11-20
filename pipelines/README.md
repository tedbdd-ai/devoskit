# Pipelines

Bausteine für `bitbucket-pipelines.yml` in den App-Repos. Die Pipeline ist die **einzige** Stelle, die deployt (siehe Deploy OS).

- [`bitbucket-pipelines.example.yml`](bitbucket-pipelines.example.yml): Checks auf jedem PR, auf `main` Build → Staging → Smoke-Tests → Produktion mit `trigger: manual`.
- Checks hier und in `checks/lefthook.yml` sollen dieselben Befehle nutzen: lokal schnell, in der Pipeline verbindlich.
- Später: Schritte mit **Bitbucket Agentic Pipelines** (Claude- oder Codex-Agent als Pipeline-Schritt), z. B. Analyse fehlgeschlagener Builds oder ein Review-Schritt. Agenten dort mit minimalen Rechten konfigurieren.
