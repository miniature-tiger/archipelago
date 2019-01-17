// Game board constructor - methods to initialise board and array to store current state of board
// ----------------------------------------------------------------------------------------------
function Board (boardDef) {
    // Array to store current state of board
    // -------------------------------------
    this.boardArray = [];
    this.rows = boardDef.rows;
    this.cols = boardDef.cols;
    this.boardShape = boardDef.boardShape;
    this.octagonCorner = boardDef.octagonCorner;
    this.randomIslandPercentage = boardDef.randomIslandPercentage;
    this.playerIslands = boardDef.playerIslands;
    this.kingdomIslands = boardDef.kingdomIslands;
    this.playerShips = boardDef.playerShips;
    this.pirateShips = boardDef.pirateShips;
    this.blankIslands = boardDef.blankIslands;
}

// Method to set up boardArray
// --------------------------
Board.prototype.setupBoardArray = function() {

    // Populate board array - row and col give size of board
    // -----------------------------------------------------
    let populateBoardArray = () => {
        // Create array of objects - rectangular array of y rows of x tiles
        for (let y = 0; y < this.cols; y+=1) {
            let rowArray = [];
            for (let x = 0; x < this.rows; x+=1) {
                rowArray.push({tile: {terrain: 'sea', subTerrain: 'none',  subTerrainTeam: 'none', activeStatus: 'inactive'}, piece: {populatedSquare: false, category: 'none'}});
            }
        this.boardArray.push(rowArray);
        }
    }

    // Add a few random land tiles
    // ---------------------------
    let addRandomLandTiles = () => {
        // Loops through rows and columns and changes sea tile to land island tile
        for (let y = 0; y < this.cols; y+=1) {
            for (let x = 0; x < this.rows; x+=1) {
                // Adds a few random land tiles based on randomIslandPercentage
                if(Math.random() > (1 - this.randomIslandPercentage)) {
                    this.boardArray[x][y].tile.terrain = 'land';
                }
            }
        }
    }

    // Complete the shape of an octagonal board with invisible tiles
    // -------------------------------------------------------------
    let addBoardShape = () => {
        // An octagon shaped board is obtained by making triangles of tiles invisible in the corners
        if (this.boardShape == 'octagon') {
            this.setTerrain(this.overlayTilesTri(0, 0, this.octagonCorner, 'TL'), 'invis', 'none', 'none');
            this.setTerrain(this.overlayTilesTri(0, this.cols-this.octagonCorner, this.octagonCorner, 'TR'), 'invis', 'none', 'none');
            this.setTerrain(this.overlayTilesTri(this.rows-this.octagonCorner, 0, this.octagonCorner, 'BL'), 'invis', 'none', 'none');
            this.setTerrain(this.overlayTilesTri(this.rows-this.octagonCorner, this.cols-this.octagonCorner, this.octagonCorner, 'BR'), 'invis', 'none', 'none');
        }
    }

    // Adds player islands to boardArray
    // -------------------------------------------------------------
    let addPlayerIslands = () => {
        this.playerIslands.forEach((island) => {
            // Adds sea around each island for two tile radius to make sure no adjoining islands (from random island generation)
            const startRow = Math.max(island.row - 2, 0);
            const endRow = Math.min(island.row + 2, this.rows-1);
            const startCol = Math.max(island.col - 2, 0);
            const endCol = Math.min(island.col + 2, this.cols-1);
            this.setTerrain(this.overlayTilesRec(startRow, endRow, startCol, endCol), 'sea', 'none', 'none');
            // Adds player island
            this.setTerrain([island.row, island.col], 'land', 'none', 'none');
            this.addPiece([island.row, island.col], new Settlement(island.category, island.type, island.direction, island.team, 'none', 0, 0, 'none', island.row, island.col));
        });
    }

    // Adds Kingdom islands to boardArray
    // -------------------------------------------------------------
    let addKingdomIslands = () => {
        this.kingdomIslands.forEach((island) => {
            // Adds sea around each island for three tile radius to make sure no adjoining islands (from random island generation)
            const startRow = Math.max(island.row - 3, 0);
            const endRow = Math.min(island.row + 3, this.rows-1);
            const startCol = Math.max(island.col - 3, 0);
            const endCol = Math.min(island.col + 3, this.cols-1);
            this.setTerrain(this.overlayTilesRec(startRow, endRow, startCol, endCol), 'sea', 'none', 'none');
            // Adds land islands and desert pieces in cross pattern
            for (let i = -1; i <= 1; i+=1) {
                for (let j = -1; j <= 1; j+=1) {
                    if (i!=0 && j!=0) {
                        this.setTerrain([island.row+i, island.col+j], 'land', 'none', 'none');
                        this.addPiece([island.row+i, island.col+j], new Resources('Resources', 'desert', 0, island.team, 'none', 0, 0, 'none', island.row+i, island.col+j));
                    }
                }

            }
            // Adds player island
            this.setTerrain([island.row, island.col], 'land', 'none', 'none');
            this.addPiece([island.row, island.col], new Settlement(island.category, island.type, island.direction, island.team, 'none', 0, 0, island.ref, island.row, island.col));
        });
    }

    // Adds player ships to boardArray
    // -------------------------------------------------------------
    let addPlayerShips = () => {
        this.playerShips.forEach((ship) => {
            this.addPiece([ship.row, ship.col], new Transport(ship.category, ship.type, ship.direction, 5, ship.team, 'none', 0, 0, 'none', ship.row, ship.col));
        });
    }

    // Adds pirate ships and pirate harbours to boardArray
    // -------------------------------------------------------------
    let addPirateShips = () => {
        this.pirateShips.forEach((ship) => {
            this.setTerrain([ship.row, ship.col], 'sea', 'pirateHarbour', 'Pirate');
            this.addPiece([ship.row, ship.col], new Transport(ship.category, ship.type, ship.direction, 5, ship.team, 'none', 0, 0, ship.ref, ship.row, ship.col));
        });
    }

    // Adds undiscovered islands to boardArray
    // ---------------------------------------
    let addBlankIslands = () => {
        this.setTerrain(this.blankIslands, 'land', 'none', 'none');
    }

    // Finds and adds safe harbours from pirate ships
    // ----------------------------------------------
    let addSafeHarbours = () => {
        //if(settings.workFlow === true) {console.log('Determine safe harbours: ' + (Date.now() - settings.launchTime)); }
        for (let i = 0; i < this.rows; i+=1) {
            for (let j = 0; j < this.cols; j+=1) {
                if (this.boardArray[i][j].piece.type == 'fort') {
                    let fortTeam = this.boardArray[i][j].piece.team;
                    for (let k = -1; k <= 1; k+=1) {
                        for (let l = -1; l <= 1; l+=1) {
                            if (k===0 || l===0) {
                                if ((i+k >= 0) && (i+k < this.rows)) {
                                    if ((j+l >= 0) && (j+l < this.cols)) {
                                        if (this.boardArray[i+k][j+l].tile.terrain == 'sea') {
                                            this.setTerrain([i+k, j+l], 'sea', 'harbour', fortTeam);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    //  --- Arrow functions are not hoisted and do not bind their own "this" ---
    populateBoardArray();
    addRandomLandTiles();
    addPlayerIslands();
    addKingdomIslands();
    addSafeHarbours();
    addPlayerShips();
    addPirateShips();
    addBoardShape();
    addBlankIslands();
}

// Helper method to generate array of triangular co-ordinates (for terrain board change)
// -------------------------------------------------------------------------------------
// allows specification of size and position of tiles
// TR = top right, BL = bottom left (for right angled corner)
Board.prototype.overlayTilesTri = function(startRow, startCol, size, corner) {
    let bulkArray = [];
    for (i = startRow; i < startRow + size; i+=1) {
        if (corner == "TL") {
            for (j = startCol; j < startCol + size - (i - startRow); j+=1) {
                bulkArray.push([i,j]);
            }
        } else if (corner == "BL") {
            for (j = startCol; j < startCol + (i - startRow) + 1; j+=1) {
                bulkArray.push([i,j]);
            }
        } else if (corner == 'TR') {
            for (j = startCol + (i - startRow); j < startCol + size; j+=1) {
                bulkArray.push([i,j]);
            }
        } else if (corner == 'BR') {
            for (j = startCol + size - (i - startRow) -1; j < startCol + size; j+=1) {
                bulkArray.push([i,j]);
            }
        } else {
            console.log('overlayTilesTri - triangle type not found');
        }
    }
    return bulkArray;
}

// Helper method to to generate rectangular array of coordinates
// --------------------------------------------------------------
// allows specification of size, position and terrain of tiles
Board.prototype.overlayTilesRec = function(startRow, endRow, startCol, endCol) {
    let bulkArray = [];
    for (i = startRow; i <= endRow; i+=1) {
        for (j = startCol; j <= endCol; j+=1) {
            bulkArray.push([i,j]);
        }
    }
    return bulkArray;
}

// Method to change terrain type in boardArray
// -------------------------------------------
Board.prototype.setTerrain = function(coordinates, terrain, subTerrain, subTerrainTeam) {
    if (coordinates[0].constructor === Array) {
        // bulk update
        coordinates.forEach((pair) => {
            this.boardArray[pair[0]][pair[1]].tile.terrain = terrain;
            this.boardArray[pair[0]][pair[1]].tile.subTerrain = subTerrain;
            this.boardArray[pair[0]][pair[1]].tile.subTerrainTeam = subTerrainTeam;
        });
    } else {
        // single update - just makes passing the coordinate prettier i.e. [i,j] vs [[i,j]]
        this.boardArray[coordinates[0]][coordinates[1]].tile.terrain = terrain;
        this.boardArray[coordinates[0]][coordinates[1]].tile.subTerrain = subTerrain;
        this.boardArray[coordinates[0]][coordinates[1]].tile.subTerrainTeam = subTerrainTeam;
    }
}

// Method to build ship
// -------------------------------------------
Board.prototype.buildShip = function(coordinates, type, direction, damageStatus, team, ref) {
    this.addPiece([coordinates[0], coordinates[1]], new Transport('Transport', type, direction, damageStatus, team, 'none', 0, 0, 'none', coordinates[0], coordinates[1]));
}

// Method to add piece to boardArray
// -------------------------------------------
Board.prototype.addPiece = function(coordinates, piece) {
    this.boardArray[coordinates[0]][coordinates[1]].piece = piece;
}

// Method to add piece to boardArray
// -------------------------------------------
Board.prototype.pieceName = function(type) {
    return this.pieceTypes[type].name;
}

// Method to move piece in boardArray
// -------------------------------------------
Board.prototype.movePiece = function(coordStart, coordEnd) {
    let piece = this.boardArray[coordStart[0]][coordStart[1]].piece;
    piece.markUsed();
    if (coordStart[0] !== coordEnd[0] || coordStart[1] !== coordEnd[1]) {
        piece.changeCoordinates(coordEnd[0], coordEnd[1]);
        this.boardArray[coordEnd[0]][coordEnd[1]].piece = piece;
        this.removePiece(coordStart);
    }
    return piece;
}

// Method to remove piece from boardArray
// -------------------------------------------
Board.prototype.removePiece = function(coords) {
    this.boardArray[coords[0]][coords[1]].piece = {populatedSquare: false, category: 'none'};
}

// Method to reset pieces from 'used' to 'unused' once a turn has ended
// --------------------------------------------------------------------
Board.prototype.usedPiecesReset = function() {
    if (settings.workFlow === true) {console.log('Used pieces reset: ' + (Date.now() - settings.launchTime)); }
    for (let y = 0; y < this.cols; y+=1) {
        for (let x = 0; x < this.rows; x+=1) {
            if (this.boardArray[x][y].piece.used === 'used') {
                this.boardArray[x][y].piece.markUnused();
            }
        }
    }
}

// Method to check whether a tile is next to a terrain type
// ------------------------------------------------------------------------------
Board.prototype.checkNextTo = function(coords, terrain) {
    let result = false;
    for (let i=-1; i<=1; i+=1) {
        if ((coords[0] + i >= 0) && (coords[0] + i < this.rows)) {
            for (let j=-1; j<=1; j+=1) {
                if ((coords[1] + j >= 0) && (coords[1] + j < this.cols)) {
                    if (this.boardArray[coords[0] + i][coords[1] + j].tile.terrain === terrain) {
                        result = true;
                    }
                }
            }
        }
    }
    return result;
}

// Method to get array of tiles in findPath which are within defined distance range
// --------------------------------------------------------------------------------
Board.prototype.useTelescope = function(startMove, item, searchRange) {
    if(settings.workFlow === true) {console.log('Use telescope: ' + (Date.now() - settings.launchTime)); }
    searchResult = [];
    for (let i = Math.max(startMove.row - searchRange, 0); i < Math.min(startMove.row + searchRange + 1, this.rows); i+=1) {
        for (let j = Math.max(startMove.col - searchRange, 0); j < Math.min(startMove.col + searchRange + 1, this.cols); j+=1) {
            if (pieceMovement.findPath[i][j][item].length > 0 && pieceMovement.findPath[i][j].pathStatus == true) {
                // Range is based on last tile of active path i.e. where the ship will stop not the final destination - this differs from findpath
                searchResult.push({row: i, col: j, distance: pieceMovement.findPath[i][j].distance, moveCost: pieceMovement.findPath[i][j].moveCost, activeStatus: pieceMovement.findPath[i][j].activeStatus, pathStop: pieceMovement.findPath[i][j].pathStop, pirateRange: pieceMovement.findPath[pieceMovement.findPath[i][j].lastTile.row][pieceMovement.findPath[i][j].lastTile.col].pirateRange});
                searchResult[searchResult.length-1][item] = pieceMovement.findPath[i][j][item];
            }
        }
    }
    return searchResult;
}
