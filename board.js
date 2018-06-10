
// Game board object - methods to initialise board and array to store current state of board
let gameBoard = {

    // Array to store current state of board
    // -------------------------------------
    boardArray: [],

    // Method to initialise boardArray
    // -------------------------------
    // Row and col give size of board - boardShape gives shape of board
    populateBoardArray: function(row, col, boardShape) {
        // Blank board array to re-initialise
        this.boardArray = [];

        // Create array of objects - square array of y rows of x tiles
        for (var y = 0; y < col; y++) {
            let rowArray = [];
            for (var x = 0; x < row; x++) {
                // A few random land tiles
                if(Math.random() > 0.995) {
                    rowArray.push({xpos: + x, ypos: + y, terrain: 'land', subTerrain: 'none', activeStatus: 'inactive', pieces: {populatedSquare: false, category: '', type: 'no piece', direction: '', used: 'unused', damageStatus: 5, team: '', goods: 'none', stock: 0, production: 0}});
                // But mainly sea tiles
                } else {
                    rowArray.push({xpos: + x, ypos: + y, terrain: 'sea', subTerrain: 'none', activeStatus: 'inactive', pieces: {populatedSquare: false, category: '', type: 'no piece', direction: '', used: 'unused', damageStatus: 5, team: '', goods: 'none', stock: 0, production: 0}});
                }
            }
        this.boardArray.push(rowArray);
        }

    },

    // Method to overlay islands and bases and pieces
    // ----------------------------------------------
    // Much of this overlay code could be removed and replaced by a fixed array at a later date
    // But currently it is useful to allow the board to be set dynamically in different sizes
    // whilst game play is being developed
    overlayBoardArray: function(row, col, boardShape) {
        let boardCenter = Math.round((row-1)/2);
        let octagonCorner = (row-1)/3;

        // A octagon shaped board is obtained by making triangles of tiles invisible in the corners
        if (boardShape == 'octagon') {
            this.overlayTilesTri(0, 0, octagonCorner, 'TL', 'invis');
            this.overlayTilesTri(0, col-octagonCorner, octagonCorner, 'TR', 'invis');
            this.overlayTilesTri(row-octagonCorner, 0, octagonCorner, 'BL', 'invis');
            this.overlayTilesTri(row-octagonCorner, col-octagonCorner, octagonCorner, 'BR', 'invis');
        }

        // Creation of triangle-shaped islands
        this.overlayTiles((row-1)/3-3, (row-1)/3+1, (col-1)/3-3, (col-1)/3+1, 'sea');
        this.overlayTilesTri((row-1)/3-2, (col-1)/3-2, 3, 'BR', 'land');
        this.boardArray[(row-1)/3][(col-1)/3-1].terrain = 'sea';
        this.boardArray[(row-1)/3-1][(col-1)/3].terrain = 'sea';
        this.boardArray[(row-1)/3][(col-1)/3].pieces = {populatedSquare: true, category: 'Resources', type: 'desert', direction: '0', used: 'unused', damageStatus: 5, team: 'Kingdom', goods: 'none', stock: 0};
        this.boardArray[(row-1)/3-2][(col-1)/3].pieces = {populatedSquare: true, category: 'Resources', type: 'desert', direction: '0', used: 'unused', damageStatus: 5, team: 'Kingdom', goods: 'none', stock: 0};
        this.boardArray[(row-1)/3][(col-1)/3-2].pieces = {populatedSquare: true, category: 'Resources', type: 'desert', direction: '0', used: 'unused', damageStatus: 5, team: 'Kingdom', goods: 'none', stock: 0};

        this.overlayTiles(2*((row-1)/3)-1, 2*((row-1)/3)+3, 2*((col-1)/3)-1, 2*((col-1)/3)+3, 'sea');
        this.overlayTilesTri(2*((row-1)/3), 2*((col-1)/3), 3, 'TL', 'land');
        this.boardArray[2*((row-1)/3)+1][2*((col-1)/3)].terrain = 'sea';
        this.boardArray[2*((row-1)/3)][2*((col-1)/3)+1].terrain = 'sea';
        this.boardArray[2*((row-1)/3)][2*((col-1)/3)].pieces = {populatedSquare: true, category: 'Resources', type: 'desert', direction: '0', used: 'unused', damageStatus: 5, team: 'Kingdom', goods: 'none', stock: 0};
        this.boardArray[2*((row-1)/3)+2][2*((col-1)/3)].pieces = {populatedSquare: true, category: 'Resources', type: 'desert', direction: '0', used: 'unused', damageStatus: 5, team: 'Kingdom', goods: 'none', stock: 0};
        this.boardArray[2*((row-1)/3)][2*((col-1)/3)+2].pieces = {populatedSquare: true, category: 'Resources', type: 'desert', direction: '0', used: 'unused', damageStatus: 5, team: 'Kingdom', goods: 'none', stock: 0};

        this.overlayTiles((row-1)/3-3, (row-1)/3+1, 2*((col-1)/3)-1, 2*((col-1)/3)+3, 'sea');
        this.overlayTilesTri((row-1)/3-2, 2*((row-1)/3), 3, 'BL', 'land');
        this.boardArray[(row-1)/3-1][2*((col-1)/3)].terrain = 'sea';
        this.boardArray[(row-1)/3][2*((col-1)/3)+1].terrain = 'sea';
        this.boardArray[(row-1)/3-2][2*((row-1)/3)].pieces = {populatedSquare: true, category: 'Resources', type: 'desert', direction: '0', used: 'unused', damageStatus: 5, team: 'Kingdom', goods: 'none', stock: 0};
        this.boardArray[(row-1)/3][2*((row-1)/3)].pieces = {populatedSquare: true, category: 'Resources', type: 'desert', direction: '0', used: 'unused', damageStatus: 5, team: 'Kingdom', goods: 'none', stock: 0};
        this.boardArray[(row-1)/3][2*((row-1)/3)+2].pieces = {populatedSquare: true, category: 'Resources', type: 'desert', direction: '0', used: 'unused', damageStatus: 5, team: 'Kingdom', goods: 'none', stock: 0};

        this.overlayTiles(2*((row-1)/3)-1, 2*((row-1)/3)+3, (row-1)/3-3, (row-1)/3+1, 'sea');
        this.overlayTilesTri(2*((row-1)/3), (row-1)/3-2, 3, 'TR', 'land');
        this.boardArray[2*((row-1)/3)][(row-1)/3-1].terrain = 'sea';
        this.boardArray[2*((row-1)/3)+1][(row-1)/3].terrain = 'sea';
        this.boardArray[2*((row-1)/3)][(row-1)/3-2].pieces = {populatedSquare: true, category: 'Resources', type: 'desert', direction: '0', used: 'unused', damageStatus: 5, team: 'Kingdom', goods: 'none', stock: 0};
        this.boardArray[2*((row-1)/3)][(row-1)/3].pieces = {populatedSquare: true, category: 'Resources', type: 'desert', direction: '0', used: 'unused', damageStatus: 5, team: 'Kingdom', goods: 'none', stock: 0};
        this.boardArray[2*((row-1)/3)+2][(row-1)/3].pieces = {populatedSquare: true, category: 'Resources', type: 'desert', direction: '0', used: 'unused', damageStatus: 5, team: 'Kingdom', goods: 'none', stock: 0};

        // Creation of outlying islands
        this.boardArray[(row-1)/3][2].terrain = 'land';
        this.boardArray[2][(col-1)/3].terrain = 'land';
        this.boardArray[4][6].terrain = 'land';
        this.boardArray[6][4].terrain = 'land';
        this.boardArray[5][6].terrain = 'sea';
        this.boardArray[6][5].terrain = 'sea';


        this.boardArray[row-3][2*((col-1)/3)].terrain = 'land';
        this.boardArray[2*((row-1)/3)][col-3].terrain = 'land';
        this.boardArray[row-7][col-5].terrain = 'land';
        this.boardArray[row-5][col-7].terrain = 'land';
        this.boardArray[row-6][col-7].terrain = 'sea';
        this.boardArray[row-7][col-6].terrain = 'sea';

        this.boardArray[2][2*((col-1)/3)].terrain = 'land';
        this.boardArray[(row-1)/3][col-3].terrain = 'land';
        this.boardArray[row-7][4].terrain = 'land';
        this.boardArray[row-7][5].terrain = 'sea';
        this.boardArray[row-5][6].terrain = 'land';
        this.boardArray[row-6][6].terrain = 'sea';

        this.boardArray[2*((row-1)/3)][2].terrain = 'land';
        this.boardArray[row-3][(col-1)/3].terrain = 'land';
        this.boardArray[4][col-7].terrain = 'land';
        this.boardArray[6][col-5].terrain = 'land';
        this.boardArray[6][col-6].terrain = 'sea';
        this.boardArray[5][col-7].terrain = 'sea';

        // Creation of central volcanic shaped island for trading post
        this.overlayTiles(boardCenter-1, boardCenter+1, boardCenter-1, boardCenter+1, 'land');
        this.boardArray[boardCenter-1][boardCenter+1].terrain = 'sea';
        this.boardArray[boardCenter-1][boardCenter-1].terrain = 'sea';
        this.boardArray[boardCenter+1][boardCenter+1].terrain = 'sea';
        this.boardArray[boardCenter+1][boardCenter-1].terrain = 'sea';

        // Inner circle of islands
        this.boardArray[boardCenter][boardCenter+4].terrain = 'land';
        this.boardArray[boardCenter][boardCenter-4].terrain = 'land';
        this.boardArray[boardCenter+4][boardCenter].terrain = 'land';
        this.boardArray[boardCenter-4][boardCenter].terrain = 'land';
        this.boardArray[boardCenter-3][boardCenter-3].terrain = 'land';
        this.boardArray[boardCenter+3][boardCenter+3].terrain = 'land';
        this.boardArray[boardCenter-3][boardCenter+3].terrain = 'land';
        this.boardArray[boardCenter+3][boardCenter-3].terrain = 'land';

        // Creation of bay shaped islands
        this.overlayTiles(boardCenter-1, boardCenter+1, 2*((row-1)/3)+4, 2*((row-1)/3)+4, 'land');
        //this.overlayTiles(boardCenter-1, boardCenter+1, 2*((row-1)/3)+3, 2*((row-1)/3)+4, 'land');
        //this.boardArray[boardCenter][2*((row-1)/3)+3].terrain = 'sea';

        this.overlayTiles(boardCenter-1, boardCenter+1, (row-1)/3-4, (row-1)/3-4, 'land');
        //this.overlayTiles(boardCenter-1, boardCenter+1, (row-1)/3-4, (row-1)/3-3, 'land');
        //this.boardArray[boardCenter][(row-1)/3-3].terrain = 'sea';

        this.overlayTiles(2*((row-1)/3)+4, 2*((row-1)/3)+4, boardCenter-1, boardCenter+1, 'land');
        //this.overlayTiles(2*((row-1)/3)+3, 2*((row-1)/3)+4, boardCenter-1, boardCenter+1, 'land');
        //this.boardArray[2*((row-1)/3)+3][boardCenter].terrain = 'sea';

        this.overlayTiles((row-1)/3-4, (row-1)/3-4, boardCenter-1, boardCenter+1, 'land');
        //this.overlayTiles((row-1)/3-4, (row-1)/3-3, boardCenter-1, boardCenter+1, 'land');
        //this.boardArray[(row-1)/3-3][boardCenter].terrain = 'sea';


        // Creation of land around bases
        this.overlayTiles(row-3, row-1, boardCenter-2, boardCenter+2, 'sea');
        this.overlayTiles(row-1, row-1, boardCenter, boardCenter, 'land');

        this.overlayTiles(0, 2, boardCenter-2, boardCenter+2, 'sea');
        this.overlayTiles(0, 0, boardCenter, boardCenter, 'land');

        this.overlayTiles(boardCenter-2, boardCenter+2, col-3, col-1, 'sea');
        this.overlayTiles(boardCenter, boardCenter, col-1, col-1, 'land');

        this.overlayTiles(boardCenter-2, boardCenter+2, 0, 2, 'sea');
        this.overlayTiles(boardCenter, boardCenter, 0, 0, 'land');


        // Creation of forts
        this.boardArray[boardCenter][col-1].pieces = {populatedSquare: true, category: 'Settlements', type: 'fort', direction: '270', used: 'unused', damageStatus: 5, team: 'Orange Team', goods: 'none', stock: 0, production: 0};
        this.boardArray[0][boardCenter].pieces = {populatedSquare: true, category: 'Settlements', type: 'fort', direction: '180', used: 'unused', damageStatus: 5, team: 'Red Team', goods: 'none', stock: 0, production: 0};
        this.boardArray[row-1][boardCenter].pieces = {populatedSquare: true, category: 'Settlements', type: 'fort', direction: '0', used: 'unused', damageStatus: 5, team: 'Green Team', goods: 'none', stock: 0, production: 0};
        this.boardArray[boardCenter][0].pieces = {populatedSquare: true, category: 'Settlements', type: 'fort', direction: '90', used: 'unused', damageStatus: 5, team: 'Blue Team', goods: 'none', stock: 0, production: 0};


        // Creation of Kingdom forts
        this.boardArray[boardCenter][boardCenter].pieces = {populatedSquare: true, category: 'Settlements', type: 'fort', direction: '0', used: 'unused', damageStatus: 5, team: 'Kingdom', goods: 'none', stock: 0, production: 0};
        this.boardArray[9][9].pieces = {populatedSquare: true, category: 'Settlements', type: 'fort', direction: '0', used: 'unused', damageStatus: 5, team: 'Kingdom', goods: 'none', stock: 0, production: 0};
        tradeContracts.contractsArray[0].row = 9;
        tradeContracts.contractsArray[0].col = 9;
        this.boardArray[9][col-10].pieces = {populatedSquare: true, category: 'Settlements', type: 'fort', direction: '0', used: 'unused', damageStatus: 5, team: 'Kingdom', goods: 'none', stock: 0, production: 0};
        tradeContracts.contractsArray[1].row = 9;
        tradeContracts.contractsArray[1].col = col-10;
        this.boardArray[row-10][9].pieces = {populatedSquare: true, category: 'Settlements', type: 'fort', direction: '0', used: 'unused', damageStatus: 5, team: 'Kingdom', goods: 'none', stock: 0, production: 0};
        tradeContracts.contractsArray[3].row = row-10;
        tradeContracts.contractsArray[3].col = 9;
        this.boardArray[row-10][col-10].pieces = {populatedSquare: true, category: 'Settlements', type: 'fort', direction: '0', used: 'unused', damageStatus: 5, team: 'Kingdom', goods: 'none', stock: 0, production: 0};
        tradeContracts.contractsArray[2].row = row-10;
        tradeContracts.contractsArray[2].col = col-10;


        // Creation of ships
        this.boardArray[boardCenter-1][col-1].pieces = {populatedSquare: true, category: 'Transport', type: 'catamaran', direction: '-90', used: 'unused', damageStatus: 5, team: 'Orange Team', goods: 'none', stock: 0, production: 0, homeRow: boardCenter-1, homeCol: col-1};
        //this.boardArray[boardCenter+1][col-1].pieces = {populatedSquare: true, category: 'Transport', type: 'cargo ship', direction: '-90', used: 'unused', damageStatus: 5, team: 'Orange Team', goods: 'none', stock: 0, production: 0, homeRow: boardCenter+1, homeCol: col-1};
        this.boardArray[0][boardCenter-1].pieces = {populatedSquare: true, category: 'Transport', type: 'catamaran', direction: '180', used: 'unused', damageStatus: 5, team: 'Red Team', goods: 'none', stock: 0, production: 0, homeRow: 0, homeCol: boardCenter-1};
        //this.boardArray[0][boardCenter+1].pieces = {populatedSquare: true, category: 'Transport', type: 'cargo ship', direction: '180', used: 'unused', damageStatus: 5, team: 'Red Team', goods: 'none', stock: 0, production: 0, homeRow: 0, homeCol: boardCenter+1};
        //this.boardArray[row-1][boardCenter-1].pieces = {populatedSquare: true, category: 'Transport', type: 'cargo ship', direction: '0', used: 'unused', damageStatus: 5, team: 'Green Team', goods: 'none', stock: 0, production: 0, homeRow: row-1, homeCol: boardCenter-1};
        this.boardArray[row-1][boardCenter+1].pieces = {populatedSquare: true, category: 'Transport', type: 'catamaran', direction: '0', used: 'unused', damageStatus: 5, team: 'Green Team', goods: 'none', stock: 0, production: 0, homeRow: row-1, homeCol: boardCenter+1};
        //this.boardArray[row-2][boardCenter].pieces = {populatedSquare: true, category: 'Transport', type: 'warship', direction: '0', used: 'unused', damageStatus: 5, team: 'Green Team', goods: 'none', stock: 0, production: 0, homeRow: row-1, homeCol: boardCenter+1};
        //this.boardArray[boardCenter-1][0].pieces = {populatedSquare: true, category: 'Transport', type: 'cargo ship', direction: '90', used: 'unused', damageStatus: 5, team: 'Blue Team', goods: 'none', stock: 0, production: 0, homeRow: boardCenter-1, homeCol: 0};
        this.boardArray[boardCenter+1][0].pieces = {populatedSquare: true, category: 'Transport', type: 'catamaran', direction: '90', used: 'unused', damageStatus: 5, team: 'Blue Team', goods: 'none', stock: 0, production: 0, homeRow: boardCenter+1, homeCol: 0};

        // Creation of pirate ships and pirate harbours
        this.boardArray[5][5] = {xpos: 5, ypos: 5, terrain: 'sea', subTerrain: 'pirateHarbour', activeStatus: 'inactive', pieces: {populatedSquare: true, category: 'Transport', type: 'warship', direction: '135', used: 'unused', damageStatus: 5, team: 'Pirate', goods: 'none', stock: 0, ref: 0}};
        //this.boardArray[4][6].terrain = 'sea';
        //this.boardArray[4][6].pieces = {populatedSquare: true, category: 'Transport', type: 'cargo ship', direction: '135', used: 'unused', damageStatus: 5, team: 'Pirate', goods: 'none', stock: 0};

        this.boardArray[row-6][5] = {xpos: row-6, ypos: 5, terrain: 'sea', subTerrain: 'pirateHarbour', activeStatus: 'inactive', pieces: {populatedSquare: true, category: 'Transport', type: 'warship', direction: '45', used: 'unused', damageStatus: 5, team: 'Pirate', goods: 'none', stock: 0, ref: 1}};
        //this.boardArray[row-7][4].terrain = 'sea';
        //this.boardArray[row-7][4].pieces = {populatedSquare: true, category: 'Transport', type: 'cargo ship', direction: '45', used: 'unused', damageStatus: 5, team: 'Pirate', goods: 'none', stock: 0};

        this.boardArray[row-6][col-6] = {xpos: row-5, ypos: col-7, terrain: 'sea', subTerrain: 'pirateHarbour', activeStatus: 'inactive', pieces: {populatedSquare: true, category: 'Transport', type: 'warship', direction: '-45', used: 'unused', damageStatus: 5, team: 'Pirate', goods: 'none', stock: 0, ref: 2}};
        //this.boardArray[row-5][col-7].terrain = 'sea';
        //this.boardArray[row-5][col-7].pieces = {populatedSquare: true, category: 'Transport', type: 'cargo ship', direction: '-45', used: 'unused', damageStatus: 5, team: 'Pirate', goods: 'none', stock: 0};

        this.boardArray[5][col-6] = {xpos: 6, ypos: col-5, terrain: 'sea', subTerrain: 'pirateHarbour', activeStatus: 'inactive', pieces: {populatedSquare: true, category: 'Transport', type: 'warship', direction: '-135', used: 'unused', damageStatus: 5, team: 'Pirate', goods: 'none', stock: 0, ref: 3}};
        //this.boardArray[6][col-5].terrain = 'sea';
        //this.boardArray[6][col-5].pieces = {populatedSquare: true, category: 'Transport', type: 'cargo ship', direction: '-135', used: 'unused', damageStatus: 5, team: 'Pirate', goods: 'none', stock: 0};

        // Creation of forests
        this.boardArray[boardCenter-1][boardCenter].pieces = {populatedSquare: true, category: 'Resources', type: 'forest', direction: '0', used: 'unused', damageStatus: 5, team: 'Kingdom', goods: 'wood', stock: 0, production: 2};

        // Creation of ironworks
        this.boardArray[boardCenter+1][boardCenter].pieces = {populatedSquare: true, category: 'Resources', type: 'ironworks', direction: '0', used: 'unused', damageStatus: 5, team: 'Kingdom', goods: 'iron', stock: 0, production: 2};

        // Creation of quarry
        this.boardArray[boardCenter][boardCenter-1].pieces = {populatedSquare: true, category: 'Resources', type: 'quarry', direction: '0', used: 'unused', damageStatus: 5, team: 'Kingdom', goods: 'stone', stock: 0, production: 2};

        // Creation of plantation
        this.boardArray[boardCenter][boardCenter+1].pieces = {populatedSquare: true, category: 'Resources', type: 'plantation', direction: '0', used: 'unused', damageStatus: 5, team: 'Kingdom', goods: 'coffee', stock: 0, production: 2};

        // TEST AREA

    /*
        // Flax
        //this.boardArray[row-3][boardCenter] = {xpos: row-3, ypos: boardCenter, terrain: 'land', subTerrain: 'none', activeStatus: 'inactive', pieces: {populatedSquare: true, category: 'Resources', type: 'flax', direction: '0', used: 'unused', damageStatus: 5, team: 'Unclaimed', goods: 'cloth', stock: 18, production: 1}};

        // Battle Royale
        this.boardArray[row-4][boardCenter].pieces = {populatedSquare: true, category: 'Transport', type: 'cargo ship', direction: '45', used: 'unused', damageStatus: 5, team: 'Pirate', goods: 'none', stock: 0};
        this.boardArray[row-4][boardCenter + 1].pieces = {populatedSquare: true, category: 'Transport', type: 'cargo ship', direction: '45', used: 'unused', damageStatus: 5, team: 'Pirate', goods: 'none', stock: 0};
        this.boardArray[row-4][boardCenter - 1].pieces = {populatedSquare: true, category: 'Transport', type: 'cargo ship', direction: '45', used: 'unused', damageStatus: 5, team: 'Pirate', goods: 'none', stock: 0};
        this.boardArray[row-5][boardCenter + 1].pieces = {populatedSquare: true, category: 'Transport', type: 'cargo ship', direction: '45', used: 'unused', damageStatus: 5, team: 'Pirate', goods: 'none', stock: 0};
        this.boardArray[row-5][boardCenter].pieces = {populatedSquare: true, category: 'Transport', type: 'cargo ship', direction: '45', used: 'unused', damageStatus: 5, team: 'Pirate', goods: 'none', stock: 0};
        this.boardArray[row-5][boardCenter -1].pieces = {populatedSquare: true, category: 'Transport', type: 'cargo ship', direction: '45', used: 'unused', damageStatus: 5, team: 'Pirate', goods: 'none', stock: 0};
        //*/

    },

    // Method to allocate start tiles to teams
    // ---------------------------------------
    // Order needs to be (1) creation of board (2) Counting of empty tiles and creation of resource deck (3) Allocation of tiles from resource deck to team bases
    allocateStartTiles: function() {
        let boardCenter = Math.round((row-1)/2);

        let allocateArray = [ {i: boardCenter+1, j: col-1, team: 'Orange Team'},
                              {i: 0, j: boardCenter+1, team: 'Red Team'},
                              {i: row-1, j: boardCenter-1, team: 'Green Team'},
                              {i: boardCenter-1, j: 0, team: 'Blue Team'},
                              {i: boardCenter-1, j: col-1, team: 'Orange Team'},
                              {i: 0, j: boardCenter-1, team: 'Red Team'},
                              {i: row-1, j: boardCenter+1, team: 'Green Team'},
                              {i: boardCenter+1, j: 0, team: 'Blue Team'}]

        // function picks a tile form the resource deck and checks player does not already have this Resource allocated
        function completeAllocatedTile(locali, localj, localTeam) {
            stockDashboard.stockTake();
            //keep for debugging -  console.log(stockDashboard.pieceTotals);

            let pieceTotalsTeamPosition = stockDashboard.pieceTotals.findIndex(fI => fI.team == localTeam);
            do {
                var deckCard = resourceManagement.pickFromResourceDeck();
                //keep for debugging - console.log(deckCard.type);
            }
            while (stockDashboard.pieceTotals[pieceTotalsTeamPosition].pieces[deckCard.type].quantity > 0)

            gameBoard.boardArray[locali][localj].pieces = {populatedSquare: true, category: 'Resources', type: deckCard.type, direction: '0', used: 'unused', damageStatus: 5, team: localTeam, goods: deckCard.goods, stock: 0};
        }

        for (var k = 0; k < allocateArray.length; k++) {
            //keep for debugging - console.log(k, allocateArray[k].team);
            completeAllocatedTile(allocateArray[k].i, allocateArray[k].j, allocateArray[k].team)
        }

    },

    // Method to create triangle shaped overlay
    // ----------------------------------------
    // allows specification of size, position and terrain of tiles
    // TR = top right, BL = bottom left (for right angled corner)
    overlayTilesTri: function(startRow, startCol, size, corner, overlayTerrain) {
        for (i = startRow; i < startRow + size; i+=1) {
            if (corner == "TL") {
                for (j = startCol; j < startCol + size - (i - startRow); j+=1) {
                    this.boardArray[i][j].terrain = overlayTerrain;
                  }
            } else if (corner == "BL") {
                for (j = startCol; j < startCol + (i - startRow) + 1; j+=1) {
                    this.boardArray[i][j].terrain = overlayTerrain;
                }
            } else if (corner == 'TR') {
                for (j = startCol + (i - startRow); j < startCol + size; j+=1) {
                    this.boardArray[i][j].terrain = overlayTerrain;
                }
            } else if (corner == 'BR') {
                for (j = startCol + size - (i - startRow) -1; j < startCol + size; j+=1) {
                    this.boardArray[i][j].terrain = overlayTerrain;
                  }
            } else {
                console.log('overlayTilesTri - triangle type not found');
            }
        }
    },

    // Method to create rectangular shaped overlay
    // -------------------------------------------
    // allows specification of size, position and terrain of tiles
    overlayTiles: function(startRow, endRow, startCol, endCol, overlayTerrain) {
        for (i = startRow; i <= endRow; i++) {
            for (j = startCol; j <= endCol; j++) {
                this.boardArray[i][j].terrain = overlayTerrain;
            }
        }
    },

    // Method to create a single tile
    // ------------------------------
    // gridSize is the size of the tile, squareType is the land / sea / base of the tile
    createTile: function(i, j, gridSize) {
        // Creating the tile from three nested divs
        let newTile = document.createElement('div');
        let innerTile = document.createElement('div');
        let rotatedTile = document.createElement('div');

        // Adding an id for each tile - DECIDE IF NECESSARY IN NEXT STAGE
        newTile.id = i*1000 + j;

        // Creating the tile by dynamically allocating CSS classes
        // Tile size is set as a parameter but has functionality to be varied dynamically
        // (e.g. to zoom in or out of board map)
        newTile.setAttribute('class', 'square' + ' ' + this.boardArray[i][j].terrain + ' ' + this.boardArray[i][j].activeStatus);
        newTile.style.height = (gridSize - 2) + 'px';
        newTile.style.width = (gridSize - 2) + 'px';

        rotatedTile.setAttribute('class', 'rotated_square' + ' ' + this.boardArray[i][j].terrain + ' ' + this.boardArray[i][j].activeStatus);
        rotatedTile.style.height = (gridSize - 6) + 'px';
        rotatedTile.style.width = (gridSize - 6) + 'px';

        innerTile.setAttribute('class', 'inner_square' + ' ' + this.boardArray[i][j].terrain + ' ' + this.boardArray[i][j].activeStatus);
        innerTile.style.height = (gridSize - 6) + 'px';
        innerTile.style.width = (gridSize - 6) + 'px';

        newTile.appendChild(rotatedTile);
        rotatedTile.appendChild(innerTile);

        // tile is returned to drawBoard
        return newTile;

    },

    // Method to create a single action tile
    // -------------------------------------
    // tileSize is the size of the tile
    createActionTile: function(locali, localj, localType, localTeam, localID, localTop, localLeft, localScale, localRotation) {

        let viewportSize = 25 * localScale;
        // Create SVG tile of designated height and width
        let actionTile = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        actionTile.setAttribute('width', gridSize + tileBorder);
        actionTile.setAttribute('height', gridSize + tileBorder);

        // Position tile based on coordinates passed from boardArray
        actionTile.style.top = localTop + 'px';
        actionTile.style.left = localLeft + 'px';
        actionTile.style.transform = 'rotate(' + localRotation + 'deg)';

        // Set view size, class and id
        actionTile.setAttribute('viewBox', '0, 0, ' + viewportSize + ' ' + viewportSize);
        actionTile.setAttribute('id', localID);
        //actionTile.setAttribute('transform', 'scale(2)');

        actionTile.setAttribute('class', localType);

        if (localType == 'cargo ship') {
            this.createCargoTile(actionTile, localTeam, 5);
        } else if (localType == 'warship') {
            this.createWarshipTile(actionTile, localTeam, 5);
        } else if (localType == 'catamaran') {
            this.createCatamaranTile(actionTile, localTeam, 5);
        } else if (localType == 'fort') {
            this.createFortTile(actionTile, localTeam);
        } else if (localType == 'forest') {
            this.createForestTile(actionTile, localTeam);
        } else if (localType == 'ironworks') {
            this.createIronworksTile(actionTile, localTeam);
        } else if (localType == 'quarry') {
            this.createQuarryTile(actionTile, localTeam);
        } else if (localType == 'desert') {
            this.createDesertTile(actionTile, localTeam);
        } else if (localType == 'plantation') {
            this.createPlantationTile(actionTile, localTeam);
        } else if (localType == 'flax') {
            this.createFlaxTile(actionTile, localTeam);
        }

        // tile is returned to drawBoard
        return actionTile;
    },

    // Method to create a single goods icon
    // -------------------------------------
    createIcon: function(localID, localScale, localGoods, localLeft, localTop) {
        let viewportSize = 25 * localScale;
        // Create SVG tile of designated height and width
        let goodsIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        goodsIcon.setAttribute('width', gridSize + tileBorder);
        goodsIcon.setAttribute('height', gridSize + tileBorder);
        goodsIcon.style.left = localLeft + 'px';
        goodsIcon.style.top = localTop + 'px';

        // Set view size, class and id
        goodsIcon.setAttribute('viewBox', '0, 0, ' + viewportSize + ' ' + viewportSize);
        goodsIcon.setAttribute('id', localID);
        goodsIcon.setAttribute('class', 'goodsGroup');

        // icon method is selected
        if (localGoods == 'coffee') {
            this.createCoffeeIcon(goodsIcon);
        } else if (localGoods == 'stone') {
              this.createStoneIcon(goodsIcon);
        } else if (localGoods == 'iron') {
            this.createIronIcon(goodsIcon);
        } else if (localGoods == 'wood') {
            this.createWoodIcon(goodsIcon);
        } else if (localGoods == 'cloth') {
            this.createClothIcon(goodsIcon);
        }

        // tile is returned to drawBoard
        return goodsIcon;

    },


    // Method to create cargo tile
    // ---------------------------
    createCargoTile: function(actionTile, localTeam, localDamage) {
        // Removes all elements of SVG for damage / repair building
        while (actionTile.lastChild) {
            actionTile.removeChild(actionTile.lastChild);
        }

        // Cargo ship deck SVG design
        let cargoDeck = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        cargoDeck.setAttribute('class', localTeam + ' team_fill team_stroke');
        cargoDeck.setAttribute('d', 'M 12.5 1 C 8 6.2 7 11.1 7.3 15.6 Q 7.7 20.2 9.25 24 L 15.75 24 Q 17 20.2 17.5 15.6 C 17.8 11.1 16.6 6.2 12.5 1 Z');
        cargoDeck.style.strokeWidth = '1px';
        actionTile.appendChild(cargoDeck);

        if (localDamage >= 2) {
            // Cargo ship mast SVG design
            let cargoMast = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            cargoMast.setAttribute('class', localTeam + ' team_stroke');
            cargoMast.setAttribute('cx', '12.5');
            cargoMast.setAttribute('cy', '12');
            cargoMast.setAttribute('r', '1');
            cargoMast.style.strokeWidth = '1px';
            cargoMast.style.strokeLinecap = 'round';
            actionTile.appendChild(cargoMast);
        }

        if (localDamage >= 3) {
            // Cargo ship mast SVG design
            let cargoMast2 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            cargoMast2.setAttribute('class', localTeam + ' team_stroke');
            cargoMast2.setAttribute('cx', '12.5');
            cargoMast2.setAttribute('cy', '20');
            cargoMast2.setAttribute('r', '1');
            cargoMast2.style.strokeWidth = '1px';
            cargoMast2.style.strokeLinecap = 'round';
            actionTile.appendChild(cargoMast2);
        }

        if (localDamage >= 4) {
            // Cargo ship sail SVG design
            let cargoSail = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            cargoSail.setAttribute('d', 'M 2 11 L 23 11 C 20.5 8.5 16.5 7 12.5 7 C 7.5 7 3.5 8.5 2 11 Z');
            cargoSail.setAttribute('class', localTeam + ' team_stroke');
            cargoSail.setAttribute('fill', 'white');
            cargoSail.style.strokeWidth = '1px';
            actionTile.appendChild(cargoSail);
        }

        if (localDamage >= 5) {
            // Cargo ship sail SVG design
            let cargoSail2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            cargoSail2.setAttribute('d', 'M 2 19 L 23 19 C 20.5 16.5 16.5 15 12.5 15 C 7.5 15 3.5 16.5 2 19 Z');
            cargoSail2.setAttribute('class', localTeam + ' team_stroke');
            cargoSail2.setAttribute('fill', 'white');
            cargoSail2.style.strokeWidth = '1px';
            actionTile.appendChild(cargoSail2);
        }

        return actionTile;
    },


    // Method to create warship tile
    // ---------------------------
    createWarshipTile: function(actionTile, localTeam, localDamage) {
        // Removes all elements of SVG for damage / repair building
        while (actionTile.lastChild) {
            actionTile.removeChild(actionTile.lastChild);
        }

        // Warship deck SVG design
        let warshipDeck = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        warshipDeck.setAttribute('class', localTeam + ' team_fill team_stroke');
        warshipDeck.setAttribute('d', 'M 12.5 1 C 8 6.2 7 11.1 7.3 15.6 Q 7.7 20.2 9.25 24 L 15.75 24 Q 17 20.2 17.5 15.6 C 17.8 11.1 16.6 6.2 12.5 1 Z');
        warshipDeck.style.strokeWidth = '1px';

        // Warship line SVG design (just so has 5 children)
        let warshipLine1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        warshipLine1.setAttribute('class', localTeam + ' team_fill team_stroke');
        warshipLine1.setAttribute('d', 'M 15.5 24 L 15.75 24');
        warshipLine1.style.strokeWidth = '1px';

        // Warship line SVG design (just so has 5 children)
        let warshipLine2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        warshipLine2.setAttribute('class', localTeam + ' team_fill team_stroke');
        warshipLine2.setAttribute('d', 'M 9.25 24 L 9.5 24');
        warshipLine2.style.strokeWidth = '1px';

        // Building the tile
        actionTile.appendChild(warshipDeck);
        actionTile.appendChild(warshipLine1);
        actionTile.appendChild(warshipLine2);

        if (localDamage >= 4) {
            // Warship mast SVG design
            let warshipMast = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            warshipMast.setAttribute('class', localTeam + ' team_stroke');
            warshipMast.setAttribute('cx', '12.5');
            warshipMast.setAttribute('cy', '17');
            warshipMast.setAttribute('r', '1');
            warshipMast.style.strokeWidth = '1px';
            warshipMast.style.strokeLinecap = 'round';
            actionTile.appendChild(warshipMast);
        }

        if (localDamage >= 5) {
            // Warship sail SVG design
            let warshipSail = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            warshipSail.setAttribute('d', 'M 2 16 L 23 16 C 20.5 13.5 16.5 12 12.5 12 C 7.5 12 3.5 13.5 2 16 Z');
            warshipSail.setAttribute('class', localTeam + ' team_stroke');
            warshipSail.setAttribute('fill', 'white');
            warshipSail.style.strokeWidth = '1px';
            actionTile.appendChild(warshipSail);
        }

        return actionTile;
    },


    // Method to create warship tile
    // ---------------------------
    createCatamaranTile: function(actionTile, localTeam, localDamage) {
        // Removes all elements of SVG for damage / repair building
        while (actionTile.lastChild) {
            actionTile.removeChild(actionTile.lastChild);
        }

        // Cat left deck SVG design
        let catDeck1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        catDeck1.setAttribute('class', localTeam + ' team_fill team_stroke');
        catDeck1.setAttribute('d', 'M 7.5 3 A 3.5 10.5 1 0 0 7.5 22 A 3.5 10.5 1 0 0 7.5 3 Z');
        catDeck1.style.strokeWidth = '1px';

        // Cat right deck SVG design
        let catDeck2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        catDeck2.setAttribute('class', localTeam + ' team_fill team_stroke');
        catDeck2.setAttribute('d', 'M 17.5 3 A 3.5 10.5 1 0 0 17.5 22 A 3.5 10.5 1 0 0 17.5 3 Z');
        catDeck2.style.strokeWidth = '1px';

        // Cat centre deck SVG design
        let catCentreDeck = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        catCentreDeck.setAttribute('x', '7');
        catCentreDeck.setAttribute('y', '8.5');
        catCentreDeck.setAttribute('width', '11');
        catCentreDeck.setAttribute('height', '10.5');
        catCentreDeck.setAttribute('rx', '1');
        catCentreDeck.setAttribute('ry', '1');
        catCentreDeck.style.strokeWidth = '1px';
        catCentreDeck.setAttribute('class', localTeam + ' team_fill team_stroke');

        // Building the tile
        actionTile.appendChild(catDeck1);
        actionTile.appendChild(catDeck2);
        actionTile.appendChild(catCentreDeck);

        if (localDamage >= 4) {
            // Catamaran mast SVG design
            let warshipMast = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            warshipMast.setAttribute('class', localTeam + ' team_stroke');
            warshipMast.setAttribute('cx', '12.5');
            warshipMast.setAttribute('cy', '16.5');
            warshipMast.setAttribute('r', '1');
            warshipMast.style.strokeWidth = '1px';
            warshipMast.style.strokeLinecap = 'round';
            actionTile.appendChild(warshipMast);
        }

        if (localDamage >= 5) {
            // Catamaran sail SVG design
            let warshipSail = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            warshipSail.setAttribute('d', 'M 2 15.5 L 23 15.5 C 20.5 12.5 16.5 11.5 12.5 11.5 C 7.5 11.5 3.5 13 2 15.5 Z');
            warshipSail.setAttribute('class', localTeam + ' team_stroke');
            warshipSail.setAttribute('fill', 'white');
            warshipSail.style.strokeWidth = '1px';
            actionTile.appendChild(warshipSail);
        }

        return actionTile;
    },

    // Method to damage cargo ship after conflict
    // ------------------------------------------
    damageShip: function(actionTile, localTeam, localType, localDamage) {
        if(workFlow == 1) {console.log('Ship damage displayed: ' + (Date.now() - launchTime)); }

        if (localType == 'cargo ship') {
            actionTile = this.createCargoTile(actionTile, localTeam, localDamage);
        } else if (localType == 'warship') {
            actionTile = this.createWarshipTile(actionTile, localTeam, localDamage);
        } else if (localType == 'catamaran') {
            actionTile = this.createCatamaranTile(actionTile, localTeam, localDamage);
        }

        let shipOars = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        shipOars.setAttribute('d', 'M 7.5 10 L 1.5 13.5 M 17.5 10 L 23.5 13.5 M 7 13 L 1.5 16.5 M 18 13 L 23.5 16.5 M 7.5 15.5 L 1.5 19.5 M 17.5 15.5 L 23.5 19.5 M 7.5 18 L 1.5 22.5 M 17.5 18 L 23.5 22.5');
        shipOars.setAttribute('class', localTeam + ' team_stroke');
        shipOars.style.strokeLinejoin = 'round';
        shipOars.style.strokeLinecap = 'round';
        shipOars.style.strokeWidth = '1px';

        actionTile.appendChild(shipOars);

    },

    // Method to repair cargo ship docked in harbour
    // ---------------------------------------------
    repairShip: function(actionTile, localTeam, localType, localDamage) {
        if(workFlow == 1) {console.log('Ship repair displayed: ' + (Date.now() - launchTime)); }

        if (localType == 'cargo ship') {
            actionTile = this.createCargoTile(actionTile, localTeam, localDamage);
        } else if (localType == 'warship') {
            actionTile = this.createWarshipTile(actionTile, localTeam, localDamage);
        } else if (localType == 'catamaran') {
            actionTile = this.createCatamaranTile(actionTile, localTeam, localDamage);
        }

        // Puts up scaffolding
        if (localDamage < 5) {
            let shipScaffold = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            shipScaffold.setAttribute('d', 'M 3 4 L 3 23 M 22 4 L 22 23 M 3 8 L 6.5 8 M 22 8 L 18.5 8 M 3 19 L 6 19 M 22 19 L 19 19');
            shipScaffold.setAttribute('class', localTeam + ' team_stroke');
            shipScaffold.style.strokeLinejoin = 'round';
            shipScaffold.style.strokeLinecap = 'round';
            shipScaffold.style.strokeWidth = '1px';
            actionTile.appendChild(shipScaffold);
        }
    },

    // Method to create fort tile
    // ---------------------------
    createFortTile: function(actionTile, localTeam) {
        // Fort turret design
        let fortTurret1 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        fortTurret1.setAttribute('class', localTeam + ' team_stroke');
        fortTurret1.setAttribute('cx', '7');
        fortTurret1.setAttribute('cy', '7');
        fortTurret1.setAttribute('r', '2.5');
        fortTurret1.style.strokeWidth = '1px';
        fortTurret1.style.strokeLinecap = 'round';

        let fortTurret2 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        fortTurret2.setAttribute('class', localTeam + ' team_stroke');
        fortTurret2.setAttribute('cx', '7');
        fortTurret2.setAttribute('cy', '18');
        fortTurret2.setAttribute('r', '2.5');
        fortTurret2.style.strokeWidth = '1px';
        fortTurret2.style.strokeLinecap = 'round';

        let fortTurret3 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        fortTurret3.setAttribute('class', localTeam + ' team_stroke');
        fortTurret3.setAttribute('cx', '18');
        fortTurret3.setAttribute('cy', '7');
        fortTurret3.setAttribute('r', '2.5');
        fortTurret3.style.strokeWidth = '1px';
        fortTurret3.style.strokeLinecap = 'round';

        let fortTurret4 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        fortTurret4.setAttribute('class', localTeam + ' team_stroke');
        fortTurret4.setAttribute('cx', '18');
        fortTurret4.setAttribute('cy', '18');
        fortTurret4.setAttribute('r', '2.5');
        fortTurret4.style.strokeWidth = '1px';
        fortTurret4.style.strokeLinecap = 'round';

        // Fort wall rectangle design
        let fortWall = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        fortWall.setAttribute('x', '6');
        fortWall.setAttribute('y', '6');
        fortWall.setAttribute('width', '13');
        fortWall.setAttribute('height', '13');
        fortWall.setAttribute('rx', '1');
        fortWall.setAttribute('ry', '1');
        fortWall.style.strokeWidth = '1px';
        fortWall.setAttribute('class', localTeam + ' team_fill team_stroke');

        // Fort cannon design
        let fortCannon = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        fortCannon.setAttribute('d', 'M 15 12.5 Q 12.5 16 10 12.5 L 11.5 2 L 13.5 2 L 15 12.5');
        fortCannon.setAttribute('class', localTeam + ' team_stroke');
        fortCannon.style.strokeLinejoin = 'round';
        fortCannon.style.strokeLinecap = 'round';
        fortCannon.style.strokeWidth = '1px';

        // Building the tile
        actionTile.appendChild(fortWall);
        actionTile.appendChild(fortTurret1);
        actionTile.appendChild(fortTurret2);
        actionTile.appendChild(fortTurret3);
        actionTile.appendChild(fortTurret4);
        actionTile.appendChild(fortCannon);

        return actionTile;
    },


    // Method to create forest tile
    // ---------------------------
    createForestTile: function(actionTile, localTeam) {

        // Canopy circle design
        let treeCanopy1 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        treeCanopy1.setAttribute('class', localTeam + ' team_fill team_stroke');
        treeCanopy1.setAttribute('cx', '15');
        treeCanopy1.setAttribute('cy', '9');
        treeCanopy1.setAttribute('r', '5.5');
        treeCanopy1.style.strokeWidth = '1px';
        treeCanopy1.style.strokeLinecap = 'round';

        let treeCanopy2 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        treeCanopy2.setAttribute('class', localTeam + ' team_stroke');
        treeCanopy2.setAttribute('cx', '8');
        treeCanopy2.setAttribute('cy', '10.5');
        treeCanopy2.setAttribute('r', '4.5');
        treeCanopy2.setAttribute('fill', 'rgb(213, 191, 163)');
        treeCanopy2.style.strokeWidth = '1px';
        treeCanopy2.style.strokeLinecap = 'round';

        // Trunk rectangle design
        let treeTrunk1 = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        treeTrunk1.setAttribute('class', localTeam + ' team_stroke');
        treeTrunk1.setAttribute('x', '14.5');
        treeTrunk1.setAttribute('y', '15');
        treeTrunk1.setAttribute('width', '1.5');
        treeTrunk1.setAttribute('height', '5');
        treeTrunk1.setAttribute('fill', 'rgb(89, 53, 20)');
        treeTrunk1.style.strokeWidth = '1px';

        let treeTrunk2 = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        treeTrunk2.setAttribute('class', localTeam + ' team_stroke');
        treeTrunk2.setAttribute('x', '7.5');
        treeTrunk2.setAttribute('y', '15');
        treeTrunk2.setAttribute('width', '1');
        treeTrunk2.setAttribute('height', '5');
        treeTrunk2.setAttribute('fill', 'rgb(89, 53, 20)');
        treeTrunk2.style.strokeWidth = '1px';

        // Building the tile
        actionTile.appendChild(treeTrunk1);
        actionTile.appendChild(treeTrunk2);
        actionTile.appendChild(treeCanopy1);
        actionTile.appendChild(treeCanopy2);
        return actionTile;
    },

    // Method to create ironworks tile
    // ---------------------------
    createIronworksTile: function(actionTile, localTeam) {

        // Mountain background design
        let mountainBackground = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        mountainBackground.setAttribute('d', 'M 21.5 18 L 12.5 2.5 L 3.5 18');
        mountainBackground.setAttribute('class', localTeam + ' team_fill team_stroke');
        mountainBackground.style.strokeLinejoin = 'round';
        mountainBackground.style.strokeLinecap = 'round';
        mountainBackground.style.strokeWidth = '1px';

        // Mountain snow design
        let mountainSnow = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        mountainSnow.setAttribute('d', 'M 9.3 8 A 5 5 0 0 0 15.7 8 L 12.5 2.5 Z');
        mountainSnow.setAttribute('class', localTeam + ' team_stroke');
        mountainSnow.style.strokeLinejoin = 'round';
        mountainSnow.style.strokeLinecap = 'round';
        mountainSnow.setAttribute('fill', 'white');
        mountainSnow.style.strokeWidth = '1px';

        // Iron square design
        let ironSquare = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        ironSquare.setAttribute('class', localTeam + ' team_stroke');
        ironSquare.setAttribute('x', '9');
        ironSquare.setAttribute('y', '14');
        ironSquare.setAttribute('width', '7');
        ironSquare.setAttribute('height', '7');
        ironSquare.setAttribute('fill', 'silver');
        ironSquare.style.strokeWidth = '1px';
        ironSquare.setAttribute('rx', '1');
        ironSquare.setAttribute('ry', '1');
        ironSquare.style.strokeLinecap = 'round';

        // Building the tile
        actionTile.appendChild(mountainBackground);
        actionTile.appendChild(mountainSnow);
        actionTile.appendChild(ironSquare);
        return actionTile;
    },

    // Method to create desert tile
    // ---------------------------
    createDesertTile: function(actionTile, localTeam) {
        // rear dune
        let rearSandDune = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        rearSandDune.setAttribute('class', localTeam);
        rearSandDune.setAttribute('d', 'M 2 13 C 3 9 6 7 9 6 L 16 13');
        rearSandDune.style.strokeWidth = '1px';
        rearSandDune.setAttribute('stroke','rgb(138, 87, 50)');
        rearSandDune.setAttribute('fill', 'rgb(235, 215, 195)');

        // front dune
        let frontSandDune = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        frontSandDune.setAttribute('d', 'M 9 18 C 10 14 13 12 16 11 L 23 18');
        frontSandDune.setAttribute('class', localTeam);
        frontSandDune.setAttribute('stroke','rgb(138, 87, 50)');
        frontSandDune.setAttribute('fill', 'rgb(235, 215, 195)');

        // Building the tile
        actionTile.appendChild(rearSandDune);
        actionTile.appendChild(frontSandDune);

        return actionTile;
    },


    // Method to create quarry tile
    // ---------------------------
    createQuarryTile: function(actionTile, localTeam) {
        // Pick handle rectangle
        let pickHandle = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        pickHandle.setAttribute('class', localTeam + ' team_fill team_stroke');
        pickHandle.setAttribute('d', 'M 7.5 5.7 Q 7.4 4 9.2 4 L 21.2 16 L 19.5 17.7 L 8.2 6.7 Z');
        pickHandle.style.strokeLinejoin = 'round';
        pickHandle.style.strokeWidth = '1px';

        // Pick metal left
        let pickLeft = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        pickLeft.setAttribute('d', 'M 8.2 7.8 Q 5.4 10.1 5.5 14.5 Q 6.8 10.9 9.5 9.1 Z');
        pickLeft.setAttribute('class', localTeam + ' team_stroke');
        pickLeft.setAttribute('fill', 'silver');
        pickLeft.style.strokeLinejoin = 'round';
        pickLeft.style.strokeWidth = '1px';

        // Pick metal right
        let pickRight = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        pickRight.setAttribute('d', 'M 11.3 4.7 Q 13.6 1.9 18 2 Q 14.4 3.3 12.6 6 Z');
        pickRight.setAttribute('class', localTeam + ' team_stroke');
        pickRight.setAttribute('fill', 'silver');
        pickRight.style.strokeLinejoin = 'round';
        pickRight.style.strokeWidth = '1px';

        // Pick square
        let pickSquare = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        pickSquare.setAttribute('d', 'M 7.5 7 L 10.3 4.2 L 13.1 7 L 10.3 9.8 Z');
        pickSquare.setAttribute('class', localTeam + ' team_stroke');
        pickSquare.setAttribute('fill', 'silver');
        pickSquare.style.strokeLinejoin = 'round';
        pickSquare.style.strokeWidth = '1px';

        // Stone square in quarry
        let stoneSquare = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        stoneSquare.setAttribute('class', localTeam + ' team_stroke');
        stoneSquare.setAttribute('x', '5.5');
        stoneSquare.setAttribute('y', '15.5');
        stoneSquare.setAttribute('width', '6');
        stoneSquare.setAttribute('height', '6');
        stoneSquare.setAttribute('rx', '1');
        stoneSquare.setAttribute('ry', '1');
        stoneSquare.setAttribute('fill', 'white');
        stoneSquare.style.strokeWidth = '1px';

        // Building the tile
        actionTile.appendChild(pickHandle);
        actionTile.appendChild(pickLeft);
        actionTile.appendChild(pickRight);
        actionTile.appendChild(pickSquare);
        actionTile.appendChild(stoneSquare);

        return actionTile;
    },

    // Method to create plantation tile
    // --------------------------------
    createPlantationTile: function(actionTile, localTeam) {
        // lower berry
        let berry1 = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
        berry1.setAttribute('class', localTeam + ' team_stroke');
        berry1.setAttribute('cx', '11.2');
        berry1.setAttribute('cy', '17.8');
        berry1.setAttribute('rx', '2.2');
        berry1.setAttribute('ry', '2.7');
        berry1.setAttribute('stroke','rgb(138, 87, 50)');
        berry1.setAttribute('fill', 'rgb(235, 215, 195)');

        // right hand berry
        let berry3 = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
        berry3.setAttribute('class', localTeam + ' team_stroke');
        berry3.setAttribute('cx', '17.6');
        berry3.setAttribute('cy', '10.2');
        berry3.setAttribute('rx', '2.7');
        berry3.setAttribute('ry', '2.2');
        berry3.setAttribute('stroke','rgb(138, 87, 50)');
        berry3.setAttribute('fill', 'rgb(235, 215, 195)');

        // diagonal berry
        let berry2 = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
        berry2.setAttribute('class', localTeam + ' team_fill team_stroke');
        berry2.setAttribute('cx', '0');
        berry2.setAttribute('cy', '0');
        berry2.setAttribute('rx', '2.7');
        berry2.setAttribute('ry', '2.2');
        berry2.setAttribute('stroke','rgb(138, 87, 50)');
        berry2.setAttribute('fill', 'rgb(213, 191, 163)');
        berry2.setAttribute('transform', 'translate(17.4, 17) rotate(55)');

        // twig
        let coffeeTwig = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        coffeeTwig.setAttribute('class', localTeam + ' team_stroke');
        coffeeTwig.setAttribute('d', 'M 4.2 7 C 5.1 7.4 7.7 8 11.2 10.4 C 12.6 11.4 13.8 12.6 15.5 14.6');
        coffeeTwig.setAttribute('stroke','rgb(138, 87, 50)');
        coffeeTwig.setAttribute('fill', 'none');
        coffeeTwig.setAttribute('stroke-linecap', 'round');

        // lower coffee leaf
        let coffeeLeaf1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        coffeeLeaf1.setAttribute('d', 'M 5.5 19.2 C 6.5 17.8 7.2 16.0 7.5 15.0 C 7.7 14.2 7.5 13.5 7 12.7 C 6.6 11.6 5.6 10.5 4.8 9.6 C 3.0 12.9 2.7 14.5 3.9 16.6 C 4.2 17.1 5.0 18.5 5.5 19.2 ');
        coffeeLeaf1.setAttribute('class', localTeam + ' team_fill team_stroke');
        coffeeLeaf1.setAttribute('stroke','rgb(138, 87, 50)');
        coffeeLeaf1.setAttribute('fill', 'rgb(213, 191, 163)');
        coffeeLeaf1.setAttribute('stroke-linecap', 'round');
        coffeeLeaf1.setAttribute('stroke-linejoin', 'round');
        coffeeLeaf1.style.strokeWidth = '1px';

        // upper coffee leaf
        let coffeeLeaf2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        coffeeLeaf2.setAttribute('d', 'M 17.5 4.5 C 15.74 3.83 13.97 3.29 12.91 3.13 C 11.02 2.85 9.2 4.69 7.72 6.28 C 11.3 7.81 12.85 8.01 14.83 6.61 C 15.34 6.25 16.66 5.35 17.5 4.5 ');
        coffeeLeaf2.setAttribute('class', localTeam + ' team_fill team_stroke');
        coffeeLeaf2.setAttribute('stroke','rgb(138, 87, 50)');
        coffeeLeaf2.setAttribute('fill', 'rgb(213, 191, 163)');
        coffeeLeaf2.setAttribute('stroke-linecap', 'round');
        coffeeLeaf2.setAttribute('stroke-linejoin', 'round');
        coffeeLeaf2.style.strokeWidth = '1px';

        // Building the tile
        actionTile.appendChild(berry1);
        actionTile.appendChild(berry2);
        actionTile.appendChild(berry3);
        actionTile.appendChild(coffeeTwig);
        actionTile.appendChild(coffeeLeaf1);
        actionTile.appendChild(coffeeLeaf2);

        return actionTile;
    },

    // Method to create flax tile
    // --------------------------------
    createFlaxTile: function(actionTile, localTeam) {

        function createPetal(centerX, centerY, rotatePetal, size, teamColour) {
        // petal
            let petal = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            if (teamColour == true) {
                petal.setAttribute('class', localTeam + ' team_fill team_stroke');
                petal.setAttribute('fill', 'rgb(213, 191, 163)');
            } else {
                petal.setAttribute('class', localTeam);
                petal.setAttribute('fill', 'white');
            }
            petal.setAttribute('d', 'M ' + (centerX - 1.5) + ' ' + (centerY - 1.5) + ' A ' + size + ' ' + size + ' 0 1 0 '+ (centerX - 1.5) + ' ' +  (centerY + 1.5) + ' L ' + centerX + ' ' + centerY + ' Z');
            petal.setAttribute('stroke','rgb(138, 87, 50)');

            petal.setAttribute('stroke-linecap', 'round');
            petal.setAttribute('transform', 'scale(0.9, 0.9), translate(1.38, 1.38), rotate(' + rotatePetal + ', ' + centerX + ', ' + centerY + ')');
            petal.style.strokeWidth = '1.1px';
            return petal
        }

        let petal1 = createPetal(11.65, 6.65, 45, 2.75, true);
        let petal2 = createPetal(13.35, 8.35, 225, 2.75, true);
        let petal3 = createPetal(11.65, 8.35, 315, 2.75, true);
        let petal4 = createPetal(13.35, 6.65, 135, 2.75, true);
        let bud1 = createPetal(3.5, 13.5, 250, 2, false);
        let bud2 = createPetal(21.5, 13.5, 290, 2, false);

        // branch
        let flaxBranch = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        flaxBranch.setAttribute('class', localTeam);
        flaxBranch.setAttribute('d', 'M 6 18.75 A 6 2 0 1 0 19 18.75');
        flaxBranch.setAttribute('stroke','rgb(138, 87, 50)');
        flaxBranch.setAttribute('fill', 'none');
        flaxBranch.setAttribute('stroke-linecap', 'round');
        flaxBranch.style.strokeWidth = '1px';

        // stalk
        let flaxStalk = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        flaxStalk.setAttribute('class', localTeam + ' team_stroke');
        flaxStalk.setAttribute('d', 'M 12.5 13.5 L 12.5 22');
        flaxStalk.setAttribute('stroke','rgb(138, 87, 50)');
        flaxStalk.setAttribute('fill', 'none');
        flaxStalk.setAttribute('stroke-linecap', 'round');
        flaxStalk.style.strokeWidth = '1px';

        // Building the tile
        actionTile.appendChild(petal1);
        actionTile.appendChild(petal2);
        actionTile.appendChild(petal3);
        actionTile.appendChild(petal4);
        actionTile.appendChild(bud1);
        actionTile.appendChild(bud2);
        actionTile.appendChild(flaxBranch);
        actionTile.appendChild(flaxStalk);


        return actionTile;
    },

    // Method to create coffee bean goods icon
    // ----------------------------------------
    createCoffeeIcon: function(goodsIcon) {
        /*let temp = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        temp.setAttribute('x', '0');
        temp.setAttribute('y', '0');
        temp.setAttribute('width', '25');
        temp.setAttribute('height', '25');
        temp.setAttribute('rx', '1');
        temp.setAttribute('ry', '1');
        temp.setAttribute('stroke','rgb(89, 53, 20)');
        temp.setAttribute('fill', 'none');*/

        //Coffee bean
        let coffeeBean = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        coffeeBean.setAttribute('d','M 17.5 6 A 11.5 9 1 0 1 10.5 20 Q 10.5 14.5    14 13.25    T 17.5 6 ' +
                                    'M 15 5   A 11.5 9 0 0 0 8 19   Q 8 13  11.5 11.75  T 15 5');
        coffeeBean.setAttribute('stroke','rgb(89, 53, 20)');
        //coffeeBean.setAttribute('fill', 'rgb(89, 53, 20)');
        coffeeBean.setAttribute('stroke-linecap', 'round');
        coffeeBean.setAttribute('stroke-linejoin', 'round');
        coffeeBean.style.strokeWidth = '1px';
        goodsIcon.appendChild(coffeeBean);
        //goodsIcon.appendChild(temp);
        return(goodsIcon);
    },

    // Method to create stone goods icon
    // ----------------------------------------
    createStoneIcon: function(goodsIcon) {
        // Stone square
        let stoneSquare = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        stoneSquare.setAttribute('x', '6');
        stoneSquare.setAttribute('y', '6');
        stoneSquare.setAttribute('width', '14');
        stoneSquare.setAttribute('height', '14');
        stoneSquare.setAttribute('rx', '2');
        stoneSquare.setAttribute('ry', '2');
        stoneSquare.setAttribute('stroke','rgb(89, 53, 20)');
        stoneSquare.setAttribute('fill', 'white');
        stoneSquare.style.strokeWidth = '1px';
        stoneSquare.setAttribute('stroke-linecap', 'round');
        stoneSquare.setAttribute('stroke-linejoin', 'round');

        goodsIcon.appendChild(stoneSquare);
        return(goodsIcon);
    },

    // Method to create wood goods icon
    // ----------------------------------------
    createWoodIcon: function(goodsIcon) {

        // Log end
        let farCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        farCircle.setAttribute('cx', '17');
        farCircle.setAttribute('cy', '8');
        farCircle.setAttribute('r', '3');
        farCircle.setAttribute('fill', 'none');
        farCircle.setAttribute('stroke','rgb(89, 53, 20)');
        farCircle.setAttribute('fill', 'rgb(213, 191, 163)');
        farCircle.style.strokeWidth = '1px';
        farCircle.style.strokeLinecap = 'round';

        // Log length
        let logBeam = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        logBeam.setAttribute('d','M 15 5.75 L 6.5 13 L 12 18.75 L 19.25 10');
        logBeam.setAttribute('stroke','rgb(89, 53, 20)');
        logBeam.setAttribute('fill', 'rgb(213, 191, 163)');
        logBeam.setAttribute('stroke-linecap', 'round');
        logBeam.setAttribute('stroke-linejoin', 'round');
        logBeam.style.strokeWidth = '1px';

        // Log end
        let nearCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        nearCircle.setAttribute('cx', '9');
        nearCircle.setAttribute('cy', '16');
        nearCircle.setAttribute('r', '4');
        nearCircle.setAttribute('fill', 'none');
        nearCircle.setAttribute('stroke','rgb(89, 53, 20)');
        nearCircle.setAttribute('fill', 'rgb(213, 191, 163)');
        nearCircle.style.strokeWidth = '1px';
        nearCircle.style.strokeLinecap = 'round';

        // Inner circle
        let innerCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        innerCircle.setAttribute('cx', '9');
        innerCircle.setAttribute('cy', '16');
        innerCircle.setAttribute('r', '2.5');
        innerCircle.setAttribute('fill', 'none');
        innerCircle.setAttribute('stroke','rgb(89, 53, 20)');
        innerCircle.setAttribute('fill', 'none');
        innerCircle.style.strokeWidth = '0.5px';
        innerCircle.style.strokeLinecap = 'round';

        // Inner circle
        let innerCircle2 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        innerCircle2.setAttribute('cx', '9');
        innerCircle2.setAttribute('cy', '16');
        innerCircle2.setAttribute('r', '1');
        innerCircle2.setAttribute('fill', 'none');
        innerCircle2.setAttribute('stroke','rgb(89, 53, 20)');
        innerCircle2.setAttribute('fill', 'none');
        innerCircle2.style.strokeWidth = '0.5px';
        innerCircle2.style.strokeLinecap = 'round';

        goodsIcon.appendChild(farCircle);
        goodsIcon.appendChild(logBeam);
        goodsIcon.appendChild(nearCircle);
        goodsIcon.appendChild(innerCircle);
        goodsIcon.appendChild(innerCircle2);
        return(goodsIcon);
    },

    // Method to create iron goods icon
    // ----------------------------------------
    createIronIcon: function(goodsIcon) {
        // Front end of joist
        let frontEnd = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        //frontEnd.setAttribute('d','M 5 10 L 13 10 L 13 13 L 10.5 13 L 10.5 18 L 13 18 L 13 21 L 5 21 L 5 18 L 7.5 18 L 7.5 13 L 5 13 Z');
        frontEnd.setAttribute('d','M 5 5 L 20 5 L 20 8 L 14 8 L 14 17 L 20 17 L 20 20 L 5 20 L 5 17 L 11 17 L 11 8 L 5 8 Z');
        frontEnd.setAttribute('stroke','rgb(89, 53, 20)');
        frontEnd.setAttribute('stroke','black');
        frontEnd.setAttribute('fill', 'silver');
        frontEnd.setAttribute('stroke-linecap', 'round');
        frontEnd.setAttribute('stroke-linejoin', 'round');
        frontEnd.style.strokeWidth = '1px';

        goodsIcon.appendChild(frontEnd);
        return(goodsIcon);
    },

    // Method to create cloth goods icon
    // ----------------------------------------
    createClothIcon: function(goodsIcon) {
        // Front end of joist
        let sailCloth = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        sailCloth.setAttribute('d','M 5 20 A 15 15 1 0 0 12 3 A 15 15 1 0 1 18 20 Z');
        sailCloth.setAttribute('stroke','rgb(89, 53, 20)');
        sailCloth.setAttribute('stroke','rgb(89, 53, 20)');
        sailCloth.setAttribute('fill', 'white');
        sailCloth.setAttribute('stroke-linecap', 'round');
        sailCloth.setAttribute('stroke-linejoin', 'round');
        sailCloth.style.strokeWidth = '1px';

        goodsIcon.appendChild(sailCloth);
        return(goodsIcon);
    },





    // Method allows "non-specific" action tile to be created without reference to the boardArray
    // ------------------------------------------------------------------------------------------
    // gridSize is the size of the tile, squareType is the ship type of the tile

    buildActionTile: function(localType, localDirection, localTeam, tileSize) {
        // Creating the action tile shape
        let newActionTile = document.createElement('div');
        let holdingActionTile = document.createElement('div');
        let innerActionTile = document.createElement('div');
        let detailActionTile = document.createElement('div');

        // Creating the tile by dynamically allocating CSS classes
        newActionTile.setAttribute('class', 'square' + ' ' + localType);
        newActionTile.style.height = (tileSize - 2) + 'px';
        newActionTile.style.width = (tileSize - 2) + 'px';

        holdingActionTile.setAttribute('class', 'holding' + ' ' + localType);
        holdingActionTile.style.height = (tileSize - 2) + 'px';
        holdingActionTile.style.width = (tileSize - 2) + 'px';
        holdingActionTile.style.transform = 'rotate(' + localDirection + 'deg)';

        innerActionTile.setAttribute('class', 'piece' + ' ' + localType + ' ' + localTeam + ' team_colours');
        innerActionTile.style.height = (tileSize - 6) + 'px';
        innerActionTile.style.width = (tileSize - 6) + 'px';

        detailActionTile.setAttribute('class', 'detail' + ' ' + localType + ' ' + localTeam);
        detailActionTile.style.height = (tileSize - 6) + 'px';
        detailActionTile.style.width = (tileSize - 6) + 'px';

        newActionTile.appendChild(holdingActionTile);
        holdingActionTile.appendChild(innerActionTile);
        innerActionTile.appendChild(detailActionTile);

        // tile is returned to drawBoard
        return newActionTile;
    },

    // New method to create the board display based on the boardArray using canvas
    // ----------------------------------------------------------------------------
    // gridSize is the size of the tile, row and col depict the number of tiles on the board
    drawBoard: function(row, col, gridSize) {
        if(workFlow == 1) {console.log('Board drawn: ' + (Date.now() - launchTime)); }

        // Loop through board array to draw tiles
          let octagonArray = [  {type: 'visible', gap: 0*screenReduction, width: 1*screenReduction, colour: 'rgb(235, 215, 195)', background: 'rgb(246, 232, 206)'},
                                {type: 'land', gap: 6*screenReduction, width: 6*screenReduction, colour: 'rgb(213, 191, 163)', background: 'rgb(246, 232, 206)'},
                                {type: 'land', gap: 4*screenReduction, width: 1.5*screenReduction, colour: 'rgb(138, 87, 50)', background: 'transparent'} ]

        for (var h = 0; h < octagonArray.length; h++) {
            this.drawTiles (octagonArray[h].type, canvasBoard, octagonArray[h].gap, octagonArray[h].width, octagonArray[h].colour, octagonArray[h].background)
        }
        this.drawHarbours();
    },

    // New method to create the board pieces based on the boardArray using SVG
    // ----------------------------------------------------------------------------
    drawPieces: function() {
        if(workFlow == 1) {console.log('Pieces drawn: ' + (Date.now() - launchTime)); }
        // Loops for pieces
        for (var i = 0; i < row; i++) {
            Ycenter = (gridSize + tileBorder * 2) * i + (gridSize/2 + boardSurround + tileBorder);

            for (var j = 0; j < col; j++) {
                Xcenter = (gridSize + tileBorder * 2) * j + (gridSize/2 + boardSurround + tileBorder);

                if (this.boardArray[i][j].pieces.populatedSquare == true) {
                    // Create action tile svg and add to the board
                    boardMarkNode.appendChild(this.createActionTile(i, j, this.boardArray[i][j].pieces.type, this.boardArray[i][j].pieces.team,'tile' + Number(i*1000 + j), boardSurround + tileBorder/2 + (gridSize + tileBorder * 2) * i, boardSurround + tileBorder/2 + (gridSize + tileBorder * 2) * j, 1, this.boardArray[i][j].pieces.direction));
                }
            }
        }
    },

    // Method for looping through tiles and drawing
    // --------------------------------------------

    drawTiles: function(octagonType, boardLayer, ocatagonGap, octagonWidth, octagonColour, octagonBackground) {
        // Start path for each array of octagons
        boardLayer.beginPath();
        for (var i = 0; i < row; i++) {
            Ycenter = (gridSize + tileBorder * 2) * i + (gridSize/2 + boardSurround + tileBorder);

            for (var j = 0; j < col; j++) {
                Xcenter = (gridSize + tileBorder * 2) * j + (gridSize/2 + boardSurround + tileBorder);

                if (octagonType=='visible' && this.boardArray[i][j].terrain != 'invis') {
                    // Tiles - 'invis' gives shape to octagonal board
                    this.drawOctagon(boardLayer, ocatagonGap);
                } else if (octagonType=='active' && this.boardArray[i][j].activeStatus == 'active') {
                    // Activation of tiles - on a separate canvas overlay
                    this.drawOctagon(boardLayer, ocatagonGap);
                } else if (octagonType=='harbour' && this.boardArray[i][j].subTerrain == 'harbour') {
                    // Draws safe harbours - on a separate canvas overlay
                    this.drawOctagon(boardLayer, ocatagonGap);
                } else if (octagonType=='pirateHarbour' && this.boardArray[i][j].subTerrain == 'pirateHarbour') {
                    // Draws safe harbours - on a separate canvas overlay
                    this.drawOctagon(boardLayer, ocatagonGap);

                } else if (octagonType=='land' && this.boardArray[i][j].terrain == 'land') {
                    // Islands
                    this.drawOctagon(boardLayer, ocatagonGap);
                }
            }
        }
        // Draw path for each array of octagons
        boardLayer.lineWidth = octagonWidth;
        boardLayer.lineCap='round';
        boardLayer.strokeStyle = octagonColour;
        boardLayer.fillStyle = octagonBackground;
        boardLayer.stroke();
        boardLayer.fill();

    },

    // Method to set up canvas overlay layer for piece activation
    // ----------------------------------------------------------
    drawActiveTiles: function () {
        if(workFlow == 1) {console.log('Active tiles drawn: ' + (Date.now() - launchTime)); }
        // Clears the canvas for redraw
        canvasActive.clearRect(0, 0, canvasActive.canvas.width, canvasActive.canvas.height);

        // drawTiles is used to colour tiles on active layer
        gameBoard.drawTiles ('active', canvasActive, 0, 1, 'rgb(255, 153, 153)', 'transparent');

        // safe harbours are also drawn on canvasActive later - can be changed later if necessary
        this.drawHarbours();
    },

    // Method to add safe harbours to the map
    // --------------------------------------
    drawHarbours: function () {
        if(workFlow == 1) {console.log('Harbours drawn: ' + (Date.now() - launchTime)); }
        // safe harbours are also drawn on canvasActive later - can be changed later if necessary
        this.drawTiles ('harbour', canvasActive, 0, 1, 'transparent', 'rgb(233, 211, 183)');
        this.drawTiles ('pirateHarbour', canvasActive, 0, 1, '#353839', 'rgb(233, 211, 183)');
        //this.drawTiles ('pirateHarbour', canvasActive, 0, 1, 'darkgrey', 'darkgrey');
        //this.drawTiles ('pirateHarbour', canvasActive, 0, 1, 'rgb(138, 87, 50)', 'rgb(138, 87, 50)');

    },


    // Method to draw octagons for creation of board
    // ---------------------------------------------
    drawOctagon: function(canvasBoard, ocatagonGap) {
        let octagonAngle = (2 * Math.PI) / 8;
        // Moves to start of octagon
        canvasBoard.moveTo (Xcenter + (gridSize/2 + ocatagonGap) * Math.cos(0.5 * octagonAngle), Ycenter + (gridSize/2 + ocatagonGap) *  Math.sin(0.5 * octagonAngle));
        // Draws eight sides
        for (var k = 1; k <= 8; k++) {
            canvasBoard.lineTo (Xcenter + (gridSize/2 + ocatagonGap) * Math.cos((k+0.5) * octagonAngle), Ycenter + (gridSize/2 + ocatagonGap) * Math.sin((k+0.5) * octagonAngle));
        }
    },

    // Method to draw compass layer elements
    // -------------------------------------
    drawCompassLayer: function() {
        if(workFlow == 1) {console.log('Compass layer drawn: ' + (Date.now() - launchTime)); }
        this.drawCompass();
        this.drawLogo();
        this.drawBoardBorder();
    },

    // Method to draw compass on lowest layer of board
    // -------------------------------------------------------------
    drawCompass: function() {
        let compassSize = (gridSize + tileBorder * 2) * 2;
        let logoSize = (gridSize + tileBorder * 2) * 2;
        let Xsize = (col * (gridSize + tileBorder * 2) + boardSurround * 2);
        let Ysize = (row * (gridSize + tileBorder * 2) + boardSurround * 2);
        let Xcenter = (gridSize + tileBorder * 2) * (col - 3) + (gridSize/2 + boardSurround + tileBorder);
        let Ycenter = (gridSize + tileBorder * 2) * (row - 3) + (gridSize/2 + boardSurround + tileBorder);

        // Compass outer circle
        let compassOuter = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        compassOuter.setAttribute('cx', Xcenter);
        compassOuter.setAttribute('cy', Ycenter);
        compassOuter.setAttribute('r', compassSize);
        compassOuter.style.strokeWidth = '1px';
        compassOuter.setAttribute('stroke', 'rgb(235, 215, 195)');
        compassOuter.setAttribute('fill', 'none');
        compassOuter.style.strokeLinecap = 'round';

        // Compass inner circle
        let compassInner = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        compassInner.setAttribute('cx', Xcenter);
        compassInner.setAttribute('cy', Ycenter);
        compassInner.setAttribute('r', compassSize - tileBorder*2);
        compassInner.style.strokeWidth = '1px';
        compassInner.setAttribute('stroke', 'rgb(235, 215, 195)');
        compassInner.setAttribute('fill', 'rgb(246, 232, 206)');
        compassInner.style.strokeLinecap = 'round';

        // Compass reading lines that stretch across board
        let compassLines = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        compassLines.setAttribute('d', 'M ' + (Xsize - boardSurround) + ' ' + (Ysize - boardSurround) + 'L ' + (boardSurround+logoSize*2) + ' ' + (boardSurround+logoSize*2) + 'M ' + (Xsize - boardSurround) + ' ' + Ycenter + 'L ' + (boardSurround + tileBorder/2 + (gridSize + tileBorder * 2) * 6) + ' ' + Ycenter
                                        + 'M ' + Xcenter + ' ' + (Ysize - boardSurround) + 'L ' + Xcenter + ' ' + (boardSurround + tileBorder/2 + (gridSize + tileBorder * 2) * 6) + 'M ' + (2 * Xcenter + boardSurround - Xsize) + ' ' + (Ysize - boardSurround) + 'L ' + (Xsize - boardSurround) + ' ' + (2 * Ycenter + boardSurround - Ysize) );
        compassLines.style.strokeWidth = '1px';
        compassLines.setAttribute('stroke', 'rgb(235, 215, 195)');
        compassLines.setAttribute('opacity', '1');
        compassLines.setAttribute('fill', 'none');
        compassLines.style.strokeLinecap = 'round';

        // Coloured compass points
        let compassPointsFill = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        compassPointsFill.setAttribute('d', 'M ' + Xcenter + ' ' + Ycenter  + ' L ' + (Xcenter) + ' ' + (Ycenter - compassSize) + ' L ' + (Xcenter + gridSize/2) + ' ' + (Ycenter - gridSize/2) + 'L ' + Xcenter + ' ' + Ycenter
                                                                            + ' L ' + (Xcenter + compassSize) + ' ' + (Ycenter) + ' L ' + (Xcenter + gridSize/2) + ' ' + (Ycenter + gridSize/2) + 'L ' + Xcenter + ' ' + Ycenter
                                                                            + ' L ' + (Xcenter) + ' ' + (Ycenter + compassSize) + ' L ' + (Xcenter - gridSize/2) + ' ' + (Ycenter + gridSize/2) + 'L ' + Xcenter + ' ' + Ycenter
                                                                            + ' L ' + (Xcenter - compassSize) + ' ' + (Ycenter) + ' L ' + (Xcenter - gridSize/2) + ' ' + (Ycenter - gridSize/2) + 'L ' + Xcenter + ' ' + Ycenter
                                                                      );
        compassPointsFill.setAttribute('fill', 'rgb(213, 191, 163)');

        // Empty compass points
        let compassPointsEmpty = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        compassPointsEmpty.setAttribute('d', 'M ' + Xcenter + ' ' + Ycenter + ' L ' + (Xcenter) + ' ' + (Ycenter - compassSize) + ' L ' + (Xcenter - gridSize/2) + ' ' + (Ycenter - gridSize/2) + 'L ' + Xcenter + ' ' + Ycenter
                                                                            + ' L ' + (Xcenter + compassSize) + ' ' + (Ycenter) + ' L ' + (Xcenter + gridSize/2) + ' ' + (Ycenter - gridSize/2) + 'L ' + Xcenter + ' ' + Ycenter
                                                                            + ' L ' + (Xcenter) + ' ' + (Ycenter + compassSize) + ' L ' + (Xcenter + gridSize/2) + ' ' + (Ycenter + gridSize/2) + 'L ' + Xcenter + ' ' + Ycenter
                                                                            + ' L ' + (Xcenter - compassSize) + ' ' + (Ycenter) + ' L ' + (Xcenter - gridSize/2) + ' ' + (Ycenter + gridSize/2) + 'L ' + Xcenter + ' ' + Ycenter
                                                                      );
        compassPointsEmpty.setAttribute('stroke','rgb(235, 215, 195)');
        compassPointsEmpty.setAttribute('fill', 'rgb(246, 232, 206)');

        // Alternating colours of compass circle
        let compassRing = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        let octagonAngle = (2 * Math.PI) / 8;
        let ringPath = '';
        for (var k = 1; k <= 8; k++) {
            ringPath += 'M ' + Xcenter + ' ' + Ycenter + ' L ' + (Ycenter + compassSize * Math.cos((k) * octagonAngle)) + ' ' + (Ycenter + compassSize * Math.sin((k) * octagonAngle)) + ' A ' + (compassSize) + ' ' + (compassSize) + ' 0 0 0 ' + (Ycenter + compassSize * Math.cos((k-0.5) * octagonAngle)) + ' ' + (Ycenter + compassSize * Math.sin((k-0.5) * octagonAngle)) + 'L ' + Xcenter + ' ' + Ycenter + 'L ' + Xcenter + ' ' + Ycenter
        }
        compassRing.setAttribute('d', ringPath);
        compassRing.setAttribute('stroke','rgb(235, 215, 195)');
        compassRing.setAttribute('fill', 'rgb(213, 191, 163)');

        // Compass needle
        let compassNeedleBox = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        compassNeedleBox.setAttribute('width', compassSize * 2);
        compassNeedleBox.setAttribute('height', compassSize * 2);
        compassNeedleBox.style.top = (Ycenter - compassSize) + 'px';
        compassNeedleBox.style.left = (Xcenter - compassSize) + 'px';
        compassNeedleBox.setAttribute('viewBox', '0, 0, ' + compassSize * 2 +  ', ' + compassSize * 2);
        compassNeedleBox.setAttribute('class', 'compass');
        compassNeedleBox.setAttribute('id', 'needle2');

        let compassNeedle = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        compassNeedle.setAttribute('d', 'M ' + (compassSize - 3) + ' ' + (tileBorder * 2) + ' L ' + (compassSize - 0.5) + ' ' + (2 * compassSize - tileBorder * 2)
         + ' L ' + (compassSize + 0.5) + ' ' + (2 * compassSize - tileBorder * 2) + ' L ' + (compassSize + 3) + ' ' + (tileBorder * 2)
         + ' L ' + (compassSize) + ' ' + (tileBorder) + ' Z');
        compassNeedle.style.strokeWidth = '0.5px';
        compassNeedle.setAttribute('opacity', '0.75');
        compassNeedle.setAttribute('stroke', '#666666');

        compassNeedle.setAttribute('stroke', 'rgb(138, 87, 50)');
        compassNeedle.setAttribute('stroke', '#4b2f1b');
        compassNeedle.setAttribute('fill', '#A6A6A6');
        compassNeedle.setAttribute('fill', 'rgb(138, 87, 50)');

        // Compass pin (centre circle)
        let compassCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        compassCircle.setAttribute('cx', + compassSize);
        compassCircle.setAttribute('cy', + compassSize);
        compassCircle.setAttribute('r', '4');
        compassCircle.setAttribute('fill', '#666666');
        compassCircle.setAttribute('fill', 'rgb(138, 87, 50)');
        compassCircle.setAttribute('stroke', '#4b2f1b');
        compassCircle.style.strokeWidth = '0.5px';
        compassCircle.style.strokeLinecap = 'round';

        // Add all SVG elements to board
        compassLayer.appendChild(compassRing);
        compassLayer.appendChild(compassOuter);
        compassLayer.appendChild(compassInner);
        compassLayer.appendChild(compassLines);
        compassLayer.appendChild(compassPointsFill);
        compassLayer.appendChild(compassPointsEmpty);

        compassNeedleBox.appendChild(compassNeedle);
        compassNeedleBox.appendChild(compassCircle);

        boardMarkNode.appendChild(compassNeedleBox);

    },

    // Method for drawing logo on board
    // ----------------------------------------

    drawLogo: function() {
        // Game logo
        let logoSize = (gridSize + tileBorder * 2) * 2;

        let logoArchipelago = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        logoArchipelago.setAttribute('cx', + logoSize + boardSurround);
        logoArchipelago.setAttribute('cy', + logoSize + boardSurround);
        logoArchipelago.setAttribute('r', logoSize);
        logoArchipelago.setAttribute('fill', 'none');
        logoArchipelago.setAttribute('stroke', 'rgb(213, 191, 163)');
        logoArchipelago.style.strokeWidth = '1px';
        logoArchipelago.style.strokeLinecap = 'round';

        let logoArchipelagoInner = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        logoArchipelagoInner.setAttribute('cx', + logoSize + boardSurround);
        logoArchipelagoInner.setAttribute('cy', + logoSize + boardSurround);
        logoArchipelagoInner.setAttribute('r', logoSize - (30*screenReduction));
        logoArchipelagoInner.setAttribute('fill', 'none');
        logoArchipelagoInner.setAttribute('stroke', 'rgb(213, 191, 163)');
        logoArchipelagoInner.style.strokeWidth = '1px';
        logoArchipelagoInner.style.strokeLinecap = 'round';

        let logoText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        let logoTextPath = document.createElementNS('http://www.w3.org/2000/svg', 'textPath');
        let logoDefsPath = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        let logoDefsPath2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        let text = document.createTextNode(' --- archipelago ----- archipelago ----- archipelago ---');

        // Game logo text and path
        logoDefsPath.appendChild(logoDefsPath2);
        logoDefsPath2.setAttribute('id', 'circlePath');
        logoDefsPath2.setAttribute('d', 'M ' + (boardSurround + 20*screenReduction) + ' ' + (logoSize + boardSurround) + ' A ' + (logoSize - 20*screenReduction) + ' ' + (logoSize - 20*screenReduction) + ' 0 1 1 ' + (boardSurround + 20*screenReduction) + ' ' + (logoSize + boardSurround + 1));

        logoText.appendChild(logoTextPath);
        logoText.setAttribute('font-size', 14 * Math.pow(screenReduction, 1.2));
        logoText.setAttribute('stroke', 'rgb(213, 191, 163)');
        logoText.setAttribute('fill', 'rgb(213, 191, 163)');
        logoTextPath.appendChild(text);

        //logoDefsPath.setAttribute('path');
        logoTextPath.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#circlePath');

        compassLayer.appendChild(logoArchipelago);
        compassLayer.appendChild(logoArchipelagoInner);
        compassLayer.appendChild(logoDefsPath);
        compassLayer.appendChild(logoText);
    },

    // Method for drawing board border on board layer
    // ----------------------------------------------
    drawBoardBorder: function() {
        // Border
        let equalGap = gridSize;
        let octagonBorder = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        octagonBorder.setAttribute('d',
        'M ' + (boardSurround + tileBorder + (gridSize + tileBorder * 2) * 10)  + ' ' + (boardSurround + tileBorder - equalGap) +
        'L ' + (boardSurround + tileBorder + (gridSize + tileBorder * 2) * 20 + gridSize) + ' ' + (boardSurround + tileBorder - equalGap) +
        'L ' + (boardSurround + tileBorder + (gridSize + tileBorder * 2) * 30 + gridSize + equalGap) + ' ' + (boardSurround + tileBorder + (gridSize + tileBorder * 2) * 10) +
        'L ' + (boardSurround + tileBorder + (gridSize + tileBorder * 2) * 30 + gridSize + equalGap) + ' ' + (boardSurround + tileBorder + (gridSize + tileBorder * 2) * 20  + gridSize) +
        'L ' + (boardSurround + tileBorder + (gridSize + tileBorder * 2) * 20 + gridSize) + ' ' + (boardSurround + tileBorder + (gridSize + tileBorder * 2) * 30  + gridSize  + equalGap) +
        'L ' + (boardSurround + tileBorder + (gridSize + tileBorder * 2) * 10) + ' ' + (boardSurround + tileBorder + (gridSize + tileBorder * 2) * 30  + gridSize + equalGap) +
        'L ' + (boardSurround + tileBorder + (gridSize + tileBorder * 2) * 0 - equalGap) + ' ' + (boardSurround + tileBorder + (gridSize + tileBorder * 2) * 20  + gridSize) +
        'L ' + (boardSurround + tileBorder + (gridSize + tileBorder * 2) * 0 - equalGap) + ' ' + (boardSurround + tileBorder + (gridSize + tileBorder * 2) * 10) + ' Z'
        );

        octagonBorder.style.strokeWidth = '6px';
        octagonBorder.setAttribute('stroke', 'rgb(235, 215, 195)');
        octagonBorder.setAttribute('stroke', 'rgb(213, 191, 163)');
        octagonBorder.setAttribute('opacity', '1');
        octagonBorder.setAttribute('fill', 'none');
        octagonBorder.style.strokeLinecap = 'round';

        compassLayer.appendChild(octagonBorder);
    },

    // Method to add new canvas layer to board
    // ---------------------------------------
    createCanvasLayer: function(localID) {
        let layer = document.createElement('canvas');
        layer.setAttribute('id', localID);
        let contextLayer = layer.getContext('2d');
        contextLayer.canvas.width = row * (gridSize + tileBorder * 2) + boardSurround * 2;
        contextLayer.canvas.height = col * (gridSize + tileBorder * 2) + boardSurround * 2;
        return([layer, contextLayer]);
    },


    // Method to add new SVG layer to board
    // ---------------------------------
    createNewLayer: function(localClass) {
        let layer = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        layer.setAttribute('width', col * (gridSize + tileBorder * 2) + boardSurround * 2);
        layer.setAttribute('height', row * (gridSize + tileBorder * 2) + boardSurround * 2);
        layer.setAttribute('viewBox', '0, 0, ' + (col * (gridSize + tileBorder * 2) + boardSurround * 2) +  ', ' + (row * (gridSize + tileBorder * 2) + boardSurround * 2));
        layer.setAttribute('class', localClass);
        return(layer);
    },

    // Method to draw a trade route on the board
    // -----------------------------------------
    // Local path is an array of objects of the form {fromRow: 15, fromCol: 4}
    tradeRoute: function(localPath, localTeam, localFort, localGoods) {

        let pathGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        tradeRouteLayer.appendChild(pathGroup);
        pathGroup.id = localGoods + '_' + localFort;

        let route = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        route.setAttribute('class', localTeam + ' team_route');

        let buildRoute = 'M ' + (boardSurround + tileBorder + gridSize/2 + (gridSize + tileBorder * 2) * localPath[0].fromCol) + ' ' + (boardSurround + tileBorder + gridSize/2 + (gridSize + tileBorder * 2) * localPath[0].fromRow);
        //let buildRoute = 'M ' + (boardSurround + tileBorder + gridSize/2 + (gridSize + tileBorder * 2) * localPath[0].fromCol + gameManagement.teamArray.indexOf(gameManagement.turn)*2-4) + ' ' + (boardSurround + tileBorder + gridSize/2 + (gridSize + tileBorder * 2) * localPath[0].fromRow + gameManagement.teamArray.indexOf(gameManagement.turn)*2-4);

        for (var i = 0; i < localPath.length; i++) {
            buildRoute += ' L ' + (boardSurround + tileBorder + gridSize/2 + (gridSize + tileBorder * 2) * localPath[i].fromCol) + ' ' + (boardSurround + tileBorder + gridSize/2 + (gridSize + tileBorder * 2) * localPath[i].fromRow);
            //buildRoute += ' L ' + (boardSurround + tileBorder + gridSize/2 + (gridSize + tileBorder * 2) * localPath[i].fromCol + gameManagement.teamArray.indexOf(gameManagement.turn)*2-4) + ' ' + (boardSurround + tileBorder + gridSize/2 + (gridSize + tileBorder * 2) * localPath[i].fromRow + gameManagement.teamArray.indexOf(gameManagement.turn)*2-4);
        }

        route.setAttribute('d', buildRoute);
        route.setAttribute('fill', 'none');
        route.setAttribute('stroke-linecap', 'round');
        route.setAttribute('stroke-linejoin', 'round');
        route.setAttribute('stroke-opacity', '0.5');
        route.style.strokeWidth = '3px';
        pathGroup.appendChild(route);

        let startCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        startCircle.setAttribute('class', localTeam + ' team_fill team_route');
        startCircle.setAttribute('cx', (boardSurround + tileBorder + gridSize/2 + (gridSize + tileBorder * 2) * localPath[0].fromCol));
        startCircle.setAttribute('cy', (boardSurround + tileBorder + gridSize/2 + (gridSize + tileBorder * 2) * localPath[0].fromRow));
        startCircle.setAttribute('r', '3');
        startCircle.style.strokeWidth = '1px';
        startCircle.style.strokeLinecap = 'round';
        startCircle.setAttribute('fill', 'none');
        pathGroup.appendChild(startCircle);

        let endCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        endCircle.setAttribute('class', localTeam + ' team_fill team_route');
        endCircle.setAttribute('cx', (boardSurround + tileBorder + gridSize/2 + (gridSize + tileBorder * 2) * localPath[localPath.length-1].fromCol));
        endCircle.setAttribute('cy', (boardSurround + tileBorder + gridSize/2 + (gridSize + tileBorder * 2) * localPath[localPath.length-1].fromRow));
        endCircle.setAttribute('r', '3');
        endCircle.style.strokeWidth = '1px';
        endCircle.style.strokeLinecap = 'round';
        //endCircle.setAttribute('fill', 'none');
        pathGroup.appendChild(endCircle);

    },

    // Method to draw moon and time on the board
    // -----------------------------------------
    drawMoonLayer: function() {

        // Clear the moon layer before redrawing
        while (moonLayer.lastChild) {
            moonLayer.removeChild(moonLayer.lastChild);
        }

        let moonRadius = (gridSize + tileBorder * 2) * 2 - (10*screenReduction);
        let moonCentreX = (gridSize + tileBorder * 2) * (col - 3) + (gridSize/2 + boardSurround + tileBorder);
        let moonCentreY = boardSurround + tileBorder/2 + (gridSize + tileBorder * 2) * 2;

        // Backing circle of moon
        let moonCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        moonCircle.setAttribute('cx', moonCentreX);
        moonCircle.setAttribute('cy', moonCentreY);
        moonCircle.setAttribute('r', moonRadius);
        moonCircle.setAttribute('fill', 'rgb(233, 211, 183)');
        moonCircle.setAttribute('stroke', 'rgb(233, 211, 183)');
        moonCircle.style.strokeWidth = '1px';
        moonCircle.style.strokeLinecap = 'round';
        moonLayer.appendChild(moonCircle);

        // Obtaining date inputs (moonPhase and moonMonth plus ordinals)
        let dateInputs = gameManagement.moonDate(gameManagement.gameDate);

        // Inputs for drawing moon arcs
        let nearSide = [1, 1, 1, 1, 0.5, 0, 0.5];
        let farSide = [0.5, 0, 0.5, 1, 1, 1, 1];
        let nearSideArc = [1, 1, 1, 1, 1, 0, 0];
        let farSideArc = [0, 0, 1, 1, 1, 1, 1];

        // Lighter moon overlay uses two arcs to give shape of moon - not added in 8th phase (new moon)
        if(dateInputs.moonPhase < 8) {

            let moonArc = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            moonArc.setAttribute('d',
            'M ' + (moonCentreX)  + ' ' + (moonCentreY - moonRadius) +
            ' A ' + (moonRadius*farSide[dateInputs.moonPhase-1]) + ' ' + moonRadius + ' 0 0 ' + farSideArc[dateInputs.moonPhase-1] + ' ' + (moonCentreX)  + ' ' + (moonCentreY + moonRadius) +
            ' A ' + (moonRadius*nearSide[dateInputs.moonPhase-1]) + ' ' + moonRadius + ' 0 0 ' + nearSideArc[dateInputs.moonPhase-1] + ' ' + (moonCentreX)  + ' ' + (moonCentreY - moonRadius)
           );
            moonArc.setAttribute('fill', 'rgb(249, 240, 223)');
            moonArc.setAttribute('stroke', 'rgb(213, 191, 163)');
            moonArc.setAttribute('stroke-linecap', 'round');
            moonArc.setAttribute('stroke-linejoin', 'round');
            moonArc.style.strokeWidth = '1px';
            moonLayer.appendChild(moonArc);
        }

        // Text under the moon
        let timeText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        let text = document.createTextNode(dateInputs.moonPhaseOrd + ' phase of ' + dateInputs.moonMonthOrd + ' moon');
        timeText.setAttribute('font-size', 14 * screenReduction);
        timeText.setAttribute('stroke', 'rgb(179, 156, 128)');
        timeText.setAttribute('fill', 'rgb(179, 156, 128)');
        timeText.setAttribute('x', moonCentreX);
        timeText.setAttribute('y', moonCentreY + moonRadius + 14 * screenReduction + tileBorder);
        timeText.setAttribute('text-anchor', 'middle');
        timeText.setAttribute('font-style', 'italic');
        timeText.appendChild(text);
        moonLayer.appendChild(timeText);

    },

// LAST BRACKET OF OBJECT
}
