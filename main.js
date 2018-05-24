// Main script

// Setting up developer tools
// --------------------------
// --------------------------

const launchTime = Date.now();
let workFlow = 1;
let gameBoardTrack = 0;
let transitionMonitor = 1;





// ------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------
// SETTING UP GAME BOARD

// High level function to set up the game board
// Calls the various methods of the game board object
// -------------------------------------------------

if(workFlow == 1) {
    console.log('----- Start of Set Up -----');
    console.log('Setting up the game board: ' + (Date.now() - launchTime));
}

// Parameters for board set up
// Intial values for the board size and shape
// Tile size (gridSize) is set here
let row = 31, col = 31, boardShape='octagon';
let screenWidth = window.innerWidth;
let innerHeight = window.innerHeight;
let screenReduction = window.innerWidth/1280;

let surroundSize = Math.floor(0.065 * screenWidth);

let mapWidth = screenWidth;
let gridSize = Math.round( (mapWidth - 2*surroundSize) / ((col + 3)*1.5) );
let tileBorder = Math.round(0.25 * gridSize);
let boardSurround = (mapWidth - 31 * (gridSize + tileBorder * 2))/2;

let sideCollection = document.querySelectorAll('.left, .right');

for (var a = 0; a < sideCollection.length; a++) {
  sideCollection[a].style.width = surroundSize + 'px';
  sideCollection[a].style.fontSize = (0.6 * screenReduction) + 'em';
}

let headFootCollection = document.querySelectorAll(' .the_header, .the_footer, .commentary');

for (var c = 0; c < headFootCollection.length; c++) {

    headFootCollection[c].style.width = (screenWidth - 2*surroundSize) + 'px';
    headFootCollection[c].style.left = surroundSize + 'px';
    headFootCollection[c].style.fontSize = (0.8 * screenReduction) + 'em';
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

// Canvas 'activeBoard' (for active tiles that can be moved to) is created and size is set dynamically
let activeBoard = document.createElement('canvas');
boardMarkNode.appendChild(activeBoard);
let canvasActive = activeBoard.getContext('2d');
canvasActive.canvas.width = row * (gridSize + tileBorder * 2) + boardSurround * 2;
canvasActive.canvas.height = col * (gridSize + tileBorder * 2) + boardSurround * 2;
// ID is set with CSS styles of higher z-index and transparent background to function as overlay
activeBoard.setAttribute('id', 'activeBoard');

// SVG layer for trade routes set up
let tradeRouteLayer = gameBoard.createTradeRouteLayer();
boardMarkNode.appendChild(tradeRouteLayer);

// Function to set up board and resource deck and allocate resources
function boardSetUp(row, col, gridSize, boardShape) {
    gameBoard.populateBoardArray(row, col, boardShape);
    gameBoard.overlayBoardArray(row, col, boardShape);
    pirates.safeHarbour();

    // Set up of resources
    resourceManagement.populateResourceDeck();
    //gameBoard.allocateStartTiles();

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

// Game speed (0.6, 1, 1.5)

let gameSpeedRef = gameManagement.optionsArray[0].options.findIndex(item => item.active == true);
let gameSpeed = gameManagement.optionsArray[0].options[gameSpeedRef].constant;


// board size button handler
/*var elSize = document.querySelector('.boardSizeSelect');
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
});*/


// ------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------
// SET UP THE SURROUND

// Dynamic size of icons
// ---------------------
/*let iconHolder = document.querySelectorAll('.icon_holder');
for (var iconHolder_i = 0; iconHolder_i < iconHolder.length; iconHolder_i++) {

    iconHolder[iconHolder_i].style.width = (0.7*surroundSize) + 'px';
    iconHolder[iconHolder_i].style.height = surroundSize + 'px';
}*/



// Set up of stock dashboard and contracts dashboard
// -------------------------------------------------

if(workFlow == 1) {console.log('Set up of stock dashboard and contracts dashboard: ' + (Date.now() - launchTime)); }

stockDashboard.populateGoodsTotals();
stockDashboard.newTurnGoods();
stockDashboard.stockTake();
stockDashboard.drawStock();
tradeContracts.populateContracts();
tradeContracts.drawContracts();

// Set up of goods dashboard
// -------------------------


stockDashboard.goodsStockTake();

  //console.log(gameBoard.boardArray);


// Set up of compass
// -----------------
if(workFlow == 1) {console.log('Set up of compass: ' + (Date.now() - launchTime)); }

// Initial wind direction
let windDirection = compass.largeWindChange();
let needleDirection = compass.directionArray[windDirection].needle;
// Transform / Transition for compass
let needle = document.getElementById('needle2');
needle.style.transform = 'rotate(' + needleDirection + 'deg)';


// Next turn functionality
// -----------------------

function nextTurn() {
    // Used pieces are resert to unused
    if(workFlow == 1) {console.log(' ------ Next turn: ---------: ' + (Date.now() - launchTime)); }
    // Resetting if second click not applied
    pieceMovement.deactivateTiles(maxMove);
    gameBoard.drawActiveTiles();

    // Resetting movement array in case second click has not been made
    pieceMovement.movementArray = {start: {row: '', col: ''}, end: {row: '', col: ''}};
    startEnd = 'start';

    // Removing commentary goods event handler
    commentary.removeEventListener('click', clickGoods);
    clearCommentary();

    // Resetting used pieces
    pieceMovement.usedPiecesReset();

    // Team is changed
    gameManagement.nextTurn();

    if(workFlow == 1) {console.log('Turn changed to ' + gameManagement.turn + ' : ' + (Date.now() - launchTime)); }
    if(gameBoardTrack == 1) {console.log(gameBoard.boardArray); }

    // Wind direction is set for next turn
    windDirection = compass.newWindDirection(windDirection);
    needleDirection = compass.directionArray[windDirection].needle;

    needle.style.transform = 'rotate(' + needleDirection + 'deg)';

    // Comment bar reset
    commentary.style.bottom = '-10%';
    // End turn button colour is changed
    endTurn.setAttribute('class', gameManagement.turn + ' team_fill team_stroke');

    // Repair ships
    pieceMovement.harbourRepair();

    // Automated movement for pirates
    if (gameManagement.turn == 'Pirate') {
        pirates.automatePirates();
    } else {
        // Chance of new trade contract
        // TO ADD - turn counter - only have contracts issued after a certain number of turns
        if(workFlow == 1) {console.log('Checking for new trade contracts: ' + (Date.now() - launchTime)); }
        tradeContracts.newContract();

        // Manage goods
        if(workFlow == 1) {console.log('Adding new goods production: ' + (Date.now() - launchTime)); }
        stockDashboard.newTurnGoods();

        // Update the stock dashboard
        if(workFlow == 1) {console.log('Updating stock dashboard and contracts dashboard: ' + (Date.now() - launchTime)); }
        stockDashboard.stockTake();
        stockDashboard.drawStock();

        // Update the contracts dashboard
        tradeContracts.drawContracts();

        // Update the goods dashboard
        stockDashboard.goodsStockTake();
    }
}

var endTurn = document.querySelector('.endturnmark');
endTurn.setAttribute('class', gameManagement.turn + ' team_fill team_stroke');
gameManagement.createTurnCircle(false, 0.7*surroundSize/100, -20*screenReduction, 0.15*surroundSize, endTurn, 'icon_holder');
endTurn.addEventListener('click', nextTurn);


// Settings pop-up box
// --------------------

if(workFlow == 1) {console.log('Creating settings pop up icon and box: ' + (Date.now() - launchTime)); }

var settingsIcon = document.querySelector('.settingsmark');
var settingsPopup = document.querySelector('.settings_popup');

// Icon in bottom left corner
gameManagement.createSettingsCog(false, 0.7*surroundSize/100, -20*screenReduction, 0.15*surroundSize, settingsIcon, 'icon_holder');
// Settings pop up box
gameManagement.createSettingsCog(true, screenWidth*(12/2000), 0, (screenWidth*4/20), settingsPopup, 'popup_cog');
var popupCog = document.querySelector('.popup_cog');
popupCog.appendChild(gameManagement.panelCircle(screenWidth*(12/2000)));
gameManagement.createSettingsPanel(screenWidth*(12/2000), 0, (screenWidth*4/20), settingsPopup, 'popup_panel');
var settingsPanel = document.querySelector('.popup_panel');
gameManagement.createSettingsIcons(true, screenWidth*(12/2000), 0, (screenWidth*4/20), popupCog, 'popup_cog');

// Event handler for setting pop up launch
settingsIcon.addEventListener('click', function() {
    settingsPanel.appendChild(gameManagement.panelText(screenWidth*(12/2000), 23, 'Select an icon.', 'Or click x to close settings.'));
    settingsPopup.style.display = "block";
    popupCog.style.display = "block";
    // Event handler for settings pop up once launched
    window.addEventListener('click', popRunClose);
});

function popRunClose(e) {
    console.log('window event listener');
    if (e.target == settingsPopup) {
        gameManagement.clearPanel();
        settingsPopup.style.display = "none";
        window.removeEventListener('click', popRunClose);
    } else {
        gameManagement.manageSettings(e, screenWidth*(12/2000));
    }
};

// ------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------
// PIECE MOVEMENT

// Parameters for piece movement set up
// ------------------------------------

if(workFlow == 1) {
    console.log('Setting up piece movement parameters and commentary: ' + (Date.now() - launchTime));
    console.log('----- End of Set Up -----');
}

// Maximum number of iterations for movement and thus maximum number of tiles that can be moved
// --- movement is also influenced by the movement cost
// --- once more transport is created this will all need to be built into an array if it desired that different ships move at different speeds
let maxMove = 5;

// Variables for clicked tiles with startEnd indicating the start or end of the move
let startEnd = 'start';
let chosenSquare = {start: '', end: ''};
let chosenHolding = {start: '', end: ''};

// commentary box - Future work: develop into illustrated commentary by side of board (with flags and pieces)
let commentary = document.querySelector('.commentary');
let firstLineComment = document.querySelector('#firstLine');
let secondLineComment = document.querySelector('#secondLine');

// Amount of stock to be loaded / unloaded
let loadingStock = 0;

// Resets commentary
function clearCommentary() {
    if(workFlow == 1) {console.log('Clearing commentary: ' + (Date.now() - launchTime)); }
    for (var i = commentary.children.length - 1; i > -1; i--) {
        if (commentary.children[i].id == 'firstLine' || commentary.children[i].id == 'secondLine') {
            commentary.children[i].innerText = '';
        } else if (commentary.children[i].nodeName == 'BR') {
            // no action
        } else {
            commentary.children[i].remove();
        }
    }
}

// Function for goods quantity selection
// ------------------------------------

function clickGoods(e) {
    if(workFlow == 1) {console.log('Goods quantity selection: ' + (Date.now() - launchTime)); }
    let xClickCommentary = e.clientX - commentary.offsetLeft;
    let element = e.target;

    // Finds icon selected based on id at icon parent level
    if(element != commentary) {
        while (element.id == '') {
            element = element.parentNode;
        }

        let iconFound = false;
        // Loops through all goods icons shown
        for (var k = 0; k < pieceMovement.movementArray.start.pieces.stock; k++) {
            stockID = '#stock' + k;
            let currentIcon = document.querySelector(stockID);
            // Until chosen icon is reached goods are changed colour using CSS classes
            if (iconFound == false) {
                for (var h = 0; h < currentIcon.children.length; h++) {
                    let nextChild = currentIcon.children[h];
                    nextChild.setAttribute('class', currentIcon.className.baseVal + ' ' + gameManagement.turn + ' team_stroke team_fill');
                }
                // Actions when icon is reached
                if (element.id == 'stock' + k) {
                    iconFound = true;
                    loadingStock = k + 1;
                    if (pieceMovement.movementArray.start.pieces.category == 'Transport') {
                        secondLineComment.innerText = 'Click settlement or resource tile to unload - ' + pieceMovement.movementArray.start.pieces.goods + ': ' + (k + 1);
                    } else if (pieceMovement.movementArray.start.pieces.category == 'Resources') {
                        secondLineComment.innerText = 'Click ship to load - ' + pieceMovement.movementArray.start.pieces.goods + ': ' + (k + 1);
                    }
                }

                // CSS classes are removed to reset colours if necessary
            } else {
                for (var h = 0; h < currentIcon.children.length; h++) {
                    let nextChild = currentIcon.children[h];
                    if (nextChild.classList.contains(gameManagement.turn)) {
                        nextChild.classList.remove(gameManagement.turn);
                    }
                    if (nextChild.classList.contains('team_stroke')) {
                        nextChild.classList.remove('team_stroke');
                    }
                    if (nextChild.classList.contains('team_fill')) {
                        nextChild.classList.remove('team_fill');
                    }
                }
            }
        }
    }

    // Alternative approach based on positioning - keep code
    /* if (xClickCommentary > (screenWidth - 2*surroundSize) * 0.7 - tileBorder/2 - (0.5 * (gridSize + tileBorder) / 1.5) && xClickCommentary < (screenWidth - 2*surroundSize) * 0.7 - tileBorder/2 + ((10 - 0.5) * (gridSize + tileBorder) / 1.5) ) {
        //if (yClickCommentary > 10 && yClickCommentary < 10 + (Math.floor((pieceMovement.movementArray.start.pieces.stock-1)/10)+1) * ((gridSize + tileBorder) / 1.5)) {
            //let xClickGoods = Math.floor(((screenWidth - 2*surroundSize) * 0.7 - tileBorder/2 - (0.5 * (gridSize + tileBorder) / 1.5), xClickCommentary - ((screenWidth - 2*surroundSize) * 0.7 - tileBorder/2 - (0.5 * (gridSize + tileBorder) / 1.5))) / ((gridSize + tileBorder) / 1.5)) + 1;
            //let yClickGoods = Math.floor((yClickCommentary - 10) / ((gridSize + tileBorder) / 1.5)) + 1;
            let icons = document.querySelector('.iconColourChange');
            icons.setAttribute('class', 'iconColourChange ' + gameManagement.turn +  ' team_stroke team_fill');
            //(screenWidth - 2*surroundSize) * 0.7 - tileBorder/2 + (((i % 10) - 0.5) * (gridSize + tileBorder) / 1.5)
      //  }
    } */
};



// handler for capturing clicks on board tiles
// As the logic of this section is expanded it will be moved across into the piece movement object

// Event handler for board
// -----------------------


function boardHandler(event) {
    if(workFlow == 1) {console.log('Board mark node click event listener triggered. Start/End = ' + startEnd + ': ' + (Date.now() - launchTime)); }
    let xClick = event.pageX - boardMarkLeft;
    let yClick = event.pageY - boardMarkTop;

    let xClickTile = Math.floor((xClick - boardSurround) / (gridSize + tileBorder * 2));
    let yClickTile = Math.floor((yClick - boardSurround) / (gridSize + tileBorder * 2));

    // Obtain details of most recent tile clicked on - separated between start and end points
    pieceMovement.captureMove(startEnd, yClickTile, xClickTile);

    // "Start" piece validation on first click
    if (startEnd == 'start') {
        // Commentary on tile clicked on
        clearCommentary();
        commentary.appendChild(gameBoard.createActionTile(pieceMovement.movementArray.start.row, pieceMovement.movementArray.start.col, pieceMovement.movementArray.start.pieces.type, pieceMovement.movementArray.start.pieces.team, 'startPiece', 10, (screenWidth - 2*surroundSize) * 0.3 - (gridSize + 2*tileBorder)/2, 1.5, 0));
        for (var i = 0; i < pieceMovement.movementArray.start.pieces.stock; i++) {
            //console.log(gameBoard.createIcon('stock' + i, 1.5, pieceMovement.movementArray.start.pieces.goods, (screenWidth - 2*surroundSize) * 0.6 + ((i+2) * (gridSize + tileBorder) / 1.5), 10));
            commentary.appendChild(gameBoard.createIcon('stock' + i, 1.5, pieceMovement.movementArray.start.pieces.goods, (screenWidth - 2*surroundSize) * 0.7 - tileBorder/2 + (((i % 10) - 0.5) * (gridSize + tileBorder) / 1.5), 10 + Math.floor(i/10) * ((gridSize + tileBorder) / 1.5)));
        }

        firstLineComment.innerText = pieceMovement.movementArray[startEnd].pieces.team + ' ' + pieceMovement.movementArray[startEnd].pieces.type;
        if (pieceMovement.movementArray[startEnd].pieces.stock > 0) {
              firstLineComment.insertAdjacentText('beforeend', ' - ' + pieceMovement.movementArray[startEnd].pieces.goods + ": " + pieceMovement.movementArray[startEnd].pieces.stock);
        }
        commentary.style.bottom = 0;

        // commentary event handler for goods
        if(pieceMovement.movementArray.start.pieces.team == gameManagement.turn && pieceMovement.movementArray.start.pieces.stock > 0) {
            secondLineComment.innerText = 'Select quantity of goods to load';
            commentary.addEventListener('click', clickGoods);
        }

        if (pieceMovement.movementArray[startEnd].pieces.populatedSquare) {

            // Claiming of unclaimed resources
            if (pieceMovement.movementArray[startEnd].pieces.category == 'Resources' && pieceMovement.movementArray[startEnd].pieces.type != 'desert' && pieceMovement.movementArray[startEnd].pieces.team == 'Unclaimed') {
                // Check that this resource type is not already held by player
                let pieceTotalsTeamPosition = stockDashboard.pieceTotals.findIndex(fI => fI.team == gameManagement.turn);
                if(stockDashboard.pieceTotals[pieceTotalsTeamPosition].pieces[pieceMovement.movementArray.start.pieces.type] == 0) {
                    if (pieceMovement.shipAvailable('crew') == 'crew') {
                        // TO ADD - Check that ship has not previously landed crew somewhere
                        secondLineComment.innerText = 'Click ship to land team and claim resource';
                        startEnd = 'end';
                        gameBoard.drawActiveTiles();
                    }
                } else {
                    secondLineComment.innerText = 'You have already claimed your ' + pieceMovement.movementArray[startEnd].pieces.type;
                }

            // Loading of a ship
          } else if (((pieceMovement.movementArray.start.pieces.category == 'Resources' && pieceMovement.movementArray.start.pieces.type != 'desert') || pieceMovement.movementArray.start.pieces.category == 'Settlements') && pieceMovement.movementArray[startEnd].pieces.team == gameManagement.turn) {
                if (pieceMovement.shipAvailable(pieceMovement.movementArray.start.pieces.goods) == 'compatible') {
                    if (pieceMovement.movementArray.start.pieces.stock > 0) {
                        startEnd = 'end';
                        gameBoard.drawActiveTiles();
                    } else if (pieceMovement.movementArray.start.pieces.stock == 0) {
                        secondLineComment.innerText = 'No goods to be loaded';
                    }
                } else if (pieceMovement.shipAvailable(pieceMovement.movementArray.start.pieces.goods) == 'incompatible') {
                    secondLineComment.innerText = 'Docked ship already carrying different goods';
                }

            // Piece movement
            } else if (pieceMovement.movementArray[startEnd].pieces.team == gameManagement.turn && pieceMovement.movementArray[startEnd].pieces.used == 'unused') {
                if (pieceMovement.movementArray[startEnd].pieces.type == 'cargo ship' && (pieceMovement.movementArray[startEnd].pieces.damageStatus == 'good' || pieceMovement.movementArray[startEnd].pieces.damageStatus == 'damaged')) {
                    secondLineComment.innerText = 'Click any red tile to move';
                    // If "Start" piece is validated startEnd gate is opened and potential tiles are activated
                    startEnd = 'end';
                    if (pieceMovement.movementArray.start.pieces.damageStatus == 'damaged') {
                        pieceMovement.activateTiles(pieceMovement.movementArray.start.row, pieceMovement.movementArray.start.col, 2.1, 2, true, 'damaged');
                    } else if (pieceMovement.movementArray.start.pieces.damageStatus == 'good') {
                        pieceMovement.activateTiles(pieceMovement.movementArray.start.row, pieceMovement.movementArray.start.col, maxMove, maxMove, true, 'good');
                    }
                    // Redraw gameboard to show activated tiles
                    gameBoard.drawActiveTiles();
                    console.log('within boardMArkNode loop');
                    console.log(pieceMovement.movementArray);
                }
            }

            // Unloading of a ship
            if (pieceMovement.movementArray.start.pieces.team == gameManagement.turn && pieceMovement.movementArray.start.pieces.type == 'cargo ship' && pieceMovement.movementArray.start.pieces.stock > 0) {

                // Delivery of goods for contract
                let depotSearch = pieceMovement.depotAvailable(pieceMovement.movementArray.start.pieces.goods);
                if (depotSearch.includes('fort delivery')) {
                    if (pieceMovement.movementArray.start.pieces.used == 'unused') {
                        secondLineComment.insertAdjacentText('beforeend',' or deliver goods');
                    } else {
                        secondLineComment.innerText = 'Click red tile to deliver goods';
                    }
                    startEnd = 'end';
                    // Redraw gameboard to show activated tiles
                    gameBoard.drawActiveTiles();

                // Unloading to own team fort or resource tile
                } else if (depotSearch.includes(pieceMovement.movementArray.start.pieces.goods) || depotSearch.includes('fort compatible')) {
                    if (pieceMovement.movementArray.start.pieces.used == 'unused') {
                        secondLineComment.insertAdjacentText('beforeend',' or select quantity of goods to unload');
                    } else {
                        secondLineComment.innerText = 'Select quantity of goods to unload';
                    }
                    startEnd = 'end';
                    // Redraw gameboard to show activated tiles
                    gameBoard.drawActiveTiles();
                } else if (depotSearch.includes('fort incompatible') && pieceMovement.movementArray.start.pieces.used == 'used') {
                    secondLineComment.innerText = 'Fort can only hold one goods type';
                }
            }
        }
    // Once "start" piece has been selected second click needs to be to an active "end" square
    // Piece move is then made
    } else if (startEnd == 'end') {
        // Removing commentary
        commentary.style.bottom = '-10%';
        if (pieceMovement.movementArray.end.activeStatus == 'active') {
            // Claiming of unclaimed resources
            if (pieceMovement.movementArray.end.pieces.category == 'Transport' && pieceMovement.movementArray.start.pieces.type != 'desert' && pieceMovement.movementArray.start.pieces.team == 'Unclaimed') {
                pieceMovement.deactivateTiles(1);
                gameBoard.drawActiveTiles();
                // Calculate placement on board of resource tile to be altered
                let IDPiece = 'tile' + Number(pieceMovement.movementArray.start.row*1000 + pieceMovement.movementArray.start.col);
                document.getElementById(IDPiece).remove();
                gameBoard.boardArray[pieceMovement.movementArray.start.row][pieceMovement.movementArray.start.col].pieces.team = gameManagement.turn;
                boardMarkNode.appendChild(gameBoard.createActionTile(pieceMovement.movementArray.start.row, pieceMovement.movementArray.start.col, gameBoard.boardArray[pieceMovement.movementArray.start.row][pieceMovement.movementArray.start.col].pieces.type, gameBoard.boardArray[pieceMovement.movementArray.start.row][pieceMovement.movementArray.start.col].pieces.team,
                  'tile' + Number((pieceMovement.movementArray.start.row)*1000 + (pieceMovement.movementArray.start.col)), boardSurround + tileBorder/2 + (gridSize + tileBorder * 2) * pieceMovement.movementArray.start.row, boardSurround + tileBorder/2 + (gridSize + tileBorder * 2) * pieceMovement.movementArray.start.col, 1, gameBoard.boardArray[pieceMovement.movementArray.start.row][pieceMovement.movementArray.start.col].pieces.direction));
                startEnd = 'start';

            // Loading of goods
            } else if ((pieceMovement.movementArray.start.pieces.category == 'Resources' || pieceMovement.movementArray.start.pieces.category == 'Settlements') && pieceMovement.movementArray.end.pieces.type == 'cargo ship') {
                pieceMovement.deactivateTiles(1);
                gameBoard.drawActiveTiles();
                //loadingStock = gameBoard.boardArray[pieceMovement.movementArray.start.row][pieceMovement.movementArray.start.col].pieces.stock;
                loadingGoods = gameBoard.boardArray[pieceMovement.movementArray.start.row][pieceMovement.movementArray.start.col].pieces.goods;
                gameBoard.boardArray[pieceMovement.movementArray.start.row][pieceMovement.movementArray.start.col].pieces.stock -= loadingStock;
                if (gameBoard.boardArray[pieceMovement.movementArray.start.row][pieceMovement.movementArray.start.col].pieces.category == 'Settlements') {
                    if (gameBoard.boardArray[pieceMovement.movementArray.start.row][pieceMovement.movementArray.start.col].pieces.stock == 0) {
                        gameBoard.boardArray[pieceMovement.movementArray.start.row][pieceMovement.movementArray.start.col].pieces.goods = 'none';
                    }
                }
                gameBoard.boardArray[pieceMovement.movementArray.end.row][pieceMovement.movementArray.end.col].pieces.stock += loadingStock;
                gameBoard.boardArray[pieceMovement.movementArray.end.row][pieceMovement.movementArray.end.col].pieces.goods = loadingGoods;
                loadingStock = 0;

            // Delivery of goods for contract
            } else if (pieceMovement.movementArray.start.pieces.type == 'cargo ship' && pieceMovement.movementArray.end.pieces.team == 'Kingdom' && pieceMovement.movementArray.end.pieces.type == 'fort') {
                pieceMovement.deactivateTiles(1);
                gameBoard.drawActiveTiles();
                tradeContracts.discoverPath(pieceMovement.movementArray.end.row, pieceMovement.movementArray.end.col, pieceMovement.movementArray.start.pieces.goods);
                tradeContracts.fulfilDelivery();
                tradeContracts.drawContracts();

            // Unloading to own team fort or resource tile
            } else if (pieceMovement.movementArray.start.pieces.type == 'cargo ship' && pieceMovement.movementArray.end.pieces.team == gameManagement.turn && (pieceMovement.movementArray.end.pieces.type == 'fort' || pieceMovement.movementArray.end.pieces.category == 'Resources')) {
                pieceMovement.deactivateTiles(maxMove);
                gameBoard.drawActiveTiles();
                //loadingStock = gameBoard.boardArray[pieceMovement.movementArray.start.row][pieceMovement.movementArray.start.col].pieces.stock;
                loadingGoods = gameBoard.boardArray[pieceMovement.movementArray.start.row][pieceMovement.movementArray.start.col].pieces.goods;
                gameBoard.boardArray[pieceMovement.movementArray.start.row][pieceMovement.movementArray.start.col].pieces.stock -= loadingStock;
                if (gameBoard.boardArray[pieceMovement.movementArray.start.row][pieceMovement.movementArray.start.col].pieces.stock == 0) {
                    gameBoard.boardArray[pieceMovement.movementArray.start.row][pieceMovement.movementArray.start.col].pieces.goods = 'none';
                }
                gameBoard.boardArray[pieceMovement.movementArray.end.row][pieceMovement.movementArray.end.col].pieces.stock += loadingStock;
                gameBoard.boardArray[pieceMovement.movementArray.end.row][pieceMovement.movementArray.end.col].pieces.goods = loadingGoods;
                loadingStock = 0;

            // Piece movement
            } else if (pieceMovement.movementArray.start.pieces.type == 'cargo ship') {
                endTurn.removeEventListener('click', nextTurn);
                boardMarkNode.removeEventListener('click', boardHandler);
                pieceMovement.deactivateTiles(maxMove);
                // Redraw active tile layer after deactivation to remove activated tiles
                gameBoard.drawActiveTiles();
                pieceMovement.shipTransition(gameSpeed);

            }
        } else {
            // Resetting if second click is not valid
            pieceMovement.deactivateTiles(maxMove);
            gameBoard.drawActiveTiles();

            // Resetting movement array once second click has been made (if invalid)
            pieceMovement.movementArray = {start: {row: '', col: ''}, end: {row: '', col: ''}};
            startEnd = 'start';

            // Removing commentary goods event handler
            commentary.removeEventListener('click', clickGoods);
            clearCommentary();
        }

        // Update the stock dashboard
        stockDashboard.stockTake();
        stockDashboard.drawStock();
    }
};

// boardMarkNode is board holder in document
let boardMarkLeft = boardMarkNode.offsetLeft;
let boardMarkTop = boardMarkNode.offsetTop;

//console.log('here', boardMarkLeft, boardMarkTop);

boardMarkNode.addEventListener('click', boardHandler);
