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
    activateTiles: function(localStartRow, localStartCol, localMaxMove, searchRadius, displayActive, localDamagedStatus) {
        if(workFlow == 1) {console.log('Active tiles and paths determined: ' + (Date.now() - launchTime)); }
        // Initialises findPath array which holds board size array of
        // active/inactive status, movement cost to reach that tile, path to that tile
        this.initialisefindPath(localStartRow, localStartCol);

        // Sets clicked piece status to active as starting point of chain reaction of setting active status
        //if (displayActive) {
        //    gameBoard.boardArray[localStartRow][localStartCol].activeStatus = 'active';
        //}
        this.findPath[localStartRow][localStartCol].pathStatus = true;

        // Loops through localMaxMove loops
        // Each loop searches for tiles within one tile reach of a previously activated tile
        // When the cost is less than localMaxMove the tile is activated
        // Tile paths are searched even beyond the active boundary for "telescope" purposes for pirate ships
        // First search (k=0) takes each "found" tile within 1x1 grid around piece (i.e. just the piece itself) then uses
        // activeTiles to search in 3x3 grid around this tile
        // Second search (k=1) takes each "found" tile within a 3x3 grid of the piece (i.e. within one tile move reach of the piece) then uses
        // activeTiles to search in 3x3 grid around each of these active tiles
        // Third search (k=2) takes each "found" tile within a 5x5 grid of the piece (i.e. within two tile move reach of the piece) then uses
        // activeTiles to search in 3x3 grid around each of these "found" tiles (making a maximum potential localMaxMove tile distance from the piece for active and found tiles)
        for (var k = 0; k < searchRadius; k++) {
            //console.log('k loop', k);
            // Loops through i rows and j columns to form the 3x3 etc grids
            for (var i = -k; i < k+1; i++) {
                // Restrict by map size for rows so not searching off edge of board
                if(localStartRow+i>=0 && localStartRow+i <row) {
                    for (var j = -k; j < k+1; j++) {
                        // Restrict by map size for columns so not searching off edge of board
                        if(localStartCol+j >=0 && localStartCol+j <col) {
                            // Checks if tile is found. If so runs activeTiles to search for potential tiles to activate around it
                            if ((this.findPath[localStartRow+i][localStartCol+j].pathStatus == true) && (this.findPath[localStartRow+i][localStartCol+j].target != 'Transport')) {
                                //Keep useful for debugging - console.log('run: ' + k);
                                //Keep useful for debugging - console.log('starting from: row: ' + (localStartRow+i) + ' col: ' + (localStartCol+j) + ' prior cost: ' + this.findPath[localStartRow+i][localStartCol+j].moveCost);
                                this.activeTiles(localStartRow+i, localStartCol+j, this.findPath[localStartRow+i][localStartCol+j].moveCost, localMaxMove, displayActive, k, localDamagedStatus);
                            }
                        }
                    }
                }
            }
        }
        // At end of search sets piece square back to inactive as you cannot move a piece to its own square
        //this.findPath[localStartRow][localStartCol].activeStatus = 'inactive';
        //if (displayActive) {
        //    gameBoard.boardArray[localStartRow][localStartCol].activeStatus = 'inactive';
        //}
        console.log('completed find path slice', this.findPath.slice(0));
    },

    initialisefindPath: function(localStartRow, localStartCol) {
    // Initialises findPath array which holds board size (i rows x j columns) array of:
    // active/inactive status
    // movement cost to reach that tile
    // path to that tile
        for (var i = 0; i < col; i++) {
            let localMoveRow = [];
            for (var j = 0; j < row; j++) {
                localMoveRow[j] = {pathStatus: false, activeStatus: 'inactive', moveCost: 0, distance: 0,target: '', team: '', path: [{fromRow: +localStartRow , fromCol: +localStartCol}]};
            }
            this.findPath[i] = localMoveRow;
        }
    },

    activeTiles: function(localStartRow, localStartCol, localCumulMoveCost, localMaxMove, displayActive, k, localDamagedStatus) {
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
            if(localStartRow+i>=0 && localStartRow+i <row) {
                // Loop through columns
                for (var j = -1; j <= 1; j++) {
                    // Restrict by map size for columns
                    if(localStartCol+j >=0 && localStartCol+j <col) {
                        // Restrict for land squares ( ---- and objects ---- )
                        // if (gameBoard.boardArray[localStartRow+i][localStartCol+j].terrain == 'sea' && gameBoard.boardArray[localStartRow+i][localStartCol+j].pieces.populatedSquare == false) {
                        if (gameBoard.boardArray[localStartRow+i][localStartCol+j].terrain == 'sea') {
                            if (!((gameBoard.boardArray[localStartRow+i][localStartCol+j].subTerrain == 'harbour') && (gameManagement.turn == 'Pirate')) ) {
                                // Aggregate cost of reaching tile in tileCumulMoveCost - add the exiting cost to the cost for reaching the new tile from moveCost
                                //console.log('row: ' + (localStartRow+i) + ' col: ' + (localStartCol+j) + ' prior cost: ' + localCumulMoveCost + ' new cost: ' + this.moveCost(localStartRow, localStartCol ,localStartRow+i, localStartCol+j, needleDirection))
                                if (localDamagedStatus == 0) {
                                    tileCumulMoveCost = localCumulMoveCost + 1;
                                } else {
                                    tileCumulMoveCost = localCumulMoveCost + this.moveCost(localStartRow, localStartCol ,localStartRow+i, localStartCol+j, needleDirection);
                                }
                                // Restrict activation by Maximum Cost of reaching a tile (allows wind direction to be factored in to move)
                                //if (tileCumulMoveCost <= localMaxMove) {
                                // Separate newly found tiles from previously found tiles
                                if (this.findPath[localStartRow+i][localStartCol+j].pathStatus == true) {
                                    // Logic for already active tiles - is the new path cheaper in moveCost?
                                    if (tileCumulMoveCost < this.findPath[localStartRow+i][localStartCol+j].moveCost) {
                                        // Necessary as a few tiles will be "found" for the first time whilst being over the localMaxMove level for activation
                                        if (tileCumulMoveCost < localMaxMove) {
                                            this.findPath[localStartRow+i][localStartCol+j].activeStatus = 'active';
                                            if (displayActive) {
                                                gameBoard.boardArray[localStartRow+i][localStartCol+j].activeStatus = 'active';
                                            }
                                        }
                                        // Keep useful for debugging - console.log('already active logic is used:');
                                        //console.log('change to active tile - pre:', localStartRow+i, localStartCol+j, this.findPath[localStartRow+i][localStartCol+j], 'from ' + localStartRow + '-' + localStartCol, this.findPath[localStartRow][localStartCol]);
                                        // Update the cost, add the inherited path from the previous moved-to tile, push the path for the new tile
                                        this.findPath[localStartRow+i][localStartCol+j].moveCost = tileCumulMoveCost;
                                        this.findPath[localStartRow+i][localStartCol+j].path = this.findPath[localStartRow][localStartCol].path.slice(0);
                                        this.findPath[localStartRow+i][localStartCol+j].path.push({fromRow: +(localStartRow+i) , fromCol: +(localStartCol+j)});
                                        this.findPath[localStartRow+i][localStartCol+j].distance = this.findPath[localStartRow+i][localStartCol+j].path.length-1;
                                        //console.log('change to active tile - post:', localStartRow+i, localStartCol+j, this.findPath[localStartRow+i][localStartCol+j], 'from ' + localStartRow + '-' + localStartCol, this.findPath[localStartRow][localStartCol]);
                                    }
                                // Logic for unfound tiles that have met all criteria - make pathStatus as true!
                                } else if (this.findPath[localStartRow+i][localStartCol+j].pathStatus == false) {
                                    //console.log('new pre-activation:', localStartRow+i, localStartCol+j, this.findPath[localStartRow+i][localStartCol+j], 'from ' + localStartRow + '-' + localStartCol, this.findPath[localStartRow][localStartCol]);
                                    this.findPath[localStartRow+i][localStartCol+j].pathStatus = true;
                                    // Activate tiles if constraints are met
                                    if (tileCumulMoveCost < localMaxMove) {
                                        this.findPath[localStartRow+i][localStartCol+j].activeStatus = 'active';
                                        if (displayActive) {
                                            gameBoard.boardArray[localStartRow+i][localStartCol+j].activeStatus = 'active';
                                        }
                                    }
                                    // Update the cost, add the inherited path from the previous moved-to tile, push the path for the new tile
                                    this.findPath[localStartRow+i][localStartCol+j].moveCost = tileCumulMoveCost;

                                    this.findPath[localStartRow+i][localStartCol+j].path = this.findPath[localStartRow][localStartCol].path.slice(0);
                                    this.findPath[localStartRow+i][localStartCol+j].path.push({fromRow: +(localStartRow+i) , fromCol: +(localStartCol+j)});
                                    this.findPath[localStartRow+i][localStartCol+j].distance = this.findPath[localStartRow+i][localStartCol+j].path.length-1;
                                    //console.log('new post-activation:', localStartRow+i, localStartCol+j, this.findPath[localStartRow+i][localStartCol+j], 'from ' + localStartRow + '-' + localStartCol, this.findPath[localStartRow][localStartCol]);
                                    //Keep useful for debugging - console.log('row: ' + (localStartRow+i) + ' col: ' + (localStartCol+j) + ' set to: ' + this.findPath[localStartRow+i][localStartCol+j].activeStatus + ' with cost: ' + this.findPath[localStartRow+i][localStartCol+j].moveCost + ' and distance: ' + this.findPath[localStartRow+i][localStartCol+j].distance);
                                }

                                // Sets Transport tile to inactive to prevent moving there
                                if (gameBoard.boardArray[localStartRow+i][localStartCol+j].pieces.category == 'Transport') {
                                    this.findPath[localStartRow+i][localStartCol+j].target = 'Transport';
                                    this.findPath[localStartRow+i][localStartCol+j].team = gameBoard.boardArray[localStartRow+i][localStartCol+j].pieces.team.slice(0);
                                    //this.findPath[localStartRow+i][localStartCol+j].pathStatus = false;
                                    if (gameManagement.turn != 'Pirate') {
                                        //this.findPath[localStartRow+i][localStartCol+j].pathStatus = false;
                                        this.findPath[localStartRow+i][localStartCol+j].activeStatus = 'inactive';
                                        gameBoard.boardArray[localStartRow+i][localStartCol+j].activeStatus = 'inactive';
                                    // Prevents pirate ships being activated on pirate ship moves
                                    } else if (this.findPath[localStartRow+i][localStartCol+j].team == 'Pirate') {
                                        this.findPath[localStartRow+i][localStartCol+j].activeStatus = 'inactive';
                                        gameBoard.boardArray[localStartRow+i][localStartCol+j].activeStatus = 'inactive';
                                    } else if (gameBoard.boardArray[localStartRow+i][localStartCol+j].pieces.damageStatus == 0) {
                                        this.findPath[localStartRow+i][localStartCol+j].activeStatus = 'inactive';
                                        gameBoard.boardArray[localStartRow+i][localStartCol+j].activeStatus = 'inactive';
                                    } else if (gameBoard.boardArray[pieceMovement.movementArray.start.row][pieceMovement.movementArray.start.col].pieces.damageStatus == 0) {
                                        this.findPath[localStartRow+i][localStartCol+j].activeStatus = 'inactive';
                                        gameBoard.boardArray[localStartRow+i][localStartCol+j].activeStatus = 'inactive';
                                    }

                                    //console.log(this.findPath[localStartRow+i][localStartCol+j]);
                                }
                            //}
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
    deactivateTiles: function(localMaxMove) {
        if(workFlow == 1) {console.log('Active tiles deactivated: ' + (Date.now() - launchTime)); }
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
        if(workFlow == 1) {console.log('Used pieces reset: ' + (Date.now() - launchTime)); }
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
        if(workFlow == 1) {console.log('Move information captured: ' + (Date.now() - launchTime)); }
        if (fromTo == 'start') {
            this.movementArray = {start: {row: '', col: ''}, end: {row: '', col: ''}};
        }

        // Calculate row and column of square from id and record in movement array
        //console.log('capturemove', xClickTile);
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
        } else if (this.movementArray.start.pieces.category == 'Transport' && !this.movementArray.end.pieces.populatedSquare) {
            this.movementArray[fromTo].activeStatus = this.findPath[this.movementArray[fromTo].row][this.movementArray[fromTo].col].activeStatus;
        } else {
            this.movementArray[fromTo].activeStatus = gameBoard.boardArray[this.movementArray[fromTo].row][this.movementArray[fromTo].col].activeStatus;
        }
        //console.log(this.movementArray);
    },

    // Method for ship movement and transition
    // ---------------------------------------
    shipTransition: function(gameSpeed) {
        if(workFlow == 1) {console.log('----- Ship transition -----: ' + (Date.now() - launchTime)); }
        // Variables for transition movements
        let topDirection = 0;
        let leftDirection = 0;
        let rotateDirection = 0;
        let moveCount = 0;
        let indicator = 0;
        let endTime = 0;
        let transEndCounter = 0;

        // Calculate placement on board of start tile for move
        IDPieceStart = 'tile' + Number(this.movementArray.start.row*1000 + this.movementArray.start.col);
        //console.log(IDPieceStart);
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

        function transitionManagement() {
            if (numberOfTiles == 0) {
                if(workFlow == 1) {console.log('no move - probably a pirate attack: ' + (Date.now() - launchTime)); }
                pieceMovement.harbourRepairArrival(chosenPiece);
                pieceMovement.shipConflict(pieceMovement.movementArray.start.pieces.direction);
            } else {
                if(transitionMonitor == 1) {
                    console.log('TM: Transition management run: ' + (Date.now() - launchTime));
                    console.log('TM: local path shown below:');
                    console.log(localPath);
                }

            // for (var i = 0; i < numberOfTiles; i++) {
                // Calculating transformations to be applied to square holding piece
                // Directional translation
                topDirection = (localPath[moveCount+1].fromRow - localPath[moveCount].fromRow);
                leftDirection = (localPath[moveCount+1].fromCol - localPath[moveCount].fromCol);
                // Rotational translation
                rotateDirection = pieceMovement.movementDirection[(localPath[moveCount+1].fromCol - localPath[moveCount].fromCol)+1][(localPath[moveCount+1].fromRow - localPath[moveCount].fromRow)+1];

                // Applying the transformation for step i of the move path
                if(transitionMonitor == 1) {
                    console.log('TM: moveCount = ' + moveCount + ': ' + (Date.now() - launchTime));
                    console.log('from: ' + localPath[moveCount].fromRow + '-' + localPath[moveCount].fromCol +  ' to: ' + localPath[moveCount+1].fromRow + '-' + localPath[moveCount+1].fromCol);
                }

                moveCount = pieceMovement.turnAndMove(moveCount, chosenPiece, topDirection, leftDirection, rotateDirection, gameSpeed);


                chosenPiece.addEventListener('transitionend', function transitionHandler(e) {

                    transEndCounter += 1;
                    if(transitionMonitor == 1) {console.log('TM: transitionend triggered: ' + transEndCounter + ' ' + e.propertyName + ' ' + (Date.now() - launchTime));}
                    if(e.timeStamp - endTime > 200 * gameSpeed) {
                        endTime = e.timeStamp;
                    //if (indicator < moveCount) {
                        if (e.propertyName == 'top' || e.propertyName == 'left') {

                            chosenPiece.removeEventListener('transitionend', transitionHandler);
                            //console.log(e.propertyName, indicator, moveCount, e.elapsedTime, e.timeStamp);
                            //console.log(e);

                            indicator = moveCount;
                            if(moveCount < numberOfTiles) {
                                if(transitionMonitor == 1) {console.log('TM: Transition completed and loop to next transition: '+ (Date.now() - launchTime));}
                                transitionManagement()
                            } else {
                                if(transitionMonitor == 1) {console.log('TM: All transitions complete - Applying moves to game board array: '+ (Date.now() - launchTime));}
                                //console.log(chosenPiece);
                                //console.log(pieceMovement.movementArray);
                                gameBoard.boardArray[pieceMovement.movementArray['start'].row][pieceMovement.movementArray['start'].col].pieces = {populatedSquare: false, category: '', type: 'no piece', direction: '', used: 'unused', damageStatus: 5, team: '', goods: 'none', stock: 0};
                                gameBoard.boardArray[pieceMovement.movementArray.end.row][pieceMovement.movementArray.end.col].pieces = {populatedSquare: true, category: pieceMovement.movementArray.start.pieces.category, type: pieceMovement.movementArray.start.pieces.type, direction: rotateDirection, used: 'used', damageStatus: pieceMovement.movementArray.start.pieces.damageStatus, team: pieceMovement.movementArray.start.pieces.team, goods: pieceMovement.movementArray.start.pieces.goods, stock: pieceMovement.movementArray.start.pieces.stock, ref: pieceMovement.movementArray.start.pieces.ref};

                                //Updating piece information
                                chosenPiece.setAttribute('id', 'tile' + Number(pieceMovement.movementArray.end.row*1000 + pieceMovement.movementArray.end.col));
                                chosenPiece.style.transition = '';
                                pieceMovement.harbourRepairArrival(chosenPiece);
                                pieceMovement.shipConflict(rotateDirection);
                            }
                        } else {
                            if(transitionMonitor == 1) {console.log('TM: Transition ignored - rotation not translation');}
                        }
                    } else {
                        if(transitionMonitor == 1) {console.log('TM: Transition ignored as part of prior move');}
                    }
                });
            }
        }

        transitionManagement();


            /*chosenPiece.addEventListener('transitionrun', function(e) {
                console.log(e);
                if (e.propertyName == 'top') {
                    console.log('transitionrun', i, 'top');
                } else if (e.propertyName == 'left') {
                    console.log('transitionrun', i, 'left');
                }
            });
            chosenPiece.addEventListener('transitionend', function(e) {
                console.log('transitionend', i);
                console.log(e);
                console.log(e.propertyName);
            });*/




        // Reset of transitions delayed in proportion to number of moves
        //setTimeout(function() {

        //}, numberOfTiles * 500 * gameSpeed);

    },

    // Method to complete ship movement once all transitions have been cycled through
    // ------------------------------------------------------------------------------
    moveCompletion: function(chosenPiece) {
        // Applying moves to game board array
        if(workFlow == 1) {console.log('----- Move Completion activated ----- ' + (Date.now() - launchTime)); }

        if (gameManagement.turn != 'Pirate') {
            pieceMovement.landDiscovery();

            // Resetting movement array once second click has been made (if move valid)
            pieceMovement.movementArray = {start: {row: '', col: ''}, end: {row: '', col: ''}};
            startEnd = 'start';
            endTurn.addEventListener('click', nextTurn);
            boardMarkNode.addEventListener('click', boardHandler);
        } else if (gameManagement.turn == 'Pirate') {

            // Resetting movement array once second click has been made (if move valid)
            pieceMovement.movementArray = {start: {row: '', col: ''}, end: {row: '', col: ''}};
            startEnd = 'start';
            pirates.automatePirates();
        }
    },


    // Method for piece to turn in direction of move and then move
    // -----------------------------------------------------------
    turnAndMove: function(n, chosenPiece, topDirection, leftDirection, rotateDirection, gameSpeed) {
        if(transitionMonitor == 1) {console.log('TM: Turn and Move method run: ' + (Date.now() - launchTime))}
        // n is number of transition in chain
        // Transitions to be applied (added here to allow different transitions to be applied dynamically in future)
        chosenPiece.style.transition = 'transform ' + (0.1 * gameSpeed) + 's 0s ease-in-out, left ' + (0.35 * gameSpeed) + 's ' + (0.1 * gameSpeed) + 's ease-in-out, top ' + (0.35 * gameSpeed) + 's ' + (0.1 * gameSpeed) + 's ease-in-out';

        // Delayed application of transformations to give board game style move effect
        //setTimeout(function() {
            //console.log(chosenPiece.style.left, chosenPiece.style.top);
            chosenPiece.style.left = parseFloat(chosenPiece.style.left) + (leftDirection * (gridSize + tileBorder*2)) + 'px';
            chosenPiece.style.top = parseFloat(chosenPiece.style.top) + (topDirection * (gridSize + tileBorder*2)) + 'px';
            chosenPiece.style.transform = 'rotate(' + rotateDirection + 'deg)';
        //}, 500 * gameSpeed);

        return n + 1;
    },

    // Method to allow discovery of new land tiles
    // -------------------------------------------
    landDiscovery: function() {
        if(workFlow == 1) {console.log('Land discovery: ' + (Date.now() - launchTime)); }
        // At end of each move check a 1x1 grid to see if the ship is next to land that is unpopulated
        let searchDistance = 1;
        for (var i = -searchDistance; i < searchDistance + 1; i++) {
            if(this.movementArray.end.row+i >=0 && this.movementArray.end.row+i <row) {
                for (var j = -searchDistance; j < searchDistance + 1; j++) {
                    if(this.movementArray.end.col+j >=0 && this.movementArray.end.col+j <col) {
                        // Reduces seacrh to exclude diagonals
                        if(i == 0 || j == 0) {
                            // Checks if tile is land and unpopulated
                            if(gameBoard.boardArray[this.movementArray.end.row+i][this.movementArray.end.col+j].terrain == 'land' && !gameBoard.boardArray[this.movementArray.end.row+i][this.movementArray.end.col+j].pieces.populatedSquare) {
                                // If so - picks a reource card type using resourceManagement.pickFromResourceDeck() and updates boardArray to this tile tile with unoccupied team
                                deckCard = resourceManagement.pickFromResourceDeck();
                                console.log(deckCard);
                                //randomProduction = Math.floor(Math.random() * (deckCard.maxProduction)) + 1;
                                gameBoard.boardArray[this.movementArray.end.row+i][this.movementArray.end.col+j].pieces = {populatedSquare: true, category: 'Resources', type: deckCard.type, direction: '0', used: 'unused', damageStatus: 5, team: 'Unclaimed', goods: deckCard.goods, stock: 0, production: deckCard.production};
                                console.log(gameBoard.boardArray[this.movementArray.end.row+i][this.movementArray.end.col+j]);
                                // and then creates an SVG resource tile for the land space
                                boardMarkNode.appendChild(gameBoard.createActionTile(this.movementArray.end.row+i, this.movementArray.end.col+j, gameBoard.boardArray[this.movementArray.end.row+i][this.movementArray.end.col+j].pieces.type, gameBoard.boardArray[this.movementArray.end.row+i][this.movementArray.end.col+j].pieces.team,
                                  'tile' + Number((this.movementArray.end.row+i)*1000 + (this.movementArray.end.col+j)), boardSurround + tileBorder/2 + (gridSize + tileBorder * 2) * (this.movementArray.end.row+i), boardSurround + tileBorder/2 + (gridSize + tileBorder * 2) * (this.movementArray.end.col+j), 1, gameBoard.boardArray[this.movementArray.end.row+i][(this.movementArray.end.col+j)].pieces.direction));
                            }
                        }
                    }
                }
            }
        }

        //console.log('valid cargo - start');
    },

    // Method to check a ship is nearby to allow resource to be settled
    // ----------------------------------------------------------------
    shipAvailable: function(searchType) {
        if(workFlow == 1) {console.log('Checking ship available to settle resource: ' + (Date.now() - launchTime)); }
        let searchDistance = 1;
        let result = 'no ship';
        for (var i = -searchDistance; i < searchDistance + 1; i++) {
            if(this.movementArray.start.row+i >=0 && this.movementArray.start.row+i <row) {
                for (var j = -searchDistance; j < searchDistance + 1; j++) {
                    if(this.movementArray.start.col+j >=0 && this.movementArray.start.col+j <col) {
                        // Reduces seacrh to exclude diagonals
                        if(i == 0 || j == 0) {
                            // Checks if tile is ship or correct team
                            if(gameBoard.boardArray[this.movementArray.start.row+i][this.movementArray.start.col+j].pieces.category == 'Transport' && gameBoard.boardArray[this.movementArray.start.row+i][this.movementArray.start.col+j].pieces.team == gameManagement.turn) {
                                if (searchType == 'crew') {
                                    result = 'crew';
                                    gameBoard.boardArray[this.movementArray.start.row+i][this.movementArray.start.col+j].activeStatus = 'active';
                                } else if (gameBoard.boardArray[this.movementArray.start.row+i][this.movementArray.start.col+j].pieces.goods == 'none' || gameBoard.boardArray[this.movementArray.start.row+i][this.movementArray.start.col+j].pieces.goods == searchType) {
                                    result = 'compatible';
                                    gameBoard.boardArray[this.movementArray.start.row+i][this.movementArray.start.col+j].activeStatus = 'active';
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
    depotAvailable: function(searchType) {
        if(workFlow == 1) {console.log('Checking depot available for unloading: ' + (Date.now() - launchTime)); }
        let searchDistance = 1;
        let result = [];
        for (var i = -searchDistance; i < searchDistance + 1; i++) {
            if(this.movementArray.start.row+i >=0 && this.movementArray.start.row+i <row) {
                for (var j = -searchDistance; j < searchDistance + 1; j++) {
                    if(this.movementArray.start.col+j >=0 && this.movementArray.start.col+j <col) {
                        // Reduces seacrh to exclude diagonals
                        if((i == 0 || j == 0) && i != j) {
                            // Checks if tile meets criteria
                            //console.log('here', gameBoard.boardArray[this.movementArray.start.row+i][this.movementArray.start.col+j].pieces.type, gameBoard.boardArray[this.movementArray.start.row+i][this.movementArray.start.col+j].pieces.team);
                            if (gameBoard.boardArray[this.movementArray.start.row+i][this.movementArray.start.col+j].pieces.type == 'fort' && gameBoard.boardArray[this.movementArray.start.row+i][this.movementArray.start.col+j].pieces.team == 'Kingdom') {
                                //console.log('kingdom, fort');
                                if(tradeContracts.checkDelivery(this.movementArray.start.row+i, this.movementArray.start.col+j, searchType, gameBoard.boardArray[this.movementArray.start.row][this.movementArray.start.col].pieces.stock) == true) {
                                    //console.log('delivery');
                                    result.push('fort delivery');
                                    gameBoard.boardArray[this.movementArray.start.row+i][this.movementArray.start.col+j].activeStatus = 'active';
                                }
                            } else if (gameBoard.boardArray[this.movementArray.start.row+i][this.movementArray.start.col+j].pieces.type == 'fort' && gameBoard.boardArray[this.movementArray.start.row+i][this.movementArray.start.col+j].pieces.team == gameManagement.turn && (gameBoard.boardArray[this.movementArray.start.row+i][this.movementArray.start.col+j].pieces.goods == searchType || gameBoard.boardArray[this.movementArray.start.row+i][this.movementArray.start.col+j].pieces.goods == 'none')) {
                                result.push('fort compatible');
                                gameBoard.boardArray[this.movementArray.start.row+i][this.movementArray.start.col+j].activeStatus = 'active';
                            } else if (gameBoard.boardArray[this.movementArray.start.row+i][this.movementArray.start.col+j].pieces.type == 'fort' && gameBoard.boardArray[this.movementArray.start.row+i][this.movementArray.start.col+j].pieces.goods != searchType) {
                                result.push('fort incompatible');
                            } else if (gameBoard.boardArray[this.movementArray.start.row+i][this.movementArray.start.col+j].pieces.team == gameManagement.turn && gameBoard.boardArray[this.movementArray.start.row+i][this.movementArray.start.col+j].pieces.goods == searchType) {
                                result.push(searchType);
                                gameBoard.boardArray[this.movementArray.start.row+i][this.movementArray.start.col+j].activeStatus = 'active';
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
        if (pirates.conflictArray.conflict == true) {
            if(workFlow == 1) {console.log('Ship conflict - battle: ' + (Date.now() - launchTime)); }
            //console.log(pirates.conflictArray);
            // Obtains ID and element of pirates
            IDPirate = 'tile' + Number(pirates.conflictArray.pirate.row*1000 + pirates.conflictArray.pirate.col);
            let piratePiece = document.getElementById(IDPirate);
            // Obtains ID and element of ship
            IDShip = 'tile' + Number(pirates.conflictArray.ship.row*1000 + pirates.conflictArray.ship.col);
            let shipPiece = document.getElementById(IDShip);

            // Get direction from pirate ship to Transport
            conflictTopDirection = (pirates.conflictArray.ship.row - pirates.conflictArray.pirate.row);
            conflictLeftDirection = (pirates.conflictArray.ship.col - pirates.conflictArray.pirate.col);
            // Turn ships to face each other
            conflictDirection = this.movementDirection[(pirates.conflictArray.ship.col - pirates.conflictArray.pirate.col) + 1][(pirates.conflictArray.ship.row - pirates.conflictArray.pirate.row) + 1] - 90;

            // Simulate cannon fire animation
            let reductionDirection = 0.25;
            let repeat = 4;
            let fireEffect = 1;

            // Function animates sea battle, calculates winner, and transfers stolen goods if necessary
            function cannonFire() {
                if(workFlow == 1) {console.log('Runs cannon fire: ' + (Date.now() - launchTime)); }
                if (repeat > 0) {
                    shipPiece.style.transition = 'transform ' + (0.4 * gameSpeed) + 's 0s ease-in-out, left ' + (0.7 * gameSpeed * fireEffect) + 's ' + (0.0 * gameSpeed * fireEffect) + 's ease-in-out, top ' + (0.7 * gameSpeed * fireEffect) + 's ' + (0.0 * gameSpeed * fireEffect) + 's ease-in-out';
                    piratePiece.style.transition = 'transform ' + (0.4 * gameSpeed) + 's 0s ease-in-out, left ' + (0.7 * gameSpeed * fireEffect) + 's ' + (0.0 * gameSpeed * fireEffect) + 's ease-in-out, top ' + (0.7 * gameSpeed * fireEffect) + 's ' + (0.0 * gameSpeed * fireEffect) + 's ease-in-out';
                    shipPiece.style.transform = 'rotate(' + conflictDirection + 'deg)';
                    piratePiece.style.transform = 'rotate(' + conflictDirection + 'deg)';
                    shipPiece.style.left = parseFloat(shipPiece.style.left) - (conflictLeftDirection * reductionDirection * (gridSize + tileBorder*2)) + 'px';
                    shipPiece.style.top = parseFloat(shipPiece.style.top) - (conflictTopDirection * reductionDirection * (gridSize + tileBorder*2)) + 'px';
                    piratePiece.style.left = parseFloat(piratePiece.style.left) + (conflictLeftDirection * reductionDirection * (gridSize + tileBorder*2)) + 'px';
                    piratePiece.style.top = parseFloat(piratePiece.style.top) + (conflictTopDirection * reductionDirection * (gridSize + tileBorder*2)) + 'px';
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
                    piratePiece.addEventListener('transitionend', function cannonHandler(e) {
                        if (e.propertyName == 'top' || e.propertyName == 'left') {
                            if(e.timeStamp - endCannon > 50 * gameSpeed) {
                                endCannon = e.timeStamp;
                                if(workFlow == 1) {console.log('Conflict single transition end: ' + (Date.now() - launchTime)); }
                                piratePiece.removeEventListener('transitionend', cannonHandler);
                                cannonFire();
                            }
                        }
                    });

                } else {
                    if(workFlow == 1) {console.log('Conflict transition ended - decide winner and update board array: ' + (Date.now() - launchTime)); }
                    //console.log(pirates.conflictArray);
                    // Calculates winner of sea battle  - 50% chance of each ship winning battle
                    if (Math.random()>0.5) {
                        // Pirate ship wins battle and team ship is damaged
                        if (gameBoard.boardArray[pirates.conflictArray.ship.row][pirates.conflictArray.ship.col].pieces.type == 'cargo ship') {
                            gameBoard.boardArray[pirates.conflictArray.ship.row][pirates.conflictArray.ship.col].pieces.damageStatus = 0;
                        } else {
                            gameBoard.boardArray[pirates.conflictArray.ship.row][pirates.conflictArray.ship.col].pieces.damageStatus = 0;
                        }
                        gameBoard.damageShip(shipPiece, gameBoard.boardArray[pirates.conflictArray.ship.row][pirates.conflictArray.ship.col].pieces.team, gameBoard.boardArray[pirates.conflictArray.ship.row][pirates.conflictArray.ship.col].pieces.type, gameBoard.boardArray[pirates.conflictArray.ship.row][pirates.conflictArray.ship.col].pieces.damageStatus);

                        // Any cargo lost (assumed taken by pirate ship - although it won't be registered as carried by pirate ship as this would prevent further attacks)
                        gameBoard.boardArray[pirates.conflictArray.ship.row][pirates.conflictArray.ship.col].pieces.goods = 'none';
                        gameBoard.boardArray[pirates.conflictArray.ship.row][pirates.conflictArray.ship.col].pieces.stock = 0;
                    } else {
                        // Team ship wins battle and pirate ship is damaged
                        gameBoard.boardArray[pirates.conflictArray.pirate.row][pirates.conflictArray.pirate.col].pieces.damageStatus = 0;
                        gameBoard.damageShip(piratePiece, 'Pirate', gameBoard.boardArray[pirates.conflictArray.pirate.row][pirates.conflictArray.pirate.col].pieces.type, gameBoard.boardArray[pirates.conflictArray.pirate.row][pirates.conflictArray.pirate.col].pieces.damageStatus);
                    }
                    pirates.conflictArray = {conflict: false, start: {row: '', col: ''}, end: {row: '', col: ''}};
                    pieceMovement.moveCompletion();
                }
            }
            cannonFire();

        } else {
            if(workFlow == 1) {console.log('Ship conflict - No battle: ' + (Date.now() - launchTime)); }
            pieceMovement.moveCompletion();
        }
    },

    // Method to repair ship in safe harbour
    // -------------------------------------
    harbourRepairArrival: function(shipPiece) {
        if(workFlow == 1) {console.log('Harbour repair arrival: ' + (Date.now() - launchTime)); }
        let repairDirection = 0;
        // Finds moves that end in harbour repair
        if (this.movementArray.start.pieces.damageStatus == 0 && gameManagement.turn != 'Pirate' && gameBoard.boardArray[this.movementArray.end.row][this.movementArray.end.col].subTerrain == 'harbour') {
            shipPiece.style.transition = 'transform ' + (0.4 * gameSpeed) + 's 0s ease-in-out';
            for (var k = -1; k <= 1; k++) {
                for (var l = -1; l <= 1; l++) {
                    // Turns ship to face fort for repair
                    if ((this.movementArray.end.row+k >= 0) && (this.movementArray.end.row+k < row)) {
                        if ((this.movementArray.end.col+l >= 0) && (this.movementArray.end.col+l < col)) {
                            if(gameBoard.boardArray[this.movementArray.end.row+k][this.movementArray.end.col+l].pieces.type == 'fort') {
                                repairDirection = this.movementDirection[l + 1][k + 1];
                            }
                        }
                    }
                }
            }
            shipPiece.style.transform = 'rotate(' + repairDirection + 'deg)';

            // Updates boardArray for new status
            if (gameBoard.boardArray[this.movementArray.end.row][this.movementArray.end.col].pieces.type == 'cargo ship') {
                gameBoard.boardArray[this.movementArray.end.row][this.movementArray.end.col].pieces.damageStatus = 1;
            } else {
                gameBoard.boardArray[this.movementArray.end.row][this.movementArray.end.col].pieces.damageStatus = 3;
            }
            gameBoard.boardArray[this.movementArray.end.row][this.movementArray.end.col].pieces.direction = repairDirection;
            gameBoard.repairShip(shipPiece, gameBoard.boardArray[this.movementArray.end.row][this.movementArray.end.col].pieces.team, gameBoard.boardArray[this.movementArray.end.row][this.movementArray.end.col].pieces.type, gameBoard.boardArray[this.movementArray.end.row][this.movementArray.end.col].pieces.damageStatus);
        } else if (this.movementArray.start.pieces.damageStatus == 0 && gameManagement.turn == 'Pirate' && gameBoard.boardArray[this.movementArray.end.row][this.movementArray.end.col].subTerrain == 'pirateHarbour') {
            // Updates boardArray for new status
            gameBoard.boardArray[this.movementArray.end.row][this.movementArray.end.col].pieces.damageStatus = 3;
            gameBoard.repairShip(shipPiece, gameBoard.boardArray[this.movementArray.end.row][this.movementArray.end.col].pieces.team, gameBoard.boardArray[this.movementArray.end.row][this.movementArray.end.col].pieces.type, gameBoard.boardArray[this.movementArray.end.row][this.movementArray.end.col].pieces.damageStatus);
        }
    },

    // Method to check for ships to repair at start of turn
    // ----------------------------------------------------
    harbourRepair: function() {
        if(workFlow == 1) {console.log('Harbour repair check: ' + (Date.now() - launchTime)); }
        // Finds ships in harbour undergoing repair
        for (var i = 0; i < gameBoard.boardArray.length; i++) {
            for (var j = 0; j < gameBoard.boardArray[i].length; j++) {
                if((gameBoard.boardArray[i][j].pieces.category == 'Transport') && (gameBoard.boardArray[i][j].pieces.team == gameManagement.turn)) {
                    // Calculates placement on board of tile to obtain piece SVG
                    IDPieceStart = 'tile' + (i*1000 + j);
                    let shipPiece = document.getElementById(IDPieceStart);

                    // Calls repairShip to carry out the different repairs
                    if (gameBoard.boardArray[i][j].pieces.damageStatus > 0 && gameBoard.boardArray[i][j].pieces.damageStatus < 5) {
                        gameBoard.boardArray[i][j].pieces.damageStatus +=1;
                        gameBoard.repairShip(shipPiece, gameManagement.turn, gameBoard.boardArray[i][j].pieces.type, gameBoard.boardArray[i][j].pieces.damageStatus);
                    }
                    /*if (gameBoard.boardArray[i][j].pieces.damageStatus == 'repair0') {
                        gameBoard.boardArray[i][j].pieces.damageStatus = 'repair1'
                        gameBoard.repairShip(shipPiece, gameManagement.turn, 'repair1');
                    } else if(gameBoard.boardArray[i][j].pieces.damageStatus == 'repair1') {
                        gameBoard.boardArray[i][j].pieces.damageStatus = 'repair2';
                        gameBoard.repairShip(shipPiece, gameManagement.turn, 'repair2');
                    } else if(gameBoard.boardArray[i][j].pieces.damageStatus == 'repair2') {
                        gameBoard.boardArray[i][j].pieces.damageStatus = 0;
                        gameBoard.repairShip(shipPiece, gameManagement.turn, 0);
                    }*/
                }
            }
        }
    },

// LAST BRACKET OF OBJECT
}
