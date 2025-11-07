// ============================================
// FLUID ART HÁTTÉR - UNAS INJEKTÁLHATÓ KÓD
// Custom Fluid-JS Build (fehér folt fix)
// ============================================

(function() {
    'use strict';

    // ============================================
    // PARAMÉTEREK - Itt állíthatók be a fizikai tulajdonságok
    // ============================================

    const PHYSICS_CONFIG = {
        // Szimuláció felbontása (alacsonyabb = gyorsabb, 32-512)
        sim_resolution: 512,

        // Színek felbontása (magasabb = élesebb, 128-2048)
        dye_resolution: 512,

        // Színvesztés mértéke (0.9-1.0, magasabb = lassabb halványodás)
        dissipation: 1,

        // Sebesség lassulás mértéke (0.9-1.0, magasabb = lassabb lassulás)
        velocity: 0.999,

        // Nyomás (0.0-1.0)
        pressure: 0.8,

        // Nyomás iterációk száma (10-50)
        pressure_iteration: 20,

        // Örvénylés erőssége (0-50)
        curl: 10,

        // Emitter méret (0.1-3.0) - létrehozott foltok mérete
        emitter_size: 2.5,

        // Vizuális beállítások
        render_shaders: true,
        multi_color: false,
        render_bloom: false,

        // Háttérszín (fehér)
        background_color: { r: 255, g: 255, b: 255 },
        transparent: false
    };

    // Fluid art színpaletta (türkiz, lila, kék)
    const FLUID_COLORS = [
        { r: 0, g: 255, b: 255 },    // Türkiz
        { r: 204, g: 51, b: 255 },   // Lila
        { r: 0, g: 128, b: 255 }     // Királykék
    ];

    // Egér interakció paraméterek
    const MOUSE_CONFIG = {
        speed_threshold: 30,    // Minimális sebesség küszöb (px/frame)
        throttle_rate: 3         // Throttle: hány mozdulatonként reagáljon
    };

    // Kezdeti splat-ok paraméterei
    const INITIAL_SPLATS = {
        count: 5,                    // Hány kezdeti folt
        delay_between: 300,          // Késleltetés splat-ok között (ms)
        move_distance: 200,          // Húzás távolság (px) - NAGYOBB!
        move_steps: 8,               // Húzás lépések száma - TÖBB LÉPÉS!
        drag_duration: 120           // Drag teljes időtartama (ms)
    };

    // ============================================
    // CANVAS LÉTREHOZÁSA
    // ============================================

    window.canvas = document.createElement('canvas');
    window.canvas.id = 'fluidArtCanvas';
    window.canvas.width = window.innerWidth;
    window.canvas.height = window.innerHeight;
    window.canvas.style.cssText = 'display:block;width:100vw;height:100vh;position:fixed;top:0;left:0;z-index:-1;pointer-events:none';
    document.body.insertBefore(window.canvas, document.body.firstChild);

    console.log('🎨 Fluid Art Canvas létrehozva');

    // ============================================
    // CUSTOM FLUID-JS BETÖLTÉSE
    // ============================================

    var script = document.createElement('script');

    // FONTOS: Cseréld le ezt az URL-t a saját GitHub/CDN URL-edre!
    // Példa: 'https://cdn.jsdelivr.net/gh/USERNAME/REPO@main/dist/fluid-js-custom.min.js'
    script.src = 'dist/fluid-js-custom.min.js';  // ⚠️ CSERÉLD LE ÉLES URL-RE!

    script.onerror = function() {
        console.error('❌ Fluid-JS custom build betöltése sikertelen!');
    };

    script.onload = function() {
        console.log('✅ Custom Fluid-JS library betöltve');

        setTimeout(function() {
            if (typeof Fluid === 'undefined') {
                console.error('❌ Fluid library nem elérhető');
                return;
            }

            var canvasElement = document.getElementById('fluidArtCanvas');

            try {
                var myFluid = new Fluid(canvasElement);
                console.log('✅ Fluid példány létrehozva');

                // Paraméterek alkalmazása - EXPLICIT multi_color: false!
                myFluid.mapBehaviors({
                    sim_resolution: PHYSICS_CONFIG.sim_resolution,
                    dye_resolution: PHYSICS_CONFIG.dye_resolution,
                    dissipation: PHYSICS_CONFIG.dissipation,
                    velocity: PHYSICS_CONFIG.velocity,
                    pressure: PHYSICS_CONFIG.pressure,
                    pressure_iteration: PHYSICS_CONFIG.pressure_iteration,
                    curl: PHYSICS_CONFIG.curl,
                    emitter_size: PHYSICS_CONFIG.emitter_size,
                    render_shaders: PHYSICS_CONFIG.render_shaders,
                    multi_color: false,  // ← EXPLICIT FALSE (override default true)
                    render_bloom: PHYSICS_CONFIG.render_bloom,
                    background_color: PHYSICS_CONFIG.background_color,
                    transparent: PHYSICS_CONFIG.transparent
                });

                console.log('✅ Fizikai paraméterek beállítva:');
                console.log('  - dissipation:', PHYSICS_CONFIG.dissipation);
                console.log('  - velocity:', PHYSICS_CONFIG.velocity);
                console.log('  - emitter_size:', PHYSICS_CONFIG.emitter_size);
                console.log('  - curl:', PHYSICS_CONFIG.curl);
                console.log('  - multi_color: false (EXPLICIT!)');
                console.log('  - background_color:', PHYSICS_CONFIG.background_color);

                setTimeout(function() {
                    myFluid.activate();
                    console.log('✅ Fluid aktiválva (fehér folt inicializálva)');

                    // HÁTTÉRSZÍN ÖBLÍTÉSE - 100ms várakozás után
                    setTimeout(function() {
                        console.log('🧹 Kezdeti folt öblítése háttérszínnel...');

                        // Háttérszín splat ugyanazon (500, 500) pozíción
                        var bgColor = PHYSICS_CONFIG.background_color;
                        myFluid.color = bgColor;

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

                            console.log('✅ Kezdeti folt öblítve (háttérszín: r=' + bgColor.r + ', g=' + bgColor.g + ', b=' + bgColor.b + ')');

                            // Kezdeti splat-ok létrehozása 200ms UTÁN
                            setTimeout(function() {
                                createInitialSplats(myFluid, canvasElement);

                                // Egér interakció bekapcsolása
                                setupMouseInteraction(myFluid, canvasElement);

                                console.log('✅ Fluid Art háttér inicializálva!');
                            }, 200);
                        }, 30);
                    }, 100);
                }, 300);

            } catch (error) {
                console.error('❌ Hiba:', error.message);
            }
        }, 500);
    };

    document.head.appendChild(script);

    // ============================================
    // SEGÉDFÜGGVÉNYEK
    // ============================================

    function createInitialSplats(fluidInstance, canvas) {
        for (var i = 0; i < INITIAL_SPLATS.count; i++) {
            (function(index) {
                setTimeout(function() {
                    var x = (0.2 + Math.random() * 0.6) * canvas.width;
                    var y = (0.2 + Math.random() * 0.6) * canvas.height;

                    // Random irány a mozgáshoz
                    var angle = Math.random() * Math.PI * 2;

                    // Színbeállítás - FIX SZÍNEK!
                    var colorIndex = index % FLUID_COLORS.length;
                    var selectedColor = FLUID_COLORS[colorIndex];
                    var colorNames = ['türkiz', 'lila', 'királykék'];

                    // FONTOS: Erősen beállítjuk a színt
                    fluidInstance.color = {
                        r: selectedColor.r,
                        g: selectedColor.g,
                        b: selectedColor.b
                    };

                    console.log('🎨 Splat ' + (index + 1) + ' kezdés - szín: ' + colorNames[colorIndex] +
                        ' (r=' + selectedColor.r + ', g=' + selectedColor.g + ', b=' + selectedColor.b + ')');

                    // Kattintás szimuláció
                    canvas.dispatchEvent(new MouseEvent('mousedown', {
                        clientX: x,
                        clientY: y,
                        bubbles: true,
                        cancelable: true
                    }));

                    // Több intermediate mozgás - SIMA ÁRAMLÁS
                    var stepDelay = INITIAL_SPLATS.drag_duration / INITIAL_SPLATS.move_steps;

                    for (var step = 1; step <= INITIAL_SPLATS.move_steps; step++) {
                        (function(s) {
                            setTimeout(function() {
                                // Színt minden lépésnél újra beállítjuk (biztos ami biztos!)
                                fluidInstance.color = {
                                    r: selectedColor.r,
                                    g: selectedColor.g,
                                    b: selectedColor.b
                                };

                                var progress = s / INITIAL_SPLATS.move_steps;
                                var dist = INITIAL_SPLATS.move_distance * progress;

                                canvas.dispatchEvent(new MouseEvent('mousemove', {
                                    clientX: x + Math.cos(angle) * dist,
                                    clientY: y + Math.sin(angle) * dist,
                                    bubbles: true,
                                    cancelable: true
                                }));
                            }, s * stepDelay);
                        })(step);
                    }

                    // Mouse up - a drag végén
                    setTimeout(function() {
                        canvas.dispatchEvent(new MouseEvent('mouseup', {
                            clientX: x + Math.cos(angle) * INITIAL_SPLATS.move_distance,
                            clientY: y + Math.sin(angle) * INITIAL_SPLATS.move_distance,
                            bubbles: true,
                            cancelable: true
                        }));

                        console.log('✅ Splat ' + (index + 1) + '/' + INITIAL_SPLATS.count + ' kész');
                    }, INITIAL_SPLATS.drag_duration + 20);
                }, index * INITIAL_SPLATS.delay_between);
            })(i);
        }
    }

    function setupMouseInteraction(fluidInstance, canvas) {
        var lastX = -1;
        var lastY = -1;
        var moveCounter = 0;
        var isSimulating = false;

        canvas.addEventListener('mousemove', function(e) {
            if (isSimulating || !e.isTrusted) return;

            var x = e.clientX;
            var y = e.clientY;

            if (lastX !== -1 && lastY !== -1) {
                var dx = x - lastX;
                var dy = y - lastY;
                var speed = Math.sqrt(dx * dx + dy * dy);

                moveCounter++;
                if (speed > MOUSE_CONFIG.speed_threshold &&
                    moveCounter % MOUSE_CONFIG.throttle_rate === 0) {
                    isSimulating = true;

                    // Random szín
                    var colorIndex = Math.floor(Math.random() * FLUID_COLORS.length);
                    fluidInstance.color = FLUID_COLORS[colorIndex];

                    // Szimulált kattintás
                    canvas.dispatchEvent(new MouseEvent('mousedown', {
                        clientX: x,
                        clientY: y,
                        bubbles: true
                    }));

                    setTimeout(function() {
                        canvas.dispatchEvent(new MouseEvent('mouseup', {
                            clientX: x + dx,
                            clientY: y + dy,
                            bubbles: true
                        }));
                        isSimulating = false;
                    }, 20);
                }
            }

            lastX = x;
            lastY = y;
        }, { passive: true });
    }

    // ============================================
    // RESIZE HANDLER
    // ============================================

    window.addEventListener('resize', function() {
        if (window.canvas) {
            window.canvas.width = window.innerWidth;
            window.canvas.height = window.innerHeight;
        }
    });

    console.log('✅ Fluid Art script betöltve - várakozás a library-re...');
})();
