
// Pirates movement object - methods for AI of pirateship movement
let pirates = {

    pirateShips: [],

    // Method to manage automated movement of pirate ship moves
    automatePirates: function() {
        // Generate array of all pirate ships to be moved
        this.populatePirateShipsArray();

        // Loop through each pirate ship with delay to allow transormations to occur
        let i = 0;
        function moves() {
                // Keep - useful for debugging - console.log('pirate ship: ' + i);

                // Starting tile for pirate ship move taken from array of pirate ships
                pieceMovement.movementArray.start = pirates.pirateShips[i].start;
                // Tiles activated which also finds path for moves and target information on reachable area
                // true / false allow red boundaries to be highlighted or not
                pieceMovement.activateTiles(pieceMovement.movementArray.start.row, pieceMovement.movementArray.start.col, maxMove, false);
                // Redraw active tile layer after activation to show activated tiles
                gameBoard.drawActiveTiles();
                // Finds targetable cargo ships within reach
                pirates.findTarget();
                if (pirates.targetCargo.length > 0) {
                    // Attacks targetable cargo ship if in range (currently just uses first cargo ship in array - to improve in future)
                    // Keep - useful for debugging - console.log('found target: ' + pirates.targetCargo[0].row + ' ' + pirates.targetCargo[0].col);
                    pirates.pirateShips[i].end.row = pirates.targetCargo[0].row;
                    pirates.pirateShips[i].end.col = pirates.targetCargo[0].col;
                } else {
                    // If no ships in range moves to maximum distance at minimum wind cost
                    pirates.maxPathDistance();
                    pirates.minPathCost();
                    // Keep - useful for debugging - console.log('just moving: ' + pirates.minCostTiles[0].row + ' ' + pirates.minCostTiles[0].col);
                    pirates.pirateShips[i].end.row = pirates.minCostTiles[0].row;
                    pirates.pirateShips[i].end.col = pirates.minCostTiles[0].col;
                }
                // Keep - useful for debugging - console.log(pieceMovement.movementArray);

                // End position for pirate ship confirmed with movement array then move activated and dashboard recalculated
                pieceMovement.movementArray.end = pirates.pirateShips[i].end;
                pieceMovement.deactivateTiles(maxMove);
                pieceMovement.shipTransition();

                // Disengaged until graphics updated
                //stockDashboard.stockTake();
                //stockDashboard.drawStock();

                // Resets movement array
                pieceMovement.movementArray = {start: {row: '', col: ''}, end: {row: '', col: ''}};
                // Moves on to next ship
                i+=1;

            // Loops through with delay
            if(i < pirates.pirateShips.length) {

                setTimeout(moves, 1000 * pirates.minCostTiles[0].distance);

            } else {
                // Resets pirate ship array once all moves made
                pirates.pirateShips = [];

            }

        }
        // Calls function above

        moves();


    },


    // Method to generate a list of pirate ships to move
    // -------------------------------------------------
    populatePirateShipsArray: function() {
        for (var i = 0; i < gameBoard.boardArray.length; i++) {
            for (var j = 0; j < gameBoard.boardArray[i].length; j++) {
                if((gameBoard.boardArray[i][j].pieces.team == 'teamPirate') && (gameBoard.boardArray[i][j].pieces.type = 'cargo')) {
                    this.pirateShips.push({start: {row: + i, col: + j, category: 'Transport', type: 'cargo', used: 'unused', team: 'teamPirate', activeStatus: 'active'}, end: {row: + i, col: + j, type: 'no piece', used: 'unused', team: '', activeStatus: 'active'}});
                }
            }
        }
    },

    maxDistanceTiles: [],

    minCostTiles: [],

    targetCargo: [],


    // Method to get array of tiles in findPath with target cargo ships
    // ----------------------------------------------------------------
    findTarget: function() {
        this.targetCargo = [];
        for (var i = 0; i < col; i++) {
            for (var j = 0; j < row; j++) {
                if ((pieceMovement.findPath[i][j].target == 'cargo') && (gameBoard.boardArray[i][j].pieces.team != 'teamPirate')) {
                    this.targetCargo.push({row: + i, col: + j, distance: + pieceMovement.findPath[i][j].distance, moveCost: + pieceMovement.findPath[i][j].moveCost});
                }
            }
        }
    },

    // Method to get array of tiles in findPath with maximum distance
    // --------------------------------------------------------------
    maxPathDistance: function() {
        this.maxDistanceTiles = [];
        let maxDistance = 1;
        for (var i = 0; i < col; i++) {
            for (var j = 0; j < row; j++) {
                if (pieceMovement.findPath[i][j].activeStatus == 'active') {
                    if (pieceMovement.findPath[i][j].distance > maxDistance) {
                        maxDistance = pieceMovement.findPath[i][j].distance;
                        this.maxDistanceTiles = [];
                        this.maxDistanceTiles.push({row: + i, col: + j, distance: + pieceMovement.findPath[i][j].distance, moveCost: + pieceMovement.findPath[i][j].moveCost});
                        //console.log(this.maxDistanceTiles);
                    } else if (pieceMovement.findPath[i][j].distance == maxDistance) {
                        this.maxDistanceTiles.push({row: + i, col: + j, distance: + pieceMovement.findPath[i][j].distance, moveCost: + pieceMovement.findPath[i][j].moveCost});
                        // Keep - useful for debugging - console.log(this.maxDistanceTiles);
                    }
                }
            }
        }
    },


    // Method to get array of tiles in maxDistanceTiles with minimum cost
    // ------------------------------------------------------------------
    minPathCost: function() {
        this.minCostTiles = [];
        let minCost = 4;
        for (var k = 0; k < this.maxDistanceTiles.length; k++) {
            if (this.maxDistanceTiles[k].moveCost < minCost) {
                minCost = this.maxDistanceTiles[k].moveCost;
                this.minCostTiles = [];
                this.minCostTiles.push(this.maxDistanceTiles[k]);
                //console.log(this.minCostTiles);
            } else if (this.maxDistanceTiles[k].moveCost == minCost) {
                this.minCostTiles.push(this.maxDistanceTiles[k]);
                // Keep - useful for debugging - console.log(this.minCostTiles);
            }
        }
    },
    // LAST BRACKET OF OBJECT
}
