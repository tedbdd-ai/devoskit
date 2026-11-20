# AGENTS.md

Regeln für alle KI-Agenten in diesem Repo (Copilot, Claude Code, Codex, Cursor …). Grundlage ist `lifecycle-os`; projektspezifische Abweichungen hier ausdrücklich festhalten.

## Projekt
- **Was:** <eine Zeile, was die App tut und für wen>
- **Stack:** <Sprache, Frameworks, Plattformen>
- **Befehle:** Build `<…>` · Test `<…>` · Lint `<…>` · Dev-Server `<…>`
- **Ticket-System:** <Jira-Projekt / Bitbucket Issues>

## Lebenszyklus und Skills
Skills liegen in `.agents/skills/` (installiert aus `lifecycle-os`, Versionen in `skills-lock.json`). Alle Befehle aus dem Repo-Root.

| Phase | Einstieg |
|---|---|
| Konzeption | `grill-me` / `grill-with-docs` → `to-spec` → `to-tickets` |
| Design | `app-mockup` → `design-loop` → `tweak`; Texte über `tone-of-voice` |
| Dev | `implement` mit `tdd`; vor jedem Commit `code-review` gegen `standards/` |
| Test | Skills des Test OS (eigene Test-App) |
| Deploy | Agent bereitet vor und prüft nach; **deployen tut nur die Pipeline**, Produktion nur nach menschlicher Freigabe |
| Betrieb | Runbook-Skills; ohne Freigabe nur lesen und diagnostizieren |

- Checks (Format, Lint, Typen, Tests) laufen über `lefthook` und Bitbucket Pipelines. Nicht umgehen (`--no-verify` nur auf ausdrücklichen Wunsch).
- Mockups und Prototypen gehören ins Repo: `mockups/<screen>/`. Design-Loop-Protokolle: `.design-loop/`.
- Design-Bibliothek (Referenzen, Stil-Rezepte, Icon-Packs, Markenstimmen): `../design-library` bzw. `$DESIGN_LIBRARY`. Projekt-Tokens (`tokens.css` o. ä.) und `VOICE.md` im Repo haben Vorrang.
- Keine Secrets ins Repo. Persönliche Keys liegen unter `~/.config/`, CI-Secrets als Pipeline-Variablen.

## Anti-Slop (verboten, außer explizit gewünscht)
- Lila/Indigo-Verläufe, Verlaufstext, Glassmorphism und Glow als Ersatz für eine Idee.
- „Hero + 3 Feature-Cards mit Icon“ als Standardlayout; alles zentriert; jede Fläche eine Card mit Schatten.
- Emojis als Icons. Icons nur aus einem einzigen Pack pro Projekt (siehe `icon-packs/` in der Design-Bibliothek).
- Lorem ipsum, „John Doe“, „Acme“, erfundene Kennzahlen („10x faster“, „99.9 % uptime“) und Fake-Testimonials. Platzhaltertexte müssen realistisch und domänenspezifisch sein.
- Generische Marketing-Floskeln („Unlock“, „Supercharge“, „Seamless“, „Elevate“, „Revolutionize“). UI- und Marketing-Texte immer über `/tone-of-voice` schreiben bzw. mit dessen `lint.mjs` prüfen.
- Mehr als 2 Schriftfamilien, mehr als 1 Akzentfarbe ohne Grund, beliebige Abstände/Radien außerhalb der Token-Skala.
- Deko-Animationen ohne Funktion; Animationen ignorieren `prefers-reduced-motion`.
- Hartkodierte Farben/Abstände im Komponenten-Code: immer Tokens (CSS Custom Properties bzw. Asset-Katalog / Theme).

## Apple HIG Standards
- **Tap-Targets:** mindestens 44 × 44 pt (Android 48 × 48 dp), auch wenn das sichtbare Icon kleiner ist. Mindestens 8 pt Abstand zwischen benachbarten Targets.
- **8-pt-Grid:** Abstände, Größen und Radien sind Vielfache von 8 (4 pt als Halbschritt für Feinabstimmung, z. B. Icon-Text-Gap). Keine 5, 10, 15, 18 px.
- **Typografie:** System-Schrift (SF Pro / SF Pro Rounded, auf Android Roboto bzw. Google Sans) als Default; Dynamic Type bzw. `rem` unterstützen; Body ≥ 17 pt auf iOS, ≥ 16 px im Web; Zeilenlänge Fließtext 45–75 Zeichen.
- **Kontrast:** Text ≥ 4.5:1, großer Text und UI-Elemente ≥ 3:1. Light und Dark Mode immer beide liefern und prüfen.
- **Layout:** Safe Areas respektieren (Notch, Home Indicator, Dynamic Island). Navigation nach HIG-Mustern (Tab Bar ≤ 5 Einträge, Navigation Stack, Sheets) statt Eigenbau.
- **Feedback:** Jede Interaktion hat sichtbaren Pressed-State; destruktive Aktionen in Rot mit Bestätigung oder Undo; Haptik sparsam und passend.
- **Barrierefreiheit:** VoiceOver-/Screenreader-Labels für alle Icon-Buttons, sinnvolle Fokus-Reihenfolge, Reduce Motion und Reduce Transparency respektieren.

## Pflicht-States (jede datengetriebene Ansicht)
Keine Ansicht gilt als fertig, solange nicht alle zutreffenden States gebaut und im Mockup/Prototyp zeigbar sind:
1. **Loading:** Skeleton in Form des echten Layouts (kein bildschirmfüllender Spinner); Spinner nur für kurze Aktionen in Buttons. Ab ~300 ms anzeigen, kein Flackern.
2. **Empty:** Erklärt, warum leer, und bietet die nächste Aktion (primärer Button). Erstnutzung und „Filter ergibt nichts“ unterscheiden.
3. **Error:** Klartext, was passiert ist, plus „Erneut versuchen“. Keine rohen Fehlercodes oder Stacktraces.
4. **Offline / Teil-Daten:** Gecachte Daten zeigen und den Zustand kennzeichnen.
5. **Ideal + Extremfälle:** sehr lange Namen, 0/1/viele Einträge, große Dynamic-Type-Stufen.

Bei Mockups und Prototypen: State-Umschalter (oder je State ein Frame) einbauen, damit alle States prüfbar sind.

## Arbeitsweise
- Vor dem Bauen: Zielgruppe, Kernaufgabe und gewählte Stil-Richtung in 2–3 Sätzen festhalten.
- Nach dem Bauen: Screenshot rendern (agent-browser) und selbst gegen diese Regeln prüfen, bevor „fertig“ gemeldet wird.