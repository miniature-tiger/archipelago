// Game management object
// A very basic starting point just allowing simple rotation of turns

let gameManagement = {

    // Constants
    // ---------
    octagonAngle: (2 * Math.PI) / 8,

    // List of teams
    // -------------
    // Future update: set up based on user inputs for number of players and player names
    teamArray: ['Green Team', 'Blue Team', 'Red Team', 'Orange Team'],
    //teamArray: ['Green Team', 'Blue Team', 'Red Team', 'Orange Team', 'Pirate'],

    // Current turn
    // ------------
    // Future update: initialise first go randomly
    turn: 'Green Team',


    // Method to activate next turn
    // ----------------------------
    nextTurn: function() {
        this.turn = this.teamArray[(this.teamArray.indexOf(this.turn)+1) % (this.teamArray.length)];
    },

    // Settings and options
    // --------------------
    optionsArray: [ {variable: 'speed', active: 'medium', options: [{text: 'slow', active: true, constant: 1.5}, {text: 'medium', active: false, constant: 1}, {text: 'fast', active: false, constant: 0.6}]}, ],

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
        }
    },

    // Setting up the speed panel
    // -------------------------------
    speedPanel: function(localScale) {
        // Icon at top of panel
        headerIcon = settingsPanel.appendChild(this.speedIcon(5));
        headerIcon.setAttribute('transform', 'translate(' + (25 * localScale - 25*1) + ', ' + (1 * localScale) + ') scale(1)');
        // Panel text
        settingsPanel.appendChild(this.panelText(screenWidth*(12/2000), 14, 'Select speed', 'for game movement.'));
        // Panel buttons - make into a loop?
        slowRect = settingsPanel.appendChild(this.optionBox(localScale, this.optionsArray[0].options[0], this.optionsArray[0].variable));
        slowRect.setAttribute('transform', 'translate(' + (10 * localScale - 6 * localScale) + ', ' + (25 * localScale - 2 * localScale) + ')');
        mediumRect = settingsPanel.appendChild(this.optionBox(localScale, this.optionsArray[0].options[1], this.optionsArray[0].variable));
        mediumRect.setAttribute('transform', 'translate(' + (25 * localScale - 6 * localScale) + ', ' + (25 * localScale - 2 * localScale) + ')');
        fastRect = settingsPanel.appendChild(this.optionBox(localScale, this.optionsArray[0].options[2], this.optionsArray[0].variable));
        fastRect.setAttribute('transform', 'translate(' + (40 * localScale - 6 * localScale) + ', ' + (25 * localScale - 2 * localScale) + ')');
    },

    // A single option box on a settings panel
    // ---------------------------------------
    optionBox: function(localScale, localOptions, localVariable) {
        let boxGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        boxGroup.setAttribute('class', localVariable + ' ' + localOptions.text);

        let box = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        box.setAttribute('class', localVariable + ' ' + localOptions.text);
        box.setAttribute('x', '0');
        box.setAttribute('y', '0');
        box.setAttribute('width', 12 * localScale);
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
        textHolder.setAttribute('x', 6 * localScale);
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
                    //settingsCog.appendChild(squareHelper);
                } else if (i==6) {
                    iconDesign = this.closeIcon(i);
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
}
