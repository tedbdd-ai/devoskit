# Fehlerbehandlung

**Regel:** Fehler werden dort behandelt, wo man sinnvoll reagieren kann, sonst mit Kontext weitergereicht. Nie still verschlucken.

- Kein leeres `catch`/`except`. Wer bewusst ignoriert, schreibt einen Kommentar mit Grund.
- Beim Weiterreichen Kontext anhängen: *was* wurde versucht, mit welcher ID/Eingabe.
- Nutzerseitig: Klartext plus nächster Schritt (siehe Pflicht-States in `AGENTS.md`); technische Details ins Log, nicht in die UI.
- Erwartbare Fehler (Validierung, „nicht gefunden“) sind keine Exceptions im Normalablauf, sondern Rückgabewerte bzw. Ergebnis-Typen, sofern die Sprache das üblich macht.

**Falsch**
```ts
try { await save(invoice) } catch {}
```

**Richtig**
```ts
try {
  await save(invoice)
} catch (err) {
  throw new Error(`Rechnung ${invoice.id} konnte nicht gespeichert werden`, { cause: err })
}
```
