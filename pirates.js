
// Pirates movement object - methods for AI of pirateship movement
let pirates = {

    pirateShips: [
                  {manifest: {ref: 0, homeRow: 5, homeCol: 5, returnRow: 11, returnCol: 11}, start: {row: '', col: ''}, end: {row: '', col: ''}},
                  {manifest: {ref: 1, homeRow: 5, homeCol: 25, returnRow: 11, returnCol: 19}, start: {row: '', col: ''}, end: {row: '', col: ''}},
                  {manifest: {ref: 2, homeRow: 25, homeCol: 5, returnRow: 19, returnCol: 11}, start: {row: '', col: ''}, end: {row: '', col: ''}},
                  {manifest: {ref: 3, homeRow: 25, homeCol: 25, returnRow: 19, returnCol: 19}, start: {row: '', col: ''}, end: {row: '', col: ''}},

    ],

    movementArray: {startEnd: 'start', start: {row: null, col: null, piece: null}, end: {row: null, col: null, piece: null}},

    conflictArray: {conflict: false, start: {row: null, col: null}, end: {row: null, col: null}},

    pirateCount: -1,

    pirateMove: function() {
        if(settings.workFlow === true) {console.log('Pirate ship ' + pirates.pirateCount + ' moves: '+ (Date.now() - settings.launchTime)); }
        if(pirates.pirateCount < pirates.pirateShips.length) {
            // Resets movement and conflict arrays
            this.movementArray = {startEnd: 'start', start: {row: null, col: null, piece: null}, end: {row: null, col: null, piece: null}};
            this.conflictArray = {conflict: false, start: {row: null, col: null}, end: {row: null, col: null}};

            let pathDistance = 0;
            // Starting tile for pirate ship move taken from array of pirate ships
            this.movementArray.start = this.pirateShips[this.pirateCount].start;

            maxMove = gameData.pieceTypes[this.movementArray.start.piece.type].maxMove;

            // Tiles activated which also finds path for moves and target information on reachable area
            // true / false allow red boundaries to be highlighted or not
            let searchRange = 0;
            // Activating tiles and findPath for damaged ships at sea (damageStatus is set to 0 after battle loss)
            if (this.movementArray.start.piece.damageStatus == 0) {
                if(settings.workFlow === true) {console.log('Damaged ship - find paths: '+ (Date.now() - settings.launchTime)); }
                searchRange = Math.max(Math.abs(pirates.pirateShips[pirates.pirateCount].manifest.homeRow - pirates.pirateShips[pirates.pirateCount].start.row), Math.abs(pirates.pirateShips[pirates.pirateCount].manifest.homeCol - pirates.pirateShips[pirates.pirateCount].start.col), 2);
                pieceMovement.activateTiles(this.movementArray.start.row, this.movementArray.start.col, 2.1, searchRange, false, 0);
            // Activating tiles and findPath for undamaged ships (damageStatus is 5 for healthy ships)
            } else if (this.movementArray.start.piece.damageStatus == 5) {
                if(settings.workFlow === true) {console.log('Good ship - find paths: '+ (Date.now() - settings.launchTime)); }
                searchRange = Math.max(Math.abs(pirates.pirateShips[pirates.pirateCount].manifest.returnRow - pirates.pirateShips[pirates.pirateCount].start.row), Math.abs(pirates.pirateShips[pirates.pirateCount].manifest.returnCol - pirates.pirateShips[pirates.pirateCount].start.col), maxMove);
                pieceMovement.activateTiles(this.movementArray.start.row, this.movementArray.start.col, maxMove, searchRange, false, 5);
            // Setting findPath for ships under repair (damageStatus between 0 and 5) to prevent ships moving
            } else {
                pieceMovement.initialisefindPath(this.movementArray.start.row, this.movementArray.start.col);
            }
            //console.log('findPath', pieceMovement.findPath);
            // Redraw active tile layer after activation to show activated tiles
            game.boardDisplay.drawTiles('activeTiles');

            // Deciding move for damaged ships at sea (damageStatus is set to 0 after battle loss)
            if (this.movementArray.start.piece.damageStatus == 0) {
                if(settings.workFlow === true) {console.log('Damaged ship - decide move: '+ (Date.now() - settings.launchTime)); }
                lastTile = pirates.findLastActive(pieceMovement.findPath[pirates.pirateShips[pirates.pirateCount].manifest.homeRow][pirates.pirateShips[pirates.pirateCount].manifest.homeCol].path, 0);
                pirates.pirateShips[pirates.pirateCount].end.row = pieceMovement.findPath[pirates.pirateShips[pirates.pirateCount].manifest.homeRow][pirates.pirateShips[pirates.pirateCount].manifest.homeCol].path[lastTile].fromRow;
                pirates.pirateShips[pirates.pirateCount].end.col = pieceMovement.findPath[pirates.pirateShips[pirates.pirateCount].manifest.homeRow][pirates.pirateShips[pirates.pirateCount].manifest.homeCol].path[lastTile].fromCol;
                pathDistance = 2;

            // Deciding move for undamaged ships (damageStatus is 5 for healthy ships)
            } else if (this.movementArray.start.piece.damageStatus == 5) {
                if (settings.workFlow === true) {console.log('Good ship - decide move: '+ (Date.now() - settings.launchTime)); }
                // Finds targetable Transports within reach, then cuts down array based on distance and move cost
                pirates.targetCargo = pirates.findTarget('All', 'target');
                if (settings.arrayFlow === true) {console.log('targetCargo', pirates.targetCargo);}
                pirates.telescopeCargo = game.board.useTelescope(this.movementArray.start, 'target', maxMove);
                if (settings.arrayFlow === true) {console.log('telescopeCargo', pirates.telescopeCargo);}
                if ((pirates.targetCargo.length > 0) && (pirates.pirateShips[pirates.pirateCount].start.piece.damageStatus != 0)) {
                    // 1 - Look for Transports within wind range
                    if(settings.workFlow === true) {console.log('Move to attack player ship within range: ' + (Date.now() - settings.launchTime)); }
                    pirates.targetCargo = pirates.minArray(pirates.targetCargo, 'distance');
                    pirates.targetCargo = pirates.minArray(pirates.targetCargo, 'moveCost');
                    if(settings.workFlow === true) {console.log('targetCargo - min', pirates.targetCargo);}
                    pathDistance = pirates.targetCargo[0].distance;
                    // Attacks targetable Transports if in range (currently just uses first Transport in array - to improve in future)
                    // Keep - useful for debugging - console.log('found target: ' + pirates.targetCargo[0].row + ' ' + pirates.targetCargo[0].col);
                    lastTile = pirates.findLastActive(pieceMovement.findPath[pirates.targetCargo[0].row][pirates.targetCargo[0].col].path, -1);
                    pirates.pirateShips[pirates.pirateCount].end.row = pieceMovement.findPath[pirates.targetCargo[0].row][pirates.targetCargo[0].col].path[lastTile].fromRow;
                    pirates.pirateShips[pirates.pirateCount].end.col = pieceMovement.findPath[pirates.targetCargo[0].row][pirates.targetCargo[0].col].path[lastTile].fromCol;
                    this.conflictArray = {conflict: true, pirate: {row: pirates.pirateShips[pirates.pirateCount].end.row, col: pirates.pirateShips[pirates.pirateCount].end.col}, ship: {row: pirates.targetCargo[0].row, col: pirates.targetCargo[0].col}};
                } else if (pirates.telescopeCargo.length > 0 && (pirates.pirateShips[pirates.pirateCount].start.piece.damageStatus != 0)) {
                    // 2 - Search for team Transports within telescope range
                    if(settings.workFlow === true) {console.log('Pursue player ship outside move range: ' + (Date.now() - settings.launchTime)); }
                    // Finds Transports within visual range (localMaxMove) then cuts down array based on minimum distance and move cost
                    pirates.telescopeCargo = pirates.minArray(pirates.telescopeCargo, 'distance');
                    pirates.telescopeCargo = pirates.minArray(pirates.telescopeCargo, 'moveCost');
                    pathDistance = pirates.telescopeCargo[0].distance;
                    lastTile = pirates.findLastActive(pieceMovement.findPath[pirates.telescopeCargo[0].row][pirates.telescopeCargo[0].col].path, 0);
                    pirates.pirateShips[pirates.pirateCount].end.row = pieceMovement.findPath[pirates.telescopeCargo[0].row][pirates.telescopeCargo[0].col].path[lastTile].fromRow;
                    pirates.pirateShips[pirates.pirateCount].end.col = pieceMovement.findPath[pirates.telescopeCargo[0].row][pirates.telescopeCargo[0].col].path[lastTile].fromCol;
                } else if (this.outsideRange(this.pirateCount) == true) {
                    if(settings.workFlow === true) {console.log('Pirate ship outside range: ' + (Date.now() - settings.launchTime)); }
                    lastTile = pirates.findLastActive(pieceMovement.findPath[pirates.pirateShips[pirates.pirateCount].manifest.returnRow][pirates.pirateShips[pirates.pirateCount].manifest.returnCol].path, 0);
                    pirates.pirateShips[pirates.pirateCount].end.row = pieceMovement.findPath[pirates.pirateShips[pirates.pirateCount].manifest.returnRow][pirates.pirateShips[pirates.pirateCount].manifest.returnCol].path[lastTile].fromRow;
                    pirates.pirateShips[pirates.pirateCount].end.col = pieceMovement.findPath[pirates.pirateShips[pirates.pirateCount].manifest.returnRow][pirates.pirateShips[pirates.pirateCount].manifest.returnCol].path[lastTile].fromCol;
                } else {
                // 3- If no ships in active range or visual range moves to maximum distance at minimum wind cost
                    if(settings.workFlow === true) {console.log('Finds max distance move at minimum cost: ' + (Date.now() - settings.launchTime)); }
                    pirates.maxDistanceTiles = pirates.maxPathDistance();
                    pirates.minCostTiles = pirates.minArray(pirates.maxDistanceTiles, 'moveCost');
                    pathDistance = pirates.minCostTiles[0].distance;
                    if(settings.workFlow === true) {console.log('minCostTiles', pirates.minCostTiles);}
                    pirates.pirateShips[pirates.pirateCount].end.row = pirates.minCostTiles[0].row;
                    pirates.pirateShips[pirates.pirateCount].end.col = pirates.minCostTiles[0].col;
                }
            // Catching move for ships under repair (damageStatus between 0 and 5)
            } else {
                // No action necessary - included for completion
            }

            // End position for pirate ship confirmed with movement array then move activated and dashboard recalculated
            this.movementArray.end = pirates.pirateShips[pirates.pirateCount].end;
            if(settings.workFlow === true) {
                console.log('Pirates move decided - movement array shown below: '+ (Date.now() - settings.launchTime));
                console.log(this.movementArray);
            }
            pieceMovement.deactivateTiles();
            new Move(this.movementArray.start, this.movementArray.end, 'transport', {}).process();
        }
    },

    // Method to manage automated movement of pirate ship moves
    automatePirates: function() {
        if(settings.workFlow === true) {console.log('Automate pirates - ship to move or completion: ' + (Date.now() - settings.launchTime)); }
        game.boardHolder.endTurn.removeEventListener('click', game.nextTurn);
        boardMarkNode.removeEventListener('click', human.boardHandler);
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
            if(settings.workFlow === true) {console.log('All pirate ships moved. Update dashboards and reset pirate info: ' + (Date.now() - settings.launchTime)); }
            // Update the stock dashboard
            stockDashboard.stockTake();
            stockDashboard.drawStock();

            // Resets pirate ship array once all moves made
            for (var i = 0; i < pirates.pirateShips.length; i++) {
                this.pirateShips[i].start = {row: '', col: ''};
                this.pirateShips[i].end = {row: '', col: ''};
            }
            pirates.pirateCount = -1;
            game.nextTurn();
        }

    },


    // Method to generate a list of pirate ships to move
    // -------------------------------------------------
    populatePirateShipsArray: function() {
        if(settings.workFlow === true) {console.log('Populate pirate ship array: ' + (Date.now() - settings.launchTime)); }
        for (let i = 0; i < game.boardArray.length; i+=1) {
            for (let j = 0; j < game.boardArray[i].length; j+=1) {
                if((game.boardArray[i][j].piece.team === 'Pirate') && (game.boardArray[i][j].piece.category === 'Transport')) {
                    this.pirateShips[game.boardArray[i][j].piece.ref].start = {row: i, col: j, piece: game.boardArray[i][j].piece};
                    this.pirateShips[game.boardArray[i][j].piece.ref].end = {row: i, col: j};
                }
            }
        }
        if (settings.arrayFlow === true) {console.log('pirateShips', JSON.parse(JSON.stringify(this.pirateShips)));}
    },

    maxDistanceTiles: [],

    minCostTiles: [],

    targetCargo: [],

    telescopeCargo: [],

    conflictArray: [],


    // Method to get array of tiles in findPath with given characteristic
    // ------------------------------------------------------------------
    findTarget: function(findPiece, localKey) {
        if(settings.workFlow === true) {console.log('Searching for ' + findPiece + ': ' + (Date.now() - settings.launchTime)); }
        searchResult = [];
        for (var i = 0; i < game.rows; i+=1) {
            for (var j = 0; j < game.cols; j+=1) {
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
        for (var i = 0; i < game.cols; i++) {
            for (var j = 0; j < game.rows; j++) {
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
