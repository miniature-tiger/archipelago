
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
    createActionTile: function(locali, localj, tileSize) {

        // Use guildActionTile function to construct tile then label it with id
        let identifiedTile = this.buildActionTile(this.boardArray[locali][localj].pieces.type, this.boardArray[locali][localj].pieces.direction, this.boardArray[locali][localj].pieces.team, tileSize)

        // Adding an id for each tile - DECIDE IF NECESSARY IN NEXT STAGE
        identifiedTile.id = locali*1000 + localj;
        identifiedTile.firstChild.id = 'holding' + Number(locali*1000 + localj);

        // tile is returned to drawBoard
        return identifiedTile;
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

    // Method to create the board display based on the boardArray
    // ----------------------------------------------------------
    // gridSize is the size of the tile, row and col depict the number of tiles on the board
    drawBoard: function(row, col, gridSize) {

        // boardMarkNode is board holder in document
        boardMarkNode = document.querySelector('div.boardmark');

        // Any existing board is deleted
        while (boardMarkNode.firstChild) {
            boardMarkNode.removeChild(boardMarkNode.firstChild);
        }

        // board holder size is created dynamically
        boardMarkNode.style.height = row * gridSize + 'px';
        boardMarkNode.style.width = col * gridSize + 'px';
        boardMarkNode.style.padding = gridSize * 0.5 + 'px';

        // Loop through each board row
        for (var i = 0; i < this.boardArray.length; i++) {
            let newRow = document.createElement('div');
            newRow.setAttribute('class', 'board_row');
            newRow.style.width = col * gridSize + 'px';
            newRow.style.height = gridSize + 'px';
            // Adding an id for each row - DECIDE IF NECESSARY IN NEXT STAGE
            newRow.id = 'rowID' + i + '-' + j;

            // Loop through each tile j of each board row i
            for (var j = 0; j < this.boardArray[i].length; j++) {

                if (this.boardArray[i][j].pieces.populatedSquare == true) {
                    // Create action tile and add tile to row
                    newRow.appendChild(this.createActionTile(i, j, gridSize));
                } else {
                    // Create empty tile and add tile to row
                    newRow.appendChild(this.createTile( i, j, gridSize));
                }
            }
            // Add row to board
            boardMarkNode.appendChild(newRow);
        }
    },



// LAST BRACKET OF OBJECT
}
