// Computer opponent object - methods for AI of computer opponents
// ---------------------------------------------------------------

let computer = {

    computerShipsAll:  [],

    computerShipsTurn:  [],

    teamHome: { 'Red Team': {homeRow: 0, homeCol: 15},
                'Green Team': {homeRow: 30, homeCol: 15},
                'Blue Team': {homeRow: 15, homeCol: 0},
                'Orange Team': {homeRow: 15, homeCol: 29},
              },

    computerShipsTurnCount: -1,

    targetHarbour: [],

    telescopeHarbour: [],

    maxDistanceTiles: [],

    minCostTiles: [],

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
            if(workFlow == 1) {console.log('All computer opponent ships have moved. Update dashboards and event listeners: ' + (Date.now() - launchTime)); }
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

            // -------------- SET UP -----------------
            // Resets movement array
            pieceMovement.movementArray = {start: {row: '', col: ''}, end: {row: '', col: ''}};
            // Starting tile for pirate ship move taken from array of pirate ships
            pieceMovement.movementArray.start = computer.computerShipsTurn[computer.computerShipsTurnCount].start;
            // Pulling maxMove from pieces array
            maxMove = 0;
            let arrayPosition = stockDashboard.pieceTypes.findIndex(k => k.type == pieceMovement.movementArray.start.pieces.type);
            if (arrayPosition != -1) {
                maxMove = stockDashboard.pieceTypes[arrayPosition].maxMove;
            }

            // -------------- FINDING PATHS AND ACTIVATING TILES (equivalent of START of move) -----------------
            // Tiles activated which also finds path for moves and information on reachable area
            // true / false allow red boundaries to be highlighted or not
            let searchRange = 0;
            // Activating tiles and findPath for damaged ships at sea (damageStatus is set to 0 after battle loss)
            if (pieceMovement.movementArray.start.pieces.damageStatus == 0) {
                if(workFlow == 1) {console.log('Damaged ship - find paths: '+ (Date.now() - launchTime)); }
                searchRange = 10; // Consider processing requirement and determine whether this needs to be restricted to 10
                pieceMovement.activateTiles(pieceMovement.movementArray.start.row, pieceMovement.movementArray.start.col, 2.1, searchRange, true, 0);
            // Activating tiles and findPath for undamaged ships (damageStatus is 5 for healthy ships)
            } else if (pieceMovement.movementArray.start.pieces.damageStatus == 5) {
                if(workFlow == 1) {console.log('Good ship - find paths: '+ (Date.now() - launchTime)); }
                searchRange = 30;
                pieceMovement.activateTiles(pieceMovement.movementArray.start.row, pieceMovement.movementArray.start.col, maxMove, searchRange, true, 5);
            // Setting findPath for ships under repair (damageStatus between 0 and 5) to prevent ships moving
            } else {
                pieceMovement.initialisefindPath(pieceMovement.movementArray.start.row, pieceMovement.movementArray.start.col);
            }
            // Redraw active tile layer after activation to show activated tiles
            gameBoard.drawActiveTiles();

            // -------------- DECIDING MOVE (equivalent of END of move) -----------------
            // Deciding move for damaged ships at sea (damageStatus is set to 0 after battle loss)
            if (pieceMovement.movementArray.start.pieces.damageStatus == 0) {
                if(workFlow == 1) {console.log('Damaged ship - decide move: '+ (Date.now() - launchTime)); }

                computer.targetHarbour = pirates.findTarget('All', 'harbour');
                if(workFlow == 1) {console.log('targetHarbour', computer.targetHarbour);}
                computer.telescopeHarbour = pirates.useTelescope('All', 'harbour', maxMove);
                if(workFlow == 1) {console.log('telescopeHarbour', computer.telescopeHarbour);}

                if (computer.targetHarbour.length > 0) {
                    // 1 - Move to safe harbour within wind range
                    if(workFlow == 1) {console.log('Move to safe harbour within wind range: ' + (Date.now() - launchTime)); }
                    computer.targetHarbour = pirates.minArray(computer.targetHarbour, 'distance');
                    computer.targetHarbour = pirates.minArray(computer.targetHarbour, 'moveCost');
                    if(workFlow == 1) {console.log('targetCargo - min', computer.targetHarbour);}
                    // Attacks targetable Transports if in range (currently just uses first Transport in array - to improve in future)
                    // Keep - useful for debugging - console.log('found target: ' + pirates.targetCargo[0].row + ' ' + pirates.targetCargo[0].col);
                    lastTile = pirates.findLastActive(pieceMovement.findPath[computer.targetHarbour[0].row][computer.targetHarbour[0].col].path, 0);
                    computer.computerShipsTurn[computer.computerShipsTurnCount].end.row = pieceMovement.findPath[computer.targetHarbour[0].row][computer.targetHarbour[0].col].path[lastTile].fromRow;
                    computer.computerShipsTurn[computer.computerShipsTurnCount].end.col = pieceMovement.findPath[computer.targetHarbour[0].row][computer.targetHarbour[0].col].path[lastTile].fromCol;
                } else if (computer.telescopeHarbour.length > 0) {
                    // 2 - Search for nearest safe Harbour outside wind range
                    if(workFlow == 1) {console.log('Move towards safe harbour outside wind range: ' + (Date.now() - launchTime)); }
                    // Finds safe harbours within the findPath then cuts down array based on minimum distance and move cost
                    computer.telescopeHarbour = pirates.minArray(computer.telescopeHarbour, 'distance');
                    computer.telescopeHarbour = pirates.minArray(computer.telescopeHarbour, 'moveCost');
                    if(workFlow == 1) {console.log('telescopeHarbour - min', computer.telescopeHarbour);}
                    lastTile = pirates.findLastActive(pieceMovement.findPath[computer.telescopeHarbour[0].row][computer.telescopeHarbour[0].col].path, 0);
                    computer.computerShipsTurn[computer.computerShipsTurnCount].end.row = pieceMovement.findPath[computer.telescopeHarbour[0].row][computer.telescopeHarbour[0].col].path[lastTile].fromRow;
                    computer.computerShipsTurn[computer.computerShipsTurnCount].end.col = pieceMovement.findPath[computer.telescopeHarbour[0].row][computer.telescopeHarbour[0].col].path[lastTile].fromCol;
                } else {
                    // 3 - Moves towards home - should almost never be called
                    if(workFlow == 1) {console.log('Moves towards home: ' + (Date.now() - launchTime)); }
                    lastTile = pirates.findLastActive(pieceMovement.findPath[computer.computerShipsTurn[computer.computerShipsTurnCount].manifest.homeRow][computer.computerShipsTurn[computer.computerShipsTurnCount].manifest.homeCol].path, 0);
                    computer.computerShipsTurn[computer.computerShipsTurnCount].end.row = pieceMovement.findPath[computer.computerShipsTurn[computer.computerShipsTurnCount].manifest.homeRow][computer.computerShipsTurn[computer.computerShipsTurnCount].manifest.homeCol].path[lastTile].fromRow;
                    computer.computerShipsTurn[computer.computerShipsTurnCount].end.col = pieceMovement.findPath[computer.computerShipsTurn[computer.computerShipsTurnCount].manifest.homeRow][computer.computerShipsTurn[computer.computerShipsTurnCount].manifest.homeCol].path[lastTile].fromCol;
                }

            // Deciding move for undamaged ships (damageStatus is 5 for healthy ships)
            } else if (pieceMovement.movementArray.start.pieces.damageStatus == 5) {
                if(workFlow == 1) {console.log('Good ship - decide move: '+ (Date.now() - launchTime)); }
                // Move maximum distance at minimum wind cost
                if(workFlow == 1) {console.log('Finds max distance move at minimum cost: ' + (Date.now() - launchTime)); }
                computer.maxDistanceTiles = pirates.maxPathDistance();
                computer.minCostTiles = pirates.minArray(computer.maxDistanceTiles, 'moveCost');
                computer.computerShipsTurn[computer.computerShipsTurnCount].end.row = computer.minCostTiles[0].row;
                computer.computerShipsTurn[computer.computerShipsTurnCount].end.col = computer.minCostTiles[0].col;

            // Catching move for ships under repair (damageStatus between 0 and 5)
            } else {
                // No action currently necessary - included for future development
            }

            // -------------- GRAPHICS / TRANSITION OF MOVE  -----------------
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
        if(workFlow == 1) {console.log(this.computerShipsAll);}
    },


// LAST BRACKET OF OBJECT
}
