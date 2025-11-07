# UNAS Deployment Útmutató

## Áttekintés

Ez az útmutató leírja, hogyan illeszd be a fluid art animációt az UNAS webshopba.

**Build Struktúra:** 2 részes (HEAD + BODY END)

---

## Fájlok

| Fájl | Méret | Leírás | Hova kerül |
|------|-------|--------|------------|
| `dist/fluid-js-custom-final.min.js` | 41.3 KB | Custom Fluid-JS build | **HEAD** |
| `dist/unas-inject-config.js` | ~8 KB | Paraméterkezelő + canvas setup | **BODY END** |

---

## UNAS Beillesztés (Lépésről Lépésre)

### 1. Lépés: HEAD Section (Custom Build)

**UNAS Admin felület:**
1. Navigálj: **Megjelenés → JavaScript/CSS → HEAD**
2. Válaszd ki az egyik módszert:

#### Opció A: CDN használata (AJÁNLOTT)

```html
<script src="https://cdn.jsdelivr.net/gh/USERNAME/fluid-art-background@main/dist/fluid-js-custom-final.min.js"></script>
```

**Előnyök:**
- Gyorsabb betöltés (CDN cache)
- Könnyebb verziókezelés
- Kisebb inline kód

**Lépések:**
1. Töltsd fel a repo-t GitHub-ra
2. Cseréld ki `USERNAME` a GitHub felhasználónevedre
3. Másold be az UNAS HEAD részébe

#### Opció B: Inline beillesztés (Fallback)

```html
<script>
// dist/fluid-js-custom-final.min.js TELJES TARTALMA ide
</script>
```

**Előnyök:**
- Nincs külső függőség
- Nincs CDN downtime kockázat

**Lépések:**
1. Nyisd meg: `dist/fluid-js-custom-final.min.js`
2. Másold ki a TELJES tartalmát
3. Illeszd be `<script>` és `</script>` tag-ek közé
4. Másold be az UNAS HEAD részébe

---

### 2. Lépés: BODY END Section (Paraméterek)

**UNAS Admin felület:**
1. Navigálj: **Megjelenés → JavaScript/CSS → BODY END**
2. Másold be a következő kódot:

```html
<script>
// dist/unas-inject-config.js TELJES TARTALMA ide
</script>
```

**Lépések:**
1. Nyisd meg: `dist/unas-inject-config.js`
2. Másold ki a TELJES tartalmát
3. Illeszd be `<script>` és `</script>` tag-ek közé
4. Másold be az UNAS BODY END részébe

---

## Paraméter Módosítási Workflow

### Gyors Iterációs Ciklus

Ha módosítod az animációs paramétereket (színek, splat-ok, fizika):

1. **Módosítsd:** `dist/unas-inject-config.js` → `CONFIG` objektum
2. **Teszteld lokálisan:** Nyisd meg `test-unas-deployment.html` böngészőben
3. **Ellenőrizd:** F12 → Console → Nincs hiba?
4. **Frissítsd UNAS-ban:** Másold be az új `unas-inject-config.js` tartalmat a BODY END részébe

**FONTOS:** A `fluid-js-custom-final.min.js` (HEAD) NEM változik, csak ha módosítod a forráskódot (src/*.js).

---

## Testreszabható Paraméterek

### CONFIG Objektum Struktúra

```javascript
const CONFIG = {
    timing: {
        scriptLoadDelay: 500,        // Fluid library betöltési késleltetés (ms)
        fluidInitDelay: 500,         // Fluid inicializálás késleltetés (ms)
        splatCreationDelay: 500      // Splat generálás késleltetés (ms)
    },

    canvas: {
        zIndex: -1,                  // Canvas z-index (háttér: negatív)
        pointerEvents: 'none',       // Egér interakció (none = átenged)
        position: 'fixed'            // CSS position
    },

    fluidBehavior: {
        sim_resolution: 256,         // GPU felbontás (32-512)
        dye_resolution: 512,         // Szín felbontás (128-2048)
        dissipation: 1.000,          // Halványodás (0.9-1.0, 1=nincs)
        velocity: 0.999,             // Lassulás (0.9-1.0)
        pressure: 0.6,               // Nyomás (0.0-1.0)
        pressure_iteration: 20,      // Nyomás iterációk (10-50)
        curl: 5,                     // Örvénylés (0-50)
        emitter_size: 1.0,           // Splat alapméret (0.1-3.0)
        render_bloom: false,         // Bloom effekt (true/false)
        // ... további paraméterek
    },

    animation: {
        velocityMultiplier: 1.0      // Globális sebesség (0.1-2.0)
    },

    colors: [
        { r: 5, g: 5, b: 5 },        // 0: Pseudo-fekete
        { r: 255, g: 255, b: 255 },  // 1: Fehér
        { r: 0, g: 255, b: 255 },    // 2: Türkiz
        // ... 21 szín összesen
    ],

    initialSplats: [
        {
            colorIndex: 6,            // colors tömb index
            x: 0.5, y: 0.5,           // Pozíció (0-1 normalized)
            dx: 70, dy: 10,           // Sebesség vektor
            radius: 5.5,              // Splat sugár
            delay: 0                  // Késleltetés (ms)
        },
        // ... további splat-ok
    ]
};
```

---

## Példa Módosítások

### 1. Splat Szín Módosítása

```javascript
// Első splat színét változtasd türkizről rózsaszínre
initialSplats: [
    {
        colorIndex: 9,  // VÁLTOZTATÁS: 6 → 9 (rózsaszín)
        x: 0.5, y: 0.5,
        dx: 70, dy: 10,
        radius: 5.5,
        delay: 0
    }
]
```

### 2. Több Splat Hozzáadása

```javascript
initialSplats: [
    // ... meglévő splat-ok
    {
        colorIndex: 13,  // Arany
        x: 0.8, y: 0.2,  // Jobb felső sarok
        dx: -50, dy: 80,
        radius: 4.0,
        delay: 3500
    }
]
```

### 3. Animáció Lassítása

```javascript
animation: {
    velocityMultiplier: 0.5  // VÁLTOZTATÁS: 1.0 → 0.5 (fele sebesség)
}
```

### 4. Örvénylés Növelése

```javascript
fluidBehavior: {
    curl: 20  // VÁLTOZTATÁS: 5 → 20 (erősebb örvény)
}
```

---

## Lokális Tesztelés

### test-unas-deployment.html

Ez a fájl **pontosan szimmulálja** az UNAS környezetet:

```html
<head>
    <!-- Ugyanaz, mint UNAS HEAD -->
    <script src="dist/fluid-js-custom-final.min.js"></script>
</head>
<body>
    <!-- Ugyanaz, mint UNAS BODY END -->
    <script src="dist/unas-inject-config.js"></script>
</body>
```

**Tesztelési lépések:**
1. Nyisd meg: `test-unas-deployment.html` böngészőben
2. Nyisd meg: F12 → Console
3. Ellenőrizd a log üzeneteket:
   - ✅ "Canvas létrehozása..."
   - ✅ "Fluid példány OK"
   - ✅ "Fluid aktiválva"
   - ✅ "Splat #1 létrehozva"
4. Ha minden zöld → készen áll az UNAS-ra

---

## Hibaelhárítás

### "Fluid library nem töltődött be"

**Ok:** HEAD section nem tartalmazza a custom build-et.

**Megoldás:**
1. Ellenőrizd: UNAS HEAD → van `fluid-js-custom-final.min.js` hivatkozás?
2. CDN esetén: `https://cdn.jsdelivr.net/gh/USERNAME/...` URL helyes?
3. Növeld `timing.scriptLoadDelay` értéket (500 → 1000)

### "createSplat() metódus nem elérhető"

**Ok:** Nem a custom build-et használod.

**Megoldás:**
1. Ellenőrizd: `dist/fluid-js-custom-final.min.js` az új build?
2. Rebuild szükséges? (lásd: `REGENERATION_GUIDE.md`)

### Nincs animáció, fekete képernyő

**Ok:** JavaScript hiba van.

**Megoldás:**
1. F12 → Console → Ellenőrizd a hibákat
2. Tisztítsd az UNAS cache-t
3. Inkognitó mód tesztelés

### Splat-ok nem a várt színűek

**Ok:** `colorIndex` hibás vagy `colors` tömb módosítva.

**Megoldás:**
1. Ellenőrizd: `initialSplats[].colorIndex` < `colors.length`
2. Console log: `CONFIG.colors[6]` → helyes RGB érték?

---

## Build Újragenerálás (Ha Szükséges)

### Mikor kell rebuild?

**NINCS szükség rebuild-re, ha:**
- Módosítod a `CONFIG` objektumot (timing, colors, splats, stb.)
- Csak paramétereket változtatsz

**SZÜKSÉGES rebuild, ha:**
- Módosítod a `src/defaults.js` fájlt
- Módosítod a `src/fluid.js` (createSplat API)
- Módosítod a `src/initializer.js` fájlt

**Rebuild lépések:**
```bash
cd "samples/fluid-js/original github repo/Fluid-JS-master"
set NODE_OPTIONS=--openssl-legacy-provider
npm run build
copy lib\fluid.min.js ..\..\..\..\dist\fluid-js-custom-final.min.js
```

Részletes leírás: `REGENERATION_GUIDE.md`

---

## Verziókezelés

### Git Commit (Paraméter Módosítás)

```bash
git add dist/unas-inject-config.js
git commit -m "Update: splat színek módosítva (türkiz → rózsaszín)"
git push
```

### Git Commit (Build Módosítás)

```bash
git add dist/fluid-js-custom-final.min.js
git add samples/fluid-js/original\ github\ repo/Fluid-JS-master/src/
git commit -m "Build: curl paraméter növelve (5 → 20)"
git tag v1.0.1
git push --tags
```

---

## UNAS Produkciós Checklist

- [ ] **HEAD section:** Custom build beillesztve (CDN vagy inline)
- [ ] **BODY END section:** Paraméterkezelő beillesztve
- [ ] **Lokális teszt:** `test-unas-deployment.html` működik
- [ ] **UNAS teszt:** Főoldal betöltése, F12 Console ellenőrzés
- [ ] **Animáció:** Splat-ok megjelennek, folyik a folyadék
- [ ] **Nincs hiba:** Console tiszta (nincs piros üzenet)
- [ ] **Mobil teszt:** iOS Safari, Chrome Mobile ellenőrzés
- [ ] **Performance:** FPS megfelelő (60 FPS desktop, 30+ FPS mobil)
- [ ] **Cache:** UNAS cache tisztítva
- [ ] **Inkognitó:** Működik inkognitó módban is

---

## Összefoglalás

**UNAS Deploy Workflow:**
1. HEAD → `fluid-js-custom-final.min.js` (CDN vagy inline)
2. BODY END → `unas-inject-config.js` (inline)
3. Teszt → `test-unas-deployment.html`
4. UNAS → Beillesztés
5. Ellenőrzés → F12 Console

**Paraméter Módosítási Workflow:**
1. Módosítás → `dist/unas-inject-config.js` (CONFIG)
2. Teszt → `test-unas-deployment.html`
3. UNAS frissítés → BODY END új tartalom
4. Ellenőrzés → Production teszt

**Build Módosítási Workflow:**
1. Forráskód → `src/*.js` módosítás
2. Rebuild → Webpack build
3. Teszt → `test-unas-deployment.html`
4. UNAS frissítés → HEAD új tartalom
5. Ellenőrzés → Production teszt

---

## További Dokumentáció

- **CLAUDE.md** - Teljes projekt dokumentáció
- **REGENERATION_GUIDE.md** - Build újragenerálási útmutató
- **README.md** - Projekt áttekintés

---

**🚀 Fluid Art Background - UNAS Ready**
