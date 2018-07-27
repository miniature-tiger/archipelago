// Computer opponent object - methods for AI of computer opponents
// ---------------------------------------------------------------

let computer = {

    computerShipsAll:  [],

    computerShipsTurn:  [],

    teamHome: { 'Red Team': {returnRow: 0, returnCol: 15},
                'Green Team': {returnRow: 30, returnCol: 15},
                'Blue Team': {returnRow: 15, returnCol: 0},
                'Orange Team': {returnRow: 15, returnCol: 30},
              },




    computerShipsTurnCount: -1,

    // Method to manage automated movement of computer opponent ships
    // --------------------------------------------------------------
    automatePlayer: function() {
        if(workFlow == 1) {console.log('Automate computer opponent: ' + (Date.now() - launchTime)); }

        // Update array of all computer opponent ships
        if (computer.computerShipsTurnCount == -1) {
            this.populateComputerShipsArray();
            // Separate array of ships for current turn
            this.computerShipsTurn = this.computerShipsAll.filter(fI => fI.team == gameManagement.turn);
        }

        // Increases counter to move on to next ship
        computer.computerShipsTurnCount +=1;

        // Ship move or update once all ships have moved
        if(computer.computerShipsTurnCount < computer.computerShipsTurn.length) {
            computer.computerMove();

        } else {
            if(workFlow == 1) {console.log('All computer opponent ships have moved. Update dashboards and reset pirate info: ' + (Date.now() - launchTime)); }
            // Update the stock dashboard
            stockDashboard.stockTake();
            stockDashboard.drawStock();

            computer.computerShipsTurnCount = -1;
            endTurn.addEventListener('click', gameManagement.nextTurn);
            stockDashboardNode.addEventListener('click', buildItem.clickStock);
            stockDashboardNode.addEventListener('mouseover', stockDashboard.hoverPieceOn);
            stockDashboardNode.addEventListener('mouseleave', gameBoard.clearHighlightTiles);

        }
    },


    computerMove: function() {
        if(workFlow == 1) {console.log('Computer player: ' + computer.computerShipsTurn[computer.computerShipsTurnCount].team + ' ' + computer.computerShipsTurn[computer.computerShipsTurnCount].type + ' moves: '+ (Date.now() - launchTime)); }
        if(computer.computerShipsTurnCount < computer.computerShipsTurn.length) {
            // Resets movement array
            pieceMovement.movementArray = {start: {row: '', col: ''}, end: {row: '', col: ''}};

            let pathDistance = 0;
            // Starting tile for pirate ship move taken from array of pirate ships
            pieceMovement.movementArray.start = computer.computerShipsTurn[computer.computerShipsTurnCount].start;

            maxMove = 0;
            let arrayPosition = stockDashboard.pieceTypes.findIndex(k => k.type == pieceMovement.movementArray.start.pieces.type);
            if (arrayPosition != -1) {
                maxMove = stockDashboard.pieceTypes[arrayPosition].maxMove;
            }

            // Tiles activated which also finds path for moves and information on reachable area
            // true / false allow red boundaries to be highlighted or not
            let searchRange = 10;
            //let searchRange = 0;
            if (pieceMovement.movementArray.start.pieces.damageStatus == 0) {
                if(workFlow == 1) {console.log('Damaged ship - find paths: '+ (Date.now() - launchTime)); }
                // TBC - Add search range calculation
                pieceMovement.activateTiles(pieceMovement.movementArray.start.row, pieceMovement.movementArray.start.col, 2.1, searchRange, true, 0);
            } else if (pieceMovement.movementArray.start.pieces.damageStatus == 5) {
                if(workFlow == 1) {console.log('Good ship - find paths: '+ (Date.now() - launchTime)); }
                // TBC - Add search range calculation
                pieceMovement.activateTiles(pieceMovement.movementArray.start.row, pieceMovement.movementArray.start.col, maxMove, searchRange, true, 5);
            }

            // Redraw active tile layer after activation to show activated tiles
            gameBoard.drawActiveTiles();

            if (pieceMovement.movementArray.start.pieces.damageStatus == 0) {
                // To be completed

            } else if (pieceMovement.movementArray.start.pieces.damageStatus == 5) {
                if(workFlow == 1) {console.log('Good ship - decide move: '+ (Date.now() - launchTime)); }

                // Move maximum distance at minimum wind cost
                if(workFlow == 1) {console.log('Finds max distance move at minimum cost: ' + (Date.now() - launchTime)); }
                computer.maxDistanceTiles = pirates.maxPathDistance();
                computer.minCostTiles = pirates.minArray(computer.maxDistanceTiles, 'moveCost');
                computer.computerShipsTurn[computer.computerShipsTurnCount].end.row = computer.minCostTiles[0].row;
                computer.computerShipsTurn[computer.computerShipsTurnCount].end.col = computer.minCostTiles[0].col;
            }

            // End position for pirate ship confirmed with movement array then move activated and dashboard recalculated
            pieceMovement.movementArray.end = computer.computerShipsTurn[computer.computerShipsTurnCount].end;
            if(workFlow == 1) {
                console.log('Computer opponent move decided - movement array shown below: '+ (Date.now() - launchTime));
                console.log(pieceMovement.movementArray);
            }
            pieceMovement.deactivateTiles(maxMove+1);
            pieceMovement.shipTransition(gameSpeed);
        }
    },

    maxDistanceTiles: [],

    minCostTiles: [],


    // Method to generate a list of computer opponent ships to move
    // ------------------------------------------------------------
    populateComputerShipsArray: function() {
        if(workFlow == 1) {console.log('Populate computer opponent ship array: ' + (Date.now() - launchTime)); }
        for (var i = 0; i < gameBoard.boardArray.length; i++) {
            for (var j = 0; j < gameBoard.boardArray[i].length; j++) {
                if((gameBoard.boardArray[i][j].pieces.team == gameManagement.turn) && (gameBoard.boardArray[i][j].pieces.category == 'Transport')) {
                    index = this.computerShipsAll.findIndex(fI => (fI.team == gameManagement.turn && fI.type == gameBoard.boardArray[i][j].pieces.type));
                    if (index == -1) {
                        this.computerShipsAll.push({team: gameManagement.turn, type: gameBoard.boardArray[i][j].pieces.type, manifest: this.teamHome[gameManagement.turn], start: {row: + i, col: + j, pieces: gameBoard.boardArray[i][j].pieces}, end: {row: + i, col: + j} });
                    } else {
                        this.computerShipsAll[index].start = {row: + i, col: + j, pieces: gameBoard.boardArray[i][j].pieces};
                        this.computerShipsAll[index].end = {row: + i, col: + j};
                    }
                }
            }
        }
        console.log(this.computerShipsAll);
    },


// LAST BRACKET OF OBJECT
}
