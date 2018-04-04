
// Game board object - methods to initialise board and array to store current state of board
let gameBoard = {

    // Array to store current state of board
    // -------------------------------------
    boardArray: [],

    // Method to initialise boardArray
    // -------------------------------
    // Row and col give size of board - boardShape gives shape of board
    populateBoardArray: function(row, col, boardShape) {
        // Blank board array to re-initialise
        this.boardArray = [];

        // Create array of objects - square array of y rows of x tiles
        for (var y = 0; y < col; y++) {
            let rowArray = [];
            for (var x = 0; x < row; x++) {
                // A few random land tiles
                if(Math.random() > 0.995) {
                    rowArray.push({xpos: + x, ypos: + y, terrain: 'land', activeStatus: 'inactive', pieces: {populatedSquare: false, type: 'no piece', direction: '', used: 'unused', team: ''}});
                // But mainly sea tiles
                } else {
                    rowArray.push({xpos: + x, ypos: + y, terrain: 'sea', activeStatus: 'inactive', pieces: {populatedSquare: false, type: 'no piece', direction: '', used: 'unused', team: ''}});
                }
            }
        this.boardArray.push(rowArray);
        }

    },

    // Method to overlay islands and bases and pieces
    // ----------------------------------------------
    // Much of this overlay code could be removed and replaced by a fixed array at a later date
    // But currently it is useful to allow the board to be set dynamically in different sizes
    // whilst game play is being developed
    overlayBoardArray: function(row, col, boardShape) {
        let boardCenter = Math.round((row-1)/2);
        let octagonCorner = (row-1)/3;

        // A octagon shaped board is obtained by making triangles of tiles invisible in the corners
        if (boardShape == 'octagon') {
            this.overlayTilesTri(0, 0, octagonCorner, 'TL', 'invis');
            this.overlayTilesTri(0, col-octagonCorner, octagonCorner, 'TR', 'invis');
            this.overlayTilesTri(row-octagonCorner, 0, octagonCorner, 'BL', 'invis');
            this.overlayTilesTri(row-octagonCorner, col-octagonCorner, octagonCorner, 'BR', 'invis');
        }

        // Creation of triangle-shaped islands
        this.overlayTilesTri((row-1)/3-3, (row-1)/3-3, 3, 'BR', 'land');
        this.boardArray[(row-1)/3-1][(row-1)/3-1].terrain = 'sea';

        this.overlayTilesTri(2*((row-1)/3)+1, 2*((row-1)/3)+1, 3, 'TL', 'land');
        this.boardArray[2*((row-1)/3)+1][2*((row-1)/3)+1].terrain = 'sea';

        this.overlayTilesTri((row-1)/3-3, 2*((row-1)/3)+1, 3, 'BL', 'land');
        this.boardArray[(row-1)/3-1][2*((row-1)/3)+1].terrain = 'sea';

        this.overlayTilesTri(2*((row-1)/3)+1, (row-1)/3-3, 3, 'TR', 'land');
        this.boardArray[2*((row-1)/3)+1][(row-1)/3-1].terrain = 'sea';

        // Creation of central volcanic shaped island for trading post
        this.overlayTiles(boardCenter-1, boardCenter+2, boardCenter-1, boardCenter+2, 'land');
        this.boardArray[boardCenter-1][boardCenter+1].terrain = 'sea';
        this.boardArray[boardCenter-1][boardCenter-1].terrain = 'sea';
        this.boardArray[boardCenter+1][boardCenter+1].terrain = 'sea';
        this.boardArray[boardCenter+1][boardCenter-1].terrain = 'sea';

        // Creation of bay shaped islands
        this.overlayTiles(boardCenter-1, boardCenter+2, 2*((row-1)/3)+4, 2*((row-1)/3)+6, 'land');
        this.boardArray[boardCenter][2*((row-1)/3)+5].terrain = 'sea';

        this.overlayTiles(boardCenter-1, boardCenter+2, (row-1)/3-5, (row-1)/3-3, 'land');
        this.boardArray[boardCenter][(row-1)/3-5].terrain = 'sea';

        this.overlayTiles(2*((row-1)/3)+4, 2*((row-1)/3)+6, boardCenter-1, boardCenter+2, 'land');
        this.boardArray[2*((row-1)/3)+5][boardCenter].terrain = 'sea';

        this.overlayTiles((row-1)/3-5, (row-1)/3-3, boardCenter-1, boardCenter+2, 'land');
        this.boardArray[(row-1)/3-5][boardCenter].terrain = 'sea';

        // Creation of land around bases
        this.overlayTiles(row-1, row, boardCenter-1, boardCenter+2, 'land');
        this.overlayTiles(0, 1, boardCenter-1, boardCenter+2, 'land');
        this.overlayTiles(boardCenter-1, boardCenter+2, col-1, col, 'land');
        this.overlayTiles(boardCenter-1, boardCenter+2, 0, 1, 'land');

        // Creation of forts
        this.boardArray[boardCenter][col-1].pieces = {populatedSquare: true, type: 'fort', direction: '-135', used: 'unused', team: 'teamOrange'};
        this.boardArray[0][boardCenter].pieces = {populatedSquare: true, type: 'fort', direction: '135', used: 'unused', team: 'teamLemon'};
        this.boardArray[row-1][boardCenter].pieces = {populatedSquare: true, type: 'fort', direction: '-45', used: 'unused', team: 'teamLime'};
        this.boardArray[boardCenter][0].pieces = {populatedSquare: true, type: 'fort', direction: '45', used: 'unused', team: 'teamPlum'};
        this.boardArray[boardCenter][boardCenter].pieces = {populatedSquare: true, type: 'fort', direction: '0', used: 'unused', team: 'teamKingdom'};

        // Creation of Kingdom huts
        this.boardArray[row-9][8].pieces = {populatedSquare: true, type: 'hut', direction: '45', used: 'unused', team: 'teamKingdom'};
        this.boardArray[8][8].pieces = {populatedSquare: true, type: 'hut', direction: '45', used: 'unused', team: 'teamKingdom'};
        this.boardArray[8][col-9].pieces = {populatedSquare: true, type: 'hut', direction: '45', used: 'unused', team: 'teamKingdom'};
        this.boardArray[row-9][col-9].pieces = {populatedSquare: true, type: 'hut', direction: '45', used: 'unused', team: 'teamKingdom'};

        // Creation of ships
        this.boardArray[boardCenter-1][col-2].pieces = {populatedSquare: true, type: 'cargo', direction: '-90', used: 'unused', team: 'teamOrange'};
        this.boardArray[boardCenter+1][col-2].pieces = {populatedSquare: true, type: 'cargo', direction: '-90', used: 'unused', team: 'teamOrange'};
        this.boardArray[1][boardCenter-1].pieces = {populatedSquare: true, type: 'cargo', direction: '180', used: 'unused', team: 'teamLemon'};
        this.boardArray[1][boardCenter+1].pieces = {populatedSquare: true, type: 'cargo', direction: '180', used: 'unused', team: 'teamLemon'};
        this.boardArray[row-2][boardCenter-1].pieces = {populatedSquare: true, type: 'cargo', direction: '0', used: 'unused', team: 'teamLime'};
        this.boardArray[row-2][boardCenter+1].pieces = {populatedSquare: true, type: 'cargo', direction: '0', used: 'unused', team: 'teamLime'};
        this.boardArray[boardCenter-1][1].pieces = {populatedSquare: true, type: 'cargo', direction: '90', used: 'unused', team: 'teamPlum'};
        this.boardArray[boardCenter+1][1].pieces = {populatedSquare: true, type: 'cargo', direction: '90', used: 'unused', team: 'teamPlum'};

        // Creation of pirate ships
        this.boardArray[row-6][5].pieces = {populatedSquare: true, type: 'cargo', direction: '45', used: 'unused', team: 'teamPirate'};
        this.boardArray[5][5].pieces = {populatedSquare: true, type: 'cargo', direction: '135', used: 'unused', team: 'teamPirate'};
        this.boardArray[row-6][col-6].pieces = {populatedSquare: true, type: 'cargo', direction: '-45', used: 'unused', team: 'teamPirate'};
        this.boardArray[5][col-6].pieces = {populatedSquare: true, type: 'cargo', direction: '-135', used: 'unused', team: 'teamPirate'};

        this.boardArray[row-4][boardCenter].pieces = {populatedSquare: true, type: 'cargo', direction: '135', used: 'unused', team: 'teamPirate'};

        // Creation of forests
        this.boardArray[boardCenter+1][col-1].pieces = {populatedSquare: true, type: 'forest', direction: '0', used: 'unused', team: 'teamOrange'};
        this.boardArray[0][boardCenter+1].pieces = {populatedSquare: true, type: 'forest', direction: '0', used: 'unused', team: 'teamLemon'};
        this.boardArray[row-1][boardCenter-1].pieces = {populatedSquare: true, type: 'forest', direction: '0', used: 'unused', team: 'teamLime'};
        this.boardArray[boardCenter-1][0].pieces = {populatedSquare: true, type: 'forest', direction: '0', used: 'unused', team: 'teamPlum'};

        // Creation of ironworks
        this.boardArray[boardCenter-1][col-1].pieces = {populatedSquare: true, type: 'ironworks', direction: '0', used: 'unused', team: 'teamOrange'};
        this.boardArray[0][boardCenter-1].pieces = {populatedSquare: true, type: 'ironworks', direction: '0', used: 'unused', team: 'teamLemon'};
        this.boardArray[row-1][boardCenter+1].pieces = {populatedSquare: true, type: 'ironworks', direction: '0', used: 'unused', team: 'teamLime'};
        this.boardArray[boardCenter+1][0].pieces = {populatedSquare: true, type: 'ironworks', direction: '0', used: 'unused', team: 'teamPlum'};

        // Creation of quarry
        this.boardArray[row-6][boardCenter-1].pieces = {populatedSquare: true, type: 'quarry', direction: '0', used: 'unused', team: ''};

        // Test overlay
        /*
        this.boardArray[0][0].terrain = 'sea';
        this.boardArray[0][0].pieces = {populatedSquare: true, type: 'cargo', direction: '0', used: 'unused', team: 'teamLime'};

        this.boardArray[0][1].terrain = 'sea';
        this.boardArray[0][1].pieces = {populatedSquare: true, type: 'cargo', direction: '0', used: 'unused', team: 'teamLime'};

        this.boardArray[1][0].terrain = 'sea';
        this.boardArray[1][0].pieces = {populatedSquare: true, type: 'cargo', direction: '0', used: 'unused', team: 'teamLime'};*/
    },

    // Method to create triangle shaped overlay
    // ----------------------------------------
    // allows specification of size, position and terrain of tiles
    // TR = top right, BL = bottom left (for right angled corner)
    overlayTilesTri: function(startRow, startCol, size, corner, overlayTerrain) {
        for (i = startRow; i < startRow + size; i+=1) {
            if (corner == "TL") {
                for (j = startCol; j < startCol + size - (i - startRow); j+=1) {
                    this.boardArray[i][j].terrain = overlayTerrain;
                  }
            } else if (corner == "BL") {
                for (j = startCol; j < startCol + (i - startRow) + 1; j+=1) {
                    this.boardArray[i][j].terrain = overlayTerrain;
                }
            } else if (corner == 'TR') {
                for (j = startCol + (i - startRow); j < startCol + size; j+=1) {
                    this.boardArray[i][j].terrain = overlayTerrain;
                }
            } else if (corner == 'BR') {
                for (j = startCol + size - (i - startRow) -1; j < startCol + size; j+=1) {
                    this.boardArray[i][j].terrain = overlayTerrain;
                  }
            } else {
                console.log('overlayTilesTri - triangle type not found');
            }
        }
    },

    // Method to create rectangular shaped overlay
    // -------------------------------------------
    // allows specification of size, position and terrain of tiles
    overlayTiles: function(startRow, endRow, startCol, endCol, overlayTerrain) {
        for (i = startRow; i < endRow; i++) {
            for (j = startCol; j < endCol; j++) {
                this.boardArray[i][j].terrain = overlayTerrain;
            }
        }
    },

    // Method to create a single tile
    // ------------------------------
    // gridSize is the size of the tile, squareType is the land / sea / base of the tile
    createTile: function(i, j, gridSize) {
        // Creating the tile from three nested divs
        let newTile = document.createElement('div');
        let innerTile = document.createElement('div');
        let rotatedTile = document.createElement('div');

        // Adding an id for each tile - DECIDE IF NECESSARY IN NEXT STAGE
        newTile.id = i*1000 + j;

        // Creating the tile by dynamically allocating CSS classes
        // Tile size is set as a parameter but has functionality to be varied dynamically
        // (e.g. to zoom in or out of board map)
        newTile.setAttribute('class', 'square' + ' ' + this.boardArray[i][j].terrain + ' ' + this.boardArray[i][j].activeStatus);
        newTile.style.height = (gridSize - 2) + 'px';
        newTile.style.width = (gridSize - 2) + 'px';

        rotatedTile.setAttribute('class', 'rotated_square' + ' ' + this.boardArray[i][j].terrain + ' ' + this.boardArray[i][j].activeStatus);
        rotatedTile.style.height = (gridSize - 6) + 'px';
        rotatedTile.style.width = (gridSize - 6) + 'px';

        innerTile.setAttribute('class', 'inner_square' + ' ' + this.boardArray[i][j].terrain + ' ' + this.boardArray[i][j].activeStatus);
        innerTile.style.height = (gridSize - 6) + 'px';
        innerTile.style.width = (gridSize - 6) + 'px';

        newTile.appendChild(rotatedTile);
        rotatedTile.appendChild(innerTile);

        // tile is returned to drawBoard
        return newTile;

    },

    // Method to create a single action tile
    // -------------------------------------
    // tileSize is the size of the tile
    createActionTile: function(locali, localj, gridSize, tileBorder, boardSurround) {

        // Create SVG tile of designated height and width
        let actionTile = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        actionTile.setAttribute('width', gridSize + tileBorder);
        actionTile.setAttribute('height', gridSize + tileBorder);

        // Position tile based on coordinates passed from boardArray
        actionTile.style.top = boardSurround + tileBorder/2 + (gridSize + tileBorder * 2) * locali + 'px';
        actionTile.style.left = boardSurround + tileBorder/2 + (gridSize + tileBorder * 2) * localj + 'px';
        actionTile.style.transform = 'rotate(' + this.boardArray[locali][localj].pieces.direction + 'deg)';

        // Set view size, class and id
        actionTile.setAttribute('viewBox', '0, 0, 25, 25');
        actionTile.setAttribute('class', 'cargo');
        actionTile.setAttribute('id', 'tile' + Number(locali*1000 + localj));

        // Cargo ship deck SVG design
        let cargoDeck = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        cargoDeck.setAttribute('class', this.boardArray[locali][localj].pieces.team + ' team_fill team_stroke');
        cargoDeck.setAttribute('d', 'M 12.5 1 C 8 6.2 7 11.1 7.3 15.6 Q 7.7 20.2 9.25 24 L 15.75 24 Q 17 20.2 17.5 15.6 C 17.8 11.1 16.6 6.2 12.5 1 Z');
        cargoDeck.style.strokeWidth = '1px';

        // Cargo ship sail SVG design
        let cargoSail = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        cargoSail.setAttribute('d', 'M 2 16 L 22 16 C 20.5 13.5 16.5 12 12 12 C 7.5 12 3.5 13.5 2 16 Z');
        cargoSail.setAttribute('class', this.boardArray[locali][localj].pieces.team + ' team_stroke');
        cargoSail.setAttribute('fill', 'white');
        cargoSail.style.strokeWidth = '1px';

        // Building the tile
        actionTile.appendChild(cargoDeck);
        actionTile.appendChild(cargoSail);

        // tile is returned to drawBoard
        return actionTile;
    },

    // Method allows "non-specific" action tile to be created without reference to the boardArray
    // ------------------------------------------------------------------------------------------
    // gridSize is the size of the tile, squareType is the ship type of the tile

    buildActionTile: function(localType, localDirection, localTeam, tileSize) {
        // Creating the action tile shape
        let newActionTile = document.createElement('div');
        let holdingActionTile = document.createElement('div');
        let innerActionTile = document.createElement('div');
        let detailActionTile = document.createElement('div');

        // Creating the tile by dynamically allocating CSS classes
        newActionTile.setAttribute('class', 'square' + ' ' + localType);
        newActionTile.style.height = (tileSize - 2) + 'px';
        newActionTile.style.width = (tileSize - 2) + 'px';

        holdingActionTile.setAttribute('class', 'holding' + ' ' + localType);
        holdingActionTile.style.height = (tileSize - 2) + 'px';
        holdingActionTile.style.width = (tileSize - 2) + 'px';
        holdingActionTile.style.transform = 'rotate(' + localDirection + 'deg)';

        innerActionTile.setAttribute('class', 'piece' + ' ' + localType + ' ' + localTeam + ' team_colours');
        innerActionTile.style.height = (tileSize - 6) + 'px';
        innerActionTile.style.width = (tileSize - 6) + 'px';

        detailActionTile.setAttribute('class', 'detail' + ' ' + localType + ' ' + localTeam);
        detailActionTile.style.height = (tileSize - 6) + 'px';
        detailActionTile.style.width = (tileSize - 6) + 'px';

        newActionTile.appendChild(holdingActionTile);
        holdingActionTile.appendChild(innerActionTile);
        innerActionTile.appendChild(detailActionTile);

        // tile is returned to drawBoard
        return newActionTile;
    },

    // New method to create the board display based on the boardArray using canvas
    // ----------------------------------------------------------------------------
    // gridSize is the size of the tile, row and col depict the number of tiles on the board
    drawBoard: function(row, col, gridSize) {
        // Loop through board array to draw tiles
        let octagonArray = [ {type: 'visible', gap: 0, width: 1, colour: 'rgb(235, 215, 195)'}, {type: 'land', gap: 6, width: 6, colour: 'rgb(213, 191, 163)'}, {type: 'land', gap: 4, width: 1.5, colour: 'rgb(138, 87, 50)'} ]

        for (var h = 0; h < octagonArray.length; h++) {
            this.drawTiles (octagonArray[h].type, canvasBoard, octagonArray[h].gap, octagonArray[h].width, octagonArray[h].colour)
        }
    },

    // New method to create the board pieces based on the boardArray using SVG
    // ----------------------------------------------------------------------------
    drawPieces: function() {
        // Loops for pieces
        for (var i = 0; i < row; i++) {
            Ycenter = (gridSize + tileBorder * 2) * i + (gridSize/2 + boardSurround + tileBorder);

            for (var j = 0; j < col; j++) {
                Xcenter = (gridSize + tileBorder * 2) * j + (gridSize/2 + boardSurround + tileBorder);

                // Currently just cargo ships - other tiles to be update to svg
                if ((this.boardArray[i][j].pieces.populatedSquare == true) && (this.boardArray[i][j].pieces.type == 'cargo')){
                    // Create action tile svg and add to the board
                    boardMarkNode.appendChild(this.createActionTile(i, j, gridSize, tileBorder, boardSurround));
                }
            }
        }
    },

    // Method for looping through tiles and drawing
    // --------------------------------------------

    drawTiles: function(octagonType, boardLayer, ocatagonGap, octagonWidth, octagonColour) {
        // Start path for each array of octagons
        boardLayer.beginPath();
        for (var i = 0; i < row; i++) {
            Ycenter = (gridSize + tileBorder * 2) * i + (gridSize/2 + boardSurround + tileBorder);

            for (var j = 0; j < col; j++) {
                Xcenter = (gridSize + tileBorder * 2) * j + (gridSize/2 + boardSurround + tileBorder);

                if (octagonType=='visible' && this.boardArray[i][j].terrain != 'invis') {
                    // Tiles - 'invis' gives shape to octagonal board
                    this.drawOctagon(boardLayer, ocatagonGap);
                } else if (octagonType=='active' && this.boardArray[i][j].activeStatus == 'active') {
                    // Activation of tiles - will be moved to a separate canvas overlay in future
                    this.drawOctagon(boardLayer, ocatagonGap);
                } else if (octagonType=='land' && this.boardArray[i][j].terrain == 'land') {
                    // Islands
                    this.drawOctagon(boardLayer, ocatagonGap);
                }
            }
        }
        // Draw path for each array of octagons
        boardLayer.lineWidth = octagonWidth;
        boardLayer.strokeStyle = octagonColour;
        boardLayer.stroke();
    },

    // Method to set up canvas overlay layer for piece activation
    // ----------------------------------------------------------

    drawActiveTiles: function () {
        // Clears the canvas for redraw
        canvasActive.clearRect(0, 0, canvasActive.canvas.width, canvasActive.canvas.height);

        // drawTiles is used to colour tiles on active layer
        gameBoard.drawTiles ('active', canvasActive, 0, 1, 'rgb(255, 153, 153)');

    },

    // Method to draw octagons for creation of board
    // ---------------------------------------------
    drawOctagon: function(canvasBoard, ocatagonGap) {
        let octagonAngle = (2 * Math.PI) / 8;
        // Moves to start of octagon
        canvasBoard.moveTo (Xcenter + (gridSize/2 + ocatagonGap) * Math.cos(0.5 * octagonAngle), Ycenter + (gridSize/2 + ocatagonGap) *  Math.sin(0.5 * octagonAngle));
        // Draws eight sides
        for (var k = 1; k <= 8; k++) {
            canvasBoard.lineTo (Xcenter + (gridSize/2 + ocatagonGap) * Math.cos((k+0.5) * octagonAngle), Ycenter + (gridSize/2 + ocatagonGap) * Math.sin((k+0.5) * octagonAngle));
        }
    },

// LAST BRACKET OF OBJECT
}
