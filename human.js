// Human player movement object - methods for handling human moves
let human = {

    // Event handler for board
    // ---------------------------------------------------------
    // handler for capturing clicks on board tiles by human player

    boardHandler: function(event) {
        if(workFlow == 1) {console.log('Board mark node click event listener triggered. Start/End = ' + startEnd + ': ' + (Date.now() - launchTime)); }
        let xClick = event.pageX - boardMarkLeft;
        let yClick = event.pageY - boardMarkTop;

        let xClickTile = Math.floor((xClick - boardSurround) / (gridSize + tileBorder * 2));
        let yClickTile = Math.floor((yClick - boardSurround) / (gridSize + tileBorder * 2));
        if((xClickTile >= 0 && xClickTile < col) && (yClickTile >= 0 && yClickTile < row)) {

            // Obtain details of most recent tile clicked on - separated between start and end points
            pieceMovement.captureMove(startEnd, yClickTile, xClickTile);

            // "Start" piece validation on first click
            if (startEnd == 'start') {
                maxMove = 0;
                let arrayPosition = stockDashboard.pieceTypes.findIndex(k => k.type == pieceMovement.movementArray[startEnd].pieces.type);
                if (arrayPosition != -1) {
                    maxMove = stockDashboard.pieceTypes[arrayPosition].maxMove;
                }
                // Commentary on tile clicked on
                commentary.clearCommentary();
                commentary.commentaryBox.appendChild(gameBoard.createActionTile(pieceMovement.movementArray.start.row, pieceMovement.movementArray.start.col, pieceMovement.movementArray.start.pieces.type, pieceMovement.movementArray.start.pieces.team, 'startPiece', 10, (screenWidth - 2*surroundSize) * 0.3 - (gridSize + 2*tileBorder)/2, 1.5, 0));
                for (var i = 0; i < pieceMovement.movementArray.start.pieces.stock; i++) {
                    //console.log(gameBoard.createIcon('stock' + i, 1.5, pieceMovement.movementArray.start.pieces.goods, (screenWidth - 2*surroundSize) * 0.6 + ((i+2) * (gridSize + tileBorder) / 1.5), 10));
                    commentary.commentaryBox.appendChild(gameBoard.createIcon('stock' + i, 1.5, pieceMovement.movementArray.start.pieces.goods, (screenWidth - 2*surroundSize) * 0.7 - tileBorder/2 + (((i % 10) - 0.5) * (gridSize + tileBorder) / 1.5), 10 + Math.floor(i/10) * ((gridSize + tileBorder) / 1.5)));
                }

                if (pieceMovement.movementArray[startEnd].pieces.type == 'desert') {
                    commentary.firstLineComment.innerText = 'Desert';
                } else if (pieceMovement.movementArray[startEnd].pieces.category == 'Resources') {
                    commentary.firstLineComment.innerText = pieceMovement.movementArray[startEnd].pieces.team + ' ' + pieceMovement.movementArray[startEnd].pieces.type + ': produces ' + pieceMovement.movementArray[startEnd].pieces.production + ' ' + pieceMovement.movementArray[startEnd].pieces.goods + ' per phase';
                } else {
                    commentary.firstLineComment.innerText = pieceMovement.movementArray[startEnd].pieces.team + ' ' + pieceMovement.movementArray[startEnd].pieces.type;
                }
                if (pieceMovement.movementArray[startEnd].pieces.stock > 0) {
                    commentary.firstLineComment.insertAdjacentText('beforeend', ' - ' + pieceMovement.movementArray[startEnd].pieces.goods + ": " + pieceMovement.movementArray[startEnd].pieces.stock);
                }
                buildItem.building.style.bottom = '-15%';
                scoreHeader.style.top = '-15%';
                commentary.commentaryBox.style.bottom = 0;

                // commentary event handler for goods
                if(pieceMovement.movementArray.start.pieces.team == gameManagement.turn && pieceMovement.movementArray.start.pieces.stock > 0) {
                    commentary.secondLineComment.innerText = 'Select quantity of goods to load';
                    commentary.commentaryBox.addEventListener('click', commentary.clickGoods);
                }

                if (pieceMovement.movementArray[startEnd].pieces.populatedSquare) {

                    // Claiming of unclaimed resources
                    if (pieceMovement.movementArray[startEnd].pieces.category == 'Resources' && pieceMovement.movementArray[startEnd].pieces.type != 'desert' && pieceMovement.movementArray[startEnd].pieces.team == 'Unclaimed') {
                        // Check that this resource type is not already held by player
                        let pieceTotalsTeamPosition = stockDashboard.pieceTotals.findIndex(fI => fI.team == gameManagement.turn);
                        if(stockDashboard.pieceTotals[pieceTotalsTeamPosition].pieces[pieceMovement.movementArray.start.pieces.type].quantity == 0) {
                            if (pieceMovement.shipAvailable('crew') == 'crew') {
                                // TO ADD - Check that ship has not previously landed crew somewhere
                                commentary.secondLineComment.innerText = 'Click ship to land team and claim resource';
                                startEnd = 'end';
                                gameBoard.drawActiveTiles();
                            }
                        } else {
                            commentary.secondLineComment.innerText = 'You have already claimed your ' + pieceMovement.movementArray[startEnd].pieces.type;
                        }

                    // Loading of a ship
                    } else if (((pieceMovement.movementArray.start.pieces.category == 'Resources' && pieceMovement.movementArray.start.pieces.type != 'desert') || pieceMovement.movementArray.start.pieces.category == 'Settlements') && pieceMovement.movementArray[startEnd].pieces.team == gameManagement.turn) {
                        if (pieceMovement.shipAvailable(pieceMovement.movementArray.start.pieces.goods) == 'compatible') {
                            if (pieceMovement.movementArray.start.pieces.stock > 0) {
                                startEnd = 'end';
                                gameBoard.drawActiveTiles();
                            } else if (pieceMovement.movementArray.start.pieces.stock == 0) {
                                commentary.secondLineComment.innerText = 'No goods to be loaded';
                            }
                        } else if (pieceMovement.shipAvailable(pieceMovement.movementArray.start.pieces.goods) == 'incompatible') {
                            commentary.secondLineComment.innerText = 'Docked ship already carrying different goods';
                        }

                    // Piece movement
                    } else if (pieceMovement.movementArray[startEnd].pieces.team == gameManagement.turn && pieceMovement.movementArray[startEnd].pieces.used == 'unused') {
                        if (pieceMovement.movementArray[startEnd].pieces.category == 'Transport' && (pieceMovement.movementArray[startEnd].pieces.damageStatus == 5 || pieceMovement.movementArray[startEnd].pieces.damageStatus == 0)) {
                            commentary.secondLineComment.innerText = 'Click any red tile to move';
                            // If "Start" piece is validated startEnd gate is opened and potential tiles are activated
                            startEnd = 'end';
                            if (pieceMovement.movementArray.start.pieces.damageStatus == 0) {
                                pieceMovement.activateTiles(pieceMovement.movementArray.start.row, pieceMovement.movementArray.start.col, 2.1, 2, true, 0);
                            } else if (pieceMovement.movementArray.start.pieces.damageStatus == 5) {
                                pieceMovement.activateTiles(pieceMovement.movementArray.start.row, pieceMovement.movementArray.start.col, maxMove, maxMove, true, 5);
                            }
                            // Redraw gameboard to show activated tiles
                            gameBoard.drawActiveTiles();
                        }
                    }

                    // Unloading of a ship
                    if (pieceMovement.movementArray.start.pieces.team == gameManagement.turn && pieceMovement.movementArray.start.pieces.category == 'Transport' && pieceMovement.movementArray.start.pieces.stock > 0) {

                        // Delivery of goods for contract
                        let depotSearch = pieceMovement.depotAvailable(pieceMovement.movementArray.start.pieces.goods);
                        if (depotSearch.includes('fort delivery')) {
                            if (pieceMovement.movementArray.start.pieces.used == 'unused') {
                                commentary.secondLineComment.insertAdjacentText('beforeend',' or deliver goods');
                            } else {
                                commentary.secondLineComment.innerText = 'Click red tile to deliver goods';
                            }
                            startEnd = 'end';
                            // Redraw gameboard to show activated tiles
                            gameBoard.drawActiveTiles();

                        // Unloading to own team fort or resource tile
                        } else if (depotSearch.includes(pieceMovement.movementArray.start.pieces.goods) || depotSearch.includes('fort compatible')) {
                            if (pieceMovement.movementArray.start.pieces.used == 'unused') {
                                commentary.secondLineComment.insertAdjacentText('beforeend',' or select quantity of goods to unload');
                            } else {
                                commentary.secondLineComment.innerText = 'Select quantity of goods to unload';
                            }
                            startEnd = 'end';
                            // Redraw gameboard to show activated tiles
                            gameBoard.drawActiveTiles();
                        } else if (depotSearch.includes('fort incompatible') && pieceMovement.movementArray.start.pieces.used == 'used') {
                            commentary.secondLineComment.innerText = 'Fort can only hold one goods type';
                        }
                    }
                }
            // Once "start" piece has been selected second click needs to be to an active "end" square
            // Piece move is then made
            } else if (startEnd == 'end') {
                // Removing commentary / building slider
                commentary.commentaryBox.style.bottom = '-10%';
                buildItem.building.style.bottom = '-15%';

                if (pieceMovement.movementArray.end.activeStatus == 'active') {
                    // Claiming of unclaimed resources
                    if (pieceMovement.movementArray.end.pieces.category == 'Transport' && pieceMovement.movementArray.start.pieces.type != 'desert' && pieceMovement.movementArray.start.pieces.team == 'Unclaimed') {
                        pieceMovement.deactivateTiles();
                        gameBoard.drawActiveTiles();
                        resourceManagement.claimResource(pieceMovement.movementArray.start.row, pieceMovement.movementArray.start.col, gameManagement.turn);
                        startEnd = 'start';

                    // Loading of goods
                  } else if ((pieceMovement.movementArray.start.pieces.category == 'Resources' || pieceMovement.movementArray.start.pieces.category == 'Settlements') && pieceMovement.movementArray.end.pieces.category == 'Transport') {
                        pieceMovement.deactivateTiles();
                        gameBoard.drawActiveTiles();
                        //commentary.loadingStock = gameBoard.boardArray[pieceMovement.movementArray.start.row][pieceMovement.movementArray.start.col].pieces.stock;
                        let arrayPosition = stockDashboard.pieceTypes.findIndex(k => k.type == pieceMovement.movementArray.end.pieces.type);
                        commentary.loadingStock = Math.min(commentary.loadingStock, stockDashboard.pieceTypes[arrayPosition].maxHold - pieceMovement.movementArray.end.pieces.stock);
                        loadingGoods = gameBoard.boardArray[pieceMovement.movementArray.start.row][pieceMovement.movementArray.start.col].pieces.goods;
                        gameBoard.boardArray[pieceMovement.movementArray.start.row][pieceMovement.movementArray.start.col].pieces.stock -= commentary.loadingStock;
                        if (gameBoard.boardArray[pieceMovement.movementArray.start.row][pieceMovement.movementArray.start.col].pieces.category == 'Settlements') {
                            if (gameBoard.boardArray[pieceMovement.movementArray.start.row][pieceMovement.movementArray.start.col].pieces.stock == 0) {
                                gameBoard.boardArray[pieceMovement.movementArray.start.row][pieceMovement.movementArray.start.col].pieces.goods = 'none';
                            }
                        }
                        gameBoard.boardArray[pieceMovement.movementArray.end.row][pieceMovement.movementArray.end.col].pieces.stock += commentary.loadingStock;
                        gameBoard.boardArray[pieceMovement.movementArray.end.row][pieceMovement.movementArray.end.col].pieces.goods = loadingGoods;
                        commentary.loadingStock = 0;

                    // Delivery of goods for contract
                  } else if (pieceMovement.movementArray.start.pieces.category == 'Transport' && pieceMovement.movementArray.end.pieces.team == 'Kingdom' && pieceMovement.movementArray.end.pieces.type == 'fort') {
                        pieceMovement.deactivateTiles();
                        gameBoard.drawActiveTiles();
                        let tradeRouteInfo = tradeContracts.discoverPath(pieceMovement.movementArray.end.row, pieceMovement.movementArray.end.col, pieceMovement.movementArray.start.pieces.goods);
                        tradeContracts.fulfilDelivery(pieceMovement.movementArray.start.pieces.goods, tradeRouteInfo, pieceMovement.movementArray.start.row, pieceMovement.movementArray.start.col, pieceMovement.movementArray.end.row, pieceMovement.movementArray.end.col);
                        tradeContracts.drawContracts();

                    // Unloading to own team fort or resource tile
                  } else if (pieceMovement.movementArray.start.pieces.category == 'Transport' && pieceMovement.movementArray.end.pieces.team == gameManagement.turn && (pieceMovement.movementArray.end.pieces.type == 'fort' || pieceMovement.movementArray.end.pieces.category == 'Resources')) {
                        pieceMovement.deactivateTiles();
                        gameBoard.drawActiveTiles();
                        //commentary.loadingStock = gameBoard.boardArray[pieceMovement.movementArray.start.row][pieceMovement.movementArray.start.col].pieces.stock;
                        loadingGoods = gameBoard.boardArray[pieceMovement.movementArray.start.row][pieceMovement.movementArray.start.col].pieces.goods;
                        gameBoard.boardArray[pieceMovement.movementArray.start.row][pieceMovement.movementArray.start.col].pieces.stock -= commentary.loadingStock;
                        if (gameBoard.boardArray[pieceMovement.movementArray.start.row][pieceMovement.movementArray.start.col].pieces.stock == 0) {
                            gameBoard.boardArray[pieceMovement.movementArray.start.row][pieceMovement.movementArray.start.col].pieces.goods = 'none';
                        }
                        gameBoard.boardArray[pieceMovement.movementArray.end.row][pieceMovement.movementArray.end.col].pieces.stock += commentary.loadingStock;
                        gameBoard.boardArray[pieceMovement.movementArray.end.row][pieceMovement.movementArray.end.col].pieces.goods = loadingGoods;
                        commentary.loadingStock = 0;
                    // Building new ship
                  } else if (pieceMovement.movementArray.start.pieces.category == 'Building') {
                        pieceMovement.deactivateTiles();
                        gameBoard.drawActiveTiles();
                        buildItem.buildShip(pieceMovement.movementArray.end.row, pieceMovement.movementArray.end.col, pieceMovement.movementArray.start.pieces.type, gameManagement.turn, pieceMovement.movementArray.end.pieces.direction);
                        buildItem.constructionPayment(pieceMovement.movementArray.start.pieces.type);
                        gameScore.workScores('Building', gameManagement.turn, pieceMovement.movementArray.start.pieces.type);
                    // Piece movement
                  } else if (pieceMovement.movementArray.start.pieces.category == 'Transport') {
                        // Main action event listeners are switched off whilst move transitions are shown
                        endTurn.removeEventListener('click', gameManagement.nextTurn);
                        boardMarkNode.removeEventListener('click', this.boardHandler);
                        stockDashboardNode.removeEventListener('click', buildItem.clickStock);
                        stockDashboardNode.removeEventListener('mouseover', stockDashboard.hoverPieceOn);
                        stockDashboardNode.removeEventListener('mouseleave', gameBoard.clearHighlightTiles);
                        // Redraw active tile layer after deactivation to remove activated tiles
                        pieceMovement.deactivateTiles();
                        gameBoard.drawActiveTiles();
                        // Graphics of move transitions
                        pieceMovement.shipTransition(gameSpeed);

                    }
                } else {
                    // Resetting if second click is not valid
                    human.resetMove();
                }

                // Update the stock dashboard
                stockDashboard.stockTake();
                stockDashboard.drawStock();
            }
        }
    },


    // Resetting move for human player
    // ---------------------------------------------------------
    resetMove: function() {
        pieceMovement.deactivateTiles();
        gameBoard.drawActiveTiles();

        // Resetting movement array once second click has been made (if invalid)
        pieceMovement.movementArray = {start: {row: '', col: ''}, end: {row: '', col: ''}};
        startEnd = 'start';

        // Removing commentary goods event handler
        commentary.commentaryBox.removeEventListener('click', commentary.clickGoods);
        commentary.clearCommentary();
    },


// LAST BRACKET OF OBJECT
}
