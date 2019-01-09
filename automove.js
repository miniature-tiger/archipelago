this.movementArray// Computer opponent object - methods for AI of computer opponents
// ---------------------------------------------------------------

let computer = {

    computerShipsAll:  [],

    computerShipsTurn:  [],

    teamHome: { 'Red': {homeRow: 0, homeCol: 15},
                'Green': {homeRow: 30, homeCol: 15},
                'Blue': {homeRow: 15, homeCol: 0},
                'Orange': {homeRow: 15, homeCol: 29},
              },

    computerShipsTurnCount: -1,

    moveDecisionArray: [],

    finalDecision: [],

    priorMoves: [],

    targetHarbour: [],

    telescopeHarbour: [],

    telescopeResources: [],

    bestDestination: [],

    maxDistanceTiles: [],

    minCostTiles: [],

    contractStatsTurn: [],

    // Movement array
    // --------------
    movementArray: {startEnd: 'start', start: {row: null, col: null, piece: null}, end: {row: null, col: null, piece: null}},

    // Method to manage automated movement of computer opponent ships
    // --------------------------------------------------------------
    automatePlayer: function() {
        if(settings.workFlow === true) {console.log('Automate computer opponent: ' + (Date.now() - settings.launchTime)); }
        // Update array of all computer opponent ships
        if (computer.computerShipsTurnCount == -1) {
            computer.priorMoves = [];
            this.populateComputerShipsArray();
            // Separate array of ships for current turn
            this.computerShipsTurn = this.computerShipsAll.filter(fI => fI.team == game.turn);
            if(settings.arrayFlow === true) {console.log('computerShipsTurn', JSON.parse(JSON.stringify(this.computerShipsTurn)));}
            // Building decision made at the start of the turn
            stockDashboard.goodsStockTake();
            this.decideBuild();

            // Obtain stats on potential contract deliveries for player
            stockDashboard.goodsStockTake();
            computer.contractStatsTurn = stockDashboard.contractStats();
            if (settings.arrayFlow === true) {console.log('contractStats', JSON.parse(JSON.stringify(computer.contractStatsTurn)));}
        }

        // Increases counter to move on to next ship
        computer.computerShipsTurnCount +=1;

        // Ship move or update once all ships have moved
        if(computer.computerShipsTurnCount < computer.computerShipsTurn.length) {
            // Calls decision method before each ship moves to decide moves for ships
            computer.moveChoices();
            computer.moveDecision();
            // Moves ship
            computer.computerMove();

        } else {
            if(settings.workFlow === true) {console.log('All computer opponent ships have moved. Update dashboards and event listeners: ' + (Date.now() - settings.launchTime)); }
            // Update the stock dashboard
            stockDashboard.stockTake();
            stockDashboard.drawStock();

            computer.computerShipsTurnCount = -1;
            game.nextTurn();
        }
    },

    // Makes a list of best moves from each category and ship for a computer player
    // ----------------------------------------------------------------------------
    moveChoices: function() {

        let decisionMoves = 3;
        let bestCollection = [];
        let bestDelivery = [];
        computer.moveDecisionArray = [];

        // Loops through each ship and determines best scoring moves (resource searches, contract delivery etc)
        computer.computerShipsTurn.forEach(function(ship, index) {
            // Only undamaged ships are covered by decision making functions - damaged ships just head for repair
            if (ship.start.piece.damageStatus === 5 && ship.moveStatus === false) {
                // Finds ship maxMove for findpath generation
                maxMove = gameData.pieceTypes[ship.start.piece.type].maxMove;
                // activates tiles to generate findpath and uses telescope to find best moves
                pieceMovement.activateTiles(ship.start.row, ship.start.col, maxMove, 30, false, 5);
                computer.telescopeResources = game.board.useTelescope(ship.start, 'resourceHarbour', game.rows);
                if(settings.arrayFlow === true) {console.log('telescopeResources', computer.telescopeResources);}
                // Adds best resource search moves to moveDecisionArray
                computer.bestDestination = computer.rankDestinations(computer.telescopeResources);
                if (computer.bestDestination.length > 0) {
                    for (let i = 0; i < Math.min(computer.bestDestination.length, decisionMoves); i+=1) {
                        let targetRefs = [];
                        for (let j = 0; j < computer.bestDestination[i].resourceHarbour.length; j+=1) {
                            targetRefs.push(computer.bestDestination[i].resourceHarbour[j].ref);
                        }
                        lastTile = pirates.findLastActive(pieceMovement.findPath[computer.bestDestination[i].row][computer.bestDestination[i].col].path, 0);
                        computer.moveDecisionArray.push({ship: ship.type, shipNumber: index, moveType: 'resource', points: computer.bestDestination[i].points, target: targetRefs, actionFlag: {}, moveCost: computer.bestDestination[i].moveCost,
                                                            distance: computer.bestDestination[i].distance, destinationRow: computer.bestDestination[i].row, destinationCol: computer.bestDestination[i].col,
                                                            row: pieceMovement.findPath[computer.bestDestination[i].row][computer.bestDestination[i].col].path[lastTile].fromRow, col: pieceMovement.findPath[computer.bestDestination[i].row][computer.bestDestination[i].col].path[lastTile].fromCol});
                    }
                }
                // Adds best resource collection moves to moveDecisionArray
                if (ship.start.piece.stock == 0) {
                    bestCollection = computer.rankCollection(computer.telescopeResources, computer.contractStatsTurn, maxMove, decisionMoves);
                    for (let i = 0; i < bestCollection.length; i+=1) {
                        lastTile = pirates.findLastActive(pieceMovement.findPath[bestCollection[i].row][bestCollection[i].col].path, 0);
                        computer.moveDecisionArray.push({ship: ship.type, shipNumber: index, moveType: 'collection', points: bestCollection[i].points, target: [bestCollection[i].resource], actionFlag: {}, moveCost: bestCollection[i].moveCost, distance: bestCollection[i].distance,
                                                            island: bestCollection[i].island, initial: bestCollection[i].initial, destinationRow: bestCollection[i].row, destinationCol: bestCollection[i].col, targetRow: bestCollection[i].targetRow, targetCol: bestCollection[i].targetCol,
                                                            row: pieceMovement.findPath[bestCollection[i].row][bestCollection[i].col].path[lastTile].fromRow, col: pieceMovement.findPath[bestCollection[i].row][bestCollection[i].col].path[lastTile].fromCol});
                    }
                }
                // Adding best contract delivery moves to moveDecisionArray
                let telescopeHarbours = game.board.useTelescope(ship.start, 'harbour', game.rows).filter(move => move.harbour[0].team == "Kingdom");
                if(settings.arrayFlow === true) {console.log('telescopeHarbours', telescopeHarbours);}
                bestDelivery = computer.rankDelivery(telescopeHarbours, computer.contractStatsTurn, maxMove, decisionMoves, index);

                for (let i = 0; i < bestDelivery.length; i+=1) {
                    lastTile = pirates.findLastActive(pieceMovement.findPath[bestDelivery[i].row][bestDelivery[i].col].path, 0);
                    computer.moveDecisionArray.push({ship: ship.type, shipNumber: index, moveType: 'delivery', points: bestDelivery[i].points, target: [bestDelivery[i].island], actionFlag: bestDelivery[i].actionFlag, moveCost: bestDelivery[i].moveCost, distance: bestDelivery[i].distance,
                                                        island: bestDelivery[i].island, initial: bestDelivery[i].initial, destinationRow: bestDelivery[i].row, destinationCol: bestDelivery[i].col, targetRow: bestDelivery[i].targetRow, targetCol: bestDelivery[i].targetCol,
                                                        row: pieceMovement.findPath[bestDelivery[i].row][bestDelivery[i].col].path[lastTile].fromRow, col: pieceMovement.findPath[bestDelivery[i].row][bestDelivery[i].col].path[lastTile].fromCol});
                }
            }
            pieceMovement.deactivateTiles();
        });
        if (settings.arrayFlow === true) {console.log('moveDecisionArray', JSON.parse(JSON.stringify(computer.moveDecisionArray)));}
    },


    // Makes decisions on which moves to choose from list derived in moveChoices
    // -------------------------------------------------------------------------
    // Decisions are reviewed after each ship move in light of new information
    moveDecision: function() {

        // First implementation is simple - sorts and takes highest scoring move overall
        // then next high score that does not use the same ship or target the same tile
        if (settings.arrayFlow === true) {console.log('priorMoves', JSON.parse(JSON.stringify(computer.priorMoves)));}
        computer.finalDecision = JSON.parse(JSON.stringify(computer.priorMoves));
        computer.moveDecisionArray.sort(function (a, b) {
            return b.points[2] - a.points[2];
        });

        // Makes move decision for each ship from amongst resource / collection etc options
        // All ships considered even though only one ship is moved at a time
        // - i.e. team-based decision-making considers strategy of all ships when making move decision for one ship
        // .some used to ensure no overlap between move targets
        for (let option of computer.moveDecisionArray) {
            if (option.points[0] > 0 && !computer.finalDecision.some(best => best.ship == option.ship) && !computer.finalDecision.some(best => best.target.some(value => option.target.includes(value)))) {
                computer.finalDecision.push(option);
            }
        }

        if (settings.arrayFlow === true) {console.log('finalDecision', JSON.parse(JSON.stringify(computer.finalDecision)));}
    },


    // Moves computer ships based on decisions made
    // --------------------------------------------
    computerMove: function() {
        if(settings.workFlow === true) {console.log('Computer player: ' + computer.computerShipsTurn[computer.computerShipsTurnCount].team + ' ' + computer.computerShipsTurn[computer.computerShipsTurnCount].type + ' moves: '+ (Date.now() - settings.launchTime)); }
        if(computer.computerShipsTurnCount < computer.computerShipsTurn.length) {

            // -------------- SET UP -----------------
            // Resets movement array
            this.movementArray = {startEnd: 'start', start: {row: null, col: null, piece: null}, end: {row: null, col: null, piece: null}};
            // Starting tile for pirate ship move taken from array of pirate ships
            this.movementArray.start = computer.computerShipsTurn[computer.computerShipsTurnCount].start;
            // Pulling maxMove from pieces array
            maxMove = gameData.pieceTypes[this.movementArray.start.piece.type].maxMove;

            // -------------- FINDING PATHS AND ACTIVATING TILES (equivalent of START of move) -----------------
            // Tiles activated which also finds path for moves and information on reachable area
            // true / false allow red boundaries to be highlighted or not
            let searchRange = 0;
            // Activating tiles and findPath for damaged ships at sea (damageStatus is set to 0 after battle loss)
            if (this.movementArray.start.piece.damageStatus === 0) {
                if(settings.workFlow === true) {console.log('Damaged ship - find paths: '+ (Date.now() - settings.launchTime)); }
                searchRange = 10; // Consider processing requirement and determine whether this needs to be restricted to 10
                pieceMovement.activateTiles(this.movementArray.start.row, this.movementArray.start.col, 2.1, searchRange, true, 0);
            // Activating tiles and findPath for undamaged ships (damageStatus is 5 for healthy ships)
            } else if (this.movementArray.start.piece.damageStatus === 5) {
                if(settings.workFlow === true) {console.log('Good ship - find paths: '+ (Date.now() - settings.launchTime)); }
                searchRange = 30;
                pieceMovement.activateTiles(this.movementArray.start.row, this.movementArray.start.col, maxMove, searchRange, true, 5);
            // Setting findPath for ships under repair (damageStatus between 0 and 5) to prevent ships moving
            } else {
                pieceMovement.initialisefindPath(this.movementArray.start.row, this.movementArray.start.col);
            }

            // -------------- DECIDING MOVE (equivalent of END of move) -----------------
            // Deciding move for damaged ships at sea (damageStatus is set to 0 after battle loss)
            if (this.movementArray.start.piece.damageStatus === 0) {
                if(settings.workFlow === true) {console.log('Damaged ship - decide move: '+ (Date.now() - settings.launchTime)); }

                computer.targetHarbour = pirates.findTarget('All', 'harbour');
                if(settings.arrayFlow === true) {console.log('targetHarbour', computer.targetHarbour);}
                computer.telescopeHarbour = game.board.useTelescope(this.movementArray.start, 'harbour', maxMove);
                if(settings.arrayFlow === true) {console.log('telescopeHarbour', computer.telescopeHarbour);}

                if (computer.targetHarbour.length > 0) {
                    // 1 - Move to safe harbour within wind range
                    if(settings.workFlow === true) {console.log('Move to safe harbour within wind range: ' + (Date.now() - settings.launchTime)); }
                    computer.targetHarbour = pirates.minArray(computer.targetHarbour, 'distance');
                    computer.targetHarbour = pirates.minArray(computer.targetHarbour, 'moveCost');
                    if(settings.workFlow === true) {console.log('targetCargo - min', computer.targetHarbour);}
                    // Attacks targetable Transports if in range (currently just uses first Transport in array - to improve in future)
                    // Keep - useful for debugging - console.log('found target: ' + pirates.targetCargo[0].row + ' ' + pirates.targetCargo[0].col);
                    lastTile = pirates.findLastActive(pieceMovement.findPath[computer.targetHarbour[0].row][computer.targetHarbour[0].col].path, 0);
                    computer.computerShipsTurn[computer.computerShipsTurnCount].end.row = pieceMovement.findPath[computer.targetHarbour[0].row][computer.targetHarbour[0].col].path[lastTile].fromRow;
                    computer.computerShipsTurn[computer.computerShipsTurnCount].end.col = pieceMovement.findPath[computer.targetHarbour[0].row][computer.targetHarbour[0].col].path[lastTile].fromCol;
                } else if (computer.telescopeHarbour.length > 0) {
                    // 2 - Search for nearest safe Harbour outside wind range
                    if(settings.workFlow === true) {console.log('Move towards safe harbour outside wind range: ' + (Date.now() - settings.launchTime)); }
                    // Finds safe harbours within the findPath then cuts down array based on minimum distance and move cost
                    computer.telescopeHarbour = pirates.minArray(computer.telescopeHarbour, 'distance');
                    computer.telescopeHarbour = pirates.minArray(computer.telescopeHarbour, 'moveCost');
                    if(settings.workFlow === true) {console.log('telescopeHarbour - min', computer.telescopeHarbour);}
                    lastTile = pirates.findLastActive(pieceMovement.findPath[computer.telescopeHarbour[0].row][computer.telescopeHarbour[0].col].path, 0);
                    computer.computerShipsTurn[computer.computerShipsTurnCount].end.row = pieceMovement.findPath[computer.telescopeHarbour[0].row][computer.telescopeHarbour[0].col].path[lastTile].fromRow;
                    computer.computerShipsTurn[computer.computerShipsTurnCount].end.col = pieceMovement.findPath[computer.telescopeHarbour[0].row][computer.telescopeHarbour[0].col].path[lastTile].fromCol;
                } else {
                    // 3 - Moves towards home - should almost never be called
                    if(settings.workFlow === true) {console.log('Moves towards home: ' + (Date.now() - settings.launchTime)); }
                    lastTile = pirates.findLastActive(pieceMovement.findPath[computer.computerShipsTurn[computer.computerShipsTurnCount].manifest.homeRow][computer.computerShipsTurn[computer.computerShipsTurnCount].manifest.homeCol].path, 0);
                    computer.computerShipsTurn[computer.computerShipsTurnCount].end.row = pieceMovement.findPath[computer.computerShipsTurn[computer.computerShipsTurnCount].manifest.homeRow][computer.computerShipsTurn[computer.computerShipsTurnCount].manifest.homeCol].path[lastTile].fromRow;
                    computer.computerShipsTurn[computer.computerShipsTurnCount].end.col = pieceMovement.findPath[computer.computerShipsTurn[computer.computerShipsTurnCount].manifest.homeRow][computer.computerShipsTurn[computer.computerShipsTurnCount].manifest.homeCol].path[lastTile].fromCol;
                }

            // Deciding move for undamaged ships (damageStatus is 5 for healthy ships)
            } else if (this.movementArray.start.piece.damageStatus == 5) {
                if(settings.workFlow === true) {console.log('Good ship - decide move: '+ (Date.now() - settings.launchTime)); }

                // If move has previously been decided in moveDecision then takes this move
                let finalDecisionPosition = computer.finalDecision.findIndex(fI => fI.shipNumber == computer.computerShipsTurnCount);
                if (finalDecisionPosition != -1) {
                    computer.computerShipsTurn[computer.computerShipsTurnCount].end.row = computer.finalDecision[finalDecisionPosition].row;
                    computer.computerShipsTurn[computer.computerShipsTurnCount].end.col = computer.finalDecision[finalDecisionPosition].col;
                    computer.priorMoves.push(computer.finalDecision[finalDecisionPosition]);
                } else {
                // If move has not previously been decided in moveDecision then moves maximum distance at minimum wind cost
                    if(settings.workFlow === true) {console.log('Finds max distance move at minimum cost: ' + (Date.now() - settings.launchTime)); }
                    computer.maxDistanceTiles = pirates.maxPathDistance();
                    computer.minCostTiles = pirates.minArray(computer.maxDistanceTiles, 'moveCost');
                    computer.computerShipsTurn[computer.computerShipsTurnCount].end.row = computer.minCostTiles[0].row;
                    computer.computerShipsTurn[computer.computerShipsTurnCount].end.col = computer.minCostTiles[0].col;
                }

            // Catching move for ships under repair (damageStatus between 0 and 5)
            } else {
                // No action currently necessary - included for future development
            }

            // -------------- GRAPHICS / TRANSITION OF MOVE  -----------------
            // End position for pirate ship confirmed with movement array then move activated and dashboard recalculated
            this.movementArray.end = computer.computerShipsTurn[computer.computerShipsTurnCount].end;
            if(settings.workFlow === true) {
                console.log('Computer opponent move decided - movement array shown below: '+ (Date.now() - settings.launchTime));
                console.log(this.movementArray);
            }
            computer.computerShipsTurn[computer.computerShipsTurnCount].moveStatus = true;
            if(settings.arrayFlow === true) {console.log('computerShipsTurn', JSON.parse(JSON.stringify(this.computerShipsTurn)));}
            //pieceMovement.deactivateTiles();
            computer.loadShip();
            new Move(this.movementArray.start, this.movementArray.end, 'transport', {}).process();
        }
    },

    // Method to generate a list of computer opponent ships with useful information
    // ----------------------------------------------------------------------------
    populateComputerShipsArray: function() {
        if(settings.workFlow === true) {console.log('Populate computer opponent ship array: ' + (Date.now() - settings.launchTime)); }
        for (var i = 0; i < game.boardArray.length; i++) {
            for (var j = 0; j < game.boardArray[i].length; j++) {
                if (game.boardArray[i][j].piece.category == 'Transport') {
                    let shipDetails = gameData.pieceTypes[game.boardArray[i][j].piece.type];
                    let goodsHarbour = computer.checkCanLoadGoods(i, j, shipDetails.maxHold);
                    //let goodsHarbour = [];
                    index = this.computerShipsAll.findIndex(fI => (fI.team == game.boardArray[i][j].piece.team && fI.type == game.boardArray[i][j].piece.type));
                    if (index == -1) {
                        this.computerShipsAll.push({team: game.boardArray[i][j].piece.team, type: game.boardArray[i][j].piece.type, manifest: this.teamHome[game.boardArray[i][j].piece.team], goodsHarbour: goodsHarbour, start: {row: + i, col: + j, piece: game.boardArray[i][j].piece}, end: {row: + i, col: + j}, moveStatus: false});
                    } else {
                        this.computerShipsAll[index].start = {row: + i, col: + j, piece: game.boardArray[i][j].piece};
                        this.computerShipsAll[index].end = {row: + i, col: + j};
                        this.computerShipsAll[index].moveStatus = false;
                        this.computerShipsAll[index].goodsHarbour = goodsHarbour;
                    }
                }
            }
        }
        if(settings.arrayFlow === true) {console.log('computerShipsAll', JSON.parse(JSON.stringify(this.computerShipsAll)));}
    },

    // Method to check whether ship is docked in a resource harbour of its team and if so to return potential goods loading
    // -----------------------------------------------------------------------------------------------------------------------
    checkCanLoadGoods: function(locali, localj, maxHold) {
        let possibleGoods = [];
        for (let k = -1; k <= 1; k+=1) {
            if (locali + k >=0 && locali + k < game.rows) {
                for (let l = -1; l <= 1; l+=1) {
                    if (localj + l >=0 && localj + l < game.cols) {
                        // Reduces search to exclude diagonals
                        if (k == 0 || l == 0) {
                            if ((game.boardArray[locali+k][localj+l].piece.category == 'Resources') && (game.boardArray[locali+k][localj+l].piece.team == game.boardArray[locali][localj].piece.team)) {
                                let maximumStock = Math.min(game.boardArray[locali+k][localj+l].piece.stock, maxHold);
                                possibleGoods.push({goods: game.boardArray[locali+k][localj+l].piece.goods, stock: maximumStock, ref: (locali+k)+'-'+(localj+l)});
                            }
                        }
                    }
                }
            }
        }
        return possibleGoods;
    },

    // Method to check whether there are resources to be claimed and decide whether a resource should be claimed
    // ---------------------------------------------------------------------------------------------------------
    decideClaimResource: function() {
        // Array of resources to be claimed
        let claimableResources = [];
        let teamPosition = stockDashboard.pieceTotals.findIndex(fI => fI.team == game.turn);
        let resourceType = '';

        // Check whether there are resources to be claimed
        for (let k = 0; k < computer.computerShipsTurn.length; k+=1) {
            for (let i = -1; i <= 1; i+=1) {
                if(computer.computerShipsTurn[k].end.row+i >=0 && computer.computerShipsTurn[k].end.row+i < game.rows) {
                    for (let j = -1; j <= 1; j+=1) {
                        if(computer.computerShipsTurn[k].end.col+j >=0 && computer.computerShipsTurn[k].end.col+j < game.cols) {
                            // Reduces search to exclude diagonals
                            if(i === 0 || j === 0) {
                                // Checks if tile is land and unpopulated
                                if (game.boardArray[computer.computerShipsTurn[k].end.row+i][computer.computerShipsTurn[k].end.col+j].piece.category === 'Resources' && game.boardArray[computer.computerShipsTurn[k].end.row+i][computer.computerShipsTurn[k].end.col+j].piece.type !== 'desert' && game.boardArray[computer.computerShipsTurn[k].end.row+i][computer.computerShipsTurn[k].end.col+j].piece.team === 'Unclaimed') {
                                    resourceType = game.boardArray[computer.computerShipsTurn[k].end.row+i][computer.computerShipsTurn[k].end.col+j].piece.type;
                                    // Exclude resource types that have already been claimed
                                    if (stockDashboard.pieceTotals[teamPosition].pieces[resourceType].quantity == 0) {
                                        claimableResources.push({ startMove: {row: computer.computerShipsTurn[k].end.row+i, col: computer.computerShipsTurn[k].end.col+j},
                                                                  endMove: {row: computer.computerShipsTurn[k].end.row, col: computer.computerShipsTurn[k].end.col},
                                                                  type: game.boardArray[computer.computerShipsTurn[k].end.row+i][computer.computerShipsTurn[k].end.col+j].piece.type,
                                                                  production: game.boardArray[computer.computerShipsTurn[k].end.row+i][computer.computerShipsTurn[k].end.col+j].piece.production});
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        if(settings.arrayFlow === true) {console.log('claimableResources', claimableResources);}

        // Reduce down array / sort order of claiming according to criteria - ignore for first implementation

        // Decide whether a resource should be claimed - simple version of decision for first implementation
        for (var l = 0; l < claimableResources.length; l+=1) {
            // Need to check whether player has already claimed this resource in this loop - can happen that claimableResource includes 2 or 3 of same resource type
            if (stockDashboard.pieceTotals[teamPosition].pieces[claimableResources[l].type].quantity === 0) {
                // Claim resource (already checked that have resource in construction of claimable resource)
                new Move(claimableResources[l].startMove, claimableResources[l].endMove, 'claim', {}).process();
                // Update stock take and stock dashboard before next claimable resource checked
                stockDashboard.stockTake();
                stockDashboard.drawStock();
            }
        }
    },

    // Method to load ship with goods once collection tile has been reached
    // ------------------------------------------------------------------
    loadShip: function() {
        // gather info on ship that is moving and on move being made
        let shipDetails = computer.computerShipsTurn[computer.computerShipsTurnCount];
        let finalDecisionPosition = computer.finalDecision.findIndex(fI => fI.shipNumber == computer.computerShipsTurnCount);
        if (finalDecisionPosition != -1) {
            let finalDecn = computer.finalDecision[finalDecisionPosition];
            // check if move is a delivery move requiring loading
            if (finalDecn.moveType == 'delivery' && finalDecn.actionFlag.action == 'load') {
                let [resourceRow, resourceCol] = [Number(finalDecn.actionFlag.ref.split("-")[0]), Number(finalDecn.actionFlag.ref.split("-")[1])];
                // calculate amount and type of goods to be loaded
                let amountToLoad = finalDecn.initial;
                amountToLoad = Math.min(amountToLoad, gameData.pieceTypes[finalDecn.ship].maxHold - computer.computerShipsTurn[computer.computerShipsTurnCount].start.piece.stock);
                goodsToLoad = game.boardArray[resourceRow][resourceCol].piece.goods;
                // update game board with changes to goods

                new Move({row: resourceRow, col: resourceCol}, {row: shipDetails.start.row, col: shipDetails.start.col}, 'load', {goods: goodsToLoad, quantity: amountToLoad}).process();
            }
        }
    },

    // Method to check where delivery can be completed
    // -------------------------------------------------
    goodsDelivery: function() {
        // gather info on ship that is moving and on move being made
        let shipDetails = computer.computerShipsTurn[computer.computerShipsTurnCount];
        let finalDecisionPosition = computer.finalDecision.findIndex(fI => fI.shipNumber == computer.computerShipsTurnCount);
        if (finalDecisionPosition != -1) {
            let finalDecn = computer.finalDecision[finalDecisionPosition];
            // check if move is a delivery move requiring loading
            if (finalDecn.moveType == 'delivery' && shipDetails.end.row == finalDecn.destinationRow && shipDetails.end.col == finalDecn.destinationCol) {
                let tradeRouteInfo = tradeContracts.discoverPath(finalDecn.targetRow, finalDecn.targetCol, shipDetails.start.piece.goods);
                tradeContracts.fulfilDelivery(shipDetails.start.piece.goods, tradeRouteInfo, shipDetails.end.row, shipDetails.end.col, finalDecn.targetRow, finalDecn.targetCol);
                tradeContracts.drawContracts();
            }
        }
    },

    // Method to check whether a ship can be built and decide whether to build a ship and which ship
    // ---------------------------------------------------------------------------------------------
    decideBuild: function() {
        let buildStats = stockDashboard.buildStats(game.turn);
        let buildOptions = [];
        let buildCounter = 0;

        // Prefer warship to cargo ship if actual rewards are equal
        buildStats['warship'].buildReward += 0.5;

        // loop through all ship types
        for (const pieceType of Object.keys(buildStats)) {
            // check if ship piece is not already held - only one of each type allowed per player
            if (buildStats[pieceType].player === 0) {
                // check whether ship can be built based on resources
                let buildNo = buildItem.buildRecipe.findIndex(fI => fI.type == pieceType);
                if (buildItem.enoughGoodsToBuild(buildNo, game.turn)) {
                    buildStats[pieceType].buildPossible = true;
                    buildOptions.push({type: pieceType, buildReward: buildStats[pieceType].buildReward});
                    buildCounter += 1;
                } else {
                    buildStats[pieceType].buildPossible = false;
                }
            } else {
                buildStats[pieceType].buildPossible = false;
            }
        }
        if (settings.arrayFlow === true) {console.log('buildStats', buildStats);}
        if (settings.arrayFlow === true) {console.log('buildOptions', buildOptions);}

        if (buildCounter > 0) {
            // deciding which ship to build
            let maxScore = 0;
            for (var i = 0; i < buildOptions.length; i+=1) {
                if (buildOptions[i].buildReward > maxScore) {
                    buildChoice = i;
                    shipBuildType = buildOptions[i].type;
                    maxScore = buildOptions[i].buildReward
                }
            }

            // Resets movement array
            this.movementArray = {startEnd: 'start', start: {row: null, col: null, piece: null}, end: {row: null, col: null, piece: null}};
            // Prepares build move
            this.movementArray.end.piece = {type: buildOptions[buildChoice].type};
            let [shipLocation, fortLocation] = buildItem.buildLocation();
            pieceMovement.deactivateTiles();
            this.movementArray.start.row = fortLocation[0].row;
            this.movementArray.start.col = fortLocation[0].col;
            this.movementArray.end.row = shipLocation[0].row;
            this.movementArray.end.col = shipLocation[0].col;

            new Move(this.movementArray.start, this.movementArray.end, 'build', {}).process();
        }
    },

    // Calculate rating points for resource searching of islands
    // ----------------------------------------------------------
    pointsResource: function(islandStatus, resourceStats) {
        let points = 0;
        let gameProgressionBonus = 1;
        let buildingBonus = 1;

        // Islands with undiscovered resources
        if (islandStatus == 'virgin') {
            for (const pieceType of Object.keys(resourceStats)) {
                if (pieceType != 'total') {
                    // Only add potential points for resources that have not already been claimed
                    if (resourceStats[pieceType].player == 0) {
                        // Points for discovering resource
                        points += (resourceStats[pieceType].probDiscovery / 100) * resourceStats[pieceType].discoveryFirst;
                        // Extra impetus - collecting resources will result in other points in future
                        points += (resourceStats[pieceType].probDiscovery / 100) * gameProgressionBonus;//console.log('3', points);
                        // Extra impetus - collecting resources required for ship building will result in other points in future
                        if (pieceType == 'forest' || pieceType == 'ironworks' || pieceType == 'flax') {
                            points += (resourceStats[pieceType].probDiscovery / 100) * buildingBonus;
                        }
                        // Extra points that would result from being first to find 3 or all 6 resources
                        if (resourceStats.total.player == 2) {
                            points += (resourceStats[pieceType].probDiscovery / 100) * resourceStats[pieceType].discoveryHalf;
                        } else if (resourceStats.total.player == 5) {
                            points += (resourceStats[pieceType].probDiscovery / 100) * resourceStats[pieceType].discoveryComplete;
                        }
                    }
                }
            }

        // Islands with unclaimed resources
        } else {
            // Only add potential points for resources that have not already been claimed
            if (resourceStats[islandStatus].player == 0) {
                // Points for discovering resource
                points += resourceStats[islandStatus].discoveryFirst;
                // Extra impetus - collecting resources will result in other points in future
                points += gameProgressionBonus;
                // Extra impetus - collecting resources required for ship building will result in other points in future
                if (islandStatus == 'forest' || islandStatus == 'ironworks' || islandStatus == 'flax') {
                    points += buildingBonus;
                }
                // Extra points that would result from being first to find 3 or all 6 resources
                if (resourceStats.total.player == 2) {
                    points += resourceStats[islandStatus].discoveryHalf;
                } else if (resourceStats.total.player == 5) {
                    points += resourceStats[islandStatus].discoveryComplete;
                }
            }
        }
        return Number(points.toFixed(2));
    },

    // Pirates reduction factor
    // ----------------------------------------------------------
    piratesFactor: function(localDistance) {
        let captureProbability = [0, 0.125, 0.375, 0.4, 0.875, 1];

        return captureProbability[localDistance];
    },


    // Method to rank potential map destinations for move choice related to Resources
    // ------------------------------------------------------------------------------
    // TO DO: add / subtract points for (a) Nearness to next good option
    // Also need to consider moving off route for lesser detination if its on the way to best destination
    rankDestinations: function(movesToRate) {
        // Team position of piece information array required to check if resource pieces already held
        let teamPosition = stockDashboard.pieceTotals.findIndex(fI => fI.team == game.turn);
        let resourceStats = stockDashboard.resourceStats(game.turn);
        let virginPoints = this.pointsResource('virgin', resourceStats);
        if (settings.arrayFlow === true) {console.log('resourceStats', resourceStats);}
        const piratesMovePenalty = 3;

        let maxPoints = -10;
        let bestMove = [];

        // Loops through all potential map moves and adds points to rate them
        for (var i = 0; i < movesToRate.length; i+=1) {
            movesToRate[i].points = [0, 0, 0];
            if(movesToRate[i].pathStop.length == 0 || movesToRate[i].activeStatus != 'active') {
                for (var j = 0; j < movesToRate[i].resourceHarbour.length; j+=1) {
                    // Virgin islands are worth visiting - and a better option if they can be reached in one turn
                    if(movesToRate[i].resourceHarbour[j].detail == 'Unclaimed') {
                        if(movesToRate[i].resourceHarbour[j].type == 'virgin') {
                            movesToRate[i].points[0] += virginPoints;
                        // Revealed pieces that are needed are more valuable options than virgin islands which may be desert or duplicate pieces
                        } else if (stockDashboard.pieceTotals[teamPosition].pieces[movesToRate[i].resourceHarbour[j].type].quantity == 0) {
                            movesToRate[i].points[0] += this.pointsResource(movesToRate[i].resourceHarbour[j].type, resourceStats);
                        } else {
                           // no points
                        }
                    }
                }

                // Points for destinations at greater distance are reduced by estimated number of moves to get there
                let moveCostDivisor = 1;
                if (movesToRate[i].activeStatus == 'active') {
                    // moveCostDivisor = 1;
                } else {
                    moveCostDivisor = movesToRate[i].moveCost/maxMove + 1;
                }
                movesToRate[i].points[0] = Number((movesToRate[i].points[0] / moveCostDivisor).toFixed(2));
                //movesToRate[i].points[1] = Number((movesToRate[i].points[1] / moveCostDivisor).toFixed(2));

                // Deduction for pirate ships in range of move active tile (not final destination tile)
                for (var k = 0; k < movesToRate[i].pirateRange.length; k+=1) {
                    movesToRate[i].points[1] += this.piratesFactor(movesToRate[i].pirateRange[k]);
                }
                movesToRate[i].points[1] = Math.min(movesToRate[i].points[1], 1);
                movesToRate[i].points[1] = -(movesToRate[i].points[1] * (movesToRate[i].points[0] * (1-(1/piratesMovePenalty))));

                // Adds total points
                movesToRate[i].points[2] = movesToRate[i].points[0] + movesToRate[i].points[1];

                // Array built up of highest scoring options
                if (movesToRate[i].points[0] > 0 && (movesToRate[i].points[0] + movesToRate[i].points[1] > maxPoints)) {
                    maxPoints = movesToRate[i].points[0] + movesToRate[i].points[1];
                    bestMove = [movesToRate[i]];
                } else if (movesToRate[i].points[0] + movesToRate[i].points[1] == maxPoints) {
                    bestMove.push(movesToRate[i]);
                }
            }
        }

        if (settings.arrayFlow === true) {console.log('bestMove', JSON.parse(JSON.stringify(bestMove)));}
        return bestMove;
    },

    // Method to rank resource collection moves
    // ------------------------------------------------------------------------------
    rankCollection: function(movesArray, contractStatsArray, localMaxMove, localDecisionMoves) {

        const piratesMovePenalty = 3;
        let maxPoints = -10;
        const averageMoveAdj = 2;
        let optionsCollection = [];
        let bestCollection = [];

        // Loops through all potential map moves and finds team resource harbours
        for (let i = 0; i < movesArray.length; i+=1) {
            movesArray[i].points = [0, 0, 0];
            if (movesArray[i].distance > 1) {
                if (movesArray[i].pathStop.length == 0 || movesArray[i].activeStatus != 'active') {
                    for (var j = 0; j < movesArray[i].resourceHarbour.length; j+=1) {
                        // Only adding scores for harbours of resources discovered by team
                        if (movesArray[i].resourceHarbour[j].detail == game.turn) {
                            contractStatsArray.forEach(function(contract, index) {
                                if (contract.resource == movesArray[i].resourceHarbour[j].type) {
                                    optionsCollection.push({row: movesArray[i].row, col: movesArray[i].col, resource: movesArray[i].resourceHarbour[j].type,
                                                              points: [0, 0, 0], moveCost: movesArray[i].moveCost, activeStatus: movesArray[i].activeStatus,
                                                                distance: movesArray[i].distance, move: movesArray[i], contract: contract})
                                }
                            });
                        }
                    }
                }
            }
        }

        // Loops through each potential collection move and adds score for ranking
        for (let option of optionsCollection) {
            // Works out number of moves to complete delivery
            let movesToCollect = 1;
            if (option.activeStatus != 'active') {
                movesToCollect = Math.ceil(option.moveCost/localMaxMove);
            }
            let movesToDeliver = Math.ceil(option.contract.distancePoints / (localMaxMove / averageMoveAdj));

            // Capturing points for delivery of contract
            option.points[0] = option.contract.firstPoints + option.contract.distancePoints;

            // Deduction for pirate ships in range of move active tile (not final destination tile)
            for (var k = 0; k < option.move.pirateRange.length; k+=1) {
                option.points[1] += this.piratesFactor(option.move.pirateRange[k]);
            }
            option.points[1] = Math.min(option.points[1], 1);
            option.points[1] = Number((-option.points[1] * (option.points[0] * (1-(1/piratesMovePenalty)))).toFixed(3));

            // Points for destinations at greater distance are reduced by estimated number of moves to get there
            option.points[0] = Number((option.points[0] / (movesToCollect + movesToDeliver + option.contract.phasesToInitial)).toFixed(2));

            // Total points
            option.points[2] = option.points[0] + option.points[1];

        }

        // Sorts potential moves by score so that top score for each resource is considered first
        optionsCollection.sort(function (a, b) {
            return b.points[2] - a.points[2];
        });

        for (let option of optionsCollection) {
            // Array built up of highest scoring option for each resource
            if (option.points[0] > 0 && !bestCollection.some(best => best.resource == option.contract.resource)) {
                bestCollection.push({ship: option.ship, moveType: option.moveType, points: option.points, moveCost: option.moveCost,
                                        distance: option.distance, resource: option.contract.resource, island: option.contract.island, initial: option.contract.initial,
                                           targetRow: Number(option.move.resourceHarbour[0].ref.split("-")[0]), targetCol: Number(option.move.resourceHarbour[0].ref.split("-")[1]), row: option.row, col: option.col});
            }
        }

        // Sorts resource collection into order of score and takes top three options (since maximum three ships)
        bestCollection.sort(function (a, b) {
            return b.points[2] - a.points[2];
        });
        bestCollection = bestCollection.slice(0, localDecisionMoves);

        if (settings.arrayFlow === true) {console.log('optionsCollection', JSON.parse(JSON.stringify(optionsCollection)));}
        if (settings.arrayFlow === true) {console.log('bestCollection', JSON.parse(JSON.stringify(bestCollection)));}
        return bestCollection;
    },


    // Method to filter and rank resource delivery moves
    // ------------------------------------------------------------------------------
    rankDelivery: function(deliveryMoves, contractStatsArray, localMaxMove, localDecisionMoves, shipNo) {
        // Gathers ship information
        let shipDetails = computer.computerShipsTurn[shipNo];
        let optionsDelivery = [];
        let bestDelivery = [];
        let actionFlag = {};

        // Loops through all contracts
        contractStatsArray.forEach(function(contract, index) {
            let loadableGoods = shipDetails.goodsHarbour.filter(fI => fI.goods == contract.goods);
            if (loadableGoods.length > 0) {
                loadableGoods = loadableGoods[0];
                actionFlag = {action: 'load', ref: loadableGoods.ref};
            }
            // Narrows down to contracts where ship has cargo to fulfill delivery or is docked at resource tile where relevant goods can be picked up
            if ((shipDetails.start.piece.goods == contract.goods && shipDetails.start.piece.stock >= contract.initial) || (shipDetails.start.piece.stock == 0 && loadableGoods.stock >= contract.initial)) {
                for (let i = 0; i < deliveryMoves.length; i+=1) {
                    if (deliveryMoves[i].pathStop.length == 0 || deliveryMoves[i].pathStop[0].ref == deliveryMoves[i].harbour[0].ref || deliveryMoves[i].activeStatus != 'active') {
                        // Constructs potential deliver moves
                        if (contract.ref == deliveryMoves[i].harbour[0].ref) {
                            optionsDelivery.push({row: deliveryMoves[i].row, col: deliveryMoves[i].col, resource: deliveryMoves[i].harbour[0].type, actionFlag: actionFlag,
                                                      points: [0, 0, 0], moveCost: deliveryMoves[i].moveCost, activeStatus: deliveryMoves[i].activeStatus,
                                                        distance: deliveryMoves[i].distance, move: deliveryMoves[i], contract: contract})
                        }
                    }
                }
            }
        });

        // Scoring variables and constants
        const piratesMovePenalty = 3;
        let maxPoints = -10;
        const averageMoveAdj = 2;
        // Loops through each potential collection move and adds score for ranking
        for (let option of optionsDelivery) {
            // Works out number of moves to complete delivery
            let movesToDeliver = 1;
            if (option.activeStatus != 'active') {
                movesToDeliver = Math.ceil(option.moveCost/localMaxMove);
            }
            // Captures points for delivery of contract
            option.points[0] = option.contract.firstPoints + option.contract.distancePoints;

            // Deduction for pirate ships in range of move active tile (not final destination tile)
            for (var k = 0; k < option.move.pirateRange.length; k+=1) {
                option.points[1] += this.piratesFactor(option.move.pirateRange[k]);
            }
            option.points[1] = Math.min(option.points[1], 1);
            option.points[1] = Number((-option.points[1] * (option.points[0] * (1-(1/piratesMovePenalty)))).toFixed(3));

            // Points for destinations at greater distance are reduced by estimated number of moves to get there
            option.points[0] = Number((option.points[0] / movesToDeliver).toFixed(2));

            // Total points
            option.points[2] = option.points[0] + option.points[1];
        }

        // Sorts potential moves by score so that top score for each island is considered first
        optionsDelivery.sort(function (a, b) {
            return b.points[2] - a.points[2];
        });

        for (let option of optionsDelivery) {
            // Array built up of highest scoring option for each island
            if (option.points[0] > 0 && !bestDelivery.some(best => best.island == option.contract.island)) {
                bestDelivery.push({points: option.points, moveCost: option.moveCost, distance: option.distance, resource: option.contract.resource, island: option.contract.island, initial: option.contract.initial, actionFlag: option.actionFlag,
                                           targetRow: Number(option.move.harbour[0].ref.split("-")[0]), targetCol: Number(option.move.harbour[0].ref.split("-")[1]), row: option.row, col: option.col});
            }
        }

        // Sorts resource delivery into order of score and takes top three options (since maximum three ships)
        bestDelivery.sort(function (a, b) {
            return b.points[2] - a.points[2];
        });
        bestDelivery = bestDelivery.slice(0, localDecisionMoves);

        if (settings.arrayFlow === true) {console.log('optionsDelivery', JSON.parse(JSON.stringify(optionsDelivery)));}
        if (settings.arrayFlow === true) {console.log('bestDelivery', JSON.parse(JSON.stringify(bestDelivery)));}
        return bestDelivery;
    },


// LAST BRACKET OF OBJECT
}
