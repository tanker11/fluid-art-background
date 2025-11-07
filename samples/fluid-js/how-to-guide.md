# Fluid-JS Használati Útmutató

## Mi az a Fluid-JS?

A Fluid-JS egy WebGL-alapú folyadék-szimulációs könyvtár, amely GPU-gyorsítással valósít meg valósághű fluid dinamikát a böngészőben. A könyvtár a Navier-Stokes egyenleteken alapul és interaktív, élethű folyadékáramlást hoz létre.

## Telepítés

### CDN használata (ajánlott)

```html
<script src="https://cdn.jsdelivr.net/npm/fluid-canvas@latest"></script>
```

### NPM telepítés

```bash
npm install fluid-canvas
```

---

## Alapvető Használat

### 1. HTML felépítés

```html
<!DOCTYPE html>
<html>
<head>
    <style>
        body { margin: 0; overflow: hidden; }
        canvas { display: block; width: 100vw; height: 100vh; }
    </style>
</head>
<body>
    <canvas id="renderSurface"></canvas>
    <script src="https://cdn.jsdelivr.net/npm/fluid-canvas@latest"></script>
    <script src="app.js"></script>
</body>
</html>
```

### 2. JavaScript inicializálás

```javascript
// Canvas elem kiválasztása
const canvas = document.getElementById('renderSurface');

// Fluid objektum létrehozása
let myFluid = new Fluid(canvas);

// Beállítások megadása
const config = {
    sim_resolution: 128,        // Szimuláció felbontása (alacsonyabb = gyorsabb)
    dye_resolution: 512,        // Festék felbontása (magasabb = élesebb)
    dissipation: 0.97,          // Festék halványodási sebessége (0-1)
    velocity: 0.98,             // Sebesség halványodása (0-1)
    pressure: 0.8,              // Nyomás disszipáció (0-1)
    pressure_iteration: 20,     // Nyomás számítási iterációk száma
    curl: 0,                    // Örvény erőssége (0-50)
    emitter_size: 0.5,          // Splat mérete (0-1)
    render_shaders: true,       // Shader-ek használata
    multi_color: true,          // Többszínű mód
    render_bloom: false,        // Bloom effekt (világítás)
    background_color: { r: 15, g: 15, b: 15 },  // Háttérszín
    transparent: false          // Átlátszó háttér
};

// Beállítások alkalmazása
myFluid.mapBehaviors(config);

// Szimuláció aktiválása
myFluid.activate();
```

---

## Miért jelenik meg piros folt inicializáláskor?

A `fluid-editor.html` fájlban a következő történik:

### 1. Színpaletta inicializálása

```javascript
// Alapértelmezett színek beállítása (405-408. sor)
$('color1').value = '#ff0040';  // Rózsaszínes piros
$('color2').value = '#00ffd5';  // Ciánkék
$('color3').value = '#fffb00';  // Sárga
$('color4').value = '#7a00ff';  // Lila
```

### 2. Háttér automatikus alkalmazása

```javascript
// 426. sor: Háttér beállítás automatikus triggerelése
$('apply_bg').click();
```

Ez a sor automatikusan meghívja a háttér-alkalmazó funkciót, amely:
- Beállítja a háttérszínt vagy háttérképet
- **Automatikusan generál kezdeti splat-okat a színpaletta alapján**

### 3. Multi-color mód

```javascript
multi_color: true  // 220. sor
```

Ha a `multi_color` paraméter `true`, akkor a Fluid-JS könyvtár **véletlenszerűen választ a megadott színek közül** a splat-ok generálásakor. Mivel az első szín a palettában `#ff0040` (piros/rózsaszín), ez nagy valószínűséggel megjelenik az inicializáláskor.

### 4. Automatikus splat generálás

A Fluid-JS könyvtár belső működése szerint:
- Az `activate()` metódus meghívásakor
- Vagy a háttér alkalmazásakor (`apply_bg.click()`)
- Automatikusan létrehoz **kezdeti splat-okat** a vásznon

**Technikai háttér:**
A splat-ok a folyadékba injektált "festékfoltok", amelyeknek van:
- Pozíciója (x, y)
- Sebességvektora (dx, dy)
- Színe (RGB)
- Sugara (emitter_size alapján)

---

## Paraméterek Részletes Magyarázata

### Felbontási beállítások

| Paraméter | Leírás | Érték tartomány | Hatás a teljesítményre |
|-----------|--------|-----------------|------------------------|
| `sim_resolution` | Szimuláció grid felbontása | 32-512 | Alacsonyabb = gyorsabb |
| `dye_resolution` | Festék textúra felbontása | 128-2048 | Magasabb = élesebb, lassabb |

**Optimális beállítások:**
- Desktop: `sim_resolution: 128`, `dye_resolution: 512`
- Mobil: `sim_resolution: 64`, `dye_resolution: 256`

### Disszipációs beállítások

| Paraméter | Leírás | Érték tartomány | Hatás |
|-----------|--------|-----------------|-------|
| `dissipation` | Festék halványodási sebessége | 0.9-1.0 | Alacsonyabb = gyorsabb halványodás |
| `velocity` | Sebesség halványodása | 0.9-1.0 | Alacsonyabb = gyorsabb leállás |
| `pressure` | Nyomás disszipáció | 0.5-1.0 | Alacsonyabb = instabilabb áramlás |

**Tipp:** A 0.97-0.99 közötti értékek adják a legjobb vizuális eredményt.

### Fizikai beállítások

| Paraméter | Leírás | Érték tartomány | Hatás |
|-----------|--------|-----------------|-------|
| `curl` | Örvény/vorticitás erősség | 0-50 | Magasabb = turbulensebb áramlás |
| `pressure_iteration` | Nyomás solver iterációk | 10-40 | Magasabb = pontosabb, lassabb |
| `emitter_size` | Splat sugara | 0.1-1.0 | Magasabb = nagyobb festékfoltok |

### Vizuális beállítások

| Paraméter | Leírás | Típus | Hatás |
|-----------|--------|-------|-------|
| `render_shaders` | Shader-alapú renderelés | boolean | `true` = gyorsabb, szebb |
| `multi_color` | Többszínű splat-ok | boolean | `true` = véletlenszerű színek |
| `render_bloom` | Világítás/bloom effekt | boolean | `true` = világító festék |
| `transparent` | Átlátszó háttér | boolean | `true` = CSS háttér látható |
| `background_color` | Háttérszín | `{r, g, b}` | RGB értékek 0-255 |

---

## Színpaletta Beállítása

### Színek megadása

```javascript
// Színek hexadecimális formátumban
PARAMS.color1 = '#ff0040';  // Piros
PARAMS.color2 = '#00ffd5';  // Ciánkék
PARAMS.color3 = '#fffb00';  // Sárga
PARAMS.color4 = '#7a00ff';  // Lila

// Vagy RGB objektumként
myFluid.color = { r: 255, g: 0, b: 64 };
```

### Fluid Art Színpaletta (türkiz, lila, kék)

```javascript
PARAMS.color1 = '#00ffff';  // Élénk türkiz
PARAMS.color2 = '#cc33ff';  // Élénk lila
PARAMS.color3 = '#0080ff';  // Királykék
PARAMS.color4 = '#ff00ff';  // Magenta (opcionális)

myFluid.mapBehaviors({
    multi_color: true,
    background_color: { r: 255, g: 255, b: 255 }  // Fehér háttér
});
```

---

## Háttér Beállítások

### 1. Egyszínű háttér

```javascript
myFluid.mapBehaviors({
    background_color: { r: 255, g: 255, b: 255 },  // Fehér
    transparent: false
});
```

### 2. Átlátszó háttér (CSS háttér látszik)

```javascript
myFluid.mapBehaviors({
    transparent: true
});

// CSS-ben állítsd be a body hátteret
body {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

### 3. Háttérkép

```html
<style>
canvas {
    background-image: url('background.jpg');
    background-size: cover;
}
</style>
```

```javascript
myFluid.mapBehaviors({
    transparent: true  // Canvas átlátszó, háttérkép látszik
});
```

---

## Dinamikus Paraméter Módosítás

A `PARAMS` objektum segítségével futásidőben módosíthatod a beállításokat:

```javascript
// Curl érték növelése slider segítségével
document.getElementById('curl-slider').addEventListener('input', (e) => {
    PARAMS.curl = parseFloat(e.target.value);
    myFluid.mapBehaviors({ curl: PARAMS.curl });
});

// Splat méret változtatása
document.getElementById('size-slider').addEventListener('input', (e) => {
    PARAMS.emitter_size = parseFloat(e.target.value);
    myFluid.mapBehaviors({ emitter_size: PARAMS.emitter_size });
});

// Bloom effekt kapcsolása
document.getElementById('bloom-toggle').addEventListener('change', (e) => {
    PARAMS.render_bloom = e.target.checked;
    myFluid.mapBehaviors({ render_bloom: PARAMS.render_bloom });
});
```

---

## Interakció: Manuális Splat Létrehozása

Bár a Fluid-JS automatikusan kezeli az egér/érintés interakciót, manuálisan is létrehozhatsz splat-okat:

```javascript
// Splat létrehozása adott pozícióban
function createSplat(x, y, dx, dy, color) {
    myFluid.splat(x, y, dx, dy, color);
}

// Példa: Splat a vászon közepén
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
createSplat(centerX, centerY, 100, -50, { r: 255, g: 0, b: 255 });

// Véletlenszerű splat-ok generálása
setInterval(() => {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const dx = (Math.random() - 0.5) * 200;
    const dy = (Math.random() - 0.5) * 200;
    const color = {
        r: Math.random() * 255,
        g: Math.random() * 255,
        b: Math.random() * 255
    };
    createSplat(x, y, dx, dy, color);
}, 1000);
```

---

## Teljesítmény Optimalizálás

### 1. Felbontás csökkentése mobilon

```javascript
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);

const config = {
    sim_resolution: isMobile ? 64 : 128,
    dye_resolution: isMobile ? 256 : 512,
    pressure_iteration: isMobile ? 10 : 20
};

myFluid.mapBehaviors(config);
```

### 2. Reduced Motion preferencia tiszteletben tartása

```javascript
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (prefersReducedMotion) {
    myFluid.mapBehaviors({
        curl: 0,
        velocity: 0.9,  // Gyorsabb halványodás
        dissipation: 0.9
    });
}
```

### 3. FPS korlátozás

```javascript
let lastTime = 0;
const fps = 30;
const interval = 1000 / fps;

function limitedUpdate(time) {
    if (time - lastTime > interval) {
        // Fluid update
        lastTime = time;
    }
    requestAnimationFrame(limitedUpdate);
}

requestAnimationFrame(limitedUpdate);
```

---

## Hibakeresés

### Probléma: Fekete vászon, semmi nem látszik

**Megoldások:**
1. Ellenőrizd, hogy a canvas mérete megfelelően van beállítva:
```javascript
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
```

2. Győződj meg róla, hogy `activate()` meghívásra került:
```javascript
myFluid.activate();
```

3. Próbálj ki manuális splat-ot:
```javascript
myFluid.splat(canvas.width/2, canvas.height/2, 100, 100, { r: 255, g: 0, b: 0 });
```

### Probléma: Lassú animáció

**Megoldások:**
- Csökkentsd a felbontásokat: `sim_resolution: 64`, `dye_resolution: 256`
- Csökkentsd a nyomás iterációkat: `pressure_iteration: 10`
- Kapcsold ki a bloom effektet: `render_bloom: false`

### Probléma: Splat-ok túl gyorsan eltűnnek

**Megoldás:**
```javascript
myFluid.mapBehaviors({
    dissipation: 0.99,  // Növeld 1.0 felé
    velocity: 0.99
});
```

---

## Példa: Teljes Fluid Art Háttér

```javascript
const canvas = document.getElementById('renderSurface');
let myFluid = new Fluid(canvas);

// Fluid art színek (türkiz, lila, kék)
const fluidArtConfig = {
    sim_resolution: 128,
    dye_resolution: 512,
    dissipation: 0.97,
    velocity: 0.98,
    pressure: 0.8,
    pressure_iteration: 20,
    curl: 30,  // Örvénylő effekt
    emitter_size: 0.5,
    render_shaders: true,
    multi_color: true,
    render_bloom: false,
    background_color: { r: 255, g: 255, b: 255 },  // Fehér háttér
    transparent: false
};

// Színek beállítása
PARAMS.color1 = '#00ffff';  // Türkiz
PARAMS.color2 = '#cc33ff';  // Lila
PARAMS.color3 = '#0080ff';  // Királykék

myFluid.mapBehaviors(fluidArtConfig);
myFluid.activate();

// Folyamatos véletlenszerű splat-ok (opcionális)
setInterval(() => {
    if (Math.random() < 0.3) {  // 30% esély másodpercenként
        myFluid.splat(
            Math.random() * canvas.width,
            Math.random() * canvas.height,
            (Math.random() - 0.5) * 200,
            (Math.random() - 0.5) * 200
        );
    }
}, 1000);
```

---

## További Források

- **GitHub repository:** https://github.com/malik-tillman/Fluid-JS
- **NPM package:** https://www.npmjs.com/package/fluid-canvas
- **WebGL dokumentáció:** https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API

---

## Összefoglalás

A **piros folt inicializáláskor** azért jelenik meg, mert:
1. A `fluid-editor.html` beállítja a `color1` értékét `#ff0040`-re (piros)
2. A `multi_color: true` paraméter véletlenszerűen választ a színek közül
3. Az `apply_bg.click()` triggereli a háttér beállítást és **automatikus kezdeti splat-ok generálását**
4. A Fluid-JS könyvtár az `activate()` után automatikusan létrehoz splat-okat

Ha nem szeretnéd a kezdeti piros foltot:
- Változtasd meg a `color1` értékét
- Vagy állítsd be `multi_color: false` értéket és adj meg egyedi színt
- Vagy távolítsd el az `apply_bg.click()` automatikus triggerét
