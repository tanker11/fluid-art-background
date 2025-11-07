# UNAS Quick Start - Gyors Beillesztési Útmutató

## 🚀 5 Perces Telepítés

### 1. Lépés: HEAD Section (Custom Build)

**UNAS Admin → Megjelenés → JavaScript/CSS → HEAD**

Válassz egy módszert:

#### Opció A: CDN (Ajánlott, ha GitHub repo publikus)

```html
<script src="https://cdn.jsdelivr.net/gh/YOUR_USERNAME/fluid-art-background@main/dist/fluid-js-custom-final.min.js"></script>
```

#### Opció B: Inline Script (Fallback)

```html
<script>
// Másold ide a dist/fluid-js-custom-final.min.js TELJES tartalmát
</script>
```

---

### 2. Lépés: BODY END Section (Paraméterek)

**UNAS Admin → Megjelenés → JavaScript/CSS → BODY END**

```html
<script>
// Másold ide a dist/unas-inject-config.js TELJES tartalmát
</script>
```

---

### 3. Lépés: Ellenőrzés

1. Nyisd meg a webshop főoldalát
2. F12 → Console
3. Keresd meg ezeket a log üzeneteket:
   - `[FluidArt] Canvas létrehozása...`
   - `[FluidArt] Canvas OK`
   - `[FluidArt] Fluid példány létrehozása...`
   - `[FluidArt] Fluid példány OK`
   - `[FluidArt] Fluid aktiválása...`
   - `[FluidArt] Fluid aktiválva`
   - `[FluidArt] Splat-ok generálása...`
   - `[FluidArt] Splat #1 létrehozva`
   - `[FluidArt] Splat #2 létrehozva`
   - `[FluidArt] Splat #3 létrehozva`
   - `[FluidArt] Splat #4 létrehozva`
   - `[FluidArt] Összes splat ütemezve`
   - `[FluidArt] Resize handler hozzáadva`

4. Ha minden zöld → Sikeres! 🎉

---

## ⚙️ Paraméterek Testreszabása

### Gyors Módosítási Workflow

1. Nyisd meg: `dist/unas-inject-config.js`
2. Módosítsd a `CONFIG` objektumot (12-112. sor)
3. Teszteld lokálisan: `test-unas-deployment.html`
4. Ha rendben, másold be az UNAS BODY END-be

### Gyakori Módosítások

#### Splat Szín Módosítása

```javascript
initialSplats: [
    {
        colorIndex: 9,  // VÁLTOZTATÁS: 6 → 9 (lila → rózsaszín)
        x: 0.5, y: 0.5,
        dx: 70, dy: 10,
        radius: 5.5,
        delay: 0
    }
]
```

#### Animáció Lassítása/Gyorsítása

```javascript
animation: {
    velocityMultiplier: 0.5  // VÁLTOZTATÁS: 1.0 → 0.5 (fele sebesség)
}
```

#### Több Splat Hozzáadása

```javascript
initialSplats: [
    // ... meglévő splat-ok
    {
        colorIndex: 13,  // Arany
        x: 0.8, y: 0.2,
        dx: -50, dy: 80,
        radius: 4.0,
        delay: 3500
    }
]
```

#### Örvénylés Növelése/Csökkentése

```javascript
fluidBehavior: {
    curl: 20  // VÁLTOZTATÁS: 5 → 20 (erősebb örvény)
}
```

---

## 🎨 Elérhető Színek (colorIndex)

| Index | Szín | RGB |
|-------|------|-----|
| 0 | Pseudo-fekete | (5, 5, 5) |
| 1 | Fehér | (255, 255, 255) |
| 2 | Türkiz | (0, 255, 255) |
| 3 | Égszínkék | (0, 200, 255) |
| 4 | Királykék | (0, 128, 255) |
| 5 | Lágy kék | (100, 150, 255) |
| 6 | Élénk lila | (204, 51, 255) |
| 7 | Levendula | (180, 100, 255) |
| 8 | Magenta | (255, 0, 255) |
| 9 | Rózsaszín | (255, 105, 180) |
| 10 | Lágy pink | (255, 150, 200) |
| 11 | Korall | (255, 127, 80) |
| 12 | Narancs | (255, 165, 0) |
| 13 | Arany | (255, 215, 0) |
| 14 | Citromsárga | (255, 255, 100) |
| 15 | Mentazöld | (0, 255, 150) |
| 16 | Smaragdzöld | (50, 255, 100) |
| 17 | Lágy zöld | (150, 255, 150) |
| 18 | Pasztell kék | (200, 230, 255) |
| 19 | Pasztell pink | (255, 200, 230) |
| 20 | Pasztell lila | (230, 200, 255) |

---

## 🐛 Hibaelhárítás

### "Fluid library nem töltődött be"

**Megoldás:**
1. Ellenőrizd: HEAD részben van-e a script?
2. CDN URL helyes? (GitHub username!)
3. Növeld: `timing.scriptLoadDelay` (500 → 1000)

### "createSplat() metódus nem elérhető"

**Megoldás:**
1. Biztos, hogy `fluid-js-custom-final.min.js`-t használod?
2. Nem a hivatalos Fluid-JS-t töltötted be véletlenül?

### Nincs animáció

**Megoldás:**
1. F12 → Console → Van hiba?
2. UNAS cache törlése
3. Inkognitó mód tesztelés

---

## 📚 További Dokumentáció

- **UNAS_DEPLOYMENT_GUIDE.md** - Részletes deployment útmutató
- **CLAUDE.md** - Teljes projekt dokumentáció
- **REGENERATION_GUIDE.md** - Build újragenerálási útmutató

---

## ✅ Checklist

- [ ] HEAD section: Custom build beillesztve
- [ ] BODY END section: Paraméterkezelő beillesztve
- [ ] Lokális teszt: `test-unas-deployment.html` működik
- [ ] UNAS teszt: Console tiszta (nincs hiba)
- [ ] Animáció: Splat-ok megjelennek
- [ ] Mobil: Működik mobilon is

---

**🎉 Kész! Az animáció fut a háttérben.**
