# Check-Befehle je Stack

**Vorrang:** Befehle, die das Projekt schon hat (`package.json` scripts, `Makefile`, Pipeline). Diese Tabelle nur, wenn nichts vorhanden ist, und dann nur Werkzeuge vorschlagen, die im Projekt installiert sind oder nach Rückfrage installiert werden.

| Stack | Format (pre-commit) | Lint (pre-commit) | Typen (pre-push) | Tests (pre-push / Pipeline) |
|---|---|---|---|---|
| TypeScript / JavaScript | `npx prettier --check {staged_files}` | `npx eslint {staged_files}` | `npx tsc --noEmit` | `npm test` |
| Python | `ruff format --check {staged_files}` | `ruff check {staged_files}` | `mypy .` oder `pyright` | `pytest` |
| Go | `test -z "$(gofmt -l {staged_files})"` | `go vet ./...` | (Compiler) | `go test ./...` |
| Swift / iOS | `swiftformat --lint {staged_files}` | `swiftlint lint {staged_files}` | (Compiler) | `xcodebuild test …` **nur Pipeline** (langsam) |
| Kotlin / Android | `./gradlew ktlintCheck` (wenn Plugin) | `./gradlew detekt` (wenn Plugin) | (Compiler) | `./gradlew test` |
| Dart / Flutter | `dart format --output=none --set-exit-if-changed {staged_files}` | `flutter analyze` | (Analyzer) | `flutter test` |
| Java | `./gradlew spotlessCheck` (wenn Plugin) | – | (Compiler) | `./gradlew test` |

Immer zusätzlich (unabhängig vom Stack):
- **Copy-Lint** (wenn Design OS): `node .agents/skills/tone-of-voice/scripts/lint.mjs {staged_files} --lang <A3>` auf UI-Dateien.
- **Secrets:** der `secrets`-Befehl aus `$OS/checks/lefthook.yml`.

Regeln:
- `pre-commit` muss in wenigen Sekunden durchlaufen: nur gestagte Dateien, keine Builds.
- Alles, was länger dauert, gehört in `pre-push` oder nur in die Pipeline.
- Dieselben Befehle in Hook und Pipeline verwenden.
