# UNAS Deployment - Gyors Útmutató

## Fájlok

| Fájl | Méret | Hova | Leírás |
|------|-------|------|--------|
| **fluid-js-custom-final.min.js** | 42 KB | HEAD | Custom Fluid-JS build |
| **unas-inject-config.js** | ~3 KB | BODY END | Konfiguráció + inicializálás |

---

## UNAS Beillesztés (Production)

### 1. HEAD Részbe

**UNAS Admin → JavaScript/CSS → HEAD**

Töltsd fel a **fluid-js-custom-final.min.js** fájlt UNAS script kezelőbe, vagy használd a UNAS file upload funkciót, majd add hozzá:

```html
<script src="/path/to/fluid-js-custom-final.min.js"></script>
```

**VAGY** inline (script tartalom beillesztése):

```html
<script>
/* fluid-js-custom-final.min.js TELJES tartalma ide */
</script>
```

---

### 2. BODY END Részbe

**UNAS Admin → JavaScript/CSS → BODY END**

Másold be a **unas-inject-config.js** fájl **TELJES tartalmát** (script tagek NÉLKÜL):

```javascript
(function() {
    'use strict';
    var CONFIG = {
        timing: { ... },
        canvas: { ... },
        fluidBehavior: { ... },
        // ... teljes konfiguráció
    };
    // ... inicializálás
})();
```

---

## Paraméterek Módosítása

A `unas-inject-config.js` fájl elején lévő **CONFIG objektumot** szerkeszd:

### Időzítések

```javascript
timing: {
    scriptLoadDelay: 500,        // Fluid library betöltés utáni várakozás (ms)
    fluidInitDelay: 500,         // Fluid activate után várakozás (ms)
    splatCreationDelay: 500      // Splat generálás előtti várakozás (ms)
}
```

### Canvas Beállítások

```javascript
canvas: {
    zIndex: -1,                  // Háttérben marad (-1)
    pointerEvents: 'none',       // Át lehet kattintani ('none')
    position: 'fixed'            // Fix pozíció ('fixed')
}
```

### Fizikai Paraméterek

```javascript
fluidBehavior: {
    sim_resolution: 256,         // 32-512 (GPU texture, magasabb = jobb minőség, lassabb)
    dye_resolution: 512,         // 128-2048 (szín felbontás)
    dissipation: 1.0,            // 0.9-1.0 (1 = nincs halványodás)
    velocity: 0.999,             // 0.9-1.0 (mozgás lassulása)
    pressure: 0.6,               // 0.0-1.0
    pressure_iteration: 20,      // 10-50
    curl: 5,                     // 0-50 (örvénylés, magasabb = több örvény)
    emitter_size: 1.0,           // 0.1-3.0 (nem használt, radius override-olja)
    render_bloom: false,         // true = fény effekt (teljesítmény igényes)
    background_color: { r: 0, g: 0, b: 0 }  // Fekete háttér
}
```

### Színek Módosítása

```javascript
colors: [
    { r: 5, g: 5, b: 5 },        // 0: Sötét szürke (pseudo-fekete)
    { r: 255, g: 255, b: 255 },  // 1: Fehér
    { r: 0, g: 255, b: 255 },    // 2: Türkiz
    // ... 21 szín összesen
]
```

**Új szín hozzáadása:**
```javascript
{ r: 255, g: 100, b: 50 }  // Narancsos színárnyalat
```

### Kezdeti Splat-ok Módosítása

```javascript
initialSplats: [
    {
        colorIndex: 6,           // colors tömb index (0-20)
        x: 0.5,                  // X pozíció (0-1, 0.5 = középen)
        y: 0.5,                  // Y pozíció (0-1, 0.5 = középen)
        dx: 70,                  // X sebesség
        dy: 10,                  // Y sebesség
        radius: 5.5,             // Splat sugár
        delay: 0                 // Késleltetés (ms)
    },
    // ... további splat-ok
]
```

**Splat eltávolítása:** Töröld a sorokat

**Új splat hozzáadása:** Másold le egy meglévőt és módosítsd

---

## Gyors Változtatások Példák

### 1. Gyorsabb Áramlás

```javascript
fluidBehavior: {
    dissipation: 0.95,  // Gyorsabb halványodás (volt: 1.0)
    velocity: 0.95,     // Gyorsabb lassulás (volt: 0.999)
}
```

### 2. Több Örvény

```javascript
fluidBehavior: {
    curl: 20,           // Több örvénylés (volt: 5)
}
```

### 3. Magasabb Minőség

```javascript
fluidBehavior: {
    sim_resolution: 512,  // Maximum (volt: 256)
    dye_resolution: 1024, // Maximum (volt: 512)
}
```

### 4. Kevesebb Kezdeti Splat

```javascript
initialSplats: [
    { colorIndex: 6, x: 0.5, y: 0.5, dx: 70, dy: 10, radius: 5.5, delay: 0 }
    // Töröld a többi splat-ot
]
```

---

## Hibaelhárítás

### Probléma: Nincs animáció

**Ellenőrizd:**
1. F12 → Console → Van-e hiba?
2. **fluid-js-custom-final.min.js** betöltődött-e? (HEAD rész)
3. **unas-inject-config.js** szerepel-e? (BODY END rész)

**Megoldás:**
- Ellenőrizd a script sorrendet: HEAD-ben a library, BODY END-ben a config

### Probléma: "Fluid library not loaded" hiba

**Ok:** A custom build nem töltődött be időben

**Megoldás:**
- Növeld a `timing.scriptLoadDelay` értéket (500 → 1000)

### Probléma: "createSplat API not available" hiba

**Ok:** Nem a custom build-et használod

**Megoldás:**
- Ellenőrizd, hogy **fluid-js-custom-final.min.js**-t használod (NEM fluid.min.js!)

---

## Build Újragenerálás (ha változtatsz a custom build-en)

### 1. Forráskód módosítása

Szerkeszd a következő fájlokat:

- `samples/fluid-js/original github repo/Fluid-JS-master/src/defaults.js` - Alapértelmezett fizikai paraméterek
- `samples/fluid-js/original github repo/Fluid-JS-master/src/fluid.js` - createSplat() API
- `samples/fluid-js/original github repo/Fluid-JS-master/src/initializer.js` - Init splat eltávolítás

### 2. Webpack Build

```bash
cd "samples/fluid-js/original github repo/Fluid-JS-master"
set NODE_OPTIONS=--openssl-legacy-provider
npm run build
```

### 3. Másolás

```bash
copy lib\fluid.min.js ..\..\..\..\dist\fluid-js-custom-final.min.js
```

### 4. UNAS Frissítés

- Cseréld le a **fluid-js-custom-final.min.js** fájlt UNAS-ban
- **unas-inject-config.js** paramétereit szerkeszd, ha szükséges

---

## Config Fájl Újragenerálás

Ha változtatsz a paramétereken a `test-fluidart-final.html` fájlban:

### 1. Lokális Tesztelés

```bash
# Nyisd meg: test-fluidart-final.html
# Böngésző: Teszteld a változtatásokat
```

### 2. Config Export

```javascript
// Chrome DevTools Console-ban:
PresetManager.exportToFile('my-config.json')
```

### 3. Config Újragenerálás

Szerkeszd a `dist/unas-inject-config.js` fájlt:

- Másold át a változtatásokat a `CONFIG` objektumba
- Ellenőrizd a szintaxist (JSON formátum!)
- UNAS-ba másold be a frissített tartalmat (BODY END)

---

## Utasítások Később (saját referencia)

### Teljes Deployment Újragenerálás

1. **Lokális teszt módosítása**: `test-fluidart-final.html` → ANIMATION_CONFIG szerkesztése
2. **Tesztelés**: Böngésző → ellenőrzés
3. **Config export**: PresetManager.exportToFile()
4. **UNAS config frissítése**: `dist/unas-inject-config.js` → CONFIG objektum update
5. **Custom build újragenerálás** (ha src/ változott): Webpack build → copy
6. **UNAS feltöltés**: HEAD (build) + BODY END (config)

### Gyors Paraméter Változtatás (nincs build)

1. `dist/unas-inject-config.js` szerkesztése
2. CONFIG objektum módosítása
3. UNAS BODY END frissítése

### Custom Build Változtatás (src/ módosítás)

1. `src/defaults.js`, `src/fluid.js`, `src/initializer.js` szerkesztése
2. Webpack build (`npm run build`)
3. `lib/fluid.min.js` → `dist/fluid-js-custom-final.min.js` másolás
4. UNAS HEAD frissítése

---

## Összefoglalás

✅ **Egyszerű deployment**: 2 fájl (HEAD + BODY END)
✅ **Nincs CDN dependency**: Minden feltöltött script
✅ **Tiszta kód**: Nincs console log elem, nincs PresetManager
✅ **Könnyen módosítható**: CONFIG objektum szerkesztése
✅ **Production ready**: Minified, optimalizált
