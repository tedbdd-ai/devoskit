---
name: tweak
description: Opens the user's page in a visible browser and injects a slider overlay for every CSS custom property (design token) on :root, so the user can tune spacing, radii, colors, font sizes and timings live; afterwards reads the changed values back and writes them into the project's token source. Use when the user types /tweak, wants to "fine-tune", "adjust live", "play with the tokens", or says values look slightly off and wants sliders.
---

# /tweak — Live-Slider für CSS-Tokens

Design-Bibliothek (Referenzen, Stil-Rezepte, Icon-Packs, Markenstimmen): `$DESIGN_LIBRARY`, Standard `../design-library` (Geschwister-Ordner des App-Repos). Alle Befehle aus dem Repo-Root.

## Voraussetzungen
- Die Seite nutzt CSS Custom Properties auf `:root` (oder `html`). Gibt es keine: zuerst die hartkodierten Werte in Tokens überführen (ist laut `AGENTS.md` ohnehin Pflicht), dann tweaken.
- Native iOS/Android: nicht direkt möglich. Alternative: Screen als HTML-Mockup (`/app-mockup`) tweaken und die Werte danach in Asset-Katalog/Theme übertragen.

## Ablauf
1. **Token-Quelle finden:** Datei, in der die Tokens definiert sind (z. B. `tokens.css`, `globals.css`, `tailwind.config`, `theme.ts`). Notieren.
2. **Sichtbaren Browser öffnen** (der User bedient die Slider selbst):
   ```bash
   agent-browser --headed open <url-oder-file://pfad>
   agent-browser set viewport 390 844 3        # bei App-Screens; Web: 1440 900
   agent-browser eval --stdin < .agents/skills/tweak/assets/tweak-overlay.js
   ```
   Bei Seiten-Neuladen (Hot Reload) das `eval` wiederholen; bisherige Änderungen werden pro Pfad aus `localStorage` wiederhergestellt.
3. **Übergeben:** Dem User sagen, dass das Panel oben rechts ist: Filterfeld, Slider (px rasten im 4er-Schritt ein, Schalter „8pt“), Farbwähler, **„Ausblenden“-Modus** (Klick auf ein UI-Element blendet es live aus, das Layout rückt nach; so lassen sich reduziertere Varianten testen; Esc beendet den Modus, ausgeblendete Elemente stehen oben im Panel und lassen sich einzeln wieder einblenden), ↺ pro Token, „CSS kopieren“. Warten, bis er „fertig“ sagt.
4. **Auslesen:**
   ```bash
   agent-browser eval "JSON.stringify(window.__tweak.changes())"
   agent-browser eval "JSON.stringify(window.__tweak.hidden())"   # [{selector, tag, classes, text, label}]
   ```
5. **Zurückschreiben:** Die geänderten Werte in der Token-Quelle ersetzen (nicht als Inline-Override). Bei Tailwind/TS-Themes den passenden Schlüssel ändern. Werte auf das 8-pt-Raster und die bestehende Skala prüfen; weicht ein Wert ab, nachfragen oder zum nächsten Skalenwert runden und das sagen.
   - **Ausgeblendete Elemente:** Liefert `window.__tweak.hidden()` Einträge, die Liste dem User zeigen und fragen, ob diese dauerhaft aus dem Komponenten-Code entfernt werden sollen. Erst nach Ja entfernen: Stelle über `text`, `classes` und `tag` im Quellcode finden (der `selector` beschreibt nur die gerenderte DOM-Position), das Element samt nur dafür genutzter Styles, Imports, Props und Daten löschen, und prüfen, dass Abstände der Nachbarn noch stimmen und keine Pflicht-States (Loading/Empty/Error) betroffen sind. Bei Listen-Elementen (gleiche Komponente mehrfach) nachfragen, ob nur das eine oder alle gemeint sind.
   - **Als Stil-Rezept sichern (optional anbieten):** Gefällt das Ergebnis als eigene Richtung, `agent-browser eval "window.__tweak.recipe()"` auslesen (vollständiges Token-Set, geänderte Werte markiert) und daraus mit `$DESIGN_LIBRARY/style-recipes/_template.md` ein neues Rezept `$DESIGN_LIBRARY/style-recipes/<name>.md` anlegen: Name und Stimmung beim User erfragen, nur die Tokens übernehmen, die von `$DESIGN_LIBRARY/tokens/base.css` abweichen, Regeln und Signatur-Detail aus dem Projekt ableiten, Projekt als Referenz eintragen.
6. **Prüfen:** Seite neu laden (ohne Overlay), Screenshot, Kontrast der geänderten Farben prüfen (≥ 4.5:1 für Text). Diff der Token-Datei zeigen.
7. Browser schließen: `agent-browser close`.

## Hinweise
- Das Overlay liegt in einem Shadow DOM und verändert nur `style` am `<html>`-Element sowie `display` an ausgeblendeten Elementen; die Projektdateien bleiben unberührt, bis Schritt 5.
- Ausgeblendete Elemente werden wie die Tokens pro Pfad in `localStorage` gemerkt und nach Hot Reload wiederhergestellt. Ändert sich die DOM-Struktur stark, kann ein gemerkter Selektor ins Leere zeigen; dann im Panel „Alle einblenden“.
- Cross-Origin-Stylesheets (CDN) können nicht gelesen werden; deren Tokens fehlen im Panel.
- `window.__tweak.css()` liefert die Änderungen als fertigen `:root { … }`-Block.
