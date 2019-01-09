// Pieces movement object - methods to allow valid moves to be chosen and validated


let pieceMovement = {

    // Array to store movement variables
    // Future update: capture all movements (to allow potential for replay and undo)
    // -----------------------------------------------------------------------------

    findPath: [],

    movementDirection: [[-45, -90, -135], [0, 0, 180], [45, 90, 135]],

    // Method to activate tiles to which a ship can move
    // -------------------------------------------------
    // Now includes:
    //    path around obstacles
    //    movement costs for each direction integrated with compass needle direction
    activateTiles: function(startRow, startCol, maxMove, searchRadius, displayActive, damagedStatus) {
        if(settings.workFlow === true) {console.log('Active tiles and paths determined: ' + (Date.now() - settings.launchTime)); }
        // Initialises findPath array which holds board size array of
        // active/inactive status, movement cost to reach that tile, path to that tile
        this.initialisefindPath(startRow, startCol);

        // Add detail of ships and harbours to find path array
        this.paintFindPath();

        // Sets clicked piece status to active as starting point of chain reaction of setting active status
        //if (displayActive) {
        //    game.boardArray[startRow][startCol].tile.activeStatus = 'active';
        //}
        this.findPath[startRow][startCol].pathStatus = true;

        // Loops through maxMove loops
        // Each loop searches for tiles within one tile reach of a previously activated tile
        // When the cost is less than maxMove the tile is activated
        // Tile paths are searched even beyond the active boundary for "telescope" purposes for pirate ships
        // First search (k=0) takes each "found" tile within 1x1 grid around piece (i.e. just the piece itself) then uses
        // activeTiles to search in 3x3 grid around this tile
        // Second search (k=1) takes each "found" tile within a 3x3 grid of the piece (i.e. within one tile move reach of the piece) then uses
        // activeTiles to search in 3x3 grid around each of these active tiles
        // Third search (k=2) takes each "found" tile within a 5x5 grid of the piece (i.e. within two tile move reach of the piece) then uses
        // activeTiles to search in 3x3 grid around each of these "found" tiles (making a maximum potential maxMove tile distance from the piece for active and found tiles)
        for (var k = 0; k < searchRadius; k++) {
            //console.log('k loop', k);
            // Loops through i rows and j columns to form the 3x3 etc grids
            for (var i = -k; i < k+1; i++) {
                // Restrict by map size for rows so not searching off edge of board
                if(startRow+i>=0 && startRow+i <game.rows) {
                    for (var j = -k; j < k+1; j++) {
                        // Restrict by map size for columns so not searching off edge of board
                        if(startCol+j >=0 && startCol+j <game.cols) {
                            // Checks if tile is found. If so runs activeTiles to search for potential tiles to activate around it.
                            // Does not check tiles if pathStop is active (pathStop prevents ships moving through harbours or other ships)
                            if ((this.findPath[startRow+i][startCol+j].pathStatus == true) && (this.findPath[startRow+i][startCol+j].pathStop.length < 1 || k == 0)) {
                                //Keep useful for debugging - console.log('run: ' + k);
                                //Keep useful for debugging - console.log('starting from: row: ' + (startRow+i) + ' col: ' + (startCol+j) + ' prior cost: ' + this.findPath[startRow+i][startCol+j].moveCost);
                                this.activeTiles(startRow+i, startCol+j, this.findPath[startRow+i][startCol+j].moveCost, maxMove, displayActive, k, damagedStatus);
                            }
                        }
                    }
                }
            }
        }
        // At end of search sets piece square back to inactive as you cannot move a piece to its own square
        //this.findPath[startRow][startCol].activeStatus = 'inactive';
        //if (displayActive) {
        //    game.boardArray[startRow][startCol].tile.activeStatus = 'inactive';
        //}

        // Add further detail of last tiles to find path array
        this.postPaintFindPath()
    },

    initialisefindPath: function(startRow, startCol) {
    // Initialises findPath array which holds board size (i rows x j columns) array of:
    // active/inactive status and pathStatus
    // movement cost and distance to reach that tile
    // path to that tile
    // info on that tile such as presence of ships or harbours
        for (var i = 0; i < game.cols; i++) {
            let localMoveRow = [];
            for (var j = 0; j < game.rows; j++) {
                localMoveRow[j] = {pathStatus: false, activeStatus: 'inactive', moveCost: 0, distance: 0, target: [], resourceHarbour: [], harbour: [], pathStop: [], lastTile: {row: undefined, col: undefined}, pirateRange: [], path: [{fromRow: +startRow , fromCol: +startCol}]};
            }
            this.findPath[i] = localMoveRow;
        }
    },

    activeTiles: function(startRow, startCol, localCumulMoveCost, maxMove, displayActive, k, damagedStatus) {
        // activeTiles searches a 3x3 grid around the passed ("found") tile reference to find more potential tiles
        // Restrictions on "found" tiles and activation are: board size, land and occupied pieces, total available move cost to reach tile
        // Total available move cost is currently set to MaxMove (i.e you can move a total of x tiles or equivalent adjusted by wind) - this may be changed in future
        // If a second path arrives at an already activated tile with a cheaper cost this path replaces the existing findPath
        // The path and costs are built up in the findPath array

        // Initialise local variable for cumulative cost of reaching tile
        let tileCumulMoveCost = 0;

        // Loop through rows
        for (var i = -1; i <= 1; i++) {
            // Restrict by map size for rows
            if(startRow+i>=0 && startRow+i < game.rows) {
                // Loop through columns
                for (var j = -1; j <= 1; j++) {
                    // Restrict by map size for columns
                    if(startCol+j >=0 && startCol+j < game.cols) {
                        // Restrict for land squares ( ---- and objects ---- )
                        // if (game.boardArray[startRow+i][startCol+j].tile.terrain == 'sea' && game.boardArray[startRow+i][startCol+j].pieces.populatedSquare == false) {
                        if (game.boardArray[startRow+i][startCol+j].tile.terrain == 'sea') {
                            if (!((game.boardArray[startRow+i][startCol+j].tile.subTerrain == 'harbour') && (game.turn == 'Pirate')) ) {
                                // Aggregate cost of reaching tile in tileCumulMoveCost - add the exiting cost to the cost for reaching the new tile from moveCost
                                //console.log('row: ' + (startRow+i) + ' col: ' + (startCol+j) + ' prior cost: ' + localCumulMoveCost + ' new cost: ' + this.moveCost(startRow, startCol ,startRow+i, startCol+j, needleDirection))
                                if (damagedStatus == 0) {
                                    tileCumulMoveCost = localCumulMoveCost + 1;
                                } else if (localCumulMoveCost > maxMove) {
                                    tileCumulMoveCost = localCumulMoveCost + 1;
                                } else {
                                    tileCumulMoveCost = localCumulMoveCost + this.moveCost(startRow, startCol ,startRow+i, startCol+j, compass.needleDirection);
                                }
                                // Restrict activation by Maximum Cost of reaching a tile (allows wind direction to be factored in to move)
                                //if (tileCumulMoveCost <= maxMove) {
                                // Separate newly found tiles from previously found tiles
                                if (this.findPath[startRow+i][startCol+j].pathStatus == true) {
                                    // Logic for already active tiles - is the new path cheaper in moveCost?
                                    if (tileCumulMoveCost < this.findPath[startRow+i][startCol+j].moveCost) {
                                        // Necessary as a few tiles will be "found" for the first time whilst being over the maxMove level for activation
                                        if (tileCumulMoveCost < maxMove) {
                                            this.findPath[startRow+i][startCol+j].activeStatus = 'active';
                                            if (displayActive) {
                                                game.boardArray[startRow+i][startCol+j].tile.activeStatus = 'active';
                                            }
                                        }
                                        // Keep useful for debugging - console.log('already active logic is used:');
                                        //console.log('change to active tile - pre:', startRow+i, startCol+j, this.findPath[startRow+i][startCol+j], 'from ' + startRow + '-' + startCol, this.findPath[startRow][startCol]);
                                        // Update the cost, add the inherited path from the previous moved-to tile, push the path for the new tile
                                        this.findPath[startRow+i][startCol+j].moveCost = Number(tileCumulMoveCost.toFixed(2));
                                        this.findPath[startRow+i][startCol+j].path = this.findPath[startRow][startCol].path.slice(0);
                                        this.findPath[startRow+i][startCol+j].path.push({fromRow: +(startRow+i) , fromCol: +(startCol+j)});
                                        this.findPath[startRow+i][startCol+j].distance = this.findPath[startRow+i][startCol+j].path.length-1;
                                        //console.log('change to active tile - post:', startRow+i, startCol+j, this.findPath[startRow+i][startCol+j], 'from ' + startRow + '-' + startCol, this.findPath[startRow][startCol]);
                                    }
                                // Logic for unfound tiles that have met all criteria - make pathStatus as true!
                                } else if (this.findPath[startRow+i][startCol+j].pathStatus == false) {
                                    //console.log('new pre-activation:', startRow+i, startCol+j, this.findPath[startRow+i][startCol+j], 'from ' + startRow + '-' + startCol, this.findPath[startRow][startCol]);
                                    this.findPath[startRow+i][startCol+j].pathStatus = true;
                                    // Activate tiles if constraints are met
                                    if (tileCumulMoveCost < maxMove) {
                                        this.findPath[startRow+i][startCol+j].activeStatus = 'active';
                                        if (displayActive) {
                                            game.boardArray[startRow+i][startCol+j].tile.activeStatus = 'active';
                                        }
                                    }
                                    // Update the cost, add the inherited path from the previous moved-to tile, push the path for the new tile
                                    this.findPath[startRow+i][startCol+j].moveCost = Number(tileCumulMoveCost.toFixed(2));

                                    this.findPath[startRow+i][startCol+j].path = this.findPath[startRow][startCol].path.slice(0);
                                    this.findPath[startRow+i][startCol+j].path.push({fromRow: +(startRow+i) , fromCol: +(startCol+j)});
                                    this.findPath[startRow+i][startCol+j].distance = this.findPath[startRow+i][startCol+j].path.length-1;
                                    //console.log('new post-activation:', startRow+i, startCol+j, this.findPath[startRow+i][startCol+j], 'from ' + startRow + '-' + startCol, this.findPath[startRow][startCol]);
                                    //Keep useful for debugging - console.log('row: ' + (startRow+i) + ' col: ' + (startCol+j) + ' set to: ' + this.findPath[startRow+i][startCol+j].activeStatus + ' with cost: ' + this.findPath[startRow+i][startCol+j].moveCost + ' and distance: ' + this.findPath[startRow+i][startCol+j].distance);
                                }

                                // Sets Transport tile to inactive to prevent moving there
                                if (game.boardArray[startRow+i][startCol+j].piece.category == 'Transport') {
                                    if (game.turn != 'Pirate') {
                                        this.findPath[startRow+i][startCol+j].activeStatus = 'inactive';
                                        game.boardArray[startRow+i][startCol+j].tile.activeStatus = 'inactive';
                                    // Prevents pirate ships being activated on pirate ship moves
                                    } else if (this.findPath[startRow+i][startCol+j].team == 'Pirate') {
                                        this.findPath[startRow+i][startCol+j].activeStatus = 'inactive';
                                        game.boardArray[startRow+i][startCol+j].tile.activeStatus = 'inactive';
                                    } else if (game.boardArray[startRow+i][startCol+j].piece.damageStatus == 0) {
                                        this.findPath[startRow+i][startCol+j].activeStatus = 'inactive';
                                        game.boardArray[startRow+i][startCol+j].tile.activeStatus = 'inactive';
                                    } else if (game.boardArray[startRow][startCol].piece.damageStatus == 0) {
                                        this.findPath[startRow+i][startCol+j].activeStatus = 'inactive';
                                        game.boardArray[startRow+i][startCol+j].tile.activeStatus = 'inactive';
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    },

    // Method adds detail of targets and pieces to tiles within findPath - this information can be generated before findPath
    // ---------------------------------------------------------------------------------------------------------------------
    paintFindPath: function() {
        for (var i = 0; i < game.cols; i++) {
            for (var j = 0; j < game.rows; j++) {

                // Target transport ships for pirate attack
                if (game.boardArray[i][j].piece.category == 'Transport' && game.boardArray[i][j].piece.team != 'Pirate' && game.boardArray[i][j].piece.damageStatus == 5) {
                    this.findPath[i][j].target = [{type: [game.boardArray[i][j].piece.type], team: game.boardArray[i][j].piece.team}];
                }

                // Resource harbours and virgin island harbours
                if ((game.boardArray[i][j].tile.terrain == 'land' && !game.boardArray[i][j].piece.populatedSquare) ||
                        (game.boardArray[i][j].piece.category == 'Resources' && game.boardArray[i][j].piece.type != 'desert')) {
                    // Single tile search around the island
                    for (let k = -1; k < 2; k+=1) {
                        if(i + k >=0 && i + k <game.rows) {
                            for (let l = -1; l < 2; l+=1) {
                                if(j + l >=0 && j + l <game.cols) {
                                    // Reduces search to exclude diagonals
                                    if(k == 0 || l == 0) {
                                        if(game.boardArray[i+k][j+l].tile.terrain == 'sea') {
                                            if (game.boardArray[i][j].piece.category == 'Resources' && game.boardArray[i][j].piece.type != 'desert') {
                                                this.findPath[i+k][j+l].resourceHarbour.push({type: game.boardArray[i][j].piece.type, detail: game.boardArray[i][j].piece.team, ref: i+'-'+j});
                                            } else {
                                                this.findPath[i+k][j+l].resourceHarbour.push({type: 'virgin', detail: 'Unclaimed', ref: i+'-'+j});
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                // Safe harbour for ship repair or hiding
                if (game.boardArray[i][j].tile.subTerrain == 'harbour') {
                    // Single tile search around the harbour for fort reference
                    for (let k = -1; k < 2; k+=1) {
                        if(i + k >=0 && i + k <game.rows) {
                            for (let l = -1; l < 2; l+=1) {
                                if(j + l >=0 && j + l <game.cols) {
                                    if (game.boardArray[i+k][j+l].piece.type == 'fort') {
                                        this.findPath[i][j].harbour.push({type: game.boardArray[i][j].tile.subTerrain, team: game.boardArray[i][j].tile.subTerrainTeam, ref: (i+k)+'-'+(j+l)});
                                    }
                                }
                            }
                        }
                    }
                }

                // Tiles where path must end
                if (game.boardArray[i][j].piece.category == 'Transport') {
                    this.findPath[i][j].pathStop = [{type: game.boardArray[i][j].piece.type, team: game.boardArray[i][j].piece.team}];
                } else if (game.boardArray[i][j].tile.subTerrain == 'harbour') {
                    // Single tile search around the harbour for fort reference
                    for (let k = -1; k < 2; k+=1) {
                        if(i + k >=0 && i + k <game.rows) {
                            for (let l = -1; l < 2; l+=1) {
                                if(j + l >=0 && j + l <game.cols) {
                                    if (game.boardArray[i+k][j+l].piece.type == 'fort') {
                                        this.findPath[i][j].pathStop = [{type: game.boardArray[i][j].tile.subTerrain, team: game.boardArray[i][j].tile.subTerrainTeam, ref: (i+k)+'-'+(j+l)}];
                                    }
                                }
                            }
                        }
                    }
                }

                // Pirate ships
                if (game.boardArray[i][j].piece.category == 'Transport' && game.boardArray[i][j].piece.team == 'Pirate' && game.boardArray[i][j].piece.damageStatus != 0) {
                    // Find the max move of the ship
                    let maxMovePirate = gameData.pieceTypes[game.boardArray[i][j].piece.type].maxMove;
                    // Loop maxmove+1 tiles around the pirate ship
                    for (var k = -maxMovePirate; k < maxMovePirate+1; k+=1) {
                        if(i + k >=0 && i + k <game.rows) {
                            for (var l = -maxMovePirate; l < maxMovePirate+1; l+=1) {
                                if(j + l >=0 && j + l <game.cols) {
                                    // Mark the distance from the ship (plain number of tiles not wind-based moveCost)
                                    if(game.boardArray[i+k][j+l].tile.terrain == 'sea' && game.boardArray[i+k][j+l].tile.subTerrain != 'harbour') {
                                        this.findPath[i+k][j+l].pirateRange.push(maxMovePirate - Math.max(Math.abs(k), Math.abs(l))+1);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    },


    // Method adds detail of targets and pieces to tiles within findPath - this information requires findPath to be generated first
    // ----------------------------------------------------------------------------------------------------------------------------
    postPaintFindPath: function() {

        for (var i = 0; i < game.cols; i++) {
            for (var j = 0; j < game.rows; j++) {

                // Last activated tile for destinations which are outside activated range
                if (this.findPath[i][j].pathStatus) {
                    if (this.findPath[i][j].activeStatus == 'active') {
                        this.findPath[i][j].lastTile = {row: i, col: j};
                    } else {
                        lastTile = pirates.findLastActive(this.findPath[i][j].path, 0);
                        //console.log(this.findPath[i][j].path[lastTile].fromRow, this.findPath[i][j].path[lastTile].fromCol);
                        this.findPath[i][j].lastTile = {row: this.findPath[i][j].path[lastTile].fromRow, col: this.findPath[i][j].path[lastTile].fromCol};
                    }
                }
            }
        }
        if (settings.arrayFlow === true) {console.log('findPath', JSON.parse(JSON.stringify(this.findPath)));}
    },



    // Sets the "cost" of each move in relation to the wind direction
    // e.g. 1 if move is within 45 degrees of direction of wind, 2 at 90 degrees to wind, 3 in 45 degrees of against wind
    moveCost: function(startRow, startCol, localEndRow, localEndCol, localWindDirection) {
        let moveCostResult = 0;
        // Calculates direction of move
        let localMoveTop = (localEndRow - startRow);
        let localMoveLeft = (localEndCol - startCol);
        let localMoveDirection = this.movementDirection[localMoveLeft+1][localMoveTop+1];
        // Calculates difference in angle of direction between wind direction and piece movement
        let angleDiff = (localMoveDirection - localWindDirection + 360) % 360;
        // Returns cost based on the difference in angle
        if (angleDiff > 90 && angleDiff < 270) {
            moveCostResult = 2.9;
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
    deactivateTiles: function() {
        if(settings.workFlow === true) {console.log('Active tiles deactivated: ' + (Date.now() - settings.launchTime)); }
        // Simply deactivates all tiles within the maximum potential move distance
        for (var i = 0; i < game.boardArray.length; i+=1) {
            for (var j = 0; j < game.boardArray[i].length; j+=1) {
                game.boardArray[i][j].tile.activeStatus = 'inactive';
            }
        }
    },



    // Method for ship movement and transition
    // ---------------------------------------
    shipTransition: async function(startMove, endMove, endPiece, startPieceSVG, gameSpeed) {
        if(settings.workFlow === true) {console.log('----- Ship transition -----: ' + (Date.now() - settings.launchTime)); }
        // Variables for transition movements
        let topDirection = 0;
        let leftDirection = 0;
        let rotateDirection = 0;
        let moveCount = 0;
        let indicator = 0;
        let endTime = 0;
        let transEndCounter = 0;



        // Redraw active tile layer after activation to show activated tiles
        game.boardDisplay.drawTiles('activeTiles');
        await new Promise(resolve => setTimeout(resolve, 200));

        // Obtaining path of piece that leads to end tile of move from findPath array
        let localPath = this.findPath[endMove.row][endMove.col].path;

        // Length gives number of steps in path
        let numberOfTiles = localPath.length - 1;

        // Loop through each step of move
        function transitionManagement() {
            if (numberOfTiles == 0) {
                if(settings.workFlow === true) {console.log('no move - probably a pirate attack: ' + (Date.now() - settings.launchTime)); }
                pieceMovement.harbourRepairArrival(startMove, endMove, endPiece, startPieceSVG);
                pieceMovement.shipConflict(startMove.piece.direction);
            } else {
                if(settings.transitionMonitor === true) {
                    console.log('TM: Transition management run: ' + (Date.now() - settings.launchTime));
                    console.log('TM: local path shown below:');
                    console.log(localPath);
                }

            // for (var i = 0; i < numberOfTiles; i++) {
                // Calculating transformations to be applied to square holding piece - Directional translation
                topDirection = (localPath[moveCount+1].fromRow - localPath[moveCount].fromRow);
                leftDirection = (localPath[moveCount+1].fromCol - localPath[moveCount].fromCol);
                // Rotational translation
                rotateDirection = pieceMovement.movementDirection[(localPath[moveCount+1].fromCol - localPath[moveCount].fromCol)+1][(localPath[moveCount+1].fromRow - localPath[moveCount].fromRow)+1];

                // Applying the transformation for step i of the move path
                if(settings.transitionMonitor === true) {
                    console.log('TM: moveCount = ' + moveCount + ': ' + (Date.now() - settings.launchTime));
                    console.log('from: ' + localPath[moveCount].fromRow + '-' + localPath[moveCount].fromCol +  ' to: ' + localPath[moveCount+1].fromRow + '-' + localPath[moveCount+1].fromCol);
                }

                moveCount = pieceMovement.turnAndMove(moveCount, startPieceSVG, topDirection, leftDirection, rotateDirection, gameSpeed);


                startPieceSVG.svg.addEventListener('transitionend', function transitionHandler(e) {

                    transEndCounter += 1;
                    if(settings.transitionMonitor === true) {console.log('TM: transitionend triggered: ' + transEndCounter + ' ' + e.propertyName + ' ' + (Date.now() - settings.launchTime));}
                    if(e.timeStamp - endTime > 200 * gameSpeed) {
                        endTime = e.timeStamp;
                    //if (indicator < moveCount) {
                        if (e.propertyName == 'top' || e.propertyName == 'left') {
                            startPieceSVG.svg.removeEventListener('transitionend', transitionHandler);

                            indicator = moveCount;
                            if(moveCount < numberOfTiles) {
                                if(settings.transitionMonitor === true) {console.log('TM: Transition completed and loop to next transition: '+ (Date.now() - settings.launchTime));}
                                transitionManagement();
                            } else {
                                if(settings.transitionMonitor === true) {console.log('TM: All transitions complete - Applying moves to game board array: '+ (Date.now() - settings.launchTime));}


                                startPieceSVG.svg.style.transition = '';
                                game.boardDisplay.drawTiles('activeTiles');
                                pieceMovement.postTransition(startMove, endMove, endPiece, rotateDirection, startPieceSVG);
                            }
                        } else {
                            if(settings.transitionMonitor === true) {console.log('TM: Transition ignored - rotation not translation');}
                        }
                    } else {
                        if(settings.transitionMonitor === true) {console.log('TM: Transition ignored as part of prior move');}
                    }
                });
            }
        }

        transitionManagement();
    },

    // Method for post ship movement actions
    // -------------------------------------
    postTransition: function(startMove, endMove, endPiece, rotateDirection, startPieceSVG) {
    // Pirates, human, computer opponent treated separately
    // Move completion called to reset once post transition complete
    // Pirate ship conflict has transitions so move completion needs to be called once this is finished (from shipConflict)
    // May need to do this for computer opponents as well once actions with transitions implemented
        if (game.type == 'Pirate') {
            pieceMovement.harbourRepairArrival(startMove, endMove, endPiece, startPieceSVG);
            pieceMovement.shipConflict(rotateDirection);
        } else if (game.type == 'human') {
            if(startMove.piece.damageStatus == 5) {
                pieceMovement.landDiscovery(endMove);
            }
            pieceMovement.harbourRepairArrival(startMove, endMove, endPiece, startPieceSVG);
            pieceMovement.moveCompletion();
        } else { // 'computer'
            if(startMove.piece.damageStatus == 5) {
                pieceMovement.landDiscovery(endMove);
            }
            pieceMovement.deactivateTiles();
            game.boardDisplay.drawTiles('activeTiles');
            computer.decideClaimResource();
            computer.goodsDelivery();
            pieceMovement.harbourRepairArrival(startMove, endMove, endPiece, startPieceSVG);
            pieceMovement.moveCompletion();
        }
    },

    // Method to complete ship movement once all transitions have been cycled through
    // ------------------------------------------------------------------------------
    moveCompletion: function(startPieceSVG) {
        // Applying moves to game board array
        if(settings.workFlow === true) {console.log('----- Move Completion activated ----- ' + (Date.now() - settings.launchTime)); }
        if (game.type == 'human') {
            // Resetting movement array once second click has been made (if move valid)
            game.boardHolder.endTurn.addEventListener('click', game.nextTurn);
            boardMarkNode.addEventListener('click', human.boardHandler);
            stockDashboard.node.addEventListener('click', buildItem.clickStock);
            stockDashboard.node.addEventListener('mouseover', stockDashboard.hoverPieceOn);
            stockDashboard.node.addEventListener('mouseleave', game.board.clearHighlightTiles);
        } else if (game.type == 'Pirate') {
            // Resetting movement array once second click has been made (if move valid)
            pirates.automatePirates();
        } else if (game.type == 'computer') {
            // Resetting movement array once second click has been made (if move valid)
            computer.automatePlayer();
        } else {
            console.log('error in game.type');
        }
    },


    // Method for piece to turn in direction of move and then move
    // -----------------------------------------------------------
    turnAndMove: function(n, startPieceSVG, topDirection, leftDirection, rotateDirection, gameSpeed) {
        if(settings.transitionMonitor === true) {console.log('TM: Turn and Move method run: ' + (Date.now() - settings.launchTime))}
        // n is number of transition in chain
        // Transitions to be applied (added here to allow different transitions to be applied dynamically in future)
        startPieceSVG.svg.style.transition = 'transform ' + (0.1 * gameSpeed) + 's 0s ease-in-out, left ' + (0.35 * gameSpeed) + 's ' + (0.1 * gameSpeed) + 's ease-in-out, top ' + (0.35 * gameSpeed) + 's ' + (0.1 * gameSpeed) + 's ease-in-out';

        // Delayed application of transformations to give board game style move effect
        //setTimeout(function() {
            //console.log(startPieceSVG.style.left, startPieceSVG.style.top);
            startPieceSVG.svg.style.left = parseFloat(startPieceSVG.svg.style.left) + (leftDirection * (game.gridSize + game.tileBorder*2)) + 'px';
            startPieceSVG.svg.style.top = parseFloat(startPieceSVG.svg.style.top) + (topDirection * (game.gridSize + game.tileBorder*2)) + 'px';
            startPieceSVG.svg.style.transform = 'rotate(' + rotateDirection + 'deg)';
        //}, 500 * gameSpeed);

        return n + 1;
    },

    // Method to allow discovery of new land tiles
    // -------------------------------------------
    landDiscovery: function(endMove) {
        if(settings.workFlow === true) {console.log('Land discovery: ' + (Date.now() - settings.launchTime)); }
        // At end of each move check a 1x1 grid to see if the ship is next to land that is unpopulated
        let searchDistance = 1;
        for (var i = -searchDistance; i < searchDistance + 1; i++) {
            if(endMove.row+i >=0 && endMove.row+i <game.rows) {
                for (var j = -searchDistance; j < searchDistance + 1; j++) {
                    if(endMove.col+j >=0 && endMove.col+j <game.cols) {
                        // Reduces search to exclude diagonals
                        if(i == 0 || j == 0) {
                            // Checks if tile is land and unpopulated
                            if(game.boardArray[endMove.row+i][endMove.col+j].tile.terrain == 'land' && !game.boardArray[endMove.row+i][endMove.col+j].piece.populatedSquare) {
                                // If so - picks a reource card type using resourceManagement.pickFromResourceDeck() and updates boardArray to this tile tile with unoccupied team
                                deckCard = resourceManagement.pickFromResourceDeck();
                                //randomProduction = Math.floor(Math.random() * (deckCard.maxProduction)) + 1;
                                let randomStock = Math.floor(Math.random() * 3);
                                new Move({row: endMove.row+i, col: endMove.col+j}, {row: endMove.row, col: endMove.col}, 'discover', {discoveredResource: deckCard.type, discoveredGoods: deckCard.goods, discoveredStock: randomStock, discoveredProduction: deckCard.production}).process();
                                //game.boardArray[endMove.row+i][endMove.col+j].pieces = {populatedSquare: true, category: 'Resources', type: deckCard.type, direction: '0', used: 'unused', damageStatus: 5, team: 'Unclaimed', goods: deckCard.goods, stock: randomStock, production: deckCard.production};
                                // and then creates an SVG resource tile for the land space
                                //game.boardDisplay.addPiece(game.boardArray[endMove.row+i][endMove.col+j].pieces.type, game.boardArray[endMove.row+i][endMove.col+j].pieces.team, endMove.row+i, endMove.col+j, game.boardArray[endMove.row+i][(endMove.col+j)].pieces.direction);
                            }
                        }
                    }
                }
            }
        }
    },

    // Method to check a ship is nearby to allow resource to be settled
    // ----------------------------------------------------------------
    shipAvailable: function(startMove, searchType) {
        if(settings.workFlow === true) {console.log('Checking ship available to settle resource: ' + (Date.now() - settings.launchTime)); }
        let searchDistance = 1;
        let result = 'no ship';
        for (var i = -searchDistance; i < searchDistance + 1; i++) {
            if(startMove.row+i >=0 && startMove.row+i <game.rows) {
                for (var j = -searchDistance; j < searchDistance + 1; j++) {
                    if(startMove.col+j >=0 && startMove.col+j <game.cols) {
                        // Reduces seacrh to exclude diagonals
                        if(i == 0 || j == 0) {
                            // Checks if tile is ship or correct team
                            if(game.boardArray[startMove.row+i][startMove.col+j].piece.category == 'Transport' && game.boardArray[startMove.row+i][startMove.col+j].piece.team == game.turn) {
                                if (searchType == 'crew') {
                                    result = 'crew';
                                    game.boardArray[startMove.row+i][startMove.col+j].tile.activeStatus = 'active';
                                } else if (game.boardArray[startMove.row+i][startMove.col+j].piece.goods == 'none' || game.boardArray[startMove.row+i][startMove.col+j].piece.goods == searchType) {
                                    result = 'compatible';
                                    game.boardArray[startMove.row+i][startMove.col+j].tile.activeStatus = 'active';
                                } else {
                                    result = 'incompatible';
                                }
                            }
                        }
                    }
                }
            }
        }
        return result;
    },

    // Method to check if an unloading point is available
    // --------------------------------------------------
    depotAvailable: function(startMove, searchType) {
        if(settings.workFlow === true) {console.log('Checking depot available for unloading: ' + (Date.now() - settings.launchTime)); }
        let searchDistance = 1;
        let result = [];
        for (var i = -searchDistance; i < searchDistance + 1; i++) {
            if(startMove.row+i >=0 && startMove.row+i <game.rows) {
                for (var j = -searchDistance; j < searchDistance + 1; j++) {
                    if(startMove.col+j >=0 && startMove.col+j <game.cols) {
                        // Reduces search to exclude diagonals
                        if((i == 0 || j == 0) && i != j) {
                            // Checks if tile meets criteria
                            //console.log('here', game.boardArray[startMove.row+i][startMove.col+j].pieces.type, game.boardArray[startMove.row+i][startMove.col+j].pieces.team);
                            if (game.boardArray[startMove.row+i][startMove.col+j].piece.type == 'fort' && game.boardArray[startMove.row+i][startMove.col+j].piece.team == 'Kingdom') {
                                if(tradeContracts.checkDelivery(startMove.row+i, startMove.col+j, searchType, game.boardArray[startMove.row][startMove.col].piece.stock, game.boardArray[startMove.row][startMove.col].piece.team) == true) {
                                    //console.log('delivery');
                                    result.push('fort delivery');
                                    game.boardArray[startMove.row+i][startMove.col+j].tile.activeStatus = 'active';
                                }
                            } else if (game.boardArray[startMove.row+i][startMove.col+j].piece.type == 'fort' && game.boardArray[startMove.row+i][startMove.col+j].piece.team == game.turn && (game.boardArray[startMove.row+i][startMove.col+j].piece.goods == searchType || game.boardArray[startMove.row+i][startMove.col+j].piece.goods == 'none')) {
                                result.push('fort compatible');
                                game.boardArray[startMove.row+i][startMove.col+j].tile.activeStatus = 'active';
                            } else if (game.boardArray[startMove.row+i][startMove.col+j].piece.type == 'fort' && game.boardArray[startMove.row+i][startMove.col+j].piece.goods != searchType) {
                                result.push('fort incompatible');
                            } else if (game.boardArray[startMove.row+i][startMove.col+j].piece.team == game.turn && game.boardArray[startMove.row+i][startMove.col+j].piece.goods == searchType) {
                                result.push(searchType);
                                game.boardArray[startMove.row+i][startMove.col+j].tile.activeStatus = 'active';
                            }
                        }
                    }
                }
            }
        }
        return result;
    },

    // Method to organise the battles between ships
    // --------------------------------------------
    shipConflict: function(startDirection) {
        let endCannon = 0;
        let ship = pirates.conflictArray.ship;
        let pirate = pirates.conflictArray.pirate;
        if (pirates.conflictArray.conflict == true) {
            if(settings.workFlow === true) {console.log('Ship conflict - battle: ' + (Date.now() - settings.launchTime)); }
            if(settings.arrayFlow === true) {console.log('conflictArray', pirates.conflictArray);}
            // Obtains ID and element of pirates
            IDPirate = 'piece' + ('0' + pirate.row).slice(-2) + ('0' + pirate.col).slice(-2);
            let piratePieceSVG = game.boardDisplay.pieces[IDPirate];
            // Obtains ID and element of ship
            IDShip = 'piece' + ('0' + ship.row).slice(-2) + ('0' + ship.col).slice(-2);
            let shipPieceSVG = game.boardDisplay.pieces[IDShip];

            // Get direction from pirate ship to Transport
            conflictTopDirection = (ship.row - pirate.row);
            conflictLeftDirection = (ship.col - pirate.col);
            // Turn ships to face each other
            conflictDirection = this.movementDirection[(ship.col - pirate.col) + 1][(ship.row - pirate.row) + 1] - 90;

            // Simulate cannon fire animation
            let reductionDirection = 0.25;
            let repeat = 4;
            let fireEffect = 1;

            // Function animates sea battle, calculates winner, and transfers stolen goods if necessary
            function cannonFire() {
                if(settings.workFlow === true) {console.log('Runs cannon fire: ' + (Date.now() - settings.launchTime)); }
                if (repeat > 0) {
                    shipPieceSVG.svg.style.transition = 'transform ' + (0.4 * settings.gameSpeed) + 's 0s ease-in-out, left ' + (0.7 * settings.gameSpeed * fireEffect) + 's ' + (0.0 * settings.gameSpeed * fireEffect) + 's ease-in-out, top ' + (0.7 * settings.gameSpeed * fireEffect) + 's ' + (0.0 * settings.gameSpeed * fireEffect) + 's ease-in-out';
                    piratePieceSVG.svg.style.transition = 'transform ' + (0.4 * settings.gameSpeed) + 's 0s ease-in-out, left ' + (0.7 * settings.gameSpeed * fireEffect) + 's ' + (0.0 * settings.gameSpeed * fireEffect) + 's ease-in-out, top ' + (0.7 * settings.gameSpeed * fireEffect) + 's ' + (0.0 * settings.gameSpeed * fireEffect) + 's ease-in-out';
                    shipPieceSVG.svg.style.transform = 'rotate(' + conflictDirection + 'deg)';
                    piratePieceSVG.svg.style.transform = 'rotate(' + conflictDirection + 'deg)';
                    shipPieceSVG.svg.style.left = parseFloat(shipPieceSVG.svg.style.left) - (conflictLeftDirection * reductionDirection * (game.gridSize + game.tileBorder*2)) + 'px';
                    shipPieceSVG.svg.style.top = parseFloat(shipPieceSVG.svg.style.top) - (conflictTopDirection * reductionDirection * (game.gridSize + game.tileBorder*2)) + 'px';
                    piratePieceSVG.svg.style.left = parseFloat(piratePieceSVG.svg.style.left) + (conflictLeftDirection * reductionDirection * (game.gridSize + game.tileBorder*2)) + 'px';
                    piratePieceSVG.svg.style.top = parseFloat(piratePieceSVG.svg.style.top) + (conflictTopDirection * reductionDirection * (game.gridSize + game.tileBorder*2)) + 'px';
                    if (reductionDirection == 0.25) {
                        reductionDirection = -0.12;
                    } else if (reductionDirection == 0.12) {
                        reductionDirection = -0.25;
                    } else {
                        reductionDirection *= -1;
                    }
                    if (fireEffect == 1) {
                        fireEffect = 0.1;
                    } else {
                        fireEffect = 1;
                    }
                    repeat -= 1;
                    piratePieceSVG.svg.addEventListener('transitionend', function cannonHandler(e) {
                        if (e.propertyName == 'top' || e.propertyName == 'left') {
                            if(e.timeStamp - endCannon > 50 * settings.gameSpeed) {
                                endCannon = e.timeStamp;
                                if(settings.workFlow === true) {console.log('Conflict single transition end: ' + (Date.now() - settings.launchTime)); }
                                piratePieceSVG.svg.removeEventListener('transitionend', cannonHandler);
                                cannonFire();
                            }
                        }
                    });

                } else {
                    if(settings.workFlow === true) {console.log('Conflict transition ended - decide winner and update board array: ' + (Date.now() - settings.launchTime)); }

                    // Calculates winner of sea battle  - battlePerc% gives chance of team ship type winning battle
                    if (Math.random()> gameData.pieceTypes[game.boardArray[ship.row][ship.col].piece.type].battlePerc) {
                        // Pirate ship wins battle and team ship is damaged
                        new Move({row: pirate.row, col:pirate.col}, {row: ship.row, col: ship.col}, 'battle', {battleWinner: 'start'}).process();

                    } else {
                        // Team ship wins battle and pirate ship is damaged
                        new Move({row: pirate.row, col:pirate.col}, {row: ship.row, col: ship.col}, 'battle', {battleWinner: 'end'}).process();
                    }
                    pirates.conflictArray = {conflict: false, start: {row: '', col: ''}, end: {row: '', col: ''}};
                    pieceMovement.moveCompletion();
                }
            }
            cannonFire();

        } else {
            if(settings.workFlow === true) {console.log('Ship conflict - No battle: ' + (Date.now() - settings.launchTime)); }
            pieceMovement.moveCompletion();
        }
    },

    // Method to repair ship in safe harbour
    // -------------------------------------
    harbourRepairArrival: function(startMove, endMove, endPiece, shipPieceSVG) {
        if(settings.workFlow === true) {console.log('Harbour repair arrival: ' + (Date.now() - settings.launchTime)); }
        let repairDirection = 0;
        // Checks whether moves have ended with ship entering harbour for repair
        if (endPiece.damageStatus === 0 && game.turn !== 'Pirate' && game.boardArray[endMove.row][endMove.col].tile.subTerrain === 'harbour') {
            shipPieceSVG.svg.style.transition = 'transform ' + (0.4 * settings.gameSpeed) + 's 0s ease-in-out';
            for (let k = -1; k <= 1; k+=1) {
                for (var l = -1; l <= 1; l+=1) {
                    // Turns ship to face fort for repair
                    if ((endMove.row+k >= 0) && (endMove.row+k < game.rows)) {
                        if ((endMove.col+l >= 0) && (endMove.col+l < game.cols)) {
                            if(game.boardArray[endMove.row+k][endMove.col+l].piece.type === 'fort') {
                                repairDirection = this.movementDirection[l + 1][k + 1];
                            }
                        }
                    }
                }
            }
            shipPieceSVG.svg.style.transform = 'rotate(' + repairDirection + 'deg)';

            // Updates boardArray for new status - cargo ships take longer to repair, working through damageStatus from 1 to 5 rather than just 3 to 5
            if (endPiece.type === 'cargoship') {
                endPiece.changeDamage(1);
            } else {
                endPiece.changeDamage(3);
            }
            game.boardArray[endMove.row][endMove.col].piece.direction = repairDirection;
            shipPieceSVG.repairShip(endPiece.damageStatus);
        } else if (startMove.piece.damageStatus === 0 && game.turn === 'Pirate' && game.boardArray[endMove.row][endMove.col].tile.subTerrain === 'pirateHarbour') {
            // Updates boardArray for new status - all pirate ships assumed to be warships and repaired from 3 to 5
            endPiece.changeDamage(3);
            shipPieceSVG.repairShip(endPiece.damageStatus);
        }
    },

    // Method to check for ships to repair at start of turn
    // ----------------------------------------------------
    harbourRepair: function() {
        if(settings.workFlow === true) {console.log('Harbour repair check: ' + (Date.now() - settings.launchTime)); }
        // Finds ships in harbour undergoing repair
        for (let i = 0; i < game.boardArray.length; i+=1) {
            for (let j = 0; j < game.boardArray[i].length; j+=1) {
                if((game.boardArray[i][j].piece.category == 'Transport') && (game.boardArray[i][j].piece.team == game.turn)) {
                    // Calls repairShip to carry out the different repairs
                    if (game.boardArray[i][j].piece.damageStatus > 0 && game.boardArray[i][j].piece.damageStatus < 5) {
                        // Calculates placement on board of tile to obtain piece SVG
                        game.boardArray[i][j].piece.damageStatus +=1;
                        let IDPieceStart = 'piece' + ('0' + i).slice(-2) + ('0' + j).slice(-2);
                        let shipPieceSVG = game.boardDisplay.pieces[IDPieceStart];
                        shipPieceSVG.repairShip(shipPieceSVG.damage+1);
                    }
                }
            }
        }
    },

// LAST BRACKET OF OBJECT
}
