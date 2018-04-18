// Main script

// ------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------
// SETTING UP GAME BOARD

// High level function to set up the game board
// Calls the various methods of the game board object
// -------------------------------------------------

// Parameters for board set up
// Intial values for the board size and shape
// Tile size (gridSize) is set here
let row = 31, col = 31, boardShape='octagon';
let screenWidth = window.screen.width;
let screenHeight = window.screen.innerHeight;

let surroundSize = Math.floor(0.05 * screenWidth);

let mapWidth = screenWidth;
//let gridSize = 22;
let gridSize = Math.round( (mapWidth - 2*surroundSize) / ((col + 3)*1.5) );
let tileBorder = Math.round( 0.25 * gridSize);
let boardSurround = (mapWidth - 31 * (gridSize + tileBorder * 2))/2;

let sideCollection = document.querySelectorAll('.left, .right');

for (var a = 0; a < sideCollection.length; a++) {
  sideCollection[a].style.width = surroundSize + 'px';
}

let headFootCollection = document.querySelectorAll(' .the_header, .the_footer');

for (var c = 0; c < headFootCollection.length; c++) {

    headFootCollection[c].style.width = (screenWidth - 2*surroundSize) + 'px';
    headFootCollection[c].style.left = surroundSize + 'px';
}


// boardMarkNode is board holder in document
let boardMarkNode = document.querySelector('div.boardmark');


// Canvas element createed for board
let board = document.createElement('canvas');
board.setAttribute('id', 'board');
boardMarkNode.appendChild(board);
// Canavs 'canvasBoard' is created and size is set dynamically
let canvasBoard = board.getContext('2d');
canvasBoard.canvas.width = col * (gridSize + tileBorder * 2) + boardSurround * 2;
canvasBoard.canvas.height = row * (gridSize + tileBorder * 2) + boardSurround * 2;


// Canavs 'activeBoard' is created and size is set dynamically
let activeBoard = document.createElement('canvas');
boardMarkNode.appendChild(activeBoard);
let canvasActive = activeBoard.getContext('2d');
canvasActive.canvas.width = row * (gridSize + tileBorder * 2) + boardSurround * 2;
canvasActive.canvas.height = col * (gridSize + tileBorder * 2) + boardSurround * 2;
// ID is set with CSS styles of higher z-index and transparent background to function as overlay
activeBoard.setAttribute('id', 'activeBoard');

// Function to set up board and resource deck and allocate resources
function boardSetUp(row, col, gridSize, boardShape) {
    gameBoard.populateBoardArray(row, col, boardShape);
    gameBoard.overlayBoardArray(row, col, boardShape);

    // Set up of resources
    resourceManagement.populateResourceDeck();
    gameBoard.allocateStartTiles();

    // Drawing of board
    gameBoard.drawBoard(row, col, gridSize);
    gameBoard.drawPieces();
}

// CONSIDER A RESET FUNCTION TO REDRAW WHOLE BOARD BASED ON CURRENT BOARDARRAY
// Clears board for redrawing
//while (boardMarkNode.firstChild) {
//    boardMarkNode.removeChild(boardMarkNode.firstChild);
//}


// Set up the board
boardSetUp(row, col, gridSize, boardShape);



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
// Disengaged until graphics updated
stockDashboard.stockTake();
stockDashboard.drawStock();

// Set up of compass
// -----------------
// Initial wind direction
let windDirection = compass.largeWindChange();
let needleDirection = compass.directionArray[windDirection].needle;
// Transform / Transition for compass
let needle = document.getElementById('needle2');
needle.style.transform = 'rotate(' + needleDirection + 'deg)';


// Next turn functionality
// -----------------------
var endTurn = document.querySelector('.end_turn');
endTurn.setAttribute('class', 'end_turn ' + gameManagement.turn + ' team_fill');
endTurn.addEventListener('click', function() {
    // Used pieces are resert to unused
    pieceMovement.usedPiecesReset();
    // Team is changed
    gameManagement.nextTurn();
    // Wind direction is set for next turn
    windDirection = compass.newWindDirection(windDirection);
    needleDirection = compass.directionArray[windDirection].needle;

    needle.style.transform = 'rotate(' + needleDirection + 'deg)';

    // Automated movement for pirates
    if(gameManagement.turn == 'Pirate') {
        pirates.automatePirates();
    }


    // Comment bar reset
    commentary.style.bottom = '-10%';
    // End turn button colour is changed
    endTurn.setAttribute('class', 'end_turn ' + gameManagement.turn + ' team_fill');

    // Update the stock dashboard
    stockDashboard.stockTake();
    stockDashboard.drawStock();

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
let commentary = document.querySelector('.commentary');

// handler for capturing clicks on board tiles
// As the logic of this section is expanded it will be moved across into the piece movement object



// boardMarkNode is board holder in document
let boardMarkLeft = boardMarkNode.offsetLeft;
let boardMarkTop = boardMarkNode.offsetTop;

boardMarkNode.addEventListener('click', function(event) {
    let xClick = event.pageX - boardMarkLeft;
    let yClick = event.pageY - boardMarkTop;

    let xClickTile = Math.floor((xClick - boardSurround) / (gridSize + tileBorder * 2));
    let yClickTile = Math.floor((yClick - boardSurround) / (gridSize + tileBorder * 2));

    // Obtain details of most recent tile clicked on - separated between start and end points
    pieceMovement.captureMove(startEnd, yClickTile, xClickTile);


    // "Start" piece validation on first click
    if (startEnd == 'start') {
        // Commentary on tile clicked on
        commentary.innerHTML = pieceMovement.movementArray[startEnd].pieces.team + ' ' + pieceMovement.movementArray[startEnd].pieces.type;
        commentary.style.bottom = 0;
        commentary.appendChild(gameBoard.createActionTile(pieceMovement.movementArray[startEnd].row, pieceMovement.movementArray[startEnd].col, gameBoard.boardArray[pieceMovement.movementArray.start.row][pieceMovement.movementArray.start.col].pieces.type, gameBoard.boardArray[pieceMovement.movementArray.start.row][pieceMovement.movementArray.start.col].pieces.team, 'startPiece', 10, screenWidth * 0.4, 1.5, 0));

        if (pieceMovement.movementArray[startEnd].pieces.populatedSquare) {
            // Claiming of unclaimed resources
            if (pieceMovement.movementArray[startEnd].pieces.category == 'Resources' && pieceMovement.movementArray[startEnd].pieces.type != 'desert' && pieceMovement.movementArray[startEnd].pieces.team == 'Unclaimed') {
                if (pieceMovement.shipAvailable()) {
                    // TO ADD - Check that ship has not previously landed crew somewhere
                    commentary.innerHTML += ' <br>(click again to claim resource)';
                    startEnd  = 'end';
                    gameBoard.boardArray[pieceMovement.movementArray.start.row][pieceMovement.movementArray.start.col].activeStatus = 'active';
                    gameBoard.drawActiveTiles();
                }

            // Piece movement
            } else if (pieceMovement.movementArray[startEnd].pieces.team  == gameManagement.turn && pieceMovement.movementArray[startEnd].pieces.used == 'unused') {
                if (pieceMovement.movementArray[startEnd].pieces.type == 'cargo ship') {
                    commentary.innerHTML += ' <br>(click any red tile to move)';
                    // If "Start" piece is validated startEnd gate is opened and potential tiles are activated
                    startEnd  = 'end';
                    pieceMovement.activateTiles(pieceMovement.movementArray.start.row, pieceMovement.movementArray.start.col, maxMove, true);
                    // Redraw gameboard to show activated tiles
                    gameBoard.drawActiveTiles();
                }
            }
        }
    // Once "start" piece has been selected second click needs to be to an active "end" square
    // Piece move is then made
    } else if (startEnd == 'end') {
        // Removing commentary
        commentary.style.bottom = '-10%';
        if (pieceMovement.movementArray[startEnd].activeStatus == 'active') {
            // Claiming of unclaimed resources
            if (pieceMovement.movementArray[startEnd].pieces.category == 'Resources' && pieceMovement.movementArray[startEnd].pieces.type != 'desert' && pieceMovement.movementArray[startEnd].pieces.team == 'Unclaimed') {
                pieceMovement.deactivateTiles(1);
                gameBoard.drawActiveTiles();
                // Calculate placement on board of resource tile to be altered
                let IDPiece = 'tile' + Number(pieceMovement.movementArray.end.row*1000 + pieceMovement.movementArray.end.col);
                document.getElementById(IDPiece).remove();
                gameBoard.boardArray[pieceMovement.movementArray.end.row][pieceMovement.movementArray.end.col].pieces.team = gameManagement.turn;
                boardMarkNode.appendChild(gameBoard.createActionTile(pieceMovement.movementArray.end.row, pieceMovement.movementArray.end.col, gameBoard.boardArray[pieceMovement.movementArray.end.row][pieceMovement.movementArray.end.col].pieces.type, gameBoard.boardArray[pieceMovement.movementArray.end.row][pieceMovement.movementArray.end.col].pieces.team,
                  'tile' + Number((pieceMovement.movementArray.end.row)*1000 + (pieceMovement.movementArray.end.col)), boardSurround + tileBorder/2 + (gridSize + tileBorder * 2) * pieceMovement.movementArray.end.row, boardSurround + tileBorder/2 + (gridSize + tileBorder * 2) * pieceMovement.movementArray.end.col, 1, gameBoard.boardArray[pieceMovement.movementArray.end.row][pieceMovement.movementArray.end.col].pieces.direction));
                startEnd = 'start';
            // Piece movement
            } else if (pieceMovement.movementArray.start.pieces.type == 'cargo ship') {
                pieceMovement.deactivateTiles(maxMove);
                // Redraw active tile layer after deactivation to remove activated tiles
                gameBoard.drawActiveTiles();
                pieceMovement.shipTransition();

            }
        } else {
            // Resetting if second click is not valid
            pieceMovement.deactivateTiles(maxMove);
            gameBoard.drawActiveTiles();

            // Resetting movement array once second click has been made (if invalid)
            pieceMovement.movementArray = {start: {row: '', col: ''}, end: {row: '', col: ''}};
            startEnd = 'start';
        }

        // Update the stock dashboard
        stockDashboard.stockTake();
        stockDashboard.drawStock();
    }
});
