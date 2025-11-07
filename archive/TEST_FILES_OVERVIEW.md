# Teszt Fájlok Áttekintés

## 🧪 Melyik HTML fájlt használd?

| Fájl | Használt Script | Cél | Módosítható? |
|------|----------------|-----|--------------|
| **test-inject-direct.html** | `inject_custom_fluid_parametric.js` | **HASZNÁLD EZT!** Inject script direkt tesztelése | ✅ Igen - módosítsd az inject file-t |
| test-vivid-colors.html | Inline kód (SAJÁT) | Önálló teszt | ❌ Nem - csak ezt a fájlt |
| test-custom-build.html | Inline kód (SAJÁT) | Custom build teszt | ❌ Nem - csak ezt a fájlt |
| test-unas-ready-parametric.html | `eval()` trükk | UNAS telepítési guide | ⚠️ Bonyolult |

---

## ✅ **AJÁNLOTT**: test-inject-direct.html

**Mit csinál:**
1. Betölti a `dist/fluid-js-custom.min.js` fájlt
2. Fetch-el beolvassa a `src/to_unas/inject_custom_fluid_parametric.js` fájlt
3. Módosítja a script betöltési sort (mert már betöltöttük)
4. Végrehajtja az inject kódot

**Előnyök:**
- ✅ **Minden módosítás** az `inject_custom_fluid_parametric.js` fájlban azonnal látszik
- ✅ Ugyanaz a kód, mint amit UNAS-ra fogsz feltölteni
- ✅ Console log-ok (F12)
- ✅ Info panel bal felső sarokban

**Használat:**
```bash
# Nyisd meg böngészőben:
test-inject-direct.html

# Módosítsd a paramétere ket:
src/to_unas/inject_custom_fluid_parametric.js

# Frissítsd a böngészőt (F5)
```

---

## 🔍 Debugging - Ha még mindig random színeket látsz

### 1. Console log ellenőrzés

Nyisd meg a **DevTools (F12) → Console** tabot. Látnod kell:

```
📥 Inject script betöltve
🎨 Canvas létrehozva
✅ Custom Fluid library betöltve
✅ Fluid példány létrehozva
✅ Fizikai paraméterek beállítva: {dissipation: 1, velocity: 0.999, emitter_size: 0.5, curl: 10}
✅ Fluid aktiválva (fehér folt inicializálva)
🧹 Kezdeti folt öblítése háttérszínnel...
✅ Kezdeti folt öblítve (háttérszín: r=255, g=255, b=255)
🎨 Splat 1 kezdés - szín: türkiz (r=0, g=255, b=255)
✅ Splat 1/5 kész
🎨 Splat 2 kezdés - szín: lila (r=204, g=51, b=255)
✅ Splat 2/5 kész
🎨 Splat 3 kezdés - szín: királykék (r=0, g=128, b=255)
✅ Splat 3/5 kész
🎨 Splat 4 kezdés - szín: türkiz (r=0, g=255, b=255)
✅ Splat 4/5 kész
🎨 Splat 5 kezdés - szín: lila (r=204, g=51, b=255)
✅ Splat 5/5 kész
✅ Fluid Art háttér inicializálva!
```

### 2. Ha látod: "multi_color: true"

**Probléma:** A `mapBehaviors()` nem alkalmazta a beállítást.

**Megoldás:** Ellenőrizd, hogy a `PHYSICS_CONFIG.multi_color` valóban `false`-e:

```javascript
// src/to_unas/inject_custom_fluid_parametric.js (40. sor)
multi_color: false,  // ← FONTOS!
```

### 3. Ha látod random RGB értékeket a console-ban

**Példa (ROSSZ):**
```
🎨 Splat 1 kezdés - szín: türkiz (r=123, g=45, b=89)  ← RANDOM!
```

**Megoldás:** A `generateColor()` függvény fut. Ellenőrizd:
- `multi_color: false` be van állítva
- A `myFluid.mapBehaviors()` meghívódott AKTIVÁLÁS ELŐTT

### 4. Ha látod fehéres árnyalatokat

**Probléma:** A kezdeti fehér folt nem lett öblítve.

**Megoldás:** Ellenőrizd a console log-ot:
```
✅ Kezdeti folt öblítve (háttérszín: r=255, g=255, b=255)
```

Ha ez NINCS ott → az öblítés nem futott le.

---

## 📊 Paraméterek (inject_custom_fluid_parametric.js)

### Jelenlegi beállítások:

```javascript
const PHYSICS_CONFIG = {
    sim_resolution: 512,         // 128 → 512 (élesebb)
    dye_resolution: 512,
    dissipation: 1,              // 0.998 → 1 (NINCS halványodás!)
    velocity: 0.999,
    pressure: 0.8,
    pressure_iteration: 20,
    curl: 10,
    emitter_size: 0.5,           // 2.5 → 0.5 (kisebb foltok)
    multi_color: false,          // ← FONTOS: NINCS random szín!
    background_color: { r: 255, g: 255, b: 255 }
};

const INITIAL_SPLATS = {
    count: 5,
    delay_between: 300,
    move_distance: 200,          // 200px drag
    move_steps: 8,               // 8 intermediate lépés
    drag_duration: 120
};
```

### Ha módosítod ezeket:

1. Mentsd a fájlt: `src/to_unas/inject_custom_fluid_parametric.js`
2. Frissítsd a böngészőt: `F5`
3. Ellenőrizd a console log-ot

---

## 🚨 Gyakori hibák

### 1. "Nem látok változást"

**Ok:** Nem a `test-inject-direct.html` fájlt használod.

**Megoldás:** Nyisd meg: [test-inject-direct.html](test-inject-direct.html)

### 2. "Még mindig random színek"

**Ok:** A `multi_color: false` nincs beállítva, vagy nem alkalmazódott.

**Megoldás:**
- Ellenőrizd: `src/to_unas/inject_custom_fluid_parametric.js` (40. sor)
- Console log: keresdmeg `multi_color: false` üzenetet

### 3. "Browser cache probléma"

**Megoldás:** Hard reload:
- **Windows:** `Ctrl + F5` vagy `Ctrl + Shift + R`
- **Mac:** `Cmd + Shift + R`

---

## 📝 Következő lépések

1. ✅ Nyisd meg: [test-inject-direct.html](test-inject-direct.html)
2. ✅ Console (F12) - figyeld a log-okat
3. ✅ Ellenőrizd:
   - Türkiz → Lila → Kék → Türkiz → Lila sorrend
   - NINCS random szín
   - NINCS fehéres árnyalat
4. ✅ Ha működik → módosítsd a paramétereket
5. ✅ Ha nem működik → küldd el a console log-ot

---

**Gyors teszt parancs:**

```bash
# Nyisd meg böngészőben:
test-inject-direct.html

# Módosítsd:
src/to_unas/inject_custom_fluid_parametric.js

# Frissítsd:
F5 (vagy Ctrl+F5)
```

✅ **Ez a fájl használja a valódi inject script-et!**
