// Pieces movement object - methods to allow valid moves to be chosen and validated


let pieceMovement = {

    // Array to store movement variables
    // Future update: capture all movements (to allow potential for replay and undo)
    // -----------------------------------------------------------------------------

    movementArray: {start: {row: '', col: ''}, end: {row: '', col: ''}},

    movementDirection: [[-45, -90, -135], [0, 0, 180], [45, 90, 135]],

    // Method to activate tiles to which a ship can move
    // -------------------------------------------------
    // Future update: change row and col to passed variables
    //              : code for different pieces
    //              : distance around obstacles
    activateTiles: function(rowForChosenTile, colForChosenTile) {
        let windOn = 0;
        let moveDistance = 1;
        for (var i = -moveDistance + compass.directionArray[windDirection].windRow * windOn; i < moveDistance + 1 +compass.directionArray[windDirection].windRow * windOn ; i++) {
            if(rowForChosenTile+i>=0 && rowForChosenTile+i <row) {
                for (var j = -moveDistance + compass.directionArray[windDirection].windCol * windOn; j < moveDistance + 1 +compass.directionArray[windDirection].windCol * windOn; j++) {
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
        let windOn = 0;
        let moveDistance = 1;
        for (var i = -moveDistance + compass.directionArray[windDirection].windRow * windOn; i < moveDistance + 1 + compass.directionArray[windDirection].windRow * windOn; i++) {
            if(this.movementArray.start.row+i >=0 && this.movementArray.start.row+i <row) {
                for (var j = -moveDistance + compass.directionArray[windDirection].windCol * windOn; j < moveDistance + 1 +compass.directionArray[windDirection].windCol * windOn; j++) {
                    if(this.movementArray.start.col+j >=0 && this.movementArray.start.col+j <col) {
                        //console.log(this.movementArray.start.row+i, this.movementArray.start.col+j);
                        //console.log(gameBoard.boardArray[this.movementArray.start.row+i][this.movementArray.start.col+j].activeStatus);
                        gameBoard.boardArray[this.movementArray.start.row+i][this.movementArray.start.col+j].activeStatus = 'inactive';
                        //console.log(gameBoard.boardArray[this.movementArray.start.row+i][this.movementArray.start.col+j].activeStatus);
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


    // Method for capturing moves
    // --------------------------
    captureMove: function(fromTo, square) {
        // Calculate row and column of square from id and record in movement array
        this.movementArray[fromTo].col = square[fromTo].id % 1000;
        this.movementArray[fromTo].row = Math.round((square[fromTo].id - this.movementArray.start.col)/1000);
        // Obtain board piece information and record in movement array
        this.movementArray[fromTo].type = gameBoard.boardArray[this.movementArray[fromTo].row][this.movementArray[fromTo].col].pieces.type;
        this.movementArray[fromTo].used = gameBoard.boardArray[this.movementArray[fromTo].row][this.movementArray[fromTo].col].pieces.used;
        this.movementArray[fromTo].team = gameBoard.boardArray[this.movementArray[fromTo].row][this.movementArray[fromTo].col].pieces.team;
        this.movementArray[fromTo].activeStatus = gameBoard.boardArray[this.movementArray[fromTo].row][this.movementArray[fromTo].col].activeStatus;

        return square;
    },

    // Method for ship movement and transition
    // ---------------------------------------

    shipTransition: function() {

        // Calculate placement on board of start and end tiles for move
        IDHoldingStart = '#holding' + Number(this.movementArray.start.row*1000 + this.movementArray.start.col);
        chosenHolding.start = document.querySelector(IDHoldingStart);

        chosenSquare.start = chosenHolding.start.parentElement;
        chosenSquare.start.style.overflow = 'visible';

        IDHoldingEnd = '#holding' + Number(this.movementArray.end.row*1000 + this.movementArray.end.col);

        // Transitions to be applied (added separately to allow separate transitions to be applied in future)
        chosenHolding.start.style.transition += 'transform 0.4s 0s ease-in-out';
        chosenHolding.start.style.transition += ', left 1.1s 0.4s ease-in-out';
        chosenHolding.start.style.transition += ', top 1.1s 0.4s ease-in-out';

        // Calculating transformations to be applied to square holding piece
        // Directional translation
        topDirection = (this.movementArray.end.row - this.movementArray.start.row);
        leftDirection = (this.movementArray.end.col - this.movementArray.start.col);
        chosenHolding.start.style.left = leftDirection *  gridSize + 'px';
        chosenHolding.start.style.top = topDirection *  gridSize + 'px';

        // Rotational translation
        rotateDirection = this.movementDirection[leftDirection+1][topDirection+1];
        chosenHolding.start.style.transform = 'rotate(' + rotateDirection + 'deg)';

        // Removing octagon from end tile
        chosenSquare.end.removeChild(chosenSquare.end.firstChild);

        // Applying moves to game board array
        gameBoard.boardArray[this.movementArray.end.row][this.movementArray.end.col].pieces = {populatedSquare: true, type: 'cargo', direction: rotateDirection, used: 'used', team: gameManagement.turn};
        gameBoard.boardArray[pieceMovement.movementArray['start'].row][pieceMovement.movementArray['start'].col].pieces = {populatedSquare: false, type: 'none', direction: '', used: 'unused', team: 'none'};

    },

}
