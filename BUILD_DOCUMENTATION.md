# Fluid-JS Custom Build - Teljes Build Dokumentáció

## Tartalom
- [Áttekintés](#áttekintés)
- [Build Folyamat](#build-folyamat)
- [Forrásfájlok Struktúrája](#forrásfájlok-struktúrája)
- [Végrehajtott Módosítások](#végrehajtott-módosítások)
- [Build Parancsok](#build-parancsok)
- [Production Deployment](#production-deployment)

---

## Áttekintés

A `dist/fluid-js-custom-final.min.js` (41.3 KB) egy **custom Fluid-JS build**, amely a következő módosításokat tartalmazza az eredeti [Fluid-JS library](https://github.com/haxiomic/fluid-js)-hoz képest:

### Fő Módosítási Kategóriák

1. **Fizikai Paraméterek** - Optimalizált értékek fluid art animációhoz
2. **Init Behavior** - Automatikus kezdeti splat eltávolítása
3. **Programmatic API** - `createSplat()` publikus metódus hozzáadása
4. **Radius Kontroll** - Splat méret dinamikus beállítása
5. **Color Behavior** - Fix színpaletta (multi_color: false)
6. **Black Color Fix** - Additive blending limitation kezelése

---

## Build Folyamat

### Forráskód Helye

```
samples/fluid-js/original github repo/Fluid-JS-master/
├── src/
│   ├── fluid.js          # Fő exportált osztály (publikus API)
│   ├── initializer.js    # WebGL inicializálás + animációs loop
│   └── defaults.js       # Fizikai paraméterek + GLSL shader source-ok
├── webpack.config.js     # Webpack 5 konfiguráció
├── package.json          # Dependencies (babel, webpack, loaders)
└── lib/
    └── fluid.min.js      # Build output (átmásolva → dist/)
```

### Build Toolchain

| Tool | Verzió | Funkció |
|------|--------|---------|
| **Webpack** | 5.x | Module bundler + minification |
| **Babel** | ^7.x | ES6 → ES5 transpilálás |
| **url-loader** | ^4.x | PNG dither texture base64 embedding |

**Output formátum:** UMD (Universal Module Definition)
- CommonJS támogatás (`require()`)
- AMD támogatás (`define()`)
- Globális változó (`window.Fluid`)

---

## Forrásfájlok Struktúrája

### 1. `src/fluid.js` - Publikus API

**Felelősség:** Külső interfész, osztály exportálás

**Fő metódusok:**
- `constructor(canvas)` - WebGL context init
- `activate()` - Animáció indítása
- `mapBehaviors(params)` - Fizikai paraméterek runtime módosítása
- `createSplat(config)` - **CUSTOM:** Programmatic splat creation
- `setDitherURL(url)` - Dithering texture URL beállítás

**Architektúra:**
```javascript
module.exports = class Fluid {
    constructor(canvas) {
        this.PARAMS = behavior;           // defaults.js importálás
        this.canvas = canvas;
        const {programs, webGL, ...} = initWebGL(canvas);
        this._splatAPI = null;            // CUSTOM: Internal splat API
    }

    activate() {
        this._splatAPI = activator(...);  // CUSTOM: Store activator return
    }

    createSplat(config) {                  // CUSTOM: Új metódus
        this._splatAPI.splat(...);
    }
}
```

---

### 2. `src/initializer.js` - WebGL Engine

**Felelősség:** WebGL context, shader compilation, render loop

**Fő funkciók:**
- `initWebGL(canvas)` - WebGL2/WebGL1 context létrehozás
- `activator(canvas, webGL, ...)` - Animációs loop indítás
- `splat(x, y, dx, dy, color, radius)` - **CUSTOM:** Belső splat függvény
- `update()` - RequestAnimationFrame render loop
- `applyBloom()` - Bloom effect post-processing

**WebGL Pipeline:**
```
Canvas Setup
    ↓
Shader Compilation (vertex + fragment shaders)
    ↓
Frame Buffer Object (FBO) létrehozás
    ↓
Double Buffering Setup (read/write swap)
    ↓
Render Loop (update() → requestAnimationFrame)
    ↓
Splat Injection (velocity + density texture write)
```

---

### 3. `src/defaults.js` - Konfiguráció + Shaders

**Felelősség:** Alapértelmezett fizikai paraméterek + GLSL shader source-ok

**Behavior paraméterek:**
```javascript
export let behavior = {
    sim_resolution: 512,      // GPU texture felbontás
    dye_resolution: 512,      // Festék texture felbontás
    dissipation: 1,           // Halványodás sebessége
    velocity: 0.999,          // Lassulási együttható
    pressure: 0.8,            // Nyomás szimuláció
    curl: 10,                 // Örvénylési erősség
    emitter_size: 2.0,        // Splat alapméret
    multi_color: false,       // Random színgenerálás
    render_bloom: false,      // Bloom post-processing
    background_color: {r:0, g:0, b:0}
};
```

**GLSL Shaders:**
- `vertex` - Vertex shader (quad rendering)
- `splat` - Splat injection (Gaussian distribution)
- `advection` - Navier-Stokes advection
- `divergence` - Divergence calculation
- `pressure` - Pressure solver (Jacobi iteration)
- `curl` - Curl calculation (vorticity)
- `bloomPreFilter`, `bloomBlur`, `bloomFinal` - Bloom pipeline

---

## Végrehajtott Módosítások

### ✅ Módosítás #1: Fizikai Paraméterek Optimalizálása

**Fájl:** [src/defaults.js](samples/fluid-js/original%20github%20repo/Fluid-JS-master/src/defaults.js)

**Érintett sorok:** 2, 9, 10, 21, 22, 24, 41

| Paraméter | Eredeti | Custom | Indoklás |
|-----------|---------|--------|----------|
| `sim_resolution` | 128 | **512** | Magasabb szimuláció felbontás (GPU texture méret) → jobb minőség |
| `dissipation` | 0.97 | **1.0** | Nincs halványodás → festék nem tűnik el idővel |
| `velocity` | 0.98 | **0.999** | Lassabb lassulás → tovább mozog a folyadék |
| `curl` | 0 | **10** | Örvénylés effekt aktiválása → természetesebb áramlás |
| `emitter_size` | 0.5 | **2.0** | Nagyobb splat méret → látványosabb effekt |
| `multi_color` | true | **false** | **FIX:** Nincs random színgenerálás (fix paletta használat) |
| `background_color` | `{r:15, g:15, b:15}` | **`{r:0, g:0, b:0}`** | Fekete háttér (transparent mode-hoz) |

**Kód változások:**

```javascript
// EREDETI:
export let behavior = {
    sim_resolution: 128,
    dissipation: .97,
    velocity: .98,
    curl: 0,
    emitter_size: 0.5,
    multi_color: true,
    background_color: { r: 15, g: 15, b: 15 }
};

// CUSTOM:
export let behavior = {
    sim_resolution: 512,    // CUSTOM: 512 (eredetileg: 128) - Magasabb szimuláció felbontás
    dissipation: 1,         // CUSTOM: 1 (eredetileg: .97) - NINCS halványodás!
    velocity: 0.999,        // CUSTOM: 0.999 (eredetileg: .98) - Lassabb lassulás
    curl: 10,               // CUSTOM: 10 (eredetileg: 0) - Örvénylés erőssége
    emitter_size: 2.0,      // CUSTOM: 2.0 (eredetileg: 0.5) - Nagyobb splat méret
    multi_color: false,     // CUSTOM: false (eredetileg: true) - FIX SZÍNEK!
    background_color: { r: 0, g: 0, b: 0 }  // CUSTOM: Fekete háttér (eredetileg: 15,15,15)
};
```

---

### ✅ Módosítás #2: Init Splat Eltávolítása

**Fájl:** [src/initializer.js](samples/fluid-js/original%20github%20repo/Fluid-JS-master/src/initializer.js)

**Érintett sor:** 284-285

**Probléma:** Az eredeti library automatikusan 5-25 random splat-ot generál inicializáláskor, ami piros/fehér foltokat eredményez.

**Megoldás:** `multipleSplats()` hívás kommentálása.

```javascript
// EREDETI:
/* Initialize Fluid */
init();
multipleSplats(Math.random() * 20 + 5);  // ❌ Automatikus splat generálás

// CUSTOM:
/* Initialize Fluid */
init();
// CUSTOM: multipleSplats() hívás eltávolítva - manuális splat kontroll a createSplat() API-val
// multipleSplats(Math.random() * 20 + 5);
```

**Eredmény:** Tiszta vászon indulásnál, teljes kontroll a kezdő animáció felett.

---

### ✅ Módosítás #3: Radius Paraméter Hozzáadása

**Fájl:** [src/initializer.js](samples/fluid-js/original%20github%20repo/Fluid-JS-master/src/initializer.js)

**Érintett sor:** 677-696

**Probléma:** Az eredeti `splat()` függvény nem fogad radius paramétert, mindig `PARAMS.emitter_size`-t használ.

**Megoldás:** 6. paraméter (`radius`) hozzáadása optional értékkel.

```javascript
// EREDETI:
function splat(x, y, dx, dy, color) {  // ❌ Nincs radius paraméter
    webGL.viewport(0, 0, simWidth, simHeight);
    PROGRAMS.splatProgram.bind();
    webGL.uniform1i(PROGRAMS.splatProgram.uniforms.uTarget, velocity.read.attach(0));
    webGL.uniform1f(PROGRAMS.splatProgram.uniforms.aspectRatio, canvas.width / canvas.height);
    webGL.uniform2f(PROGRAMS.splatProgram.uniforms.point, x / canvas.width, 1.0 - y / canvas.height);
    webGL.uniform3f(PROGRAMS.splatProgram.uniforms.color, dx, -dy, 1.0);
    webGL.uniform1f(PROGRAMS.splatProgram.uniforms.radius, PARAMS.emitter_size / 100.0);  // ❌ Fix érték
    blit(velocity.write.fbo);
    velocity.swap();

    webGL.viewport(0, 0, dyeWidth, dyeHeight);
    webGL.uniform1i(PROGRAMS.splatProgram.uniforms.uTarget, density.read.attach(0));
    webGL.uniform3f(PROGRAMS.splatProgram.uniforms.color, color.r, color.g, color.b);
    blit(density.write.fbo);
    density.swap();
}

// CUSTOM:
function splat(x, y, dx, dy, color, radius) {  // ✅ 6. paraméter hozzáadva
    // CUSTOM: Optional radius parameter (defaults to PARAMS.emitter_size if not provided)
    const splatRadius = (radius !== undefined) ? radius : PARAMS.emitter_size;

    webGL.viewport(0, 0, simWidth, simHeight);
    PROGRAMS.splatProgram.bind();
    webGL.uniform1i(PROGRAMS.splatProgram.uniforms.uTarget, velocity.read.attach(0));
    webGL.uniform1f(PROGRAMS.splatProgram.uniforms.aspectRatio, canvas.width / canvas.height);
    webGL.uniform2f(PROGRAMS.splatProgram.uniforms.point, x / canvas.width, 1.0 - y / canvas.height);
    webGL.uniform3f(PROGRAMS.splatProgram.uniforms.color, dx, -dy, 1.0);
    webGL.uniform1f(PROGRAMS.splatProgram.uniforms.radius, splatRadius / 100.0);  // ✅ Dinamikus radius
    blit(velocity.write.fbo);
    velocity.swap();

    webGL.viewport(0, 0, dyeWidth, dyeHeight);
    webGL.uniform1i(PROGRAMS.splatProgram.uniforms.uTarget, density.read.attach(0));
    webGL.uniform3f(PROGRAMS.splatProgram.uniforms.color, color.r, color.g, color.b);
    blit(density.write.fbo);
    density.swap();
}
```

**Eredmény:** Splat-onként egyedi méret beállítás lehetséges.

---

### ✅ Módosítás #4: createSplat() API Hozzáadása

**Fájl:** [src/fluid.js](samples/fluid-js/original%20github%20repo/Fluid-JS-master/src/fluid.js)

**Új metódus:** 219-261. sor

**Funkció:** Publikus API programmatikus splat létrehozásához JavaScript-ből.

```javascript
/**
 * Create Splat Programmatically
 * CUSTOM API - Programmatic splat creation with full parameter control
 *
 * @param {Object} config - Splat configuration object
 * @param {Object} config.color - RGB color object {r: 0-255, g: 0-255, b: 0-255}
 * @param {Number} config.x - X position (0-1 normalized or pixel value >2)
 * @param {Number} config.y - Y position (0-1 normalized or pixel value >2)
 * @param {Number} config.dx - X velocity (default: 0)
 * @param {Number} config.dy - Y velocity (default: 0)
 * @param {Number} config.radius - Splat radius (default: PARAMS.emitter_size)
 *
 * @example
 * // Create a turquoise splat in the center, moving right
 * myFluid.createSplat({
 *     color: { r: 0, g: 255, b: 255 },
 *     x: 0.5,
 *     y: 0.5,
 *     dx: 1000,
 *     dy: 0,
 *     radius: 2.5
 * });
 */
createSplat(config) {
    // Check if splat API is available (must call activate() first)
    if (!this._splatAPI || !this._splatAPI.splat) {
        console.error('❌ createSplat() error: activate() must be called before using createSplat()');
        return;
    }

    // Extract config with defaults
    const {
        color = { r: 255, g: 255, b: 255 },
        x = 0.5,
        y = 0.5,
        dx = 0,
        dy = 0,
        radius = this.PARAMS.emitter_size || 0.5
    } = config;

    // Detect if coordinates are normalized (0-1) or pixel-based (>2)
    const normalizedX = x < 2 ? x : x / this.canvas.width;
    const normalizedY = y < 2 ? y : y / this.canvas.height;

    // Convert to pixel coordinates
    const posX = normalizedX * this.canvas.width;
    const posY = normalizedY * this.canvas.height;

    // CUSTOM: Warn if color is too dark (additive blending limitation)
    if (color.r === 0 && color.g === 0 && color.b === 0) {
        console.warn('⚠️ createSplat() warning: Pure black (0,0,0) will not be visible due to additive blending. Use dark gray instead (e.g., {r:5, g:5, b:5})');
    }

    // Normalize color from 0-255 range to 0-1 range (WebGL expects 0-1)
    const normalizedColor = {
        r: color.r / 255,
        g: color.g / 255,
        b: color.b / 255
    };

    // Call the internal splat() function from activator closure
    // Note: dx, dy are velocity vectors (not positions)
    // The internal splat() now accepts radius as 6th parameter (CUSTOM modification)
    this._splatAPI.splat(posX, posY, dx, dy, normalizedColor, radius);
}
```

**API Features:**

| Feature | Implementáció |
|---------|---------------|
| **Coordinate normalization** | Auto-detect: `x < 2` → normalized, `x >= 2` → pixel coords |
| **Color normalization** | RGB 0-255 → 0-1 (WebGL format conversion) |
| **Radius support** | Pass-through to internal `splat()` 6th parameter |
| **Black color warning** | Console warning ha `{r:0, g:0, b:0}` (additive blending limitation) |
| **Error handling** | Check `_splatAPI` availability (activate() must be called first) |

---

### ✅ Módosítás #5: Splat API Reference Storage

**Fájl:** [src/fluid.js](samples/fluid-js/original%20github%20repo/Fluid-JS-master/src/fluid.js)

**Érintett sorok:** 26, 38

**Probléma:** `activator()` egy closure-t ad vissza, ami tartalmazza a `splat()` belső függvényt. Ez alapértelmezetten nem érhető el kívülről.

**Megoldás:** `_splatAPI` private property tárolása a constructor-ban, értékadás az `activate()` metódusban.

```javascript
// CONSTRUCTOR (26. sor):
constructor(canvas){
    this.PARAMS = behavior;
    canvas.width  = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    this.canvas = canvas;

    const {programs, webGL, colorFormats, pointers} = initWebGL(canvas);
    this.programs = programs;
    this.webGL = webGL;
    this.colorFormats = colorFormats;
    this.pointers = pointers;

    // CUSTOM: Store reference to splat() function (set after activate() call)
    this._splatAPI = null;
}

// ACTIVATE() (38. sor):
activate() {
    // CUSTOM: Store the returned API from activator (contains splat() function)
    this._splatAPI = activator(this.canvas, this.webGL, this.colorFormats, this.programs, this.pointers);
}
```

**Architektúra:**

```
activator() return value:
{
    splat: function(x, y, dx, dy, color, radius) { ... },
    canvas: <canvas element>
}
    ↓
Tárolva: this._splatAPI
    ↓
Használva: createSplat() metódusban
```

---

## Build Parancsok

### Előfeltételek

```bash
cd "samples/fluid-js/original github repo/Fluid-JS-master"

# Dependencies telepítése (ha még nem történt meg)
npm install
```

**Telepített csomagok:**
- `webpack@^5.x`
- `webpack-cli@^4.x`
- `babel-loader@^8.x`
- `@babel/core@^7.x`
- `@babel/preset-env@^7.x`
- `url-loader@^4.x`

---

### Build Folyamat (Windows)

```bash
# OpenSSL legacy provider engedélyezése (Webpack 5 compatibility)
set NODE_OPTIONS=--openssl-legacy-provider

# Production build (minified)
npm run build

# Output: lib/fluid.min.js
```

**package.json script:**
```json
{
  "scripts": {
    "build": "webpack --config webpack.config.js"
  }
}
```

---

### Build Folyamat (Linux/macOS)

```bash
# OpenSSL legacy provider engedélyezése
export NODE_OPTIONS=--openssl-legacy-provider

# Production build
npm run build
```

---

### Build Output Ellenőrzés

**Build sikeres, ha:**
1. `lib/fluid.min.js` létrejött
2. Fájlméret: ~41-42 KB (minified)
3. Banner komment tartalmazza a library verzió információkat
4. Nincs build error a console-ban

```bash
# Fájlméret ellenőrzés
ls -lh lib/fluid.min.js

# Output:
# -rw-r--r-- 1 user user 41.3K Nov  7 14:23 lib/fluid.min.js
```

---

### Finalizálás

```bash
# Build átmásolása dist/ mappába (custom build verzió)
copy lib\fluid.min.js ..\..\..\..\..\..\dist\fluid-js-custom-final.min.js

# Linux/macOS:
cp lib/fluid.min.js ../../../../../dist/fluid-js-custom-final.min.js
```

---

## Production Deployment

### GitHub Repository Struktúra

```
fluid-art-background/
├── dist/
│   └── fluid-js-custom-final.min.js  # ✅ Production build (41.3 KB)
├── samples/
│   └── fluid-js/
│       └── original github repo/
│           └── Fluid-JS-master/      # Forrás + módosított fájlok
└── CLAUDE.md                          # Projekt dokumentáció
```

---

### CDN Deployment

**Platform:** jsDelivr (GitHub-based CDN)

**CDN URL:**
```
https://cdn.jsdelivr.net/gh/tanker11/fluid-art-background@master/dist/fluid-js-custom-final.min.js
```

**Paraméterek:**
- `gh/tanker11/fluid-art-background` - GitHub repository path
- `@master` - Branch name (**FONTOS:** `master`, nem `main`!)
- `/dist/fluid-js-custom-final.min.js` - Fájl path

**Cache:**
- jsDelivr automatikus cache: 24h TTL
- Cache purge URL: `https://purge.jsdelivr.net/gh/tanker11/fluid-art-background@master/dist/fluid-js-custom-final.min.js`

---

### UNAS Webshop Integráció

**Deployment struktúra:**

```html
<!-- UNAS HEAD section -->
<script src="https://cdn.jsdelivr.net/gh/tanker11/fluid-art-background@master/dist/fluid-js-custom-final.min.js"></script>

<!-- UNAS BODY END section -->
<script>
(function() {
    'use strict';

    // Fluid inicializálás
    setTimeout(function() {
        const canvas = document.getElementById('fluid-canvas');
        if (!canvas) return;

        const myFluid = new Fluid(canvas);
        myFluid.activate();

        // createSplat() API használat
        setTimeout(function() {
            myFluid.createSplat({
                color: { r: 0, g: 255, b: 255 },  // Türkiz
                x: 0.5, y: 0.5,
                dx: 70, dy: 10,
                radius: 5.0
            });
        }, 500);
    }, 500);
})();
</script>
```

**Deployment státusz:** ✅ PRODUCTION - MŰKÖDIK (fluidartshop.hu)

---

## Build Verziókezelés

### Jelenlegi Build

| Attribútum | Érték |
|------------|-------|
| **Fájlnév** | `fluid-js-custom-final.min.js` |
| **Méret** | 41.3 KB |
| **Build dátum** | 2025-11-07 |
| **Webpack** | 5.x |
| **Babel target** | ES5 |
| **Module formátum** | UMD |

### Verzió Története

| Verzió | Dátum | Változások |
|--------|-------|------------|
| `fluid-js-custom-final.min.js` | 2025-11-07 | **CURRENT** - Teljes custom build (5 módosítás) |
| `fluid-custom-build-v1.min.js` | Archivált | Korábbi build (workaround megoldások) |
| Original Fluid-JS | 2024-05-xx | Eredeti library (haxiomic/fluid-js) |

---

## Troubleshooting

### Build Error: "error:0308010C:digital envelope routines::unsupported"

**Ok:** Webpack 5 + Node.js 17+ inkompatibilitás (OpenSSL 3.0 változások)

**Megoldás:**
```bash
# Windows
set NODE_OPTIONS=--openssl-legacy-provider

# Linux/macOS
export NODE_OPTIONS=--openssl-legacy-provider
```

---

### Build Error: "Cannot find module 'webpack'"

**Ok:** Dependencies nincs telepítve

**Megoldás:**
```bash
npm install
```

---

### Minified Output Túl Nagy (>50 KB)

**Ok:** Development mode build (`mode: 'development'` webpack.config.js-ben)

**Ellenőrzés:**
```javascript
// webpack.config.js
const isProductionMode = true;  // ✅ KELL hogy true legyen!
```

---

### createSplat() Nem Működik

**Ok:** `activate()` nem lett meghívva a Fluid instance-on

**Megoldás:**
```javascript
const myFluid = new Fluid(canvas);
myFluid.activate();  // ✅ KÖTELEZŐ createSplat() előtt!

// Most már működik:
myFluid.createSplat({ color: {r:255, g:0, b:0}, x: 0.5, y: 0.5 });
```

---

## Összefoglalás

### Módosított Fájlok

| Fájl | Változtatások Száma | Érintett Sorok |
|------|---------------------|----------------|
| `src/defaults.js` | 7 paraméter | 2, 9, 10, 21, 22, 24, 41 |
| `src/initializer.js` | 2 módosítás | 284-285 (init splat), 677-696 (radius) |
| `src/fluid.js` | 3 módosítás | 26 (constructor), 38 (activate), 219-261 (createSplat API) |

### Funkcionális Változások

| Kategória | Előny |
|-----------|-------|
| **Fizika** | Optimalizált fluid dynamics (magasabb felbontás, örvénylés, lassú halványodás) |
| **Init** | Tiszta vászon (nincs automatikus splat) |
| **API** | Programmatic splat control JavaScript-ből |
| **Flexibility** | Dinamikus radius + color + velocity kontroll |
| **Production** | CDN-ready, minified, UMD formátum |

### Build Méret Optimalizálás

- **Eredeti Fluid-JS:** ~45 KB (unmodified)
- **Custom Build:** 41.3 KB (optimalizált defaults, removed dead code)
- **Compression:** Webpack UglifyJS + Babel minification

---

## Kapcsolódó Dokumentumok

- [CLAUDE.md](CLAUDE.md) - Teljes projekt dokumentáció
- [UNAS_DEPLOYMENT_GUIDE.md](UNAS_DEPLOYMENT_GUIDE.md) - UNAS deployment részletes útmutató
- [UNAS_QUICK_START.md](UNAS_QUICK_START.md) - 5 perces gyors útmutató
- [archive/README.md](archive/README.md) - Archiválási dokumentáció

---

**Utolsó frissítés:** 2025-11-08
**Build verzió:** fluid-js-custom-final.min.js (41.3 KB)
**Státusz:** ✅ Production Ready - Deployed on fluidartshop.hu
