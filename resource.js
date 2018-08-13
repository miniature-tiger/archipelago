// Resource object - methods to determine resource tiles on board and production of each team
// -------------------------------------------------------------------------------------------

let resourceManagement = {

    // Array of resource piece types filtered from stockDashboard.pieceTypes
    // ---------------------------------------------------------------------
    resourcePieces: [],

    // Array of resource cards from which undiscovered land tiles are drawn on landDiscovery
    // -------------------------------------------------------------------------------------
    resourceDeck: [],

    // Method to populate resource pieces array and resource deck array at start of game
    // ---------------------------------------------------------------------------------
    populateResourceDeck: function() {
        // Also populate resourcePieces
        this.resourcePieces = stockDashboard.pieceTypes.filter(piece => piece.category == 'Resources');

        // finds total number of unoccupied land tiles on board at start
        let unoccupiedIslands = this.countIslands();
        // sets number of each type of resource in deck and remainder are empty land
        let unDesertCount = 0;

        for (var i = 0; i < stockDashboard.pieceTypes.length; i++) {
            if (stockDashboard.pieceTypes[i].category == 'Resources') {
                for (var j = 0; j < stockDashboard.pieceTypes[i].deckNumber; j++) {
                    if (j==0) {
                        this.resourceDeck.push({type: stockDashboard.pieceTypes[i].type, goods: stockDashboard.pieceTypes[i].goods, production: stockDashboard.pieceTypes[i].maxProduction});
                    } else {
                        this.resourceDeck.push({type: stockDashboard.pieceTypes[i].type, goods: stockDashboard.pieceTypes[i].goods, production: 1});
                        //this.resourceDeck.push({type: stockDashboard.pieceTypes[i].type, goods: stockDashboard.pieceTypes[i].goods, production: (Math.floor(Math.random() * (stockDashboard.pieceTypes[i].maxProduction)) + 1)});
                    }
                    unDesertCount += 1;
                }
            }
        }

        let numberDesert = unoccupiedIslands - unDesertCount;

        for (var j = 0; j < numberDesert; j++) {
            this.resourceDeck.push({type: 'desert', goods: 'none'});
        }
    },

    // Method to find total number of unoccupied land tiles on board at start
    // ----------------------------------------------------------------------
    countIslands: function() {
        counter = 0;
        for (var i = 0; i < gameBoard.boardArray.length; i++) {
            for (var j = 0; j < gameBoard.boardArray[i].length; j++) {
                if(gameBoard.boardArray[i][j].terrain == 'land' && !gameBoard.boardArray[i][j].pieces.populatedSquare) {
                    counter += 1;
                }
            }
        }
        return counter;
    },

    // Method which picks card from resource deck at random and deletes that card from the array
    // -----------------------------------------------------------------------------------------
    pickFromResourceDeck: function() {
        let cardNumber = Math.floor((Math.random() * this.resourceDeck.length));
        let cardType = this.resourceDeck[cardNumber];
        this.resourceDeck.splice(cardNumber,1);
        return(cardType);
    },

    // Method to claim resource tile - used by both human and computer opponent game logic
    // -----------------------------------------------------------------------------------
    claimResource: function(localRow, localCol, localTeam) {
        // Calculate placement on board of resource tile to be altered and remove it
        let IDPiece = 'tile' + Number(localRow*1000 + localCol);
        document.getElementById(IDPiece).remove();
        // Change board array and add new SVG piece with team colour
        gameBoard.boardArray[localRow][localCol].pieces.team = localTeam;
        boardMarkNode.appendChild(gameBoard.createActionTile(localRow, localCol, gameBoard.boardArray[localRow][localCol].pieces.type, localTeam,
          'tile' + Number(localRow*1000 + localCol), boardSurround + tileBorder/2 + (gridSize + tileBorder * 2) * localRow, boardSurround + tileBorder/2 + (gridSize + tileBorder * 2) * localCol, 1, gameBoard.boardArray[localRow][localCol].pieces.direction));
        // Update score as necessary
        gameScore.workScores('Exploring', localTeam, gameBoard.boardArray[localRow][localCol].pieces.type);
    },

// LAST BRACKET OF OBJECT
}
