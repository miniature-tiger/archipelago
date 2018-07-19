// Contracts object - methods to initialise dashboards
let tradeContracts = {

    // Array to hold information on contracts issued and fulfilled and on Kingdom settlements
    // --------------------------------------------------------------------------------------
    contractsArray: [ {name: 'Narwhal'},
                      {name: 'Needlefish'},
                      {name: 'Seahorse'},
                      {name: 'Swordfish'},
                    ],

    // Method to populate contracts array
    // ----------------------------------
    populateContracts: function() {
        if(workFlow == 1) {console.log('Contracts array populated: ' + (Date.now() - launchTime)); }
        // Loop for each kingdom island
        for (var i = 0; i < this.contractsArray.length; i++) {
            // Totals for number of open contracts and number of unopened contracts
            this.contractsArray[i].totalOpen = 0;
            this.contractsArray[i].totalActive = 0;
            this.contractsArray[i].totalClosed = 0;
            this.contractsArray[i].totalUnopen = resourceManagement.resourcePieces.length;
            // Loop for each resource type
            let teamContracts = {};
            for (var j = 0; j < resourceManagement.resourcePieces.length; j++) {
                teamContracts[resourceManagement.resourcePieces[j].goods] = {created: false, struck: 'unopen', team: 'none', initial: 0, renewal: 0, timeRemaining: 0};
            }
            this.contractsArray[i].contracts = teamContracts;
        }
        //console.log(this.contractsArray);
    },

    // Method to randomly generate new contract
    // ----------------------------------------
    newContract: function() {
        if(workFlow == 1) {console.log('New contract issuance assessed: ' + (Date.now() - launchTime)); }
        // x% chance that a new contract is generated
        if (Math.random() > 0.75 && gameManagement.gameDate >= 8) {
            // Chooses a kingdom settlement at random
            let settlementNumber = Math.floor((Math.random() * this.contractsArray.length));
            let contractIsland = this.contractsArray[settlementNumber];
            //console.log(contractIsland.name);
            // Limits open trades to 2 and checks that there are still contract resource types to be opened
            if (this.contractsArray[settlementNumber].totalOpen < 2 && (this.contractsArray[settlementNumber].totalUnopen > 0)) {
                // TO ADD - not a resource that is on their island
                // Loops until an unopen resource type is found
                do {
                    var resourceNumber = Math.floor((Math.random() * resourceManagement.resourcePieces.length));
                    var resourceType = resourceManagement.resourcePieces[resourceNumber].goods;
                }
                while (this.contractsArray[settlementNumber].contracts[resourceType].struck != 'unopen')

                // Picks a random initial amount for delivery plus a recurring weekly amount
                let initialAmount = 0;
                if (gameManagement.gameDate <= 24) {
                    initialAmount = Math.floor(Math.random() * (resourceManagement.resourcePieces[resourceNumber].maxProduction * 2)) + 1 + 1;
                } else if (gameManagement.gameDate > 24 && gameManagement.gameDate <= 40) {
                    initialAmount = Math.floor(Math.random() * (resourceManagement.resourcePieces[resourceNumber].maxProduction * 4)) + 1 + 2;
                } else {
                    initialAmount = Math.floor(Math.random() * (resourceManagement.resourcePieces[resourceNumber].maxProduction * 6)) + 1 + 4;
                }
                let renewalAmount = 1;

                // Put into array as open contract and updates totals
                this.contractsArray[settlementNumber].totalOpen += 1;
                this.contractsArray[settlementNumber].totalUnopen -= 1;
                this.contractsArray[settlementNumber].contracts[resourceType] = {created: true, struck: 'open', team: 'none', initial: initialAmount, renewal: renewalAmount, timeRemaining: 8};


                // Comment that a contract is generated
                clearCommentary();
                commentary.style.bottom = 0;
                firstLineComment.innerText = 'Contract issued by ' + contractIsland.name + ' island for ' + resourceType + '.';
                secondLineComment.innerText = 'Initial delivery amount: ' + initialAmount + ' + Weekly trade amount: ' + renewalAmount;
            }

        } else {
            //console.log('no contract');
        }
    },


    // Method to check possible delivery to fulfil open contract
    // ---------------------------------------------------------
    checkDelivery : function(locali, localj, searchType, localStock, localTeam) {
        let delivery = false;

        // Determines which fort is being delivered to
        let chosenFort = -1;
        for (var k = 0; k < this.contractsArray.length; k+=1) {
            if(this.contractsArray[k].row == locali && this.contractsArray[k].col == localj) {
                chosenFort = k;
            }
        }

        // Determines whether a team already has a contract with that island (only one contract per island is allowed)
        let checkTeam = false;
        for (var contractGood in this.contractsArray[chosenFort].contracts) {
            if(this.contractsArray[chosenFort].contracts[contractGood].team == localTeam) {
                  checkTeam = true;
            }
        }

        // Determines whether ship cargo meets criteria for delivery
        if(this.contractsArray[chosenFort].contracts[searchType].struck == 'open') {
            if(this.contractsArray[chosenFort].contracts[searchType].initial <= localStock) {
                if(checkTeam == false ) {
                    delivery = true;
                } else {
                    secondLineComment.innerText = localTeam + ' already has a contract with this island.';
                }
            } else {
                secondLineComment.innerText = 'Insufficient goods to comeplete contract.';
            }
        } else {
            secondLineComment.innerText = 'No open contract for these goods.';
        }

        return delivery;
    },

    // Method to complete contract delivery
    // ------------------------------------
    fulfilDelivery : function() {
        // Determines which fort is being delivered to
        let chosenFort = -1;
        for (var k = 0; k < this.contractsArray.length; k++) {
            if(this.contractsArray[k].row == pieceMovement.movementArray.end.row && this.contractsArray[k].col == pieceMovement.movementArray.end.col) {
                chosenFort = k;
            }
        }

        // Updates game board based on delivery
        deliveryGoods = gameBoard.boardArray[pieceMovement.movementArray.start.row][pieceMovement.movementArray.start.col].pieces.goods;
        deliveryStock = this.contractsArray[chosenFort].contracts[deliveryGoods].initial;
        gameBoard.boardArray[pieceMovement.movementArray.start.row][pieceMovement.movementArray.start.col].pieces.stock -= deliveryStock;
        if (gameBoard.boardArray[pieceMovement.movementArray.start.row][pieceMovement.movementArray.start.col].pieces.stock == 0) {
            gameBoard.boardArray[pieceMovement.movementArray.start.row][pieceMovement.movementArray.start.col].pieces.goods = 'none';
        }

        // Updates contracts array based on delivery
        this.contractsArray[chosenFort].contracts[deliveryGoods].struck = 'active';
        this.contractsArray[chosenFort].contracts[deliveryGoods].team = gameManagement.turn;
        this.contractsArray[chosenFort].totalOpen -=1;
        this.contractsArray[chosenFort].totalActive +=1;

    },

    // Method to track continuance and countdown of contract
    // --------------------------------------
    contractContinuance : function() {
        // For a single team whose turn it is
        // Check through their contracts
        // Reduce delivery time by one
        // Once completed change status to closed

        //console.log(resourceManagement.resourcePieces);
        for (var k = 0; k < this.contractsArray.length; k++) {
            for (var l = 0; l < resourceManagement.resourcePieces.length; l++) {
                if (this.contractsArray[k].contracts[resourceManagement.resourcePieces[l].goods].team == gameManagement.turn) {

                    if(this.contractsArray[k].contracts[resourceManagement.resourcePieces[l].goods].struck == 'active') {
                        if(this.contractObstacle(this.contractsArray[k].contracts[resourceManagement.resourcePieces[l].goods].contractPath) == true) {
                            IDtradeRoute = resourceManagement.resourcePieces[l].goods + '_' + k;
                            let closedTradeRoute = document.getElementById(IDtradeRoute);
                            closedTradeRoute.remove();
                            // Remove score from team
                            gameScore.workScores('Trading', gameManagement.turn, this.contractsArray[k].name, ((this.contractsArray[k].contracts[resourceManagement.resourcePieces[l].goods].contractPath.length - 1) * -1) );
                            // Reset contractsArray
                            this.contractsArray[k].contracts[resourceManagement.resourcePieces[l].goods] = {created: false, struck: 'unopen', team: 'none', initial: 0, renewal: 0, timeRemaining: 0};
                            this.contractsArray[k].totalActive -=1;
                            this.contractsArray[k].totalUnopen +=1;
                        } else {
                            this.contractsArray[k].contracts[resourceManagement.resourcePieces[l].goods].timeRemaining -= 1;
                            gameBoard.boardArray[this.contractsArray[k].contracts[resourceManagement.resourcePieces[l].goods].resourceRow][this.contractsArray[k].contracts[resourceManagement.resourcePieces[l].goods].resourceCol].pieces.stock -=1;

                            if (this.contractsArray[k].contracts[resourceManagement.resourcePieces[l].goods].timeRemaining == 0) {
                                this.contractsArray[k].contracts[resourceManagement.resourcePieces[l].goods].struck = 'closed';
                                this.contractsArray[k].totalActive -=1;
                                this.contractsArray[k].totalClosed +=1;
                                IDtradeRoute = resourceManagement.resourcePieces[l].goods + '_' + k;
                                let closedTradeRoute = document.getElementById(IDtradeRoute);
                                closedTradeRoute.remove();
                                // creates the SVG marker for the closed trade route
                                gameBoard.closedRouteMark(this.contractsArray[k].row, this.contractsArray[k].col, gameManagement.turn, k);
                            }
                        }
                    }
                }
            }
        }
    },

    // Method to check whether obstacles are present to prevent trade being delivered along route
    // ------------------------------------------------------------------------------------------
    contractObstacle: function(tradePath) {
        let obstacle = false;
        for (var i = 0; i < tradePath.length; i++) {
            if(gameBoard.boardArray[tradePath[i].fromRow][tradePath[i].fromCol].pieces.team == 'Pirate') {
                obstacle = true;
                //console.log(tradePath[i], 'Pirate');
            } else {
                //console.log(tradePath[i], 'clear');
            }
        }
        return obstacle;
    },


    // Array of paths for finding trade route
    // --------------------------------------
    tradePath: [],

    // Method to initialise tradePath array which holds board size (i rows x j columns) array of paths
    // -----------------------------------------------------------------------------------------------
    initialiseTradePath: function(localStartRow, localStartCol) {
        for (var i = 0; i < col; i++) {
            let localMoveRow = [];
            for (var j = 0; j < row; j++) {
                localMoveRow[j] = {activeStatus: 'inactive', moveCost: 0, distance: 0, team: '', path: [{fromRow: +localStartRow , fromCol: +localStartCol}]};
            }
            this.tradePath[i] = localMoveRow;
        }
    },

    // Method to find path for trade route
    // -----------------------------------
    discoverPath: function(localEndRow, localEndCol, localGoods) {
        // Finds current team resource in boardArray for start of path
        let localStartRow = 0;
        let localStartCol = 0;
        for (var y = 0; y < gameBoard.boardArray.length; y++) {
            for (var x = 0; x < gameBoard.boardArray[y].length; x++) {
                if (gameBoard.boardArray[y][x].pieces.team == gameManagement.turn && gameBoard.boardArray[y][x].pieces.goods == localGoods && gameBoard.boardArray[y][x].pieces.category == 'Resources') {
                    localStartRow = y;
                    localStartCol = x;
                }
            }
        }

        // Converts start and end land positions into the nearest non-diagonal sea positions for start and end of trade route
        let harbour = this.nearestHarbour(localStartRow, localStartCol, localEndRow, localEndCol);

        // Finds straight-line direction from start to end of trade path to aid in choice of trade path route
        let directionAngle = Math.floor(Math.atan(Math.abs(harbour.harbourEndCol - harbour.harbourStartCol) / Math.abs(harbour.harbourEndRow - harbour.harbourStartRow)) * (180 / Math.PI));
        if(harbour.harbourEndRow - harbour.harbourStartRow > 0 && harbour.harbourEndCol - harbour.harbourStartCol > 0) {
            directionAngle += 90;
        } else if(harbour.harbourEndRow - harbour.harbourStartRow > 0 && harbour.harbourEndCol - harbour.harbourStartCol <= 0) {
            directionAngle -= 180;
        } else if(harbour.harbourEndRow - harbour.harbourStartRow <= 0 && harbour.harbourEndCol - harbour.harbourStartCol <= 0) {
            directionAngle -= 90;
        }

        // Safety net on number of iterations - should not be required as while loop applied
        let localMaxMove = Math.abs(localEndRow - localStartRow) + Math.abs(localEndCol - localStartCol);

        // Initialises tradePath array which holds board size array of paths
        this.initialiseTradePath(harbour.harbourStartRow, harbour.harbourStartCol);

        // Sets clicked piece status to active as starting point of chain reaction of setting active status
        this.tradePath[harbour.harbourStartRow][harbour.harbourStartCol].activeStatus = 'active';

        // Loops until fort destination harbour is found
        // Each loop searches for potentially reachable tiles to activated within one tile reach of a previously activated tile
        // First search (k=0) takes each active tile within 1x1 grid around piece (i.e. just the piece itself) then uses
        // pathTiles to search in 3x3 grid around this tile
        // Second search (k=1) takes each active tile within a 3x3 grid of the piece (i.e. within one tile move reach of the piece) then uses
        // pathTiles to search in 3x3 grid around each of these active tiles
        // Third search (k=2) takes each active tile within a 5x5 grid of the piece (i.e. within two tile move reach of the piece) then uses
        // pathTiles to search in 3x3 grid around each of these active tiles (making a maximum potential 3 tile distance  from the piece for active tiles)
        // Continues until destination is found

        let k = 0;
        let found = false;
        while (found == false && k < localMaxMove) {

            // Loops through i rows and j columns to form the 3x3 etc grids
            for (var i = -k; i < k+1; i++) {
                // Restrict by map size for rows so not searching off edge of board
                if(harbour.harbourStartRow+i>=0 && harbour.harbourStartRow+i <row) {
                    for (var j = -k; j < k+1; j++) {
                        // Restrict by map size for columns so not searching off edge of board
                        if(harbour.harbourStartCol+j >=0 && harbour.harbourStartCol+j <col) {
                            // Checks if tile is active. If so runs pathTiles to search for potential tiles to activate around it
                            if (this.tradePath[harbour.harbourStartRow+i][harbour.harbourStartCol+j].activeStatus == 'active') {
                                //keep for debugging - console.log('run: ' + k);
                                //keep for debugging - console.log('starting from: row: ' + (localStartRow+i) + ' col: ' + (localStartCol+j) + ' prior cost: ' + this.tradePath[localStartRow+i][localStartCol+j].moveCost);
                                searchFound = this.pathTiles(harbour.harbourStartRow+i, harbour.harbourStartCol+j, this.tradePath[harbour.harbourStartRow+i][harbour.harbourStartCol+j].moveCost, localMaxMove, directionAngle, k, harbour.harbourEndRow, harbour.harbourEndCol);
                                if (searchFound == true) {
                                    found = true;

                                }
                            }
                        }
                    }
                }
            }
            k += 1;
        }

        // separates the path for the trade route
        let localPath = this.tradePath[harbour.harbourEndRow][harbour.harbourEndCol].path;

        // Add path and Resource tile to contract array
        for (var f = 0; f < this.contractsArray.length; f++) {
            if(this.contractsArray[f].row == localEndRow && this.contractsArray[f].col == localEndCol) {
                chosenFort = f;
            }
        }
        this.contractsArray[chosenFort].contracts[localGoods].resourceRow = localStartRow;
        this.contractsArray[chosenFort].contracts[localGoods].resourceCol = localStartCol;
        this.contractsArray[chosenFort].contracts[localGoods].contractPath = localPath;

        // creates the SVG path for the trade route
        gameBoard.tradeRoute(localPath, gameManagement.turn, chosenFort, localGoods);

        // Processes the score (all the information is in this method)
        gameScore.workScores('Trading', gameManagement.turn, this.contractsArray[chosenFort].name, this.tradePath[harbour.harbourEndRow][harbour.harbourEndCol].distance);
    },

    // Method to seacrh for route around obstacles
    // -------------------------------------------
    pathTiles: function(localStartRowI, localStartColJ, localCumulMoveCost, localMaxMove, directionAngle, k, localEndRow, localEndCol) {
        // pathTiles searches a 3x3 grid around the passed (activated) tile reference to find more potential tiles to activate
        // Restrictions on activation are: board size and land
        // If a second path arrives at an already activated tile with a cheaper cost this path replaces the existing findPath

        // Initialise local variable for cumulative cost of reaching tile and found boolean for confirmation of destination
        let tileCumulMoveCost = 0;
        let localFound = false;

        // Loop through rows
        for (var i = -1; i <= 1; i++) {
            // Restrict by map size for rows
            if(localStartRowI+i>=0 && localStartRowI+i <row) {
                // Loop through columns
                for (var j = -1; j <= 1; j++) {
                    // Restrict by map size for columns
                    if(localStartColJ+j >=0 && localStartColJ+j <col) {
                        // Restrict for land squares
                        if (gameBoard.boardArray[localStartRowI+i][localStartColJ+j].terrain == 'sea' || (localStartRowI+i == localEndRow && localStartColJ+j == localEndCol)) {
                            // Checks for reaching destination
                            if (localStartRowI+i == localEndRow && localStartColJ+j == localEndCol) {
                                localFound = true;
                            }
                            // Aggregate cost of reaching tile in tileCumulMoveCost - add the existing cost to the cost for reaching the new tile from moveCost
                            tileCumulMoveCost = localCumulMoveCost + this.pathCost(localStartRowI, localStartColJ ,localStartRowI+i, localStartColJ+j, directionAngle);

                            // Logic for already active tiles - is the new path cheaper in pathCost?
                            if (this.tradePath[localStartRowI+i][localStartColJ+j].activeStatus == 'active') {
                                if (tileCumulMoveCost < this.tradePath[localStartRowI+i][localStartColJ+j].moveCost) {
                                    // Keep useful for debugging - console.log('already active logic is used:');
                                    // Keep useful for debugging - console.log('change to active tile - pre:', localStartRowI+i, localStartColJ+j, this.tradePath[localStartRowI+i][localStartColJ+j], localStartRowI, localStartColJ, this.tradePath[localStartRowI][localStartColJ]);
                                    // Update the cost, add the inherited path from the previous moved-to tile, push the path for the new tile
                                    this.tradePath[localStartRowI+i][localStartColJ+j].moveCost = tileCumulMoveCost;
                                    this.tradePath[localStartRowI+i][localStartColJ+j].path = this.tradePath[localStartRowI][localStartColJ].path.slice(0);
                                    this.tradePath[localStartRowI+i][localStartColJ+j].path.push({fromRow: +(localStartRowI+i) , fromCol: +(localStartColJ+j)});
                                    this.tradePath[localStartRowI+i][localStartColJ+j].distance = this.tradePath[localStartRowI+i][localStartColJ+j].path.length-1;
                                    // Keep useful for debugging - console.log('change to active tile - post:', localStartRow+i, localStartCol+j, this.findPath[localStartRow+i][localStartCol+j], localStartRow, localStartCol, this.findPath[localStartRow][localStartCol]);
                                }
                            // Logic for inactive tiles that have met all criteria - activate them!
                            } else if (this.tradePath[localStartRowI+i][localStartColJ+j].activeStatus != 'active') {
                                // Keep useful for debugging - console.log('new pre-activation:', localStartRow+i, localStartCol+j, this.findPath[localStartRow+i][localStartCol+j], localStartRow, localStartCol, this.findPath[localStartRow][localStartCol]);
                                this.tradePath[localStartRowI+i][localStartColJ+j].activeStatus = 'active';
                                // Update the cost, add the inherited path from the previous moved-to tile, push the path for the new tile
                                this.tradePath[localStartRowI+i][localStartColJ+j].moveCost = tileCumulMoveCost;
                                this.tradePath[localStartRowI+i][localStartColJ+j].path = this.tradePath[localStartRowI][localStartColJ].path.slice(0);
                                this.tradePath[localStartRowI+i][localStartColJ+j].path.push({fromRow: +(localStartRowI+i) , fromCol: +(localStartColJ+j)});
                                this.tradePath[localStartRowI+i][localStartColJ+j].distance = this.tradePath[localStartRowI+i][localStartColJ+j].path.length-1;
                                //Keep useful for debugging - console.log('new post-activation:', localStartRow+i, localStartCol+j, this.findPath[localStartRow+i][localStartCol+j], localStartRow, localStartCol, this.findPath[localStartRow][localStartCol]);
                                //Keep useful for debugging - console.log('row: ' + (localStartRow+i) + ' col: ' + (localStartCol+j) + ' set to: ' + this.findPath[localStartRow+i][localStartCol+j].activeStatus + ' with cost: ' + this.findPath[localStartRow+i][localStartCol+j].moveCost + ' and distance: ' + this.findPath[localStartRow+i][localStartCol+j].distance);
                            }
                        }
                    }
                }
            }
        }
        return localFound;
    },

    // Method to find nearest harbour to destination
    // ---------------------------------------------
    // Converts start and end land positions into the nearest non-diagonal sea positions for start and end of trade route
    nearestHarbour: function(localStartRow, localStartCol, localEndRow, localEndCol) {
        let harbourRank = [];
        let vertical = localEndRow - localStartRow;
        let horizontal = localEndCol - localStartCol;
        // Ranks the possible adjacent tiles in order of preference according to the direction of the trade route
        if(Math.abs(vertical) > Math.abs(horizontal)) {
            if(vertical >= 0) {
                if(horizontal >= 0) {
                    harbourRank = [[1,0], [0,1], [0,-1], [-1,0]]
                } else {
                    harbourRank = [[1,0], [0,-1], [0,1], [-1,0]]
                }
            } else {
                if(horizontal >= 0) {
                    harbourRank = [[-1,0], [0,1], [0,-1], [1,0]]
                } else {
                    harbourRank = [[-1,0], [0,-1], [0,1], [1,0]]
                }
            }
        } else {
            if(vertical >= 0) {
                if(horizontal >= 0) {
                    harbourRank = [[0,1], [1,0], [-1,0], [0,-1]]
                } else {
                    harbourRank = [[0,-1], [1,0], [-1,0], [0,1]]
                }
            } else {
                if(horizontal >= 0) {
                    harbourRank = [[0,1], [-1,0], [1,0], [0,-1]]
                } else {
                    harbourRank = [[0,-1], [-1,0], [1,0], [0,1]]
                }
            }
        }

        let resourceHarbour = false;
        let fortHarbour = false;
        let harbourStartRow = 0;
        let harbourStartCol = 0;
        let harbourEndRow = 0;
        let harbourEndCol = 0;

        // Loops through each of four possible tiles to find preferred harbour
        for (var i = 0; i < harbourRank.length; i++) {

            if(resourceHarbour == false && (localStartRow+harbourRank[i][0]) >=0 && (localStartRow+harbourRank[i][0]) < 31 && (localStartCol+harbourRank[i][1]) >=0 && (localStartCol+harbourRank[i][1]) < 31) {

                if(gameBoard.boardArray[localStartRow+harbourRank[i][0]][localStartCol+harbourRank[i][1]].terrain == 'sea') {
                    harbourStartRow = localStartRow+harbourRank[i][0];
                    harbourStartCol = localStartCol+harbourRank[i][1];
                    resourceHarbour = true;
                }
            }
            // Reverses the order of preference at the other end of the trade route
            if(fortHarbour == false && (localEndRow+harbourRank[harbourRank.length - 1 - i][0]) >=0 && (localEndRow+harbourRank[harbourRank.length - 1 - i][0]) < 31 && (localEndCol+harbourRank[harbourRank.length - 1 - i][1]) >=0 && (localEndCol+harbourRank[harbourRank.length - 1 - i][1]) < 31) {

                if(gameBoard.boardArray[localEndRow+harbourRank[harbourRank.length - 1 - i][0]][localEndCol+harbourRank[harbourRank.length - 1 - i][1]].terrain == 'sea') {
                    harbourEndRow = localEndRow+harbourRank[harbourRank.length - 1 - i][0];
                    harbourEndCol = localEndCol+harbourRank[harbourRank.length - 1 - i][1];
                    fortHarbour = true;
                }
            }
        }
        return {harbourStartRow, harbourStartCol, harbourEndRow, harbourEndCol};
    },

    // Method to find the most direct trade route
    // -------------------------------------------
    // Sets the cost of each move in relation to the overall direction of the trade route
    pathCost: function(localStartRow, localStartCol, localEndRow, localEndCol, localDirectionAngle) {
        let moveCostResult = 0;
        // Calculates direction of move
        let localMoveTop = (localEndRow - localStartRow);
        let localMoveLeft = (localEndCol - localStartCol);
        let localMoveDirection = pieceMovement.movementDirection[localMoveLeft+1][localMoveTop+1];
        // Calculates difference in angle of direction between trade route direction and piece movement
        let angleDiff = (localMoveDirection - localDirectionAngle + 360) % 360;
        // Returns cost based on the difference in angle
        if (angleDiff > 89 && angleDiff < 271) {
            moveCostResult = 1.1;
        } else if (angleDiff > 44 && angleDiff < 316) {
            moveCostResult = 0.9;
        } else {
            moveCostResult = 0.75;
        }
        return moveCostResult;
    },

    // Method to count number of closed contracts per team
    // ---------------------------------------------------
    countClosed: function() {
        let countClosedTotal = {'Green Team': 0, 'Blue Team': 0, 'Red Team': 0, 'Orange Team': 0, maxTotal: 0, maxTeam: 'none'}
        for (var i = 0; i < this.contractsArray.length; i+=1) {
            for (var contractGood in this.contractsArray[i].contracts) {
                if(this.contractsArray[i].contracts[contractGood].struck == 'closed') {
                    countClosedTotal[this.contractsArray[i].contracts[contractGood].team] += 1;
                    if(countClosedTotal[this.contractsArray[i].contracts[contractGood].team] > countClosedTotal.maxTotal) {
                        countClosedTotal.maxTotal = countClosedTotal[this.contractsArray[i].contracts[contractGood].team];
                        countClosedTotal.maxTeam = this.contractsArray[i].contracts[contractGood].team;
                    }
                }
            }
        }
        return countClosedTotal;
    },



    // Method to populate contract dashboard on right-hand panel
    // ---------------------------------------------------------
    drawContracts: function() {
        if(workFlow == 1) {console.log('Contracts (right) dashboard drawn: ' + (Date.now() - launchTime)); }
        // Finds the stockDashboard holder in the left hand panel
        let contractDashboardNode = document.querySelector('div.contractDashboard');

        // Any existing dashboard is deleted
        while (contractDashboardNode.firstChild) {
            contractDashboardNode.removeChild(contractDashboardNode.firstChild);
        }

        if (gameManagement.turn != 'Pirate') {
            for (var i = 0; i < this.contractsArray.length; i++) {
                // Div to hold island is created and island title added
                var divIsland = document.createElement('div');
                divIsland.setAttribute('class', 'item_holder');
                contractDashboardNode.appendChild(divIsland);
                var divIslandTitle = document.createTextNode(this.contractsArray[i].name);
                divIsland.appendChild(divIslandTitle);

                // 'No contracts' shown if no contracts open
                if (this.contractsArray[i].totalOpen + this.contractsArray[i].totalActive + this.contractsArray[i].totalClosed == 0) {
                    let divForStock = document.createElement('div');
                    divForStock.setAttribute('class', 'stock_item_holder');
                    divForStock.innerHTML = 'no contracts';
                    divIsland.appendChild(divForStock);

                // Contract details added if contracts open
                } else {

                    for (var j = 0; j < resourceManagement.resourcePieces.length; j++) {
                        if(this.contractsArray[i].contracts[resourceManagement.resourcePieces[j].goods].created) {

                            // Div to hold contract is created and icon added
                            let divType = document.createElement('div');
                            divType.setAttribute('class', 'inner_item_holder');
                            divIsland.appendChild(divType);

                            // Contracts status added
                            let divForText = document.createElement('div');
                            divForText.setAttribute('class', 'dashboard_text');
                            divType.appendChild(divForText);

                            // Icon added
                            if (this.contractsArray[i].contracts[resourceManagement.resourcePieces[j].goods].struck == 'open') {
                                //console.log('open');
                                let divTypeIcon = gameBoard.createActionTile(0, 0, resourceManagement.resourcePieces[j].type, 'Unclaimed', 'dash_' + resourceManagement.resourcePieces[j].type, 2, 0, 1.5, 0);
                                divType.appendChild(divTypeIcon);
                                divForText.innerHTML = this.contractsArray[i].contracts[resourceManagement.resourcePieces[j].goods].struck;
                            } else if (this.contractsArray[i].contracts[resourceManagement.resourcePieces[j].goods].struck == 'active') {
                                //console.log('active', this.contractsArray[i].contracts[resourceManagement.resourcePieces[j].goods].struck);
                                let divTypeIcon = gameBoard.createActionTile(0, 0, resourceManagement.resourcePieces[j].type, this.contractsArray[i].contracts[resourceManagement.resourcePieces[j].goods].team, 'dash_' + resourceManagement.resourcePieces[j].type, 2, 0, 1.5, 0);
                                divType.appendChild(divTypeIcon);
                                divForText.innerHTML = 'active';
                            } else if (this.contractsArray[i].contracts[resourceManagement.resourcePieces[j].goods].struck == 'closed') {
                                //console.log('closed');
                                let divTypeIcon = gameBoard.createActionTile(0, 0, resourceManagement.resourcePieces[j].type, this.contractsArray[i].contracts[resourceManagement.resourcePieces[j].goods].team, 'dash_' + resourceManagement.resourcePieces[j].type, 2, 0, 1.5, 0);
                                divType.appendChild(divTypeIcon);
                                divForText.innerHTML = 'closed';
                            }

                            // Delivery amounts added
                            let divForStock = document.createElement('div');
                            divForStock.setAttribute('class', 'stock_item_holder');
                            divIsland.appendChild(divForStock);
                            if (this.contractsArray[i].contracts[resourceManagement.resourcePieces[j].goods].struck == 'open') {
                                divForStock.innerHTML = '--> ' + this.contractsArray[i].contracts[resourceManagement.resourcePieces[j].goods].initial + ' ' + resourceManagement.resourcePieces[j].goods;
                                //divForStock.innerHTML = resourceManagement.resourcePieces[j].goods;
                            } else if (this.contractsArray[i].contracts[resourceManagement.resourcePieces[j].goods].struck == 'active') {
                                divForStock.innerHTML = this.contractsArray[i].contracts[resourceManagement.resourcePieces[j].goods].timeRemaining + ' phase';
                            }


                        }
                    }
                }
            }
        }
        //console.log(this.contractsArray);
    },


// LAST BRACKET OF OBJECT
}
