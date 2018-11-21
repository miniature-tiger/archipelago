// Game management object

let gameManagement = {

    // Constants
    // ---------
    octagonAngle: (2 * Math.PI) / 8,
    phaseCount: 8,

    // Markers
    // ---------
    gameEnd: false,

    // Player object
    // -------------
    // Future update: set up based on user inputs for player names
    playerListing: [  {teamColour: 'Green Team', type: 'computer', status: 'competing', teamNumber: 1},
                      {teamColour: 'Blue Team', type: 'human', status: 'competing', teamNumber: 2 },
                      {teamColour: 'Red Team', type: 'computer', status: 'competing', teamNumber: 3 },
                      {teamColour: 'Orange Team', type: 'computer', status: 'competing', teamNumber: 4}, ],

    // List of teams
    // -------------

    teamArray: [],
    //['Green Team', 'Blue Team', 'Red Team', 'Orange Team', 'Pirate'],
    //teamArray: ['Green Team', 'Blue Team', 'Red Team', 'Orange Team'],

    // Current turn
    // ------------
    turn: 'Green Team',
    type: 'human',

    // Current game date
    // -----------------
    gameDate: 0,


    // ------------------------------------------------------------------------------------
    // ------------------------------------------------------------------------------------
    // GAME TIMINGS AND TURNS

    // Method to set up team order
    // ---------------------------
    teamArraySetUp: function() {
        this.teamArray.push('Pirate');
        teamNumberArray = [1,2,3,4];
        for (var i = teamNumberArray.length; i > 0; i--) {
            let chosenTeam = teamNumberArray.splice(Math.floor(Math.random() * i), 1);
            index = this.playerListing.findIndex(fI => fI.teamNumber == chosenTeam);
            this.teamArray.push(gameManagement.playerListing[index].teamColour);
        }
        // Setting turn and type for first move
        this.turn = this.teamArray[0];
        if (gameManagement.turn == 'Pirate') {
            gameManagement.type = 'Pirate';
        } else {
            index = gameManagement.playerListing.findIndex(fI => fI.teamColour == gameManagement.turn);
            gameManagement.type = gameManagement.playerListing[index].type;
        }
    },

    // Method to activate next turn - up to moon change
    // ------------------------------------------------
    nextTurn: function() {
        // Used pieces are resert to unused
        if(workFlow == 1) {console.log(' ------ Next turn: ---------: ' + (Date.now() - launchTime)); }

        // Removing the action event listeners whilst the next turn functions are run
        // these remain switched off until a human turn is started
        endTurn.removeEventListener('click', gameManagement.nextTurn);
        boardMarkNode.removeEventListener('click', boardHandler);
        stockDashboardNode.removeEventListener('click', buildItem.clickStock);
        stockDashboardNode.removeEventListener('mouseover', stockDashboard.hoverPieceOn); // turned off as they do not show the right squares during transitions
        stockDashboardNode.removeEventListener('mouseleave', gameBoard.clearHighlightTiles);

        // Removing commentary goods event handler and clearing commentary
        commentary.removeEventListener('click', clickGoods);
        clearCommentary();

        // Other event listeners remain on at all times:
        // theHeader - event listeners mouseenter, mouseleave for scoreboard dropdown
        // settingsIcon, window - event listeners for opening and closing of settings

        // Resetting any active tiles
        pieceMovement.deactivateTiles();
        gameBoard.drawActiveTiles();

        // Resetting movement array in case second click has not been made
        pieceMovement.movementArray = {start: {row: '', col: ''}, end: {row: '', col: ''}};
        startEnd = 'start';

        buildItem.clearBuilding();

        // Resetting used pieces
        pieceMovement.usedPiecesReset();

        // Comment and building and scoreboard bars reset
        commentary.style.bottom = '-10%';
        building.style.bottom = '-15%';
        scoreHeader.style.top = '-15%';

        // Players eliminated at the end of moon 4 / start of moon 5 and end of moon 6 / start of moon 7
        if ((gameManagement.gameDate == (4 * gameManagement.phaseCount) || gameManagement.gameDate == (6 * gameManagement.phaseCount)) && gameManagement.turn == 'Pirate') {
            gameManagement.eliminatePlayer(gameManagement.firstLastPlayer());
        }

        // Game date updated after all players have moved
        if (gameManagement.turn == 'Pirate') {
            gameManagement.gameDate += 1;
        }

        // Team and type are changed
        gameManagement.turn = gameManagement.teamArray[(gameManagement.teamArray.indexOf(gameManagement.turn)+1) % (gameManagement.teamArray.length)];
        if (gameManagement.turn == 'Pirate') {
            gameManagement.type = 'Pirate';
        } else {
            index = gameManagement.playerListing.findIndex(fI => fI.teamColour == gameManagement.turn);
            gameManagement.type = gameManagement.playerListing[index].type;
        }

        if(workFlow == 1) {console.log('Turn changed to ' + gameManagement.turn + ' : ' + (Date.now() - launchTime)); }
        if(gameBoardTrack == 1) {console.log(gameBoard.boardArray); }

        // Moon is redrawn for next turn
        gameBoard.drawMoonLayer();

        // Check whether player has completed all tasks necessary to end game
        let countClosedContracts = tradeContracts.countClosed();
        if (countClosedContracts.maxTotal == 4) {
            gameManagement.gameEnd = true;
            gameManagement.presentWinner(gameManagement.firstLastPlayer(), 'contracts', countClosedContracts.maxTeam);
        }

        // Winner for intro scroll
        if (gameManagement.gameDate == (8 * gameManagement.phaseCount + 1)) {
            gameManagement.gameEnd = true;
            gameManagement.presentWinner(gameManagement.firstLastPlayer(), 'time');
        }

        // End scroll pop up
        if (gameManagement.gameEnd == true) {
            // Displays end moon scroll and adds text
            [scrollPanel.children[1].textContent, scrollPanel.children[2].textContent, scrollPanel.children[3].textContent, scrollPanel.children[4].textContent] = gameManagement.scrollText();
            scrollPopup.style.display = "block";
            console.log('game over');
        }

        // Intro scroll pop up
        if (gameManagement.gameEnd == false && gameManagement.moonDate(gameManagement.gameDate).moonPhase == 1 && gameManagement.turn == gameManagement.teamArray[1]) {

            // Displays intro / moon scroll and adds text
            [scrollPanel.children[1].textContent, scrollPanel.children[2].textContent, scrollPanel.children[3].textContent, scrollPanel.children[4].textContent] = gameManagement.scrollText();
            scrollPopup.style.display = "block";
            scrollPopup.addEventListener('click', gameManagement.scrollClose);

        } else {
            // Second half of next turn functionality called if scroll is not activated (here) or once scroll is clicked to close (scrollClose)
            gameManagement.afterNextTurn();
        }
    },


    // Next turn - after moon change
    // ----------------------------
    afterNextTurn: function() {
        // Wind direction is set for next turn
        windDirection = compass.newWindDirection(windDirection);
        needleDirection = compass.directionArray[windDirection].needle;
        needle.style.transform = 'rotate(' + needleDirection + 'deg)';

        // End turn button colour is changed
        endTurn.setAttribute('class', gameManagement.turn + ' team_fill team_stroke');

        // Repair ships
        pieceMovement.harbourRepair();

        // Automated movement for pirates
        if (gameManagement.type == 'Pirate') {
            // Event listeners are not turned on for pirate moves - no code required
            // Run pirate automation
            pirates.automatePirates();
        } else {
            // Chance of new trade contract
            if(workFlow == 1) {console.log('Checking for new trade contracts: ' + (Date.now() - launchTime)); }
            tradeContracts.newContract();

            // Manage goods
            if(workFlow == 1) {console.log('Adding new goods production: ' + (Date.now() - launchTime)); }
            stockDashboard.newTurnGoods();

            // Manage on-going contracts
            if(workFlow == 1) {console.log('Managing active contracts: ' + (Date.now() - launchTime)); }
            tradeContracts.contractContinuance();

            // Update the stock dashboard
            if(workFlow == 1) {console.log('Updating stock dashboard and contracts dashboard: ' + (Date.now() - launchTime)); }
            stockDashboard.stockTake();
            stockDashboard.drawStock();

            // Update the contracts dashboard
            tradeContracts.drawContracts();
        }

        if (gameManagement.type == 'computer') {
            // Event listeners are not turned on for computer moves - no code required
            // Automates moves of computer opponents
            computer.automatePlayer();
        } else { // human
            // Main action event listeners are switched on
            boardMarkNode.addEventListener('click', boardHandler);
            stockDashboardNode.addEventListener('click', buildItem.clickStock);
            endTurn.addEventListener('click', gameManagement.nextTurn);
            stockDashboardNode.addEventListener('mouseover', stockDashboard.hoverPieceOn);
            stockDashboardNode.addEventListener('mouseleave', gameBoard.clearHighlightTiles);
        }
    },


    // Method to calculate moon phases from date
    // -----------------------------------------
    moonDate: function(localDate) {
        let moonPhase = localDate % this.phaseCount; // 8
        if (moonPhase == 0) {
            moonPhase = this.phaseCount; // 8
        }
        let moonMonth = (localDate - moonPhase) / this.phaseCount + 1; // ) / 8

        function ordinalNumber(cardinalNumber) {
            if (cardinalNumber % 10 == 1) {
                return cardinalNumber + 'st';
            } else if (cardinalNumber % 10 == 2) {
                return cardinalNumber + 'nd';
            } else if (cardinalNumber % 10 == 3) {
                return cardinalNumber + 'rd';
            } else {
                return cardinalNumber + 'th';
            }
        }
        moonPhaseOrd = ordinalNumber(moonPhase);
        moonMonthOrd = ordinalNumber(moonMonth);
        return ({moonPhase: moonPhase, moonMonth: moonMonth, moonPhaseOrd: moonPhaseOrd, moonMonthOrd: moonMonthOrd})
    },

    // ------------------------------------------------------------------------------------
    // ------------------------------------------------------------------------------------
    // PLAYER ELIMINATION AND GAME ENDING

    // Method to determine player to eliminate
    // ---------------------------------------
    firstLastPlayer: function() {
        let lastPlayerArray = [];
        let firstPlayerArray = [];
        let lowestScore = 10000;
        let highestScore = 0;
        // Loops through all players, building an array of competing players with the lowest score
        for (var i = 0; i < this.playerListing.length; i++) {
            if (this.playerListing[i].status == 'competing') {
                index = gameScore.scoreSummary.Total.findIndex(fI => fI.team == this.playerListing[i].teamColour);
                if (gameScore.scoreSummary.Total[index].score == lowestScore) {
                    lastPlayerArray.push([this.playerListing[i].teamColour, gameScore.scoreSummary.Total[index].score]);
                } else if (gameScore.scoreSummary.Total[index].score < lowestScore) {
                    lastPlayerArray = [];
                    lastPlayerArray.push([this.playerListing[i].teamColour, gameScore.scoreSummary.Total[index].score]);
                    lowestScore = gameScore.scoreSummary.Total[index].score;
                }
                if (gameScore.scoreSummary.Total[index].score == highestScore) {
                    firstPlayerArray.push([this.playerListing[i].teamColour, gameScore.scoreSummary.Total[index].score]);
                } else if (gameScore.scoreSummary.Total[index].score > highestScore) {
                    firstPlayerArray = [];
                    firstPlayerArray.push([this.playerListing[i].teamColour, gameScore.scoreSummary.Total[index].score]);
                    highestScore = gameScore.scoreSummary.Total[index].score;
                }
            }
        }

        // Picks a player at random if more than one player have the lowest score
        let lastPlayer = lastPlayerArray.splice(Math.floor(Math.random() * lastPlayerArray.length), 1)[0][0];
        let firstPlayer = firstPlayerArray.splice(Math.floor(Math.random() * firstPlayerArray.length), 1)[0][0];
        return [firstPlayer, lastPlayer];

    },

    // Method to remove a player's pieces from the game on elimination
    // ---------------------------------------------------------------
    eliminatePlayer: function(localFirstLast) {
        let eliminatedTeam = localFirstLast[1];

        if(workFlow == 1) {console.log('Eliminating player: ' + localTeam + ' : ' + (Date.now() - launchTime)); }
        for (var i = 0; i < gameBoard.boardArray.length; i+=1) {
            // Loop through all board tiles
            for (var j = 0; j < gameBoard.boardArray[i].length; j+=1) {
                if (gameBoard.boardArray[i][j].pieces.team == eliminatedTeam) {
                    // Remove all transport ships
                    if (gameBoard.boardArray[i][j].pieces.category == 'Transport') {
                        let IDPiece = 'tile' + Number(i*1000 + j);
                        document.getElementById(IDPiece).remove();
                        gameBoard.boardArray[i][j].pieces = {populatedSquare: false, category: '', type: 'no piece', direction: '', used: 'unused', damageStatus: 5, team: '', goods: 'none', stock: 0, production: 0};
                    // Turn all land tiles grey by changing to team "deserted"
                    } else if (gameBoard.boardArray[i][j].pieces.category == 'Resources' || gameBoard.boardArray[i][j].pieces.category == 'Settlements') {
                        let IDPiece = 'tile' + Number(i*1000 + j);
                        document.getElementById(IDPiece).remove();
                        gameBoard.boardArray[i][j].pieces.team = 'Deserted';
                        boardMarkNode.appendChild(gameBoard.createActionTile(i, j, gameBoard.boardArray[i][j].pieces.type, gameBoard.boardArray[i][j].pieces.team,
                          'tile' + Number(i*1000 + j), boardSurround + tileBorder/2 + (gridSize + tileBorder * 2) * i, boardSurround + tileBorder/2 + (gridSize + tileBorder * 2) * j, 1, gameBoard.boardArray[i][j].pieces.direction));
                    }
                }
            }
        }

        // Remove all existing trade routes for eliminated player
        for (var k = 0; k < tradeContracts.contractsArray.length; k+=1) {
            for (var l = 0; l < resourceManagement.resourcePieces.length; l+=1) {
                if (tradeContracts.contractsArray[k].contracts[resourceManagement.resourcePieces[l].goods].team == eliminatedTeam) {
                    if (tradeContracts.contractsArray[k].contracts[resourceManagement.resourcePieces[l].goods].struck == 'active') {
                        // Remove trade route from board
                        IDtradeRoute = resourceManagement.resourcePieces[l].goods + '_' + k;
                        let closedTradeRoute = document.getElementById(IDtradeRoute);
                        closedTradeRoute.remove();
                        gameScore.workScores('Trading', eliminatedTeam, tradeContracts.contractsArray[k].name, ((tradeContracts.contractsArray[k].contracts[resourceManagement.resourcePieces[l].goods].contractPath.length - 1) * -1) );
                        // Reset contractsArray as these contracts were not completed
                        tradeContracts.contractsArray[k].contracts[resourceManagement.resourcePieces[l].goods] = {created: false, struck: 'unopen', team: 'none', initial: 0, renewal: 0, timeRemaining: 0};
                        tradeContracts.contractsArray[k].totalActive -=1;
                        tradeContracts.contractsArray[k].totalUnopen +=1;
                    }
                }
            }
        }

        // Update marker for competing player / eliminated player in player listing
        index = this.playerListing.findIndex(fI => fI.teamColour == eliminatedTeam);
        this.playerListing[index].status = 'eliminated';

        // Remove player from teamArray
        let index2 = this.teamArray.indexOf(eliminatedTeam);
        if (index2 != -1) {
            this.teamArray.splice(index2, 1);
        }

        // Update scrollTextArray
        let eliminationDate = this.moonDate(this.gameDate).moonMonth;
        this.scrollTextArray[eliminationDate][0] = this.playerListing[index].teamColour + ' has been eliminated.'
    },


    presentWinner: function(localFirstLast, endReason, endTeam) {
        if(workFlow == 1) {console.log('Determining winner: ' + localTeam + ' : ' + (Date.now() - launchTime)); }

        // Show scoreboard
        scoreHeader.style.top = '0%';

        // Update scrollTextArray
        index = this.playerListing.findIndex(fI => fI.teamColour == localFirstLast[0]);
        //let winnerDate = this.moonDate(this.gameDate).moonMonth;
        if (endReason == 'contracts') {
            this.scrollTextWinner[0] = endTeam + ' has completed the contracts task.'
        } else {
            this.scrollTextWinner[0] = 'Eight moons have turned and your quest ends.'
        }
        this.scrollTextWinner[1] = this.playerListing[index].teamColour + ' is the winner!'
    },

    // ------------------------------------------------------------------------------------
    // ------------------------------------------------------------------------------------
    // SCROLL METHODS

    // Method to draw scroll on the board
    // -----------------------------------------
    createScroll: function(localScale, localTop, localLeft, localNode) {
        let viewportSize = 100 * localScale;

        // SVG holder
        let scrollSheet = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        scrollSheet.setAttribute('width', 100 * localScale);
        scrollSheet.setAttribute('height', 100 * localScale);
        scrollSheet.style.top = localTop + 'px';
        scrollSheet.style.left = localLeft + 'px';
        scrollSheet.setAttribute('viewBox', '0, 0, ' + viewportSize + ' ' + viewportSize);

        // Backing rectangle
        let scrollOutline = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        scrollOutline.setAttribute('width',  50 * localScale);
        scrollOutline.setAttribute('height', 70 * localScale);
        scrollOutline.setAttribute('x', 25 * localScale);
        scrollOutline.setAttribute('y', 13 * localScale);
        scrollOutline.setAttribute('rx', '2');
        scrollOutline.setAttribute('ry', '2');
        scrollOutline.setAttribute('fill', 'rgb(246, 232, 206)');
        scrollOutline.setAttribute('stroke','rgb(137, 113, 82)');
        scrollOutline.style.strokeWidth = localScale + 'px';
        scrollOutline.style.strokeLinecap = 'round';

        // Text title
        let scrollTitle = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        scrollTitle.textContent = ('');
        scrollTitle.setAttribute('font-size', 16 * screenReduction);
        scrollTitle.setAttribute('fill', 'rgb(179, 156, 128)');
        scrollTitle.setAttribute('x', 50 * localScale);
        scrollTitle.setAttribute('y', 41 * localScale);
        scrollTitle.setAttribute('text-anchor', 'middle');
        scrollTitle.setAttribute('font-weight', 'bold');

        // Text - first line
        let scrollText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        scrollText.textContent = ('');
        scrollText.setAttribute('font-size', 16 * screenReduction);
        scrollText.setAttribute('fill', 'rgb(179, 156, 128)');
        scrollText.setAttribute('x', 50 * localScale);
        scrollText.setAttribute('y', 48 * localScale);
        scrollText.setAttribute('text-anchor', 'middle');
        scrollText.setAttribute('font-style', 'italic');

        // Text - second line
        let scrollText2 = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        scrollText2.textContent = ('');
        scrollText2.setAttribute('font-size', 16 * screenReduction);
        scrollText2.setAttribute('fill', 'rgb(179, 156, 128)');
        scrollText2.setAttribute('x', 50 * localScale);
        scrollText2.setAttribute('y', 53 * localScale);
        scrollText2.setAttribute('text-anchor', 'middle');
        scrollText2.setAttribute('font-style', 'italic');

        // Text - third line
        let scrollText3 = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        scrollText3.textContent = ('');
        scrollText3.setAttribute('font-size', 16 * screenReduction);
        scrollText3.setAttribute('fill', 'rgb(179, 156, 128)');
        scrollText3.setAttribute('x', 50 * localScale);
        scrollText3.setAttribute('y', 58 * localScale);
        scrollText3.setAttribute('text-anchor', 'middle');
        scrollText3.setAttribute('font-style', 'italic');

        // Components add to svg holder
        scrollSheet.appendChild(scrollOutline);
        scrollSheet.appendChild(scrollTitle);
        scrollSheet.appendChild(scrollText);
        scrollSheet.appendChild(scrollText2);
        scrollSheet.appendChild(scrollText3);

        return scrollSheet;
    },

    // Array to hold first and second lines of scroll text
    // Scrolls appear at start of each of eight moons
    // -----------------------------------------
    scrollTextArray: [
      ['The game commences!', 'Seek out goods and resources.', ''],
      ['Trading activated!', 'Deliver goods to islands for rewards.', ''],
      ['Bigger contracts coming soon!', 'Build bigger ships to meet demand.', ''],
      ['At the next new moon ...', ' ... the last player will be eliminated!', ''],
      ['', 'Trading post is open', 'OK, I still need to develop this bit.'],
      ['At the next new moon ...', ' ... the last player will be eliminated!', ''],
      ['', 'Head to head!', 'Down to the final two.'],
      ['The last moon!', 'To the winner the spoils!', ''],
    ],

    scrollTextWinner: ['', '', 'Thanks for playing.'],

    // Method to update title and text of scroll
    // -----------------------------------------
    scrollText: function() {
        let dateInputs = this.moonDate(this.gameDate);

        if (this.gameEnd == true) {
            return ['Game Over', this.scrollTextWinner[0], this.scrollTextWinner[1], this.scrollTextWinner[2]];
        } else {
            return [dateInputs.moonMonthOrd + ' moon', this.scrollTextArray[dateInputs.moonMonth - 1][0], this.scrollTextArray[dateInputs.moonMonth - 1][1], this.scrollTextArray[dateInputs.moonMonth - 1][2]];
        }
    },

    // Method to close scroll
    // ----------------------
    scrollClose: function(e) {
        if (e.target == scrollPopup) {
            // Included to potentially allow future actions to be taken using buttons in scroll
            scrollPopup.style.display = "none";
            if(workFlow == 1) {console.log('Scroll Close event listener removed ' + gameManagement.turn + ' : ' + (Date.now() - launchTime)); }
            scrollPopup.removeEventListener('click', gameManagement.scrollClose);
            gameManagement.afterNextTurn();
        } else {
            scrollPopup.style.display = "none";
            if(workFlow == 1) {console.log('Scroll Close event listener removed ' + gameManagement.turn + ' : ' + (Date.now() - launchTime)); }
            scrollPopup.removeEventListener('click', gameManagement.scrollClose);
            gameManagement.afterNextTurn();
        }
    },


    // ------------------------------------------------------------------------------------
    // ------------------------------------------------------------------------------------
    // SETTINGS AND OPTIONS

    optionsArray: [
                  { variable: 'speed', active: 'fast', options: [{text: 'slow', active: false, constant: 1.5}, {text: 'medium', active: false, constant: 1}, {text: 'fast', active: true, constant: 0.6}] },
                  { variable: 'dev', options: [{text: 'workflow', active: false}, {text: 'arrays', active: true}, {text: 'transitions', active: false}] },
                  ],



    // Event handling for settings popup
    // ---------------------------------
    manageSettings: function(e, localScale) {
        // Speed icon
        if (e.target.classList.contains('icon5')) {
            this.clearPanel();
            this.speedPanel(localScale);
        // Speed panel
        } else if (e.target.classList.contains('speed')) {
            let indexCurrent = this.optionsArray[0].options.findIndex(item => item.active == true);
            let indexNew = this.optionsArray[0].options.findIndex(item => item.text == e.target.classList.item(1));
            if (indexNew != indexCurrent) {
            // Updates options array and global speed variable
                this.optionsArray[0].options[indexCurrent].active = false;
                this.optionsArray[0].options[indexNew].active = true;
                gameSpeed = this.optionsArray[0].options[indexNew].constant;
                // Resets and recreates speed panel
                this.clearPanel();
                this.speedPanel(localScale);
            }
        // Close icon
        } else if (e.target.classList.contains('icon6')) {
            this.clearPanel();
            settingsPopup.style.display = "none";
            window.removeEventListener('click', popRunClose);
        } else if (e.target.classList.contains('icon7')) {
          this.clearPanel();
          this.devPanel(localScale);
        } else if (e.target.classList.contains('dev')) {
            indexNew = this.optionsArray[1].options.findIndex(item => item.text == e.target.classList.item(1));
            this.optionsArray[1].options[indexNew].active = !this.optionsArray[1].options[indexNew].active;
            workFlow = this.optionsArray[1].options[0].active;
            arrayFlow = this.optionsArray[1].options[1].active;
            transitionMonitor = this.optionsArray[1].options[2].active;
            this.clearPanel();
            this.devPanel(localScale);
        }
    },

    // Setting up the speed panel
    // -------------------------------
    speedPanel: function(localScale) {
        // Icon at top of panel
        headerIcon = settingsPanel.appendChild(this.speedIcon(7));
        headerIcon.setAttribute('transform', 'translate(' + (25 * localScale - 25*1) + ', ' + (1 * localScale) + ') scale(1)');
        // Panel text
        settingsPanel.appendChild(this.panelText(screenWidth*(12/2000), 14, 'Select speed', 'for game movement.'));
        // Panel buttons - make into a loop?
        slowRect = settingsPanel.appendChild(this.optionBox(localScale, this.optionsArray[0].options[0], this.optionsArray[0].variable, 12));
        slowRect.setAttribute('transform', 'translate(' + (10 * localScale - 6 * localScale) + ', ' + (25 * localScale - 2 * localScale) + ')');
        mediumRect = settingsPanel.appendChild(this.optionBox(localScale, this.optionsArray[0].options[1], this.optionsArray[0].variable, 12));
        mediumRect.setAttribute('transform', 'translate(' + (25 * localScale - 6 * localScale) + ', ' + (25 * localScale - 2 * localScale) + ')');
        fastRect = settingsPanel.appendChild(this.optionBox(localScale, this.optionsArray[0].options[2], this.optionsArray[0].variable, 12));
        fastRect.setAttribute('transform', 'translate(' + (40 * localScale - 6 * localScale) + ', ' + (25 * localScale - 2 * localScale) + ')');
    },


    // Setting up the developer panel
    // -------------------------------
    devPanel: function(localScale) {
        // Icon at top of panel
        headerIcon = settingsPanel.appendChild(this.spannerIcon(5));
        headerIcon.setAttribute('transform', 'translate(' + (25 * localScale - 25*1) + ', ' + (1 * localScale) + ') scale(1)');
        // Panel text
        settingsPanel.appendChild(this.panelText(screenWidth*(12/2000), 14, 'Select elements', 'to monitor.'));
        // Panel buttons - make into a loop?
        workFlowCheck = settingsPanel.appendChild(this.optionBox(localScale, this.optionsArray[1].options[0], this.optionsArray[1].variable, 18));
        workFlowCheck.setAttribute('transform', 'translate(' + (25 * localScale - 9 * localScale) + ', ' + (25 * localScale - 2 * localScale) + ')');
        arrayCheck = settingsPanel.appendChild(this.optionBox(localScale, this.optionsArray[1].options[1], this.optionsArray[1].variable, 18));
        arrayCheck.setAttribute('transform', 'translate(' + (25 * localScale - 9 * localScale) + ', ' + (32 * localScale - 2 * localScale) + ')');
        transitionsCheck = settingsPanel.appendChild(this.optionBox(localScale, this.optionsArray[1].options[2], this.optionsArray[1].variable, 18));
        transitionsCheck.setAttribute('transform', 'translate(' + (25 * localScale - 9 * localScale) + ', ' + (39 * localScale - 2 * localScale) + ')');

    },

    // A single option box on a settings panel
    // ---------------------------------------
    optionBox: function(localScale, localOptions, localVariable, boxWidth) {
        let boxGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        boxGroup.setAttribute('class', localVariable + ' ' + localOptions.text);

        let box = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        box.setAttribute('class', localVariable + ' ' + localOptions.text);
        box.setAttribute('x', '0');
        box.setAttribute('y', '0');
        box.setAttribute('width', boxWidth * localScale);
        box.setAttribute('height', 5 * localScale);
        box.setAttribute('rx', '2');
        box.setAttribute('ry', '2');

        if (localOptions.active == true) {
            box.setAttribute('fill', 'rgba(0, 204, 0, 0.5');
            box.setAttribute('stroke','rgb(0, 128, 0)');
        } else {
            box.setAttribute('fill', 'rgba(204, 0, 0, 0.5');
            box.setAttribute('stroke','rgb(128, 0, 0)');
        }

        let textHolder = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        textHolder.setAttribute('class', localVariable + ' ' + localOptions.text);
        textHolder.setAttribute('x', boxWidth/2 * localScale);
        textHolder.setAttribute('y', 3.2 * localScale);
        textHolder.setAttribute('font-weight', 'normal');
        textHolder.setAttribute('font-size', (localScale * 2.6 ) + 'px');
        textHolder.setAttribute('text-anchor', 'middle');
        let words = document.createTextNode(localOptions.text);
        textHolder.appendChild(words);

        boxGroup.appendChild(box);
        boxGroup.appendChild(textHolder);
        return boxGroup;
    },


    // Settings panel set up
    // ---------------------
    createSettingsPanel: function(localScale, localTop, localLeft, localNode, localClass) {
        let viewportSize = 50 * localScale;
        let settingsPanel = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        settingsPanel.setAttribute('width', 38 * localScale);
        settingsPanel.setAttribute('height', 38 * localScale);
        settingsPanel.style.top = (31 * localScale + localTop)  + 'px';
        settingsPanel.style.left = (31 * localScale + localLeft) + 'px';
        settingsPanel.setAttribute('viewBox', '0, 0, ' + viewportSize + ' ' + viewportSize);
        settingsPanel.setAttribute('class', localClass);
        localNode.appendChild(settingsPanel);
    },

    // Settings panel circle
    // ---------------------
    panelCircle: function(localScale) {
        let panelCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        panelCircle.setAttribute('cx',  50 * localScale);
        panelCircle.setAttribute('cy', 50 * localScale);
        panelCircle.setAttribute('r', 20 * localScale - 1);
        panelCircle.setAttribute('fill', 'darkgrey');
        panelCircle.setAttribute('stroke','lightgrey');
        panelCircle.style.strokeWidth = '1px';
        panelCircle.style.strokeLinecap = 'round';
        return panelCircle;
    },

    // Text for settings panel
    // -----------------------
    panelText: function(localScale, localY, firstSentence, secondSentence) {
        let panelText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        let firstLine = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
        let secondLine = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
        let firstLineText = document.createTextNode(firstSentence);
        let secondLineText = document.createTextNode(secondSentence);
        panelText.setAttribute('font-size', (localScale * 2.6  ) + 'px');
        panelText.setAttribute('stroke', 'black');
        panelText.setAttribute('font-weight', 'normal');
        panelText.setAttribute('text-anchor', 'middle');
        panelText.setAttribute('x', 25 * localScale);
        panelText.setAttribute('y', localY * localScale);
        secondLine.setAttribute('x', 25 * localScale);
        secondLine.setAttribute('dy', 4 * localScale);

        firstLine.appendChild(firstLineText);
        secondLine.appendChild(secondLineText);
        panelText.appendChild(firstLine);
        panelText.appendChild(secondLine);
        return(panelText);
    },

    // Method to clear settings panel
    // ------------------------------
    clearPanel: function() {
        while (settingsPanel.firstChild) {
            settingsPanel.removeChild(settingsPanel.firstChild);
        }
    },

    // Settings cog graphics
    // --------------------
    createSettingsCog: function(addOptions, localScale, localTop, localLeft, localNode, localClass) {
        let viewportSize = 100 * localScale;
        let settingsCog = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        settingsCog.setAttribute('class', localClass);
        settingsCog.setAttribute('width', 100 * localScale);
        settingsCog.setAttribute('height', 100 * localScale);
        settingsCog.style.top = localTop + 'px';
        settingsCog.style.left = localLeft + 'px';
        settingsCog.setAttribute('viewBox', '0, 0, ' + viewportSize + ' ' + viewportSize);

        let cogCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        cogCircle.setAttribute('cx',  50 * localScale);
        cogCircle.setAttribute('cy', 50 * localScale);
        cogCircle.setAttribute('r', 25 * localScale);
        cogCircle.setAttribute('fill', 'none');
        cogCircle.setAttribute('stroke','grey');
        cogCircle.style.strokeWidth = 10 * localScale + 'px';
        cogCircle.style.strokeLinecap = 'round';

        settingsCog.appendChild(cogCircle);

        // Adding teeth for cog
        for (var i = 0; i < 8; i++) {
            settingsCog.appendChild(this.cogTooth(i, 50 * localScale, 50 * localScale, 100 * localScale, addOptions));
        }

        localNode.appendChild(settingsCog);
    },


    // Creating settings icons
    // -----------------------
    createSettingsIcons: function(addOptions, localScale, localTop, localLeft, localNode, localClass) {
        for (var i = 0; i < 8; i++) {
            if (addOptions == true) {
                settingsTabIcon = this.emptyIcon(i, 100 * localScale, 50 * localScale, 50 * localScale);
                localNode.appendChild(settingsTabIcon);

                if (i==5) {
                    iconDesign = this.speedIcon(i);
                    iconDesign.setAttribute('transform', 'translate(' + (50 * localScale + (100 * localScale/4)*1.2 * Math.cos((i) * this.octagonAngle) - 20) + ', ' + (50 * localScale + (100 * localScale/4)*1.2 * Math.sin((i) * this.octagonAngle) -20) + ') scale(0.8)');
                    localNode.appendChild(iconDesign);
                    // Keep for assisting in future icon designs
                    //let squareHelper = this.tempSquare(i);
                    //squareHelper.setAttribute('transform', 'translate(' + (50 * localScale + (100 * localScale/4)*1.2 * Math.cos((i) * this.octagonAngle) - 20) + ', ' + (50 * localScale + (100 * localScale/4)*1.2 * Math.sin((i) * this.octagonAngle) - 20) + ') scale(0.8)');
                    //localNode.appendChild(squareHelper);
                } else if (i==6) {
                    iconDesign = this.closeIcon(i);
                    iconDesign.setAttribute('transform', 'translate(' + (50 * localScale + (100 * localScale/4)*1.2 * Math.cos((i) * this.octagonAngle) - 20) + ', ' + (50 * localScale + (100 * localScale/4)*1.2 * Math.sin((i) * this.octagonAngle) -20) + ') scale(0.8)');
                    localNode.appendChild(iconDesign);
                } else if (i==7) {
                    iconDesign = this.spannerIcon(i);
                    iconDesign.setAttribute('transform', 'translate(' + (50 * localScale + (100 * localScale/4)*1.2 * Math.cos((i) * this.octagonAngle) - 20) + ', ' + (50 * localScale + (100 * localScale/4)*1.2 * Math.sin((i) * this.octagonAngle) -20) + ') scale(0.8)');
                    localNode.appendChild(iconDesign);
                } else {
                  // Awaiting future icons
                }
            }
        }
    },

    // Cog tooth creation
    // --------------------
    cogTooth: function(localI, Xcenter, Ycenter, localSize, addOptions) {
        let cogTooth = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        let toothRadius = (localSize/4)*1.2;
        // Moves to start of tooth and builds path
        let buildTooth =  'M ' + (Xcenter + (toothRadius) * Math.cos((localI-0.3) * this.octagonAngle)) + ' ' + (Ycenter + (toothRadius) *  Math.sin((localI-0.3) * this.octagonAngle)) +
                          'L ' + (Xcenter + (toothRadius) * Math.cos((localI+0.3) * this.octagonAngle)) + ' ' + (Ycenter + (toothRadius) *  Math.sin((localI+0.3) * this.octagonAngle)) +
                          'L ' + (Xcenter + (toothRadius*1.2) * Math.cos((localI+0.20) * this.octagonAngle)) + ' ' + (Ycenter + (toothRadius*1.2) *  Math.sin((localI+0.20) * this.octagonAngle)) +
                          'L ' + (Xcenter + (toothRadius*1.2) * Math.cos((localI-0.20) * this.octagonAngle)) + ' ' + (Ycenter + (toothRadius*1.2) *  Math.sin((localI-0.20) * this.octagonAngle)) + ' Z';
        cogTooth.setAttribute('d', buildTooth);
        cogTooth.setAttribute('fill', 'grey');
        cogTooth.setAttribute('stroke','grey');
        cogTooth.style.strokeWidth = 1 * localSize/100 + 'px';
        return cogTooth;
    },


    // Temporary square for assistance in icon creation
    // ------------------------------------------------
    tempSquare: function(localI) {
        let temp = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        temp.setAttribute('x', '0');
        temp.setAttribute('y', '0');
        temp.setAttribute('width', '50');
        temp.setAttribute('height', '50');
        temp.setAttribute('rx', '1');
        temp.setAttribute('ry', '1');
        temp.setAttribute('stroke','rgb(89, 53, 20)');
        temp.setAttribute('fill', 'none');
        return temp;
    },

    // Speed icon design
    // -----------------
    speedIcon: function(localI) {
          let lightningBolt = document.createElementNS('http://www.w3.org/2000/svg', 'path');
          lightningBolt.setAttribute('class', 'icon' + localI);
          lightningBolt.setAttribute('d', 'M 23 5 L 38 5 L 28 21 L 38 21 L 18 45 L 25 28 L 16 28 L 23 5');
          lightningBolt.setAttribute('fill', 'gold');
          lightningBolt.setAttribute('stroke','gold');
          lightningBolt.style.strokeWidth = '1px';
          lightningBolt.style.strokeLinecap = 'round';
          return lightningBolt
    },

    // Spanner icon design
    // -----------------
    spannerIcon: function(localI) {
          let builtSpanner = document.createElementNS('http://www.w3.org/2000/svg', 'g');

          let spannerCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
          spannerCircle.setAttribute('class', 'icon' + localI);
          spannerCircle.setAttribute('cx', 34);
          spannerCircle.setAttribute('cy', 14);
          spannerCircle.setAttribute('r', 11);
          spannerCircle.setAttribute('fill', 'rgb(102, 102, 102)');
          spannerCircle.setAttribute('stroke','rgb(102, 102, 102)');
          spannerCircle.style.strokeWidth = '1px';
          spannerCircle.style.strokeLinecap = 'round';

          let spannerHandle = document.createElementNS('http://www.w3.org/2000/svg', 'path');
          spannerHandle.setAttribute('class', 'icon' + localI);
          spannerHandle.setAttribute('d', 'M 30 18 L 10 38');
          spannerHandle.setAttribute('fill', 'rgb(102, 102, 102)');
          spannerHandle.setAttribute('stroke','rgb(102, 102, 102)');
          spannerHandle.style.strokeWidth = '10px';
          spannerHandle.style.strokeLinecap = 'round';

          let spannerNut = document.createElementNS('http://www.w3.org/2000/svg', 'path');
          spannerNut.setAttribute('class', 'icon' + localI);
          spannerNut.setAttribute('d', 'M 39 8.25 L 36 11.25 L 36 12 L 36.75 12 L 39.75 9 Z');
          spannerNut.setAttribute('fill', 'darkgrey');
          spannerNut.setAttribute('stroke','darkgrey');
          spannerNut.style.strokeWidth = '10px';
          spannerNut.style.strokeLinecap = 'round';

          builtSpanner.appendChild(spannerCircle);
          builtSpanner.appendChild(spannerHandle);
          builtSpanner.appendChild(spannerNut);

          return builtSpanner
    },

    // Close icon design
    // -----------------
    closeIcon: function(localI) {
          let closeCross = document.createElementNS('http://www.w3.org/2000/svg', 'path');
          closeCross.setAttribute('class', 'icon' + localI);
          closeCross.setAttribute('d', 'M 15 15 L 35 35 M 15 35 L 35 15');
          closeCross.setAttribute('fill', 'black');
          closeCross.setAttribute('stroke','black');
          closeCross.style.strokeWidth = '10px';
          closeCross.style.strokeLinecap = 'round';
          return closeCross
    },

    // Empty icon design
    // -----------------
    emptyIcon: function(localI, localSize, Xcenter, Ycenter) {
        let iconResult = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        iconResult.setAttribute('class', 'icon' + localI);
        iconResult.setAttribute('cx',  (Xcenter + (localSize/4)*1.2 * Math.cos((localI) * this.octagonAngle)));
        iconResult.setAttribute('cy', (Ycenter + (localSize/4)*1.2 * Math.sin((localI) * this.octagonAngle)));
        iconResult.setAttribute('r', localSize/28);
        iconResult.setAttribute('fill', 'darkgrey');
        iconResult.setAttribute('stroke','lightgrey');
        iconResult.style.strokeWidth = 1 + 'px';
        iconResult.style.strokeLinecap = 'round';
        return iconResult;
    },


    // End turn icon circle
    // --------------------

    createTurnCircle: function(addOptions, localScale, localTop, localLeft, localNode, localClass) {
        let viewportSize = 100 * localScale;
        let endTurnButton = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        endTurnButton.setAttribute('class', localClass);
        endTurnButton.setAttribute('width', 100 * localScale);
        endTurnButton.setAttribute('height', 100 * localScale);
        endTurnButton.style.top = localTop + 'px';
        endTurnButton.style.left = localLeft + 'px';
        endTurnButton.setAttribute('viewBox', '0, 0, ' + viewportSize + ' ' + viewportSize);

        let turnCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        turnCircle.setAttribute('cx', 50 * localScale);
        turnCircle.setAttribute('cy', 50 * localScale);
        turnCircle.setAttribute('r', 32 * localScale);
        turnCircle.style.strokeWidth = 1*screenReduction + 'px';
        turnCircle.style.strokeLinecap = 'round';

        endTurnButton.appendChild(turnCircle);

        localNode.appendChild(endTurnButton);
    }
}
