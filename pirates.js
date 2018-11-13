
// Pirates movement object - methods for AI of pirateship movement
let pirates = {

    pirateShips: [
                  {manifest: {ref: 0, homeRow: 5, homeCol: 5, returnRow: 11, returnCol: 11}, start: {row: '', col: ''}, end: {row: '', col: ''}},
                  {manifest: {ref: 1, homeRow: 25, homeCol: 5, returnRow: 19, returnCol: 11}, start: {row: '', col: ''}, end: {row: '', col: ''}},
                  {manifest: {ref: 2, homeRow: 25, homeCol: 25, returnRow: 19, returnCol: 19}, start: {row: '', col: ''}, end: {row: '', col: ''}},
                  {manifest: {ref: 3, homeRow: 5, homeCol: 25, returnRow: 11, returnCol: 19}, start: {row: '', col: ''}, end: {row: '', col: ''}},
    ],

    pirateCount: -1,

    pirateMove: function() {
        if(workFlow == 1) {console.log('Pirate ship ' + pirates.pirateCount + ' moves: '+ (Date.now() - launchTime)); }
        if(pirates.pirateCount < pirates.pirateShips.length) {
            // Resets movement array
            pieceMovement.movementArray = {start: {row: '', col: ''}, end: {row: '', col: ''}};
            pirates.conflictArray = {conflict: false, start: {row: '', col: ''}, end: {row: '', col: ''}};

            let pathDistance = 0;
            // Starting tile for pirate ship move taken from array of pirate ships
            pieceMovement.movementArray.start = pirates.pirateShips[pirates.pirateCount].start;

            maxMove = 0;
            let arrayPosition = stockDashboard.pieceTypes.findIndex(k => k.type == pieceMovement.movementArray.start.pieces.type);
            if (arrayPosition != -1) {
                maxMove = stockDashboard.pieceTypes[arrayPosition].maxMove;
            }

            // Tiles activated which also finds path for moves and target information on reachable area
            // true / false allow red boundaries to be highlighted or not
            let searchRange = 0;
            // Activating tiles and findPath for damaged ships at sea (damageStatus is set to 0 after battle loss)
            if (pieceMovement.movementArray.start.pieces.damageStatus == 0) {
                if(workFlow == 1) {console.log('Damaged ship - find paths: '+ (Date.now() - launchTime)); }
                searchRange = Math.max(Math.abs(pirates.pirateShips[pirates.pirateCount].manifest.homeRow - pirates.pirateShips[pirates.pirateCount].start.row), Math.abs(pirates.pirateShips[pirates.pirateCount].manifest.homeCol - pirates.pirateShips[pirates.pirateCount].start.col), 2);
                pieceMovement.activateTiles(pieceMovement.movementArray.start.row, pieceMovement.movementArray.start.col, 2.1, searchRange, false, 0);
            // Activating tiles and findPath for undamaged ships (damageStatus is 5 for healthy ships)
            } else if (pieceMovement.movementArray.start.pieces.damageStatus == 5) {
                if(workFlow == 1) {console.log('Good ship - find paths: '+ (Date.now() - launchTime)); }
                searchRange = Math.max(Math.abs(pirates.pirateShips[pirates.pirateCount].manifest.returnRow - pirates.pirateShips[pirates.pirateCount].start.row), Math.abs(pirates.pirateShips[pirates.pirateCount].manifest.returnCol - pirates.pirateShips[pirates.pirateCount].start.col), maxMove);
                pieceMovement.activateTiles(pieceMovement.movementArray.start.row, pieceMovement.movementArray.start.col, maxMove, searchRange, false, 5);
            // Setting findPath for ships under repair (damageStatus between 0 and 5) to prevent ships moving
            } else {
                pieceMovement.initialisefindPath(pieceMovement.movementArray.start.row, pieceMovement.movementArray.start.col);
            }
            //console.log('findPath', pieceMovement.findPath);
            // Redraw active tile layer after activation to show activated tiles
            gameBoard.drawActiveTiles();

            // Deciding move for damaged ships at sea (damageStatus is set to 0 after battle loss)
            if (pieceMovement.movementArray.start.pieces.damageStatus == 0) {
                if(workFlow == 1) {console.log('Damaged ship - decide move: '+ (Date.now() - launchTime)); }
                lastTile = pirates.findLastActive(pieceMovement.findPath[pirates.pirateShips[pirates.pirateCount].manifest.homeRow][pirates.pirateShips[pirates.pirateCount].manifest.homeCol].path, 0);
                pirates.pirateShips[pirates.pirateCount].end.row = pieceMovement.findPath[pirates.pirateShips[pirates.pirateCount].manifest.homeRow][pirates.pirateShips[pirates.pirateCount].manifest.homeCol].path[lastTile].fromRow;
                pirates.pirateShips[pirates.pirateCount].end.col = pieceMovement.findPath[pirates.pirateShips[pirates.pirateCount].manifest.homeRow][pirates.pirateShips[pirates.pirateCount].manifest.homeCol].path[lastTile].fromCol;
                pathDistance = 2;

            // Deciding move for undamaged ships (damageStatus is 5 for healthy ships)
            } else if (pieceMovement.movementArray.start.pieces.damageStatus == 5) {
                if(workFlow == 1) {console.log('Good ship - decide move: '+ (Date.now() - launchTime)); }
                // Finds targetable Transports within reach, then cuts down array based on distance and move cost
                pirates.targetCargo = pirates.findTarget('All', 'target');
                if(arrayFlow == 1) {console.log('targetCargo', pirates.targetCargo);}
                pirates.telescopeCargo = pirates.useTelescope('All', 'target', maxMove);
                if(arrayFlow == 1) {console.log('telescopeCargo', pirates.telescopeCargo);}
                if ((pirates.targetCargo.length > 0) && (pirates.pirateShips[pirates.pirateCount].start.pieces.damageStatus != 0)) {
                    // 1 - Look for Transports within wind range
                    if(workFlow == 1) {console.log('Move to attack player ship within range: ' + (Date.now() - launchTime)); }
                    pirates.targetCargo = pirates.minArray(pirates.targetCargo, 'distance');
                    pirates.targetCargo = pirates.minArray(pirates.targetCargo, 'moveCost');
                    if(workFlow == 1) {console.log('targetCargo - min', pirates.targetCargo);}
                    pathDistance = pirates.targetCargo[0].distance;
                    // Attacks targetable Transports if in range (currently just uses first Transport in array - to improve in future)
                    // Keep - useful for debugging - console.log('found target: ' + pirates.targetCargo[0].row + ' ' + pirates.targetCargo[0].col);
                    lastTile = pirates.findLastActive(pieceMovement.findPath[pirates.targetCargo[0].row][pirates.targetCargo[0].col].path, -1);
                    pirates.pirateShips[pirates.pirateCount].end.row = pieceMovement.findPath[pirates.targetCargo[0].row][pirates.targetCargo[0].col].path[lastTile].fromRow;
                    pirates.pirateShips[pirates.pirateCount].end.col = pieceMovement.findPath[pirates.targetCargo[0].row][pirates.targetCargo[0].col].path[lastTile].fromCol;
                    pirates.conflictArray = {conflict: true, pirate: {row: pirates.pirateShips[pirates.pirateCount].end.row, col: pirates.pirateShips[pirates.pirateCount].end.col}, ship: {row: pirates.targetCargo[0].row, col: pirates.targetCargo[0].col}};
                } else if (pirates.telescopeCargo.length > 0 && (pirates.pirateShips[pirates.pirateCount].start.pieces.damageStatus != 0)) {
                    // 2 - Search for team Transports within telescope range
                    if(workFlow == 1) {console.log('Pursue player ship outside move range: ' + (Date.now() - launchTime)); }
                    // Finds Transports within visual range (localMaxMove) then cuts down array based on minimum distance and move cost
                    pirates.telescopeCargo = pirates.minArray(pirates.telescopeCargo, 'distance');
                    pirates.telescopeCargo = pirates.minArray(pirates.telescopeCargo, 'moveCost');
                    pathDistance = pirates.telescopeCargo[0].distance;
                    lastTile = pirates.findLastActive(pieceMovement.findPath[pirates.telescopeCargo[0].row][pirates.telescopeCargo[0].col].path, 0);
                    pirates.pirateShips[pirates.pirateCount].end.row = pieceMovement.findPath[pirates.telescopeCargo[0].row][pirates.telescopeCargo[0].col].path[lastTile].fromRow;
                    pirates.pirateShips[pirates.pirateCount].end.col = pieceMovement.findPath[pirates.telescopeCargo[0].row][pirates.telescopeCargo[0].col].path[lastTile].fromCol;
                } else if (this.outsideRange(this.pirateCount) == true) {
                    if(workFlow == 1) {console.log('Pirate ship outside range: ' + (Date.now() - launchTime)); }
                    lastTile = pirates.findLastActive(pieceMovement.findPath[pirates.pirateShips[pirates.pirateCount].manifest.returnRow][pirates.pirateShips[pirates.pirateCount].manifest.returnCol].path, 0);
                    pirates.pirateShips[pirates.pirateCount].end.row = pieceMovement.findPath[pirates.pirateShips[pirates.pirateCount].manifest.returnRow][pirates.pirateShips[pirates.pirateCount].manifest.returnCol].path[lastTile].fromRow;
                    pirates.pirateShips[pirates.pirateCount].end.col = pieceMovement.findPath[pirates.pirateShips[pirates.pirateCount].manifest.returnRow][pirates.pirateShips[pirates.pirateCount].manifest.returnCol].path[lastTile].fromCol;
                } else {
                // 3- If no ships in active range or visual range moves to maximum distance at minimum wind cost
                    if(workFlow == 1) {console.log('Finds max distance move at minimum cost: ' + (Date.now() - launchTime)); }
                    pirates.maxDistanceTiles = pirates.maxPathDistance();
                    pirates.minCostTiles = pirates.minArray(pirates.maxDistanceTiles, 'moveCost');
                    pathDistance = pirates.minCostTiles[0].distance;
                    if(workFlow == 1) {console.log('minCostTiles', pirates.minCostTiles);}
                    pirates.pirateShips[pirates.pirateCount].end.row = pirates.minCostTiles[0].row;
                    pirates.pirateShips[pirates.pirateCount].end.col = pirates.minCostTiles[0].col;
                }
            // Catching move for ships under repair (damageStatus between 0 and 5)
            } else {
                // No action necessary - included for completion
            }


            // End position for pirate ship confirmed with movement array then move activated and dashboard recalculated
            pieceMovement.movementArray.end = pirates.pirateShips[pirates.pirateCount].end;
            if(workFlow == 1) {
                console.log('Pirates move decided - movement array shown below: '+ (Date.now() - launchTime));
                console.log(pieceMovement.movementArray);
            }
            pieceMovement.deactivateTiles();
            pieceMovement.shipTransition(gameSpeed);

        }
    },

    // Method to manage automated movement of pirate ship moves
    automatePirates: function() {
        if(workFlow == 1) {console.log('Automate pirates - ship to move or completion: ' + (Date.now() - launchTime)); }
        endTurn.removeEventListener('click', gameManagement.nextTurn);
        boardMarkNode.removeEventListener('click', boardHandler);
        if (pirates.pirateCount == -1) {
            // Generate array of all pirate ships to be moved
            this.populatePirateShipsArray();
            stockDashboard.drawStock();
            tradeContracts.drawContracts();
        }
        // Moves on to next ship
        pirates.pirateCount +=1;

        let pathDistance = 0;
        // Loop through each pirate ship
        if(pirates.pirateCount < pirates.pirateShips.length) {
            // Calls function above
            pirates.pirateMove();
        } else {
            if(workFlow == 1) {console.log('All pirate ships moved. Update dashboards and reset pirate info: ' + (Date.now() - launchTime)); }
            // Update the stock dashboard
            stockDashboard.stockTake();
            stockDashboard.drawStock();

            // Resets pirate ship array once all moves made
            for (var i = 0; i < pirates.pirateShips.length; i++) {
                this.pirateShips[i].start = {row: '', col: ''};
                this.pirateShips[i].end = {row: '', col: ''};
            }
            pirates.pirateCount = -1;
            endTurn.addEventListener('click', gameManagement.nextTurn);
            boardMarkNode.addEventListener('click', boardHandler);
            stockDashboardNode.addEventListener('click', buildItem.clickStock);
            stockDashboardNode.addEventListener('mouseover', stockDashboard.hoverPieceOn);
            stockDashboardNode.addEventListener('mouseleave', gameBoard.clearHighlightTiles);
        }

    },


    // Method to generate a list of pirate ships to move
    // -------------------------------------------------
    populatePirateShipsArray: function() {
        if(workFlow == 1) {console.log('Populate pirate ship array: ' + (Date.now() - launchTime)); }
        for (var i = 0; i < gameBoard.boardArray.length; i++) {
            for (var j = 0; j < gameBoard.boardArray[i].length; j++) {
                if((gameBoard.boardArray[i][j].pieces.team == 'Pirate') && (gameBoard.boardArray[i][j].pieces.category == 'Transport')) {
                    this.pirateShips[gameBoard.boardArray[i][j].pieces.ref].start = {row: + i, col: + j, pieces: gameBoard.boardArray[i][j].pieces};
                    this.pirateShips[gameBoard.boardArray[i][j].pieces.ref].end = {row: + i, col: + j};
                }
            }
        }
    },

    maxDistanceTiles: [],

    minCostTiles: [],

    targetCargo: [],

    telescopeCargo: [],

    conflictArray: [],


    // Method to get array of tiles in findPath with given characteristic
    // ------------------------------------------------------------------
    findTarget: function(findPiece, localKey) {
        if(workFlow == 1) {console.log('Searching for ' + findPiece + ': ' + (Date.now() - launchTime)); }
        searchResult = [];
        for (var i = 0; i < row; i++) {
            for (var j = 0; j < col; j++) {
                if (findPiece == 'All') {
                    if ((pieceMovement.findPath[i][j][localKey].length > 0) && (pieceMovement.findPath[i][j].activeStatus == 'active')) {
                        searchResult.push({row: i, col: j, distance: pieceMovement.findPath[i][j].distance, moveCost: pieceMovement.findPath[i][j].moveCost, type: pieceMovement.findPath[i][j][localKey]});
                    }
                } else {
                    //if ((pieceMovement.findPath[i][j][localKey].type.includes(findPiece)) && (pieceMovement.findPath[i][j].activeStatus == 'active')) {
                    //    console.log('localkey.type', pieceMovement.findPath[i][j][localKey].type);
                    //    searchResult.push({row: i, col: j, distance: pieceMovement.findPath[i][j].distance, moveCost: pieceMovement.findPath[i][j].moveCost, type: pieceMovement.findPath[i][j][localKey].type});
                    //}
                }
            }
        }
        return searchResult;
    },

    // Method to get array of tiles in findPath which are within defined range
    // -----------------------------------------------------------------------
    useTelescope: function(findPiece, localKey, searchRange) {
        if(workFlow == 1) {console.log('Use telescope: ' + (Date.now() - launchTime)); }
        searchResult = [];

        for (var i = Math.max(pieceMovement.movementArray.start.row - searchRange, 0); i < Math.min(pieceMovement.movementArray.start.row + searchRange + 1, row); i++) {
            for (var j = Math.max(pieceMovement.movementArray.start.col - searchRange, 0); j < Math.min(pieceMovement.movementArray.start.col + searchRange + 1, col); j++) {
                if (findPiece = 'All') {
                    if (pieceMovement.findPath[i][j][localKey].length > 0 && pieceMovement.findPath[i][j].pathStatus == true) {
                        // Pirate range is based on last tile of active path i.e. where the ship will stop not the final destination - this differs from findpath 
                        searchResult.push({row: i, col: j, distance: pieceMovement.findPath[i][j].distance, moveCost: pieceMovement.findPath[i][j].moveCost, activeStatus: pieceMovement.findPath[i][j].activeStatus, pathStop: pieceMovement.findPath[i][j].pathStop, pirateRange: pieceMovement.findPath[pieceMovement.findPath[i][j].lastTile.row][pieceMovement.findPath[i][j].lastTile.col].pirateRange});
                        searchResult[searchResult.length-1][localKey] = pieceMovement.findPath[i][j][localKey];
                    }
                } else {
                  //  if (pieceMovement.findPath[i][j][localKey].type.includes(findPiece) && pieceMovement.findPath[i][j].pathStatus == true) {
                  //      searchResult.push({row: i, col: j, distance: pieceMovement.findPath[i][j].distance, moveCost: pieceMovement.findPath[i][j].moveCost, type: pieceMovement.findPath[i][j][localKey].type, activeStatus: pieceMovement.findPath[i][j].activeStatus, pathStop: pieceMovement.findPath[i][j].pathStop.type, pirateRange: pieceMovement.findPath[pieceMovement.findPath[i][j].lastTile.row][pieceMovement.findPath[i][j].lastTile.col].pirateRange.type});
                  //  }
                }
            }
        }
        return searchResult;
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
        localMaxDistanceTiles = [];
        let maxDistance = 1;
        for (var i = 0; i < col; i++) {
            for (var j = 0; j < row; j++) {
                if (pieceMovement.findPath[i][j].activeStatus == 'active') {
                    if (pieceMovement.findPath[i][j].distance > maxDistance) {
                        maxDistance = pieceMovement.findPath[i][j].distance;
                        localMaxDistanceTiles = [];
                        localMaxDistanceTiles.push({row: + i, col: + j, distance: + pieceMovement.findPath[i][j].distance, moveCost: + pieceMovement.findPath[i][j].moveCost});
                        //console.log('greater than', this.maxDistanceTiles);
                    } else if (pieceMovement.findPath[i][j].distance == maxDistance) {
                        localMaxDistanceTiles.push({row: + i, col: + j, distance: + pieceMovement.findPath[i][j].distance, moveCost: + pieceMovement.findPath[i][j].moveCost});
                        //console.log('equal to', this.maxDistanceTiles);
                    }
                }
            }
        }
        return localMaxDistanceTiles;
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

    // Finds safe harbours from pirate ships
    // -------------------------------------
    safeHarbour: function() {
        if(workFlow == 1) {console.log('Determine safe harbours: ' + (Date.now() - launchTime)); }
        for (var i = 0; i < row; i++) {
            for (var j = 0; j < col; j++) {
                if (gameBoard.boardArray[i][j].pieces.type == 'fort') {
                    let fortTeam = gameBoard.boardArray[i][j].pieces.team;
                    for (var k = -1; k <= 1; k++) {
                        for (var l = -1; l <= 1; l++) {
                            if ((i+k >= 0) && (i+k < row)) {
                                if ((j+l >= 0) && (j+l < col)) {
                                    if (gameBoard.boardArray[i+k][j+l].terrain == 'sea') {
                                        gameBoard.boardArray[i+k][j+l].subTerrain = 'harbour';
                                        gameBoard.boardArray[i+k][j+l].subTerrainTeam = fortTeam;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    },

    // Determines if pirate ships have strayed too far from their range
    // ----------------------------------------------------------------
    outsideRange: function(shipNumber) {
        if (pirates.pirateShips[shipNumber].manifest.returnRow < 15 && pirates.pirateShips[shipNumber].start.row > 15) {
            return true;
        } else if (pirates.pirateShips[shipNumber].manifest.returnRow > 15 && pirates.pirateShips[shipNumber].start.row < 15) {
            return true;
        } else if (pirates.pirateShips[shipNumber].manifest.returnCol < 15 && pirates.pirateShips[shipNumber].start.col > 15) {
            return true;
        } else if (pirates.pirateShips[shipNumber].manifest.returnCol > 15 && pirates.pirateShips[shipNumber].start.col < 15) {
            return true;
        } else {
            return false;
        }
    },

    // LAST BRACKET OF OBJECT
}
