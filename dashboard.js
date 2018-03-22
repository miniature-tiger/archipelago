// Game board object - methods to initialise board and array to store current state of board
let stockDashboard = {


    // Array to hold information on pieces held by each player
    // -------------------------------------------------------
    pieceTotals: [],


    // Array to hold list of all piece types
    // -------------------------------------
    pieceTypes: ['cargoShip', 'hut', 'tree', 'iron'],


    // Method to count items in boardArray for leader board
    // ----------------------------------------------------

    stockTake: function() {
        let counter = 0;
        for (var h = 0; h < gameManagement.teamArray.length; h++) {
            console.log(gameManagement.teamArray[h]);
            gameBoard.pieceTotals[h] = {team: gameManagement.teamArray[h], pieces: {}};
            for (var k = 0; k < gameBoard.pieceTypes.length; k++) {
                console.log(gameBoard.pieceTypes[k]);
                gameBoard.pieceTotals[h].pieces[gameBoard.pieceTypes[k]] = 0;
                counter = 0;
                for (var i = 0; i < gameBoard.boardArray.length; i++) {
                    for (var j = 0; j < gameBoard.boardArray[i].length; j++) {
                        if(gameBoard.boardArray[i][j].pieces.populatedSquare) {
                            if(gameBoard.boardArray[i][j].pieces.team == gameManagement.teamArray[h]) {
                                if(gameBoard.boardArray[i][j].pieces.type == gameBoard.pieceTypes[k]) {
                                    counter += 1;
                                }
                            }
                        }
                    }
                }
                gameBoard.pieceTotals[h].pieces[gameBoard.pieceTypes[k]] = counter;
                console.log(gameBoard.pieceTotals[h].pieces[gameBoard.pieceTypes[k]]);
                //console.log(gameBoard.boardArray[i][j].pieces.type + ' ' + gameBoard.boardArray[i][j].pieces.team);
            }
        }
        console.log(gameBoard.pieceTotals);
    },


// LAST BRACKET OF OBJECT
}
