
# Fluid Art Animált Háttér - Projekt Dokumentáció

## Projekt Célja
Animált fluid art háttér készítése JavaScript/Canvas használatával a **fluidartshop.hu** UNAS webshophoz. A projekt célja egy **lokálisan fejleszthető, tesztelhető és GitHub-ról beilleszthető** animációs script létrehozása.

---

## Háttér Kontextus
- **Weboldal:** fluidartshop.hu (UNAS platform)
- **Platform korlátok:** Zárt rendszer, de lehetséges JavaScript injektálás
- **Művészeti profil:** Fluid art (folyatásos festészet) képek értékesítése

---

## Technikai Követelmények

### Háttér Animáció Specifikációk

**Vizuális jellemzők:**
- Folyékony, folyós festék animáció
- Perlin noise alapú flow field
- 3-5 fluid réteg különböző sebességgel
- Színátmenetek: türkiz → rózsaszín → arany → mélykék
- Lágy örvénylések és keveredések

**Interaktivitás:**
- Egér mozgására reagáló folyadék szimuláció (desktop)
- Görgetés-reaktív effektek (parallax)
- Festék "folyásának" sebessége változik görgetéskor
- Klikkelésre "ripple" effekt (opcionális)

**Performance optimalizáció:**
- Canvas/WebGL alapú renderelés
- GPU gyorsítás használata
- RequestAnimationFrame használata
- Mobil: egyszerűsített verzió, max 30 FPS
- "Reduced motion" preferencia tiszteletben tartása
- Lazy loading
- Fallback statikus háttérrel

**Responsivitás:**
- Desktop: teljes animáció
- Tablet: közepes komplexitás
- Mobil: egyszerűsített, alacsony FPS

---

## Projekt Struktúra

```
fluid-art-background/
├── test-fluidart-final.html                          # Lokális teszt (teljes paraméterezés)
├── CLAUDE.md                                         # Projekt dokumentáció
├── README.md                                         # GitHub readme
├── dist/
│   └── fluid-js-custom-final.min.js                  # Custom build (41.3 KB)
├── samples/
│   └── fluid-js/
│       └── original github repo/
│           └── Fluid-JS-master/
│               ├── src/
│               │   ├── fluid.js                      # createSplat() API
│               │   ├── defaults.js                   # Custom physics defaults
│               │   └── initializer.js                # Init splat removed + radius fix
│               ├── webpack.config.js                 # Webpack 5 config
│               └── package.json                      # Dependencies
├── archive/                                          # Régi/workaround fájlok
│   ├── README.md                                     # Archiválási dokumentáció
│   ├── [9 HTML teszt fájl]
│   ├── [3 régi minified build]
│   ├── [2 régi inject script]
│   └── [3 régi dokumentáció]
└── src/
    └── to_unas/
        └── inject_fluidart_final.js                  # TODO: UNAS deployment script
```

---

## Fejlesztési Workflow

### 1. Lokális fejlesztés (VSCode + Claude Code)
- Animáció készítése és finomhangolása
- Különböző böngészőkben tesztelés
- Performance mérés és optimalizáció

### 2. GitHub publikálás
- Verziókezelés
- GitHub Pages tesztelés (opcionális)
- CDN-ként használható URL generálása

### 3. UNAS beillesztés
- **Két részes build struktúra:**
  - **HEAD**: `fluid-js-custom-final.min.js` (41.3 KB custom build)
  - **BODY END**: `unas-inject-config.js` (paraméterkezelő + canvas setup)
- **Lokális teszt**: `test-unas-deployment.html` (ugyanazt a build-et használja)

---

## Tesztelési Checklist

- [ ] Lokális tesztelés különböző böngészőkben (Chrome, Firefox, Safari, Edge)
- [ ] Mobil responsivitás ellenőrzése (iOS Safari, Chrome Mobile)
- [ ] Performance mérés (Chrome DevTools, Lighthouse)
- [ ] GPU használat és memory leak ellenőrzés
- [ ] UNAS admin panel kompatibilitás
- [ ] CDN betöltési sebesség
- [ ] Fallback megoldás tesztelése (ha a script nem töltődik be)
- [ ] "Reduced motion" preferencia tesztelése
- [ ] Cross-browser compatibility
- [ ] A/B tesztelés (animációval vs. anélkül)

---

## Implementációs Referencia

**Példa koncepció (technikai specifikáció):**
```javascript
// Noise-based flow field (Perlin noise)
// 3-5 fluid réteg különböző sebességgel
// Színátmenetek:
//   - Főoldal: kék → türkiz → rózsaszín
//   - Dinamikus színkeverés
// Interakció:
//   - Egér közelében gyorsabb áramlás
//   - Klikkelésre ripple effekt
//   - Görgetésre parallax rétegek
// Performance:
//   - RequestAnimationFrame használata
//   - Offscreen canvas pre-renderelés (opcionális)
//   - Mobile: 30 FPS limit
```

---

## Beillesztés UNAS-ba

**Lehetséges módszerek:**
1. Egyedi JavaScript/CSS mező az admin felületen
2. HTML widget/modul használata
3. Fejléc/lábléc szerkesztő `<script>` tag-ekkel

**GitHub CDN példa:**
```html
<script src="https://cdn.jsdelivr.net/gh/USERNAME/fluid-art-background@main/dist/fluid-background.min.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/USERNAME/fluid-art-background@main/dist/styles.css">
```

---

## Projekt Fókusz

**FONTOS:** Ez a projekt kizárólag az animált fluid art háttér létrehozására fókuszál. A nagyobb webshop funkcionalitás (p5.js playground, színkereső, stb.) **nem része** ennek a projektnek.

---

## Jelenlegi Státusz (2025-11-07)

### Elkészült komponensek

1. **UNAS Deployment Build** ✅ Production Ready
   - `dist/fluid-js-custom-final.min.js` (41.3 KB) - HEAD section
   - `dist/unas-inject-config.js` (~8 KB) - BODY END section
   - `test-unas-deployment.html` - Lokális teszt (azonos build struktúra)
   - `UNAS_DEPLOYMENT_GUIDE.md` - Részletes beillesztési útmutató

2. **Custom Fluid-JS Build** ✅ Production Ready
   - `dist/fluid-js-custom-final.min.js` (41.3 KB) - Custom build Webpack 5-tel
   - Init splat eltávolítva (nincs automatikus piros/fehér folt)
   - `multi_color: false` alapértelmezett (nincs random színgenerálás)
   - `createSplat()` API programmatikus splat létrehozáshoz
   - Radius paraméter fix (teljes kontroll a splat méret felett)
   - Fekete szín fix (additive blending limitation dokumentálva)

2. **Teljes Paraméteres Konfiguráció** (`test-fluidart-final.html`)
   - ✅ **Minden paraméter egy helyen:** `ANIMATION_CONFIG` objektum
   - Időzítések (scriptLoadDelay, fluidInitDelay, splatCreationDelay)
   - Canvas beállítások (zIndex, pointerEvents, position)
   - **Teljes fizikai kontroll:** ÖSSZES behavior paraméter állítható (sim_resolution, dye_resolution, dissipation, velocity, pressure, curl, emitter_size, bloom settings)
   - 21 színes paletta (alap, hideg, meleg, zöld, pastel árnyalatok)
   - Kezdeti splat-ok konfiguráció (szín, pozíció, sebesség, sugár, késleltetés)
   - Animáció sebesség szabályozás (velocityMultiplier)
   - **PresetManager API:** Preset mentés/betöltés localStorage-ba

3. **Archívált fájlok** (`archive/`)
   - 9 régi HTML teszt fájl (workaround megoldások)
   - 3 régi minified build (korábbi verziók)
   - 2 régi inject script (fehér öblítés stratégia)
   - 3 régi dokumentáció (changelog-ek)
   - `archive/README.md` - Teljes archiválási dokumentáció

### Kulcsfontosságú Architektúra Döntések

**1. Custom Build helyett Workaround Megoldás:**

❌ **Régi megoldás (archívált):** Fehér festék "öblítés" stratégia
- Időzítés alapú workaround
- CDN könyvtár használata módosítás nélkül
- Fehér splat az init folt elrejtésére

✅ **Új megoldás (jelenlegi):** Custom Fluid-JS build
- Forrás szintű init splat eltávolítás (`src/initializer.js:284`)
- `createSplat()` API hozzáadva (`src/fluid.js`)
- Radius paraméter fix (`src/initializer.js` splat() függvény)
- Fekete szín additive blending limitation fix (5,5,5 mint pseudo-black)

**2. Teljes Paraméteres Konfiguráció:**

```javascript
// test-fluidart-final.html - Minden paraméter egy helyen
const ANIMATION_CONFIG = {
    timing: {
        scriptLoadDelay: 500,
        fluidInitDelay: 500,
        splatCreationDelay: 500
    },
    canvas: {
        zIndex: -1,
        pointerEvents: 'none',
        position: 'fixed'
    },
    fluidBehavior: {
        // TELJES fizikai kontroll - 18 paraméter
        sim_resolution: 512,
        dye_resolution: 512,
        dissipation: 1,
        velocity: 0.999,
        pressure: 0.8,
        pressure_iteration: 20,
        curl: 10,
        emitter_size: 2.0,
        render_shaders: true,
        multi_color: false,
        render_bloom: false,
        bloom_iterations: 8,
        bloom_resolution: 256,
        intensity: 0.8,
        threshold: 0.6,
        soft_knee: 0.7,
        background_color: { r: 0, g: 0, b: 0 },
        transparent: false
    },
    animation: {
        velocityMultiplier: 1.0  // Globális sebesség szabályozás
    },
    colors: [
        // 21 szín: alap (2), hideg (7), meleg (6), zöld (3), pastel (3)
    ],
    initialSplats: [
        // Kezdeti splat-ok teljes kontrollja
        { colorIndex, x, y, dx, dy, radius, delay }
    ]
};
```

**3. PresetManager API:**

```javascript
// Preset mentés/betöltés localStorage-ba
PresetManager.save('myPreset');
PresetManager.load('myPreset');
PresetManager.list();
PresetManager.delete('myPreset');
PresetManager.export();  // JSON export
PresetManager.import(jsonString);  // JSON import
```

### Felhasznált technológiák

**Custom Fluid-JS Build:**
- **Fluid-JS library**: WebGL fluid szimuláció (Navier-Stokes egyenletek)
- **Webpack 5**: Build tool (upgraded from Webpack 4)
- **Babel**: ES6 → ES5 transpilation
- **GPU Acceleration**: WebGL shaders (vertex/fragment shaders)
- **Additive Color Blending**: WebGL blending mode

**Fluid Art Színpaletta (21 szín):**
- **Alap (2):** Nagyon sötét szürke (5,5,5), Fehér (255,255,255)
- **Hideg (7):** Türkiz, Sky Blue, Royal Blue, Soft Blue, Vivid Purple, Lavender, Magenta
- **Meleg (6):** Hot Pink, Soft Pink, Coral, Orange, Gold, Lemon Yellow
- **Zöld (3):** Mint Green, Emerald Green, Soft Green
- **Pastel (3):** Pastel Blue, Pastel Pink, Pastel Purple

### Bug Fixes és Megoldások

**1. Radius Parameter Bug (✅ MEGOLDVA)**

**Probléma:** A `createSplat()` radius paraméter nem került alkalmazásra.

**Megoldás:**
- `src/initializer.js` splat() függvény módosítása (6. paraméter hozzáadva)
- `src/fluid.js` createSplat() átírása a radius direkt átadásához

```javascript
// src/initializer.js - splat() függvény
function splat(x, y, dx, dy, color, radius) {
    const splatRadius = (radius !== undefined) ? radius : PARAMS.emitter_size;
    // ... uniform call with splatRadius
}
```

**2. Black Color Bug (✅ MEGOLDVA)**

**Probléma:** r:0, g:0, b:0 (fekete) fehér/átlátszó splat-ot eredményezett.

**Gyökér ok:** WebGL additive blending - `gl_FragColor = vec4(base + splat, 1.0);` → (0,0,0) hozzáadva bármihez = nincs változás.

**Megoldás:**
- "Fekete" szín módosítása (5,5,5) - nagyon sötét szürke (pseudo-black)
- Fejlesztői figyelmeztetés hozzáadása:
```javascript
if (color.r === 0 && color.g === 0 && color.b === 0) {
    console.warn('⚠️ Pure black (0,0,0) will not be visible due to additive blending');
}
```

**3. Init Splat Problem (✅ MEGOLDVA)**

**Probléma:** Automatikus piros/fehér folt jelent meg (500, 500) pozícióban.

**Gyökér ok:** `src/initializer.js:284` - `multipleSplats(Math.random() * 20 + 5);`

**Megoldás:** Sor törlése a custom build-ben (nincs automatikus splat hívás).

**4. Multi Color Random Generation (✅ MEGOLDVA)**

**Probléma:** Random színek generálódnak `multi_color: true` miatt.

**Megoldás:** `src/defaults.js` - `multi_color: false` alapértelmezett érték.

### Használati Útmutató

**1. Lokális Tesztelés:**

```bash
# test-fluidart-final.html megnyitása böngészőben
# Chrome DevTools Console-ban:

# Preset mentése
PresetManager.save('myAnimation');

# Preset betöltése
PresetManager.load('myAnimation');

# Összes preset listázása
PresetManager.list();

# JSON export
PresetManager.export();
```

**2. Paraméterek Módosítása:**

Minden paraméter a `test-fluidart-final.html` fájl `ANIMATION_CONFIG` objektumában található (92. sor körül):

```javascript
// Időzítések módosítása
timing: {
    scriptLoadDelay: 500,     // Fluid-JS script betöltési késleltetés
    fluidInitDelay: 500,      // Fluid inicializálás késleltetés
    splatCreationDelay: 500   // Splat generálás késleltetés
}

// Fizikai paraméterek módosítása
fluidBehavior: {
    sim_resolution: 512,      // GPU texture felbontás (32-512)
    dissipation: 1,           // Halványodás (0.9-1.0, 1=nincs)
    velocity: 0.999,          // Lassulás (0.9-1.0)
    curl: 10,                 // Örvénylés (0-50)
    emitter_size: 2.0,        // Splat alapméret (0.1-3.0)
    // ... további paraméterek
}

// Animáció sebesség
animation: {
    velocityMultiplier: 1.0   // 0.1 = lassú, 2.0 = gyors
}

// Színek hozzáadása/módosítása
colors: [
    { r: 0, g: 255, b: 255 },  // Türkiz
    // ... további színek
]

// Kezdeti splat-ok konfigurálása
initialSplats: [
    {
        colorIndex: 2,        // colors tömb index
        x: 0.5, y: 0.5,       // Pozíció (0-1 normalized)
        dx: 70, dy: 10,       // Sebesség vektor
        radius: 5.0,          // Splat sugár
        delay: 0              // Késleltetés (ms)
    }
]
```

**3. UNAS Deployment:**

Két részes build struktúra elkészítve:
- `dist/fluid-js-custom-final.min.js` → UNAS HEAD
- `dist/unas-inject-config.js` → UNAS BODY END
- `test-unas-deployment.html` → Lokális teszt (azonos struktúra)

---

### Következő Lépések

**UNAS Deployment (KÉSZ):**
- [x] UNAS deployment build elkészítése (2 részes: HEAD + BODY END)
- [x] Lokális teszt fájl (`test-unas-deployment.html`)
- [x] Deployment útmutató (`UNAS_DEPLOYMENT_GUIDE.md`)

**GitHub és CDN (TODO):**
- [ ] GitHub repository publikálás
- [ ] CDN URL tesztelés (jsdelivr)

**Tesztelés:**
- [ ] Mobil responsivitás (iOS Safari, Chrome Mobile)
- [ ] Performance benchmark (FPS, GPU, memory)
- [ ] Cross-browser compatibility (Safari, Firefox)

**Jövőbeli funkciók:**
- [ ] DOM-alapú splat konfiguráció (data-splat-* attribútumok)
- [ ] Kép színpaletta extrakció (termékképekből)
- [ ] Scroll/hover event trigger (interaktív splat-ok)

---

## Build Process és Fájlok

### Forráskód Módosítások

**1. `src/defaults.js` - Fizikai paraméterek:**

```javascript
sim_resolution: 512,        // CUSTOM (eredetileg: 128)
dye_resolution: 512,        // Megtartva
dissipation: 1,             // CUSTOM (eredetileg: 0.97) - NINCS halványodás
velocity: 0.999,            // CUSTOM (eredetileg: 0.98)
pressure: 0.8,              // Megtartva
pressure_iteration: 20,     // Megtartva
curl: 10,                   // CUSTOM (eredetileg: 0)
emitter_size: 2.0,          // CUSTOM (eredetileg: 0.5)
multi_color: false,         // CUSTOM (eredetileg: true)
background_color: {r:0, g:0, b:0}  // CUSTOM (eredetileg: {r:15, g:15, b:15})
```

**2. `src/initializer.js:284` - Init splat eltávolítás:**

```javascript
// TÖRLENDŐ SOR:
multipleSplats(Math.random() * 20 + 5);

// Eredmény: Nincs automatikus splat generálás
```

**3. `src/initializer.js:677` - Splat függvény radius paraméter:**

```javascript
function splat(x, y, dx, dy, color, radius) {
    const splatRadius = (radius !== undefined) ? radius : PARAMS.emitter_size;
    // ... uniform call with splatRadius
}
```

**4. `src/fluid.js` - createSplat() API hozzáadása:**

Teljes implementáció a [fluid.js](samples/fluid-js/original github repo/Fluid-JS-master/src/fluid.js) fájlban található (219-261. sor).

### Webpack Build

```bash
cd samples/fluid-js/original\ github\ repo/Fluid-JS-master/

# Windows esetén:
set NODE_OPTIONS=--openssl-legacy-provider
npm run build

# Linux/Mac esetén:
export NODE_OPTIONS=--openssl-legacy-provider
npm run build

# Output: lib/fluid.min.js → másolás → dist/fluid-js-custom-final.min.js
```

### Production Build

- **Fájl:** `dist/fluid-js-custom-final.min.js`
- **Méret:** 41.3 KB
- **Build tool:** Webpack 5
- **Státusz:** ✅ Production Ready

---

## Összefoglalás

### Előnyök

✅ **Teljes kontroll:** Minden paraméter módosítható egy helyről
✅ **Tiszta API:** `createSplat()` programmatikus splat létrehozás
✅ **Nincs init splat:** Automatikus piros/fehér folt eltávolítva
✅ **Fix színek:** `multi_color: false` garantáltan működik
✅ **Radius kontroll:** Splat méret teljesen szabályozható
✅ **Preset kezelés:** LocalStorage mentés/betöltés
✅ **21 színes paletta:** Fluid art színek széles választéka

### Fájl Státusz

| Fájl | Státusz | Leírás |
|------|---------|--------|
| `dist/fluid-js-custom-final.min.js` | ✅ Kész | Custom build (41.3 KB) |
| `test-fluidart-final.html` | ✅ Kész | Teljes paraméteres konfiguráció |
| `src/fluid.js` | ✅ Kész | createSplat() API |
| `src/defaults.js` | ✅ Kész | Custom physics defaults |
| `src/initializer.js` | ✅ Kész | Init splat removed + radius fix |
| `archive/` | ✅ Kész | Régi fájlok archiválva |
| `dist/unas-inject-config.js` | ✅ Kész | UNAS deployment script (BODY END) |
| `test-unas-deployment.html` | ✅ Kész | Lokális UNAS teszt |
| `UNAS_DEPLOYMENT_GUIDE.md` | ✅ Kész | Beillesztési útmutató |