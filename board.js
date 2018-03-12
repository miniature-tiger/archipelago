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
                    rowArray.push({pos: + x, type: 'land'});
                // But mainly sea tiles
                } else {
                    rowArray.push({pos: + x, type: 'sea'});
                }
            }
        this.boardArray.push(rowArray);
        }
    },

    // Method to overlay islands and bases
    // -----------------------------------
    // Much of this overlay code could be removed and replaced by a fixed array at a later date
    // But currently it is useful to allow the board to be set dynamically in different sizes
    // whilst game play is being developed
    overlayBoardArray: function(row, col, boardShape) {
        let boardCenter = Math.round((row-1)/2);
        let octagonCorner = (row-1)/3;

        // A octagon shaped board is obtained by making triangles of tiles invisible in the corners
        if (boardShape == 'octagon') {
            console.log(boardShape);
            this.overlayTilesTri(0, 0, octagonCorner, 'TL', 'invis');
            this.overlayTilesTri(0, col-octagonCorner, octagonCorner, 'TR', 'invis');
            this.overlayTilesTri(row-octagonCorner, 0, octagonCorner, 'BL', 'invis');
            this.overlayTilesTri(row-octagonCorner, col-octagonCorner, octagonCorner, 'BR', 'invis');
        }

        // Creation of triangle-shaped islands
        this.overlayTilesTri((row-1)/3-3, (row-1)/3-3, 3, 'BR', 'land');
        this.boardArray[(row-1)/3-1][(row-1)/3-1].type = 'sea';

        this.overlayTilesTri(2*((row-1)/3)+1, 2*((row-1)/3)+1, 3, 'TL', 'land');
        this.boardArray[2*((row-1)/3)+1][2*((row-1)/3)+1].type = 'sea';

        this.overlayTilesTri((row-1)/3-3, 2*((row-1)/3)+1, 3, 'BL', 'land');
        this.boardArray[(row-1)/3-1][2*((row-1)/3)+1].type = 'sea';

        this.overlayTilesTri(2*((row-1)/3)+1, (row-1)/3-3, 3, 'TR', 'land');
        this.boardArray[2*((row-1)/3)+1][(row-1)/3-1].type = 'sea';

        // Creation of central volcanic shaped island for trading post
        this.overlayTiles(boardCenter-1, boardCenter+2, boardCenter-1, boardCenter+2, 'land');
        this.boardArray[boardCenter-1][boardCenter+1].type = 'sea';
        this.boardArray[boardCenter-1][boardCenter-1].type = 'sea';
        this.boardArray[boardCenter+1][boardCenter+1].type = 'sea';
        this.boardArray[boardCenter+1][boardCenter-1].type = 'sea';

        // Creation of bay shaped islands
        this.overlayTiles(boardCenter-1, boardCenter+2, 2*((row-1)/3)+4, 2*((row-1)/3)+6, 'land');
        this.boardArray[boardCenter][2*((row-1)/3)+5].type = 'sea';

        this.overlayTiles(boardCenter-1, boardCenter+2, (row-1)/3-5, (row-1)/3-3, 'land');
        this.boardArray[boardCenter][(row-1)/3-5].type = 'sea';

        this.overlayTiles(2*((row-1)/3)+4, 2*((row-1)/3)+6, boardCenter-1, boardCenter+2, 'land');
        this.boardArray[2*((row-1)/3)+5][boardCenter].type = 'sea';

        this.overlayTiles((row-1)/3-5, (row-1)/3-3, boardCenter-1, boardCenter+2, 'land');
        this.boardArray[(row-1)/3-5][boardCenter].type = 'sea';

        // Creation of bases
        this.overlayTiles(row-1, row, boardCenter-1, boardCenter+2, 'base');
        this.overlayTiles(0, 1, boardCenter-1, boardCenter+2, 'base');
        this.overlayTiles(boardCenter-1, boardCenter+2, col-1, col, 'base');
        this.overlayTiles(boardCenter-1, boardCenter+2, 0, 1, 'base');
    },

    // Method to create triangle shaped overlay
    // ----------------------------------------
    // allows specification of size, position and type of tiles
    // TR = top right, BL = bottom left (for right angled corner)
    overlayTilesTri: function(startRow, startCol, size, corner, overlayType) {
        for (i = startRow; i < startRow + size; i+=1) {
            if (corner == "TL") {
                for (j = startCol; j < startCol + size - (i - startRow); j+=1) {
                    this.boardArray[i][j].type = overlayType;
                  }
            } else if (corner == "BL") {
                for (j = startCol; j < startCol + (i - startRow) + 1; j+=1) {
                    this.boardArray[i][j].type = overlayType;
                }
            } else if (corner == 'TR') {
                for (j = startCol + (i - startRow); j < startCol + size; j+=1) {
                    this.boardArray[i][j].type = overlayType;
                }
            } else if (corner == 'BR') {
                for (j = startCol + size - (i - startRow) -1; j < startCol + size; j+=1) {
                    this.boardArray[i][j].type = overlayType;
                  }
            } else {
                console.log('overlayTilesTri - triangle type not found');
            }
        }
    },

    // Method to create rectangular shaped overlay
    // -------------------------------------------
    // allows specification of size, position and type of tiles
    overlayTiles: function(startRow, endRow, startCol, endCol, overlayType) {
        for (i = startRow; i < endRow; i++) {
            for (j = startCol; j < endCol; j++) {
                this.boardArray[i][j].type = overlayType;
            }
        }
    },

    // Method to create a single tile
    // ------------------------------
    // gridSize is the size of the tile, squareType is the land / sea / base of the tile
    createTile: function(squareType, i, j, gridSize) {
        // Creating the tile from three nested divs
        let newTile = document.createElement('div');
        let innerTile = document.createElement('div');
        let rotatedTile = document.createElement('div');

        // Adding an id for each tile - DECIDE IF NECESSARY IN NEXT STAGE
        newTile.id = i + '-' + j;

        // Creating the tile by dynamically allocating CSS classes
        // Tile size is set as a parameter but has functionality to be varied dynamically
        // (e.g. to zoom in or out of board map)
        newTile.setAttribute('class', 'square ' + 'square_' + this.boardArray[i][j].type);
        newTile.style.height = (gridSize - 2) + 'px';
        newTile.style.width = (gridSize - 2) + 'px';

        rotatedTile.setAttribute('class', 'rotated_square ' + this.boardArray[i][j].type);
        rotatedTile.style.height = (gridSize - 4) + 'px';
        rotatedTile.style.width = (gridSize - 4) + 'px';

        innerTile.setAttribute('class', 'inner_square ' + this.boardArray[i][j].type);
        innerTile.style.height = (gridSize - 4) + 'px';
        innerTile.style.width = (gridSize - 4) + 'px';

        newTile.appendChild(rotatedTile);
        rotatedTile.appendChild(innerTile);

        // tile is returned to drawBoard
        return newTile;

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
                let squareType = this.boardArray[i][j].type;
                // Create tile and add tile to row
                newRow.appendChild(this.createTile(squareType, i, j, gridSize));
            }
            // Add row to board
            boardMarkNode.appendChild(newRow);
        }
    }
}
