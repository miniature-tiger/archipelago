// Resource object - methods to determine resource tiles on board and production of each team
// -------------------------------------------------------------------------------------------

let resourceManagement = {

  // Array of resource cards from which undiscovered land tiles are drawn on landDiscovery
  // -------------------------------------------------------------------------------------
  resourceDeck: [],

  // Method to populate resource deck at start of game
  // -------------------------------------------------
  populateResourceDeck: function() {
      // finds total number of unoccupied land tiles on board at start
      let unoccupiedIslands = this.countIslands();
      // sets number of each type of resource in deck and remainder are empty land
      let numberIronworks = 20;
      let numberForest = 20;
      let numberEmpty = unoccupiedIslands - numberIronworks - numberForest;

      // populates deck based on above numbers
      for (var i = 0; i < numberForest; i++) {
          this.resourceDeck.push('forest');
      }
      for (var j = 0; j < numberForest; j++) {
          this.resourceDeck.push('ironworks');
      }
      for (var k = 0; k < numberEmpty; k++) {
          this.resourceDeck.push('emptyLand');
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
  }


// LAST BRACKET OF OBJECT
}
