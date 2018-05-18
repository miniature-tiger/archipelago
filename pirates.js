
// Pirates movement object - methods for AI of pirateship movement
let pirates = {

    pirateShips: [],

    // Method to manage automated movement of pirate ship moves
    automatePirates: function() {
        // Generate array of all pirate ships to be moved
        this.populatePirateShipsArray();
        let pathDistance = 0;
        //console.log('this.pirateShips', this.pirateShips);
        // Loop through each pirate ship with delay to allow transormations to occur
        let i = 0;
        function moves() {
                // Resets movement array
                pieceMovement.movementArray = {start: {row: '', col: ''}, end: {row: '', col: ''}};

                pathDistance = 0;
                //console.log(' -------------------- pirate ship: ' + i);
                // Starting tile for pirate ship move taken from array of pirate ships
                pieceMovement.movementArray.start = pirates.pirateShips[i].start;
                // Tiles activated which also finds path for moves and target information on reachable area
                // true / false allow red boundaries to be highlighted or not
                if (pieceMovement.movementArray.start.pieces.damageStatus == 'damaged') {
                    pieceMovement.activateTiles(pieceMovement.movementArray.start.row, pieceMovement.movementArray.start.col, 2.1, false, 'damaged');
                } else {
                    pieceMovement.activateTiles(pieceMovement.movementArray.start.row, pieceMovement.movementArray.start.col, maxMove, false, 'good');
                }

                //console.log('findPath', pieceMovement.findPath);
                // Redraw active tile layer after activation to show activated tiles
                gameBoard.drawActiveTiles();
                pirates.conflictArray = {conflict: false, start: {row: '', col: ''}, end: {row: '', col: ''}};
                // Finds targetable cargo ships within reach, then cuts down array based on distance and move cost
                pirates.findTarget();
                pirates.useTelescope();
                if ((pirates.targetCargo.length > 0) && (pirates.pirateShips[i].start.pieces.damageStatus != 'damaged')) {
                    //console.log('targetCargo - before', pirates.targetCargo);
                    pirates.targetCargo = pirates.minArray(pirates.targetCargo, 'distance');
                    pirates.targetCargo = pirates.minArray(pirates.targetCargo, 'moveCost');
                    //console.log('targetCargo - min', pirates.targetCargo);
                    pathDistance = pirates.targetCargo[0].distance;
                    // Attacks targetable cargo ship if in range (currently just uses first cargo ship in array - to improve in future)
                    // Keep - useful for debugging - console.log('found target: ' + pirates.targetCargo[0].row + ' ' + pirates.targetCargo[0].col);
                    lastTile = pirates.findLastActive(pieceMovement.findPath[pirates.targetCargo[0].row][pirates.targetCargo[0].col].path, -1);
                    pirates.pirateShips[i].end.row = pieceMovement.findPath[pirates.targetCargo[0].row][pirates.targetCargo[0].col].path[lastTile].fromRow;
                    pirates.pirateShips[i].end.col = pieceMovement.findPath[pirates.targetCargo[0].row][pirates.targetCargo[0].col].path[lastTile].fromCol;
                    //console.log('launch ship conflict', pirates.pirateShips[i].end.row, pirates.pirateShips[i].end.col, pirates.targetCargo[0].row, pirates.targetCargo[0].col);
                    //pieceMovement.shipConflict(pirates.pirateShips[i].end.row, pirates.pirateShips[i].end.col, pirates.targetCargo[0].row, pirates.targetCargo[0].col);
                    pirates.conflictArray = {conflict: true, pirate: {row: pirates.pirateShips[i].end.row, col: pirates.pirateShips[i].end.col}, ship: {row: pirates.targetCargo[0].row, col: pirates.targetCargo[0].col}};
                } else if (pirates.targetTelescope.length > 0 && (pirates.pirateShips[i].start.pieces.damageStatus != 'damaged')) {
                    // Finds cargo ships within visual range (localMaxMove) then cuts down array based on minimum distance and move cost
                    //console.log('targetTelescope - before', pirates.targetTelescope);
                    pirates.targetTelescope = pirates.minArray(pirates.targetTelescope, 'distance');
                    pirates.targetTelescope = pirates.minArray(pirates.targetTelescope, 'moveCost');
                    //console.log('targetTelescope - min', pirates.targetTelescope);
                    pathDistance = pirates.targetTelescope[0].distance;
                    lastTile = pirates.findLastActive(pieceMovement.findPath[pirates.targetTelescope[0].row][pirates.targetTelescope[0].col].path, 0);
                    pirates.pirateShips[i].end.row = pieceMovement.findPath[pirates.targetTelescope[0].row][pirates.targetTelescope[0].col].path[lastTile].fromRow;
                    pirates.pirateShips[i].end.col = pieceMovement.findPath[pirates.targetTelescope[0].row][pirates.targetTelescope[0].col].path[lastTile].fromCol;
                    //console.log('findLast', pirates.pirateShips[i].end.row, pirates.pirateShips[i].end.col, 0);
                } else {
                    // If no ships in active range or visual range moves to maximum distance at minimum wind cost
                    pirates.maxPathDistance();
                    pirates.minCostTiles = pirates.minArray(pirates.maxDistanceTiles, 'moveCost');
                    pathDistance = pirates.minCostTiles[0].distance;
                    //console.log('minCostTiles', pirates.minCostTiles);
                    // Keep - useful for debugging - console.log('just moving: ' + pirates.minCostTiles[0].row + ' ' + pirates.minCostTiles[0].col);
                    pirates.pirateShips[i].end.row = pirates.minCostTiles[0].row;
                    pirates.pirateShips[i].end.col = pirates.minCostTiles[0].col;
                }
                // End position for pirate ship confirmed with movement array then move activated and dashboard recalculated
                pieceMovement.movementArray.end = pirates.pirateShips[i].end;
                //console.log('pirates movement array', pieceMovement.movementArray);
                pieceMovement.deactivateTiles(maxMove);
                pieceMovement.shipTransition(gameSpeed);

                // Update the stock dashboard
                stockDashboard.stockTake();
                stockDashboard.drawStock();

                // Moves on to next ship
                i+=1;

            // Loops through with delay
            if(i < pirates.pirateShips.length) {
                let conflictDelay = 0;
                if (pirates.conflictArray.conflict == true) {
                    conflictDelay = 5000;
                }
                setTimeout(moves, (500 * pathDistance + conflictDelay) * gameSpeed);

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
                if((gameBoard.boardArray[i][j].pieces.team == 'Pirate') && (gameBoard.boardArray[i][j].pieces.type = 'cargo ship')) {
                    this.pirateShips.push({start: {row: + i, col: + j, pieces: gameBoard.boardArray[i][j].pieces}, end: {row: + i, col: + j}});
                }
            }
        }
    },

    maxDistanceTiles: [],

    minCostTiles: [],

    targetCargo: [],

    targetTelescope: [],

    conflictArray: [],


    // Method to get array of tiles in findPath with target cargo ships
    // ----------------------------------------------------------------
    findTarget: function() {
        this.targetCargo = [];
        for (var i = 0; i < col; i++) {
            for (var j = 0; j < row; j++) {
                if ((pieceMovement.findPath[i][j].target == 'cargo ship') && (gameBoard.boardArray[i][j].pieces.team != 'Pirate') && (gameBoard.boardArray[i][j].pieces.damageStatus != 'damaged') && (pieceMovement.findPath[i][j].activeStatus == 'active')) {
                    this.targetCargo.push({row: + i, col: + j, distance: + pieceMovement.findPath[i][j].distance, moveCost: + pieceMovement.findPath[i][j].moveCost});
                }
            }
        }
        //console.log('targetCargo', this.targetCargo);
    },

    // Method to get array of tiles in findPath which are not active but are within telescope range
    // --------------------------------------------------------------------------------------------
    useTelescope: function() {
        this.targetTelescope = [];
        for (var i = 0; i < col; i++) {
            for (var j = 0; j < row; j++) {
                if ((pieceMovement.findPath[i][j].target == 'cargo ship') && (gameBoard.boardArray[i][j].pieces.team != 'Pirate') && (gameBoard.boardArray[i][j].pieces.damageStatus != 'damaged') && (gameBoard.boardArray[i][j].subTerrain != 'harbour')) {
                    this.targetTelescope.push({row: + i, col: + j, distance: + pieceMovement.findPath[i][j].distance, moveCost: + pieceMovement.findPath[i][j].moveCost});
                }
            }
        }

    },

    // Method to find last active tile on a path
    // -----------------------------------------
    findLastActive: function (localPath, adjustment) {
        let lastTile = 0;
        for (var k = 0; k < localPath.length; k++) {
            //console.log('findLast', k, localPath[k].fromRow, localPath[k].fromCol, pieceMovement.findPath[localPath[k].fromRow][localPath[k].fromCol].activeStatus);
            if(pieceMovement.findPath[localPath[k].fromRow][localPath[k].fromCol].activeStatus == 'active') {
                lastTile = k + adjustment;
                //console.log('lastTile', lastTile);
            }
        }
        return lastTile;
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
                        //console.log('greater than', this.maxDistanceTiles);
                    } else if (pieceMovement.findPath[i][j].distance == maxDistance) {
                        this.maxDistanceTiles.push({row: + i, col: + j, distance: + pieceMovement.findPath[i][j].distance, moveCost: + pieceMovement.findPath[i][j].moveCost});
                        //console.log('equal to', this.maxDistanceTiles);
                    }
                }
            }
        }
        //console.log('maxDistanceTile', this.maxDistanceTiles);
    },

    // Method to reduce array of objects based on minimum value of one property
    // ------------------------------------------------------------------------
    minArray: function(localArray, localProperty) {
        let resultArray = [];
        let minCost = localArray[0][localProperty];
        for (var k = 0; k < localArray.length; k++) {
            if (localArray[k][localProperty] < minCost) {
                minCost = localArray[k][localProperty];
                resultArray = [];
                resultArray.push(localArray[k]);
            } else if (localArray[k][localProperty] == minCost) {
                resultArray.push(localArray[k]);
            }
        }
        return resultArray;
    },

    safeHarbour: function() {
        for (var i = 0; i < row; i++) {
            for (var j = 0; j < col; j++) {
                if (gameBoard.boardArray[i][j].pieces.type == 'fort') {
                    for (var k = -1; k <= 1; k++) {
                        for (var l = -1; l <= 1; l++) {
                            if ((i+k >= 0) && (i+k < row)) {
                                if ((j+l >= 0) && (j+l < col)) {
                                    if (gameBoard.boardArray[i+k][j+l].terrain == 'sea') {
                                        gameBoard.boardArray[i+k][j+l].subTerrain = 'harbour';
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    },

    // LAST BRACKET OF OBJECT
}
