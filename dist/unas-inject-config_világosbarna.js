// ============================================
// FLUID ART BACKGROUND - UNAS DEPLOYMENT CONFIG
// ============================================
// Ez a fájl az UNAS webshop BODY END részébe kerül
// Feltételezi, hogy a HEAD-ben már betöltődött a fluid-js-custom-final.min.js

(function() {
    'use strict';

    // ============================================
    // KONFIGURÁCIÓS OBJEKTUM - ANIMÁCIÓS PARAMÉTEREK
    // ============================================

    const CONFIG = {
        // Időzítések (milliszekundum)
        timing: {
            scriptLoadDelay: 500,        // Fluid library betöltése után várakozás
            fluidInitDelay: 500,         // Fluid activate() után várakozás
            splatCreationDelay: 500,     // createSplat() elérhetőség előtti várakozás
        },

        // Canvas beállítások
        canvas: {
            zIndex: -1,
            pointerEvents: 'none',
            position: 'fixed'
        },

        // Fluid Behavior paraméterek - TELJES FIZIKAI KONFIGURÁCIÓ
        fluidBehavior: {
            sim_resolution: 256,
            dye_resolution: 512,
            dissipation: 1,
            velocity: 1,
            pressure: 0.9,
            pressure_iteration: 20,
            curl: 1,
            emitter_size: 1.0,
            render_shaders: true,
            multi_color: false,
            render_bloom: false,
            bloom_iterations: 8,
            bloom_resolution: 256,
            intensity: 0.8,
            threshold: 0.6,
            soft_knee: 0.9,
            background_color: { r: 204, g: 187, b: 173 },
            transparent: false
        },

        // Animáció sebesség szabályozás
        animation: {
            velocityMultiplier: 1.0
        },

        // Színpaletta (21 szín)
        colors: [
            { r: 5, g: 5, b: 5 },         // 0: Nagyon sötét szürke (pszeudo-fekete)
            { r: 255, g: 255, b: 255 },   // 1: Fehér
            { r: 204, g: 187, b: 173 },     // 2: Türkiz (cyan)
            { r: 0, g: 200, b: 255 },     // 3: Égszínkék
            { r: 0, g: 128, b: 255 },     // 4: Királykék
            { r: 100, g: 150, b: 255 },   // 5: Lágy kék
            { r: 172, g: 158, b: 146 },    // 6: Élénk lila
            { r: 180, g: 100, b: 255 },   // 7: Levendula
            { r: 255, g: 0, b: 255 },     // 8: Magenta
            { r: 255, g: 105, b: 180 },   // 9: Rózsaszín (hot pink)
            { r: 255, g: 150, b: 200 },   // 10: Lágy pink
            { r: 255, g: 127, b: 80 },    // 11: Korall
            { r: 255, g: 165, b: 0 },     // 12: Narancs
            { r: 255, g: 215, b: 0 },     // 13: Arany
            { r: 255, g: 255, b: 100 },   // 14: Citromsárga
            { r: 0, g: 255, b: 150 },     // 15: Mentazöld
            { r: 50, g: 255, b: 100 },    // 16: Smaragdzöld
            { r: 150, g: 255, b: 150 },   // 17: Lágy zöld
            { r: 200, g: 230, b: 255 },   // 18: Pasztell kék
            { r: 255, g: 200, b: 230 },   // 19: Pasztell pink
            { r: 230, g: 200, b: 255 }    // 20: Pasztell lila
        ],

        // Kezdeti splat-ok konfigurációja
        initialSplats: [
            {
                colorIndex: 6,           // Élénk lila
                x: 0.5, y: 0.5,
                dx: 70, dy: 10,
                radius: 10,
                delay: 0
            },
            {
                colorIndex: 2,           // Türkiz
                x: 0.3, y: 0.5,
                dx: 50, dy: -20,
                radius: 10,
                delay: 1200
            },
            {
                colorIndex: 6,           // Élénk lila
                x: 0.1, y: 0.3,
                dx: 200, dy: -100,
                radius: 10,
                delay: 2800
            },
            {
                colorIndex: 11,          // Arany
                x: 0.1, y: 0.3,
                dx: 300, dy: 50,
                radius: 10,
                delay: 5000
            }
        ]
    };

    // ============================================
    // DEBUG LOGGING
    // ============================================

    function log(msg, type) {
        var prefix = '[FluidArt] ';
        if (type === 'error') {
            console.error(prefix + msg);
        } else if (type === 'warning') {
            console.warn(prefix + msg);
        } else {
            console.log(prefix + msg);
        }
    }

    // ============================================
    // CANVAS LÉTREHOZÁSA
    // ============================================

    log('Canvas létrehozása...');
    var canvas = document.createElement('canvas');
    canvas.id = 'fluidArtCanvas';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // UNAS Debug info
    console.log('???? Canvas méret:', canvas.width, 'x', canvas.height);
    console.log('???? Canvas z-index:', CONFIG.canvas.zIndex);

    canvas.style.cssText = 'display:block;width:100vw;height:100vh;' +
        'position:' + CONFIG.canvas.position + ';' +
        'top:0;left:0;' +
        'z-index:' + CONFIG.canvas.zIndex + ';' +
        'pointer-events:' + CONFIG.canvas.pointerEvents +
        ';background:transparent;margin:0;padding:0;';

    document.body.insertBefore(canvas, document.body.firstChild);
    log('Canvas OK - DOM elem beillesztve', 'success');

    // ============================================
    // FLUID INICIALIZÁLÁS
    // ============================================

    var fluidInitStartTime = Date.now();

    setTimeout(function() {
        var fluidCheckTime = Date.now() - fluidInitStartTime;
        log('Fluid library check (' + fluidCheckTime + 'ms)...');

        if (typeof Fluid === 'undefined') {
            log('HIBA: Fluid library nem töltődött be! Ellenőrizd a HEAD részben a script-et.', 'error');
            console.error('❌ Fluid global object nincs definiálva!');
            console.error('   HEAD-ben van a fluid-js-custom-final.min.js?');
            return;
        }

        log('Fluid példány létrehozása...', 'warning');
        try {
            var myFluid = new Fluid(canvas);
            log('Fluid példány OK', 'success');
        } catch (e) {
            log('HIBA Fluid konstruktorban: ' + e.message, 'error');
            console.error('❌ Fluid init hiba:', e);
            return;
        }

        // Behavior override (config alapján)
        try {
            myFluid.mapBehaviors(CONFIG.fluidBehavior);
            log('Fluid behavior-ok alkalmazva', 'success');
        } catch (e) {
            log('HIBA behavior alkalmazáskor: ' + e.message, 'error');
        }

        // Fluid aktiválás
        try {
            log('Fluid aktiválása...', 'warning');
            myFluid.activate();
            log('Fluid aktiválva - WebGL inicializálás kész', 'success');

            // WebGL state check
            if (myFluid.webGL) {
                console.log('✅ WebGL context betöltve');
                console.log('   Drawing buffer size:', myFluid.webGL.drawingBufferWidth, 'x', myFluid.webGL.drawingBufferHeight);
            }
        } catch (e) {
            log('HIBA Fluid activate-ben: ' + e.message, 'error');
            console.error('❌ Fluid aktiválás sikertelen:', e);
            return;
        }

        // Várakozás inicializálásra
        setTimeout(function() {
            var splatInitTime = Date.now() - fluidInitStartTime;
            log('Splat-ok generálása (' + splatInitTime + 'ms után)...', 'warning');

            // createSplat() ellenőrzés
            if (typeof myFluid.createSplat !== 'function') {
                log('HIBA: createSplat() metódus nem elérhető!', 'error');
                console.error('❌ createSplat() nem található!');
                console.error('   Methods:', Object.keys(myFluid).join(', '));
                return;
            }

            log('✅ createSplat() metódus OK', 'success');

            // Kezdeti splat-ok processálása
            var INITIAL_SPLATS = CONFIG.initialSplats.map(function(splat) {
                return {
                    color: CONFIG.colors[splat.colorIndex],
                    x: splat.x,
                    y: splat.y,
                    dx: splat.dx * CONFIG.animation.velocityMultiplier,
                    dy: splat.dy * CONFIG.animation.velocityMultiplier,
                    radius: splat.radius,
                    delay: splat.delay
                };
            });

            log('Splat-ok ütemezése (' + INITIAL_SPLATS.length + ' db)...', 'info');

            // Splat-ok generálása
            INITIAL_SPLATS.forEach(function(splatConfig, index) {
                setTimeout(function() {
                    try {
                        var splatTime = Date.now() - fluidInitStartTime;
                        myFluid.createSplat({
                            color: splatConfig.color,
                            x: splatConfig.x,
                            y: splatConfig.y,
                            dx: splatConfig.dx,
                            dy: splatConfig.dy,
                            radius: splatConfig.radius
                        });

                        log('Splat #' + (index + 1) + ' létrehozva (' + splatTime + 'ms, szín: RGB(' +
                            Math.round(splatConfig.color.r) + ',' +
                            Math.round(splatConfig.color.g) + ',' +
                            Math.round(splatConfig.color.b) + '))', 'success');
                    } catch (error) {
                        log('HIBA splat #' + (index + 1) + ' létrehozáskor: ' + error.message, 'error');
                        console.error('❌ Splat error:', error);
                    }
                }, splatConfig.delay);
            });

            log('Összes splat ütemezve - animáció indítva!', 'success');
        }, CONFIG.timing.splatCreationDelay);
    }, CONFIG.timing.scriptLoadDelay);

    // ============================================
    // RESIZE HANDLER
    // ============================================

    window.addEventListener('resize', function() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    log('Resize handler hozzáadva');
})();
