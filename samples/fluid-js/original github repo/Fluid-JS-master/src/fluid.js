/* Refs
https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Constants
http://www.cse.chalmers.se/edu/year/2015/course/TDA361/Advanced%20Computer%20Graphics/GpuGems-FluidDynamics.pdf
 */
'use strict';
import { behavior, setBehaviors } from "./defaults";
import { initWebGL, activator, setDitherURL } from './initializer';

module.exports = class Fluid {
    constructor(canvas){
        this.PARAMS = behavior;

        /* Set canvas to desired width and height
           TODO: Change to dynamic sizing  */
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

    /**
     * Activate Fluid Canvas
     *  Initiates WebGL fluid loop.
     *
     *  TODO: Finish commenting
     *
     */
    activate() {
        // CUSTOM: Store the returned API from activator (contains splat() function)
        this._splatAPI = activator(this.canvas, this.webGL, this.colorFormats, this.programs, this.pointers);
    }

    /**
     * Deactivate Fluid Canvas
     *  Notifies active fluid canvas to clear buffers and erase fluid from call stack.
     *
     *  TODO: Implement
     */
    deactivate(){

    }

    /**
     * Reset Fluid Simulation
     *  Re-initializes WebGL context and activates simulation based on new context.
     *
     */
    reset() {
        initWebGL();
        this.activate();
    }

    /**
     * Map Fluid Behaviors
     *  Uses spread operators to add parameter values only in the places specified.
     *
     * @param params: specific parameter value.
     *
     */
    mapBehaviors(params) {
        this.PARAMS = {...this.PARAMS, ...params};
        setBehaviors(this.PARAMS);
    }

    /**
     * Set Fluid as Background
     *  Pushes canvas back in z space and absolutely positions it.
     *
     * @param shouldSet: true sets it, false un-sets it. Defaults to true.
     *
     */
    setAsBackground(shouldSet = true) {
        /* Pushes back in Z Index */
        canvas.style.zIndex = shouldSet ? '-99' : '0';

        /* Position Absolutely */
        canvas.style.position = shouldSet ? 'absolute' : 'relative';
    }

    /**
     * Apply Background
     *  Sets fluid canvas's background and resets view.
     *
     * @param type: Image, Gradient, or Solid. The type of background to be applied.
     * @param value: The value to apply to the image type.
     * @param options: Additional options to configure background (optional)
     *
     * @param canvas
     */
    applyBackground(type, value, options = null, canvas = this.canvas) {
        type = type.toLowerCase();

        /* Make transparent */
        this.PARAMS.transparent = true;

        /* Check for Background Type */
        switch (type) {
            case 'gradient': gradient();
                break;
            case 'image': image();
                break;
            case 'solid':
            /* Make Opaque Background and Set Color
            *  value must be in { r: red, b: blue, g: green } format
            *
            *  Best way to change background color:
            *
            *  yourFluid.PARAM.BACK_COLOR.R = red;
            *  yourFluid.PARAM.BACK_COLOR.G = blue;
            *  yourFluid.PARAM.BACK_COLOR.B = green;
            *
            *  or
            *
            *  let color = {
            *       r: red,
            *       b: blue,
            *       g: green
            *   };
            *
            *   yourFluid.PARAM.BACK_COLOR = color;
            * */
            default:
                this.PARAMS.transparent = false;
                this.PARAMS.background_color = value;
        }

        /* Reset WebGL */
        this.reset();

        /** Set to Gradient
         *  Sets canvas background value to desired gradient.
         */
        function gradient() {
            /** Gradient
             *  Holds the gradient css statement.
             *
             * @type {string}
             */
            let gradient = "";

            /* Configure Gradient to Options */
            switch (options) {
                case 'radial':
                    gradient = "radial-gradient(" + value + ")";
                    break;
                case 'conic':
                    gradient = "conic-gradient(" + value + ")";
                    break;
                case 'repeating-linear':
                    gradient = "repeating-linear-gradient(" + value + ")";
                    break;
                case 'repeating-radial':
                    gradient = "repeating-radial-gradient(" + value + ")";
                    break;
                case 'linear':
                default:
                    gradient = "linear-gradient(" + value + ")";
            }

            /* Set Gradient Dom Style */
            canvas.style.backgroundImage = gradient;
        }

        /** Set to Image
         *  Sets canvas background image value to desired image and configure styles.
         */
        function image() {
            /* Set background image to desired URL, throw error if invalid URL */
            canvas.style.backgroundImage = "url('" + value + "')";

            /* Modify CSS Properties */
            if(options){
                /* Set Repeat */
                canvas.style.backgroundRepeat   = options.repeat   ? 'repeat' : 'no-repeat';

                /* Set Position */
                canvas.style.backgroundPosition = options.position ? options.position : 'center';

                /* Set Size */
                canvas.style.backgroundSize     = options.size     ? options.size : 'contain';

                /* Set Color */
                canvas.style.backgroundColor    = options.color    ? options.color : 'none';
            }
        }
    }

    /**
     * Create Splat with Custom Parameters
     *  CUSTOM METHOD: Allows programmatic splat creation with full control over position, color, and velocity.
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
        // Pass radius directly instead of temporarily modifying PARAMS.emitter_size
        this._splatAPI.splat(posX, posY, dx, dy, normalizedColor, radius);
    }

    /**
     * Set Dither URL
     *  Sets the URL to an image to be used for dithering. This method is only responsible for calling
     *  the action in the initializer. The dither will not be applied until the next activation call.
     *
     * @param url: Path to dither in root directory.
     */
    setDitherURL(url){ setDitherURL(url); }
};
