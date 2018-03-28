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
var elSize = document.querySelector('.boardSizeSelect');
elSize.addEventListener('click', function(element) {
    if(element.target.classList.contains('boardSizeSelect_31')) {
        row = 31;
        col = 31;
        boardSetUp(row, col, gridSize, boardShape);
    } else if (element.target.classList.contains('boardSizeSelect_40')) {
        row = 40;
        col = 40;
        boardSetUp(row, col, gridSize, boardShape);
    }
});

// board shape button handler
var elShape = document.querySelector('.boardShapeSelect');
elShape.addEventListener('click', function(element) {
    if(element.target.classList.contains('boardShapeSelect_octagon')) {
        boardShape = 'octagon';
        boardSetUp(row, col, gridSize, boardShape);
    } else if (element.target.classList.contains('boardShapeSelect_square')) {
        boardShape = 'square';
        boardSetUp(row, col, gridSize, boardShape);
    }
});

// Parameters for board set up
// ---------------------------
// Intial values for the board size and shape
// Tile size (gridSize) is set here

let row = 31, col = 31, gridSize = 25, boardShape='octagon';

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

// Set up of stock dashboard
// -------------------------
stockDashboard.stockTake();
stockDashboard.drawStock();

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
endTurn.addEventListener('click', function() {
    // Used pieces are resert to unused
    pieceMovement.usedPiecesReset();
    // Team is changed
    gameManagement.nextTurn();
    // Wind direction is set for next turn
    windDirection = compass.newWindDirection(windDirection);
    needleDirection = compass.directionArray[windDirection].needle;
    needle = document.querySelector('.compass.needle');
    needle.style.transform = 'rotate(' + needleDirection + 'deg)';

    // Automated movement for pirates
    if(gameManagement.turn == 'teamPirate') {
        pirates.automatePirates();
    }


    // Comment for next player
    commentary.innerText = ' turn: ' + gameManagement.turn + ': click on piece';
    // End turn button colour is changed
    endTurn.setAttribute('class', 'end_turn ' + gameManagement.turn + ' team_colours');



});

// Settings pop-up box
// --------------------
var settingsIcon = document.querySelector('.settingsmark');
var settingsPopup = document.querySelector('.settings_popup');
var settingsClose = document.querySelector('.settings_close');

settingsIcon.addEventListener('click', function(element) {
    settingsPopup.style.display = "block";
});

settingsClose.addEventListener('click', function(element) {
    settingsPopup.style.display = "none";
});

// When the user clicks anywhere outside of the modal, close it
window.addEventListener('click', function(element) {
    if (element.target == settingsPopup) {
        settingsPopup.style.display = "none";
    }
});





// ------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------
// PIECE MOVEMENT

// Parameters for piece movement set up
// ------------------------------------

// Maximum number of iterations for movement and thus maximum number of tiles that can be moved
// --- movement is also influenced by the movement cost
// --- once more transport is created this will all need to be built into an array if it desired that different ships move at different speeds
let maxMove = 3;

// Variables for clicked tiles with startEnd indicating the start or end of the move
let startEnd = 'start';
let chosenSquare = {start: '', end: ''};
let chosenHolding = {start: '', end: ''};

// commentary box - Future work: develop into illustrated commentary by side of board (with flags and pieces)
let commentary = document.querySelector('.contents_box.commentary');
commentary.innerText = ' turn: ' + gameManagement.turn + ': click on piece'

// handler for capturing clicks on board tiles
// As the logic of this section is expanded it will be moved across into the piece movement object
var theBoard = document.querySelector('.boardmark');
theBoard.addEventListener('click', function(element) {
    // Capturing the clicked tile information and recording moves

    chosenSquare[startEnd] = element.target.closest('.square');
    chosenHolding[startEnd] = element.target.closest('.holding');

    // Obtain details of most recent tile clicked on - separated between start and end points
    pieceMovement.captureMove(startEnd, chosenSquare);

    // Commentary on tile clicked on
    commentary.innerText = gameManagement.turn + ' turn: ' + pieceMovement.movementArray[startEnd].team + ' ' + pieceMovement.movementArray[startEnd].used + ' ' + pieceMovement.movementArray[startEnd].type + ' on row ' + pieceMovement.movementArray[startEnd].row + ' col ' + pieceMovement.movementArray[startEnd].col;

    // Once "start" piece has been selected second click needs to be to an active "end" square
    // Piece move is then made
    if (startEnd == 'end') {
        if (pieceMovement.movementArray[startEnd].activeStatus == 'active') {
            pieceMovement.deactivateTiles(maxMove);
            pieceMovement.shipTransition();
            stockDashboard.stockTake();
            stockDashboard.drawStock();
        } else {
            // Resetting if second click is not valid
            pieceMovement.deactivateTiles(maxMove);

            // Redraw gameboard to show deactivated tiles
            gameBoard.drawBoard(row, col, gridSize);
        }
        // Resetting movement array once second click has been made (whether valid or invalid)
        pieceMovement.movementArray = {start: {row: '', col: ''}, end: {row: '', col: ''}};
        startEnd = 'start';
    }

    // "Start" piece validation on first click
    if (startEnd == 'start') {
        if (pieceMovement.movementArray[startEnd].team  == gameManagement.turn && pieceMovement.movementArray[startEnd].used == 'unused') {
            if (pieceMovement.movementArray[startEnd].type == 'cargo') {
                startEnd  = 'end';
            } else if (pieceMovement.movementArray[startEnd].type == 'hut') {
                // Future update: hut actions
            }
            // If "Start" piece is validated potential tiles are activated
            if (startEnd == 'end') {
                pieceMovement.activateTiles(pieceMovement.movementArray.start.row, pieceMovement.movementArray.start.col, maxMove, true);

                // Redraw gameboard to show activated tiles
                gameBoard.drawBoard(row, col, gridSize);
            }
        }
    }

});
