
// ------------------------------------------
// SVG PIECES SETUP OF BOARDDISPLAY
// ------------------------------------------

// Method to translate the boardArray into board pieces
// ----------------------------------------------------
BoardDisplay.prototype.setupPieces = function() {
    //if(settings.workFlow === true) {console.log('Pieces drawn: ' + (Date.now() - settings.launchTime)); }
    for (let i = 0; i < this.rows; i+=1) {
        for (let j = 0; j < this.cols; j+=1) {
            if (this.boardArray[i][j].piece.populatedSquare === true) {
                let piece = this.boardArray[i][j].piece;
                // Create action tile svg and add to the board
                this.addPiece(piece.type, piece.team, i, j, piece.direction, piece.damageStatus);
            }
        }
    }
}

// Method to add a single piece to the screen using SVG
// ---------------------------------------------------
BoardDisplay.prototype.addPiece = function(type, team, row, col, rotation, damageStatus) {
    const top = this.boardSurround + this.tileBorder/2 + (this.gridSize + this.tileBorder * 2) * row;
    const left = this.boardSurround + this.tileBorder/2 + (this.gridSize + this.tileBorder * 2) * col;
    const pieceID = 'piece' + ('0' + row).slice(-2) + ('0' + col).slice(-2);
    this.pieces[pieceID] = new PieceSVG(type, team, pieceID, top, left, 1, rotation, damageStatus, this.gridSize, this.tileBorder, this.boardSurround);
    this.node.appendChild(this.pieces[pieceID].svg);
}

// Method to move a single SVG piece on the screen
// ---------------------------------------------------
BoardDisplay.prototype.movePiece = async function(startMove, endMove, startPieceSVG, endPiece, endPieceID, gameSpeed) {
    // Main action event listeners are switched off whilst move transitions are shown
    game.boardHolder.endTurn.removeEventListener('click', game.nextTurn);
    this.node.removeEventListener('click', this.boardHandler);
    stockDashboard.node.removeEventListener('click', buildItem.clickStock);
    stockDashboard.node.removeEventListener('mouseover', stockDashboard.hoverPieceOn);
    stockDashboard.node.removeEventListener('mouseleave', game.board.clearHighlightTiles);

    await this.scrollWindow(startMove.row);
    pieceMovement.shipTransition(startMove, endMove, endPiece, startPieceSVG, gameSpeed);

    // Updating piece information
    let startPieceID = startPieceSVG.pieceID;
    if (endPieceID !== startPieceID) {
        this.pieces[endPieceID] = startPieceSVG;
        delete this.pieces[startPieceID];
        this.pieces[endPieceID].pieceID = endPieceID;
        this.pieces[endPieceID].svg.setAttribute('id', endPieceID);
    }
}

// Method to move a single SVG piece on the screen - without transition
// --------------------------------------------------------------------
BoardDisplay.prototype.movePieceNoTransition = async function(startPieceSVG, endPieceID, row, col) {
    // Change piece position
    const top = this.boardSurround + this.tileBorder/2 + (this.gridSize + this.tileBorder * 2) * row;
    const left = this.boardSurround + this.tileBorder/2 + (this.gridSize + this.tileBorder * 2) * col;
    startPieceSVG.changePosition(top, left);

    // Updating piece information
    let startPieceID = startPieceSVG.pieceID;
    if (endPieceID !== startPieceID) {
        this.pieces[endPieceID] = startPieceSVG;
        delete this.pieces[startPieceID];
        this.pieces[endPieceID].pieceID = endPieceID;
        this.pieces[endPieceID].svg.setAttribute('id', endPieceID);
    }
}



// ------------------------------------------
// WINDOW
// ------------------------------------------

// Method to scroll to row of move being made if not a human player
// ---------------------------------------------------------
BoardDisplay.prototype.scrollWindow = async function(row) {
    if (game.type !== 'human') {
        let minScroll = this.boardSurround - this.gridSize;
        let maxScroll = this.mapWidth - this.innerHeight - minScroll;
        let startScroll = window.pageYOffset;
        let endScroll = Math.min(Math.max(this.boardSurround + this.tileBorder/2 + (this.gridSize + this.tileBorder * 2) * (row + 0.5) - this.innerHeight/2 , minScroll), maxScroll);

        // No scroll if scroll distance is smaller than 5 tiles to prevent jumpiness
        if (Math.abs(startScroll - endScroll) > this.gridSize*5) {
            await frameScroll(startScroll, endScroll, 1);
        }

        // Loops through scrolling
        async function frameScroll(startScroll, endScroll, speedScroll) {
            // delay at start of scrolling
            await new Promise(resolve => setTimeout(resolve, 200));
            let scrollStep = -10 * (startScroll - endScroll) / Math.abs((startScroll - endScroll));
            let numberOfSteps = Math.ceil((endScroll - startScroll)/scrollStep);

            // scrolling speed is constant so longer scrolls will take longer
            for (let i = 0; i < numberOfSteps-1; i+=1) {
                window.scrollTo({top: startScroll + i * scrollStep});
                await new Promise(resolve => setTimeout(resolve, 5));
            }
            // final scroll makes the scroll movement exact
            window.scrollTo({top: endScroll});

            // delay at start of scrolling before tiles activated
            await new Promise(resolve => setTimeout(resolve, 200));
            return;
        }
        return;
    }
}

// ------------------------------------------
// SVG LAYERS OF BOARDDISPLAY
// ------------------------------------------

// Method to set up layers
// -----------------------
BoardDisplay.prototype.setupSVGLayers = function() {
    for (let layerName of Object.keys(this.svgLayers)) {
        this.createSVGLayer(layerName);
    };
    this.drawCompass('compassLayer');
    this.drawLogo('logoLayer');
    this.drawBoardBorder('borderLayer');
    this.drawMoonLayer('moonLayer');
}

// Method to add new SVG layer to board
// ------------------------------------
BoardDisplay.prototype.createSVGLayer = function(layerName) {
    const newLayer = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    newLayer.setAttribute('width', this.cols * (this.gridSize + this.tileBorder * 2) + this.boardSurround * 2);
    newLayer.setAttribute('height', this.rows * (this.gridSize + this.tileBorder * 2) + this.boardSurround * 2);
    newLayer.setAttribute('viewBox', '0, 0, ' + (this.cols * (this.gridSize + this.tileBorder * 2) + this.boardSurround * 2) +  ', ' + (this.rows * (this.gridSize + this.tileBorder * 2) + this.boardSurround * 2));
    newLayer.setAttribute('class', layerName);
    newLayer.style.position = "absolute";
    newLayer.style.backgroundColor = this.svgLayers[layerName].background;
    newLayer.style.zIndex = this.svgLayers[layerName].zIndex;
    this.node.appendChild(newLayer);
    this.svgLayers[layerName].svg = newLayer;
}

// Method to draw compass on lowest layer of board
// -------------------------------------------------------------
BoardDisplay.prototype.drawCompass = function(layerName) {
    const layer = this.svgLayers[layerName].svg;
    let compassSize = (this.gridSize + this.tileBorder * 2) * 2;
    let logoSize = (this.gridSize + this.tileBorder * 2) * 2;
    let Xsize = (this.cols * (this.gridSize + this.tileBorder * 2) + this.boardSurround * 2);
    let Ysize = (this.rows * (this.gridSize + this.tileBorder * 2) + this.boardSurround * 2);
    let Xcenter = (this.gridSize + this.tileBorder * 2) * (this.cols - 3) + (this.gridSize/2 + this.boardSurround + this.tileBorder);
    let Ycenter = (this.gridSize + this.tileBorder * 2) * (this.rows - 3) + (this.gridSize/2 + this.boardSurround + this.tileBorder);

    // Compass outer circle
    let compassOuter = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    compassOuter.setAttribute('cx', Xcenter);
    compassOuter.setAttribute('cy', Ycenter);
    compassOuter.setAttribute('r', compassSize);
    compassOuter.style.strokeWidth = '1px';
    compassOuter.setAttribute('stroke', 'rgb(235, 215, 195)');
    compassOuter.setAttribute('fill', 'none');
    compassOuter.style.strokeLinecap = 'round';

    // Compass inner circle
    let compassInner = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    compassInner.setAttribute('cx', Xcenter);
    compassInner.setAttribute('cy', Ycenter);
    compassInner.setAttribute('r', compassSize - this.tileBorder*2);
    compassInner.style.strokeWidth = '1px';
    compassInner.setAttribute('stroke', 'rgb(235, 215, 195)');
    compassInner.setAttribute('fill', 'rgb(246, 232, 206)');
    compassInner.style.strokeLinecap = 'round';

    // Compass reading lines that stretch across board
    let compassLines = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    compassLines.setAttribute('d', 'M ' + (Xsize - this.boardSurround) + ' ' + (Ysize - this.boardSurround) + 'L ' + (this.boardSurround+logoSize*2) + ' ' + (this.boardSurround+logoSize*2) + 'M ' + (Xsize - this.boardSurround) + ' ' + Ycenter + 'L ' + (this.boardSurround + this.tileBorder/2 + (this.gridSize + this.tileBorder * 2) * 6) + ' ' + Ycenter
                                    + 'M ' + Xcenter + ' ' + (Ysize - this.boardSurround) + 'L ' + Xcenter + ' ' + (this.boardSurround + this.tileBorder/2 + (this.gridSize + this.tileBorder * 2) * 6) + 'M ' + (2 * Xcenter + this.boardSurround - Xsize) + ' ' + (Ysize - this.boardSurround) + 'L ' + (Xsize - this.boardSurround) + ' ' + (2 * Ycenter + this.boardSurround - Ysize) );
    compassLines.style.strokeWidth = '1px';
    compassLines.setAttribute('stroke', 'rgb(235, 215, 195)');
    compassLines.setAttribute('opacity', '1');
    compassLines.setAttribute('fill', 'none');
    compassLines.style.strokeLinecap = 'round';

    // Coloured compass points
    let compassPointsFill = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    compassPointsFill.setAttribute('d', 'M ' + Xcenter + ' ' + Ycenter  + ' L ' + (Xcenter) + ' ' + (Ycenter - compassSize) + ' L ' + (Xcenter + this.gridSize/2) + ' ' + (Ycenter - this.gridSize/2) + 'L ' + Xcenter + ' ' + Ycenter
                                                                        + ' L ' + (Xcenter + compassSize) + ' ' + (Ycenter) + ' L ' + (Xcenter + this.gridSize/2) + ' ' + (Ycenter + this.gridSize/2) + 'L ' + Xcenter + ' ' + Ycenter
                                                                        + ' L ' + (Xcenter) + ' ' + (Ycenter + compassSize) + ' L ' + (Xcenter - this.gridSize/2) + ' ' + (Ycenter + this.gridSize/2) + 'L ' + Xcenter + ' ' + Ycenter
                                                                        + ' L ' + (Xcenter - compassSize) + ' ' + (Ycenter) + ' L ' + (Xcenter - this.gridSize/2) + ' ' + (Ycenter - this.gridSize/2) + 'L ' + Xcenter + ' ' + Ycenter
                                                                  );
    compassPointsFill.setAttribute('fill', 'rgb(213, 191, 163)');

    // Empty compass points
    let compassPointsEmpty = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    compassPointsEmpty.setAttribute('d', 'M ' + Xcenter + ' ' + Ycenter + ' L ' + (Xcenter) + ' ' + (Ycenter - compassSize) + ' L ' + (Xcenter - this.gridSize/2) + ' ' + (Ycenter - this.gridSize/2) + 'L ' + Xcenter + ' ' + Ycenter
                                                                        + ' L ' + (Xcenter + compassSize) + ' ' + (Ycenter) + ' L ' + (Xcenter + this.gridSize/2) + ' ' + (Ycenter - this.gridSize/2) + 'L ' + Xcenter + ' ' + Ycenter
                                                                        + ' L ' + (Xcenter) + ' ' + (Ycenter + compassSize) + ' L ' + (Xcenter + this.gridSize/2) + ' ' + (Ycenter + this.gridSize/2) + 'L ' + Xcenter + ' ' + Ycenter
                                                                        + ' L ' + (Xcenter - compassSize) + ' ' + (Ycenter) + ' L ' + (Xcenter - this.gridSize/2) + ' ' + (Ycenter + this.gridSize/2) + 'L ' + Xcenter + ' ' + Ycenter
                                                                  );
    compassPointsEmpty.setAttribute('stroke','rgb(235, 215, 195)');
    compassPointsEmpty.setAttribute('fill', 'rgb(246, 232, 206)');

    // Alternating colours of compass circle
    let compassRing = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    let octagonAngle = (2 * Math.PI) / 8;
    let ringPath = '';
    for (var k = 1; k <= 8; k++) {
        ringPath += 'M ' + Xcenter + ' ' + Ycenter + ' L ' + (Ycenter + compassSize * Math.cos((k) * octagonAngle)) + ' ' + (Ycenter + compassSize * Math.sin((k) * octagonAngle)) + ' A ' + (compassSize) + ' ' + (compassSize) + ' 0 0 0 ' + (Ycenter + compassSize * Math.cos((k-0.5) * octagonAngle)) + ' ' + (Ycenter + compassSize * Math.sin((k-0.5) * octagonAngle)) + 'L ' + Xcenter + ' ' + Ycenter + 'L ' + Xcenter + ' ' + Ycenter
    }
    compassRing.setAttribute('d', ringPath);
    compassRing.setAttribute('stroke','rgb(235, 215, 195)');
    compassRing.setAttribute('fill', 'rgb(213, 191, 163)');

    // Compass needle
    let compassNeedleBox = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    compassNeedleBox.setAttribute('width', compassSize * 2);
    compassNeedleBox.setAttribute('height', compassSize * 2);
    compassNeedleBox.style.top = (Ycenter - compassSize) + 'px';
    compassNeedleBox.style.left = (Xcenter - compassSize) + 'px';
    compassNeedleBox.setAttribute('viewBox', '0, 0, ' + compassSize * 2 +  ', ' + compassSize * 2);
    compassNeedleBox.setAttribute('class', 'compass');
    compassNeedleBox.setAttribute('id', 'needle2');

    let compassNeedle = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    compassNeedle.setAttribute('d', 'M ' + (compassSize - 3) + ' ' + (this.tileBorder * 2) + ' L ' + (compassSize - 0.5) + ' ' + (2 * compassSize - this.tileBorder * 2)
     + ' L ' + (compassSize + 0.5) + ' ' + (2 * compassSize - this.tileBorder * 2) + ' L ' + (compassSize + 3) + ' ' + (this.tileBorder * 2)
     + ' L ' + (compassSize) + ' ' + (this.tileBorder) + ' Z');
    compassNeedle.style.strokeWidth = '0.5px';
    compassNeedle.setAttribute('opacity', '0.75');
    compassNeedle.setAttribute('stroke', '#666666');

    compassNeedle.setAttribute('stroke', 'rgb(138, 87, 50)');
    compassNeedle.setAttribute('stroke', '#4b2f1b');
    compassNeedle.setAttribute('fill', '#A6A6A6');
    compassNeedle.setAttribute('fill', 'rgb(138, 87, 50)');

    // Compass pin (centre circle)
    let compassCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    compassCircle.setAttribute('cx', + compassSize);
    compassCircle.setAttribute('cy', + compassSize);
    compassCircle.setAttribute('r', '4');
    compassCircle.setAttribute('fill', '#666666');
    compassCircle.setAttribute('fill', 'rgb(138, 87, 50)');
    compassCircle.setAttribute('stroke', '#4b2f1b');
    compassCircle.style.strokeWidth = '0.5px';
    compassCircle.style.strokeLinecap = 'round';

    // Add all SVG elements to board
    layer.appendChild(compassRing);
    layer.appendChild(compassOuter);
    layer.appendChild(compassInner);
    layer.appendChild(compassLines);
    layer.appendChild(compassPointsFill);
    layer.appendChild(compassPointsEmpty);

    compassNeedleBox.appendChild(compassNeedle);
    compassNeedleBox.appendChild(compassCircle);

    boardMarkNode.appendChild(compassNeedleBox);

}

// Method for drawing logo on board
// ----------------------------------------

BoardDisplay.prototype.drawLogo = function(layerName) {
    const layer = this.svgLayers[layerName].svg;
    // Game logo
    let logoSize = (this.gridSize + this.tileBorder * 2) * 2;

    let logoArchipelago = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    logoArchipelago.setAttribute('cx', + logoSize + this.boardSurround);
    logoArchipelago.setAttribute('cy', + logoSize + this.boardSurround);
    logoArchipelago.setAttribute('r', logoSize);
    logoArchipelago.setAttribute('fill', 'none');
    logoArchipelago.setAttribute('stroke', 'rgb(213, 191, 163)');
    logoArchipelago.style.strokeWidth = '1px';
    logoArchipelago.style.strokeLinecap = 'round';

    let logoArchipelagoInner = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    logoArchipelagoInner.setAttribute('cx', + logoSize + this.boardSurround);
    logoArchipelagoInner.setAttribute('cy', + logoSize + this.boardSurround);
    logoArchipelagoInner.setAttribute('r', logoSize - (30*this.screenReduction));
    logoArchipelagoInner.setAttribute('fill', 'none');
    logoArchipelagoInner.setAttribute('stroke', 'rgb(213, 191, 163)');
    logoArchipelagoInner.style.strokeWidth = '1px';
    logoArchipelagoInner.style.strokeLinecap = 'round';

    let logoText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    let logoTextPath = document.createElementNS('http://www.w3.org/2000/svg', 'textPath');
    let logoDefsPath = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    let logoDefsPath2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    let text = document.createTextNode(' --- archipelago ----- archipelago ----- archipelago ---');

    // Game logo text and path
    logoDefsPath.appendChild(logoDefsPath2);
    logoDefsPath2.setAttribute('id', 'circlePath');
    logoDefsPath2.setAttribute('d', 'M ' + (this.boardSurround + 20*this.screenReduction) + ' ' + (logoSize + this.boardSurround) + ' A ' + (logoSize - 20*this.screenReduction) + ' ' + (logoSize - 20*this.screenReduction) + ' 0 1 1 ' + (this.boardSurround + 20*this.screenReduction) + ' ' + (logoSize + this.boardSurround + 1));

    logoText.appendChild(logoTextPath);
    logoText.setAttribute('font-size', 14 * Math.pow(this.screenReduction, 1.2));
    logoText.setAttribute('stroke', 'rgb(213, 191, 163)');
    logoText.setAttribute('fill', 'rgb(213, 191, 163)');
    logoTextPath.appendChild(text);

    //logoDefsPath.setAttribute('path');
    logoTextPath.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#circlePath');

    layer.appendChild(logoArchipelago);
    layer.appendChild(logoArchipelagoInner);
    layer.appendChild(logoDefsPath);
    layer.appendChild(logoText);
}

// Method for drawing board border on board layer
// ----------------------------------------------
BoardDisplay.prototype.drawBoardBorder = function(layerName) {
    const layer = this.svgLayers[layerName].svg;
    // Border
    let equalGap = this.gridSize;
    let octagonBorder = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    octagonBorder.setAttribute('d',
    'M ' + (this.boardSurround + this.tileBorder + (this.gridSize + this.tileBorder * 2) * 10)  + ' ' + (this.boardSurround + this.tileBorder - equalGap) +
    'L ' + (this.boardSurround + this.tileBorder + (this.gridSize + this.tileBorder * 2) * 20 + this.gridSize) + ' ' + (this.boardSurround + this.tileBorder - equalGap) +
    'L ' + (this.boardSurround + this.tileBorder + (this.gridSize + this.tileBorder * 2) * 30 + this.gridSize + equalGap) + ' ' + (this.boardSurround + this.tileBorder + (this.gridSize + this.tileBorder * 2) * 10) +
    'L ' + (this.boardSurround + this.tileBorder + (this.gridSize + this.tileBorder * 2) * 30 + this.gridSize + equalGap) + ' ' + (this.boardSurround + this.tileBorder + (this.gridSize + this.tileBorder * 2) * 20  + this.gridSize) +
    'L ' + (this.boardSurround + this.tileBorder + (this.gridSize + this.tileBorder * 2) * 20 + this.gridSize) + ' ' + (this.boardSurround + this.tileBorder + (this.gridSize + this.tileBorder * 2) * 30  + this.gridSize  + equalGap) +
    'L ' + (this.boardSurround + this.tileBorder + (this.gridSize + this.tileBorder * 2) * 10) + ' ' + (this.boardSurround + this.tileBorder + (this.gridSize + this.tileBorder * 2) * 30  + this.gridSize + equalGap) +
    'L ' + (this.boardSurround + this.tileBorder + (this.gridSize + this.tileBorder * 2) * 0 - equalGap) + ' ' + (this.boardSurround + this.tileBorder + (this.gridSize + this.tileBorder * 2) * 20  + this.gridSize) +
    'L ' + (this.boardSurround + this.tileBorder + (this.gridSize + this.tileBorder * 2) * 0 - equalGap) + ' ' + (this.boardSurround + this.tileBorder + (this.gridSize + this.tileBorder * 2) * 10) + ' Z'
    );

    octagonBorder.style.strokeWidth = '6px';
    octagonBorder.setAttribute('stroke', 'rgb(235, 215, 195)');
    octagonBorder.setAttribute('stroke', 'rgb(213, 191, 163)');
    octagonBorder.setAttribute('opacity', '1');
    octagonBorder.setAttribute('fill', 'none');
    octagonBorder.style.strokeLinecap = 'round';

    layer.appendChild(octagonBorder);
}

// Method to add moon and time to the board
// -----------------------------------------
BoardDisplay.prototype.drawMoonLayer = function(layerName) {
    const layer = this.svgLayers[layerName].svg;
    // Clear the moon layer before redrawing
    while (layer.lastChild) {
        layer.removeChild(layer.lastChild);
    }

    let moonRadius = (this.gridSize + this.tileBorder * 2) * 2 - (10*this.screenReduction);
    let moonCentreX = (this.gridSize + this.tileBorder * 2) * (this.cols - 3) + (this.gridSize/2 + this.boardSurround + this.tileBorder);
    let moonCentreY = this.boardSurround + this.tileBorder/2 + (this.gridSize + this.tileBorder * 2) * 2;

    // Obtaining date inputs (moonPhase and moonMonth plus ordinals)
    let dateInputs = game.moonDate(game.gameDate);

    layer.appendChild(this.drawMoon(moonCentreX, moonCentreY, moonRadius, dateInputs.moonPhase));

    // Text under the moon
    let timeText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    timeText.textContent = (dateInputs.moonPhaseOrd + ' phase of ' + dateInputs.moonMonthOrd + ' moon');
    timeText.setAttribute('font-size', 14 * this.screenReduction);
    timeText.setAttribute('stroke', 'rgb(179, 156, 128)');
    timeText.setAttribute('fill', 'rgb(179, 156, 128)');
    timeText.setAttribute('x', moonCentreX);
    timeText.setAttribute('y', moonCentreY + moonRadius + 14 * this.screenReduction + this.tileBorder);
    timeText.setAttribute('text-anchor', 'middle');
    timeText.setAttribute('font-style', 'italic');
    layer.appendChild(timeText);
}

// Method to draw moon
// -------------------
BoardDisplay.prototype.drawMoon = function(localX, localY, localRadius, localMoonPhase) {
    // Group holder for moon
    let moonGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');

    // Backing circle of moon
    let moonCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    moonCircle.setAttribute('cx', localX);
    moonCircle.setAttribute('cy', localY);
    moonCircle.setAttribute('r', localRadius);
    moonCircle.setAttribute('fill', 'rgb(233, 211, 183)');
    moonCircle.setAttribute('stroke', 'rgb(233, 211, 183)');
    moonCircle.style.strokeWidth = '1px';
    moonCircle.style.strokeLinecap = 'round';
    moonGroup.appendChild(moonCircle);

    // Inputs for drawing moon arcs
    let nearSide = [1, 1, 1, 1, 0.5, 0, 0.5];
    let farSide = [0.5, 0, 0.5, 1, 1, 1, 1];
    let nearSideArc = [1, 1, 1, 1, 1, 0, 0];
    let farSideArc = [0, 0, 1, 1, 1, 1, 1];

    // Lighter moon overlay uses two arcs to give shape of moon - not added in 8th phase (new moon)
    if(localMoonPhase < 8) {

        let moonArc = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        moonArc.setAttribute('d',
        'M ' + (localX)  + ' ' + (localY - localRadius) +
        ' A ' + (localRadius*farSide[localMoonPhase-1]) + ' ' + localRadius + ' 0 0 ' + farSideArc[localMoonPhase-1] + ' ' + (localX)  + ' ' + (localY + localRadius) +
        ' A ' + (localRadius*nearSide[localMoonPhase-1]) + ' ' + localRadius + ' 0 0 ' + nearSideArc[localMoonPhase-1] + ' ' + (localX)  + ' ' + (localY - localRadius)
       );
        moonArc.setAttribute('fill', 'rgb(249, 240, 223)');
        moonArc.setAttribute('stroke', 'rgb(213, 191, 163)');
        moonArc.setAttribute('stroke-linecap', 'round');
        moonArc.setAttribute('stroke-linejoin', 'round');
        moonArc.style.strokeWidth = '1px';
        moonGroup.appendChild(moonArc);
    }

    return moonGroup;
}

// Method to draw a trade route on the board
// -----------------------------------------
// Local path is an array of objects of the form {fromRow: 15, fromCol: 4}
BoardDisplay.prototype.tradeRoute = function(localPath, localTeam, localFort, localGoods, layerName) {
    const layer = this.svgLayers[layerName].svg;
    let pathGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    layer.appendChild(pathGroup);
    pathGroup.id = localGoods + '_' + localFort;

    let route = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    route.setAttribute('class', localTeam + ' team_route');

    let buildRoute = 'M ' + (this.boardSurround + this.tileBorder + this.gridSize/2 + (this.gridSize + this.tileBorder * 2) * localPath[0].fromCol) + ' ' + (this.boardSurround + this.tileBorder + this.gridSize/2 + (this.gridSize + this.tileBorder * 2) * localPath[0].fromRow);

    for (var i = 0; i < localPath.length; i++) {
        buildRoute += ' L ' + (this.boardSurround + this.tileBorder + this.gridSize/2 + (this.gridSize + this.tileBorder * 2) * localPath[i].fromCol) + ' ' + (this.boardSurround + this.tileBorder + this.gridSize/2 + (this.gridSize + this.tileBorder * 2) * localPath[i].fromRow);
    }

    route.setAttribute('d', buildRoute);
    route.setAttribute('fill', 'none');
    route.setAttribute('stroke-linecap', 'round');
    route.setAttribute('stroke-linejoin', 'round');
    route.setAttribute('stroke-opacity', '0.5');
    route.style.strokeWidth = '3px';
    pathGroup.appendChild(route);

    let startCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    startCircle.setAttribute('class', localTeam + ' team_fill team_route');
    startCircle.setAttribute('cx', (this.boardSurround + this.tileBorder + this.gridSize/2 + (this.gridSize + this.tileBorder * 2) * localPath[0].fromCol));
    startCircle.setAttribute('cy', (this.boardSurround + this.tileBorder + this.gridSize/2 + (this.gridSize + this.tileBorder * 2) * localPath[0].fromRow));
    startCircle.setAttribute('r', '3');
    startCircle.style.strokeWidth = '1px';
    startCircle.style.strokeLinecap = 'round';
    startCircle.setAttribute('fill', 'none');
    pathGroup.appendChild(startCircle);

    let endCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    endCircle.setAttribute('class', localTeam + ' team_fill team_route');
    endCircle.setAttribute('cx', (this.boardSurround + this.tileBorder + this.gridSize/2 + (this.gridSize + this.tileBorder * 2) * localPath[localPath.length-1].fromCol));
    endCircle.setAttribute('cy', (this.boardSurround + this.tileBorder + this.gridSize/2 + (this.gridSize + this.tileBorder * 2) * localPath[localPath.length-1].fromRow));
    endCircle.setAttribute('r', '3');
    endCircle.style.strokeWidth = '1px';
    endCircle.style.strokeLinecap = 'round';
    //endCircle.setAttribute('fill', 'none');
    pathGroup.appendChild(endCircle);

}

// Method to add mark to harbour to show team has completed contract with that island
// ----------------------------------------------------------------------------------
BoardDisplay.prototype.closedRouteMark = function(localRow, localCol, localTeam, localFort, layerName) {
    const layer = this.svgLayers[layerName].svg;
    let islandTeamHarbour = {Green: [1,0], Blue: [0,-1], Red: [-1,0], Orange: [0,1]}

    let closedMark = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    closedMark.id = localTeam + '_' + localFort;
    closedMark.setAttribute('class', localTeam + ' team_route');
    closedMark.setAttribute('cx', (this.boardSurround + this.tileBorder + this.gridSize/2 + (this.gridSize + this.tileBorder * 2) * (localCol + islandTeamHarbour[localTeam][1])));
    closedMark.setAttribute('cy', (this.boardSurround + this.tileBorder + this.gridSize/2 + (this.gridSize + this.tileBorder * 2) * (localRow + islandTeamHarbour[localTeam][0])));
    closedMark.setAttribute('r', '7');
    closedMark.setAttribute('fill', 'none');
    closedMark.style.strokeWidth = '2px';
    closedMark.style.strokeLinecap = 'round';
    layer.appendChild(closedMark);
}
