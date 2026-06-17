import {Canvas, Circle, FabricImage, FabricText as Text, Group, Line, Pattern, Rect, util} from 'fabric';


export default function roundedSizeVisualizer(config) {
    return {
        ...config,
        canvas: null,
        canvasWrapper: null,
        canvasSize: null,
        resizeObserver: null,
        observer: null,
        animation: null,
        // Cached, loaded once so we can animate them instead of reloading.
        productImage: null,
        coinImage: null,
        hatchPattern: null,
        imagesReady: false,
        // Currently displayed (animated) pixel diameters.
        displayProductDiameter: 0,
        displayCoinDiameter: 0,
        // Canvas objects split into a static grid layer and an animated object layer.
        gridLayer: [],
        objectLayer: [],

        init() {
            this.canvasWrapper = this.$refs.canvasWrapper;
            this.canvasSize = this.size;

            this.canvas = new Canvas(this.$refs.canvas, {
                width: this.canvasSize,
                height: this.canvasSize,
                backgroundColor: this.backgroundColor,
                selection: false,
                renderOnAddRemove: false, // we batch and call requestRenderAll() ourselves
            });

            // `showStaticObject` is driven by a data attribute that Livewire morphs
            // in place, so the persistent component can react to the toggle.
            this.showStaticObject = this.$el.dataset.showStatic === '1';

            // The slider feeds the entangled `state`; animate to each new value.
            this.$watch('state', () => this.animateToState(this.state));

            // The coin toggle updates data-show-static; redraw when it flips.
            this.observer = new MutationObserver(() => {
                const show = this.$el.dataset.showStatic === '1';
                if (show !== this.showStaticObject) {
                    this.showStaticObject = show;
                    this.refreshObjects();
                }
            });
            this.observer.observe(this.$el, {attributes: true, attributeFilter: ['data-show-static']});

            this.resizeObserver = new ResizeObserver(() => this.handleResize());
            this.resizeObserver.observe(this.canvasWrapper);
            // The `resize-size-visualizer` / `dispose-size-visualizer` window events are
            // wired in the Blade view via x-on:*.window so Alpine removes them on teardown
            // (a raw addEventListener here would retain the component and leak on SPA nav).

            // Load the images once, then paint the initial scene (no animation).
            this.loadImages().then(() => {
                const m = this.metrics(this.state);
                this.displayProductDiameter = m.productDiameter;
                this.displayCoinDiameter = m.coinDiameter;
                this.snap(this.state);
            });
        },

        destroy() {
            this.animation?.abort();
            this.observer?.disconnect();
            this.resizeObserver?.disconnect();
            this.canvas?.dispose();
        },

        async loadImages() {
            try {
                this.productImage = await FabricImage.fromURL(this.dynamicObjectImage);
            } catch (e) {
                this.productImage = null;
            }
            try {
                this.coinImage = await FabricImage.fromURL(this.staticObjectImage);
            } catch (e) {
                this.coinImage = null;
            }
            this.hatchPattern = this.buildHatchPattern();
            this.imagesReady = true;
        },

        // Pixel geometry for a given measurement value.
        // `state` arrives from Livewire as a string, so coerce it before any math.
        metrics(state) {
            const value = Number(state) || 0;
            const gridAmount = Math.ceil(value) + 1;
            const available = this.size - 2 * this.padding;
            const gridSize = available / gridAmount; // pixels per inch
            return {
                gridAmount,
                gridSize,
                productDiameter: gridSize * value,
                coinDiameter: gridSize * this.staticObjectSize,
            };
        },

        handleResize() {
            const wrapperWidth = this.canvasWrapper.offsetWidth;
            const scaleFactor = wrapperWidth / this.canvasSize;
            this.canvas.setDimensions({width: wrapperWidth, height: wrapperWidth});
            this.canvas.setZoom(scaleFactor);
            this.canvas.requestRenderAll();
        },

        // Snap the grid to the target state, then tween only the object layer to it.
        animateToState(state) {
            if (!this.imagesReady) {
                return; // initial paint happens once images resolve
            }

            const target = this.metrics(state);
            const fromProduct = this.displayProductDiameter;
            const fromCoin = this.displayCoinDiameter;

            this.drawGrid(target, state); // grid is static for the whole animation
            this.refreshObjects();        // redraw objects (now on top of the new grid)

            this.animation?.abort();
            this.animation = util.animate({
                startValue: 0,
                endValue: 1,
                duration: 450,
                easing: util.ease.easeOutCubic,
                onChange: (t) => {
                    this.displayProductDiameter = fromProduct + (target.productDiameter - fromProduct) * t;
                    this.displayCoinDiameter = fromCoin + (target.coinDiameter - fromCoin) * t;
                    this.refreshObjects();
                },
                onComplete: () => {
                    this.displayProductDiameter = target.productDiameter;
                    this.displayCoinDiameter = target.coinDiameter;
                    this.refreshObjects();
                },
            });
        },

        // Initial paint / hard redraw: grid snapped to `state` + objects at current size.
        snap(state) {
            this.drawGrid(this.metrics(state), state);
            this.refreshObjects();
        },

        // Rebuild ONLY the object layer (grid untouched) — runs each animation frame.
        refreshObjects() {
            this.clearLayer(this.objectLayer);
            const d = this.displayProductDiameter;
            this.addToLayer(this.objectLayer, this.makePatternSquare(d));
            this.addToLayer(this.objectLayer, this.makeDashedCircle(d));
            this.addToLayer(this.objectLayer, this.makeProduct(d));
            if (this.showStaticObject) {
                this.addToLayer(this.objectLayer, this.makeCoin(this.displayCoinDiameter));
            }
            this.canvas.requestRenderAll();
        },

        clearLayer(layer) {
            if (layer.length) {
                this.canvas.remove(...layer);
                layer.length = 0;
            }
        },

        addToLayer(layer, obj) {
            if (!obj) return;
            this.canvas.add(obj);
            layer.push(obj);
        },

        // Rebuild the grid layer (lines, border, numbers, size text). Snapped, not animated.
        drawGrid({gridAmount, gridSize}, state) {
            this.clearLayer(this.gridLayer);
            const p = this.padding;
            const bottom = this.canvasSize - p;

            for (let i = 0; i <= gridAmount * 2; i++) {
                const offset = (i * gridSize) / 2;
                const stroke = i % 2 === 0 ? this.gridLineColor : this.halfGridLineColor;
                const dash = i % 2 === 0 ? [] : [5, 5];
                this.addToLayer(this.gridLayer, new Line([p + offset, p, p + offset, bottom], {stroke, strokeDashArray: dash, selectable: false}));
                this.addToLayer(this.gridLayer, new Line([p, p + offset, this.canvasSize - p, p + offset], {stroke, strokeDashArray: dash, selectable: false}));
            }

            this.addToLayer(this.gridLayer, new Rect({
                left: p, top: p, originX: 'left', originY: 'top',
                width: this.size - 2 * p, height: this.size - 2 * p,
                stroke: '#999', strokeWidth: 5, fill: 'transparent', selectable: false,
            }));

            for (let i = 0; i <= gridAmount; i++) {
                const x = p + i * gridSize;
                const y = bottom - i * gridSize;
                if (i === 0) {
                    this.addToLayer(this.gridLayer, this.label('0', p - 10, bottom + 15));
                } else {
                    this.addToLayer(this.gridLayer, this.label(`${i}`, p - 10, y));     // left axis
                    this.addToLayer(this.gridLayer, this.label(`${i}`, x, bottom + 20)); // bottom axis
                }
            }

            this.addToLayer(this.gridLayer, new Text(`${state} ${this.sizeText}`, {
                left: this.canvasSize / 2, top: 40 + this.padding,
                originX: 'center', originY: 'center',
                fontSize: 24, fill: '#000', fontFamily: this.fontFamily, selectable: false,
            }));
        },

        label(text, left, top) {
            return new Text(text, {
                left, top, originX: 'center', originY: 'center',
                fontSize: 16, fill: '#000', fontFamily: this.fontFamily, selectable: false,
            });
        },

        buildHatchPattern() {
            const c = document.createElement('canvas');
            c.width = 10;
            c.height = 10;
            const ctx = c.getContext('2d');
            ctx.strokeStyle = this.patternGridColor;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(0, 10);
            ctx.lineTo(10, 0);
            ctx.stroke();
            return new Pattern({source: c, repeat: 'repeat'});
        },

        // The hatched square with the product circle cut out, anchored bottom-left.
        makePatternSquare(d) {
            if (d <= 0) return null;
            const p = this.padding;
            const bottom = this.canvasSize - p;
            const rect = new Rect({
                left: p, top: bottom, originX: 'left', originY: 'bottom',
                width: d, height: d, fill: this.hatchPattern, selectable: false,
            });
            const mask = new Circle({
                radius: d / 2, left: p + d / 2, top: bottom - d / 2,
                originX: 'center', originY: 'center', fill: 'white',
                globalCompositeOperation: 'destination-out', selectable: false,
            });
            return new Group([rect, mask], {selectable: false});
        },

        makeDashedCircle(d) {
            if (d <= 0) return null;
            return new Circle({
                radius: d / 2, left: this.padding, top: this.canvasSize - this.padding,
                originX: 'left', originY: 'bottom',
                stroke: this.patternGridColor, fill: 'transparent',
                strokeWidth: 2, strokeDashArray: [5, 5], selectable: false,
            });
        },

        makeProduct(d) {
            const img = this.productImage;
            if (!img || d <= 0) return null;
            // contain-fit: scale by the larger dimension so any aspect ratio stays within the d×d box
            const scale = d / Math.max(img.width, img.height);
            img.set({
                originX: 'left', originY: 'bottom',
                left: this.padding, top: this.canvasSize - this.padding,
                scaleX: scale, scaleY: scale, selectable: false,
                shadow: {color: 'rgba(0, 0, 0, 0.25)', blur: 15, offsetX: 15, offsetY: 15},
            });
            return img;
        },

        makeCoin(d) {
            const img = this.coinImage;
            if (!img || d <= 0) return null;
            const scale = d / Math.max(img.width, img.height);
            img.set({
                originX: 'left', originY: 'bottom',
                left: this.padding + 4, top: this.canvasSize - this.padding,
                scaleX: scale, scaleY: scale, selectable: false,
                shadow: {color: 'rgba(0, 0, 0, 0.5)', blur: 10, offsetX: 5, offsetY: 5},
            });
            return img;
        },
    };
}
