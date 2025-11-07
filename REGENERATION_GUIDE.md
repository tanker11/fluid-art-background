# Deployment Fájlok Újragenerálási Útmutató

## Mikor Használd

Ez az útmutató akkor hasznos, ha változtatsz az animációs paramétereken és újra kell generálni a UNAS deployment fájlokat.

---

## 1. Csak Paraméter Változtatás (NINCS Custom Build Módosítás)

**Lépések:**

1. **Lokális tesztelés** (`test-fluidart-final.html`)
   - Nyisd meg böngészőben
   - Módosítsd az `ANIMATION_CONFIG` objektumot
   - Teszteld a változtatásokat

2. **Config export**
   ```javascript
   // Chrome DevTools Console:
   PresetManager.exportToFile()
   ```
   - Letöltött JSON: `fluid-art-config-TIMESTAMP.json`

3. **UNAS config frissítése**
   - Nyisd meg: `dist/unas-inject-config.js`
   - Másold át a változtatásokat a `CONFIG` objektumba:
     - `timing` → `timing`
     - `canvas` → `canvas`
     - `fluidBehavior` → `fluidBehavior`
     - `animation` → `animation`
     - `colors` → `colors`
     - `initialSplats` → `initialSplats`
   - Mentsd el

4. **UNAS feltöltés**
   - UNAS Admin → JavaScript/CSS → BODY END
   - Másold be a `dist/unas-inject-config.js` **TELJES tartalmát**
   - Mentsd

**Érintett fájlok:**
- ✅ `test-fluidart-final.html` - Módosítva
- ✅ `dist/unas-inject-config.js` - Frissítve
- ❌ `dist/fluid-js-custom-final.min.js` - NEM változik

---

## 2. Custom Build Módosítás (src/ Fájlok Változása)

**Mikor:** Ha módosítod a `src/defaults.js`, `src/fluid.js`, vagy `src/initializer.js` fájlokat.

**Lépések:**

1. **Forráskód módosítása**
   - `samples/fluid-js/original github repo/Fluid-JS-master/src/defaults.js`
   - `samples/fluid-js/original github repo/Fluid-JS-master/src/fluid.js`
   - `samples/fluid-js/original github repo/Fluid-JS-master/src/initializer.js`

2. **Webpack build**
   ```bash
   cd "samples/fluid-js/original github repo/Fluid-JS-master"
   set NODE_OPTIONS=--openssl-legacy-provider
   npm run build
   ```

3. **Minified fájl másolása**
   ```bash
   copy lib\fluid.min.js ..\..\..\..\dist\fluid-js-custom-final.min.js
   ```

4. **UNAS HEAD frissítése**
   - Töltsd fel az új `dist/fluid-js-custom-final.min.js` fájlt
   - VAGY másold be az új tartalmát inline script-ként

**Érintett fájlok:**
- ✅ `src/defaults.js`, `src/fluid.js`, `src/initializer.js` - Módosítva
- ✅ `dist/fluid-js-custom-final.min.js` - Újragenerálva
- ❌ `dist/unas-inject-config.js` - NEM változik (hacsak nem módosítasz paramétereket is)

---

## 3. Teljes Újragenerálás (Build + Config)

**Mikor:** Ha mindent újragenerálsz (forráskód ÉS paraméterek).

**Lépések:**

1. **Forráskód módosítása** (lásd: "2. Custom Build Módosítás")

2. **Webpack build** (lásd: "2. Custom Build Módosítás")

3. **Paraméterek módosítása** (lásd: "1. Csak Paraméter Változtatás")

4. **UNAS feltöltés**
   - HEAD: `dist/fluid-js-custom-final.min.js`
   - BODY END: `dist/unas-inject-config.js`

---

## Gyors Referencia Táblázat

| Mit Változtatsz | Újragenerálás | Érintett Fájlok | UNAS Frissítés |
|-----------------|---------------|------------------|----------------|
| **Paraméterek** (timing, colors, splats) | Config export → unas-inject-config.js | `dist/unas-inject-config.js` | BODY END |
| **Fizikai defaults** (src/defaults.js) | Webpack build | `dist/fluid-js-custom-final.min.js` | HEAD |
| **createSplat API** (src/fluid.js) | Webpack build | `dist/fluid-js-custom-final.min.js` | HEAD |
| **Init splat fix** (src/initializer.js) | Webpack build | `dist/fluid-js-custom-final.min.js` | HEAD |
| **Minden** | Build + Config | Mindkét fájl | HEAD + BODY END |

---

## Ellenőrzési Checklist

### Build Után

- [ ] `dist/fluid-js-custom-final.min.js` létezik
- [ ] Fájl méret ~41-42 KB
- [ ] Minified kód (egyetlen sor, nincs whitespace)

### Config Után

- [ ] `dist/unas-inject-config.js` frissítve
- [ ] CONFIG objektum tartalmazza az új paramétereket
- [ ] Szintaktikai hiba nincs (JSON formátum helyes)

### UNAS Feltöltés Után

- [ ] Webshop főoldal betöltése
- [ ] F12 → Console → Nincs hiba
- [ ] Fluid animáció látható
- [ ] Kezdeti splat-ok megjelennek (türkiz, lila, arany)

---

## Hibaelhárítás

### "Fluid library not loaded"

**Ok:** Custom build nem töltődött be időben

**Megoldás:**
- Növeld `timing.scriptLoadDelay` értéket (500 → 1000)

### "createSplat API not available"

**Ok:** Nem a custom build-et használod, VAGY nem build-elted újra

**Megoldás:**
- Ellenőrizd: `dist/fluid-js-custom-final.min.js` az új build?
- Futtasd újra: `npm run build`

### Webpack build hiba

**Ok:** NODE_OPTIONS nincs beállítva

**Megoldás:**
```bash
set NODE_OPTIONS=--openssl-legacy-provider
npm run build
```

---

## Backup Best Practices

### Verziókezelés

Minden build után mentsd el a fájlokat verzióval:

```
dist/
├── fluid-js-custom-final.min.js
├── fluid-js-custom-final-v1.0.0.min.js (backup)
├── unas-inject-config.js
└── unas-inject-config-v1.0.0.js (backup)
```

### Git Commit

```bash
git add dist/fluid-js-custom-final.min.js
git add dist/unas-inject-config.js
git commit -m "Update: új fizikai paraméterek + 5 kezdeti splat"
git tag v1.0.1
```

---

## Gyors Parancsok

### Build

```bash
cd "samples/fluid-js/original github repo/Fluid-JS-master" && set NODE_OPTIONS=--openssl-legacy-provider && npm run build && copy lib\fluid.min.js ..\..\..\..\dist\fluid-js-custom-final.min.js
```

### Fájl Ellenőrzés

```bash
cd dist && dir /b
```

### Méret Ellenőrzés

```bash
cd dist && dir fluid-js-custom-final.min.js
cd dist && dir unas-inject-config.js
```

---

## Összefoglalás

**Paraméter változtatás workflow:**
1. `test-fluidart-final.html` → ANIMATION_CONFIG módosítás
2. PresetManager.exportToFile()
3. `dist/unas-inject-config.js` → CONFIG frissítés
4. UNAS BODY END → új config beillesztése

**Build változtatás workflow:**
1. `src/*.js` módosítás
2. Webpack build
3. `lib/fluid.min.js` → `dist/fluid-js-custom-final.min.js` másolás
4. UNAS HEAD → új build feltöltése

**Minden esetben:**
- ✅ Tesztelés lokálisan (`test-fluidart-final.html`)
- ✅ Build/Config újragenerálás
- ✅ UNAS feltöltés
- ✅ Production tesztelés (F12 Console ellenőrzés)
