# Schreib-Standards für App- und Web-Texte

Eigene Zusammenfassung der Kernprinzipien aus drei etablierten Quellen, angewendet auf UI-Text. Bei Detailfragen die Originale lesen:
- Apple Style Guide: https://support.apple.com/guide/applestyleguide/welcome/web · Apple HIG „Writing“: https://developer.apple.com/design/human-interface-guidelines/writing
- Google Developer Documentation Style Guide: https://developers.google.com/style
- ASD-STE100 Simplified Technical English: https://www.asd-ste100.org (Spezifikation kostenlos nach Registrierung)

Wann welcher Standard führt:

| Texttyp | Leitstandard | Warum |
|---|---|---|
| Buttons, Labels, Tabs, Menüs, Alerts, Empty States, Onboarding | Apple | knapp, handlungsorientiert, plattformnah |
| Hilfetexte, Einstellungs-Erklärungen, FAQ, Docs, Changelogs | Google | klar strukturiert, scanbar, aktiv |
| Fehlermeldungen, Warnungen, Sicherheits-/Datenhinweise, Schritt-für-Schritt-Anleitungen | ASD-STE100-Prinzipien | eindeutig, keine Missverständnisse |

## 1. Apple-Prinzipien (UI-Text)
- **So kurz wie möglich, so lang wie nötig.** Jedes Wort muss eine Aufgabe haben. Füllwörter („einfach“, „bitte“, „jetzt“) streichen.
- **Handlung statt Objekt:** Buttons beginnen mit einem Verb und sagen, was passiert: „Entwurf löschen“, nicht „OK“ oder „Ja“.
- **Alerts:** Titel nennt die Situation, Text (optional) Folge oder Ausweg, Buttons sind konkrete Verben. Die sichere Option ist die Standardaktion; destruktive Aktion klar benennen.
- **Nutzerperspektive:** „du/Sie“ statt „der Nutzer“; über die Sache sprechen, nicht über die App („Gespeichert“ statt „Die App hat gespeichert“).
- **Konsistente Begriffe:** Ein Ding hat überall denselben Namen (nicht mal „Projekt“, mal „Arbeitsbereich“).
- **Großschreibung:** Englisch: Title Case für Buttons und Menütitel nach Plattform-Konvention, sonst Sentence case; Deutsch: normale Rechtschreibung, kein Title Case.
- **Kein Fachjargon, keine internen Begriffe,** keine Fehlercodes ohne Erklärung.
- **Zahlen als Ziffern,** Einheiten mit schmalem Leerzeichen, Datums- und Zeitformate lokalisiert.

## 2. Google-Prinzipien (Hilfe- und Erklärtexte)
- **Zweite Person, Präsens, Aktiv:** „Du kannst den Export planen“ statt „Der Export kann geplant werden“.
- **Bedingung vor Anweisung:** „Wenn du offline bist, tippe auf Erneut senden.“
- **Eine Idee pro Satz, kurze Absätze,** Listen für Aufzählungen ab 3 Punkten, nummerierte Listen für Abfolgen.
- **Überschriften in Satzschreibung** und aufgabenorientiert („Daten exportieren“, nicht „Export-Funktionalität“).
- **Keine Abwertung von Schwierigkeit:** „einfach“, „leicht“, „nur“ vermeiden, denn wer scheitert, fühlt sich dumm.
- **Inklusive, neutrale Sprache;** keine Redewendungen, die sich schlecht übersetzen lassen.
- **Link-Texte beschreiben das Ziel** („Datenschutz-Einstellungen öffnen“), nie „hier klicken“.

## 3. ASD-STE100-Prinzipien (Fehler, Warnungen, Anleitungen)
Für Englisch verbindlich anwendbar, für Deutsch sinngemäß übertragen:
- **Ein Wort, eine Bedeutung:** Begriffe nicht variieren, keine Synonyme für dasselbe Ding.
- **Kurze Sätze:** Anweisungen höchstens ~20 Wörter, Beschreibungen höchstens ~25 Wörter.
- **Eine Anweisung pro Satz,** im Imperativ, in der Reihenfolge der Ausführung.
- **Aktiv statt Passiv,** konkrete Subjekte.
- **Warnung zuerst:** Warn- und Sicherheitshinweise stehen vor der Handlung, nicht danach, und nennen Risiko und Vermeidung.
- **Keine Mehrdeutigkeit:** keine Pronomen ohne klaren Bezug, keine verschachtelten Nebensätze, keine Ironie.

## Muster für typische UI-Texte
| Element | Muster | Beispiel |
|---|---|---|
| Primärbutton | Verb + Objekt | „Rechnung senden“ |
| Destruktiv | Verb + Objekt, keine Verharmlosung | „Konto löschen“ |
| Empty State (Erstnutzung) | Was hier hinkommt + erster Schritt | „Hier erscheinen deine Rechnungen. Erstelle die erste in unter einer Minute.“ + „Rechnung erstellen“ |
| Empty State (Filter) | Was nicht gefunden wurde + Ausweg | „Keine Rechnungen im März.“ + „Filter zurücksetzen“ |
| Fehler | Was passiert ist + warum (falls bekannt) + was jetzt hilft | „Die Rechnung wurde nicht gesendet, weil keine Verbindung besteht. Wir senden sie automatisch, sobald du online bist.“ |
| Loading (lang) | Was passiert + ungefähre Dauer | „Bericht wird erstellt (ca. 20 s)“ |
| Bestätigung | Ergebnis im Partizip, optional Undo | „Gelöscht“ + „Widerrufen“ |
| Onboarding | Nutzen in Nutzerworten, 1 Idee pro Screen | „Sieh auf einen Blick, wer noch nicht bezahlt hat.“ |
| Berechtigungsanfrage | Warum + was der Nutzer davon hat, vor dem System-Dialog | „Erlaube Mitteilungen, damit du Zahlungseingänge sofort siehst.“ |
