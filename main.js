// Main script

// Setting up developer tools
// --------------------------
// --------------------------
const launchTime = Date.now();
let workFlow = gameManagement.optionsArray[1].options[0].active;
let gameBoardTrack = 0;
let arrayFlow = gameManagement.optionsArray[1].options[1].active;
let transitionMonitor = gameManagement.optionsArray[1].options[2].active;



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

let headFootCollection = document.querySelectorAll('.the_header, .score_header, .the_footer, .commentaryBox, .building');
for (var c = 0; c < headFootCollection.length; c++) {

    headFootCollection[c].style.width = (screenWidth - 2*surroundSize) + 'px';
    headFootCollection[c].style.left = surroundSize + 'px';
    headFootCollection[c].style.fontSize = (0.8 * screenReduction) + 'em';
}

let scoreHeader = document.querySelector('.score_header');
scoreHeader.style.fontSize = (0.6 * screenReduction) + 'em';
scoreHeader.style.top = '-15%';

let theHeader = document.querySelector('.the_header');
theHeader.addEventListener('mouseenter', function() {
    scoreHeader.style.top = '0%';
});

theHeader.addEventListener('mouseleave', function() {
    scoreHeader.style.top = '-15%';
});

// ------------------------------------------------------------------------------------
// INTRODUCTION AND PLAYER / TEAM SET UP

gameManagement.teamArraySetUp();



// ------------------------------------------------------------------------------------
// SETTING UP GAME LAYERS

// boardMarkNode is board holder in document
let boardMarkNode = document.querySelector('div.boardmark');

// Canvas element createed for board
let [board, canvasBoard] = gameBoard.createCanvasLayer('board');
boardMarkNode.appendChild(board);

// Canvas 'activeBoard' (for active tiles that can be moved to) is created and size is set dynamically
let [activeBoard, canvasActive] = gameBoard.createCanvasLayer('activeBoard');
boardMarkNode.appendChild(activeBoard);

// Canvas 'activeBoard' (for active tiles that can be moved to) is created and size is set dynamically
let [highlightBoard, canvasHighlight] = gameBoard.createCanvasLayer('highlightBoard');
boardMarkNode.appendChild(highlightBoard);

// SVG layer for compass set up (same height and width as board)
let compassLayer = gameBoard.createNewLayer('compass');
boardMarkNode.appendChild(compassLayer);

// SVG layer for trade routes set up (same height and width as board)
let tradeRouteLayer = gameBoard.createNewLayer('tradeRoute');
boardMarkNode.appendChild(tradeRouteLayer);

// SVG layer for moon and time set up (same height and width as board)
let moonLayer = gameBoard.createNewLayer('moonLayer');
boardMarkNode.appendChild(moonLayer);

// Setting up next turn icon
let endTurn = document.querySelector('.endturnmark');
endTurn.setAttribute('class', gameManagement.turn + ' team_fill team_stroke');
gameManagement.createTurnCircle(false, 0.6*surroundSize/100, 0*screenReduction, 0.18*surroundSize, endTurn, 'icon_holder');

// Finds the scroll popup holder for the intro and gameManagement scrolls
let scrollPopup = document.querySelector('.scroll_popup');
let scrollPanel = gameManagement.createScroll(screenWidth*(12/2000), -50*screenReduction, (screenWidth*4/20), scrollPopup);
scrollPopup.appendChild(scrollPanel);
scrollPanel.appendChild(gameBoard.drawMoon((screenWidth*4.2/20), 175*screenReduction, 50*screenReduction, 1));
scrollPanel.appendChild(gameBoard.drawMoon((screenWidth*7.8/20), 565*screenReduction, 50*screenReduction, 7));

// Finds the stockDashboard holder in the left hand panel
let stockDashboardNode = document.querySelector('div.stockDashboard');

// Finds the stockDashboard holder in the left hand panel
let scoreBoardNode = document.querySelector('div.scoreBoard');



// Function to set up board and resource deck and allocate resources
function boardSetUp(row, col, gridSize, boardShape) {
    gameBoard.populateBoardArray(row, col, boardShape);
    gameBoard.overlayBoardArray(row, col, boardShape);
    pirates.safeHarbour();

    // Set up of resources
    resourceManagement.populateResourceDeck();
    //gameBoard.allocateStartTiles();

    // Drawing of board
    gameBoard.drawCompassLayer();
    gameBoard.drawMoonLayer();
    gameBoard.drawBoard(row, col, gridSize);
    gameBoard.drawPieces();
}

// CONSIDER A RESET FUNCTION TO REDRAW WHOLE BOARD BASED ON CURRENT BOARDARRAY
// Clears board for redrawing
//while (boardMarkNode.firstChild) commentary.loadingStock
//    boardMarkNode.removeChild(boardMarkNode.firstChild);
//}


// Set up the board
boardSetUp(row, col, gridSize, boardShape);



// Picking up the default game settings
// ------------------------------------
// Game speed (0.6, 1, 1.5)

let gameSpeedRef = gameManagement.optionsArray[0].options.findIndex(item => item.active == true);
let gameSpeed = gameManagement.optionsArray[0].options[gameSpeedRef].constant;


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

stockDashboard.newTurnGoods();
stockDashboard.stockTake();
stockDashboard.drawStock();
tradeContracts.populateContracts();
tradeContracts.drawContracts();
gameScore.workScores('none');


// Set up of compass
// -----------------
if(workFlow == 1) {console.log('Set up of compass: ' + (Date.now() - launchTime)); }

// Initial wind direction
let windDirection = compass.largeWindChange();
let needleDirection = compass.directionArray[windDirection].needle;
// Transform / Transition for compass
let needle = document.getElementById('needle2');
needle.style.transform = 'rotate(' + needleDirection + 'deg)';



// Settings pop-up box
// --------------------

if(workFlow == 1) {console.log('Creating settings pop up icon and box: ' + (Date.now() - launchTime)); }

var settingsIcon = document.querySelector('.settingsmark');
var settingsPopup = document.querySelector('.settings_popup');

// Icon in bottom left corner
gameManagement.createSettingsCog(false, 0.6*surroundSize/100, 0*screenReduction, 0.15*surroundSize, settingsIcon, 'icon_holder');
// Settings pop up box
gameManagement.createSettingsCog(true, screenWidth*(12/2000), -50*screenReduction, (screenWidth*4/20), settingsPopup, 'popup_cog');
var popupCog = document.querySelector('.popup_cog');
popupCog.appendChild(gameManagement.panelCircle(screenWidth*(12/2000)));
gameManagement.createSettingsPanel(screenWidth*(12/2000), -50*screenReduction, (screenWidth*4/20), settingsPopup, 'popup_panel');
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
let maxMove = 0;

// Variables for clicked tiles with startEnd indicating the start or end of the move
let startEnd = 'start';
let chosenSquare = {start: '', end: ''};
let chosenHolding = {start: '', end: ''};



// boardMarkNode is board holder in document
let boardMarkLeft = boardMarkNode.offsetLeft;
let boardMarkTop = boardMarkNode.offsetTop;

gameManagement.nextTurn();
