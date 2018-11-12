// Dashboard object - methods to initialise dashboards
let stockDashboard = {


    // Array to hold information on pieces held by each player
    // -------------------------------------------------------
    pieceTotals: [],


    // Array to hold list of all piece types
    // -------------------------------------
    // Pieces must be added in the order: Settlements, Transport, Resources
    pieceTypes: [ {type: 'fort', category: 'Settlements', maxNo: 1, goods: 'none', maxProduction: 0, maxMove: 0, maxHold: 20, battlePerc: 0, deckNumber: 0},
                  {type: 'catamaran', category: 'Transport', maxNo: 1, goods: 'none', maxProduction: 0, maxMove: 16, maxHold: 5, battlePerc: 0.1, deckNumber: 0},
                  {type: 'warship', category: 'Transport', maxNo: 1, goods: 'none', maxProduction: 0, maxMove: 5, maxHold: 10, battlePerc: 0.4, deckNumber: 0},
                  {type: 'cargo ship', category: 'Transport', maxNo: 1, goods: 'none', maxProduction: 0, maxMove: 4, maxHold: 20, battlePerc: 0.6, deckNumber: 0},
                  {type: 'forest', category: 'Resources', maxNo: 1, goods: 'wood', maxProduction: 2, maxMove: 0, maxHold: 20, battlePerc: 0, deckNumber: 4},
                  {type: 'ironworks', category: 'Resources', maxNo: 1, goods: 'iron', maxProduction: 2, maxMove: 0, maxHold: 20, battlePerc: 0, deckNumber: 4},
                  {type: 'quarry', category: 'Resources', maxNo: 1, goods: 'stone', maxProduction: 2, maxMove: 0, maxHold: 20, battlePerc: 0, deckNumber: 4},
                  {type: 'plantation', category: 'Resources', maxNo: 1, goods: 'coffee', maxProduction: 2, maxMove: 0, maxHold: 20, battlePerc: 0, deckNumber: 4},
                  {type: 'flax', category: 'Resources', maxNo: 1, goods: 'cloth', maxProduction: 2, maxMove: 0, maxHold: 20, battlePerc: 0, deckNumber: 4},
                  {type: 'clay', category: 'Resources', maxNo: 1, goods: 'pottery', maxProduction: 2, maxMove: 0, maxHold: 20, battlePerc: 0, deckNumber: 4},
                ],


    // Method to count items in boardArray for leader board
    // ----------------------------------------------------

    stockTake: function() {
        let counter = 0;
        let piecesGoods = 'none';
        let piecesStock = 0;
        let stockTeam = [];
        let unclaimedPosition = gameManagement.teamArray.length;
        let totalPosition = gameManagement.teamArray.length + 1;

        // Set up array of team names with Unclaimed and total added
        for (var g = 0; g < gameManagement.teamArray.length; g++) {
            stockTeam[g] = gameManagement.teamArray[g];
        }
        stockTeam[unclaimedPosition] = 'Unclaimed';
        stockTeam[totalPosition] = 'Total';

        stockDashboard.pieceTotals[totalPosition] = {team: 'total', pieces: {}};

        for (var h = 0; h < stockTeam.length - 1; h++) {
            //console.log(gameManagement.teamArray[h]);
            stockDashboard.pieceTotals[h] = {team: stockTeam[h], pieces: {}};
            for (var k = 0; k < stockDashboard.pieceTypes.length; k++) {
                stockDashboard.pieceTotals[h].pieces[stockDashboard.pieceTypes[k].type] = {};
                counter = 0;
                piecesGoods = 'none';
                piecesStock = 0;
                piecesProduction = 0;
                for (var i = 0; i < gameBoard.boardArray.length; i++) {
                    for (var j = 0; j < gameBoard.boardArray[i].length; j++) {
                        if(gameBoard.boardArray[i][j].pieces.populatedSquare) {
                            if(gameBoard.boardArray[i][j].pieces.team == stockTeam[h]) {
                                if(gameBoard.boardArray[i][j].pieces.type == stockDashboard.pieceTypes[k].type) {
                                    counter += 1;
                                    piecesGoods = gameBoard.boardArray[i][j].pieces.goods;
                                    piecesStock = gameBoard.boardArray[i][j].pieces.stock;
                                    piecesProduction = gameBoard.boardArray[i][j].pieces.production;
                                }
                            }
                        }
                    }
                }
                stockDashboard.pieceTotals[h].pieces[stockDashboard.pieceTypes[k].type] = {quantity: counter, goods: piecesGoods, stock: piecesStock, production: piecesProduction, category: stockDashboard.pieceTypes[k].category};
                if(h == 0) {
                    stockDashboard.pieceTotals[totalPosition].pieces[stockDashboard.pieceTypes[k].type] = {quantity: counter, category: stockDashboard.pieceTypes[k].category};
                } else {
                    stockDashboard.pieceTotals[totalPosition].pieces[stockDashboard.pieceTypes[k].type].quantity += counter;
                }

            }
        }
          if(arrayFlow == 1) {console.log('pieceTotals', stockDashboard.pieceTotals)};
    },

    // Quick calculation of Resource tiles held by player
    // --------------------------------------------------
    resourceCount: function(localTeam) {
        let teamPosition = stockDashboard.pieceTotals.findIndex(fI => fI.team == localTeam);
        let resourceTotal = 0;

        for (const tilePiece of Object.keys(stockDashboard.pieceTotals[teamPosition].pieces)) {
            if (stockDashboard.pieceTotals[teamPosition].pieces[tilePiece].category == 'Resources') {
                resourceTotal += stockDashboard.pieceTotals[teamPosition].pieces[tilePiece].quantity;
            }
        }
        return resourceTotal;
    },

    // All the useful resource stats for a team
    // ----------------------------------------
    resourceStats: function(localTeam) {
        const stockTeamPosition = stockDashboard.pieceTotals.findIndex(fI => fI.team == localTeam);
        const stockTotalPosition = stockDashboard.pieceTotals.findIndex(fI => fI.team == 'total');
        const unclaimedPosition = stockDashboard.pieceTotals.findIndex(fI => fI.team == 'Unclaimed');
        const scoreTotalPosition = gameScore.scoreArray.findIndex(fI => fI.team == 'total');
        const undiscoveredIslands = resourceManagement.countIslands();

        let stats = {};
        let statATotal = 0, statBTotal = 0, statCTotal = 0, statDTotal =0;

        for (const pieceType of Object.keys(stockDashboard.pieceTotals[stockTeamPosition].pieces)) {
            let piecePosition = stockDashboard.pieceTypes.findIndex(fI => fI.type == pieceType);
            if (stockDashboard.pieceTotals[stockTeamPosition].pieces[pieceType].category == 'Resources') {
                // Resource quantity and probability stats
                statA = stockDashboard.pieceTotals[stockTeamPosition].pieces[pieceType].quantity;
                statC = stockDashboard.pieceTotals[unclaimedPosition].pieces[pieceType].quantity;
                statB = stockDashboard.pieceTotals[stockTotalPosition].pieces[pieceType].quantity - statC - statA;
                statD = stockDashboard.pieceTypes[piecePosition].deckNumber - statA - statB - statC;
                statE = Number((statD * 100 / undiscoveredIslands).toFixed(1));
                // Resource points stats
                if (gameScore.scoreArray[scoreTotalPosition].Exploring[pieceType] == 0) {
                    statF = gameScore.pointsArray.discoveryFirst;
                } else {
                    statF = gameScore.pointsArray.discoveryLater;
                }
                if (gameScore.scoreArray[scoreTotalPosition].Exploring.half == 0) {
                    statG = gameScore.pointsArray.discoveryHalf;
                } else {
                    statG = 0;
                }
                if (gameScore.scoreArray[scoreTotalPosition].Exploring.all == 0) {
                    statH = gameScore.pointsArray.discoveryComplete;
                } else {
                    statH = 0;
                }
                // Add to summary and totals
                stats[pieceType] = {player: statA, otherPlayer: statB, unclaimed: statC, undiscovered: statD, probDiscovery: statE, discoveryFirst: statF, discoveryHalf: statG, discoveryComplete: statH};
                statATotal += statA;
                statBTotal += statB;
                statCTotal += statC;
                statDTotal += statD;
            }
            stats.total = {player: statATotal, otherPlayer: statBTotal, unclaimed: statCTotal, undiscovered: statDTotal};
        }

        return(stats);
    },

    // Method to produce array of contracts that can be fulfilled by players with associated stats
    // --------------------------------------------------------------------------------------------
    contractStats: function() {
        const stockTeamPosition = stockDashboard.pieceTotals.findIndex(fI => fI.team == gameManagement.turn);
        let stats = [];

        // contract information for all islands and all resources is held in tradeContracts.contractsArray
        tradeContracts.contractsArray.forEach(function(island, index) {
            // check whether a player already has a contract with an island to narrow down contracts to be assessed
            let checkTeam = tradeContracts.hasContract(index, gameManagement.turn);
            if (!checkTeam) {
                Object.keys(island.contracts).forEach(function(good) {
                    // Only need to examine contracts that are open (so not unopen, active or closed)
                    if (island.contracts[good].struck == 'open') {
                        let piecePosition = stockDashboard.pieceTypes.findIndex(fI => fI.goods == good);
                        pieceType = stockDashboard.pieceTypes[piecePosition].type;
                        // check whether player has resource
                        if (stockDashboard.pieceTotals[stockTeamPosition].pieces[pieceType].quantity > 0) {
                            stockAmount = stockDashboard.pieceTotals[stockTeamPosition].pieces[pieceType].stock;
                            netStockProduction = stockDashboard.pieceTotals[stockTeamPosition].pieces[pieceType].production; // adjust for existing contracts
                            // check estimated time to have enough resources to fulfil initial delivery
                            if (netStockProduction > 0) {
                                phasesToInitial = Math.max((island.contracts[good].initial - stockAmount) / netStockProduction, 0);
                            }

                            // calculate estimated points for fulfilling the delivery and pushes stats for each potential contract to array
                            tradeRouteInfo = tradeContracts.discoverPath(island.row, island.col, good);
                            stats.push({island: island.name, goods: good, stock: stockAmount, resource: pieceType, netProduction: netStockProduction, initial: island.contracts[good].initial, phasesToInitial: phasesToInitial, distancePoints: tradeRouteInfo[3], firstPoints: gameScore.pointsArray.tradeFirst});
                        }
                    }
                });
            }
        });

        return stats;
    },

    // All the useful building stats for a team
    // ----------------------------------------
    buildStats: function(localTeam) {

        const stockTeamPosition = stockDashboard.pieceTotals.findIndex(fI => fI.team == localTeam);
        const stockTotalPosition = stockDashboard.pieceTotals.findIndex(fI => fI.team == 'total');
        const stockPiratePosition = stockDashboard.pieceTotals.findIndex(fI => fI.team == 'Pirate');

        let stats = {};
        //let statATotal = 0, statBTotal = 0;

        for (const pieceType of Object.keys(stockDashboard.pieceTotals[stockTeamPosition].pieces)) {
            let piecePosition = stockDashboard.pieceTypes.findIndex(fI => fI.type == pieceType);
            if (stockDashboard.pieceTotals[stockTeamPosition].pieces[pieceType].category == 'Transport') {
                // Ship quantity stats
                statA = stockDashboard.pieceTotals[stockTeamPosition].pieces[pieceType].quantity; // player
                pirateTotal = stockDashboard.pieceTotals[stockPiratePosition].pieces[pieceType].quantity; // pirates to be excluded
                statB = stockDashboard.pieceTotals[stockTotalPosition].pieces[pieceType].quantity - statA - pirateTotal; // other Players
                if (statA + statB === 0) {
                    statC = gameScore.pointsArray.buildFirst;
                } else if (statA + statB === 1) {
                    statC = gameScore.pointsArray.buildSecond;
                } else {
                    statC = gameScore.pointsArray.buildLater;
                }

                // Add to summary and totals
                stats[pieceType] = {player: statA, otherPlayer: statB, buildReward: statC};
                //statATotal += statA;
                //statBTotal += statB;
            }
            //stats.total = {player: statATotal, otherPlayer: statBTotal};
        }

        return(stats);
    },

    // Method to populate stock dashboard on left-hand panel
    // -----------------------------------------------------
    drawStock: function() {
        // Any existing dashboard is deleted
        while (stockDashboardNode.firstChild) {
            stockDashboardNode.removeChild(stockDashboardNode.firstChild);
        }

        if (gameManagement.turn != 'Pirate') {
            // Variable to hold current category being added to the dashboard
            let stockCategory = '';

            let rotateIcon = 0;
            let xPosition = 0;

            // Loops through all the piece types in pieceTypes array - dashboard is created one piece type at a time - k is each piece type
            for (var k = 0; k < this.pieceTypes.length; k++) {
                //Sets counter to zero
                let counter = 0;
                // Icon setting base on piece type
                if (this.pieceTypes[k].category == 'Transport') {
                    rotateIcon = 90;
                    xPosition = -8;
                } else {
                    rotateIcon = 0;
                    xPosition = 0;
                }
                // Check if a new category is to be created
                if (this.pieceTypes[k].category != stockCategory) {
                    stockCategory = this.pieceTypes[k].category;

                    // Div to hold category is created and category title added
                    var divCat = document.createElement('div');
                    divCat.setAttribute('class', 'item_holder');
                    stockDashboardNode.appendChild(divCat);
                    var divCatTitle = document.createTextNode(stockCategory);
                    divCat.appendChild(divCatTitle);
                }

                // Loop through boardArray - looks for pieces for current turn team and piece type k
                for (var i = 0; i < gameBoard.boardArray.length; i++) {
                    for (var j = 0; j < gameBoard.boardArray[i].length; j++) {
                        if(gameBoard.boardArray[i][j].pieces.team == gameManagement.turn) {
                            if(gameBoard.boardArray[i][j].pieces.type == stockDashboard.pieceTypes[k].type) {
                                // Div to hold piece type is created and icon added
                                let divType = document.createElement('div');
                                divType.setAttribute('class', 'inner_item_holder');
                                divCat.appendChild(divType);
                                // Icon added
                                let divTypeIcon = gameBoard.createActionTile(0, 0, this.pieceTypes[k].type, gameManagement.turn, 'dash_' + this.pieceTypes[k].type, 2, xPosition, 1.5, rotateIcon);
                                divType.appendChild(divTypeIcon);

                                let divForText = document.createElement('div');
                                divForText.setAttribute('class', 'dashboard_text');
                                divType.appendChild(divForText);

                                //let divTypeTitle = document.createTextNode(' ' + this.pieceTypes[i].type + ': ' + this.pieceTotals[0].pieces[this.pieceTypes[i].type]);
                                // Adds x2 (or equivalent) indicator if production greater than 1
                                if (this.pieceTypes[k].category == 'Resources' && gameBoard.boardArray[i][j].pieces.production > 1) {
                                    let divTypeTitle = document.createTextNode('x' + gameBoard.boardArray[i][j].pieces.production);
                                    divForText.style.fontWeight = 'bold';
                                    divForText.appendChild(divTypeTitle);
                                } else {
                                    let divTypeTitle = document.createTextNode('');
                                    divForText.appendChild(divTypeTitle);
                                }

                                let divForStock = document.createElement('div');
                                divForStock.setAttribute('class', 'stock_item_holder');
                                divType.appendChild(divForStock);

                                if (this.pieceTypes[k].category != 'Resources' && gameBoard.boardArray[i][j].pieces.stock == 0) {
                                    let divStockTitle = document.createTextNode('no cargo');
                                    divForStock.appendChild(divStockTitle);
                                } else {
                                    let divStockTitle = document.createTextNode(gameBoard.boardArray[i][j].pieces.goods + ': ' + gameBoard.boardArray[i][j].pieces.stock + '/' + this.pieceTypes[k].maxHold);
                                    divForStock.appendChild(divStockTitle);
                                }
                                counter += 1;
                            }
                        }
                    }
                }
                // If no pieces of type k found:
                if (counter == 0) {
                    let additionalClass = '';
                    if (this.pieceTypes[k].type == 'cargo ship') {
                        additionalClass = 'buildcargo';
                    } else if (this.pieceTypes[k].category == 'Transport') {
                        additionalClass = 'build' + this.pieceTypes[k].type;
                    }

                    // Div to hold piece type is created and icon added
                    let divType = document.createElement('div');
                    divType.setAttribute('class', 'inner_item_holder ' + additionalClass);
                    divCat.appendChild(divType);
                    // Icon added
                    let divTypeIcon = gameBoard.createActionTile(0, 0, this.pieceTypes[k].type, 'Unclaimed', 'dash_' + this.pieceTypes[k].type, 2, xPosition, 1.5, rotateIcon);
                    if (this.pieceTypes[k].category == 'Transport') {
                        //divTypeIcon.setAttribute('class', additionalClass);
                        divTypeIcon.classList.add(additionalClass);
                    }
                    divType.appendChild(divTypeIcon);

                    let divForText = document.createElement('div');
                    divForText.setAttribute('class', 'dashboard_text ' + additionalClass);
                    divType.appendChild(divForText);

                    //let divTypeTitle = document.createTextNode(' ' + this.pieceTypes[i].type + ': ' + this.pieceTotals[0].pieces[this.pieceTypes[i].type]);
                    let divTypeTitle = document.createTextNode('');
                    divForText.appendChild(divTypeTitle);

                    let divForStock = document.createElement('div');
                    divForStock.setAttribute('class', 'stock_item_holder ' + additionalClass);
                    divType.appendChild(divForStock);

                    if (this.pieceTypes[k].category == 'Resources') {
                        let divStockTitle = document.createTextNode('no ' + this.pieceTypes[k].goods);
                        divForStock.appendChild(divStockTitle);
                    } else if (this.pieceTypes[k].category == 'Transport') {
                        let divStockTitle = document.createTextNode('build');
                        divForStock.appendChild(divStockTitle);
                    }
                }
            }
        }
    },


    goodsTotals: [],

    goodsStockTake: function() {
        let counter = 0;
        for (var h = 0; h < gameManagement.teamArray.length; h++) {
            //console.log(gameManagement.teamArray[h]);
            this.goodsTotals[h] = {team: gameManagement.teamArray[h], land: {}, sea: {}, total: {}};
            for (var k = 0; k < this.pieceTypes.length; k++) {
                //console.log(stockDashboard.pieceTypes[k].type);
                this.goodsTotals[h].land[this.pieceTypes[k].goods] = 0;
                this.goodsTotals[h].sea[this.pieceTypes[k].goods] = 0;
                this.goodsTotals[h].total[this.pieceTypes[k].goods] = 0;
                counterLand = 0;
                counterSea = 0;
                for (var i = 0; i < gameBoard.boardArray.length; i++) {
                    for (var j = 0; j < gameBoard.boardArray[i].length; j++) {
                        if(gameBoard.boardArray[i][j].pieces.populatedSquare) {
                            if(gameBoard.boardArray[i][j].pieces.team == gameManagement.teamArray[h]) {
                                if(gameBoard.boardArray[i][j].pieces.goods == this.pieceTypes[k].goods) {
                                    if (gameBoard.boardArray[i][j].terrain == 'land') {
                                        counterLand += gameBoard.boardArray[i][j].pieces.stock;
                                    } else if (gameBoard.boardArray[i][j].terrain == 'sea') {
                                        counterSea += gameBoard.boardArray[i][j].pieces.stock;
                                    }
                                }
                            }
                        }
                    }
                }
                this.goodsTotals[h].land[this.pieceTypes[k].goods] = counterLand;
                this.goodsTotals[h].sea[this.pieceTypes[k].goods] = counterSea;
                this.goodsTotals[h].total[this.pieceTypes[k].goods] = counterLand + counterSea;
            }
        }
        if (arrayFlow == 1) {console.log('goodsTotals', this.goodsTotals);}
    },

    // Method to add new goods each turn
    // ---------------------------------
    newTurnGoods: function() {
        for (var i = 0; i < gameBoard.boardArray.length; i++) {
            for (var j = 0; j < gameBoard.boardArray[i].length; j++) {
                if(gameBoard.boardArray[i][j].pieces.team == gameManagement.turn) {
                    if(gameBoard.boardArray[i][j].pieces.category == 'Resources') {
                        let arrayPosition = stockDashboard.pieceTypes.findIndex(k => k.goods == gameBoard.boardArray[i][j].pieces.goods);
                        // Maximum goods set to 20
                        gameBoard.boardArray[i][j].pieces.stock = Math.min(gameBoard.boardArray[i][j].pieces.stock + gameBoard.boardArray[i][j].pieces.production, 20);
                    }
                }
            }
        }
    },

    // Method to highlight pieces on board
    // -----------------------------------
    hoverPieceOn: function(e) {
        let chosenPiece = '';
        // Determines piece type of icon on sidebar based on id
        if(e.target.id != '') {
            for (var i = 0; i < stockDashboard.pieceTypes.length; i+=1) {
                if(e.target.id == 'dash_' + stockDashboard.pieceTypes[i].type) {
                    chosenPiece = e.target.id.substring(5, e.target.id.length);
                    gameBoard.highlightTiles(chosenPiece);
                }
            }
        }
    },

// LAST BRACKET OF OBJECT
}
