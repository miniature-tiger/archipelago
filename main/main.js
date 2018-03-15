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
    let chosenPieceTeam = gameBoard.boardArray[rowForChosenTile][colForChosenTile].pieces.team;
    let chosenSquareActiveStatus = gameBoard.boardArray[rowForChosenTile][colForChosenTile].activeStatus;

    // Commentary on tile clicked on
    console.log(commentary);
    commentary.innerText = gameManagement.turn + ' turn: ' + chosenPieceTeam + ' ' + chosenPieceName + ' on row ' + rowForChosenTile + ' col ' + colForChosenTile;

    // Once "firstGate" is open second click needs to be to an active square
    // Piece move is then made
    if (firstGate) {
        if (chosenSquareActiveStatus == 'active') {
            gameBoard.boardArray[rowForChosenTile][colForChosenTile].pieces = {populatedSquare: true, type: 'cargoShip', team: gameManagement.turn};
            gameBoard.boardArray[pieceMovement.movementArray.fromRow][pieceMovement.movementArray.fromCol].pieces = {populatedSquare: false, type: 'none', team: 'none'};
            pieceMovement.deactivateTiles();
            firstGate = !firstGate;
            gameManagement.nextTurn();
            commentary.innerText = ' turn: ' + gameManagement.turn + ': click on piece' 
        } else {
            // Closing gate and resetting if second click is not valid
            firstGate = false;
            pieceMovement.deactivateTiles();
        }
    }

    // "firstGate" is opened when first click is confirmed valid
    if (!firstGate) {
        if (chosenPieceTeam == gameManagement.turn) {
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
