# Custom Fluid-JS Build - UNAS Telepítési Útmutató

## 📦 Mi ez a projekt?

Ez egy **módosított Fluid-JS build**, amelyben a **piros/fehér kezdeti folt problémát** kijavítottuk, és **paraméterezett** verziót készítettünk a fluidartshop.hu webshop számára.

---

## 🎯 Fő jellemzők

### Javított funkciók:
- ✅ **Fehér kezdeti folt** - fehér háttéren láthatatlan (eredeti: piros)
- ✅ **Paraméterezett fizika** - dissipation: 0.998, velocity: 0.999, emitter_size: 2.5
- ✅ **Lassú, folyékony animáció** - fluid art esztétikához igazítva
- ✅ **Egér interakció** - kattintás nélkül, mozgásra reagál
- ✅ **UNAS kompatibilis** - script injektálással telepíthető

### Fájlok:
| Fájl | Méret | Leírás |
|------|-------|--------|
| `dist/fluid-js-custom.min.js` | 39.5 KB | Custom build (fehér folt fix) |
| `src/to_unas/inject_custom_fluid_parametric.js` | ~7 KB | UNAS injektálható kód |
| `test-unas-ready-parametric.html` | ~10 KB | Lokális teszt oldal |

---

## 🚀 Telepítés (UNAS)

### 1. lépés: Custom build publikálása

A `dist/fluid-js-custom.min.js` fájlt fel kell tölteni valahova, hogy elérhető legyen URL-en keresztül.

#### Opció A: GitHub + jsDelivr CDN (Ajánlott)

1. **Commit + Push** a repo-ba:
   ```bash
   git add dist/fluid-js-custom.min.js
   git commit -m "Add custom Fluid-JS build with white spot fix"
   git push origin main
   ```

2. **jsDelivr URL** (automatikus CDN):
   ```
   https://cdn.jsdelivr.net/gh/USERNAME/fluid-art-background@main/dist/fluid-js-custom.min.js
   ```

   Cseréld le:
   - `USERNAME` → GitHub felhasználóneved
   - `fluid-art-background` → Repo neve

3. **Teszt**: Nyisd meg a fenti URL-t böngészőben → le kellene töltenie a fájlt

#### Opció B: UNAS File Manager

1. **UNAS Admin Panel → Fájlkezelő**
2. Hozz létre egy `scripts` vagy `assets` mappát
3. Töltsd fel a `fluid-js-custom.min.js` fájlt
4. Jegyezd fel az URL-t (pl. `https://fluidartshop.hu/scripts/fluid-js-custom.min.js`)

---

### 2. lépés: URL frissítése az inject scriptben

Nyisd meg: `src/to_unas/inject_custom_fluid_parametric.js`

**93. sor környékén** találod:

```javascript
// FONTOS: Cseréld le ezt az URL-t a saját GitHub/CDN URL-edre!
script.src = 'dist/fluid-js-custom.min.js';  // ⚠️ CSERÉLD LE ÉLES URL-RE!
```

**Cseréld le** a saját URL-edre:

```javascript
// GitHub CDN példa:
script.src = 'https://cdn.jsdelivr.net/gh/USERNAME/fluid-art-background@main/dist/fluid-js-custom.min.js';

// Vagy UNAS file manager példa:
script.src = 'https://fluidartshop.hu/scripts/fluid-js-custom.min.js';
```

---

### 3. lépés: Paraméterek finomhangolása (opcionális)

A `inject_custom_fluid_parametric.js` fájl elején (12-70. sorok) találod a paramétereket:

```javascript
const PHYSICS_CONFIG = {
    dissipation: 0.998,      // Színvesztés (0.9-1.0, magasabb = lassabb)
    velocity: 0.999,         // Sebesség lassulás (0.9-1.0, magasabb = lassabb)
    emitter_size: 2.5,       // Folt méret (0.1-3.0)
    curl: 10,                // Örvénylés (0-50)
    // ... további paraméterek
};

const FLUID_COLORS = [
    { r: 0, g: 255, b: 255 },    // Türkiz
    { r: 204, g: 51, b: 255 },   // Lila
    { r: 0, g: 128, b: 255 }     // Királykék
];

const INITIAL_SPLATS = {
    count: 5,                    // Hány kezdeti folt
    delay_between: 250,          // Késleltetés splat-ok között (ms)
    move_distance: 50,           // Húzás távolság (px)
    move_steps: 1                // Húzás lépések száma
};
```

**Módosíthatod** ezeket az értékeket ízlés szerint!

---

### 4. lépés: UNAS-ba injektálás

1. **UNAS Admin Panel → Fejlesztőknek → Script kezelés** (vagy hasonló menü)
2. **Script típus:** `<body>` vége (BODY END)
3. **Másold be** a teljes `inject_custom_fluid_parametric.js` tartalmát
4. **Mentés**

---

## 🧪 Lokális tesztelés

Telepítés előtt **teszteld lokálisan**:

```bash
# Nyisd meg a tesztelő HTML-t böngészőben
open test-unas-ready-parametric.html

# Vagy indíts egy lokális szervert
python -m http.server 8000
# Nyisd meg: http://localhost:8000/test-unas-ready-parametric.html
```

### Ellenőrzési lista:

- ☐ **Piros folt NINCS** - fehér háttéren láthatatlan kezdeti folt
- ☐ **5 színes splat** megjelenik (türkiz, lila, kék)
- ☐ **Egér mozgásra** reagál (kattintás nélkül)
- ☐ **Lassú, folyékony** animáció
- ☐ Nincs console hiba (F12 → Console)

---

## 📊 Paraméterek Magyarázata

| Paraméter | Érték | Tartomány | Hatás |
|-----------|-------|-----------|-------|
| `dissipation` | 0.998 | 0.9-1.0 | Lassabb halványodás (magasabb = tovább marad látható) |
| `velocity` | 0.999 | 0.9-1.0 | Lassabb lassulás (magasabb = lassabb fluid mozgás) |
| `emitter_size` | 2.5 | 0.1-3.0 | Nagyobb foltok |
| `curl` | 10 | 0-50 | Alacsonyabb örvénylés (simább áramlás) |
| `sim_resolution` | 128 | 32-512 | Szimuláció felbontása (alacsonyabb = gyorsabb) |
| `dye_resolution` | 512 | 128-2048 | Színek felbontása (magasabb = élesebb) |
| `pressure` | 0.8 | 0.0-1.0 | Nyomás erőssége |
| `pressure_iteration` | 20 | 10-50 | Nyomás számítás pontossága |

### Egér interakció:

| Paraméter | Érték | Hatás |
|-----------|-------|-------|
| `speed_threshold` | 300 | Minimális sebesség (px/frame) a splat létrehozásához |
| `throttle_rate` | 3 | Minden hányadik mozdulatnál reagáljon (1 = minden, 3 = minden 3.) |

---

## 🎨 Színpaletta

Fluid art színek (RGB formátum):

```javascript
{ r: 0, g: 255, b: 255 }      // Türkiz (#00ffff)
{ r: 204, g: 51, b: 255 }     // Lila (#cc33ff)
{ r: 0, g: 128, b: 255 }      // Királykék (#0080ff)
```

**Saját színek hozzáadása:**

```javascript
const FLUID_COLORS = [
    { r: 0, g: 255, b: 255 },       // Türkiz
    { r: 204, g: 51, b: 255 },      // Lila
    { r: 0, g: 128, b: 255 },       // Királykék
    { r: 255, g: 105, b: 180 },     // Pink (új)
    { r: 255, g: 215, b: 0 }        // Arany (új)
];
```

---

## 🔧 Build módosítása (fejlesztőknek)

Ha módosítani szeretnéd a `multipleSplats()` függvényt:

### 1. Klónozd a Fluid-JS repo-t:

```bash
git clone https://github.com/PavelDoGreat/WebGL-Fluid-Simulation.git
cd WebGL-Fluid-Simulation
```

### 2. Módosítsd a `src/initializer.js` fájlt:

**Eredeti (694-703. sor):**

```javascript
function multipleSplats(amount) {
    let color = {
        r: 255,
        g: 0,        // PIROS!
        b: 0
    };

    splat(500, 500, 100, 0, color);
}
```

**Módosított (FEHÉR):**

```javascript
function multipleSplats(amount) {
    let color = {
        r: 255,
        g: 255,      // FEHÉR!
        b: 255
    };

    splat(500, 500, 100, 0, color);
}
```

### 3. Build:

```bash
npm install
npm run build
```

### 4. Másold át:

```bash
cp dist/fluid.min.js /path/to/fluid-art-background/dist/fluid-js-custom.min.js
```

---

## ⚠️ Gyakori hibák

### 1. **Piros folt még mindig látszik**

**Ok:** Rossz URL - a CDN verzió töltődik be, nem a custom build.

**Megoldás:**
- Ellenőrizd az URL-t (93. sor)
- Nyisd meg az URL-t böngészőben → töltse le a fájlt
- DevTools (F12) → Network → ellenőrizd, melyik JS fájl töltődik be

### 2. **Console hiba: "Fluid is not defined"**

**Ok:** A custom build nem töltődött be időben.

**Megoldás:**
- Növeld a timeout értéket (500ms → 1000ms)
- Ellenőrizd a CDN URL elérhetőségét

### 3. **Animáció túl gyors/túl lassú**

**Megoldás:** Állítsd be a fizikai paramétereket:
- **Gyors animáció** → csökkentsd `dissipation`, `velocity` értékét (pl. 0.95)
- **Lassú animáció** → növeld `dissipation`, `velocity` értékét (pl. 0.999)

---

## 📝 Changelog

### v1.0 (2025-11-06)
- ✅ Custom Fluid-JS build fehér folt fixszel
- ✅ Paraméterezett verzió (dissipation: 0.998, velocity: 0.999, emitter_size: 2.5)
- ✅ UNAS-ready inject script
- ✅ Lokális teszt HTML
- ✅ Dokumentáció

---

## 🔗 Hasznos linkek

- **Eredeti Fluid-JS repo:** https://github.com/PavelDoGreat/WebGL-Fluid-Simulation
- **jsDelivr CDN dokumentáció:** https://www.jsdelivr.com/
- **Fluid-JS API dokumentáció:** Lásd `samples/fluid-js/how-to-guide.md`

---

## 📧 Kapcsolat

Ha bármi kérdés van, nyiss egy issue-t a GitHub repo-ban! 🚀
