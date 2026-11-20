---
name: app-mockup
description: Creates three clearly different app screen variants side by side on one canvas HTML page (phone frames), renders a screenshot and lets the user pick or mix a direction. Use when the user types /app-mockup, asks for app mockups, screen variants, "3 Varianten", design directions or options for an iOS/Android/mobile web screen before building it.
---

# /app-mockup — 3 Varianten auf einer Canvas-Seite

Design-Bibliothek (Referenzen, Stil-Rezepte, Icon-Packs, Markenstimmen): `$DESIGN_LIBRARY`, Standard `../design-library` (Geschwister-Ordner des App-Repos). Alle Befehle aus dem Repo-Root.

Ziel: Für einen Screen drei **wirklich verschiedene** Richtungen nebeneinander zeigen, damit der User schnell wählt oder Elemente kombiniert. Es gelten alle Regeln aus `AGENTS.md` (Anti-Slop, Apple HIG, Pflicht-States).

## 1. Intake & Referenz-Suche (kurz, max. 1 Rückfrage)
- Kläre aus Anfrage und Projekt: Screen + Kernaufgabe, Plattform (iOS default), Zielgruppe, Marken-Tokens falls vorhanden (`tokens.css`, Theme-Dateien, `DESIGN.md`). Fehlt etwas, sinnvolle Annahme treffen und nennen.
- **Referenz-Pflicht (9–12 Vorbilder):** Prüfe zuerst `$DESIGN_LIBRARY/references/` auf passende UI-Screenshots. Falls keine vorhanden sind, nutze verfügbare MCPs (**Inspo MCP**, **Awwwards MCP**) oder orientiere dich an kuratierten Design-Systemen (z. B. von `styles.refero.design` wie Linear, Mercury, Apple), statt aus dem Gedächtnis zu raten.

## 2. Richtungen & Typografie festlegen
- Lies `$DESIGN_LIBRARY/style-recipes/` und wähle bis zu 3 passende Rezepte; sonst eigene Richtungen definieren.
- Die drei Varianten müssen sich in **mindestens zwei** Achsen unterscheiden: Layout/Informationsarchitektur, Typografie, Dichte, Farbstimmung, Interaktionsmuster. Nur Farbe tauschen zählt nicht.
- **Anti-Slop-Typografie:** Verwende niemals generische Standard-Systemfonts ohne Konzept. Nutze charakterstarke UI-Schriften (z. B. aus Fontshare/Fontesk) und `tabular-nums` für Zahlenwerte.
- Pro Variante: Name (2–3 Wörter) + eine Zeile Begründung (inkl. Referenz-Bezug).

## 3. Canvas bauen (Statisch vor Animation!)
- **Keine Animationen im Mockup:** Baue alle Screens zunächst komplett statisch (keine Scroll- oder Einstiegs-Animationen), damit Layout, Abstände und Hierarchie unverfälscht bewertet werden können.
- Kopiere `assets/canvas.html` aus diesem Skill-Ordner nach `./mockups/<screen-slug>/index.html` im Projekt (ohne Projekt: `$DESIGN_LIBRARY/mockups/<datum>-<slug>/`).
- Fülle die drei `<section class="frame">`-Bereiche. Jede Variante bekommt eigene Tokens über `style="--accent:…"` usw. am Frame, keine hartkodierten Werte in den Elementen.
- Echte, domänenspezifische Inhalte (keine KI-Floskeln oder Platzhalter wie „Lorem Ipsum“); Icons aus einem einheitlichen Pack (`$DESIGN_LIBRARY/icon-packs/`) als Inline-SVG.
- Jeder Frame hat oben den State-Umschalter (Ideal / Loading / Empty / Error). Alle vier States pro Variante umsetzen (`data-state`-Blöcke im Template).
- Integriere oben in der Canvas-Leiste ein optionales **Live-Tweak-Panel** (ausklappbare Slider für `--radius`, `--spacing-scale`, `--accent`), mit dem der User die gewählte Variante live feintunen und die CSS-Tokens kopieren kann.
- Tap-Targets ≥ 44 pt, 8-pt-Grid, Safe-Area-Abstände (Status Bar 54 pt, Home Indicator 34 pt im Frame berücksichtigt).

## 4. Rendern und Anti-Slop-Audit
```bash
agent-browser set viewport 1440 1000 2
agent-browser open "file://$PWD/mockups/<slug>/index.html"
agent-browser screenshot mockups/<slug>/canvas.png
