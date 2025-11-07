# UNAS Fehér Ablak Hibaelhárítás

## Probléma
Az UNAS webshopban a fluid art háttér helyett csak egy **fehér ablak** jelenik meg.

---

## Oka - Lehetséges Okok

| Ok | Jel | Megoldás |
|-----|-----|----------|
| **Fluid library nem töltődött be** | F12 Console: "Fluid not loaded" | HEAD-ben betöltött a `fluid-js-custom-final.min.js`? |
| **WebGL nem inicializálódott** | Fehér canvas, no errors | Canvas méret: 0x0? |
| **Splat-ok nem jönnek létre** | Fehér/szürke, mozgás nincs | createSplat() nem elérhető |
| **Canvas z-index problem** | Fehér alatt van a tartalom | Canvas z-index: -1? |
| **UNAS CSS override** | Canvas elrejtve vagy fekete | UNAS CSS interfere? |
| **Timing probléma** | Gyors fehér flash, majd OK | `scriptLoadDelay` túl rövid |

---

## Diagnosztikai Lépések

### 1. Lépés: Console Log Ellenőrzés

**Nyisd meg: F12 → Console tab**

Keresd meg ezeket az üzeneteket (sorrendben):

```
✅ [FluidArt] Canvas létrehozása...
✅ [FluidArt] Canvas OK - DOM elem beillesztve
🎨 Canvas méret: 1920 x 1080
📍 Canvas z-index: -1
✅ [FluidArt] Fluid library check (501ms)...
✅ [FluidArt] Fluid példány létrehozása...
✅ [FluidArt] Fluid példány OK
✅ [FluidArt] Fluid behavior-ok alkalmazva
✅ [FluidArt] Fluid aktiválása...
✅ [FluidArt] Fluid aktiválva - WebGL inicializálás kész
✅ WebGL context betöltve
✅ [FluidArt] Splat-ok ütemezése (4 db)...
✅ [FluidArt] Splat #1 létrehozva (1002ms, szín: RGB(204,51,255))
✅ [FluidArt] Splat #2 létrehozva (1202ms, szín: RGB(0,255,255))
✅ [FluidArt] Splat #3 létrehozva (2802ms, szín: RGB(204,51,255))
✅ [FluidArt] Splat #4 létrehozva (5002ms, szín: RGB(255,215,0))
✅ [FluidArt] Összes splat ütemezve - animáció indítva!
```

### 2. Lépés: Hibaüzenet Azonosítása

**Ha ezeket látod, akkor:**

#### ❌ "Fluid library nem töltődött be"
```
❌ [FluidArt] HIBA: Fluid library nem töltődött be!
❌ Fluid global object nincs definiálva!
```

**Okozat:**
- HEAD-ben nincs a `fluid-js-custom-final.min.js`
- Hibás CDN URL
- Script betöltési hiba

**Megoldás:**
```html
<!-- UNAS HEAD section -->
<script src="https://cdn.jsdelivr.net/gh/USERNAME/fluid-art-background@main/dist/fluid-js-custom-final.min.js"></script>
<!-- VAGY inline: másold be a fluid-js-custom-final.min.js teljes tartalmát -->
```

---

#### ❌ "Fluid init hiba"
```
❌ [FluidArt] HIBA Fluid konstruktorban: ...
❌ Fluid init hiba: ...
```

**Okok:**
- Canvas mérete: 0x0
- WebGL nem támogatott böngészőben
- UNAS DOM konfliktus

**Megoldás:**
```javascript
// Ellenőrizd az F12 Console-ban:
console.log('Canvas:', document.getElementById('fluidArtCanvas'));
console.log('Canvas size:', canvas.width, 'x', canvas.height);
console.log('WebGL support:', !!document.createElement('canvas').getContext('webgl2'));
```

---

#### ❌ "createSplat() nem elérhető"
```
❌ [FluidArt] HIBA: createSplat() metódus nem elérhető!
❌ createSplat() nem található!
```

**Okozat:**
- Nem a custom build-et használod (régi Fluid-JS)
- HEAD-ben a hivatalos Fluid library helyett van

**Megoldás:**
```bash
# Biztos vagy-e, hogy a fluid-js-custom-final.min.js-t feltöltötted a HEAD-be?
# NEM a fluid.min.js, hanem fluid-js-custom-final.min.js!
```

---

#### ⚠️ Splat RGB értékek nulla
```
⚠️ [FluidArt] Splat #1 létrehozva (1002ms, szín: RGB(0,0,0))
```

**Probléma:**
- Pure black (0,0,0) nem látható WebGL additív blending miatt
- Kód: `⚠️ Pure black (0,0,0) will not be visible...`

**Megoldás:**
```javascript
// dist/unas-inject-config.js - CONFIG.colors módosítása
colors: [
    { r: 5, g: 5, b: 5 },    // HELYETT: { r: 0, g: 0, b: 0 }
    // Vagy másik szín választása
]
```

---

### 3. Lépés: Visual Debug

**F12 → Elements tab → Keresd meg a canvas-t:**

```html
<canvas id="fluidArtCanvas"
    width="1920"
    height="1080"
    style="display:block;width:100vw;height:100vh;position:fixed;top:0;left:0;z-index:-1;pointer-events:none;background:transparent;margin:0;padding:0;">
</canvas>
```

**Ellenőrizd:**
- ✅ `id="fluidArtCanvas"` létezik?
- ✅ `width` és `height` > 0?
- ✅ `z-index: -1` (háttér mögé)?
- ✅ `position: fixed` (teljes képernyő)?
- ✅ `display: block` (nem hidden)?

---

### 4. Lépés: UNAS CSS Konfliktus

**F12 → Inspect canvas → Computed styles**

Keresd ezeket az értékeket:

```css
position: fixed;          /* KELL! */
top: 0;                   /* KELL! */
left: 0;                  /* KELL! */
width: 100vw;             /* KELL! */
height: 100vh;            /* KELL! */
z-index: -1;              /* KELL! (háttér mögé) */
pointer-events: none;     /* KELL! (átlátszó az egérnek) */
display: block;           /* KELL! */
```

**Ha hiányzik vagy más érték:**
- UNAS CSS override-olja a style-okat
- Megoldás: `!important` flag hozzáadása

```javascript
// dist/unas-inject-config.js módosítása
canvas.style.cssText = '...; z-index: -1 !important; position: fixed !important;';
```

---

## Gyors Tesztelés

### Online UNAS Tesztelés

```javascript
// F12 Console-ba másolva (másolod az UNAS-ból):
// Ellenőrizd, hogy betöltődik-e az animáció 5 másodperc alatt
```

### Lokális Tesztelés

```bash
# test-unas-deployment.html ugyanazt az init kódot használja
# Ha működik lokálisan, akkor UNAS-ban is működnie kell!
```

---

## Megoldások Prioritási Sorrendje

1. **Fluid library betöltésének ellenőrzése** (F12 Network tab)
2. **Canvas méret ellenőrzése** (F12 Elements → Inspect canvas)
3. **WebGL support tesztelése** (böngésző támogatás?)
4. **Splat RGB értékek ellenőrzése** (ne legyen pure black)
5. **Timing paraméterek módosítása** (scriptLoadDelay, splatCreationDelay)
6. **z-index és position CSS** (UNAS CSS conflict?)
7. **UNAS cache törlése** (teljesen új betöltés)

---

## Közös Problémák és Megoldások

### Probléma: "Rövid fehér flash, majd OK"
**Ok:** `scriptLoadDelay` túl rövid

**Megoldás:**
```javascript
timing: {
    scriptLoadDelay: 1000,        // 500 → 1000ms
    fluidInitDelay: 500,
    splatCreationDelay: 500,
}
```

---

### Probléma: "Folyamatos fehér, nincs animáció"
**Ok:** Splat-ok nem jönnek létre

**Megoldás:**
```javascript
// F12 Console:
console.log('Fluid library:', typeof Fluid);
console.log('createSplat:', myFluid?.createSplat);

// Ha undefined: HEAD-ben van a build?
```

---

### Probléma: "Fekete canvas, kattintás után szín jelenik meg"
**Ok:** Canvas inicializálása jó, de splat-ok automatikusan nem jönnek

**Megoldás:**
```javascript
// initialSplats tömb üres?
// Vagy delay értékek nagyok (5000ms+)?
```

---

### Probléma: "UNAS-ban fehér, lokálisan OK"
**Ok:** UNAS JavaScript context eltér

**Megoldás:**
1. Növeld `scriptLoadDelay` (500 → 2000)
2. Ellenőrizd: `window.Fluid` elérhető?
3. Inkognitó mód tesztelés
4. UNAS cache törlése

```javascript
// F12 Console teszt:
window.Fluid
typeof Fluid
document.getElementById('fluidArtCanvas')
```

---

## Debug Mód Aktiválása

### Részletes Logging

Módosítsd az `unas-inject-config.js` fájlt:

```javascript
// Adj hozzá a top-ba:
console.log = (function(log) {
    return function() {
        console.log(...arguments);  // Original console log
        // Plusz telemetry, ha szükséges
    };
})(console.log);
```

### Timing Analysis

```javascript
// F12 Console:
console.time('FluidArt');
// ... init kód fut
console.timeEnd('FluidArt');
```

---

## Végső Tipp

**Ha továbbra is fehér az ablak:**

1. **Másolj mindent az F12 Console-ból** (minden üzenet, hiba)
2. **Készíts egy screenshot-ot** az F12 Elements panelről (canvas inspect)
3. **Ellenőrizd**: LOCAL teszt (`test-unas-deployment.html`) működik?
4. **Ha lokálisan működik**: a probléma UNAS-specifikus → timing, cache, CSS conflict
5. **Ha lokálisan sem**: a probléma a build-ben → rebuild szükséges

---

## Hasznos Linkek

- **UNAS Dashboard:** Admin panel → Megjelenés → JavaScript/CSS
- **Lokális Teszt:** `test-unas-deployment.html`
- **Build File:** `dist/fluid-js-custom-final.min.js`
- **Config File:** `dist/unas-inject-config.js`

---

**🔍 Debug Console Output Minta:**

```
🎨 Canvas méret: 1920 x 1080
📍 Canvas z-index: -1
✅ [FluidArt] Canvas OK
✅ [FluidArt] Fluid library check (501ms)
✅ [FluidArt] Fluid példány OK
✅ [FluidArt] Fluid aktiválva
✅ WebGL context betöltve
✅ [FluidArt] Splat #1 létrehozva (1002ms, RGB(204,51,255))
✅ Animáció fut!
```

Ha ezt látod → **Működik!** 🎉

---

**Última módosítás: 2025-11-07**
