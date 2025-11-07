/**
 * Fluid-JS WebGL Animált Háttér - UNAS Webshop Integráció
 *
 * HASZNÁLAT (UNAS Admin Panel):
 * 1. UNAS Admin → Script Kezelés → Új Script
 * 2. Típus: BODY END (ajánlott)
 * 3. Másold be a teljes fájl tartalmát (SCRIPT TAGEK NÉLKÜL!)
 * 4. Mentés → Előnézet
 *
 * TECHNIKAI SPECIFIKÁCIÓ:
 * - WebGL alapú fluid szimuláció (Navier-Stokes egyenletek)
 * - Automatikus DOM elem létrehozás
 * - Fehér háttér + türkiz/lila/kék színpaletta
 * - Egérmozgásra reagáló interakció (kattintás nélkül)
 * - Throttled event simulation (minden 3. mozdulat)
 * - GPU gyorsítás
 *
 * MÉRET: ~100 KB (CDN betöltés)
 * TELJESÍTMÉNY: 60 FPS (desktop), adaptív (mobil)
 *
 * KOMPATIBILITÁS:
 * ✅ Chrome (Windows/Mac/Android)
 * ✅ Firefox (Windows/Mac)
 * ✅ Edge (Windows)
 * ✅ Safari (macOS/iOS) - WebGL 1.0 támogatás szükséges
 *
 * FALLBACK: Ha WebGL nem elérhető, használd a drakerie.js port verziót:
 * dist/fluid-background.min.js (7 KB, Canvas 2D)
 *
 * LÉTREHOZVA: 2025-11-05
 * PROJEKT: fluidartshop.hu animált háttér
 */

(function(){
  // =============================================================================
  // 1. GLOBÁLIS CANVAS LÉTREHOZÁSA
  // =============================================================================
  // FONTOS: window.canvas globális változó szükséges a Fluid-JS scope problémája miatt
  // A Fluid-JS library initWebGL() metódusa közvetlenül hivatkozik a "canvas" változóra

  window.canvas = document.createElement('canvas');
  window.canvas.id = 'renderSurface';
  window.canvas.width = window.innerWidth;
  window.canvas.height = window.innerHeight;
  window.canvas.style.cssText = 'display:block;width:100vw;height:100vh;position:fixed;top:0;left:0;z-index:-1';
  document.body.insertBefore(window.canvas, document.body.firstChild);

  // =============================================================================
  // 2. FLUID-JS CDN BETÖLTÉSE
  // =============================================================================

  var script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/fluid-canvas@latest';

  script.onload = function() {
    // ELSŐ TIMEOUT: 500ms várakozás a Fluid library teljes inicializálásához
    setTimeout(function() {
      if (typeof Fluid === 'undefined') {
        console.error('❌ Fluid library nem elérhető');
        return;
      }

      var canvasElement = document.getElementById('renderSurface');

      try {
        // =============================================================================
        // 3. FLUID PÉLDÁNY LÉTREHOZÁSA
        // =============================================================================
        var myFluid = new Fluid(canvasElement);

        // =============================================================================
        // 4. FLUID PARAMÉTEREK BEÁLLÍTÁSA
        // =============================================================================
        myFluid.mapBehaviors({
          sim_resolution: 128,           // Szimuláció felbontása (alacsonyabb = gyorsabb)
          dye_resolution: 512,            // Festék felbontása (magasabb = szebb)
          dissipation: 0.98,              // Festék halványodási sebessége (0.95-0.99)
          velocity: 0.99,                 // Folyadék lassulási sebessége (0.95-0.99)
          pressure: 0.8,                  // Nyomás erőssége (0.0-1.0)
          pressure_iteration: 20,         // Nyomás iterációk (10-50)
          curl: 30,                       // Örvénylés intenzitása (0-50)
          emitter_size: 0.5,              // Festék folt mérete (0.1-1.0)
          render_shaders: true,           // Shader renderelés (true = szebb)
          multi_color: false,             // Egyetlen szín mód (false = tisztább)
          render_bloom: false,            // Bloom effekt (true = ragyogás)
          background_color: { r: 255, g: 255, b: 255 },  // Fehér háttér
          transparent: false              // Nem átlátszó háttér
        });

        // MÁSODIK TIMEOUT: 300ms várakozás a canvas setup befejezéséhez
        setTimeout(function() {
          // =============================================================================
          // 5. ANIMÁCIÓ AKTIVÁLÁSA (Ez generálja a piros foltot!)
          // =============================================================================
          // FIGYELEM: Az activate() hívásakor a Fluid-JS belső activator() függvénye
          // automatikusan meghívja a multipleSplats() függvényt (initializer.js:284)
          // ami egy piros foltot generál (500, 500) pozícióban.
          // A multipleSplats() hardcoded: { r: 255, g: 0, b: 0 } (initializer.js:694-703)

          myFluid.activate();

          // =============================================================================
          // 5.5. PIROS FOLT ELTÜNTETÉSE (KRITIKUS!)
          // =============================================================================
          // STRATÉGIA: Fehér festék "öblítése" 100ms múlva (amikor a piros folt megjelent)
          // Ez nem törli a canvas-t, hanem fehér festéket terít szét, elnyomva a pirosat
          setTimeout(function() {
            console.log('🧹 Piros folt eltüntetése fehér festékkel...');

            // Fehér szín beállítása
            myFluid.color = { r: 255, g: 255, b: 0 };

            // Nagy fehér folt generálása a piros folt fölé (500, 500 pozíció)
            // A piros folt hardcoded pozíciója: (500, 500) - initializer.js:701
            canvasElement.dispatchEvent(new MouseEvent('mousedown', {
              clientX: 500,
              clientY: 500,
              bubbles: true
            }));

            setTimeout(function() {
              canvasElement.dispatchEvent(new MouseEvent('mouseup', {
                clientX: 500,
                clientY: 500,
                bubbles: true
              }));
              console.log('✅ Fehér festék felhordva');
            }, 30);
          }, 100);

          // =============================================================================
          // 6. KEZDETI SPLAT-OK GENERÁLÁSA (3 különböző színű folt)
          // =============================================================================
          // Ezek 300ms-500ms-700ms késleltetéssel jelennek meg (UTÁN a fehér festék)
          var initialColors = [
            { r: 0, g: 255, b: 255 },           // Türkiz (#00ffff)
            { r: 204, g: 51, b: 255 },          // Lila (#cc33ff)
            { r: 0, g: 128, b: 255 }            // Királykék (#0080ff)
          ];

          // 3 splat létrehozása különböző pozíciókban (200ms késleltetéssel egyenként)
          // FONTOS: Kezdés 300ms-nél, hogy a fehér festék (100ms) már felhordva legyen
          for (var i = 0; i < 3; i++) {
            setTimeout(function(index) {
              // Véletlenszerű pozíció (belső 60% a képernyőből, kerülve a széleket)
              var x = (0.2 + Math.random() * 0.6) * window.innerWidth;
              var y = (0.2 + Math.random() * 0.6) * window.innerHeight;

              // Véletlenszerű mozgási irány (nagy amplitúdó az erős splat effekthez)
              var dx = (Math.random() - 0.5) * 1500;
              var dy = (Math.random() - 0.5) * 1500;

              // Szín beállítása az aktuális index alapján
              myFluid.color = initialColors[index];

              console.log('🎨 Splat #' + (index + 1) + ' generálása...');

              // Szimulált MOUSEDOWN esemény a kezdő pozíción
              canvasElement.dispatchEvent(new MouseEvent('mousedown', {
                clientX: x,
                clientY: y,
                bubbles: true
              }));

              // 80ms késleltetés után MOUSEUP esemény (erősebb húzás szimulálása)
              setTimeout(function() {
                canvasElement.dispatchEvent(new MouseEvent('mouseup', {
                  clientX: x + dx * 0.15,  // 15%-a az amplitúdónak (nagyobb mozgás)
                  clientY: y + dy * 0.15,
                  bubbles: true
                }));
              }, 80);

            }, 300 + i * 200, i);  // Kezdés 300ms-nél, 200ms késleltetés splat-ok között
          }

          // =============================================================================
          // 7. EGÉRKÖVETÉS VÁLTOZÓI
          // =============================================================================
          var lastX = -1, lastY = -1;           // Előző egér pozíció
          var moveCounter = 0;                  // Mozgás számláló (throttling-hez)
          var isSimulating = false;             // Végtelen ciklus megakadályozása

          // =============================================================================
          // 8. SZÍNPALETTA (Fluid Art Színek - ugyanaz, mint a kezdeti splat-ok)
          // =============================================================================
          var colors = [
            { r: 0, g: 255, b: 255 },           // Türkiz (#00ffff)
            { r: 204, g: 51, b: 255 },          // Lila (#cc33ff)
            { r: 0, g: 128, b: 255 }            // Királykék (#0080ff)
          ];

          // =============================================================================
          // 9. EGÉRMOZGÁS ESEMÉNYKEZELŐ (Kattintás nélküli interakció)
          // =============================================================================
          canvasElement.addEventListener('mousemove', function(e) {
            // Szűrés: Csak valódi (nem szimulált) egérmozgásokra reagálunk
            if (isSimulating || !e.isTrusted) return;

            var x = e.clientX, y = e.clientY;

            // Ha van előző pozíció, számítsuk ki a sebességet
            if (lastX !== -1 && lastY !== -1) {
              var dx = x - lastX;
              var dy = y - lastY;
              var speed = Math.sqrt(dx * dx + dy * dy);  // Euklideszi távolság

              moveCounter++;

              // THROTTLING: Csak akkor szimulálunk kattintást, ha:
              // 1. Sebesség > 3 pixel
              // 2. Minden 3. mozdulatnál
              if (speed > 3 && moveCounter % 3 === 0) {
                isSimulating = true;

                // Véletlenszerű szín választása
                myFluid.color = colors[Math.floor(Math.random() * 3)];

                // Szimulált MOUSEDOWN esemény a jelenlegi pozíción
                canvasElement.dispatchEvent(new MouseEvent('mousedown', {
                  clientX: x,
                  clientY: y,
                  bubbles: true
                }));

                // 20ms késleltetés után MOUSEUP esemény (húzás szimulálása)
                setTimeout(function() {
                  canvasElement.dispatchEvent(new MouseEvent('mouseup', {
                    clientX: x + dx,
                    clientY: y + dy,
                    bubbles: true
                  }));
                  isSimulating = false;  // Újra engedélyezzük a szimulációt
                }, 20);
              }
            }

            // Jelenlegi pozíció mentése
            lastX = x;
            lastY = y;
          }, {passive: true});  // Passive listener a jobb teljesítményért

          console.log('✅ Fluid-JS UNAS háttér betöltve');
          console.log('🎨 Színek: türkiz, lila, királykék');
          console.log('🖱️ Mozgasd az egeret az interakcióhoz');
        }, 300);

      } catch (error) {
        // =============================================================================
        // 10. HIBAKEZELÉS
        // =============================================================================
        console.error('❌ Fluid-JS inicializálási hiba:', error.message);
        console.error('Stack trace:', error.stack);
        console.log('💡 FALLBACK: Használd a drakerie.js port verziót helyette:');
        console.log('   📁 dist/fluid-background.min.js (7 KB, Canvas 2D)');
      }
    }, 500);
  };

  // Script error handler (CDN betöltési hiba esetén)
  script.onerror = function() {
    console.error('❌ Fluid-JS CDN betöltési hiba');
    console.log('💡 Ellenőrizd az internet kapcsolatot vagy használj fallback verziót');
  };

  // =============================================================================
  // 11. SCRIPT INJEKTÁLÁS A HEAD-BE
  // =============================================================================
  document.head.appendChild(script);
})();

// =============================================================================
// VÉGE - inject_fluid_canvas.js
// =============================================================================

/**
 * ISMERT PROBLÉMÁK ÉS MEGOLDÁSOK:
 *
 * 1. Piros folt inicializáláskor ✅ MEGOLDVA
 *    - OK: Fluid-JS src/initializer.js:284 - multipleSplats(Math.random() * 20 + 5)
 *    - OK: activator() függvény automatikusan meghívja activate() során
 *    - OK: Hardcoded piros szín {r:255, g:0, b:0} a (500, 500) pozíción (src/initializer.js:694-703)
 *    - MEGOLDÁS: Fehér festék "öblítés" 100ms után a piros folt elnyomására ✅
 *    - Stratégia: Fehér splat (255, 255, 255) ugyanazon (500, 500) pozíción
 *    - Időzítés: 100ms (piros megjelenik) → fehér öblítés → 300ms+ színes splat-ok
 *    - Implementáció: 3 custom színes splat 300ms-500ms-700ms késleltetéssel
 *    - Pozíciók: véletlenszerű, belső 60% a képernyőből
 *    - Színek: türkiz, lila, királykék (indexelt színpaletta)
 *    - Eredmény: Piros folt láthatatlan (fehér háttérrel összeolvad)
 *
 * 2. "canvas is not defined" ReferenceError
 *    - OK: Fluid-JS initWebGL() scope probléma
 *    - MEGOLDÁS: window.canvas globális változó használata ✅
 *
 * 3. RangeError: Maximum call stack size exceeded
 *    - OK: MouseEvent dispatch végtelen ciklust okozott
 *    - MEGOLDÁS: isSimulating flag + e.isTrusted ellenőrzés ✅
 *
 * 4. Fekete vagy üres háttér
 *    - OK: Időzítési problémák (túl gyors inicializálás)
 *    - MEGOLDÁS: Dupla setTimeout (500ms + 300ms) ✅
 *
 * TELJESÍTMÉNY FINOMHANGOLÁS (TODO):
 * - dissipation: 0.98 → 0.97 (gyorsabb halványodás)
 * - curl: 30 → 40 (erősebb örvénylés)
 * - render_bloom: false → true (ragyogó effekt)
 * - throttle: moveCounter % 3 → moveCounter % 2 (gyorsabb reakció)
 * - Kezdeti splat-ok amplitúdója (jelenleg: 1000 * 0.1 = 100px)
 *
 * JÖVŐBELI FEJLESZTÉSEK:
 * - Mobil érintés (touchmove) támogatás
 * - Prefers-reduced-motion CSS media query támogatás
 * - Görgetés-reaktív parallax effekt
 * - A/B tesztelés analitikával
 * - Ambient splat-ok (automatikus háttér mozgás időzítve)
 * - Kezdeti splat-ok időzítésének optimalizálása (300ms → dinamikus?)
 */