# UI-States

**Regel:** Jede Ansicht, die Daten lädt, implementiert Loading, Empty, Error und (wo relevant) Offline, und jeder State ist im Code einzeln erreichbar (für Tests und Mockups).

- Loading: Skeleton in Form des echten Layouts, erst ab ~300 ms anzeigen.
- Empty: Erstnutzung und „Filter ergibt nichts“ getrennt, jeweils mit nächster Aktion.
- Error: Klartext und „Erneut versuchen“; Ursache ins Log.
- Den State als explizite Variante modellieren statt aus mehreren Booleans abzuleiten.

**Falsch**
```ts
if (isLoading && !error && !data) …   // unmögliche Kombinationen möglich
```

**Richtig**
```ts
type State<T> =
  | { kind: "loading" }
  | { kind: "empty"; reason: "first-use" | "filtered" }
  | { kind: "error"; message: string }
  | { kind: "ready"; data: T }
```
