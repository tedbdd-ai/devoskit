---
name: tone-of-voice
description: Writes and reviews app and website copy (headlines, buttons, empty states, errors, onboarding, App Store texts, push notifications) in the user's own brand voice instead of generic AI speak. Enforces a ban list of AI words and phrases with a lint script, anchors the brand's own sentences from a voice profile in $DESIGN_LIBRARY/voice/, analyzes the top 5 competitors of a niche for copy patterns, and applies Apple, Google developer docs and ASD-STE100 writing principles. Use when the user types /tone-of-voice, asks to write, rewrite, check or "de-AI" UI text, microcopy, landing page copy or App Store descriptions, sets up a brand voice, or when /app-mockup or /design-loop need real copy.
---

# /tone-of-voice — Texte ohne KI-Einheitsbrei

Design-Bibliothek (Referenzen, Stil-Rezepte, Icon-Packs, Markenstimmen): `$DESIGN_LIBRARY`, Standard `../design-library` (Geschwister-Ordner des App-Repos). Alle Befehle aus dem Repo-Root.

Gutes Design verliert sofort Glaubwürdigkeit, wenn der Text nach Standard-KI klingt. Dieser Skill sorgt dafür, dass Headlines, Buttons, Empty States und Onboarding so klingen wie die Marke, nicht wie ein Sprachmodell.

```bash
T=.agents/skills/tone-of-voice
DESIGN_LIBRARY=${DESIGN_LIBRARY:-../design-library}
node $T/scripts/lint.mjs <datei|ordner|-> [--lang de|en] [--extra $DESIGN_LIBRARY/voice/<marke>.md]
```

## Bausteine
| Baustein | Ort |
|---|---|
| Sperrliste (KI-Wörter, Floskeln, Muster) | `$T/banlist.json` (de, en, patterns) |
| Schreib-Standards (Apple, Google, ASD-STE100) | `$T/references/writing-standards.md` |
| Markenstimme mit eigenen Sätzen | `$DESIGN_LIBRARY/voice/<marke>.md` (Vorlage `_template.md`) oder `VOICE.md` im Projekt |
| Wettbewerbs-Analyse je Nische | `$DESIGN_LIBRARY/voice/competitors/<nische>.md` (Vorlage `_template.md`) |

## Ablauf

### 1. Stimme laden
- Suche in dieser Reihenfolge: `VOICE.md` im Projekt → passende Datei in `$DESIGN_LIBRARY/voice/` → keine.
- **Kein Profil vorhanden:** Kurzinterview (max. 5 Fragen, gesammelt in einer Nachricht): Für wen ist die App? Du oder Sie? Welche 3 Wörter beschreiben den Ton, welche 3 auf keinen Fall? Bitte 3–5 eigene Sätze, so wie du sie einem Kunden sagen würdest (Sprachnachricht abtippen, Mail, Pitch). Welche Wörter magst du nicht? Daraus mit `_template.md` ein Profil anlegen und dem User zur Bestätigung zeigen.
- Die **eigenen Sätze** des Users sind die stärkste Quelle: Satzlänge, Rhythmus, Wortwahl und Anrede daraus übernehmen. Erfinde keine Zitate, die der User nie gesagt hat.

### 2. Wettbewerb analysieren (bei neuer App, neuer Nische oder Landingpage/App-Store-Text)
- Gibt es `$DESIGN_LIBRARY/voice/competitors/<nische>.md` schon und ist sie jünger als 6 Monate, diese nutzen.
- Sonst: die **Top 5** der Nische ermitteln (App-Store-Ranking, Websuche), die Liste dem User kurz zeigen und bestätigen lassen.
- Pro Anbieter lesen: App-Store-Seite, Startseite, wenn möglich Onboarding-Screenshots (`agent-browser read <url>` oder WebFetch). Erfasse Headline-Formeln, CTA-Verben, Anrede, Nutzenversprechen, Länge, Empty States und Fehler, falls sichtbar.
- Ergebnis mit der Vorlage speichern: Muster, gemeinsame Klischees (die Chance zur Abgrenzung) und 3–7 Best Practices für das eigene Design-System. **Nur Muster beschreiben, keine Texte kopieren**; Belegzitate höchstens 10 Wörter.
- Die Best Practices im Markenprofil unter „Wettbewerb“ verlinken.

### 3. Schreiben
- Texttyp bestimmen und den Leitstandard aus `references/writing-standards.md` anwenden: Apple für UI-Elemente, Google für Hilfe- und Erklärtexte, ASD-STE100-Prinzipien für Fehler, Warnungen und Anleitungen.
- Die Muster-Tabelle am Ende der Standards als Gerüst nutzen; Ton und Wortwahl kommen aus dem Markenprofil.
- Konkret statt behauptet: Zahlen, Schritte, Ergebnisse nennen statt Adjektive („in 3 Schritten“ statt „mühelos“).
- Für Headlines und Onboarding 2–3 Varianten liefern (unterschiedliche Winkel, nicht nur Synonyme), Empfehlung markieren. Für Buttons, Fehler und Labels eine Version.
- Längen der UI beachten: Button ≤ 3 Wörter, Alert-Titel ≤ 8 Wörter, Empty-State-Text ≤ 2 Sätze, Push-Titel ≤ 40 Zeichen.

### 4. Prüfen (immer, bevor Text abgegeben oder eingebaut wird)
1. **Lint:** Text oder geänderte Dateien prüfen:
   ```bash
   printf '%s\n' "<text>" | node $T/scripts/lint.mjs - --lang de --extra $DESIGN_LIBRARY/voice/<marke>.md
   node $T/scripts/lint.mjs src/ --extra VOICE.md      # ganzes Projekt
   ```
   Jeden Treffer umschreiben (die `fix`-Spalte ist eine Richtung, kein Ersatzwort). Ein Treffer darf nur bleiben, wenn das Wort wörtlich gemeint ist (z. B. „Reise“ in einer Reise-App); das dann kurz begründen.
2. **Selbst-Check:**
   - Klingt das wie die eigenen Sätze im Profil, laut gelesen?
   - Könnte der Satz in jeder anderen App stehen? Dann ist er zu generisch.
   - Sagt jeder Button, was passiert? Sagt jeder Fehler, was jetzt hilft?
   - Anrede, Begriffe und Schreibweisen durchgehend gleich?
   - Keine Ausrufezeichen außer bei echten Erfolgen, keine Emojis als Aufzählungszeichen, keine rhetorischen Fragen als CTA.
3. **Abgabe:** Text in Tabellenform (Ort | Text | Standard | Begründung in 3–6 Wörtern). Beim Einbauen in Code: Strings in die Lokalisierungsdateien des Projekts, nicht hartkodiert.

## Zusammenspiel mit anderen Skills
- `/app-mockup` und `/design-loop`: echte Inhalte und alle State-Texte über diesen Skill erzeugen; der Anti-Slop-Kritiker in `/design-loop` kann `lint.mjs` auf die Projekt-Strings anwenden.
- `/impeccable` hat einen eigenen UX-Copy-Modus für Klarheit und Struktur; dieser Skill ergänzt Markenstimme, Sperrliste und Wettbewerb.

## Pflege
- Neue KI-Floskeln, die auffallen, in `banlist.json` ergänzen (Regex, `fix`). Markenspezifisches gehört ins Profil unter „Verbotene Wörter“.
- Gelungene, freigegebene Texte als Beispiele ins Markenprofil übernehmen; so wird die Stimme mit jedem Projekt genauer.
