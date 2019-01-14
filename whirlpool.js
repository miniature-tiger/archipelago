// ------------------------------------------------------------------------------------
// WHIRLPOOLS
// ------------------------------------------------------------------------------------

let whirlpool = {

    // whirlpool position array
    positions:  {
                  TL: {row: null, col: null, addRow: 0, addCol: 0},
                  TR: {row: null, col: null, addRow: 0, addCol: 16},
                  BL: {row: null, col: null, addRow: 16, addCol: 0},
                  BR: {row: null, col: null, addRow: 16, addCol: 16},
                },

    // Method to create / move whirlpools
    // ----------------------------------
    manageWhirlpools: function() {
        if (settings.workFlow === true) {console.log('Managing whirlpools: ' + (Date.now() - settings.launchTime)); }
        const stockTotalPosition = stockDashboard.pieceTotals.findIndex(fI => fI.team == 'total');


        // Choose whirlpool position for a quadrant
        let whirlpoolPosition = (rowAdd, colAdd) => {

            let valid = false
            let row = 0;
            let col = 0;
            while (valid === false) {
                row = Math.floor(Math.random()*15);
                col = Math.floor(Math.random()*15);

                    //console.log(this.boardArray[row + rowAdd][col + colAdd].piece.populatedSquare, this.boardArray[row + rowAdd][col + colAdd].tile.terrain)
                if (game.boardArray[row + rowAdd][col + colAdd].piece.populatedSquare === false
                    && game.boardArray[row + rowAdd][col + colAdd].tile.terrain === 'sea'
                    && game.boardArray[row + rowAdd][col + colAdd].tile.subTerrain === 'none'
                    && game.board.checkNextTo([row + rowAdd, col + colAdd], 'land') === false
                ){
                    valid = true;
                }
            }
            return [row + rowAdd, col + colAdd];
        };

        for (let quadrant in this.positions) {
            quadrant = this.positions[quadrant];
            const coords = whirlpoolPosition(quadrant.addRow, quadrant.addCol);

            if (stockDashboard.pieceTotals[stockTotalPosition].pieces.whirlpool.quantity < 4) {
                new Move({row: coords[0], col: coords[1]}, {row: coords[0], col: coords[1]}, 'addWhirlpool', {}).process();
            } else {
                new Move({row: quadrant.row, col: quadrant.col, piece: null}, {row: coords[0], col: coords[1], piece: null}, 'moveWhirlpool', {}).process();
            }
            [quadrant.row, quadrant.col] = coords;
        }
    },

// LAST BRACKET OF OBJECT
}
