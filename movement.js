// Pieces movement object - methods to allow valid moves to be chosen and validated
let pieceMovement = {

    // Array to store movement variables
    // Future update: capture all movements (to allow potential for replay and undo)
    // -----------------------------------------------------------------------------
    movementArray: [],

    // Method to activate tiles to which a ship can move
    // -------------------------------------------------
    // Future update: change row and col to passed variables
    //              : code for different pieces
    //              : distance around obstacles
    activateTiles: function(rowForChosenTile, colForChosenTile) {
        let moveDistance = 2;
        for (var i = -moveDistance + compass.directionArray[windDirection].windRow ; i < moveDistance + 1 +compass.directionArray[windDirection].windRow ; i++) {
            if(rowForChosenTile+i>=0 && rowForChosenTile+i <row) {
                console.log(rowForChosenTile, i, compass.directionArray[windDirection].windRow);
                for (var j = -moveDistance + compass.directionArray[windDirection].windCol; j < moveDistance + 1 +compass.directionArray[windDirection].windCol; j++) {
                    if(colForChosenTile+j >=0 && colForChosenTile+j <col) {
                        if (gameBoard.boardArray[rowForChosenTile+i][colForChosenTile+j].terrain == 'sea' && gameBoard.boardArray[rowForChosenTile+i][colForChosenTile+j].pieces.populatedSquare == false) {
                            gameBoard.boardArray[rowForChosenTile+i][colForChosenTile+j].activeStatus = 'active';
                        }
                    }
                }
            }
        }
        gameBoard.boardArray[rowForChosenTile][colForChosenTile].activeStatus = 'inactive';
    },

    // Method to deactivate tiles after a piece has moved
    // --------------------------------------------------
    // Future update: as above for activateTiles
    deactivateTiles: function() {
        let moveDistance = 2;
        for (var i = -moveDistance + compass.directionArray[windDirection].windRow; i < moveDistance + 1 + compass.directionArray[windDirection].windRow; i++) {
            if(this.movementArray.fromRow+i >=0 && this.movementArray.fromRow+i <row) {
                for (var j = -moveDistance + compass.directionArray[windDirection].windCol; j < moveDistance + 1 +compass.directionArray[windDirection].windCol; j++) {
                    if(this.movementArray.fromCol+j >=0 && this.movementArray.fromCol+j <col) {
                        gameBoard.boardArray[this.movementArray.fromRow+i][this.movementArray.fromCol+j].activeStatus = 'inactive';
                    }
                }
            }
        }
    },

    // Method to reset pieces from 'used' to 'unused' once a turn has ended
    // --------------------------------------------------------------------
    usedPiecesReset: function() {
        for (var y = 0; y <  col; y++) {
            for (var x = 0; x <  row; x++) {
                if (gameBoard.boardArray[x][y].pieces.used == 'used') {
                    gameBoard.boardArray[x][y].pieces.used = 'unused';
                }
            }
        }
    },
}
