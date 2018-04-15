// Pieces movement object - methods to allow valid moves to be chosen and validated


let pieceMovement = {

    // Array to store movement variables
    // Future update: capture all movements (to allow potential for replay and undo)
    // -----------------------------------------------------------------------------

    movementArray: {start: {row: '', col: ''}, end: {row: '', col: ''}},

    findPath: [],

    movementDirection: [[-45, -90, -135], [0, 0, 180], [45, 90, 135]],

    // Method to activate tiles to which a ship can move
    // -------------------------------------------------
    // Now includes:
    //    path around obstacles
    //    movement costs for each direction integrated with compass needle direction
    // Future update:
    //    code for different pieces
    activateTiles: function(localStartRow, localStartCol, localMaxMove, displayActive) {
        // Initialises findPath array which holds board size array of
        // active/inactive status, movement cost to reach that tile, path to that tile
        this.initialisefindPath(localStartRow, localStartCol, localMaxMove);

        // Sets clicked piece status to active as starting point of chain reaction of setting active status
        if (displayActive) {
            gameBoard.boardArray[localStartRow][localStartCol].activeStatus = 'active';
        }
        this.findPath[localStartRow][localStartCol].activeStatus = 'active';

        // Loops through localMaxMove loops
        // Each loop searches for potentially reachable tiles to activated within one tile reach of a previously activated tile
        // First search (k=0) takes each active tile within 1x1 grid around piece (i.e. just the piece itself) then uses
        // activeTiles to search in 3x3 grid around this tile
        // Second search (k=1) takes each active tile within a 3x3 grid of the piece (i.e. within one tile move reach of the piece) then uses
        // activeTiles to search in 3x3 grid around each of these active tiles
        // Third search (k=2) takes each active tile within a 5x5 grid of the piece (i.e. within two tile move reach of the piece) then uses
        // activeTiles to search in 3x3 grid around each of these active tiles (making a maximum potential 3 tile distance  from the piece for active tiles)
        for (var k = 0; k < localMaxMove; k++) {
            // Loops through i rows and j columns to form the 3x3 etc grids
            for (var i = -k; i < k+1; i++) {
                // Restrict by map size for rows so not searching off edge of board
                if(localStartRow+i>=0 && localStartRow+i <row) {
                    for (var j = -k; j < k+1; j++) {
                        // Restrict by map size for columns so not searching off edge of board
                        if(localStartCol+j >=0 && localStartCol+j <col) {
                            // Checks if tile is active. If so runs activeTiles to search for potential tiles to activate around it
                            if (this.findPath[localStartRow+i][localStartCol+j].activeStatus == 'active') {
                                //Keep useful for debugging - console.log('run: ' + k);
                                //Keep useful for debugging - console.log('starting from: row: ' + (localStartRow+i) + ' col: ' + (localStartCol+j) + ' prior cost: ' + this.findPath[localStartRow+i][localStartCol+j].moveCost);
                                this.activeTiles(localStartRow+i, localStartCol+j, this.findPath[localStartRow+i][localStartCol+j].moveCost, localMaxMove, displayActive, k);
                            }
                        }
                    }
                }
            }
        }
        // At end of search sets piece square back to inactive as you cannot move a piece to its own square
        this.findPath[localStartRow][localStartCol].activeStatus = 'inactive';
        if (displayActive) {
            gameBoard.boardArray[localStartRow][localStartCol].activeStatus = 'inactive';
        }
         //console.log(this.findPath.slice(0));
    },

    initialisefindPath: function(localStartRow, localStartCol, localMaxMove) {
    // Initialises findPath array which holds board size (i rows x j columns) array of:
    // active/inactive status
    // movement cost to reach that tile
    // path to that tile
        for (var i = 0; i < col; i++) {
            let localMoveRow = [];
            for (var j = 0; j < row; j++) {
                localMoveRow[j] = {activeStatus: 'inactive', moveCost: 0, distance: 0,target: '', team: '', path: [{fromRow: +localStartRow , fromCol: +localStartCol}]};
            }
            this.findPath[i] = localMoveRow;
        }
    },

    activeTiles: function(localStartRow, localStartCol, localCumulMoveCost, localMaxMove, displayActive, k) {
        // activeTiles searches a 3x3 grid around the passed (activated) tile reference to find more potential tiles to activate
        // Restrictions on activation are: board size, land and occupied pieces, total available move cost to reach tile
        // Total available move cost is currently set to MaxMove (i.e you can move a total of 3 tile or equivalent adjusted by wind) - this may be changed in future
        // If a second path arrives at an already activated tile with a cheaper cost this path replaces the existing findPath
        // The path and costs are built up in the findPath array

        // Initialise local variable for cumulative cost of reaching tile
        let tileCumulMoveCost = 0;

        // Loop through rows
        for (var i = -1; i <= 1; i++) {
            // Restrict by map size for rows
            if(localStartRow+i>=0 && localStartRow+i <row) {
                // Loop through columns
                for (var j = -1; j <= 1; j++) {
                    // Restrict by map size for columns
                    if(localStartCol+j >=0 && localStartCol+j <col) {

                        // Restrict for land squares ( ---- and objects ---- )
                        // if (gameBoard.boardArray[localStartRow+i][localStartCol+j].terrain == 'sea' && gameBoard.boardArray[localStartRow+i][localStartCol+j].pieces.populatedSquare == false) {
                        if (gameBoard.boardArray[localStartRow+i][localStartCol+j].terrain == 'sea') {
                            // Aggregate cost of reaching tile in tileCumulMoveCost - add the exiting cost to the cost for reaching the new tile from moveCost
                            // Keep useful for debugging - console.log('row: ' + (localStartRow+i) + ' col: ' + (localStartCol+j) + ' prior cost: ' + localCumulMoveCost + ' new cost: ' + this.moveCost(localStartRow, localStartCol ,localStartRow+i, localStartCol+j, needleDirection))
                            tileCumulMoveCost = localCumulMoveCost + this.moveCost(localStartRow, localStartCol ,localStartRow+i, localStartCol+j, needleDirection);

                            // Restrict activation by Maximum Cost of reaching a tile (allows wind direction to be factored in to move)
                            if (tileCumulMoveCost <= localMaxMove) {
                                // Logic for already active tiles - is the new path cheaper in moveCost?
                                if (this.findPath[localStartRow+i][localStartCol+j].activeStatus == 'active') {
                                    if (tileCumulMoveCost < this.findPath[localStartRow+i][localStartCol+j].moveCost) {
                                        // Keep useful for debugging - console.log('already active logic is used:');
                                        // Keep useful for debugging - console.log('change to active tile - pre:', localStartRow+i, localStartCol+j, this.findPath[localStartRow+i][localStartCol+j], localStartRow, localStartCol, this.findPath[localStartRow][localStartCol]);
                                        // Update the cost, add the inherited path from the previous moved-to tile, push the path for the new tile
                                        this.findPath[localStartRow+i][localStartCol+j].moveCost = tileCumulMoveCost;
                                        this.findPath[localStartRow+i][localStartCol+j].path = this.findPath[localStartRow][localStartCol].path.slice(0);
                                        this.findPath[localStartRow+i][localStartCol+j].path.push({fromRow: +(localStartRow+i) , fromCol: +(localStartCol+j)});
                                        this.findPath[localStartRow+i][localStartCol+j].distance = this.findPath[localStartRow+i][localStartCol+j].path.length-1;
                                        // Keep useful for debugging - console.log('change to active tile - post:', localStartRow+i, localStartCol+j, this.findPath[localStartRow+i][localStartCol+j], localStartRow, localStartCol, this.findPath[localStartRow][localStartCol]);
                                    }
                                // Logic for inactive tiles that have met all criteria - activate them!
                                } else if (this.findPath[localStartRow+i][localStartCol+j].activeStatus != 'active') {
                                    // Keep useful for debugging - console.log('new pre-activation:', localStartRow+i, localStartCol+j, this.findPath[localStartRow+i][localStartCol+j], localStartRow, localStartCol, this.findPath[localStartRow][localStartCol]);
                                    this.findPath[localStartRow+i][localStartCol+j].activeStatus = 'active';
                                    if (displayActive) {
                                          gameBoard.boardArray[localStartRow+i][localStartCol+j].activeStatus = 'active';
                                    }
                                    // Sets cargo ship tile to inactive to prevent moving there
                                    if (gameBoard.boardArray[localStartRow+i][localStartCol+j].pieces.type == 'cargo') {
                                        this.findPath[localStartRow+i][localStartCol+j].activeStatus = 'inactive';
                                        gameBoard.boardArray[localStartRow+i][localStartCol+j].activeStatus = 'inactive';
                                        this.findPath[localStartRow+i][localStartCol+j].target = 'cargo';
                                        this.findPath[localStartRow+i][localStartCol+j].team = gameBoard.boardArray[localStartRow+i][localStartCol+j].pieces.team.slice(0);
                                        //console.log(this.findPath[localStartRow+i][localStartCol+j]);
                                    }
                                    // Update the cost, add the inherited path from the previous moved-to tile, push the path for the new tile
                                    this.findPath[localStartRow+i][localStartCol+j].moveCost = tileCumulMoveCost;

                                    this.findPath[localStartRow+i][localStartCol+j].path = this.findPath[localStartRow][localStartCol].path.slice(0);
                                    this.findPath[localStartRow+i][localStartCol+j].path.push({fromRow: +(localStartRow+i) , fromCol: +(localStartCol+j)});
                                    this.findPath[localStartRow+i][localStartCol+j].distance = this.findPath[localStartRow+i][localStartCol+j].path.length-1;
                                    //Keep useful for debugging - console.log('new post-activation:', localStartRow+i, localStartCol+j, this.findPath[localStartRow+i][localStartCol+j], localStartRow, localStartCol, this.findPath[localStartRow][localStartCol]);
                                    //Keep useful for debugging - console.log('row: ' + (localStartRow+i) + ' col: ' + (localStartCol+j) + ' set to: ' + this.findPath[localStartRow+i][localStartCol+j].activeStatus + ' with cost: ' + this.findPath[localStartRow+i][localStartCol+j].moveCost + ' and distance: ' + this.findPath[localStartRow+i][localStartCol+j].distance);
                                }

                            }
                        }
                    }
                }
            }
        }
    },

    // Sets the "cost" of each move in relation to the wind direction
    // e.g. 1 if move is within 45 degrees of direction of wind, 2 at 90 degrees to wind, 3 in 45 degrees of against wind
    moveCost: function(localStartRow, localStartCol, localEndRow, localEndCol, localWindDirection) {
        let moveCostResult = 0;
        // Calculates direction of move
        let localMoveTop = (localEndRow - localStartRow);
        let localMoveLeft = (localEndCol - localStartCol);
        let localMoveDirection = this.movementDirection[localMoveLeft+1][localMoveTop+1];
        // Calculates difference in angle of direction between wind direction and piece movement
        let angleDiff = (localMoveDirection - localWindDirection + 360) % 360;
        // Returns cost based on the difference in angle
        if (angleDiff > 90 && angleDiff < 270) {
            moveCostResult = 3;
        } else if (angleDiff == 90 || angleDiff == 270) {
            moveCostResult = 2;
        } else if (angleDiff == 45 || angleDiff == 315) {
            moveCostResult = 1.2;
        } else {
            moveCostResult = 0.8;
        }
        return moveCostResult;
    },

    // Method to deactivate tiles after a piece has moved
    // --------------------------------------------------
    deactivateTiles: function(localMaxMove) {
        let moveDistance = localMaxMove;
        // Simply deactivates all tiles within the maximum potential move distance
        for (var i = -moveDistance; i < moveDistance + 1; i++) {
            if(this.movementArray.start.row+i >=0 && this.movementArray.start.row+i <row) {
                for (var j = -moveDistance; j < moveDistance + 1; j++) {
                    if(this.movementArray.start.col+j >=0 && this.movementArray.start.col+j <col) {
                        gameBoard.boardArray[this.movementArray.start.row+i][this.movementArray.start.col+j].activeStatus = 'inactive';
                    }
                }
            }
        }
        // findPath is emptied once tiles are deactivated
        findPath = [];
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
    captureMove: function(fromTo, yClickTile, xClickTile) {
        // Calculate row and column of square from id and record in movement array
        console.log('capturemove', xClickTile);
        this.movementArray[fromTo].col = xClickTile;
        this.movementArray[fromTo].row = yClickTile;
        // Obtain board piece information and record in movement array
        this.movementArray[fromTo].pieces = gameBoard.boardArray[this.movementArray[fromTo].row][this.movementArray[fromTo].col].pieces;
        //this.movementArray[fromTo].type = gameBoard.boardArray[this.movementArray[fromTo].row][this.movementArray[fromTo].col].pieces.type;
        //this.movementArray[fromTo].used = gameBoard.boardArray[this.movementArray[fromTo].row][this.movementArray[fromTo].col].pieces.used;
        //this.movementArray[fromTo].team = gameBoard.boardArray[this.movementArray[fromTo].row][this.movementArray[fromTo].col].pieces.team;
        //console.log('movement array', this.movementArray);
        //console.log('movement array .pieces', this.movementArray[fromTo].pieces);

        if (fromTo == 'start') {
            this.movementArray[fromTo].activeStatus = 'inactive';
        } else if (this.movementArray[fromTo].pieces.category == 'Transport') {
            this.movementArray[fromTo].activeStatus = this.findPath[this.movementArray[fromTo].row][this.movementArray[fromTo].col].activeStatus;
        } else {
            this.movementArray[fromTo].activeStatus = gameBoard.boardArray[this.movementArray[fromTo].row][this.movementArray[fromTo].col].activeStatus;
        }
    },

    // Method for ship movement and transition
    // ---------------------------------------

    shipTransition: function() {

        // Variables for transition movements
        let topDirection = 0;
        let leftDirection = 0;
        let rotateDirection = 0;

        // Calculate placement on board of start tile for move
        IDPieceStart = 'tile' + Number(this.movementArray.start.row*1000 + this.movementArray.start.col);
        // console.log(IDPieceStart);
        let chosenPiece = document.getElementById(IDPieceStart);

        // Allowing ship to overflow edges of its tile on transition
        // console.log(chosenPiece);
        //chosenSquare.start = chosenHolding.start.parentElement;
        //chosenSquare.start.style.overflow = 'visible';

        // Obtaining path of piece that leads to end tile of move from findPath array
        let localPath = this.findPath[this.movementArray.end.row][this.movementArray.end.col].path;
        // Length gives number of steps in path
        let numberOfTiles = localPath.length - 1;

        // Loop through each step of move
        for (var i = 0; i < numberOfTiles; i++) {

            // Calculating transformations to be applied to square holding piece
            // Directional translation
            topDirection = (localPath[i+1].fromRow - localPath[i].fromRow);
            leftDirection = (localPath[i+1].fromCol - localPath[i].fromCol);
            // Rotational translation
            rotateDirection = this.movementDirection[(localPath[i+1].fromCol - localPath[i].fromCol)+1][(localPath[i+1].fromRow - localPath[i].fromRow)+1];

            // Applying the transformation for step i of the move path
            this.turnAndMove(i, chosenPiece, topDirection, leftDirection, rotateDirection);
        }

        // Applying moves to game board array
        gameBoard.boardArray[pieceMovement.movementArray.end.row][pieceMovement.movementArray.end.col].pieces = {populatedSquare: true, type: 'cargo', direction: rotateDirection, used: 'used', team: gameManagement.turn};
        gameBoard.boardArray[pieceMovement.movementArray['start'].row][pieceMovement.movementArray['start'].col].pieces = {populatedSquare: false, type: 'none', direction: '', used: 'unused', team: 'none'};

        //Updating piece information
        chosenPiece.setAttribute('id', 'tile' + Number(pieceMovement.movementArray.end.row*1000 + pieceMovement.movementArray.end.col));

        // Reset of transitions delayed in proportion to number of moves
        setTimeout(function() {
            chosenPiece.style.transition = '';
            pieceMovement.landDiscovery();
        }, numberOfTiles * 1000);


    },


    // Method for piece to turn in direction of move and then move
    // -----------------------------------------------------------
    turnAndMove: function(n, chosenPiece, topDirection, leftDirection, rotateDirection) {
        // n is number of transition in chain
        // Transitions to be applied (added here to allow different transitions to be applied dynamically in future)
        //console.log(chosenPiece);
        //console.log(chosenPiece.style.transition);
        chosenPiece.style.transition = 'transform 0.2s 0s ease-in-out, left 0.7s 0.2s ease-in-out, top 0.7s 0.2s ease-in-out';

        // Delayed application of transformations to give board game style move effect
        setTimeout(function() {
            //console.log(chosenPiece.style.left, chosenPiece.style.top);
            chosenPiece.style.left = parseFloat(chosenPiece.style.left) + (leftDirection * (gridSize + tileBorder*2)) + 'px';
            chosenPiece.style.top = parseFloat(chosenPiece.style.top) + (topDirection * (gridSize + tileBorder*2)) + 'px';
            chosenPiece.style.transform = 'rotate(' + rotateDirection + 'deg)';
        }, n * 1000);
    },

    // Method to allow discovery of new land tiles
    // -------------------------------------------
    landDiscovery: function() {

        // At end of each move check a 1x1 grid to see if the ship is next to land that is unpopulated
        let searchDistance = 1;
        for (var i = -searchDistance; i < searchDistance + 1; i++) {
            if(this.movementArray.start.row+i >=0 && this.movementArray.start.row+i <row) {
                for (var j = -searchDistance; j < searchDistance + 1; j++) {
                    if(this.movementArray.start.col+j >=0 && this.movementArray.start.col+j <col) {
                        // Reduces seacrh to exclude diagonals
                        if(i == 0 || j == 0) {
                            // Checks if tile is land and unpopulated
                            if(gameBoard.boardArray[this.movementArray.end.row+i][this.movementArray.end.col+j].terrain == 'land' && !gameBoard.boardArray[this.movementArray.end.row+i][this.movementArray.end.col+j].pieces.populatedSquare) {
                                // If so - picks a reource card type using resourceManagement.pickFromResourceDeck() and updates boardArray to this tile tile with unoccupied team
                                gameBoard.boardArray[this.movementArray.end.row+i][this.movementArray.end.col+j].pieces = {populatedSquare: true, category: 'Resources', type: resourceManagement.pickFromResourceDeck(), direction: '0', used: 'unused', team: 'Unclaimed'};
                                // and then creates an SVG resource tile for the land space
                                boardMarkNode.appendChild(gameBoard.createActionTile(this.movementArray.end.row+i, this.movementArray.end.col+j, gridSize, tileBorder, boardSurround));
                            }
                        }
                    }
                }
            }
        }

        // Resetting movement array once second click has been made (if move valid)
        pieceMovement.movementArray = {start: {row: '', col: ''}, end: {row: '', col: ''}};
        startEnd = 'start';
        console.log('valid cargo - start');
    },

    // Method to check a ship is nearby to allow resource to be settled
    // ----------------------------------------------------------------
    shipAvailable: function() {
        let searchDistance = 1;
        let result = false;
        for (var i = -searchDistance; i < searchDistance + 1; i++) {
            if(this.movementArray.start.row+i >=0 && this.movementArray.start.row+i <row) {
                for (var j = -searchDistance; j < searchDistance + 1; j++) {
                    if(this.movementArray.start.col+j >=0 && this.movementArray.start.col+j <col) {
                        // Reduces seacrh to exclude diagonals
                        if(i == 0 || j == 0) {
                            // Checks if tile is ship or correct team
                            if(gameBoard.boardArray[this.movementArray.start.row+i][this.movementArray.start.col+j].pieces.type == 'cargo' && gameBoard.boardArray[this.movementArray.start.row+i][this.movementArray.start.col+j].pieces.team == gameManagement.turn) {
                                result = true;
                            }
                        }
                    }
                }
            }
        }
        return result;
    },


// LAST BRACKET OF OBJECT
}
