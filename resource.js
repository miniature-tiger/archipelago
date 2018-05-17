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
                    this.resourceDeck.push({type: stockDashboard.pieceTypes[i].type, goods: stockDashboard.pieceTypes[i].goods});
                    unDesertCount += 1;
                }
            }
        }

        let numberDesert = unoccupiedIslands - unDesertCount;
        console.log(numberDesert);

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

// LAST BRACKET OF OBJECT
}
