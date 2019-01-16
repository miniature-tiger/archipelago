// Move constructor - methods to record moves
// ----------------------------------------------------------------------------------------------
function Move (startMove, endMove, moveType, extra) {
    this.board = game.board;
    this.boardArray = game.boardArray;
    this.boardDisplay = game.boardDisplay;
    this.startMove = startMove;
    this.endMove = endMove;
    this.moveType = moveType;
    this.goods = extra.goods;
    this.quantity = extra.quantity;
    this.discoveredResource = extra.discoveredResource;
    this.discoveredGoods = extra.discoveredGoods;
    this.discoveredStock = extra.discoveredStock;
    this.discoveredProduction = extra.discoveredProduction;
    this.battleWinner = extra.battleWinner;
}

// Method to process move
// ----------------------
Move.prototype.process = async function() {
    // Capture start and end piece objects in boardArray and corrsponding SVG pieces
    let startPiece = this.boardArray[this.startMove.row][this.startMove.col].piece;
    let endPiece = this.boardArray[this.endMove.row][this.endMove.col].piece;
    let startPieceID = 'piece' + ('0' + this.startMove.row).slice(-2) + ('0' + this.startMove.col).slice(-2);
    let endPieceID = 'piece' + ('0' + this.endMove.row).slice(-2) + ('0' + this.endMove.col).slice(-2);
    let startPieceSVG = this.boardDisplay.pieces[startPieceID];
    let endPieceSVG = this.boardDisplay.pieces[endPieceID];
    //console.log('moveType', this.moveType)
    //console.log('START PIECE', startPiece, startPieceSVG, this.startMove.row, this.startMove.col);
    //console.log('END PIECE', endPiece, endPieceSVG, this.endMove.row, this.endMove.col);

    if (this.moveType === 'discover') {
        // boardArray changes
        this.board.addPiece([this.startMove.row, this.startMove.col], new Resources('Resources', this.discoveredResource, '0', 'Unclaimed', this.discoveredGoods, this.discoveredStock, this.discoveredProduction, 'none'));
        // Display changes
        this.boardDisplay.addPiece(this.discoveredResource, 'Unclaimed', this.startMove.row, this.startMove.col, '0', 5, 1);

    } else if (this.moveType === 'claim') {
        // boardArray changes
        startPiece.changeTeam(endPiece.team);
        // Display changes
        startPieceSVG.changeTeam(endPiece.team);
        // Scoring changes
        gameScore.workScores('Exploring', endPiece.team, startPiece.type);

    } else if (this.moveType === 'load') {
        // boardArray changes
        startPiece.changeStock(-this.quantity);
        if (startPiece.category === 'Settlements' && startPiece.stock === 0) {
            startPiece.changeGoods('none');
        }
        endPiece.changeStock(this.quantity);
        endPiece.changeGoods(this.goods);

    } else if (this.moveType === 'unload') {
        // boardArray changes
        startPiece.changeStock(-this.quantity);
        if (startPiece.stock === 0) {
            startPiece.changeGoods('none');
        }
        endPiece.changeStock(this.quantity);
        endPiece.changeGoods(this.goods);

    } else if (this.moveType === 'deliver') {
        pieceMovement.deactivateTiles();
        game.boardDisplay.drawTiles('activeTiles');
        let tradeRouteInfo = tradeContracts.discoverPath(endMove.row, endMove.col, this.startMove.piece.goods);
        tradeContracts.fulfilDelivery(this.startMove.piece.goods, tradeRouteInfo, this.startMove.row, this.startMove.col, endMove.row, endMove.col);
        tradeContracts.drawContracts();

    } else if (this.moveType === 'battle') {

        if (this.battleWinner === 'start') {
            // boardArray changes
            endPiece.changeDamage(0);
            // Any cargo is lost (assumed taken by pirate ship)
            endPiece.changeStock(-endPiece.stock);
            endPiece.changeGoods('none');
            // Display changes
            endPieceSVG.damageShip(0);
        } else {
            // boardArray changes
            startPiece.changeDamage(0);
            // Allows attacking by ships at later date
            startPiece.changeStock(-startPiece.stock);
            startPiece.changeGoods('none');
            // Display changes
            startPieceSVG.damageShip(0);
        }

    } else if (this.moveType === 'build') {
        if (this.endMove.piece.type === 'cargoship') {
            // boardArray changes
            this.board.addPiece([this.endMove.row, this.endMove.col], new Transport('Transport', 'cargoship', '0', 1, startPiece.team, 'none', 0, 0, 'none'));
            // Display changes
            this.boardDisplay.addPiece('cargoship', startPiece.team, this.endMove.row, this.endMove.col, '0', 1, 1);
            endPieceSVG = this.boardDisplay.pieces[endPieceID];
            endPieceSVG.repairShip(1);
        } else if (this.endMove.piece.type === 'warship') {
            // boardArray changes
            this.board.addPiece([this.endMove.row, this.endMove.col], new Transport('Transport', 'warship', '0', 3, startPiece.team, 'none', 0, 0, 'none'));
            // Display changes
            this.boardDisplay.addPiece('warship', startPiece.team, this.endMove.row, this.endMove.col, '0', 3, 1);
            endPieceSVG = this.boardDisplay.pieces[endPieceID];
            endPieceSVG.repairShip(3);
        }
        buildItem.constructionPayment(this.endMove.piece.type);
        // Scoring changes
        gameScore.workScores('Building', game.turn, this.endMove.piece.type);

    } else if (this.moveType === 'transport') {
        // boardArray changes
        let endPiece = this.board.movePiece([this.startMove.row, this.startMove.col], [this.endMove.row, this.endMove.col]);
        //console.log('START PIECE', startPiece, startPieceSVG, this.startMove.row, this.startMove.col);
        //console.log('END PIECE', endPiece, endPieceSVG, this.endMove.row, this.endMove.col);
        // Graphics of move transitions
        this.boardDisplay.movePiece(this.startMove, this.endMove, startPieceSVG, endPiece, endPieceID, settings.gameSpeed);

    } else if (this.moveType === 'addWhirlpool') {
        // boardArray changes
        this.board.addPiece([this.startMove.row, this.startMove.col], new Hazard('Hazards', 'whirlpool', 0, 'Pirate', 'none', 0, 0, 'none', this.startMove.row, this.startMove.col));
        // Display changes
        let whirlpool = this.boardDisplay.addPiece('whirlpool', 'none', this.startMove.row, this.startMove.col, '360', 5, 0.1);
        whirlpool.svg.focus();
        // Display transition
        await whirlpool.spinTransitionUp(2 * settings.gameSpeed);
        
        return;

    } else if (this.moveType === 'moveWhirlpool') {
        // boardArray changes
        let endPiece = this.board.movePiece([this.startMove.row, this.startMove.col], [this.endMove.row, this.endMove.col]);
        // Display and transition changes
        await startPieceSVG.spinTransitionDown(2 * settings.gameSpeed);
        this.boardDisplay.movePieceNoTransition(startPieceSVG, endPieceID, this.endMove.row, this.endMove.col);
        await startPieceSVG.spinTransitionUp(2 * settings.gameSpeed);

        return;
    }
}
