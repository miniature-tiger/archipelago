// Human player movement object - methods for handling human moves
let human = {

    // Movement array
    // --------------
    movementArray: {startEnd: 'start', start: {row: null, col: null, piece: null}, end: {row: null, col: null, piece: null}},

    // Event handler for board
    // ---------------------------------------------------------
    // handler for capturing clicks on board tiles by human player

    boardHandler: function(event) {
        if(settings.workFlow === true) {console.log('Board mark node click event listener triggered: ' + (Date.now() - settings.launchTime)); }
        const xClick = event.pageX - boardMarkNode.offsetLeft;
        const yClick = event.pageY - boardMarkNode.offsetTop;

        let xClickTile = Math.floor((xClick - game.boardSurround) / (game.gridSize + game.tileBorder * 2));
        let yClickTile = Math.floor((yClick - game.boardSurround) / (game.gridSize + game.tileBorder * 2));
        if ((xClickTile >= 0 && xClickTile < game.cols) && (yClickTile >= 0 && yClickTile < game.rows)) {
            let startEnd = human.movementArray.startEnd;

            // Reset movementArray
            if (startEnd === 'start') {
                human.movementArray = {startEnd: 'start', start: {row: null, col: null, piece: null}, end: {row: null, col: null, piece: null}};
            }

            // Obtain details of most recent tile clicked on - separated between start and end points
            human.captureMove(startEnd, yClickTile, xClickTile);

            // Process start move
            if (startEnd === 'start') {
                human.processStart(human.movementArray.start);
            } else {
                human.processEnd(human.movementArray.start, human.movementArray.end);
                // Update the stock dashboard
                stockDashboard.stockTake();
                stockDashboard.drawStock();
            }
        }
    },

    // Method for capturing moves
    // --------------------------
    captureMove: function(startEnd, yClickTile, xClickTile) {
        if(settings.workFlow === true) {console.log('Move information captured: ' + (Date.now() - settings.launchTime)); }
        let move = this.movementArray[startEnd];

        // Calculate row and column of square from id and record in movement array
        move.col = xClickTile;
        move.row = yClickTile;
        // Obtain board piece information and record in movement array
        if (startEnd === 'end' && move.piece !== null) {
            // move piece set through separate build slider / dashboard click
        } else {
            move.piece = game.boardArray[move.row][move.col].piece;
        }


        if (startEnd === 'start') {
            this.movementArray.start.activeStatus = 'inactive';
        } else if (this.movementArray.start.piece.category === 'Transport' && !this.movementArray.end.piece.populatedSquare) {
            this.movementArray.end.activeStatus = pieceMovement.findPath[this.movementArray.end.row][this.movementArray.end.col].activeStatus;
        } else {
            this.movementArray.end.activeStatus = game.boardArray[this.movementArray.end.row][this.movementArray.end.col].tile.activeStatus;
        }
        //console.log(this.movementArray);
    },

    // Method to process start move
    // ----------------------------
    processStart: function(startMove) {
            let maxMove = startMove.piece.maxMove;
            // Commentary on tile clicked on
            commentary.clickCommentary(startMove);

            if (startMove.piece.populatedSquare === true) {

                // Click on unclaimed resources - for claiming
                if (startMove.piece.category === 'Resources' && startMove.piece.type !== 'desert' && startMove.piece.team === 'Unclaimed') {
                    // Check that this resource type is not already held by player
                    let pieceTotalsTeamPosition = stockDashboard.pieceTotals.findIndex(fI => fI.team == game.turn);
                    if(stockDashboard.pieceTotals[pieceTotalsTeamPosition].pieces[startMove.piece.type].quantity == 0) {
                        if (pieceMovement.shipAvailable(startMove, 'crew') == 'crew') {
                            // TO ADD - Check that ship has not previously landed crew somewhere
                            commentary.secondLineComment.innerText = 'Click ship to land team and claim resource';
                            this.movementArray.startEnd = 'end';
                            game.boardDisplay.drawTiles('activeTiles');
                        }
                    } else {
                        commentary.secondLineComment.innerText = 'You have already claimed your ' + startMove.piece.type;
                    }

                // Loading of a ship
                } else if (((startMove.piece.category == 'Resources' && startMove.piece.type != 'desert') || startMove.piece.category == 'Settlements') && startMove.piece.team == game.turn) {
                    if (pieceMovement.shipAvailable(startMove, startMove.piece.goods) == 'compatible') {
                        if (startMove.piece.stock > 0) {
                            this.movementArray.startEnd = 'end';
                            game.boardDisplay.drawTiles('activeTiles');
                        } else if (startMove.piece.stock == 0) {
                            commentary.secondLineComment.innerText = 'No goods to be loaded';
                        }
                    } else if (pieceMovement.shipAvailable(startMove, startMove.piece.goods) == 'incompatible') {
                        commentary.secondLineComment.innerText = 'Docked ship already carrying different goods';
                    }

                // Piece movement
                } else if (startMove.piece.team == game.turn && startMove.piece.used == 'unused') {
                    if (startMove.piece.category == 'Transport' && (startMove.piece.damageStatus == 5 || startMove.piece.damageStatus == 0)) {
                        commentary.secondLineComment.innerText = 'Click any red tile to move';
                        // If "Start" piece is validated startEnd gate is opened and potential tiles are activated
                        this.movementArray.startEnd = 'end';
                        if (startMove.piece.damageStatus == 0) {
                            pieceMovement.activateTiles(startMove.row, startMove.col, 2.1, 2, true, 0);
                        } else if (startMove.piece.damageStatus == 5) {
                            pieceMovement.activateTiles(startMove.row, startMove.col, maxMove, maxMove, true, 5);
                        }
                        // Redraw gameboard to show activated tiles
                        game.boardDisplay.drawTiles('activeTiles');
                    }
                }

                // Unloading of a ship
                if (startMove.piece.team == game.turn && startMove.piece.category == 'Transport' && startMove.piece.stock > 0) {

                    // Delivery of goods for contract
                    let depotSearch = pieceMovement.depotAvailable(startMove, startMove.piece.goods);
                    if (depotSearch.includes('fort delivery')) {
                        if (startMove.piece.used == 'unused') {
                            commentary.secondLineComment.insertAdjacentText('beforeend',' or deliver goods');
                        } else {
                            commentary.secondLineComment.innerText = 'Click red tile to deliver goods';
                        }
                        this.movementArray.startEnd = 'end';
                        // Redraw gameboard to show activated tiles
                        game.boardDisplay.drawTiles('activeTiles');

                    // Unloading to own team fort or resource tile
                    } else if (depotSearch.includes(startMove.piece.goods) || depotSearch.includes('fort compatible')) {
                        if (startMove.piece.used == 'unused') {
                            commentary.secondLineComment.insertAdjacentText('beforeend',' or select quantity of goods to unload');
                        } else {
                            commentary.secondLineComment.innerText = 'Select quantity of goods to unload';
                        }
                        this.movementArray.startEnd = 'end';
                        // Redraw gameboard to show activated tiles
                        game.boardDisplay.drawTiles('activeTiles');
                    } else if (depotSearch.includes('fort incompatible') && startMove.piece.used == 'used') {
                        commentary.secondLineComment.innerText = 'Fort can only hold one goods type';
                    }
                }
            }

        },

    // Method to process end move
    // ----------------------------
    processEnd: function(startMove, endMove) {
        // Once "start" piece has been selected second click needs to be to an active "end" square
        // Piece move is then made
        // Removing commentary / building slider
        commentary.hideCommentary();

        if (endMove.activeStatus !== 'active') {
            // Resetting if second click is not valid
            this.resetMove();
        } else {
            // Resetting startEnd and active tiles
            this.movementArray.startEnd = 'start';
            pieceMovement.deactivateTiles();
            game.boardDisplay.drawTiles('activeTiles');

            // Claiming of unclaimed resources
            if (endMove.piece.category === 'Transport' && startMove.piece.type !== 'desert' && startMove.piece.team === 'Unclaimed') {
                  new Move(this.movementArray.start, this.movementArray.end, 'claim', {}).process();

            // Loading of goods
            } else if ((startMove.piece.category == 'Resources' || startMove.piece.category == 'Settlements') && endMove.piece.category == 'Transport') {
                let goods = startMove.piece.goods;
                let stock = Math.min(commentary.loadingStock, gameData.pieceTypes[endMove.piece.type].maxHold - endMove.piece.stock);
                new Move(this.movementArray.start, this.movementArray.end, 'load', {goods: goods, quantity: stock}).process();

            // Unloading to own team fort or resource tile
            } else if (startMove.piece.category == 'Transport' && endMove.piece.team == game.turn && (endMove.piece.type == 'fort' || endMove.piece.category == 'Resources')) {
                //commentary.loadingStock = game.boardArray[startMove.row][startMove.col].piece.stock;
                let goods = startMove.piece.goods;
                let stock = commentary.loadingStock;
                new Move(this.movementArray.start, this.movementArray.end, 'unload', {goods: goods, quantity: stock}).process();

            // Delivery of goods for contract
            } else if (startMove.piece.category === 'Transport' && endMove.piece.team === 'Kingdom' && endMove.piece.type === 'fort') {
                new Move(this.movementArray.start, this.movementArray.end, 'deliver', {}).process();

            // Building new ship
            } else if (startMove.piece.category == 'Building') {
                new Move(this.movementArray.start, this.movementArray.end, 'build', {}).process();

            // Piece movement
            } else if (startMove.piece.category == 'Transport') {
                new Move(this.movementArray.start, this.movementArray.end, 'transport', {}).process();
            }
        }
    },



    // Resetting move for human player
    // ---------------------------------------------------------
    resetMove: function() {
        pieceMovement.deactivateTiles();
        game.boardDisplay.drawTiles('activeTiles');

        // Resetting movement array once second click has been made (if invalid)
        this.movementArray = {startEnd: 'start', start: {row: null, col: null, piece: null}, end: {row: null, col: null, piece: null}};
        this.movementArray.startEnd = 'start';

        // Removing commentary goods event handler
        commentary.commentaryBox.removeEventListener('click', commentary.clickGoods);
        commentary.clearCommentary();
    },


// LAST BRACKET OF OBJECT
}
