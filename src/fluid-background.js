// src/fluid-background.js - p5.js drakerie.js pontos átírása vanilla JS-be
(function() {
    'use strict';

    class FluidBackground {
        constructor(options = {}) {
            // Initialize Perlin noise permutation table FIRST
            this.p = new Array(512);
            const permutation = [151,160,137,91,90,15,131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,190,6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,88,237,149,56,87,174,20,125,136,171,168,68,175,74,165,71,134,139,48,27,166,77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,102,143,54,65,25,63,161,1,216,80,73,209,76,132,187,208,89,18,169,200,196,135,130,116,188,159,86,164,100,109,198,173,186,3,64,52,217,226,250,124,123,5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,223,183,170,213,119,248,152,2,44,154,163,70,221,153,101,155,167,43,172,9,129,22,39,253,19,98,108,110,79,113,224,232,178,185,112,104,218,246,97,228,251,34,242,193,238,210,144,12,191,179,162,241,81,51,145,235,249,14,239,107,49,192,214,31,181,199,106,157,184,84,204,176,115,121,50,45,127,4,150,254,138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180];
            for (let i = 0; i < 256; i++) {
                this.p[256 + i] = this.p[i] = permutation[i];
            }

            this.options = {
                containerId: options.containerId || 'fluid-background',
                width: options.width || window.innerWidth,
                height: options.height || window.innerHeight
            };

            this.canvas = null;
            this.ctx = null;
            this.cells = [];
            this.glowPositions = [];
            this.breatheOffset = 0;
            this.animationId = null;
            this.mouseX = 0;
            this.mouseY = 0;

            this.init();
        }

        init() {
            // Container létrehozása vagy megkeresése
            let container = document.getElementById(this.options.containerId);
            if (!container) {
                container = document.createElement('div');
                container.id = this.options.containerId;
                document.body.insertBefore(container, document.body.firstChild);
            }

            // Stílusok beállítása
            this.setupStyles(container);

            // Canvas létrehozása
            this.setupCanvas(container);

            // Sejtek inicializálása (p5.js setup() függvény)
            this.setup();

            // Event listenerek
            this.setupEventListeners();

            // Animáció indítása (p5.js draw() függvény)
            this.animate();
        }

        setupStyles(container) {
            const styles = `
                #${this.options.containerId} {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: -1;
                    overflow: hidden;
                    pointer-events: none;
                }

                #${this.options.containerId} canvas {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                }
            `;

            if (!document.getElementById('fluid-bg-styles')) {
                const styleSheet = document.createElement('style');
                styleSheet.id = 'fluid-bg-styles';
                styleSheet.textContent = styles;
                document.head.appendChild(styleSheet);
            }
        }

        setupCanvas(container) {
            this.canvas = document.createElement('canvas');
            this.ctx = this.canvas.getContext('2d');
            container.appendChild(this.canvas);
            this.resizeCanvas();
        }

        resizeCanvas() {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        }

        // p5.js setup() függvény pontos másolata
        setup() {
            // Create organic cell-like structures mimicking the fluid art
            for (let i = 0; i < 120; i++) {
                this.cells.push({
                    x: Math.random() * this.canvas.width,
                    y: Math.random() * this.canvas.height,
                    size: Math.random() * 160 + 20, // random(20, 180)
                    hue: Math.random() * 100 + 180, // random(180, 280) - Blues to purples
                    sat: Math.random() * 50 + 40, // random(40, 90)
                    bright: Math.random() * 30 + 60, // random(60, 90)
                    alpha: Math.random() * 50 + 30, // random(30, 80)
                    offsetX: Math.random() * 60 - 30, // random(-30, 30)
                    offsetY: Math.random() * 60 - 30
                });
            }

            // Add warm accent cells like in the original
            for (let i = 0; i < 40; i++) {
                this.cells.push({
                    x: Math.random() * (this.canvas.width * 0.4) + this.canvas.width * 0.3,
                    y: Math.random() * (this.canvas.height * 0.4) + this.canvas.height * 0.4,
                    size: Math.random() * 85 + 15, // random(15, 100)
                    hue: Math.random() * 40 + 20, // random(20, 60) - Oranges to yellows
                    sat: Math.random() * 25 + 70, // random(70, 95)
                    bright: Math.random() * 15 + 80, // random(80, 95)
                    alpha: Math.random() * 35 + 50, // random(50, 85)
                    offsetX: Math.random() * 40 - 20,
                    offsetY: Math.random() * 40 - 20
                });
            }

            // Add some pink/magenta accents
            for (let i = 0; i < 25; i++) {
                this.cells.push({
                    x: Math.random() * (this.canvas.width * 0.6) + this.canvas.width * 0.2,
                    y: Math.random() * (this.canvas.height * 0.6) + this.canvas.height * 0.3,
                    size: Math.random() * 50 + 10, // random(10, 60)
                    hue: Math.random() * 40 + 300, // random(300, 340)
                    sat: Math.random() * 25 + 60, // random(60, 85)
                    bright: Math.random() * 20 + 70, // random(70, 90)
                    alpha: Math.random() * 35 + 40, // random(40, 75)
                    offsetX: Math.random() * 30 - 15,
                    offsetY: Math.random() * 30 - 15
                });
            }
        }

        setupEventListeners() {
            // Resize handler
            window.addEventListener('resize', () => {
                this.resizeCanvas();
            });

            // Mouse move handler
            document.addEventListener('mousemove', (e) => {
                this.mouseX = e.clientX;
                this.mouseY = e.clientY;
                this.mouseMoved();
            });
        }

        // p5.js draw() függvény pontos másolata
        animate() {
            // background(220, 15, 85); // Soft gray-blue background
            this.ctx.fillStyle = this.hslToRgb(220, 15, 85);
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

            this.breatheOffset += 0.02;

            // Draw cellular structure with organic blending
            for (let cell of this.cells) {
                const distToMouse = Math.sqrt(
                    Math.pow(this.mouseX - (cell.x + cell.offsetX), 2) +
                    Math.pow(this.mouseY - (cell.y + cell.offsetY), 2)
                );

                // map(constrain(distToMouse, 0, 150), 0, 150, 1.5, 1.0)
                const hoverEffect = this.map(this.constrain(distToMouse, 0, 150), 0, 150, 1.5, 1.0);
                // map(constrain(distToMouse, 0, 100), 0, 100, 25, 0)
                const glowIntensity = this.map(this.constrain(distToMouse, 0, 100), 0, 100, 25, 0);

                // Breathing effect
                const breathe = Math.sin(this.breatheOffset + cell.x * 0.01 + cell.y * 0.01) * 0.1 + 1;

                // Main cell body
                const alpha = (cell.alpha / 100) * breathe * hoverEffect;
                this.ctx.fillStyle = this.hslaToRgba(cell.hue, cell.sat, cell.bright * breathe * hoverEffect, alpha);

                // Create organic, irregular shapes instead of perfect circles
                const points = 8;
                const angleStep = (Math.PI * 2) / points;

                this.ctx.beginPath();
                for (let i = 0; i < points; i++) {
                    const angle = angleStep * i;
                    const noiseValue = this.noise(
                        cell.x * 0.01 + Math.cos(angle),
                        cell.y * 0.01 + Math.sin(angle),
                        this.breatheOffset * 0.005
                    );
                    const radius = cell.size * (0.7 + 0.3 * noiseValue);
                    const x = cell.x + cell.offsetX + Math.cos(angle) * radius * hoverEffect;
                    const y = cell.y + cell.offsetY + Math.sin(angle) * radius * hoverEffect;

                    if (i === 0) {
                        this.ctx.moveTo(x, y);
                    } else {
                        this.ctx.lineTo(x, y);
                    }
                }
                this.ctx.closePath();
                this.ctx.fill();

                // Add subtle glow on hover
                if (glowIntensity > 0) {
                    const glowAlpha = glowIntensity / 100;
                    this.ctx.fillStyle = this.hslaToRgba(
                        cell.hue,
                        cell.sat * 0.6,
                        Math.min(100, cell.bright * 1.3),
                        glowAlpha
                    );
                    const glowSize = cell.size * hoverEffect * 1.4;
                    this.ctx.beginPath();
                    this.ctx.arc(cell.x + cell.offsetX, cell.y + cell.offsetY, glowSize, 0, Math.PI * 2);
                    this.ctx.fill();
                }
            }

            // Add some connecting membrane-like structures
            this.ctx.strokeStyle = this.hslaToRgba(200, 20, 90, 0.15);
            this.ctx.lineWidth = 1;
            for (let i = 0; i < this.cells.length - 1; i += 3) {
                const cell1 = this.cells[i];
                const cell2 = this.cells[i + 1];
                const distance = Math.sqrt(
                    Math.pow(cell1.x - cell2.x, 2) +
                    Math.pow(cell1.y - cell2.y, 2)
                );

                if (distance < 120) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(cell1.x + cell1.offsetX, cell1.y + cell1.offsetY);
                    this.ctx.lineTo(cell2.x + cell2.offsetX, cell2.y + cell2.offsetY);
                    this.ctx.stroke();
                }
            }

            this.animationId = requestAnimationFrame(() => this.animate());
        }

        // p5.js mouseMoved() függvény
        mouseMoved() {
            // Create gentle ripple effect
            this.glowPositions.push({
                x: this.mouseX,
                y: this.mouseY,
                life: 20,
                maxLife: 20
            });

            // Limit array size
            if (this.glowPositions.length > 5) {
                this.glowPositions.shift();
            }
        }

        // Utility functions - p5.js funkcionalitás
        constrain(value, min, max) {
            return Math.max(min, Math.min(max, value));
        }

        map(value, start1, stop1, start2, stop2) {
            return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
        }

        // Perlin noise approximation
        noise(x, y, z = 0) {
            const X = Math.floor(x) & 255;
            const Y = Math.floor(y) & 255;
            const Z = Math.floor(z) & 255;

            x -= Math.floor(x);
            y -= Math.floor(y);
            z -= Math.floor(z);

            const u = this.fade(x);
            const v = this.fade(y);
            const w = this.fade(z);

            const A = this.p[X] + Y;
            const AA = this.p[A] + Z;
            const AB = this.p[A + 1] + Z;
            const B = this.p[X + 1] + Y;
            const BA = this.p[B] + Z;
            const BB = this.p[B + 1] + Z;

            return this.lerp(
                this.lerp(
                    this.lerp(this.grad(this.p[AA], x, y, z), this.grad(this.p[BA], x - 1, y, z), u),
                    this.lerp(this.grad(this.p[AB], x, y - 1, z), this.grad(this.p[BB], x - 1, y - 1, z), u),
                    v
                ),
                this.lerp(
                    this.lerp(this.grad(this.p[AA + 1], x, y, z - 1), this.grad(this.p[BA + 1], x - 1, y, z - 1), u),
                    this.lerp(this.grad(this.p[AB + 1], x, y - 1, z - 1), this.grad(this.p[BB + 1], x - 1, y - 1, z - 1), u),
                    v
                ),
                w
            );
        }

        fade(t) {
            return t * t * t * (t * (t * 6 - 15) + 10);
        }

        lerp(a, b, t) {
            return a + t * (b - a);
        }

        grad(hash, x, y, z) {
            const h = hash & 15;
            const u = h < 8 ? x : y;
            const v = h < 4 ? y : h === 12 || h === 14 ? x : z;
            return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
        }


        // HSL to RGB conversion (p5.js colorMode(HSB) compatibility)
        hslToRgb(h, s, l) {
            h = h / 360;
            s = s / 100;
            l = l / 100;

            let r, g, b;

            if (s === 0) {
                r = g = b = l;
            } else {
                const hue2rgb = (p, q, t) => {
                    if (t < 0) t += 1;
                    if (t > 1) t -= 1;
                    if (t < 1/6) return p + (q - p) * 6 * t;
                    if (t < 1/2) return q;
                    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                    return p;
                };

                const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                const p = 2 * l - q;
                r = hue2rgb(p, q, h + 1/3);
                g = hue2rgb(p, q, h);
                b = hue2rgb(p, q, h - 1/3);
            }

            return `rgb(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)})`;
        }

        hslaToRgba(h, s, l, a) {
            h = h / 360;
            s = s / 100;
            l = l / 100;

            let r, g, b;

            if (s === 0) {
                r = g = b = l;
            } else {
                const hue2rgb = (p, q, t) => {
                    if (t < 0) t += 1;
                    if (t > 1) t -= 1;
                    if (t < 1/6) return p + (q - p) * 6 * t;
                    if (t < 1/2) return q;
                    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                    return p;
                };

                const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                const p = 2 * l - q;
                r = hue2rgb(p, q, h + 1/3);
                g = hue2rgb(p, q, h);
                b = hue2rgb(p, q, h - 1/3);
            }

            return `rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}, ${a})`;
        }

        destroy() {
            if (this.animationId) {
                cancelAnimationFrame(this.animationId);
            }
            if (this.canvas && this.canvas.parentNode) {
                this.canvas.parentNode.removeChild(this.canvas);
            }
        }
    }

    // Globális elérhetőség biztosítása
    window.FluidBackground = FluidBackground;

    // Automatikus inicializálás
    document.addEventListener('DOMContentLoaded', () => {
        const autoInit = document.querySelector('[data-fluid-background]');
        if (autoInit) {
            const options = autoInit.dataset.fluidBackground ?
                JSON.parse(autoInit.dataset.fluidBackground) : {};
            new FluidBackground(options);
        }
    });
})();
