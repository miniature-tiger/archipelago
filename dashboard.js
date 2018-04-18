// Game board object - methods to initialise board and array to store current state of board
let stockDashboard = {


    // Array to hold information on pieces held by each player
    // -------------------------------------------------------
    pieceTotals: [],


    // Array to hold list of all piece types
    // -------------------------------------
    // Pieces must be added in the order: Settlements, Transport, Resources
    pieceTypes: [ {type: 'fort', category: 'Settlements', maxNo: 1000},
                  //{type: 'hut', category: 'Settlements', maxNo: 1000},
                  {type: 'cargo ship', category: 'Transport', maxNo: 1000},
                  {type: 'forest', category: 'Resources', maxNo: 3},
                  {type: 'ironworks', category: 'Resources', maxNo: 3},
                  {type: 'quarry', category: 'Resources', maxNo: 3}],


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
                //console.log(stockDashboard.pieceTotals[h].pieces[stockDashboard.pieceTypes[k].type]);
            }
        }
        console.log(stockDashboard.pieceTotals);
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

        // Find array position of team
        let a = this.pieceTotals.findIndex(i => i.team == gameManagement.turn);
        console.log(gameManagement.turn, a);

        // Variable to hold current category being added to the dashboard
        let stockCategory = '';
        let rotateIcon = 0;
        let xPosition = 0;
        //Add team name?
        //let dashTeam = document.createTextNode(gameManagement.teamArray[0]);


        // Loops through all the piece types
        for (var i = 0; i < this.pieceTypes.length; i++) {

            //console.log(this.pieceTypes[i].category);
            // Check if a new category is to be created
            if (this.pieceTypes[i].category != stockCategory) {
                stockCategory = this.pieceTypes[i].category;

                // Div to hold category is created and category title added
                var divCat = document.createElement('div');
                divCat.setAttribute('class', 'item_holder');
                stockDashboardNode.appendChild(divCat);
                var divCatTitle = document.createTextNode(stockCategory);
                divCat.appendChild(divCatTitle);
            }

            // Div to hold piece type is created and icon and piece title added
            let divType = document.createElement('div');
            divType.setAttribute('class', 'inner_item_holder');
            divCat.appendChild(divType);

            //let divTypeIcon = gameBoard.buildActionTile(this.pieceTypes[i].type, '0', gameManagement.teamArray[0], gridSize);

            if (this.pieceTypes[i].type == 'cargo ship') {
                rotateIcon = 90;
                xPosition = -10;
            } else {
                rotateIcon = 0;
                xPosition = 0;
            }

            let divTypeIcon = gameBoard.createActionTile(0, 0, this.pieceTypes[i].type, gameManagement.turn, 'dash_' + this.pieceTypes[i].type, 2, xPosition, 1.5, rotateIcon);
            divType.appendChild(divTypeIcon);

            let divForText = document.createElement('div');
            divForText.setAttribute('class', 'dashboard_text');
            divType.appendChild(divForText);

            //let divTypeTitle = document.createTextNode(' ' + this.pieceTypes[i].type + ': ' + this.pieceTotals[0].pieces[this.pieceTypes[i].type]);
            let divTypeTitle = document.createTextNode(this.pieceTotals[a].pieces[this.pieceTypes[i].type]);
            divForText.appendChild(divTypeTitle);

            //console.log(this.pieceTypes[i].type);
            //console.log(this.pieceTotals[0].pieces[this.pieceTypes[i].type]);
            //console.log(this.pieceTotals[0].pieces[this.pieceTypes][i])

        }
    },

// LAST BRACKET OF OBJECT
}
