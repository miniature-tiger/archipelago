// Computer opponent object - methods for AI of computer opponents
// ---------------------------------------------------------------

let computer = {

    computerShips:  [],

    teamHome: { 'Red Team': {returnRow: 0, returnCol: 15},
                'Green Team': {returnRow: 30, returnCol: 15},
                'Blue Team': {returnRow: 15, returnCol: 0},
                'Orange Team': {returnRow: 15, returnCol: 30},
              },




    computerShipCount: -1,

    // Method to manage automated movement of computer opponent ships
    // --------------------------------------------------------------
    automatePlayer: function() {
        if(workFlow == 1) {console.log('Automate computer opponent: ' + (Date.now() - launchTime)); }

        // Update array of all computer opponent ships to be moved
        if (computer.computerShipCount == -1) {
            this.populateComputerShipsArray();
        }

        // Moves on to next ship
        do {
            computer.computerShipCount +=1;
        } while (computer.computerShips.team != gameManagement.turn && computer.computerShipCount < computer.computerShipCount.length);


        // Loop through each pirate ship
        if(computer.computerShipCount < computer.computerShipCount.length) {
            // TEMPORARY WHILE SHIP MOVEMENT BUILT
            pieceMovement.moveCompletion();

        } else {
            if(workFlow == 1) {console.log('All computer opponent ships have moved. Update dashboards and reset pirate info: ' + (Date.now() - launchTime)); }
            // Update the stock dashboard
            stockDashboard.stockTake();
            stockDashboard.drawStock();

            // Resets computer opponent array once all moves made
            for (var i = 0; i < computer.computerShipCount.length; i++) {
                this.computerShips[i].start = {row: '', col: ''};
                this.computerShips[i].end = {row: '', col: ''};
            }

            computer.computerShipCount = -1;
            endTurn.addEventListener('click', gameManagement.nextTurn);
            stockDashboardNode.addEventListener('click', buildItem.clickStock);
            stockDashboardNode.addEventListener('mouseover', stockDashboard.hoverPieceOn);
            stockDashboardNode.addEventListener('mouseleave', gameBoard.clearHighlightTiles);
            //boardMarkNode.addEventListener('click', boardHandler);

        }
    },



    // Method to generate a list of computer opponent ships to move
    // ------------------------------------------------------------
    populateComputerShipsArray: function() {
        if(workFlow == 1) {console.log('Populate computer opponent ship array: ' + (Date.now() - launchTime)); }
        for (var i = 0; i < gameBoard.boardArray.length; i++) {
            for (var j = 0; j < gameBoard.boardArray[i].length; j++) {
                if((gameBoard.boardArray[i][j].pieces.team == gameManagement.turn) && (gameBoard.boardArray[i][j].pieces.category == 'Transport')) {
                    index = this.computerShips.findIndex(fI => (fI.team == gameManagement.turn && fI.type == gameBoard.boardArray[i][j].pieces.type));
                    if (index == -1) {
                        this.computerShips.push({team: gameManagement.turn, type: gameBoard.boardArray[i][j].pieces.type, manifest: this.teamHome[gameManagement.turn], start: {row: + i, col: + j, pieces: gameBoard.boardArray[i][j].pieces}, end: {row: + i, col: + j} });
                    }
                }
            }
        }
        console.log(this.computerShips);
    },


// LAST BRACKET OF OBJECT
}
