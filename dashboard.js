// Dashboard object - methods to initialise dashboards
let stockDashboard = {


    // Array to hold information on pieces held by each player
    // -------------------------------------------------------
    pieceTotals: [],


    // Array to hold list of all piece types
    // -------------------------------------
    // Pieces must be added in the order: Settlements, Transport, Resources
    pieceTypes: [ {type: 'fort', category: 'Settlements', maxNo: 1000, goods: 'none', production: 0, deckNumber: 0},
                  {type: 'cargo ship', category: 'Transport', maxNo: 1000, goods: 'none', production: 0, deckNumber: 0},
                  {type: 'forest', category: 'Resources', maxNo: 3, goods: 'wood', production: 3, deckNumber: 8},
                  {type: 'ironworks', category: 'Resources', maxNo: 3, goods: 'iron', production: 1, deckNumber: 8},
                  {type: 'quarry', category: 'Resources', maxNo: 3, goods: 'stone', production: 2, deckNumber: 8},
                  {type: 'plantation', category: 'Resources', maxNo: 3, goods: 'coffee', production: 3, deckNumber: 8}
                ],




    // Method to count items in boardArray for leader board
    // ----------------------------------------------------

    stockTake: function() {
        let counter = 0;
        for (var h = 0; h < gameManagement.teamArray.length; h++) {
            //console.log(gameManagement.teamArray[h]);
            stockDashboard.pieceTotals[h] = {team: gameManagement.teamArray[h], pieces: {}};
            for (var k = 0; k < stockDashboard.pieceTypes.length; k++) {
                //console.log(stockDashboard.pieceTypes[k].type);
                stockDashboard.pieceTotals[h].pieces[stockDashboard.pieceTypes[k].type] = 0;
                counter = 0;
                for (var i = 0; i < gameBoard.boardArray.length; i++) {
                    for (var j = 0; j < gameBoard.boardArray[i].length; j++) {
                        if(gameBoard.boardArray[i][j].pieces.populatedSquare) {
                            if(gameBoard.boardArray[i][j].pieces.team == gameManagement.teamArray[h]) {
                                if(gameBoard.boardArray[i][j].pieces.type == stockDashboard.pieceTypes[k].type) {
                                    counter += 1;
                                }
                            }
                        }
                    }
                }
                stockDashboard.pieceTotals[h].pieces[stockDashboard.pieceTypes[k].type] = counter;
            }
        }
          //console.log(stockDashboard.pieceTotals);
    },

    // Method to populate stock dashboard on left-hand panel
    // -----------------------------------------------------

    drawStock : function() {
        // Finds the stockDashboard holder in the left hand panel
        let stockDashboardNode = document.querySelector('div.stockDashboard');

        // Any existing dashboard is deleted
        while (stockDashboardNode.firstChild) {
            stockDashboardNode.removeChild(stockDashboardNode.firstChild);
        }

        if (gameManagement.turn != 'Pirate') {
            // Variable to hold current category being added to the dashboard
            let stockCategory = '';

            let rotateIcon = 0;
            let xPosition = 0;

            // Loops through all the piece types
            for (var k = 0; k < this.pieceTypes.length; k++) {
                //Sets counter to zero
                let counter = 0;
                // Icon setting base on piece type
                if (this.pieceTypes[k].type == 'cargo ship') {
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

                // Loop through boardArray
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
                                let divTypeTitle = document.createTextNode('');
                                divForText.appendChild(divTypeTitle);

                                let divForStock = document.createElement('div');
                                divForStock.setAttribute('class', 'stock_item_holder');
                                divCat.appendChild(divForStock);

                                if (this.pieceTypes[k].category != 'Resources' && gameBoard.boardArray[i][j].pieces.stock == 0) {
                                    let divStockTitle = document.createTextNode('no cargo');
                                    divForStock.appendChild(divStockTitle);
                                } else {
                                    let divStockTitle = document.createTextNode(gameBoard.boardArray[i][j].pieces.goods + ': ' + gameBoard.boardArray[i][j].pieces.stock);
                                    divForStock.appendChild(divStockTitle);
                                }
                                counter += 1;
                            }
                        }
                    }
                }
                if (counter == 0) {
                    // Div to hold piece type is created and icon added
                    let divType = document.createElement('div');
                    divType.setAttribute('class', 'inner_item_holder');
                    divCat.appendChild(divType);
                    // Icon added
                    let divTypeIcon = gameBoard.createActionTile(0, 0, this.pieceTypes[k].type, 'Unclaimed', 'dash_' + this.pieceTypes[k].type, 2, xPosition, 1.5, rotateIcon);
                    divType.appendChild(divTypeIcon);

                    let divForText = document.createElement('div');
                    divForText.setAttribute('class', 'dashboard_text');
                    divType.appendChild(divForText);

                    //let divTypeTitle = document.createTextNode(' ' + this.pieceTypes[i].type + ': ' + this.pieceTotals[0].pieces[this.pieceTypes[i].type]);
                    let divTypeTitle = document.createTextNode('');
                    divForText.appendChild(divTypeTitle);

                    let divForStock = document.createElement('div');
                    divForStock.setAttribute('class', 'stock_item_holder');
                    divCat.appendChild(divForStock);

                    //let arrayPosition = this.pieceTypes.findIndex(fI => fI.type == gameManagement.turn);
                    let divStockTitle = document.createTextNode('no ' + this.pieceTypes[k].goods);
                    divForStock.appendChild(divStockTitle);
                }
            }
        }
    },


    goodsTotals: [],

    populateGoodsTotals: function () {
        for (var h = 0; h < gameManagement.teamArray.length; h++) {
            this.goodsTotals.push({team: gameManagement.teamArray[h], goods: {wood: 0, iron: 0, stone: 0}});
        }
    },

    goodsStockTake: function() {
        let counter = 0;
        for (var h = 0; h < gameManagement.teamArray.length; h++) {
            //console.log(gameManagement.teamArray[h]);
            this.goodsTotals[h] = {team: gameManagement.teamArray[h], goods: {}};
            for (var k = 0; k < this.pieceTypes.length; k++) {
                //console.log(stockDashboard.pieceTypes[k].type);
                this.goodsTotals[h].goods[this.pieceTypes[k].goods] = 0;
                counter = 0;
                for (var i = 0; i < gameBoard.boardArray.length; i++) {
                    for (var j = 0; j < gameBoard.boardArray[i].length; j++) {
                        if(gameBoard.boardArray[i][j].pieces.populatedSquare) {
                            if(gameBoard.boardArray[i][j].pieces.team == gameManagement.teamArray[h]) {
                                if(gameBoard.boardArray[i][j].pieces.goods == this.pieceTypes[k].goods) {
                                    counter += gameBoard.boardArray[i][j].pieces.stock;
                                }
                            }
                        }
                    }
                }
                this.goodsTotals[h].goods[this.pieceTypes[k].goods] = counter;
            }
        }
    },

    newTurnGoods : function() {
        for (var i = 0; i < gameBoard.boardArray.length; i++) {
            for (var j = 0; j < gameBoard.boardArray[i].length; j++) {
                if(gameBoard.boardArray[i][j].pieces.team == gameManagement.turn) {
                    if(gameBoard.boardArray[i][j].pieces.category == 'Resources') {
                        let arrayPosition = stockDashboard.pieceTypes.findIndex(k => k.goods == gameBoard.boardArray[i][j].pieces.goods);
                        gameBoard.boardArray[i][j].pieces.stock += this.pieceTypes[arrayPosition].production;
                    }
                }
            }
        }
    },

// LAST BRACKET OF OBJECT
}
