// Main script

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
elSize.addEventListener('click', function() {
    row = elSize.value;
    col = elSize.value;
    boardSetUp(row, col, gridSize, boardShape);

});

// board shape button handler
var elShape = document.querySelector('select.boardShapeSelect');
elShape.addEventListener('click', function() {
    boardShape = elShape.value;
    boardSetUp(row, col, gridSize, boardShape);

});

// PARAMETERS
// ----------
// Intial values for the board size and shape
// Tile size (gridSize) is set here
let row = 40, col = 40, gridSize = 25, boardShape='octagon';

// Set up the board
boardSetUp(row, col, gridSize, boardShape);

