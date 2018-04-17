
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
                    rowArray.push({xpos: + x, ypos: + y, terrain: 'land', activeStatus: 'inactive', pieces: {populatedSquare: false, category: '', type: 'no piece', direction: '', used: 'unused', team: ''}});
                // But mainly sea tiles
                } else {
                    rowArray.push({xpos: + x, ypos: + y, terrain: 'sea', activeStatus: 'inactive', pieces: {populatedSquare: false, category: '', type: 'no piece', direction: '', used: 'unused', team: ''}});
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
        this.boardArray[boardCenter][col-1].pieces = {populatedSquare: true, category: 'Settlements', type: 'fort', direction: '270', used: 'unused', team: 'teamOrange'};
        this.boardArray[0][boardCenter].pieces = {populatedSquare: true, category: 'Settlements', type: 'fort', direction: '180', used: 'unused', team: 'teamLemon'};
        this.boardArray[row-1][boardCenter].pieces = {populatedSquare: true, category: 'Settlements', type: 'fort', direction: '0', used: 'unused', team: 'teamLime'};
        this.boardArray[boardCenter][0].pieces = {populatedSquare: true, category: 'Settlements', type: 'fort', direction: '90', used: 'unused', team: 'teamPlum'};
        this.boardArray[boardCenter][boardCenter].pieces = {populatedSquare: true, category: 'Settlements', type: 'fort', direction: '0', used: 'unused', team: 'teamKingdom'};

        // Creation of Kingdom huts
        /*this.boardArray[row-9][8].pieces = {populatedSquare: true, category: 'Settlements', type: 'hut', direction: '45', used: 'unused', team: 'teamKingdom'};
        this.boardArray[8][8].pieces = {populatedSquare: true, category: 'Settlements', type: 'hut', direction: '45', used: 'unused', team: 'teamKingdom'};
        this.boardArray[8][col-9].pieces = {populatedSquare: true, category: 'Settlements', type: 'hut', direction: '45', used: 'unused', team: 'teamKingdom'};
        this.boardArray[row-9][col-9].pieces = {populatedSquare: true, category: 'Settlements', type: 'hut', direction: '45', used: 'unused', team: 'teamKingdom'};*/

        // Creation of ships
        this.boardArray[boardCenter-1][col-2].pieces = {populatedSquare: true, category: 'Transport', type: 'cargo', direction: '-90', used: 'unused', team: 'teamOrange'};
        this.boardArray[boardCenter+1][col-2].pieces = {populatedSquare: true, category: 'Transport', type: 'cargo', direction: '-90', used: 'unused', team: 'teamOrange'};
        this.boardArray[1][boardCenter-1].pieces = {populatedSquare: true, category: 'Transport', type: 'cargo', direction: '180', used: 'unused', team: 'teamLemon'};
        this.boardArray[1][boardCenter+1].pieces = {populatedSquare: true, category: 'Transport', type: 'cargo', direction: '180', used: 'unused', team: 'teamLemon'};
        this.boardArray[row-2][boardCenter-1].pieces = {populatedSquare: true, category: 'Transport', type: 'cargo', direction: '0', used: 'unused', team: 'teamLime'};
        this.boardArray[row-2][boardCenter+1].pieces = {populatedSquare: true, category: 'Transport', type: 'cargo', direction: '0', used: 'unused', team: 'teamLime'};
        this.boardArray[boardCenter-1][1].pieces = {populatedSquare: true, category: 'Transport', type: 'cargo', direction: '90', used: 'unused', team: 'teamPlum'};
        this.boardArray[boardCenter+1][1].pieces = {populatedSquare: true, category: 'Transport', type: 'cargo', direction: '90', used: 'unused', team: 'teamPlum'};

        // Creation of pirate ships
        this.boardArray[row-6][5].pieces = {populatedSquare: true, category: 'Transport', type: 'cargo', direction: '45', used: 'unused', team: 'teamPirate'};
        this.boardArray[5][5].pieces = {populatedSquare: true, category: 'Transport', type: 'cargo', direction: '135', used: 'unused', team: 'teamPirate'};
        this.boardArray[row-6][col-6].pieces = {populatedSquare: true, category: 'Transport', type: 'cargo', direction: '-45', used: 'unused', team: 'teamPirate'};
        this.boardArray[5][col-6].pieces = {populatedSquare: true, category: 'Transport', type: 'cargo', direction: '-135', used: 'unused', team: 'teamPirate'};

        // Creation of forests
        this.boardArray[boardCenter-1][boardCenter].pieces = {populatedSquare: true, category: 'Resources', type: 'forest', direction: '0', used: 'unused', team: 'teamKingdom'};

        // Creation of ironworks
        this.boardArray[boardCenter+1][boardCenter].pieces = {populatedSquare: true, category: 'Resources', type: 'ironworks', direction: '0', used: 'unused', team: 'teamKingdom'};

        // Creation of quarry
        this.boardArray[boardCenter][boardCenter-1].pieces = {populatedSquare: true, category: 'Resources', type: 'quarry', direction: '0', used: 'unused', team: 'teamKingdom'};



        // Test overlay
        /*
        this.boardArray[0][0].terrain = 'sea';
        this.boardArray[0][0].pieces = {populatedSquare: true, category: 'Transport', type: 'cargo', direction: '0', used: 'unused', team: 'teamLime'};

        this.boardArray[0][1].terrain = 'sea';
        this.boardArray[0][1].pieces = {populatedSquare: true, category: 'Transport', type: 'cargo', direction: '0', used: 'unused', team: 'teamLime'};

        this.boardArray[1][0].terrain = 'sea';
        this.boardArray[1][0].pieces = {populatedSquare: true, category: 'Transport', type: 'cargo', direction: '0', used: 'unused', team: 'teamLime'};*/
    },

    // Method to allocate start tiles to teams
    // ---------------------------------------
    // Order needs to be (1) creation of board (2) Counting of empty tiles and creation of resource deck (3) Allocation of tiles from resource deck to team bases
    allocateStartTiles: function() {
        let boardCenter = Math.round((row-1)/2);
        gameBoard.boardArray[boardCenter+1][col-1].pieces = {populatedSquare: true, category: 'Resources', type: resourceManagement.pickFromResourceDeck(), direction: '0', used: 'unused', team: 'teamOrange'};
        gameBoard.boardArray[0][boardCenter+1].pieces = {populatedSquare: true, category: 'Resources', type: resourceManagement.pickFromResourceDeck(), direction: '0', used: 'unused', team: 'teamLemon'};
        gameBoard.boardArray[row-1][boardCenter-1].pieces = {populatedSquare: true, category: 'Resources', type: resourceManagement.pickFromResourceDeck(), direction: '0', used: 'unused', team: 'teamLime'};
        gameBoard.boardArray[boardCenter-1][0].pieces = {populatedSquare: true, category: 'Resources', type: resourceManagement.pickFromResourceDeck(), direction: '0', used: 'unused', team: 'teamPlum'};
        gameBoard.boardArray[boardCenter-1][col-1].pieces = {populatedSquare: true, category: 'Resources', type: resourceManagement.pickFromResourceDeck(), direction: '0', used: 'unused', team: 'teamOrange'};
        gameBoard.boardArray[0][boardCenter-1].pieces = {populatedSquare: true, category: 'Resources', type: resourceManagement.pickFromResourceDeck(), direction: '0', used: 'unused', team: 'teamLemon'};
        gameBoard.boardArray[row-1][boardCenter+1].pieces = {populatedSquare: true, category: 'Resources', type: resourceManagement.pickFromResourceDeck(), direction: '0', used: 'unused', team: 'teamLime'};
        gameBoard.boardArray[boardCenter+1][0].pieces = {populatedSquare: true, category: 'Resources', type: resourceManagement.pickFromResourceDeck(), direction: '0', used: 'unused', team: 'teamPlum'};
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
        actionTile.setAttribute('id', 'tile' + Number(locali*1000 + localj));

        if (this.boardArray[locali][localj].pieces.type == 'cargo') {
            actionTile.setAttribute('class', 'cargo');
            this.createCargoTile(actionTile, locali, localj);
        } else if (this.boardArray[locali][localj].pieces.type == 'fort') {
            actionTile.setAttribute('class', 'fort');
            this.createFortTile(actionTile, locali, localj);
        } else if (this.boardArray[locali][localj].pieces.type == 'forest') {
            actionTile.setAttribute('class', 'forest');
            this.createForestTile(actionTile, locali, localj);
        } else if (this.boardArray[locali][localj].pieces.type == 'ironworks') {
            actionTile.setAttribute('class', 'ironworks');
            this.createIronworksTile(actionTile, locali, localj);
        } else if (this.boardArray[locali][localj].pieces.type == 'quarry') {
            actionTile.setAttribute('class', 'quarry');
            this.createQuarryTile(actionTile, locali, localj);
        } else if (this.boardArray[locali][localj].pieces.type == 'desert') {
            actionTile.setAttribute('class', 'desert');
            this.createDesertTile(actionTile, locali, localj);
        }

        // tile is returned to drawBoard
        return actionTile;
    },

    // Method to create cargo tile
    // ---------------------------
    createCargoTile: function(actionTile, locali, localj) {
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

        return actionTile;
    },

    // Method to create fort tile
    // ---------------------------
    createFortTile: function(actionTile, locali, localj) {
        // Fort turret design
        let fortTurret1 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        fortTurret1.setAttribute('class', this.boardArray[locali][localj].pieces.team + ' team_stroke');
        fortTurret1.setAttribute('cx', '7');
        fortTurret1.setAttribute('cy', '7');
        fortTurret1.setAttribute('r', '2.5');
        fortTurret1.style.strokeWidth = '1px';
        fortTurret1.style.strokeLinecap = 'round';

        let fortTurret2 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        fortTurret2.setAttribute('class', this.boardArray[locali][localj].pieces.team + ' team_stroke');
        fortTurret2.setAttribute('cx', '7');
        fortTurret2.setAttribute('cy', '18');
        fortTurret2.setAttribute('r', '2.5');
        fortTurret2.style.strokeWidth = '1px';
        fortTurret2.style.strokeLinecap = 'round';

        let fortTurret3 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        fortTurret3.setAttribute('class', this.boardArray[locali][localj].pieces.team + ' team_stroke');
        fortTurret3.setAttribute('cx', '18');
        fortTurret3.setAttribute('cy', '7');
        fortTurret3.setAttribute('r', '2.5');
        fortTurret3.style.strokeWidth = '1px';
        fortTurret3.style.strokeLinecap = 'round';

        let fortTurret4 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        fortTurret4.setAttribute('class', this.boardArray[locali][localj].pieces.team + ' team_stroke');
        fortTurret4.setAttribute('cx', '18');
        fortTurret4.setAttribute('cy', '18');
        fortTurret4.setAttribute('r', '2.5');
        fortTurret4.style.strokeWidth = '1px';
        fortTurret4.style.strokeLinecap = 'round';

        // Fort wall rectangle design
        let fortWall = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        fortWall.setAttribute('x', '6');
        fortWall.setAttribute('y', '6');
        fortWall.setAttribute('width', '13');
        fortWall.setAttribute('height', '13');
        fortWall.setAttribute('rx', '1');
        fortWall.setAttribute('ry', '1');
        fortWall.style.strokeWidth = '1px';
        fortWall.setAttribute('class', this.boardArray[locali][localj].pieces.team + ' team_fill team_stroke');

        // Fort cannon design
        let fortCannon = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        fortCannon.setAttribute('d', 'M 15 12.5 Q 12.5 16 10 12.5 L 11.5 2 L 13.5 2 L 15 12.5');
        fortCannon.setAttribute('class', this.boardArray[locali][localj].pieces.team + ' team_stroke');
        fortCannon.style.strokeLinejoin = 'round';
        fortCannon.style.strokeLinecap = 'round';
        fortCannon.style.strokeWidth = '1px';

        // Building the tile
        actionTile.appendChild(fortWall);
        actionTile.appendChild(fortTurret1);
        actionTile.appendChild(fortTurret2);
        actionTile.appendChild(fortTurret3);
        actionTile.appendChild(fortTurret4);
        actionTile.appendChild(fortCannon);

        return actionTile;
    },


    // Method to create forest tile
    // ---------------------------
    createForestTile: function(actionTile, locali, localj) {

        // Canopy circle design
        let treeCanopy1 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        treeCanopy1.setAttribute('class', this.boardArray[locali][localj].pieces.team + ' team_fill team_stroke');
        treeCanopy1.setAttribute('cx', '15');
        treeCanopy1.setAttribute('cy', '9');
        treeCanopy1.setAttribute('r', '5.5');
        treeCanopy1.style.strokeWidth = '1px';
        treeCanopy1.style.strokeLinecap = 'round';

        let treeCanopy2 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        treeCanopy2.setAttribute('class', this.boardArray[locali][localj].pieces.team + ' team_stroke');
        treeCanopy2.setAttribute('cx', '8');
        treeCanopy2.setAttribute('cy', '10.5');
        treeCanopy2.setAttribute('r', '4.5');
        treeCanopy2.setAttribute('fill', 'rgb(213, 191, 163)');
        treeCanopy2.style.strokeWidth = '1px';
        treeCanopy2.style.strokeLinecap = 'round';

        // Trunk rectangle design
        let treeTrunk1 = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        treeTrunk1.setAttribute('class', this.boardArray[locali][localj].pieces.team + ' team_stroke');
        treeTrunk1.setAttribute('x', '14.5');
        treeTrunk1.setAttribute('y', '15');
        treeTrunk1.setAttribute('width', '1.5');
        treeTrunk1.setAttribute('height', '5');
        treeTrunk1.setAttribute('fill', 'rgb(89, 53, 20)');
        treeTrunk1.style.strokeWidth = '1px';

        let treeTrunk2 = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        treeTrunk2.setAttribute('class', this.boardArray[locali][localj].pieces.team + ' team_stroke');
        treeTrunk2.setAttribute('x', '7.5');
        treeTrunk2.setAttribute('y', '15');
        treeTrunk2.setAttribute('width', '1');
        treeTrunk2.setAttribute('height', '5');
        treeTrunk2.setAttribute('fill', 'rgb(89, 53, 20)');
        treeTrunk2.style.strokeWidth = '1px';

        // Building the tile
        actionTile.appendChild(treeTrunk1);
        actionTile.appendChild(treeTrunk2);
        actionTile.appendChild(treeCanopy1);
        actionTile.appendChild(treeCanopy2);
        return actionTile;
    },

    // Method to create ironworks tile
    // ---------------------------
    createIronworksTile: function(actionTile, locali, localj) {

        // Mountain background design
        let mountainBackground = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        mountainBackground.setAttribute('d', 'M 21.5 18 L 12.5 2.5 L 3.5 18');
        mountainBackground.setAttribute('class', this.boardArray[locali][localj].pieces.team + ' team_fill team_stroke');
        mountainBackground.style.strokeLinejoin = 'round';
        mountainBackground.style.strokeLinecap = 'round';
        mountainBackground.style.strokeWidth = '1px';

        // Mountain snow design
        let mountainSnow = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        mountainSnow.setAttribute('d', 'M 9.3 8 A 5 5 0 0 0 15.7 8 L 12.5 2.5 Z');
        mountainSnow.setAttribute('class', this.boardArray[locali][localj].pieces.team + ' team_stroke');
        mountainSnow.style.strokeLinejoin = 'round';
        mountainSnow.style.strokeLinecap = 'round';
        mountainSnow.setAttribute('fill', 'white');
        mountainSnow.style.strokeWidth = '1px';

        // Iron square design
        let ironSquare = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        ironSquare.setAttribute('class', this.boardArray[locali][localj].pieces.team + ' team_stroke');
        ironSquare.setAttribute('x', '9');
        ironSquare.setAttribute('y', '14');
        ironSquare.setAttribute('width', '7');
        ironSquare.setAttribute('height', '7');
        ironSquare.setAttribute('fill', 'silver');
        ironSquare.style.strokeWidth = '1px';
        ironSquare.setAttribute('rx', '1');
        ironSquare.setAttribute('ry', '1');
        ironSquare.style.strokeLinecap = 'round';

        // Building the tile
        actionTile.appendChild(mountainBackground);
        actionTile.appendChild(mountainSnow);
        actionTile.appendChild(ironSquare);
        return actionTile;
    },

    // Method to create desert tile
    // ---------------------------
    createDesertTile: function(actionTile, locali, localj) {
        // rear dune
        let rearSandDune = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        rearSandDune.setAttribute('class', this.boardArray[locali][localj].pieces.team);
        rearSandDune.setAttribute('d', 'M 2 13 C 3 9 6 7 9 6 L 16 13');
        rearSandDune.style.strokeWidth = '1px';
        rearSandDune.setAttribute('stroke','rgb(138, 87, 50)');
        rearSandDune.setAttribute('fill', 'rgb(235, 215, 195)');

        // front dune
        let frontSandDune = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        frontSandDune.setAttribute('d', 'M 9 18 C 10 14 13 12 16 11 L 23 18');
        frontSandDune.setAttribute('class', this.boardArray[locali][localj].pieces.team);
        frontSandDune.setAttribute('stroke','rgb(138, 87, 50)');
        frontSandDune.setAttribute('fill', 'rgb(235, 215, 195)');

        // Building the tile
        actionTile.appendChild(rearSandDune);
        actionTile.appendChild(frontSandDune);

        return actionTile;
    },


    // Method to create quarry tile
    // ---------------------------
    createQuarryTile: function(actionTile, locali, localj) {
        // Pick handle rectangle
        let pickHandle = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        pickHandle.setAttribute('class', this.boardArray[locali][localj].pieces.team + ' team_fill team_stroke');
        pickHandle.setAttribute('d', 'M 7.5 5.7 Q 7.4 4 9.2 4 L 21.2 16 L 19.5 17.7 L 8.2 6.7 Z');
        pickHandle.style.strokeLinejoin = 'round';
        pickHandle.style.strokeWidth = '1px';

        // Pick metal left
        let pickLeft = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        pickLeft.setAttribute('d', 'M 8.2 7.8 Q 5.4 10.1 5.5 14.5 Q 6.8 10.9 9.5 9.1 Z');
        pickLeft.setAttribute('class', this.boardArray[locali][localj].pieces.team + ' team_stroke');
        pickLeft.setAttribute('fill', 'silver');
        pickLeft.style.strokeLinejoin = 'round';
        pickLeft.style.strokeWidth = '1px';

        // Pick metal right
        let pickRight = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        pickRight.setAttribute('d', 'M 11.3 4.7 Q 13.6 1.9 18 2 Q 14.4 3.3 12.6 6 Z');
        pickRight.setAttribute('class', this.boardArray[locali][localj].pieces.team + ' team_stroke');
        pickRight.setAttribute('fill', 'silver');
        pickRight.style.strokeLinejoin = 'round';
        pickRight.style.strokeWidth = '1px';

        // Pick square
        let pickSquare = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        pickSquare.setAttribute('d', 'M 7.5 7 L 10.3 4.2 L 13.1 7 L 10.3 9.8 Z');
        pickSquare.setAttribute('class', this.boardArray[locali][localj].pieces.team + ' team_stroke');
        pickSquare.setAttribute('fill', 'silver');
        pickSquare.style.strokeLinejoin = 'round';
        pickSquare.style.strokeWidth = '1px';

        // Stone square in quarry
        let stoneSquare = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        stoneSquare.setAttribute('class', this.boardArray[locali][localj].pieces.team + ' team_stroke');
        stoneSquare.setAttribute('x', '5.5');
        stoneSquare.setAttribute('y', '15.5');
        stoneSquare.setAttribute('width', '6');
        stoneSquare.setAttribute('height', '6');
        stoneSquare.setAttribute('rx', '1');
        stoneSquare.setAttribute('ry', '1');
        stoneSquare.setAttribute('fill', 'white');
        stoneSquare.style.strokeWidth = '1px';

        // Building the tile
        actionTile.appendChild(pickHandle);
        actionTile.appendChild(pickLeft);
        actionTile.appendChild(pickRight);
        actionTile.appendChild(pickSquare);
        actionTile.appendChild(stoneSquare);

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
          let octagonArray = [  {type: 'visible', gap: 0, width: 1, colour: 'rgb(235, 215, 195)', background: 'rgb(246, 232, 206)'},
                                {type: 'land', gap: 6, width: 6, colour: 'rgb(213, 191, 163)', background: 'rgb(246, 232, 206)'},
                                {type: 'land', gap: 4, width: 1.5, colour: 'rgb(138, 87, 50)', background: 'transparent'} ]

        for (var h = 0; h < octagonArray.length; h++) {
            this.drawTiles (octagonArray[h].type, canvasBoard, octagonArray[h].gap, octagonArray[h].width, octagonArray[h].colour, octagonArray[h].background)
        }
        this.drawCompass();
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
                if (this.boardArray[i][j].pieces.populatedSquare == true) {
                    // Create action tile svg and add to the board
                    boardMarkNode.appendChild(this.createActionTile(i, j, gridSize, tileBorder, boardSurround));
                }
            }
        }
    },

    // Method for looping through tiles and drawing
    // --------------------------------------------

    drawTiles: function(octagonType, boardLayer, ocatagonGap, octagonWidth, octagonColour, octagonBackground) {
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
        boardLayer.lineCap='round';
        boardLayer.strokeStyle = octagonColour;
        boardLayer.fillStyle = octagonBackground;
        boardLayer.stroke();
        boardLayer.fill();

    },

    // Method to set up canvas overlay layer for piece activation
    // ----------------------------------------------------------

    drawActiveTiles: function () {
        // Clears the canvas for redraw
        canvasActive.clearRect(0, 0, canvasActive.canvas.width, canvasActive.canvas.height);

        // drawTiles is used to colour tiles on active layer
        gameBoard.drawTiles ('active', canvasActive, 0, 1, 'rgb(255, 153, 153)', 'transparent');

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

    // Method to draw compass and game logo on lowest layer of board
    // -------------------------------------------------------------
    drawCompass: function() {

        let compassSize = (gridSize + tileBorder * 2) * 2;
        let logoSize = (gridSize + tileBorder * 2) * 2;
        let Xsize = (col * (gridSize + tileBorder * 2) + boardSurround * 2);
        let Ysize = (row * (gridSize + tileBorder * 2) + boardSurround * 2);
        let Xcenter = (gridSize + tileBorder * 2) * (col - 3) + (gridSize/2 + boardSurround + tileBorder);
        let Ycenter = (gridSize + tileBorder * 2) * (row - 3) + (gridSize/2 + boardSurround + tileBorder);

        // Create SVG layer of same height and width as board
        let compassLayer = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        compassLayer.setAttribute('width', col * (gridSize + tileBorder * 2) + boardSurround * 2);
        compassLayer.setAttribute('height', row * (gridSize + tileBorder * 2) + boardSurround * 2);
        compassLayer.setAttribute('viewBox', '0, 0, ' + (col * (gridSize + tileBorder * 2) + boardSurround * 2) +  ', ' + (row * (gridSize + tileBorder * 2) + boardSurround * 2));
        compassLayer.setAttribute('class', 'compass');

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
        compassInner.setAttribute('r', compassSize - tileBorder*2);
        compassInner.style.strokeWidth = '1px';
        compassInner.setAttribute('stroke', 'rgb(235, 215, 195)');
        compassInner.setAttribute('fill', 'rgb(246, 232, 206)');
        compassInner.style.strokeLinecap = 'round';

        // Compass reading lines that stretch across board
        let compassLines = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        compassLines.setAttribute('d', 'M ' + (Xsize - boardSurround) + ' ' + (Ysize - boardSurround) + 'L ' + (boardSurround+logoSize*2) + ' ' + (boardSurround+logoSize*2) + 'M ' + (Xsize - boardSurround) + ' ' + Ycenter + 'L ' + boardSurround + ' ' + Ycenter
                                        + 'M ' + Xcenter + ' ' + (Ysize - boardSurround) + 'L ' + Xcenter + ' ' + boardSurround + 'M ' + (2 * Xcenter + boardSurround - Xsize) + ' ' + (Ysize - boardSurround) + 'L ' + (Xsize - boardSurround) + ' ' + (2 * Ycenter + boardSurround - Ysize) );
        compassLines.style.strokeWidth = '1px';
        compassLines.setAttribute('stroke', 'rgb(235, 215, 195)');
        compassLines.setAttribute('opacity', '1');
        compassLines.setAttribute('fill', 'none');
        compassLines.style.strokeLinecap = 'round';

        // Coloured compass points
        let compassPointsFill = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        compassPointsFill.setAttribute('d', 'M ' + Xcenter + ' ' + Ycenter  + ' L ' + (Xcenter) + ' ' + (Ycenter - compassSize) + ' L ' + (Xcenter + gridSize/2) + ' ' + (Ycenter - gridSize/2) + 'L ' + Xcenter + ' ' + Ycenter
                                                                            + ' L ' + (Xcenter + compassSize) + ' ' + (Ycenter) + ' L ' + (Xcenter + gridSize/2) + ' ' + (Ycenter + gridSize/2) + 'L ' + Xcenter + ' ' + Ycenter
                                                                            + ' L ' + (Xcenter) + ' ' + (Ycenter + compassSize) + ' L ' + (Xcenter - gridSize/2) + ' ' + (Ycenter + gridSize/2) + 'L ' + Xcenter + ' ' + Ycenter
                                                                            + ' L ' + (Xcenter - compassSize) + ' ' + (Ycenter) + ' L ' + (Xcenter - gridSize/2) + ' ' + (Ycenter - gridSize/2) + 'L ' + Xcenter + ' ' + Ycenter
                                                                      );
        compassPointsFill.setAttribute('fill', 'rgb(213, 191, 163)');

        // Empty compass points
        let compassPointsEmpty = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        compassPointsEmpty.setAttribute('d', 'M ' + Xcenter + ' ' + Ycenter + ' L ' + (Xcenter) + ' ' + (Ycenter - compassSize) + ' L ' + (Xcenter - gridSize/2) + ' ' + (Ycenter - gridSize/2) + 'L ' + Xcenter + ' ' + Ycenter
                                                                            + ' L ' + (Xcenter + compassSize) + ' ' + (Ycenter) + ' L ' + (Xcenter + gridSize/2) + ' ' + (Ycenter - gridSize/2) + 'L ' + Xcenter + ' ' + Ycenter
                                                                            + ' L ' + (Xcenter) + ' ' + (Ycenter + compassSize) + ' L ' + (Xcenter + gridSize/2) + ' ' + (Ycenter + gridSize/2) + 'L ' + Xcenter + ' ' + Ycenter
                                                                            + ' L ' + (Xcenter - compassSize) + ' ' + (Ycenter) + ' L ' + (Xcenter - gridSize/2) + ' ' + (Ycenter + gridSize/2) + 'L ' + Xcenter + ' ' + Ycenter
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
        compassNeedle.setAttribute('d', 'M ' + (compassSize - 3) + ' ' + (tileBorder * 2) + ' L ' + (compassSize - 0.5) + ' ' + (2 * compassSize - tileBorder * 2)
         + ' L ' + (compassSize + 0.5) + ' ' + (2 * compassSize - tileBorder * 2) + ' L ' + (compassSize + 3) + ' ' + (tileBorder * 2)
         + ' L ' + (compassSize) + ' ' + (tileBorder) + ' Z');
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

        // Game logo
        let logoArchipelago = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        logoArchipelago.setAttribute('cx', + logoSize + boardSurround);
        logoArchipelago.setAttribute('cy', + logoSize + boardSurround);
        logoArchipelago.setAttribute('r', logoSize);
        logoArchipelago.setAttribute('fill', 'none');
        logoArchipelago.setAttribute('stroke', 'rgb(213, 191, 163)');
        logoArchipelago.style.strokeWidth = '1px';
        logoArchipelago.style.strokeLinecap = 'round';

        let logoArchipelagoInner = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        logoArchipelagoInner.setAttribute('cx', + logoSize + boardSurround);
        logoArchipelagoInner.setAttribute('cy', + logoSize + boardSurround);
        logoArchipelagoInner.setAttribute('r', logoSize - 30);
        logoArchipelagoInner.setAttribute('fill', 'none');
        logoArchipelagoInner.setAttribute('stroke', 'rgb(213, 191, 163)');
        logoArchipelagoInner.style.strokeWidth = '1px';
        logoArchipelagoInner.style.strokeLinecap = 'round';

        let logoText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        let logoTextPath = document.createElementNS('http://www.w3.org/2000/svg', 'textPath');
        let logoDefsPath = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        let logoDefsPath2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        let text = document.createTextNode('archipelago - archipelago - archipelago - ');

        // Game logo text and path
        logoDefsPath.appendChild(logoDefsPath2);
        logoDefsPath2.setAttribute('id', 'circlePath');
        logoDefsPath2.setAttribute('d', 'M ' + (boardSurround + 20) + ' ' + (logoSize + boardSurround) + ' A ' + (logoSize - 20) + ' ' + (logoSize - 20) + ' 0 1 1 ' + (boardSurround + 20) + ' ' + (logoSize + boardSurround + 1));

        logoText.appendChild(logoTextPath);
        logoText.setAttribute('font-size','17.3px');
        logoText.setAttribute('stroke', 'rgb(213, 191, 163)');
        logoTextPath.appendChild(text);

        //logoDefsPath.setAttribute('path');
        logoTextPath.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#circlePath');


        // Add all SVG elements to board
        compassLayer.appendChild(compassRing);
        compassLayer.appendChild(compassOuter);
        compassLayer.appendChild(compassInner);
        compassLayer.appendChild(compassLines);
        compassLayer.appendChild(compassPointsFill);
        compassLayer.appendChild(compassPointsEmpty);

        compassLayer.appendChild(logoArchipelago);
        compassLayer.appendChild(logoArchipelagoInner);
        compassLayer.appendChild(logoDefsPath);
        compassLayer.appendChild(logoText);

        compassNeedleBox.appendChild(compassNeedle);
        compassNeedleBox.appendChild(compassCircle);

        boardMarkNode.appendChild(compassLayer);
        boardMarkNode.appendChild(compassNeedleBox);


    },

// LAST BRACKET OF OBJECT
}
