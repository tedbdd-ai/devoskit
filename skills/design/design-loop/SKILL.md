---
name: design-loop
description: Agency-grade quality gate for a UI screen or page. Independent zero-context critic subagents (optionally on a different model, e.g. Codex) compare screenshots side by side with a reference benchmark, get measured CSS metrics and an automatic anti-slop scan, and must name exact deviations; the loop fixes static design first and only then motion, until the average score reaches 9.2/10. Use when the user types /design-loop, asks to "loop until it's good", "critique and fix until 9+", or wants autonomous design polish of an existing screen, mockup or prototype. For multi-hour matching against reference images use /cook instead.
---

# /design-loop — Qualitäts-Gate bis 9.2/10

Gilt zusätzlich zu `AGENTS.md`. Ziel pro Phase: Durchschnittsscore **≥ 9.2** über alle Kritiker, **kein Kriterium unter 8.0**, und bei vorhandener Referenz **Benchmark-Niveau ≥ 99 %** (siehe unten).

Skill-Ordner: `L=.agents/skills/design-loop` · impeccable: `I=.agents/skills/impeccable/scripts/impeccable` · Design-Bibliothek: `DESIGN_LIBRARY=${DESIGN_LIBRARY:-../design-library}` (alle Befehle aus dem Repo-Root)

## Setup (einmal)
1. **Ziel bestimmen:** URL (Dev-Server) oder HTML-Datei. Läuft kein Server, starte ihn. Kernaufgabe des Screens in einem Satz notieren.
2. **Referenz-Benchmark festlegen (verbindlich, wenn vorhanden):** Gewählte Variante aus `/app-mockup`, Bilder aus `$DESIGN_LIBRARY/references/` oder vom User genannte Vorbilder. 1–3 Bilder nach `./.design-loop/<slug>/benchmark/` kopieren. Die Referenz ist eine **Qualitätsmesslatte, keine Kopiervorlage**: verglichen werden Präzision, Hierarchie, Typo-Handwerk, Raster und Detailtiefe, nicht Inhalt oder Farbe. Gibt es keine Referenz, das in `log.md` vermerken; die Kritiker bewerten dann gegen „Apple Design Award“-Niveau und vergeben strenger.
3. **Kritiker-Modelle wählen (Cross-Model-Booster):** Die Kritiker sollen nicht auf dem Modell laufen, das den Code gebaut hat, damit keine Betriebsblindheit entsteht.
   - Kritiker 1 und 2: Subagenten des laufenden Agenten, jeweils mit einem **anderen Modell** als dem bauenden, sofern der Agent das erlaubt (z. B. Claude Code: Subagent mit anderem `model`; VS Code Copilot: Subagent mit anderer Modellwahl).
   - Kritiker 3: **Codex**, falls installiert (`command -v codex`) und nicht schon der bauende Agent; sonst ein Subagent mit einem dritten Modell. Codex-Aufruf siehe unten; er verbraucht das Codex-Kontingent des Users.
   - Kann der Agent keine Subagenten starten: Kritiker nacheinander als frische CLI-Aufrufe ohne Gesprächskontext (z. B. `codex exec`, `claude -p`), sonst in `log.md` „degraded: single-context“ vermerken.
   - Ist nur ein Modell verfügbar: trotzdem drei isolierte Kritiker, in `log.md` „single-model“ vermerken.
4. **Viewports:** Mobile 390×844 @3x ist Pflicht; Desktop 1440×900 nur bei Web.
5. **Loop-Ordner:** `./.design-loop/<slug>/` mit `benchmark/`, `round-01/`, `round-02/` … und `log.md`.
6. **Limits:** max. **8 Runden gesamt** (Phase A + B). Stagniert der Score 2 Runden lang (< +0.1), Strategie wechseln (größere strukturelle Änderung statt Feintuning). Nach Runde 8 abbrechen und den besten Stand berichten.

## Phasen: Statisch vor Animation
- **Phase A, Statik (immer zuerst):** Bewertet und gefixt werden nur Layout, Whitespace, Raster, Typografie, Farbe/Kontrast, Hierarchie, States und Details. Animationen sind dafür ausgeschaltet (`agent-browser set media light|dark reduced-motion`), Screenshots erst im Endzustand. Respektiert die App `prefers-reduced-motion` nicht, ist das selbst ein Issue; bis zum Fix vor dem Screenshot 1 s warten. Motion-Kritik in Phase A wird verworfen; auch der Fix-Schritt fasst keine Animationen an.
- **Phase B, Motion (nur wenn Phase A das Ziel erreicht hat** und der Screen Animationen hat oder der User Motion-Polish will): Reduced Motion aus, Übergänge als Bildfolge aufnehmen (Interaktion auslösen, Screenshots bei 0/100/200/400/800 ms) und mit der Motion-Rubrik bewerten. Fixes in Phase B dürfen den statischen Endzustand nicht verschlechtern; nach jedem Motion-Fix einen Statik-Screenshot gegen den Phase-A-Stand prüfen.

## Pro Runde
1. **Rendern:** Screenshots aller relevanten States (Ideal, Loading, Empty, Error) in Light und Dark:
   ```bash
   agent-browser set viewport 390 844 3
   agent-browser open <url>
   agent-browser set media light reduced-motion  # Phase A; Phase B: set media light
   agent-browser screenshot .design-loop/<slug>/round-NN/ideal-light.png
   agent-browser set media dark reduced-motion   # Phase A; Phase B: set media dark
   agent-browser screenshot .design-loop/<slug>/round-NN/ideal-dark.png
   ```
   Achtung: Jeder `set media`-Aufruf setzt Farbschema **und** Reduced Motion neu. In Phase A deshalb immer beide Werte angeben, sonst sind die Animationen wieder an.
   States über die App-eigenen Schalter oder `agent-browser eval`.
2. **Side-by-Side-Bild bauen** (wenn Benchmark vorhanden): pro Haupt-State ein Vergleichsbild „links aktuell, rechts Referenz“, gleiche Höhe:
   ```bash
   cat > .design-loop/<slug>/round-NN/compare.html <<EOF
   <body style="margin:0;display:flex;gap:24px;padding:24px;background:#888">
   <img src="ideal-light.png" style="height:900px"><img src="../benchmark/<ref>.png" style="height:900px"></body>
   EOF
   agent-browser set viewport 1600 950 1
   agent-browser open "file://$PWD/.design-loop/<slug>/round-NN/compare.html"
   agent-browser screenshot .design-loop/<slug>/round-NN/compare-ideal.png
   ```
3. **Messen (automatisch, vor den Kritikern):**
   - Design-Metriken: `agent-browser eval --stdin < $L/assets/metrics.js > .design-loop/<slug>/round-NN/metrics.json` (Viewport vorher wieder auf 390×844). Liefert Schriftstile, Letter-Spacing, Zeilenhöhen, Eckenradien, Schatten-/Elevation-Stufen, Farben, Abstände außerhalb des 4-pt-Rasters, Tap-Targets < 44 pt und Text unter WCAG-Kontrast.
   - Anti-Slop-Scan (nur Web/HTML): `$I detect --json <url-oder-datei> --viewport 390x844 > .design-loop/<slug>/round-NN/slop.json`. Ein leeres Ergebnis heißt nicht „sauber“: der Detektor beurteilt kein Layout.
   - Bei Mockup-Canvas: Kopfzeile und State-Umschalter gehören zum Werkzeug, nicht zum Design; Funde dort ignorieren.
4. **Kritiker starten:** 3 Kritiker **parallel**, jeweils **ohne Gesprächskontext**. Sie bekommen nur: Screenshot-Pfade, Side-by-Side-Bilder, `metrics.json`, (Kritiker 3) `slop.json`, die Kernaufgabe in einem Satz, die aktuelle Phase, die passende Rubrik und das Ausgabeformat. Keine Hinweise darauf, was zuletzt geändert wurde, und keine Score-Erwartung.
   - **Kritiker 1:** Visuelle Hierarchie, Typografie, Raster/Abstände.
   - **Kritiker 2:** Usability, HIG, Barrierefreiheit, States.
   - **Kritiker 3:** Eigenständigkeit und Anti-Slop. Arbeitet die **Anti-Slop-Checkliste** unten Punkt für Punkt ab (bestanden/nicht bestanden mit Beleg), nutzt `slop.json` und liest `.agents/skills/impeccable/reference/craft-floor.md` als zusätzliche Bann-Liste.
   - Jeder bewertet alle Kriterien der Phase, mit Fokus auf seinen Bereich. Mit Benchmark legt jeder für jedes Kriterium den aktuellen Screen **direkt neben die Referenz** und begründet die Differenz.
   - Codex als Kritiker 3:
     ```bash
     codex exec -s read-only --skip-git-repo-check --ephemeral \
       -i round-NN/compare-ideal.png -i round-NN/ideal-dark.png -i round-NN/empty-light.png \
       -o round-NN/critic-3.json "<Kritiker-Prompt mit Rubrik, Checkliste, metrics.json- und slop.json-Inhalt>"
     ```
5. **Ausgabeformat (Pflicht, JSON):**
   ```json
   {
     "phase": "static|motion",
     "scores": { "<kriterium>": 0-10 },
     "average": 0-10,
     "benchmark_level": 0-100,
     "slop_checklist": [{ "item": "...", "pass": true, "evidence": "..." }],
     "issues": [{
       "element": "Titel 'Heute' (h1)",
       "property": "letter-spacing",
       "current": "0.02em bei 34px",
       "target": "-0.01em",
       "evidence": "metrics.json letter_spacing / Referenz: engeres Tracking bei Display-Größen",
       "fix": "--tracking-display: -0.01em",
       "impact": "high|med|low"
     }]
   }
   ```
   `benchmark_level` = erreichte Qualität in Prozent der Referenz (100 = gleichwertig); ohne Benchmark `null`.
   **Vage Issues sind ungültig:** Jedes Issue nennt Element, Eigenschaft, Ist-Wert, Soll-Wert und Beleg (Messwert aus `metrics.json`, Pixel/pt aus dem Screenshot oder konkrete Stelle der Referenz). „Abstände wirken unruhig“ wird verworfen; gültig ist z. B. „Card-Padding 20/16 px gemischt → einheitlich 16 px“, „3 Eckenradien (8/12/20 px) für gleichrangige Flächen → 12 px“, „nur eine Schattenstufe, Sheet und Card gleich hoch → zweite Elevation-Stufe“.
6. **Auswerten:** Ungültige (vage) Issues verwerfen. Scores mitteln, in `log.md` eintragen: Runde, Phase, Kritiker-Modelle, Ø-Score, Minimum, Benchmark-Niveau (Minimum über Kritiker), Top-3-Issues. Von mehreren Kritikern genannte Issues zuerst.
7. **Fixen:** Nur die wirkungsvollsten Issues (max. 5 pro Runde), bevorzugt an den Tokens statt an einzelnen Elementen. In Phase A keine Animationen anfassen. Keine Regeln aus AGENTS.md verletzen, um Punkte zu holen.
8. **Weiter:** Phase A ist bestanden bei Ø ≥ 9.2, Minimum ≥ 8.0, kein offenes High-Impact-Issue und (mit Benchmark) Benchmark-Niveau ≥ 99 %. Dann Phase B oder Abschluss.

## Rubrik Phase A, Statik (je 0–10; 9 = Apple-Design-Award-Niveau, 7 = solide, 5 = generisch)
Mit Benchmark gilt: Ist ein Kriterium sichtbar schwächer umgesetzt als in der Referenz, maximal 8.
1. Visuelle Hierarchie: Ist die Kernaufgabe in < 2 s erkennbar?
2. Typografie: Skala (≤ 6 Stufen), Gewichte, Tracking passend zur Größe, Zeilenhöhe, Zeilenlänge.
3. Raster und Abstände: 4/8-pt-Raster, Ausrichtung, Rhythmus, Whitespace.
4. Farbe und Kontrast: WCAG-Werte, Akzentführung, Dark Mode.
5. Usability und HIG: Tap-Targets ≥ 44 pt, Navigationsmuster, Feedback-Zustände.
6. States: Loading/Empty/Error vorhanden und hilfreich.
7. Eigenständigkeit: kein Template-Look, kein Slop, klare Idee.
8. Detailqualität: konsistente Radien und Elevation-Stufen, Icons aus einem Pack, Kanten, Microcopy.

## Rubrik Phase B, Motion (je 0–10)
1. Zweck: Jede Animation erklärt Zustand, Herkunft oder Ursache; keine Deko-Bewegung.
2. Timing und Easing: 150–400 ms für UI, Ease-out beim Eintreten, keine linearen UI-Übergänge.
3. Kontinuität: Elemente bewegen sich räumlich nachvollziehbar, kein Springen oder Flackern.
4. Performance: nur `transform`/`opacity`, kein Layout-Shift, flüssig.
5. Reduced Motion: sinnvoller Ersatz (Überblenden statt Bewegung).

## Anti-Slop-Checkliste (Kritiker 3, jeder Punkt bestanden/nicht bestanden mit Beleg)
1. Generisches Card-Grid (gleich große Cards mit Icon + Titel + Satz) als Hauptlayout.
2. „Hero + 3 Feature-Cards“ oder alles zentriert ohne Grund.
3. Unmotivierte Farbverläufe, Verlaufstext, lila/indigo Default-Akzent, Glow, Glassmorphism ohne Funktion.
4. Standardschrift ohne Konzept (Inter/Roboto/System überall gleich gewichtet, keine Typo-Idee); mehr als 2 Familien.
5. Jede Fläche eine Card mit gleichem Schatten; keine Elevation-Logik.
6. Emojis als Icons oder Icons aus gemischten Packs.
7. Platzhalter-Inhalte: Lorem ipsum, „John Doe“, „Acme“, erfundene Kennzahlen, Floskeln („Unlock“, „Seamless“, „Elevate“).
8. Eyebrow/Kicker-Label über jeder Überschrift; Badges und Pills ohne Funktion.
9. Beliebige Radien/Abstände außerhalb der Token-Skala (Beleg: `metrics.json`).
10. Funde aus `slop.json` (jeden einzeln übernehmen oder begründet verwerfen).

## Abschluss
- Ziel erreicht: Endscreenshots neben der Referenz, Score-Verlauf (Runde → Ø, Benchmark-Niveau), verwendete Kritiker-Modelle und die 3 wichtigsten Änderungen zeigen.
- Abbruch: besten Stand nennen, verbleibende Issues mit Ist/Soll und was ein Mensch entscheiden muss.
- Der Loop-Ordner bleibt liegen; nicht committen, es sei denn, der User will das.
