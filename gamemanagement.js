// Game constructor - methods to set up and start a new game
// ---------------------------------------------------------
function Game (data, node) {
    // Array to store current state of board
    // -------------------------------------
    // board information
    this.board = new Board(data.gameBoardDef);
    this.boardArray = this.board.boardArray;
    this.rows = this.board.rows;
    this.cols = this.board.cols;
    this.pieceTypes = data.pieceTypes;

    // board display information
    this.node = node;
    this.mapWidth = window.innerWidth;
    this.innerHeight = window.innerHeight;
    this.screenReduction = this.mapWidth/1280;
    this.surroundSize = Math.floor(0.065 * this.mapWidth);
    this.gridSize = Math.round((this.mapWidth - 2*this.surroundSize) / ((this.cols + 3)*1.5) );
    this.tileBorder = Math.round(0.25 * this.gridSize);
    this.boardSurround = (this.mapWidth - this.cols * (this.gridSize + this.tileBorder * 2))/2;
    this.boardDisplay = new BoardDisplay(this.boardArray, this.rows, this.cols, this.mapWidth, this.innerHeight, this.gridSize, this.tileBorder, this.boardSurround, this.screenReduction, this.node);

    // board holder information
    this.boardHolder = new BoardHolder(this.surroundSize, this.screenReduction, this.mapWidth)

    //set up of goods icons
    // ---------------------
    this.icons = new IconSet(this.boardArray, this.rows, this.cols, this.gridSize, this.tileBorder, this.boardSurround, this.node);

    // Game management variables
    // -------------------------
    this.phaseCount = 8;
    this.gameEnd = false;
    this.playerListing = data.playerListing;
    this.teamArray = [];

    // Current turn
    // ------------
    this.turn = null;
    this.turnNo = -1;
    this.type = null;

    // Current game date
    // -----------------
    this.gameDate = 0;

    // Scroll information
    // Array to hold first and second lines of scroll text
    // Scrolls appear at start of each of eight moons
    // -----------------------------------------
    this.scrollTextArray = [
      ['The game commences!', 'Seek out goods and resources.', ''],
      ['Trading activated!', 'Deliver goods to islands for rewards.', ''],
      ['Bigger contracts coming soon!', 'Build bigger ships to meet demand.', ''],
      ['At the next new moon ...', ' ... the last player will be eliminated!', ''],
      ['', 'Trading post is open', 'OK, I still need to develop this bit.'],
      ['At the next new moon ...', ' ... the last player will be eliminated!', ''],
      ['', 'Head to head!', 'Down to the final two.'],
      ['The last moon!', 'To the winner the spoils!', ''],
    ];

    this.scrollTextWinner = ['', '', 'Thanks for playing.'];
}

// Method to set up game
// --------------------------------
Game.prototype.setup = function() {
    // Set up board
    // ------------
    this.board.setupBoardArray();

    // Set up board display
    // --------------------
    this.boardDisplay.setupCanvasLayers();
    this.boardDisplay.setupSVGLayers();
    this.boardDisplay.setupPieces();

    // Set up board holder
    // --------------------
    this.boardHolder.setupHolder();
}

// Method to set up team order
// ---------------------------
Game.prototype.teamArraySetup = function() {
    for (let team of Object.keys(this.playerListing)) {
        this.teamArray.splice(Math.floor(Math.random() * (this.teamArray.length+1)), 0, {team: team, type: this.playerListing[team].type, status: this.playerListing[team].status});
    }
    this.teamArray.push({team: 'Pirate', type: 'Pirate'});
}

// Method to set up and start the game
// ---------------------------------------------
Game.prototype.begin = function() {
    // contract set up
    tradeContracts.populateResourcePieces();
    tradeContracts.populateContracts();
    // Set up of resources
    resourceManagement.populateResourceDeck();
    // scores set up
    gameScore.workScores('none');
    // compass set up
    compass.setup();
    // team set up
    this.teamArraySetup();
    this.turn = this.teamArray[0].team;
    this.type = this.teamArray[0].type;
    // go
    game.scrollOpen();
}


// Methods to activate next turn
// ------------------------------------------------
Game.prototype.nextTurn = function() {
    if(settings.workFlow === true) {console.log(' ------ Next turn: ---------: ' + (Date.now() - settings.launchTime)); }
    // Used pieces are reset to unused
    game.clearPriorTurn();
    // Check winner when time is up
    if (game.gameDate === (8 * game.phaseCount) && game.turn === 'Pirate') {
        game.gameEnd = true;
        game.presentWinner(gameScore.firstLastPlayer(), 'time');
        [game.boardHolder.scrollPanel.children[1].textContent, game.boardHolder.scrollPanel.children[2].textContent, game.boardHolder.scrollPanel.children[3].textContent, game.boardHolder.scrollPanel.children[4].textContent] = game.scrollText();
        game.boardHolder.scrollPopup.style.display = 'block';
    } else {
        // Check elimination - Players eliminated at the end of moon 4 / start of moon 5 and end of moon 6 / start of moon 7
        if ((game.gameDate == (4 * game.phaseCount) || game.gameDate == (6 * game.phaseCount)) && game.turn === 'Pirate') {
            game.eliminatePlayer(gameScore.firstLastPlayer());
        }
        // Open scroll each change in moon
        if (game.moonDate(game.gameDate).moonPhase === game.phaseCount && game.turn === 'Pirate') {
            game.scrollOpen();
        } else {
            game.nextTurnTwo();
        }
    }
}

Game.prototype.nextTurnTwo = function() {
    // Move to next player go / next date
    game.nextPlayer();
    game.prepareNextTurn();
    game.prePlayerEvents();
    game.checkGameEnd();
    if (game.gameEnd === true) {
        // End scroll pop up
        [game.boardHolder.scrollPanel.children[1].textContent, game.boardHolder.scrollPanel.children[2].textContent, game.boardHolder.scrollPanel.children[3].textContent, game.boardHolder.scrollPanel.children[4].textContent] = game.scrollText();
        game.boardHolder.scrollPopup.style.display = 'block';
        console.log('game over');
    } else {
        game.playerTurn();
    }
}

// Method to activate next turn
// ------------------------------------------------
Game.prototype.clearPriorTurn = function() {
    // Removing the action event listeners whilst the next turn functions are run
    // these remain switched off until a human turn is started
    this.eventListenersOff();
    // Removing commentary goods event handler and clearing commentary
    commentary.commentaryBox.removeEventListener('click', commentary.clickGoods);
    commentary.clearCommentary();
    // Other event listeners remain on at all times:
    // theHeader - event listeners mouseenter, mouseleave for scoreboard dropdown
    // settingsIcon, window - event listeners for opening and closing of settings

    // Resetting any active tiles
    pieceMovement.deactivateTiles();
    this.boardDisplay.drawTiles('activeTiles');

    // Resetting used pieces
    this.board.usedPiecesReset();

    // Comment and building and scoreboard bars reset
    commentary.commentaryBox.style.bottom = '-10%';
    buildItem.building.style.bottom = '-15%';
    this.boardHolder.scoreHeader.style.top = '-15%';
    buildItem.clearBuilding();
}

// Method to add / remove event listeners
// ------------------------------------------------
Game.prototype.eventListenersOn = function() {
    this.node.addEventListener('click', human.boardHandler);
    this.boardHolder.endTurn.addEventListener('click', game.nextTurn);
    stockDashboard.node.addEventListener('click', buildItem.clickStock);
    stockDashboard.node.addEventListener('mouseover', stockDashboard.hoverPieceOn);
    stockDashboard.node.addEventListener('mouseleave', stockDashboard.hoverPieceOff);
}

// ------------------------------------------------
Game.prototype.eventListenersOff = function() {
    this.boardHolder.endTurn.removeEventListener('click', this.nextTurn);
    this.node.removeEventListener('click', human.boardHandler);
    stockDashboard.node.removeEventListener('click', buildItem.clickStock);
    stockDashboard.node.removeEventListener('mouseover', stockDashboard.hoverPieceOn); // turned off as they do not show the right squares during transitions
    stockDashboard.node.removeEventListener('mouseleave', stockDashboard.hoverPieceOff);
}

// Method to change player turn and advance date to next round
// -----------------------------------------------------------
Game.prototype.nextPlayer = function() {
    // Move to next player
    let numberOfPlayers = this.teamArray.length;
    this.turnNo = (this.turnNo + 1) % numberOfPlayers;

    // Advance game date
    if (this.turnNo === 0) {
        this.gameDate += 1;
    }

    // Skip eliminated players
    if  (this.teamArray[this.turnNo].status === 'eliminated') {
        this.nextPlayer();
    } else {
        this.turn = this.teamArray[this.turnNo].team;
        this.type = this.teamArray[this.turnNo].type;
        if (settings.workFlow === true) {console.log('Turn changed to ' + game.turn + ' : ' + (Date.now() - settings.launchTime)); }
    }
}

// Check if game has finished
// ------------------------------------------------
Game.prototype.checkGameEnd = function() {
    // Check whether player has completed all tasks necessary to end game
    let countClosedContracts = tradeContracts.countClosed();
    if (countClosedContracts.maxTotal === 4) {
        this.gameEnd = true;
        this.presentWinner(gameScore.firstLastPlayer(), 'contracts', countClosedContracts.maxTeam);
    }
}

// Prepare next turn
// ------------------------------------------------
Game.prototype.prepareNextTurn = function() {
    // Wind direction is set for next turn
    compass.newWindDirection();

    // End turn button colour is changed
    this.boardHolder.endTurn.setAttribute('class', game.turn + ' team_fill team_stroke');

    // Moon is redrawn for next turn
    game.boardDisplay.drawMoonLayer('moonLayer');
}

// Pre player move events
// ------------------------------------------------
Game.prototype.prePlayerEvents = function() {
    if (game.turn !== 'Pirate') {
        // Chance of new trade contract
        if(settings.workFlow === true) {console.log('Checking for new trade contracts: ' + (Date.now() - settings.launchTime)); }
        tradeContracts.newContract();

        // Manage goods
        if(settings.workFlow === true) {console.log('Adding new goods production: ' + (Date.now() - settings.launchTime)); }
        stockDashboard.newTurnGoods();

        // Manage on-going contracts
        if(settings.workFlow === true) {console.log('Managing active contracts: ' + (Date.now() - settings.launchTime)); }
        tradeContracts.contractContinuance();
        // Update the contracts dashboard
        tradeContracts.drawContracts();

        // Update the stock dashboard
        if(settings.workFlow === true) {console.log('Updating stock dashboard and contracts dashboard: ' + (Date.now() - settings.launchTime)); }
        stockDashboard.stockTake();
        stockDashboard.drawStock();

    } else { // pirates turn
        // Create and move whirlpools
        //if (this.gameDate > 1 * this.phaseCount) { // start at end of first moon along with contracts
        if (this.gameDate > 0 * this.phaseCount ) { // testing
            whirlpool.manageWhirlpools();
        }
    }

    // Repair ships
    pieceMovement.harbourRepair();
}

// Method to activate next turn - up to moon change
// ------------------------------------------------
Game.prototype.playerTurn = function() {
    // Automated movement for pirates
    if (this.type === 'Pirate') {
        // Run pirate automation - Event listeners are not turned on for pirate moves
        pirates.automatePirates();
    } else if (this.type === 'computer') {
        // Automates moves of computer opponents - Event listeners are not turned on for computer moves
        computer.automatePlayer();
    } else { // human
        // Main action event listeners are switched on
        this.eventListenersOn();
    }
}

// Method to calculate moon phases from date
// -----------------------------------------
Game.prototype.moonDate = function(date) {
    let moonPhase = date % this.phaseCount; // 8
    if (moonPhase === 0) {
        moonPhase = this.phaseCount; // 8
    }
    let moonMonth = (date - moonPhase) / this.phaseCount + 1; // ) / 8

    function ordinalNumber(cardinalNumber) {
        if (cardinalNumber % 10 === 1) {
            return cardinalNumber + 'st';
        } else if (cardinalNumber % 10 === 2) {
            return cardinalNumber + 'nd';
        } else if (cardinalNumber % 10 === 3) {
            return cardinalNumber + 'rd';
        } else {
            return cardinalNumber + 'th';
        }
    }
    moonPhaseOrd = ordinalNumber(moonPhase);
    moonMonthOrd = ordinalNumber(moonMonth);
    return ({moonPhase: moonPhase, moonMonth: moonMonth, moonPhaseOrd: moonPhaseOrd, moonMonthOrd: moonMonthOrd})
}

// ------------------------------------------------------------------------------------
// SCROLL METHODS
// ------------------------------------------------------------------------------------

// Open scroll
// -----------------------------------------
Game.prototype.scrollOpen = async function() {
    // Displays intro / moon scroll and adds text
    [this.boardHolder.scrollPanel.children[1].textContent, this.boardHolder.scrollPanel.children[2].textContent, this.boardHolder.scrollPanel.children[3].textContent, this.boardHolder.scrollPanel.children[4].textContent] = game.scrollText();
    this.boardHolder.scrollPopup.style.display = 'block';
    this.boardHolder.scrollPopup.addEventListener('click', game.scrollClose);
}

// Method to update title and text of scroll
// -----------------------------------------
Game.prototype.scrollText = function() {
    let dateInputs = this.moonDate(this.gameDate+1);

    if (this.gameEnd === true) {
        return ['Game Over', this.scrollTextWinner[0], this.scrollTextWinner[1], this.scrollTextWinner[2]];
    } else {
        return [dateInputs.moonMonthOrd + ' moon', this.scrollTextArray[dateInputs.moonMonth-1][0], this.scrollTextArray[dateInputs.moonMonth-1][1], this.scrollTextArray[dateInputs.moonMonth-1][2]];
    }
}

// Method to close scroll
// ----------------------
Game.prototype.scrollClose = function(e) {
    if(settings.workFlow === true) {console.log('Scroll Close event listener removed ' + game.turn + ' : ' + (Date.now() - settings.launchTime)); }
    //if (e.target === scrollPopup) - Included to potentially allow future actions to be taken using buttons in scroll
    game.boardHolder.scrollPopup.style.display = 'none';
    game.boardHolder.scrollPopup.removeEventListener('click', game.scrollClose);
    game.nextTurnTwo();
}

// ------------------------------------------------------------------------------------
// PLAYER ELIMINATION AND GAME ENDING
// ------------------------------------------------------------------------------------

Game.prototype.presentWinner = function(firstLast, endReason, endTeam) {
    if (settings.workFlow === true) {console.log('Determining winner: ' + (Date.now() - settings.launchTime)); }

    // Show scoreboard
    this.boardHolder.scoreHeader.style.top = '0%';

    // Update scrollTextArray
    if (endReason === 'contracts') {
        this.scrollTextWinner[0] = endTeam + ' has completed the contracts task.'
    } else {
        this.scrollTextWinner[0] = 'Eight moons have turned and your quest ends.'
    }
    this.scrollTextWinner[1] = firstLast[0].team + ' is the winner!'
}


// Method to remove a player's pieces from the game on elimination
// ---------------------------------------------------------------
Game.prototype.eliminatePlayer = function(firstLast) {
    let eliminatedTeam = firstLast[1].team;

    if(settings.workFlow === true) {console.log('Eliminating player: ' + eliminatedTeam + ' : ' + (Date.now() - settings.launchTime)); }
    for (let i = 0; i < this.boardArray.length; i+=1) {
        // Loop through all board tiles
        for (let j = 0; j < this.boardArray[i].length; j+=1) {
            if (this.boardArray[i][j].piece.team === eliminatedTeam) {
                // Capture piece and SVG
                let IDPiece = 'piece' + ('0' + i).slice(-2) + ('0' + j).slice(-2);
                let piece = this.boardArray[i][j].piece;
                let pieceSVG = this.boardDisplay.pieces[IDPiece];
                // Remove all transport ships
                if (this.boardArray[i][j].piece.category === 'Transport') {
                    pieceSVG.svg.remove();
                    game.board.removePiece([i,j]);
                // Turn all land tiles grey by changing to team "deserted"
              } else if (this.boardArray[i][j].piece.category === 'Resources' || this.boardArray[i][j].piece.category === 'Settlements') {
                    piece.changeTeam('Deserted');
                    pieceSVG.changeTeam('Deserted');
                }
            }
        }
    }

    // Remove all existing trade routes for eliminated player
    for (let k = 0; k < tradeContracts.contractsArray.length; k+=1) {
        for (let l = 0; l < tradeContracts.resourcePieces.length; l+=1) {
            if (tradeContracts.contractsArray[k].contracts[tradeContracts.resourcePieces[l].goods].team === eliminatedTeam) {
                if (tradeContracts.contractsArray[k].contracts[tradeContracts.resourcePieces[l].goods].struck === 'active') {
                    // Remove trade route from board
                    IDtradeRoute = tradeContracts.resourcePieces[l].goods + '_' + tradeContracts.contractsArray[k].name;
                    let closedTradeRoute = document.getElementById(IDtradeRoute);
                    closedTradeRoute.remove();
                    gameScore.workScores('Trading', eliminatedTeam, tradeContracts.contractsArray[k].name, ((tradeContracts.contractsArray[k].contracts[tradeContracts.resourcePieces[l].goods].contractPath.length - 1) * -1) );
                    // Reset contractsArray as these contracts were not completed
                    tradeContracts.contractsArray[k].contracts[tradeContracts.resourcePieces[l].goods] = {created: false, struck: 'unopen', team: 'none', initial: 0, renewal: 0, timeRemaining: 0};
                    tradeContracts.contractsArray[k].totalActive -=1;
                    tradeContracts.contractsArray[k].totalUnopen +=1;
                }
            }
        }
    }

    // Update marker for competing player / eliminated player in player listing
    index = this.teamArray.findIndex(fI => fI.team === eliminatedTeam);
    this.teamArray[index].status = 'eliminated';

    // Update scrollTextArray
    let eliminationDate = this.moonDate(this.gameDate).moonMonth;
    this.scrollTextArray[eliminationDate][0] = eliminatedTeam + ' team has been eliminated.'
}
