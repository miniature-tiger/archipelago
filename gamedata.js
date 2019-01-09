// Object to define all the main game properities
// --------------------------------------------------------------------------------
const gameData = {

    // Game board definition - edit this array to change elements of initial game board
    // --------------------------------------------------------------------------------
    gameBoardDef: {
        //no. board rows (row), no. board columns (col), board shape,
        //no. tiles set as invisible if octagon (octagonCorner), percentage of tiles randomly set as islands (randomIslandPercentage)
        rows: 31, cols: 31, boardShape: 'octagon', octagonCorner: 10, randomIslandPercentage: 0.005,
        //Position of player bases with forts
        playerIslands:  [ {row: 15, col: 0, category: 'Settlements', type: 'fort', direction: '90', team: 'Blue'},
                          {row: 15, col: 30, category: 'Settlements', type: 'fort', direction: '270', team: 'Orange'},
                          {row: 0, col: 15, category: 'Settlements', type: 'fort', direction: '180', team: 'Red'},
                          {row: 30, col: 15, category: 'Settlements', type: 'fort', direction: '0', team: 'Green'}
                        ],
        kingdomIslands: [ {row: 9, col: 9, category: 'Settlements', type: 'fort', direction: '0', team: 'Kingdom', ref: 'Narwhal'},
                          {row: 9, col: 21, category: 'Settlements', type: 'fort', direction: '0', team: 'Kingdom', ref: 'Needlefish'},
                          {row: 15, col: 15, category: 'Settlements', type: 'fort', direction: '0', team: 'Kingdom', ref: 'Central'},
                          {row: 21, col: 9, category: 'Settlements', type: 'fort', direction: '0', team: 'Kingdom', ref: 'Swordfish'},
                          {row: 21, col: 21, category: 'Settlements', type: 'fort', direction: '0', team: 'Kingdom', ref: 'Seahorse'}
                        ],
        playerShips:    [ {row: 16, col: 0, category: 'Transport', type: 'catamaran', direction: '90', team: 'Blue', ref: 'none'},
                          {row: 14, col: 30, category: 'Transport', type: 'catamaran', direction: '270', team: 'Orange', ref: 'none'},
                          {row: 0, col: 14, category: 'Transport', type: 'catamaran', direction: '180', team: 'Red', ref: 'none'},
                          {row: 30, col: 16, category: 'Transport', type: 'catamaran', direction: '0', team: 'Green', ref: 'none'}
                        ],
        pirateShips:    [ {row: 5, col: 5, category: 'Transport', type: 'warship', direction: '135', team: 'Pirate', ref: 0},
                          {row: 5, col: 25, category: 'Transport', type: 'warship', direction: '225', team: 'Pirate', ref: 1},
                          {row: 25, col: 5, category: 'Transport', type: 'warship', direction: '45', team: 'Pirate', ref: 2},
                          {row: 25, col: 25, category: 'Transport', type: 'warship', direction: '315', team: 'Pirate', ref: 3},
                        ],
        //Undiscovered islands
        blankIslands: [ [10,2], [20,2], [2,10], [28,10], [2,20], [28,20], [10,28], [20,28],       // outer circle of islands
                        [4,6], [6,4], [4,24], [6,26], [24,4], [26,6], [24,26], [26,24],   // outer circle around pirates
                        [15,19], [15,11], [19,15], [11,15], [12,12], [18,12], [12,18], [18,18],   // inner circle of islands
                        [6,14], [6,15], [6,16], [14,6], [15,6], [16,6], [14,24], [15,24], [16,24], [24,14], [24,15], [24,16], // long islands
                      ]
    },

    // Array to hold list of all piece types
    // -------------------------------------
    // Pieces must be added in the order: Settlements, Transport, Resources
    pieceTypes: {
                  fort: {type: 'fort', name: 'fort', category: 'Settlements', maxNo: 1, goods: 'none', maxProduction: 0, maxMove: 0, maxHold: 20, battlePerc: 0, deckNumber: 0},
                  catamaran: {type: 'catamaran', name: 'catamaran', category: 'Transport', maxNo: 1, goods: 'none', maxProduction: 0, maxMove: 6, maxHold: 5, battlePerc: 0.2, deckNumber: 0},
                  warship: {type: 'warship', name: 'warship', category: 'Transport', maxNo: 1, goods: 'none', maxProduction: 0, maxMove: 5, maxHold: 10, battlePerc: 0.4, deckNumber: 0},
                  cargoship: {type: 'cargoship', name: 'cargo ship', category: 'Transport', maxNo: 1, goods: 'none', maxProduction: 0, maxMove: 4, maxHold: 20, battlePerc: 0.6, deckNumber: 0},
                  forest: {type: 'forest', name: 'forest', category: 'Resources', maxNo: 1, goods: 'wood', maxProduction: 2, maxMove: 0, maxHold: 20, battlePerc: 0, deckNumber: 4},
                  ironworks: {type: 'ironworks', name: 'ironworks', category: 'Resources', maxNo: 1, goods: 'iron', maxProduction: 2, maxMove: 0, maxHold: 20, battlePerc: 0, deckNumber: 4},
                  quarry: {type: 'quarry', name: 'quarry', category: 'Resources', maxNo: 1, goods: 'stone', maxProduction: 2, maxMove: 0, maxHold: 20, battlePerc: 0, deckNumber: 4},
                  plantation: {type: 'plantation', name: 'plantation', category: 'Resources', maxNo: 1, goods: 'coffee', maxProduction: 2, maxMove: 0, maxHold: 20, battlePerc: 0, deckNumber: 4},
                  flax: {type: 'flax', name: 'flax', category: 'Resources', maxNo: 1, goods: 'cloth', maxProduction: 2, maxMove: 0, maxHold: 20, battlePerc: 0, deckNumber: 4},
                  clay: {type: 'clay', name: 'clay', category: 'Resources', maxNo: 1, goods: 'pottery', maxProduction: 2, maxMove: 0, maxHold: 20, battlePerc: 0, deckNumber: 4},
                  desert: {type: 'desert', name: 'desert', category: 'Resources', goods: 'none'},
    },

    // Future update: set up based on user inputs for player names
    playerListing: {
                        Green: {type: 'computer', status: 'competing'},
                        Blue: {type: 'human', status: 'competing'},
                        Red: {type: 'computer', status: 'competing'},
                        Orange: {type: 'computer', status: 'competing'},
                    },
}
