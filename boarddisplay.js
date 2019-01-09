// Board display constructor - methods to translate boardArray into canvas and SVG elements for display
// ------------------------------------------------------------------------------------------------------------
function BoardDisplay (boardArray, rows, cols, mapWidth, innerHeight, gridSize, tileBorder, boardSurround, screenReduction, node) {
    // BoardDisplay takes the boardArray to be translated an input
    this.boardArray = boardArray;
    this.rows = rows; // number of rows
    this.cols = cols; // number of columns
    this.mapWidth = mapWidth;
    this.innerHeight = innerHeight;
    this.gridSize = gridSize;
    this.tileBorder = tileBorder;
    this.boardSurround = boardSurround;
    this.screenReduction = screenReduction;
    this.node = node;

    // Defining game layers - canvas for board tiles and background
    this.canvasLayers = {
        visibleTiles: {gap: 0*screenReduction, width: 1*screenReduction, colour: 'rgb(235, 215, 195)', background: 'rgb(246, 232, 206)', zIndex: '2', property: 'terrain', tile: 'invis', equality: false},
        landInnerRing: {gap: 4*screenReduction, width: 1.5*screenReduction, colour: 'rgb(138, 87, 50)', background: 'transparent', zIndex: '3', property: 'terrain', tile: 'land', equality: true},
        landOuterRing: {gap: 6*screenReduction, width: 6*screenReduction, colour: 'rgb(213, 191, 163)', background: 'rgb(246, 232, 206)', zIndex: '2', property: 'terrain', tile: 'land', equality: true},
        activeTiles: {gap: 0*screenReduction, width: 1*screenReduction, colour: 'rgb(255, 153, 153)', background: 'transparent', zIndex: '2', property: 'activeStatus', tile: 'active', equality: true},
        harbours: {gap: 0*screenReduction, width: 1*screenReduction, colour: 'transparent', background: 'rgb(233, 211, 183)', zIndex: '2', property: 'subTerrain', tile: 'harbour', equality: true},
        pirateHarbours: {gap: 0*screenReduction, width: 1*screenReduction, colour: '#353839', background: 'rgb(233, 211, 183)', zIndex: '2', property: 'subTerrain', tile: 'pirateHarbour', equality: true},
        highlight: {gap: 4*screenReduction, width: 2*screenReduction, colour: 'white', background: 'white', zIndex: '2', property: '', tile: '', equality: 'highlight'},
    }
    // Defining game layers - SVG for board elements and trade routes
    this.svgLayers = {
        backgroundLayer: {background: 'rgb(246, 232, 206)', zIndex: '0'},
        compassLayer: {background: 'transparent', zIndex: '1'},
        logoLayer: {background: 'transparent', zIndex: '1'},
        moonLayer: {background: 'transparent', zIndex: '1'},
        borderLayer: {background: 'transparent', zIndex: '1'},
        tradeRouteLayer: {background: 'transparent', zIndex: '5'},
    }

    this.pieces = {};
}

// ------------------------------------------
// CANVAS ELEMENTS
// ------------------------------------------

// Method to set up canvas layers
// -------------------------------
BoardDisplay.prototype.setupCanvasLayers = function() {
    for (let layerName of Object.keys(this.canvasLayers)) {
        this.createCanvasLayer(layerName);
        if (layerName !== 'highlight') {
            this.drawTiles(layerName);
        }
    };
}

// Method to create a new canvas layer for the board display
// ---------------------------------------------------------
BoardDisplay.prototype.createCanvasLayer = function(layerName) {
    // Creates new canvas layer and adds to the board document node
    const newLayer = document.createElement('canvas');
    newLayer.style.position = "absolute";
    newLayer.style.backgroundColor = "transparent";
    newLayer.style.zIndex = this.canvasLayers[layerName].zIndex;
    newLayer.setAttribute('id', 'ID'+layerName);
    this.node.appendChild(newLayer);
    // Adds context to the canvas layer and defines width and height
    const contextLayer = newLayer.getContext('2d');
    contextLayer.canvas.width = this.cols * (this.gridSize + this.tileBorder * 2) + this.boardSurround * 2;
    contextLayer.canvas.height = this.rows * (this.gridSize + this.tileBorder * 2) + this.boardSurround * 2;
    this.canvasLayers[layerName].context = contextLayer;
}

// Method for drawing tiles - loops through whole board
// ----------------------------------------------------
BoardDisplay.prototype.drawTiles = function(layerName, piece) {
    // Clears tiles before drawing
    this.clearTiles(layerName);
    const layer = this.canvasLayers[layerName];
    const context = this.canvasLayers[layerName].context;
    // Start path for each array of octagons
    context.beginPath();
    // Loops through all tiles of board
    for (let i = 0; i < this.rows; i+=1) {
        for (let j = 0; j < this.cols; j+=1) {
            if (layer.equality === true) {
                if (this.boardArray[i][j].tile[layer.property] === layer.tile) {
                    this.drawOctagon(context, i, j, layer.gap)
                }
            } else if (layer.equality === false) {
                if (this.boardArray[i][j].tile[layer.property] !== layer.tile) {
                    this.drawOctagon(context, i, j, layer.gap)
                }
            } else if (layer.equality === 'highlight') {
                if (this.boardArray[i][j].piece.type === piece) {
                    this.drawOctagon(context, i, j, layer.gap)
                }
            }
        }
    }
    // Draw path for each array of octagons
    context.lineWidth = layer.width;
    context.lineCap='round';
    context.strokeStyle = layer.colour;
    context.fillStyle = layer.background;
    context.stroke();
    context.fill();
}

// Method to clear tile layer
// --------------------------
BoardDisplay.prototype.clearTiles = function(layerName) {
    const layer = this.canvasLayers[layerName];
    const context = this.canvasLayers[layerName].context;
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
}

// Method to draw an octagon on context of canvas layer (without stroke or fill)
// -----------------------------------------------------------------------------
BoardDisplay.prototype.drawOctagon = function(context, rowNo, colNo, ocatagonGap) {
    const octagonAngle = (2 * Math.PI) / 8;
    const Xcenter = (this.gridSize + this.tileBorder * 2) * colNo + (this.gridSize/2 + this.boardSurround + this.tileBorder);
    const Ycenter = (this.gridSize + this.tileBorder * 2) * rowNo + (this.gridSize/2 + this.boardSurround + this.tileBorder);
    // Moves to start of octagon
    context.moveTo(Xcenter + (this.gridSize/2 + ocatagonGap) * Math.cos(0.5 * octagonAngle), Ycenter + (this.gridSize/2 + ocatagonGap) *  Math.sin(0.5 * octagonAngle));
    // Draws eight sides
    for (var k = 1; k <= 8; k++) {
        context.lineTo(Xcenter + (this.gridSize/2 + ocatagonGap) * Math.cos((k+0.5) * octagonAngle), Ycenter + (this.gridSize/2 + ocatagonGap) * Math.sin((k+0.5) * octagonAngle));
    }
}
