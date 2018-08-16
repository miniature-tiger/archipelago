// Building object - methods and arrays to allow building of ships
let buildItem = {

    // Array to hold building recipes
    // -------------------------------
    buildRecipe: [
                  {type: 'warship', recipe: [{goods: 'wood', quantity: 10}, {goods: 'iron', quantity: 15}, {goods: 'cloth', quantity: 4}]},
                  {type: 'cargo ship', recipe: [{goods: 'wood', quantity: 15}, {goods: 'iron', quantity: 10}, {goods: 'cloth', quantity: 8}]},
                  ],

    // Method to handle clicks on stock dashboard
    // ------------------------------------------
    // Only build actions currently operational from clicking on stock dashboard
    clickStock: function(e) {
        if (e.target.classList.contains('buildcargo') || e.target.parentNode.classList.contains('buildcargo')) {
            buildItem.clickBuild(e, 'cargo ship');
        } else if (e.target.classList.contains('buildwarship') || e.target.parentNode.classList.contains('buildwarship')) {
            buildItem.clickBuild(e, 'warship');
        }
    },

    // Method to operate building slider and check if chosen ship can be built
    // -----------------------------------------------------------------------
    clickBuild: function(stockElement, localBuild) {
        // Resets any half-made board moves and deactivates tiles
        resetMove();

        // Clears building slider for use
        buildItem.clearBuilding();

        // Slides building slider up and commentary down
        commentary.style.bottom = '-10%';
        building.style.bottom = 0;

        // Refreshes amount of stock held by players and set up variables
        stockDashboard.goodsStockTake();
        let teamNo = gameManagement.teamArray.indexOf(gameManagement.turn);
        let buildNo = buildItem.buildRecipe.findIndex(y => y.type == localBuild);

        // Add icon of ship clicked on
        let buildIcon = building.appendChild(gameBoard.createActionTile(0, 0, localBuild, gameManagement.turn, 'buildPiece', 10, (screenWidth - 2*surroundSize) * 0.04 - (gridSize + 2*tileBorder)/2, 1.5, 0));

        // Loop through each goods type in build recipe and only allow construction if sufficient goods stock available
        let allowConstruction = true;
        for (var k = 0; k < buildItem.buildRecipe[buildNo].recipe.length; k++) {
            if(stockDashboard.goodsTotals[teamNo].land[buildItem.buildRecipe[buildNo].recipe[k].goods] < buildItem.buildRecipe[buildNo].recipe[k].quantity) {
                allowConstruction = false;
            }
            // Adds goods icons to illustrate quantity held vs quantity required
            for (var i = 0; i < Math.min(stockDashboard.goodsTotals[teamNo].land[buildItem.buildRecipe[buildNo].recipe[k].goods], buildItem.buildRecipe[buildNo].recipe[k].quantity); i++) {
                building.appendChild(gameBoard.createIcon(buildItem.buildRecipe[buildNo].recipe[k].goods + i, 1.5, buildItem.buildRecipe[buildNo].recipe[k].goods, (screenWidth - 2*surroundSize) * ((k+2) * 0.20) - tileBorder/2 + (((i % 10) - 0.5) * (gridSize + tileBorder) / 1.5), 10 + Math.floor(i/10) * ((gridSize + tileBorder) / 1.5)));
                for (var z = 0; z < building.lastChild.children.length; z++) {
                    let nextChild = building.lastChild.children[z];
                    nextChild.setAttribute('class', building.lastChild.children[z].baseVal + ' ' + gameManagement.turn + ' team_stroke team_fill');
                }
            }
            for (var j = stockDashboard.goodsTotals[teamNo].land[buildItem.buildRecipe[buildNo].recipe[k].goods]; i < buildItem.buildRecipe[buildNo].recipe[k].quantity; i++) {
                building.appendChild(gameBoard.createIcon('stock' + i, 1.5, buildItem.buildRecipe[buildNo].recipe[k].goods, (screenWidth - 2*surroundSize) * ((k+2) * 0.20) - tileBorder/2 + (((i % 10) - 0.5) * (gridSize + tileBorder) / 1.5), 10 + Math.floor(i/10) * ((gridSize + tileBorder) / 1.5)));
            }
        }

        // Adds ship construction details to building slider
        firstBuildLine.innerText = 'Construction of ' + localBuild + ' requires:';
        secondBuildLine.innerText = buildItem.buildRecipe[buildNo].recipe[0].goods + ' ' + buildItem.buildRecipe[buildNo].recipe[0].quantity + ', ' + buildItem.buildRecipe[buildNo].recipe[1].goods + ' ' + buildItem.buildRecipe[buildNo].recipe[1].quantity + ', ' + buildItem.buildRecipe[buildNo].recipe[2].goods + ' ' + buildItem.buildRecipe[buildNo].recipe[2].quantity ;
        // Sets up piece movement array and adds ship type and launches construction
        if (allowConstruction == true) {
            thirdBuildLine.innerText = 'Click ship icon to confirm construction.';
            pieceMovement.movementArray = {start: {row: '', col: ''}, end: {row: '', col: ''}};
            pieceMovement.movementArray.start.pieces = {type: localBuild};
            buildIcon.addEventListener('click', buildItem.startConstruction);
        // Does not launch construction if insufficient stock
        } else {
            thirdBuildLine.innerText = 'Insufficient goods available to build ' + localBuild + '.';
        }
    },

    // Method to activate harbours and capture start inputs of building turn
    // ---------------------------------------------------------------------
    // End inputs are captured as normal through buildMarkNode event listener
    startConstruction: function() {
        // Activating current team harbours
        for (var i = 0; i < gameBoard.boardArray.length; i++) {
            for (var j = 0; j < gameBoard.boardArray[i].length; j++) {
                if (gameBoard.boardArray[i][j].subTerrainTeam == gameManagement.turn && gameBoard.boardArray[i][j].subTerrain == 'harbour' && gameBoard.boardArray[i][j].pieces.populatedSquare == false) {
                    gameBoard.boardArray[i][j].activeStatus = 'active';
                } else if (gameBoard.boardArray[i][j].pieces.team == gameManagement.turn && gameBoard.boardArray[i][j].pieces.type == 'fort') {
                    pieceMovement.movementArray.start.row = i;
                    pieceMovement.movementArray.start.col = j;
                }
            }
        }

        // Capture move inputs, since boardMarkNode has not been clicked on. Uses 'Building' as special designation for off-board action.
        pieceMovement.movementArray.start.pieces = {populatedSquare: false, category: 'Building', type: pieceMovement.movementArray.start.pieces.type, direction: 0, used: 'unused', damageStatus: 3, team: gameManagement.turn, goods: 'none', stock: 0, production: 0};
        gameBoard.drawActiveTiles();
        startEnd = 'end';

        // Changing building text
        firstBuildLine.innerText = 'Select harbour for construction.';
        secondBuildLine.innerText = '';
        thirdBuildLine.innerText = '';
    },

    // Method to reduce stock levels of Resource and fort tiles for construction of ship
    // ---------------------------------------------------------------------------------
    // Fort stock is used prior to and Resource piece stock
    constructionPayment: function(localBuild) {
        // Updates stock numbers for use in this method
        stockDashboard.stockTake();
        let teamArrayPosition = stockDashboard.pieceTotals.findIndex(fI => fI.team == gameManagement.turn);
        let buildNo = this.buildRecipe.findIndex(fI => fI.type == localBuild);

        // Determines if any of the resources are in the team fort and reduces this balance first
        let fortPaymentGoods = 'none';
        let fortPaymentQuantity = 0;
        for (var a = 0; a < this.buildRecipe[buildNo].recipe.length; a++) {
            if(stockDashboard.pieceTotals[teamArrayPosition].pieces.fort.goods == this.buildRecipe[buildNo].recipe[a].goods) {
                fortPaymentGoods = this.buildRecipe[buildNo].recipe[a].goods;
                fortPaymentQuantity = Math.min(this.buildRecipe[buildNo].recipe[a].quantity, stockDashboard.pieceTotals[teamArrayPosition].pieces.fort.stock);
            }
        }

        // Loops through each board tile and reduces the goods on Resource and fort tiles in accordance with construction costs
        for (var i = 0; i < gameBoard.boardArray.length; i++) {
            for (var j = 0; j < gameBoard.boardArray[i].length; j++) {
                if (gameBoard.boardArray[i][j].pieces.team == gameManagement.turn && gameBoard.boardArray[i][j].pieces.category == 'Resources') {
                    for (var k = 0; k < this.buildRecipe[buildNo].recipe.length; k++) {
                        if (this.buildRecipe[buildNo].recipe[k].goods == gameBoard.boardArray[i][j].pieces.goods) {
                            gameBoard.boardArray[i][j].pieces.stock -= this.buildRecipe[buildNo].recipe[k].quantity
                            // Adjustment for fort stock which is reduced below
                            if (gameBoard.boardArray[i][j].pieces.goods == fortPaymentGoods) {
                                gameBoard.boardArray[i][j].pieces.stock += fortPaymentQuantity;
                            }
                        }
                    }
                // Use of fort stock
                } else if (gameBoard.boardArray[i][j].pieces.team == gameManagement.turn && gameBoard.boardArray[i][j].pieces.type == 'fort') {
                    gameBoard.boardArray[i][j].pieces.stock -= fortPaymentQuantity;
                    if (gameBoard.boardArray[i][j].pieces.stock == fortPaymentQuantity) {
                        gameBoard.boardArray[i][j].pieces.goods = 'none';
                    }

                }
            }
        }
    },

    // Resets building slider
    // ----------------------
    clearBuilding: function() {
        if(workFlow == 1) {console.log('Clearing building slider: ' + (Date.now() - launchTime)); }
        for (var i = building.children.length - 1; i > -1; i--) {
            if (building.children[i].id == 'firstBuildLine' || building.children[i].id == 'secondBuildLine' || building.children[i].id == 'thirdBuildLine') {
                building.children[i].innerText = '';
            } else {
                building.children[i].remove();
            }
        }
    },

// LAST BRACKET OF OBJECT
}
