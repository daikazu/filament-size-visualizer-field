import {Canvas, Circle, Group, Image as FabricImage, Line, Pattern, Rect, Text} from 'fabric';


export default function roundedSizeVisualizer({
                                           element,
                                           state,
                                           size,
                                           sizeText,
                                           padding,
                                           dynamicObjectImage,
                                           staticObjectSize,
                                           staticObjectImage,
                                           fontFamily,
                                           backgroundColor,
                                           gridLineColor,
                                           halfGridLineColor,
                                           patternGridColor,
                                           showStaticObject

                                       }) {
    return {
        element,
        state,
        size,
        sizeText,
        padding,
        dynamicObjectImage,
        staticObjectSize,
        staticObjectImage,
        fontFamily,
        backgroundColor,
        gridLineColor,
        halfGridLineColor,
        patternGridColor,
        showStaticObject,
        component: null,
        canvas: null,
        canvasWrapper: null,
        canvasSize: null,
        resizeObserver: null,
        init() {
            this.component = document.getElementById(this.element);
            this.canvasWrapper = this.$refs.canvasWrapper;

            // Set the initial canvas size
            this.updateCanvasSize();

            this.canvas = new Canvas(this.$refs.canvas, {
                width: this.canvasSize,
                height: this.canvasSize,
                backgroundColor: this.backgroundColor,
            });

            this.renderCanvas();

            this.resizeObserver = new ResizeObserver(() => {
                this.handleResize();
            });

            // Observe the canvasWrapper for resize changes
            this.resizeObserver.observe(this.canvasWrapper);


        },
        destroy() {
            // Stop observing the canvasWrapper when the component is destroyed
            if (this.resizeObserver) {
                this.resizeObserver.disconnect();
            }
        },
        updateCanvasSize() {
            this.canvasSize = this.size;
        },
        handleResize() {

            const wrapperWidth = this.canvasWrapper.offsetWidth; // Get the wrapper's width
            const scaleFactor = wrapperWidth / this.canvasSize; // Calculate scale factor based on wrapper width and original canvas size

            // Set new canvas dimensions
            this.canvas.setWidth(wrapperWidth);
            this.canvas.setHeight(wrapperWidth); // Maintain aspect ratio (assuming square)

            // Scale the entire canvas using setZoom() for proportional resizing
            this.canvas.setZoom(scaleFactor);

            this.canvas.renderAll(); // Redraw the canvas with updated scaling
            // console.log(canvas.width);

        },
        renderCanvas() {


            // Draw the grid
            let gridAmount = Math.ceil(this.state) + 1;
            let availableSpace = this.size - 2 * this.padding;
            let gridSize = availableSpace / gridAmount;

            const dynamicObjectDiameter = ((this.canvasSize - 2 * padding) / gridAmount) * this.state; // Size of the product in pixels (1 inch)
            const staticObjectDiameter = ((this.canvasSize - 2 * padding) / gridAmount) * this.staticObjectSize; // Size of the quarter in pixels (1 inch)


            for (let i = 0; i <= gridAmount * 2; i++) {
                let x = this.padding + (i * gridSize) / 2;
                this.canvas.add(
                    new Line([x, this.padding, x, this.canvasSize - this.padding], {
                        stroke: i % 2 === 0 ? this.gridLineColor : this.halfGridLineColor, // Solid line color for inch lines, dashed line color for half-inch lines
                        selectable: false, // Disable selection
                        strokeDashArray: i % 2 === 0 ? [] : [5, 5], // Solid for inch lines, dashed for half-inch lines
                    }),
                );
            }
            for (let i = 0; i <= gridAmount * 2; i++) {
                // Multiply by 2 for half-inch divisions
                let y = padding + (i * gridSize) / 2; // Divide by 2 for half-inch spacing
                this.canvas.add(
                    new Line([this.padding, y, this.canvasSize - this.padding, y], {
                        stroke: i % 2 === 0 ? this.gridLineColor : this.halfGridLineColor, // Solid line color for inch lines, dashed line color for half-inch lines
                        selectable: false, // Disable selection
                        strokeDashArray: i % 2 === 0 ? [] : [5, 5], // Solid for inch lines, dashed for half-inch lines
                    }),
                );
            }

            // Create a rectangle around the whole grid
            const gridRectangle = new Rect({
                left: this.padding, // Align with the left edge of the grid
                top: this.padding, // Align with the top edge of the grid
                width: this.size - 2 * this.padding, // Width to cover the grid area
                height: this.size - 2 * this.padding, // Height to cover the grid area
                stroke: '#999', // Border color of the rectangle
                strokeWidth: 5, // Border thickness
                fill: 'transparent', // Transparent fill
                selectable: false, // Disable selection
            });

            // Add the rectangle to the canvas
            this.canvas.add(gridRectangle);


            // Add numbers to the bottom left corner and the grid lines
            for (let i = 0; i <= gridAmount; i++) {
                const x = this.padding + i * gridSize;
                const y = this.canvasSize - this.padding - i * gridSize;

                // Add numbers at the bottom
                if (i === 0) {
                    const bottomLeftNumber = new Text('0', {
                        left: this.padding - 10, // Position to the left of the grid
                        top: this.canvasSize - this.padding + 15, // Position at the bottom
                        fontSize: 16,
                        fill: '#000',
                        selectable: false,
                        originX: 'center', // Center the number horizontally
                        originY: 'center', // Align the text vertically
                        fontFamily: this.fontFamily,
                    });
                    this.canvas.add(bottomLeftNumber);
                }

                // Add numbers along the left side (vertical numbering)
                if (i > 0) {
                    const sideNumber = new Text(`${i}`, {
                        left: this.padding - 10, // Position to the left of the grid
                        top: y,
                        fontSize: 16,
                        fill: '#000',
                        selectable: false,
                        originX: 'center', // Center the number horizontally
                        originY: 'center', // Center the number vertically beside the line
                        fontFamily: this.fontFamily,
                    });
                    this.canvas.add(sideNumber);
                }

                // Add numbers along the bottom side (horizontal numbering)
                if (i > 0) {
                    const bottomNumber = new Text(`${i}`, {
                        left: x,
                        top: this.canvasSize - this.padding + 20, // Position below the grid
                        fontSize: 16,
                        fill: '#000',
                        selectable: false,
                        originX: 'center', // Center the number horizontally above the line
                        originY: 'center', // Align the text vertically
                        fontFamily: this.fontFamily,
                    });
                    this.canvas.add(bottomNumber);
                }
            }


            let staticImage;

            if (this.showStaticObject) {

                FabricImage.fromURL(this.staticObjectImage, (staticImg) => {
                })
                    .then((staticImg) => {

                        staticImg.scaleToWidth(staticObjectDiameter);
                        staticImg.scaleToHeight(staticObjectDiameter);

                        // Position the image in the bottom left corner
                        staticImg.set({
                            left: this.padding + 4, // Align with the left edge of the canvas
                            top: this.canvasSize - this.padding - staticObjectDiameter, // Bottom left position
                            selectable: false, // Disable selection
                            shadow: {
                                color: 'rgba(0, 0, 0, 0.5)', // Shadow color with transparency
                                blur: 10, // Blur effect
                                offsetX: 5, // Horizontal offset
                                offsetY: 5, // Vertical offset
                            },
                        });

                        staticImage = staticImg;
                        // this.canvas.add(staticImg);
                    });

            }


            FabricImage.fromURL(this.dynamicObjectImage, (staticImg) => {
            })

                .then((img) => {
                    // Scale the image to match the product size
                    img.scaleToWidth(dynamicObjectDiameter);
                    img.scaleToHeight(dynamicObjectDiameter);

                    // Position the image in the bottom left corner
                    img.set({
                        left: this.padding, // Align with the left edge of the canvas
                        top: this.canvasSize - this.padding - dynamicObjectDiameter, // Bottom left position
                        selectable: false, // Disable selection
                        shadow: {
                            color: 'rgba(0, 0, 0, 0.25)', // Shadow color with transparency
                            blur: 15, // Blur effect
                            offsetX: 15, // Horizontal offset
                            offsetY: 15, // Vertical offset
                        },
                    });


                    // Create a dashed circle over the product image
                    const dashedCircle = new Circle({
                        radius: dynamicObjectDiameter / 2, // Match the size of the product
                        left: padding, // Align with the product image
                        top: this.canvasSize - padding - dynamicObjectDiameter, // Align with the product image
                        stroke: this.patternGridColor, // Circle stroke color
                        // fill: backgroundColor, // Circle fill color with transparency
                        fill: 'transparent', // Circle fill color with transparency
                        strokeWidth: 2, // Circle stroke thickness
                        strokeDashArray: [5, 5], // Dashed pattern
                        selectable: false, // Disable selection
                        originX: 'center', // Center the circle over the product
                        originY: 'center', // Center the circle over the product
                    });

                    // Adjust position to center over the product image
                    dashedCircle.set({
                        left: this.padding + dynamicObjectDiameter / 2,
                        top: this.canvasSize - this.padding - dynamicObjectDiameter / 2,
                    });


                    this.canvas.add(dashedCircle);

                    this.canvas.add(img);

                    if (staticImage) {
                        this.canvas.add(staticImage);
                    }


                });


            // Create a pattern with 45-degree lines
            const patternCanvas = document.createElement('canvas');
            patternCanvas.width = 10;
            patternCanvas.height = 10;
            const patternContext = patternCanvas.getContext('2d');
            patternContext.strokeStyle = this.patternGridColor; // Line color
            patternContext.lineWidth = 1; // Line width
            patternContext.beginPath();
            patternContext.moveTo(0, 10);
            patternContext.lineTo(10, 0);
            patternContext.stroke();
            const pattern = new Pattern({
                source: patternCanvas,
                repeat: 'repeat',
            });


            // Calculate the center of the product image
            // const productCenterX = padding + productDiameter / 2;
            const productCenterX = this.padding;
            const productBottomY = this.canvasSize - this.padding;

            // Calculate the width of the rectangle from the center of the product to the right side of the grid
            // const rectangleWidth = this.canvasSize - padding - productCenterX;
            // Create the rectangle
            const rectangle = new Rect({
                left: productCenterX, // Start from the center of the product
                top: productBottomY - dynamicObjectDiameter, // Align with the top of the product
                width: dynamicObjectDiameter, // Width extending to the right side of the grid
                height: dynamicObjectDiameter, // Height matching the product's height
                fill: pattern, // Optional: Fill color with transparency
                selectable: false, // Disable selection
            });


            const maskCircle = new Circle({
                radius: dynamicObjectDiameter / 2, // Set radius to the product's diameter or another value
                left: this.padding + dynamicObjectDiameter / 2, // Center over the product
                top: this.canvasSize - this.padding - dynamicObjectDiameter / 2, // Center over the product
                fill: 'white', // White color for the masking effect
                globalCompositeOperation: 'destination-out', // This will "cut out" the circle area from the pattern
                selectable: false, // Disable selection
                originX: 'center', // Center the circle horizontally
                originY: 'center', // Center the circle vertically
            });


            // Group the pattern rectangle and apply the circular mask
            const patternGroup = new Group([rectangle, maskCircle], () => {
                // Set the clipPath property to apply the mask
                this.clipPath = maskCircle;
                this.selectable = false;
            });

            // Add the group to the canvas
            this.canvas.add(patternGroup);

            // Create the text for the size indicator
            const sizeIndicatorText = new Text(`${this.state} ${this.sizeText}`, {
                // left: this.canvasSize - padding - 30, // Position text to the left of the line
                left: this.canvasSize / 2, // Position text to the left of the line
                // top: canvasSize - padding - productDiameter / 2 - 10, // Center the text vertically along the line
                top: 40 + this.padding, // Center the text vertically along the line
                originX: 'center', // Center the text horizontally on the line
                originY: 'center', // Center the text vertically on the line
                fontSize: 24, // Text size
                fill: '#000', // Text color
                selectable: false, // Disable selection
                // angle: -90, // Rotate the text to be vertical
                angle: 0, // Rotate the text to be vertical
                fontFamily: this.fontFamily, // Specify the font family (change to your desired font)
            });

            // Add the size indicator text to the canvas
            this.canvas.add(sizeIndicatorText);

            this.canvas.forEachObject(function (obj) {
                obj.set('selectable', false);
            });


            this.canvas.renderAll();
        },


    }
}
