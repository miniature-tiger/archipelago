// Resource object - methods to determine resource tiles on board and production of each team
// -------------------------------------------------------------------------------------------

let resourceManagement = {

    // Array of resource cards from which undiscovered land tiles are drawn on landDiscovery
    // -------------------------------------------------------------------------------------
    resourceDeck: [],

    // Method to populate resource pieces array and resource deck array at start of game
    // ---------------------------------------------------------------------------------
    populateResourceDeck: function() {
        // finds total number of unoccupied land tiles on board at start
        let unoccupiedIslands = this.countIslands();
        // sets number of each type of resource in deck and remainder are empty land
        let unDesertCount = 0;

        for (let pieceType of Object.keys(gameData.pieceTypes)) {
            let piece = gameData.pieceTypes[pieceType];
            if (piece.category === 'Resources' && pieceType != 'desert') {
                for (let i = 0; i < piece.deckNumber; i+=1) {
                    if (i===0) {
                        // for first card of each resource type give maximum resource production
                        this.resourceDeck.push({type: pieceType, goods: piece.goods, production: piece.maxProduction});
                    } else {
                        this.resourceDeck.push({type: pieceType, goods: piece.goods, production: 1});
                        //this.resourceDeck.push({type: stockDashboard.pieceTypes[i].type, goods: stockDashboard.pieceTypes[i].goods, production: (Math.floor(Math.random() * (stockDashboard.pieceTypes[i].maxProduction)) + 1)});
                    }
                    unDesertCount += 1;
                }
            }
        };

        let numberDesert = unoccupiedIslands - unDesertCount;

        for (let j = 0; j < numberDesert; j+=1) {
            this.resourceDeck.push({type: 'desert', goods: 'none', production: 0});
        }
    },

    // Method to find total number of unoccupied land tiles on board at start
    // ----------------------------------------------------------------------
    countIslands: function() {
        counter = 0;
        for (var i = 0; i < game.boardArray.length; i++) {
            for (var j = 0; j < game.boardArray[i].length; j++) {
                if(game.boardArray[i][j].tile.terrain == 'land' && !game.boardArray[i][j].piece.populatedSquare) {
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
