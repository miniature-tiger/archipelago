// Main script

// ------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------
// SETTING UP GAME BOARD

// High level function to set up the game board
// Calls the various methods of the game board object
// -------------------------------------------------
function boardSetUp(row, col, gridSize, boardShape) {
    gameBoard.populateBoardArray(row, col, boardShape);
    gameBoard.overlayBoardArray(row, col, boardShape);
    gameBoard.drawBoard(row, col, gridSize);
}

// Some button handlers
// --------------------
// These buttons are unlikely to be part of the final gameBoard
// But it is useful to allow the board to be varied dynamically while game play is being developed

// board size button handler
var elSize = document.querySelector('select.boardSizeSelect');
elSize.addEventListener('change', function() {
    row = elSize.value;
    col = elSize.value;
    boardSetUp(row, col, gridSize, boardShape);
});

// board shape button handler
var elShape = document.querySelector('select.boardShapeSelect');
elShape.addEventListener('change', function() {
    boardShape = elShape.value;
    boardSetUp(row, col, gridSize, boardShape);
});



// Parameters for board set up
// ---------------------------
// Intial values for the board size and shape
// Tile size (gridSize) is set here

let row = elSize.value, col = elSize.value, gridSize = 25, boardShape=elShape.value;

// Set up the board
boardSetUp(row, col, gridSize, boardShape);

// ------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------
// SET UP THE SURROUND

// Dynamic size of icons
// ---------------------
let iconHolder = document.querySelectorAll('.icon_holder');
for (var iconHolder_i = 0; iconHolder_i < iconHolder.length; iconHolder_i++) {
    iconHolder[iconHolder_i].style.width = 1.5 * gridSize + 'px';
    iconHolder[iconHolder_i].style.height = 2 * gridSize + 'px';
}


// Set up of compass
// -----------------
// Initial wind direction
let windDirection = compass.largeWindChange();
let needleDirection = compass.directionArray[windDirection].needle;
// Transform / Transition for compass
let needle = document.querySelector('.compass.needle');
needle.style.transform = 'rotate(' + needleDirection + 'deg)';

// Next turn functionality
// -----------------------
var endTurn = document.querySelector('.end_turn');
endTurn.setAttribute('class', 'end_turn ' + gameManagement.turn + ' team_colours');
endTurn.addEventListener('click', function(element) {
    // Used pieces are resert to unused
    pieceMovement.usedPiecesReset();
    // Team is changed
    gameManagement.nextTurn();
    // Wind direction is set for next turn
    windDirection = compass.newWindDirection(windDirection);
    needleDirection = compass.directionArray[windDirection].needle;
    needle = document.querySelector('.compass.needle');
    needle.style.transform = 'rotate(' + needleDirection + 'deg)';
    // Comment for next player
    commentary.innerText = ' turn: ' + gameManagement.turn + ': click on piece';
    // End turn button colour is changed
    endTurn.setAttribute('class', 'end_turn ' + gameManagement.turn + ' team_colours');
});

// ------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------
// PIECE MOVEMENT

// Parameters for piece movement set up
// ------------------------------------
let firstGate = false;

// commentary box - Future work: develop into illustrated commentary by side of board (with flags and pieces)
let commentary = document.querySelector('.contents_box.commentary');
commentary.innerText = ' turn: ' + gameManagement.turn + ': click on piece'

// handler for capturing clicks on board tiles
// As the logic of this section is expanded it will be moved across into the piece movement object
var theBoard = document.querySelector('.boardmark');
theBoard.addEventListener('click', function(element)  {

    // Details of most recent tile clicked on
    let chosenSquare = element.target.closest('.square');
    let chosenPiece = element.target.closest('.piece');
    let colForChosenTile = chosenSquare.id % 1000;
    let rowForChosenTile = (chosenSquare.id - colForChosenTile)/1000;
    let chosenPieceName = gameBoard.boardArray[rowForChosenTile][colForChosenTile].pieces.type;
    let chosenPieceUsed = gameBoard.boardArray[rowForChosenTile][colForChosenTile].pieces.used;
    let chosenPieceTeam = gameBoard.boardArray[rowForChosenTile][colForChosenTile].pieces.team;
    let chosenSquareActiveStatus = gameBoard.boardArray[rowForChosenTile][colForChosenTile].activeStatus;

    // Commentary on tile clicked on

    commentary.innerText = gameManagement.turn + ' turn: ' + chosenPieceTeam + ' ' + chosenPieceUsed + ' ' + chosenPieceName + ' on row ' + rowForChosenTile + ' col ' + colForChosenTile;

    // Once "firstGate" is open second click needs to be to an active square
    // Piece move is then made
    if (firstGate) {
        if (chosenSquareActiveStatus == 'active') {
            gameBoard.boardArray[rowForChosenTile][colForChosenTile].pieces = {populatedSquare: true, type: 'cargoShip', used: 'used', team: gameManagement.turn};
            gameBoard.boardArray[pieceMovement.movementArray.fromRow][pieceMovement.movementArray.fromCol].pieces = {populatedSquare: false, type: 'none', used: 'unused', team: 'none'};
            pieceMovement.deactivateTiles();
            firstGate = !firstGate;

        } else {
            // Closing gate and resetting if second click is not valid
            firstGate = false;
            pieceMovement.deactivateTiles();
        }
    }

    // "firstGate" is opened when first click is confirmed valid
    if (!firstGate) {
        if (chosenPieceTeam == gameManagement.turn && chosenPieceUsed == 'unused') {
            if (chosenPieceName == 'cargoShip') {
                // Future update: capture all movements (to allow potential for replay and undo)
                pieceMovement.movementArray.fromCol = colForChosenTile;
                pieceMovement.movementArray.fromRow = rowForChosenTile;
                pieceMovement.movementArray.piece = chosenPieceName;
                pieceMovement.movementArray.team = chosenPieceTeam;
                firstGate = true;
            } else if (element.target.classList.contains('hut')) {
                // Future update: hut actions
            }
            // If "firstGate" is open potential tiles are activated
            if (firstGate) {
                pieceMovement.activateTiles(rowForChosenTile, colForChosenTile);
            }
        }
    }
    // Redraw gameboard
    gameBoard.drawBoard(row, col, gridSize);
});
