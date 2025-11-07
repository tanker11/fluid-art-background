# Archive - Régi Fájlok

Ez a mappa a projekt korábbi verzióinak fájljait tartalmazza, amelyek már nem szükségesek a production vagy lokális teszthez, de megőrzésre kerültek referencia céljából.

## Archiválás Dátuma
2025-11-06

---

## Tartalmi Csoportok

### 1. Teszt HTML Fájlok (9 db)

Korábbi kísérletezések és teszt fájlok a Fluid-JS integrációhoz:

- `index.html` - Eredeti demo oldal
- `test-custom-build.html` - Custom build korai teszt
- `test-initial-splats.html` - Kezdeti splat-ok tesztelése
- `test-inject-direct.html` - Direct inject script teszt
- `test-minified.html` - Minified verzió teszt
- `test-standalone.html` - Standalone teszt (kézi paraméterezéssel)
- `test-unas-ready-parametric.html` - UNAS deployment teszt (régi verzió)
- `test-vivid-colors.html` - Élénk színek kísérlet
- `test-white-override.html` - Fehér init folt override teszt

**Miért archiválva:** Ezek korábbi iterációk, amelyek segítettek megérteni a problémákat (piros folt, random színek, multi_color issue). A végső verzió: `test-fluidart-final.html` (root-ban).

---

### 2. Minified Build-ek (3 db)

Korábbi build kísérletek:

- `fluid-background.min.js` (7 KB) - drakerie.js port (Canvas 2D, organic cells)
- `fluid-js-custom.min.js` - Korai Fluid-JS custom build (Webpack 4)
- `fluid-js-custom-fixed.min.js` - Node.js patchelt verzió (regex replacements)

**Miért archiválva:** Ezek kísérleti build-ek voltak, amelyek nem tartalmazták a teljes custom módosításokat (createSplat API, init splat removal). A végső verzió: `dist/fluid-js-custom-final.min.js`.

---

### 3. Inject Script-ek (2 db)

UNAS deployment script-ek korábbi verziói:

- `inject_custom_fluid_parametric.js` - Parametrikus verzió (CDN-ről töltés, háttérszín öblítés stratégia)
- `inject_fluid_canvas.js` - Első UNAS integráció (fehér folt öblítés)

**Miért archiválva:** Ezek workaround megoldásokat tartalmaztak (background color flushing), de nem használták a custom build-et. Az új verzió (`inject_fluidart_final.js`) a custom build `createSplat()` API-ját használja majd.

---

### 4. Dokumentációs Fájlok (3 db)

Korábbi dokumentációk és changelogs:

- `CHANGELOG_VIVID_COLORS.md` - Élénk színek kísérlet changelog
- `CUSTOM_BUILD_GUIDE.md` - Korai custom build útmutató
- `TEST_FILES_OVERVIEW.md` - Teszt fájlok áttekintése (régi verziók)

**Miért archiválva:** Ezek a korábbi iterációk dokumentációi. Az aktuális dokumentáció: `CLAUDE.md` (Custom Fluid-JS Build Specifikáció).

---

## Fontos Tanulságok (miért archiváltuk ezeket)

### Probléma #1: Init Splat
**Eredeti probléma:** `multipleSplats()` hívás az `initializer.js:284`-ben hardcoded fehér/piros foltot hozott létre.

**Workaround (archived):** Háttérszín öblítés stratégia (inject scriptekben).

**Végleges megoldás:** Init splat eltávolítása a forrásból + custom build.

---

### Probléma #2: Random Színek
**Eredeti probléma:** `multi_color: true` default a `defaults.js`-ben → `generateColor()` futott 100ms-enként.

**Workaround (archived):** Explicit `mapBehaviors({ multi_color: false })` override.

**Végleges megoldás:** `multi_color: false` default a custom build forrásban.

---

### Probléma #3: Kontroll Hiánya
**Eredeti probléma:** Csak MouseEvent szimulációval lehetett splat-ot létrehozni, nincs programmatikus API.

**Workaround (archived):** Összetett MouseEvent dispatch mechanizmus.

**Végleges megoldás:** `createSplat()` API a custom build-ben.

---

## Aktív Fájlok (Production Ready)

A projektben jelenleg **csak ezek** a fájlok aktívak:

### Root
- `test-fluidart-final.html` - Lokális teszt (custom build + createSplat API)
- `CLAUDE.md` - Teljes projekt dokumentáció
- `README.md` - GitHub readme

### Dist
- `fluid-js-custom-final.min.js` (41.1 KB) - Custom Fluid-JS build (Webpack 5)

### Src (TODO)
- `src/to_unas/inject_fluidart_final.js` - UNAS deployment script (még nincs létrehozva)

---

## Archiválási Döntési Fa

**Kérdés:** Ez a fájl production-ready?
- **Igen** → Maradt a root/dist-ben
- **Nem** → Archívum

**Kérdés:** Ez a fájl szükséges lokális teszthez?
- **Igen** → Maradt (test-fluidart-final.html)
- **Nem** → Archívum

**Kérdés:** Ez a fájl workaround megoldást tartalmaz?
- **Igen** → Archívum (a végleges megoldás custom build)
- **Nem** → Megtartva

---

## Visszaállítás (ha szükséges)

Ha bármilyen okból vissza kell állítani egy régi fájlt:

```bash
# Példa: Visszaállítás egy régi test fájlra
cp archive/test-standalone.html ./

# Vagy diff ellenőrzés
diff archive/inject_custom_fluid_parametric.js src/to_unas/inject_fluidart_final.js
```

---

**Megjegyzés:** Ez az archívum **NEM törölhető**, mivel fontos referencia a projekt fejlődési útjához és a problémamegoldási stratégiákhoz.
