    // ------------------------------------------------------------------------------------
    // SETTINGS AND OPTIONS
    // ------------------------------------------------------------------------------------

let settings = {

    // Constants
    // ---------
    octagonAngle: (2 * Math.PI) / 8,

    optionsArray: [
                  { variable: 'speed', active: 'fast', options: [{text: 'slow', active: false, constant: 1.5}, {text: 'medium', active: false, constant: 1}, {text: 'fast', active: true, constant: 0.5}] },
                  { variable: 'dev', options: [{text: 'workflow', active: false}, {text: 'arrays', active: false}, {text: 'transitions', active: false}] },
                  ],


    // Settings setup
    // ---------------------------------
    setup: function() {
        this.launchTime = Date.now();
        this.arrayFlow = this.optionsArray[1].options[1].active;
        this.transitionMonitor = this.optionsArray[1].options[2].active;
        this.workFlow = this.optionsArray[1].options[0].active;
        let gameSpeedRef = this.optionsArray[0].options.findIndex(item => item.active == true);
        this.gameSpeed = this.optionsArray[0].options[gameSpeedRef].constant;

    },

    // Settings graphics setup
    // ---------------------------------
    addSettingsCog: function(surroundSize, mapWidth, screenReduction) {
        this.mapWidth = mapWidth;
        // Create icon
        this.icon = document.querySelector('.settingsmark');
        this.icon.appendChild(this.createSettingsCog(0.6*surroundSize/100, 0, 0.15*surroundSize, 'icon_holder'));
        // Settings pop up cog
        this.popup = document.querySelector('.settings_popup');
        this.popup.appendChild(this.createSettingsCog(mapWidth*12/2000, -50*screenReduction, mapWidth*4/20, 'popup_cog'));
        this.popup.appendChild(this.createSettingsPanel(mapWidth*12/2000, -50*screenReduction, mapWidth*4/20, 'popup_panel'));
        // Panel circle
        this.popupCog = document.querySelector('.popup_cog');
        this.popupCog.appendChild(this.panelCircle(mapWidth*12/2000));
        // Settings icons
        for (let i = 0; i < 8; i+=1) {
            this.popupCog.appendChild(this.createEmptyIcon(i, mapWidth*12/2000));
            let icon = this.createSettingsIcon(i, mapWidth*12/2000);
            if (icon[0] === true) {
                this.popupCog.appendChild(icon[1]);
            }
        }
        // Panel for text
        this.panel = document.querySelector('.popup_panel');
    },

    // Creating settings icons
    // -----------------------
    addCogListeners: function() {
        this.icon.addEventListener('click', () => {
            this.popup.style.display = 'block';
            this.popupCog.style.display = 'block';
            this.panel.appendChild(this.panelText(this.mapWidth*12/2000, 23, 'Select an icon.', 'Or click x to close settings.'));
            // Event handler for settings pop up once launched
            window.addEventListener('click', this.popRunClose);
        });
    },

    popRunClose: function(e) {
        if (e.target === settings.popup) {
            settings.clearPanel();
            settings.popup.style.display = 'none';
            window.removeEventListener('click', this.popRunClose);
        } else {
            settings.manageSettings(e, settings.mapWidth*12/2000);
        }
    },

    // Event handling for settings popup
    // ---------------------------------
    manageSettings: function(e, scale) {
        // Speed icon
        if (e.target.classList.contains('icon5')) {
            this.clearPanel();
            this.speedPanel(scale);
        // Speed panel
        } else if (e.target.classList.contains('speed')) {
            let indexCurrent = this.optionsArray[0].options.findIndex(item => item.active == true);
            let indexNew = this.optionsArray[0].options.findIndex(item => item.text == e.target.classList.item(1));
            if (indexNew != indexCurrent) {
            // Updates options array and global speed variable
                this.optionsArray[0].options[indexCurrent].active = false;
                this.optionsArray[0].options[indexNew].active = true;
                this.gameSpeed = this.optionsArray[0].options[indexNew].constant;
                // Resets and recreates speed panel
                this.clearPanel();
                this.speedPanel(scale);
            }
        // Close icon
        } else if (e.target.classList.contains('icon6')) {
            this.clearPanel();
            this.popup.style.display = 'none';
            window.removeEventListener('click', this.popRunClose);
        } else if (e.target.classList.contains('icon7')) {
          this.clearPanel();
          this.devPanel(scale);
        } else if (e.target.classList.contains('dev')) {
            indexNew = this.optionsArray[1].options.findIndex(item => item.text == e.target.classList.item(1));
            this.optionsArray[1].options[indexNew].active = !this.optionsArray[1].options[indexNew].active;
            settings.workFlow = this.optionsArray[1].options[0].active;
            settings.arrayFlow = this.optionsArray[1].options[1].active;
            settings.transitionMonitor = this.optionsArray[1].options[2].active;
            this.clearPanel();
            this.devPanel(scale);
        }
    },

    // Setting up the speed panel
    // -------------------------------
    speedPanel: function(scale) {
        // Icon at top of panel
        headerIcon = this.panel.appendChild(this.speedIcon(7));
        headerIcon.setAttribute('transform', 'translate(' + (25 * scale - 25*1) + ', ' + (1 * scale) + ') scale(1)');
        // Panel text
        this.panel.appendChild(this.panelText(this.mapWidth*(12/2000), 14, 'Select speed', 'for game movement.'));
        // Panel buttons - make into a loop?
        slowRect = this.panel.appendChild(this.optionBox(scale, this.optionsArray[0].options[0], this.optionsArray[0].variable, 12));
        slowRect.setAttribute('transform', 'translate(' + (10 * scale - 6 * scale) + ', ' + (25 * scale - 2 * scale) + ')');
        mediumRect = this.panel.appendChild(this.optionBox(scale, this.optionsArray[0].options[1], this.optionsArray[0].variable, 12));
        mediumRect.setAttribute('transform', 'translate(' + (25 * scale - 6 * scale) + ', ' + (25 * scale - 2 * scale) + ')');
        fastRect = this.panel.appendChild(this.optionBox(scale, this.optionsArray[0].options[2], this.optionsArray[0].variable, 12));
        fastRect.setAttribute('transform', 'translate(' + (40 * scale - 6 * scale) + ', ' + (25 * scale - 2 * scale) + ')');
    },

    // Setting up the developer panel
    // -------------------------------
    devPanel: function(scale) {
        // Icon at top of panel
        headerIcon = this.panel.appendChild(this.spannerIcon(5));
        headerIcon.setAttribute('transform', 'translate(' + (25 * scale - 25*1) + ', ' + (1 * scale) + ') scale(1)');
        // Panel text
        this.panel.appendChild(this.panelText(this.mapWidth*(12/2000), 14, 'Select elements', 'to monitor.'));
        // Panel buttons - make into a loop?
        settings.workFlowCheck = this.panel.appendChild(this.optionBox(scale, this.optionsArray[1].options[0], this.optionsArray[1].variable, 18));
        settings.workFlowCheck.setAttribute('transform', 'translate(' + (25 * scale - 9 * scale) + ', ' + (25 * scale - 2 * scale) + ')');
        arrayCheck = this.panel.appendChild(this.optionBox(scale, this.optionsArray[1].options[1], this.optionsArray[1].variable, 18));
        arrayCheck.setAttribute('transform', 'translate(' + (25 * scale - 9 * scale) + ', ' + (32 * scale - 2 * scale) + ')');
        transitionsCheck = this.panel.appendChild(this.optionBox(scale, this.optionsArray[1].options[2], this.optionsArray[1].variable, 18));
        transitionsCheck.setAttribute('transform', 'translate(' + (25 * scale - 9 * scale) + ', ' + (39 * scale - 2 * scale) + ')');

    },

    // A single option box on a settings panel
    // ---------------------------------------
    optionBox: function(scale, localOptions, localVariable, boxWidth) {
        let boxGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        boxGroup.setAttribute('class', localVariable + ' ' + localOptions.text);

        let box = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        box.setAttribute('class', localVariable + ' ' + localOptions.text);
        box.setAttribute('x', '0');
        box.setAttribute('y', '0');
        box.setAttribute('width', boxWidth * scale);
        box.setAttribute('height', 5 * scale);
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
        textHolder.setAttribute('x', boxWidth/2 * scale);
        textHolder.setAttribute('y', 3.2 * scale);
        textHolder.setAttribute('font-weight', 'normal');
        textHolder.setAttribute('font-size', (scale * 2.6 ) + 'px');
        textHolder.setAttribute('text-anchor', 'middle');
        let words = document.createTextNode(localOptions.text);
        textHolder.appendChild(words);

        boxGroup.appendChild(box);
        boxGroup.appendChild(textHolder);
        return boxGroup;
    },


    // Settings panel set up
    // ---------------------
    createSettingsPanel: function(scale, top, left, className) {
        let viewportSize = 50 * scale;
        let settingsPanel = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        settingsPanel.setAttribute('width', 38 * scale);
        settingsPanel.setAttribute('height', 38 * scale);
        settingsPanel.style.top = (31 * scale + top)  + 'px';
        settingsPanel.style.left = (31 * scale + left) + 'px';
        settingsPanel.setAttribute('viewBox', '0, 0, ' + viewportSize + ' ' + viewportSize);
        settingsPanel.setAttribute('class', className);
        return settingsPanel;
    },

    // Settings panel circle
    // ---------------------
    panelCircle: function(scale) {
        let panelCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        panelCircle.setAttribute('cx',  50 * scale);
        panelCircle.setAttribute('cy', 50 * scale);
        panelCircle.setAttribute('r', 20 * scale - 1);
        panelCircle.setAttribute('fill', 'darkgrey');
        panelCircle.setAttribute('stroke','lightgrey');
        panelCircle.style.strokeWidth = '1px';
        panelCircle.style.strokeLinecap = 'round';
        return panelCircle;
    },

    // Text for settings panel
    // -----------------------
    panelText: function(scale, localY, firstSentence, secondSentence) {
        let panelText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        let firstLine = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
        let secondLine = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
        let firstLineText = document.createTextNode(firstSentence);
        let secondLineText = document.createTextNode(secondSentence);
        panelText.setAttribute('font-size', (scale * 2.6  ) + 'px');
        panelText.setAttribute('stroke', 'black');
        panelText.setAttribute('font-weight', 'normal');
        panelText.setAttribute('text-anchor', 'middle');
        panelText.setAttribute('x', 25 * scale);
        panelText.setAttribute('y', localY * scale);
        secondLine.setAttribute('x', 25 * scale);
        secondLine.setAttribute('dy', 4 * scale);

        firstLine.appendChild(firstLineText);
        secondLine.appendChild(secondLineText);
        panelText.appendChild(firstLine);
        panelText.appendChild(secondLine);
        return panelText;
    },

    // Method to clear settings panel
    // ------------------------------
    clearPanel: function() {
        while (this.panel.firstChild) {
            this.panel.removeChild(this.panel.firstChild);
        }
    },

    // Settings cog graphics
    // --------------------
    createSettingsCog: function(scale, top, left, className) {
        let viewportSize = 100 * scale;
        let settingsCog = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        settingsCog.setAttribute('class', className);
        settingsCog.setAttribute('width', 100 * scale);
        settingsCog.setAttribute('height', 100 * scale);
        settingsCog.style.top = top + 'px';
        settingsCog.style.left = left + 'px';
        settingsCog.setAttribute('viewBox', '0, 0, ' + viewportSize + ' ' + viewportSize);

        let cogCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        cogCircle.setAttribute('cx',  50 * scale);
        cogCircle.setAttribute('cy', 50 * scale);
        cogCircle.setAttribute('r', 25 * scale);
        cogCircle.setAttribute('fill', 'none');
        cogCircle.setAttribute('stroke','grey');
        cogCircle.style.strokeWidth = 10 * scale + 'px';
        cogCircle.style.strokeLinecap = 'round';

        settingsCog.appendChild(cogCircle);

        // Adding teeth for cog
        for (let i = 0; i < 8; i+=1) {
            settingsCog.appendChild(this.cogTooth(i, 50 * scale, 50 * scale, 100 * scale));
        }
        return settingsCog;
    },

    // Cog tooth creation
    // --------------------
    cogTooth: function(tooth, Xcenter, Ycenter, size) {
        let cogTooth = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        let toothRadius = size/4*1.2;
        // Moves to start of tooth and builds path
        let buildTooth =  'M ' + (Xcenter + (toothRadius) * Math.cos((tooth-0.3) * this.octagonAngle)) + ' ' + (Ycenter + (toothRadius) *  Math.sin((tooth-0.3) * this.octagonAngle)) +
                          'L ' + (Xcenter + (toothRadius) * Math.cos((tooth+0.3) * this.octagonAngle)) + ' ' + (Ycenter + (toothRadius) *  Math.sin((tooth+0.3) * this.octagonAngle)) +
                          'L ' + (Xcenter + (toothRadius*1.2) * Math.cos((tooth+0.20) * this.octagonAngle)) + ' ' + (Ycenter + (toothRadius*1.2) *  Math.sin((tooth+0.20) * this.octagonAngle)) +
                          'L ' + (Xcenter + (toothRadius*1.2) * Math.cos((tooth-0.20) * this.octagonAngle)) + ' ' + (Ycenter + (toothRadius*1.2) *  Math.sin((tooth-0.20) * this.octagonAngle)) + ' Z';
        cogTooth.setAttribute('d', buildTooth);
        cogTooth.setAttribute('fill', 'grey');
        cogTooth.setAttribute('stroke','grey');
        cogTooth.style.strokeWidth = 1 * size/100 + 'px';
        return cogTooth;
    },

    // Creating settings icons
    // -----------------------
    createEmptyIcon: function(i, scale) {
        return this.emptyIcon(i, 100 * scale, 50 * scale, 50 * scale);
    },

    // Creating settings icons
    // -----------------------
    createSettingsIcon: function(i, scale) {
        let iconProduced = false;
        let iconDesign = null;
        if (i===5) {
            iconDesign = this.speedIcon(i);
            iconDesign.setAttribute('transform', 'translate(' + (50 * scale + (100 * scale/4)*1.2 * Math.cos((i) * this.octagonAngle) - 20) + ', ' + (50 * scale + (100 * scale/4)*1.2 * Math.sin((i) * this.octagonAngle) -20) + ') scale(0.8)');
            iconProduced = true;
        } else if (i===6) {
            iconDesign = this.closeIcon(i);
            iconDesign.setAttribute('transform', 'translate(' + (50 * scale + (100 * scale/4)*1.2 * Math.cos((i) * this.octagonAngle) - 20) + ', ' + (50 * scale + (100 * scale/4)*1.2 * Math.sin((i) * this.octagonAngle) -20) + ') scale(0.8)');
            iconProduced = true;
        } else if (i===7) {
            iconDesign = this.spannerIcon(i);
            iconDesign.setAttribute('transform', 'translate(' + (50 * scale + (100 * scale/4)*1.2 * Math.cos((i) * this.octagonAngle) - 20) + ', ' + (50 * scale + (100 * scale/4)*1.2 * Math.sin((i) * this.octagonAngle) -20) + ') scale(0.8)');
            iconProduced = true;
        } else {
          // Awaiting future icons
        }
        return [iconProduced, iconDesign];
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
}
