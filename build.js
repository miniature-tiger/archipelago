// Building object - methods and arrays to allow building of ships
let buildItem = {

    // Array to hold building recipes
    // -------------------------------
    buildRecipe: [{type: 'warship', recipe: [{goods: 'wood', quantity: 8}, {goods: 'iron', quantity: 12}, {goods: 'cloth', quantity: 4}]},
                  {type: 'cargoship', recipe: [{goods: 'wood', quantity: 15}, {goods: 'iron', quantity: 10}, {goods: 'cloth', quantity: 5}]} ],

    // Set up of building slider elements
    // ---------------------------------
    building: document.querySelector('.building'),
    firstBuildLine: document.querySelector('#firstBuildLine'),
    secondBuildLine: document.querySelector('#secondBuildLine'),
    thirdBuildLine: document.querySelector('#thirdBuildLine'),

    // Method to handle clicks on stock dashboard
    // ------------------------------------------
    // Only build actions currently operational from clicking on stock dashboard
    clickStock: function(e) {
        if (e.target.classList.contains('buildcargo') || e.target.parentNode.classList.contains('buildcargo')) {
            buildItem.clickBuild(e, 'cargoship');
        } else if (e.target.classList.contains('buildwarship') || e.target.parentNode.classList.contains('buildwarship')) {
            buildItem.clickBuild(e, 'warship');
        }
    },

    enoughGoodsToBuild: function(buildNo, team) {
        // Loop through each goods type in build recipe and only allow construction if sufficient goods stock available
        let result = true;
        for (var k = 0; k < buildItem.buildRecipe[buildNo].recipe.length; k+=1) {
            if(stockDashboard.goodsTotals[team].land[buildItem.buildRecipe[buildNo].recipe[k].goods] < buildItem.buildRecipe[buildNo].recipe[k].quantity) {
                result = false;
            }
        }
        return result;
    },

    // Method to operate building slider and check if chosen ship can be built
    // -----------------------------------------------------------------------
    clickBuild: function(stockElement, build) {
        // Resets any half-made board moves and deactivates tiles
        human.resetMove();

        // Clears building slider for use
        buildItem.clearBuilding();

        // Slides building slider up and commentary down
        commentary.commentaryBox.style.bottom = '-10%';
        buildItem.building.style.bottom = 0;

        // Refreshes amount of stock held by players and set up variables
        stockDashboard.goodsStockTake();
        let buildNo = buildItem.buildRecipe.findIndex(y => y.type == build);

        // Add icon of ship clicked on
        let buildIcon = buildItem.building.appendChild(new PieceSVG(build, 'Unclaimed', 'buildPiece', 10, (game.mapWidth - 2*game.surroundSize) * 0.04 - (game.gridSize + 2*game.tileBorder)/2, 1.5,  0, 5, game.gridSize, game.tileBorder, game.boardSurround).svg);
        // Check enough goods to build chosen ship
        let allowConstruction = this.enoughGoodsToBuild(buildNo, game.turn);

        // Adds goods icons to illustrate quantity held vs quantity required
        for (let k = 0; k < buildItem.buildRecipe[buildNo].recipe.length; k+=1) {
            for (let i = 0; i < Math.min(stockDashboard.goodsTotals[game.turn].land[buildItem.buildRecipe[buildNo].recipe[k].goods], buildItem.buildRecipe[buildNo].recipe[k].quantity); i+=1) {
                buildItem.building.appendChild(game.icons.createIcon(buildItem.buildRecipe[buildNo].recipe[k].goods, 'stock' + i, 10 + Math.floor(i/10) * ((game.gridSize + game.tileBorder) / 1.5), (game.mapWidth - 2*game.surroundSize) * ((k+2) * 0.20) - game.tileBorder/2 + (((i % 10) - 0.5) * (game.gridSize + game.tileBorder) / 1.5), 1.5));

                //this.commentaryBox.appendChild(gameBoardIcons.createIcon(click.pieces.goods, 'stock' + i, 10 + Math.floor(i/10) * ((gridSize + tileBorder) / 1.5), (mapWidth - 2*surroundSize) * 0.7 - tileBorder/2 + (((i % 10) - 0.5) * (gridSize + tileBorder) / 1.5), 1.5));
                for (let z = 0; z < buildItem.building.lastChild.children.length; z+=1) {
                    let nextChild = buildItem.building.lastChild.children[z];
                    nextChild.setAttribute('class', buildItem.building.lastChild.children[z].baseVal + ' ' + game.turn + ' team_stroke team_fill');
                }
            }
            for (let j = stockDashboard.goodsTotals[game.turn].land[buildItem.buildRecipe[buildNo].recipe[k].goods]; j < buildItem.buildRecipe[buildNo].recipe[k].quantity; j+=1) {
                buildItem.building.appendChild(game.icons.createIcon(buildItem.buildRecipe[buildNo].recipe[k].goods, 'stock' + i, 10 + Math.floor(i/10) * ((game.gridSize + game.tileBorder) / 1.5), (game.mapWidth - 2*game.surroundSize) * ((k+2) * 0.20) - game.tileBorder/2 + (((i % 10) - 0.5) * (game.gridSize + game.tileBorder) / 1.5), 1.5));
                                                                      //gameBoardIcons.createIcon(click.pieces.goods, 'stock' + i, 10 + Math.floor(i/10) * ((gridSize + tileBorder) / 1.5), (mapWidth - 2*surroundSize) * 0.7 - tileBorder/2 + (((i % 10) - 0.5) * (gridSize + tileBorder) / 1.5), 1.5)
            }
        }

        // Adds ship construction details to building slider
        buildItem.firstBuildLine.innerText = 'Construction of ' + build + ' requires:';
        buildItem.secondBuildLine.innerText = buildItem.buildRecipe[buildNo].recipe[0].goods + ' ' + buildItem.buildRecipe[buildNo].recipe[0].quantity + ', ' + buildItem.buildRecipe[buildNo].recipe[1].goods + ' ' + buildItem.buildRecipe[buildNo].recipe[1].quantity + ', ' + buildItem.buildRecipe[buildNo].recipe[2].goods + ' ' + buildItem.buildRecipe[buildNo].recipe[2].quantity ;
        // Sets up piece movement array and adds ship type and launches construction
        if (allowConstruction === true) {
            buildItem.thirdBuildLine.innerText = 'Click ship icon to confirm construction.';
            human.movementArray = {startEnd: 'start', start: {row: null, col: null, piece: null}, end: {row: null, col: null, piece: null}},
            human.movementArray.start.piece = {category: 'Building', type: 'fort'};
            human.movementArray.end.piece = {category: 'Building', type: build};
            buildIcon.addEventListener('click', buildItem.startConstruction);
        // Does not launch construction if insufficient stock
        } else {
            buildItem.thirdBuildLine.innerText = 'Insufficient goods available to build ' + build + '.';
        }
    },

    // Method to determine harbours where building can take place
    // ---------------------------------------------------------------------
    buildLocation: function() {
        // Array of potential harbours for computer opponent
        let shipBuildLocation = [];
        let fortLocation = [];

        // Check boardArray for harbours
        for (let i = 0; i < game.boardArray.length; i+=1) {
            for (let j = 0; j < game.boardArray[i].length; j+=1) {
                if (game.boardArray[i][j].tile.subTerrainTeam === game.turn && game.boardArray[i][j].tile.subTerrain === 'harbour' && game.boardArray[i][j].piece.populatedSquare === false) {
                    game.boardArray[i][j].tile.activeStatus = 'active'; // harbours activated for human player
                    shipBuildLocation.push({row: i, col: j}); // array filled for computer player
                } else if (game.boardArray[i][j].piece.team === game.turn && game.boardArray[i][j].piece.type === 'fort') {
                    fortLocation.push({row: i, col: j})
                }
            }
        }
        return [shipBuildLocation, fortLocation];
    },


    // Method to activate harbours and capture start inputs of building turn
    // ---------------------------------------------------------------------
    // End inputs are captured as normal through buildMarkNode event listener
    startConstruction: function() {
        let [shipBuildLocation, fortLocation] = buildItem.buildLocation();
        human.movementArray.start.row = fortLocation[0].row;
        human.movementArray.start.col = fortLocation[0].col;
        human.movementArray.end.row = shipBuildLocation[0].row;
        human.movementArray.end.col = shipBuildLocation[0].col;

        // Capture move inputs, since boardMarkNode has not been clicked on. Uses 'Building' as special designation for off-board action.
        game.boardDisplay.drawTiles('activeTiles');
        human.movementArray.startEnd = 'end';

        // Changing building text
        buildItem.firstBuildLine.innerText = 'Select harbour for construction.';
        buildItem.secondBuildLine.innerText = '';
        thirdBuildLine.innerText = '';
    },

    // Method to reduce stock levels of Resource and fort tiles for construction of ship
    // ---------------------------------------------------------------------------------
    // Fort stock is used prior to and Resource piece stock
    constructionPayment: function(build) {
        // Updates stock numbers for use in this method
        stockDashboard.stockTake();
        let teamArrayPosition = stockDashboard.pieceTotals.findIndex(fI => fI.team == game.turn);
        let buildNo = this.buildRecipe.findIndex(fI => fI.type == build);

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
        for (var i = 0; i < game.boardArray.length; i++) {
            for (var j = 0; j < game.boardArray[i].length; j++) {
                if (game.boardArray[i][j].piece.team == game.turn && game.boardArray[i][j].piece.category == 'Resources') {
                    for (var k = 0; k < this.buildRecipe[buildNo].recipe.length; k++) {
                        if (this.buildRecipe[buildNo].recipe[k].goods == game.boardArray[i][j].piece.goods) {
                            game.boardArray[i][j].piece.stock -= this.buildRecipe[buildNo].recipe[k].quantity
                            // Adjustment for fort stock which is reduced below
                            if (game.boardArray[i][j].piece.goods == fortPaymentGoods) {
                                game.boardArray[i][j].piece.stock += fortPaymentQuantity;
                            }
                        }
                    }
                // Use of fort stock
                } else if (game.boardArray[i][j].piece.team == game.turn && game.boardArray[i][j].piece.type == 'fort') {
                    game.boardArray[i][j].piece.stock -= fortPaymentQuantity;
                    if (game.boardArray[i][j].piece.stock == fortPaymentQuantity) {
                        game.boardArray[i][j].piece.goods = 'none';
                    }

                }
            }
        }
    },

    // Resets building slider
    // ----------------------
    clearBuilding: function() {
        if(settings.workFlow === true) {console.log('Clearing building slider: ' + (Date.now() - settings.launchTime)); }
        for (var i = buildItem.building.children.length - 1; i > -1; i--) {
            if (buildItem.building.children[i].id == 'firstBuildLine' || buildItem.building.children[i].id == 'secondBuildLine' || buildItem.building.children[i].id == 'thirdBuildLine') {
                buildItem.building.children[i].innerText = '';
            } else {
                buildItem.building.children[i].remove();
            }
        }
    },

// LAST BRACKET OF OBJECT
}
