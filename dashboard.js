// Dashboard object - methods to initialise dashboards
let stockDashboard = {

    // Finds the stockDashboard holder in the left hand panel
    node: document.querySelector('div.stockDashboard'),

    // Array to hold information on pieces held by each player
    // -------------------------------------------------------
    pieceTotals: [],

    // Method to count items in boardArray for dashboard
    // --------------------------------------------------
    stockTake: function() {
        let counter = 0;
        let piecesGoods = 'none';
        let piecesStock = 0;
        let stockTeam = [];
        let unclaimedPosition = game.teamArray.length;
        let totalPosition = game.teamArray.length + 1;

        // Set up array of team names with Unclaimed and total added
        for (var g = 0; g < game.teamArray.length; g++) {
            stockTeam[g] = game.teamArray[g].team;
        }
        stockTeam[unclaimedPosition] = 'Unclaimed';
        stockTeam[totalPosition] = 'Total';

        stockDashboard.pieceTotals[totalPosition] = {team: 'total', pieces: {}};
        for (var h = 0; h < stockTeam.length - 1; h+=1) {
            stockDashboard.pieceTotals[h] = {team: stockTeam[h], pieces: {}};
            for (let pieceType of Object.keys(gameData.pieceTypes)) {
                if (pieceType != 'desert') {
                    let piece = gameData.pieceTypes[pieceType];
                    stockDashboard.pieceTotals[h].pieces[pieceType] = {};
                    counter = 0;
                    piecesGoods = 'none';
                    piecesStock = 0;
                    piecesProduction = 0;
                    for (var i = 0; i < game.boardArray.length; i++) {
                        for (var j = 0; j < game.boardArray[i].length; j++) {
                            if(game.boardArray[i][j].piece.populatedSquare) {
                                if(game.boardArray[i][j].piece.team === stockTeam[h]) {
                                    if(game.boardArray[i][j].piece.type === pieceType) {
                                        counter += 1;
                                        piecesGoods = game.boardArray[i][j].piece.goods;
                                        piecesStock = game.boardArray[i][j].piece.stock;
                                        piecesProduction = game.boardArray[i][j].piece.production;
                                    }
                                }
                            }
                        }
                    }
                    stockDashboard.pieceTotals[h].pieces[pieceType] = {quantity: counter, goods: piecesGoods, stock: piecesStock, production: piecesProduction, category: piece.category};
                    if(h == 0) {
                        stockDashboard.pieceTotals[totalPosition].pieces[pieceType] = {quantity: counter, category: piece.category};
                    } else {
                        stockDashboard.pieceTotals[totalPosition].pieces[pieceType].quantity += counter;
                    }
                }
            }
        }
          if(settings.arrayFlow === true) {console.log('pieceTotals', stockDashboard.pieceTotals)};
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
        const undiscoveredIslands = resourceManagement.countIslands();

        let stats = {};
        let statATotal = 0, statBTotal = 0, statCTotal = 0, statDTotal =0;

        for (const pieceType of Object.keys(stockDashboard.pieceTotals[stockTeamPosition].pieces)) {
            if (stockDashboard.pieceTotals[stockTeamPosition].pieces[pieceType].category === 'Resources') {
                // Resource quantity and probability stats
                statA = stockDashboard.pieceTotals[stockTeamPosition].pieces[pieceType].quantity;
                statC = stockDashboard.pieceTotals[unclaimedPosition].pieces[pieceType].quantity;
                statB = stockDashboard.pieceTotals[stockTotalPosition].pieces[pieceType].quantity - statC - statA;
                statD = gameData.pieceTypes[pieceType].deckNumber - statA - statB - statC;
                statE = Number((statD * 100 / undiscoveredIslands).toFixed(1));
                // Resource points stats
                if (gameScore.scoreArray.Total.Exploring[pieceType] === 0) {
                    statF = gameScore.pointsArray.discoveryFirst;
                } else {
                    statF = gameScore.pointsArray.discoveryLater;
                }
                if (gameScore.scoreArray.Total.Exploring.half == 0) {
                    statG = gameScore.pointsArray.discoveryHalf;
                } else {
                    statG = 0;
                }
                if (gameScore.scoreArray.Total.Exploring.all == 0) {
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
        const stockTeamPosition = stockDashboard.pieceTotals.findIndex(fI => fI.team == game.turn);
        let stats = [];

        // contract information for all islands and all resources is held in tradeContracts.contractsArray
        tradeContracts.contractsArray.forEach(function(island, index) {
            // check whether a player already has a contract with an island to narrow down contracts to be assessed
            let checkTeam = tradeContracts.hasContract(index, game.turn);
            if (!checkTeam) {
                Object.keys(island.contracts).forEach(function(good) {
                    // Only need to examine contracts that are open (so not unopen, active or closed)
                    if (island.contracts[good].struck == 'open') {
                        let pieceType = Object.keys(gameData.pieceTypes).find(type => gameData.pieceTypes[type].goods === good);
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
                            stats.push({island: island.name, ref: island.row+'-'+island.col, goods: good, stock: stockAmount, resource: pieceType, netProduction: netStockProduction, initial: island.contracts[good].initial, phasesToInitial: phasesToInitial, distancePoints: tradeRouteInfo[3], firstPoints: gameScore.pointsArray.tradeFirst});
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
        while (this.node.firstChild) {
            this.node.removeChild(this.node.firstChild);
        }

        if (game.turn != 'Pirate') {
            // Variable to hold current category being added to the dashboard
            let stockCategory = '';

            let rotateIcon = 0;
            let xPosition = 0;

            // Loops through all the piece types in pieceTypes array - dashboard is created one piece type at a time - k is each piece type
            for (let pieceType of Object.keys(gameData.pieceTypes)) {
                if (pieceType != 'desert') {
                    let pieceData = gameData.pieceTypes[pieceType];
                    //Sets counter to zero
                    let counter = 0;
                    // Icon setting base on piece type
                    if (pieceData.category == 'Transport') {
                        rotateIcon = 90;
                        xPosition = -8;
                    } else {
                        rotateIcon = 0;
                        xPosition = 0;
                    }
                    // Check if a new category is to be created
                    if (pieceData.category != stockCategory) {
                        stockCategory = pieceData.category;

                        // Div to hold category is created and category title added
                        var divCat = document.createElement('div');
                        divCat.setAttribute('class', 'item_holder');
                        this.node.appendChild(divCat);
                        var divCatTitle = document.createTextNode(stockCategory);
                        divCat.appendChild(divCatTitle);
                    }

                    // Loop through boardArray - looks for pieces for current turn team and piece type k
                    for (let i = 0; i < game.boardArray.length; i+=1) {
                        for (let j = 0; j < game.boardArray[i].length; j+=1) {
                            if(game.boardArray[i][j].piece.team == game.turn) {
                                if(game.boardArray[i][j].piece.type == pieceType) {
                                    // Div to hold piece type is created and icon added
                                    let divType = document.createElement('div');
                                    divType.setAttribute('class', 'inner_item_holder');
                                    divCat.appendChild(divType);
                                    // Icon added
                                    divType.appendChild(new PieceSVG(pieceType, game.turn, 'dash_' + pieceType, 2, xPosition, 1.5, rotateIcon, 5, game.gridSize, game.tileBorder, game.boardSurround).svg);
                                    let divForText = document.createElement('div');
                                    divForText.setAttribute('class', 'dashboard_text');
                                    divType.appendChild(divForText);

                                    //let divTypeTitle = document.createTextNode(' ' + this.pieceTypes[i].type + ': ' + this.pieceTotals[0].pieces[this.pieceTypes[i].type]);
                                    // Adds x2 (or equivalent) indicator if production greater than 1
                                    if (pieceData.category == 'Resources' && game.boardArray[i][j].piece.production > 1) {
                                        let divTypeTitle = document.createTextNode('x' + game.boardArray[i][j].piece.production);
                                        divForText.style.fontWeight = 'bold';
                                        divForText.appendChild(divTypeTitle);
                                    } else {
                                        let divTypeTitle = document.createTextNode('');
                                        divForText.appendChild(divTypeTitle);
                                    }

                                    let divForStock = document.createElement('div');
                                    divForStock.setAttribute('class', 'stock_item_holder');
                                    divType.appendChild(divForStock);

                                    if (pieceData.category != 'Resources' && game.boardArray[i][j].piece.stock == 0) {
                                        let divStockTitle = document.createTextNode('no cargo');
                                        divForStock.appendChild(divStockTitle);
                                    } else {
                                        let divStockTitle = document.createTextNode(game.boardArray[i][j].piece.goods + ': ' + game.boardArray[i][j].piece.stock + '/' + pieceData.maxHold);
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
                        if (pieceType == 'cargoship') {
                            additionalClass = 'buildcargo';
                        } else if (pieceData.category == 'Transport') {
                            additionalClass = 'build' + pieceType;
                        }

                        // Div to hold piece type is created and icon added
                        let divType = document.createElement('div');
                        divType.setAttribute('class', 'inner_item_holder ' + additionalClass);
                        divCat.appendChild(divType);
                        // Icon added
                        let divTypeIcon = new PieceSVG(pieceType, 'Unclaimed', 'dash_' + pieceType, 2, xPosition, 1.5, rotateIcon, 5, game.gridSize, game.tileBorder, game.boardSurround).svg;

                        if (pieceData.category == 'Transport') {
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

                        if (pieceData.category == 'Resources') {
                            let divStockTitle = document.createTextNode('no ' + pieceData.goods);
                            divForStock.appendChild(divStockTitle);
                        } else if (pieceData.category == 'Transport') {
                            let divStockTitle = document.createTextNode('build');
                            divForStock.appendChild(divStockTitle);
                        }
                    }
                }
            }
        }
    },


    goodsTotals: {},

    goodsStockTake: function() {
        let counter = 0;
        for (let teamDetails of game.teamArray) {
            let team = teamDetails.team;
            this.goodsTotals[team] = {team: team, land: {}, sea: {}, total: {}};
            for (let pieceType of Object.keys(gameData.pieceTypes)) {
                if (pieceType != 'desert') {
                    let pieceData = gameData.pieceTypes[pieceType];
                    this.goodsTotals[team].land[pieceData.goods] = 0;
                    this.goodsTotals[team].sea[pieceData.goods] = 0;
                    this.goodsTotals[team].total[pieceData.goods] = 0;
                    counterLand = 0;
                    counterSea = 0;
                    for (let i = 0; i < game.boardArray.length; i+=1) {
                        for (let j = 0; j < game.boardArray[i].length; j+=1) {
                            if (game.boardArray[i][j].piece.populatedSquare) {
                                if (game.boardArray[i][j].piece.team === team) {
                                    if(game.boardArray[i][j].piece.goods === pieceData.goods) {
                                        if (game.boardArray[i][j].tile.terrain === 'land') {
                                            counterLand += game.boardArray[i][j].piece.stock;
                                        } else if (game.boardArray[i][j].tile.terrain === 'sea') {
                                            counterSea += game.boardArray[i][j].piece.stock;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    this.goodsTotals[team].land[pieceData.goods] = counterLand;
                    this.goodsTotals[team].sea[pieceData.goods] = counterSea;
                    this.goodsTotals[team].total[pieceData.goods] = counterLand + counterSea;
                }
            }
        }
        if (settings.arrayFlow === true) {console.log('goodsTotals', this.goodsTotals);}
    },

    // Method to add new goods each turn
    // ---------------------------------
    newTurnGoods: function() {
        for (var i = 0; i < game.boardArray.length; i++) {
            for (var j = 0; j < game.boardArray[i].length; j++) {
                if(game.boardArray[i][j].piece.team == game.turn) {
                    if(game.boardArray[i][j].piece.category == 'Resources') {
                        // Maximum goods set to 20
                        game.boardArray[i][j].piece.stock = Math.min(game.boardArray[i][j].piece.stock + game.boardArray[i][j].piece.production, 20);
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
        if(e.target.id !== '') {
            for (let pieceType of Object.keys(gameData.pieceTypes)) {
                if(e.target.id === 'dash_' + pieceType) {
                    chosenPiece = e.target.id.substring(5, e.target.id.length);
                    game.boardDisplay.drawTiles('highlight', chosenPiece);
                }
            }
        }
    },

    // Method to remove highlighting
    // -----------------------------
    hoverPieceOff: function() {
        game.boardDisplay.clearTiles('highlight');
    },

    // HELPER FUNCTIONS
    // ----------------------------------------------------------------------------
    // ----------------------------------------------------------------------------
    shipDetails: function(shipType) {
        let shipPositionInArray = stockDashboard.pieceTypes.findIndex(fI => fI.type == shipType);
        return stockDashboard.pieceTypes[shipPositionInArray];
    },




// LAST BRACKET OF OBJECT
}
