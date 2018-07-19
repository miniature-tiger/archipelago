// Dashboard object - methods to initialise dashboards
let stockDashboard = {


    // Array to hold information on pieces held by each player
    // -------------------------------------------------------
    pieceTotals: [],


    // Array to hold list of all piece types
    // -------------------------------------
    // Pieces must be added in the order: Settlements, Transport, Resources
    pieceTypes: [ {type: 'fort', category: 'Settlements', maxNo: 1, goods: 'none', maxProduction: 0, maxMove: 0, maxHold: 20, battlePerc: 0, deckNumber: 0},
                  {type: 'catamaran', category: 'Transport', maxNo: 1, goods: 'none', maxProduction: 0, maxMove: 6, maxHold: 5, battlePerc: 0.1, deckNumber: 0},
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

        for (var h = 0; h < gameManagement.teamArray.length; h++) {
            //console.log(gameManagement.teamArray[h]);
            stockDashboard.pieceTotals[h] = {team: gameManagement.teamArray[h], pieces: {}};
            for (var k = 0; k < stockDashboard.pieceTypes.length; k++) {
                //console.log(stockDashboard.pieceTypes[k].type);
                stockDashboard.pieceTotals[h].pieces[stockDashboard.pieceTypes[k].type] = {};
                counter = 0;
                piecesGoods = 'none';
                piecesStock = 0;
                for (var i = 0; i < gameBoard.boardArray.length; i++) {
                    for (var j = 0; j < gameBoard.boardArray[i].length; j++) {
                        if(gameBoard.boardArray[i][j].pieces.populatedSquare) {
                            if(gameBoard.boardArray[i][j].pieces.team == gameManagement.teamArray[h]) {
                                if(gameBoard.boardArray[i][j].pieces.type == stockDashboard.pieceTypes[k].type) {
                                    counter += 1;
                                    piecesGoods = gameBoard.boardArray[i][j].pieces.goods;
                                    piecesStock = gameBoard.boardArray[i][j].pieces.stock;
                                }
                            }
                        }
                    }
                }
                stockDashboard.pieceTotals[h].pieces[stockDashboard.pieceTypes[k].type] = {quantity: counter, goods: piecesGoods, stock: piecesStock};
            }
        }
          //console.log('pieceTotals', stockDashboard.pieceTotals);
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

    populateGoodsTotals: function () {
        for (var h = 0; h < gameManagement.teamArray.length; h++) {
            this.goodsTotals.push({team: gameManagement.teamArray[h], land: {wood: 0, iron: 0, stone: 0}, sea: {wood: 0, iron: 0, stone: 0}, total: {wood: 0, iron: 0, stone: 0}});
        }
    },

    goodsStockTake: function() {
        let counter = 0;
        for (var h = 0; h < gameManagement.teamArray.length; h++) {
            //console.log(gameManagement.teamArray[h]);
            this.goodsTotals[h] = {team: gameManagement.teamArray[h], land: {wood: 0, iron: 0, stone: 0}, sea: {wood: 0, iron: 0, stone: 0}, total: {wood: 0, iron: 0, stone: 0}};
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
