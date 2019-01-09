// Main script for game

// --------------------------------------
// SETTING UP TIMER AND DEVELOPMENT TOOLS
// --------------------------------------
settings.setup();

// ------------------------------------------------------------------------------------
// SETTING UP GAME
// ------------------------------------------------------------------------------------
if(settings.workFlow === true) {
    console.log('----- Starting a new game ----- ' + (Date.now() - settings.launchTime));
}

// boardMarkNode is board holder node in document
let boardMarkNode = document.querySelector('div.boardmark');

// Game creation (board and display) and set up
let game = new Game(gameData, boardMarkNode);
game.setup();

game.begin();
